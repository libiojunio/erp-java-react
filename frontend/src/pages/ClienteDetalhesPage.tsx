import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Chip,
  Alert,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  MenuItem,
  CircularProgress,
  Snackbar,
  Tabs,
  Tab,
  Card,
  CardContent,
  CardHeader,
  ToggleButtonGroup,
  ToggleButton,
  Slide,
  SlideProps,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import BlockIcon from '@mui/icons-material/Block';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import AddIcon from '@mui/icons-material/Add';
import PersonIcon from '@mui/icons-material/Person';
import BusinessIcon from '@mui/icons-material/Business';
import HomeIcon from '@mui/icons-material/Home';
import ContactPhoneIcon from '@mui/icons-material/ContactPhone';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api';
import { FileUploadDropzone, ArquivoInfo } from '../components/common/FileUploadDropzone';
import { CampoVisualizacao } from '../components/common/CampoVisualizacao';
import {
  ESTADOS_BR,
  formatarCpf,
  formatarCnpj,
  formatarCep,
  formatarTelefone,
  validarCpf,
  validarCnpj,
  limparDigitos,
} from '../utils/documentos';

function SlideTransition(props: SlideProps) {
  return <Slide {...props} direction="left" />;
}

interface EnderecoForm {
  id?: number;
  tipo: string;
  cep: string;
  logradouro: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  uf: string;
}

interface ContatoForm {
  id?: number;
  nome: string;
  cargo: string;
  email: string;
  telefone: string;
}

interface ClienteForm {
  tipoPessoa: 'PF' | 'PJ';
  documento: string;
  nomeRazaoSocial: string;
  nomeFantasia: string;
  inscricaoEstadual: string;
  dataNascimento: string;
  email: string;
  telefone: string;
  arquivoId?: number | null;
  arquivo?: ArquivoInfo | null;
  enderecos: EnderecoForm[];
  contatos: ContatoForm[];
}

const formVazio: ClienteForm = {
  tipoPessoa: 'PJ',
  documento: '',
  nomeRazaoSocial: '',
  nomeFantasia: '',
  inscricaoEstadual: '',
  dataNascimento: '',
  email: '',
  telefone: '',
  arquivoId: null,
  arquivo: null,
  enderecos: [
    {
      tipo: 'PRINCIPAL',
      cep: '',
      logradouro: '',
      numero: '',
      complemento: '',
      bairro: '',
      cidade: '',
      uf: 'SP',
    },
  ],
  contatos: [],
};

export const ClienteDetalhesPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();

  // Determinar modo pela rota: /clientes/visualizar/:id, /clientes/editar/:id, /clientes/novo
  const isNovo = location.pathname.includes('/clientes/novo');
  const isEdicao = location.pathname.includes('/clientes/editar/');
  const isVisualizacao = !isNovo && !isEdicao;

  const [abaAtiva, setAbaAtiva] = useState(0);
  const [carregando, setCarregando] = useState(false);
  const [situacaoCliente, setSituacaoCliente] = useState<string>('ATIVO');
  const [formData, setFormData] = useState<ClienteForm>(formVazio);
  const [initialFormData, setInitialFormData] = useState<ClienteForm | null>(null);
  const [formErro, setFormErro] = useState<string | null>(null);
  const [confirmInativarOpen, setConfirmInativarOpen] = useState(false);

  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });

  // Carregar dados do cliente quando houver ID
  useEffect(() => {
    if (isNovo) {
      setFormData(formVazio);
      setInitialFormData(JSON.parse(JSON.stringify(formVazio)));
      setSituacaoCliente('ATIVO');
      setFormErro(null);
      return;
    }

    if (id) {
      setCarregando(true);
      setFormErro(null);
      api
        .get(`/clientes/${id}`)
        .then((res) => {
          const cliente = res.data?.dados;
          if (cliente) {
            setSituacaoCliente(cliente.situacao || 'ATIVO');
            const tipo = cliente.tipoPessoa === 'PF' ? 'PF' : 'PJ';
            const docFormatado =
              tipo === 'PF'
                ? formatarCpf(cliente.documento || '')
                : formatarCnpj(cliente.documento || '');
            const dataNasc = cliente.dataNascimento ? cliente.dataNascimento.substring(0, 10) : '';

            const loadedForm: ClienteForm = {
              tipoPessoa: tipo,
              documento: docFormatado,
              nomeRazaoSocial: cliente.nomeRazaoSocial || '',
              nomeFantasia: cliente.nomeFantasia || '',
              inscricaoEstadual: cliente.inscricaoEstadual || '',
              dataNascimento: dataNasc,
              email: cliente.email || '',
              telefone: formatarTelefone(cliente.telefone || ''),
              arquivoId: cliente.arquivoId || null,
              arquivo: cliente.arquivo || null,
              enderecos: (cliente.enderecos || []).map((end: any) => ({
                id: end.id,
                tipo: end.tipo || 'PRINCIPAL',
                cep: formatarCep(end.cep || ''),
                logradouro: end.logradouro || '',
                numero: end.numero || '',
                complemento: end.complemento || '',
                bairro: end.bairro || '',
                cidade: end.cidade || '',
                uf: end.uf || 'SP',
              })),
              contatos: (cliente.contatos || []).map((cto: any) => ({
                id: cto.id,
                nome: cto.nome || '',
                cargo: cto.cargo || '',
                email: cto.email || '',
                telefone: formatarTelefone(cto.telefone || ''),
              })),
            };

            setFormData(loadedForm);
            setInitialFormData(JSON.parse(JSON.stringify(loadedForm)));
          }
        })
        .catch((err) => {
          setFormErro(err.response?.data?.mensagem || 'Erro ao carregar dados do cliente.');
        })
        .finally(() => {
          setCarregando(false);
        });
    }
  }, [id, isNovo]);

  // Manipulação de Endereços
  const handleAdicionarEndereco = () => {
    const novoTipo = formData.enderecos.some((e) => e.tipo === 'PRINCIPAL') ? 'COBRANCA' : 'PRINCIPAL';
    setFormData((prev) => ({
      ...prev,
      enderecos: [
        ...prev.enderecos,
        {
          tipo: novoTipo,
          cep: '',
          logradouro: '',
          numero: '',
          complemento: '',
          bairro: '',
          cidade: '',
          uf: 'SP',
        },
      ],
    }));
  };

  const handleRemoverEndereco = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      enderecos: prev.enderecos.filter((_, i) => i !== index),
    }));
  };

  const handleAtualizarEndereco = (index: number, campo: keyof EnderecoForm, valor: string) => {
    setFormData((prev) => {
      const novos = [...prev.enderecos];
      novos[index] = { ...novos[index], [campo]: valor };
      return { ...prev, enderecos: novos };
    });
  };

  // Busca de CEP no ViaCEP
  const handleBuscarCep = async (index: number, cepDigitado: string) => {
    const cepLimpo = limparDigitos(cepDigitado);
    if (cepLimpo.length !== 8) return;

    try {
      const res = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
      const dados = await res.json();
      if (!dados.erro) {
        setFormData((prev) => {
          const novos = [...prev.enderecos];
          novos[index] = {
            ...novos[index],
            logradouro: dados.logradouro || novos[index].logradouro,
            bairro: dados.bairro || novos[index].bairro,
            cidade: dados.localidade || novos[index].cidade,
            uf: dados.uf || novos[index].uf,
          };
          return { ...prev, enderecos: novos };
        });
      }
    } catch (err) {
      console.warn('Não foi possível autocompletar o CEP via ViaCEP:', err);
    }
  };

  // Manipulação de Contatos
  const handleAdicionarContato = () => {
    setFormData((prev) => ({
      ...prev,
      contatos: [
        ...prev.contatos,
        {
          nome: '',
          cargo: '',
          email: '',
          telefone: '',
        },
      ],
    }));
  };

  const handleRemoverContato = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      contatos: prev.contatos.filter((_, i) => i !== index),
    }));
  };

  const handleAtualizarContato = (index: number, campo: keyof ContatoForm, valor: string) => {
    setFormData((prev) => {
      const novos = [...prev.contatos];
      novos[index] = { ...novos[index], [campo]: valor };
      return { ...prev, contatos: novos };
    });
  };

  // Verificação de modificação do formulário
  const isModified = useMemo(() => {
    if (!initialFormData) return false;
    return JSON.stringify(formData) !== JSON.stringify(initialFormData);
  }, [formData, initialFormData]);

  // Validação do Documento em tempo real
  const documentoInvalido = useMemo(() => {
    const docLimpo = limparDigitos(formData.documento);
    if (!docLimpo) return false;
    if (formData.tipoPessoa === 'PF') {
      return docLimpo.length === 11 && !validarCpf(docLimpo);
    } else {
      return docLimpo.length === 14 && !validarCnpj(docLimpo);
    }
  }, [formData.documento, formData.tipoPessoa]);

  // Validação geral para habilitar o botão Salvar
  const formularioValido = useMemo(() => {
    if (!formData.nomeRazaoSocial.trim()) return false;
    const docLimpo = limparDigitos(formData.documento);
    if (formData.tipoPessoa === 'PF') {
      if (docLimpo.length !== 11 || !validarCpf(docLimpo)) return false;
    } else {
      if (docLimpo.length !== 14 || !validarCnpj(docLimpo)) return false;
    }

    if (formData.enderecos.length > 0) {
      const temPrincipal = formData.enderecos.some((e) => e.tipo === 'PRINCIPAL');
      if (!temPrincipal) return false;

      for (const end of formData.enderecos) {
        if (
          !end.cep.trim() ||
          !end.logradouro.trim() ||
          !end.numero.trim() ||
          !end.bairro.trim() ||
          !end.cidade.trim() ||
          !end.uf.trim()
        ) {
          return false;
        }
      }
    }

    for (const cto of formData.contatos) {
      if (!cto.nome.trim()) return false;
    }

    return true;
  }, [formData]);

  // Mutação para Salvar Cliente
  const salvarMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        tipoPessoa: formData.tipoPessoa,
        documento: limparDigitos(formData.documento),
        nomeRazaoSocial: formData.nomeRazaoSocial.trim(),
        nomeFantasia: formData.nomeFantasia.trim() || null,
        inscricaoEstadual: formData.inscricaoEstadual.trim() || null,
        dataNascimento: formData.dataNascimento || null,
        email: formData.email.trim() || null,
        telefone: limparDigitos(formData.telefone) || null,
        arquivoId: formData.arquivoId,
        enderecos: formData.enderecos.map((end) => ({
          ...end,
          cep: limparDigitos(end.cep),
        })),
        contatos: formData.contatos.map((cto) => ({
          ...cto,
          telefone: limparDigitos(cto.telefone),
        })),
      };

      if (!isNovo && id) {
        const res = await api.put(`/clientes/${id}`, payload);
        return res.data;
      } else {
        const res = await api.post('/clientes', payload);
        return res.data;
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['clientes'] });
      const clienteSalvoId = data.dados?.id || id;

      setSnackbar({
        open: true,
        message: data.mensagem || (isNovo ? 'Cliente cadastrado com sucesso!' : 'Cliente atualizado com sucesso!'),
        severity: 'success',
      });

      // Substituir a rota para visualização: se o usuário clicar em Voltar, volta para a rota anterior à edição
      navigate(`/clientes/visualizar/${clienteSalvoId}`, { replace: true });
    },
    onError: (err: any) => {
      const msg = err.response?.data?.mensagem || 'Erro ao salvar o cliente. Verifique os dados informados.';
      setFormErro(msg);
    },
  });

  // Mutação para inativação / reativação lógica
  const situacaoMutation = useMutation({
    mutationFn: async ({ novoStatus }: { novoStatus: 'ATIVO' | 'INATIVO' }) => {
      const res = await api.patch(`/clientes/${id}/situacao`, { situacao: novoStatus });
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['clientes'] });
      setConfirmInativarOpen(false);
      const novoStatus = situacaoCliente === 'ATIVO' ? 'INATIVO' : 'ATIVO';
      setSituacaoCliente(novoStatus);
      setSnackbar({
        open: true,
        message: data.mensagem || 'Situação do cliente alterada com sucesso!',
        severity: 'success',
      });
    },
    onError: (err: any) => {
      const msg = err.response?.data?.mensagem || 'Erro ao alterar situação do cliente.';
      setSnackbar({ open: true, message: msg, severity: 'error' });
    },
  });

  // Título da página
  let tituloPagina = 'Novo Cadastro de Cliente';
  if (!isNovo) {
    const nomeExibicao = formData.nomeFantasia || formData.nomeRazaoSocial || `Cliente #${id}`;
    tituloPagina = isVisualizacao ? `Visualizando: ${nomeExibicao}` : `Alterando: ${nomeExibicao}`;
  }

  // Preview de Anexo
  let previewAnexoCliente = (
    <Typography variant="body2" color="text.secondary">
      Nenhum anexo vinculado
    </Typography>
  );
  if (formData.arquivo) {
    previewAnexoCliente = (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography variant="body2" sx={{ fontWeight: 600 }}>
          {formData.arquivo.nome} ({formData.arquivo.extensao.toUpperCase()})
        </Typography>
        <Button
          size="small"
          variant="text"
          onClick={() => window.open('/api/arquivos/' + formData.arquivo!.id + '/conteudo', '_blank')}
        >
          Visualizar arquivo
        </Button>
      </Box>
    );
  }

  if (carregando) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 300 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {/* Cabeçalho da Página */}
      <Paper sx={{ p: 2.5, mb: 3 }} elevation={1}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <IconButton color="primary" onClick={() => navigate('/clientes')} title="Voltar para Clientes">
              <ArrowBackIcon />
            </IconButton>
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                  {tituloPagina}
                </Typography>
                {!isNovo && (
                  <Chip
                    label={situacaoCliente}
                    size="small"
                    color={situacaoCliente === 'ATIVO' ? 'success' : 'default'}
                    sx={{ fontWeight: 700 }}
                  />
                )}
              </Box>
              <Typography variant="body2" color="text.secondary">
                {isVisualizacao
                  ? 'Ficha cadastral completa do cliente'
                  : isEdicao
                  ? 'Atualização dos dados cadastrais do cliente'
                  : 'Preencha os campos para cadastrar um novo cliente'}
              </Typography>
            </Box>
          </Box>

          {/* Botões do Topo / Ações Rápidas */}
          <Box sx={{ display: 'flex', gap: 1 }}>
            {isVisualizacao && (
              <>
                <Button
                  variant="outlined"
                  color={situacaoCliente === 'ATIVO' ? 'warning' : 'success'}
                  startIcon={situacaoCliente === 'ATIVO' ? <BlockIcon /> : <CheckCircleOutlineIcon />}
                  onClick={() => setConfirmInativarOpen(true)}
                >
                  {situacaoCliente === 'ATIVO' ? 'Inativar cliente' : 'Reativar cliente'}
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<EditIcon />}
                  onClick={() => navigate(`/clientes/editar/${id}`)}
                >
                  Alterar
                </Button>
              </>
            )}
            {isEdicao && (
              <>
                <Button
                  variant="outlined"
                  onClick={() => {
                    if (initialFormData) {
                      setFormData(JSON.parse(JSON.stringify(initialFormData)));
                    }
                    navigate(`/clientes/visualizar/${id}`);
                  }}
                  disabled={salvarMutation.isPending}
                >
                  Cancelar
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => salvarMutation.mutate()}
                  disabled={salvarMutation.isPending || !isModified || !formularioValido}
                >
                  {salvarMutation.isPending ? <CircularProgress size={24} color="inherit" /> : 'Salvar Cliente'}
                </Button>
              </>
            )}
            {isNovo && (
              <>
                <Button variant="outlined" onClick={() => navigate('/clientes')} disabled={salvarMutation.isPending}>
                  Cancelar
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => salvarMutation.mutate()}
                  disabled={salvarMutation.isPending || !formularioValido}
                >
                  {salvarMutation.isPending ? <CircularProgress size={24} color="inherit" /> : 'Salvar Cliente'}
                </Button>
              </>
            )}
          </Box>
        </Box>
      </Paper>

      {/* Card Principal com Abas */}
      <Paper sx={{ mb: 3 }} elevation={1}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 3, pt: 1 }}>
          <Tabs value={abaAtiva} onChange={(_, val) => setAbaAtiva(val)}>
            <Tab icon={<PersonIcon />} iconPosition="start" label="Dados Gerais" />
            <Tab icon={<HomeIcon />} iconPosition="start" label={`Endereços (${formData.enderecos.length})`} />
            <Tab icon={<ContactPhoneIcon />} iconPosition="start" label={`Contatos (${formData.contatos.length})`} />
          </Tabs>
        </Box>

        <Box sx={{ p: 3 }}>
          {formErro && (
            <Alert severity="error" sx={{ mb: 2.5 }} onClose={() => setFormErro(null)}>
              {formErro}
            </Alert>
          )}

          {/* ABA 0: DADOS GERAIS */}
          {abaAtiva === 0 && (
            <Grid container spacing={2}>
              <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                {isVisualizacao && (
                  <CampoVisualizacao
                    label="Tipo de Pessoa"
                    valor={formData.tipoPessoa === 'PF' ? 'Pessoa Física (PF)' : 'Pessoa Jurídica (PJ)'}
                  />
                )}
                {!isVisualizacao && (
                  <>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                      Tipo de Pessoa:
                    </Typography>
                    <ToggleButtonGroup
                      value={formData.tipoPessoa}
                      exclusive
                      size="small"
                      disabled={salvarMutation.isPending}
                      onChange={(_, val) => {
                        if (val) {
                          setFormData((prev) => ({
                            ...prev,
                            tipoPessoa: val,
                            documento: '',
                          }));
                        }
                      }}
                    >
                      <ToggleButton value="PJ">
                        <BusinessIcon sx={{ mr: 0.5, fontSize: 18 }} /> Pessoa Jurídica (PJ)
                      </ToggleButton>
                      <ToggleButton value="PF">
                        <PersonIcon sx={{ mr: 0.5, fontSize: 18 }} /> Pessoa Física (PF)
                      </ToggleButton>
                    </ToggleButtonGroup>
                  </>
                )}
              </Grid>

              <Grid item xs={12} sm={6}>
                {isVisualizacao && (
                  <CampoVisualizacao
                    label={formData.tipoPessoa === 'PF' ? 'CPF' : 'CNPJ'}
                    valor={formData.documento}
                  />
                )}
                {!isVisualizacao && (
                  <TextField
                    fullWidth
                    required
                    label={formData.tipoPessoa === 'PF' ? 'CPF' : 'CNPJ'}
                    value={formData.documento}
                    error={documentoInvalido}
                    disabled={salvarMutation.isPending}
                    helperText={
                      documentoInvalido
                        ? `${formData.tipoPessoa === 'PF' ? 'CPF' : 'CNPJ'} inválido`
                        : 'Apenas números ou formato padrão'
                    }
                    onChange={(e) => {
                      const masked =
                        formData.tipoPessoa === 'PF'
                          ? formatarCpf(e.target.value)
                          : formatarCnpj(e.target.value);
                      setFormData({ ...formData, documento: masked });
                    }}
                  />
                )}
              </Grid>

              <Grid item xs={12} sm={6}>
                {isVisualizacao && formData.tipoPessoa === 'PF' && (
                  <CampoVisualizacao label="Data de Nascimento" valor={formData.dataNascimento} />
                )}
                {isVisualizacao && formData.tipoPessoa !== 'PF' && (
                  <CampoVisualizacao label="Inscrição Estadual (IE)" valor={formData.inscricaoEstadual} />
                )}
                {!isVisualizacao && formData.tipoPessoa === 'PF' && (
                  <TextField
                    fullWidth
                    label="Data de Nascimento"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    value={formData.dataNascimento}
                    disabled={salvarMutation.isPending}
                    onChange={(e) => setFormData({ ...formData, dataNascimento: e.target.value })}
                  />
                )}
                {!isVisualizacao && formData.tipoPessoa !== 'PF' && (
                  <TextField
                    fullWidth
                    label="Inscrição Estadual (IE)"
                    value={formData.inscricaoEstadual}
                    disabled={salvarMutation.isPending}
                    onChange={(e) => setFormData({ ...formData, inscricaoEstadual: e.target.value })}
                  />
                )}
              </Grid>

              <Grid item xs={12} sm={formData.tipoPessoa === 'PJ' ? 6 : 12}>
                {isVisualizacao && (
                  <CampoVisualizacao
                    label={formData.tipoPessoa === 'PF' ? 'Nome Completo' : 'Razão Social'}
                    valor={formData.nomeRazaoSocial}
                  />
                )}
                {!isVisualizacao && (
                  <TextField
                    fullWidth
                    required
                    label={formData.tipoPessoa === 'PF' ? 'Nome Completo' : 'Razão Social'}
                    value={formData.nomeRazaoSocial}
                    disabled={salvarMutation.isPending}
                    onChange={(e) => setFormData({ ...formData, nomeRazaoSocial: e.target.value })}
                  />
                )}
              </Grid>

              {formData.tipoPessoa === 'PJ' && (
                <Grid item xs={12} sm={6}>
                  {isVisualizacao && <CampoVisualizacao label="Nome Fantasia" valor={formData.nomeFantasia} />}
                  {!isVisualizacao && (
                    <TextField
                      fullWidth
                      label="Nome Fantasia"
                      value={formData.nomeFantasia}
                      disabled={salvarMutation.isPending}
                      onChange={(e) => setFormData({ ...formData, nomeFantasia: e.target.value })}
                    />
                  )}
                </Grid>
              )}

              <Grid item xs={12} sm={6}>
                {isVisualizacao && <CampoVisualizacao label="E-mail Principal" valor={formData.email} />}
                {!isVisualizacao && (
                  <TextField
                    fullWidth
                    label="E-mail Principal"
                    type="email"
                    value={formData.email}
                    disabled={salvarMutation.isPending}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                )}
              </Grid>

              <Grid item xs={12} sm={6}>
                {isVisualizacao && <CampoVisualizacao label="Telefone / WhatsApp" valor={formData.telefone} />}
                {!isVisualizacao && (
                  <TextField
                    fullWidth
                    label="Telefone / WhatsApp"
                    value={formData.telefone}
                    disabled={salvarMutation.isPending}
                    onChange={(e) => setFormData({ ...formData, telefone: formatarTelefone(e.target.value) })}
                  />
                )}
              </Grid>

              <Grid item xs={12}>
                {isVisualizacao && (
                  <CampoVisualizacao label="Documento / Anexo do Cliente">
                    {previewAnexoCliente}
                  </CampoVisualizacao>
                )}
                {!isVisualizacao && (
                  <FileUploadDropzone
                    label="Documento / Anexo do Cliente (PDF, Imagem, TXT)"
                    arquivoId={formData.arquivoId}
                    arquivoInicial={formData.arquivo}
                    onArquivoAlterado={(arq) => {
                      if (arq) {
                        setFormData((prev) => ({ ...prev, arquivoId: arq.id, arquivo: arq }));
                      } else {
                        setFormData((prev) => ({ ...prev, arquivoId: null, arquivo: null }));
                      }
                    }}
                    disabled={salvarMutation.isPending}
                  />
                )}
              </Grid>
            </Grid>
          )}

          {/* ABA 1: ENDEREÇOS */}
          {abaAtiva === 1 && (
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  Endereços Cadastrados
                </Typography>
                {!isVisualizacao && (
                  <Button startIcon={<AddIcon />} variant="outlined" size="small" onClick={handleAdicionarEndereco}>
                    Adicionar Endereço
                  </Button>
                )}
              </Box>

              {formData.enderecos.length > 0 && !formData.enderecos.some((e) => e.tipo === 'PRINCIPAL') && (
                <Alert severity="warning" sx={{ mb: 2 }}>
                  Atenção: É obrigatório que pelo menos um dos endereços seja definido como <strong>PRINCIPAL</strong>.
                </Alert>
              )}

              {formData.enderecos.length === 0 ? (
                <Alert severity="info">
                  Nenhum endereço adicionado. Clique em &quot;Adicionar Endereço&quot; acima para registrar endereços de entrega, faturamento ou principal.
                </Alert>
              ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {formData.enderecos.map((end, idx) => (
                    <Card key={idx} variant="outlined">
                      <CardHeader
                        title={`Endereço ${idx + 1}`}
                        titleTypographyProps={{ variant: 'subtitle2', fontWeight: 700 }}
                        action={
                          !isVisualizacao ? (
                            <IconButton size="small" color="error" onClick={() => handleRemoverEndereco(idx)}>
                              <DeleteOutlineIcon fontSize="small" />
                            </IconButton>
                          ) : undefined
                        }
                        sx={{ bgcolor: 'grey.50', py: 1 }}
                      />
                      <CardContent sx={{ pt: 2 }}>
                        <Grid container spacing={2}>
                          <Grid item xs={12} sm={4}>
                            {isVisualizacao && <CampoVisualizacao label="Tipo de Endereço" valor={end.tipo} />}
                            {!isVisualizacao && (
                              <TextField
                                select
                                fullWidth
                                size="small"
                                label="Tipo de Endereço"
                                value={end.tipo}
                                disabled={salvarMutation.isPending}
                                onChange={(e) => handleAtualizarEndereco(idx, 'tipo', e.target.value)}
                              >
                                <MenuItem value="PRINCIPAL">Principal</MenuItem>
                                <MenuItem value="COBRANCA">Cobrança</MenuItem>
                                <MenuItem value="ENTREGA">Entrega</MenuItem>
                              </TextField>
                            )}
                          </Grid>
                          <Grid item xs={12} sm={4}>
                            {isVisualizacao && <CampoVisualizacao label="CEP" valor={end.cep} />}
                            {!isVisualizacao && (
                              <TextField
                                fullWidth
                                required
                                size="small"
                                label="CEP"
                                value={end.cep}
                                disabled={salvarMutation.isPending}
                                onChange={(e) => handleAtualizarEndereco(idx, 'cep', formatarCep(e.target.value))}
                                onBlur={(e) => handleBuscarCep(idx, e.target.value)}
                                helperText="Tab para buscar no ViaCEP"
                              />
                            )}
                          </Grid>
                          <Grid item xs={12} sm={4}>
                            {isVisualizacao && <CampoVisualizacao label="UF" valor={end.uf} />}
                            {!isVisualizacao && (
                              <TextField
                                select
                                fullWidth
                                required
                                size="small"
                                label="UF"
                                value={end.uf}
                                disabled={salvarMutation.isPending}
                                onChange={(e) => handleAtualizarEndereco(idx, 'uf', e.target.value)}
                              >
                                {ESTADOS_BR.map((uf) => (
                                  <MenuItem key={uf} value={uf}>{uf}</MenuItem>
                                ))}
                              </TextField>
                            )}
                          </Grid>

                          <Grid item xs={12} sm={8}>
                            {isVisualizacao && <CampoVisualizacao label="Logradouro" valor={end.logradouro} />}
                            {!isVisualizacao && (
                              <TextField
                                fullWidth
                                required
                                size="small"
                                label="Logradouro (Rua, Av, etc)"
                                value={end.logradouro}
                                disabled={salvarMutation.isPending}
                                onChange={(e) => handleAtualizarEndereco(idx, 'logradouro', e.target.value)}
                              />
                            )}
                          </Grid>
                          <Grid item xs={12} sm={4}>
                            {isVisualizacao && <CampoVisualizacao label="Número" valor={end.numero} />}
                            {!isVisualizacao && (
                              <TextField
                                fullWidth
                                required
                                size="small"
                                label="Número"
                                value={end.numero}
                                disabled={salvarMutation.isPending}
                                onChange={(e) => handleAtualizarEndereco(idx, 'numero', e.target.value)}
                              />
                            )}
                          </Grid>

                          <Grid item xs={12} sm={6}>
                            {isVisualizacao && <CampoVisualizacao label="Complemento" valor={end.complemento} />}
                            {!isVisualizacao && (
                              <TextField
                                fullWidth
                                size="small"
                                label="Complemento"
                                value={end.complemento}
                                disabled={salvarMutation.isPending}
                                onChange={(e) => handleAtualizarEndereco(idx, 'complemento', e.target.value)}
                              />
                            )}
                          </Grid>
                          <Grid item xs={12} sm={3}>
                            {isVisualizacao && <CampoVisualizacao label="Bairro" valor={end.bairro} />}
                            {!isVisualizacao && (
                              <TextField
                                fullWidth
                                required
                                size="small"
                                label="Bairro"
                                value={end.bairro}
                                disabled={salvarMutation.isPending}
                                onChange={(e) => handleAtualizarEndereco(idx, 'bairro', e.target.value)}
                              />
                            )}
                          </Grid>
                          <Grid item xs={12} sm={3}>
                            {isVisualizacao && <CampoVisualizacao label="Cidade" valor={end.cidade} />}
                            {!isVisualizacao && (
                              <TextField
                                fullWidth
                                required
                                size="small"
                                label="Cidade"
                                value={end.cidade}
                                disabled={salvarMutation.isPending}
                                onChange={(e) => handleAtualizarEndereco(idx, 'cidade', e.target.value)}
                              />
                            )}
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  ))}
                </Box>
              )}
            </Box>
          )}

          {/* ABA 2: CONTATOS */}
          {abaAtiva === 2 && (
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  Contatos Adicionais
                </Typography>
                {!isVisualizacao && (
                  <Button startIcon={<AddIcon />} variant="outlined" size="small" onClick={handleAdicionarContato}>
                    Adicionar Contato
                  </Button>
                )}
              </Box>

              {formData.contatos.length === 0 ? (
                <Alert severity="info">
                  Nenhum contato específico cadastrado. Clique no botão acima para adicionar contatos comerciais, financeiros ou de suporte.
                </Alert>
              ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {formData.contatos.map((cto, idx) => (
                    <Card key={idx} variant="outlined">
                      <CardHeader
                        title={`Contato ${idx + 1}`}
                        titleTypographyProps={{ variant: 'subtitle2', fontWeight: 700 }}
                        action={
                          !isVisualizacao ? (
                            <IconButton size="small" color="error" onClick={() => handleRemoverContato(idx)}>
                              <DeleteOutlineIcon fontSize="small" />
                            </IconButton>
                          ) : undefined
                        }
                        sx={{ bgcolor: 'grey.50', py: 1 }}
                      />
                      <CardContent sx={{ pt: 2 }}>
                        <Grid container spacing={2}>
                          <Grid item xs={12} sm={6}>
                            {isVisualizacao && <CampoVisualizacao label="Nome do Contato" valor={cto.nome} />}
                            {!isVisualizacao && (
                              <TextField
                                fullWidth
                                required
                                size="small"
                                label="Nome do Contato"
                                value={cto.nome}
                                disabled={salvarMutation.isPending}
                                onChange={(e) => handleAtualizarContato(idx, 'nome', e.target.value)}
                              />
                            )}
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            {isVisualizacao && <CampoVisualizacao label="Cargo / Função" valor={cto.cargo} />}
                            {!isVisualizacao && (
                              <TextField
                                fullWidth
                                size="small"
                                label="Cargo / Função"
                                value={cto.cargo}
                                disabled={salvarMutation.isPending}
                                onChange={(e) => handleAtualizarContato(idx, 'cargo', e.target.value)}
                              />
                            )}
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            {isVisualizacao && <CampoVisualizacao label="E-mail" valor={cto.email} />}
                            {!isVisualizacao && (
                              <TextField
                                fullWidth
                                size="small"
                                label="E-mail"
                                type="email"
                                value={cto.email}
                                disabled={salvarMutation.isPending}
                                onChange={(e) => handleAtualizarContato(idx, 'email', e.target.value)}
                              />
                            )}
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            {isVisualizacao && <CampoVisualizacao label="Telefone / WhatsApp" valor={cto.telefone} />}
                            {!isVisualizacao && (
                              <TextField
                                fullWidth
                                size="small"
                                label="Telefone / WhatsApp"
                                value={cto.telefone}
                                disabled={salvarMutation.isPending}
                                onChange={(e) => handleAtualizarContato(idx, 'telefone', formatarTelefone(e.target.value))}
                              />
                            )}
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  ))}
                </Box>
              )}
            </Box>
          )}
        </Box>

        {/* Rodapé com Ações */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1.5, p: 2.5, borderTop: 1, borderColor: 'divider' }}>
          {isVisualizacao && (
            <>
              <Button
                variant="outlined"
                color={situacaoCliente === 'ATIVO' ? 'warning' : 'success'}
                startIcon={situacaoCliente === 'ATIVO' ? <BlockIcon /> : <CheckCircleOutlineIcon />}
                onClick={() => setConfirmInativarOpen(true)}
              >
                {situacaoCliente === 'ATIVO' ? 'Inativar cliente' : 'Reativar cliente'}
              </Button>
              <Button
                variant="contained"
                color="primary"
                startIcon={<EditIcon />}
                onClick={() => navigate(`/clientes/editar/${id}`)}
              >
                Alterar
              </Button>
            </>
          )}

          {isEdicao && (
            <>
              <Button
                variant="outlined"
                onClick={() => {
                  if (initialFormData) {
                    setFormData(JSON.parse(JSON.stringify(initialFormData)));
                  }
                  navigate(`/clientes/visualizar/${id}`);
                }}
                disabled={salvarMutation.isPending}
              >
                Cancelar
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={() => salvarMutation.mutate()}
                disabled={salvarMutation.isPending || !isModified || !formularioValido}
              >
                {salvarMutation.isPending ? <CircularProgress size={24} color="inherit" /> : 'Salvar Cliente'}
              </Button>
            </>
          )}

          {isNovo && (
            <>
              <Button variant="outlined" onClick={() => navigate('/clientes')} disabled={salvarMutation.isPending}>
                Cancelar
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={() => salvarMutation.mutate()}
                disabled={salvarMutation.isPending || !formularioValido}
              >
                {salvarMutation.isPending ? <CircularProgress size={24} color="inherit" /> : 'Salvar Cliente'}
              </Button>
            </>
          )}
        </Box>
      </Paper>

      {/* Modal de Confirmação de Inativação / Reativação Lógica */}
      <Dialog open={confirmInativarOpen} onClose={() => setConfirmInativarOpen(false)}>
        <DialogTitle sx={{ fontWeight: 700 }}>
          {situacaoCliente === 'ATIVO' ? 'Inativar Cliente' : 'Reativar Cliente'}
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            {situacaoCliente === 'ATIVO' ? (
              <>
                Deseja inativar o cliente <strong>{formData.nomeRazaoSocial}</strong>?
                <br />
                <br />
                O cliente não poderá ser selecionado em novos pedidos ou transações, mas todos os registros e histórico serão preservados no banco de dados (exclusão lógica).
              </>
            ) : (
              <>
                Deseja reativar o cliente <strong>{formData.nomeRazaoSocial}</strong>? Ele voltará a ficar disponível para novas operações.
              </>
            )}
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={() => setConfirmInativarOpen(false)} disabled={situacaoMutation.isPending}>
            Cancelar
          </Button>
          <Button
            variant="contained"
            color={situacaoCliente === 'ATIVO' ? 'warning' : 'success'}
            disabled={situacaoMutation.isPending}
            onClick={() => {
              const novoStatus = situacaoCliente === 'ATIVO' ? 'INATIVO' : 'ATIVO';
              situacaoMutation.mutate({ novoStatus });
            }}
          >
            {situacaoMutation.isPending ? (
              <CircularProgress size={24} color="inherit" />
            ) : situacaoCliente === 'ATIVO' ? (
              'Confirmar Inativação'
            ) : (
              'Confirmar Reativação'
            )}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Feedback Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        TransitionComponent={SlideTransition}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })} sx={{ width: '100%', boxShadow: 3 }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ClienteDetalhesPage;
