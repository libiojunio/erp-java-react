# ERP Multiempresa — Módulo de Cadastro (Clientes)

Sistema ERP multiempresa construído com **Spring Boot 3 (Java 21)**, **Oracle Database Free** e **React + Vite + TypeScript + Material UI**.

---

## 📁 Estrutura do Repositório

```text
erp-java-react/
├── backend/            # API REST Spring Boot (Java 21, Maven, Flyway, Spring Security, JWT)
├── frontend/           # Aplicação SPA React + Vite + TypeScript + Material UI
├── docs/               # Documentação técnica, arquitetura e planejamento
├── docker-compose.yml  # Oracle Database Free local
└── README.md           # Documentação inicial do projeto
```

---

## 🚀 Como Executar

### Inicialização Rápida (Script Único)

Você pode iniciar o backend e o frontend simultaneamente com um único comando:

* **No Windows (Prompt / Explorer)**: Dê um duplo-clique no arquivo `iniciar-projeto.bat` ou execute:
  ```cmd
  .\iniciar-projeto.bat
  ```
* **No PowerShell**:
  ```powershell
  .\iniciar-projeto.ps1
  ```
* **No WSL / Linux**:
  ```bash
  chmod +x iniciar-projeto.sh
  ./iniciar-projeto.sh
  ```

---

### Execução Manual Passo a Passo
- **Java 21** (JDK 21 LTS - Eclipse Temurin ou Amazon Corretto)
- **Maven 3.9+** (ou Maven Wrapper `./mvnw`)
- **Node.js 20+** e **npm**
- **Docker & Docker Compose** (para subir o Oracle Database Free local)

### 2. Subindo o Banco de Dados (Oracle Free)
```bash
docker compose up -d
```
O banco estará acessível em:
- **Host**: `localhost`
- **Porta**: `1521`
- **Service Name**: `FREEPDB1`
- **Schema/Usuário**: `erp_user`
- **Senha**: `erp_password123`

### 3. Executando o Backend
```bash
cd backend
mvn spring-boot:run
```
- API REST: `http://localhost:8080/api`
- Swagger UI (OpenAPI): `http://localhost:8080/swagger-ui.html`
- Healthcheck: `http://localhost:8080/actuator/health`

*Dica para desenvolvimento sem Docker*: O perfil `test` utiliza H2 Database em modo de compatibilidade Oracle (`Oracle mode`), permitindo executar testes e desenvolvimento sem subir o container.

### 4. Executando o Frontend
```bash
cd frontend
npm install
npm run dev
```
- Acesso Web: `http://localhost:5173`
- As chamadas `/api/*` são roteadas automaticamente via proxy do Vite para `http://localhost:8080`.

---

## 🔒 Multiempresa & Segurança
- **Estratégia de Multiempresa**: Segregação de dados via coluna discriminadora `empresa_id` em todas as tabelas de negócio, filtrada automaticamente no Hibernate (`@TenantId`) e alimentada a partir do token JWT.
- **Autenticação**: JWT stateless com emissão no login (`/api/auth/login`) e troca de empresa ativa (`/api/auth/empresa-ativa`).
- **Auditoria**: Todas as entidades possuem `criado_em`, `criado_por`, `alterado_em` e `alterado_por`.
