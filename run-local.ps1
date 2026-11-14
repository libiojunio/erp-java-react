# Script auxiliar de execução local do ERP Multiempresa (via WSL Ubuntu)

param (
    [Parameter(Position=0)]
    [ValidateSet("all", "backend", "frontend", "db-up", "db-down", "check-env")]
    [string]$Action = "all"
)

$ProjectDir = $PSScriptRoot
if (-not $ProjectDir) { $ProjectDir = Get-Location }

try {
    $wslDir = (wsl -d Ubuntu wslpath -a "$ProjectDir" 2>$null).Trim()
} catch {
    $wslDir = ""
}

if (-not $wslDir) {
    $driveLetter = $ProjectDir.Substring(0, 1).ToLower()
    $wslDir = "/mnt/$driveLetter" + $ProjectDir.Substring(2).Replace("\", "/")
}

switch ($Action) {
    "all" {
        & "$PSScriptRoot\iniciar-projeto.ps1"
    }
    "db-up" {
        Write-Host "Subindo container do Oracle Database Free via WSL Ubuntu..." -ForegroundColor Cyan
        wsl -d Ubuntu -e bash -lic "cd '$wslDir' && docker compose up -d"
    }
    "db-down" {
        Write-Host "Encerrando container do Oracle Database Free via WSL Ubuntu..." -ForegroundColor Cyan
        wsl -d Ubuntu -e bash -lic "cd '$wslDir' && docker compose down"
    }
    "backend" {
        Write-Host "Iniciando backend Spring Boot via WSL Ubuntu..." -ForegroundColor Cyan
        wsl -d Ubuntu -e bash -lic "cd '$wslDir/backend' && mvn spring-boot:run"
    }
    "frontend" {
        Write-Host "Iniciando frontend Vite via WSL Ubuntu..." -ForegroundColor Cyan
        wsl -d Ubuntu -e bash -lic "cd '$wslDir/frontend' && npm run dev"
    }
    "check-env" {
        Write-Host "=== Verificação do Ambiente no WSL (-d Ubuntu) ===" -ForegroundColor Yellow
        wsl -d Ubuntu -e bash -lic "echo -n '1. Git: ' && git --version || echo 'Não encontrado'"
        wsl -d Ubuntu -e bash -lic "echo -n '2. Node.js: ' && node -v || echo 'Não encontrado'"
        wsl -d Ubuntu -e bash -lic "echo -n '3. Java: ' && java -version 2>&1 | head -n 1 || echo 'Não encontrado'"
        wsl -d Ubuntu -e bash -lic "echo -n '4. Maven: ' && mvn -version 2>&1 | head -n 1 || echo 'Não encontrado'"
        wsl -d Ubuntu -e bash -lic "echo -n '5. Docker: ' && docker --version || echo 'Não encontrado'"
    }
}
