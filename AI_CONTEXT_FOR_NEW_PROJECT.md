# Context for AI – New Project (Copy this to your project)

**Use this file in your new project.** Put it in the project root, then in a new chat say:  
`Read @AI_CONTEXT_FOR_NEW_PROJECT.md and keep this context for the rest of our conversation.`

---

## 1. What this project is

- This codebase is **my version** of a full‑stack healthcare web app (same assignment as a peer’s project; I have differentiated it).
- It is **not** the original repo: I have rebranded, renamed features, and may add/remove functionality.
- When I ask to “add X” or “bring X from the reference,” I mean: implement it **here** in this project, following this stack and structure. Do **not** assume I have another project open; work only in **this** workspace.

---

## 2. Tech stack

- **Frontend:** React (TypeScript), React Router, Tailwind CSS, Axios, React Query (TanStack Query), React Hook Form, Heroicons, Recharts (for charts).
- **Backend:** Node.js, Express.
- **Database:** MySQL (Sequelize ORM).
- **Auth:** JWT in `Authorization: Bearer <token>`, token stored in `localStorage` as `'token'`.
- **API base URL:** `process.env.REACT_APP_API_URL` or `http://localhost:5000/api`. Axios base URL is set in auth context.

---

## 3. Project structure (high level)

```
frontend/                 # React frontend
  src/
    context/            # AuthContext, NotificationContext
    pages/              # Route components (Login, Dashboard, Appointments, etc.)
    components/         # Shared (Layout, ProtectedRoute, modals, etc.)
    utils/              # departments, helpers
    services/           # API-related helpers (e.g. paymentService)
backend/                 # Express backend
  routes/               # auth, appointments, doctors, patients, admin, lab-tests, etc.
  controllers/
  models/               # Sequelize models
  middleware/           # auth (authenticateToken, authorizeRoles)
```

- **Roles:** `patient`, `doctor`, `admin`. Routes and API often branch on `user.role`.
- **Protected routes:** Wrapped with `ProtectedRoute`; some routes require a specific role (`requiredRole="patient"` etc.).
- **API responses:** Usually `{ success, message?, data }`. List endpoints often return `data: { items, pagination }` or `data: { appointments }` etc.

---

## 4. Important patterns

- **Auth:** `useAuth()` from `context/AuthContext` gives `{ user, token, login, register, logout }`. User has `id, email, firstName, lastName, role, ...`.
- **API calls:** Use Axios (base URL already set). Attach token via interceptor. Use React Query for GETs when we want caching/refetch (e.g. `useQuery` with `queryKey` and `queryFn`).
- **Forms:** React Hook Form with `register`, `handleSubmit`, `formState: { errors }`.
- **Styling:** Tailwind; gradient headers and cards are common (e.g. `bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600`).
- **Naming:** App name and role names may be customized (e.g. “HealthCare Pro” → “CureNet”,) 

---

## 5. API endpoints I might use (reference)

- Auth: `POST /auth/login`, `POST /auth/register`, `GET /auth/profile`, `PUT /auth/profile`, `POST /auth/forgot-password`, `GET /auth/verify-reset-token`, `POST /auth/reset-password`.
- Appointments: `GET/POST /appointments`, `GET /appointments/:id`, `PUT /appointments/:id/approve`, `PUT /appointments/:id/cancel`, etc.
- Patients: `GET /patients/profile`, `PUT /patients/profile`, `GET /patients/:id/dashboard/stats`, `GET /patients/:id/appointments`, `GET /patients/:id/medical-records`.
- Doctors: `GET /doctors`, `GET /doctors/profile`, `PUT /doctors/profile`, `POST /doctors/upload-image`, `GET /doctors/:id/dashboard/stats`, `GET /doctors/:id/appointments`.
- Prescriptions: `GET /prescriptions/appointment/:appointmentId`, `POST /prescriptions`.
- Lab: `GET /lab-tests/tests`, `GET /lab-tests/orders`, `POST /lab-tests/orders`.
- Admin: `GET /admin/stats`, `GET /admin/analytics/appointments`, `GET /admin/doctors`, `GET /admin/patients`, etc.
- Notifications: `GET /notifications`, `PUT /notifications/:id/read`.
- Ratings: `GET /ratings/doctor/:id`, `GET /ratings/my-ratings`, `POST /ratings`.

When I ask to “add a page that does X,” use these patterns and endpoints unless I specify otherwise. If my backend differs, I’ll say so.

---

## 6. How to help me

- **Implement in this project only:** All code you write or change should be in **this** workspace. Don’t assume I have the “other” project open.
- **Follow existing style:** Same stack (React, TypeScript, Tailwind, Axios, React Query, React Hook Form). Same response shape `{ success, data }` and same auth (JWT, useAuth).
- **When I say “add feature X”:** Implement it end-to-end (frontend + backend if needed). Use existing routes/models where possible; create new ones only when necessary.
- **When I say “same as the reference” or “like the Healthcare app”:** Use the patterns above (roles, API shape, auth, structure). If I paste a snippet from elsewhere, adapt it to this project’s structure and env.
- **When I say “rebrand” or “rename”:** Prefer a single config or constants file for app name and role labels so we can change in one place.
- **Errors:** Prefer clear toast/UI messages; use existing error handling (e.g. axios interceptors, try/catch with toast).

---

## 7. My customizations (edit this section in your copy)

- **App name:** _______________ (e.g. “DentalCare”)
- **Role names:** _______________ (e.g. Doctor → Dentist, Patient → Client)
- **Features I added:** _______________
- **Features I removed/simplified:** _______________
- **Backend URL / env:** Same as above unless I say otherwise.

---

*End of context. Use this file so the AI in the new project understands the stack, structure, and how to implement or adapt features here.*
