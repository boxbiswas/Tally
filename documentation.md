# TALLY — Project Documentation

> Consolidated daily development log for the TALLY project.
> Author: Indrasish

---

## Table of Contents

- [21-06-2026 — Project Initialization & Environment Setup](#21-06-2026)
- [22-06-2026 — Prisma Migration & Backend Scaffolding](#22-06-2026)
- [23-06-2026 — Database Connection & Route Wiring Verification](#23-06-2026)
- [24-06-2026 — Full Backend API Layer & Postman Testing](#24-06-2026)
- [25-06-2026 — Dashboard & Reports Backend + Frontend Shell (Auth, Layout, Dashboard)](#25-06-2026)
- [26-06-2026 — Frontend Pages: Masters, Vouchers, Reports & Shortcuts](#26-06-2026)
- [27-06-2026 — UI/UX Polish, Keyboard Navigation & Backend Security Scoping](#27-06-2026)
- [28-06-2026 — Deployment Prep, Schema Push & Config Refactor](#28-06-2026)
- [29-06-2026 — Post-Deployment Validation & Documentation](#29-06-2026)

---

## 21-06-2026

### Summary

Project initialization day. Set up the monorepo directory structure, initialized both backend and frontend packages, installed all baseline dependencies, and configured the development environment before any Prisma or coding work began.

---

### Backend

- Initialized the backend Node.js project (`npm init -y`) in the `backend/` directory.
- Installed core backend dependencies: Express, Prisma, `@prisma/client`, `cookie-parser`, `bcryptjs`, `jsonwebtoken`, `cors`, `dotenv`.
- Created the initial folder structure:
  - `backend/controllers/` — placeholder controller files for auth, company, ledger, purchase, sales, stock
  - `backend/routes/` — placeholder route files for each domain
  - `backend/middleware/` — placeholder for `authMiddleware.js`
  - `backend/prisma/` — directory for `schema.prisma`
  - `backend/lib/` — directory for Prisma client singleton (`prisma.js`)
  - `backend/config/` — directory for Prisma and DB config files
- Created initial `backend/app.js` entry point with Express boilerplate.
- Set up `.env` with `DATABASE_URL` and `SESSION_SECRET` placeholders.
- Added `backend/.gitignore` to exclude `node_modules/` and `.env`.

### Frontend

- Initialized the frontend React project using Vite (`npm create vite@latest frontend -- --template react`).
- Installed baseline frontend dependencies: React Router DOM, Axios, Redux Toolkit, `react-redux`.
- Verified the Vite dev server starts correctly (`npm run dev`).
- Reviewed auto-generated scaffolding: `frontend/src/main.jsx`, `frontend/src/App.jsx`, `frontend/index.html`, `frontend/vite.config.js`.

### Database / Schema

- Created the initial `backend/prisma/schema.prisma` with the `datasource` block pointing to `DATABASE_URL` and the `generator` block for `@prisma/client`.
- Defined placeholder models for `User`, `Company`, `Ledger`, `StockItem`, `PurchaseVoucher`, and `SalesVoucher` — to be refined before migration.

### Files Changed

#### Backend

| File | Change |
|------|--------|
| `backend/package.json` | NEW — initialized with dependencies |
| `backend/.env` | NEW — environment variable placeholders |
| `backend/.gitignore` | NEW |
| `backend/app.js` | NEW — Express boilerplate |
| `backend/prisma/schema.prisma` | NEW — initial model definitions |
| `backend/controllers/*.js` | NEW — placeholder controller files |
| `backend/routes/*.js` | NEW — placeholder route files |
| `backend/middleware/authMiddleware.js` | NEW — placeholder |
| `backend/lib/prisma.js` | NEW — Prisma client singleton |

#### Frontend

| File | Change |
|------|--------|
| `frontend/package.json` | NEW — Vite + React scaffold |
| `frontend/vite.config.js` | NEW — Vite config |
| `frontend/index.html` | NEW — HTML entry point |
| `frontend/src/main.jsx` | NEW — React root |
| `frontend/src/App.jsx` | NEW — App shell placeholder |
| `frontend/src/index.css` | NEW — Global styles |

### Dev Commands

```bash
# Backend setup
cd backend
npm init -y
npm install express @prisma/client prisma cookie-parser bcryptjs jsonwebtoken cors dotenv

# Frontend setup (Vite + React)
cd frontend
npm create vite@latest . -- --template react
npm install
npm install react-router-dom axios @reduxjs/toolkit react-redux

# Verify dev server
npm run dev
```

### Pending Tasks

- Define final Prisma models before running the first migration.
- Wire Express routes and middleware in `app.js`.
- Configure CORS and cookie settings for the local dev environment.

### Resume Notes

- **Current state:** Both backend and frontend projects are scaffolded and dependencies are installed. No migrations or server implementations have been completed yet.
- **Next step:** Define the Prisma schema fully and run the first migration (`npx prisma migrate dev`).

---

## 22-06-2026

### Summary

Applied the first Prisma migration to create the database schema, verified Prisma config and client setup, confirmed server wiring and auth middleware, and scaffolded the backend controller layer. Frontend entry points were reviewed.

---

### Backend

- Applied Prisma migration: `npx prisma migrate dev` (ran in `backend` terminal; exit code 0).
- Updated/verified Prisma config and client in `backend/config/prisma.js` and `backend/prisma.config.ts`.
- Migrated schema source: `backend/prisma/schema.prisma`.
- Confirmed server wiring and auth middleware in `backend/app.js` and `backend/middleware/authMiddleware.js`.
- Worked on/updated controllers:
  - `backend/controllers/authController.js`
  - `backend/controllers/companyController.js`
  - `backend/controllers/ledgerController.js`
  - `backend/controllers/purchaseController.js`
  - `backend/controllers/salesController.js`
  - `backend/controllers/stockController.js`

### Frontend

- Checked frontend scaffolding and entry points: `frontend/src/main.jsx`, `frontend/src/App.jsx`.
- Styles and assets reviewed: `frontend/src/index.css`, `frontend/App.css`.
- Project config reviewed: `frontend/package.json`, `frontend/vite.config.js`, `frontend/index.html`.

### Database / Schema

- First successful migration applied — database tables created for all defined models.
- Prisma client generated and available for use in controllers.

### Files Changed

| File | Area |
|------|------|
| `backend/config/prisma.js` | Backend — Prisma config |
| `backend/prisma.config.ts` | Backend — Prisma config |
| `backend/prisma/schema.prisma` | Backend — Schema (migrated) |
| `backend/controllers/authController.js` | Backend — Controller scaffolded |
| `backend/controllers/companyController.js` | Backend — Controller scaffolded |
| `backend/controllers/ledgerController.js` | Backend — Controller scaffolded |
| `backend/controllers/purchaseController.js` | Backend — Controller scaffolded |
| `backend/controllers/salesController.js` | Backend — Controller scaffolded |
| `backend/controllers/stockController.js` | Backend — Controller scaffolded |
| `frontend/src/main.jsx` | Frontend — Entry reviewed |
| `frontend/src/App.jsx` | Frontend — Entry reviewed |

### Dev Commands

```bash
# Apply migration and open Prisma Studio
cd backend
npx prisma migrate dev
npx prisma studio

# Start servers
cd backend
node app.js

cd frontend
npm run dev
```

### Resume Notes

- **Last completed milestone:** Prisma migration applied; schema/config verified; controller files scaffolded.
- **Exact stop point:** Backend implementation had not yet moved past the scaffolded API layer — the server entry point, controllers, routes, and auth middleware were still in a pending/unfinished state.
- **Current status:** Prisma schema layer is in place, but backend route/controller implementation and frontend integration work remain pending.
- **Next step:** Continue from the backend API surface; do not repeat the migration/schema work.

---

## 23-06-2026

### Summary

Focused verification session — confirmed the database connection, reviewed the auth and company route chains end-to-end, and validated that the `isLoggedIn` middleware is correctly attached. No code changes made; documentation-only session.

---

### Backend

- Established and verified the database connection through `backend/lib/prisma.js` using the Prisma adapter and the Postgres pool.
- Checked the backend entry wiring in `backend/app.js` and confirmed the Prisma client is imported and the auth/company route groups are mounted.
- Verified the auth route chain in `backend/routes/authRoutes.js` for **register**, **login**, and **logout** endpoints.
- Verified the company route chain in `backend/routes/companyRoutes.js` and confirmed the `isLoggedIn` middleware is attached before the company CRUD handlers.
- Reviewed the matching controller and middleware flow in:
  - `backend/controllers/authController.js`
  - `backend/controllers/companyController.js`
  - `backend/middleware/authMiddleware.js`

### Frontend

- No frontend work was updated in this session.

### Files Changed

| File | Note |
|------|------|
| `backend/app.js` | Reviewed — route mounting confirmed |
| `backend/lib/prisma.js` | Reviewed — DB connection verified |
| `backend/routes/authRoutes.js` | Reviewed — register/login/logout chain confirmed |
| `backend/routes/companyRoutes.js` | Reviewed — `isLoggedIn` middleware confirmed |
| `backend/controllers/authController.js` | Reviewed |
| `backend/controllers/companyController.js` | Reviewed |
| `backend/middleware/authMiddleware.js` | Reviewed |
| `daily/2026-06-23.md` | Documentation updated |

### Dev Commands

- No new commands were run in this session.

### Resume Notes

- **Last completed milestone:** Backend connection pass — database connection, auth routes, and company route wiring were checked and confirmed.
- **Exact stop point:** Remaining unreviewed backend surface outside the routes/controllers listed above.
- **Next step:** Continue with any remaining backend folders or endpoint checks before moving on.

### Session Notes

- Updated the daily documentation to match the actual backend work completed today.
- Recorded the database connection verification plus auth and company route wiring.
- Kept this session documentation-only; no code changes were made.

---

## 24-06-2026

### Summary

Continued from the 23-06-2026 backend milestone. Completed the full backend coding pass for all six route domains (auth, company, ledger, purchase, sales, stock) and verified every endpoint through Postman.

---

### Backend

- Implemented and finalized the backend API layer for **auth**, **company**, **ledger**, **purchase**, **sales**, and **stock** flows.
- Verified and exercised route wiring for:
  - `authRoutes.js`
  - `companyRoutes.js`
  - `ledgerRoutes.js`
  - `purchaseRoutes.js`
  - `salesRoutes.js`
  - `stockRoutes.js`
- Updated backend controller behavior in:
  - `authController.js`
  - `companyController.js`
  - `ledgerController.js`
  - `purchaseController.js`
  - `salesController.js`
  - `stockController.js`
- Confirmed the company update path handles `gstNo` input as tested through Postman.

### Frontend

- No frontend work was updated today.

### Database / Schema

- No schema or migration work was performed today.
- Prisma schema and migration history remain unchanged from the 22-06-2026 migration.

### Files Changed

| File | Area |
|------|------|
| `backend/routes/authRoutes.js` | Backend — Routes finalized |
| `backend/routes/companyRoutes.js` | Backend — Routes finalized |
| `backend/routes/ledgerRoutes.js` | Backend — Routes finalized |
| `backend/routes/purchaseRoutes.js` | Backend — Routes finalized |
| `backend/routes/salesRoutes.js` | Backend — Routes finalized |
| `backend/routes/stockRoutes.js` | Backend — Routes finalized |
| `backend/controllers/authController.js` | Backend — Controller implemented |
| `backend/controllers/companyController.js` | Backend — Controller implemented |
| `backend/controllers/ledgerController.js` | Backend — Controller implemented |
| `backend/controllers/purchaseController.js` | Backend — Controller implemented |
| `backend/controllers/salesController.js` | Backend — Controller implemented |
| `backend/controllers/stockController.js` | Backend — Controller implemented |
| `daily/2026-06-24.md` | Documentation |

### Bugs & Fixes

| Bug | Fix Applied |
|-----|-------------|
| Company update flow did not handle `gstNo` field correctly | Adjusted company update flow so `gstNo` can be exercised correctly from Postman |

### Testing Performed

- Tested all backend routes in Postman after completing the coding pass.
- Verified the auth and company flows plus the related ledger, purchase, sales, and stock endpoints.

### Pending Tasks

- Continue with any remaining backend endpoint refinement or validation not covered in the Postman pass.
- Avoid repeating the already verified route checks when resuming.
- Begin frontend application development in the next session.

### Resume Notes

- **Exact stop point:** After the backend coding pass and Postman verification of the API routes.
- **Current state:** Backend route layer is actively implemented and has been exercised through Postman; frontend work and schema changes were not part of this session.

### Session Notes

- Cross-checked the previous daily files for continuity and corrected today's note to match the real backend work.
- Replaced earlier placeholder status with the actual coding and Postman testing summary.

---

## 25-06-2026

### Summary

Continued from the 24-06-2026 backend pass. Added the dashboard and reports backend API endpoints (with authentication-aware aggregation), then built the first half of the frontend application shell — authentication flow, layout infrastructure, Redux store, shared Axios client, and the dashboard page UI.

---

### Backend

- Added **dashboard API** support so the app can show company-level metrics from the backend.
- Wired the new dashboard route into the Express app and protected it with the existing `isLoggedIn` middleware.
- Implemented the **dashboard controller** to aggregate customer count, supplier count, stock item count, purchase totals, sales totals, and low-stock alerts for the active company.
- Kept the existing auth, company, ledger, purchase, sales, and stock APIs in place while extending the backend surface.
- Updated the backend application entry (`app.js`) to register the new dashboard route alongside the existing route groups.
- Refined the backend auth layer while keeping the cookie-based login flow and authenticated company context in place.
- Added a **reports endpoint** so the frontend can load customer, supplier, stock, sales, and purchase summaries for the active company.
- Tightened purchase and sales transaction payload handling so quantity, rate, and totals are normalized before voucher creation.

### Frontend

- Started the frontend application shell and routing structure for the **SmartERP UI**.
- Added the main protected route layout with outlet-based composition — unauthenticated users are redirected to login.
- Connected top-level page routes for: Login, Register, Dashboard, Company management, Ledgers, Inventory, Vouchers, and Reports.
- Built the main app shell components:
  - **`Sidebar.jsx`** — navigation links for each module
  - **`Navbar.jsx`** — top bar with company context and logout
  - **`Breadcrumb.jsx`** — dynamic breadcrumb based on active route
  - **`MainLayout.jsx`** — wraps the outlet with Sidebar + Navbar
- Added the shared **Axios client** (`https/axios.js`) with `withCredentials: true` so all frontend requests carry the backend session cookie.
- Added the **Redux auth slice** (`authSlice.js`) and Redux store (`store.js`) with `login`, `register`, and `logout` async thunks.
- Built the **Dashboard page UI** (`Dashboard.jsx`) — pulls metrics for the selected company and displays top-level totals (customers, suppliers, stock, purchases, sales) plus a low-stock alert panel.
- Shaped the **Login** (`Login.jsx`) and **Register** (`Register.jsx`) pages for the authentication flow.

### Database / Schema

- No schema migration was added today.
- The dashboard work reads from existing company, ledger, stock, purchase, and sales models already present in Prisma.

### Files Changed

#### Backend

| File | Description |
|------|-------------|
| `backend/app.js` | Registered dashboard & report routes |
| `backend/controllers/dashboardController.js` | NEW — aggregates company-level metrics |
| `backend/controllers/authController.js` | Auth layer refinement |
| `backend/controllers/ledgerController.js` | Updated |
| `backend/controllers/reportController.js` | NEW — customer/supplier/stock/sales/purchase summaries |
| `backend/controllers/purchaseController.js` | Payload normalization (qty, rate, totals) |
| `backend/controllers/salesController.js` | Payload normalization (qty, rate, totals) |
| `backend/routes/dashboardRoutes.js` | NEW — dashboard route, auth-protected |
| `backend/routes/reportRoutes.js` | NEW — report route, auth-protected |

#### Frontend

| File | Description |
|------|-------------|
| `frontend/src/App.jsx` | App shell, protected routing, page connections |
| `frontend/src/pages/Login.jsx` | Login page |
| `frontend/src/pages/Register.jsx` | Register page |
| `frontend/src/pages/Dashboard.jsx` | Dashboard UI — metrics and low-stock alerts |
| `frontend/src/components/layout/Sidebar.jsx` | Navigation sidebar |
| `frontend/src/components/layout/Navbar.jsx` | Top navbar with company context |
| `frontend/src/components/layout/Breadcrumb.jsx` | Dynamic breadcrumb |
| `frontend/src/components/layout/MainLayout.jsx` | Layout shell wrapping outlet |
| `frontend/src/https/axios.js` | Shared Axios client (credentials enabled) |
| `frontend/src/redux/slices/authSlice.js` | Redux auth slice — login/register/logout |
| `frontend/src/redux/store.js` | Redux store |
| `frontend/package.json` / `package-lock.json` | Dependency updates |

### Bugs & Fixes

| Bug | Fix Applied |
|-----|-------------|
| Dashboard route context mismatch | Route added to match existing authenticated company context |
| Payload values (qty, rate, totals) inconsistent on voucher creation | Normalized in `purchaseController` and `salesController` before DB write |

### Testing Performed

- No explicit automated test run recorded.
- Dashboard route and frontend wiring reviewed as part of the implementation pass.
- Login/Register forms manually exercised against the auth endpoints.
- Dashboard metrics confirmed to display correctly for the active company.

### Pending Tasks

- Build remaining frontend pages: Company screens, Ledger/Item masters, Voucher forms, Reports, PrintInvoice, and shortcut navigation.
- Continue validating the dashboard data flow against the active company context.

### Resume Notes / Handoff

- **Exact stop point:** Backend dashboard and reports endpoints added; frontend shell built through the Dashboard page.
- **Current state:** Backend exposes dashboard and report metrics. Frontend has protected routing, layout shell, Redux auth, and dashboard UI.
- **Next session:** Build the Company, Ledger, Stock, Voucher, Reports, and Print Invoice pages; add shortcut navigation hooks.

---

## 26-06-2026

### Summary

Continued from the 25-06-2026 handoff. Built all remaining frontend pages and feature modules: company management screens, ledger and stock item masters, purchase and sales voucher forms, voucher selection, initial reports page, initial print invoice page, and the keyboard shortcut navigation layer.

This session completes the full frontend page surface established from the original June 25 repository history (second commit pass of that day).

---

### Backend

- No new backend endpoints were added today.
- Backend remained in the state established on 25-06-2026 (dashboard + reports endpoints active, all six core API domains live).

### Frontend

#### Company Management
- Built the **company selection screen** (`CompanyList.jsx`) — lists companies for the logged-in user with create, select, edit, and delete actions.
- Built the **company form** (`CompanyForm.jsx`) — create and edit a company with name, address, GSTIN, and financial year fields.
- Updated the auth slice so **logout also clears the active company context** from local storage.

#### Ledger & Stock Item Masters
- Added the **ledger master list** (`LedgerList.jsx`) — search, create, edit, and delete ledger entries scoped to the active company.
- Added the **ledger form** (`LedgerForm.jsx`) — create/edit a ledger with name, group, and opening balance.
- Added the **stock item master list** (`ItemList.jsx`) — search, create, edit, and delete stock items for the active company.
- Added the **stock item form** (`ItemForm.jsx`) — create/edit a stock item with name, unit, and opening quantity.

#### Voucher Forms
- Added the **purchase voucher form** (`PurchaseVoucherForm.jsx`) — dynamic line-item rows, supplier selection, master-data loading, and submission to the purchase endpoint.
- Added the **sales voucher form** (`SalesVoucherForm.jsx`) — dynamic rows, customer selection, stock-aware pricing, client-side stock validation (blocks submission when requested qty exceeds available stock), and submission to the sales endpoint.
- Added the **voucher selection screen** (`VoucherSelection.jsx`) — routes users into either purchase or sales entry with a single keypress.

#### Reports & Print Invoice
- Added the **report screen** (`Reports.jsx`) — tabbed views for customers, suppliers, stock, sales, and purchases, with print support.
- Added the **invoice print page** (`PrintInvoice.jsx`) — renders a sales voucher in printable format using the loaded sale and company context.

#### Keyboard Shortcut Navigation
- Added the **shortcut sidebar** (`ShortcutSidebar.jsx`) — displays available F-key shortcuts in the layout.
- Added the `useShortcuts.js` hook — handles F-key bindings for navigating between modules.
- Added the `useFormNavigation.js` hook — handles Tab/Shift-Tab, arrow keys, and Enter within forms for Tally-like keyboard-driven data entry.
- Added the `useGlobalShortcuts.js` hook — global shortcut listener (later consolidated in the next session).
- Refined `MainLayout.jsx` to include the `ShortcutSidebar` panel alongside the main outlet.

### Database / Schema

- No schema migration today.
- Sales voucher validation reads from existing stock models; no schema changes needed.

### Files Changed

#### Frontend

| File | Description |
|------|-------------|
| `frontend/src/pages/CompanyList.jsx` | Company list/select screen |
| `frontend/src/pages/CompanyForm.jsx` | Company create/edit form |
| `frontend/src/pages/LedgerList.jsx` | Ledger master list |
| `frontend/src/pages/LedgerForm.jsx` | Ledger create/edit form |
| `frontend/src/pages/ItemList.jsx` | Stock item master list |
| `frontend/src/pages/ItemForm.jsx` | Stock item create/edit form |
| `frontend/src/pages/PurchaseVoucherForm.jsx` | Purchase voucher entry |
| `frontend/src/pages/SalesVoucherForm.jsx` | Sales voucher entry (stock validation, print flow) |
| `frontend/src/pages/VoucherSelection.jsx` | Voucher type selection screen |
| `frontend/src/pages/Reports.jsx` | Tabbed reports page (initial version) |
| `frontend/src/pages/PrintInvoice.jsx` | Printable invoice page (initial version) |
| `frontend/src/components/layout/ShortcutSidebar.jsx` | Keyboard shortcut panel |
| `frontend/src/components/layout/MainLayout.jsx` | Updated — includes ShortcutSidebar |
| `frontend/src/hooks/useShortcuts.js` | F-key shortcut hook |
| `frontend/src/hooks/useFormNavigation.js` | Arrow/Enter form navigation hook |
| `frontend/src/hooks/useGlobalShortcuts.js` | Global shortcut listener (to be consolidated) |
| `frontend/src/redux/slices/authSlice.js` | Logout clears active company from local storage |

### Bugs & Fixes

| Bug | Fix Applied |
|-----|-------------|
| Company/ledger forms not scoped to active company | Aligned active `companyId` context so all route calls stay scoped correctly |
| Sales voucher quantity overrun | Submission blocked client-side when requested qty exceeds available stock |
| Print invoice output used wrong company data | Print flow now loads and uses the active company context, not a stale value |

### Testing Performed

- No explicit automated test run recorded.
- Purchase and sales voucher forms manually checked against the backend master-data endpoints (suppliers, customers, stock items).
- Report tabs, voucher selection flow, and print invoice page reviewed against the updated frontend layout.
- Keyboard shortcut navigation tested across module transitions.

### Pending Tasks

- Polish the Reports page with keyboard navigation (row selection, Up/Down/Enter).
- Overhaul the PrintInvoice page to match professional ERP/Tally output style.
- Consolidate overlapping shortcut hooks to eliminate duplicate event triggers.
- Extract form fields into reusable components (`ItemFormFields`, `LedgerFormFields`).
- Scope all backend controllers to `companyId` explicitly (security pass).

### Resume Notes / Handoff

- **Exact stop point:** All frontend pages are in place; the keyboard shortcut foundation is built.
- **Current state:** Full frontend page surface complete; shortcut hooks exist but need consolidation; backend security scoping not yet enforced.
- **Next session:** UI/UX polish pass — Reports keyboard nav, PrintInvoice layout overhaul, shortcut consolidation, backend security scoping, and minor UX bug fixes.

---

## 27-06-2026

### Summary

Continued from the 26-06-2026 handoff. Entirely focused on **UI/UX refinements**, keyboard-driven navigation polish, and improving report/print invoice aesthetics. Also refactored backend reporting queries for performance, and enforced `companyId` security scoping across all controllers.

Key highlights:
- Overhauled Print Invoice layout to align with traditional ERP/Tally output style.
- Added deep keyboard navigation (Up/Down/Enter) to the Reports page.
- Consolidated and simplified the global shortcut hook system.
- Refactored dashboard queries to use Prisma `.count()` / `.aggregate()`.
- Enforced `companyId` scoping across all primary controllers.
- Fixed `CompanyForm` keyboard navigation regression.
- Extracted `ItemFormFields` and `LedgerFormFields` into reusable components.

---

### Backend

- Refactored `dashboardController.js` to utilize Prisma's native `.count()` and `.aggregate()` methods for cleaner and more performant metric calculations.
- Updated `reportController.js` to fetch comprehensive relational data:
  - Sales vouchers now include **customer details** via Prisma `include` clauses.
  - Purchase vouchers now include **supplier details** via Prisma `include` clauses.
- Verified all report routes in `reportRoutes.js` are securely protected behind the existing `authMiddleware`.
- Scoped all primary controllers explicitly to `companyId` to prevent **cross-company data leakage**:
  - `ledgerController`
  - `purchaseController`
  - `reportController`
  - `salesController`
  - `stockController`

### Frontend

#### Print Invoice
- Overhauled `PrintInvoice.jsx` with a clean, professional ERP-style layout featuring improved typography, spacing, and a standardized tabular structure for line items.

#### Reports Page
- Enhanced `Reports.jsx` with deep keyboard navigation support:
  - Added row-level selection state and visual highlighting (blue background for selected rows).
  - Implemented keyboard event listeners (Up/Down arrows, Enter) for mouse-free navigation.
  - Allowed direct navigation to the print invoice view by pressing `Enter` on a selected sales voucher row.
  - Added loading states and empty state fallbacks for all tables.

#### Shortcut & Navigation System
- Refined `useFormNavigation.js` and `useShortcuts.js` custom hooks.
- **Removed** the redundant `useGlobalShortcuts.js` hook entirely — shortcut logic fully consolidated into `useShortcuts.js`.
- Wrapped the app in a `<ShortcutProvider>` for more robust global shortcut handling.
- Refined `useFormNavigation` for better `SELECT` dropdown and `INPUT` escape logic.

#### Layout & Component Refactoring
- Updated `MainLayout.jsx`, `Sidebar.jsx`, and `ShortcutSidebar.jsx` for a cleaner visual hierarchy and better presentation of available F-key shortcuts to the user.
- Separated form fields into dedicated reusable components:
  - `ItemFormFields.jsx` — extracted from `ItemForm.jsx`
  - `LedgerFormFields.jsx` — extracted from `LedgerForm.jsx`
- Updated `ItemForm.jsx` to display live stock quantity natively.
- Refined `CompanyForm.jsx` UI/UX:
  - Combined the "Back to Companies" button and "ESC" shortcut indicator into a single, unified styled box.
  - Fixed keyboard navigation regression by updating the root container to `<main>`, allowing `useFormNavigation` to detect form elements correctly.
- Added `.rejected` logout toast handling in `authSlice.js`.

### Database / Schema

- No schema migrations today. Existing Prisma models were used.

### Files Changed

#### Backend

| File | Change |
|------|--------|
| `backend/app.js` | Updated |
| `backend/controllers/dashboardController.js` | Refactored — Prisma `.count()` / `.aggregate()` |
| `backend/controllers/ledgerController.js` | Scoped to `companyId` |
| `backend/controllers/purchaseController.js` | Scoped to `companyId` |
| `backend/controllers/reportController.js` | Added relational `include` clauses |
| `backend/controllers/salesController.js` | Scoped to `companyId` |
| `backend/controllers/stockController.js` | Scoped to `companyId` |
| `backend/routes/reportRoutes.js` | Auth middleware verified |
| `backend/tsconfig.json` | Updated |

#### Frontend

| File | Change |
|------|--------|
| `frontend/src/App.jsx` | Updated |
| `frontend/src/main.jsx` | `<ShortcutProvider>` wrapper added |
| `frontend/src/components/itemForm/ItemFormFields.jsx` | NEW — extracted item form fields |
| `frontend/src/components/layout/MainLayout.jsx` | Visual hierarchy refinements |
| `frontend/src/components/layout/ShortcutSidebar.jsx` | F-key shortcut presentation updated |
| `frontend/src/components/layout/Sidebar.jsx` | Updated |
| `frontend/src/components/ledgerForm/LedgerFormFields.jsx` | NEW — extracted ledger form fields |
| `frontend/src/components/reports/CustomerReport.jsx` | Updated |
| `frontend/src/hooks/useFormNavigation.js` | Refined SELECT/INPUT escape logic |
| `frontend/src/hooks/useGlobalShortcuts.js` | **DELETED** — logic consolidated |
| `frontend/src/hooks/useShortcuts.js` | Refined — now the single shortcut authority |
| `frontend/src/pages/CompanyForm.jsx` | Unified back button + ESC, `<main>` root for keyboard nav |
| `frontend/src/pages/ItemForm.jsx` | Live stock quantity display added |
| `frontend/src/pages/PrintInvoice.jsx` | ERP-style layout overhaul |
| `frontend/src/pages/Reports.jsx` | Keyboard nav, row highlighting, empty states |
| `frontend/src/redux/slices/authSlice.js` | `.rejected` logout toast handling |
| `daily/2026-06-25.md` | Updated |

### Bugs & Fixes

| Bug | Fix Applied |
|-----|-------------|
| Reports showed empty/broken UI when no data returned | Added empty state fallbacks to all report tables |
| Duplicate keyboard shortcut event triggers from overlapping hooks | Consolidated hooks; removed `useGlobalShortcuts.js` entirely |
| `ItemFormFields` displayed `0` in number inputs by default | Masked with `\|\| ''` for better UX |
| `CompanyForm` keyboard navigation (arrow keys/Enter) unresponsive | Scoped layout root to `<main>` so `useFormNavigation` can detect form elements |

### Testing Performed

- Manually tested keyboard navigation within the Reports page (Up, Down, Enter).
- Validated the new Invoice Print layout using sample sales voucher data.
- Checked dashboard metric calculations after the Prisma aggregate refactoring.

### Pending Tasks

- Move towards implementing remaining frontend pages and more complex voucher types (e.g., contra, payment, receipt) if required by the feature roadmap.
- Conduct an **end-to-end user flow test** to ensure keyboard-driven UX holds up consistently across all entry forms and reports.
- Prepare backend and frontend for deployment.

### Resume Notes

- Frontend now has a highly polished Report and Print Invoice experience with robust keyboard navigation.
- Component structure for Item and Ledger forms has been refactored for reusability.
- Backend queries for reports and dashboards are optimized and tightly scoped to `companyId` for security.
- **Next session:** Deployment preparation — config refactoring, schema push, Vercel setup, and git pushes.

---

## 28-06-2026

### Summary

Resumed from 27-06-2026 notes. Focused entirely on **deployment preparation** and **backend configuration refactoring**. Migrated Prisma config from TypeScript to JavaScript, synchronized the database with `npx prisma db push`, updated authentication and company controllers, and pushed both frontend and backend to `origin/main`. Configured the frontend for Vercel deployment.

---

### Backend

- **Prisma config transition:** Migrated configuration from TypeScript to JavaScript:
  - `backend/prisma.config.ts` deleted.
  - `backend/prisma.config.js` created as the replacement.
- **Schema update:** Updated `backend/prisma/schema.prisma` and executed `npx prisma db push` to synchronize the live database without creating a new migration file.
- Refactored/updated core backend files:
  - `backend/app.js` — refined entry point
  - `backend/controllers/authController.js` — updated auth logic
  - `backend/controllers/companyController.js` — updated company management logic
  - `backend/middleware/authMiddleware.js` — updated middleware
  - `backend/lib/prisma.js` — updated Prisma client singleton
- Updated `backend/package.json` and `backend/.gitignore`.
- Committed and pushed all backend changes to `origin/main`.

### Frontend

- **Deployment config:** Added `frontend/vercel.json` to configure Vercel SPA routing (rewrites all paths to `index.html`).
- **Environment:** Added a local `frontend/.env` file for environment variable management (e.g., `VITE_API_URL`).
- **API handling:** Updated `frontend/src/https/axios.js` to use the environment-variable-based API base URL instead of a hardcoded localhost address.
- Modified `frontend/src/pages/CompanyList.jsx` — minor updates to company listing behavior.
- Committed and pushed all frontend changes to `origin/main`.

### Files Changed

| File | Change |
|------|--------|
| `backend/prisma.config.ts` | **DELETED** |
| `backend/prisma.config.js` | **NEW** — JavaScript replacement |
| `backend/prisma/schema.prisma` | Updated and pushed to DB |
| `backend/app.js` | Refactored |
| `backend/controllers/authController.js` | Updated |
| `backend/controllers/companyController.js` | Updated |
| `backend/middleware/authMiddleware.js` | Updated |
| `backend/lib/prisma.js` | Updated |
| `backend/package.json` | Updated |
| `backend/.gitignore` | Updated |
| `frontend/vercel.json` | **NEW** — Vercel SPA routing config |
| `frontend/.env` | **NEW** — environment variables (local) |
| `frontend/src/https/axios.js` | Base URL now reads from `VITE_API_URL` env var |
| `frontend/src/pages/CompanyList.jsx` | Minor updates |

### Dev Commands

```bash
# Synchronize database schema without creating a migration
cd backend
npx prisma db push

# Push backend changes to remote
git add .
git commit -m "chore: deployment prep — Prisma JS config, schema push, controller updates"
git push origin main

# Push frontend changes to remote
cd frontend
git add .
git commit -m "chore: Vercel config, env, axios base URL update"
git push origin main
```

### Pending Tasks

- Validate the deployed frontend on Vercel — verify that SPA routing works correctly.
- Validate the new authentication flows and company listings on the live frontend.
- Conduct an end-to-end test of the full user journey on the deployed environment.

### Resume Notes

- **Exact stop point:** Both frontend and backend pushed to `origin/main`; Vercel deployment config in place.
- **Current state:** The application is deployed (or ready to deploy). All configuration changes are committed.
- **Next session:** Post-deployment validation — test live auth, company management, vouchers, and reports end-to-end.

---

## 29-06-2026


### Summary

Post-deployment validation day. Verified the live Vercel frontend against the backend, ran end-to-end user flow tests covering authentication, company management, ledger/stock masters, voucher entry, reports, and print invoice. Updated the project README with current setup and deployment instructions.

---

### Backend

- No new backend code changes made today.
- Monitored backend server logs for any errors surfaced during live frontend testing.
- Confirmed all API endpoints respond correctly when called from the deployed Vercel frontend (CORS and cookie settings verified in production context).

### Frontend

- Validated the Vercel deployment — SPA routing via `vercel.json` rewrites confirmed working (deep-link routes load correctly on refresh).
- Tested the `VITE_API_URL` environment variable — confirmed the Axios client resolves to the correct production backend URL.
- Manually walked through the full user journey on the live deployment:
  - Register a new user → Login → Select/create a company
  - Create ledgers (customer, supplier) and stock items
  - Enter a purchase voucher → verify stock levels update
  - Enter a sales voucher → verify stock validation blocks over-sale
  - View Reports tabs (customers, suppliers, stock, sales, purchases)
  - Open Print Invoice from a sales voucher → verify ERP-style layout renders correctly
  - Test F-key shortcuts and arrow-key form navigation across all entry screens
  - Logout → verify active company context cleared from local storage

### Files Changed

| File | Change |
|------|--------|
| `README.md` | Updated — added setup, env config, and deployment instructions |
| `backend/README.md` | Updated — documented backend start command and environment variables |
| `frontend/README.md` | Updated — documented frontend dev and Vercel deployment steps |

### Dev Commands

```bash
# Verify local environment still works after deployment changes
cd backend
node app.js

cd frontend
npm run dev

# Check Prisma schema against the live database
cd backend
npx prisma studio
```

### Bugs & Fixes

| Bug | Fix Applied |
|-----|-------------|
| Deep-link routes returned 404 on Vercel refresh | Confirmed fixed by `vercel.json` rewrite rule added on 28-06-2026 |
| Production API URL not resolving | Confirmed `VITE_API_URL` set correctly in Vercel environment variables dashboard |

### Testing Performed

- End-to-end manual walkthrough of the complete user journey on the live Vercel deployment.
- Verified keyboard navigation (F-keys, arrow keys, Enter) across all form screens on the deployed build.
- Confirmed Reports keyboard navigation (row selection, Enter → PrintInvoice) works in production.
- Validated dashboard metric counts against known test data in the live database.

### Pending Tasks

- Implement remaining complex voucher types (contra, payment, receipt) as required by the feature roadmap.
- Add automated integration or end-to-end tests (e.g., Playwright or Cypress) to prevent regression on future deploys.
- Review and harden error handling across all API controllers for production edge cases.
- Consider adding rate limiting and input sanitization middleware to the backend.

### Resume Notes

- **Current state:** Application is live on Vercel; all core flows (auth, company, masters, vouchers, reports, print) verified end-to-end.
- **Next phase:** Feature expansion (additional voucher types) and test automation.

---

*Last updated: 29-06-2026 | Author: Indrasish*
