#!/bin/bash
# Quick Start Script for Deutsche Bank Regulatory Pulse

echo "🏦 Deutsche Bank Regulatory Pulse - Quick Start"
echo "======================================================="
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Frontend
echo -e "${BLUE}🚀 Starting Frontend...${NC}"
cd db_regulatory_pulse
npm install > /dev/null 2>&1
echo -e "${GREEN}✅ Frontend dependencies installed${NC}"
npm start &
FRONTEND_PID=$!
echo -e "${GREEN}✅ Frontend running on http://localhost:3000${NC}"
echo ""

# Backend
echo -e "${BLUE}🚀 Starting Backend...${NC}"
cd backend
pip install -r requirements.txt > /dev/null 2>&1
echo -e "${GREEN}✅ Backend dependencies installed${NC}"
python main.py &
BACKEND_PID=$!
echo -e "${GREEN}✅ Backend running on http://localhost:8000${NC}"
echo -e "${GREEN}✅ API docs at http://localhost:8000/docs${NC}"
echo ""

echo -e "${YELLOW}📋 Application Status:${NC}"
echo "  Frontend: http://localhost:3000"
echo "  Backend:  http://localhost:8000"
echo "  API Docs: http://localhost:8000/docs"
echo ""
echo -e "${YELLOW}💡 Available Screens:${NC}"
echo "  1. Home Dashboard     (http://localhost:3000/)"
echo "  2. Regulatory Intelligence (http://localhost:3000/ai)"
echo "  3. Enterprise Risk    (http://localhost:3000/risks)"
echo "  4. Carbon Dashboard   (http://localhost:3000/esg)"
echo "  5. Cost & ROI         (http://localhost:3000/roi)"
echo "  6. Executive Approval (http://localhost:3000/approval)"
echo ""
echo -e "${YELLOW}🛑 To stop the application, press Ctrl+C${NC}"
echo ""

# Wait for both processes
wait $FRONTEND_PID $BACKEND_PID
