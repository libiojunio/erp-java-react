export interface PaginationModel {
  page: number;
  pageSize: number;
}

export type SituacaoFiltro = 'TODOS' | 'ATIVO' | 'INATIVO';

export type SituacaoRegistro = 'ATIVO' | 'INATIVO';

export interface ApiResponse<T> {
  sucesso: boolean;
  mensagem: string;
  dados: T;
}
