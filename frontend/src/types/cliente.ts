import { ArquivoInfo } from './arquivo';

export type TipoPessoa = 'PF' | 'PJ';

export interface EnderecoForm {
  id?: number;
  tipo: string;
  cep: string;
  logradouro: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  uf: string;
}

export interface ContatoForm {
  id?: number;
  nome: string;
  cargo: string;
  email: string;
  telefone: string;
}

export interface ClienteItem {
  id: number;
  tipoPessoa: TipoPessoa;
  documento: string;
  nomeRazaoSocial: string;
  nomeFantasia?: string;
  inscricaoEstadual?: string;
  dataNascimento?: string;
  email?: string;
  telefone?: string;
  situacao: string;
  empresaId: number;
  enderecos?: EnderecoForm[];
  contatos?: ContatoForm[];
  arquivoId?: number | null;
  arquivo?: ArquivoInfo | null;
}

export interface ClienteForm {
  tipoPessoa: TipoPessoa;
  documento: string;
  nomeRazaoSocial: string;
  nomeFantasia: string;
  inscricaoEstadual: string;
  dataNascimento: string;
  email: string;
  telefone: string;
  arquivoId?: number | null;
  arquivo?: ArquivoInfo | null;
  enderecos: EnderecoForm[];
  contatos: ContatoForm[];
}
