cls
@echo off
echo.
set meeting-pod=meeting-app-79b779b6cf-lsjhl
set peerjs-pod=peerjs-with-cors-68d7649575-mj7r7

@echo peerjs server - pod logs:
echo:
kubectl -n meeting-app logs %meeting-pod%
echo:
echo:
@echo meeting app   - pod logs:
echo:
kubectl -n peerjs-with-cors logs %peerjs-pod%
echo:
echo: