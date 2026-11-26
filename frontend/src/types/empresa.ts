import { ArquivoInfo } from './arquivo';

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
  arquivoId?: number | null;
  arquivo?: ArquivoInfo | null;
}
