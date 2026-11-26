import React, { useState } from 'react';
import {
  Box,
  Chip,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RefreshIcon from '@mui/icons-material/Refresh';
import { GridColDef } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';
import { EmpresaItem } from '../types';
import { AppDataTable } from '../components/table/AppDataTable';
import { IdChip } from '../components/table/IdChip';
import { PageHeader } from '../components/layout/PageHeader';
import { BotaoTooltip } from '../components/common/BotaoTooltip';
import { BotaoAcao } from '../components/common/BotaoAcao';
import { formatarCnpj } from '../utils/documentos';

interface EmpresasPageProps {
  iniciarPesquisando?: boolean;
}

export const EmpresasPage: React.FC<EmpresasPageProps> = ({
  iniciarPesquisando = true,
}) => {
  const navigate = useNavigate();

  // Gatilho para recarregar a tabela quando solicitado pelo botão no cabeçalho
  const [recarregarChave, setRecarregarChave] = useState<number>(0);

  // Estado para termo de busca
  const [filtroTermo, setFiltroTermo] = useState<string>('');

  // Colunas do DataGrid (com ID Chip clicável)
  const columns: GridColDef<EmpresaItem>[] = [
    {
      field: 'id',
      headerName: 'ID',
      width: 80,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => (
        <IdChip
          id={params.value}
          onClick={() => {
            navigate(`/empresas/visualizar/${params.row.id}`);
          }}
          tooltip="Clique para visualizar a empresa"
        />
      ),
    },
    {
      field: 'cnpj',
      headerName: 'CNPJ',
      width: 175,
      valueGetter: (_, row) => {
        return formatarCnpj(row.cnpj);
      },
    },
    { field: 'razaoSocial', headerName: 'Razão Social', flex: 1, minWidth: 220 },
    {
      field: 'nomeFantasia',
      headerName: 'Nome Fantasia',
      width: 180,
      valueGetter: (v) => {
        return v || '-';
      },
    },
    {
      field: 'localizacao',
      headerName: 'Cidade / UF',
      width: 160,
      valueGetter: (_, row) => {
        if (row.cidade) {
          return `${row.cidade}/${row.uf || ''}`;
        }
        return '-';
      },
    },
    {
      field: 'situacao',
      headerName: 'Situação',
      width: 110,
      renderCell: (params) => (
        <Chip
          label={params.value}
          size="small"
          color={params.value === 'ATIVO' ? 'success' : 'error'}
          sx={{ fontWeight: 600 }}
        />
      ),
    },
  ];

  return (
    <Box>
      {/* Cabeçalho Reutilizável com BotaoTooltip e BotaoAcao */}
      <PageHeader
        title="Gerenciamento de Empresas"
        subtitle="Administração das filiais e unidades organizacionais (Acesso Restrito ao Perfil ADMIN)"
        actions={
          <>
            <BotaoTooltip
              titulo="Recarregar Lista"
              icone={<RefreshIcon />}
              onClick={() => {
                setRecarregarChave((prev) => prev + 1);
              }}
              color="primary"
            />
            <BotaoAcao
              texto="Nova Empresa"
              icone={<AddIcon />}
              onClick={() => {
                navigate('/empresas/novo');
              }}
            />
          </>
        }
      />

      {/* Tabela Independente: busca dados diretamente do backend via fetchUrl respeitando iniciarPesquisando */}
      <AppDataTable
        fetchUrl="/empresas"
        storageKey="empresas_pagination"
        columns={columns}
        searchPlaceholder="Pesquisar por Razão Social, Nome Fantasia ou CNPJ..."
        searchValue={filtroTermo}
        onSearchChange={setFiltroTermo}
        iniciarPesquisando={iniciarPesquisando}
        reloadTrigger={recarregarChave}
      />
    </Box>
  );
};

export default EmpresasPage;
