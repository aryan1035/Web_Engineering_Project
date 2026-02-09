# Implementation Plan – Page by Page

This document describes the whole project as an implementation plan: route, file, access, purpose, UI blocks, API dependencies, and implementation notes for each page. Use it to build the app from scratch or to port/rebrand it.

**Out of scope (not implemented):** All lab-report and lab-test features — patient Lab Reports (§4.5), Admin Lab Reports (§6.5), Admin Lab Tests (§6.6), and any backend `lab-tests`/orders/reports APIs. Medical Records, Patients (doctor), and Admin Ratings remain in scope when their phases are implemented.

---

## 1. Overview

### 1.1 App structure

- **Public:** Landing, Login, Register, Forgot Password, Reset Password, 404.
- **Protected (under `/app`):** Layout with sidebar/header; index redirects by role.
- **Patient:** Dashboard, Profile, Appointments, Medical Records, Lab Reports, Find Doctors.
- **Doctor:** Doctor Dashboard, Doctor Profile, Doctor Appointments, Patients list.
- **Admin:** Admin Dashboard, Users, Admin Doctors, Admin Patients, Admin Lab Reports, Admin Lab Tests, Admin Ratings.

### 1.2 Suggested implementation order

| Phase | What to build | Why first |
|-------|----------------|-----------|
| **1** | Auth (backend + context), Login, Register, ProtectedRoute, Layout | Everything else needs auth and layout. |
| **2** | Landing, ForgotPassword, ResetPassword, NotFound | Complete public flow. |
| **3** | RoleBasedRedirect, Dashboard (all roles), Patient Profile, Doctor Profile | Entry points and core profiles. |
| **4** | Doctors list, Appointments (patient), Doctor Appointments | Core booking flow. |
| **5** | Medical Records, Lab Reports, Patients (doctor) | Supporting patient/doctor features. |
| **6** | Admin Dashboard, Users, Admin Doctors, Admin Patients | Admin basics. |
| **7** | Admin Lab Reports, Admin Lab Tests, Admin Ratings | Admin lab and ratings. |
| **8** | Shared components (PrescriptionView, RatingModal, MedicineTracker, Notifications) | Used by multiple pages. |

---

## 2. Global / shared (not pages)

| Item | Location | Purpose |
|------|----------|---------|
| **Auth** | `context/AuthContext.tsx` | Login, register, logout, `user`, `token`, `updateProfile`. Axios base URL + Bearer. |
| **Notifications** | `context/NotificationContext.tsx` | Fetch notifications, mark read; optional WebSocket. |
| **Routing** | `App.tsx` | Router, QueryClient, AuthProvider, routes, Toaster. |
| **Layout** | `components/Layout.tsx` | Sidebar + outlet; nav links by role. |
| **ProtectedRoute** | `components/ProtectedRoute.tsx` | Redirect to login if no token; optional `requiredRole`. |
| **RoleBasedRedirect** | `components/RoleBasedRedirect.tsx` | `/app` → `/app/dashboard` (patient) or `/app/doctor-dashboard` or `/app/admin-dashboard` by role. |
| **Constants** | `utils/departments.ts` | `MEDICAL_DEPARTMENTS`, `getDepartmentLabel`. |

**Backend (needed before pages):**  
`POST /auth/login`, `POST /auth/register`, `GET /auth/profile`, `PUT /auth/profile`, `POST /auth/forgot-password`, `GET /auth/verify-reset-token`, `POST /auth/reset-password`.

---

## 3. Public pages

### 3.1 Landing Page

| Field | Detail |
|-------|--------|
| **Route** | `/` |
| **File** | `pages/LandingPage.tsx` |
| **Access** | Public |
| **Purpose** | Marketing home: hero, features, stats, testimonials, about, contact, CTA to login/register. |
| **UI blocks** | Nav (logo, links, Sign In, Get Started); Hero (title, CTA, trust badges); Stats (animated counters); Features (6 cards); Testimonials (carousel); About; Contact (phone, email, address); Footer; CTA section. |
| **API** | None. All copy and numbers are static. |
| **Implement** | Static content; optional config for app name and tagline. Smooth scroll to sections. |

---

### 3.2 Login

| Field | Detail |
|-------|--------|
| **Route** | `/login` |
| **File** | `pages/Login.tsx` |
| **Access** | Public |
| **Purpose** | Authenticate user; store token and user; redirect to `/app` or `from` state. |
| **UI blocks** | Header (logo, Back to Home); Form card (email/phone, password, show/hide, remember me, Forgot password link, Sign In); Right panel (feature bullets). |
| **API** | `POST /auth/login` — body `{ email, password }` or `{ phone, password }`; response `{ user, token }`. |
| **Implement** | react-hook-form; validate email or phone; min password length; call `login()` from AuthContext; toast on error; redirect on success. |

---

### 3.3 Register

| Field | Detail |
|-------|--------|
| **Route** | `/register` |
| **File** | `pages/Register.tsx` |
| **Access** | Public |
| **Purpose** | Create account (patient/doctor/admin); redirect to login. |
| **UI blocks** | Header; Role selector (Patient / Doctor / Admin); Form: name, email, password, confirm, phone, DOB, gender, address; if Doctor: BMDC number, department, experience; Submit; Right panel. |
| **API** | `POST /auth/register` — body includes role and doctor fields when role is doctor; response `{ user, token }`. |
| **Implement** | Role state; conditional doctor fields; department dropdown from `MEDICAL_DEPARTMENTS`; confirm password match; then `register()` and redirect to `/login`. |

---

### 3.4 Forgot Password

| Field | Detail |
|-------|--------|
| **Route** | `/forgot-password` |
| **File** | `pages/ForgotPassword.tsx` |
| **Access** | Public |
| **Purpose** | Request password reset email. |
| **UI blocks** | Header; Form (email, Submit); Success state (message + Back to sign in). |
| **API** | `POST /auth/forgot-password` — body `{ email }`. |
| **Implement** | Single email field; on success show confirmation and option to try again or go to login. |

---

### 3.5 Reset Password

| Field | Detail |
|-------|--------|
| **Route** | `/reset-password` (expects `?token=...`) |
| **File** | `pages/ResetPassword.tsx` |
| **Access** | Public |
| **Purpose** | Set new password using token from email link. |
| **UI blocks** | Header; Loading (verifying token); Invalid token state (message + links); Form (new password, confirm, show/hide, Submit). |
| **API** | `GET /auth/verify-reset-token?token=...`; `POST /auth/reset-password` — body `{ token, password }`. |
| **Implement** | Read token from query; verify on mount; if invalid show message and link to forgot-password; password rules (length, complexity) and confirm match; then POST and redirect to login. |

---

### 3.6 Not Found

| Field | Detail |
|-------|--------|
| **Route** | `*` (catch-all) |
| **File** | `pages/NotFound.tsx` |
| **Access** | Public |
| **Purpose** | 404 page. |
| **UI blocks** | Message, link to home (or login). |
| **API** | None. |
| **Implement** | Static; optional app name from config. |

---

## 4. Protected pages – Patient

### 4.1 Dashboard (patient view)

| Field | Detail |
|-------|--------|
| **Route** | `/app/dashboard` |
| **File** | `pages/Dashboard.tsx` |
| **Access** | Patient (same file used for doctor/admin with different data). |
| **Purpose** | Home after login: stats, recent appointments, quick actions, (patient) medicine tracker. |
| **UI blocks** | Welcome header; 4–5 stat cards (total/today/completed/pending appointments; doctor/admin also total patients); Recent appointments (list, 5 items); Quick actions (links); Patient-only: MedicineMatrix. |
| **API** | Patient: `GET /patients/profile` → then `GET /patients/:id/dashboard/stats`, `GET /patients/:id/appointments?limit=5&sortBy=appointmentDate&sortOrder=DESC`. Doctor: `GET /doctors/profile` → then `GET /doctors/:id/dashboard/stats`, `GET /doctors/:id/appointments?date=today`. Admin: `GET /admin/stats`, `GET /appointments?limit=5&...`. |
| **Implement** | useAuth().role; useQuery per role for stats and appointments; stat cards and list from response; quick action buttons by role; MedicineMatrix only when role is patient and patient id exists. |

---

### 4.2 Patient Profile

| Field | Detail |
|-------|--------|
| **Route** | `/app/profile` |
| **File** | `pages/PatientProfile.tsx` |
| **Access** | Patient only |
| **Purpose** | View/edit personal info and medical info (blood type, allergies, emergency contact, insurance). |
| **UI blocks** | Page header; Personal info card (name, email read-only, phone, DOB, gender, address; Edit/Save); Medical info card (blood type, allergies with search/add, emergency name/phone, insurance provider/number; Edit/Save). |
| **API** | `GET /patients/profile` (mount); `PUT /auth/profile` (personal); `PUT /patients/profile` (medical; allergies as comma-separated string). |
| **Implement** | Two forms; allergy UI: selected tags + searchable list + custom input; load profile once; separate submit handlers for personal vs medical. |

---

### 4.3 Appointments (patient)

| Field | Detail |
|-------|--------|
| **Route** | `/app/appointments` |
| **File** | `pages/Appointments.tsx` |
| **Access** | Patient only |
| **Purpose** | List my appointments; filter; book new; view prescription; rate; cancel. |
| **UI blocks** | Page header; Filters (status, type, doctor); “Book appointment” button; List (cards: doctor, date/time, status, type, actions); Booking modal (doctor, date, time block, type, reason, symptoms); Prescription modal; Rating modal; optional Video modal. |
| **API** | `GET /appointments` (list); `GET /doctors` (for booking + filters); `POST /appointments` (create); `GET /prescriptions/appointment/:id`; `POST /ratings`; `GET /ratings/my-ratings`; `PUT /appointments/:id/cancel`. |
| **Implement** | useQuery for appointments and my-ratings; filter/sort in frontend or via params; booking: get patient id from profile, then POST; time blocks from selected doctor’s chamberTimes; PrescriptionView and RatingModal as shared components. |

---

### 4.4 Medical Records

| Field | Detail |
|-------|--------|
| **Route** | `/app/medical-records` |
| **File** | `pages/MedicalRecords.tsx` |
| **Access** | Patient only |
| **Purpose** | List and view medical records; optional PDF download. |
| **UI blocks** | Page header; Filters (date, type, doctor); Records list (cards or table); Detail view or modal; Download PDF button. |
| **API** | `GET /patients/:patientId/medical-records`; `GET /medical-records/:id`; `GET /medical-records/:id/pdf` (download). |
| **Implement** | Resolve patientId from profile; list with filters; detail view from single-record endpoint; link or fetch for PDF. |

---

### 4.5 Lab Reports

| Field | Detail |
|-------|--------|
| **Route** | `/app/lab-reports` |
| **File** | `pages/LabReports.tsx` |
| **Access** | Patient only |
| **Purpose** | List lab orders; view/download reports; order new tests. |
| **UI blocks** | Page header; “Order tests” button; Orders list (status, tests, payment, report link); Order modal (select tests, payment method); Report view/download. |
| **API** | `GET /lab-tests/orders`; `GET /lab-tests/tests`; `POST /lab-tests/orders` (testIds, paymentMethod, amount); report URL or `GET .../orders/:id/report`. |
| **Implement** | List orders; catalog of tests for ordering; payment method selection; show report when ready. |

---

### 4.6 Doctors (find doctors)

| Field | Detail |
|-------|--------|
| **Route** | `/app/doctors` |
| **File** | `pages/Doctors.tsx` |
| **Access** | Patient only |
| **Purpose** | Browse doctors; filter by department; view profile; start booking. |
| **UI blocks** | Page header; Department filter; Grid of doctor cards (photo, name, department, rating, fee, chamber times); Profile modal; “Book” → navigate to appointments with doctor pre-selected or open booking modal. |
| **API** | `GET /doctors?department=...`; `GET /ratings/doctor/:id` (for rating display). |
| **Implement** | useQuery with department param; cards from response; modal with full profile; book action links to appointments or opens shared booking flow. |

---

## 5. Protected pages – Doctor

### 5.1 Doctor Dashboard

| Field | Detail |
|-------|--------|
| **Route** | `/app/doctor-dashboard` |
| **File** | `pages/DoctorDashboard.tsx` |
| **Access** | Doctor only |
| **Purpose** | Doctor home: stats, today’s schedule, quick actions, pending requests alert. |
| **UI blocks** | Welcome header (with rating summary); 6 stat cards (today, pending, in progress, completed today, total patients, total appointments); Today’s schedule (list, up to 5); Quick actions (Manage appointments, Patient history, Update profile); Banner if pending requests > 0. |
| **API** | `GET /doctors/profile` → then `GET /doctors/:id/dashboard/stats`, `GET /doctors/:id/appointments?date=today`, `GET /ratings/doctor/:id`. |
| **Implement** | useQuery for profile then stats and today’s appointments; rating in header; links to doctor-appointments and patients and doctor-profile. |

---

### 5.2 Doctor Profile

| Field | Detail |
|-------|--------|
| **Route** | `/app/doctor-profile` |
| **File** | `pages/DoctorProfile.tsx` |
| **Access** | Doctor only |
| **Purpose** | View/edit professional profile: image, department, experience, education, certifications, hospital, fee, location, bio, chamber times, degrees, awards, languages, services. |
| **UI blocks** | Page header + Edit toggle; Profile image (upload); Basic info (BMDC read-only, department, experience, education, certifications, hospital, fee, location, bio); Chamber times (day × time checkboxes); Lists with add/remove: degrees, awards, languages, services; Save/Cancel. |
| **API** | `GET /doctors/profile` (mount); `PUT /doctors/profile` (full profile); `POST /doctors/upload-image` (FormData profileImage). |
| **Implement** | Single load; edit mode toggles form vs view; chamber times as nested state; array fields with local add/remove then send in PUT; image upload separate POST then refresh or update local state. |

---

### 5.3 Doctor Appointments

| Field | Detail |
|-------|--------|
| **Route** | `/app/doctor-appointments` |
| **File** | `pages/DoctorAppointments.tsx` |
| **Access** | Doctor only |
| **Purpose** | List appointments; filter; approve/reject requested; start/complete; write prescription. |
| **UI blocks** | Page header; Filters (status, date); List (patient, date/time, status, serial, reason); Actions: Approve, Reject, Start, Complete; Prescription form/modal (medicines, symptoms, diagnosis, etc.). |
| **API** | `GET /doctors/:id/appointments` (params: status, date, page, limit); `PUT /appointments/:id/approve`, `.../reject`, `.../start`, `.../complete`; `POST /prescriptions`. |
| **Implement** | useQuery with doctor id from profile; filters as query params; action buttons call PUT then invalidate list; prescription modal submits POST /prescriptions. |

---

### 5.4 Patients (doctor’s patient list)

| Field | Detail |
|-------|--------|
| **Route** | `/app/patients` |
| **File** | `pages/Patients.tsx` |
| **Access** | Doctor only |
| **Purpose** | List doctor’s patients; view profile and medical history. |
| **UI blocks** | Page header; Search/filter; Patient list (name, contact); Patient detail/modal (profile, medical records). |
| **API** | `GET /doctors/:id/patients`; `GET /patients/:id`; `GET /patients/:id/medical-records`. |
| **Implement** | useQuery for patients by doctor id; search optional; detail view from patient and medical-records endpoints. |

---

## 6. Protected pages – Admin

### 6.1 Admin Dashboard

| Field | Detail |
|-------|--------|
| **Route** | `/app/admin-dashboard` |
| **File** | `pages/AdminDashboard.tsx` |
| **Access** | Admin only |
| **Purpose** | System overview: counts, appointment analytics, doctor verification. |
| **UI blocks** | Page header; Stat cards (users, doctors, patients, appointments); Charts (status distribution, type distribution, daily trend); Doctor verification list (pending); Links to users, doctors, etc. |
| **API** | `GET /admin/stats`; `GET /admin/analytics/appointments?period=7`; `GET /admin/doctor-verifications`. |
| **Implement** | useQuery for stats and analytics; Recharts for bar/pie/area; verification list with link to admin-doctors or verify action. |

---

### 6.2 Users

| Field | Detail |
|-------|--------|
| **Route** | `/app/users` |
| **File** | `pages/Users.tsx` |
| **Access** | Admin only |
| **Purpose** | List all users; search/filter; change role; activate/deactivate. |
| **UI blocks** | Page header; Search; Role filter; Table (name, email, role, status); Actions: Edit role, Activate/Deactivate. |
| **API** | `GET /users` (params: role, search, page, limit); `PUT /users/:id/role`; activate/deactivate endpoints if present. |
| **Implement** | useQuery with params; pagination; modal or inline for role change; confirm for deactivate. |

---

### 6.3 Admin Doctors

| Field | Detail |
|-------|--------|
| **Route** | `/app/admin-doctors` |
| **File** | `pages/AdminDoctors.tsx` |
| **Access** | Admin only |
| **Purpose** | List doctors; verify/unverify; view stats. |
| **UI blocks** | Page header; Filters (verified, department); Table/cards (doctor, BMDC, department, verified); Verify/Unverify; View stats. |
| **API** | `GET /admin/doctors`; `PUT /admin/doctors/:id/verify`, `.../unverify`; `GET /admin/doctors/:id/stats` if needed. |
| **Implement** | useQuery; verify/unverify then invalidate; optional stats modal. |

---

### 6.4 Admin Patients

| Field | Detail |
|-------|--------|
| **Route** | `/app/admin-patients` |
| **File** | `pages/AdminPatients.tsx` |
| **Access** | Admin only |
| **Purpose** | List patients; search; view records/stats. |
| **UI blocks** | Page header; Search; Table (name, email, etc.); View details / medical records. |
| **API** | `GET /admin/patients` (params: search, page, limit); `GET /patients/:id/medical-records`. |
| **Implement** | useQuery with search; detail/records in modal or side panel. |

---

### 6.5 Admin Lab Reports

| Field | Detail |
|-------|--------|
| **Route** | `/app/admin-lab-reports` |
| **File** | `pages/AdminLabReports.tsx` |
| **Access** | Admin only |
| **Purpose** | List all lab orders; update status; upload report. |
| **UI blocks** | Page header; Filters; Orders table (patient, tests, status, payment); Update status; Upload report (file). |
| **API** | `GET /admin/lab-tests/orders`; `PUT /admin/lab-tests/orders/:id/status`; `POST /admin/lab-tests/orders/:id/upload-report`. |
| **Implement** | useQuery; status dropdown; file upload for report; invalidate after update. |

---

### 6.6 Admin Lab Tests

| Field | Detail |
|-------|--------|
| **Route** | `/app/admin-lab-tests` |
| **File** | `pages/AdminLabTests.tsx` |
| **Access** | Admin only |
| **Purpose** | CRUD for lab test catalog (name, category, price, sample type, report time). |
| **UI blocks** | Page header; Tests table; Add/Edit modal (name, category, price, sample type, report delivery time, description); Delete with confirm. |
| **API** | `GET /admin/lab-tests/tests` or `/lab-tests/tests`; `POST /admin/lab-tests/tests`; `PUT /admin/lab-tests/tests/:id`; `DELETE /admin/lab-tests/tests/:id`; categories endpoint if separate. |
| **Implement** | useQuery list; form for create/edit; delete with confirmation; invalidate list on mutation. |

---

### 6.7 Admin Ratings

| Field | Detail |
|-------|--------|
| **Route** | `/app/admin-ratings` |
| **File** | `pages/AdminRatings.tsx` |
| **Access** | Admin only |
| **Purpose** | List ratings; moderate (approve/reject); view statistics. |
| **UI blocks** | Page header; Filters (doctor, status); Table (doctor, patient, rating, review, date); Approve/Reject; Stats section. |
| **API** | `GET /admin/ratings`; `PUT /admin/ratings/:id/approve`, `.../reject`; `GET /admin/ratings/statistics` if needed. |
| **Implement** | useQuery; filter by doctor/status; actions then invalidate; optional stats panel. |

---

## 7. Shared components (used by multiple pages)

| Component | Used in | Purpose | API |
|-----------|---------|---------|-----|
| **Layout** | All `/app/*` | Sidebar, header, notification bell, outlet | — |
| **PrescriptionView** | Appointments (patient), Doctor Appointments | Show prescription (medicines, diagnosis, etc.) | `GET /prescriptions/appointment/:id` |
| **RatingModal** | Appointments (patient) | Submit rating after appointment | `POST /ratings` |
| **MedicineMatrix** / medicine tracker | Dashboard (patient) | Show and manage current medicines | `GET /medicines/patient/:id` |
| **VideoConsultation** | Appointments (optional) | Video call for appointment | Token/room endpoint + WebRTC |
| **NotificationDropdown** | Layout | List and mark read | `GET /notifications`, `PUT /notifications/:id/read` |

Implement these when the pages that use them are in place; PrescriptionView and RatingModal are required for the appointment flow.

---

## 8. Backend summary (by feature)

- **Auth:** register, login, profile (get/update), forgot-password, verify-reset-token, reset-password.
- **Appointments:** CRUD + approve, reject, cancel, start, complete; list by role (patient/doctor/admin).
- **Patients:** profile (get/update), dashboard/stats, appointments, medical-records.
- **Doctors:** list (with filters), profile (get/update), upload-image, dashboard/stats, appointments, patients.
- **Prescriptions:** get by appointment, create.
- **Lab tests:** tests catalog, orders (list, create), report (view/upload).
- **Medicines:** list by patient, add, update, delete.
- **Ratings:** by doctor, my-ratings, create; admin list and approve/reject.
- **Notifications:** list, mark read.
- **Admin:** stats, analytics, doctor-verifications, doctors/patients/ratings/lab lists and actions.

Use this plan together with `FRONTEND_PAGES_DOCUMENTATION.md` for API details and `AI_CONTEXT_FOR_NEW_PROJECT.md` for stack and patterns when implementing or porting the project.
