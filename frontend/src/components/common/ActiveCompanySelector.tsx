import React, { useState } from 'react';
import { FormControl, Select, MenuItem, SelectChangeEvent, Box, Typography, CircularProgress } from '@mui/material';
import BusinessIcon from '@mui/icons-material/Business';
import { useAuth } from '../../context/AuthContext';

export const ActiveCompanySelector: React.FC = () => {
  const { empresaAtiva, empresas, selecionarEmpresa } = useAuth();
  const [loading, setLoading] = useState(false);

  if (!empresaAtiva || !empresas || empresas.length === 0) {
    return null;
  }

  const handleChange = async (event: SelectChangeEvent<number>) => {
    const novoId = Number(event.target.value);
    if (novoId === empresaAtiva.id) return;

    setLoading(true);
    try {
      await selecionarEmpresa(novoId);
    } catch (err) {
      console.error('Falha ao alterar empresa ativa:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', bgcolor: 'rgba(255, 255, 255, 0.15)', px: 1.5, py: 0.5, borderRadius: 1.5 }}>
      <BusinessIcon sx={{ mr: 1, color: '#ffffff', fontSize: 20 }} />
      {loading ? (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 2 }}>
          <CircularProgress size={16} sx={{ color: '#ffffff' }} />
          <Typography variant="caption" sx={{ color: '#ffffff' }}>Trocando...</Typography>
        </Box>
      ) : (
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
            {empresas.map((emp) => (
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
      )}
    </Box>
  );
};
