# KARM SEVA (कर्म सेवा)

> **Connecting Skills. Creating Opportunities. Serving Communities.**  
> *Cooperative-Owned Public Digital Service Infrastructure for Verified Craftsmen & Gig Workers*

---

### 🇮🇳 Smart India Hackathon (SIH 2026) Submission Details

| Parameter | Specification |
| :--- | :--- |
| **Problem Statement ID** | `26089` |
| **Problem Statement Title** | **Cooperative Gig Services Platform for Household & Community Services** |
| **Theme** | **Agriculture, FoodTech & Rural Development** |
| **PS Category** | **Software** |
| **Team ID** | `120765` |
| **Team Name** | **ARTARS** |


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

## ⚖️ Comparative Analysis: KARM SEVA vs Existing Solutions

| Dimension / Feature | Commercial Aggregators<br>*(Urban Company, Housejoy, TaskRabbit)* | Informal Labor Nakas<br>*(Daily Chowk / Thekedar System)* | 🏛️ **KARM SEVA**<br>*(Cooperative Public Digital Infrastructure)* |
| :--- | :--- | :--- | :--- |
| **Worker Take-Home Pay** | **65% – 80%**<br>(Deducts 20–35% platform commission + hidden fees) | **75% – 85%**<br>(Subject to thekedar extortion and erratic wage theft) | **85% Direct & Instant Payout**<br>(Direct to worker's bank/UPI account with 0% middleman cut) |
| **Social Security & Welfare** | **0% Statutory Fund**<br>(Workers treated as independent contractors to evade benefits) | **None**<br>(Zero injury coverage, zero healthcare, zero pension) | **10% Dedicated Cooperative Welfare Pool**<br>(Co-op health insurance, emergency aid, maternity/family benefits) |
| **Platform Maintenance** | **Extractive Corporate Profit**<br>(Inflated margins to feed venture capital returns) | **Cash bribery** & local corruption at daily pickup chowks | **5% Flat Sustainable Cloud Reserve**<br>(Cooperative non-profit infrastructure cost recovery) |
| **Pricing Model** | **Dynamic Surge Pricing**<br>(Prices spike 1.5x–3x during rains, emergencies, or festivals) | **Opaque Haggling**<br>(Prone to physical intimidation and wage exploitation) | **Transparent Fair Floor Pricing**<br>(Zero surge gouging, explainable statutory minimum rate cards) |
| **Identity & Credential Ownership** | **Proprietary Lock-in**<br>(Ratings & credentials belong to the app; not portable) | **Word of Mouth**<br>(No verifiable paper trail or background validation) | **Sovereign Digital KARM ID**<br>(Portable national credential linked to e-Shram UAN & DigiLocker) |
| **Emergency SOS Services** | **Slow Scheduling**<br>(Standard 2–4 hour turnaround; subject to surge multipliers) | **Unreliable**<br>(Must physically travel to market to find available craftsmen) | **15-Min Live GPS Emergency Radar**<br>(Instant radial broadcast to nearby on-duty partners without surge) |
| **Service Continuity & Leave** | **Strict Penalties**<br>(Workers penalized or de-ranked for sick leave or cancellations) | **Service Dropped**<br>(Customer is left stranded if worker fails to show up) | **Automated Spatial Peer-Replacement Desk**<br>(Seamless substitute dispatch with zero disruption to customer) |
| **Matching Algorithm** | **Black-Box Profit Maximization**<br>(Prioritizes company margins and sponsored listings) | **Physical Bidding / Muscle Power**<br>(Younger/aggressive workers crowd out others) | **Explainable AI Smart Matching**<br>(Transparent 5-factor scoring: Skill 35%, Dist 25%, Avail 20%, Rating 10%, Workload 10%) |
| **Institutional & B2B Orders** | **Consumer-Only Focus**<br>(Cannot handle bulk industrial shifts or government tenders) | **Unorganized Subcontracting**<br>(No GST invoicing, SLA enforcement, or compliance tracking) | **Dedicated Institutional Portal**<br>(Bulk workforce dispatch, campus geo-fenced shifts, consolidated GST invoices) |
| **Geospatial & Map Tech** | **Paid Proprietary APIs**<br>(Google Maps / Mapbox, high licensing costs passed to users) | **Verbal Directions**<br>(Frequent wrong turns, delayed arrivals) | **100% Sovereign & Free Geospatial Rails**<br>(OpenStreetMap + OSRM + ISRO Bhuvan integration) |
| **Linguistic Accessibility** | **English & Hindi Only**<br>(Excludes vernacular artisans and regional tradesmen) | **Spoken Dialects Only**<br>(Workers unable to parse formal contracts or invoices) | **9 Regional Indian Languages + Icon/Audio UI**<br>(Inclusive by design for Bharat across urban & rural areas) |

---

### 🌟 Key Differentiators: What Makes KARM SEVA Revolutionary?

1. **Platform Cooperativism vs Venture Extraction**  
   Commercial gig platforms extract up to 35% of worker earnings into venture capital dividends while classifying workers as "independent contractors" to evade benefits. KARM SEVA reverses this model: **workers are co-owners** through accredited cooperatives, with **85% direct wage distribution** and **10% ring-fenced into community welfare and healthcare funds**.

2. **Portable Digital KARM ID vs Walled-Garden Lock-in**  
   Private aggregators hold worker reviews and reputation hostage. If a worker leaves Urban Company, their 5-star reputation is lost. KARM SEVA issues a **tamper-proof Digital KARM ID** linked to **e-Shram (MoLE)** and **DigiLocker NCVT/ITI certifications**, giving workers a portable, sovereign career passport they own for life.

3. **Explainable AI Matching vs Black-Box Algorithmic Control**  
   Instead of arbitrary deactivations and opaque dispatching, KARM SEVA provides full algorithmic transparency. Every job match shows a 5-factor breakdown score, balancing distance, skill certification, and fair workload distribution so that senior and junior artisans both receive consistent livelihoods.

4. **Guaranteed Continuity via Spatial Peer-Replacement Desk**  
   Unlike commercial platforms that penalize workers for falling sick, KARM SEVA's peer-replacement engine allows Seva Partners to take verified medical or family leave without losing algorithmic rank. A nearby qualified peer is automatically reassigned with synchronized job briefs, ensuring the citizen's schedule is never compromised.

5. **No Surge Gouging: Fair & Ethical Emergency Radar**  
   During pipe bursts, electrical short-circuits, or extreme monsoon weather, private apps inflate prices by 200–300%. KARM SEVA's 15-Minute Emergency Radar connects citizens to nearby standby artisans at transparent, statutory floor rates with hazard bonuses paid directly from the welfare reserve, not from price gouging.

6. **Institutional-Grade B2B & B2G Infrastructure**  
   KARM SEVA is not just a consumer app; it provides government bodies, universities, and corporate campuses with enterprise tools for bulk workforce deployment, QR-based geo-fenced attendance, and unified GST compliance billing.

```
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
