import React, { useState, useCallback } from 'react';
import {
  FormControl,
  Select,
  MenuItem,
  SelectChangeEvent,
  Box,
  Typography,
  CircularProgress,
} from '@mui/material';
import BusinessIcon from '@mui/icons-material/Business';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { Empresa } from '../../types/auth';
import { ApiResponse } from '../../types/comum';

export const ActiveCompanySelector: React.FC = () => {
  const { empresaAtiva, selecionarEmpresa } = useAuth();
  const [trocando, setTrocando] = useState<boolean>(false);
  const [empresasDisponiveis, setEmpresasDisponiveis] = useState<Empresa[] | null>(null);
  const [carregandoLista, setCarregandoLista] = useState<boolean>(false);

  // Busca as empresas no backend somente sob demanda (quando o usuário clica no seletor)
  const carregarEmpresasSobDemanda = useCallback(async () => {
    if (empresasDisponiveis !== null || carregandoLista) {
      return;
    }

    setCarregandoLista(true);
    try {
      // Tenta buscar pelo endpoint dedicado /auth/minhas-empresas
      const response = await api.get<ApiResponse<Empresa[]>>('/auth/minhas-empresas');
      if (response.data && response.data.dados) {
        setEmpresasDisponiveis(response.data.dados);
      }
    } catch (err) {
      console.warn('Falha ao buscar /auth/minhas-empresas, tentando obter de /auth/me:', err);
      try {
        const meRes = await api.get<ApiResponse<any>>('/auth/me');
        if (meRes.data?.dados?.empresas) {
          setEmpresasDisponiveis(meRes.data.dados.empresas);
        }
      } catch (errFallback) {
        console.error('Falha ao carregar empresas sob demanda:', errFallback);
      }
    } finally {
      setCarregandoLista(false);
    }
  }, [empresasDisponiveis, carregandoLista]);

  const handleChange = async (event: SelectChangeEvent<number>) => {
    const novoId = Number(event.target.value);
    if (!novoId || (empresaAtiva && novoId === empresaAtiva.id)) {
      return;
    }

    setTrocando(true);
    try {
      await selecionarEmpresa(novoId);
    } catch (err) {
      console.error('Falha ao alterar empresa ativa:', err);
    } finally {
      setTrocando(false);
    }
  };

  // Garante que a empresa ativa atual sempre apareça nas opções
  const listaParaExibir = React.useMemo(() => {
    if (!empresasDisponiveis) {
      if (empresaAtiva) {
        return [empresaAtiva];
      }
      return [];
    }
    if (empresaAtiva && !empresasDisponiveis.some((e) => e.id === empresaAtiva.id)) {
      return [empresaAtiva, ...empresasDisponiveis];
    }
    return empresasDisponiveis;
  }, [empresasDisponiveis, empresaAtiva]);

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        bgcolor: 'rgba(255, 255, 255, 0.15)',
        px: 1.5,
        py: 0.5,
        borderRadius: 1.5,
      }}
    >
      <BusinessIcon sx={{ mr: 1, color: '#ffffff', fontSize: 20 }} />
      {trocando ? (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 2 }}>
          <CircularProgress size={16} sx={{ color: '#ffffff' }} />
          <Typography variant="caption" sx={{ color: '#ffffff' }}>
            Trocando empresa...
          </Typography>
        </Box>
      ) : (
        <FormControl size="small" variant="standard" sx={{ minWidth: 200 }}>
          <Select
            value={empresaAtiva ? empresaAtiva.id : ''}
            onChange={handleChange}
            onOpen={carregarEmpresasSobDemanda}
            displayEmpty
            disableUnderline
            sx={{
              color: '#ffffff',
              fontWeight: 500,
              fontSize: '0.875rem',
              '& .MuiSelect-icon': { color: '#ffffff' },
            }}
          >
            {carregandoLista && (
              <MenuItem disabled value="">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, py: 1 }}>
                  <CircularProgress size={16} />
                  <Typography variant="body2">Carregando empresas...</Typography>
                </Box>
              </MenuItem>
            )}

            {!carregandoLista && listaParaExibir.length === 0 && (
              <MenuItem disabled value="">
                <em>Nenhuma empresa disponível</em>
              </MenuItem>
            )}

            {listaParaExibir.map((emp) => (
              <MenuItem key={emp.id} value={emp.id}>
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {emp.nomeFantasia || emp.razaoSocial}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    CNPJ: {emp.cnpj}
                  </Typography>
                </Box>
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}
    </Box>
  );
};

export default ActiveCompanySelector;
