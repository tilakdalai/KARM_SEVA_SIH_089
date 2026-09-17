# KARM SEVA — System Architecture & Technical Specification

> **Smart India Hackathon 2026 · Problem Statement PS26089**  
> *"Connecting Skills. Creating Opportunities. Serving Communities."*  
> Cooperative-Owned Public Digital Service Infrastructure for Verified Informal & Gig Craftsmen

---

## 1. System Roles & Access Matrix

| Role (Internal Enum) | KARM SEVA Display Label | Primary Capabilities | Access Scope |
| :--- | :--- | :--- | :--- |
| `CUSTOMER` | **Citizen** | Service search, explainable AI matching, booking wizard, live GPS telemetry, Razorpay escrow payments, verified reviews, recurring schedules | Citizen portal, household bookings, tax invoices |
| `WORKER` | **Seva Partner** | Digital KARM ID trust passport, preferred commute radius (1-10 km), job shift acceptance, leave management, automated peer replacement, direct 85% wallet payouts | Seva Partner mobile PWA, assigned shifts, earnings ledger |
| `COOPERATIVE_ADMIN` | **Seva Cooperative** | Member worker document verification (Groups A to D), skill certification, job allocation, emergency dispatch radar, replacement mediation desk, 10% welfare ledger | Cooperative control room, member roster, local disputes |
| `INSTITUTION` | **Institution** | Bulk multi-worker deployments, multi-day recurring contracts, geo-fenced campus attendance tracking, consolidated GST monthly invoices | Institutional B2B/B2G workspace |
| `SYSTEM_ADMIN` | **Platform Administrator** | Platform governance, cooperative accreditation, state/district demand analytics, dispute tribunal conciliation, audit logs, socio-economic impact metrics | Global administrative command center |

---

## 2. Technology Stack & Architectural Principles

### Frontend Architecture
- **Framework**: React 18.3 with TypeScript (Strict mode enabled)
- **Bundler & Tooling**: Vite 5.4 with PWA Service Worker caching (`karmseva-pwa-v1`)
- **Styling**: Tailwind CSS with custom Indian Government Digital Design System
- **State Management**: Zustand 5.0 for session, auth, and role-switching
- **Routing**: React Router v6 with role and authentication guards
- **HTTP Client**: Axios with centralized request/response interceptors & token auto-injection
- **Visuals & Charts**: Recharts & Lucide React icons
- **Geospatial Mapping**: Leaflet / React-Leaflet with OpenStreetMap tiles & OSRM routing
- **Multilingual Support**: Lightweight i18n engine supporting 9 Indian languages (`en`, `hi`, `or`, `bn`, `gu`, `kn`, `mr`, `ta`, `te`)
- **Accessibility (a11y)**: WCAG 2.1 AA compliant (font scaling, high contrast, dyslexia font, text-to-speech)

### Backend Architecture
- **Framework**: Python 3.12 with FastAPI (high-throughput async ASGI)
- **Validation & Serialization**: Pydantic v2 schemas
- **ORM & Persistence**: SQLAlchemy 2.0 with PostgreSQL engine and automated fallback to local SQLite (`shramsetu_dev.db`)
- **Security & Authentication**: JWT (JSON Web Tokens), passlib/bcrypt password hashing, RBAC middleware, OWASP defensive security headers, sliding-window rate limiting
- **Machine Learning**: Scikit-Learn (RandomForestRegressor demand forecasting) + 5-factor explainable heuristic smart matching
- **Third-Party Integrations**: Razorpay (Zero-Trust Escrow Payment Gateway with HMAC verification), Cloudinary (Secure KYC/Certificates), Open-Meteo (Monsoon/Weather Advisory)

---

## 3. High-Level Directory Layout

```
karmseva/
├── backend/
│   ├── app/
│   │   ├── ai/                # Demand forecasting & explainable AI matching
│   │   ├── config.py          # Pydantic Settings & environment configuration (APP_NAME = "KARM SEVA")
│   │   ├── database.py        # SQLAlchemy engine, sessionmaker & declarative base
│   │   ├── dependencies/      # Auth & database session dependencies
│   │   ├── middleware/        # Request logging (karmseva.access), rate limiting (karmseva.rate_limit)
│   │   ├── models/            # 11 SQLAlchemy database entities
│   │   ├── routes/            # 19 FastAPI domain routers
│   │   ├── schemas/           # Pydantic request & response contracts
│   │   ├── services/          # Business logic layer (85/10/5 statutory revenue, auth, routing)
│   │   └── utils/             # Helper utilities & standard API responses
│   ├── tests/                 # 18 Pytest test suites (86 integration tests)
│   ├── seed.py                # Comprehensive development & demo database seeder
│   ├── requirements.txt       # Python dependencies
│   └── main.py                # FastAPI app initialization & modern lifespan handler
├── frontend/
│   ├── public/                # Static assets, SVG monogram favicon, PWA manifest, sw.js
│   ├── src/
│   │   ├── components/        # Reusable Gov-themed components
│   │   ├── constants/         # Roles, routes & configuration constants
│   │   ├── hooks/             # Custom React hooks (useAuth, usePWAInstall)
│   │   ├── i18n/              # 9 Indian language locale dictionaries
│   │   ├── layouts/           # Role-based & public page layouts
│   │   ├── pages/             # 70+ Role dashboards, auth & public pages
│   │   ├── routes/            # React Router tree & guards
│   │   ├── services/          # Axios API clients & mock datasets
│   │   ├── store/             # Zustand state stores
│   │   ├── styles/            # Tailwind CSS & theme tokens
│   │   └── types/             # Strict TypeScript definitions
│   ├── package.json
│   ├── vite.config.ts
│   └── tailwind.config.js
├── docs/                      # Technical documentation & blueprints
└── README.md
```
