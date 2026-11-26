import React from 'react';
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

export const EmpresasPage: React.FC = () => {
  const navigate = useNavigate();

  // Hook reutilizável de paginação com persistência em sessionStorage
  const {
    paginationModel,
    handlePaginationModelChange,
  } = useTablePagination('empresas_pagination');

  // Consulta das empresas cadastradas
  const { data: empresas = [], isLoading, isFetching, refetch } = useQuery<EmpresaItem[]>({
    queryKey: ['empresas'],
    queryFn: async () => {
      try {
        const response = await api.get('/empresas?sortProperty=id&sortDirection=DESC');
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
      } catch (err) {
        return [
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
        ];
      }
    },
  });

  // Colunas do DataGrid (sem a coluna 'Ações', com ID Chip clicável)
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
              <IconButton onClick={() => refetch()} disabled={isLoading || isFetching} color="primary">
                <RefreshIcon />
              </IconButton>
            </Tooltip>
            <Button variant="contained" startIcon={<AddIcon />} size="medium" onClick={() => navigate('/empresas/novo')}>
              Nova Empresa
            </Button>
          </>
        }
      />

      {/* Tabela Reutilizável com clique apenas no Chip do ID */}
      <AppDataTable
        rows={empresas}
        columns={columns}
        loading={isLoading || isFetching}
        paginationModel={paginationModel}
        onPaginationModelChange={(model) => {
          handlePaginationModelChange(model, isLoading || isFetching || empresas.length === 0);
        }}
      />
    </Box>
  );
};

export default EmpresasPage;
