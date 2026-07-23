#!/usr/bin/env python3
"""
Deutsche Bank Regulatory Pulse - Installation Verification Script
Checks project setup and dependencies
"""

import os
import sys
import subprocess
import json
from pathlib import Path

class Colors:
    GREEN = '\033[92m'
    RED = '\033[91m'
    YELLOW = '\033[93m'
    BLUE = '\033[94m'
    RESET = '\033[0m'
    BOLD = '\033[1m'

def print_header(text):
    print(f"\n{Colors.BOLD}{Colors.BLUE}{'='*60}{Colors.RESET}")
    print(f"{Colors.BOLD}{Colors.BLUE}{text.center(60)}{Colors.RESET}")
    print(f"{Colors.BOLD}{Colors.BLUE}{'='*60}{Colors.RESET}\n")

def print_success(text):
    print(f"{Colors.GREEN}✅ {text}{Colors.RESET}")

def print_error(text):
    print(f"{Colors.RED}❌ {text}{Colors.RESET}")

def print_warning(text):
    print(f"{Colors.YELLOW}⚠️  {text}{Colors.RESET}")

def check_file_exists(path, description):
    """Check if a file or directory exists"""
    if Path(path).exists():
        print_success(f"{description} exists")
        return True
    else:
        print_error(f"{description} missing: {path}")
        return False

def check_command(cmd, version_arg="--version"):
    """Check if a command is available"""
    if cmd == "python":
        import sys
        return True, f"Python {sys.version.split()[0]}"
    if cmd == "pip":
        import sys
        try:
            result = subprocess.run([sys.executable, "-m", "pip", version_arg], capture_output=True, text=True, timeout=5)
            if result.returncode == 0:
                version = result.stdout.strip().split('\n')[0]
                return True, version
        except:
            pass
    try:
        result = subprocess.run([cmd, version_arg], capture_output=True, text=True, timeout=5, shell=os.name == 'nt')
        if result.returncode == 0:
            version = result.stdout.strip().split('\n')[0]
            return True, version
        return False, "Not available"
    except Exception as e:
        return False, str(e)

def check_project():
    """Verify project structure"""
    print_header("Project Structure Verification")
    
    files_to_check = [
        ("src", "Frontend source directory"),
        ("backend/main.py", "FastAPI backend"),
        ("package.json", "NPM configuration"),
        ("build", "Production build"),
        ("Dockerfile.frontend", "Frontend Docker"),
        ("backend/Dockerfile", "Backend Docker"),
        ("docker-compose.yml", "Docker Compose"),
    ]
    
    all_exist = True
    for path, desc in files_to_check:
        if not check_file_exists(path, desc):
            all_exist = False
    
    return all_exist

def check_dependencies():
    """Check system dependencies"""
    print_header("Dependency Check")
    
    deps = [
        ("node", "Node.js", "--version"),
        ("npm", "NPM", "--version"),
        ("python", "Python", "--version"),
        ("pip", "PIP", "--version"),
    ]
    
    available = {}
    for cmd, name, version_arg in deps:
        available_bool, version = check_command(cmd, version_arg)
        if available_bool:
            print_success(f"{name}: {version}")
        else:
            print_error(f"{name}: Not found")
        available[cmd] = available_bool
    
    return all(available.values())

def check_node_modules():
    """Check if node_modules are installed"""
    print_header("Node Modules Check")
    
    if Path("node_modules").exists():
        count = len(list(Path("node_modules").glob("*")))
        print_success(f"Node modules installed ({count} packages)")
        return True
    else:
        print_warning("Node modules not installed. Run: npm install")
        return False

def check_python_env():
    """Check Python environment"""
    print_header("Python Environment Check")
    
    req_file = Path("backend/requirements.txt")
    if req_file.exists():
        print_success("requirements.txt found")
        with open(req_file) as f:
            packages = [line.strip() for line in f if line.strip() and not line.startswith('#')]
            print_success(f"Required packages: {', '.join(packages)}")
        return True
    else:
        print_error("requirements.txt not found")
        return False

def check_build():
    """Check production build"""
    print_header("Production Build Check")
    
    build_dir = Path("build")
    if build_dir.exists():
        files = list(build_dir.rglob("*"))
        file_count = len([f for f in files if f.is_file()])
        total_size = sum(f.stat().st_size for f in files if f.is_file()) / (1024 * 1024)
        
        print_success(f"Production build exists")
        print_success(f"Build files: {file_count}")
        print_success(f"Build size: {total_size:.2f} MB")
        return True
    else:
        print_warning("Production build not found. Run: npm run build")
        return False

def check_screens():
    """Check if all screens are implemented"""
    print_header("Screens Implementation Check")
    
    screens = [
        ("src/pages/HomeDashboard.js", "Home Dashboard"),
        ("src/pages/RegulatoryIntelligence.js", "Regulatory Intelligence"),
        ("src/pages/DepartmentImpact.js", "Department Impact"),
        ("src/pages/EnterpriseRiskDashboard.js", "Enterprise Risk"),
        ("src/pages/CarbonDashboard.js", "Carbon Dashboard"),
        ("src/pages/CostROIDashboard.js", "Cost & ROI"),
        ("src/pages/ExecutiveApproval.js", "Executive Approval"),
    ]
    
    all_exist = True
    for path, name in screens:
        if check_file_exists(path, name):
            pass
        else:
            all_exist = False
    
    return all_exist

def print_summary(results):
    """Print summary of checks"""
    print_header("Summary")
    
    checks = {
        "Project Structure": results.get("structure", False),
        "Dependencies": results.get("dependencies", False),
        "Node Modules": results.get("node_modules", False),
        "Python Environment": results.get("python_env", False),
        "Production Build": results.get("build", False),
        "All Screens": results.get("screens", False),
    }
    
    passed = sum(1 for v in checks.values() if v)
    total = len(checks)
    
    for check, result in checks.items():
        status = f"{Colors.GREEN}✅ PASS{Colors.RESET}" if result else f"{Colors.RED}❌ FAIL{Colors.RESET}"
        print(f"{check}: {status}")
    
    print(f"\n{Colors.BOLD}Overall: {passed}/{total} checks passed{Colors.RESET}\n")
    
    if passed == total:
        print_success("All checks passed! Project is ready to deploy.")
        return True
    else:
        print_warning("Some checks failed. Please review above.")
        return False

def print_next_steps():
    """Print next steps"""
    print_header("Next Steps")
    
    print(f"""{Colors.YELLOW}To get started:{Colors.RESET}

1. {Colors.BOLD}Install dependencies{Colors.RESET}:
   npm install
   cd backend && pip install -r requirements.txt

2. {Colors.BOLD}Start development servers{Colors.RESET}:
   
   Terminal 1 (Frontend):
   npm start
   
   Terminal 2 (Backend):
   cd backend && python main.py

3. {Colors.BOLD}Open in browser{Colors.RESET}:
   http://localhost:3000

4. {Colors.BOLD}Access API documentation{Colors.RESET}:
   http://localhost:8000/docs

{Colors.YELLOW}For production deployment:{Colors.RESET}

1. {Colors.BOLD}Docker deployment{Colors.RESET}:
   docker-compose up --build

2. {Colors.BOLD}Or manual deployment{Colors.RESET}:
   Frontend: npm run build && serve -s build
   Backend: gunicorn -w 4 main:app

{Colors.YELLOW}Available screens:{Colors.RESET}

- http://localhost:3000/                (Home)
- http://localhost:3000/ai              (Regulatory Intelligence)
- http://localhost:3000/risks           (Enterprise Risk)
- http://localhost:3000/esg             (Carbon Dashboard)
- http://localhost:3000/roi             (Cost & ROI)
- http://localhost:3000/approval        (Executive Approval)
- http://localhost:3000/departments     (Department Impact)

""")

def main():
    """Run all checks"""
    print_header("Deutsche Bank Regulatory Pulse - Installation Check")
    
    results = {
        "structure": check_project(),
        "dependencies": check_dependencies(),
        "node_modules": check_node_modules(),
        "python_env": check_python_env(),
        "build": check_build(),
        "screens": check_screens(),
    }
    
    success = print_summary(results)
    print_next_steps()
    
    return 0 if success else 1

if __name__ == "__main__":
    sys.exit(main())
