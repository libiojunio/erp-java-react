import React, { useState, useMemo } from 'react';
import {
  Box,
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
import { GridColDef } from '@mui/x-data-grid';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { ClienteItem, SituacaoFiltro } from '../types';
import { useTablePagination } from '../hooks/useTablePagination';
import { AppDataTable } from '../components/table/AppDataTable';
import { IdChip } from '../components/table/IdChip';
import { PageHeader } from '../components/layout/PageHeader';
import {
  formatarCnpj,
  formatarDocumento,
  formatarTelefone,
} from '../utils/documentos';

export const ClientesPage: React.FC = () => {
  const { empresaAtiva } = useAuth();
  const navigate = useNavigate();

  // Estados de filtros persistidos na sessão
  const [filtroTermo, setFiltroTermo] = useState<string>(() => {
    return sessionStorage.getItem('clientes_filtro_termo') || '';
  });
  const [filtroSituacao, setFiltroSituacao] = useState<SituacaoFiltro>(() => {
    const salvo = sessionStorage.getItem('clientes_filtro_situacao');
    if (salvo === 'ATIVO' || salvo === 'INATIVO' || salvo === 'TODOS') {
      return salvo;
    }
    return 'TODOS';
  });

  // Hook reutilizável de paginação com persistência em sessionStorage
  const {
    paginationModel,
    handlePaginationModelChange,
    resetPage,
  } = useTablePagination('clientes_pagination');

  const handleFiltroTermoChange = (valor: string) => {
    setFiltroTermo(valor);
    sessionStorage.setItem('clientes_filtro_termo', valor);
    resetPage();
  };

  const handleFiltroSituacaoChange = (valor: SituacaoFiltro) => {
    setFiltroSituacao(valor);
    sessionStorage.setItem('clientes_filtro_situacao', valor);
    resetPage();
  };

  // Consulta de clientes da empresa ativa
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

  // Colunas do DataGrid (sem a coluna 'Ações', com ID Chip clicável)
  const columns: GridColDef<ClienteItem>[] = [
    {
      field: 'id',
      headerName: 'ID',
      width: 80,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => (
        <IdChip
          id={params.value}
          onClick={() => {
            navigate(`/clientes/visualizar/${params.row.id}`);
          }}
          tooltip="Clique para visualizar o cliente"
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
      valueGetter: (_, row) => {
        return formatarDocumento(row.documento, row.tipoPessoa);
      },
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
      valueGetter: (v) => {
        return v || '-';
      },
    },
    {
      field: 'cidadeUf',
      headerName: 'Cidade / UF',
      width: 140,
      valueGetter: (_, row) => {
        const principal = row.enderecos?.find((e: any) => {
          return e.tipo === 'PRINCIPAL';
        }) || row.enderecos?.[0];
        if (principal) {
          return `${principal.cidade}/${principal.uf}`;
        }
        return '-';
      },
    },
    {
      field: 'email',
      headerName: 'E-mail',
      width: 190,
      valueGetter: (v) => {
        return v || '-';
      },
    },
    {
      field: 'telefone',
      headerName: 'Telefone',
      width: 140,
      valueGetter: (v) => {
        if (v) {
          return formatarTelefone(v);
        }
        return '-';
      },
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
      {/* Cabeçalho Reutilizável */}
      <PageHeader
        title="Cadastro de Clientes"
        subtitle="Gestão unificada de clientes (Pessoa Física e Jurídica) com isolamento multiempresa"
        actions={
          <>
            <Tooltip title="Recarregar clientes">
              <IconButton onClick={() => refetch()} disabled={isLoading || isFetching} color="primary">
                <RefreshIcon />
              </IconButton>
            </Tooltip>
            <Button variant="contained" startIcon={<AddIcon />} size="medium" onClick={() => navigate('/clientes/novo')}>
              Novo Cliente
            </Button>
          </>
        }
      />

      {/* Alerta de contexto da empresa */}
      <Alert severity="info" sx={{ mb: 2.5, alignItems: 'center' }}>
        Empresa Ativa:{' '}
        <strong>
          {empresaAtiva
            ? `${empresaAtiva.nomeFantasia || empresaAtiva.razaoSocial} (CNPJ: ${formatarCnpj(empresaAtiva.cnpj)})`
            : 'Nenhuma selecionada'}
        </strong>
      </Alert>

      {/* Barra de Filtros */}
      <Paper sx={{ p: 2, mb: 3 }} elevation={1}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={8} md={9}>
            <TextField
              fullWidth
              size="small"
              placeholder="Pesquisar por Razão Social, Nome Fantasia ou CPF/CNPJ..."
              value={filtroTermo}
              onChange={(e) => handleFiltroTermoChange(e.target.value)}
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
              onChange={(e) => handleFiltroSituacaoChange(e.target.value as SituacaoFiltro)}
            >
              <MenuItem value="TODOS">Todos</MenuItem>
              <MenuItem value="ATIVO">Apenas Ativos</MenuItem>
              <MenuItem value="INATIVO">Apenas Inativos</MenuItem>
            </TextField>
          </Grid>
        </Grid>
      </Paper>

      {/* Tabela Reutilizável com clique apenas no Chip do ID */}
      <AppDataTable
        rows={listaClientes}
        columns={columns}
        loading={isLoading || isFetching}
        paginationModel={paginationModel}
        onPaginationModelChange={(model) => {
          handlePaginationModelChange(model, isLoading || isFetching || listaClientes.length === 0);
        }}
      />
    </Box>
  );
};

export default ClientesPage;
