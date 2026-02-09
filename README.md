# CureNet

Full-stack healthcare web app (Phase 1: Auth, Login, Register, ProtectedRoute, Layout).

## Prerequisites

- Node.js 18+
- MySQL 8+ (running locally or remote)

## Backend

```bash
cd backend
cp .env.example .env
# Edit .env: set DB_NAME, DB_USER, DB_PASSWORD, JWT_SECRET
npm install
npm run dev
```

API runs at `http://localhost:5000`. Health: `GET http://localhost:5000/api/health`.

Auth endpoints (base `/api/auth`):

- `POST /register` – register (body: email, password, firstName, lastName, role, …)
- `POST /login` – login (body: email or phone, password)
- `GET /profile` – get profile (Bearer token)
- `PUT /profile` – update profile (Bearer token)
- `POST /forgot-password` – body: { email }
- `GET /verify-reset-token?token=...`
- `POST /reset-password` – body: { token, password }

## Frontend

```bash
cd frontend
cp .env.example .env
# Optional: set VITE_API_URL if API is not at http://localhost:5000/api
npm install
npm run dev
```

App runs at `http://localhost:5173`.

- **Public:** `/` (landing), `/login`, `/register`
- **Protected:** `/app` (redirects by role to dashboard), `/app/dashboard`, `/app/doctor-dashboard`, `/app/admin-dashboard`, etc. (placeholder content until later phases)

## Phase 1 implemented

- Backend: Express, Sequelize (User, Doctor, Patient, PasswordResetToken), JWT auth, auth routes
- Frontend: AuthContext (login, register, logout, axios base URL + Bearer), Login, Register, ProtectedRoute, Layout, RoleBasedRedirect, Landing, placeholders for app routes
