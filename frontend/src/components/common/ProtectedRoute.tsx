import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Box, CircularProgress, Typography, Alert, Button } from '@mui/material';
import { useAuth } from '../../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactElement;
  requiredRole?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole }) => {
  const { isAuthenticated, isLoading, usuario } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', gap: 2 }}>
        <CircularProgress size={48} />
        <Typography variant="body2" color="text.secondary">
          Carregando sessão...
        </Typography>
      </Box>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRole && usuario && !usuario.perfis.includes(requiredRole)) {
    return (
      <Box sx={{ p: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            Acesso Não Autorizado
          </Typography>
          Seu perfil de acesso ({usuario.perfis.join(', ')}) não possui permissão para acessar esta área.
          Necessário perfil: <strong>{requiredRole}</strong>.
        </Alert>
        <Button variant="outlined" onClick={() => window.history.back()}>
          Voltar
        </Button>
      </Box>
    );
  }

  return children;
};
