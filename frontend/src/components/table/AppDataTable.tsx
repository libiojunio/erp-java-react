import { Paper, SxProps, Theme } from '@mui/material';
import { DataGrid, GridColDef, GridValidRowModel } from '@mui/x-data-grid';
import { dataGridPtBR } from '../../utils/dataGridPtBR';
import { CustomPaginationActions } from '../common/CustomPaginationActions';
import { PaginationModel } from '../../types/comum';

interface AppDataTableProps<T extends GridValidRowModel = any> {
  rows: T[];
  columns: GridColDef<T>[];
  loading?: boolean;
  paginationModel: PaginationModel;
  onPaginationModelChange: (model: PaginationModel) => void;
  minHeight?: number | string;
  pageSizeOptions?: number[];
  sx?: SxProps<Theme>;
}

export const AppDataTable = <T extends GridValidRowModel>({
  rows,
  columns,
  loading = false,
  paginationModel,
  onPaginationModelChange,
  minHeight = 900,
  pageSizeOptions = [10, 20, 50, 100],
  sx,
}: AppDataTableProps<T>) => {
  return (
    <Paper sx={{ width: '100%', minHeight }} elevation={1}>
      <DataGrid
        autoHeight
        rows={rows}
        columns={columns}
        loading={loading}
        localeText={dataGridPtBR}
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
  );
};

export default AppDataTable;
