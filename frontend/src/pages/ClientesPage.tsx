import React, { useState } from 'react';
import {
  Box,
  Chip,
  TextField,
  MenuItem,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RefreshIcon from '@mui/icons-material/Refresh';
import { GridColDef } from '@mui/x-data-grid';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { ClienteItem, SituacaoFiltro } from '../types';
import { AppDataTable } from '../components/table/AppDataTable';
import { IdChip } from '../components/table/IdChip';
import { PageHeader } from '../components/layout/PageHeader';
import { Alerta } from '../components/common/Alerta';
import { BotaoTooltip } from '../components/common/BotaoTooltip';
import { BotaoAcao } from '../components/common/BotaoAcao';
import {
  formatarCnpj,
  formatarDocumento,
  formatarTelefone,
} from '../utils/documentos';

interface ClientesPageProps {
  iniciarPesquisando?: boolean;
}

export const ClientesPage: React.FC<ClientesPageProps> = ({
  iniciarPesquisando = true,
}) => {
  const { empresaAtiva } = useAuth();
  const navigate = useNavigate();

  // Gatilho para recarregar a tabela quando solicitado pelo botão no cabeçalho
  const [recarregarChave, setRecarregarChave] = useState<number>(0);

  // Estados de filtros persistidos na sessão
  const [filtroTermo, setFiltroTermo] = useState<string>(() => {
    return sessionStorage.getItem('clientes_filtro_termo') || '';
  });
  const [filtroSituacao, setFiltroSituacao] = useState<SituacaoFiltro>(() => {
    const salvo = sessionStorage.getItem('clientes_filtro_situacao');
    if (salvo === 'ATIVO' || salvo === 'INATIVO' || salvo === 'TODOS') {
      return salvo;
    }
    return 'TODOS';
  });

  // Request inicial que traz as opções de campos select (do backend com ENUM)
  const { data: opcoesData } = useQuery({
    queryKey: ['clientes-opcoes'],
    queryFn: async () => {
      try {
        const response = await api.get('/clientes/opcoes');
        return response.data?.dados;
      } catch (err) {
        return null;
      }
    },
  });

  const handleFiltroTermoChange = (valor: string) => {
    setFiltroTermo(valor);
    sessionStorage.setItem('clientes_filtro_termo', valor);
  };

  const handleFiltroSituacaoChange = (valor: SituacaoFiltro) => {
    setFiltroSituacao(valor);
    sessionStorage.setItem('clientes_filtro_situacao', valor);
  };

  // Colunas do DataGrid (com ID Chip clicável)
  const columns: GridColDef<ClienteItem>[] = [
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
            navigate(`/clientes/visualizar/${params.row.id}`);
          }}
          tooltip="Clique para visualizar o cliente"
        />
      ),
    },
    {
      field: 'tipoPessoa',
      headerName: 'Tipo',
      width: 75,
      renderCell: (params) => (
        <Chip
          label={params.value}
          size="small"
          color={params.value === 'PJ' ? 'primary' : 'secondary'}
          variant="outlined"
          sx={{ fontWeight: 600 }}
        />
      ),
    },
    {
      field: 'documento',
      headerName: 'CPF / CNPJ',
      width: 170,
      valueGetter: (_, row) => {
        return formatarDocumento(row.documento, row.tipoPessoa);
      },
    },
    {
      field: 'nomeRazaoSocial',
      headerName: 'Nome / Razão Social',
      flex: 1.2,
      minWidth: 200,
    },
    {
      field: 'nomeFantasia',
      headerName: 'Nome Fantasia',
      flex: 0.9,
      minWidth: 150,
      valueGetter: (v) => {
        return v || '-';
      },
    },
    {
      field: 'cidadeUf',
      headerName: 'Cidade / UF',
      width: 140,
      valueGetter: (_, row) => {
        const principal = row.enderecos?.find((e: any) => {
          return e.tipo === 'PRINCIPAL';
        }) || row.enderecos?.[0];
        if (principal) {
          return `${principal.cidade}/${principal.uf}`;
        }
        return '-';
      },
    },
    {
      field: 'email',
      headerName: 'E-mail',
      width: 190,
      valueGetter: (v) => {
        return v || '-';
      },
    },
    {
      field: 'telefone',
      headerName: 'Telefone',
      width: 140,
      valueGetter: (v) => {
        if (v) {
          return formatarTelefone(v);
        }
        return '-';
      },
    },
    {
      field: 'situacao',
      headerName: 'Situação',
      width: 105,
      renderCell: (params) => (
        <Chip
          label={params.value}
          size="small"
          color={params.value === 'ATIVO' ? 'success' : 'default'}
        />
      ),
    },
  ];

  if (!empresaAtiva) {
    return (
      <Box sx={{ p: 3 }}>
        <Alerta
          severity="warning"
          rotulo="Atenção:"
          texto="Nenhuma empresa ativa selecionada no contexto. Por favor, selecione uma empresa no cabeçalho superior para gerenciar os clientes."
        />
      </Box>
    );
  }

  // Lista de situações obtidas do backend ou lista padrão
  const situacoesDisponiveis = opcoesData?.situacoes || [
    { valor: 'ATIVO', descricao: 'Ativo' },
    { valor: 'INATIVO', descricao: 'Inativo' },
  ];

  return (
    <Box>
      {/* Cabeçalho Reutilizável com BotaoTooltip e BotaoAcao */}
      <PageHeader
        title="Cadastro de Clientes"
        subtitle="Gestão unificada de clientes (Pessoa Física e Jurídica) com isolamento multiempresa"
        actions={
          <>
            <BotaoTooltip
              titulo="Recarregar clientes"
              icone={<RefreshIcon />}
              onClick={() => {
                setRecarregarChave((prev) => prev + 1);
              }}
              color="primary"
            />
            <BotaoAcao
              texto="Novo Cliente"
              icone={<AddIcon />}
              onClick={() => {
                navigate('/clientes/novo');
              }}
            />
          </>
        }
      />

      {/* Componente Alerta Reutilizável com rótulo e texto configurados */}
      <Alerta
        rotulo="Empresa Ativa: "
        texto={
          empresaAtiva
            ? `${empresaAtiva.nomeFantasia || empresaAtiva.razaoSocial} (CNPJ: ${formatarCnpj(empresaAtiva.cnpj)})`
            : 'Nenhuma selecionada'
        }
      />

      {/* Tabela Independente: busca dados diretamente do backend via fetchUrl respeitando iniciarPesquisando */}
      <AppDataTable
        fetchUrl={`/clientes`}
        storageKey="clientes_pagination"
        columns={columns}
        searchPlaceholder="Pesquisar por Razão Social, Nome Fantasia ou CPF/CNPJ..."
        searchValue={filtroTermo}
        onSearchChange={handleFiltroTermoChange}
        extraParams={{
          situacao: filtroSituacao !== 'TODOS' ? filtroSituacao : undefined,
        }}
        extraFilters={
          <TextField
            select
            fullWidth
            size="small"
            label="Situação"
            value={filtroSituacao}
            onChange={(e) => {
              handleFiltroSituacaoChange(e.target.value as SituacaoFiltro);
            }}
          >
            <MenuItem value="TODOS">Todos</MenuItem>
            {situacoesDisponiveis.map((sit: any) => (
              <MenuItem key={sit.valor} value={sit.valor}>
                {sit.descricao}
              </MenuItem>
            ))}
          </TextField>
        }
        iniciarPesquisando={iniciarPesquisando}
        reloadTrigger={recarregarChave}
      />
    </Box>
  );
};

export default ClientesPage;
