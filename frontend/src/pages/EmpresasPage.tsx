import React, { useState, useMemo } from 'react';
import {
  Box,
  Button,
  Chip,
  IconButton,
  Tooltip,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RefreshIcon from '@mui/icons-material/Refresh';
import { GridColDef } from '@mui/x-data-grid';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { EmpresaItem } from '../types';
import { useTablePagination } from '../hooks/useTablePagination';
import { AppDataTable } from '../components/table/AppDataTable';
import { IdChip } from '../components/table/IdChip';
import { PageHeader } from '../components/layout/PageHeader';
import { formatarCnpj } from '../utils/documentos';

interface EmpresasPageProps {
  iniciarPesquisando?: boolean;
}

export const EmpresasPage: React.FC<EmpresasPageProps> = ({
  iniciarPesquisando = true,
}) => {
  const navigate = useNavigate();

  // Estado para termo de busca local
  const [filtroTermo, setFiltroTermo] = useState<string>('');

  // Estado para controlar se a consulta ao backend está habilitada
  const [pesquisaHabilitada, setPesquisaHabilitada] = useState<boolean>(iniciarPesquisando);

  // Hook de paginação persistida com padrão de 10 registros
  const {
    paginationModel,
    handlePaginationModelChange,
  } = useTablePagination('empresas_pagination', 10);

  // Consulta paginada com o backend
  const {
    data: responseDados,
    isLoading,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ['empresas', paginationModel.page, paginationModel.pageSize],
    queryFn: async () => {
      try {
        const response = await api.get(
          `/empresas?page=${paginationModel.page}&size=${paginationModel.pageSize}&sortProperty=id&sortDirection=DESC`
        );
        return response.data?.dados;
      } catch (err) {
        return null;
      }
    },
    enabled: pesquisaHabilitada,
  });

  // Extração das linhas da página atual
  const empresasDaPagina = useMemo<EmpresaItem[]>(() => {
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

  // Total de registros no backend para a paginação do servidor
  const totalEmpresas = useMemo<number>(() => {
    const dados = responseDados;
    if (dados && typeof dados.totalElements === 'number') {
      return dados.totalElements;
    }
    return empresasDaPagina.length;
  }, [responseDados, empresasDaPagina.length]);

  // Filtro local na tabela (pesquisa na tabela de forma local)
  const empresasExibidas = useMemo(() => {
    if (!filtroTermo.trim()) {
      return empresasDaPagina;
    }
    const termo = filtroTermo.toLowerCase().trim();
    const termoNumerico = termo.replace(/\D/g, '');

    return empresasDaPagina.filter((emp) => {
      const razao = (emp.razaoSocial || '').toLowerCase();
      const fantasia = (emp.nomeFantasia || '').toLowerCase();
      const cnpj = (emp.cnpj || '').replace(/\D/g, '');
      const cidade = (emp.cidade || '').toLowerCase();

      const matchTexto = razao.includes(termo) || fantasia.includes(termo) || cidade.includes(termo);
      const matchCnpj = termoNumerico.length > 0 && cnpj.includes(termoNumerico);

      return matchTexto || matchCnpj;
    });
  }, [empresasDaPagina, filtroTermo]);

  // Colunas do DataGrid (com ID Chip clicável)
  const columns: GridColDef<EmpresaItem>[] = [
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
            navigate(`/empresas/visualizar/${params.row.id}`);
          }}
          tooltip="Clique para visualizar a empresa"
        />
      ),
    },
    {
      field: 'cnpj',
      headerName: 'CNPJ',
      width: 175,
      valueGetter: (_, row) => {
        return formatarCnpj(row.cnpj);
      },
    },
    { field: 'razaoSocial', headerName: 'Razão Social', flex: 1, minWidth: 220 },
    {
      field: 'nomeFantasia',
      headerName: 'Nome Fantasia',
      width: 180,
      valueGetter: (v) => {
        return v || '-';
      },
    },
    {
      field: 'localizacao',
      headerName: 'Cidade / UF',
      width: 160,
      valueGetter: (_, row) => {
        if (row.cidade) {
          return `${row.cidade}/${row.uf || ''}`;
        }
        return '-';
      },
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
  ];

  return (
    <Box>
      {/* Cabeçalho Reutilizável */}
      <PageHeader
        title="Gerenciamento de Empresas"
        subtitle="Administração das filiais e unidades organizacionais (Acesso Restrito ao Perfil ADMIN)"
        actions={
          <>
            <Tooltip title="Recarregar Lista">
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
                navigate('/empresas/novo');
              }}
            >
              Nova Empresa
            </Button>
          </>
        }
      />

      {/* Tabela Reutilizável com Barra de Pesquisa Padronizada, Paginação com Backend e iniciarPesquisando */}
      <AppDataTable
        rows={empresasExibidas}
        columns={columns}
        loading={isLoading || isFetching}
        rowCount={totalEmpresas}
        paginationMode="server"
        paginationModel={paginationModel}
        onPaginationModelChange={(model) => {
          handlePaginationModelChange(model, isLoading || isFetching || empresasDaPagina.length === 0);
        }}
        searchPlaceholder="Pesquisar por Razão Social, Nome Fantasia ou CNPJ..."
        searchValue={filtroTermo}
        onSearchChange={setFiltroTermo}
        onPesquisar={() => {
          setPesquisaHabilitada(true);
          refetch();
        }}
        iniciarPesquisando={iniciarPesquisando}
      />
    </Box>
  );
};

export default EmpresasPage;
