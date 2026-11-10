import React from 'react';
import { FormControl, Select, MenuItem, SelectChangeEvent, Box, Typography } from '@mui/material';
import BusinessIcon from '@mui/icons-material/Business';
import { useAuth } from '../../context/AuthContext';

export const ActiveCompanySelector: React.FC = () => {
  const { usuario, empresaAtiva, selecionarEmpresa } = useAuth();

  if (!usuario || !empresaAtiva || !usuario.empresas || usuario.empresas.length === 0) {
    return null;
  }

  const handleChange = (event: SelectChangeEvent<number>) => {
    selecionarEmpresa(Number(event.target.value));
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', bgcolor: 'rgba(255, 255, 255, 0.15)', px: 1.5, py: 0.5, borderRadius: 1.5 }}>
      <BusinessIcon sx={{ mr: 1, color: '#ffffff', fontSize: 20 }} />
      <FormControl size="small" variant="standard" sx={{ minWidth: 200 }}>
        <Select
          value={empresaAtiva.id}
          onChange={handleChange}
          disableUnderline
          sx={{
            color: '#ffffff',
            fontWeight: 500,
            fontSize: '0.875rem',
            '& .MuiSelect-icon': { color: '#ffffff' },
          }}
        >
          {usuario.empresas.map((emp) => (
            <MenuItem key={emp.id} value={emp.id}>
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  {emp.nomeFantasia || emp.razaoSocial}
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  CNPJ: {emp.cnpj}
                </Typography>
              </Box>
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};
