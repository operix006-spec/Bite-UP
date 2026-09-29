@echo off
title BITE UP - تشغيل الموقع
echo ===========================================
echo   جاري تشغيل خادم التطوير لمشروع BITE UP...
echo ===========================================
if not exist "node_modules" (
    echo [تنبيه] مجلد الحزم node_modules غير موجود، جاري التثبيت عبر npm install...
    call npm.cmd install
)
start http://localhost:5173
call npm.cmd run dev
pause
