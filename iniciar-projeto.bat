@echo off
chcp 65001 >nul
title Inicializador do ERP Multiempresa (WSL - Ubuntu)
color 0b

echo =====================================================================
echo         INICIALIZADOR DO ERP MULTIEMPRESA (WSL - Ubuntu)
echo =====================================================================
echo.

set "PROJECT_DIR=%~dp0"
cd /d "%PROJECT_DIR%"

REM Obter o caminho equivalente dentro do WSL Ubuntu
for /f "usebackq delims=" %%i in (`wsl -d Ubuntu wslpath -a "%PROJECT_DIR%" 2^>nul`) do set "WSL_DIR=%%i"
if "%WSL_DIR%"=="" set "WSL_DIR=/mnt/d/Programas/Projetos/erp-java-react"

echo [*] Diretorio no WSL Ubuntu: %WSL_DIR%
echo.

REM 1. Subir container do Oracle Database Free via Docker no WSL
echo [*] Verificando banco Oracle Database Free (Docker no WSL Ubuntu)...
wsl -d Ubuntu -e bash -lic "cd '%WSL_DIR%' && docker compose up -d"
echo.

REM 2. Iniciar o Backend no WSL Ubuntu (Spring Boot - Porta 8080)
echo [*] Iniciando o Backend Spring Boot no WSL Ubuntu...
start "ERP - Backend Spring Boot (WSL Ubuntu)" cmd /k "title ERP - Backend (WSL Ubuntu) && wsl -d Ubuntu -e bash -lic "cd '%WSL_DIR%/backend' && echo 'Iniciando Spring Boot no WSL Ubuntu...' && mvn spring-boot:run""

REM 3. Aguardar o Backend estar 100%% operacional (Healthcheck em /api/status)
echo.
echo [*] Aguardando o Backend Spring Boot inicializar na porta 8080...
echo [i] Aguardando conexao com Oracle e subida da aplicacao...

set "TENTATIVAS=0"
:AGUARDAR_BACKEND
timeout /t 2 /nobreak >nul
set /a TENTATIVAS+=1

curl.exe -s -f http://localhost:8080/api/status >nul 2>&1
if %ERRORLEVEL% equ 0 goto BACKEND_PRONTO

if %TENTATIVAS% geq 60 (
    echo.
    echo [!] Tempo limite atingido (120s) aguardando o backend.
    echo [!] Prosseguindo com a inicializacao do frontend...
    goto INICIAR_FRONTEND
)

<nul set /p=.
goto AGUARDAR_BACKEND

:BACKEND_PRONTO
echo.
echo [OK] Backend Spring Boot esta OPERACIONAL! (http://localhost:8080/api/status)
echo.

:INICIAR_FRONTEND
REM 4. Iniciar o Frontend no WSL Ubuntu (Vite React - Porta 5173)
echo [*] Iniciando o Frontend Vite React no WSL Ubuntu...
start "ERP - Frontend Vite React (WSL Ubuntu)" cmd /k "title ERP - Frontend (WSL Ubuntu) && wsl -d Ubuntu -e bash -lic "cd '%WSL_DIR%/frontend' && echo 'Iniciando Vite React no WSL Ubuntu...' && npm run dev""

REM 5. Aguardar 3 segundos e abrir automaticamente o navegador
echo [*] Abrindo automaticamente o navegador em http://localhost:5173...
timeout /t 3 /nobreak >nul
start http://localhost:5173

echo.
echo =====================================================================
echo                     SISTEMA OPERACIONAL!
echo =====================================================================
echo.
echo  - Frontend (Web):      http://localhost:5173  (Aberto no navegador)
echo  - Backend (API):       http://localhost:8080/api/status
echo  - Swagger UI:          http://localhost:8080/swagger-ui.html
echo.
echo  Para encerrar o sistema, feche as janelas individuais do terminal.
echo =====================================================================
echo.

pause
