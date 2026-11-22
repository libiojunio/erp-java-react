import { createTheme } from '@mui/material/styles';
import { CustomPaginationActions } from '../components/common/CustomPaginationActions';

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
      light: '#42a5f5',
      dark: '#1565c0',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#9c27b0',
      light: '#ba68c8',
      dark: '#7b1fa2',
    },
    background: {
      default: '#f4f6f8',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
          fontWeight: 500,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiFormLabel: {
      styleOverrides: {
        asterisk: {
          color: '#d32f2f',
          fontWeight: 'bold',
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        asterisk: {
          color: '#d32f2f',
          fontWeight: 'bold',
        },
      },
    },
    MuiTablePagination: {
      defaultProps: {
        labelRowsPerPage: 'Registros por página:',
        ActionsComponent: CustomPaginationActions,
        labelDisplayedRows: ({ from, to, count }) =>
          `${from}–${to} de ${count !== -1 ? count : `mais de ${to}`}`,
      },
      styleOverrides: {
        toolbar: {
          paddingLeft: '16px',
        },
        spacer: {
          flex: '1 1 auto',
          order: 2,
        },
        selectLabel: {
          order: 0,
          margin: 0,
          marginRight: '8px',
        },
        input: {
          order: 1,
          marginRight: '16px',
        },
        displayedRows: {
          order: 3,
        },
        actions: {
          order: 4,
        },
      },
    },
  },
});
