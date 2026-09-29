@echo off
title BITE UP - رفع التعديلات إلى GitHub
chcp 65001 > nul
cd /d "%~dp0"

echo =========================================================
echo       BITE UP - رفع كافة التعديلات إلى GitHub
echo =========================================================
echo.

where git >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo [خطأ]: برنامج Git غير مثبت أو غير معرف في متغيرات النظام (PATH).
    pause
    exit /b 1
)

:: إزالة الملفات الكبيرة غير المرغوبة من التتبع إن وجدت
git rm --cached cloudflared.exe 2>nul

echo [1/4] جاري التحقق من المستودع والفرع (Branch: main)...
if not exist ".git" (
    git init
    git branch -M main
    git remote add origin https://github.com/operix006-spec/Bite-UP.git
) else (
    git remote set-url origin https://github.com/operix006-spec/Bite-UP.git 2>nul || git remote add origin https://github.com/operix006-spec/Bite-UP.git
    git branch -M main
)

echo.
echo [2/4] جاري إضافة كافة الملفات والتعديلات...
git add -A

echo.
echo [3/4] تسجيل التعديلات (Commit)...
set /p commit_msg="اكتب وصف التعديل (أو اضغط Enter للافتراضي): "
if "%commit_msg%"=="" set commit_msg=Update Bite UP project and features

git commit -m "%commit_msg%"

echo.
echo [4/4] جاري الرفع إلى GitHub...
git push -u origin main

if %ERRORLEVEL% equ 0 (
    echo.
    echo =========================================================
    echo       تهانينا! تم رفع كافة التعديلات بنجاح إلى GitHub:
    echo       https://github.com/operix006-spec/Bite-UP
    echo =========================================================
) else (
    echo.
    echo [تنبيه]: قد يتطلب الرفع مزامنة السجل مع GitHub...
    git pull origin main --rebase
    git push -u origin main
    if %ERRORLEVEL% equ 0 (
        echo.
        echo =========================================================
        echo       تمت المزامنة والرفع بنجاح!
        echo       https://github.com/operix006-spec/Bite-UP
        echo =========================================================
    ) else (
        echo.
        echo إذا استمرت المشكلة، يرجى التأكد من تسجيل دخولك في Git أو استخدام Personal Access Token الخاص بك.
    )
)

echo.
pause
