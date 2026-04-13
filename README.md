# ZenVedFoundation LMS — AI Readiness Program

A full-stack Learning Management System built for the **AI Readiness Program**, a 10-session bridge course designed for Class XII students transitioning to undergraduate engineering.

## Program Overview

The AI Readiness Program teaches students to become AI-native operators — not just casual ChatGPT users. Across 5 phases and 10 hands-on sessions (2 hours each), students build a complete AI workspace, knowledge system, research workflow, real software, and a public portfolio.

### Phases & Lectures

| Phase | Title | Lectures | Pillar |
|-------|-------|----------|--------|
| 1 | **Ground Zero** | L1 — AI-Native Mindset, L2 — MCP & Connections, L3 — Agentic Workflows | Workspace |
| 2 | **Knowledge Architecture** | L4 — Second Brain (PARA), L5 — Atomic Notes & NotebookLM | Knowledge Management |
| 3 | **Research & Synthesis** | L6 — AI-Powered Research, L7 — Present & Archive | Deep Research |
| 4 | **Building with AI** | L8 — Cursor & Kiro, L9 — Google AI Studio & APIs | AI-Assisted Building |
| 5 | **Public Presence** | L10 — Portfolio, GitHub & Digital Identity | Public Portfolio |

### Tools Students Use

Claude, Gemini, Perplexity, Zapier, n8n, Notion, Obsidian, NotebookLM, Otter.ai, Excalidraw, Semantic Scholar, Elicit, Connected Papers, Zotero, Gamma AI, GitHub, Cursor, Kiro, Google AI Studio, Replit, v0.dev, Vercel, LinkedIn, dev.to

---

## Tech Stack

### Backend
- **Java 17** + **Spring Boot 3.2**
- Spring Security + Google OAuth2 + JWT authentication
- H2 (dev) / PostgreSQL (prod)
- Razorpay payment integration
- PDFBox certificate generation
- Role-based access: `STUDENT`, `INSTRUCTOR`, `ADMIN`

### Frontend
- **React 18** + **Vite 4** + **Tailwind CSS 3**
- Dark theme with amber accent (#F59E0B)
- Syne + DM Sans typography
- Google OAuth + demo login bypass
- Responsive design

### Deployment
- **Backend:** Railway
- **Frontend:** Vercel (with API proxy rewrites)

---

## Quick Start (Local Development)

### Prerequisites
- Java 17+
- Node.js 16+
- Maven

### Backend
```bash
cd backend
mvn spring-boot:run
# Runs on http://localhost:8080
```

### Frontend
```bash
cd frontend
npm install
npm run dev
# Runs on http://localhost:3000
```

---

## Demo Login

Google OAuth is the primary auth method. For quick testing, use the demo bypass:

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@zenved.com` | `admin` |
| Instructor | `instructor@zenved.com` | `instructor` |
| Student | `student@zenved.com` | `student` |

Demo users are auto-seeded on backend startup via `DataSeeder.java`.

---

## Project Structure

```
lms-project/
  backend/
    src/main/java/com/lms/
      auth/         # OAuth2, JWT, demo login
      config/       # Security, CORS, DataSeeder
      course/       # Course & Lesson CRUD
      enrollment/   # Enrollment & progress tracking
      quiz/         # Quizzes & assessments
      session/      # Live sessions
      payment/      # Razorpay integration
      certificate/  # PDF certificate generation
      dashboard/    # Analytics endpoints
      user/         # User management
  frontend/
    src/
      api/          # Axios API layer
      components/   # Navbar, CourseCard, StatsCard, etc.
      context/      # AuthContext (Google + demo login)
      data/         # constants.js (AI Readiness Program data)
      pages/        # Dashboard, Login, CourseDetail, Admin, etc.
  vercel.json       # Vercel deployment config
```

---

## API Endpoints

- `POST /api/auth/google` — Google OAuth login
- `POST /api/auth/demo-login` — Demo bypass login
- `GET /api/courses` — List courses
- `POST /api/enrollments` — Enroll in course
- `GET /api/dashboard/stats` — Dashboard analytics
- `POST /api/quizzes/{id}/attempt` — Submit quiz
- `GET /api/certificates/{id}` — Download certificate PDF

See `backend/README.md` for full endpoint documentation.

---

## Environment Variables

### Backend (`application.yml`)
- `SPRING_DATASOURCE_URL` — PostgreSQL connection string
- `JWT_SECRET` — JWT signing key
- `CORS_ALLOWED_ORIGINS` — Frontend URL(s)
- `RAZORPAY_KEY_ID` / `RAZORPAY_KEY_SECRET`

### Frontend (`.env`)
- `VITE_API_BASE_URL` — Backend API URL (defaults to `/api`)
- `VITE_GOOGLE_CLIENT_ID` — Google OAuth client ID

---

## License

This project is part of ZenVedFoundation's educational initiative.
