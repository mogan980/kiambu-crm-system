# Kiambu Fertilizers CRM Starter

A long-term CRM starter project for Kiambu Fertilizers.

## Recommended URLs
- Public website: https://kiambufertilizers.com
- CRM: https://crm.kiambufertilizers.com

## Tech Stack
- Frontend: React + Vite
- Backend: Laravel API
- Database: MySQL
- Future integration: WooCommerce REST API

## Modules Included
- Dashboard
- Customers
- Products & Stock
- Leads
- Sales Orders
- Payments
- WooCommerce Sync placeholder

## Backend Setup
```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan serve
```

## Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## Database
Create a database named:

```sql
CREATE DATABASE kiambu_crm;
```
