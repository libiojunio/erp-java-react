import React from 'react';
import { Button, ButtonProps, SxProps, Theme } from '@mui/material';

export interface BotaoAcaoProps {
  texto: string;
  icone?: React.ReactNode;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  variant?: ButtonProps['variant'];
  color?: ButtonProps['color'];
  size?: ButtonProps['size'];
  disabled?: boolean;
  sx?: SxProps<Theme>;
}

export const BotaoAcao: React.FC<BotaoAcaoProps> = ({
  texto,
  icone,
  onClick,
  variant = 'contained',
  color = 'primary',
  size = 'medium',
  disabled = false,
  sx,
}) => {
  return (
    <Button
      variant={variant}
      color={color}
      size={size}
      startIcon={icone}
      onClick={onClick}
      disabled={disabled}
      sx={sx}
    >
      {texto}
    </Button>
  );
};

export default BotaoAcao;
