import React, { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Chip,
  Alert,
  IconButton,
  Tooltip,
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
  InputAdornment,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RefreshIcon from '@mui/icons-material/Refresh';
import EditIcon from '@mui/icons-material/Edit';
import BlockIcon from '@mui/icons-material/Block';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import SearchIcon from '@mui/icons-material/Search';
import PersonIcon from '@mui/icons-material/Person';
import BusinessIcon from '@mui/icons-material/Business';
import HomeIcon from '@mui/icons-material/Home';
import ContactPhoneIcon from '@mui/icons-material/ContactPhone';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import { dataGridPtBR } from '../utils/dataGridPtBR';
import { api } from '../services/api';
import { FileUploadDropzone, ArquivoInfo } from '../components/common/FileUploadDropzone';
import {
  ESTADOS_BR,
  formatarCpf,
  formatarCnpj,
  formatarDocumento,
  formatarCep,
  formatarTelefone,
  validarCpf,
  validarCnpj,
  limparDigitos,
} from '../utils/documentos';

interface EndereçoForm {
  id?: number;
  tipo: string; // 'PRINCIPAL' | 'COBRANCA' | 'ENTREGA'
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
  enderecos: EndereçoForm[];
  contatos: ContatoForm[];
}

interface ClienteItem {
  id: number;
  empresaId: number;
  tipoPessoa: string;
  documento: string;
  nomeRazaoSocial: string;
  nomeFantasia?: string;
  inscricaoEstadual?: string;
  dataNascimento?: string;
  email?: string;
  telefone?: string;
  situacao: string;
  arquivoId?: number | null;
  arquivo?: ArquivoInfo | null;
  enderecos?: EndereçoForm[];
  contatos?: ContatoForm[];
}

const FORMULARIO_INICIAL: ClienteForm = {
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
  enderecos: [],
  contatos: [],
};

export const ClientesPage: React.FC = () => {
  const { empresaAtiva } = useAuth();
  const queryClient = useQueryClient();

  // Estados de listagem e filtros
  const [filtroTermo, setFiltroTermo] = useState('');
  const [filtroSituacao, setFiltroSituacao] = useState<'TODOS' | 'ATIVO' | 'INATIVO'>('TODOS');

  // Estados dos modais
  const [modalOpen, setModalOpen] = useState(false);
  const [abaAtiva, setAbaAtiva] = useState(0);
  const [clienteEmEdicao, setClienteEmEdicao] = useState<ClienteItem | null>(null);
  const [formData, setFormData] = useState<ClienteForm>(FORMULARIO_INICIAL);
  const [initialFormData, setInitialFormData] = useState<ClienteForm | null>(null);
  const [formErro, setFormErro] = useState<string | null>(null);

  // Modal de inativação / reativação lógica
  const [confirmInativarOpen, setConfirmInativarOpen] = useState(false);
  const [clienteAlvoInativacao, setClienteAlvoInativacao] = useState<ClienteItem | null>(null);

  // Snackbar de feedback
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });

  // Consulta de clientes com TanStack Query
  const { data: clientesPaginados, isLoading, isFetching, refetch } = useQuery<{
    content: ClienteItem[];
    totalElements: number;
  }>({
    queryKey: ['clientes', empresaAtiva?.id, filtroTermo, filtroSituacao],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filtroTermo.trim()) params.append('termo', filtroTermo.trim());
      if (filtroSituacao !== 'TODOS') params.append('situacao', filtroSituacao);
      params.append('size', '100'); // paginação inicial expansiva

      try {
        const response = await api.get(`/clientes?${params.toString()}`);
        const dados = response.data?.dados;
        if (dados && Array.isArray(dados.content)) {
          return { content: dados.content, totalElements: dados.totalElements };
        } else if (Array.isArray(dados)) {
          return { content: dados, totalElements: dados.length };
        }
        return { content: [], totalElements: 0 };
      } catch (err) {
        // Fallback contextual para demonstração caso o backend esteja em restart
        return { content: [], totalElements: 0 };
      }
    },
    enabled: !!empresaAtiva,
  });

  const listaClientes = useMemo(() => clientesPaginados?.content || [], [clientesPaginados]);

  // Mutação para criar / atualizar cliente
  const salvarMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        ...formData,
        documento: limparDigitos(formData.documento),
        telefone: limparDigitos(formData.telefone),
        dataNascimento: formData.dataNascimento ? formData.dataNascimento : null,
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

      if (clienteEmEdicao) {
        const res = await api.put(`/clientes/${clienteEmEdicao.id}`, payload);
        return res.data;
      } else {
        const res = await api.post('/clientes', payload);
        return res.data;
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['clientes'] });
      setModalOpen(false);
      let mensagemSucesso = 'Cliente cadastrado com sucesso!';
      if (clienteEmEdicao) {
        mensagemSucesso = 'Cliente atualizado com sucesso!';
      }
      if (data.mensagem) {
        mensagemSucesso = data.mensagem;
      }

      setSnackbar({
        open: true,
        message: mensagemSucesso,
        severity: 'success',
      });
    },
    onError: (err: any) => {
      const msg = err.response?.data?.mensagem || 'Erro ao salvar o cliente. Verifique os dados informados.';
      setFormErro(msg);
    },
  });

  // Mutação para inativação / reativação lógica
  const situacaoMutation = useMutation({
    mutationFn: async ({ id, novaSituacao }: { id: number; novaSituacao: 'ATIVO' | 'INATIVO' }) => {
      const res = await api.patch(`/clientes/${id}/situacao`, { situacao: novaSituacao });
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['clientes'] });
      setConfirmInativarOpen(false);
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

  // Abrir modal de criação
  const handleAbrirCriar = () => {
    setClienteEmEdicao(null);
    setFormErro(null);
    setAbaAtiva(0);
    const novoForm: ClienteForm = {
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
    setFormData(novoForm);
    setInitialFormData(JSON.parse(JSON.stringify(novoForm)));
    setModalOpen(true);
  };

  // Abrir modal de edição com busca detalhada
  const handleAbrirEditar = async (cliente: ClienteItem) => {
    setFormErro(null);
    setAbaAtiva(0);

    let clienteCompleto = cliente;
    try {
      const res = await api.get(`/clientes/${cliente.id}`);
      if (res.data?.dados) {
        clienteCompleto = res.data.dados;
      }
    } catch (e) {
      // continua com dados da linha se falhar
    }

    setClienteEmEdicao(clienteCompleto);

    const editForm: ClienteForm = {
      tipoPessoa: (clienteCompleto.tipoPessoa as 'PF' | 'PJ') || 'PJ',
      documento: clienteCompleto.tipoPessoa === 'PF'
        ? formatarCpf(clienteCompleto.documento || '')
        : formatarCnpj(clienteCompleto.documento || ''),
      nomeRazaoSocial: clienteCompleto.nomeRazaoSocial || '',
      nomeFantasia: clienteCompleto.nomeFantasia || '',
      inscricaoEstadual: clienteCompleto.inscricaoEstadual || '',
      dataNascimento: clienteCompleto.dataNascimento ? clienteCompleto.dataNascimento.substring(0, 10) : '',
      email: clienteCompleto.email || '',
      telefone: formatarTelefone(clienteCompleto.telefone || ''),
      arquivoId: clienteCompleto.arquivoId || null,
      arquivo: clienteCompleto.arquivo || null,
      enderecos: (clienteCompleto.enderecos || []).map((end) => ({
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
      contatos: (clienteCompleto.contatos || []).map((cto) => ({
        id: cto.id,
        nome: cto.nome || '',
        cargo: cto.cargo || '',
        email: cto.email || '',
        telefone: formatarTelefone(cto.telefone || ''),
      })),
    };

    setFormData(editForm);
    setInitialFormData(JSON.parse(JSON.stringify(editForm)));
    setModalOpen(true);
  };

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

  const handleAtualizarEndereco = (index: number, campo: keyof EndereçoForm, valor: string) => {
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

  // Verificação de modificação do formulário (isModified)
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

    // Se houver endereços, checar se pelo menos 1 é PRINCIPAL e todos têm campos obrigatórios
    if (formData.enderecos.length > 0) {
      const temPrincipal = formData.enderecos.some((e) => e.tipo === 'PRINCIPAL');
      if (!temPrincipal) return false;

      for (const end of formData.enderecos) {
        if (!end.cep.trim() || !end.logradouro.trim() || !end.numero.trim() || !end.bairro.trim() || !end.cidade.trim() || !end.uf.trim()) {
          return false;
        }
      }
    }

    // Se houver contatos, nome é obrigatório
    for (const cto of formData.contatos) {
      if (!cto.nome.trim()) return false;
    }

    return true;
  }, [formData]);

  // Colunas do DataGrid
  const columns: GridColDef[] = [
    {
      field: 'id',
      headerName: 'ID',
      width: 75,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => (
        <Chip
          label={params.value}
          size="small"
          sx={{
            bgcolor: '#e0e0e0',
            color: '#424242',
            fontWeight: 700,
            borderRadius: '16px',
            minWidth: 32,
            height: 24,
          }}
        />
      ),
    },
    {
      field: 'tipoPessoa',
      headerName: 'Tipo',
      width: 75,
      renderCell: (params) => (
        <Chip
          label={params.value}
          size="small"
          color={params.value === 'PJ' ? 'primary' : 'secondary'}
          variant="outlined"
          sx={{ fontWeight: 600 }}
        />
      ),
    },
    {
      field: 'documento',
      headerName: 'CPF / CNPJ',
      width: 170,
      valueGetter: (_, row) => formatarDocumento(row.documento, row.tipoPessoa),
    },
    {
      field: 'nomeRazaoSocial',
      headerName: 'Nome / Razão Social',
      flex: 1.2,
      minWidth: 200,
    },
    {
      field: 'nomeFantasia',
      headerName: 'Nome Fantasia',
      flex: 0.9,
      minWidth: 150,
      valueGetter: (v) => v || '-',
    },
    {
      field: 'cidadeUf',
      headerName: 'Cidade / UF',
      width: 140,
      valueGetter: (_, row) => {
        const principal = row.enderecos?.find((e: any) => e.tipo === 'PRINCIPAL') || row.enderecos?.[0];
        return principal ? `${principal.cidade}/${principal.uf}` : '-';
      },
    },
    { field: 'email', headerName: 'E-mail', width: 190, valueGetter: (v) => v || '-' },
    {
      field: 'telefone',
      headerName: 'Telefone',
      width: 140,
      valueGetter: (v) => (v ? formatarTelefone(v) : '-'),
    },
    {
      field: 'situacao',
      headerName: 'Situação',
      width: 105,
      renderCell: (params) => (
        <Chip
          label={params.value}
          size="small"
          color={params.value === 'ATIVO' ? 'success' : 'default'}
        />
      ),
    },
    {
      field: 'acoes',
      headerName: 'Ações',
      width: 110,
      sortable: false,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          <Tooltip title="Editar Cliente">
            <IconButton size="small" color="primary" onClick={() => handleAbrirEditar(params.row)}>
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title={params.row.situacao === 'ATIVO' ? 'Inativar Cliente' : 'Reativar Cliente'}>
            <IconButton
              size="small"
              color={params.row.situacao === 'ATIVO' ? 'warning' : 'success'}
              onClick={() => {
                setClienteAlvoInativacao(params.row);
                setConfirmInativarOpen(true);
              }}
            >
              {params.row.situacao === 'ATIVO' ? (
                <BlockIcon fontSize="small" />
              ) : (
                <CheckCircleOutlineIcon fontSize="small" />
              )}
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  return (
    <Box>
      {/* Cabeçalho */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            Cadastro de Clientes
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Gestão unificada de clientes (Pessoa Física e Jurídica) com isolamento multiempresa
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title="Recarregar clientes">
            <IconButton onClick={() => refetch()} disabled={isLoading || isFetching} color="primary">
              <RefreshIcon />
            </IconButton>
          </Tooltip>
          <Button variant="contained" startIcon={<AddIcon />} size="medium" onClick={handleAbrirCriar}>
            Novo Cliente
          </Button>
        </Box>
      </Box>

      {/* Alerta de contexto da empresa */}
      <Alert severity="info" sx={{ mb: 2.5, alignItems: 'center' }}>
        Empresa Ativa:{' '}
        <strong>
          {empresaAtiva
            ? `${empresaAtiva.nomeFantasia || empresaAtiva.razaoSocial} (CNPJ: ${formatarCnpj(empresaAtiva.cnpj)})`
            : 'Nenhuma selecionada'}
        </strong>
        {' — '}
        Exibindo <strong>{listaClientes.length}</strong> {listaClientes.length === 1 ? 'cliente cadastrado' : 'clientes cadastrados'}.
      </Alert>

      {/* Barra de Filtros */}
      <Paper sx={{ p: 2, mb: 2.5 }} elevation={1}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={8} md={6}>
            <TextField
              fullWidth
              size="small"
              placeholder="Pesquisar por Razão Social, Nome Fantasia ou CPF/CNPJ..."
              value={filtroTermo}
              onChange={(e) => setFiltroTermo(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} sm={4} md={3}>
            <TextField
              select
              fullWidth
              size="small"
              label="Situação"
              value={filtroSituacao}
              onChange={(e) => setFiltroSituacao(e.target.value as any)}
            >
              <MenuItem value="TODOS">Todos</MenuItem>
              <MenuItem value="ATIVO">Apenas Ativos</MenuItem>
              <MenuItem value="INATIVO">Apenas Inativos</MenuItem>
            </TextField>
          </Grid>
        </Grid>
      </Paper>

      {/* Tabela DataGrid */}
      <Paper sx={{ width: '100%', height: 530 }} elevation={1}>
        <DataGrid
          rows={listaClientes}
          columns={columns}
          loading={isLoading || isFetching}
          localeText={dataGridPtBR}
          slotProps={{
            pagination: {
              labelRowsPerPage: 'Registros por página:',
            },
          }}
          initialState={{
            pagination: { paginationModel: { pageSize: 10 } },
          }}
          pageSizeOptions={[10, 25, 50]}
          disableRowSelectionOnClick
        />
      </Paper>

      {/* ========================================================================= */}
      {/* MODAL DE CADASTRO / EDIÇÃO COM ABAS                                       */}
      {/* ========================================================================= */}
      <Dialog open={modalOpen} onClose={() => setModalOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ fontWeight: 700, pb: 1 }}>
          {clienteEmEdicao ? `Editar Cliente: ${clienteEmEdicao.nomeRazaoSocial}` : 'Novo Cadastro de Cliente'}
        </DialogTitle>

        <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 3 }}>
          <Tabs value={abaAtiva} onChange={(_, val) => setAbaAtiva(val)}>
            <Tab icon={<PersonIcon />} iconPosition="start" label="Dados Gerais" />
            <Tab
              icon={<HomeIcon />}
              iconPosition="start"
              label={`Endereços (${formData.enderecos.length})`}
            />
            <Tab
              icon={<ContactPhoneIcon />}
              iconPosition="start"
              label={`Contatos (${formData.contatos.length})`}
            />
          </Tabs>
        </Box>

        <DialogContent dividers sx={{ p: 3 }}>
          {formErro && (
            <Alert severity="error" sx={{ mb: 2.5 }} onClose={() => setFormErro(null)}>
              {formErro}
            </Alert>
          )}

          {/* ABA 0: DADOS GERAIS */}
          {abaAtiva === 0 && (
            <Grid container spacing={2}>
              <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                  Tipo de Pessoa:
                </Typography>
                <ToggleButtonGroup
                  value={formData.tipoPessoa}
                  exclusive
                  size="small"
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
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  required
                  label={formData.tipoPessoa === 'PF' ? 'CPF' : 'CNPJ'}
                  value={formData.documento}
                  error={documentoInvalido}
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
              </Grid>

              <Grid item xs={12} sm={6}>
                {formData.tipoPessoa === 'PF' ? (
                  <TextField
                    fullWidth
                    label="Data de Nascimento"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    value={formData.dataNascimento}
                    onChange={(e) => setFormData({ ...formData, dataNascimento: e.target.value })}
                  />
                ) : (
                  <TextField
                    fullWidth
                    label="Inscrição Estadual (IE)"
                    value={formData.inscricaoEstadual}
                    onChange={(e) => setFormData({ ...formData, inscricaoEstadual: e.target.value })}
                  />
                )}
              </Grid>

              <Grid item xs={12} sm={formData.tipoPessoa === 'PJ' ? 6 : 12}>
                <TextField
                  fullWidth
                  required
                  label={formData.tipoPessoa === 'PF' ? 'Nome Completo' : 'Razão Social'}
                  value={formData.nomeRazaoSocial}
                  onChange={(e) => setFormData({ ...formData, nomeRazaoSocial: e.target.value })}
                />
              </Grid>

              {formData.tipoPessoa === 'PJ' && (
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Nome Fantasia"
                    value={formData.nomeFantasia}
                    onChange={(e) => setFormData({ ...formData, nomeFantasia: e.target.value })}
                  />
                </Grid>
              )}

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="E-mail Principal"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Telefone / WhatsApp"
                  value={formData.telefone}
                  onChange={(e) => setFormData({ ...formData, telefone: formatarTelefone(e.target.value) })}
                />
              </Grid>

              <Grid item xs={12}>
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
                <Button startIcon={<AddIcon />} variant="outlined" size="small" onClick={handleAdicionarEndereco}>
                  Adicionar Endereço
                </Button>
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
                          <IconButton size="small" color="error" onClick={() => handleRemoverEndereco(idx)}>
                            <DeleteOutlineIcon fontSize="small" />
                          </IconButton>
                        }
                        sx={{ bgcolor: 'grey.50', py: 1 }}
                      />
                      <CardContent sx={{ pt: 2 }}>
                        <Grid container spacing={2}>
                          <Grid item xs={12} sm={4}>
                            <TextField
                              select
                              fullWidth
                              size="small"
                              label="Tipo de Endereço"
                              value={end.tipo}
                              onChange={(e) => handleAtualizarEndereco(idx, 'tipo', e.target.value)}
                            >
                              <MenuItem value="PRINCIPAL">Principal</MenuItem>
                              <MenuItem value="COBRANCA">Cobrança</MenuItem>
                              <MenuItem value="ENTREGA">Entrega</MenuItem>
                            </TextField>
                          </Grid>
                          <Grid item xs={12} sm={4}>
                            <TextField
                              fullWidth
                              required
                              size="small"
                              label="CEP"
                              value={end.cep}
                              onChange={(e) => handleAtualizarEndereco(idx, 'cep', formatarCep(e.target.value))}
                              onBlur={(e) => handleBuscarCep(idx, e.target.value)}
                              helperText="Tab para buscar no ViaCEP"
                            />
                          </Grid>
                          <Grid item xs={12} sm={4}>
                            <TextField
                              select
                              fullWidth
                              required
                              size="small"
                              label="UF"
                              value={end.uf}
                              onChange={(e) => handleAtualizarEndereco(idx, 'uf', e.target.value)}
                            >
                              {ESTADOS_BR.map((uf) => (
                                <MenuItem key={uf} value={uf}>{uf}</MenuItem>
                              ))}
                            </TextField>
                          </Grid>

                          <Grid item xs={12} sm={8}>
                            <TextField
                              fullWidth
                              required
                              size="small"
                              label="Logradouro (Rua, Av, etc)"
                              value={end.logradouro}
                              onChange={(e) => handleAtualizarEndereco(idx, 'logradouro', e.target.value)}
                            />
                          </Grid>
                          <Grid item xs={12} sm={4}>
                            <TextField
                              fullWidth
                              required
                              size="small"
                              label="Número"
                              value={end.numero}
                              onChange={(e) => handleAtualizarEndereco(idx, 'numero', e.target.value)}
                            />
                          </Grid>

                          <Grid item xs={12} sm={6}>
                            <TextField
                              fullWidth
                              size="small"
                              label="Complemento"
                              value={end.complemento}
                              onChange={(e) => handleAtualizarEndereco(idx, 'complemento', e.target.value)}
                            />
                          </Grid>
                          <Grid item xs={12} sm={3}>
                            <TextField
                              fullWidth
                              required
                              size="small"
                              label="Bairro"
                              value={end.bairro}
                              onChange={(e) => handleAtualizarEndereco(idx, 'bairro', e.target.value)}
                            />
                          </Grid>
                          <Grid item xs={12} sm={3}>
                            <TextField
                              fullWidth
                              required
                              size="small"
                              label="Cidade"
                              value={end.cidade}
                              onChange={(e) => handleAtualizarEndereco(idx, 'cidade', e.target.value)}
                            />
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
                <Button startIcon={<AddIcon />} variant="outlined" size="small" onClick={handleAdicionarContato}>
                  Adicionar Contato
                </Button>
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
                          <IconButton size="small" color="error" onClick={() => handleRemoverContato(idx)}>
                            <DeleteOutlineIcon fontSize="small" />
                          </IconButton>
                        }
                        sx={{ bgcolor: 'grey.50', py: 1 }}
                      />
                      <CardContent sx={{ pt: 2 }}>
                        <Grid container spacing={2}>
                          <Grid item xs={12} sm={6}>
                            <TextField
                              fullWidth
                              required
                              size="small"
                              label="Nome do Contato"
                              value={cto.nome}
                              onChange={(e) => handleAtualizarContato(idx, 'nome', e.target.value)}
                            />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <TextField
                              fullWidth
                              size="small"
                              label="Cargo / Função"
                              value={cto.cargo}
                              onChange={(e) => handleAtualizarContato(idx, 'cargo', e.target.value)}
                            />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <TextField
                              fullWidth
                              size="small"
                              label="E-mail"
                              type="email"
                              value={cto.email}
                              onChange={(e) => handleAtualizarContato(idx, 'email', e.target.value)}
                            />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <TextField
                              fullWidth
                              size="small"
                              label="Telefone / WhatsApp"
                              value={cto.telefone}
                              onChange={(e) => handleAtualizarContato(idx, 'telefone', formatarTelefone(e.target.value))}
                            />
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  ))}
                </Box>
              )}
            </Box>
          )}
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={() => setModalOpen(false)} disabled={salvarMutation.isPending}>
            Cancelar
          </Button>
          <Button
            variant="contained"
            onClick={() => salvarMutation.mutate()}
            disabled={salvarMutation.isPending || !isModified || !formularioValido}
          >
            {salvarMutation.isPending ? <CircularProgress size={24} color="inherit" /> : 'Salvar Cliente'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ========================================================================= */}
      {/* MODAL DE CONFIRMAÇÃO DE INATIVAÇÃO / REATIVAÇÃO LÓGICA                    */}
      {/* ========================================================================= */}
      <Dialog open={confirmInativarOpen} onClose={() => setConfirmInativarOpen(false)}>
        <DialogTitle sx={{ fontWeight: 700 }}>
          {clienteAlvoInativacao?.situacao === 'ATIVO' ? 'Inativar Cliente' : 'Reativar Cliente'}
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            {clienteAlvoInativacao?.situacao === 'ATIVO' ? (
              <>
                Deseja inativar o cliente{' '}
                <strong>{clienteAlvoInativacao?.nomeRazaoSocial}</strong>?
                <br />
                <br />
                O cliente não poderá ser selecionado em novos pedidos ou transações, mas todos os registros e histórico serão preservados no banco de dados (exclusão lógica).
              </>
            ) : (
              <>
                Deseja reativar o cliente{' '}
                <strong>{clienteAlvoInativacao?.nomeRazaoSocial}</strong>? Ele voltará a ficar disponível para novas operações.
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
            color={clienteAlvoInativacao?.situacao === 'ATIVO' ? 'warning' : 'success'}
            disabled={situacaoMutation.isPending}
            onClick={() => {
              if (clienteAlvoInativacao) {
                let novaSituacao: 'ATIVO' | 'INATIVO' = 'ATIVO';
                if (clienteAlvoInativacao.situacao === 'ATIVO') {
                  novaSituacao = 'INATIVO';
                }
                situacaoMutation.mutate({ id: clienteAlvoInativacao.id, novaSituacao });
              }
            }}
          >
            {situacaoMutation.isPending ? (
              <CircularProgress size={24} color="inherit" />
            ) : clienteAlvoInativacao?.situacao === 'ATIVO' ? (
              'Confirmar Inativação'
            ) : (
              'Confirmar Reativação'
            )}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar de Feedback */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};
