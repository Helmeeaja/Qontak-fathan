# QontakSales CRM

Versi dasar QontakSales yang dipersiapkan untuk pengembangan berikutnya.

## Fitur saat ini
- Login dengan email + password (JWT)
- Register perusahaan + akun manager
- Dashboard statistik user/agent/manager
- CRUD Agent untuk manager
- Logout
- Customer
- COA (Chart of Accounts)
- Company
- UserManagement
- Sales
- Purchase
- Products
- Productions
- Template

## Backend
Django REST Framework + PostgreSQL + JWT

## Frontend
React + Vite + Tailwind CSS v4 + Axios + React Router

## Menjalankan
### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

### Frontend
```bash
cd frontend
pnpm install
pnpm dev
```

## Status Pengembangan

### Selesai
| Halaman | Route |
|---|---|
| Dashboard | `/dashboard` |
| Login | `/login` |
| Register | `/register` |
| Agents | `/agents` |
| Customers | `/customers` |
| Chart of Accounts | `/coa` |
| Company | `/company` |
| User Management | `/usermanagement` |
| Sales | `/sales` |
| Purchases | `/purchases` |
| Products | `/products` |
| Productions | `/productions` |
| Template | `/template` |
| Custom Fields | `/customfields` |
| Account Mapping | `/accountmapping` |
| Billings | `/billings` |
| Approval Rules | `/approvalrules` |
| Tagging Rules | `/taggingrules` |

### Dalam pengerjaan (Work in Progress)
- Products (main) — `frontend/src/pages/ProductsMainPage.jsx` (route `/productsmain`)
- Productions (main) — `frontend/src/pages/ProductionsMainPage.jsx` (route `/productionsmain`)
- Komponen pendukung Productions — `frontend/src/components/productions/` (CreateBomModal, CreateWorkOrderModal)

## Data Dummy

Sebagian besar halaman frontend masih memakai data dummy (belum terhubung
sepenuhnya ke backend). Halaman yang sudah mengambil data dari backend via API:

- Dashboard — `GET /dashboard/stats/`
- Customers — endpoint `/customers`
- Chart of Accounts — endpoint `/coa`

File penyimpan data dummy:

- `frontend/src/data/dummy.js` — Company, Approval Rules, Tagging Rules, User Management
- `frontend/src/data/ruleData.js` — Approval Rules, Tagging Rules
- `frontend/src/data/accountMapping.js` — Account Mapping
- `frontend/src/components/data/roleData.js` — User Management

Catatan: file scratch/debug lokal (`frontend/verify-*.cjs`, `frontend/dbg*.cjs`,
`frontend/.iconstub/`) diabaikan oleh git dan tidak ikut dicommit.
