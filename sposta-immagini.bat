@echo off
REM Doppio clic per spostare le immagini degli header del sito Arena97
cd /d "%~dp0"
python sposta-immagini.py
echo.
pause
