import React, { useState, useMemo } from 'react';
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
import { dataGridPtBR } from '../../utils/dataGridPtBR';
import { CustomPaginationActions } from '../common/CustomPaginationActions';
import { PaginationModel } from '../../types/comum';

interface AppDataTableProps<T extends GridValidRowModel = any> {
  rows: T[];
  columns: GridColDef<T>[];
  loading?: boolean;
  rowCount?: number;
  paginationMode?: 'server' | 'client';
  paginationModel: PaginationModel;
  onPaginationModelChange: (model: PaginationModel) => void;
  minHeight?: number | string;
  pageSizeOptions?: number[];
  sx?: SxProps<Theme>;

  // Configuração da barra de busca padronizada
  showSearchBar?: boolean;
  searchPlaceholder?: string;
  searchValue?: string;
  onSearchChange?: (val: string) => void;
  extraFilters?: React.ReactNode;
  onPesquisar?: (termo?: string) => void;

  // Controle de inicialização da pesquisa no backend
  iniciarPesquisando?: boolean;
}

export const AppDataTable = <T extends GridValidRowModel>({
  rows,
  columns,
  loading = false,
  rowCount,
  paginationMode = 'server',
  paginationModel,
  onPaginationModelChange,
  minHeight = 900,
  pageSizeOptions = [10, 20, 50, 100],
  sx,
  showSearchBar = true,
  searchPlaceholder = 'Pesquisar na tabela...',
  searchValue,
  onSearchChange,
  extraFilters,
  onPesquisar,
  iniciarPesquisando = true,
}: AppDataTableProps<T>) => {
  const [pesquisaAtiva, setPesquisaAtiva] = useState<boolean>(iniciarPesquisando);
  const [termoLocal, setTermoLocal] = useState<string>('');

  const termoAtual = searchValue !== undefined ? searchValue : termoLocal;

  const handleTextoChange = (val: string) => {
    if (onSearchChange) {
      onSearchChange(val);
    } else {
      setTermoLocal(val);
    }
  };

  const handleExecutarPesquisa = () => {
    if (!pesquisaAtiva) {
      setPesquisaAtiva(true);
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

  // Filtragem local na tabela caso onSearchChange não seja controlado externamente
  const rowsExibidas = useMemo(() => {
    if (onSearchChange) {
      return rows;
    }
    const termo = termoLocal.trim().toLowerCase();
    if (!termo) {
      return rows;
    }
    return rows.filter((row: any) => {
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
  }, [rows, termoLocal, onSearchChange]);

  const totalLinhas = rowCount !== undefined ? rowCount : rowsExibidas.length;

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
            loading={loading}
            localeText={dataGridPtBR}
            paginationMode={paginationMode}
            rowCount={totalLinhas}
            paginationModel={paginationModel}
            onPaginationModelChange={onPaginationModelChange}
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
