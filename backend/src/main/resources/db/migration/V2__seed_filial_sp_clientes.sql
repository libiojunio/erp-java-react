-- ============================================================================
-- V2__seed_filial_sp_clientes.sql
-- Inclusão da Filial São Paulo e Clientes de Teste para o Isolamento Multiempresa
-- ============================================================================

-- 1. Empresa Filial São Paulo
INSERT INTO empresa (razao_social, nome_fantasia, cnpj, inscricao_estadual, cidade, uf, situacao, criado_por)
VALUES ('FILIAL SAO PAULO COMERCIO DE ALIMENTOS LTDA', 'Filial SP', '98765432000188', '990880770220', 'Campinas', 'SP', 'ATIVO', 'SISTEMA');

-- 2. Vincula Administrador a Filial SP (secundaria)
INSERT INTO usuario_empresa (usuario_id, empresa_id, padrao)
SELECT u.id, e.id, 0 FROM usuario u, empresa e WHERE u.email = 'admin@erp.com' AND e.cnpj = '98765432000188';

-- 3. Clientes da Empresa Matriz
INSERT INTO cliente (empresa_id, tipo_pessoa, documento, nome_razao_social, nome_fantasia, email, telefone, situacao, criado_por)
SELECT e.id, 'PJ', '11222333000144', 'DISTRIBUIDORA MATRIZ ALIMENTOS LTDA', 'Matriz Alimentos', 'contato@matrizalimentos.com.br', '(11) 3456-7890', 'ATIVO', 'SISTEMA'
FROM empresa e WHERE e.cnpj = '12345678000195';

INSERT INTO cliente (empresa_id, tipo_pessoa, documento, nome_razao_social, email, telefone, situacao, criado_por)
SELECT e.id, 'PF', '12345678900', 'Carlos Alberto de Souza (Matriz)', 'carlos.souza@gmail.com', '(11) 98765-4321', 'ATIVO', 'SISTEMA'
FROM empresa e WHERE e.cnpj = '12345678000195';

-- 4. Clientes da Filial SP
INSERT INTO cliente (empresa_id, tipo_pessoa, documento, nome_razao_social, nome_fantasia, email, telefone, situacao, criado_por)
SELECT e.id, 'PJ', '44555666000177', 'AUTO PECAS PAULISTA LTDA', 'Paulista Auto Peças', 'vendas@autopecaspaulista.com.br', '(19) 3876-1122', 'ATIVO', 'SISTEMA'
FROM empresa e WHERE e.cnpj = '98765432000188';

INSERT INTO cliente (empresa_id, tipo_pessoa, documento, nome_razao_social, nome_fantasia, email, telefone, situacao, criado_por)
SELECT e.id, 'PJ', '77888999000100', 'RESTAURANTE SABOR DE SAO PAULO LTDA', 'Sabor Paulista', 'financeiro@saborpaulista.com.br', '(19) 3221-5500', 'ATIVO', 'SISTEMA'
FROM empresa e WHERE e.cnpj = '98765432000188';

INSERT INTO cliente (empresa_id, tipo_pessoa, documento, nome_razao_social, email, telefone, situacao, criado_por)
SELECT e.id, 'PF', '98765432100', 'Mariana Silva Santos (Filial SP)', 'mariana.santos@outlook.com', '(19) 97123-4567', 'ATIVO', 'SISTEMA'
FROM empresa e WHERE e.cnpj = '98765432000188';
