import React from 'react';
import { Box, Button } from '@mui/material';

interface CustomPaginationActionsProps {
  count: number;
  page: number; // base 0
  rowsPerPage: number;
  onPageChange: (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => void;
}

export const CustomPaginationActions: React.FC<CustomPaginationActionsProps> = ({
  count,
  page,
  rowsPerPage,
  onPageChange,
}) => {
  const totalPages = Math.ceil(count / rowsPerPage) || 1;
  const currentPage = page + 1; // base 1

  // Cálculo da janela de até 6 botões numéricos
  const maxButtons = 6;
  let startPage = 1;
  let endPage = totalPages;

  if (totalPages > maxButtons) {
    startPage = Math.max(1, currentPage - 2);
    endPage = startPage + maxButtons - 1;

    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = Math.max(1, endPage - maxButtons + 1);
    }
  }

  const pages = [];
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  const handleFirstPage = (event: React.MouseEvent<HTMLButtonElement>) => {
    onPageChange(event, 0);
  };

  const handleBackPage = (event: React.MouseEvent<HTMLButtonElement>) => {
    onPageChange(event, page - 1);
  };

  const handlePageClick = (event: React.MouseEvent<HTMLButtonElement>, pageNum: number) => {
    onPageChange(event, pageNum - 1);
  };

  const handleNextPage = (event: React.MouseEvent<HTMLButtonElement>) => {
    onPageChange(event, page + 1);
  };

  const handleLastPage = (event: React.MouseEvent<HTMLButtonElement>) => {
    onPageChange(event, totalPages - 1);
  };

  const hasMoreThan6Pages = totalPages > maxButtons;

  const buttonStyle = {
    minWidth: 32,
    height: 32,
    px: 1,
    py: 0,
    fontSize: '0.85rem',
    fontWeight: 600,
    borderRadius: 0,
    borderColor: 'rgba(0, 0, 0, 0.23)',
    color: '#d32f2f',
    bgcolor: '#ffffff',
    '&:hover': {
      bgcolor: 'rgba(211, 47, 47, 0.08)',
      borderColor: '#d32f2f',
    },
    '&.Mui-disabled': {
      color: 'rgba(0, 0, 0, 0.26)',
      borderColor: 'rgba(0, 0, 0, 0.12)',
      bgcolor: '#fafafa',
    },
  };

  const activeButtonStyle = {
    ...buttonStyle,
    bgcolor: '#d32f2f',
    color: '#ffffff',
    borderColor: '#d32f2f',
    fontWeight: 700,
    '&:hover': {
      bgcolor: '#b71c1c',
      borderColor: '#b71c1c',
    },
  };

  return (
    <Box
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        flexWrap: 'nowrap',
        whiteSpace: 'nowrap',
        border: '1px solid rgba(0, 0, 0, 0.23)',
        borderRadius: 1,
        overflow: 'hidden',
        ml: 1.5,
      }}
    >
      {/* Botão de Primeira Página (exibido quando há mais de 6 páginas) */}
      {hasMoreThan6Pages && (
        <Button
          size="small"
          onClick={handleFirstPage}
          disabled={page === 0}
          sx={{
            ...buttonStyle,
            borderRight: '1px solid rgba(0, 0, 0, 0.23)',
          }}
          title="Primeira página"
        >
          &lt;&lt;
        </Button>
      )}

      {/* Botão de Página Anterior */}
      <Button
        size="small"
        onClick={handleBackPage}
        disabled={page === 0}
        sx={{
          ...buttonStyle,
          borderRight: '1px solid rgba(0, 0, 0, 0.23)',
        }}
        title="Página anterior"
      >
        &lt;
      </Button>

      {/* Botões Numéricos das Páginas */}
      {pages.map((p, index) => {
        const isActive = p === currentPage;
        const isLastInGroup = index === pages.length - 1;
        return (
          <Button
            key={p}
            size="small"
            onClick={(e) => {
              handlePageClick(e, p);
            }}
            sx={{
              ...(isActive ? activeButtonStyle : buttonStyle),
              borderRight: isLastInGroup ? 'none' : '1px solid rgba(0, 0, 0, 0.23)',
            }}
          >
            {p}
          </Button>
        );
      })}

      {/* Botão de Próxima Página */}
      <Button
        size="small"
        onClick={handleNextPage}
        disabled={page >= totalPages - 1}
        sx={{
          ...buttonStyle,
          borderLeft: '1px solid rgba(0, 0, 0, 0.23)',
        }}
        title="Próxima página"
      >
        &gt;
      </Button>

      {/* Botão de Última Página (exibido quando há mais de 6 páginas) */}
      {hasMoreThan6Pages && (
        <Button
          size="small"
          onClick={handleLastPage}
          disabled={page >= totalPages - 1}
          sx={{
            ...buttonStyle,
            borderLeft: '1px solid rgba(0, 0, 0, 0.23)',
          }}
          title="Última página"
        >
          &gt;&gt;
        </Button>
      )}
    </Box>
  );
};

export default CustomPaginationActions;
