"""
KARM SEVA — Safe Development & Demo Database Seeder
===================================================
SIH PS26089: Cooperative Informal Labour Public Infrastructure Platform.

Generates realistic, production-structure demo data:
- 1 System Administrator
- 2 Labour Cooperatives (Bhubaneswar & Cuttack) with 1 Admin each
- 20 Multi-Trade Craftsmen (Electricians, Plumbers, Cleaners, Carpenters, Drivers, Caregivers, Painters, Gardeners, Domestic Helpers, Technicians)
- 6 Citizen Customers
- 2 Public Institutions (AIIMS Bhubaneswar & IIT Bhubaneswar)
- Service Catalogs, Floor Rates, Skill Dossiers, Identity Verification Records, Portfolios
- Completed, Active & Requested Bookings with OTP Verification
- 85/10/5 Statutory Revenue Transactions & Settlement Cycles
- Reviews, Verification Badges, Complaints, Audit Logs, and Notification Records

Usage:
    python backend/seed.py [--reset]
"""

import sys
import os
import uuid
from datetime import datetime, timezone, timedelta

# Ensure backend folder is in Python path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "backend")))

from app.database import engine, SessionLocal, Base
from app.utils.security import get_password_hash
from app.models.user import User, UserRole
from app.models.worker import (
    WorkerProfile,
    WorkerIdentityDocument,
    WorkerCertification,
    WorkerSkill,
    WorkerServicePreference,
    WorkerPortfolio,
    WorkerAssessment,
    TradeVerificationGroup,
    WorkerOnboardingStatus,
    IdentityDocType,
    VerificationDocStatus,
)
from app.models.audit import AuditLog, CooperativeTradeService
from app.models.institution import (
    InstitutionProfile,
    WorkforceRequest,
    WorkforceRequestItem,
    InstitutionalContract,
    InstitutionalAttendance,
    InstitutionalInvoice,
    RequestStatus,
    ContractStatus,
    InvoiceStatus as InstInvoiceStatus,
    AttendanceStatus,
)
from app.models.booking import (
    Booking,
    BookingStatusHistory,
    BookingStatus,
    BookingType,
    RecurringFrequency,
)
from app.models.payment import (
    Payment,
    Transaction,
    SettlementCycle,
    PaymentStatus,
    SettlementStatus,
    CycleType,
    CycleStatus,
)
from app.models.review import (
    Review,
    WorkerBadge,
    ReviewerRole,
    BadgeCategory,
    BadgeCode,
)
from app.models.complaint import (
    Complaint,
    ComplaintActionHistory,
    ComplaintCategory,
    ComplaintStatus,
)
from app.models.notification import (
    Notification,
    NotificationType,
)

# Standard demo password for all seeded accounts
DEMO_PASSWORD_RAW = "ShramSetu@Demo2026"
DEMO_PASSWORD_HASH = get_password_hash(DEMO_PASSWORD_RAW)


def seed_database(reset: bool = True):
    print("=" * 70)
    print("  KARM SEVA DATABASE SEEDING SYSTEM (SIH PS26089)")
    print("=" * 70)

    # Initialize all database tables
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    try:
        if reset:
            print("[*] Clearing previous records for clean demo state...")
            # Delete in foreign key dependency order
            db.query(Notification).delete()
            db.query(ComplaintActionHistory).delete()
            db.query(Complaint).delete()
            db.query(WorkerBadge).delete()
            db.query(Review).delete()
            db.query(Transaction).delete()
            db.query(Payment).delete()
            db.query(SettlementCycle).delete()
            db.query(BookingStatusHistory).delete()
            db.query(Booking).delete()
            db.query(InstitutionalAttendance).delete()
            db.query(InstitutionalInvoice).delete()
            db.query(InstitutionalContract).delete()
            db.query(WorkforceRequestItem).delete()
            db.query(WorkforceRequest).delete()
            db.query(InstitutionProfile).delete()
            db.query(AuditLog).delete()
            db.query(CooperativeTradeService).delete()
            db.query(WorkerAssessment).delete()
            db.query(WorkerPortfolio).delete()
            db.query(WorkerServicePreference).delete()
            db.query(WorkerSkill).delete()
            db.query(WorkerCertification).delete()
            db.query(WorkerIdentityDocument).delete()
            db.query(WorkerProfile).delete()
            db.query(User).delete()
            db.commit()
            print("[+] Database cleaned successfully.")

        now = datetime.now(timezone.utc)

        # -------------------------------------------------------------------------
        # 1. SYSTEM ADMINISTRATOR
        # -------------------------------------------------------------------------
        print("\n[1/8] Seeding System Administrator...")
        admin_user = User(
            id=str(uuid.uuid4()),
            name="Dr. Subhashree Mohanty",
            email="admin@karmseva.gov.in",
            phone="9876543214",
            password_hash=DEMO_PASSWORD_HASH,
            role=UserRole.SYSTEM_ADMIN,
            is_active=True,
            is_verified=True,
            organization_name="State Labour & ESI Department, Odisha",
            district="Khordha",
            pincode="751001",
        )
        db.add(admin_user)

        # -------------------------------------------------------------------------
        # 2. COOPERATIVE SOCIETIES & ADMINS
        # -------------------------------------------------------------------------
        print("[2/8] Seeding 2 Labour Cooperatives & Nodal Union Officers...")
        
        # Cooperative 1: Bhubaneswar
        coop_admin_1 = User(
            id=str(uuid.uuid4()),
            name="Sunil Mohapatra",
            email="coop@karmseva.gov.in",
            phone="9876543212",
            password_hash=DEMO_PASSWORD_HASH,
            role=UserRole.COOPERATIVE_ADMIN,
            is_active=True,
            is_verified=True,
            organization_name="Bhubaneswar Urban Seva Cooperative Federation",
            district="Khordha",
            address="Unit-3, Kharvel Nagar, Bhubaneswar",
            pincode="751001",
        )
        db.add(coop_admin_1)

        # Cooperative 2: Cuttack
        coop_admin_2 = User(
            id=str(uuid.uuid4()),
            name="Pravat Jena",
            email="coop.cuttack@karmseva.gov.in",
            phone="+919800000002",
            password_hash=DEMO_PASSWORD_HASH,
            role=UserRole.COOPERATIVE_ADMIN,
            is_active=True,
            is_verified=True,
            organization_name="Cuttack Seva Karmik Union",
            district="Cuttack",
            address="Badambadi Bus Stand Road, Cuttack",
            pincode="753012",
        )
        db.add(coop_admin_2)

        # -------------------------------------------------------------------------
        # 3. STANDARDIZED COOPERATIVE SERVICES CATALOG
        # -------------------------------------------------------------------------
        print("[3/8] Seeding Standardized Trade Services & Statutory Floor Rates...")
        services_data = [
            ("COOP-OD-BBR-01", "Switchboard & Wiring Diagnostics", "Electrical", "Electrician", 249.0, 45, "Inspection and repair of faulty circuit breakers and switchboards"),
            ("COOP-OD-BBR-01", "Inverter & Heavy Load Installation", "Electrical", "Electrician", 499.0, 90, "Safe high-load cabling and UPS inverter setup with copper grounding"),
            ("COOP-OD-BBR-01", "Pipeline Leakage & Drain Clearing", "Plumbing", "Plumber", 299.0, 60, "High-pressure drain unblocking and bathroom pipeline seal replacement"),
            ("COOP-OD-BBR-01", "Water Pump & Overhead Tank Fitment", "Plumbing", "Plumber", 549.0, 90, "Motor pump wiring, inlet valve alignment, and float switch repair"),
            ("COOP-OD-BBR-01", "Deep Sanitization & House Cleaning", "Cleaning", "Cleaner", 599.0, 120, "Eco-friendly machine scrub cleaning for 2BHK/3BHK residential flats"),
            ("COOP-OD-BBR-01", "Modular Kitchen & Exhaust Degreasing", "Cleaning", "Cleaner", 399.0, 75, "Steam degreasing for chimneypipe, countertops, and grease filters"),
            ("COOP-OD-BBR-01", "Door Lock & Modular Hinges Repair", "Carpentry", "Carpenter", 299.0, 60, "Precision mortise lock, hinge alignment, and cabinet door fixing"),
            ("COOP-OD-BBR-01", "Wooden Furniture Restoration", "Carpentry", "Carpenter", 649.0, 120, "Teakwood joint tightening, surface sanding, and protective varnish coat"),
            ("COOP-OD-BBR-01", "Verified Chauffeur & Daily Driver", "Driving", "Driver", 399.0, 240, "4-hour city driving service with valid commercial licence & police verification"),
            ("COOP-OD-BBR-01", "Elderly Daily Care Assistance", "Caregiving", "Caregiver", 499.0, 240, "4-hour compassionate geriatric mobility, vitals check & meal prep"),
            ("COOP-OD-BBR-01", "Post-Operative Nursing Support", "Caregiving", "Caregiver", 799.0, 360, "Certified patient hygiene, wound dressing assistance & medication timing"),
            ("COOP-OD-BBR-01", "Interior Wall Repair & Accent Painting", "Painting", "Painter", 449.0, 120, "Waterproofing putty application, wall smoothing & primer touchup"),
            ("COOP-OD-BBR-01", "Lawn Mowing & Landscape Pruning", "Gardening", "Gardener", 349.0, 90, "Garden bed weeding, organic fertilization, hedge trimming & lawn mowing"),
            ("COOP-OD-BBR-01", "Daily Housekeeping & Meal Preparation", "Domestic Help", "Domestic Helper", 299.0, 180, "Floor mopping, utensil washing, and healthy traditional meal preparation"),
            ("COOP-OD-BBR-01", "AC Jet Service & Gas Leak Check", "Technician", "Technician", 499.0, 60, "High-pressure foam coil washing, filter disinfection & gas PSI pressure check"),
            ("COOP-OD-BBR-01", "Washing Machine & Microwave Diagnostics", "Technician", "Technician", 349.0, 60, "Motor spinning check, PCB board diagnostic, magnetron test"),
            # Cuttack Union Services
            ("COOP-OD-CTC-02", "Emergency Power Short-Circuit Repair", "Electrical", "Electrician", 299.0, 45, "Urgent 24x7 electrical short circuit isolation and fuse restoration"),
            ("COOP-OD-CTC-02", "Bathroom Fittings & Tap Replacement", "Plumbing", "Plumber", 249.0, 45, "Quarter-turn faucet, shower mixer and angle valve repair"),
            ("COOP-OD-CTC-02", "Comprehensive Home Deep Cleaning", "Cleaning", "Cleaner", 549.0, 120, "Complete floor scrubbing, cobweb removal, and bathroom descaling"),
            ("COOP-OD-CTC-02", "Sofa & Upholstery Vacuum Extraction", "Cleaning", "Cleaner", 399.0, 60, "Deep dry vacuum and stain shampooing for 5-seater sofa sets"),
        ]

        for coop_code, title, cat, trade, price, dur, desc in services_data:
            srv = CooperativeTradeService(
                id=str(uuid.uuid4()),
                cooperative_id=coop_code,
                title=title,
                category=cat,
                trade=trade,
                base_price=price,
                duration_mins=dur,
                description=desc,
                is_enabled=True,
            )
            db.add(srv)

        # -------------------------------------------------------------------------
        # 4. 20 MULTI-TRADE CRAFTSMEN (10 Trades x 2 Workers Each)
        # -------------------------------------------------------------------------
        print("[4/8] Seeding 20 Multi-Trade Craftsmen with Skills, Badges & Portfolios...")
        
        workers_seed = [
            # 1. Electricians (Group A)
            {
                "name": "Gopal Nayak", "email": "worker@karmseva.gov.in", "phone": "9876543211",
                "shram_id": "KS-OD-2024-8841", "trade": "Electrician", "group": TradeVerificationGroup.GROUP_A,
                "coop_id": "COOP-OD-BBR-01", "coop_name": "Bhubaneswar Urban Seva Cooperative Federation",
                "exp": 8.5, "rating": 4.9, "address": "Saheed Nagar, Bhubaneswar", "district": "Khordha",
                "skills": ["Industrial Wiring", "Solar Inverter", "Three-Phase MCB", "Home Automation"],
                "cert": ("ITI Electrical Certification (NCVT)", "State Council for Technical Education & Vocational Training", 2017),
                "badges": [BadgeCode.IDENTITY_VERIFIED, BadgeCode.LICENCE_VERIFIED, BadgeCode.SKILL_CERTIFIED, BadgeCode.TOP_PROFESSIONAL],
                "photo": "https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=200&auto=format&fit=crop&q=80",
                "is_online": True,
            },
            {
                "name": "Dillip Rout", "email": "dillip.rout@karmseva.gov.in", "phone": "+919100000002",
                "shram_id": "KS-OD-2024-8842", "trade": "Electrician", "group": TradeVerificationGroup.GROUP_A,
                "coop_id": "COOP-OD-CTC-02", "coop_name": "Cuttack Seva Karmik Union",
                "exp": 4.0, "rating": 4.7, "address": "Badambadi, Cuttack", "district": "Cuttack",
                "skills": ["Domestic Rewiring", "Ceiling Fan Repair", "Earthing Fitment"],
                "cert": ("Govt Trade Electrician Certificate", "Skill India Mission", 2021),
                "badges": [BadgeCode.IDENTITY_VERIFIED, BadgeCode.SKILL_CERTIFIED, BadgeCode.RISING_WORKER],
                "photo": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80",
                "is_online": True,
            },
            # 2. Plumbers (Group B)
            {
                "name": "Ramesh Behera", "email": "ramesh.behera@karmseva.gov.in", "phone": "+919100000003",
                "shram_id": "KS-OD-2024-8843", "trade": "Plumber", "group": TradeVerificationGroup.GROUP_B,
                "coop_id": "COOP-OD-BBR-01", "coop_name": "Bhubaneswar Urban Seva Cooperative Federation",
                "exp": 6.0, "rating": 4.8, "address": "Nayapalli, Bhubaneswar", "district": "Khordha",
                "skills": ["CPVC Piping", "Bathroom Concealed Fittings", "Hydro-Jet Drain Cleaning", "Water Heaters"],
                "cert": ("Advanced Sanitary Engineering Craft", "Odisha Skill Development Authority", 2019),
                "badges": [BadgeCode.IDENTITY_VERIFIED, BadgeCode.TRUSTED_WORKER, BadgeCode.SERVICE_CHAMPION],
                "photo": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80",
                "is_online": True,
            },
            {
                "name": "Manoj Swain", "email": "manoj.swain@karmseva.gov.in", "phone": "+919100000004",
                "shram_id": "KS-OD-2024-8844", "trade": "Plumber", "group": TradeVerificationGroup.GROUP_B,
                "coop_id": "COOP-OD-CTC-02", "coop_name": "Cuttack Seva Karmik Union",
                "exp": 3.5, "rating": 4.6, "address": "Chhatra Bazar, Cuttack", "district": "Cuttack",
                "skills": ["Faucet Replacement", "Overhead Tank Valve", "PVC Joint Fixing"],
                "cert": None,
                "badges": [BadgeCode.IDENTITY_VERIFIED, BadgeCode.RISING_WORKER],
                "photo": "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=200&auto=format&fit=crop&q=80",
                "is_online": False,
            },
            # 3. Cleaners (Group D)
            {
                "name": "Savitri Sahoo", "email": "savitri.sahoo@karmseva.gov.in", "phone": "+919100000005",
                "shram_id": "KS-OD-2024-8845", "trade": "Cleaner", "group": TradeVerificationGroup.GROUP_D,
                "coop_id": "COOP-OD-BBR-01", "coop_name": "Bhubaneswar Urban Seva Cooperative Federation",
                "exp": 5.0, "rating": 4.9, "address": "Rasulgarh, Bhubaneswar", "district": "Khordha",
                "skills": ["Full Home Scrubbing", "Chemical-Free Bathroom Sanitization", "Chimney Degreasing"],
                "cert": None,
                "badges": [BadgeCode.IDENTITY_VERIFIED, BadgeCode.HIGHLY_RATED, BadgeCode.TRUSTED_WORKER],
                "photo": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80",
                "is_online": True,
            },
            {
                "name": "Puspanjali Das", "email": "puspanjali.das@karmseva.gov.in", "phone": "+919100000006",
                "shram_id": "KS-OD-2024-8846", "trade": "Cleaner", "group": TradeVerificationGroup.GROUP_D,
                "coop_id": "COOP-OD-CTC-02", "coop_name": "Cuttack Seva Karmik Union",
                "exp": 3.0, "rating": 4.7, "address": "Bidanasi, Cuttack", "district": "Cuttack",
                "skills": ["Office Deep Cleaning", "Carpet Vacuuming", "Balcony Tile Cleaning"],
                "cert": None,
                "badges": [BadgeCode.IDENTITY_VERIFIED, BadgeCode.SERVICE_CHAMPION],
                "photo": "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&auto=format&fit=crop&q=80",
                "is_online": True,
            },
            # 4. Carpenters (Group C)
            {
                "name": "Balaram Sahoo", "email": "balaram.sahoo@karmseva.gov.in", "phone": "+919100000007",
                "shram_id": "KS-OD-2024-8847", "trade": "Carpenter", "group": TradeVerificationGroup.GROUP_C,
                "coop_id": "COOP-OD-BBR-01", "coop_name": "Bhubaneswar Urban Seva Cooperative Federation",
                "exp": 10.0, "rating": 4.8, "address": "Jagamara, Bhubaneswar", "district": "Khordha",
                "skills": ["Custom Wardrobe", "Modular Kitchen Hinges", "Wood Polishing", "Door Framework"],
                "cert": ("Master Carpenter Accreditation", "Odisha State Craftsmen Guild", 2015),
                "badges": [BadgeCode.IDENTITY_VERIFIED, BadgeCode.SKILL_CERTIFIED, BadgeCode.TOP_PROFESSIONAL],
                "photo": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&auto=format&fit=crop&q=80",
                "is_online": True,
            },
            {
                "name": "Kartik Maharana", "email": "kartik.maharana@karmseva.gov.in", "phone": "+919100000008",
                "shram_id": "KS-OD-2024-8848", "trade": "Carpenter", "group": TradeVerificationGroup.GROUP_C,
                "coop_id": "COOP-OD-CTC-02", "coop_name": "Cuttack Seva Karmik Union",
                "exp": 7.0, "rating": 4.9, "address": "Ranihat, Cuttack", "district": "Cuttack",
                "skills": ["Bed Assembly", "Sliding Door Repair", "Lock Installation"],
                "cert": ("ITI Carpentry Trade Diploma", "NCVT", 2018),
                "badges": [BadgeCode.IDENTITY_VERIFIED, BadgeCode.TRUSTED_WORKER, BadgeCode.HIGHLY_RATED],
                "photo": "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&auto=format&fit=crop&q=80",
                "is_online": True,
            },
            # 5. Drivers (Group A)
            {
                "name": "Surya Narayan Tripathy", "email": "surya.tripathy@karmseva.gov.in", "phone": "+919100000009",
                "shram_id": "KS-OD-2024-8849", "trade": "Driver", "group": TradeVerificationGroup.GROUP_A,
                "coop_id": "COOP-OD-BBR-01", "coop_name": "Bhubaneswar Urban Seva Cooperative Federation",
                "exp": 8.0, "rating": 4.9, "address": "Patia, Bhubaneswar", "district": "Khordha",
                "skills": ["Automatic & Manual Transmission", "Highway Driving", "VIP Protocol", "Vehicle Maintenance"],
                "cert": ("Commercial Driving Licence & Defensive Driving Certificate", "RTO Bhubaneswar", 2016),
                "badges": [BadgeCode.IDENTITY_VERIFIED, BadgeCode.LICENCE_VERIFIED, BadgeCode.TOP_PROFESSIONAL],
                "photo": "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200&auto=format&fit=crop&q=80",
                "is_online": True,
            },
            {
                "name": "Sanjay Pradhan", "email": "sanjay.pradhan@karmseva.gov.in", "phone": "+919100000010",
                "shram_id": "KS-OD-2024-8850", "trade": "Driver", "group": TradeVerificationGroup.GROUP_A,
                "coop_id": "COOP-OD-CTC-02", "coop_name": "Cuttack Seva Karmik Union",
                "exp": 6.0, "rating": 4.8, "address": "Madhupatna, Cuttack", "district": "Cuttack",
                "skills": ["City Navigation", "Night Driving", "Sedan & SUV Experience"],
                "cert": ("Commercial Heavy & Light Motor Vehicle Licence", "RTO Cuttack", 2018),
                "badges": [BadgeCode.IDENTITY_VERIFIED, BadgeCode.LICENCE_VERIFIED, BadgeCode.TRUSTED_WORKER],
                "photo": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
                "is_online": False,
            },
            # 6. Caregivers (Group A/B)
            {
                "name": "Laxmipriya Dei", "email": "laxmipriya.dei@karmseva.gov.in", "phone": "+919100000011",
                "shram_id": "KS-OD-2024-8851", "trade": "Caregiver", "group": TradeVerificationGroup.GROUP_A,
                "coop_id": "COOP-OD-BBR-01", "coop_name": "Bhubaneswar Urban Seva Cooperative Federation",
                "exp": 6.5, "rating": 5.0, "address": "Khandagiri, Bhubaneswar", "district": "Khordha",
                "skills": ["Geriatric Nursing", "Bedridden Patient Care", "Blood Pressure Monitoring", "First Aid"],
                "cert": ("Certified General Duty Nursing Assistant", "State Health Mission Odisha", 2018),
                "badges": [BadgeCode.IDENTITY_VERIFIED, BadgeCode.SKILL_CERTIFIED, BadgeCode.TRAINING_COMPLETED, BadgeCode.TOP_PROFESSIONAL],
                "photo": "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=200&auto=format&fit=crop&q=80",
                "is_online": True,
            },
            {
                "name": "Aparna Mishra", "email": "aparna.mishra@karmseva.gov.in", "phone": "+919100000012",
                "shram_id": "KS-OD-2024-8852", "trade": "Caregiver", "group": TradeVerificationGroup.GROUP_B,
                "coop_id": "COOP-OD-CTC-02", "coop_name": "Cuttack Seva Karmik Union",
                "exp": 4.0, "rating": 4.9, "address": "Mahanadi Vihar, Cuttack", "district": "Cuttack",
                "skills": ["Elderly Companionship", "Physiotherapy Assistance", "Dietary Meal Preparation"],
                "cert": ("Home Healthcare Aide Training", "National Skill Development Corporation", 2020),
                "badges": [BadgeCode.IDENTITY_VERIFIED, BadgeCode.TRAINING_COMPLETED, BadgeCode.TRUSTED_WORKER],
                "photo": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80",
                "is_online": True,
            },
            # 7. Painters (Group C)
            {
                "name": "Subash Sethi", "email": "subash.sethi@karmseva.gov.in", "phone": "+919100000013",
                "shram_id": "KS-OD-2024-8853", "trade": "Painter", "group": TradeVerificationGroup.GROUP_C,
                "coop_id": "COOP-OD-BBR-01", "coop_name": "Bhubaneswar Urban Seva Cooperative Federation",
                "exp": 5.5, "rating": 4.7, "address": "Sundarpada, Bhubaneswar", "district": "Khordha",
                "skills": ["Emulsion Painting", "Waterproofing Putty", "Texture Stencil", "Wood Staining"],
                "cert": None,
                "badges": [BadgeCode.IDENTITY_VERIFIED, BadgeCode.SERVICE_CHAMPION],
                "photo": "https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=200&auto=format&fit=crop&q=80",
                "is_online": True,
            },
            {
                "name": "Rabindra Dalei", "email": "rabindra.dalei@karmseva.gov.in", "phone": "+919100000014",
                "shram_id": "KS-OD-2024-8854", "trade": "Painter", "group": TradeVerificationGroup.GROUP_C,
                "coop_id": "COOP-OD-CTC-02", "coop_name": "Cuttack Seva Karmik Union",
                "exp": 6.0, "rating": 4.8, "address": "Chowdwar, Cuttack", "district": "Cuttack",
                "skills": ["Exterior Weatherproof Coating", "Spray Painting", "Wall Crack Sealing"],
                "cert": ("Master Painter Certification", "Asian Paints Colour Academy", 2019),
                "badges": [BadgeCode.IDENTITY_VERIFIED, BadgeCode.SKILL_CERTIFIED, BadgeCode.HIGHLY_RATED],
                "photo": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&auto=format&fit=crop&q=80",
                "is_online": True,
            },
            # 8. Gardeners (Group C)
            {
                "name": "Nityananda Mallick", "email": "nityananda.m@karmseva.gov.in", "phone": "+919100000015",
                "shram_id": "KS-OD-2024-8855", "trade": "Gardener", "group": TradeVerificationGroup.GROUP_C,
                "coop_id": "COOP-OD-BBR-01", "coop_name": "Bhubaneswar Urban Seva Cooperative Federation",
                "exp": 9.0, "rating": 4.8, "address": "Pokhariput, Bhubaneswar", "district": "Khordha",
                "skills": ["Bonsai Pruning", "Organic Soil Fertilization", "Drip Irrigation Setup", "Lawn Mowing"],
                "cert": None,
                "badges": [BadgeCode.IDENTITY_VERIFIED, BadgeCode.TRUSTED_WORKER],
                "photo": "https://images.unsplash.com/photo-1519764622345-23439dd774f7?w=200&auto=format&fit=crop&q=80",
                "is_online": True,
            },
            {
                "name": "Kishore Naik", "email": "kishore.naik@karmseva.gov.in", "phone": "+919100000016",
                "shram_id": "KS-OD-2024-8856", "trade": "Gardener", "group": TradeVerificationGroup.GROUP_C,
                "coop_id": "COOP-OD-CTC-02", "coop_name": "Cuttack Seva Karmik Union",
                "exp": 4.0, "rating": 4.6, "address": "Jobra, Cuttack", "district": "Cuttack",
                "skills": ["Hedge Trimming", "Potting Soil Mixing", "Seasonal Flower Planting"],
                "cert": None,
                "badges": [BadgeCode.IDENTITY_VERIFIED, BadgeCode.RISING_WORKER],
                "photo": "https://images.unsplash.com/photo-1463453091185-61582044d556?w=200&auto=format&fit=crop&q=80",
                "is_online": True,
            },
            # 9. Domestic Helpers (Group D)
            {
                "name": "Meenakshi Dehury", "email": "meenakshi.d@karmseva.gov.in", "phone": "+919100000017",
                "shram_id": "KS-OD-2024-8857", "trade": "Domestic Helper", "group": TradeVerificationGroup.GROUP_D,
                "coop_id": "COOP-OD-BBR-01", "coop_name": "Bhubaneswar Urban Seva Cooperative Federation",
                "exp": 5.0, "rating": 4.9, "address": "Barmunda, Bhubaneswar", "district": "Khordha",
                "skills": ["Nutritious Odia & Indian Cooking", "Utensil Washing", "Household Dusting", "Laundry Care"],
                "cert": None,
                "badges": [BadgeCode.IDENTITY_VERIFIED, BadgeCode.HIGHLY_RATED, BadgeCode.TRUSTED_WORKER],
                "photo": "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=200&auto=format&fit=crop&q=80",
                "is_online": True,
            },
            {
                "name": "Tulasi Pradhan", "email": "tulasi.pradhan@karmseva.gov.in", "phone": "+919100000018",
                "shram_id": "KS-OD-2024-8858", "trade": "Domestic Helper", "group": TradeVerificationGroup.GROUP_D,
                "coop_id": "COOP-OD-CTC-02", "coop_name": "Cuttack Seva Karmik Union",
                "exp": 4.5, "rating": 4.8, "address": "Tulasipur, Cuttack", "district": "Cuttack",
                "skills": ["Morning Kitchen Prep", "Mopping & Sweeping", "Grocery Shopping"],
                "cert": None,
                "badges": [BadgeCode.IDENTITY_VERIFIED, BadgeCode.SERVICE_CHAMPION],
                "photo": "https://images.unsplash.com/photo-1548142813-c348350df52b?w=200&auto=format&fit=crop&q=80",
                "is_online": True,
            },
            # 10. Technicians (Group C)
            {
                "name": "Ashok K. Samal", "email": "ashok.samal@karmseva.gov.in", "phone": "+919100000019",
                "shram_id": "KS-OD-2024-8859", "trade": "Technician", "group": TradeVerificationGroup.GROUP_C,
                "coop_id": "COOP-OD-BBR-01", "coop_name": "Bhubaneswar Urban Seva Cooperative Federation",
                "exp": 7.5, "rating": 4.9, "address": "Chandrasekharpur, Bhubaneswar", "district": "Khordha",
                "skills": ["Inverter AC Diagnostics", "Refrigerator Gas Charging", "RO Purifier Membrane Replacement"],
                "cert": ("RAC Technician NCVT Diploma", "Govt ITI Bhubaneswar", 2017),
                "badges": [BadgeCode.IDENTITY_VERIFIED, BadgeCode.LICENCE_VERIFIED, BadgeCode.SKILL_CERTIFIED, BadgeCode.TOP_PROFESSIONAL],
                "photo": "https://images.unsplash.com/photo-1521119989659-a83eee488004?w=200&auto=format&fit=crop&q=80",
                "is_online": True,
            },
            {
                "name": "Debendra Mohanty", "email": "debendra.m@karmseva.gov.in", "phone": "+919100000020",
                "shram_id": "KS-OD-2024-8860", "trade": "Technician", "group": TradeVerificationGroup.GROUP_C,
                "coop_id": "COOP-OD-CTC-02", "coop_name": "Cuttack Seva Karmik Union",
                "exp": 5.0, "rating": 4.8, "address": "Mangalabag, Cuttack", "district": "Cuttack",
                "skills": ["Washing Machine Drum Alignment", "Microwave Magnetron Repair", "Geyser Element Fitting"],
                "cert": ("Appliance Technician Certificate", "Skill India", 2019),
                "badges": [BadgeCode.IDENTITY_VERIFIED, BadgeCode.SKILL_CERTIFIED, BadgeCode.TRUSTED_WORKER],
                "photo": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&auto=format&fit=crop&q=80",
                "is_online": True,
            },
        ]

        worker_users = []
        worker_profiles = []

        for w_data in workers_seed:
            w_user = User(
                id=str(uuid.uuid4()),
                name=w_data["name"],
                email=w_data["email"],
                phone=w_data["phone"],
                password_hash=DEMO_PASSWORD_HASH,
                role=UserRole.WORKER,
                profile_photo=w_data["photo"],
                preferred_language="en",
                is_active=True,
                is_verified=True,
                shram_id=w_data["shram_id"],
                trade=w_data["trade"],
                work_radius_km=5.0,
                cooperative_name=w_data["coop_name"],
                address=w_data["address"],
                district=w_data["district"],
                pincode="751024" if w_data["district"] == "Khordha" else "753001",
            )
            db.add(w_user)
            db.flush()

            w_prof = WorkerProfile(
                id=str(uuid.uuid4()),
                user_id=w_user.id,
                shram_id=w_data["shram_id"],
                cooperative_id=w_data["coop_id"],
                cooperative_name=w_data["coop_name"],
                trade=w_data["trade"],
                trade_group=w_data["group"],
                experience_years=w_data["exp"],
                bio=f"Cooperative-certified craftsman with {w_data['exp']} years of hands-on expertise in {w_data['trade']}. Backed by verified union credentials, police verification, and transparent standard rate cards.",
                onboarding_status=WorkerOnboardingStatus.VERIFIED,
                current_step=5,
                is_police_cleared=True,
                is_cooperative_verified=True,
                address_line=w_data["address"],
                profile_photo_url=w_data["photo"],
            )
            db.add(w_prof)
            db.flush()

            # Identity Documents (Masked for zero-trust privacy)
            last4 = w_data["phone"][-4:]
            aadhaar_doc = WorkerIdentityDocument(
                id=str(uuid.uuid4()),
                worker_id=w_prof.id,
                document_type=IdentityDocType.AADHAAR,
                masked_number=f"XXXX-XXXX-{last4}",
                verification_status=VerificationDocStatus.VERIFIED,
                verified_by_officer="Cooperative Verification Desk",
                verified_at=now - timedelta(days=60),
            )
            db.add(aadhaar_doc)

            # Skills
            for idx, sk_name in enumerate(w_data["skills"]):
                sk = WorkerSkill(
                    id=str(uuid.uuid4()),
                    worker_id=w_prof.id,
                    skill_name=sk_name,
                    is_primary=(idx == 0),
                )
                db.add(sk)

            # Certifications (if any)
            if w_data["cert"]:
                c_name, c_auth, c_year = w_data["cert"]
                cert_item = WorkerCertification(
                    id=str(uuid.uuid4()),
                    worker_id=w_prof.id,
                    certificate_name=c_name,
                    issuing_authority=c_auth,
                    certificate_number_masked=f"CERT-{c_year}-XXXX-{last4}",
                    issue_year=c_year,
                    is_verified=True,
                )
                db.add(cert_item)

            # Preferences & Availability
            pref = WorkerServicePreference(
                id=str(uuid.uuid4()),
                worker_id=w_prof.id,
                preferred_radius_km=5.0,
                max_radius_km=10.0,
                allow_outside_suggestions=True,
                preferred_shift="FULL_DAY",
                is_available_for_emergency=w_data["is_online"],
            )
            db.add(pref)

            # Portfolios
            portfolio_item = WorkerPortfolio(
                id=str(uuid.uuid4()),
                worker_id=w_prof.id,
                title=f"Completed {w_data['trade']} Project",
                service_type=w_data["trade"],
                description=f"Standard cooperative service delivery with safety diagnostic checks and clean site handover.",
                image_url="https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=500&auto=format&fit=crop&q=80",
                work_date="2026-08-15",
            )
            db.add(portfolio_item)

            # Assessment
            assess = WorkerAssessment(
                id=str(uuid.uuid4()),
                worker_id=w_prof.id,
                trade_group=w_data["group"],
                assessment_score=96.5,
                safety_quiz_passed=True,
                evaluated_by="Cooperative Vetting Officer Desk",
            )
            db.add(assess)

            # Badges
            for b_code in w_data["badges"]:
                badge = WorkerBadge(
                    id=str(uuid.uuid4()),
                    worker_id=w_user.id,
                    badge_code=b_code,
                    badge_category=BadgeCategory.VERIFICATION if "VERIFIED" in b_code.value or "CERTIFIED" in b_code.value else BadgeCategory.PERFORMANCE,
                    title=b_code.value.replace("_", " ").title(),
                    description=f"Verified qualification and performance excellence for {w_data['trade']}.",
                    icon="ShieldCheck" if "VERIFIED" in b_code.value else "Award",
                    criteria_met=[f"Documentary verification completed by {w_data['coop_name']} vetting officer."],
                    is_active=True,
                )
                db.add(badge)

            worker_users.append(w_user)
            worker_profiles.append(w_prof)

        # -------------------------------------------------------------------------
        # 5. 6 CITIZEN CUSTOMERS
        # -------------------------------------------------------------------------
        print("[5/8] Seeding 6 Citizen Customer Accounts...")
        customers_data = [
            ("Ananya Patnaik", "citizen@karmseva.gov.in", "9876543210", "Plot 412, Saheed Nagar, Bhubaneswar", "Khordha", "751007"),
            ("Rajeshwari Mahapatra", "rajeshwari.m@example.com", "+919700000002", "Flat 302, Khandagiri Enclave, Bhubaneswar", "Khordha", "751030"),
            ("Sourav Sengupta", "sourav.sengupta@example.com", "+919700000003", "Infocity Cyber Residency, Patia, Bhubaneswar", "Khordha", "751024"),
            ("Debabrata Dash", "debabrata.dash@example.com", "+919700000004", "CDA Sector-9, Bidanasi, Cuttack", "Cuttack", "753014"),
            ("Priyanka Panda", "priyanka.p@example.com", "+919700000005", "VIP Road, IRC Village, Nayapalli, Bhubaneswar", "Khordha", "751015"),
            ("Tapan Kumar Behera", "tapan.behera@example.com", "+919700000006", "Ratha Danda Road, Old Town, Bhubaneswar", "Khordha", "751002"),
        ]

        customer_users = []
        for name, email, phone, addr, dist, pin in customers_data:
            c_user = User(
                id=str(uuid.uuid4()),
                name=name,
                email=email,
                phone=phone,
                password_hash=DEMO_PASSWORD_HASH,
                role=UserRole.CUSTOMER,
                preferred_language="en",
                is_active=True,
                is_verified=True,
                address=addr,
                district=dist,
                pincode=pin,
            )
            db.add(c_user)
            customer_users.append(c_user)

        # -------------------------------------------------------------------------
        # 6. 2 PUBLIC & HEALTHCARE INSTITUTIONS
        # -------------------------------------------------------------------------
        print("[6/8] Seeding 2 Institutional Clients (AIIMS & IIT Bhubaneswar)...")
        
        # Institution 1: AIIMS Bhubaneswar
        inst_user_1 = User(
            id=str(uuid.uuid4()),
            name="AIIMS Bhubaneswar Facilities Management",
            email="institution@karmseva.gov.in",
            phone="9876543213",
            password_hash=DEMO_PASSWORD_HASH,
            role=UserRole.INSTITUTION,
            organization_name="AIIMS Bhubaneswar (All India Institute of Medical Sciences)",
            institution_type="Hospital",
            address="Sijua, Patrapada, Bhubaneswar",
            district="Khordha",
            pincode="751019",
            is_active=True,
            is_verified=True,
        )
        db.add(inst_user_1)
        db.flush()

        inst_prof_1 = InstitutionProfile(
            id=str(uuid.uuid4()),
            user_id=inst_user_1.id,
            organization_name="AIIMS Bhubaneswar",
            institution_type="Hospital",
            gstin="21AAAAA0000A1Z5",
            pan_number="AAAAA0000A",
            nodal_officer_name="Col. (Dr.) Sanjeev Mohanty",
            nodal_officer_phone="+919600000001",
            nodal_officer_email="admin@aiimsbhubaneswar.edu.in",
            nodal_officer_designation="Superintending Estate Engineer",
            address="Sijua, Patrapada, Bhubaneswar",
            district="Khordha",
            pincode="751019",
            is_verified=True,
        )
        db.add(inst_prof_1)

        # Institution 1 Contract
        inst_contract_1 = InstitutionalContract(
            id="CNT-AIIMS-2026-001",
            institution_id=inst_prof_1.id,
            contract_title="Hospital Sanitation & Caregiving Support SLA",
            cooperative_code="COOP-OD-BBR-01",
            cooperative_name="Bhubaneswar Urban Craftsmen Federation",
            start_date="2026-01-01",
            end_date="2026-12-31",
            total_workers_assigned=14,
            monthly_billing_amount=350000.0,
            status=ContractStatus.ACTIVE,
            sla_terms="Zero-absenteeism replacement guard: guaranteed replacement deployment within 2 hours of approved worker leave.",
        )
        db.add(inst_contract_1)

        # Institution 1 Workforce Requisition
        inst_req_1 = WorkforceRequest(
            id=str(uuid.uuid4()),
            institution_id=inst_prof_1.id,
            title="OPD & Emergency Wing Sanitization & Patient Care Assistants",
            facility_location="AIIMS Hospital Complex, Sijua",
            duration_months=6,
            start_date="2026-02-01",
            end_date="2026-07-31",
            recurring_frequency="DAILY",
            shift_start_time="08:00 AM",
            shift_end_time="04:00 PM",
            estimated_monthly_cost=350000.0,
            cooperative_id="COOP-OD-BBR-01",
            cooperative_name="Bhubaneswar Urban Craftsmen Federation",
            status=RequestStatus.ACTIVE_DEPLOYED,
        )
        db.add(inst_req_1)
        db.flush()

        db.add(WorkforceRequestItem(
            id=str(uuid.uuid4()),
            request_id=inst_req_1.id,
            trade="Cleaner",
            quantity_required=8,
            allocated_workers_count=8,
            daily_floor_rate=500.0,
        ))
        db.add(WorkforceRequestItem(
            id=str(uuid.uuid4()),
            request_id=inst_req_1.id,
            trade="Caregiver",
            quantity_required=6,
            allocated_workers_count=6,
            daily_floor_rate=650.0,
        ))

        # Institution 1 Attendance Records
        for w in worker_users[4:12]:  # Cleaners and Caregivers
            att = InstitutionalAttendance(
                id=str(uuid.uuid4()),
                institution_id=inst_prof_1.id,
                contract_id=inst_contract_1.id,
                worker_shram_id=w.shram_id or "KS-OD-2024-8845",
                worker_name=w.name,
                trade=w.trade or "Cleaner",
                date=now.strftime("%Y-%m-%d"),
                punch_in_time="08:00 AM",
                punch_out_time="04:00 PM",
                geofence_verified=True,
                status=AttendanceStatus.PRESENT,
            )
            db.add(att)

        # Institution 1 Invoices
        inst_inv_1 = InstitutionalInvoice(
            id="INV-AIIMS-2026-08",
            institution_id=inst_prof_1.id,
            contract_id=inst_contract_1.id,
            billing_period="2026-08",
            gross_amount=350000.0,
            gst_amount=0.0,
            net_payable=350000.0,
            due_date="2026-09-10",
            paid_date="2026-08-31",
            status=InstInvoiceStatus.PAID,
            line_items=[
                {"trade": "Cleaner", "count": 8, "days": 26, "amount": 200000.0},
                {"trade": "Caregiver", "count": 6, "days": 26, "amount": 150000.0},
            ],
        )
        db.add(inst_inv_1)

        # Institution 2: IIT Bhubaneswar
        inst_user_2 = User(
            id=str(uuid.uuid4()),
            name="IIT Bhubaneswar Estate & Maintenance",
            email="estate@iitbbs.ac.in",
            phone="+919600000002",
            password_hash=DEMO_PASSWORD_HASH,
            role=UserRole.INSTITUTION,
            organization_name="IIT Bhubaneswar (Indian Institute of Technology)",
            institution_type="School",
            address="Argul, Jatni, Khordha",
            district="Khordha",
            pincode="752050",
            is_active=True,
            is_verified=True,
        )
        db.add(inst_user_2)
        db.flush()

        inst_prof_2 = InstitutionProfile(
            id=str(uuid.uuid4()),
            user_id=inst_user_2.id,
            organization_name="IIT Bhubaneswar",
            institution_type="School",
            gstin="21BBBBB0000B1Z6",
            pan_number="BBBBB0000B",
            nodal_officer_name="Prof. Manoranjan Pradhan",
            nodal_officer_phone="+919600000002",
            nodal_officer_email="estate@iitbbs.ac.in",
            nodal_officer_designation="Dean of Campus Development",
            address="Permanent Campus, Argul, Jatni",
            district="Khordha",
            pincode="752050",
            is_verified=True,
        )
        db.add(inst_prof_2)

        # -------------------------------------------------------------------------
        # 7. BOOKINGS (Completed, In-Progress, Requested), PAYMENTS & TRANSACTIONS
        # -------------------------------------------------------------------------
        print("[7/8] Seeding End-to-End Bookings, 85/10/5 Revenue Transactions & Reviews...")

        # 7A. Completed Booking 1: Customer Ananya + Worker Gopal (Electrician)
        b1 = Booking(
            id=str(uuid.uuid4()),
            booking_reference="BK-2026-8801",
            customer_id=customer_users[0].id,
            service_id="srv-elec-1",
            service_title="Switchboard & Wiring Diagnostics",
            service_category="Electrical",
            cooperative_code="COOP-OD-BBR-01",
            cooperative_name="Bhubaneswar Urban Craftsmen Federation",
            scheduled_worker_id=worker_users[0].id,
            actual_worker_id=worker_users[0].id,
            booking_type=BookingType.ONE_TIME,
            recurring_frequency=RecurringFrequency.NONE,
            scheduled_date="2026-08-28",
            time_slot="10:00 AM - 11:30 AM",
            address_line="Plot 412, Saheed Nagar, Bhubaneswar",
            district="Khordha",
            pincode="751007",
            base_rate=249.0,
            extra_charges=0.0,
            total_amount=249.0,
            status=BookingStatus.COMPLETED,
            otp_code="4821",
            otp_verified=True,
            rating=5.0,
            review="Excellent electrical work by Gopal Nayak. Fixed the MCB tripping in under 30 minutes with proper safety grounding.",
            created_at=now - timedelta(days=5),
        )
        db.add(b1)
        db.flush()

        # Payment for b1
        p1 = Payment(
            id=str(uuid.uuid4()),
            payment_reference="PAY-2026-8801",
            booking_id=b1.id,
            customer_id=customer_users[0].id,
            razorpay_order_id="order_demo_8801",
            razorpay_payment_id="pay_demo_8801",
            amount=249.0,
            status=PaymentStatus.CAPTURED,
            verified_at=now - timedelta(days=5),
            created_at=now - timedelta(days=5),
        )
        db.add(p1)
        db.flush()

        # 85/10/5 Revenue Transaction for b1
        t1 = Transaction(
            id=str(uuid.uuid4()),
            transaction_reference="TXN-2026-8801",
            payment_id=p1.id,
            booking_id=b1.id,
            worker_id=worker_users[0].id,
            cooperative_code="COOP-OD-BBR-01",
            gross_amount=249.0,
            worker_share=round(249.0 * 0.85, 2),        # ₹211.65 (85%)
            cooperative_share=round(249.0 * 0.10, 2),   # ₹24.90 (10% contingency)
            gateway_fee=round(249.0 * 0.05, 2),         # ₹12.45 (5% gateway/escrow)
            platform_share=0.0,                         # 0% DPI Public Good Guarantee
            tax=0.0,
            net_amount=round(249.0 * 0.85, 2),
            settlement_status=SettlementStatus.SETTLED,
            settled_at=now - timedelta(days=4),
            created_at=now - timedelta(days=5),
        )
        db.add(t1)

        # Review for b1
        r1 = Review(
            id=str(uuid.uuid4()),
            booking_id=b1.id,
            reviewer_id=customer_users[0].id,
            reviewee_id=worker_users[0].id,
            reviewer_role=ReviewerRole.CUSTOMER,
            overall_rating=5,
            service_quality=5,
            professionalism=5,
            punctuality=5,
            communication=5,
            comment="Gopal was punctual, polite, and clearly certified. Very happy with KARM SEVA's transparent pricing.",
            created_at=now - timedelta(days=5),
        )
        db.add(r1)

        # 7B. Completed Booking 2: Customer Rajeshwari + Worker Ramesh (Plumber)
        b2 = Booking(
            id=str(uuid.uuid4()),
            booking_reference="BK-2026-8802",
            customer_id=customer_users[1].id,
            service_id="srv-plumb-1",
            service_title="Pipeline Leakage & Drain Clearing",
            service_category="Plumbing",
            cooperative_code="COOP-OD-BBR-01",
            cooperative_name="Bhubaneswar Urban Craftsmen Federation",
            scheduled_worker_id=worker_users[2].id,
            actual_worker_id=worker_users[2].id,
            booking_type=BookingType.ONE_TIME,
            recurring_frequency=RecurringFrequency.NONE,
            scheduled_date="2026-08-30",
            time_slot="02:00 PM - 03:30 PM",
            address_line="Flat 302, Khandagiri Enclave, Bhubaneswar",
            district="Khordha",
            pincode="751030",
            base_rate=299.0,
            extra_charges=0.0,
            total_amount=299.0,
            status=BookingStatus.COMPLETED,
            otp_code="9142",
            otp_verified=True,
            rating=5.0,
            review="Ramesh solved a persistent bathroom drainage blockage quickly without damaging tiles.",
            created_at=now - timedelta(days=3),
        )
        db.add(b2)
        db.flush()

        p2 = Payment(
            id=str(uuid.uuid4()),
            payment_reference="PAY-2026-8802",
            booking_id=b2.id,
            customer_id=customer_users[1].id,
            razorpay_order_id="order_demo_8802",
            razorpay_payment_id="pay_demo_8802",
            amount=299.0,
            status=PaymentStatus.CAPTURED,
            verified_at=now - timedelta(days=3),
            created_at=now - timedelta(days=3),
        )
        db.add(p2)
        db.flush()

        t2 = Transaction(
            id=str(uuid.uuid4()),
            transaction_reference="TXN-2026-8802",
            payment_id=p2.id,
            booking_id=b2.id,
            worker_id=worker_users[2].id,
            cooperative_code="COOP-OD-BBR-01",
            gross_amount=299.0,
            worker_share=round(299.0 * 0.85, 2),
            cooperative_share=round(299.0 * 0.10, 2),
            gateway_fee=round(299.0 * 0.05, 2),
            platform_share=0.0,
            tax=0.0,
            net_amount=round(299.0 * 0.85, 2),
            settlement_status=SettlementStatus.SETTLED,
            settled_at=now - timedelta(days=2),
            created_at=now - timedelta(days=3),
        )
        db.add(t2)

        # 7C. Active In-Progress Booking: Customer Sourav + Worker Savitri (Cleaner)
        b3 = Booking(
            id=str(uuid.uuid4()),
            booking_reference="BK-2026-8803",
            customer_id=customer_users[2].id,
            service_id="srv-clean-1",
            service_title="Deep Sanitization & House Cleaning",
            service_category="Cleaning",
            cooperative_code="COOP-OD-BBR-01",
            cooperative_name="Bhubaneswar Urban Craftsmen Federation",
            scheduled_worker_id=worker_users[4].id,
            actual_worker_id=worker_users[4].id,
            booking_type=BookingType.ONE_TIME,
            recurring_frequency=RecurringFrequency.NONE,
            scheduled_date=now.strftime("%Y-%m-%d"),
            time_slot="02:30 PM - 04:30 PM",
            address_line="Infocity Cyber Residency, Patia, Bhubaneswar",
            district="Khordha",
            pincode="751024",
            base_rate=599.0,
            extra_charges=0.0,
            total_amount=599.0,
            status=BookingStatus.STARTED,
            otp_code="4821",
            otp_verified=True,
            created_at=now - timedelta(hours=2),
        )
        db.add(b3)
        db.flush()

        p3 = Payment(
            id=str(uuid.uuid4()),
            payment_reference="PAY-2026-8803",
            booking_id=b3.id,
            customer_id=customer_users[2].id,
            razorpay_order_id="order_demo_8803",
            amount=599.0,
            status=PaymentStatus.AUTHORIZED,
            created_at=now - timedelta(hours=2),
        )
        db.add(p3)

        # 7D. Requested Booking: Customer Priyanka + Worker Laxmipriya (Caregiver)
        b4 = Booking(
            id=str(uuid.uuid4()),
            booking_reference="BK-2026-8804",
            customer_id=customer_users[4].id,
            service_id="srv-care-1",
            service_title="Elderly Daily Care Assistance",
            service_category="Caregiving",
            cooperative_code="COOP-OD-BBR-01",
            cooperative_name="Bhubaneswar Urban Craftsmen Federation",
            scheduled_worker_id=worker_users[10].id,
            booking_type=BookingType.ONE_TIME,
            recurring_frequency=RecurringFrequency.NONE,
            scheduled_date=(now + timedelta(days=1)).strftime("%Y-%m-%d"),
            time_slot="09:00 AM - 01:00 PM",
            address_line="VIP Road, IRC Village, Nayapalli, Bhubaneswar",
            district="Khordha",
            pincode="751015",
            base_rate=499.0,
            extra_charges=0.0,
            total_amount=499.0,
            status=BookingStatus.REQUESTED,
            otp_code="3781",
            otp_verified=False,
            created_at=now - timedelta(minutes=45),
        )
        db.add(b4)

        # 7E. Settlement Cycle Record
        cycle1 = SettlementCycle(
            id=str(uuid.uuid4()),
            cycle_reference="SETTLE-2026-W34",
            cooperative_code="COOP-OD-BBR-01",
            cycle_type=CycleType.WEEKLY,
            start_date="2026-08-20",
            end_date="2026-08-27",
            total_amount=48500.0,
            total_transactions=94,
            status=CycleStatus.COMPLETED,
        )
        db.add(cycle1)

        # -------------------------------------------------------------------------
        # 8. COMPLAINTS, AUDIT LOGS & NOTIFICATIONS
        # -------------------------------------------------------------------------
        print("[8/8] Seeding Conciliation Complaints, Audit Trails & Push Alerts...")

        # 8A. Grievance 1: Resolved with Tribunal Order
        cmp1 = Complaint(
            id=str(uuid.uuid4()),
            complaint_reference="CMP-2026-0012",
            booking_id=b1.id,
            category=ComplaintCategory.INCORRECT_CHARGE,
            title="Clarification regarding spare switch replacement cost",
            description="Customer inquired about additional ₹50 charged for anchor switch replacement.",
            evidence=[],
            created_by_id=customer_users[0].id,
            created_by_role="CUSTOMER",
            cooperative_code="COOP-OD-BBR-01",
            assigned_to_id=coop_admin_1.id,
            status=ComplaintStatus.RESOLVED,
            resolution_notes="[State DPI Tribunal Order] Verified original merchant receipt of ₹50 for Anchor 16A switch. Amount validated as genuine hardware component.",
            resolved_at=now - timedelta(days=3),
        )
        db.add(cmp1)

        # 8B. Grievance 2: Open Enquiry
        cmp2 = Complaint(
            id=str(uuid.uuid4()),
            complaint_reference="CMP-2026-0018",
            booking_id=None,
            category=ComplaintCategory.SERVICE_QUALITY,
            title="Feedback on Cuttack district response latency during peak rains",
            description="Customer suggested adding more stand-by emergency plumbers in Badambadi zone during monsoon waterlogging.",
            evidence=[],
            created_by_id=customer_users[3].id,
            created_by_role="CUSTOMER",
            cooperative_code="COOP-OD-CTC-02",
            assigned_to_id=coop_admin_2.id,
            status=ComplaintStatus.UNDER_REVIEW,
        )
        db.add(cmp2)

        # 8C. System Audit Logs
        audit_records = [
            (admin_user.id, "Dr. Subhashree Mohanty", None, "APPROVE_COOPERATIVE", "COOPERATIVE", "COOP-OD-BBR-01", "Bhubaneswar Urban Craftsmen Federation", {"district": "Khordha", "accreditation": "Grade A"}),
            (coop_admin_1.id, "Sunil Mohapatra", "COOP-OD-BBR-01", "VERIFY_WORKER_DOCUMENTS", "WORKER", worker_users[0].id, "Gopal Nayak", {"status": "VERIFIED", "trade": "Electrician"}),
            (coop_admin_1.id, "Sunil Mohapatra", "COOP-OD-BBR-01", "UPDATE_SERVICE_RATE_CARD", "SERVICE", "srv-elec-1", "Switchboard & Wiring Diagnostics", {"base_price": 249.0}),
            (admin_user.id, "Dr. Subhashree Mohanty", None, "RESOLVE_GRIEVANCE_TRIBUNAL", "COMPLAINT", cmp1.id, "CMP-2026-0012", {"order": "Validated genuine hardware component"}),
        ]

        for adm_id, adm_name, c_code, act, tgt_type, tgt_id, tgt_name, details in audit_records:
            alog = AuditLog(
                id=str(uuid.uuid4()),
                admin_id=adm_id,
                admin_name=adm_name,
                cooperative_code=c_code,
                action=act,
                target_type=tgt_type,
                target_id=tgt_id,
                target_name=tgt_name,
                details=details,
                ip_address="127.0.0.1",
            )
            db.add(alog)

        # 8D. User Notifications
        notifs = [
            (customer_users[0].id, NotificationType.JOB_COMPLETED, "Service Completed Successfully", "Your booking #BK-2026-8801 for Switchboard Diagnostics is complete. Thank you for supporting cooperative craftsmanship!"),
            (customer_users[2].id, NotificationType.WORKER_ARRIVED, "Worker Arrived at Site", "Savitri Sahoo has arrived at your address. Provide Start OTP 4821 to begin cleaning."),
            (worker_users[0].id, NotificationType.PAYMENT, "Wage Settlement Credited", "₹211.65 (85% statutory direct share) for shift #BK-2026-8801 credited to your bank wallet."),
            (worker_users[10].id, NotificationType.JOB_REQUEST, "New Elderly Care Requisition", "Incoming caregiving request for tomorrow at VIP Road, Nayapalli (4 hrs)."),
            (coop_admin_1.id, NotificationType.VERIFICATION, "Worker Accreditation Completed", "Gopal Nayak documents verified and accredited under Group A Electrician registry."),
            (admin_user.id, NotificationType.SYSTEM, "District Impact Milestone", "Khordha district exceeded ₹1.8 Cr platform transaction volume with 0% platform extraction fee."),
        ]

        for u_id, n_type, n_title, n_msg in notifs:
            notif = Notification(
                id=str(uuid.uuid4()),
                user_id=u_id,
                type=n_type,
                title=n_title,
                message=n_msg,
                is_read=False,
            )
            db.add(notif)

        db.commit()
        print("\n" + "=" * 70)
        print("  SUCCESS: KARM SEVA DEMO DATABASE SEEDED SUCCESSFULLY!")
        print("=" * 70)
        print("  1 System Administrator:   admin@karmseva.gov.in")
        print("  2 Cooperatives & Admins:  coop@karmseva.gov.in / coop.cuttack@karmseva.gov.in")
        print("  20 Multi-Trade Workers:   10 Trades (Electrician, Plumber, Cleaner, etc.)")
        print("  6 Citizen Customers:      citizen@karmseva.gov.in / rajeshwari.m@...")
        print("  2 Public Institutions:    AIIMS Bhubaneswar & IIT Bhubaneswar")
        print("  20 Standard Services:     With duration brackets and floor rates")
        print("  4 Bookings & Payments:    Completed, In-Progress (OTP 4821), Requested")
        print("  85/10/5 Transactions:     100% compliant statutory revenue breakdown")
        print("  Standard Demo Password:   ShramSetu@Demo2026")
        print("=" * 70)

    except Exception as e:
        db.rollback()
        print(f"\n[!] Error during database seeding: {e}", file=sys.stderr)
        raise e
    finally:
        db.close()


if __name__ == "__main__":
    reset_flag = "--no-reset" not in sys.argv
    seed_database(reset=reset_flag)
