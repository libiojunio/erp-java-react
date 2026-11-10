import React from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Chip,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useAuth } from '../context/AuthContext';

export const ClientesPage: React.FC = () => {
  const { empresaAtiva } = useAuth();

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 80 },
    { field: 'tipoPessoa', headerName: 'Tipo', width: 90, renderCell: (params) => (
      <Chip label={params.value} size="small" color={params.value === 'PJ' ? 'primary' : 'default'} />
    )},
    { field: 'documento', headerName: 'CPF / CNPJ', width: 170 },
    { field: 'nomeRazaoSocial', headerName: 'Nome / Razão Social', flex: 1, minWidth: 220 },
    { field: 'nomeFantasia', headerName: 'Nome Fantasia', width: 180 },
    { field: 'email', headerName: 'E-mail', width: 200 },
    { field: 'telefone', headerName: 'Telefone', width: 140 },
    { field: 'situacao', headerName: 'Situação', width: 120, renderCell: (params) => (
      <Chip
        label={params.value}
        size="small"
        color={params.value === 'ATIVO' ? 'success' : 'error'}
      />
    )},
  ];

  // Placeholder rows demonstrando a estrutura do Data Grid
  const rows = [
    {
      id: 1,
      tipoPessoa: 'PJ',
      documento: '11.222.333/0001-44',
      nomeRazaoSocial: 'DISTRIBUIDORA NACIONAL DE ALIMENTOS LTDA',
      nomeFantasia: 'Nacional Alimentos',
      email: 'contato@nacionalalimentos.com.br',
      telefone: '(11) 3456-7890',
      situacao: 'ATIVO',
    },
    {
      id: 2,
      tipoPessoa: 'PF',
      documento: '123.456.789-00',
      nomeRazaoSocial: 'Carlos Alberto de Souza',
      nomeFantasia: '',
      email: 'carlos.souza@gmail.com',
      telefone: '(11) 98765-4321',
      situacao: 'ATIVO',
    },
  ];

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            Cadastro de Clientes
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Empresa ativa: <strong>{empresaAtiva?.nomeFantasia || empresaAtiva?.razaoSocial}</strong> (Isolamento por TenantId)
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} size="large">
          Novo Cliente
        </Button>
      </Box>

      <Paper sx={{ width: '100%', height: 500 }} elevation={1}>
        <DataGrid
          rows={rows}
          columns={columns}
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
