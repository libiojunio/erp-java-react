@REM ----------------------------------------------------------------------------
@REM Maven Wrapper script for Windows
@REM ----------------------------------------------------------------------------
@echo off
setlocal

set "MAVEN_PROJECTBASEDIR=%~dp0"
set "WRAPPER_JAR=%MAVEN_PROJECTBASEDIR%.mvn\wrapper\maven-wrapper.jar"

if exist "%WRAPPER_JAR%" (
    java -jar "%WRAPPER_JAR%" %*
    exit /b %ERRORLEVEL%
)

where mvn >nul 2>nul
if %ERRORLEVEL% equ 0 (
    mvn %*
    exit /b %ERRORLEVEL%
)

echo Maven nao encontrado. Por favor instale o Maven ou configure o wrapper.
exit /b 1
