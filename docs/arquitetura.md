# Arquitetura e Decisões Técnicas

## 1. Visão Geral da Arquitetura

O sistema é desenhado em camadas desacopladas seguindo Clean/Layered Architecture:

```text
[ React 19 Frontend (Vite + MUI + React Query) ]
                       │
                       ▼ (HTTP REST + Bearer JWT)
[ Spring Boot 3 API ]
   ├── Controller (Endpoints REST, DTOs, Bean Validation, OpenAPI)
   ├── Service (Regras de negócio, transações, validações de CPF/CNPJ)
   ├── Repository (Spring Data JPA)
   └── Domain (Entidades JPA com @TenantId, Auditoria e Hibernate)
                       │
                       ▼ (JDBC / OJDBC11)
[ Oracle Database Free 23c / 21c ]
```

---

## 2. Multi-Tenancy (Isolamento de Dados)

### Estratégia: Shared Database, Discriminator Column (`empresa_id`)
1. **Entidades com `@TenantId`**:
   O Hibernate 6 / Spring Data JPA oferece suporte nativo à anotação `@TenantId`. Ao anotar o campo `empresaId` com `@TenantId`, o Hibernate injeta automaticamente o predicado `WHERE empresa_id = ?` em todas as operações de SELECT, UPDATE e DELETE.
2. **Resolução de Tenant em Runtime**:
   - O interceptor / filtro `JwtAuthenticationFilter` extrai o `empresaId` contido nas claims do token JWT.
   - O identificador é armazenado na thread local via `TenantContextHolder`.
   - Um `CurrentTenantIdentifierResolver` repassa a empresa ativa para a SessionFactory do Hibernate.
3. **Restrição de Integridade Única**:
   - No Oracle: `CONSTRAINT uk_cliente_empresa_doc UNIQUE (empresa_id, documento)`.
   - Impede duplicação de CPF/CNPJ dentro da mesma empresa, enquanto permite que filiais ou empresas distintas cadadastrem clientes com o mesmo documento de forma isolada.

---

## 3. Modelo de Auditoria e Exclusão Lógica

- **Auditoria**:
  Todas as tabelas de negócio contêm:
  - `criado_em` (TIMESTAMP NOT NULL)
  - `criado_por` (VARCHAR2(100) NOT NULL)
  - `alterado_em` (TIMESTAMP)
  - `alterado_por` (VARCHAR2(100))
  Suportadas via `AuditableEntity` com Spring Data JPA Auditing (`@CreatedDate`, `@CreatedBy`, `@LastModifiedDate`, `@LastModifiedBy`).

- **Exclusão Lógica**:
  - Coluna `situacao` com valores `ATIVO` e `INATIVO`.
  - Não há exclusão física (`DELETE FROM ...`) em clientes ou empresas para preservar integridade histórica de notas fiscais, lançamentos e movimentações futuras.
