import { apiClient } from './api';

export type TradeGroup = 'GROUP_A' | 'GROUP_B' | 'GROUP_C' | 'GROUP_D';

export interface TradePolicy {
  trade: string;
  slug: string;
  group: TradeGroup;
  group_label: string;
  certificate_requirement: 'Mandatory' | 'Optional' | 'Evidence' | 'None';
  description: string;
  suggested_skills: string[];
}

export interface Cooperative {
  id: string;
  name: string;
  code: string;
  district: string;
  address: string;
  officer_name: string;
  contact_phone: string;
  registered_workers_count: number;
}

export interface WorkerOnboardingPayload {
  name: string;
  alternate_phone?: string;
  gender?: string;
  age?: number;
  preferred_language: string;
  district: string;
  address_line?: string;
  profile_photo_url?: string;

  cooperative_id: string;
  cooperative_name: string;

  trade: string;
  trade_group: TradeGroup;

  experience_years: number;
  bio?: string;
  skills: string[];

  identity_document: {
    document_type: 'AADHAAR' | 'PAN' | 'VOTER_ID' | 'BPL_CARD';
    document_number: string;
    document_ref?: string;
  };
  certifications: Array<{
    certificate_name: string;
    issuing_authority: string;
    certificate_number?: string;
    issue_year?: number;
    document_url?: string;
  }>;
  is_police_cleared: boolean;

  preferences: {
    preferred_radius_km: number;
    max_radius_km: number;
    allow_outside_suggestions: boolean;
    preferred_shift: string;
    is_available_for_emergency: boolean;
  };

  portfolio: Array<{
    title: string;
    service_type: string;
    description?: string;
    image_url: string;
    before_image_url?: string;
    work_date?: string;
  }>;

  declaration_confirmed: boolean;
}

export interface WorkerProfileData {
  id: string;
  user_id: string;
  shram_id?: string;
  name: string;
  phone: string;
  trade: string;
  trade_group: TradeGroup;
  cooperative_name?: string;
  experience_years: number;
  bio?: string;
  profile_photo_url?: string;
  onboarding_status: 'DRAFT' | 'SUBMITTED' | 'VERIFIED' | 'REJECTED';
  current_step: number;
  is_verified: boolean;
  preferred_radius_km: number;
  max_radius_km: number;
  allow_outside_suggestions: boolean;
  skills: string[];
  masked_identity_doc?: string;
  total_certificates: number;
  total_portfolio_items: number;
}

export const FALLBACK_COOPERATIVES: Cooperative[] = [
  {
    id: 'coop-bbsr-01',
    name: 'Khurda District Urban Workers Cooperative Union',
    code: 'OD-KHR-COOP-041',
    district: 'Bhubaneswar',
    address: 'Sahid Nagar, Janpath, Bhubaneswar, Odisha 751007',
    officer_name: 'Shri Manoranjan Mohanty',
    contact_phone: '+91 674 2548891',
    registered_workers_count: 482,
  },
  {
    id: 'coop-ctc-02',
    name: 'Cuttack Mahanagar Shramik Sahayog Samiti',
    code: 'OD-CTC-COOP-019',
    district: 'Cuttack',
    address: 'Badambadi Bus Terminal Road, Cuttack 753012',
    officer_name: 'Smt. Binapani Das',
    contact_phone: '+91 671 2314567',
    registered_workers_count: 329,
  },
  {
    id: 'coop-puri-03',
    name: 'Puri Coastal Artisans & Labour Guild',
    code: 'OD-PRI-COOP-088',
    district: 'Puri',
    address: 'Grand Road, Near Gundicha Temple, Puri 752002',
    officer_name: 'Shri Dibakar Pradhan',
    contact_phone: '+91 675 2228410',
    registered_workers_count: 215,
  },
  {
    id: 'coop-rkl-04',
    name: 'Rourkela Steel City Technical Workers Society',
    code: 'OD-SNG-COOP-112',
    district: 'Sundargarh',
    address: 'Sector 5 Commercial Complex, Rourkela 769002',
    officer_name: 'Shri Ashok Kumar Sahoo',
    contact_phone: '+91 661 2401923',
    registered_workers_count: 394,
  },
];

export const FALLBACK_TRADE_POLICIES: TradePolicy[] = [
  {
    trade: 'Master Electrician',
    slug: 'electrician',
    group: 'GROUP_A',
    group_label: 'Group A: High Technical / Public Safety',
    certificate_requirement: 'Mandatory',
    description: 'Requires ITI Electrician Certificate or State Electrical Inspectorate Licence + documented experience.',
    suggested_skills: ['Wiring & Conduit', 'Inverter & UPS Setup', 'Fault Diagnosis', '3-Phase Distribution', 'Solar Panel Inverters'],
  },
  {
    trade: 'Commercial Driver',
    slug: 'driver',
    group: 'GROUP_A',
    group_label: 'Group A: High Technical / Public Safety',
    certificate_requirement: 'Mandatory',
    description: 'Requires Commercial Driving Licence (LMV/HMV) with clean background verification.',
    suggested_skills: ['City Driving', 'Night Long-Distance', 'Automatic & Manual Transmissions', 'Defensive Driving', 'Route Navigation'],
  },
  {
    trade: 'Patient Caregiver',
    slug: 'patient-caregiver',
    group: 'GROUP_A',
    group_label: 'Group A: High Technical / Public Safety',
    certificate_requirement: 'Mandatory',
    description: 'Requires Nursing / General Duty Assistant (GDA) diploma or healthcare accreditation.',
    suggested_skills: ['Vital Signs Monitoring', 'Post-Operative Care', 'Mobility Assistance', 'Medication Regimen', 'Oxygen Concentrator Handling'],
  },
  {
    trade: 'Master Plumber',
    slug: 'plumber',
    group: 'GROUP_B',
    group_label: 'Group B: Skilled Residential Maintenance',
    certificate_requirement: 'Optional',
    description: 'Experience is primary verification. Optional ITI or plumbing certs earn the verified craftsman badge.',
    suggested_skills: ['Pipe Leak Repair', 'Overhead Tank Installation', 'Sanitaryware Fitting', 'Pressure Pump Setup', 'Drainage Unclogging'],
  },
  {
    trade: 'Elderly Caregiver',
    slug: 'elderly-caregiver',
    group: 'GROUP_B',
    group_label: 'Group B: Skilled Residential Maintenance',
    certificate_requirement: 'Optional',
    description: 'Prior experience, compassionate caregiving history and cooperative background checks are primary.',
    suggested_skills: ['Mobility Support', 'Diet & Meal Prep', 'Companionship', 'Daily Routine Assistance', 'Fall Prevention'],
  },
  {
    trade: 'Child Caregiver',
    slug: 'child-caregiver',
    group: 'GROUP_B',
    group_label: 'Group B: Skilled Residential Maintenance',
    certificate_requirement: 'Optional',
    description: 'Prior child nursing / nanny experience and police clearance are primary.',
    suggested_skills: ['Infant Care', 'Toddler Engagement', 'Hygiene & Feeding', 'Early Learning Support', 'First Aid Basics'],
  },
  {
    trade: 'Furniture Carpenter',
    slug: 'carpenter',
    group: 'GROUP_C',
    group_label: 'Group C: Construction & Craft Trades',
    certificate_requirement: 'Evidence',
    description: 'Evaluated on years of trade work, portfolio photos of woodwork, and optional basic trade self-assessment.',
    suggested_skills: ['Modular Kitchen Assembly', 'Door & Lock Repair', 'Custom Furniture', 'Polishing & Varnishing', 'Laminate Work'],
  },
  {
    trade: 'Wall Painter',
    slug: 'painter',
    group: 'GROUP_C',
    group_label: 'Group C: Construction & Craft Trades',
    certificate_requirement: 'Evidence',
    description: 'Evaluated on years of painting experience and photo portfolio of interior/exterior finishes.',
    suggested_skills: ['Interior Emulsion', 'Waterproof Primer', 'Texture & Stencil Wall', 'Wood & Metal Enamel', 'Putty Leveling'],
  },
  {
    trade: 'Appliance Technician',
    slug: 'appliance-technician',
    group: 'GROUP_C',
    group_label: 'Group C: Construction & Craft Trades',
    certificate_requirement: 'Evidence',
    description: 'Experience with electronic/cooling appliances + portfolio photos of recent repairs.',
    suggested_skills: ['AC Gas Charging', 'Refrigerator Compressor', 'Washing Machine Motor', 'Microwave PCB', 'Geyser Element'],
  },
  {
    trade: 'Gardener & Landscaper',
    slug: 'gardener',
    group: 'GROUP_C',
    group_label: 'Group C: Construction & Craft Trades',
    certificate_requirement: 'Evidence',
    description: 'Assessed on lawn care, pruning and landscape maintenance experience.',
    suggested_skills: ['Lawn Mowing & Trimming', 'Pest Management', 'Seasonal Plant Care', 'Drip Irrigation', 'Soil Conditioning'],
  },
  {
    trade: 'Deep Cleaner',
    slug: 'cleaner',
    group: 'GROUP_D',
    group_label: 'Group D: Household & Support Services',
    certificate_requirement: 'None',
    description: 'Zero formal certifications required. Trust and reputation grow through completed shifts, reviews, and cooperative vetting.',
    suggested_skills: ['Bathroom Acid Scrubbing', 'Kitchen Degreasing', 'Sofa Vacuuming', 'Balcony Power Cleaning', 'Floor Machine Polishing'],
  },
  {
    trade: 'Domestic Helper',
    slug: 'domestic-helper',
    group: 'GROUP_D',
    group_label: 'Group D: Household & Support Services',
    certificate_requirement: 'None',
    description: 'Zero formal certifications required. Backed by local cooperative identity validation and customer ratings.',
    suggested_skills: ['Daily Dusting & Mopping', 'Utensil Cleaning', 'Laundry & Ironing', 'Meal Prep Assistance', 'Household Organization'],
  },
];

export const workerService = {
  async getTradePolicies(): Promise<TradePolicy[]> {
    try {
      const response = await apiClient.get('/workers/trades-and-groups');
      return response.data?.data?.trade_policies || FALLBACK_TRADE_POLICIES;
    } catch {
      return FALLBACK_TRADE_POLICIES;
    }
  },

  async getCooperatives(): Promise<Cooperative[]> {
    try {
      const response = await apiClient.get('/workers/cooperatives');
      return response.data?.data?.cooperatives || FALLBACK_COOPERATIVES;
    } catch {
      return FALLBACK_COOPERATIVES;
    }
  },

  async getOnboardingStatus(): Promise<WorkerProfileData | null> {
    try {
      const response = await apiClient.get('/workers/onboarding/status');
      return response.data?.data?.profile || null;
    } catch {
      return null;
    }
  },

  async submitOnboarding(payload: WorkerOnboardingPayload): Promise<WorkerProfileData> {
    const response = await apiClient.post('/workers/onboarding', payload);
    return response.data.data.profile;
  },
};

