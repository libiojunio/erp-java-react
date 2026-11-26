import React from 'react';
import { Chip, Tooltip } from '@mui/material';

interface IdChipProps {
  id: number | string;
  onClick: (e: React.MouseEvent) => void;
  tooltip?: string;
}

export const IdChip: React.FC<IdChipProps> = ({
  id,
  onClick,
  tooltip = 'Clique para visualizar detalhes do registro',
}) => {
  return (
    <Tooltip title={tooltip}>
      <Chip
        label={id}
        size="small"
        clickable
        onClick={(e) => {
          e.stopPropagation();
          onClick(e);
        }}
        sx={{
          bgcolor: '#e0e0e0',
          color: '#424242',
          fontWeight: 700,
          borderRadius: '16px',
          minWidth: 32,
          height: 24,
          cursor: 'pointer',
          '&:hover': {
            bgcolor: '#bdbdbd',
          },
        }}
      />
    </Tooltip>
  );
};

export default IdChip;
