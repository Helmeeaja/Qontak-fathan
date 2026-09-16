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
React + Vite + Chakra UI + Axios + React Router

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
npm install
npm run dev
```
