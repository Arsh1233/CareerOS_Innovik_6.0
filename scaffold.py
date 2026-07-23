import os
import shutil

BASE_DIR = r"D:\Innovate_6.0\CareerOS_Innovik_6.0"

# Directories to create
directories = [
    "backend/app/core",
    "backend/app/modules/auth",
    "backend/app/modules/students",
    "backend/app/modules/career_twin",
    "backend/app/modules/resume",
    "backend/app/modules/mentor",
    "backend/app/modules/interview",
    "backend/app/modules/jobs",
    "backend/app/modules/skills",
    "backend/app/modules/recruiter",
    "backend/app/modules/college",
    "backend/app/modules/admin",
    "backend/app/modules/notifications",
    "backend/app/services/ai/prompts",
    "backend/app/services/vector",
    "backend/app/services/voice",
    "backend/app/services/storage",
    "backend/app/services/email",
    "backend/app/services/n8n",
    "backend/migrations/versions",
    "backend/tests/unit",
    "backend/tests/integration",
    "infra/docker/nginx",
    "infra/k8s/deployments",
    "infra/k8s/services",
    "infra/k8s/ingress",
    "infra/terraform",
    "docs/adr",
    ".github/workflows"
]

# Files to create with default content
files = {
    # Backend Core
    "backend/app/__init__.py": "",
    "backend/app/main.py": "from fastapi import FastAPI\n\napp = FastAPI(title='CareerOS API', version='1.0.0')\n\n@app.get('/')\ndef health_check():\n    return {'status': 'ok'}\n",
    "backend/app/config.py": "from pydantic_settings import BaseSettings\n\nclass Settings(BaseSettings):\n    app_name: str = 'CareerOS API'\n\nsettings = Settings()\n",
    "backend/app/dependencies.py": "# Shared FastAPI dependencies (DB sessions, current user, etc.)\n",
    "backend/app/exceptions.py": "# Custom HTTP exceptions\n",
    
    "backend/app/core/__init__.py": "",
    "backend/app/core/security.py": "# JWT generation, password hashing\n",
    "backend/app/core/middleware.py": "# CORS, logging, rate limiting\n",
    "backend/app/core/events.py": "# Startup/shutdown hooks\n",
    "backend/app/core/database.py": "# Supabase / asyncpg connection logic\n",

    # Services
    "backend/app/services/ai/gemini.py": "# Gemini 2.5 Integration\n",
    "backend/app/services/ai/langgraph_orchestrator.py": "# LangGraph state machine orchestrator\n",
    "backend/app/services/vector/qdrant.py": "# Qdrant client\n",
    "backend/app/services/voice/elevenlabs.py": "# ElevenLabs STT/TTS\n",
    
    # Root level files
    "backend/requirements.txt": "fastapi\nuvicorn\npydantic-settings\nlanggraph\ngoogle-genai\n",
    "backend/Dockerfile": "# Production Dockerfile\nFROM python:3.12-slim\nWORKDIR /app\nCOPY requirements.txt .\nRUN pip install -r requirements.txt\nCOPY . .\nCMD [\"uvicorn\", \"app.main:app\", \"--host\", \"0.0.0.0\", \"--port\", \"8000\"]\n",
    "backend/Dockerfile.dev": "# Development Dockerfile\nFROM python:3.12-slim\nWORKDIR /app\nCOPY requirements.txt .\nRUN pip install -r requirements.txt\nCOPY . .\nCMD [\"uvicorn\", \"app.main:app\", \"--host\", \"0.0.0.0\", \"--port\", \"8000\", \"--reload\"]\n",
    "backend/.env.example": "APP_NAME=CareerOS API\nPORT=8000\nJWT_SECRET_KEY=\nSUPABASE_URL=\nSUPABASE_SERVICE_KEY=\nDATABASE_URL=\nQDRANT_API_KEY=\nGOOGLE_API_KEY=\nELEVENLABS_API_KEY=\n",
    
    # Infra
    "infra/docker/docker-compose.yml": "version: '3.9'\nservices:\n  api:\n    build:\n      context: ../../backend\n      dockerfile: Dockerfile.dev\n    ports:\n      - '8000:8000'\n",
    "infra/docker/docker-compose.prod.yml": "version: '3.9'\n",
    "infra/docker/nginx/nginx.conf": "# Nginx Reverse Proxy Config\n",
    "infra/terraform/main.tf": "# Terraform Infrastructure Config\n",
    "infra/terraform/variables.tf": "# Terraform Variables\n",
    
    # Github actions
    ".github/workflows/ci-backend.yml": "name: Backend CI\non: [push]\njobs:\n  build:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v3\n",
}

# Add standard files for each module
modules = [
    "auth", "students", "career_twin", "resume", "mentor", 
    "interview", "jobs", "skills", "recruiter", "college", 
    "admin", "notifications"
]

for mod in modules:
    files[f"backend/app/modules/{mod}/__init__.py"] = ""
    files[f"backend/app/modules/{mod}/router.py"] = f"from fastapi import APIRouter\n\nrouter = APIRouter(prefix='/{mod}', tags=['{mod}'])\n"
    files[f"backend/app/modules/{mod}/service.py"] = "# Business logic\n"
    files[f"backend/app/modules/{mod}/repository.py"] = "# Database queries\n"
    files[f"backend/app/modules/{mod}/schemas.py"] = "from pydantic import BaseModel\n"
    files[f"backend/app/modules/{mod}/models.py"] = "# SQLAlchemy / SQLModel entities\n"

# Create directories
for d in directories:
    dir_path = os.path.join(BASE_DIR, d)
    os.makedirs(dir_path, exist_ok=True)
    print(f"Created dir: {dir_path}")

# Create files
for filepath, content in files.items():
    full_path = os.path.join(BASE_DIR, filepath.replace('/', os.sep))
    with open(full_path, "w", encoding="utf-8") as f:
        f.write(content)
    print(f"Created file: {full_path}")

# Move docs files
docs_dir = os.path.join(BASE_DIR, "docs")
files_to_move = ["architecture.md", "context.md", "frontend_analysis_report.md"]

for fn in files_to_move:
    src = os.path.join(BASE_DIR, fn)
    dst = os.path.join(docs_dir, fn)
    if os.path.exists(src):
        shutil.move(src, dst)
        print(f"Moved {fn} to docs/")

print("Scaffolding complete!")
