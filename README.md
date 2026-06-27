# SmartERP

> A full-stack, Tally-inspired ERP system for small businesses — manage companies, ledgers, inventory, purchase & sales vouchers, and financial reports from a single platform.

![React](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express_5-000000?style=for-the-badge&logo=express&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![Redux Toolkit](https://img.shields.io/badge/Redux_Toolkit-764ABC?style=for-the-badge&logo=redux&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS_4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Vercel](https://img.shields.io/badge/Frontend-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)
![Railway](https://img.shields.io/badge/Backend-Railway-0B0D0E?style=for-the-badge&logo=railway&logoColor=white)
![License](https://img.shields.io/badge/License-ISC-blue?style=for-the-badge)

---

## 🌐 Live Demo

| Layer | URL |
|-------|-----|
| Frontend | [https://smarterp-one.vercel.app](https://smarterp-one.vercel.app) |
| Backend API | [https://smarterp-backend-production-6f3c.up.railway.app](https://smarterp-backend-production-6f3c.up.railway.app) |

---

## ✨ Features

- 🔐 **Cookie-based JWT authentication** — secure register, login, and logout
- 🏢 **Multi-company support** — one account, unlimited companies, fully isolated data
- 📒 **Ledger management** — create and manage customer and supplier accounts with opening balances
- 📦 **Inventory / Stock management** — items with SKU, unit, GST rate, purchase/selling price, and live stock quantity
- 🧾 **Purchase vouchers** — multi-line entry with automatic stock increment and supplier ledger update
- 🛒 **Sales vouchers** — multi-line entry with automatic stock decrement and customer ledger update
- 🖨️ **Print-ready invoices** — formatted invoice view with browser print support
- 📊 **Dashboard** — real-time KPI cards for total sales, total purchases, and outstanding balances
- 📑 **Five report types** — customers outstanding, suppliers outstanding, stock summary, sales register, purchase register
- ⌨️ **Keyboard-first UX** — Tally-style keyboard shortcuts and Tab/Enter form navigation
- 🔔 **Glassmorphic toast notifications** — dark-mode alerts via `react-toastify`
- ☁️ **Production deployment** — Frontend on Vercel, Backend on Railway, Database on Neon (serverless PostgreSQL)

---

## 🏗️ System Architecture

```mermaid
graph TD
  User["👤 User (Browser)"] --> FE["⚛️ React + Vite\nVercel CDN"]

  FE -->|"HTTP REST\nwithCredentials (JWT cookie)"| BE["🚀 Express 5 API\nRailway  :8080"]

  BE --> MW["🔐 isLoggedIn\nJWT Middleware"]
  MW --> CTR["🎛️ Controllers"]

  CTR -->|"Prisma ORM\n(PrismaPg adapter)"| DB[("🐘 PostgreSQL\nNeon Serverless")]

  subgraph Frontend ["Frontend — src/"]
    Redux["Redux Store\nauthSlice"]
    Pages["Pages\n14 views"]
    Hooks["Custom Hooks\nuseShortcuts\nuseFormNavigation"]
    AxiosCfg["Axios Instance\nVITE_API_URL"]
  end

  subgraph Backend ["Backend — /"]
    Auth["authController"]
    Company["companyController"]
    Ledger["ledgerController"]
    Stock["stockController"]
    Purchase["purchaseController"]
    Sales["salesController"]
    Dashboard["dashboardController"]
    Report["reportController"]
  end

  FE --- Frontend
  BE --- Backend
```

---

## 🗄️ Database Schema (ER Diagram)

```mermaid
erDiagram
  User {
    Int id PK
    String name
    String email
    String password
    DateTime createdAt
    DateTime updatedAt
  }

  Company {
    Int id PK
    String name
    String gstNo
    String financialYear
    Int userId FK
    DateTime createdAt
    DateTime updatedAt
  }

  Ledger {
    Int id PK
    String name
    LedgerType type
    String address
    String mobile
    String gstNo
    Float openingBalance
    Float balance
    Int companyId FK
  }

  StockItem {
    Int id PK
    String name
    String sku
    String unit
    Float purchasePrice
    Float sellingPrice
    Float openingQty
    Float openingValue
    Float quantity
    Float gstRate
    Int companyId FK
  }

  PurchaseVoucher {
    Int id PK
    String voucherNo
    DateTime date
    Float total
    Int supplierId FK
    Int companyId FK
  }

  PurchaseItem {
    Int id PK
    Float qty
    Float rate
    Float amount
    Int voucherId FK
    Int stockItemId FK
  }

  SalesVoucher {
    Int id PK
    String voucherNo
    DateTime date
    Float total
    Int customerId FK
    Int companyId FK
  }

  SalesItem {
    Int id PK
    Float qty
    Float rate
    Float amount
    Int voucherId FK
    Int stockItemId FK
  }

  InventoryTransaction {
    Int id PK
    DateTime date
    TransactionType type
    Float quantity
    Int stockItemId FK
    ReferenceType referenceType
    Int referenceId
  }

  User ||--o{ Company : "owns"
  Company ||--o{ Ledger : "has"
  Company ||--o{ StockItem : "has"
  Company ||--o{ PurchaseVoucher : "has"
  Company ||--o{ SalesVoucher : "has"
  Ledger ||--o{ PurchaseVoucher : "supplier for"
  Ledger ||--o{ SalesVoucher : "customer for"
  PurchaseVoucher ||--o{ PurchaseItem : "contains"
  SalesVoucher ||--o{ SalesItem : "contains"
  StockItem ||--o{ PurchaseItem : "referenced in"
  StockItem ||--o{ SalesItem : "referenced in"
  StockItem ||--o{ InventoryTransaction : "tracked by"
```

> **Enums used:**
> - `LedgerType`: `CUSTOMER` | `SUPPLIER`
> - `TransactionType`: `IN` | `OUT`
> - `ReferenceType`: `PURCHASE` | `SALE`

---

## 📁 Project Structure

```
TALLY_PROJECT/
│
├── frontend/                          # React + Vite SPA
│   ├── index.html
│   ├── vite.config.js                 # Vite + React + TailwindCSS plugins
│   ├── vercel.json                    # SPA rewrite rule (/* → /index.html)
│   ├── eslint.config.js
│   ├── package.json
│   └── src/
│       ├── main.jsx                   # App entry: Redux Provider + BrowserRouter
│       ├── App.jsx                    # Route tree + ProtectedRoute guard
│       ├── index.css                  # Global styles + Tailwind base
│       │
│       ├── https/
│       │   └── axios.js               # Axios instance (baseURL + withCredentials)
│       │
│       ├── redux/
│       │   ├── store.js
│       │   └── slices/
│       │       └── authSlice.js       # isAuthenticated, user state
│       │
│       ├── hooks/
│       │   ├── useShortcuts.js        # Global Tally-style keyboard shortcuts
│       │   └── useFormNavigation.js   # Tab/Enter navigation between form fields
│       │
│       ├── components/
│       │   ├── layout/                # MainLayout (sidebar + Outlet)
│       │   ├── dashboard/
│       │   ├── company/
│       │   ├── comapnyForm/
│       │   ├── ledgerForm/
│       │   ├── ledgerList/
│       │   ├── itemForm/
│       │   ├── itemList/
│       │   ├── purchaseVoucherForm/
│       │   ├── salesVoucherForm/
│       │   ├── voucherSelection/
│       │   ├── reports/
│       │   ├── printInvoice/
│       │   ├── login/
│       │   └── register/
│       │
│       └── pages/
│           ├── Login.jsx
│           ├── Register.jsx
│           ├── Dashboard.jsx
│           ├── CompanyList.jsx
│           ├── CompanyForm.jsx
│           ├── LedgerList.jsx
│           ├── LedgerForm.jsx
│           ├── ItemList.jsx
│           ├── ItemForm.jsx
│           ├── VoucherSelection.jsx
│           ├── PurchaseVoucherForm.jsx
│           ├── SalesVoucherForm.jsx
│           ├── Reports.jsx
│           └── PrintInvoice.jsx
│
└── backend/                           # Node.js + Express REST API
    ├── app.js                         # Entry point: CORS, middleware, route mounting
    ├── prisma.config.js
    ├── tsconfig.json
    ├── package.json
    │
    ├── lib/
    │   └── prisma.js                  # Prisma Client singleton (pg pool + PrismaPg adapter)
    │
    ├── middleware/
    │   └── authMiddleware.js          # JWT cookie verification (isLoggedIn)
    │
    ├── controllers/
    │   ├── authController.js
    │   ├── companyController.js
    │   ├── ledgerController.js
    │   ├── stockController.js
    │   ├── purchaseController.js
    │   ├── salesController.js
    │   ├── dashboardController.js
    │   └── reportController.js
    │
    ├── routes/
    │   ├── authRoutes.js
    │   ├── companyRoutes.js
    │   ├── ledgerRoutes.js
    │   ├── stockRoutes.js
    │   ├── purchaseRoutes.js
    │   ├── salesRoutes.js
    │   ├── dashboardRoutes.js
    │   └── reportRoutes.js
    │
    └── prisma/
        ├── schema.prisma              # 9-model data schema
        └── migrations/               # Prisma migration history
```

---

## ⚡ Quick Start

### Prerequisites

| Tool | Minimum Version |
|------|----------------|
| Node.js | 18.x |
| npm | 9.x |
| PostgreSQL | 15.x (or a Neon/cloud connection URL) |

---

### 1. Clone the Repository

```bash
git clone <repo-url>
cd TALLY_PROJECT
```

---

### 2. Backend Setup

```bash
cd backend
npm install          # installs deps + runs prisma generate (postinstall)
```

Create a `.env` file in the `backend/` folder:

```env
PORT=3000
DATABASE_URL=postgresql://user:password@host:5432/dbname?sslmode=require
JWT_SECRET=your-long-random-secret-here
```

Apply database migrations:

```bash
npx prisma migrate dev
```

Start the dev server:

```bash
npm run dev          # nodemon app.js — auto-reloads on change
```

The API will be running at `http://localhost:3000`.

---

### 3. Frontend Setup

```bash
cd ../frontend
npm install
```

Create a `.env` file in the `frontend/` folder:

```env
VITE_API_URL=http://localhost:3000
```

Start the dev server:

```bash
npm run dev          # vite — HMR at http://localhost:5173
```

---

### Environment Variables Reference

#### Backend (`backend/.env`)

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Port the Express server listens on | `3000` |
| `DATABASE_URL` | Full PostgreSQL connection string | `postgresql://user:pass@host:5432/db?sslmode=require` |
| `JWT_SECRET` | Secret key for signing/verifying JWT tokens | `e0c038...` (64+ char hex) |

#### Frontend (`frontend/.env`)

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Base URL of the backend REST API | `http://localhost:3000` |

---

## 🔌 API Reference

All routes except authentication require a valid JWT delivered as an HTTP-only cookie (`token`).

### 🔑 Authentication

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|:----:|
| POST | `/register` | Register a new user | No |
| POST | `/login` | Login — sets JWT cookie | No |
| POST | `/logout` | Logout — clears JWT cookie | No |

### 🏢 Companies

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|:----:|
| POST | `/company` | Create a new company | Yes |
| GET | `/company` | List all companies for logged-in user | Yes |
| GET | `/company/:id` | Get a company by ID | Yes |
| PUT | `/company/:id` | Update a company | Yes |
| DELETE | `/company/:id` | Delete a company | Yes |

### 📒 Ledgers

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|:----:|
| POST | `/company/:companyId/ledger` | Create a customer or supplier ledger | Yes |
| GET | `/company/:companyId/ledger` | List all ledgers for a company | Yes |
| GET | `/company/:companyId/ledger/:id` | Get a ledger by ID | Yes |
| PUT | `/company/:companyId/ledger/:id` | Update a ledger | Yes |
| DELETE | `/company/:companyId/ledger/:id` | Delete a ledger | Yes |

### 📦 Stock Items

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|:----:|
| POST | `/company/:companyId/item` | Create a stock item | Yes |
| GET | `/company/:companyId/item` | List all stock items | Yes |
| GET | `/company/:companyId/item/:id` | Get a stock item by ID | Yes |
| PUT | `/company/:companyId/item/:id` | Update a stock item | Yes |
| DELETE | `/company/:companyId/item/:id` | Delete a stock item | Yes |

### 🧾 Purchase Vouchers

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|:----:|
| POST | `/company/:companyId/purchase` | Create a purchase voucher (auto-increments stock) | Yes |
| GET | `/company/:companyId/purchase` | List all purchase vouchers | Yes |
| GET | `/company/:companyId/purchase/:id` | Get a voucher with all line items | Yes |

### 🛒 Sales Vouchers

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|:----:|
| POST | `/company/:companyId/sales` | Create a sales voucher (auto-decrements stock) | Yes |
| GET | `/company/:companyId/sales` | List all sales vouchers | Yes |
| GET | `/company/:companyId/sales/:id` | Get a voucher with all line items | Yes |

### 📊 Dashboard

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|:----:|
| GET | `/company/:companyId/dashboard` | Aggregate KPIs — total sales, purchases, outstanding | Yes |

### 📑 Reports

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|:----:|
| GET | `/company/:companyId/reports/customers` | Customers outstanding balances | Yes |
| GET | `/company/:companyId/reports/suppliers` | Suppliers outstanding balances | Yes |
| GET | `/company/:companyId/reports/stock` | Stock summary (qty, value) | Yes |
| GET | `/company/:companyId/reports/sales` | Sales register | Yes |
| GET | `/company/:companyId/reports/purchases` | Purchase register | Yes |

---

## 🗺️ Frontend Routes

| Path | Page | Protected |
|------|------|:---------:|
| `/login` | Login | No |
| `/register` | Register | No |
| `/companies` | Company List | Yes |
| `/company/create` | Create Company | Yes |
| `/company/edit/:id` | Edit Company | Yes |
| `/dashboard` | Dashboard | Yes |
| `/ledgers` | Ledger List | Yes |
| `/ledgers/create` | Create Ledger | Yes |
| `/ledgers/edit/:id` | Edit Ledger | Yes |
| `/inventory` | Stock Item List | Yes |
| `/inventory/create` | Create Stock Item | Yes |
| `/inventory/edit/:id` | Edit Stock Item | Yes |
| `/vouchers` | Voucher Type Selection | Yes |
| `/vouchers/purchase` | Purchase Voucher Form | Yes |
| `/vouchers/sales` | Sales Voucher Form | Yes |
| `/vouchers/sales/print/:id` | Print Sales Invoice | Yes |
| `/reports` | Reports Dashboard | Yes |

---

## 🛠️ Tech Stack

### Frontend

| Package | Version | Purpose |
|---------|---------|---------|
| react | ^19.2.6 | UI library |
| react-dom | ^19.2.6 | DOM rendering |
| react-router-dom | ^7.18.0 | Client-side routing |
| @reduxjs/toolkit | ^2.12.0 | State management |
| react-redux | ^9.3.0 | Redux React bindings |
| axios | ^1.18.1 | HTTP client |
| tailwindcss | ^4.3.1 | Utility-first CSS framework |
| lucide-react | ^1.21.0 | Icon library |
| react-toastify | ^11.1.0 | Toast notifications |
| react-to-print | ^3.3.0 | Browser print support |
| vite | ^8.0.12 | Build tool + dev server |

### Backend

| Package | Version | Purpose |
|---------|---------|---------|
| express | ^5.2.1 | HTTP server framework |
| @prisma/client | ^7.8.0 | Database ORM client |
| prisma | ^7.8.0 | ORM CLI + schema manager |
| @prisma/adapter-pg | ^7.8.0 | PostgreSQL adapter for Prisma |
| pg | ^8.22.0 | Native PostgreSQL driver |
| jsonwebtoken | ^9.0.3 | JWT sign/verify |
| bcryptjs | ^3.0.3 | Password hashing |
| cookie-parser | ^1.4.7 | HTTP cookie parsing |
| cors | ^2.8.6 | CORS middleware |
| dotenv | ^17.4.2 | Environment variable loading |
| nodemon | ^3.1.14 | Dev auto-restart |

---

## 🚀 Deployment

### Frontend → Vercel

1. Import the GitHub repo in the [Vercel dashboard](https://vercel.com).
2. Set **Root Directory** to `frontend`.
3. Add environment variable: `VITE_API_URL=<your Railway backend URL>`.
4. Vercel runs `npm run build` automatically on each push.
5. The `vercel.json` rewrite rule (`/* → /index.html`) handles client-side routing.

### Backend → Railway

1. Create a new Railway project and link the GitHub repo.
2. Set **Root Directory** to `backend`.
3. Add environment variables in the Railway dashboard:
   - `DATABASE_URL` — Neon PostgreSQL connection string
   - `JWT_SECRET` — a 64-char+ random hex string
4. On first deploy, run migrations:
   ```bash
   npm run railway:deploy   # runs: prisma migrate deploy
   ```
5. Subsequent deploys run `prisma generate` automatically via the `postinstall` hook.

### Database → Neon

1. Create a free database at [neon.tech](https://neon.tech).
2. Copy the connection string from the Neon dashboard.
3. Paste it as `DATABASE_URL` in both your local `.env` and Railway environment variables.

---

## 🤝 Contributing

1. **Fork** this repository
2. **Create a feature branch:**
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Commit your changes** using conventional commits:
   ```bash
   git commit -m "feat: add your feature description"
   ```
4. **Push to your branch:**
   ```bash
   git push origin feature/your-feature-name
   ```
5. **Open a Pull Request** — describe what you built and why

> Please ensure no `.env` files or secrets are committed. Run `npm run lint` in the frontend before submitting.

---

## 📄 License

This project is licensed under the **ISC License**.
