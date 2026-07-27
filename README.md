<p align="center">
  <img src="https://img.shields.io/badge/CareerOS-Agentic_AI-8B5CF6?style=for-the-badge&logo=robot&logoColor=white" alt="CareerOS Badge"/>
  <img src="https://img.shields.io/badge/Innovate_6.0-Hackathon-3B82F6?style=for-the-badge&logo=trophy&logoColor=white" alt="Innovate 6.0"/>
  <img src="https://img.shields.io/badge/Team-Jee_Jee_Brats-10B981?style=for-the-badge&logo=users&logoColor=white" alt="Team Jee Jee Brats"/>
  <br/>
  <a href="https://youtu.be/YOUR_VIDEO_ID">
    <img src="https://img.shields.io/badge/▶_Watch_Demo-YouTube-FF0000?style=for-the-badge&logo=youtube&logoColor=white" alt="YouTube Demo"/>
  </a>
</p>

<h1 align="center">🚀 CareerOS</h1>
<h3 align="center">Agentic AI-Powered Career Operating System</h3>

<p align="center">
  <em>Bridging the gap between Education and Employment through multi-agent AI intelligence.</em>
</p>

<p align="center">
  <a href="#-tech-stack">Tech Stack</a> •
  <a href="#-features">Features</a> •
  <a href="#-architecture">Architecture</a> •
  <a href="#-getting-started">Getting Started</a> •
  <a href="#-api-reference">API Reference</a> •
  <a href="#-database-schema">Database</a> •
  <a href="#-ai-agents">AI Agents</a> •
  <a href="#-project-structure">Structure</a>
</p>

---

## 📌 What is CareerOS?

CareerOS is a **multi-agent AI Career Operating System** built for **Innovate 6.0** by **Team Innovik**. Unlike fragmented career platforms (LinkedIn for networking, Coursera for learning, Naukri for jobs, ChatGPT for guidance), CareerOS unifies the entire career journey into a single AI-powered ecosystem.

The platform serves **three stakeholders** through one unified intelligence layer:

| Stakeholder | CareerOS Acts As | Key Value |
|---|---|---|
| 🎓 **Students** | AI Career Team | Career Twin, AI Mentor, Resume Intelligence, Roadmaps, Mock Interviews, Job Matching |
| 🏫 **Colleges** | Placement Intelligence Platform | Placement readiness monitoring, department analytics, at-risk detection, forecasting |
| 💼 **Recruiters** | Talent Intelligence Platform | AI candidate search, match scoring, hiring analytics, candidate summaries |

### Core Innovation: Digital Career Twin

A continuously evolving AI model representing a student's career. It updates based on resume changes, new skills, interview results, learning progress, and applications — outputting a **Career Readiness Score**, **Placement Probability**, **Salary Forecast**, **Skill Gap Analysis**, and **Growth Trajectory**.

---

## 🛠️ Tech Stack

**Frontend:** React 19 · TypeScript 5.7 · Vite 8 · Tailwind CSS v4 · React Router DOM 7 · Framer Motion · Lucide Icons

**Backend:** FastAPI (Python 3.12) · Uvicorn · Pydantic · PyJWT · PyPDF2 · httpx · tenacity

**AI / ML:** Groq SDK (LLaMA 3.3 70B / LLaMA 3.1 8B / Gemma2 9B with auto-fallback) · Google Gemini API · LangGraph Agent Orchestrator · n8n Workflow Automation

**Database:** Supabase (PostgreSQL 15+ with Row Level Security) · Qdrant Vector DB (768-dim cosine similarity)

**Cloud & Infra:** Supabase Cloud · Google Cloud Run · Vercel · Cloudflare · Docker · GitHub Actions CI/CD · Kubernetes & Terraform (scaffolded)

---

## ✨ Features

### 🎓 Student Features

| Feature | Description | AI Agent |
|---|---|---|
| **Career Twin** | Digital career model — predicts readiness score, placement probability, salary forecast, skill gaps | Career Twin Agent |
| **ARIA Mentor** | Conversational AI career coach — provides personalized guidance, learning recommendations, goal planning | ARIA Mentor Agent |
| **Resume Intelligence** | Upload PDF → AI extracts text, generates ATS score, keyword analysis, actionable suggestions, and full resume optimization | Resume Intelligence Agent |
| **Roadmap Engine** | AI-generated month-by-month learning paths with resources, adapting to career goals and timeframe | Roadmap Agent |
| **ECHO Interview** | AI-powered mock interviews evaluating communication, technical knowledge, and readiness | ECHO Interview Agent |
| **Job Matching** | AI-driven opportunity recommendations with match scores, hiring probability, and missing skill analysis | Job Match Agent |
| **Skills Dashboard** | Skill gap analysis and progress tracking | — |
| **Profile & Onboarding** | Multi-step onboarding flow with role-based dashboards | — |

### 🏫 College Features

| Feature | Description |
|---|---|
| **Placement Readiness Monitoring** | Batch-level employability tracking with readiness scores |
| **Department Performance Analytics** | Department-wise placement success and skill trends |
| **Skill Gap Intelligence** | Institution-wide missing skills and industry demand mismatches |
| **At-Risk Student Detection** | Early identification of students likely to struggle with placements |
| **Placement Forecasting** | AI-predicted future placement outcomes |
| **Recruiter Engagement Tracking** | Recruiter activity, hiring success, and company interaction metrics |

### 💼 Recruiter Features

| Feature | Description |
|---|---|
| **AI Candidate Search** | Natural-language talent discovery (e.g., "Find AI engineers with FastAPI + 2 internships") |
| **Candidate Match Engine** | Skill alignment, role fit, and hiring probability calculations |
| **AI Candidate Summaries** | Auto-generated concise talent profiles |
| **Hiring Analytics** | Funnel analytics, conversion rates, and candidate quality insights |

### 🔐 Platform-Wide

| Feature | Description |
|---|---|
| **Supabase Auth** | Email/Password + Google OAuth via Supabase Identity Provider |
| **JWT Middleware** | Automatic token verification on every request via custom ASGI middleware |
| **Role-Based Access Control (RBAC)** | 4 roles — Student, Recruiter, College Admin, Super Admin — enforced at API + DB level |
| **Row Level Security (RLS)** | PostgreSQL kernel-level tenant data isolation |
| **Multi-Tenant Architecture** | Students scoped to colleges, recruiters scoped to companies, cross-tenant queries blocked |
| **n8n + Direct AI Fallback** | Every AI feature routes through n8n first; if n8n is offline, seamlessly falls back to direct LLM calls |

---

## 🏗️ Architecture

### High-Level System Design

```
┌──────────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                              │
│  React 19 + TypeScript + Vite 8 + Tailwind v4                    │
│  14 Pages · 3 Context Providers · Lazy-loaded Routes             │
└────────────────────────────┬─────────────────────────────────────┘
                             │ HTTP/JSON + SSE + WebSocket
┌────────────────────────────▼─────────────────────────────────────┐
│                      API GATEWAY LAYER                           │
│  FastAPI Modular Monolith                                        │
│  JWT Middleware → CORS → Router → Service → Repository           │
│  13 API Route Groups · Pydantic Schemas · DI Pipeline            │
└──────┬──────────────┬──────────────┬──────────────┬──────────────┘
       │              │              │              │
       ▼              ▼              ▼              ▼
┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────┐
│  Supabase  │ │   Qdrant   │ │ Groq / AI  │ │    n8n     │
│ PostgreSQL │ │ Vector DB  │ │  LLM APIs  │ │ Workflows  │
│  + Auth    │ │ 768-dim    │ │ LLaMA 3.3  │ │ ETL/Cron   │
│  + RLS     │ │ Cosine     │ │ + Fallback │ │ + Webhooks │
└────────────┘ └────────────┘ └────────────┘ └────────────┘
```

### Backend Design Pattern: Modular Monolith

Each domain module is self-contained with its own router, service, repository, and schemas. Modules can be extracted into microservices when traffic demands it.

```
HTTP Request
    ↓
Middleware Stack (CORS → JWT Auth → Rate Limit → Logging)
    ↓
Router (validates request via Pydantic schema)
    ↓
Dependency Injection (get_current_user, RequireRole)
    ↓
Service Layer (business logic + AI orchestration)
    ├── Supabase Repository (DB read/write)
    ├── Groq / Gemini AI (LLM inference)
    ├── Qdrant (vector similarity search)
    └── n8n Webhooks (workflow triggers)
    ↓
Response (Pydantic serialization → JSON)
```

### Communication Protocols

| Feature | Protocol | Reason |
|---|---|---|
| Standard REST | HTTP/JSON | Auth, jobs, profiles, admin |
| ARIA Chat | Server-Sent Events (SSE) | Streaming AI text tokens |
| ECHO Interview | WebSocket | Real-time audio + transcript bidirectional |
| Career Twin | HTTP/JSON + Background task | Compute-heavy async trigger |
| File Upload | Multipart HTTP | Resume PDF/DOCX |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18 and **npm**
- **Python** ≥ 3.12 and **pip**
- **Docker** (for Qdrant vector database)
- **Supabase** account ([supabase.com](https://supabase.com))
- **Groq** API key ([console.groq.com](https://console.groq.com))

### 1. Clone the Repository

```bash
git clone https://github.com/your-org/CareerOS_Innovik_6.0.git
cd CareerOS_Innovik_6.0
```

### 2. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv .venv
.venv\Scripts\activate        # Windows
# source .venv/bin/activate   # macOS/Linux

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env with your actual keys (Supabase, Groq, etc.)
```

#### Environment Variables (`backend/.env`)

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
JWT_SECRET_KEY=your-jwt-secret
SUPABASE_JWT_SECRET=your-supabase-jwt-secret
GOOGLE_API_KEY=your-google-gemini-api-key
GROQ_API_KEY=your-groq-api-key
N8N_WEBHOOK_URL=http://localhost:5678/webhook
N8N_API_KEY=dummy-key
WEBHOOK_SECRET=super-secret-webhook-key
```

#### Start Backend

```bash
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

The API will be live at `http://localhost:8000`. Swagger docs at `http://localhost:8000/docs`.

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start dev server
npm run dev
```

The app will be live at `http://localhost:5173`.

### 4. Qdrant Vector Database (Optional)

```bash
cd infra
docker-compose up -d
```

This starts Qdrant on ports `6333` (REST) and `6334` (gRPC).

Initialize collections:

```bash
cd backend
python scripts/init_qdrant.py
```

### 5. Database Migrations

Apply the initial schema to your Supabase project:

```bash
# Via Supabase CLI
supabase db push

# Or manually run the SQL in:
#   supabase/migrations/20260723000000_initial_schema.sql
```

---

## 📡 API Reference

**Base URL:** `http://localhost:8000/api/v1`

| Route Group | Prefix | Description |
|---|---|---|
| **Auth** | `/auth` | Login, Register, Token Refresh (Supabase Auth) |
| **Users** | `/users` | User profile management |
| **Students** | `/students` | Student profile CRUD, stats, activity |
| **Recruiters** | `/recruiters` | Recruiter profile and company operations |
| **Colleges** | `/colleges` | College admin operations |
| **Resumes** | `/resumes` | PDF upload, AI analysis, ATS scoring, JD generation, resume optimization |
| **Career Twin** | `/career_twin` | Generate/fetch digital career twin predictions |
| **Roadmaps** | `/roadmaps` | AI-generated learning paths |
| **Jobs** | `/jobs` | AI job recommendations, application tracking |
| **Mentor** | `/mentor` | ARIA AI mentor chat (conversational) |
| **Webhooks** | `/webhooks/n8n` | n8n workflow webhook endpoints |
| **Analytics** | `/analytics` | Platform-wide analytics (admin) |

### Key Endpoints

```
POST   /api/v1/auth/login              → Authenticate via Supabase
POST   /api/v1/auth/register           → Register new user with role
POST   /api/v1/resumes/analyze         → Upload PDF + get AI ATS analysis
POST   /api/v1/resumes/optimize        → AI-powered resume rewrite
POST   /api/v1/resumes/generate_jd     → Generate job description for a role
POST   /api/v1/career_twin/generate    → Generate Career Twin predictions
GET    /api/v1/career_twin/me          → Fetch latest Career Twin
POST   /api/v1/roadmaps/generate       → Generate AI learning roadmap
GET    /api/v1/roadmaps/me             → Fetch current roadmap
POST   /api/v1/jobs/recommendations    → Generate AI job matches
POST   /api/v1/mentor/chat             → Chat with ARIA AI Mentor
```

### Response Envelope

All API responses follow a consistent envelope:

```json
{
  "success": true,
  "data": { ... },
  "meta": { "page": 1, "pageSize": 20, "total": 150, "requestId": "req_abc123" },
  "error": null
}
```

---

## 🗄️ Database Schema

### Supabase PostgreSQL (12+ Tables)

```
┌─────────────────────────────────────────────────────────────┐
│                    TENANTS & USERS                           │
│  colleges · companies · users (linked to auth.users)         │
├─────────────────────────────────────────────────────────────┤
│                    DOMAIN PROFILES                            │
│  student_profiles · recruiters · college_staff               │
├─────────────────────────────────────────────────────────────┤
│                    CORE FEATURES                             │
│  jobs · applications (with AI match_score)                   │
├─────────────────────────────────────────────────────────────┤
│                    AI AGENT DATA                             │
│  career_twins · roadmaps · roadmap_steps · interviews        │
├─────────────────────────────────────────────────────────────┤
│                    CHAT SYSTEM                               │
│  chat_sessions (ARIA/ECHO) · chat_messages                   │
└─────────────────────────────────────────────────────────────┘
```

### RBAC Roles

| Role | Scope | Access |
|---|---|---|
| `student` | Own data only | Profile, resume, career twin, jobs, applications, chat |
| `recruiter` | Company data | Jobs for own company, applicant profiles, hiring analytics |
| `college_admin` | College data | Students in own college, placement analytics, department metrics |
| `super_admin` | Unrestricted | Full system access, global analytics |

### Qdrant Vector Collections

| Collection | Vectors Stored | Dimension | Used By |
|---|---|---|---|
| `student_profiles` | Resume + skills + career twin embeddings | 768 | Recruiter search, talent matching |
| `job_listings` | Job title + description embeddings | 768 | Job recommendations, semantic search |

---

## 🤖 AI Agents

CareerOS uses a **multi-agent architecture** orchestrated by **LangGraph** with three intelligence layers:

### Student Intelligence Layer

| # | Agent | Responsibilities | LLM |
|---|---|---|---|
| 1 | **Resume Intelligence Agent** | PDF parsing, ATS scoring, skill extraction, resume optimization | Groq (LLaMA 3.3 70B) |
| 2 | **Career Twin Agent** | Career prediction, salary forecasting, readiness scoring, skill gap analysis | Groq (LLaMA 3.3 70B) |
| 3 | **ARIA Mentor Agent** | Conversational AI coaching, career planning, personalized guidance | Groq (LLaMA 3.3 70B) |
| 4 | **ECHO Interview Agent** | Mock interviews, technical + communication evaluation, feedback | Groq (LLaMA 3.3 70B) |
| 5 | **Roadmap Agent** | Personalized learning plans, weekly goals, progress adaptation | Groq (LLaMA 3.3 70B) |
| 6 | **Job Match Agent** | Candidate-job matching, opportunity ranking, match scoring | Groq (LLaMA 3.3 70B) |

### College Intelligence Layer

| # | Agent | Responsibilities |
|---|---|---|
| 7 | **College Analytics Agent** | Placement analytics, employability monitoring, department performance, forecasting |

### Recruiter Intelligence Layer

| # | Agent | Responsibilities |
|---|---|---|
| 8 | **Recruiter Intelligence Agent** | Candidate ranking, talent search, hiring analytics, AI candidate summaries |

### AI Resilience: Multi-Model Fallback Chain

```
Primary: LLaMA 3.3 70B Versatile (Groq)
    ↓ (if rate-limited or unavailable)
Fallback 1: LLaMA 3.1 8B Instant (Groq)
    ↓ (if unavailable)
Fallback 2: Gemma2 9B IT (Groq)
    ↓ (if all models fail)
Retry with exponential backoff (up to 2 retries, 5s delay)
```

### n8n Workflow Integration

Every AI service routes through **n8n** first (for orchestration, logging, and analytics). If n8n is offline, the system seamlessly falls back to direct Groq LLM calls — ensuring **100% uptime** regardless of n8n availability.

---

## 📁 Project Structure

```
CareerOS_Innovik_6.0/
│
├── frontend/                               ← React + Vite + TypeScript + Tailwind v4
│   ├── src/
│   │   ├── pages/                          ← 14 page components
│   │   │   ├── HomePage.tsx                    Landing page
│   │   │   ├── AuthPage.tsx                    Login / Register
│   │   │   ├── OnboardingPage.tsx              Multi-step onboarding
│   │   │   ├── DashboardPage.tsx               Student dashboard
│   │   │   ├── CareerTwinPage.tsx              Digital Career Twin
│   │   │   ├── MentorPage.tsx                  ARIA AI Mentor chat
│   │   │   ├── ResumePage.tsx                  Resume upload + analysis
│   │   │   ├── SkillsPage.tsx                  Skills dashboard
│   │   │   ├── InterviewPage.tsx               ECHO mock interview
│   │   │   ├── JobsPage.tsx                    Job matching + applications
│   │   │   ├── ProfilePage.tsx                 User profile
│   │   │   ├── RecruiterPage.tsx               Recruiter dashboard
│   │   │   ├── CollegePage.tsx                 College admin dashboard
│   │   │   └── AdminDashboardPage.tsx          Super admin dashboard
│   │   ├── components/                     ← Shared UI components
│   │   │   ├── Layout.tsx                      App shell, navbar, sidebar
│   │   │   └── ActivityHeatmap.tsx             GitHub-style activity grid
│   │   ├── context/                        ← React context providers
│   │   │   ├── RoleContext.tsx                 Auth state + RBAC config
│   │   │   ├── JobsContext.tsx                 Jobs state management
│   │   │   └── ThemeContext.tsx                Dark/light theme
│   │   ├── api/                            ← API client layer
│   │   │   ├── client.ts                       Axios/fetch base client
│   │   │   ├── auth.ts                         Auth API calls
│   │   │   ├── students.ts                     Student API calls
│   │   │   ├── mentor.ts                       Mentor API calls
│   │   │   ├── jobs.ts                         Jobs API calls
│   │   │   ├── recruiters.ts                   Recruiter API calls
│   │   │   └── colleges.ts                     College API calls
│   │   ├── hooks/
│   │   │   └── useApi.ts                       Custom API hook
│   │   ├── App.tsx                         ← Root component + routing
│   │   ├── main.tsx                        ← Entry point
│   │   └── index.css                       ← Tailwind v4 theme + global styles
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
│
├── backend/                                ← FastAPI Modular Monolith (Python 3.12)
│   ├── app/
│   │   ├── main.py                         ← FastAPI app factory + router mounting
│   │   ├── config.py                       ← Pydantic settings
│   │   ├── dependencies.py                 ← RBAC dependencies (RequireRole)
│   │   ├── exceptions.py                   ← Custom HTTP exceptions
│   │   ├── core/                           ← Cross-cutting concerns
│   │   │   ├── security.py                     JWT verification (PyJWT)
│   │   │   ├── database.py                     Supabase connection
│   │   │   ├── middleware.py                   CORS, logging, rate limiting
│   │   │   └── events.py                       Startup/shutdown hooks
│   │   ├── middleware/
│   │   │   └── auth.py                     ← JWT Auth ASGI Middleware
│   │   ├── api/v1/                         ← API route groups
│   │   │   ├── auth/                           Authentication routes
│   │   │   ├── users/                          User management
│   │   │   ├── students/                       Student operations
│   │   │   ├── recruiters/                     Recruiter operations
│   │   │   ├── colleges/                       College admin operations
│   │   │   ├── resumes/                        Resume upload + AI analysis
│   │   │   ├── career_twin/                    Career Twin generation
│   │   │   ├── roadmaps/                       AI roadmap generation
│   │   │   ├── jobs/                           Job recommendations
│   │   │   ├── mentor/                         ARIA chat endpoints
│   │   │   ├── interviews/                     Mock interview endpoints
│   │   │   ├── analytics/                      Admin analytics
│   │   │   └── webhooks/                       n8n webhook receivers
│   │   ├── modules/                        ← Domain modules (12 domains)
│   │   │   ├── auth/    ├── students/   ├── career_twin/
│   │   │   ├── resume/  ├── mentor/     ├── interview/
│   │   │   ├── jobs/    ├── skills/     ├── recruiter/
│   │   │   ├── college/ ├── admin/      └── notifications/
│   │   ├── services/                       ← Business logic + external integrations
│   │   │   ├── ai/
│   │   │   │   ├── gemini.py                   Groq LLM client (multi-model fallback)
│   │   │   │   ├── langgraph_orchestrator.py   LangGraph state graphs
│   │   │   │   └── prompts/                    System prompts per agent
│   │   │   ├── career_twin.py                  Career Twin generation service
│   │   │   ├── resume_ai.py                    Resume analysis + optimization
│   │   │   ├── roadmaps.py                     Roadmap generation service
│   │   │   ├── jobs.py                         Job recommendation service
│   │   │   ├── profiles.py                     Profile management service
│   │   │   ├── auth.py                         Auth service
│   │   │   ├── n8n_client.py                   n8n webhook client (with fallback)
│   │   │   ├── pdf_compiler.py                 Resume PDF compilation
│   │   │   ├── vector/                         Qdrant vector operations
│   │   │   ├── storage/                        Supabase storage client
│   │   │   ├── voice/                          ElevenLabs TTS/STT
│   │   │   └── email/                          Email service (Resend)
│   │   ├── schemas/                        ← Pydantic request/response models
│   │   └── utils/                          ← Helper utilities
│   ├── migrations/                         ← SQL migration files
│   │   ├── 001_initial_schema.sql
│   │   └── 002_agent_tasks.sql
│   ├── scripts/
│   │   ├── init_qdrant.py                  ← Initialize Qdrant vector collections
│   │   ├── inject_batching.py
│   │   └── refactor_n8n.py
│   ├── tests/                              ← API test suite
│   ├── requirements.txt
│   ├── Dockerfile                          ← Production container
│   └── Dockerfile.dev                      ← Development container
│
├── infra/                                  ← Infrastructure & Deployment
│   ├── docker-compose.yml                  ← Qdrant vector DB container
│   ├── docker/
│   │   ├── docker-compose.yml                  Full local dev stack
│   │   ├── docker-compose.prod.yml             Production overrides
│   │   └── nginx/                              Reverse proxy config
│   ├── k8s/                                ← Kubernetes manifests (future)
│   │   ├── deployments/
│   │   ├── services/
│   │   └── ingress/
│   ├── n8n/workflows/                      ← n8n workflow definitions
│   └── terraform/                          ← IaC (future)
│       ├── main.tf
│       └── variables.tf
│
├── supabase/                               ← Supabase Configuration
│   └── migrations/
│       └── 20260723000000_initial_schema.sql   Full schema + RLS + indexes
│
├── docs/                                   ← Documentation
│   ├── architecture.md                         Full system architecture
│   ├── auth_architecture.md                    Auth flow + RBAC + RLS details
│   ├── database_schema.md                      ER diagram + SQL + indexing strategy
│   ├── context.md                              Product vision & stakeholder context
│   └── adr/                                    Architecture Decision Records
│
├── .github/workflows/                      ← CI/CD
│   └── ci-backend.yml                          Backend CI pipeline
│
├── .gitignore
└── README.md                               ← You are here
```

---

## 🔒 Authentication & Security

### Auth Flow

```
User → React Frontend → Supabase Auth (OAuth / Email)
    → JWT Access Token returned
    → Frontend sends Authorization: Bearer <JWT> to FastAPI
    → JWT Middleware decodes token using Supabase JWT Secret
    → Route-level RequireRole dependency enforces RBAC
    → Row Level Security (RLS) enforces data isolation at DB kernel level
```

### Security Layers

| Layer | Technology | Purpose |
|---|---|---|
| Identity Provider | Supabase Auth | Google OAuth + Email/Password authentication |
| Token Verification | PyJWT + ASGI Middleware | Decode + validate JWT on every request |
| Route Protection | FastAPI Dependencies | `RequireRole("student")`, `RequireRole("recruiter")`, etc. |
| Data Isolation | PostgreSQL RLS | Kernel-level row filtering — physically prevents cross-tenant access |

---

## 🚢 Deployment Architecture

```
Internet
    │
┌───▼─────────────────────────────┐
│   Cloudflare (DNS + CDN + WAF)  │
└───┬─────────────────────────────┘
    │
    ├──→ Vercel (React Frontend — Edge CDN)
    │
    └──→ Google Cloud Run (FastAPI Backend — Auto-scaling Serverless)
              │                    │
              ▼                    ▼
         Supabase Cloud       Qdrant Cloud
         (PostgreSQL + Auth)  (Vector DB)
```

### CI/CD Pipeline (GitHub Actions)

```
Push to main → Lint Frontend → PyTest Backend → Deploy Frontend to Vercel → Build & Deploy API to Cloud Run
```

---

## 📜 Available Scripts

### Frontend

| Command | Description |
|---|---|
| `npm run dev` | Start Vite dev server on `localhost:5173` |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |
| `npm run format` | Format code with oxfmt |

### Backend

| Command | Description |
|---|---|
| `python -m uvicorn app.main:app --reload` | Start FastAPI dev server on `localhost:8000` |
| `python scripts/init_qdrant.py` | Initialize Qdrant vector collections |
| `docker-compose -f infra/docker-compose.yml up -d` | Start Qdrant container |

---

## 🗺️ Roadmap

- [x] Frontend — 14 pages with full role-based UI
- [x] Backend — FastAPI modular monolith with 13 API route groups
- [x] Auth — Supabase Auth + JWT Middleware + RBAC
- [x] Database — PostgreSQL schema + RLS + indexing
- [x] AI — Groq multi-model LLM with fallback chain
- [x] Resume Intelligence — PDF parsing + ATS analysis + optimization
- [x] Career Twin — AI-generated career predictions
- [x] ARIA Mentor — Conversational AI coaching
- [x] Roadmap Engine — AI learning paths
- [x] Job Matching — AI-powered recommendations
- [x] n8n Integration — Workflow automation with fallback
- [ ] ECHO Interview — Full WebSocket real-time implementation
- [ ] Qdrant semantic search — Production vector pipelines
- [ ] ElevenLabs voice — TTS/STT for interview agent
- [ ] College & Recruiter dashboards — Live data integration
- [ ] Kubernetes deployment — Production orchestration
- [ ] Terraform IaC — Infrastructure as code

---

## 👥 Team Jee Jee Brats

Built with ❤️ for **Innovate 6.0 Hackathon**

