import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Tooltip,
  CircularProgress,
  Paper,
  Button,
  Chip,
} from '@mui/material';
import { useDropzone } from 'react-dropzone';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import DescriptionIcon from '@mui/icons-material/Description';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { api } from '../../services/api';
import { ArquivoInfo } from '../../types/arquivo';

export type { ArquivoInfo };

interface FileUploadDropzoneProps {
  label?: string;
  arquivoId?: number | null;
  arquivoInicial?: ArquivoInfo | null;
  onArquivoAlterado: (arquivo: ArquivoInfo | null) => void;
  disabled?: boolean;
}

function formatarTamanhoBytes(bytes?: number): string {
  if (!bytes || bytes <= 0) {
    return '0 B';
  }
  const k = 1024;
  const tamanhos = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const valor = (bytes / Math.pow(k, i)).toFixed(1);
  return valor + ' ' + tamanhos[i];
}

export const FileUploadDropzone: React.FC<FileUploadDropzoneProps> = ({
  label = 'Anexo (PDF, Imagem, TXT)',
  arquivoId,
  arquivoInicial,
  onArquivoAlterado,
  disabled = false,
}) => {
  const [arquivo, setArquivo] = useState<ArquivoInfo | null>(arquivoInicial || null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);
  const [erroUpload, setErroUpload] = useState<string | null>(null);

  // Sincroniza com o arquivoInicial ou busca via API caso tenha apenas arquivoId
  useEffect(() => {
    if (arquivoInicial) {
      setArquivo(arquivoInicial);
      if (arquivoInicial.tipo.startsWith('image/')) {
        setPreviewUrl(`/api/arquivos/${arquivoInicial.id}/conteudo`);
      } else {
        setPreviewUrl(null);
      }
    } else if (arquivoId) {
      // Busca metadados se temos o ID mas não temos o objeto completo
      api.get(`/arquivos/${arquivoId}`)
        .then((res) => {
          if (res.data?.dados) {
            const dados: ArquivoInfo = res.data.dados;
            setArquivo(dados);
            if (dados.tipo && dados.tipo.startsWith('image/')) {
              setPreviewUrl(`/api/arquivos/${dados.id}/conteudo`);
            } else {
              setPreviewUrl(null);
            }
          }
        })
        .catch(() => {
          setArquivo(null);
          setPreviewUrl(null);
        });
    } else {
      setArquivo(null);
      setPreviewUrl(null);
    }
  }, [arquivoId, arquivoInicial]);

  const onDrop = async (acceptedFiles: File[]) => {
    if (!acceptedFiles || acceptedFiles.length === 0) {
      return;
    }

    const file = acceptedFiles[0];
    setCarregando(true);
    setErroUpload(null);

    // Se for imagem, já cria URL local temporária para preview imediato
    let tempUrl: string | null = null;
    if (file.type.startsWith('image/')) {
      tempUrl = URL.createObjectURL(file);
      setPreviewUrl(tempUrl);
    } else {
      setPreviewUrl(null);
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await api.post('/arquivos/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const dados: ArquivoInfo = response.data?.dados;
      setArquivo(dados);
      onArquivoAlterado(dados);
    } catch (err: any) {
      let mensagem = 'Erro ao enviar o arquivo. Tente novamente.';
      if (err.response?.data?.mensagem) {
        mensagem = err.response.data.mensagem;
      }
      setErroUpload(mensagem);
      setArquivo(null);
      setPreviewUrl(null);
      onArquivoAlterado(null);
    } finally {
      setCarregando(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    maxFiles: 1,
    disabled: disabled || carregando,
    accept: {
      'image/*': ['.jpg', '.jpeg', '.png', '.gif', '.webp'],
      'application/pdf': ['.pdf'],
      'text/plain': ['.txt'],
    },
  });

  const handleRemover = (e: React.MouseEvent) => {
    e.stopPropagation();
    setArquivo(null);
    setPreviewUrl(null);
    setErroUpload(null);
    onArquivoAlterado(null);
  };

  const handleAbrirConteudo = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (arquivo?.id) {
      window.open(`/api/arquivos/${arquivo.id}/conteudo`, '_blank');
    }
  };

  // Renderização do ícone representativo por extensão
  const renderIconeArquivo = () => {
    const ext = arquivo?.extensao ? arquivo.extensao.toLowerCase() : '';
    if (ext === 'pdf') {
      return <PictureAsPdfIcon sx={{ fontSize: 44, color: '#d32f2f' }} />;
    }
    if (ext === 'txt') {
      return <DescriptionIcon sx={{ fontSize: 44, color: '#1976d2' }} />;
    }
    return <InsertDriveFileIcon sx={{ fontSize: 44, color: '#757575' }} />;
  };

  return (
    <Box sx={{ width: '100%', my: 1 }}>
      <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary', display: 'block', mb: 0.5 }}>
        {label}
      </Typography>

      {/* CASO: ARQUIVO SELECIONADO / EXISTENTE COM PREVIEW */}
      {arquivo ? (
        <Paper
          variant="outlined"
          sx={{
            p: 2,
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            bgcolor: 'grey.50',
            borderColor: 'divider',
            borderRadius: 2,
          }}
        >
          {/* PREVIEW DE IMAGEM */}
          {previewUrl ? (
            <Box
              component="img"
              src={previewUrl}
              alt={arquivo.nome}
              sx={{
                width: 64,
                height: 64,
                objectFit: 'cover',
                borderRadius: 1.5,
                border: '1px solid #e0e0e0',
                bgcolor: '#ffffff',
              }}
            />
          ) : (
            <Box
              sx={{
                width: 64,
                height: 64,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: '#ffffff',
                borderRadius: 1.5,
                border: '1px solid #e0e0e0',
              }}
            >
              {renderIconeArquivo()}
            </Box>
          )}

          {/* DADOS DO ARQUIVO */}
          <Box sx={{ flexGrow: 1, minWidth: 0 }}>
            <Typography variant="body2" sx={{ fontWeight: 600 }} noWrap>
              {arquivo.nome}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
              <Chip
                label={arquivo.extensao.toUpperCase()}
                size="small"
                sx={{ height: 20, fontSize: '0.7rem', fontWeight: 700 }}
              />
              <Typography variant="caption" color="text.secondary">
                {formatarTamanhoBytes(arquivo.tamanho)}
              </Typography>
            </Box>
          </Box>

          {/* BOTÕES DE AÇÃO */}
          <Box sx={{ display: 'flex', gap: 1 }}>
            {arquivo.id && (
              <Tooltip title="Visualizar arquivo em nova aba">
                <IconButton size="small" color="primary" onClick={handleAbrirConteudo}>
                  <OpenInNewIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
            {!disabled && (
              <Tooltip title="Remover anexo">
                <IconButton size="small" color="error" onClick={handleRemover}>
                  <DeleteOutlineIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
          </Box>
        </Paper>
      ) : (
        /* CASO: DROPZONE VAZIO PARA UPLOAD */
        <Box
          {...getRootProps()}
          sx={{
            border: '2px dashed',
            borderColor: isDragActive ? 'primary.main' : 'grey.400',
            bgcolor: isDragActive ? 'action.hover' : 'background.paper',
            borderRadius: 2,
            p: 2.5,
            textAlign: 'center',
            cursor: disabled ? 'default' : 'pointer',
            transition: 'border-color 0.2s, background-color 0.2s',
            '&:hover': {
              borderColor: disabled ? 'grey.400' : 'primary.main',
              bgcolor: disabled ? 'background.paper' : 'action.hover',
            },
          }}
        >
          <input {...getInputProps()} />

          {carregando ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 1 }}>
              <CircularProgress size={32} />
              <Typography variant="caption" sx={{ mt: 1, color: 'text.secondary' }}>
                Enviando arquivo para o servidor...
              </Typography>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <CloudUploadIcon sx={{ fontSize: 36, color: 'primary.main', mb: 0.5 }} />
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {isDragActive
                  ? 'Solte o arquivo aqui...'
                  : 'Arraste o arquivo ou clique para selecionar'}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
                Suporta PDF, JPG, PNG e TXT (máximo 1 arquivo)
              </Typography>
              <Button size="small" variant="outlined" sx={{ mt: 1.5, pointerEvents: 'none' }}>
                Selecionar do Computador
              </Button>
            </Box>
          )}
        </Box>
      )}

      {erroUpload && (
        <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
          {erroUpload}
        </Typography>
      )}
    </Box>
  );
};
