import random
from typing import List, Optional
from sqlalchemy.orm import Session
from fastapi import HTTPException, status

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
from app.schemas.worker import (
    WorkerOnboardingRequest,
    WorkerProfileResponse,
    TradePolicyInfo,
    CooperativeInfo,
)


def mask_document_number(doc_type: IdentityDocType, doc_num: str) -> str:
    """Securely mask identity document numbers for privacy and public non-exposure."""
    cleaned = doc_num.replace(" ", "").replace("-", "").strip()
    if len(cleaned) <= 4:
        return f"XXXX-XXXX-{cleaned}"
    
    last4 = cleaned[-4:]
    if doc_type == IdentityDocType.AADHAAR:
        return f"XXXX-XXXX-{last4}"
    elif doc_type == IdentityDocType.PAN:
        return f"XXXXX{last4}"
    elif doc_type == IdentityDocType.VOTER_ID:
        return f"XXX{last4}"
    else:
        return f"BPL-XXXX-{last4}"


def generate_shram_id(district: str) -> str:
    """Generate canonical Digital SHRAM ID e.g. SHRAM-OD-2024-8841"""
    rand_digits = random.randint(1000, 9999)
    dist_code = "OD"
    return f"SHRAM-{dist_code}-2024-{rand_digits}"


# Predefined Authorized Labour Cooperatives in Odisha
AUTHORIZED_COOPERATIVES: List[CooperativeInfo] = [
    CooperativeInfo(
        id="coop-bbsr-01",
        name="Khurda District Urban Workers Cooperative Union",
        code="OD-KHR-COOP-041",
        district="Bhubaneswar",
        address="Sahid Nagar, Janpath, Bhubaneswar, Odisha 751007",
        officer_name="Shri Manoranjan Mohanty",
        contact_phone="+91 674 2548891",
        registered_workers_count=482,
    ),
    CooperativeInfo(
        id="coop-ctc-02",
        name="Cuttack Mahanagar Shramik Sahayog Samiti",
        code="OD-CTC-COOP-019",
        district="Cuttack",
        address="Badambadi Bus Terminal Road, Cuttack 753012",
        officer_name="Smt. Binapani Das",
        contact_phone="+91 671 2314567",
        registered_workers_count=329,
    ),
    CooperativeInfo(
        id="coop-puri-03",
        name="Puri Coastal Artisans & Labour Guild",
        code="OD-PRI-COOP-088",
        district="Puri",
        address="Grand Road, Near Gundicha Temple, Puri 752002",
        officer_name="Shri Dibakar Pradhan",
        contact_phone="+91 675 2228410",
        registered_workers_count=215,
    ),
    CooperativeInfo(
        id="coop-rkl-04",
        name="Rourkela Steel City Technical Workers Society",
        code="OD-SNG-COOP-112",
        district="Sundargarh",
        address="Sector 5 Commercial Complex, Rourkela 769002",
        officer_name="Shri Ashok Kumar Sahoo",
        contact_phone="+91 661 2401923",
        registered_workers_count=394,
    ),
]


# Trade Policies & Group Classifications
TRADE_POLICIES: List[TradePolicyInfo] = [
    # GROUP A (Mandatory Cert/Licence + Experience)
    TradePolicyInfo(
        trade="Master Electrician",
        slug="electrician",
        group=TradeVerificationGroup.GROUP_A,
        group_label="Group A: High Technical / Public Safety",
        certificate_requirement="Mandatory",
        description="Requires ITI Electrician Certificate or State Electrical Inspectorate Licence + documented experience.",
        suggested_skills=["Wiring & Conduit", "Inverter & UPS Setup", "Fault Diagnosis", "3-Phase Distribution", "Solar Panel Inverters"],
    ),
    TradePolicyInfo(
        trade="Commercial Driver",
        slug="driver",
        group=TradeVerificationGroup.GROUP_A,
        group_label="Group A: High Technical / Public Safety",
        certificate_requirement="Mandatory",
        description="Requires Commercial Driving Licence (LMV/HMV) with clean background verification.",
        suggested_skills=["City Driving", "Night Long-Distance", "Automatic & Manual Transmissions", "Defensive Driving", "Route Navigation"],
    ),
    TradePolicyInfo(
        trade="Patient Caregiver",
        slug="patient-caregiver",
        group=TradeVerificationGroup.GROUP_A,
        group_label="Group A: High Technical / Public Safety",
        certificate_requirement="Mandatory",
        description="Requires Nursing / General Duty Assistant (GDA) diploma or healthcare accreditation.",
        suggested_skills=["Vital Signs Monitoring", "Post-Operative Care", "Mobility Assistance", "Medication Regimen", "Oxygen Concentrator Handling"],
    ),

    # GROUP B (Experience Primary, Optional Cert Badge)
    TradePolicyInfo(
        trade="Master Plumber",
        slug="plumber",
        group=TradeVerificationGroup.GROUP_B,
        group_label="Group B: Skilled Residential Maintenance",
        certificate_requirement="Optional",
        description="Experience is primary verification. Optional ITI or plumbing certs earn the verified craftsman badge.",
        suggested_skills=["Pipe Leak Repair", "Overhead Tank Installation", "Sanitaryware Fitting", "Pressure Pump Setup", "Drainage Unclogging"],
    ),
    TradePolicyInfo(
        trade="Elderly Caregiver",
        slug="elderly-caregiver",
        group=TradeVerificationGroup.GROUP_B,
        group_label="Group B: Skilled Residential Maintenance",
        certificate_requirement="Optional",
        description="Prior experience, compassionate caregiving history and cooperative background checks are primary.",
        suggested_skills=["Mobility Support", "Diet & Meal Prep", "Companionship", "Daily Routine Assistance", "Fall Prevention"],
    ),
    TradePolicyInfo(
        trade="Child Caregiver",
        slug="child-caregiver",
        group=TradeVerificationGroup.GROUP_B,
        group_label="Group B: Skilled Residential Maintenance",
        certificate_requirement="Optional",
        description="Prior child nursing / nanny experience and police clearance are primary.",
        suggested_skills=["Infant Care", "Toddler Engagement", "Hygiene & Feeding", "Early Learning Support", "First Aid Basics"],
    ),

    # GROUP C (Experience + Skill Evidence / Short Assessment)
    TradePolicyInfo(
        trade="Furniture Carpenter",
        slug="carpenter",
        group=TradeVerificationGroup.GROUP_C,
        group_label="Group C: Construction & Craft Trades",
        certificate_requirement="Evidence",
        description="Evaluated on years of trade work, portfolio photos of woodwork, and optional basic trade self-assessment.",
        suggested_skills=["Modular Kitchen Assembly", "Door & Lock Repair", "Custom Furniture", "Polishing & Varnishing", "Laminate Work"],
    ),
    TradePolicyInfo(
        trade="Wall Painter",
        slug="painter",
        group=TradeVerificationGroup.GROUP_C,
        group_label="Group C: Construction & Craft Trades",
        certificate_requirement="Evidence",
        description="Evaluated on years of painting experience and photo portfolio of interior/exterior finishes.",
        suggested_skills=["Interior Emulsion", "Waterproof Primer", "Texture & Stencil Wall", "Wood & Metal Enamel", "Putty Leveling"],
    ),
    TradePolicyInfo(
        trade="Appliance Technician",
        slug="appliance-technician",
        group=TradeVerificationGroup.GROUP_C,
        group_label="Group C: Construction & Craft Trades",
        certificate_requirement="Evidence",
        description="Experience with electronic/cooling appliances + portfolio photos of recent repairs.",
        suggested_skills=["AC Gas Charging", "Refrigerator Compressor", "Washing Machine Motor", "Microwave PCB", "Geyser Element"],
    ),
    TradePolicyInfo(
        trade="Gardener & Landscaper",
        slug="gardener",
        group=TradeVerificationGroup.GROUP_C,
        group_label="Group C: Construction & Craft Trades",
        certificate_requirement="Evidence",
        description="Assessed on lawn care, pruning and landscape maintenance experience.",
        suggested_skills=["Lawn Mowing & Trimming", "Pest Management", "Seasonal Plant Care", "Drip Irrigation", "Soil Conditioning"],
    ),

    # GROUP D (Certificate-Free, Trust Grows Via Completed Jobs & Reviews)
    TradePolicyInfo(
        trade="Deep Cleaner",
        slug="cleaner",
        group=TradeVerificationGroup.GROUP_D,
        group_label="Group D: Household & Support Services",
        certificate_requirement="None",
        description="Zero formal certifications required. Trust and reputation grow through completed shifts, reviews, and cooperative vetting.",
        suggested_skills=["Bathroom Acid Scrubbing", "Kitchen Degreasing", "Sofa Vacuuming", "Balcony Power Cleaning", "Floor Machine Polishing"],
    ),
    TradePolicyInfo(
        trade="Domestic Helper",
        slug="domestic-helper",
        group=TradeVerificationGroup.GROUP_D,
        group_label="Group D: Household & Support Services",
        certificate_requirement="None",
        description="Zero formal certifications required. Backed by local cooperative identity validation and customer ratings.",
        suggested_skills=["Daily Dusting & Mopping", "Utensil Cleaning", "Laundry & Ironing", "Meal Prep Assistance", "Household Organization"],
    ),
]


class WorkerService:
    @staticmethod
    def get_trade_policies() -> List[TradePolicyInfo]:
        return TRADE_POLICIES

    @staticmethod
    def get_cooperatives() -> List[CooperativeInfo]:
        return AUTHORIZED_COOPERATIVES

    @staticmethod
    def submit_onboarding(
        db: Session,
        current_user: User,
        data: WorkerOnboardingRequest,
    ) -> WorkerProfileResponse:
        # 1. Enforce Group A Mandatory Certification Validation Rule
        if data.trade_group == TradeVerificationGroup.GROUP_A:
            if not data.certifications or len(data.certifications) == 0:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Verification Policy: {data.trade} (Group A) requires at least one formal certificate or professional licence (e.g. ITI, Nursing Council, or Commercial DL).",
                )

        # 2. Get or create WorkerProfile
        worker = db.query(WorkerProfile).filter(WorkerProfile.user_id == current_user.id).first()
        if not worker:
            worker = WorkerProfile(
                user_id=current_user.id,
                shram_id=generate_shram_id(data.district),
            )
            db.add(worker)
            db.flush()

        # Update user name and district if changed
        current_user.name = data.name
        current_user.district = data.district

        # Update Worker Profile fields
        if not worker.shram_id:
            worker.shram_id = generate_shram_id(data.district)

        worker.alternate_phone = data.alternate_phone
        worker.gender = data.gender
        worker.age = data.age
        worker.preferred_language = data.preferred_language
        worker.address_line = data.address_line
        worker.profile_photo_url = data.profile_photo_url or "https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=400&auto=format&fit=crop&q=80"
        
        worker.cooperative_id = data.cooperative_id
        worker.cooperative_name = data.cooperative_name
        
        worker.trade = data.trade
        worker.trade_group = data.trade_group
        worker.experience_years = data.experience_years
        worker.bio = data.bio
        
        worker.onboarding_status = WorkerOnboardingStatus.SUBMITTED
        worker.current_step = 8
        worker.is_police_cleared = data.is_police_cleared
        worker.is_cooperative_verified = True

        # 3. Clean up and recreate child entities for fresh submission
        # Identity Document
        db.query(WorkerIdentityDocument).filter(WorkerIdentityDocument.worker_id == worker.id).delete()
        masked_num = mask_document_number(
            data.identity_document.document_type,
            data.identity_document.document_number,
        )
        doc = WorkerIdentityDocument(
            worker_id=worker.id,
            document_type=data.identity_document.document_type,
            masked_number=masked_num,
            document_ref=data.identity_document.document_ref or "DOC-SECURE-VAULT-REF",
            verification_status=VerificationDocStatus.VERIFIED,
            verified_by_officer=data.cooperative_name,
        )
        db.add(doc)

        # Certifications
        db.query(WorkerCertification).filter(WorkerCertification.worker_id == worker.id).delete()
        for cert_data in data.certifications:
            cert = WorkerCertification(
                worker_id=worker.id,
                certificate_name=cert_data.certificate_name,
                issuing_authority=cert_data.issuing_authority,
                certificate_number_masked=f"CERT-XXXX-{random.randint(1000, 9999)}",
                issue_year=cert_data.issue_year or 2022,
                document_url=cert_data.document_url,
                is_verified=True,
            )
            db.add(cert)

        # Skills
        db.query(WorkerSkill).filter(WorkerSkill.worker_id == worker.id).delete()
        for skill_name in data.skills:
            sk = WorkerSkill(
                worker_id=worker.id,
                skill_name=skill_name,
                is_primary=True,
            )
            db.add(sk)

        # Service Preferences
        db.query(WorkerServicePreference).filter(WorkerServicePreference.worker_id == worker.id).delete()
        pref = WorkerServicePreference(
            worker_id=worker.id,
            preferred_radius_km=data.preferences.preferred_radius_km,
            max_radius_km=data.preferences.max_radius_km,
            allow_outside_suggestions=data.preferences.allow_outside_suggestions,
            preferred_shift=data.preferences.preferred_shift,
            is_available_for_emergency=data.preferences.is_available_for_emergency,
        )
        db.add(pref)

        # Portfolio Items
        db.query(WorkerPortfolio).filter(WorkerPortfolio.worker_id == worker.id).delete()
        for p_item in data.portfolio:
            port = WorkerPortfolio(
                worker_id=worker.id,
                title=p_item.title,
                service_type=p_item.service_type,
                description=p_item.description,
                image_url=p_item.image_url,
                before_image_url=p_item.before_image_url,
                work_date=p_item.work_date,
            )
            db.add(port)

        # Assessment Entry
        db.query(WorkerAssessment).filter(WorkerAssessment.worker_id == worker.id).delete()
        assess = WorkerAssessment(
            worker_id=worker.id,
            trade_group=data.trade_group,
            assessment_score=100.0 if data.trade_group in [TradeVerificationGroup.GROUP_A, TradeVerificationGroup.GROUP_B] else 95.0,
            safety_quiz_passed=True,
            evaluated_by="KARM SEVA System Verification Guard",
        )
        db.add(assess)

        db.commit()
        db.refresh(worker)

        return WorkerService._build_worker_response(worker, current_user)

    @staticmethod
    def get_onboarding_status(db: Session, current_user: User) -> Optional[WorkerProfileResponse]:
        worker = db.query(WorkerProfile).filter(WorkerProfile.user_id == current_user.id).first()
        if not worker:
            return None
        return WorkerService._build_worker_response(worker, current_user)

    @staticmethod
    def _build_worker_response(worker: WorkerProfile, user: User) -> WorkerProfileResponse:
        skills = [s.skill_name for s in worker.skills]
        masked_doc = worker.identity_documents[0].masked_number if worker.identity_documents else None

        pref_radius = worker.service_preferences.preferred_radius_km if worker.service_preferences else 5.0
        max_radius = worker.service_preferences.max_radius_km if worker.service_preferences else 10.0
        allow_out = worker.service_preferences.allow_outside_suggestions if worker.service_preferences else True

        return WorkerProfileResponse(
            id=worker.id,
            user_id=user.id,
            shram_id=worker.shram_id,
            name=user.name,
            phone=user.phone,
            trade=worker.trade,
            trade_group=worker.trade_group,
            cooperative_name=worker.cooperative_name,
            experience_years=worker.experience_years,
            bio=worker.bio,
            profile_photo_url=worker.profile_photo_url,
            onboarding_status=worker.onboarding_status,
            current_step=worker.current_step,
            is_verified=worker.is_cooperative_verified,
            preferred_radius_km=pref_radius,
            max_radius_km=max_radius,
            allow_outside_suggestions=allow_out,
            skills=skills,
            masked_identity_doc=masked_doc,
            total_certificates=len(worker.certifications),
            total_portfolio_items=len(worker.portfolio_items),
        )
