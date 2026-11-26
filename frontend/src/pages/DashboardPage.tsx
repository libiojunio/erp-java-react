import React, { useEffect, useState } from 'react';
import {
  Grid,
  Typography,
  Box,
  Card,
  CardContent,
  Chip,
  Alert,
} from '@mui/material';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import BusinessIcon from '@mui/icons-material/Business';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

export const DashboardPage: React.FC = () => {
  const { usuario, empresaAtiva, empresas } = useAuth();
  const [backendStatus, setBackendStatus] = useState<'UP' | 'DOWN' | 'CHECKING'>('CHECKING');

  useEffect(() => {
    api.get('/status')
      .then(() => {
        setBackendStatus('UP');
      })
      .catch(() => {
        setBackendStatus('DOWN');
      });
  }, []);

  // Total de clientes da empresa ativa
  const { data: totalClientes = 0 } = useQuery({
    queryKey: ['clientes', 'total', empresaAtiva?.id],
    queryFn: async () => {
      if (!empresaAtiva) {
        return 0;
      }
      try {
        const response = await api.get('/clientes?size=1');
        const dados = response.data?.dados;
        if (dados && typeof dados.totalElements === 'number') {
          return dados.totalElements;
        }
        if (Array.isArray(dados)) {
          return dados.length;
        }
        if (dados && Array.isArray(dados.content)) {
          return dados.totalElements ?? dados.content.length;
        }
        return 0;
      } catch (err) {
        return 0;
      }
    },
    enabled: !!empresaAtiva,
  });

  // Total de empresas habilitadas no sistema
  const { data: totalEmpresas = (empresas?.length || 1) } = useQuery({
    queryKey: ['empresas', 'total'],
    queryFn: async () => {
      try {
        const response = await api.get('/empresas?size=1');
        const dados = response.data?.dados;
        if (dados && typeof dados.totalElements === 'number') {
          return dados.totalElements;
        }
        if (Array.isArray(dados)) {
          return dados.length;
        }
        if (dados && Array.isArray(dados.content)) {
          return dados.totalElements ?? dados.content.length;
        }
        return empresas?.length || 1;
      } catch (err) {
        return empresas?.length || 1;
      }
    },
  });

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
          Painel de Controle
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Bem-vindo, <strong>{usuario?.nome}</strong>. Você está operando na empresa:{' '}
          <Chip
            label={empresaAtiva ? `${empresaAtiva.nomeFantasia || empresaAtiva.razaoSocial} (CNPJ: ${empresaAtiva.cnpj})` : 'Nenhuma selecionada'}
            color="primary"
            variant="outlined"
            size="small"
            sx={{ fontWeight: 600 }}
          />
        </Typography>
      </Box>

      {backendStatus === 'DOWN' && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          O backend Spring Boot (porta 8080) ainda não está em execução. O frontend está utilizando dados locais de inicialização.
        </Alert>
      )}

      {backendStatus === 'UP' && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Conexão com a API Spring Boot estabelecida com sucesso!
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={4}>
          <Card elevation={2}>
            <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
              <Box sx={{ p: 2, bgcolor: 'primary.light', borderRadius: 2, color: '#ffffff', mr: 2 }}>
                <PeopleAltIcon fontSize="large" />
              </Box>
              <Box>
                <Typography color="text.secondary" variant="body2" sx={{ fontWeight: 600 }}>
                  Clientes Cadastrados
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                  {totalClientes}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {empresaAtiva ? `Na empresa ${empresaAtiva.nomeFantasia || empresaAtiva.razaoSocial}` : 'Isolamento multiempresa'}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Card elevation={2}>
            <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
              <Box sx={{ p: 2, bgcolor: 'secondary.light', borderRadius: 2, color: '#ffffff', mr: 2 }}>
                <BusinessIcon fontSize="large" />
              </Box>
              <Box>
                <Typography color="text.secondary" variant="body2" sx={{ fontWeight: 600 }}>
                  Empresas Habilitadas
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                  {totalEmpresas}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Multiempresa ativo
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Card elevation={2}>
            <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
              <Box sx={{ p: 2, bgcolor: backendStatus === 'UP' ? 'success.light' : 'warning.light', borderRadius: 2, color: '#ffffff', mr: 2 }}>
                <CheckCircleIcon fontSize="large" />
              </Box>
              <Box>
                <Typography color="text.secondary" variant="body2" sx={{ fontWeight: 600 }}>
                  Status da API
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                  {backendStatus}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Proxy /api configurado
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardPage;
