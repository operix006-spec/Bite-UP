@echo off
title BITE UP - تشغيل الموقع
echo ===========================================
echo   جاري تشغيل خادم التطوير لمشروع BITE UP...
echo ===========================================
start http://localhost:5173
call npm.cmd run dev
pause
