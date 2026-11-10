# Script auxiliar de execução local do ERP Multiempresa

param (
    [Parameter(Position=0)]
    [ValidateSet("db-up", "db-down", "backend", "frontend", "check-env")]
    [string]$Action = "check-env"
)

switch ($Action) {
    "db-up" {
        Write-Host "Subindo container do Oracle Database Free..." -ForegroundColor Cyan
        docker compose up -d
    }
    "db-down" {
        Write-Host "Encerrando container do Oracle Database Free..." -ForegroundColor Cyan
        docker compose down
    }
    "backend" {
        Write-Host "Iniciando backend Spring Boot..." -ForegroundColor Cyan
        Set-Location backend
        mvn spring-boot:run
    }
    "frontend" {
        Write-Host "Iniciando frontend Vite..." -ForegroundColor Cyan
        Set-Location frontend
        npm run dev
    }
    "check-env" {
        Write-Host "=== Verificação do Ambiente de Desenvolvimento ===" -ForegroundColor Yellow
        
        Write-Host "`n1. Git:" -NoNewline
        try { & git --version } catch { Write-Host " Não encontrado" -ForegroundColor Red }

        Write-Host "2. Node.js:" -NoNewline
        try { & node -v } catch { Write-Host " Não encontrado" -ForegroundColor Red }

        Write-Host "3. Java (JDK 21):" -NoNewline
        try { & java -version } catch { Write-Host " Não configurado no PATH" -ForegroundColor Red }

        Write-Host "4. Maven:" -NoNewline
        try { & mvn -version } catch { Write-Host " Não configurado no PATH" -ForegroundColor Red }

        Write-Host "5. Docker:" -NoNewline
        try { & docker --version } catch { Write-Host " Não configurado no PATH" -ForegroundColor Red }

        Write-Host "`nPara instruções de instalação do Java 21 e Docker, consulte: docs/guia-ambiente.md" -ForegroundColor Green
    }
}
