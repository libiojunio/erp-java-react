import { useState, useCallback } from 'react';
import { PaginationModel } from '../types/comum';

export function useTablePagination(storageKey: string, initialPageSize = 10) {
  const [paginationModel, setPaginationModel] = useState<PaginationModel>(() => {
    const salvo = sessionStorage.getItem(storageKey);
    if (salvo) {
      try {
        const parsed = JSON.parse(salvo);
        let pageSize = parsed.pageSize || initialPageSize;
        if (pageSize > 100) {
          pageSize = 100;
        }
        return {
          page: typeof parsed.page === 'number' ? parsed.page : 0,
          pageSize,
        };
      } catch (e) {
        // Fallback em caso de erro no parse do JSON
      }
    }
    return { page: 0, pageSize: initialPageSize };
  });

  const handlePaginationModelChange = useCallback(
    (newModel: PaginationModel, isDataLoadingOrEmpty = false) => {
      // Se a consulta ainda está carregando ou a lista está vazia, o DataGrid tenta forçar page: 0
      // Ignoramos esse reset transitório para preservar a página salva pelo usuário
      if (isDataLoadingOrEmpty && newModel.page === 0 && paginationModel.page > 0) {
        return;
      }
      setPaginationModel(newModel);
      sessionStorage.setItem(storageKey, JSON.stringify(newModel));
    },
    [paginationModel.page, storageKey],
  );

  const resetPage = useCallback(() => {
    const novoModel: PaginationModel = { page: 0, pageSize: paginationModel.pageSize };
    setPaginationModel(novoModel);
    sessionStorage.setItem(storageKey, JSON.stringify(novoModel));
  }, [paginationModel.pageSize, storageKey]);

  return {
    paginationModel,
    setPaginationModel,
    handlePaginationModelChange,
    resetPage,
  };
}
