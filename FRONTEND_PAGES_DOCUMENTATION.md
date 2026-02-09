# Frontend Pages Documentation

## Overview
This document provides a comprehensive analysis of every frontend page in the Healthcare WebApp, describing their contents, functionality, and how each element retrieves data from the backend API.

## API Configuration

### Base URL
- **Development**: `http://localhost:5000/api`
- **Production**: Configured via `REACT_APP_API_URL` environment variable
- **Authentication**: JWT Bearer Token in `Authorization` header
- **HTTP Client**: Axios (configured in `AuthContext.tsx`)

### Authentication Flow
- Token stored in `localStorage` as `'token'`
- Axios interceptor automatically adds `Authorization: Bearer <token>` header
- Token automatically refreshed on 401 errors
- User profile loaded on app initialization via `/auth/profile`

---

## Public Pages

### 1. LandingPage (`/`)
**File**: `client/src/pages/LandingPage.tsx`

#### Contents
- Hero section with call-to-action buttons
- Features showcase (6 main features)
- Statistics section (animated counters)
- Testimonials carousel (5 testimonials)
- About section
- Contact information
- Footer with links

#### Backend Data Fetching
- **No backend API calls** - This is a static marketing page
- All data is hardcoded in the component
- Statistics (10,000+ patients, 500+ doctors, etc.) are static values
- Testimonials are predefined in the component state

#### Key Elements
- Navigation links to `/login` and `/register`
- Smooth scroll to sections (features, stats, testimonials, contact)
- Animated statistics counters (client-side animation only)

---

### 2. Login (`/login`)
**File**: `client/src/pages/Login.tsx`

#### Contents
- Email/Phone input field
- Password input field (with show/hide toggle)
- "Remember me" checkbox
- "Forgot password?" link
- Sign in button
- Link to registration page
- Features showcase (right side panel)

#### Backend Data Fetching
- **POST `/auth/login`** - Authenticates user
  - Accepts `email` or `phone` + `password`
  - Returns: `{ user, token }`
  - Token stored in localStorage
  - User data stored in AuthContext
  - Redirects to `/app` or previous location

#### Key Elements
- Form validation using `react-hook-form`
- Email/phone regex validation
- Password minimum length validation (6 characters)
- Loading state during authentication
- Error handling with toast notifications

---

### 3. Register (`/register`)
**File**: `client/src/pages/Register.tsx`

#### Contents
- Role selection (Patient/Doctor/Admin)
- Basic information form:
  - First Name, Last Name
  - Email, Password, Confirm Password
  - Phone, Date of Birth, Gender, Address
- Doctor-specific fields (if role = doctor):
  - BMDC Registration Number
  - Medical Department (dropdown)
  - Years of Experience
- Benefits showcase (right side panel)

#### Backend Data Fetching
- **POST `/auth/register`** - Creates new user account
  - Request body includes all form fields
  - For doctors: includes `bmdcRegistrationNumber`, `department`, `experience`
  - Returns: `{ user, token }`
  - Token stored in localStorage
  - Redirects to `/login` after successful registration

#### Key Elements
- Dynamic form based on selected role
- Password confirmation validation
- Email format validation
- Department dropdown populated from `MEDICAL_DEPARTMENTS` constant
- Form validation using `react-hook-form`

---

### 4. ForgotPassword (`/forgot-password`)
**File**: `client/src/pages/ForgotPassword.tsx`

#### Contents
- Email input field
- Submit button
- Success state (after email sent)
- Link back to login

#### Backend Data Fetching
- **POST `/auth/forgot-password`** - Sends password reset email
  - Request body: `{ email }`
  - Returns success message
  - Shows confirmation screen after successful submission

#### Key Elements
- Email validation
- Success state with email confirmation
- Error handling with toast notifications

---

### 5. ResetPassword (`/reset-password`)
**File**: `client/src/pages/ResetPassword.tsx`

#### Contents
- Token validation (from URL query parameter)
- New password input field
- Confirm password input field
- Submit button
- Invalid token state

#### Backend Data Fetching
- **GET `/auth/verify-reset-token?token=<token>`** - Validates reset token
  - Called on component mount
  - Sets `tokenValid` state
- **POST `/auth/reset-password`** - Resets password
  - Request body: `{ token, password }`
  - Redirects to `/login` on success

#### Key Elements
- Token extracted from URL query parameters
- Password strength validation (min 8 chars, uppercase, lowercase, number)
- Password confirmation matching
- Loading state during token verification
- Invalid token error state

---

### 6. NotFound (`/*`)
**File**: `client/src/pages/NotFound.tsx`

#### Contents
- 404 error message
- Link back to home

#### Backend Data Fetching
- **No backend API calls** - Static error page

---

## Protected Pages (Patient Role)

### 7. Dashboard (`/app/dashboard`)
**File**: `client/src/pages/Dashboard.tsx`

#### Contents
- Welcome header with user name
- Statistics cards (4-5 cards):
  - Total Appointments
  - Today's Appointments
  - Completed Appointments
  - Pending Appointments
  - (For admin/doctor) Total Patients
- Recent Appointments list (5 most recent)
- Quick Actions section
- Medicine Tracker (for patients)

#### Backend Data Fetching
- **GET `/patients/profile`** - Gets patient profile
  - Returns patient ID and medical information
  - Used to fetch patient-specific data
- **GET `/patients/:patientId/dashboard/stats`** - Gets dashboard statistics
  - Returns: `{ totalAppointments, todayAppointments, completedAppointments, pendingAppointments, requestedAppointments, scheduledAppointments }`
  - Refetches every 30 seconds for real-time updates
- **GET `/patients/:patientId/appointments`** - Gets recent appointments
  - Query params: `{ limit: 5, sortBy: 'appointmentDate', sortOrder: 'DESC' }`
  - Returns list of appointments with doctor information
- **Medicine Matrix Component** - Fetches medicine data
  - Uses patient ID to fetch current medications

#### Key Elements
- Role-based statistics (different stats for patient/doctor/admin)
- Real-time updates (30-second polling)
- Recent appointments with status badges
- Quick action buttons to navigate to other pages
- Medicine tracker integration

---

### 8. PatientProfile (`/app/profile`)
**File**: `client/src/pages/PatientProfile.tsx`

#### Contents
- Personal Information section:
  - First Name, Last Name, Email (read-only)
  - Phone, Date of Birth, Gender, Address
  - Edit/Save buttons
- Medical Information section:
  - Blood Type (dropdown)
  - Allergies (multi-select with search)
  - Emergency Contact Name & Phone
  - Insurance Provider & Number
  - Edit/Save buttons

#### Backend Data Fetching
- **GET `/patients/profile`** - Fetches patient profile
  - Returns: `{ patient: { id, bloodType, allergies, emergencyContact, emergencyPhone, insuranceProvider, insuranceNumber } }`
  - Called on component mount
- **PUT `/auth/profile`** - Updates user profile (personal info)
  - Request body: `{ firstName, lastName, phone, dateOfBirth, gender, address }`
  - Updates AuthContext user data
- **PUT `/patients/profile`** - Updates patient medical information
  - Request body: `{ bloodType, allergies, emergencyContact, emergencyPhone, insuranceProvider, insuranceNumber }`
  - Allergies sent as comma-separated string

#### Key Elements
- Two separate forms (personal and medical)
- Allergy management with searchable dropdown
- Custom allergy input
- Form validation
- Edit/view mode toggle

---

### 9. Appointments (`/app/appointments`)
**File**: `client/src/pages/Appointments.tsx`

#### Contents
- Filter section:
  - Status filter (all, requested, scheduled, completed, cancelled)
  - Type filter (all, in_person, telemedicine, follow_up)
  - Doctor filter (dropdown of unique doctors)
- Appointment booking modal
- Appointments list with:
  - Doctor name and department
  - Appointment date and time
  - Status badge
  - Type badge
  - Action buttons (View, Rate, Cancel, etc.)
- Prescription view modal
- Rating modal
- Video consultation modal

#### Backend Data Fetching
- **GET `/appointments`** - Fetches all patient appointments
  - Returns: `{ appointments: [...] }`
  - Each appointment includes: `{ id, appointmentDate, appointmentTime, status, type, doctor, patient, serialNumber, reason, symptoms }`
  - Refetches every 30 seconds for real-time updates
- **GET `/ratings/my-ratings`** - Gets patient's ratings
  - Returns: `{ ratings: [{ appointmentId, rating, ... }] }`
  - Used to check which appointments are already rated
- **GET `/doctors`** - Fetches doctors list for booking
  - Returns: `{ doctors: [{ id, user, department, chamberTimes, consultationFee, ... }] }`
  - Used in booking modal
- **POST `/appointments`** - Creates new appointment
  - Request body: `{ patientId, doctorId, appointmentDate, timeBlock, type, reason, symptoms }`
  - Returns created appointment
- **GET `/prescriptions/appointment/:appointmentId`** - Gets prescription for appointment
  - Returns prescription details with medicines
- **POST `/ratings`** - Submits doctor rating
  - Request body: `{ appointmentId, doctorId, rating, review }`
- **PUT `/appointments/:id/cancel`** - Cancels appointment
- **GET `/appointments/:id`** - Gets single appointment details

#### Key Elements
- Real-time appointment updates
- Filtering and sorting
- Booking modal with doctor selection
- Chamber time availability checking
- Prescription viewing
- Rating system
- Video consultation integration

---

### 10. MedicalRecords (`/app/medical-records`)
**File**: `client/src/pages/MedicalRecords.tsx`

#### Contents
- Medical records list
- Filter options (by date, type, doctor)
- Record details view
- PDF download option

#### Backend Data Fetching
- **GET `/patients/:patientId/medical-records`** - Fetches medical records
  - Returns: `{ records: [{ id, recordType, title, description, diagnosis, recordDate, doctor, ... }] }`
- **GET `/medical-records/:id`** - Gets single record details
- **GET `/medical-records/:id/pdf`** - Downloads record as PDF

#### Key Elements
- Chronological record listing
- Filter by record type (consultation, lab_test, prescription, etc.)
- Doctor information for each record
- PDF generation and download

---

### 11. LabReports (`/app/lab-reports`)
**File**: `client/src/pages/LabReports.tsx`

#### Contents
- Lab test orders list
- Test status badges
- Report viewing/downloading
- Order new tests button
- Payment status

#### Backend Data Fetching
- **GET `/lab-tests/orders`** - Gets patient's lab test orders
  - Returns: `{ orders: [{ id, tests, status, paymentStatus, reportUrl, ... }] }`
- **GET `/lab-tests/tests`** - Gets available lab tests
  - Returns: `{ tests: [{ id, name, category, price, sampleType, ... }] }`
- **POST `/lab-tests/orders`** - Creates new lab test order
  - Request body: `{ testIds: [], paymentMethod, amount }`
- **GET `/lab-tests/orders/:orderId/report`** - Downloads lab report

#### Key Elements
- Order status tracking
- Payment integration
- Report viewing and downloading
- Test selection and ordering

---

### 12. Doctors (`/app/doctors`)
**File**: `client/src/pages/Doctors.tsx`

#### Contents
- Doctor cards grid
- Department filter dropdown
- Doctor profile modal
- Book appointment button

#### Backend Data Fetching
- **GET `/doctors`** - Fetches doctors list
  - Query params: `{ department }` (optional filter)
  - Returns: `{ doctors: [{ id, user, department, experience, rating, consultationFee, chamberTimes, bio, degrees, awards, ... }] }`
- **GET `/ratings/doctor/:doctorId`** - Gets doctor ratings
  - Returns: `{ summary: { averageRating, totalRatings }, ratings: [...] }`

#### Key Elements
- Department filtering
- Doctor profile cards with ratings
- Chamber times display
- Consultation fee display
- Book appointment integration

---

## Protected Pages (Doctor Role)

### 13. DoctorDashboard (`/app/doctor-dashboard`)
**File**: `client/src/pages/DoctorDashboard.tsx`

#### Contents
- Welcome header with doctor name and rating
- Statistics cards (6 cards):
  - Today's Appointments
  - Pending Requests
  - In Progress
  - Completed Today
  - Total Patients
  - Total Appointments
- Today's Schedule (appointments for today)
- Quick Actions section
- Pending requests alert

#### Backend Data Fetching
- **GET `/doctors/profile`** - Gets doctor profile
  - Returns: `{ doctor: { id, ... } }`
  - Used to get doctor ID
- **GET `/doctors/:doctorId/dashboard/stats`** - Gets dashboard statistics
  - Returns: `{ stats: { totalAppointments, todayAppointments, completedAppointments, pendingAppointments, requestedAppointments, inProgressAppointments, totalPatients } }`
  - Refetches every 30 seconds
- **GET `/doctors/:doctorId/appointments`** - Gets today's appointments
  - Query params: `{ date: 'YYYY-MM-DD' }` (today's date)
  - Returns: `{ appointments: [...] }`
  - Sorted by appointment time
- **GET `/ratings/doctor/:doctorId`** - Gets doctor ratings
  - Returns: `{ summary: { averageRating, totalRatings } }`

#### Key Elements
- Real-time statistics updates
- Today's schedule with serial numbers
- Appointment status badges
- Quick navigation to appointments and patients
- Rating display in header

---

### 14. DoctorProfile (`/app/doctor-profile`)
**File**: `client/src/pages/DoctorProfile.tsx`

#### Contents
- Profile image upload section
- Basic Information:
  - BMDC Registration Number (read-only)
  - Medical Department
  - Experience (years)
  - Education
  - Certifications
  - Hospital/Clinic Name
  - Consultation Fee
  - Location
  - Bio
- Chamber Times (weekly schedule)
- Degrees & Qualifications (list with add/remove)
- Awards & Recognitions (list with add/remove)
- Languages (list with add/remove)
- Medical Services (list with add/remove)

#### Backend Data Fetching
- **GET `/doctors/profile`** - Fetches doctor profile
  - Returns: `{ doctor: { id, bmdcRegistrationNumber, department, experience, education, certifications, degrees, awards, hospital, location, chamberTimes, consultationFee, languages, services, bio, profileImage } }`
- **PUT `/doctors/profile`** - Updates doctor profile
  - Request body includes all profile fields
  - Updates all profile information
- **POST `/doctors/upload-image`** - Uploads profile image
  - FormData with `profileImage` file
  - Returns: `{ imageUrl }`
  - Max file size: 5MB
  - Formats: JPG, PNG, GIF

#### Key Elements
- Image upload with preview
- Chamber times management (checkboxes for each day/time slot)
- Dynamic lists (degrees, awards, languages, services) with add/remove
- Form validation
- Edit/view mode toggle

---

### 15. DoctorAppointments (`/app/doctor-appointments`)
**File**: `client/src/pages/DoctorAppointments.tsx`

#### Contents
- Appointments list with filters
- Appointment details view
- Approve/Reject buttons for requested appointments
- Prescription creation interface
- Appointment status management

#### Backend Data Fetching
- **GET `/doctors/:doctorId/appointments`** - Fetches doctor's appointments
  - Query params: `{ status, date, page, limit }`
  - Returns: `{ appointments: [...], pagination: {...} }`
- **PUT `/appointments/:id/approve`** - Approves appointment request
  - Returns updated appointment with serial number
- **PUT `/appointments/:id/reject`** - Rejects appointment request
- **PUT `/appointments/:id/start`** - Marks appointment as in progress
- **PUT `/appointments/:id/complete`** - Marks appointment as completed
- **POST `/prescriptions`** - Creates prescription for appointment
  - Request body: `{ appointmentId, medicines, symptoms, diagnosis, tests, recommendations }`

#### Key Elements
- Status-based filtering
- Appointment approval workflow
- Prescription creation
- Serial number assignment
- Patient information display

---

### 16. Patients (`/app/patients`)
**File**: `client/src/pages/Patients.tsx`

#### Contents
- Patients list (for doctors)
- Patient search and filters
- Patient profile view
- Medical history access

#### Backend Data Fetching
- **GET `/doctors/:doctorId/patients`** - Gets doctor's patients
  - Returns: `{ patients: [{ id, user, medicalRecords, ... }] }`
- **GET `/patients/:patientId`** - Gets patient details
- **GET `/patients/:patientId/medical-records`** - Gets patient medical records

#### Key Elements
- Patient search functionality
- Medical history viewing
- Appointment history

---

## Protected Pages (Admin Role)

### 17. AdminDashboard (`/app/admin-dashboard`)
**File**: `client/src/pages/AdminDashboard.tsx`

#### Contents
- System statistics cards:
  - Total Users
  - Total Doctors
  - Total Patients
  - Total Appointments
- Analytics charts:
  - Appointment status distribution (bar chart)
  - Appointment type distribution (pie chart)
  - Daily appointment trends (area chart)
- Doctor verification requests
- Recent activity

#### Backend Data Fetching
- **GET `/admin/stats`** - Gets system statistics
  - Returns: `{ stats: { totalUsers, totalDoctors, totalPatients, totalAppointments, ... } }`
- **GET `/admin/analytics/appointments?period=7`** - Gets appointment analytics
  - Returns: `{ analytics: { statusCounts, typeCounts, dailyCounts, period } }`
- **GET `/admin/doctor-verifications`** - Gets pending doctor verifications
  - Returns: `{ doctors: [{ id, user, bmdcRegistrationNumber, ... }] }`

#### Key Elements
- Real-time statistics
- Data visualization with charts (recharts)
- Doctor verification workflow
- Analytics period selection

---

### 18. Users (`/app/users`)
**File**: `client/src/pages/Users.tsx`

#### Contents
- Users list with pagination
- User search and filters
- User role management
- User activation/deactivation
- User details view

#### Backend Data Fetching
- **GET `/users`** - Gets all users
  - Query params: `{ role, search, page, limit }`
  - Returns: `{ users: [...], pagination: {...} }`
- **PUT `/users/:id/role`** - Updates user role
  - Request body: `{ role }`
- **PUT `/users/:id/activate`** - Activates user
- **PUT `/users/:id/deactivate`** - Deactivates user

#### Key Elements
- Role-based filtering
- Search functionality
- Pagination
- User management actions

---

### 19. AdminDoctors (`/app/admin-doctors`)
**File**: `client/src/pages/AdminDoctors.tsx`

#### Contents
- Doctors list with verification status
- Doctor verification actions
- Doctor profile view
- Doctor statistics

#### Backend Data Fetching
- **GET `/admin/doctors`** - Gets all doctors
  - Query params: `{ verified, department, search }`
  - Returns: `{ doctors: [...] }`
- **PUT `/admin/doctors/:id/verify`** - Verifies doctor
- **PUT `/admin/doctors/:id/unverify`** - Unverifies doctor
- **GET `/admin/doctors/:id/stats`** - Gets doctor statistics

#### Key Elements
- Verification status badges
- BMDC registration verification
- Doctor statistics display
- Bulk verification actions

---

### 20. AdminPatients (`/app/admin-patients`)
**File**: `client/src/pages/AdminPatients.tsx`

#### Contents
- Patients list
- Patient search and filters
- Patient medical records access
- Patient statistics

#### Backend Data Fetching
- **GET `/admin/patients`** - Gets all patients
  - Query params: `{ search, page, limit }`
  - Returns: `{ patients: [...], pagination: {...} }`
- **GET `/admin/patients/:id/stats`** - Gets patient statistics
- **GET `/patients/:id/medical-records`** - Gets patient medical records

#### Key Elements
- Patient search
- Medical records access
- Statistics display
- Export functionality

---

### 21. AdminRatings (`/app/admin-ratings`)
**File**: `client/src/pages/AdminRatings.tsx`

#### Contents
- Ratings list
- Rating moderation actions
- Doctor rating statistics
- Rating analytics

#### Backend Data Fetching
- **GET `/admin/ratings`** - Gets all ratings
  - Query params: `{ doctorId, status, page, limit }`
  - Returns: `{ ratings: [...], pagination: {...} }`
- **PUT `/admin/ratings/:id/approve`** - Approves rating
- **PUT `/admin/ratings/:id/reject`** - Rejects rating
- **GET `/admin/ratings/statistics`** - Gets rating statistics

#### Key Elements
- Rating moderation
- Statistics and analytics
- Doctor-specific ratings
- Review content display

---

### 22. AdminLabReports (`/app/admin-lab-reports`)
**File**: `client/src/pages/AdminLabReports.tsx`

#### Contents
- Lab test orders list
- Order status management
- Report upload interface
- Payment status tracking

#### Backend Data Fetching
- **GET `/admin/lab-tests/orders`** - Gets all lab test orders
  - Query params: `{ status, patientId, page, limit }`
  - Returns: `{ orders: [...], pagination: {...} }`
- **PUT `/admin/lab-tests/orders/:id/status`** - Updates order status
- **POST `/admin/lab-tests/orders/:id/upload-report`** - Uploads lab report
  - FormData with report file
- **GET `/admin/lab-tests/statistics`** - Gets lab test statistics

#### Key Elements
- Order status management
- Report upload
- Payment tracking
- Statistics display

---

### 23. AdminLabTests (`/app/admin-lab-tests`)
**File**: `client/src/pages/AdminLabTests.tsx`

#### Contents
- Lab tests list
- Add/Edit/Delete lab tests
- Test categories management
- Pricing management

#### Backend Data Fetching
- **GET `/admin/lab-tests/tests`** - Gets all lab tests
  - Returns: `{ tests: [{ id, name, category, price, sampleType, reportDeliveryTime, ... }] }`
- **POST `/admin/lab-tests/tests`** - Creates new lab test
  - Request body: `{ name, category, price, sampleType, reportDeliveryTime, description }`
- **PUT `/admin/lab-tests/tests/:id`** - Updates lab test
- **DELETE `/admin/lab-tests/tests/:id`** - Deletes lab test
- **GET `/admin/lab-tests/categories`** - Gets test categories

#### Key Elements
- CRUD operations for lab tests
- Category management
- Pricing configuration
- Test details form

---

## Shared Components

### MedicineTracker
**File**: `client/src/components/DashboardMedicineTracker.tsx`

#### Backend Data Fetching
- **GET `/medicines/patient/:patientId`** - Gets patient's current medicines
  - Returns: `{ medicines: [{ id, medicineName, dosage, frequency, duration, startDate, totalQuantity, ... }] }`

### PrescriptionView
**File**: `client/src/components/PrescriptionView.tsx`

#### Backend Data Fetching
- **GET `/prescriptions/appointment/:appointmentId`** - Gets prescription details
  - Returns: `{ prescription: { medicines, symptoms, diagnosis, tests, recommendations, ... } }`
- **GET `/prescriptions/:id/pdf`** - Downloads prescription as PDF

### VideoConsultation
**File**: `client/src/components/VideoConsultation.tsx`

#### Backend Data Fetching
- **GET `/appointments/:id/video-token`** - Gets video consultation token
  - Returns: `{ token, roomId }`
- WebSocket connection for real-time video

### NotificationDropdown
**File**: `client/src/components/NotificationDropdown.tsx`

#### Backend Data Fetching
- **GET `/notifications`** - Gets user notifications
  - Returns: `{ notifications: [{ id, title, message, type, isRead, createdAt, ... }] }`
- **PUT `/notifications/:id/read`** - Marks notification as read
- WebSocket for real-time notifications

---

## Data Flow Summary

### Authentication Flow
1. User logs in → `POST /auth/login`
2. Token stored in localStorage
3. Token added to all subsequent requests via Axios interceptor
4. User profile loaded → `GET /auth/profile`
5. User data stored in AuthContext

### Role-Based Data Access
- **Patient**: Accesses `/patients/*` endpoints
- **Doctor**: Accesses `/doctors/*` endpoints
- **Admin**: Accesses `/admin/*` endpoints
- Shared endpoints: `/appointments`, `/prescriptions`, `/notifications`

### Real-Time Updates
- Appointments: 30-second polling
- Notifications: WebSocket connection
- Dashboard stats: 30-second polling
- Medicine reminders: WebSocket events

### Error Handling
- 401 errors: Token cleared, redirect to login
- 403 errors: Access denied message
- 404 errors: Not found page
- 500 errors: Server error toast notification
- Network errors: Retry with exponential backoff

---

## API Endpoint Summary

### Authentication
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `GET /auth/profile` - Get user profile
- `PUT /auth/profile` - Update user profile
- `POST /auth/forgot-password` - Request password reset
- `GET /auth/verify-reset-token` - Verify reset token
- `POST /auth/reset-password` - Reset password

### Appointments
- `GET /appointments` - Get appointments (role-based)
- `POST /appointments` - Create appointment
- `GET /appointments/:id` - Get appointment details
- `PUT /appointments/:id/approve` - Approve appointment
- `PUT /appointments/:id/reject` - Reject appointment
- `PUT /appointments/:id/cancel` - Cancel appointment
- `PUT /appointments/:id/start` - Start appointment
- `PUT /appointments/:id/complete` - Complete appointment

### Patients
- `GET /patients/profile` - Get patient profile
- `PUT /patients/profile` - Update patient profile
- `GET /patients/:id/dashboard/stats` - Get dashboard stats
- `GET /patients/:id/appointments` - Get patient appointments
- `GET /patients/:id/medical-records` - Get medical records

### Doctors
- `GET /doctors` - Get doctors list
- `GET /doctors/profile` - Get doctor profile
- `PUT /doctors/profile` - Update doctor profile
- `POST /doctors/upload-image` - Upload profile image
- `GET /doctors/:id/dashboard/stats` - Get dashboard stats
- `GET /doctors/:id/appointments` - Get doctor appointments
- `GET /doctors/:id/patients` - Get doctor's patients

### Prescriptions
- `GET /prescriptions/appointment/:appointmentId` - Get prescription
- `POST /prescriptions` - Create prescription
- `GET /prescriptions/:id/pdf` - Download PDF

### Lab Tests
- `GET /lab-tests/tests` - Get available tests
- `GET /lab-tests/orders` - Get test orders
- `POST /lab-tests/orders` - Create test order
- `GET /lab-tests/orders/:orderId/report` - Get report

### Medicines
- `GET /medicines/patient/:patientId` - Get patient medicines
- `POST /medicines` - Add medicine
- `PUT /medicines/:id` - Update medicine
- `DELETE /medicines/:id` - Remove medicine

### Ratings
- `GET /ratings/doctor/:doctorId` - Get doctor ratings
- `GET /ratings/my-ratings` - Get user's ratings
- `POST /ratings` - Submit rating

### Notifications
- `GET /notifications` - Get notifications
- `PUT /notifications/:id/read` - Mark as read

### Admin
- `GET /admin/stats` - Get system statistics
- `GET /admin/analytics/appointments` - Get appointment analytics
- `GET /admin/doctor-verifications` - Get verification requests
- `PUT /admin/doctors/:id/verify` - Verify doctor
- `GET /admin/doctors` - Get all doctors
- `GET /admin/patients` - Get all patients
- `GET /admin/ratings` - Get all ratings
- `GET /admin/lab-tests/orders` - Get all lab orders

---

## Notes

1. **Caching**: React Query is used for data caching and automatic refetching
2. **Real-time Updates**: Polling (30s intervals) and WebSocket for notifications
3. **File Uploads**: Uses FormData for image and document uploads
4. **Pagination**: Most list endpoints support pagination with `page` and `limit` params
5. **Filtering**: Most endpoints support filtering via query parameters
6. **Error Handling**: Centralized error handling via Axios interceptors
7. **Loading States**: All pages show loading indicators during data fetching
8. **Form Validation**: Client-side validation using `react-hook-form` and server-side validation
