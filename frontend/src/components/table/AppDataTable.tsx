import React, { useState, useMemo, useEffect, useCallback } from 'react';
import {
  Paper,
  Box,
  Grid,
  TextField,
  InputAdornment,
  Button,
  Typography,
  SxProps,
  Theme,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { DataGrid, GridColDef, GridValidRowModel } from '@mui/x-data-grid';
import { useQuery } from '@tanstack/react-query';
import { dataGridPtBR } from '../../utils/dataGridPtBR';
import { CustomPaginationActions } from '../common/CustomPaginationActions';
import { PaginationModel } from '../../types/comum';
import { useTablePagination } from '../../hooks/useTablePagination';
import { api } from '../../services/api';

export interface AppDataTableProps<T extends GridValidRowModel = any> {
  // Carregamento independente via URL ou fornecimento manual de rows
  fetchUrl?: string;
  rows?: T[];
  columns: GridColDef<T>[];
  loading?: boolean;
  rowCount?: number;

  // Paginação
  paginationMode?: 'server' | 'client';
  paginationModel?: PaginationModel;
  onPaginationModelChange?: (model: PaginationModel, isDataLoadingOrEmpty?: boolean) => void;
  storageKey?: string;
  pageSizeOptions?: number[];
  minHeight?: number | string;
  sx?: SxProps<Theme>;

  // Barra de Pesquisa e Filtros
  showSearchBar?: boolean;
  searchPlaceholder?: string;
  searchValue?: string;
  onSearchChange?: (val: string) => void;
  extraFilters?: React.ReactNode;
  extraParams?: Record<string, any>;
  onPesquisar?: (termo?: string) => void;

  // Controle de inicialização da pesquisa no backend
  iniciarPesquisando?: boolean;

  // Gatilho de recarga externa
  reloadTrigger?: any;
  onDataLoaded?: (data: any) => void;
}

export const AppDataTable = <T extends GridValidRowModel>({
  fetchUrl,
  rows: externalRows,
  columns,
  loading: externalLoading = false,
  rowCount: externalRowCount,
  paginationMode = 'server',
  paginationModel: externalPaginationModel,
  onPaginationModelChange: externalOnPaginationModelChange,
  storageKey = 'app_data_table_pagination',
  minHeight = 900,
  pageSizeOptions = [10, 20, 50, 100],
  sx,
  showSearchBar = true,
  searchPlaceholder = 'Pesquisar na tabela...',
  searchValue,
  onSearchChange,
  extraFilters,
  extraParams,
  onPesquisar,
  iniciarPesquisando = true,
  reloadTrigger,
  onDataLoaded,
}: AppDataTableProps<T>) => {
  // Controle de exibição da tabela e disparo da busca
  const [pesquisaAtiva, setPesquisaAtiva] = useState<boolean>(iniciarPesquisando);
  const [termoLocal, setTermoLocal] = useState<string>('');

  // Sincroniza caso a prop iniciarPesquisando mude externamente
  useEffect(() => {
    if (iniciarPesquisando !== undefined) {
      setPesquisaAtiva(iniciarPesquisando);
    }
  }, [iniciarPesquisando]);

  // Hook interno de paginação caso não seja fornecido externamente
  const internalPagination = useTablePagination(storageKey, 10);

  const activePaginationModel = externalPaginationModel !== undefined
    ? externalPaginationModel
    : internalPagination.paginationModel;

  const handleActivePaginationChange = useCallback(
    (newModel: PaginationModel, isDataLoadingOrEmpty = false) => {
      if (externalOnPaginationModelChange) {
        externalOnPaginationModelChange(newModel, isDataLoadingOrEmpty);
      } else {
        internalPagination.handlePaginationModelChange(newModel, isDataLoadingOrEmpty);
      }
    },
    [externalOnPaginationModelChange, internalPagination],
  );

  const termoAtual = searchValue !== undefined ? searchValue : termoLocal;

  const handleTextoChange = (val: string) => {
    if (onSearchChange) {
      onSearchChange(val);
    } else {
      setTermoLocal(val);
    }
  };

  // Carregamento independente de dados se fetchUrl for configurado
  const {
    data: queryResponse,
    isLoading: queryLoading,
    isFetching: queryFetching,
    refetch,
  } = useQuery({
    queryKey: [
      fetchUrl,
      activePaginationModel.page,
      activePaginationModel.pageSize,
      extraParams,
      reloadTrigger,
    ],
    queryFn: async () => {
      if (!fetchUrl) {
        return null;
      }
      const params: Record<string, any> = {
        page: activePaginationModel.page,
        size: activePaginationModel.pageSize,
        sortProperty: 'id',
        sortDirection: 'DESC',
        ...(extraParams || {}),
      };

      if (termoAtual && termoAtual.trim()) {
        params.termo = termoAtual.trim();
      }

      const response = await api.get(fetchUrl, { params });
      const dados = response.data?.dados;
      if (onDataLoaded) {
        onDataLoaded(dados);
      }
      return dados;
    },
    // SE iniciarPesquisando = false, enabled é false até o usuário clicar no botão Pesquisar
    enabled: Boolean(fetchUrl && pesquisaAtiva),
  });

  const handleExecutarPesquisa = () => {
    if (!pesquisaAtiva) {
      setPesquisaAtiva(true);
    }
    if (fetchUrl) {
      refetch();
    }
    if (onPesquisar) {
      onPesquisar(termoAtual);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleExecutarPesquisa();
    }
  };

  // Extração das linhas (do backend ou passadas externamente)
  const rowsResolvidas = useMemo<T[]>(() => {
    if (fetchUrl) {
      const dados = queryResponse;
      if (Array.isArray(dados)) {
        return dados;
      }
      if (dados && Array.isArray(dados.content)) {
        return dados.content;
      }
      if (dados && Array.isArray(dados.conteudo)) {
        return dados.conteudo;
      }
      return [];
    }
    return externalRows || [];
  }, [fetchUrl, queryResponse, externalRows]);

  // Filtragem local na tabela caso onSearchChange não seja controlado externamente e sem fetchUrl
  const rowsExibidas = useMemo(() => {
    if (fetchUrl || onSearchChange) {
      return rowsResolvidas;
    }
    const termo = termoLocal.trim().toLowerCase();
    if (!termo) {
      return rowsResolvidas;
    }
    return rowsResolvidas.filter((row: any) => {
      return Object.values(row).some((val) => {
        if (val === null || val === undefined) {
          return false;
        }
        if (typeof val === 'object') {
          return false;
        }
        return String(val).toLowerCase().includes(termo);
      });
    });
  }, [rowsResolvidas, termoLocal, onSearchChange, fetchUrl]);

  // Contagem total de linhas para paginação do servidor
  const totalLinhas = useMemo<number>(() => {
    if (fetchUrl) {
      const dados = queryResponse;
      if (dados && typeof dados.totalElements === 'number') {
        return dados.totalElements;
      }
      return rowsResolvidas.length;
    }
    if (externalRowCount !== undefined) {
      return externalRowCount;
    }
    return rowsExibidas.length;
  }, [fetchUrl, queryResponse, rowsResolvidas.length, externalRowCount, rowsExibidas.length]);

  const isLoadingTotal = fetchUrl
    ? Boolean(queryLoading || queryFetching)
    : Boolean(externalLoading);

  return (
    <Box>
      {/* Card Padronizado de Pesquisa e Filtros */}
      {showSearchBar && (
        <Paper sx={{ p: 2, mb: 3 }} elevation={1}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={extraFilters ? 7 : 9} md={extraFilters ? 7 : 9}>
              <TextField
                fullWidth
                size="small"
                placeholder={searchPlaceholder}
                value={termoAtual}
                onChange={(e) => {
                  handleTextoChange(e.target.value);
                }}
                onKeyDown={handleKeyDown}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            {extraFilters && (
              <Grid item xs={12} sm={3} md={3}>
                {extraFilters}
              </Grid>
            )}

            <Grid item xs={12} sm={2} md={2}>
              <Button
                fullWidth
                variant="contained"
                color="primary"
                startIcon={<SearchIcon />}
                onClick={handleExecutarPesquisa}
                sx={{ height: 40 }}
              >
                Pesquisar
              </Button>
            </Grid>
          </Grid>
        </Paper>
      )}

      {/* Card da Tabela: Exibido apenas se pesquisaAtiva for verdadeiro */}
      {pesquisaAtiva ? (
        <Paper sx={{ width: '100%', minHeight }} elevation={1}>
          <DataGrid
            autoHeight
            rows={rowsExibidas}
            columns={columns}
            loading={isLoadingTotal}
            localeText={dataGridPtBR}
            paginationMode={paginationMode}
            rowCount={totalLinhas}
            paginationModel={activePaginationModel}
            onPaginationModelChange={(newModel) => {
              handleActivePaginationChange(newModel, isLoadingTotal || rowsExibidas.length === 0);
            }}
            sx={{
              minHeight,
              border: 'none',
              '& .MuiDataGrid-virtualScroller': {
                overflowY: 'hidden',
              },
              '& .MuiTablePagination-toolbar': {
                paddingLeft: 2,
                paddingRight: 2,
              },
              '& .MuiTablePagination-spacer': {
                flex: '1 1 auto',
                order: 2,
              },
              '& .MuiTablePagination-selectLabel': {
                order: 0,
                margin: 0,
                marginRight: 1,
              },
              '& .MuiTablePagination-input': {
                order: 1,
                marginRight: 2,
              },
              '& .MuiTablePagination-displayedRows': {
                order: 3,
                marginRight: '5px',
              },
              '& .MuiTablePagination-actions': {
                order: 4,
              },
              ...sx,
            }}
            slotProps={{
              pagination: {
                labelRowsPerPage: 'Registros por página:',
                ActionsComponent: CustomPaginationActions,
              },
            }}
            initialState={{
              sorting: { sortModel: [{ field: 'id', sort: 'desc' }] },
            }}
            pageSizeOptions={pageSizeOptions}
            disableRowSelectionOnClick
          />
        </Paper>
      ) : (
        <Paper sx={{ p: 4, textAlign: 'center' }} elevation={1}>
          <Typography variant="body1" color="text.secondary">
            Utilize o campo acima e clique no botão <strong>Pesquisar</strong> para carregar os registros.
          </Typography>
        </Paper>
      )}
    </Box>
  );
};

export default AppDataTable;
