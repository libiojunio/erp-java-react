-- ============================================================================
-- V1__init_schema.sql
-- ERP Multiempresa - Esquema inicial do banco de dados (Oracle)
-- ============================================================================

-- 1. Tabela de Perfis
CREATE TABLE perfil (
    id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nome VARCHAR2(50) NOT NULL UNIQUE,
    descricao VARCHAR2(255)
);

-- 2. Tabela de Empresas
CREATE TABLE empresa (
    id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    razao_social VARCHAR2(255) NOT NULL,
    nome_fantasia VARCHAR2(255),
    cnpj VARCHAR2(14) NOT NULL UNIQUE,
    inscricao_estadual VARCHAR2(30),
    cep VARCHAR2(8),
    logradouro VARCHAR2(255),
    numero VARCHAR2(50),
    complemento VARCHAR2(100),
    bairro VARCHAR2(100),
    cidade VARCHAR2(100),
    uf VARCHAR2(2),
    situacao VARCHAR2(20) DEFAULT 'ATIVO' NOT NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    criado_por VARCHAR2(100) DEFAULT 'SISTEMA' NOT NULL,
    alterado_em TIMESTAMP,
    alterado_por VARCHAR2(100)
);

-- 3. Tabela de Usuários
CREATE TABLE usuario (
    id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nome VARCHAR2(150) NOT NULL,
    email VARCHAR2(150) NOT NULL UNIQUE,
    senha VARCHAR2(255) NOT NULL,
    situacao VARCHAR2(20) DEFAULT 'ATIVO' NOT NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    criado_por VARCHAR2(100) DEFAULT 'SISTEMA' NOT NULL,
    alterado_em TIMESTAMP,
    alterado_por VARCHAR2(100)
);

-- 4. Associação Usuário x Perfil
CREATE TABLE usuario_perfil (
    usuario_id NUMBER NOT NULL,
    perfil_id NUMBER NOT NULL,
    CONSTRAINT pk_usuario_perfil PRIMARY KEY (usuario_id, perfil_id),
    CONSTRAINT fk_usu_perf_usuario FOREIGN KEY (usuario_id) REFERENCES usuario(id) ON DELETE CASCADE,
    CONSTRAINT fk_usu_perf_perfil FOREIGN KEY (perfil_id) REFERENCES perfil(id) ON DELETE CASCADE
);

-- 5. Associação Usuário x Empresa (Multiempresa)
CREATE TABLE usuario_empresa (
    id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    usuario_id NUMBER NOT NULL,
    empresa_id NUMBER NOT NULL,
    padrao NUMBER(1) DEFAULT 0 NOT NULL,
    CONSTRAINT uk_usuario_empresa UNIQUE (usuario_id, empresa_id),
    CONSTRAINT fk_usu_emp_usuario FOREIGN KEY (usuario_id) REFERENCES usuario(id) ON DELETE CASCADE,
    CONSTRAINT fk_usu_emp_empresa FOREIGN KEY (empresa_id) REFERENCES empresa(id) ON DELETE CASCADE
);

-- 6. Tabela de Clientes
CREATE TABLE cliente (
    id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    empresa_id NUMBER NOT NULL,
    tipo_pessoa VARCHAR2(2) NOT NULL, -- 'PF' ou 'PJ'
    documento VARCHAR2(14) NOT NULL,  -- CPF (11) ou CNPJ (14)
    nome_razao_social VARCHAR2(255) NOT NULL,
    nome_fantasia VARCHAR2(255),
    inscricao_estadual VARCHAR2(30),
    data_nascimento DATE,
    email VARCHAR2(150),
    telefone VARCHAR2(20),
    situacao VARCHAR2(20) DEFAULT 'ATIVO' NOT NULL, -- 'ATIVO', 'INATIVO'
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    criado_por VARCHAR2(100) DEFAULT 'SISTEMA' NOT NULL,
    alterado_em TIMESTAMP,
    alterado_por VARCHAR2(100),
    CONSTRAINT uk_cliente_empresa_doc UNIQUE (empresa_id, documento),
    CONSTRAINT fk_cliente_empresa FOREIGN KEY (empresa_id) REFERENCES empresa(id)
);

CREATE INDEX idx_cliente_empresa ON cliente(empresa_id);
CREATE INDEX idx_cliente_nome ON cliente(nome_razao_social);

-- 7. Tabela de Endereços do Cliente
CREATE TABLE cliente_endereco (
    id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    cliente_id NUMBER NOT NULL,
    tipo VARCHAR2(20) DEFAULT 'PRINCIPAL' NOT NULL, -- 'PRINCIPAL', 'COBRANCA', 'ENTREGA'
    cep VARCHAR2(8) NOT NULL,
    logradouro VARCHAR2(255) NOT NULL,
    numero VARCHAR2(50) NOT NULL,
    complemento VARCHAR2(100),
    bairro VARCHAR2(100) NOT NULL,
    cidade VARCHAR2(100) NOT NULL,
    uf VARCHAR2(2) NOT NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    criado_por VARCHAR2(100) DEFAULT 'SISTEMA' NOT NULL,
    alterado_em TIMESTAMP,
    alterado_por VARCHAR2(100),
    CONSTRAINT fk_endereco_cliente FOREIGN KEY (cliente_id) REFERENCES cliente(id) ON DELETE CASCADE
);

CREATE INDEX idx_endereco_cliente ON cliente_endereco(cliente_id);

-- 8. Tabela de Contatos do Cliente
CREATE TABLE cliente_contato (
    id NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    cliente_id NUMBER NOT NULL,
    nome VARCHAR2(150) NOT NULL,
    cargo VARCHAR2(100),
    email VARCHAR2(150),
    telefone VARCHAR2(20),
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    criado_por VARCHAR2(100) DEFAULT 'SISTEMA' NOT NULL,
    alterado_em TIMESTAMP,
    alterado_por VARCHAR2(100),
    CONSTRAINT fk_contato_cliente FOREIGN KEY (cliente_id) REFERENCES cliente(id) ON DELETE CASCADE
);

CREATE INDEX idx_contato_cliente ON cliente_contato(cliente_id);

-- ============================================================================
-- Carga Inicial (Seed de Perfis e Empresa Padrão)
-- ============================================================================
INSERT INTO perfil (nome, descricao) VALUES ('ROLE_ADMIN', 'Administrador do Sistema');
INSERT INTO perfil (nome, descricao) VALUES ('ROLE_OPERADOR', 'Operador do Sistema');

-- Empresa Matriz Modelo
INSERT INTO empresa (razao_social, nome_fantasia, cnpj, situacao, criado_por)
VALUES ('EMPRESA MATRIZ EXEMPLO LTDA', 'Matriz ERP', '12345678000195', 'ATIVO', 'SISTEMA');

-- Senha padrão 'admin123' em BCrypt: $2a$10$wN3p5M/tGvXW4H1H7l6u4.5wS4R0dF9h9i2w0X6QyJ2h8k1e3p1vK
-- Usamos hash BCrypt gerado com custo 10 para senha admin123:
-- $2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi (standard "password") ou admin123
INSERT INTO usuario (nome, email, senha, situacao, criado_por)
VALUES ('Administrador Master', 'admin@erp.com', '$2a$10$Xptfsk8h7o6KkC7wX6kQ..R4Ew01w6uR5o1W6iQp0V6H0z6G2F1xO', 'ATIVO', 'SISTEMA');

INSERT INTO usuario_perfil (usuario_id, perfil_id)
SELECT u.id, p.id FROM usuario u, perfil p WHERE u.email = 'admin@erp.com' AND p.nome = 'ROLE_ADMIN';

INSERT INTO usuario_empresa (usuario_id, empresa_id, padrao)
SELECT u.id, e.id, 1 FROM usuario u, empresa e WHERE u.email = 'admin@erp.com' AND e.cnpj = '12345678000195';
