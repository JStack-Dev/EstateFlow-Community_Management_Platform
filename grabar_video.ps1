# Script de grabación automática para el vídeo de EstateFlow
# Ejecuta este script ANTES de empezar a grabar
# Abre las pestañas en el orden correcto para que solo tengas que narrar

Write-Host "=== PREPARACIÓN DEL VÍDEO DE ESTATEFLOW ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "Pasos:" -ForegroundColor Yellow
Write-Host "1. Abre OBS Studio o Loom y empieza a grabar"
Write-Host "2. Pulsa Enter en este script cuando estés grabando"
Write-Host "3. Sigue el guion (GUION_VIDEO.md) mientras se abren las pestañas"
Write-Host ""
Write-Host "Pulsa Enter cuando estés listo para empezar..."
Read-Host

# --- BLOQUE 1: Landing page del backend ---
Write-Host "`n[1/7] Abriendo landing page del backend..." -ForegroundColor Green
Start-Process "https://estateflow-backend.onrender.com/"
Start-Sleep -Seconds 3
Write-Host "   -> Narrar BLOQUE 1: Problema y contexto" -ForegroundColor Yellow
Write-Host "   -> Pulsa Enter cuando termines..." -ForegroundColor DarkGray
Read-Host

# --- BLOQUE 2: README en GitHub ---
Write-Host "`n[2/7] Abriendo README en GitHub..." -ForegroundColor Green
Start-Process "https://github.com/JStack-Dev/EstateFlow-Community_Management_Platform"
Start-Sleep -Seconds 3
Write-Host "   -> Narrar BLOQUE 2: Tecnologías" -ForegroundColor Yellow
Write-Host "   -> Pulsa Enter cuando termines..." -ForegroundColor DarkGray
Read-Host

# --- BLOQUE 3a: Frontend - Login admin ---
Write-Host "`n[3/7] Abriendo frontend para login..." -ForegroundColor Green
Start-Process "https://jstack-dev.github.io/EstateFlow-Community_Management_Platform/"
Start-Sleep -Seconds 3
Write-Host "   -> Narrar BLOQUE 3a: Login y roles" -ForegroundColor Yellow
Write-Host "   -> Login como admin / admin123456" -ForegroundColor Cyan
Write-Host "   -> Luego cerrar sesión y entrar como maria / user123456" -ForegroundColor Cyan
Write-Host "   -> Pulsa Enter cuando termines..." -ForegroundColor DarkGray
Read-Host

# --- BLOQUE 3b: Portal residente ---
Write-Host "`n[4/7] Portal del residente..." -ForegroundColor Green
Write-Host "   -> Mostrar dashboard, abrir DevTools (F12)" -ForegroundColor Yellow
Write-Host "   -> Ir a Incidencias, crear una nueva" -ForegroundColor Yellow
Write-Host "   -> Ir a Reservas" -ForegroundColor Yellow
Write-Host "   -> Pulsa Enter cuando termines..." -ForegroundColor DarkGray
Read-Host

# --- BLOQUE 3c: Staff ---
Write-Host "`n[5/7] Panel de operativa - Staff..." -ForegroundColor Green
Write-Host "   -> Cerrar sesión y entrar como porteria / staff123456" -ForegroundColor Yellow
Write-Host "   -> Mostrar KPIs, ir a Incidencias, cambiar estado" -ForegroundColor Yellow
Write-Host "   -> Pulsa Enter cuando termines..." -ForegroundColor DarkGray
Read-Host

# --- BLOQUE 3d: Admin ---
Write-Host "`n[6/7] Panel de administración..." -ForegroundColor Green
Write-Host "   -> Cerrar sesión y entrar como admin / admin123456" -ForegroundColor Yellow
Write-Host "   -> Mostrar dashboard, ir a Usuarios, cambiar rol" -ForegroundColor Yellow
Write-Host "   -> Pulsa Enter cuando termines..." -ForegroundColor DarkGray
Read-Host

# --- BLOQUE 4: DevTools ---
Write-Host "`n[7/7] Integración React + Backend..." -ForegroundColor Green
Write-Host "   -> Abrir DevTools (F12), pestaña Network" -ForegroundColor Yellow
Write-Host "   -> Recargar página, mostrar petición con Authorization Bearer" -ForegroundColor Yellow
Write-Host "   -> Narrar BLOQUE 4 y 5 (cierre)" -ForegroundColor Yellow
Write-Host "   -> Pulsa Enter cuando termines..." -ForegroundColor DarkGray
Read-Host

Write-Host "`n=== VÍDEO COMPLETADO ===" -ForegroundColor Cyan
Write-Host "Detén la grabación en OBS/Loom ahora." -ForegroundColor Red
Write-Host ""
Write-Host "Recuerda:" -ForegroundColor Yellow
Write-Host "- Sube el vídeo a YouTube como 'No listado' o a Google Drive"
Write-Host "- Incluye el enlace en la entrega junto con:"
Write-Host "  * Repositorio GitHub"
Write-Host "  * URLs de despliegue (backend + frontend)"
Write-Host "  * DOCUMENTACION.md"
