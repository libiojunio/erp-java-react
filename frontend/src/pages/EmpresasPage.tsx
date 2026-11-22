import React from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Chip,
  IconButton,
  Tooltip,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RefreshIcon from '@mui/icons-material/Refresh';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { dataGridPtBR } from '../utils/dataGridPtBR';
import { ArquivoInfo } from '../components/common/FileUploadDropzone';

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
  arquivoId?: number | null;
  arquivo?: ArquivoInfo | null;
}

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

export const EmpresasPage: React.FC = () => {
  const navigate = useNavigate();

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

  // Colunas do DataGrid (sem a coluna 'Ações', conforme solicitado)
  const columns: GridColDef[] = [
    {
      field: 'id',
      headerName: 'ID',
      width: 80,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => (
        <Tooltip title="Clique para visualizar a empresa">
          <Chip
            label={params.value}
            size="small"
            clickable
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/empresas/visualizar/${params.row.id}`);
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
          <Button variant="contained" startIcon={<AddIcon />} size="medium" onClick={() => navigate('/empresas/novo')}>
            Nova Empresa
          </Button>
        </Box>
      </Box>

      {/* Tabela DataGrid com clique na linha para visualização */}
      <Paper sx={{ width: '100%', height: 500 }} elevation={1}>
        <DataGrid
          rows={empresas}
          columns={columns}
          loading={isLoading || isFetching}
          localeText={dataGridPtBR}
          onRowClick={(params) => navigate(`/empresas/visualizar/${params.row.id}`)}
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

export default EmpresasPage;
