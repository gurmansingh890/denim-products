# Indigo & Stitch — Artisanal Denim Marketplace

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688.svg)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/Frontend-React_Vite-61DAFB.svg)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind_CSS-38B2AC.svg)](https://tailwindcss.com/)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB-47A248.svg)](https://www.mongodb.com/)

**Indigo & Stitch** is a full-stack, production-structured digital marketplace dedicated to slow fashion, heritage workwear, and shuttle-loom selvedge denim. It connects traditional weavers and indigo dye houses (in Kyoto, Okayama, and Brooklyn) with denim enthusiasts globally.

---

## 🌟 Key Features & Flows

### 1. Customer Experience
- **Home & Discovery**: Hero spotlight, artisan maker snippets, category filtering, curated recommendations carousel, and trending textile swatches.
- **Explore Marketplace**: Filter by category, fabric weight, price, and customizable flag; search and sort by trending score, price, and newest arrivals.
- **Heritage Product Detail**: High-res swatch display, leather patch weight badges, artisan profile, and live price breakdown "manifest" tables.
- **Denim Configurator**: Multi-step vertical configurator (Fit, Wash Finish, Copper Hardware, Thread Stitching, Leather Patches) with real-time 2D visual spec preview and live price calculation engine.
- **Location-Based Delivery Estimator**: Geolocation detection to calculate courier distance, estimated delivery dates, and nearby artisan studios.
- **Checkout & Orders**: Itemized custom denim cart summary, shipping form, mock payment processing, and order confirmation.
- **Production Status Stepper**: Visual order pipeline tracking (`Confirmed` ➔ `Indigo Dyeing` ➔ `Stitching & Tailoring` ➔ `Shipped` ➔ `Delivered`) backed by timestamp history logs.
- **User Profile & Customer Care**: Order history list, saved custom denim specs, wishlists, and customer support ticket portal.

### 2. Artisan & Business Experience
- **Multi-Step Business Registration**: Onboarding flow for Artisan Studios and Bulk Denim Suppliers with portfolio upload and admin verification pending state.
- **Seller Dashboard**: Production status stepper queue controls, product catalog CRUD manager, and gross earnings metrics.
- **Bulk Purchaser Dashboard**: Wholesale fabric bolt catalog, RFQ quote request submissions, and B2B contract tracking.

### 3. Platform Administration
- **Executive Admin Panel**: Gross sales metrics, order volume, regional demand aggregation, business verification approvals, product moderation, promo offers manager, and support ticket queue.

---

## 🎨 Design System (`DESIGN.md` Tokens)

- **Colors**:
  - `Deep Indigo` (`#041533`): Structural elements, headers, and primary CTAs.
  - `Warm Rust / Secondary` (`#974724`): Stitch accents, highlights, and primary highlights.
  - `Leather Brown / Tertiary` (`#251009`): Leather patches and metadata tags.
  - `Raw Cotton / Background` (`#fbf9f4`): Organic off-white canvas surface.
  - `Surface Container` (`#f0eee9`): Layered tactile cards and configurator panels.
- **Typography**:
  - `Domine`: Robust slab-serif for Display and Headlines.
  - `Work Sans`: Pragmatic clarity for Body text.
  - `JetBrains Mono`: Industrial labels, SKU manifests, and stitch tags.
- **Tactile Elements**:
  - `.denim-pattern`: Subtle low-opacity denim weave SVG background.
  - `.stitch-divider-h` & `.stitch-divider-v`: Dashed 1px running stitch section dividers.
  - `.leather-patch`: Angled hangtag badges with dashed perimeter stitching.
  - `Copper Rivet`: Metallic circle radio buttons for custom selections.

---

## 📁 Repository Monorepo Structure

```
/
├── frontend/                     # React + Vite + Tailwind CSS App
│   ├── src/
│   │   ├── api/                  # Axios wrappers (auth, products, orders, etc.)
│   │   ├── components/           # Reusable UI (Navbar, Footer, Stepper, Swatches, etc.)
│   │   ├── hooks/                # Custom hooks (useGeolocation)
│   │   ├── pages/                # Customer, Business, Admin, Auth views
│   │   ├── store/                # Zustand stores (useAuthStore, useCartStore)
│   │   ├── styles/               # Index.css & custom CSS classes
│   │   ├── App.jsx               # React Router DOM routing & TanStack Query setup
│   │   └── main.jsx              # React DOM mounting
│   ├── index.html
│   ├── tailwind.config.js        # Design tokens & color system
│   ├── vite.config.js
│   ├── package.json
│   └── .env.example
│
├── backend/                      # FastAPI Python Application
│   ├── app/
│   │   ├── core/                 # Config, security (JWT/bcrypt), dependencies
│   │   ├── db/                   # Motor async MongoDB manager & in-memory fallback
│   │   ├── models/               # Pydantic v2 schemas (User, Order, Product, etc.)
│   │   └── routers/              # Auth, Products, Customizations, Location, Orders, etc.
│   ├── seed.py                   # Automated database seed script
│   ├── main.py                   # FastAPI server entry point
│   ├── requirements.txt
│   └── .env.example
└── README.md
```

---

## ⚡ Quick Start & Local Development

### 1. Backend Setup (FastAPI)
```bash
cd backend

# Create virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env from template
cp .env.example .env

# Seed initial demo data
python seed.py

# Run development server
uvicorn main:app --reload --port 8000
```
- API Documentation available at: `http://localhost:8000/docs`

### 2. Frontend Setup (React + Vite)
```bash
cd frontend

# Install dependencies
npm install

# Create .env from template
cp .env.example .env

# Run Vite dev server
npm run dev
```
- Frontend Web App available at: `http://localhost:5173`

---

## 🔑 Demo Account Credentials

| Role | Email | Password | Access Area |
| :--- | :--- | :--- | :--- |
| **Customer** | `maya@example.com` | `password123` | Marketplace, Configurator, Orders, Support |
| **Artisan** | `kenji@matsuidye.jp` | `artisan123` | Seller Dashboard, Production Stepper |
| **Admin** | `admin@indigostitch.com` | `admin123` | Executive Admin Control Panel |

---

## 🚀 Production Deployment Guide

### Frontend Deployment (Vercel)
1. Import the `/frontend` directory to Vercel.
2. Set Build Command: `npm run build` and Output Directory: `dist`.
3. Add Environment Variable:
   - `VITE_API_BASE_URL`: `https://your-backend-service.onrender.com/api`

### Backend Deployment (Render / Railway)
1. Import the `/backend` directory to Render or Railway as a Python Web Service.
2. Set Start Command: `uvicorn main:app --host 0.0.0.0 --port $PORT`.
3. Add Environment Variables:
   - `MONGODB_URL`: Your MongoDB Atlas Connection String
   - `SECRET_KEY`: Production JWT Secret
   - `CORS_ORIGINS`: `["https://your-frontend-domain.vercel.app"]`

### Database Deployment (MongoDB Atlas)
1. Create a MongoDB Atlas cluster.
2. Add a Database User and whitelist server IP (`0.0.0.0/0` for cloud PaaS).
3. Copy the Connection URI into `MONGODB_URL` in the backend configuration.

---

## 📄 License
Licensed under the [MIT License](LICENSE).
