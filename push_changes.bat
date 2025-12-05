@echo off
cd /d "%~dp0"
echo Checking git status...
git status
echo.
echo Adding all changes...
git add -A
echo.
echo Committing changes...
git commit -m "Code cleanup: revert to English, exclude Spanish docs from git"
echo.
echo Pushing to origin...
git push origin master
echo.
echo Done!
pause
