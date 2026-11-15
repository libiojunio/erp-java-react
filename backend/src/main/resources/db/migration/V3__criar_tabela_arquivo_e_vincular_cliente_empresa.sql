-- ============================================================================
-- V3__criar_tabela_arquivo_e_vincular_cliente_empresa.sql
-- Armazenamento de arquivos (BLOB) com metadados (nome, extensão, tipo, tamanho)
-- e vinculação de anexo único em Empresa e Cliente
-- ============================================================================

-- 1. Tabela central de Arquivos
CREATE TABLE arquivo (
    id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    empresa_id NUMBER,
    nome VARCHAR2(255) NOT NULL,
    extensao VARCHAR2(30) NOT NULL,
    tipo VARCHAR2(100) NOT NULL,
    tamanho NUMBER NOT NULL,
    dados BLOB NOT NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    criado_por VARCHAR2(100) DEFAULT 'SISTEMA' NOT NULL,
    alterado_em TIMESTAMP,
    alterado_por VARCHAR2(100),
    CONSTRAINT fk_arquivo_empresa FOREIGN KEY (empresa_id) REFERENCES empresa(id) ON DELETE SET NULL
);

CREATE INDEX idx_arquivo_empresa ON arquivo(empresa_id);

-- 2. Vinculação na tabela Empresa (FK para arquivo_id)
ALTER TABLE empresa ADD arquivo_id NUMBER;
ALTER TABLE empresa ADD CONSTRAINT fk_empresa_arquivo FOREIGN KEY (arquivo_id) REFERENCES arquivo(id) ON DELETE SET NULL;
CREATE INDEX idx_empresa_arquivo ON empresa(arquivo_id);

-- 3. Vinculação na tabela Cliente (FK para arquivo_id)
ALTER TABLE cliente ADD arquivo_id NUMBER;
ALTER TABLE cliente ADD CONSTRAINT fk_cliente_arquivo FOREIGN KEY (arquivo_id) REFERENCES arquivo(id) ON DELETE SET NULL;
CREATE INDEX idx_cliente_arquivo ON cliente(arquivo_id);
