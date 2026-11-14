import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

export interface Empresa {
  id: number;
  razaoSocial: string;
  nomeFantasia?: string;
  cnpj: string;
}

export interface Usuario {
  id: number;
  nome: string;
  email: string;
  perfis: string[];
}

interface LoginResponseData {
  token: string;
  tipo: string;
  usuario: Usuario;
  empresaAtiva: Empresa;
  empresas: Empresa[];
}

interface ApiResponse<T> {
  sucesso: boolean;
  mensagem: string;
  dados: T;
}

interface AuthContextType {
  usuario: Usuario | null;
  empresaAtiva: Empresa | null;
  empresas: Empresa[];
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, senha: string) => Promise<void>;
  logout: () => void;
  selecionarEmpresa: (empresaId: number) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [empresaAtiva, setEmpresaAtiva] = useState<Empresa | null>(null);
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Inicializa e valida sessão existente
  useEffect(() => {
    const storedToken = localStorage.getItem('erp_token');

    if (!storedToken) {
      setIsLoading(false);
      return;
    }

    // Valida o token contra o endpoint /api/auth/me do backend
    api.get<ApiResponse<LoginResponseData>>('/auth/me')
      .then((res) => {
        const data = res.data.dados;
        setUsuario(data.usuario);
        setEmpresaAtiva(data.empresaAtiva);
        setEmpresas(data.empresas || []);
        localStorage.setItem('erp_user', JSON.stringify(data.usuario));
        if (data.empresaAtiva) {
          localStorage.setItem('erp_empresa_ativa_id', data.empresaAtiva.id.toString());
        }
      })
      .catch(() => {
        // Token inválido ou expirado
        localStorage.removeItem('erp_token');
        localStorage.removeItem('erp_user');
        localStorage.removeItem('erp_empresa_ativa_id');
        setUsuario(null);
        setEmpresaAtiva(null);
        setEmpresas([]);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const login = async (email: string, senha: string) => {
    setIsLoading(true);
    try {
      const res = await api.post<ApiResponse<LoginResponseData>>('/auth/login', { email, senha });
      const data = res.data.dados;

      localStorage.setItem('erp_token', data.token);
      localStorage.setItem('erp_user', JSON.stringify(data.usuario));
      if (data.empresaAtiva) {
        localStorage.setItem('erp_empresa_ativa_id', data.empresaAtiva.id.toString());
      }

      setUsuario(data.usuario);
      setEmpresaAtiva(data.empresaAtiva);
      setEmpresas(data.empresas || []);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('erp_token');
    localStorage.removeItem('erp_user');
    localStorage.removeItem('erp_empresa_ativa_id');
    setUsuario(null);
    setEmpresaAtiva(null);
    setEmpresas([]);
    window.location.href = '/login';
  };

  const selecionarEmpresa = async (empresaId: number) => {
    try {
      const res = await api.post<ApiResponse<LoginResponseData>>('/auth/empresa-ativa', { empresaId });
      const data = res.data.dados;

      // Atualiza token JWT contendo o novo empresaId
      localStorage.setItem('erp_token', data.token);
      if (data.empresaAtiva) {
        localStorage.setItem('erp_empresa_ativa_id', data.empresaAtiva.id.toString());
      }

      setUsuario(data.usuario);
      setEmpresaAtiva(data.empresaAtiva);
      setEmpresas(data.empresas || []);
    } catch (err) {
      console.error('Erro ao trocar empresa ativa:', err);
      throw err;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        usuario,
        empresaAtiva,
        empresas,
        isAuthenticated: !!usuario,
        isLoading,
        login,
        logout,
        selecionarEmpresa,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};
