import React from 'react';
import { Alert, AlertColor, SxProps, Theme } from '@mui/material';

export interface AlertaProps {
  rotulo?: React.ReactNode;
  texto?: React.ReactNode;
  children?: React.ReactNode;
  severity?: AlertColor;
  sx?: SxProps<Theme>;
}

export const Alerta: React.FC<AlertaProps> = ({
  rotulo,
  texto,
  children,
  severity = 'info',
  sx,
}) => {
  return (
    <Alert severity={severity} sx={{ mb: 2.5, alignItems: 'center', ...sx }}>
      {rotulo && (typeof rotulo === 'string' ? `${rotulo} ` : rotulo)}
      {texto && <strong>{texto}</strong>}
      {children}
    </Alert>
  );
};

export default Alerta;
