@echo off
REM Deutsche Bank Regulatory Pulse - Quick Start (Windows)

echo.
echo ===============================================================
echo  Deutsche Bank Regulatory Pulse - Quick Start
echo ===============================================================
echo.

REM Frontend
echo [INFO] Starting Frontend...
cd db_regulatory_pulse
call npm install > nul 2>&1
echo [OK] Frontend dependencies installed
start cmd /k "npm start"
echo [OK] Frontend running on http://localhost:3000
echo.

REM Backend
echo [INFO] Starting Backend...
cd backend
call py -m pip install -r requirements.txt > nul 2>&1
echo [OK] Backend dependencies installed
start cmd /k "py main.py"
echo [OK] Backend running on http://localhost:8000
echo [OK] API docs at http://localhost:8000/docs

echo.

echo ===============================================================
echo  Application Status:
echo ===============================================================
echo  Frontend: http://localhost:3000
echo  Backend:  http://localhost:8000
echo  API Docs: http://localhost:8000/docs
echo.
echo  Available Screens:
echo  1. Home Dashboard       - http://localhost:3000/
echo  2. Regulatory Intel.    - http://localhost:3000/ai
echo  3. Enterprise Risk      - http://localhost:3000/risks
echo  4. Carbon Dashboard     - http://localhost:3000/esg
echo  5. Cost ^& ROI           - http://localhost:3000/roi
echo  6. Executive Approval   - http://localhost:3000/approval
echo.
echo  Close these windows to stop the application.
echo ===============================================================
echo.
pause
