import React, { useState, useMemo } from 'react';
import {
  Box,
  Button,
  Chip,
  Alert,
  IconButton,
  Tooltip,
  TextField,
  MenuItem,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RefreshIcon from '@mui/icons-material/Refresh';
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

interface ClientesPageProps {
  iniciarPesquisando?: boolean;
}

export const ClientesPage: React.FC<ClientesPageProps> = ({
  iniciarPesquisando = true,
}) => {
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

  // Estado para controlar se a busca no backend está habilitada
  const [pesquisaHabilitada, setPesquisaHabilitada] = useState<boolean>(iniciarPesquisando);

  // Hook de paginação persistida com padrão de 10 registros
  const {
    paginationModel,
    handlePaginationModelChange,
    resetPage,
  } = useTablePagination('clientes_pagination', 10);

  const handleFiltroTermoChange = (valor: string) => {
    setFiltroTermo(valor);
    sessionStorage.setItem('clientes_filtro_termo', valor);
  };

  const handleFiltroSituacaoChange = (valor: SituacaoFiltro) => {
    setFiltroSituacao(valor);
    sessionStorage.setItem('clientes_filtro_situacao', valor);
    resetPage();
  };

  // Consulta paginada com o backend
  const {
    data: responseDados,
    isLoading,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: [
      'clientes',
      empresaAtiva?.id,
      paginationModel.page,
      paginationModel.pageSize,
    ],
    queryFn: async () => {
      const response = await api.get(
        `/clientes?page=${paginationModel.page}&size=${paginationModel.pageSize}&sortProperty=id&sortDirection=DESC`
      );
      return response.data?.dados;
    },
    enabled: !!empresaAtiva && pesquisaHabilitada,
  });

  // Extração das linhas da página atual
  const clientesDaPagina = useMemo<ClienteItem[]>(() => {
    const dados = responseDados;
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
  }, [responseDados]);

  // Total de registros no backend para controle da barra de paginação do servidor
  const totalClientes = useMemo<number>(() => {
    const dados = responseDados;
    if (dados && typeof dados.totalElements === 'number') {
      return dados.totalElements;
    }
    return clientesDaPagina.length;
  }, [responseDados, clientesDaPagina.length]);

  // Filtro local na tabela (pesquisa na tabela toda de forma local)
  const listaClientesFiltrados = useMemo(() => {
    return clientesDaPagina.filter((c) => {
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
  }, [clientesDaPagina, filtroTermo, filtroSituacao]);

  // Colunas do DataGrid (com ID Chip clicável)
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
              <IconButton
                onClick={() => {
                  refetch();
                }}
                disabled={isLoading || isFetching}
                color="primary"
              >
                <RefreshIcon />
              </IconButton>
            </Tooltip>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              size="medium"
              onClick={() => {
                navigate('/clientes/novo');
              }}
            >
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

      {/* Tabela Reutilizável com Barra de Pesquisa Padronizada, Paginação com Backend e iniciarPesquisando */}
      <AppDataTable
        rows={listaClientesFiltrados}
        columns={columns}
        loading={isLoading || isFetching}
        rowCount={totalClientes}
        paginationMode="server"
        paginationModel={paginationModel}
        onPaginationModelChange={(model) => {
          handlePaginationModelChange(model, isLoading || isFetching || clientesDaPagina.length === 0);
        }}
        searchPlaceholder="Pesquisar por Razão Social, Nome Fantasia ou CPF/CNPJ..."
        searchValue={filtroTermo}
        onSearchChange={handleFiltroTermoChange}
        extraFilters={
          <TextField
            select
            fullWidth
            size="small"
            label="Situação"
            value={filtroSituacao}
            onChange={(e) => {
              handleFiltroSituacaoChange(e.target.value as SituacaoFiltro);
            }}
          >
            <MenuItem value="TODOS">Todos</MenuItem>
            <MenuItem value="ATIVO">Apenas Ativos</MenuItem>
            <MenuItem value="INATIVO">Apenas Inativos</MenuItem>
          </TextField>
        }
        onPesquisar={() => {
          setPesquisaHabilitada(true);
          refetch();
        }}
        iniciarPesquisando={false}
      />
    </Box>
  );
};

export default ClientesPage;
