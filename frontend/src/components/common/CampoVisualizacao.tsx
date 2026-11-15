import React from 'react';
import { Box, Typography } from '@mui/material';

interface CampoVisualizacaoProps {
  label: string;
  valor?: string | number | null;
  children?: React.ReactNode;
}

export const CampoVisualizacao: React.FC<CampoVisualizacaoProps> = ({
  label,
  valor,
  children,
}) => {
  if (children) {
    return (
      <Box sx={{ mb: 1 }}>
        <Typography
          variant="caption"
          sx={{
            color: 'text.secondary',
            fontWeight: 600,
            display: 'block',
            mb: 0.25,
            textTransform: 'uppercase',
            fontSize: '0.75rem',
            letterSpacing: '0.5px',
          }}
        >
          {label}
        </Typography>
        <Box sx={{ minHeight: '24px', display: 'flex', alignItems: 'center' }}>
          {children}
        </Box>
      </Box>
    );
  }

  let textoExibicao = '-';
  if (valor !== null && valor !== undefined) {
    const str = String(valor).trim();
    if (str !== '') {
      textoExibicao = str;
    }
  }

  return (
    <Box sx={{ mb: 1 }}>
      <Typography
        variant="caption"
        sx={{
          color: 'text.secondary',
          fontWeight: 600,
          display: 'block',
          mb: 0.25,
          textTransform: 'uppercase',
          fontSize: '0.75rem',
          letterSpacing: '0.5px',
        }}
      >
        {label}
      </Typography>
      <Typography
        variant="body1"
        sx={{
          color: '#000000',
          fontWeight: 500,
          wordBreak: 'break-word',
          minHeight: '24px',
        }}
      >
        {textoExibicao}
      </Typography>
    </Box>
  );
};
