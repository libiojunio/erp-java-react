import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Empresa {
  id: number;
  razaoSocial: string;
  nomeFantasia: string;
  cnpj: string;
}

export interface Usuario {
  id: number;
  nome: string;
  email: string;
  perfis: string[];
  empresas: Empresa[];
}

interface AuthContextType {
  usuario: Usuario | null;
  empresaAtiva: Empresa | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, usuario: Usuario, empresaId?: number) => void;
  logout: () => void;
  selecionarEmpresa: (empresaId: number) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [empresaAtiva, setEmpresaAtiva] = useState<Empresa | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('erp_user');
    const storedToken = localStorage.getItem('erp_token');
    const storedEmpresaId = localStorage.getItem('erp_empresa_ativa_id');

    if (storedUser && storedToken) {
      try {
        const parsedUser: Usuario = JSON.parse(storedUser);
        setUsuario(parsedUser);

        if (parsedUser.empresas && parsedUser.empresas.length > 0) {
          const active = parsedUser.empresas.find(
            (e) => e.id === Number(storedEmpresaId),
          ) || parsedUser.empresas[0];
          setEmpresaAtiva(active);
          localStorage.setItem('erp_empresa_ativa_id', active.id.toString());
        }
      } catch (err) {
        console.error('Erro ao recuperar sessão:', err);
      }
    } else {
      // Cria sessão de demonstração inicial para teste no front (Fase 0)
      const mockEmpresas: Empresa[] = [
        { id: 1, razaoSocial: 'EMPRESA MATRIZ EXEMPLO LTDA', nomeFantasia: 'Matriz ERP', cnpj: '12345678000195' },
        { id: 2, razaoSocial: 'FILIAL SAO PAULO COMERCIO LTDA', nomeFantasia: 'Filial SP', cnpj: '98765432000188' },
      ];
      const mockUser: Usuario = {
        id: 1,
        nome: 'Administrador Master',
        email: 'admin@erp.com',
        perfis: ['ROLE_ADMIN'],
        empresas: mockEmpresas,
      };
      setUsuario(mockUser);
      setEmpresaAtiva(mockEmpresas[0]);
      localStorage.setItem('erp_empresa_ativa_id', '1');
    }
    setIsLoading(false);
  }, []);

  const login = (token: string, user: Usuario, empresaId?: number) => {
    localStorage.setItem('erp_token', token);
    localStorage.setItem('erp_user', JSON.stringify(user));
    setUsuario(user);

    const active = user.empresas.find((e) => e.id === empresaId) || user.empresas[0];
    if (active) {
      setEmpresaAtiva(active);
      localStorage.setItem('erp_empresa_ativa_id', active.id.toString());
    }
  };

  const logout = () => {
    localStorage.removeItem('erp_token');
    localStorage.removeItem('erp_user');
    localStorage.removeItem('erp_empresa_ativa_id');
    setUsuario(null);
    setEmpresaAtiva(null);
  };

  const selecionarEmpresa = (empresaId: number) => {
    if (!usuario) return;
    const selecionada = usuario.empresas.find((e) => e.id === empresaId);
    if (selecionada) {
      setEmpresaAtiva(selecionada);
      localStorage.setItem('erp_empresa_ativa_id', selecionada.id.toString());
    }
  };

  return (
    <AuthContext.Provider
      value={{
        usuario,
        empresaAtiva,
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
