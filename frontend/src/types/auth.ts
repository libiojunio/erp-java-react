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

export interface LoginResponseData {
  token: string;
  tipo: string;
  usuario: Usuario;
  empresaAtiva: Empresa;
  empresas: Empresa[];
}

export interface AuthContextType {
  usuario: Usuario | null;
  empresaAtiva: Empresa | null;
  empresas: Empresa[];
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, senha: string) => Promise<void>;
  logout: () => void;
  selecionarEmpresa: (empresaId: number) => Promise<void>;
}
