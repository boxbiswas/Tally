# SmartERP — Backend API

> A production-grade REST API for a multi-company accounting and inventory management system, built to power the SmartERP platform.

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens)
![Railway](https://img.shields.io/badge/Railway-0B0D0E?style=for-the-badge&logo=railway&logoColor=white)
![License](https://img.shields.io/badge/License-ISC-blue?style=for-the-badge)

---

## ✨ Features

- 🔐 **JWT-based authentication** via HTTP-only cookies (register, login, logout)
- 🏢 **Multi-company support** — each user can create and manage multiple companies
- 📒 **Ledger management** — track customer and supplier accounts with opening balances
- 📦 **Inventory / Stock management** — items with SKU, pricing, GST rate, and live quantity
- 🧾 **Purchase & Sales vouchers** — header + line-item model with automatic stock updates
- 📊 **Dashboard metrics** — real-time summary of sales, purchases, and outstanding balances
- 📑 **Reporting suite** — customers outstanding, suppliers outstanding, stock summary, sales register, purchase register
- 🔒 **Route-level auth middleware** — every protected route validates the JWT before execution
- ☁️ **Production-ready** — deployed on Railway with Neon PostgreSQL

---

## 🏗️ Architecture

```mermaid
graph TD
  Client["React Frontend (Vercel)"] -->|HTTP REST / Cookies| API["Express API (Railway :8080)"]
  API -->|isLoggedIn MW| MW["JWT Middleware"]
  MW -->|Authorized| Controllers["Controllers"]
  Controllers -->|Prisma ORM| DB[("PostgreSQL (Neon)")]

  subgraph Controllers
    Auth["authController"]
    Company["companyController"]
    Ledger["ledgerController"]
    Stock["stockController"]
    Purchase["purchaseController"]
    Sales["salesController"]
    Dashboard["dashboardController"]
    Report["reportController"]
  end
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

---

## 📁 Project Structure

```
backend/
├── app.js                     # Express entry point, CORS config, route mounting
├── prisma.config.js           # Prisma CLI configuration
├── tsconfig.json              # TypeScript configuration
├── package.json
│
├── lib/
│   └── prisma.js              # Prisma Client singleton (pg pool + PrismaPg adapter)
│
├── middleware/
│   └── authMiddleware.js      # JWT cookie verification (isLoggedIn guard)
│
├── controllers/
│   ├── authController.js      # register, login, logout
│   ├── companyController.js   # CRUD for companies
│   ├── ledgerController.js    # CRUD for ledgers (customers/suppliers)
│   ├── stockController.js     # CRUD for stock items + inventory tracking
│   ├── purchaseController.js  # Create/read purchase vouchers
│   ├── salesController.js     # Create/read sales vouchers
│   ├── dashboardController.js # Aggregate metrics for the dashboard
│   └── reportController.js    # Outstanding, stock summary, registers
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
    ├── schema.prisma          # Full data model (User → Company → Ledger/Stock/Vouchers)
    └── migrations/            # Prisma migration history
```

---

## ⚡ Quick Start

### Prerequisites

| Tool | Version |
|------|---------|
| Node.js | >= 18.x |
| npm | >= 9.x |
| PostgreSQL | >= 15 (or a Neon/cloud URL) |

### Installation

1. **Clone and navigate to the backend folder:**
   ```bash
   git clone <repo-url>
   cd backend
   ```

2. **Install dependencies** (also runs `prisma generate` via `postinstall`):
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   ```bash
   # Create a .env file with the variables listed below
   ```

4. **Run database migrations:**
   ```bash
   npx prisma migrate dev
   ```

5. **Start the development server:**
   ```bash
   npm run dev
   ```
   The API will be available at `http://localhost:3000`.

6. **Start for production:**
   ```bash
   npm start
   ```

### Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Port the server listens on | `3000` |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host:5432/dbname?sslmode=require` |
| `JWT_SECRET` | Secret used to sign JWT tokens | `a-long-random-hex-string` |

---

## 🔌 API Reference

All protected routes require a valid JWT token delivered as an HTTP-only cookie (`token`). Obtain it by calling `POST /login`.

### 🔑 Authentication

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|:---:|
| POST | `/register` | Register a new user | No |
| POST | `/login` | Login and receive JWT cookie | No |
| POST | `/logout` | Clear the JWT cookie | No |

### 🏢 Companies

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|:---:|
| POST | `/company` | Create a new company | Yes |
| GET | `/company` | List all companies for the logged-in user | Yes |
| GET | `/company/:id` | Get a specific company by ID | Yes |
| PUT | `/company/:id` | Update a company | Yes |
| DELETE | `/company/:id` | Delete a company | Yes |

### 📒 Ledgers

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|:---:|
| POST | `/company/:companyId/ledger` | Create a ledger (customer/supplier) | Yes |
| GET | `/company/:companyId/ledger` | List all ledgers for a company | Yes |
| GET | `/company/:companyId/ledger/:id` | Get a specific ledger | Yes |
| PUT | `/company/:companyId/ledger/:id` | Update a ledger | Yes |
| DELETE | `/company/:companyId/ledger/:id` | Delete a ledger | Yes |

### 📦 Stock Items

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|:---:|
| POST | `/company/:companyId/item` | Create a stock item | Yes |
| GET | `/company/:companyId/item` | List all stock items | Yes |
| GET | `/company/:companyId/item/:id` | Get a specific stock item | Yes |
| PUT | `/company/:companyId/item/:id` | Update a stock item | Yes |
| DELETE | `/company/:companyId/item/:id` | Delete a stock item | Yes |

### 🧾 Purchase Vouchers

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|:---:|
| POST | `/company/:companyId/purchase` | Create a purchase voucher (updates stock) | Yes |
| GET | `/company/:companyId/purchase` | List all purchase vouchers | Yes |
| GET | `/company/:companyId/purchase/:id` | Get a purchase voucher with line items | Yes |

### 🛒 Sales Vouchers

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|:---:|
| POST | `/company/:companyId/sales` | Create a sales voucher (updates stock) | Yes |
| GET | `/company/:companyId/sales` | List all sales vouchers | Yes |
| GET | `/company/:companyId/sales/:id` | Get a sales voucher with line items | Yes |

### 📊 Dashboard

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|:---:|
| GET | `/company/:companyId/dashboard` | Aggregate KPIs (total sales, purchases, outstanding) | Yes |

### 📑 Reports

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|:---:|
| GET | `/company/:companyId/reports/customers` | Customers outstanding balances | Yes |
| GET | `/company/:companyId/reports/suppliers` | Suppliers outstanding balances | Yes |
| GET | `/company/:companyId/reports/stock` | Stock summary report | Yes |
| GET | `/company/:companyId/reports/sales` | Sales register | Yes |
| GET | `/company/:companyId/reports/purchases` | Purchase register | Yes |

---

## 🚀 Deployment

The backend is deployed on **Railway** and connects to a **Neon PostgreSQL** serverless database.

### Railway Deployment Steps

1. Push your code to GitHub and link the repository to Railway.
2. Set the following environment variables in the Railway dashboard:
   - `DATABASE_URL` — your Neon PostgreSQL connection string
   - `JWT_SECRET` — a cryptographically strong random string
   - `PORT` — Railway injects this automatically; default is `8080`
3. On the first deploy, run migrations:
   ```bash
   npm run railway:deploy
   ```
   This script runs `prisma migrate deploy` to apply all pending migrations.
4. Subsequent deploys automatically run `prisma generate` via the `postinstall` script.

### CORS

The API allows cross-origin requests with credentials from:
- `http://localhost:5173` (local Vite dev server)
- `https://smarterp-one.vercel.app` (production frontend on Vercel)

---

## 🤝 Contributing

1. **Fork** the repository
2. **Create a feature branch:** `git checkout -b feature/your-feature-name`
3. **Commit your changes:** `git commit -m "feat: add your feature"`
4. **Push to your branch:** `git push origin feature/your-feature-name`
5. **Open a Pull Request** and describe your changes

Please follow conventional commits and ensure no secrets are committed to version control.

---

## 📄 License

This project is licensed under the **ISC License**.
