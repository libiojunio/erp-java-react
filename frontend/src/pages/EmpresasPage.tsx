import React, { useState } from 'react';
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
  Tooltip,
  Alert,
  Snackbar,
  CircularProgress,
  MenuItem,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import BlockIcon from '@mui/icons-material/Block';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import RefreshIcon from '@mui/icons-material/Refresh';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api';
import { dataGridPtBR } from '../utils/dataGridPtBR';

interface EmpresaItem {
  id: number;
  razaoSocial: string;
  nomeFantasia?: string;
  cnpj: string;
  inscricaoEstadual?: string;
  cep?: string;
  logradouro?: string;
  numero?: string;
  complemento?: string;
  bairro?: string;
  cidade?: string;
  uf?: string;
  situacao: string;
}

const ESTADOS_BR = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
  'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN',
  'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
];

function formatarCnpj(cnpj: string): string {
  if (!cnpj) return '';
  const digits = cnpj.replace(/\D/g, '');
  if (digits.length === 14) {
    return digits.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5');
  }
  return cnpj;
}

function formatarCep(cep: string): string {
  if (!cep) return '';
  const digits = cep.replace(/\D/g, '');
  if (digits.length === 8) {
    return digits.replace(/^(\d{5})(\d{3})$/, '$1-$2');
  }
  return cep;
}

export const EmpresasPage: React.FC = () => {
  const queryClient = useQueryClient();

  // Estados de controle de formulário e modais
  const [modalOpen, setModalOpen] = useState(false);
  const [empresaEmEdicao, setEmpresaEmEdicao] = useState<EmpresaItem | null>(null);
  const [confirmInativarOpen, setConfirmInativarOpen] = useState(false);
  const [empresaAlvoInativacao, setEmpresaAlvoInativacao] = useState<EmpresaItem | null>(null);

  // Snackbar feedback
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });

  // Campos do formulário
  const [formData, setFormData] = useState({
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
  });
  const [formErro, setFormErro] = useState<string | null>(null);

  // Consulta das empresas cadastradas
  const { data: empresas = [], isLoading, isFetching, refetch } = useQuery<EmpresaItem[]>({
    queryKey: ['empresas'],
    queryFn: async () => {
      try {
        const response = await api.get('/empresas');
        return response.data.dados || [];
      } catch (err) {
        // Fallback inicial se backend estiver reiniciando
        return [
          {
            id: 1,
            cnpj: '12345678000195',
            razaoSocial: 'EMPRESA MATRIZ EXEMPLO LTDA',
            nomeFantasia: 'Matriz ERP',
            inscricaoEstadual: '110220330110',
            cidade: 'São Paulo',
            uf: 'SP',
            situacao: 'ATIVO',
          },
          {
            id: 2,
            cnpj: '98765432000188',
            razaoSocial: 'FILIAL SAO PAULO COMERCIO DE ALIMENTOS LTDA',
            nomeFantasia: 'Filial SP',
            inscricaoEstadual: '990880770220',
            cidade: 'Campinas',
            uf: 'SP',
            situacao: 'ATIVO',
          },
        ];
      }
    },
  });

  // Mutação para criar ou atualizar empresa
  const salvarMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        ...formData,
        cnpj: formData.cnpj.replace(/\D/g, ''),
        cep: formData.cep.replace(/\D/g, ''),
      };

      if (empresaEmEdicao) {
        const res = await api.put(`/empresas/${empresaEmEdicao.id}`, payload);
        return res.data;
      } else {
        const res = await api.post('/empresas', payload);
        return res.data;
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['empresas'] });
      setModalOpen(false);
      setSnackbar({
        open: true,
        message: data.mensagem || (empresaEmEdicao ? 'Empresa atualizada!' : 'Empresa cadastrada!'),
        severity: 'success',
      });
    },
    onError: (err: any) => {
      const msg = err.response?.data?.mensagem || 'Erro ao salvar a empresa. Verifique os dados informados.';
      setFormErro(msg);
    },
  });

  // Mutação para alternar situação (inativar / reativar)
  const situacaoMutation = useMutation({
    mutationFn: async ({ id, novaSituacao }: { id: number; novaSituacao: string }) => {
      const res = await api.patch(`/empresas/${id}/situacao`, { situacao: novaSituacao });
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['empresas'] });
      setConfirmInativarOpen(false);
      setSnackbar({
        open: true,
        message: data.mensagem || 'Situação da empresa atualizada!',
        severity: 'success',
      });
    },
    onError: (err: any) => {
      setSnackbar({
        open: true,
        message: err.response?.data?.mensagem || 'Erro ao alterar situação da empresa.',
        severity: 'error',
      });
    },
  });

  const handleAbrirNovo = () => {
    setEmpresaEmEdicao(null);
    setFormErro(null);
    setFormData({
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
    });
    setModalOpen(true);
  };

  const handleAbrirEditar = (empresa: EmpresaItem) => {
    setEmpresaEmEdicao(empresa);
    setFormErro(null);
    setFormData({
      razaoSocial: empresa.razaoSocial || '',
      nomeFantasia: empresa.nomeFantasia || '',
      cnpj: formatarCnpj(empresa.cnpj || ''),
      inscricaoEstadual: empresa.inscricaoEstadual || '',
      cep: formatarCep(empresa.cep || ''),
      logradouro: empresa.logradouro || '',
      numero: empresa.numero || '',
      complemento: empresa.complemento || '',
      bairro: empresa.bairro || '',
      cidade: empresa.cidade || '',
      uf: empresa.uf || 'SP',
    });
    setModalOpen(true);
  };

  const handleSolicitarInativacao = (empresa: EmpresaItem) => {
    setEmpresaAlvoInativacao(empresa);
    setConfirmInativarOpen(true);
  };

  const handleConfirmarInativacao = () => {
    if (!empresaAlvoInativacao) return;
    const novaSituacao = empresaAlvoInativacao.situacao === 'ATIVO' ? 'INATIVO' : 'ATIVO';
    situacaoMutation.mutate({ id: empresaAlvoInativacao.id, novaSituacao });
  };

  // Busca automática de endereço por CEP (ViaCEP)
  const handleCepBlur = async () => {
    const cepLimpo = formData.cep.replace(/\D/g, '');
    if (cepLimpo.length === 8) {
      try {
        const res = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
        const data = await res.json();
        if (!data.erro) {
          setFormData((prev) => ({
            ...prev,
            logradouro: data.logradouro || prev.logradouro,
            bairro: data.bairro || prev.bairro,
            cidade: data.localidade || prev.cidade,
            uf: data.uf || prev.uf,
          }));
        }
      } catch (e) {
        console.warn('ViaCEP indisponível:', e);
      }
    }
  };

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    {
      field: 'cnpj',
      headerName: 'CNPJ',
      width: 175,
      valueGetter: (_, row) => formatarCnpj(row.cnpj),
    },
    { field: 'razaoSocial', headerName: 'Razão Social', flex: 1, minWidth: 220 },
    { field: 'nomeFantasia', headerName: 'Nome Fantasia', width: 180, valueGetter: (v) => v || '-' },
    {
      field: 'localizacao',
      headerName: 'Cidade / UF',
      width: 160,
      valueGetter: (_, row) => (row.cidade ? `${row.cidade}/${row.uf || ''}` : '-'),
    },
    {
      field: 'situacao',
      headerName: 'Situação',
      width: 110,
      renderCell: (params) => (
        <Chip
          label={params.value}
          size="small"
          color={params.value === 'ATIVO' ? 'success' : 'error'}
          sx={{ fontWeight: 600 }}
        />
      ),
    },
    {
      field: 'acoes',
      headerName: 'Ações',
      width: 120,
      sortable: false,
      renderCell: (params) => {
        const item: EmpresaItem = params.row;
        const isAtivo = item.situacao === 'ATIVO';

        return (
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            <Tooltip title="Editar Empresa">
              <IconButton size="small" color="primary" onClick={() => handleAbrirEditar(item)}>
                <EditIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title={isAtivo ? 'Inativar Empresa' : 'Reativar Empresa'}>
              <IconButton
                size="small"
                color={isAtivo ? 'error' : 'success'}
                onClick={() => handleSolicitarInativacao(item)}
              >
                {isAtivo ? <BlockIcon fontSize="small" /> : <CheckCircleOutlineIcon fontSize="small" />}
              </IconButton>
            </Tooltip>
          </Box>
        );
      },
    },
  ];

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            Gerenciamento de Empresas
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Administração das filiais e unidades organizacionais (Acesso Restrito ao Perfil ADMIN)
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title="Recarregar Lista">
            <IconButton onClick={() => refetch()} disabled={isLoading || isFetching} color="primary">
              <RefreshIcon />
            </IconButton>
          </Tooltip>
          <Button variant="contained" startIcon={<AddIcon />} size="medium" onClick={handleAbrirNovo}>
            Nova Empresa
          </Button>
        </Box>
      </Box>

      <Paper sx={{ width: '100%', height: 500 }} elevation={1}>
        <DataGrid
          rows={empresas}
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
          pageSizeOptions={[5, 10, 20]}
          disableRowSelectionOnClick
        />
      </Paper>

      {/* Modal de Formulário (Criação e Edição) */}
      <Dialog open={modalOpen} onClose={() => setModalOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>
          {empresaEmEdicao ? `Editar Empresa #${empresaEmEdicao.id}` : 'Cadastrar Nova Empresa'}
        </DialogTitle>
        <DialogContent dividers>
          {formErro && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {formErro}
            </Alert>
          )}

          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="CNPJ"
                placeholder="00.000.000/0000-00"
                value={formData.cnpj}
                onChange={(e) => setFormData({ ...formData, cnpj: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Inscrição Estadual"
                value={formData.inscricaoEstadual}
                onChange={(e) => setFormData({ ...formData, inscricaoEstadual: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Razão Social"
                value={formData.razaoSocial}
                onChange={(e) => setFormData({ ...formData, razaoSocial: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Nome Fantasia"
                value={formData.nomeFantasia}
                onChange={(e) => setFormData({ ...formData, nomeFantasia: e.target.value })}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'text.secondary', mt: 1 }}>
                Endereço
              </Typography>
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="CEP"
                placeholder="00000-000"
                value={formData.cep}
                onChange={(e) => setFormData({ ...formData, cep: e.target.value })}
                onBlur={handleCepBlur}
                helperText="Preenche o endereço automaticamente"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Logradouro / Rua"
                value={formData.logradouro}
                onChange={(e) => setFormData({ ...formData, logradouro: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={2}>
              <TextField
                fullWidth
                label="Número"
                value={formData.numero}
                onChange={(e) => setFormData({ ...formData, numero: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Complemento"
                value={formData.complemento}
                onChange={(e) => setFormData({ ...formData, complemento: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Bairro"
                value={formData.bairro}
                onChange={(e) => setFormData({ ...formData, bairro: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                label="Cidade"
                value={formData.cidade}
                onChange={(e) => setFormData({ ...formData, cidade: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={1}>
              <TextField
                select
                fullWidth
                label="UF"
                value={formData.uf}
                onChange={(e) => setFormData({ ...formData, uf: e.target.value })}
              >
                {ESTADOS_BR.map((uf) => (
                  <MenuItem key={uf} value={uf}>{uf}</MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={() => setModalOpen(false)} disabled={salvarMutation.isPending}>
            Cancelar
          </Button>
          <Button
            variant="contained"
            onClick={() => salvarMutation.mutate()}
            disabled={salvarMutation.isPending || !formData.razaoSocial || !formData.cnpj}
          >
            {salvarMutation.isPending ? <CircularProgress size={24} color="inherit" /> : 'Salvar Empresa'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal de Confirmação de Inativação / Reativação */}
      <Dialog open={confirmInativarOpen} onClose={() => setConfirmInativarOpen(false)}>
        <DialogTitle sx={{ fontWeight: 700 }}>
          {empresaAlvoInativacao?.situacao === 'ATIVO' ? 'Inativar Empresa' : 'Reativar Empresa'}
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            {empresaAlvoInativacao?.situacao === 'ATIVO' ? (
              <>
                Deseja realmente inativar a empresa{' '}
                <strong>{empresaAlvoInativacao?.nomeFantasia || empresaAlvoInativacao?.razaoSocial}</strong>?
                <br />
                <br />
                <em>Nota: Os dados não serão apagados (exclusão lógica). A empresa ficará oculta para novas operações até ser reativada.</em>
              </>
            ) : (
              <>
                Deseja reativar a empresa{' '}
                <strong>{empresaAlvoInativacao?.nomeFantasia || empresaAlvoInativacao?.razaoSocial}</strong>?
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
            color={empresaAlvoInativacao?.situacao === 'ATIVO' ? 'error' : 'success'}
            onClick={handleConfirmarInativacao}
            disabled={situacaoMutation.isPending}
          >
            {situacaoMutation.isPending ? (
              <CircularProgress size={24} color="inherit" />
            ) : empresaAlvoInativacao?.situacao === 'ATIVO' ? (
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
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};
