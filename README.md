# SafeCommunity — Crime Reporting & Public Safety Platform
> **Course:** Front End Engineering-II | **Evaluation:** Project Based Evaluation-II (Lectures 43–72)  
> **Tech Stack:** React 19, Vite, Redux Toolkit, React Router v7, Context API, CSS3, Fetch REST API.

---

## 1. Project Overview

**SafeCommunity** is a production-grade, responsive, multi-page Single Page Application (SPA) designed to empower citizens and community members to report incidents, track live investigation statuses, inspect neighborhood trends, and interact with law enforcement workflows.

Built as part of **Front End Engineering-II (Project Evaluation-II)**, the platform comprehensively satisfies every theoretical and practical concept outlined in the course syllabus across Modules A through E.

---

## 2. Quick Start & Execution

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or pnpm

### Commands

```bash
# 1. Install dependencies
npm install

# 2. Start Vite local development server
npm run dev

# 3. Run production build
npm run build

# 4. Run Oxlint code inspection
npm run lint

# 5. Preview production build locally
npm run preview
```

The application will be running at `http://localhost:5173/`.

---

## 3. Pre-Configured Demo Accounts (For Evaluator Testing)

To enable immediate evaluation of Protected Routes, role-based workflows, and admin privilege checking without manual registration, two accounts are pre-seeded:

| Role | Email Address | Password | Privileges / Features Accessible |
|---|---|---|---|
| **Administrator (Law Enforcement)** | `admin@police.gov.in` | `AdminPassword123!` | `/admin` Authority Console, status transitions, case auditing, full delete |
| **Citizen (Standard User)** | `rahul@example.com` | `UserPassword123!` | Public reporting, `/profile` personal incident history, feedback, public search |

> 💡 **Tip:** Both the `/login` page and the Sign In modal include **One-Click Demo Autofill buttons** for rapid testing!

---

## 4. Course Syllabus & Evaluation Requirements Mapping

### Module A: Navigation Layout and Page Structure (Lectures 43–48)
- [x] **Consistent Navigation Layout:** Responsive `Navbar` with brand, mobile hamburger menu, active indicators (`NavLink`), and user dropdown.
- [x] **Multi-Page SPA Architecture:** Declarative routing via `react-router-dom` (v7) without full-page refreshes.
- [x] **Routes Implemented:**
  - `/` — Modern landing page with metrics, features, and emergency hotline directory.
  - `/reports` — Full incident database with grid/table views, tabs, search, filters, pagination, and infinite scroll toggle.
  - `/reports/new` — Validated incident report form with OpenStreetMap location lookup.
  - `/reports/:id` — Dynamic route with `useParams` for complete incident inspection, timeline, and audit remarks.
  - `/reports/:id/edit` — Dynamic edit route with validation and data prefill.
  - `/dashboard` — Analytics intelligence dashboard with KPI metrics, category breakdowns, and pipeline charts.
  - `/external-lookup` — Public Intelligence & Third-Party API Investigator Viewer (GitHub + Nominatim).
  - `/feedback` — Validated feedback submission with 5-star rating system and community testimonials.
  - `/profile` — Protected user profile with personal report submission history and editable details.
  - `/admin` — Protected Authority Console with role check (`admin`), moderation queue, and quick transitions.
  - `/login` & `/register` — Full-page authentication with form validation.
  - `*` / `/not-found` — Accessible 404 page with return-to-safety navigation.
- [x] **Nested Routes & Layouts:** `MainLayout` wrapping `<Outlet />`, `Navbar`, `Footer`, and `ToastContainer`.
- [x] **Protected Routes:** `ProtectedRoute.jsx` guarding `/profile` and `/admin` with clear 403 access-denied state.

---

### Module B: Context API, State Architecture & Redux Toolkit (Lectures 49–54)
- [x] **Context API (Application-Wide Cross-Cutting Concerns):**
  - `ThemeContext` & `useTheme`: Dark/Light theme toggling, persisted in `localStorage`, reactive `data-theme` attribute on root element.
  - `AuthContext` & `useAuth`: User session management, role verification, demo user persistence.
  - `ToastContext` & `useToast`: Global toast notification queue with auto-dismiss timers and severity types.
- [x] **Redux Toolkit (`@reduxjs/toolkit` & `react-redux`):**
  - Configured store in `src/store/store.js`.
  - Slice `reportsSlice.js` managing incident items, filters, pagination, view modes, and stats.
  - Async Thunks (`createAsyncThunk`): `fetchReportsAsync`, `fetchMoreReportsAsync`, `fetchReportByIdAsync`, `fetchStatsAsync`, `createReportAsync`, `updateReportAsync`, `deleteReportAsync`, `updateStatusAsync`.
  - Selectors: `selectReports`, `selectReportsStatus`, `selectReportsError`, `selectPagination`, `selectFilters`, `selectStats`.
- [x] **Async State Handling:** Explicit tracking of `'idle' | 'loading' | 'succeeded' | 'failed'` states, skeleton loaders, error banners, and retry actions.

---

### Module C: Form Handling, Validation & Reusable Input Components (Lectures 55–60)
- [x] **Reusable Form Controls (`src/components/common/`):**
  - `InputField`: Accessible input with label, icons, helper text, error messages, and ARIA attributes.
  - `SelectField`: Accessible dropdown select with custom options.
  - `TextAreaField`: Multi-line input with real-time character count and length enforcement.
  - `LoadingButton`: Submit button with animated spinner and disabled state to prevent duplicate submissions.
- [x] **Client-Side Form Validation:**
  - Crime Report Form: Title (min 5 chars), Location (min 3 chars), Category, Description (min 15 chars), Email regex, 10-digit mobile regex, photo file type & 2.5MB size validation.
  - Registration Form (Mini-Project): Name, RFC email, 10-digit phone, password complexity (uppercase + number), confirm password match, role selector.
  - Feedback Form: Rating (1-5), Category, Name, Email, and message validation.
  - Profile Form: Editable display name and phone number.

---

### Module D: Modals, Tabs, Dropdowns, Toasts, Search, Filter & Sort (Lectures 61–66)
- [x] **Modals:**
  - `CrimeDetailsModal`: Accessible modal with Escape key listener, click-outside handling, and focus management.
  - `ConfirmModal`: Destructive action confirmation dialog preventing accidental report deletion.
  - `LoginModal`: Quick modal authentication option.
- [x] **Tabs:**
  - Report status tabs in Reports page ("All", "Pending", "Under Review", "Resolved").
  - Analytics tabs in Dashboard ("Overview", "Category Breakdown", "Investigation Pipeline").
  - Third-party tool tabs ("GitHub Viewer", "OpenStreetMap Geocoding").
- [x] **Dropdowns:** Category selector, Sort order (Newest, Oldest, Title A-Z, Category, Status), Results per page (4, 6, 12), User account actions menu.
- [x] **Toast Notifications:** Floating toasts with slide-in animations for Success, Error, Warning, and Info alerts.
- [x] **Search, Filter & Sort:** Working seamlessly together on live report data.

---

### Module E: REST API Integration, CRUD, Pagination, Infinite Scroll, Debounce & Third-Party APIs (Lectures 67–72)
- [x] **REST API Architecture:** Dedicated API service layer (`apiClient.js`, `reportService.js`, `thirdPartyService.js`) using native Fetch API, timeout handling (`AbortController`), and error normalization.
- [x] **CRUD Operations:**
  - **Create:** File new incident with client validation and immediate ID assignment.
  - **Read:** Paginated reports list and single report detail view.
  - **Update:** Edit existing incidents and progress investigation status with audit remarks.
  - **Delete:** Remove reports with confirmation dialog safety.
- [x] **Simulated Network Error & Retry Logic:** An evaluation testing toggle is built directly into the UI ("Simulate Network Failure") allowing the evaluator to verify error states, loading spinners, and bounded retries.
- [x] **Pagination:** Traditional page numbers, Next/Previous controls, results counter ("Showing 6 of 12 reports"), and per-page limits.
- [x] **Infinite Scrolling:** Native `IntersectionObserver` with cleanup, sentinel detection, duplicate request prevention, and smooth appending. Users can toggle between Traditional Pagination and Infinite Scrolling at any time.
- [x] **Debounced Search:** Custom hook `useDebounce` applied to live searches (350ms on report list, 600ms on remote GitHub lookups).
- [x] **Third-Party REST API Integration:**
  1. **GitHub Public REST API (`https://api.github.com`):** Fulfills Syllabus Mini-Project requirement. Real HTTP requests for user profiles (avatar, bio, followers, repos count) and repository lists with progressive pagination and rate-limit handling.
  2. **OpenStreetMap Nominatim Geocoding API (`https://nominatim.openstreetmap.org`):** Real-world incident address forward geocoding, coordinates lookup, and verification integrated into both the Crime Form and Investigator Tools.

---

## 5. Architectural Directory Structure

```
crime-reporting-platform/
├── public/
├── src/
│   ├── assets/              # Icons and logos
│   ├── components/
│   │   ├── auth/            # ProtectedRoute, LoginModal
│   │   ├── common/          # InputField, SelectField, TextAreaField, LoadingButton,
│   │   │                    # LoadingSpinner, SkeletonLoader, EmptyState, ErrorMessage,
│   │   │                    # ConfirmModal, StatusBadge, ToastContainer
│   │   ├── layout/          # Navbar, Footer, MainLayout
│   │   └── reports/         # CrimeCard, CrimeForm, CrimeList, CrimeDetailsModal
│   ├── context/             # ThemeContext, AuthContext, ToastContext
│   ├── hooks/               # useAuth, useTheme, useToast, useDebounce, useIntersectionObserver
│   ├── pages/               # LandingPage, ReportsPage, NewReportPage, ReportDetailPage,
│   │                        # EditReportPage, DashboardPage, ExternalLookupPage,
│   │                        # FeedbackPage, ProfilePage, AdminPage, LoginPage,
│   │                        # RegisterPage, NotFoundPage
│   ├── routes/              # AppRoutes (declarative route hierarchy)
│   ├── services/            # apiClient (fetch client), reportService (CRUD),
│   │                        # thirdPartyService (GitHub & Nominatim)
│   ├── store/               # Redux Toolkit store and reportsSlice
│   ├── App.jsx              # Root provider tree
│   ├── index.css            # Responsive, dark/light theme stylesheet
│   └── main.jsx             # React DOM entrypoint
├── .env.example             # Configurable API base URLs
├── index.html
├── package.json
└── vite.config.js
```

---

## 6. Academic & Ethical Transparency

- **Academic Demonstration Notice:** This platform is created solely for college evaluation in Front End Engineering II. It does not replace real emergency services or official police reporting (Dial 112 in India / 911 in the US).
- **Persistence Strategy:** Crime report records and simulated user sessions are persisted using client storage with simulated network latency to demonstrate real asynchronous UI states, whereas third-party investigator tools make genuine remote HTTP calls to the public web.
