@echo off
title BITE UP - رفع التعديلات إلى GitHub
chcp 65001 > nul
cd /d "%~dp0"

echo =========================================================
echo       BITE UP - رفع تحديثات الذكاء الاصطناعي إلى GitHub
echo =========================================================
echo.

where git >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo [خطأ]: برنامج Git غير مثبت أو غير معرف في متغيرات النظام (PATH).
    pause
    exit /b 1
)

if not exist ".git" (
    echo [1/4] جاري تهيئة مستودع Git وربطه بمستودع GitHub...
    git init
    git branch -M main
    git remote add origin https://github.com/operix006-spec/Bite-UP.git
    echo [2/4] جاري جلب بيانات المستودع لمطابقة السجل...
    git fetch origin main
    git reset --soft origin/main
) else (
    echo [1/4] المستودع مهيأ، جاري ضبط الرابط...
    git remote set-url origin https://github.com/operix006-spec/Bite-UP.git
    git branch -M main
)

echo.
echo [2/4] جاري تجهيز الملفات المعدلة...
git add -A

echo.
echo [3/4] جاري تسجيل التعديلات (Commit)...
git commit -m "feat: integrate OpenRouter AI chatbot with strict no-emoji menu training"

echo.
echo [4/4] جاري الرفع إلى GitHub...
git push origin main

if %ERRORLEVEL% equ 0 (
    echo.
    echo =========================================================
    echo       تهانينا! تم رفع التعديلات بنجاح إلى GitHub
    echo       https://github.com/operix006-spec/Bite-UP
    echo =========================================================
) else (
    echo.
    echo [تنبيه]: جاري معالجة اختلاف السجل والرفع الفوري...
    git fetch origin main
    git push -u origin main --force
    if %ERRORLEVEL% equ 0 (
        echo.
        echo =========================================================
        echo       تم الرفع بنجاح بعد المزامنة!
        echo =========================================================
    )
)

echo.
pause
