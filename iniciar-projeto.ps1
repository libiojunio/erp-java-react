# =====================================================================
# Script PowerShell para iniciar o ERP Multiempresa no WSL (-d Ubuntu)
# =====================================================================

Write-Host "=====================================================================" -ForegroundColor Cyan
Write-Host "     INICIALIZADOR DO ERP MULTIEMPRESA (WSL -d Ubuntu)" -ForegroundColor Cyan
Write-Host "=====================================================================" -ForegroundColor Cyan
Write-Host ""

$ProjectDir = $PSScriptRoot
if (-not $ProjectDir) { $ProjectDir = Get-Location }

# Obter o caminho equivalente dentro do WSL Ubuntu
try {
    $wslDir = (wsl -d Ubuntu wslpath -a "$ProjectDir" 2>$null).Trim()
} catch {
    $wslDir = ""
}

if (-not $wslDir) {
    $driveLetter = $ProjectDir.Substring(0, 1).ToLower()
    $wslDir = "/mnt/$driveLetter" + $ProjectDir.Substring(2).Replace("\", "/")
}

Write-Host "[*] Diretório WSL Ubuntu: $wslDir" -ForegroundColor Gray
Write-Host ""

# 1. Subir o Oracle Database Free no Docker via WSL Ubuntu
Write-Host "[*] Verificando Oracle Database Free via Docker no WSL Ubuntu..." -ForegroundColor Yellow
wsl -d Ubuntu -e bash -lic "cd '$wslDir' && docker compose up -d"
Write-Host ""

# 2. Iniciar o Backend no WSL Ubuntu em uma nova janela
Write-Host "[*] Iniciando o Backend Spring Boot no WSL Ubuntu (porta 8080)..." -ForegroundColor Yellow
Start-Process cmd.exe -ArgumentList "/k", "title ERP - Backend (WSL Ubuntu) && wsl -d Ubuntu -e bash -lic `"cd '$wslDir/backend' && echo 'Iniciando Spring Boot no WSL Ubuntu...' && mvn spring-boot:run`""

# 3. Aguardar o Backend estar 100% pronto antes de abrir o frontend
Write-Host "`n[*] Aguardando o Backend Spring Boot inicializar e responder..." -ForegroundColor Yellow
Write-Host "[i] Testando endpoint de saúde http://localhost:8080/api/status" -ForegroundColor Gray

$backendReady = $false
$maxAttempts = 60
$attempt = 0

while (-not $backendReady -and $attempt -lt $maxAttempts) {
    Start-Sleep -Seconds 2
    $attempt++
    try {
        $res = Invoke-RestMethod -Uri "http://localhost:8080/api/status" -TimeoutSec 2 -ErrorAction Stop
        if ($res.sucesso -eq $true -or $res.status -eq "UP") {
            $backendReady = $true
        }
    } catch {
        Write-Host "." -NoNewline -ForegroundColor DarkYellow
    }
}

if ($backendReady) {
    Write-Host "`n[OK] Backend Spring Boot está OPERACIONAL!`n" -ForegroundColor Green
} else {
    Write-Host "`n[!] Tempo limite de espera atingido. Iniciando frontend...`n" -ForegroundColor DarkYellow
}

# 4. Iniciar o Frontend no WSL Ubuntu em uma nova janela
Write-Host "[*] Iniciando o Frontend Vite React no WSL Ubuntu (porta 5173)..." -ForegroundColor Yellow
Start-Process cmd.exe -ArgumentList "/k", "title ERP - Frontend (WSL Ubuntu) && wsl -d Ubuntu -e bash -lic `"cd '$wslDir/frontend' && echo 'Iniciando Vite React no WSL Ubuntu...' && npm run dev`""

# 5. Abrir automaticamente o navegador
Write-Host "[*] Aguardando Frontend e abrindo automaticamente o navegador..." -ForegroundColor Green
Start-Sleep -Seconds 3
Start-Process "http://localhost:5173"

Write-Host ""
Write-Host "=====================================================================" -ForegroundColor Green
Write-Host "                     SISTEMA OPERACIONAL!                            " -ForegroundColor Green
Write-Host "=====================================================================" -ForegroundColor Green
Write-Host ""
Write-Host "  - Frontend (Web):      http://localhost:5173  (Aberto no navegador)" -ForegroundColor White
Write-Host "  - Backend (API):       http://localhost:8080/api/status" -ForegroundColor White
Write-Host "  - Swagger UI:          http://localhost:8080/swagger-ui.html" -ForegroundColor White
Write-Host ""
Write-Host "  Para encerrar o sistema, feche as janelas individuais do terminal." -ForegroundColor Cyan
Write-Host "=====================================================================" -ForegroundColor Green
Write-Host ""
