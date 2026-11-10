import React, { useState } from 'react';
import {
  Container,
  Paper,
  Box,
  Typography,
  TextField,
  Button,
  Alert,
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('admin@erp.com');
  const [senha, setSenha] = useState('admin123');
  const [erro, setErro] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !senha) {
      setErro('Informe o e-mail e a senha.');
      return;
    }

    // Login simulado para testes na Fase 0
    login('mock-jwt-token-fase-0', {
      id: 1,
      nome: 'Administrador Master',
      email: email,
      perfis: ['ROLE_ADMIN'],
      empresas: [
        { id: 1, razaoSocial: 'EMPRESA MATRIZ EXEMPLO LTDA', nomeFantasia: 'Matriz ERP', cnpj: '12345678000195' },
        { id: 2, razaoSocial: 'FILIAL SAO PAULO COMERCIO LTDA', nomeFantasia: 'Filial SP', cnpj: '98765432000188' },
      ],
    }, 1);

    navigate('/');
  };

  return (
    <Container component="main" maxWidth="xs" sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
      <Paper elevation={3} sx={{ p: 4, width: '100%', borderRadius: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Box sx={{ m: 1, bgcolor: 'primary.main', color: '#fff', p: 1.5, borderRadius: '50%' }}>
            <LockOutlinedIcon />
          </Box>
          <Typography component="h1" variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
            ERP Multiempresa
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Acesse o sistema com suas credenciais
          </Typography>

          {erro && (
            <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
              {erro}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="E-mail"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="senha"
              label="Senha"
              type="password"
              id="senha"
              autoComplete="current-password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              sx={{ mt: 3, mb: 2, py: 1.2 }}
            >
              Entrar no Sistema
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};
