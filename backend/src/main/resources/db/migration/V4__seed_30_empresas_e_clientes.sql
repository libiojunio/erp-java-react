-- ============================================================================
-- V4__seed_30_empresas_e_clientes.sql
-- Carga de 30 Empresas e 30 Clientes (15 PF + 15 PJ) para Testes e Producao
-- ============================================================================

-- 1. Inclusao de 30 Empresas em diversos estados brasileiros
MERGE INTO empresa dest
USING (SELECT '20000074000135' AS cnpj FROM dual) src
ON (dest.cnpj = src.cnpj)
WHEN NOT MATCHED THEN
  INSERT (razao_social, nome_fantasia, cnpj, inscricao_estadual, cep, logradouro, numero, complemento, bairro, cidade, uf, situacao, criado_por)
  VALUES ('TECH SOLUTIONS BRASIL INFORMATICA LTDA', 'Tech Solutions', '20000074000135', '100000382918', '01310100', 'Avenida Paulista', '1000', 'Andar 14', 'Bela Vista', 'São Paulo', 'SP', 'ATIVO', 'CARGA_SEED');

MERGE INTO empresa dest
USING (SELECT '20000147000199' AS cnpj FROM dual) src
ON (dest.cnpj = src.cnpj)
WHEN NOT MATCHED THEN
  INSERT (razao_social, nome_fantasia, cnpj, inscricao_estadual, cep, logradouro, numero, complemento, bairro, cidade, uf, situacao, criado_por)
  VALUES ('NOVA ERA LOGISTICA E TRANSPORTES S.A.', 'Nova Era Log', '20000147000199', '100000765836', '13080000', 'Avenida Brasil', '2500', 'Galpão A', 'Vila Nova', 'Campinas', 'SP', 'ATIVO', 'CARGA_SEED');

MERGE INTO empresa dest
USING (SELECT '20000220000122' AS cnpj FROM dual) src
ON (dest.cnpj = src.cnpj)
WHEN NOT MATCHED THEN
  INSERT (razao_social, nome_fantasia, cnpj, inscricao_estadual, cep, logradouro, numero, complemento, bairro, cidade, uf, situacao, criado_por)
  VALUES ('AGROPECUARIA VALE VERDE LTDA', 'Vale Verde Agro', '20000220000122', '100001148754', '14020000', 'Rodovia Anhanguera', 'KM 312', 'Fazenda', 'Distrito Industrial', 'Ribeirão Preto', 'SP', 'ATIVO', 'CARGA_SEED');

MERGE INTO empresa dest
USING (SELECT '20000293000114' AS cnpj FROM dual) src
ON (dest.cnpj = src.cnpj)
WHEN NOT MATCHED THEN
  INSERT (razao_social, nome_fantasia, cnpj, inscricao_estadual, cep, logradouro, numero, complemento, bairro, cidade, uf, situacao, criado_por)
  VALUES ('COMERCIAL ALVORADA DE ALIMENTOS LTDA', 'Alvorada Alimentos', '20000293000114', '100001531672', '11010000', 'Rua do Comércio', '45', 'Loja 1', 'Centro', 'Santos', 'SP', 'ATIVO', 'CARGA_SEED');

MERGE INTO empresa dest
USING (SELECT '20000366000178' AS cnpj FROM dual) src
ON (dest.cnpj = src.cnpj)
WHEN NOT MATCHED THEN
  INSERT (razao_social, nome_fantasia, cnpj, inscricao_estadual, cep, logradouro, numero, complemento, bairro, cidade, uf, situacao, criado_por)
  VALUES ('INDUSTRIAL METALURGICA ATLAS S.A.', 'Atlas Metalúrgica', '20000366000178', '100001914590', '18087000', 'Avenida das Indústrias', '500', '', 'Zona Industrial', 'Sorocaba', 'SP', 'ATIVO', 'CARGA_SEED');

MERGE INTO empresa dest
USING (SELECT '20000439000121' AS cnpj FROM dual) src
ON (dest.cnpj = src.cnpj)
WHEN NOT MATCHED THEN
  INSERT (razao_social, nome_fantasia, cnpj, inscricao_estadual, cep, logradouro, numero, complemento, bairro, cidade, uf, situacao, criado_por)
  VALUES ('DISTRIBUIDORA HORIZONTE DE BEBIDAS LTDA', 'Horizonte Bebidas', '20000439000121', '100002297508', '12240000', 'Rua Paraibuna', '890', '', 'Jardim São Dimas', 'São José dos Campos', 'SP', 'ATIVO', 'CARGA_SEED');

MERGE INTO empresa dest
USING (SELECT '20000512000165' AS cnpj FROM dual) src
ON (dest.cnpj = src.cnpj)
WHEN NOT MATCHED THEN
  INSERT (razao_social, nome_fantasia, cnpj, inscricao_estadual, cep, logradouro, numero, complemento, bairro, cidade, uf, situacao, criado_por)
  VALUES ('PHARMA VIDA DISTRIBUIDORA DE MEDICAMENTOS LTDA', 'PharmaVida', '20000512000165', '100002680426', '30130000', 'Avenida Afonso Pena', '1500', 'Sala 802', 'Funcionários', 'Belo Horizonte', 'MG', 'ATIVO', 'CARGA_SEED');

MERGE INTO empresa dest
USING (SELECT '20000585000157' AS cnpj FROM dual) src
ON (dest.cnpj = src.cnpj)
WHEN NOT MATCHED THEN
  INSERT (razao_social, nome_fantasia, cnpj, inscricao_estadual, cep, logradouro, numero, complemento, bairro, cidade, uf, situacao, criado_por)
  VALUES ('MINERACAO E SIDERURGIA DO BRASIL S.A.', 'MSB Mineração', '20000585000157', '100003063344', '32010000', 'Avenida Amazonas', '4500', 'Bloco B', 'Industrial', 'Contagem', 'MG', 'ATIVO', 'CARGA_SEED');

MERGE INTO empresa dest
USING (SELECT '20000658000100' AS cnpj FROM dual) src
ON (dest.cnpj = src.cnpj)
WHEN NOT MATCHED THEN
  INSERT (razao_social, nome_fantasia, cnpj, inscricao_estadual, cep, logradouro, numero, complemento, bairro, cidade, uf, situacao, criado_por)
  VALUES ('SUPERMERCADOS BOM PRECO LTDA', 'Bom Preço Supermercados', '20000658000100', '100003446262', '38400000', 'Avenida Rondon Pacheco', '2100', '', 'Tibery', 'Uberlândia', 'MG', 'ATIVO', 'CARGA_SEED');

MERGE INTO empresa dest
USING (SELECT '20000731000144' AS cnpj FROM dual) src
ON (dest.cnpj = src.cnpj)
WHEN NOT MATCHED THEN
  INSERT (razao_social, nome_fantasia, cnpj, inscricao_estadual, cep, logradouro, numero, complemento, bairro, cidade, uf, situacao, criado_por)
  VALUES ('RIO BELLA INDUSTRIA TEXTIL LTDA', 'Rio Bella Têxtil', '20000731000144', '100003829180', '20040000', 'Avenida Rio Branco', '120', 'Sobreloja', 'Centro', 'Rio de Janeiro', 'RJ', 'ATIVO', 'CARGA_SEED');

MERGE INTO empresa dest
USING (SELECT '20000804000106' AS cnpj FROM dual) src
ON (dest.cnpj = src.cnpj)
WHEN NOT MATCHED THEN
  INSERT (razao_social, nome_fantasia, cnpj, inscricao_estadual, cep, logradouro, numero, complemento, bairro, cidade, uf, situacao, criado_por)
  VALUES ('MARITIMA ENGENHARIA E SERVICOS S.A.', 'Marítima Offshore', '20000804000106', '100004212098', '27910000', 'Rodovia Amaral Peixoto', 'KM 180', 'Base Marítima', 'Imboassica', 'Macaé', 'RJ', 'ATIVO', 'CARGA_SEED');

MERGE INTO empresa dest
USING (SELECT '20000877000190' AS cnpj FROM dual) src
ON (dest.cnpj = src.cnpj)
WHEN NOT MATCHED THEN
  INSERT (razao_social, nome_fantasia, cnpj, inscricao_estadual, cep, logradouro, numero, complemento, bairro, cidade, uf, situacao, criado_por)
  VALUES ('CARIOCA DISTRIBUIDORA DE PAPEIS LTDA', 'Carioca Papéis', '20000877000190', '100004595016', '24020000', 'Rua Coronel Moreira César', '340', '', 'Icaraí', 'Niterói', 'RJ', 'ATIVO', 'CARGA_SEED');

MERGE INTO empresa dest
USING (SELECT '20000950000123' AS cnpj FROM dual) src
ON (dest.cnpj = src.cnpj)
WHEN NOT MATCHED THEN
  INSERT (razao_social, nome_fantasia, cnpj, inscricao_estadual, cep, logradouro, numero, complemento, bairro, cidade, uf, situacao, criado_por)
  VALUES ('SUL BRASIL MAQUINAS AGRICOLAS LTDA', 'Sul Brasil Máquinas', '20000950000123', '100004977934', '80020000', 'Avenida Marechal Deodoro', '780', 'Conjunto 501', 'Centro', 'Curitiba', 'PR', 'ATIVO', 'CARGA_SEED');

MERGE INTO empresa dest
USING (SELECT '20001023000128' AS cnpj FROM dual) src
ON (dest.cnpj = src.cnpj)
WHEN NOT MATCHED THEN
  INSERT (razao_social, nome_fantasia, cnpj, inscricao_estadual, cep, logradouro, numero, complemento, bairro, cidade, uf, situacao, criado_por)
  VALUES ('PARANA EXPRESS ENCOMENDAS URGENTES LTDA', 'Paraná Express', '20001023000128', '100005360852', '86010000', 'Rua Paranaguá', '560', '', 'Centro', 'Londrina', 'PR', 'ATIVO', 'CARGA_SEED');

MERGE INTO empresa dest
USING (SELECT '20001096000110' AS cnpj FROM dual) src
ON (dest.cnpj = src.cnpj)
WHEN NOT MATCHED THEN
  INSERT (razao_social, nome_fantasia, cnpj, inscricao_estadual, cep, logradouro, numero, complemento, bairro, cidade, uf, situacao, criado_por)
  VALUES ('IGUACU PRODUTOS QUIMICOS S.A.', 'Iguaçu Química', '20001096000110', '100005743770', '87013000', 'Avenida Brasil', '3300', '', 'Zona 01', 'Maringá', 'PR', 'ATIVO', 'CARGA_SEED');

MERGE INTO empresa dest
USING (SELECT '20001169000173' AS cnpj FROM dual) src
ON (dest.cnpj = src.cnpj)
WHEN NOT MATCHED THEN
  INSERT (razao_social, nome_fantasia, cnpj, inscricao_estadual, cep, logradouro, numero, complemento, bairro, cidade, uf, situacao, criado_por)
  VALUES ('CATARINENSE PESCADOS E CONGELADOS LTDA', 'Pescados Catarinense', '20001169000173', '100006126688', '88010000', 'Rua Felipe Schmidt', '210', 'Loja A', 'Centro', 'Florianópolis', 'SC', 'ATIVO', 'CARGA_SEED');

MERGE INTO empresa dest
USING (SELECT '20001242000107' AS cnpj FROM dual) src
ON (dest.cnpj = src.cnpj)
WHEN NOT MATCHED THEN
  INSERT (razao_social, nome_fantasia, cnpj, inscricao_estadual, cep, logradouro, numero, complemento, bairro, cidade, uf, situacao, criado_por)
  VALUES ('VALE DO ITAJAI TEXTIL E MODA LTDA', 'Itajaí Têxtil', '20001242000107', '100006509606', '89010000', 'Rua XV de Novembro', '1120', '', 'Centro', 'Blumenau', 'SC', 'ATIVO', 'CARGA_SEED');

MERGE INTO empresa dest
USING (SELECT '20001315000160' AS cnpj FROM dual) src
ON (dest.cnpj = src.cnpj)
WHEN NOT MATCHED THEN
  INSERT (razao_social, nome_fantasia, cnpj, inscricao_estadual, cep, logradouro, numero, complemento, bairro, cidade, uf, situacao, criado_por)
  VALUES ('SANTA CATARINA TECNOLOGIA DA INFORMACAO S.A.', 'SC Tech', '20001315000160', '100006892524', '89201000', 'Rua Dona Francisca', '8300', 'Módulo 4', 'Zona Industrial Norte', 'Joinville', 'SC', 'ATIVO', 'CARGA_SEED');

MERGE INTO empresa dest
USING (SELECT '20001388000152' AS cnpj FROM dual) src
ON (dest.cnpj = src.cnpj)
WHEN NOT MATCHED THEN
  INSERT (razao_social, nome_fantasia, cnpj, inscricao_estadual, cep, logradouro, numero, complemento, bairro, cidade, uf, situacao, criado_por)
  VALUES ('GAUCHA DISTRIBUIDORA DE GRAOS LTDA', 'Gaúcha Grãos', '20001388000152', '100007275442', '90010000', 'Avenida Borges de Medeiros', '900', '12º Andar', 'Centro Histórico', 'Porto Alegre', 'RS', 'ATIVO', 'CARGA_SEED');

MERGE INTO empresa dest
USING (SELECT '20001461000196' AS cnpj FROM dual) src
ON (dest.cnpj = src.cnpj)
WHEN NOT MATCHED THEN
  INSERT (razao_social, nome_fantasia, cnpj, inscricao_estadual, cep, logradouro, numero, complemento, bairro, cidade, uf, situacao, criado_por)
  VALUES ('SERRA VERDE VINHOS E ESPUMANTES LTDA', 'Serra Verde Vinhos', '20001461000196', '100007658360', '95020000', 'Rua Sinimbu', '1450', '', 'Nossa Senhora de Lourdes', 'Caxias do Sul', 'RS', 'ATIVO', 'CARGA_SEED');

MERGE INTO empresa dest
USING (SELECT '20001534000140' AS cnpj FROM dual) src
ON (dest.cnpj = src.cnpj)
WHEN NOT MATCHED THEN
  INSERT (razao_social, nome_fantasia, cnpj, inscricao_estadual, cep, logradouro, numero, complemento, bairro, cidade, uf, situacao, criado_por)
  VALUES ('PAMPA IMPLEMENTOS RODOVIARIOS S.A.', 'Pampa Implementos', '20001534000140', '100008041278', '99010000', 'Avenida Brasil Oeste', '4100', '', 'Boqueirão', 'Passo Fundo', 'RS', 'INATIVO', 'CARGA_SEED');

MERGE INTO empresa dest
USING (SELECT '20001607000101' AS cnpj FROM dual) src
ON (dest.cnpj = src.cnpj)
WHEN NOT MATCHED THEN
  INSERT (razao_social, nome_fantasia, cnpj, inscricao_estadual, cep, logradouro, numero, complemento, bairro, cidade, uf, situacao, criado_por)
  VALUES ('BAHIA CACAU AGROINDUSTRIAL LTDA', 'Bahia Cacau', '20001607000101', '100008424196', '40015000', 'Avenida Sete de Setembro', '180', 'Sala 301', 'Dois de Julho', 'Salvador', 'BA', 'ATIVO', 'CARGA_SEED');

MERGE INTO empresa dest
USING (SELECT '20001680000175' AS cnpj FROM dual) src
ON (dest.cnpj = src.cnpj)
WHEN NOT MATCHED THEN
  INSERT (razao_social, nome_fantasia, cnpj, inscricao_estadual, cep, logradouro, numero, complemento, bairro, cidade, uf, situacao, criado_por)
  VALUES ('NORDESTE SOLAR GERACAO DE ENERGIA S.A.', 'Nordeste Solar', '20001680000175', '100008807114', '44001000', 'Avenida Getúlio Vargas', '1200', '', 'Centro', 'Feira de Santana', 'BA', 'ATIVO', 'CARGA_SEED');

MERGE INTO empresa dest
USING (SELECT '20001753000129' AS cnpj FROM dual) src
ON (dest.cnpj = src.cnpj)
WHEN NOT MATCHED THEN
  INSERT (razao_social, nome_fantasia, cnpj, inscricao_estadual, cep, logradouro, numero, complemento, bairro, cidade, uf, situacao, criado_por)
  VALUES ('CERRADO GRAOS E COMMODITIES LTDA', 'Cerrado Grãos', '20001753000129', '100009190032', '74000000', 'Avenida Goiás', '850', '', 'Setor Central', 'Goiânia', 'GO', 'ATIVO', 'CARGA_SEED');

MERGE INTO empresa dest
USING (SELECT '20001826000182' AS cnpj FROM dual) src
ON (dest.cnpj = src.cnpj)
WHEN NOT MATCHED THEN
  INSERT (razao_social, nome_fantasia, cnpj, inscricao_estadual, cep, logradouro, numero, complemento, bairro, cidade, uf, situacao, criado_por)
  VALUES ('BRASILIA DISTRIBUICAO DE PRODUTOS HOSPITALARES LTDA', 'Brasília Hospitalar', '20001826000182', '100009572950', '70040000', 'Setor Comercial Sul', 'Quadra 4', 'Bloco A Loja 22', 'Asa Sul', 'Brasília', 'DF', 'ATIVO', 'CARGA_SEED');

MERGE INTO empresa dest
USING (SELECT '20001899000174' AS cnpj FROM dual) src
ON (dest.cnpj = src.cnpj)
WHEN NOT MATCHED THEN
  INSERT (razao_social, nome_fantasia, cnpj, inscricao_estadual, cep, logradouro, numero, complemento, bairro, cidade, uf, situacao, criado_por)
  VALUES ('AMAZONAS BIOTECNOLOGIA E COSMETICOS S.A.', 'Amazon Biotech', '20001899000174', '100009955868', '69005000', 'Avenida Djalma Batista', '1661', 'Torre Business', 'Chapada', 'Manaus', 'AM', 'ATIVO', 'CARGA_SEED');

MERGE INTO empresa dest
USING (SELECT '20001972000108' AS cnpj FROM dual) src
ON (dest.cnpj = src.cnpj)
WHEN NOT MATCHED THEN
  INSERT (razao_social, nome_fantasia, cnpj, inscricao_estadual, cep, logradouro, numero, complemento, bairro, cidade, uf, situacao, criado_por)
  VALUES ('CEARA CALCADOS E ARTEFATOS DE COURO LTDA', 'Ceará Calçados', '20001972000108', '100010338786', '60010000', 'Rua Barão do Rio Branco', '1020', '', 'Centro', 'Fortaleza', 'CE', 'ATIVO', 'CARGA_SEED');

MERGE INTO empresa dest
USING (SELECT '20002045000102' AS cnpj FROM dual) src
ON (dest.cnpj = src.cnpj)
WHEN NOT MATCHED THEN
  INSERT (razao_social, nome_fantasia, cnpj, inscricao_estadual, cep, logradouro, numero, complemento, bairro, cidade, uf, situacao, criado_por)
  VALUES ('PERNAMBUCO LOGISTICA INTEGRADA LTDA', 'Pernambuco Log', '20002045000102', '100010721704', '50030000', 'Avenida Marquês de Olinda', '300', 'Sala 402', 'Bairro do Recife', 'Recife', 'PE', 'ATIVO', 'CARGA_SEED');

MERGE INTO empresa dest
USING (SELECT '20002118000166' AS cnpj FROM dual) src
ON (dest.cnpj = src.cnpj)
WHEN NOT MATCHED THEN
  INSERT (razao_social, nome_fantasia, cnpj, inscricao_estadual, cep, logradouro, numero, complemento, bairro, cidade, uf, situacao, criado_por)
  VALUES ('PANTANAL ECOTURISMO E EVENTOS LTDA', 'Pantanal Ecoturismo', '20002118000166', '100011104622', '79002000', 'Avenida Afonso Pena', '2800', '', 'Centro', 'Campo Grande', 'MS', 'INATIVO', 'CARGA_SEED');

MERGE INTO empresa dest
USING (SELECT '20002191000138' AS cnpj FROM dual) src
ON (dest.cnpj = src.cnpj)
WHEN NOT MATCHED THEN
  INSERT (razao_social, nome_fantasia, cnpj, inscricao_estadual, cep, logradouro, numero, complemento, bairro, cidade, uf, situacao, criado_por)
  VALUES ('MATO GROSSO ARMAZENS GERAIS S.A.', 'MT Armazéns', '20002191000138', '100011487540', '78005000', 'Avenida Historiador Rubens de Mendonça', '1756', 'Edifício Maruanã', 'Bosque da Saúde', 'Cuiabá', 'MT', 'ATIVO', 'CARGA_SEED');


-- 2. Vincula todas as empresas cadastradas ao usuario admin@erp.com
INSERT INTO usuario_empresa (usuario_id, empresa_id, padrao)
SELECT u.id, e.id, 0
FROM usuario u, empresa e
WHERE u.email = 'admin@erp.com'
  AND NOT EXISTS (
      SELECT 1 FROM usuario_empresa ue WHERE ue.usuario_id = u.id AND ue.empresa_id = e.id
  );


-- 3. Inclusao de 30 Clientes (15 PF e 15 PJ) com Enderecos e Contatos
-- Cliente PF 1: Lucas Ferreira de Oliveira
DECLARE
    v_empresa_id NUMBER;
    v_cliente_id NUMBER;
BEGIN
    SELECT id INTO v_empresa_id FROM empresa WHERE cnpj = '12345678000195';

    BEGIN
        SELECT id INTO v_cliente_id FROM cliente WHERE empresa_id = v_empresa_id AND documento = '30000002089';
    EXCEPTION
        WHEN NO_DATA_FOUND THEN
            INSERT INTO cliente (empresa_id, tipo_pessoa, documento, nome_razao_social, data_nascimento, email, telefone, situacao, criado_por)
            VALUES (v_empresa_id, 'PF', '30000002089', 'Lucas Ferreira de Oliveira', TO_DATE('1988-04-12', 'YYYY-MM-DD'), 'lucas.oliveira@gmail.com', '11981234501', 'ATIVO', 'CARGA_SEED')
            RETURNING id INTO v_cliente_id;

            INSERT INTO cliente_endereco (cliente_id, tipo, cep, logradouro, numero, complemento, bairro, cidade, uf, criado_por)
            VALUES (v_cliente_id, 'PRINCIPAL', '04571000', 'Rua Funchal', '200', 'Apto 82', 'Vila Olímpia', 'São Paulo', 'SP', 'CARGA_SEED');

            INSERT INTO cliente_contato (cliente_id, nome, cargo, email, telefone, criado_por)
            VALUES (v_cliente_id, 'Lucas Ferreira de Oliveira', 'Titular', 'lucas.oliveira@gmail.com', '11981234501', 'CARGA_SEED');
    END;
END;
/

-- Cliente PF 2: Juliana Mendes da Silva
DECLARE
    v_empresa_id NUMBER;
    v_cliente_id NUMBER;
BEGIN
    SELECT id INTO v_empresa_id FROM empresa WHERE cnpj = '98765432000188';

    BEGIN
        SELECT id INTO v_cliente_id FROM cliente WHERE empresa_id = v_empresa_id AND documento = '30000003999';
    EXCEPTION
        WHEN NO_DATA_FOUND THEN
            INSERT INTO cliente (empresa_id, tipo_pessoa, documento, nome_razao_social, data_nascimento, email, telefone, situacao, criado_por)
            VALUES (v_empresa_id, 'PF', '30000003999', 'Juliana Mendes da Silva', TO_DATE('1992-09-25', 'YYYY-MM-DD'), 'juliana.mendes@hotmail.com', '11982345602', 'ATIVO', 'CARGA_SEED')
            RETURNING id INTO v_cliente_id;

            INSERT INTO cliente_endereco (cliente_id, tipo, cep, logradouro, numero, complemento, bairro, cidade, uf, criado_por)
            VALUES (v_cliente_id, 'PRINCIPAL', '01311000', 'Alameda Santos', '1437', 'Apto 101', 'Cerqueira César', 'São Paulo', 'SP', 'CARGA_SEED');

            INSERT INTO cliente_contato (cliente_id, nome, cargo, email, telefone, criado_por)
            VALUES (v_cliente_id, 'Juliana Mendes da Silva', 'Titular', 'juliana.mendes@hotmail.com', '11982345602', 'CARGA_SEED');
    END;
END;
/

-- Cliente PF 3: Rodrigo Gonçalves Costa
DECLARE
    v_empresa_id NUMBER;
    v_cliente_id NUMBER;
BEGIN
    SELECT id INTO v_empresa_id FROM empresa WHERE cnpj = '12345678000195';

    BEGIN
        SELECT id INTO v_cliente_id FROM cliente WHERE empresa_id = v_empresa_id AND documento = '30000005851';
    EXCEPTION
        WHEN NO_DATA_FOUND THEN
            INSERT INTO cliente (empresa_id, tipo_pessoa, documento, nome_razao_social, data_nascimento, email, telefone, situacao, criado_por)
            VALUES (v_empresa_id, 'PF', '30000005851', 'Rodrigo Gonçalves Costa', TO_DATE('1985-11-03', 'YYYY-MM-DD'), 'rodrigo.costa@yahoo.com.br', '19983456703', 'ATIVO', 'CARGA_SEED')
            RETURNING id INTO v_cliente_id;

            INSERT INTO cliente_endereco (cliente_id, tipo, cep, logradouro, numero, complemento, bairro, cidade, uf, criado_por)
            VALUES (v_cliente_id, 'PRINCIPAL', '13010000', 'Rua Barão de Jaguara', '900', '', 'Centro', 'Campinas', 'SP', 'CARGA_SEED');

            INSERT INTO cliente_contato (cliente_id, nome, cargo, email, telefone, criado_por)
            VALUES (v_cliente_id, 'Rodrigo Gonçalves Costa', 'Titular', 'rodrigo.costa@yahoo.com.br', '19983456703', 'CARGA_SEED');
    END;
END;
/

-- Cliente PF 4: Camila Rodrigues Souza
DECLARE
    v_empresa_id NUMBER;
    v_cliente_id NUMBER;
BEGIN
    SELECT id INTO v_empresa_id FROM empresa WHERE cnpj = '98765432000188';

    BEGIN
        SELECT id INTO v_cliente_id FROM cliente WHERE empresa_id = v_empresa_id AND documento = '30000007714';
    EXCEPTION
        WHEN NO_DATA_FOUND THEN
            INSERT INTO cliente (empresa_id, tipo_pessoa, documento, nome_razao_social, data_nascimento, email, telefone, situacao, criado_por)
            VALUES (v_empresa_id, 'PF', '30000007714', 'Camila Rodrigues Souza', TO_DATE('1995-02-18', 'YYYY-MM-DD'), 'camila.souza@outlook.com', '19984567804', 'INATIVO', 'CARGA_SEED')
            RETURNING id INTO v_cliente_id;

            INSERT INTO cliente_endereco (cliente_id, tipo, cep, logradouro, numero, complemento, bairro, cidade, uf, criado_por)
            VALUES (v_cliente_id, 'PRINCIPAL', '13025000', 'Avenida José de Souza Campos', '550', 'Sala 32', 'Cambuí', 'Campinas', 'SP', 'CARGA_SEED');

            INSERT INTO cliente_contato (cliente_id, nome, cargo, email, telefone, criado_por)
            VALUES (v_cliente_id, 'Camila Rodrigues Souza', 'Titular', 'camila.souza@outlook.com', '19984567804', 'CARGA_SEED');
    END;
END;
/

-- Cliente PF 5: Marcelo Vieira Lima
DECLARE
    v_empresa_id NUMBER;
    v_cliente_id NUMBER;
BEGIN
    SELECT id INTO v_empresa_id FROM empresa WHERE cnpj = '12345678000195';

    BEGIN
        SELECT id INTO v_cliente_id FROM cliente WHERE empresa_id = v_empresa_id AND documento = '30000009687';
    EXCEPTION
        WHEN NO_DATA_FOUND THEN
            INSERT INTO cliente (empresa_id, tipo_pessoa, documento, nome_razao_social, data_nascimento, email, telefone, situacao, criado_por)
            VALUES (v_empresa_id, 'PF', '30000009687', 'Marcelo Vieira Lima', TO_DATE('1979-07-30', 'YYYY-MM-DD'), 'marcelo.lima@uol.com.br', '21985678905', 'ATIVO', 'CARGA_SEED')
            RETURNING id INTO v_cliente_id;

            INSERT INTO cliente_endereco (cliente_id, tipo, cep, logradouro, numero, complemento, bairro, cidade, uf, criado_por)
            VALUES (v_cliente_id, 'PRINCIPAL', '22041001', 'Rua Barata Ribeiro', '450', 'Apto 603', 'Copacabana', 'Rio de Janeiro', 'RJ', 'CARGA_SEED');

            INSERT INTO cliente_contato (cliente_id, nome, cargo, email, telefone, criado_por)
            VALUES (v_cliente_id, 'Marcelo Vieira Lima', 'Titular', 'marcelo.lima@uol.com.br', '21985678905', 'CARGA_SEED');
    END;
END;
/

-- Cliente PF 6: Beatriz Barbosa Ribeiro
DECLARE
    v_empresa_id NUMBER;
    v_cliente_id NUMBER;
BEGIN
    SELECT id INTO v_empresa_id FROM empresa WHERE cnpj = '98765432000188';

    BEGIN
        SELECT id INTO v_cliente_id FROM cliente WHERE empresa_id = v_empresa_id AND documento = '30000011584';
    EXCEPTION
        WHEN NO_DATA_FOUND THEN
            INSERT INTO cliente (empresa_id, tipo_pessoa, documento, nome_razao_social, data_nascimento, email, telefone, situacao, criado_por)
            VALUES (v_empresa_id, 'PF', '30000011584', 'Beatriz Barbosa Ribeiro', TO_DATE('1990-12-05', 'YYYY-MM-DD'), 'beatriz.ribeiro@gmail.com', '21986789006', 'ATIVO', 'CARGA_SEED')
            RETURNING id INTO v_cliente_id;

            INSERT INTO cliente_endereco (cliente_id, tipo, cep, logradouro, numero, complemento, bairro, cidade, uf, criado_por)
            VALUES (v_cliente_id, 'PRINCIPAL', '22250040', 'Praia de Botafogo', '300', '', 'Botafogo', 'Rio de Janeiro', 'RJ', 'CARGA_SEED');

            INSERT INTO cliente_contato (cliente_id, nome, cargo, email, telefone, criado_por)
            VALUES (v_cliente_id, 'Beatriz Barbosa Ribeiro', 'Titular', 'beatriz.ribeiro@gmail.com', '21986789006', 'CARGA_SEED');
    END;
END;
/

-- Cliente PF 7: Gabriel Alves Martins
DECLARE
    v_empresa_id NUMBER;
    v_cliente_id NUMBER;
BEGIN
    SELECT id INTO v_empresa_id FROM empresa WHERE cnpj = '12345678000195';

    BEGIN
        SELECT id INTO v_cliente_id FROM cliente WHERE empresa_id = v_empresa_id AND documento = '30000013447';
    EXCEPTION
        WHEN NO_DATA_FOUND THEN
            INSERT INTO cliente (empresa_id, tipo_pessoa, documento, nome_razao_social, data_nascimento, email, telefone, situacao, criado_por)
            VALUES (v_empresa_id, 'PF', '30000013447', 'Gabriel Alves Martins', TO_DATE('1987-03-14', 'YYYY-MM-DD'), 'gabriel.martins@terra.com.br', '31987890107', 'ATIVO', 'CARGA_SEED')
            RETURNING id INTO v_cliente_id;

            INSERT INTO cliente_endereco (cliente_id, tipo, cep, logradouro, numero, complemento, bairro, cidade, uf, criado_por)
            VALUES (v_cliente_id, 'PRINCIPAL', '30140071', 'Rua da Bahia', '1800', 'Apto 402', 'Lourdes', 'Belo Horizonte', 'MG', 'CARGA_SEED');

            INSERT INTO cliente_contato (cliente_id, nome, cargo, email, telefone, criado_por)
            VALUES (v_cliente_id, 'Gabriel Alves Martins', 'Titular', 'gabriel.martins@terra.com.br', '31987890107', 'CARGA_SEED');
    END;
END;
/

-- Cliente PF 8: Larissa Carvalho Dias
DECLARE
    v_empresa_id NUMBER;
    v_cliente_id NUMBER;
BEGIN
    SELECT id INTO v_empresa_id FROM empresa WHERE cnpj = '98765432000188';

    BEGIN
        SELECT id INTO v_cliente_id FROM cliente WHERE empresa_id = v_empresa_id AND documento = '30000015300';
    EXCEPTION
        WHEN NO_DATA_FOUND THEN
            INSERT INTO cliente (empresa_id, tipo_pessoa, documento, nome_razao_social, data_nascimento, email, telefone, situacao, criado_por)
            VALUES (v_empresa_id, 'PF', '30000015300', 'Larissa Carvalho Dias', TO_DATE('1993-08-22', 'YYYY-MM-DD'), 'larissa.dias@gmail.com', '31988901208', 'ATIVO', 'CARGA_SEED')
            RETURNING id INTO v_cliente_id;

            INSERT INTO cliente_endereco (cliente_id, tipo, cep, logradouro, numero, complemento, bairro, cidade, uf, criado_por)
            VALUES (v_cliente_id, 'PRINCIPAL', '30330000', 'Avenida Bandeirantes', '1250', '', 'Mangabeiras', 'Belo Horizonte', 'MG', 'CARGA_SEED');

            INSERT INTO cliente_contato (cliente_id, nome, cargo, email, telefone, criado_por)
            VALUES (v_cliente_id, 'Larissa Carvalho Dias', 'Titular', 'larissa.dias@gmail.com', '31988901208', 'CARGA_SEED');
    END;
END;
/

-- Cliente PF 9: Thiago Rocha Pereira
DECLARE
    v_empresa_id NUMBER;
    v_cliente_id NUMBER;
BEGIN
    SELECT id INTO v_empresa_id FROM empresa WHERE cnpj = '12345678000195';

    BEGIN
        SELECT id INTO v_cliente_id FROM cliente WHERE empresa_id = v_empresa_id AND documento = '30000017272';
    EXCEPTION
        WHEN NO_DATA_FOUND THEN
            INSERT INTO cliente (empresa_id, tipo_pessoa, documento, nome_razao_social, data_nascimento, email, telefone, situacao, criado_por)
            VALUES (v_empresa_id, 'PF', '30000017272', 'Thiago Rocha Pereira', TO_DATE('1984-06-19', 'YYYY-MM-DD'), 'thiago.pereira@gmail.com', '41989012309', 'ATIVO', 'CARGA_SEED')
            RETURNING id INTO v_cliente_id;

            INSERT INTO cliente_endereco (cliente_id, tipo, cep, logradouro, numero, complemento, bairro, cidade, uf, criado_por)
            VALUES (v_cliente_id, 'PRINCIPAL', '80420000', 'Avenida Batel', '1500', 'Apto 12', 'Batel', 'Curitiba', 'PR', 'CARGA_SEED');

            INSERT INTO cliente_contato (cliente_id, nome, cargo, email, telefone, criado_por)
            VALUES (v_cliente_id, 'Thiago Rocha Pereira', 'Titular', 'thiago.pereira@gmail.com', '41989012309', 'CARGA_SEED');
    END;
END;
/

-- Cliente PF 10: Amanda Castro Cardoso
DECLARE
    v_empresa_id NUMBER;
    v_cliente_id NUMBER;
BEGIN
    SELECT id INTO v_empresa_id FROM empresa WHERE cnpj = '98765432000188';

    BEGIN
        SELECT id INTO v_cliente_id FROM cliente WHERE empresa_id = v_empresa_id AND documento = '30000019135';
    EXCEPTION
        WHEN NO_DATA_FOUND THEN
            INSERT INTO cliente (empresa_id, tipo_pessoa, documento, nome_razao_social, data_nascimento, email, telefone, situacao, criado_por)
            VALUES (v_empresa_id, 'PF', '30000019135', 'Amanda Castro Cardoso', TO_DATE('1996-01-27', 'YYYY-MM-DD'), 'amanda.cardoso@gmail.com', '41990123410', 'ATIVO', 'CARGA_SEED')
            RETURNING id INTO v_cliente_id;

            INSERT INTO cliente_endereco (cliente_id, tipo, cep, logradouro, numero, complemento, bairro, cidade, uf, criado_por)
            VALUES (v_cliente_id, 'PRINCIPAL', '80060000', 'Rua XV de Novembro', '800', '', 'Centro', 'Curitiba', 'PR', 'CARGA_SEED');

            INSERT INTO cliente_contato (cliente_id, nome, cargo, email, telefone, criado_por)
            VALUES (v_cliente_id, 'Amanda Castro Cardoso', 'Titular', 'amanda.cardoso@gmail.com', '41990123410', 'CARGA_SEED');
    END;
END;
/

-- Cliente PF 11: Bruno Henrique Nogueira
DECLARE
    v_empresa_id NUMBER;
    v_cliente_id NUMBER;
BEGIN
    SELECT id INTO v_empresa_id FROM empresa WHERE cnpj = '12345678000195';

    BEGIN
        SELECT id INTO v_cliente_id FROM cliente WHERE empresa_id = v_empresa_id AND documento = '30000021032';
    EXCEPTION
        WHEN NO_DATA_FOUND THEN
            INSERT INTO cliente (empresa_id, tipo_pessoa, documento, nome_razao_social, data_nascimento, email, telefone, situacao, criado_por)
            VALUES (v_empresa_id, 'PF', '30000021032', 'Bruno Henrique Nogueira', TO_DATE('1982-10-11', 'YYYY-MM-DD'), 'bruno.nogueira@gmail.com', '48991234511', 'INATIVO', 'CARGA_SEED')
            RETURNING id INTO v_cliente_id;

            INSERT INTO cliente_endereco (cliente_id, tipo, cep, logradouro, numero, complemento, bairro, cidade, uf, criado_por)
            VALUES (v_cliente_id, 'PRINCIPAL', '88015000', 'Avenida Rio Branco', '404', 'Torre 1', 'Centro', 'Florianópolis', 'SC', 'CARGA_SEED');

            INSERT INTO cliente_contato (cliente_id, nome, cargo, email, telefone, criado_por)
            VALUES (v_cliente_id, 'Bruno Henrique Nogueira', 'Titular', 'bruno.nogueira@gmail.com', '48991234511', 'CARGA_SEED');
    END;
END;
/

-- Cliente PF 12: Fernanda Duarte Ramos
DECLARE
    v_empresa_id NUMBER;
    v_cliente_id NUMBER;
BEGIN
    SELECT id INTO v_empresa_id FROM empresa WHERE cnpj = '98765432000188';

    BEGIN
        SELECT id INTO v_cliente_id FROM cliente WHERE empresa_id = v_empresa_id AND documento = '30000022942';
    EXCEPTION
        WHEN NO_DATA_FOUND THEN
            INSERT INTO cliente (empresa_id, tipo_pessoa, documento, nome_razao_social, data_nascimento, email, telefone, situacao, criado_por)
            VALUES (v_empresa_id, 'PF', '30000022942', 'Fernanda Duarte Ramos', TO_DATE('1991-05-08', 'YYYY-MM-DD'), 'fernanda.ramos@hotmail.com', '48992345612', 'ATIVO', 'CARGA_SEED')
            RETURNING id INTO v_cliente_id;

            INSERT INTO cliente_endereco (cliente_id, tipo, cep, logradouro, numero, complemento, bairro, cidade, uf, criado_por)
            VALUES (v_cliente_id, 'PRINCIPAL', '88034000', 'Rua Lauro Linhares', '1200', 'Apto 304', 'Trindade', 'Florianópolis', 'SC', 'CARGA_SEED');

            INSERT INTO cliente_contato (cliente_id, nome, cargo, email, telefone, criado_por)
            VALUES (v_cliente_id, 'Fernanda Duarte Ramos', 'Titular', 'fernanda.ramos@hotmail.com', '48992345612', 'CARGA_SEED');
    END;
END;
/

-- Cliente PF 13: Diego Moreira Guimarães
DECLARE
    v_empresa_id NUMBER;
    v_cliente_id NUMBER;
BEGIN
    SELECT id INTO v_empresa_id FROM empresa WHERE cnpj = '12345678000195';

    BEGIN
        SELECT id INTO v_cliente_id FROM cliente WHERE empresa_id = v_empresa_id AND documento = '30000024805';
    EXCEPTION
        WHEN NO_DATA_FOUND THEN
            INSERT INTO cliente (empresa_id, tipo_pessoa, documento, nome_razao_social, data_nascimento, email, telefone, situacao, criado_por)
            VALUES (v_empresa_id, 'PF', '30000024805', 'Diego Moreira Guimarães', TO_DATE('1989-12-15', 'YYYY-MM-DD'), 'diego.guimaraes@gmail.com', '51993456713', 'ATIVO', 'CARGA_SEED')
            RETURNING id INTO v_cliente_id;

            INSERT INTO cliente_endereco (cliente_id, tipo, cep, logradouro, numero, complemento, bairro, cidade, uf, criado_por)
            VALUES (v_cliente_id, 'PRINCIPAL', '90430000', 'Rua Padre Chagas', '220', '', 'Moinhos de Vento', 'Porto Alegre', 'RS', 'CARGA_SEED');

            INSERT INTO cliente_contato (cliente_id, nome, cargo, email, telefone, criado_por)
            VALUES (v_cliente_id, 'Diego Moreira Guimarães', 'Titular', 'diego.guimaraes@gmail.com', '51993456713', 'CARGA_SEED');
    END;
END;
/

-- Cliente PF 14: Renata Cunha Pires
DECLARE
    v_empresa_id NUMBER;
    v_cliente_id NUMBER;
BEGIN
    SELECT id INTO v_empresa_id FROM empresa WHERE cnpj = '98765432000188';

    BEGIN
        SELECT id INTO v_cliente_id FROM cliente WHERE empresa_id = v_empresa_id AND documento = '30000026778';
    EXCEPTION
        WHEN NO_DATA_FOUND THEN
            INSERT INTO cliente (empresa_id, tipo_pessoa, documento, nome_razao_social, data_nascimento, email, telefone, situacao, criado_por)
            VALUES (v_empresa_id, 'PF', '30000026778', 'Renata Cunha Pires', TO_DATE('1994-04-03', 'YYYY-MM-DD'), 'renata.pires@gmail.com', '71994567814', 'ATIVO', 'CARGA_SEED')
            RETURNING id INTO v_cliente_id;

            INSERT INTO cliente_endereco (cliente_id, tipo, cep, logradouro, numero, complemento, bairro, cidade, uf, criado_por)
            VALUES (v_cliente_id, 'PRINCIPAL', '41810011', 'Avenida Paulo VI', '850', 'Sala 204', 'Pituba', 'Salvador', 'BA', 'CARGA_SEED');

            INSERT INTO cliente_contato (cliente_id, nome, cargo, email, telefone, criado_por)
            VALUES (v_cliente_id, 'Renata Cunha Pires', 'Titular', 'renata.pires@gmail.com', '71994567814', 'CARGA_SEED');
    END;
END;
/

-- Cliente PF 15: Eduardo Freitas Borges
DECLARE
    v_empresa_id NUMBER;
    v_cliente_id NUMBER;
BEGIN
    SELECT id INTO v_empresa_id FROM empresa WHERE cnpj = '12345678000195';

    BEGIN
        SELECT id INTO v_cliente_id FROM cliente WHERE empresa_id = v_empresa_id AND documento = '30000028630';
    EXCEPTION
        WHEN NO_DATA_FOUND THEN
            INSERT INTO cliente (empresa_id, tipo_pessoa, documento, nome_razao_social, data_nascimento, email, telefone, situacao, criado_por)
            VALUES (v_empresa_id, 'PF', '30000028630', 'Eduardo Freitas Borges', TO_DATE('1986-09-17', 'YYYY-MM-DD'), 'eduardo.borges@gmail.com', '61995678915', 'ATIVO', 'CARGA_SEED')
            RETURNING id INTO v_cliente_id;

            INSERT INTO cliente_endereco (cliente_id, tipo, cep, logradouro, numero, complemento, bairro, cidade, uf, criado_por)
            VALUES (v_cliente_id, 'PRINCIPAL', '70390000', 'SEPS 705/905', 'Bloco C', 'Sala 110', 'Asa Sul', 'Brasília', 'DF', 'CARGA_SEED');

            INSERT INTO cliente_contato (cliente_id, nome, cargo, email, telefone, criado_por)
            VALUES (v_cliente_id, 'Eduardo Freitas Borges', 'Titular', 'eduardo.borges@gmail.com', '61995678915', 'CARGA_SEED');
    END;
END;
/

-- Cliente PJ 1: DELTA DISTRIBUICAO E LOGISTICA LTDA
DECLARE
    v_empresa_id NUMBER;
    v_cliente_id NUMBER;
BEGIN
    SELECT id INTO v_empresa_id FROM empresa WHERE cnpj = '98765432000188';

    BEGIN
        SELECT id INTO v_cliente_id FROM cliente WHERE empresa_id = v_empresa_id AND documento = '40000030000112';
    EXCEPTION
        WHEN NO_DATA_FOUND THEN
            INSERT INTO cliente (empresa_id, tipo_pessoa, documento, nome_razao_social, nome_fantasia, inscricao_estadual, email, telefone, situacao, criado_por)
            VALUES (v_empresa_id, 'PJ', '40000030000112', 'DELTA DISTRIBUICAO E LOGISTICA LTDA', 'Delta Logística', '123456789101', 'contato@deltalog.com.br', '1132104501', 'ATIVO', 'CARGA_SEED')
            RETURNING id INTO v_cliente_id;

            INSERT INTO cliente_endereco (cliente_id, tipo, cep, logradouro, numero, complemento, bairro, cidade, uf, criado_por)
            VALUES (v_cliente_id, 'PRINCIPAL', '04538000', 'Rua Joaquim Floriano', '720', 'Conjunto 91', 'Itaim Bibi', 'São Paulo', 'SP', 'CARGA_SEED');

            INSERT INTO cliente_contato (cliente_id, nome, cargo, email, telefone, criado_por)
            VALUES (v_cliente_id, 'Carlos Alberto', 'Diretor de Operações', 'contato@deltalog.com.br', '1132104501', 'CARGA_SEED');
    END;
END;
/

-- Cliente PJ 2: VANGUARDA ENGENHARIA E CONSTRUCAO S.A.
DECLARE
    v_empresa_id NUMBER;
    v_cliente_id NUMBER;
BEGIN
    SELECT id INTO v_empresa_id FROM empresa WHERE cnpj = '12345678000195';

    BEGIN
        SELECT id INTO v_cliente_id FROM cliente WHERE empresa_id = v_empresa_id AND documento = '40000059000102';
    EXCEPTION
        WHEN NO_DATA_FOUND THEN
            INSERT INTO cliente (empresa_id, tipo_pessoa, documento, nome_razao_social, nome_fantasia, inscricao_estadual, email, telefone, situacao, criado_por)
            VALUES (v_empresa_id, 'PJ', '40000059000102', 'VANGUARDA ENGENHARIA E CONSTRUCAO S.A.', 'Vanguarda Engenharia', '234567890112', 'projetos@vanguardaeng.com.br', '1133205502', 'ATIVO', 'CARGA_SEED')
            RETURNING id INTO v_cliente_id;

            INSERT INTO cliente_endereco (cliente_id, tipo, cep, logradouro, numero, complemento, bairro, cidade, uf, criado_por)
            VALUES (v_cliente_id, 'PRINCIPAL', '01452000', 'Avenida Brigadeiro Faria Lima', '2000', '15º Andar', 'Jardim Paulistano', 'São Paulo', 'SP', 'CARGA_SEED');

            INSERT INTO cliente_contato (cliente_id, nome, cargo, email, telefone, criado_por)
            VALUES (v_cliente_id, 'Mariana Rios', 'Gerente de Obras', 'projetos@vanguardaeng.com.br', '1133205502', 'CARGA_SEED');
    END;
END;
/

-- Cliente PJ 3: SOLUCOES INTEGRADAS EM SAUDE LTDA
DECLARE
    v_empresa_id NUMBER;
    v_cliente_id NUMBER;
BEGIN
    SELECT id INTO v_empresa_id FROM empresa WHERE cnpj = '98765432000188';

    BEGIN
        SELECT id INTO v_cliente_id FROM cliente WHERE empresa_id = v_empresa_id AND documento = '40000088000166';
    EXCEPTION
        WHEN NO_DATA_FOUND THEN
            INSERT INTO cliente (empresa_id, tipo_pessoa, documento, nome_razao_social, nome_fantasia, inscricao_estadual, email, telefone, situacao, criado_por)
            VALUES (v_empresa_id, 'PJ', '40000088000166', 'SOLUCOES INTEGRADAS EM SAUDE LTDA', 'Integra Saúde', '345678901223', 'financeiro@integrasaude.com.br', '1934306503', 'ATIVO', 'CARGA_SEED')
            RETURNING id INTO v_cliente_id;

            INSERT INTO cliente_endereco (cliente_id, tipo, cep, logradouro, numero, complemento, bairro, cidade, uf, criado_por)
            VALUES (v_cliente_id, 'PRINCIPAL', '13070000', 'Avenida Barão de Itapura', '1600', 'Andar 3', 'Guanabara', 'Campinas', 'SP', 'CARGA_SEED');

            INSERT INTO cliente_contato (cliente_id, nome, cargo, email, telefone, criado_por)
            VALUES (v_cliente_id, 'Felipe Zanetti', 'Controller Financeiro', 'financeiro@integrasaude.com.br', '1934306503', 'CARGA_SEED');
    END;
END;
/

-- Cliente PJ 4: BELLA CASA MOVEIS E DECORACAO EIRELI
DECLARE
    v_empresa_id NUMBER;
    v_cliente_id NUMBER;
BEGIN
    SELECT id INTO v_empresa_id FROM empresa WHERE cnpj = '12345678000195';

    BEGIN
        SELECT id INTO v_cliente_id FROM cliente WHERE empresa_id = v_empresa_id AND documento = '40000117000190';
    EXCEPTION
        WHEN NO_DATA_FOUND THEN
            INSERT INTO cliente (empresa_id, tipo_pessoa, documento, nome_razao_social, nome_fantasia, inscricao_estadual, email, telefone, situacao, criado_por)
            VALUES (v_empresa_id, 'PJ', '40000117000190', 'BELLA CASA MOVEIS E DECORACAO EIRELI', 'Bella Casa Decor', '456789012334', 'comercial@bellacasadecor.com.br', '1935407504', 'ATIVO', 'CARGA_SEED')
            RETURNING id INTO v_cliente_id;

            INSERT INTO cliente_endereco (cliente_id, tipo, cep, logradouro, numero, complemento, bairro, cidade, uf, criado_por)
            VALUES (v_cliente_id, 'PRINCIPAL', '13083000', 'Rua Maria Monteiro', '480', '', 'Cambuí', 'Campinas', 'SP', 'CARGA_SEED');

            INSERT INTO cliente_contato (cliente_id, nome, cargo, email, telefone, criado_por)
            VALUES (v_cliente_id, 'Simone Fontes', 'Gerente Comercial', 'comercial@bellacasadecor.com.br', '1935407504', 'CARGA_SEED');
    END;
END;
/

-- Cliente PJ 5: OCEANICA COMERCIO EXTERIOR S.A.
DECLARE
    v_empresa_id NUMBER;
    v_cliente_id NUMBER;
BEGIN
    SELECT id INTO v_empresa_id FROM empresa WHERE cnpj = '98765432000188';

    BEGIN
        SELECT id INTO v_cliente_id FROM cliente WHERE empresa_id = v_empresa_id AND documento = '40000146000151';
    EXCEPTION
        WHEN NO_DATA_FOUND THEN
            INSERT INTO cliente (empresa_id, tipo_pessoa, documento, nome_razao_social, nome_fantasia, inscricao_estadual, email, telefone, situacao, criado_por)
            VALUES (v_empresa_id, 'PJ', '40000146000151', 'OCEANICA COMERCIO EXTERIOR S.A.', 'Oceânica Comex', '567890123445', 'trade@oceanicacomex.com.br', '2122108505', 'ATIVO', 'CARGA_SEED')
            RETURNING id INTO v_cliente_id;

            INSERT INTO cliente_endereco (cliente_id, tipo, cep, logradouro, numero, complemento, bairro, cidade, uf, criado_por)
            VALUES (v_cliente_id, 'PRINCIPAL', '20021000', 'Praça Floriano', '19', 'Sala 1201', 'Cinelândia', 'Rio de Janeiro', 'RJ', 'CARGA_SEED');

            INSERT INTO cliente_contato (cliente_id, nome, cargo, email, telefone, criado_por)
            VALUES (v_cliente_id, 'André Mendonça', 'Gerente de Importação', 'trade@oceanicacomex.com.br', '2122108505', 'CARGA_SEED');
    END;
END;
/

-- Cliente PJ 6: EXPRESSO METROPOLITANO CARGAS LTDA
DECLARE
    v_empresa_id NUMBER;
    v_cliente_id NUMBER;
BEGIN
    SELECT id INTO v_empresa_id FROM empresa WHERE cnpj = '12345678000195';

    BEGIN
        SELECT id INTO v_cliente_id FROM cliente WHERE empresa_id = v_empresa_id AND documento = '40000175000113';
    EXCEPTION
        WHEN NO_DATA_FOUND THEN
            INSERT INTO cliente (empresa_id, tipo_pessoa, documento, nome_razao_social, nome_fantasia, inscricao_estadual, email, telefone, situacao, criado_por)
            VALUES (v_empresa_id, 'PJ', '40000175000113', 'EXPRESSO METROPOLITANO CARGAS LTDA', 'Expresso Metropolitano', '678901234556', 'operacional@expressometropolitano.com', '2123209506', 'INATIVO', 'CARGA_SEED')
            RETURNING id INTO v_cliente_id;

            INSERT INTO cliente_endereco (cliente_id, tipo, cep, logradouro, numero, complemento, bairro, cidade, uf, criado_por)
            VALUES (v_cliente_id, 'PRINCIPAL', '21040000', 'Avenida Brasil', '9500', 'Galpão 8', 'Ramos', 'Rio de Janeiro', 'RJ', 'CARGA_SEED');

            INSERT INTO cliente_contato (cliente_id, nome, cargo, email, telefone, criado_por)
            VALUES (v_cliente_id, 'Patrícia Lopes', 'Supervisora de Frotas', 'operacional@expressometropolitano.com', '2123209506', 'CARGA_SEED');
    END;
END;
/

-- Cliente PJ 7: PONTO CERTO SUPRIMENTOS CORPORATIVOS LTDA
DECLARE
    v_empresa_id NUMBER;
    v_cliente_id NUMBER;
BEGIN
    SELECT id INTO v_empresa_id FROM empresa WHERE cnpj = '98765432000188';

    BEGIN
        SELECT id INTO v_cliente_id FROM cliente WHERE empresa_id = v_empresa_id AND documento = '40000204000147';
    EXCEPTION
        WHEN NO_DATA_FOUND THEN
            INSERT INTO cliente (empresa_id, tipo_pessoa, documento, nome_razao_social, nome_fantasia, inscricao_estadual, email, telefone, situacao, criado_por)
            VALUES (v_empresa_id, 'PJ', '40000204000147', 'PONTO CERTO SUPRIMENTOS CORPORATIVOS LTDA', 'Ponto Certo Suprimentos', '789012345667', 'vendas@pontocertosuprimentos.com.br', '3134101507', 'ATIVO', 'CARGA_SEED')
            RETURNING id INTO v_cliente_id;

            INSERT INTO cliente_endereco (cliente_id, tipo, cep, logradouro, numero, complemento, bairro, cidade, uf, criado_por)
            VALUES (v_cliente_id, 'PRINCIPAL', '30180000', 'Rua Guajajaras', '650', '', 'Barro Preto', 'Belo Horizonte', 'MG', 'CARGA_SEED');

            INSERT INTO cliente_contato (cliente_id, nome, cargo, email, telefone, criado_por)
            VALUES (v_cliente_id, 'Robson Teixeira', 'Coordenador de Vendas', 'vendas@pontocertosuprimentos.com.br', '3134101507', 'CARGA_SEED');
    END;
END;
/

-- Cliente PJ 8: INNOVA TECNOLOGIA E AUTOMACAO INDUSTRIAL LTDA
DECLARE
    v_empresa_id NUMBER;
    v_cliente_id NUMBER;
BEGIN
    SELECT id INTO v_empresa_id FROM empresa WHERE cnpj = '12345678000195';

    BEGIN
        SELECT id INTO v_cliente_id FROM cliente WHERE empresa_id = v_empresa_id AND documento = '40000233000109';
    EXCEPTION
        WHEN NO_DATA_FOUND THEN
            INSERT INTO cliente (empresa_id, tipo_pessoa, documento, nome_razao_social, nome_fantasia, inscricao_estadual, email, telefone, situacao, criado_por)
            VALUES (v_empresa_id, 'PJ', '40000233000109', 'INNOVA TECNOLOGIA E AUTOMACAO INDUSTRIAL LTDA', 'Innova Automação', '890123456778', 'suporte@innovaautomacao.com.br', '3135202508', 'ATIVO', 'CARGA_SEED')
            RETURNING id INTO v_cliente_id;

            INSERT INTO cliente_endereco (cliente_id, tipo, cep, logradouro, numero, complemento, bairro, cidade, uf, criado_por)
            VALUES (v_cliente_id, 'PRINCIPAL', '32210000', 'Avenida Babita Camargos', '1200', 'Galpão 3', 'Cidade Industrial', 'Contagem', 'MG', 'CARGA_SEED');

            INSERT INTO cliente_contato (cliente_id, nome, cargo, email, telefone, criado_por)
            VALUES (v_cliente_id, 'Vanessa Morais', 'Diretora de TI', 'suporte@innovaautomacao.com.br', '3135202508', 'CARGA_SEED');
    END;
END;
/

-- Cliente PJ 9: ARAUCARIA COMERCIO DE MADEIRAS E DERIVADOS LTDA
DECLARE
    v_empresa_id NUMBER;
    v_cliente_id NUMBER;
BEGIN
    SELECT id INTO v_empresa_id FROM empresa WHERE cnpj = '98765432000188';

    BEGIN
        SELECT id INTO v_cliente_id FROM cliente WHERE empresa_id = v_empresa_id AND documento = '40000262000170';
    EXCEPTION
        WHEN NO_DATA_FOUND THEN
            INSERT INTO cliente (empresa_id, tipo_pessoa, documento, nome_razao_social, nome_fantasia, inscricao_estadual, email, telefone, situacao, criado_por)
            VALUES (v_empresa_id, 'PJ', '40000262000170', 'ARAUCARIA COMERCIO DE MADEIRAS E DERIVADOS LTDA', 'Araucária Madeiras', '901234567889', 'atendimento@araucariamadeiras.com.br', '4136103509', 'ATIVO', 'CARGA_SEED')
            RETURNING id INTO v_cliente_id;

            INSERT INTO cliente_endereco (cliente_id, tipo, cep, logradouro, numero, complemento, bairro, cidade, uf, criado_por)
            VALUES (v_cliente_id, 'PRINCIPAL', '81720000', 'Avenida Marechal Floriano Peixoto', '5400', '', 'Hauer', 'Curitiba', 'PR', 'CARGA_SEED');

            INSERT INTO cliente_contato (cliente_id, nome, cargo, email, telefone, criado_por)
            VALUES (v_cliente_id, 'Gustavo Silveira', 'Gerente de Compras', 'atendimento@araucariamadeiras.com.br', '4136103509', 'CARGA_SEED');
    END;
END;
/

-- Cliente PJ 10: PRIME GESTAO DE ATIVOS E PARTICIPACOES S.A.
DECLARE
    v_empresa_id NUMBER;
    v_cliente_id NUMBER;
BEGIN
    SELECT id INTO v_empresa_id FROM empresa WHERE cnpj = '12345678000195';

    BEGIN
        SELECT id INTO v_cliente_id FROM cliente WHERE empresa_id = v_empresa_id AND documento = '40000291000132';
    EXCEPTION
        WHEN NO_DATA_FOUND THEN
            INSERT INTO cliente (empresa_id, tipo_pessoa, documento, nome_razao_social, nome_fantasia, inscricao_estadual, email, telefone, situacao, criado_por)
            VALUES (v_empresa_id, 'PJ', '40000291000132', 'PRIME GESTAO DE ATIVOS E PARTICIPACOES S.A.', 'Prime Gestão', '012345678990', 'contato@primegestaoativos.com.br', '4137204510', 'ATIVO', 'CARGA_SEED')
            RETURNING id INTO v_cliente_id;

            INSERT INTO cliente_endereco (cliente_id, tipo, cep, logradouro, numero, complemento, bairro, cidade, uf, criado_por)
            VALUES (v_cliente_id, 'PRINCIPAL', '80410000', 'Rua Comendador Araújo', '510', 'Conjunto 1002', 'Centro', 'Curitiba', 'PR', 'CARGA_SEED');

            INSERT INTO cliente_contato (cliente_id, nome, cargo, email, telefone, criado_por)
            VALUES (v_cliente_id, 'Helena Sampaio', 'Diretora Financeira', 'contato@primegestaoativos.com.br', '4137204510', 'CARGA_SEED');
    END;
END;
/

-- Cliente PJ 11: ILHA BELA RESTAURANTES E HOTELARIA LTDA
DECLARE
    v_empresa_id NUMBER;
    v_cliente_id NUMBER;
BEGIN
    SELECT id INTO v_empresa_id FROM empresa WHERE cnpj = '98765432000188';

    BEGIN
        SELECT id INTO v_cliente_id FROM cliente WHERE empresa_id = v_empresa_id AND documento = '40000320000166';
    EXCEPTION
        WHEN NO_DATA_FOUND THEN
            INSERT INTO cliente (empresa_id, tipo_pessoa, documento, nome_razao_social, nome_fantasia, inscricao_estadual, email, telefone, situacao, criado_por)
            VALUES (v_empresa_id, 'PJ', '40000320000166', 'ILHA BELA RESTAURANTES E HOTELARIA LTDA', 'Ilha Bela Gastronomia', '123450987601', 'reservas@ilhabelahotelaria.com.br', '4838105511', 'ATIVO', 'CARGA_SEED')
            RETURNING id INTO v_cliente_id;

            INSERT INTO cliente_endereco (cliente_id, tipo, cep, logradouro, numero, complemento, bairro, cidade, uf, criado_por)
            VALUES (v_cliente_id, 'PRINCIPAL', '88015010', 'Rua Bocaiúva', '2150', '', 'Centro', 'Florianópolis', 'SC', 'CARGA_SEED');

            INSERT INTO cliente_contato (cliente_id, nome, cargo, email, telefone, criado_por)
            VALUES (v_cliente_id, 'Vinícius Prado', 'Gerente Geral', 'reservas@ilhabelahotelaria.com.br', '4838105511', 'CARGA_SEED');
    END;
END;
/

-- Cliente PJ 12: VALE DO ACO EQUIPAMENTOS INDUSTRIAIS LTDA
DECLARE
    v_empresa_id NUMBER;
    v_cliente_id NUMBER;
BEGIN
    SELECT id INTO v_empresa_id FROM empresa WHERE cnpj = '12345678000195';

    BEGIN
        SELECT id INTO v_cliente_id FROM cliente WHERE empresa_id = v_empresa_id AND documento = '40000349000148';
    EXCEPTION
        WHEN NO_DATA_FOUND THEN
            INSERT INTO cliente (empresa_id, tipo_pessoa, documento, nome_razao_social, nome_fantasia, inscricao_estadual, email, telefone, situacao, criado_por)
            VALUES (v_empresa_id, 'PJ', '40000349000148', 'VALE DO ACO EQUIPAMENTOS INDUSTRIAIS LTDA', 'Vale do Aço Equipamentos', '234561098712', 'vendas@valedoacoequip.com.br', '4739206512', 'ATIVO', 'CARGA_SEED')
            RETURNING id INTO v_cliente_id;

            INSERT INTO cliente_endereco (cliente_id, tipo, cep, logradouro, numero, complemento, bairro, cidade, uf, criado_por)
            VALUES (v_cliente_id, 'PRINCIPAL', '89218000', 'Rua Ottokar Doerffel', '800', '', 'Atiradores', 'Joinville', 'SC', 'CARGA_SEED');

            INSERT INTO cliente_contato (cliente_id, nome, cargo, email, telefone, criado_por)
            VALUES (v_cliente_id, 'Danilo Antunes', 'Engenheiro Chefe', 'vendas@valedoacoequip.com.br', '4739206512', 'CARGA_SEED');
    END;
END;
/

-- Cliente PJ 13: RIO GRANDE FERTILIZANTES E NUTRIENTES S.A.
DECLARE
    v_empresa_id NUMBER;
    v_cliente_id NUMBER;
BEGIN
    SELECT id INTO v_empresa_id FROM empresa WHERE cnpj = '98765432000188';

    BEGIN
        SELECT id INTO v_cliente_id FROM cliente WHERE empresa_id = v_empresa_id AND documento = '40000378000100';
    EXCEPTION
        WHEN NO_DATA_FOUND THEN
            INSERT INTO cliente (empresa_id, tipo_pessoa, documento, nome_razao_social, nome_fantasia, inscricao_estadual, email, telefone, situacao, criado_por)
            VALUES (v_empresa_id, 'PJ', '40000378000100', 'RIO GRANDE FERTILIZANTES E NUTRIENTES S.A.', 'Rio Grande Fertilizantes', '345672109823', 'agronomia@riograndefertilizantes.com', '5131307513', 'INATIVO', 'CARGA_SEED')
            RETURNING id INTO v_cliente_id;

            INSERT INTO cliente_endereco (cliente_id, tipo, cep, logradouro, numero, complemento, bairro, cidade, uf, criado_por)
            VALUES (v_cliente_id, 'PRINCIPAL', '90240000', 'Avenida Sertório', '4500', '', 'São João', 'Porto Alegre', 'RS', 'CARGA_SEED');

            INSERT INTO cliente_contato (cliente_id, nome, cargo, email, telefone, criado_por)
            VALUES (v_cliente_id, 'Tatiana Nader', 'Gerente Técnica', 'agronomia@riograndefertilizantes.com', '5131307513', 'CARGA_SEED');
    END;
END;
/

-- Cliente PJ 14: CENTRO OESTE ENERGIAS RENOVAVEIS LTDA
DECLARE
    v_empresa_id NUMBER;
    v_cliente_id NUMBER;
BEGIN
    SELECT id INTO v_empresa_id FROM empresa WHERE cnpj = '12345678000195';

    BEGIN
        SELECT id INTO v_cliente_id FROM cliente WHERE empresa_id = v_empresa_id AND documento = '40000407000133';
    EXCEPTION
        WHEN NO_DATA_FOUND THEN
            INSERT INTO cliente (empresa_id, tipo_pessoa, documento, nome_razao_social, nome_fantasia, inscricao_estadual, email, telefone, situacao, criado_por)
            VALUES (v_empresa_id, 'PJ', '40000407000133', 'CENTRO OESTE ENERGIAS RENOVAVEIS LTDA', 'Centro Oeste Solar', '456783210934', 'energia@centrooestesolar.com.br', '6232408514', 'ATIVO', 'CARGA_SEED')
            RETURNING id INTO v_cliente_id;

            INSERT INTO cliente_endereco (cliente_id, tipo, cep, logradouro, numero, complemento, bairro, cidade, uf, criado_por)
            VALUES (v_cliente_id, 'PRINCIPAL', '74110000', 'Avenida T-63', '1200', 'Sala 502', 'Setor Bueno', 'Goiânia', 'GO', 'CARGA_SEED');

            INSERT INTO cliente_contato (cliente_id, nome, cargo, email, telefone, criado_por)
            VALUES (v_cliente_id, 'Marcos Vinícius', 'Diretor de Projetos', 'energia@centrooestesolar.com.br', '6232408514', 'CARGA_SEED');
    END;
END;
/

-- Cliente PJ 15: CAPITAL MEDICA PRODUTOS CIRURGICOS LTDA
DECLARE
    v_empresa_id NUMBER;
    v_cliente_id NUMBER;
BEGIN
    SELECT id INTO v_empresa_id FROM empresa WHERE cnpj = '98765432000188';

    BEGIN
        SELECT id INTO v_cliente_id FROM cliente WHERE empresa_id = v_empresa_id AND documento = '40000436000103';
    EXCEPTION
        WHEN NO_DATA_FOUND THEN
            INSERT INTO cliente (empresa_id, tipo_pessoa, documento, nome_razao_social, nome_fantasia, inscricao_estadual, email, telefone, situacao, criado_por)
            VALUES (v_empresa_id, 'PJ', '40000436000103', 'CAPITAL MEDICA PRODUTOS CIRURGICOS LTDA', 'Capital Médica', '567894321045', 'hospitalar@capitalmedica.com.br', '6133509515', 'ATIVO', 'CARGA_SEED')
            RETURNING id INTO v_cliente_id;

            INSERT INTO cliente_endereco (cliente_id, tipo, cep, logradouro, numero, complemento, bairro, cidade, uf, criado_por)
            VALUES (v_cliente_id, 'PRINCIPAL', '70710000', 'SRTVN Quadra 701', 'Edifício Centro Empresarial Norte', 'Bloco B Sala 415', 'Asa Norte', 'Brasília', 'DF', 'CARGA_SEED');

            INSERT INTO cliente_contato (cliente_id, nome, cargo, email, telefone, criado_por)
            VALUES (v_cliente_id, 'Dra. Priscila Vilar', 'Gerente de Contratos', 'hospitalar@capitalmedica.com.br', '6133509515', 'CARGA_SEED');
    END;
END;
/

COMMIT;