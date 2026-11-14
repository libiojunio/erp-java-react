import { GridLocaleText } from '@mui/x-data-grid';

export const dataGridPtBR: Partial<GridLocaleText> = {
  // Root
  noRowsLabel: 'Nenhum registro encontrado',
  noResultsOverlayLabel: 'Nenhum resultado encontrado.',

  // Density selector toolbar button text
  toolbarDensity: 'Densidade',
  toolbarDensityLabel: 'Densidade',
  toolbarDensityCompact: 'Compacto',
  toolbarDensityStandard: 'Padrão',
  toolbarDensityComfortable: 'Confortável',

  // Columns selector toolbar button text
  toolbarColumns: 'Colunas',
  toolbarColumnsLabel: 'Exibir seletor de colunas',

  // Filters toolbar button text
  toolbarFilters: 'Filtros',
  toolbarFiltersLabel: 'Exibir filtros',
  toolbarFiltersTooltipHide: 'Ocultar filtros',
  toolbarFiltersTooltipShow: 'Exibir filtros',
  toolbarFiltersTooltipActive: (count) =>
    `${count} ${count !== 1 ? 'filtros ativos' : 'filtro ativo'}`,

  // Quick filter toolbar field
  toolbarQuickFilterPlaceholder: 'Buscar…',
  toolbarQuickFilterLabel: 'Buscar',
  toolbarQuickFilterDeleteIconLabel: 'Limpar',

  // Export selector toolbar button text
  toolbarExport: 'Exportar',
  toolbarExportLabel: 'Exportar',
  toolbarExportCSV: 'Baixar como CSV',
  toolbarExportPrint: 'Imprimir',

  // Columns management text
  columnsManagementSearchTitle: 'Buscar',
  columnsManagementNoColumns: 'Nenhuma coluna',
  columnsManagementShowHideAllText: 'Mostrar/Ocultar Todas',
  columnsManagementReset: 'Redefinir',

  // Filter panel text
  filterPanelAddFilter: 'Adicionar filtro',
  filterPanelRemoveAll: 'Remover todos',
  filterPanelDeleteIconLabel: 'Excluir',
  filterPanelLogicOperator: 'Operador lógico',
  filterPanelOperator: 'Operador',
  filterPanelOperatorAnd: 'E',
  filterPanelOperatorOr: 'Ou',
  filterPanelColumns: 'Colunas',
  filterPanelInputLabel: 'Valor',
  filterPanelInputPlaceholder: 'Filtrar valor',

  // Filter operators text
  filterOperatorContains: 'contém',
  filterOperatorDoesNotContain: 'não contém',
  filterOperatorEquals: 'é igual a',
  filterOperatorDoesNotEqual: 'não é igual a',
  filterOperatorStartsWith: 'começa com',
  filterOperatorEndsWith: 'termina com',
  filterOperatorIs: 'é',
  filterOperatorNot: 'não é',
  filterOperatorIsEmpty: 'está vazio',
  filterOperatorIsNotEmpty: 'não está vazio',
  filterOperatorIsAnyOf: 'é qualquer um dos',

  // Column menu text
  columnMenuLabel: 'Menu',
  columnMenuShowColumns: 'Exibir colunas',
  columnMenuManageColumns: 'Gerenciar colunas',
  columnMenuFilter: 'Filtrar',
  columnMenuHideColumn: 'Ocultar coluna',
  columnMenuUnsort: 'Desfazer ordenação',
  columnMenuSortAsc: 'Ordenar crescente',
  columnMenuSortDesc: 'Ordenar decrescente',

  // Column header text
  columnHeaderFiltersTooltipActive: (count) =>
    `${count} ${count !== 1 ? 'filtros ativos' : 'filtro ativo'}`,
  columnHeaderFiltersLabel: 'Exibir Filtros',
  columnHeaderSortIconLabel: 'Ordenar',

  // Rows selected footer text
  footerRowSelected: (count) =>
    count !== 1
      ? `${count.toLocaleString()} registros selecionados`
      : `${count.toLocaleString()} registro selecionado`,

  // Total row amount footer text
  footerTotalRows: 'Total de registros:',
  footerTotalVisibleRows: (visibleCount, totalCount) =>
    `${visibleCount.toLocaleString()} de ${totalCount.toLocaleString()}`,

  // Checkbox selection text
  checkboxSelectionHeaderName: 'Seleção',
  checkboxSelectionSelectAllRows: 'Selecionar todas as linhas',
  checkboxSelectionUnselectAllRows: 'Deselecionar todas as linhas',
  checkboxSelectionSelectRow: 'Selecionar linha',
  checkboxSelectionUnselectRow: 'Deselecionar linha',

  // Pagination (TablePagination)
  MuiTablePagination: {
    labelRowsPerPage: 'Registros por página:',
    labelDisplayedRows: ({ from, to, count }) =>
      `${from}–${to} de ${count !== -1 ? count : `mais de ${to}`}`,
  },
};
