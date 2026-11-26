-- ============================================================================
-- V5__adicionar_campo_versao_cliente_e_empresa.sql
-- Adiciona campo de controle de versão (concorrência otimista) em cliente e empresa
-- ============================================================================

ALTER TABLE cliente ADD versao NUMBER(19) DEFAULT 0 NOT NULL;
ALTER TABLE empresa ADD versao NUMBER(19) DEFAULT 0 NOT NULL;
