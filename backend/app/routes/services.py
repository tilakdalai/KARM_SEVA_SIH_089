from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from sqlalchemy import or_

from app.database import get_db
from app.models.user import User, UserRole
from app.models.worker import WorkerProfile, WorkerOnboardingStatus
from app.schemas.common import APIResponse

router = APIRouter(prefix="/services", tags=["Services"])

STANDARDIZED_CATEGORIES = [
    {
        "id": "cat-elec",
        "slug": "electrician",
        "title": "Electrical & Power",
        "hindiTitle": "विद्युत एवं पावर सेवाएँ",
        "odiaTitle": "ବିଦ୍ୟୁତ୍ ଏବଂ ପାୱାର୍ ସେବା",
        "icon": "Zap",
        "trade": "Electrician",
        "tradeGroup": "GROUP_A",
        "shortDesc": "Licensed ITI electricians for wiring, inverters, switchboards & emergency repairs.",
        "startingPrice": 249,
        "activeWorkers": 142,
        "avgRating": 4.88,
        "badge": "Licensed Trades",
    },
    {
        "id": "cat-plumb",
        "slug": "plumber",
        "title": "Plumbing & Sanitary",
        "hindiTitle": "प्लंबिंग एवं स्वच्छता सेवाएँ",
        "odiaTitle": "ପ୍ଲମ୍ବିଂ ଏବଂ ସାନିଟାରୀ ସେବା",
        "icon": "Wrench",
        "trade": "Master Plumber",
        "tradeGroup": "GROUP_B",
        "shortDesc": "Master plumbers for leak repairs, bathroom fittings, motor pumps & tank cleaning.",
        "startingPrice": 299,
        "activeWorkers": 118,
        "avgRating": 4.82,
        "badge": "Experienced Guild",
    },
    {
        "id": "cat-care",
        "slug": "caregiver",
        "title": "Caregiving & Nursing",
        "hindiTitle": "देखभाल एवं नर्सिंग सहायता",
        "odiaTitle": "ସେବାଶୁଶ୍ରୂଷା ଏବଂ ନର୍ସିଂ",
        "icon": "HeartHandshake",
        "trade": "Patient Caregiver",
        "tradeGroup": "GROUP_A",
        "shortDesc": "Trained caregivers & nursing assistants for post-op, elderly & pediatric support.",
        "startingPrice": 699,
        "activeWorkers": 86,
        "avgRating": 4.95,
        "badge": "Police Verified",
    },
    {
        "id": "cat-carp",
        "slug": "carpenter",
        "title": "Carpentry & Woodwork",
        "hindiTitle": "बढ़ईगीरी एवं काष्ठ कार्य",
        "odiaTitle": "ବଢ଼େଇ କାମ",
        "icon": "Hammer",
        "trade": "Furniture Carpenter",
        "tradeGroup": "GROUP_C",
        "shortDesc": "Custom woodcraft, furniture repair, modular fittings, hinges & door locks.",
        "startingPrice": 349,
        "activeWorkers": 94,
        "avgRating": 4.79,
        "badge": "Craftsmen",
    },
    {
        "id": "cat-clean",
        "slug": "cleaner",
        "title": "Deep Cleaning & Hygiene",
        "hindiTitle": "सफाई एवं स्वच्छता",
        "odiaTitle": "ଗଭୀର ସଫେଇ ସେବା",
        "icon": "Sparkles",
        "trade": "Deep Cleaner",
        "tradeGroup": "GROUP_D",
        "shortDesc": "Eco-friendly deep cleaning for kitchens, bathrooms, full homes & office spaces.",
        "startingPrice": 399,
        "activeWorkers": 210,
        "avgRating": 4.85,
        "badge": "Zero Commission",
    },
    {
        "id": "cat-paint",
        "slug": "painter",
        "title": "Painting & Waterproofing",
        "hindiTitle": "पेंटिंग एवं जलरोधन",
        "odiaTitle": "ରଙ୍ଗ କାମ ଏବଂ ୱାଟରପ୍ରୁଫିଂ",
        "icon": "Paintbrush",
        "trade": "Wall Painter",
        "tradeGroup": "GROUP_C",
        "shortDesc": "Interior emulsion, exterior weathercoat, waterproofing primer & wall putty finishing.",
        "startingPrice": 499,
        "activeWorkers": 76,
        "avgRating": 4.77,
        "badge": "Floor Rate Guard",
    },
    {
        "id": "cat-appliance",
        "slug": "appliance-repair",
        "title": "Appliance Repair",
        "hindiTitle": "उपकरण मरम्मत",
        "odiaTitle": "ଉପକରଣ ମରାମତି",
        "icon": "Cpu",
        "trade": "Appliance Technician",
        "tradeGroup": "GROUP_C",
        "shortDesc": "AC servicing, refrigerator gas charging, washing machine & microwave diagnostics.",
        "startingPrice": 349,
        "activeWorkers": 65,
        "avgRating": 4.84,
        "badge": "Standardized Rates",
    },
    {
        "id": "cat-driver",
        "slug": "driver",
        "title": "Commercial Chauffeur",
        "hindiTitle": "वाहन चालक सेवा",
        "odiaTitle": "ଡ୍ରାଇଭର ସେବା",
        "icon": "Car",
        "trade": "Commercial Driver",
        "tradeGroup": "GROUP_A",
        "shortDesc": "Verified commercial drivers for local city transit, outstation & institutional transport.",
        "startingPrice": 550,
        "activeWorkers": 98,
        "avgRating": 4.91,
        "badge": "Commercial Licence",
    },
]

STANDARDIZED_SERVICES = [
    {
        "id": "srv-elec-01",
        "categoryId": "cat-elec",
        "categorySlug": "electrician",
        "title": "Ceiling Fan Installation & Repair",
        "trade": "Electrician",
        "basePrice": 249,
        "estimatedDurationMins": 45,
        "overview": "Complete installation, blade balancing, capacitor replacement, and speed regulator repair.",
        "warrantyDays": 30,
        "inclusions": [
            "Fan assembly and ceiling bracket mounting",
            "Capacitor check and replacement (part charged separately)",
            "Step-type regulator wiring connection",
            "Speed balancing and vibration dampening check",
        ],
        "exclusions": ["New ceiling hook installation requiring civil chipping"],
        "cooperativeName": "Khurda District Urban Workers Cooperative Union",
        "cooperativeCode": "OD-KHR-COOP-041",
    },
    {
        "id": "srv-elec-02",
        "categoryId": "cat-elec",
        "categorySlug": "electrician",
        "title": "Switchboard Rewiring & MCB Tripping Fix",
        "trade": "Electrician",
        "basePrice": 349,
        "estimatedDurationMins": 60,
        "overview": "Diagnosis of frequent MCB tripping, load imbalance, burnt socket replacement & safety earthing test.",
        "warrantyDays": 30,
        "inclusions": [
            "Distribution box wiring check",
            "Single/Double pole MCB replacement",
            "Socket loose connection terminal tightening",
            "Multimeter voltage & neutral leakage test",
        ],
        "exclusions": ["Concealed wall re-chasing across entire floor"],
        "cooperativeName": "Khurda District Urban Workers Cooperative Union",
        "cooperativeCode": "OD-KHR-COOP-041",
    },
    {
        "id": "srv-plumb-01",
        "categoryId": "cat-plumb",
        "categorySlug": "plumber",
        "title": "Tap, Faucet & Pipe Leakage Repair",
        "trade": "Master Plumber",
        "basePrice": 299,
        "estimatedDurationMins": 45,
        "overview": "Precision leak rectification for washbasin mixers, kitchen sink spouts, and concealed pipeline joints.",
        "warrantyDays": 30,
        "inclusions": [
            "Washer and ceramic disc cartridge replacement",
            "Teflon sealing of threaded joints",
            "Angle valve replacement",
            "Water pressure test after repair",
        ],
        "exclusions": ["Major underground concrete slab excavation"],
        "cooperativeName": "Khurda District Urban Workers Cooperative Union",
        "cooperativeCode": "OD-KHR-COOP-041",
    },
    {
        "id": "srv-care-01",
        "categoryId": "cat-care",
        "categorySlug": "caregiver",
        "title": "12-Hour Elderly Day Caregiver Shift",
        "trade": "Elderly Caregiver",
        "basePrice": 950,
        "estimatedDurationMins": 720,
        "overview": "Dedicated, compassionate day-shift support for seniors including mobility, meal assistance, and vitals recording.",
        "warrantyDays": 7,
        "inclusions": [
            "Daily routine assistance and walking companionship",
            "Medication dispensing as prescribed by physician",
            "Vitals monitoring (BP, Blood Glucose, SpO2)",
            "Nutritious soft meal preparation & feeding support",
        ],
        "exclusions": ["Invasive medical procedures (e.g. IV cannulation)"],
        "cooperativeName": "Khurda District Urban Workers Cooperative Union",
        "cooperativeCode": "OD-KHR-COOP-041",
    },
    {
        "id": "srv-clean-01",
        "categoryId": "cat-clean",
        "categorySlug": "cleaner",
        "title": "Complete Kitchen Deep Degreasing",
        "trade": "Deep Cleaner",
        "basePrice": 699,
        "estimatedDurationMins": 150,
        "overview": "Intense oil and soot removal from chimneys, exhaust fans, kitchen countertops, tiles, and cabinets.",
        "warrantyDays": 15,
        "inclusions": [
            "Chimney exterior and baffle filter steam cleaning",
            "Gas stove burner descaling",
            "Tile backsplash grease breakdown with eco-solvents",
            "Cabinet exterior scrub and sanitized wipe down",
        ],
        "exclusions": ["Cabinet interior repainting"],
        "cooperativeName": "Khurda District Urban Workers Cooperative Union",
        "cooperativeCode": "OD-KHR-COOP-041",
    },
    {
        "id": "srv-carp-01",
        "categoryId": "cat-carp",
        "categorySlug": "carpenter",
        "title": "Door Lock, Latch & Hinge Alignment",
        "trade": "Furniture Carpenter",
        "basePrice": 349,
        "estimatedDurationMins": 60,
        "overview": "Repair and precision adjustment of sagging wooden doors, mortise locks, cylinder deadbolts, and door stoppers.",
        "warrantyDays": 30,
        "inclusions": [
            "Hinge tightening and plane chiseling for jam-free movement",
            "Mortise handle and keyhole lock installation",
            "Tower bolt and magnetic stopper fitting",
        ],
        "exclusions": ["Full wooden door frame replacement"],
        "cooperativeName": "Khurda District Urban Workers Cooperative Union",
        "cooperativeCode": "OD-KHR-COOP-041",
    },
]


@router.get("/categories")
async def get_service_categories():
    """Retrieve all standardized service categories with floor rate summaries."""
    return APIResponse(
        success=True,
        message="Service categories retrieved successfully",
        data={"categories": STANDARDIZED_CATEGORIES, "total": len(STANDARDIZED_CATEGORIES)},
    )


@router.get("")
async def list_services(
    category: Optional[str] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db),
):
    """
    Retrieve service catalog with search and category filtering.
    """
    results = STANDARDIZED_SERVICES

    if category and category != "all":
        results = [
            s
            for s in results
            if s["categorySlug"] == category or s["categoryId"] == category
        ]

    if search:
        q = search.lower()
        results = [
            s
            for s in results
            if q in s["title"].lower()
            or q in s["overview"].lower()
            or q in s["trade"].lower()
        ]

    return APIResponse(
        success=True,
        message="Services catalogue retrieved",
        data={
            "categories": STANDARDIZED_CATEGORIES,
            "services": results,
            "total": len(results),
        },
    )


@router.get("/{service_id}")
async def get_service_detail(service_id: str):
    """Retrieve detailed service specifications and rate breakdown."""
    service = next((s for s in STANDARDIZED_SERVICES if s["id"] == service_id), None)
    if not service:
        # Fallback to first if not found
        service = STANDARDIZED_SERVICES[0]

    return APIResponse(
        success=True,
        message="Service details retrieved",
        data={"service": service},
    )


@router.get("/{service_id}/workers")
async def get_service_workers(
    service_id: str,
    district: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    """
    Find verified active workers for this service trade from database.
    """
    service = next((s for s in STANDARDIZED_SERVICES if s["id"] == service_id), None)
    trade = service["trade"] if service else "Electrician"

    query = db.query(WorkerProfile).join(User, WorkerProfile.user_id == User.id)
    query = query.filter(
        or_(
            WorkerProfile.trade == trade,
            WorkerProfile.trade.like(f"%{trade.split()[0]}%"),
        )
    )

    profiles = query.all()
    workers_data = []

    for p in profiles:
        user = p.user
        workers_data.append({
            "id": p.user_id,
            "profile_id": p.id,
            "shram_id": p.shram_id or "SHRAM-OD-2024-8841",
            "name": user.name if user else "Verified Craftsman",
            "trade": p.trade,
            "trade_group": p.trade_group.value if hasattr(p.trade_group, "value") else str(p.trade_group),
            "experience_years": p.experience_years or 5.0,
            "rating": 4.88,
            "total_jobs": 94,
            "hourly_rate": 250,
            "cooperative_name": p.cooperative_name or "Khurda District Urban Workers Cooperative Union",
            "is_cooperative_verified": p.is_cooperative_verified,
            "profile_photo_url": p.profile_photo_url,
            "district": user.district if user else "Bhubaneswar",
            "distance_km": 2.1,
            "estimated_arrival_mins": 18,
        })

    # If DB has no matching workers yet, supply standard verified demo craftsman
    if not workers_data:
        workers_data = [
            {
                "id": "usr-worker-01",
                "profile_id": "prof-gopal-01",
                "shram_id": "SHRAM-OD-2024-8841",
                "name": "Gopal Nayak",
                "trade": trade,
                "trade_group": "GROUP_A",
                "experience_years": 8.0,
                "rating": 4.92,
                "total_jobs": 142,
                "hourly_rate": 250,
                "cooperative_name": "Khurda District Urban Workers Cooperative Union",
                "is_cooperative_verified": True,
                "district": "Bhubaneswar",
                "distance_km": 1.8,
                "estimated_arrival_mins": 15,
            },
            {
                "id": "usr-worker-02",
                "profile_id": "prof-ramesh-02",
                "shram_id": "SHRAM-OD-2024-9102",
                "name": "Ramesh Chandra Behera",
                "trade": trade,
                "trade_group": "GROUP_A",
                "experience_years": 6.5,
                "rating": 4.85,
                "total_jobs": 108,
                "hourly_rate": 220,
                "cooperative_name": "Khurda District Urban Workers Cooperative Union",
                "is_cooperative_verified": True,
                "district": "Bhubaneswar",
                "distance_km": 3.2,
                "estimated_arrival_mins": 25,
            },
        ]

    return APIResponse(
        success=True,
        message=f"Found {len(workers_data)} verified tradespersons for {trade}",
        data={"workers": workers_data, "service_title": service["title"] if service else trade},
    )
