# Minimalist Math for Kids

A React + TypeScript learning app with a minimal Express backend and MongoDB persistence for player progress.

## Features

- Frontend game modes: arithmetic, counting, and scenarios
- Player profile form in UI
- Score sync to backend with `useEffect`
- MongoDB-backed progress API

## Tech Stack

- Frontend: React, TypeScript, Vite
- Backend: Node.js, Express, Mongoose, MongoDB

## Environment Setup

### Frontend (`.env.local`)

```bash
GEMINI_API_KEY=PLACEHOLDER_API_KEY
VITE_API_BASE_URL=http://localhost:5000
```

### Backend (`server/.env`)

Copy `server/.env.example` to `server/.env` and set values:

```bash
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/minimalist-math
```

## Install

```bash
npm install
npm --prefix server install
```

## Run

Use two terminals:

1. Frontend:

```bash
npm run dev
```

2. Backend:

```bash
npm run server
```

## API Endpoints

- `GET /api/health`
- `GET /api/progress/:playerName`
- `POST /api/progress`
- `GET /api/leaderboard`
