@echo Off
pushd %~dp0
setlocal

:Build
call npm install
call npm run validate

if %ERRORLEVEL% neq 0 goto BuildFail

call npm pack

if %ERRORLEVEL% neq 0 goto BuildFail

goto BuildSuccess

:BuildFail
echo.
echo *** BUILD FAILED ***
goto End

:BuildSuccess
echo.
echo *** BUILD SUCCEEDED ***
goto End

:End
echo.
popd
exit /B %ERRORLEVEL%
