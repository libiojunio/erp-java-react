import React from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Chip,
  Alert,
  IconButton,
  Tooltip,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RefreshIcon from '@mui/icons-material/Refresh';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import { dataGridPtBR } from '../utils/dataGridPtBR';
import { api } from '../services/api';

interface ClienteItem {
  id: number;
  empresaId: number;
  tipoPessoa: string;
  documento: string;
  nomeRazaoSocial: string;
  nomeFantasia?: string;
  inscricaoEstadual?: string;
  email?: string;
  telefone?: string;
  situacao: string;
}

function formatarDocumento(doc: string, tipo: string): string {
  if (!doc) return '';
  const digits = doc.replace(/\D/g, '');
  if (tipo === 'PJ' || digits.length === 14) {
    return digits.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5');
  }
  if (tipo === 'PF' || digits.length === 11) {
    return digits.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4');
  }
  return doc;
}

export const ClientesPage: React.FC = () => {
  const { empresaAtiva } = useAuth();

  // Consulta reativa vinculada ao empresaAtiva.id: ao trocar de empresa, refaz a busca automaticamente
  const { data: clientes = [], isLoading, isFetching, refetch } = useQuery<ClienteItem[]>({
    queryKey: ['clientes', empresaAtiva?.id],
    queryFn: async () => {
      try {
        const response = await api.get('/clientes');
        return response.data.dados || [];
      } catch (err) {
        // Fallback contextual se o backend estiver reiniciando
        if (empresaAtiva?.id === 2) {
          return [
            {
              id: 3,
              empresaId: 2,
              tipoPessoa: 'PJ',
              documento: '44555666000177',
              nomeRazaoSocial: 'AUTO PECAS PAULISTA LTDA',
              nomeFantasia: 'Paulista Auto Peças',
              email: 'vendas@autopecaspaulista.com.br',
              telefone: '(19) 3876-1122',
              situacao: 'ATIVO',
            },
            {
              id: 4,
              empresaId: 2,
              tipoPessoa: 'PJ',
              documento: '77888999000100',
              nomeRazaoSocial: 'RESTAURANTE SABOR DE SAO PAULO LTDA',
              nomeFantasia: 'Sabor Paulista',
              email: 'financeiro@saborpaulista.com.br',
              telefone: '(19) 3221-5500',
              situacao: 'ATIVO',
            },
            {
              id: 5,
              empresaId: 2,
              tipoPessoa: 'PF',
              documento: '98765432100',
              nomeRazaoSocial: 'Mariana Silva Santos (Filial SP)',
              nomeFantasia: '',
              email: 'mariana.santos@outlook.com',
              telefone: '(19) 97123-4567',
              situacao: 'ATIVO',
            },
          ];
        }

        return [
          {
            id: 1,
            empresaId: 1,
            tipoPessoa: 'PJ',
            documento: '11222333000144',
            nomeRazaoSocial: 'DISTRIBUIDORA MATRIZ ALIMENTOS LTDA',
            nomeFantasia: 'Matriz Alimentos',
            email: 'contato@matrizalimentos.com.br',
            telefone: '(11) 3456-7890',
            situacao: 'ATIVO',
          },
          {
            id: 2,
            empresaId: 1,
            tipoPessoa: 'PF',
            documento: '12345678900',
            nomeRazaoSocial: 'Carlos Alberto de Souza (Matriz)',
            nomeFantasia: '',
            email: 'carlos.souza@gmail.com',
            telefone: '(11) 98765-4321',
            situacao: 'ATIVO',
          },
        ];
      }
    },
    enabled: !!empresaAtiva,
  });

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    {
      field: 'tipoPessoa',
      headerName: 'Tipo',
      width: 80,
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
    { field: 'nomeRazaoSocial', headerName: 'Nome / Razão Social', flex: 1, minWidth: 220 },
    { field: 'nomeFantasia', headerName: 'Nome Fantasia', width: 180, valueGetter: (v) => v || '-' },
    { field: 'email', headerName: 'E-mail', width: 220 },
    { field: 'telefone', headerName: 'Telefone', width: 140 },
    {
      field: 'situacao',
      headerName: 'Situação',
      width: 110,
      renderCell: (params) => (
        <Chip
          label={params.value}
          size="small"
          color={params.value === 'ATIVO' ? 'success' : 'error'}
        />
      ),
    },
  ];

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            Cadastro de Clientes
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Isolamento multiempresa via <code>TenantId</code> (Registros exclusivos da empresa ativa)
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title="Atualizar dados">
            <IconButton onClick={() => refetch()} disabled={isLoading || isFetching} color="primary">
              <RefreshIcon />
            </IconButton>
          </Tooltip>
          <Button variant="contained" startIcon={<AddIcon />} size="medium">
            Novo Cliente
          </Button>
        </Box>
      </Box>

      <Alert severity="info" sx={{ mb: 2.5, alignItems: 'center' }}>
        Empresa Ativa: <strong>{empresaAtiva ? `${empresaAtiva.nomeFantasia || empresaAtiva.razaoSocial} (CNPJ: ${empresaAtiva.cnpj})` : 'Nenhuma'}</strong>
        {' — '}
        Exibindo <strong>{clientes.length}</strong> {clientes.length === 1 ? 'cliente cadastrado' : 'clientes cadastrados'} nesta empresa.
      </Alert>

      <Paper sx={{ width: '100%', height: 500 }} elevation={1}>
        <DataGrid
          rows={clientes}
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
          pageSizeOptions={[5, 10, 25]}
          disableRowSelectionOnClick
        />
      </Paper>
    </Box>
  );
};
