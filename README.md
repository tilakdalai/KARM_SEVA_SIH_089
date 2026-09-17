# KARM SEVA (कर्म सेवा)

**Connecting Skills. Creating Opportunities. Serving Communities.**  
*Smart India Hackathon 2026 (SIH 2026) · Problem Statement PS26089*  
*Cooperative-Owned Public Digital Service Infrastructure for Verified Craftsmen & Gig Workers*

---

## 🏛️ Project Overview

**KARM SEVA** is a sovereign public digital infrastructure platform designed to bridge households, businesses, and government institutions with verified cooperative artisans and skilled workers (**Seva Partners**). 

Anchored in the principles of **Platform Cooperativism** and India Stack (e-Shram, DigiLocker, UPI DBT), KARM SEVA guarantees:
1. **Dignity & Fair Wages**: Transparent **85/10/5 statutory revenue splitting** where 85% goes directly to the artisan via instant UPI DBT and 10% funds cooperative welfare, health insurance, and training.
2. **Digital KARM ID**: A portable, tamper-proof national skill credential with 4-tier occupational verification (Groups A to D).
3. **Explainable AI Smart Matching**: 5-factor transparent scoring (Skill 35%, Distance 25%, Availability 20%, Rating 10%, Workload 10%) with zero surge pricing.
4. **15-Minute Emergency SOS Radar**: Instant radial GPS broadcast connecting citizens to standby Seva Partners for urgent pipeline, electrical, or medical hazards.
5. **Continuity of Livelihood**: Automated peer-replacement desk ensuring uninterrupted customer service when workers take medical or family leave.
6. **Institutional B2B / B2G Services**: Bulk workforce deployments, geo-fenced campus shift tracking, SLA contracts, and consolidated monthly GST invoices.

---

## 👥 Master Role Architecture

| Role (Internal Enum) | KARM SEVA Display Label | Purpose & Scope | Primary Workspace |
| :--- | :--- | :--- | :--- |
| `CUSTOMER` | **Citizen** | Household service discovery, smart matching, emergency SOS, live tracking, escrow payments | `/customer` |
| `WORKER` | **Seva Partner** | Digital KARM ID, custom work radius (1-10 km), job shift acceptance, leave management, wallet | `/worker` |
| `COOPERATIVE_ADMIN` | **Seva Cooperative** | Operations control room, 4-tier verification queue, replacement mediation, 10% welfare ledger | `/cooperative` |
| `INSTITUTION` | **Institution** | Bulk workforce team requests, multi-day schedules, campus attendance, consolidated GST billing | `/institution` |
| `SYSTEM_ADMIN` | **Platform Administrator** | Statewide oversight, cooperative accreditation, dispute tribunal, audit logs, impact analytics | `/admin` |

---

## 📁 Repository Structure

```
karmseva/
├── backend/
│   ├── app/
│   │   ├── ai/                # Demand forecasting & explainable AI matching
│   │   ├── config.py          # Centralized Pydantic settings (APP_NAME = "KARM SEVA")
│   │   ├── database.py        # SQLAlchemy 2.0 engine & SQLite fallback
│   │   ├── dependencies/      # Auth & DB dependency injection
│   │   ├── middleware/        # OWASP security, rate limiter, access logger
│   │   ├── models/            # 11 SQLAlchemy models (users, workers, bookings, payments...)
│   │   ├── routes/            # 19 FastAPI domain routers
│   │   ├── schemas/           # Pydantic v2 validation contracts
│   │   ├── services/          # Revenue (85/10/5), auth, routing, analytics
│   │   └── utils/             # Standardized API response formatters
│   ├── tests/                 # 18 Pytest test suites (86 integration tests)
│   ├── seed.py                # Comprehensive development & demo seeder
│   ├── requirements.txt       # Python dependencies
│   └── main.py                # FastAPI initialization & lifespan seeder
├── frontend/
│   ├── public/                # Favicon (K monogram), PWA manifest, sw.js, offline fallback
│   ├── src/
│   │   ├── components/        # Reusable components (analytics, common, customer, worker...)
│   │   ├── constants/         # Brand config, role configs, Indian locations (700+ districts)
│   │   ├── context/           # Accessibility (a11y) & Multilingual (i18n) context
│   │   ├── hooks/             # useAuth, usePWAInstall
│   │   ├── i18n/locales/      # 9 Indian languages (EN, HI, OR, BN, GU, KN, MR, TA, TE)
│   │   ├── layouts/           # 5 Role layouts + PublicLayout + AuthLayout
│   │   ├── pages/             # 70+ role pages covering all workflows
│   │   ├── routes/            # React Router v6 guards & routing tree
│   │   ├── services/          # 13 Axios API service clients & mock datasets
│   │   ├── store/             # Zustand auth & session store
│   │   └── types/             # Strict TypeScript definitions
│   ├── package.json
│   ├── vite.config.ts
│   └── tailwind.config.js
├── docs/                      # System architecture & technical blueprints
├── DEMO_CREDENTIALS.md        # Pre-seeded test accounts for all 5 roles
├── TECH_STACK.md              # Exhaustive presentation & jury defense guide
├── RESEARCH_AND_REFERENCES.md # Empirical labor research & literature review
└── API_KEYS_AND_GOVERNMENT_APIS.md # Government API & DPI integration matrix
```

---

## 🚀 How to Run Locally

### 1. Prerequisites
- **Node.js**: v18.0.0 or higher
- **Python**: v3.10 or higher
- **PostgreSQL**: Optional (Backend auto-initializes local SQLite `shramsetu_dev.db` if PostgreSQL is absent)

---

### 2. Backend Setup (FastAPI)

1. Open a terminal and navigate to `backend/`:
   ```bash
   cd backend
   ```

2. Activate virtual environment:
   ```bash
   # On Windows (PowerShell):
   venv\Scripts\activate
   # On Linux/macOS:
   source venv/bin/activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Start the development server:
   ```bash
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

5. Verify the backend:
   - **Swagger Docs**: [http://localhost:8000/docs](http://localhost:8000/docs)
   - **ReDoc Interface**: [http://localhost:8000/redoc](http://localhost:8000/redoc)
   - **Health Endpoint**: [http://localhost:8000/api/v1/health](http://localhost:8000/api/v1/health)

---

### 3. Frontend Setup (React + TypeScript + Vite)

1. Open a new terminal and navigate to `frontend/`:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the Vite dev server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🧪 Testing & Verification

1. **Run All Backend Tests (86 Integration Tests)**:
   ```bash
   cd backend
   pytest
   ```

2. **Frontend Type Check**:
   ```bash
   cd frontend
   npm run typecheck
   ```

3. **Frontend Production Build**:
   ```bash
   cd frontend
   npm run build
   ```

4. **Verify All 5 Role Portals**:
   - 👨‍👩‍👧 **Citizen**: `/customer`
   - 🛠️ **Seva Partner**: `/worker`
   - 🏢 **Seva Cooperative**: `/cooperative`
   - 🏫 **Institution**: `/institution`
   - 🛡️ **Platform Administrator**: `/admin`
