cls
@echo off
echo.
@echo 'Checking'
@echo 'Peerjs Server and Meeting App Server'
@echo 'in'
@echo 'Kubernetes...'
@start /min cmd /k npm run list-pods
echo.
@echo 'Starting Peerjs Server NGROK Tunnel...'
@start /min cmd /k npm run start-ngrok-tunnel-peerjs
@timeout 5
echo.
@echo 'Starting Meeting App Server NGROK Tunnel...'
start /min cmd /k npm run start-ngrok-tunnel-server
@timeout 5
echo.
@echo 'Opening Meet-Free Web App in Chrome...'
@timeout 5
"C:\Program Files\Google\Chrome\Application\chrome.exe"  --new-window https://subdomain1.yourhost.com

