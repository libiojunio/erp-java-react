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

export const EmpresasPage: React.FC = () => {
  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 80 },
    { field: 'cnpj', headerName: 'CNPJ', width: 180 },
    { field: 'razaoSocial', headerName: 'Razão Social', flex: 1, minWidth: 250 },
    { field: 'nomeFantasia', headerName: 'Nome Fantasia', width: 200 },
    { field: 'inscricaoEstadual', headerName: 'Inscrição Estadual', width: 160 },
    { field: 'situacao', headerName: 'Situação', width: 120, renderCell: (params) => (
      <Chip
        label={params.value}
        size="small"
        color={params.value === 'ATIVO' ? 'success' : 'error'}
      />
    )},
  ];

  const rows = [
    {
      id: 1,
      cnpj: '12.345.678/0001-95',
      razaoSocial: 'EMPRESA MATRIZ EXEMPLO LTDA',
      nomeFantasia: 'Matriz ERP',
      inscricaoEstadual: '123.456.789.000',
      situacao: 'ATIVO',
    },
    {
      id: 2,
      cnpj: '98.765.432/0001-88',
      razaoSocial: 'FILIAL SAO PAULO COMERCIO LTDA',
      nomeFantasia: 'Filial SP',
      inscricaoEstadual: '987.654.321.000',
      situacao: 'ATIVO',
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
            Administração das unidades e filiais da organização (Restrito a ADMIN)
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} size="large">
          Nova Empresa
        </Button>
      </Box>

      <Paper sx={{ width: '100%', height: 450 }} elevation={1}>
        <DataGrid
          rows={rows}
          columns={columns}
          initialState={{
            pagination: { paginationModel: { pageSize: 10 } },
          }}
          pageSizeOptions={[5, 10, 20]}
          disableRowSelectionOnClick
        />
      </Paper>
    </Box>
  );
};
