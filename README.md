# Distributed Online Judge

A LeetCode-style competitive programming platform where users can browse algorithmic problems, submit code in multiple languages, and get automated, sandboxed judging — built end-to-end with a queue-based execution pipeline.

## Features

- **Multi-language code execution** — C++, C, Python, and Java submissions are compiled and run inside isolated Docker containers (`gcc:13`, `python:3.12`, `eclipse-temurin:21`), keeping untrusted user code off the host machine
- **Asynchronous judging pipeline** — submissions are pushed to a Redis-backed BullMQ queue and processed by a dedicated worker, so grading doesn't block the API
- **JWT authentication** with role-based access control (`authMiddleware`, `adminMiddleware`) protecting write operations
- **Full CRUD for Problems, Test Cases, and Submissions**, with admin-only routes for creating/updating/deleting problems and test cases
- **Admin dashboard** — separate views for managing problems, users, and submissions (`AdminDashboard`, `AdminProblems`, `AdminUsers`, `AdminSubmissions`)
- **In-browser code editor** using Monaco (the engine behind VS Code) for a real IDE-like submission experience
- **Normalized PostgreSQL schema** for users, problems, test cases, and submissions

## Tech Stack

| Layer | Technologies |
|---|---|
| Frontend | React 19, Vite, React Router, Axios, Monaco Editor, Tailwind CSS |
| Backend | Node.js, Express 5, JWT, bcrypt |
| Database | PostgreSQL |
| Queue / Cache | BullMQ, Redis (ioredis) |
| Sandboxing | Docker (per-language compile & run images) |

## Architecture

```
Client (React + Monaco)
        │
        ▼
Express REST API ── PostgreSQL (problems, users, submissions, test cases)
        │
        ▼
BullMQ Queue (Redis)
        │
        ▼
Judge Worker ── Docker containers (per-language compile + execute + compare output)
        │
        ▼
Submission verdict written back to PostgreSQL
```

**Flow:** a submission is saved to Postgres → a job is queued in BullMQ → a worker pulls the job, spins up the correct Docker image for the submitted language, compiles (if needed), runs it against the problem's test cases, and writes the verdict back.

## Project Structure

```
backend/
  src/
    controllers/   # request handlers (auth, problems, submissions, test cases, users, execute)
    services/       # compilerService, executionService, judgeService, fileService
    models/         # DB access layer (Postgres queries)
    routes/         # Express route definitions
    middleware/     # auth + admin guards
    docker/         # per-language image/compile/run config
    queues/         # BullMQ queue setup
    workers/        # judgeWorker — consumes the queue and runs submissions
frontend/
  src/
    pages/          # Home, Problems, ProblemDetails, Submissions, Profile, Admin/*
    components/     # layout + shared/protected-route components
    services/       # API client wrappers (axios)
    stores/         # AuthContext
```

## Current Status

Actively in development. Working:
- Auth, problem/test case/submission CRUD, admin panel routes
- Docker-based multi-language execution for C++, C, Python, Java
- BullMQ/Redis async judge queue with a dedicated worker

In progress:
- Hardening container sandboxing (resource/time limits, network isolation)
- Load-testing the queue under concurrent submissions
- Expanding the problem bank

## Running Locally

```bash
# Backend
cd backend
npm install
# set up .env with DATABASE_URL, JWT_SECRET, REDIS connection details
npm run dev

# Frontend
cd frontend
npm install
npm run dev
```

Requires PostgreSQL, Redis, and Docker running locally.
