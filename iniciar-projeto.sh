#!/bin/bash
# =====================================================================
# Script Bash para iniciar o ERP Multiempresa no WSL / Linux
# =====================================================================

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

echo "====================================================================="
echo "          INICIALIZADOR DO ERP MULTIEMPRESA (WSL Ubuntu)"
echo "====================================================================="
echo ""

# 1. Subir o Oracle Database Free no Docker
if command -v docker &> /dev/null; then
    echo "[*] Verificando banco Oracle Database Free (Docker)..."
    docker compose up -d 2>/dev/null
    if [ $? -eq 0 ]; then
        echo "[OK] Oracle Database pronto ou iniciando em segundo plano."
    fi
fi

# 2. Iniciar o Backend
echo "[*] Iniciando o Backend Spring Boot (porta 8080)..."
cd "$SCRIPT_DIR/backend"
if command -v mvn &> /dev/null; then
    mvn spring-boot:run &
elif [ -f "./mvnw" ]; then
    ./mvnw spring-boot:run &
else
    echo "[!] Maven não encontrado. Instale com: sudo apt install -y maven"
fi
BACKEND_PID=$!

# 3. Aguardar o backend estar operacional
echo -n "[*] Aguardando o Backend inicializar na porta 8080"
until curl -sf http://localhost:8080/api/status >/dev/null 2>&1; do
    echo -n "."
    sleep 2
done
echo ""
echo "[OK] Backend operacional!"
echo ""

# 4. Iniciar o Frontend
echo "[*] Iniciando o Frontend Vite React (porta 5173)..."
cd "$SCRIPT_DIR/frontend"
npm run dev &
FRONTEND_PID=$!

# 5. Abrir automaticamente o navegador
sleep 2
if command -v wslview &>/dev/null; then
    wslview http://localhost:5173
elif command -v cmd.exe &>/dev/null; then
    cmd.exe /c start http://localhost:5173
elif command -v xdg-open &>/dev/null; then
    xdg-open http://localhost:5173
fi

echo ""
echo "====================================================================="
echo "                     SISTEMA EM EXECUÇÃO!                            "
echo "====================================================================="
echo ""
echo "  - Frontend (Web):      http://localhost:5173  (Aberto no navegador)"
echo "  - Backend (API):       http://localhost:8080/api/status"
echo "  - Swagger UI:          http://localhost:8080/swagger-ui.html"
echo ""
echo "  Pressione Ctrl+C para encerrar o frontend e o backend simultaneamente."
echo "====================================================================="

cleanup() {
    echo ""
    echo "[*] Encerrando processos..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    echo "[OK] Sistema finalizado."
    exit 0
}

trap cleanup SIGINT SIGTERM
wait
