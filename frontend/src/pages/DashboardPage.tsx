import React, { useEffect, useState } from 'react';
import {
  Grid,
  Paper,
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
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

export const DashboardPage: React.FC = () => {
  const { usuario, empresaAtiva, empresas } = useAuth();
  const [backendStatus, setBackendStatus] = useState<'UP' | 'DOWN' | 'CHECKING'>('CHECKING');

  useEffect(() => {
    api.get('/status')
      .then(() => setBackendStatus('UP'))
      .catch(() => setBackendStatus('DOWN'));
  }, []);

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
          O backend Spring Boot (porta 8080) ainda não está em execução. O frontend está utilizando dados locais de inicialização da Fase 0.
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
                  0
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Fase 3 / 4 — Em implantação
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
                  {empresas?.length || 1}
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

        <Grid item xs={12}>
          <Paper sx={{ p: 3 }} elevation={1}>
            <Typography variant="h6" gutterBottom>
              Status das Fases do Projeto
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Acompanhamento da construção do ERP Multiempresa:
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1.5, bgcolor: '#e8f5e9', borderRadius: 1 }}>
                <Typography variant="body2"><strong>Fase 0 — Fundação</strong>: Estrutura, Spring Boot, Oracle Compose, Flyway, React MUI</Typography>
                <Chip label="Em Andamento" color="success" size="small" />
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1.5, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                <Typography variant="body2"><strong>Fase 1 — Segurança</strong>: Autenticação JWT, troca de empresa ativa, perfis ADMIN/OPERADOR</Typography>
                <Chip label="Próxima" color="default" size="small" />
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1.5, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                <Typography variant="body2"><strong>Fase 2 — Cadastro de Empresas</strong>: CRUD e inativação de empresas</Typography>
                <Chip label="Pendente" color="default" size="small" />
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1.5, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                <Typography variant="body2"><strong>Fase 3 & 4 — Cadastro de Clientes (Back + Front)</strong>: PF/PJ com CPF/CNPJ, endereços e contatos</Typography>
                <Chip label="Pendente" color="default" size="small" />
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};
