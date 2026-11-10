import axios from 'axios';

export const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para injetar o Token JWT e a Empresa Ativa em cada requisição
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('erp_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    const empresaAtivaId = localStorage.getItem('erp_empresa_ativa_id');
    if (empresaAtivaId) {
      config.headers['X-Empresa-Id'] = empresaAtivaId;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// Interceptor para capturar 401 (não autorizado) e redirecionar para login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('erp_token');
      localStorage.removeItem('erp_user');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  },
);
