# Guia de Configuração do Ambiente Local (Windows)

Este guia orienta a preparação do ambiente de desenvolvimento local para compilar e executar o backend Java e o banco Oracle Free.

---

## 1. Instalação do Java 21 (JDK 21 LTS)

O projeto requer **Java 21**. Recomendamos a distribuição **Eclipse Temurin** (Adoptium) ou **Amazon Corretto**.

### Opção A: Download Direto (Recomendado)
1. Acesse: [https://adoptium.net/temurin/releases/?version=21](https://adoptium.net/temurin/releases/?version=21)
2. Baixe o instalador `.msi` para Windows x64 (ex: `OpenJDK21U-jdk_x64_windows_hotspot_21.x.x.msi`).
3. Durante a instalação, certifique-se de marcar as opções:
   - **Add to PATH**
   - **Set JAVA_HOME variable**
4. Abra um novo terminal PowerShell e valide:
   ```powershell
   java -version
   ```

---

## 2. Instalação do Docker Desktop

Para executar o Oracle Database Free localmente via Docker Compose:

1. Baixe o **Docker Desktop** para Windows: [https://www.docker.com/products/docker-desktop/](https://www.docker.com/products/docker-desktop/)
2. Instale com a opção WSL 2 ou Hyper-V habilitada.
3. Inicie o Docker Desktop.
4. Na raiz deste projeto, suba o banco de dados com:
   ```powershell
   docker compose up -d
   ```
5. Para verificar se o banco subiu e está saudável:
   ```powershell
   docker ps
   ```

---

## 3. Node.js & Frontend

O Node.js (versão 26+) já está presente no sistema. Para iniciar o frontend:
```powershell
cd frontend
npm install
npm run dev
```
O servidor Vite estará rodando em `http://localhost:5173`.
