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
  TextField,
  Grid,
  MenuItem,
  InputAdornment,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RefreshIcon from '@mui/icons-material/Refresh';
import SearchIcon from '@mui/icons-material/Search';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { dataGridPtBR } from '../utils/dataGridPtBR';
import { api } from '../services/api';
import {
  formatarCnpj,
  formatarDocumento,
  formatarTelefone,
} from '../utils/documentos';

interface EndereçoForm {
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

interface ClienteItem {
  id: number;
  tipoPessoa: 'PF' | 'PJ';
  documento: string;
  nomeRazaoSocial: string;
  nomeFantasia?: string;
  inscricaoEstadual?: string;
  dataNascimento?: string;
  email?: string;
  telefone?: string;
  situacao: string;
  empresaId: number;
  enderecos?: EndereçoForm[];
  contatos?: ContatoForm[];
}

export const ClientesPage: React.FC = () => {
  const { empresaAtiva } = useAuth();
  const navigate = useNavigate();

  // Estados de filtros
  const [filtroTermo, setFiltroTermo] = useState('');
  const [filtroSituacao, setFiltroSituacao] = useState<'TODOS' | 'ATIVO' | 'INATIVO'>('TODOS');

  // Consulta de clientes
  const {
    data: clientes = [],
    isLoading,
    isFetching,
    refetch,
  } = useQuery<ClienteItem[]>({
    queryKey: ['clientes', empresaAtiva?.id],
    queryFn: async () => {
      const response = await api.get('/clientes?sortProperty=id&sortDirection=DESC');
      const dados = response.data?.dados;
      if (Array.isArray(dados)) {
        return dados;
      }
      if (dados && Array.isArray(dados.content)) {
        return dados.content;
      }
      if (dados && Array.isArray(dados.conteudo)) {
        return dados.conteudo;
      }
      return [];
    },
    enabled: !!empresaAtiva,
  });

  // Filtro em memória
  const listaClientes = useMemo(() => {
    if (!Array.isArray(clientes)) {
      return [];
    }
    return clientes.filter((c) => {
      if (filtroSituacao !== 'TODOS' && c.situacao !== filtroSituacao) {
        return false;
      }
      if (filtroTermo.trim()) {
        const termo = filtroTermo.toLowerCase().trim();
        const razao = (c.nomeRazaoSocial || '').toLowerCase();
        const fantasia = (c.nomeFantasia || '').toLowerCase();
        const doc = (c.documento || '').replace(/\D/g, '');
        const termoNumerico = termo.replace(/\D/g, '');

        const matchNome = razao.includes(termo) || fantasia.includes(termo);
        const matchDoc = termoNumerico.length > 0 && doc.includes(termoNumerico);

        return matchNome || matchDoc;
      }
      return true;
    });
  }, [clientes, filtroTermo, filtroSituacao]);

  // Colunas do DataGrid (sem a coluna 'Ações', conforme solicitado)
  const columns: GridColDef[] = [
    {
      field: 'id',
      headerName: 'ID',
      width: 80,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => (
        <Tooltip title="Clique para visualizar o cliente">
          <Chip
            label={params.value}
            size="small"
            clickable
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/clientes/visualizar/${params.row.id}`);
            }}
            sx={{
              bgcolor: '#e0e0e0',
              color: '#424242',
              fontWeight: 700,
              borderRadius: '16px',
              minWidth: 32,
              height: 24,
              cursor: 'pointer',
              '&:hover': {
                bgcolor: '#bdbdbd',
              },
            }}
          />
        </Tooltip>
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
  ];

  if (!empresaAtiva) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="warning">
          Nenhuma empresa ativa selecionada no contexto. Por favor, selecione uma empresa no cabeçalho superior para gerenciar os clientes.
        </Alert>
      </Box>
    );
  }

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
          <Button variant="contained" startIcon={<AddIcon />} size="medium" onClick={() => navigate('/clientes/novo')}>
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

      {/* Tabela DataGrid com clique na linha para visualizar */}
      <Paper sx={{ width: '100%', height: 530 }} elevation={1}>
        <DataGrid
          rows={listaClientes}
          columns={columns}
          loading={isLoading || isFetching}
          localeText={dataGridPtBR}
          onRowClick={(params) => navigate(`/clientes/visualizar/${params.row.id}`)}
          sx={{
            '& .MuiDataGrid-row': {
              cursor: 'pointer',
              '&:hover': {
                bgcolor: 'action.hover',
              },
            },
            '& .MuiTablePagination-toolbar': {
              paddingLeft: 2,
            },
            '& .MuiTablePagination-spacer': {
              flex: '1 1 auto',
              order: 2,
            },
            '& .MuiTablePagination-selectLabel': {
              order: 0,
              margin: 0,
              marginRight: 1,
            },
            '& .MuiTablePagination-input': {
              order: 1,
              marginRight: 2,
            },
            '& .MuiTablePagination-displayedRows': {
              order: 3,
            },
            '& .MuiTablePagination-actions': {
              order: 4,
            },
          }}
          slotProps={{
            pagination: {
              labelRowsPerPage: 'Registros por página:',
            },
          }}
          initialState={{
            sorting: { sortModel: [{ field: 'id', sort: 'desc' }] },
            pagination: { paginationModel: { pageSize: 10 } },
          }}
          pageSizeOptions={[10, 20, 50, 100, 200]}
          disableRowSelectionOnClick
        />
      </Paper>
    </Box>
  );
};

export default ClientesPage;
