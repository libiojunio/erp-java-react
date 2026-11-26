import React from 'react';
import { IconButton, Tooltip, IconButtonProps, SxProps, Theme } from '@mui/material';

export interface BotaoTooltipProps {
  titulo: string;
  icone: React.ReactNode;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  color?: IconButtonProps['color'];
  size?: IconButtonProps['size'];
  sx?: SxProps<Theme>;
}

export const BotaoTooltip: React.FC<BotaoTooltipProps> = ({
  titulo,
  icone,
  onClick,
  disabled = false,
  color = 'default',
  size = 'medium',
  sx,
}) => {
  return (
    <Tooltip title={titulo}>
      <span>
        <IconButton
          onClick={onClick}
          disabled={disabled}
          color={color}
          size={size}
          sx={sx}
        >
          {icone}
        </IconButton>
      </span>
    </Tooltip>
  );
};

export default BotaoTooltip;
