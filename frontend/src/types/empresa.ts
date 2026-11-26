import { ArquivoInfo } from './arquivo';

export interface EmpresaDadosIniciais {
  situacoes: { valor: string; descricao: string }[];
  ufs: { valor: string; descricao: string }[];
}

export interface EmpresaItem {
  id: number;
  razaoSocial: string;
  nomeFantasia?: string;
  cnpj: string;
  inscricaoEstadual?: string;
  cep?: string;
  logradouro?: string;
  numero?: string;
  complemento?: string;
  bairro?: string;
  cidade?: string;
  uf?: string;
  situacao: string;
  versao?: number;
  arquivoId?: number | null;
  arquivo?: ArquivoInfo | null;
}

export interface EmpresaForm {
  razaoSocial: string;
  nomeFantasia: string;
  cnpj: string;
  inscricaoEstadual: string;
  cep: string;
  logradouro: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  uf: string;
  versao?: number;
  arquivoId?: number | null;
  arquivo?: ArquivoInfo | null;
}
