# Plano de Criação do Projeto ERP — Módulo de Cadastro (Clientes)
**Versão 0.1 · 09/11/2026**
**Stack**: Backend Java/Spring Boot + Oracle · Frontend React + Vite + Material UI

---

## 1. Objetivo e escopo
Construir a base de um sistema ERP multiempresa, começando pelo módulo de cadastro. A primeira entrega é o cadastro de clientes (pessoa física e jurídica), com autenticação, cadastro de empresas e isolamento de dados por empresa. Estoque, compras, vendas e financeiro ficam para fases futuras. Nesta etapa o sistema roda e é testado apenas localmente, sem deploy.

## 2. Decisões já tomadas
| Tema | Decisão |
| :--- | :--- |
| **Backend** | Java com Spring (Spring Boot, configuração por anotações/Java config, sem XML) |
| **Banco de dados** | Oracle (Oracle Database Free em desenvolvimento) |
| **Frontend** | React.js com Vite e Material UI |
| **Multiempresa** | Várias empresas no mesmo sistema |
| **Primeiro cadastro**| Clientes |

## 3. Premissas confirmadas
| Premissa | Status |
| :--- | :--- |
| Clientes PF e PJ (CPF e CNPJ) | Confirmado |
| Frontend em TypeScript | Confirmado |
| Java 21 (LTS) e Spring Boot 3.x | Confirmado |
| Autenticação própria com JWT | Confirmado |
| Ambiente de execução inicial | Apenas local (Oracle Free com 12GB dados e 2GB RAM) |
| Requisitos fiscais (nota fiscal, SEFAZ) | Fora do escopo desta fase |

## 4. Arquitetura
### 4.1 Estrutura do repositório
```text
erp/
├── backend/            # Projeto Spring Boot (Maven)
├── frontend/           # Projeto Vite + React + TypeScript
├── docker-compose.yml  # Oracle Free + serviços de apoio
└── docs/               # Documentação
```

### 4.2 Backend
- Pacotes por módulo: `com.erp.empresa`, `com.erp.seguranca`, `com.erp.cliente`, `com.erp.comum`.
- Componentes: Controller, Service, Repository, Domain e DTO.
- Spring Web, Spring Data JPA (Hibernate), Spring Security, Bean Validation, Flyway, Springdoc OpenAPI, Lombok.
- Migrations versionadas com Flyway; `ddl-auto=validate`.
- Erros padronizados com `@ControllerAdvice` (`ApiErrorResponse`).

### 4.3 Multiempresa
- Coluna `empresa_id` em todas as tabelas de negócio.
- Filtro automático no Hibernate (`@TenantId`) e contexto de tenant extraído do token JWT.
- Cada requisição opera estritamente nos registros da empresa ativa informada no token.

### 4.4 Frontend
- React Router para rotas, TanStack Query + Axios para consumo e cache de dados.
- React Hook Form + Zod para formulários e validação.
- Material UI com MUI X Data Grid nas listagens.
- Layout com menu lateral, seletor de empresa ativa e rotas protegidas por autenticação.

---

## 5. Fases do Projeto
- **Fase 0 — Fundação**: Repositório, Spring Boot, Oracle Docker Compose, Flyway, Swagger, Vite + React + TS + MUI, proxy de desenvolvimento.
- **Fase 1 — Segurança**: Usuários, perfis (ADMIN/OPERADOR), vinculação usuário-empresa, login JWT, troca de empresa ativa, proteção de rotas no front.
- **Fase 2 — Cadastro de empresas**: CRUD de empresas com inativação lógica, restrito a ADMIN.
- **Fase 3 — Clientes (backend)**: PF/PJ com CPF/CNPJ válidos, endereços, contatos, unicidade por empresa, exclusão lógica, filtros e paginação.
- **Fase 4 — Clientes (frontend)**: Data Grid paginado, filtros, formulário em abas com máscaras, busca ViaCEP, feedback visual.
- **Fase 5 — Qualidade**: Testes unitários, de integração, MockMvc, testes frontend, importação/exportação CSV.
