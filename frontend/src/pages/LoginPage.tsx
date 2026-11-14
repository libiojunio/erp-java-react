import React, { useState } from 'react';
import {
  Container,
  Paper,
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  
  const [email, setEmail] = useState('admin@erp.com');
  const [senha, setSenha] = useState('admin123');
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const from = (location.state as any)?.from?.pathname || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro(null);

    if (!email || !senha) {
      setErro('Informe o e-mail e a senha.');
      return;
    }

    setLoading(true);
    try {
      await login(email, senha);
      navigate(from, { replace: true });
    } catch (err: any) {
      if (err.response?.data?.mensagem) {
        setErro(err.response.data.mensagem);
      } else if (err.response?.status === 401) {
        setErro('E-mail ou senha inválidos.');
      } else if (err.code === 'ERR_NETWORK') {
        setErro('Não foi possível conectar ao backend. Verifique se a API está em execução.');
      } else {
        setErro('Ocorreu um erro ao realizar login. Tente novamente.');
      }
    } finally {
      setLoading(false);
    }
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
              disabled={loading}
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
              disabled={loading}
              onChange={(e) => setSenha(e.target.value)}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              sx={{ mt: 3, mb: 2, py: 1.2 }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Entrar no Sistema'}
            </Button>
            
            <Typography variant="caption" color="text.secondary" display="block" align="center">
              Credenciais padrão: <strong>admin@erp.com</strong> / <strong>admin123</strong>
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};
