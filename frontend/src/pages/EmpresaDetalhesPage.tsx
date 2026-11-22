import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  IconButton,
  Alert,
  Snackbar,
  CircularProgress,
  MenuItem,
  Slide,
  SlideProps,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import BlockIcon from '@mui/icons-material/Block';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import EditIcon from '@mui/icons-material/Edit';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api';
import { FileUploadDropzone, ArquivoInfo } from '../components/common/FileUploadDropzone';
import { CampoVisualizacao } from '../components/common/CampoVisualizacao';

function SlideTransition(props: SlideProps) {
  return <Slide {...props} direction="left" />;
}

const ESTADOS_BR = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
  'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN',
  'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
];

function formatarCnpj(cnpj: string): string {
  if (!cnpj) {
    return '';
  }
  const digits = cnpj.replace(/\D/g, '');
  if (digits.length === 14) {
    return digits.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5');
  }
  return cnpj;
}

function formatarCep(cep: string): string {
  if (!cep) {
    return '';
  }
  const digits = cep.replace(/\D/g, '');
  if (digits.length === 8) {
    return digits.replace(/^(\d{5})(\d{3})$/, '$1-$2');
  }
  return cep;
}

const formVazio = {
  razaoSocial: '',
  nomeFantasia: '',
  cnpj: '',
  inscricaoEstadual: '',
  cep: '',
  logradouro: '',
  numero: '',
  complemento: '',
  bairro: '',
  cidade: '',
  uf: 'SP',
  arquivoId: null as number | null,
  arquivo: null as ArquivoInfo | null,
};

export const EmpresaDetalhesPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();

  const isNovo = location.pathname.includes('/empresas/novo');
  const isEdicao = location.pathname.includes('/empresas/editar/');
  const isVisualizacao = !isNovo && !isEdicao;

  const [carregando, setCarregando] = useState(false);
  const [situacaoEmpresa, setSituacaoEmpresa] = useState<string>('ATIVO');
  const [formData, setFormData] = useState(formVazio);
  const [initialFormData, setInitialFormData] = useState<typeof formVazio | null>(null);
  const [formErro, setFormErro] = useState<string | null>(null);
  const [confirmInativarOpen, setConfirmInativarOpen] = useState(false);

  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });

  // Carregar dados da empresa
  useEffect(() => {
    if (isNovo) {
      setFormData(formVazio);
      setInitialFormData(formVazio);
      setSituacaoEmpresa('ATIVO');
      setFormErro(null);
      return;
    }

    if (id) {
      setCarregando(true);
      setFormErro(null);
      api
        .get(`/empresas/${id}`)
        .then((res) => {
          const emp = res.data?.dados;
          if (emp) {
            setSituacaoEmpresa(emp.situacao || 'ATIVO');
            const loaded = {
              razaoSocial: emp.razaoSocial || '',
              nomeFantasia: emp.nomeFantasia || '',
              cnpj: formatarCnpj(emp.cnpj || ''),
              inscricaoEstadual: emp.inscricaoEstadual || '',
              cep: formatarCep(emp.cep || ''),
              logradouro: emp.logradouro || '',
              numero: emp.numero || '',
              complemento: emp.complemento || '',
              bairro: emp.bairro || '',
              cidade: emp.cidade || '',
              uf: emp.uf || 'SP',
              arquivoId: emp.arquivoId || null,
              arquivo: emp.arquivo || null,
            };
            setFormData(loaded);
            setInitialFormData(loaded);
          }
        })
        .catch((err) => {
          setFormErro(err.response?.data?.mensagem || 'Erro ao carregar dados da empresa.');
        })
        .finally(() => {
          setCarregando(false);
        });
    }
  }, [id, isNovo]);

  // Busca automática do CEP via ViaCEP
  const handleBuscarCep = async (cepDigitado: string) => {
    const cepLimpo = cepDigitado.replace(/\D/g, '');
    if (cepLimpo.length !== 8) {
      return;
    }

    try {
      const res = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
      const dados = await res.json();
      if (!dados.erro) {
        setFormData((prev) => ({
          ...prev,
          logradouro: dados.logradouro || prev.logradouro,
          bairro: dados.bairro || prev.bairro,
          cidade: dados.localidade || prev.cidade,
          uf: dados.uf || prev.uf,
        }));
      }
    } catch (e) {
      console.warn('Erro ao consultar ViaCEP:', e);
    }
  };

  const isModified = useMemo(() => {
    if (!initialFormData) {
      return false;
    }
    return JSON.stringify(formData) !== JSON.stringify(initialFormData);
  }, [formData, initialFormData]);

  // Mutação para Salvar Empresa
  const salvarMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        ...formData,
        cnpj: formData.cnpj.replace(/\D/g, ''),
        cep: formData.cep.replace(/\D/g, ''),
      };

      if (!isNovo && id) {
        const res = await api.put(`/empresas/${id}`, payload);
        return res.data;
      } else {
        const res = await api.post('/empresas', payload);
        return res.data;
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['empresas'] });
      const empresaSalvaId = data.dados?.id || id;

      setSnackbar({
        open: true,
        message: data.mensagem || (isNovo ? 'Empresa cadastrada com sucesso!' : 'Empresa atualizada com sucesso!'),
        severity: 'success',
      });

      // Substituir a rota para visualização: ao clicar em voltar, não retorna para a edição
      navigate(`/empresas/visualizar/${empresaSalvaId}`, { replace: true });
    },
    onError: (err: any) => {
      const msg = err.response?.data?.mensagem || 'Erro ao salvar a empresa. Verifique os dados informados.';
      setFormErro(msg);
    },
  });

  // Mutação para Inativar / Reativar empresa
  const situacaoMutation = useMutation({
    mutationFn: async ({ novoStatus }: { novoStatus: string }) => {
      const res = await api.patch(`/empresas/${id}/situacao`, { situacao: novoStatus });
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['empresas'] });
      setConfirmInativarOpen(false);
      const novoStatus = situacaoEmpresa === 'ATIVO' ? 'INATIVO' : 'ATIVO';
      setSituacaoEmpresa(novoStatus);
      setSnackbar({
        open: true,
        message: data.mensagem || 'Situação da empresa alterada com sucesso!',
        severity: 'success',
      });
    },
    onError: (err: any) => {
      const msg = err.response?.data?.mensagem || 'Erro ao alterar situação da empresa.';
      setSnackbar({ open: true, message: msg, severity: 'error' });
    },
  });

  // Título da página
  let tituloPagina = 'Cadastrar Nova Empresa';
  if (!isNovo) {
    const nomeExibicao = formData.nomeFantasia || formData.razaoSocial || `Empresa #${id}`;
    tituloPagina = isVisualizacao ? `Visualizando: ${nomeExibicao}` : `Alterando: ${nomeExibicao}`;
  }

  // Preview de Anexo
  let previewAnexoEmpresa = (
    <Typography variant="body2" color="text.secondary">
      Nenhum anexo vinculado
    </Typography>
  );
  if (formData.arquivo) {
    previewAnexoEmpresa = (
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
            <IconButton color="primary" onClick={() => navigate('/empresas')} title="Voltar para Empresas">
              <ArrowBackIcon />
            </IconButton>
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                  {tituloPagina}
                </Typography>
                {!isNovo && (
                  <Chip
                    label={situacaoEmpresa}
                    size="small"
                    color={situacaoEmpresa === 'ATIVO' ? 'success' : 'error'}
                    sx={{ fontWeight: 700 }}
                  />
                )}
              </Box>
              <Typography variant="body2" color="text.secondary">
                {isVisualizacao
                  ? 'Ficha cadastral da empresa'
                  : isEdicao
                  ? 'Atualização dos dados da empresa filial/matriz'
                  : 'Preencha os dados abaixo para cadastrar uma nova unidade empresarial'}
              </Typography>
            </Box>
          </Box>

          {/* Botões do Topo */}
          <Box sx={{ display: 'flex', gap: 1 }}>
            {isVisualizacao && (
              <>
                <Button
                  variant="outlined"
                  color={situacaoEmpresa === 'ATIVO' ? 'error' : 'success'}
                  startIcon={situacaoEmpresa === 'ATIVO' ? <BlockIcon /> : <CheckCircleOutlineIcon />}
                  onClick={() => setConfirmInativarOpen(true)}
                >
                  {situacaoEmpresa === 'ATIVO' ? 'Inativar empresa' : 'Reativar empresa'}
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<EditIcon />}
                  onClick={() => navigate(`/empresas/editar/${id}`)}
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
                      setFormData(initialFormData);
                    }
                    navigate(`/empresas/visualizar/${id}`);
                  }}
                  disabled={salvarMutation.isPending}
                >
                  Cancelar
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => salvarMutation.mutate()}
                  disabled={salvarMutation.isPending || !isModified || !formData.razaoSocial.trim() || !formData.cnpj.trim()}
                >
                  {salvarMutation.isPending ? <CircularProgress size={24} color="inherit" /> : 'Salvar Empresa'}
                </Button>
              </>
            )}

            {isNovo && (
              <>
                <Button variant="outlined" onClick={() => navigate('/empresas')} disabled={salvarMutation.isPending}>
                  Cancelar
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => salvarMutation.mutate()}
                  disabled={salvarMutation.isPending || !formData.razaoSocial.trim() || !formData.cnpj.trim()}
                >
                  {salvarMutation.isPending ? <CircularProgress size={24} color="inherit" /> : 'Salvar Empresa'}
                </Button>
              </>
            )}
          </Box>
        </Box>
      </Paper>

      {/* Formulário / Dados */}
      <Paper sx={{ p: 3, mb: 3 }} elevation={1}>
        {formErro && (
          <Alert severity="error" sx={{ mb: 2.5 }} onClose={() => setFormErro(null)}>
            {formErro}
          </Alert>
        )}

        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            {isVisualizacao && <CampoVisualizacao label="CNPJ" valor={formData.cnpj} />}
            {!isVisualizacao && (
              <TextField
                required
                fullWidth
                label="CNPJ"
                placeholder="00.000.000/0000-00"
                value={formData.cnpj}
                onChange={(e) => setFormData({ ...formData, cnpj: formatarCnpj(e.target.value) })}
                disabled={salvarMutation.isPending}
              />
            )}
          </Grid>

          <Grid item xs={12} sm={6}>
            {isVisualizacao && <CampoVisualizacao label="Inscrição Estadual" valor={formData.inscricaoEstadual} />}
            {!isVisualizacao && (
              <TextField
                fullWidth
                label="Inscrição Estadual"
                value={formData.inscricaoEstadual}
                onChange={(e) => setFormData({ ...formData, inscricaoEstadual: e.target.value })}
                disabled={salvarMutation.isPending}
              />
            )}
          </Grid>

          <Grid item xs={12} sm={6}>
            {isVisualizacao && <CampoVisualizacao label="Razão Social" valor={formData.razaoSocial} />}
            {!isVisualizacao && (
              <TextField
                required
                fullWidth
                label="Razão Social"
                value={formData.razaoSocial}
                onChange={(e) => setFormData({ ...formData, razaoSocial: e.target.value })}
                disabled={salvarMutation.isPending}
              />
            )}
          </Grid>

          <Grid item xs={12} sm={6}>
            {isVisualizacao && <CampoVisualizacao label="Nome Fantasia" valor={formData.nomeFantasia} />}
            {!isVisualizacao && (
              <TextField
                fullWidth
                label="Nome Fantasia"
                value={formData.nomeFantasia}
                onChange={(e) => setFormData({ ...formData, nomeFantasia: e.target.value })}
                disabled={salvarMutation.isPending}
              />
            )}
          </Grid>

          <Grid item xs={12} sm={4}>
            {isVisualizacao && <CampoVisualizacao label="CEP" valor={formData.cep} />}
            {!isVisualizacao && (
              <TextField
                fullWidth
                label="CEP"
                value={formData.cep}
                onChange={(e) => setFormData({ ...formData, cep: formatarCep(e.target.value) })}
                onBlur={(e) => handleBuscarCep(e.target.value)}
                disabled={salvarMutation.isPending}
                helperText="Tab para buscar no ViaCEP"
              />
            )}
          </Grid>

          <Grid item xs={12} sm={4}>
            {isVisualizacao && <CampoVisualizacao label="Estado (UF)" valor={formData.uf} />}
            {!isVisualizacao && (
              <TextField
                select
                fullWidth
                label="Estado (UF)"
                value={formData.uf}
                onChange={(e) => setFormData({ ...formData, uf: e.target.value })}
                disabled={salvarMutation.isPending}
              >
                {ESTADOS_BR.map((uf) => (
                  <MenuItem key={uf} value={uf}>
                    {uf}
                  </MenuItem>
                ))}
              </TextField>
            )}
          </Grid>

          <Grid item xs={12} sm={4}>
            {isVisualizacao && <CampoVisualizacao label="Cidade" valor={formData.cidade} />}
            {!isVisualizacao && (
              <TextField
                fullWidth
                label="Cidade"
                value={formData.cidade}
                onChange={(e) => setFormData({ ...formData, cidade: e.target.value })}
                disabled={salvarMutation.isPending}
              />
            )}
          </Grid>

          <Grid item xs={12} sm={4}>
            {isVisualizacao && <CampoVisualizacao label="Bairro" valor={formData.bairro} />}
            {!isVisualizacao && (
              <TextField
                fullWidth
                label="Bairro"
                value={formData.bairro}
                onChange={(e) => setFormData({ ...formData, bairro: e.target.value })}
                disabled={salvarMutation.isPending}
              />
            )}
          </Grid>

          <Grid item xs={12} sm={6}>
            {isVisualizacao && <CampoVisualizacao label="Logradouro" valor={formData.logradouro} />}
            {!isVisualizacao && (
              <TextField
                fullWidth
                label="Logradouro (Rua, Av, etc)"
                value={formData.logradouro}
                onChange={(e) => setFormData({ ...formData, logradouro: e.target.value })}
                disabled={salvarMutation.isPending}
              />
            )}
          </Grid>

          <Grid item xs={12} sm={2}>
            {isVisualizacao && <CampoVisualizacao label="Número" valor={formData.numero} />}
            {!isVisualizacao && (
              <TextField
                fullWidth
                label="Número"
                value={formData.numero}
                onChange={(e) => setFormData({ ...formData, numero: e.target.value })}
                disabled={salvarMutation.isPending}
              />
            )}
          </Grid>

          <Grid item xs={12} sm={6}>
            {isVisualizacao && <CampoVisualizacao label="Complemento" valor={formData.complemento} />}
            {!isVisualizacao && (
              <TextField
                fullWidth
                label="Complemento"
                value={formData.complemento}
                onChange={(e) => setFormData({ ...formData, complemento: e.target.value })}
                disabled={salvarMutation.isPending}
              />
            )}
          </Grid>

          <Grid item xs={12}>
            {isVisualizacao && (
              <CampoVisualizacao label="Documento / Anexo da Empresa">
                {previewAnexoEmpresa}
              </CampoVisualizacao>
            )}
            {!isVisualizacao && (
              <FileUploadDropzone
                label="Documento / Anexo da Empresa (PDF, Imagem, TXT)"
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

        {/* Rodapé com Ações */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1.5, mt: 4, pt: 2, borderTop: 1, borderColor: 'divider' }}>
          {isVisualizacao && (
            <>
              <Button
                variant="outlined"
                color={situacaoEmpresa === 'ATIVO' ? 'error' : 'success'}
                startIcon={situacaoEmpresa === 'ATIVO' ? <BlockIcon /> : <CheckCircleOutlineIcon />}
                onClick={() => setConfirmInativarOpen(true)}
              >
                {situacaoEmpresa === 'ATIVO' ? 'Inativar empresa' : 'Reativar empresa'}
              </Button>
              <Button
                variant="contained"
                color="primary"
                startIcon={<EditIcon />}
                onClick={() => navigate(`/empresas/editar/${id}`)}
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
                    setFormData(initialFormData);
                  }
                  navigate(`/empresas/visualizar/${id}`);
                }}
                disabled={salvarMutation.isPending}
              >
                Cancelar
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={() => salvarMutation.mutate()}
                disabled={salvarMutation.isPending || !isModified || !formData.razaoSocial.trim() || !formData.cnpj.trim()}
              >
                {salvarMutation.isPending ? <CircularProgress size={24} color="inherit" /> : 'Salvar Empresa'}
              </Button>
            </>
          )}

          {isNovo && (
            <>
              <Button variant="outlined" onClick={() => navigate('/empresas')} disabled={salvarMutation.isPending}>
                Cancelar
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={() => salvarMutation.mutate()}
                disabled={salvarMutation.isPending || !formData.razaoSocial.trim() || !formData.cnpj.trim()}
              >
                {salvarMutation.isPending ? <CircularProgress size={24} color="inherit" /> : 'Salvar Empresa'}
              </Button>
            </>
          )}
        </Box>
      </Paper>

      {/* Modal de Confirmação de Inativação / Reativação Lógica */}
      <Dialog open={confirmInativarOpen} onClose={() => setConfirmInativarOpen(false)}>
        <DialogTitle sx={{ fontWeight: 700 }}>
          {situacaoEmpresa === 'ATIVO' ? 'Inativar Empresa' : 'Reativar Empresa'}
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            {situacaoEmpresa === 'ATIVO' ? (
              <>
                Deseja inativar a empresa <strong>{formData.razaoSocial}</strong>?
                <br />
                <br />
                A empresa não poderá ser selecionada para novas operações, mas todos os registros e histórico serão preservados no banco de dados (exclusão lógica).
              </>
            ) : (
              <>
                Deseja reativar a empresa <strong>{formData.razaoSocial}</strong>? Ela voltará a ficar disponível para novas operações.
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
            color={situacaoEmpresa === 'ATIVO' ? 'error' : 'success'}
            disabled={situacaoMutation.isPending}
            onClick={() => {
              const novoStatus = situacaoEmpresa === 'ATIVO' ? 'INATIVO' : 'ATIVO';
              situacaoMutation.mutate({ novoStatus });
            }}
          >
            {situacaoMutation.isPending ? (
              <CircularProgress size={24} color="inherit" />
            ) : situacaoEmpresa === 'ATIVO' ? (
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

export default EmpresaDetalhesPage;
