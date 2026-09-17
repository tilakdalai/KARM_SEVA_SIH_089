export interface WorkerJob {
  id: string;
  bookingNumber: string;
  customerName: string;
  customerPhoneMasked: string;
  customerPhoto: string;
  serviceTitle: string;
  trade: string;
  category: string;
  address: string;
  landmark?: string;
  distanceKm: number;
  estimatedTravelMins: number;
  payoutAmount: number;
  scheduledTime: string;
  isEmergency: boolean;
  status: 'INCOMING' | 'ACCEPTED' | 'ON_THE_WAY' | 'ARRIVED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  otpCode?: string;
  notes?: string;
  tasksList: string[];
}

export interface WorkerEarningsSummary {
  todayEarnings: number;
  todayJobsCount: number;
  thisWeekEarnings: number;
  thisWeekJobsCount: number;
  thisMonthEarnings: number;
  thisMonthJobsCount: number;
  walletBalance: number;
  pendingSettlement: number;
  welfareContribution: number;
}

export interface WorkerProfileMock {
  id: string;
  shramId: string;
  name: string;
  phone: string;
  alternatePhone?: string;
  email: string;
  trade: string;
  tradeGroup: 'GROUP_A' | 'GROUP_B' | 'GROUP_C' | 'GROUP_D';
  cooperativeName: string;
  cooperativeCode: string;
  district: string;
  rating: number;
  totalJobs: number;
  onTimeRate: number;
  experienceYears: number;
  currentBadge: string;
  profileCompletionPercentage: number;
  isVerified: boolean;
  isPoliceCleared: boolean;
  preferredRadiusKm: number;
  maxRadiusKm: number;
  preferredShift: string;
  isOnline: boolean;
  profilePhoto: string;
  skills: string[];
  certifications: Array<{
    name: string;
    issuer: string;
    year: number;
    isVerified: boolean;
  }>;
  portfolio: Array<{
    id: string;
    title: string;
    tag: string;
    image: string;
    date: string;
    description: string;
  }>;
}

export const MOCK_WORKER_PROFILE: WorkerProfileMock = {
  id: 'worker-gopal-01',
  shramId: 'KS-OD-2024-8841',
  name: 'Gopal Chandra Nayak',
  phone: '+91 9876543211',
  alternatePhone: '+91 9437012345',
  email: 'gopal.nayak@karmseva.gov.in',
  trade: 'Master Electrician',
  tradeGroup: 'GROUP_A',
  cooperativeName: 'Khurda District Seva Cooperative Union',
  cooperativeCode: 'OD-KHR-COOP-041',
  district: 'Bhubaneswar',
  rating: 4.85,
  totalJobs: 94,
  onTimeRate: 98,
  experienceYears: 8,
  currentBadge: 'Master Certified Craftsman',
  profileCompletionPercentage: 90,
  isVerified: true,
  isPoliceCleared: true,
  preferredRadiusKm: 4.5,
  maxRadiusKm: 12.0,
  preferredShift: 'FULL_DAY',
  isOnline: true,
  profilePhoto: 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=400&auto=format&fit=crop&q=80',
  skills: [
    'Wiring & Conduit Fitting',
    '3-Phase Distribution & MCB',
    'Inverter & Solar UPS Setup',
    'Circuit Diagnostics & Grounding',
    'Industrial Appliance Repair',
  ],
  certifications: [
    {
      name: 'National Trade Certificate (NTC) - Electrician',
      issuer: 'National Council for Vocational Training (NCVT)',
      year: 2016,
      isVerified: true,
    },
    {
      name: 'Workman Permit License (Class A)',
      issuer: 'State Electrical Inspectorate, Odisha',
      year: 2018,
      isVerified: true,
    },
  ],
  portfolio: [
    {
      id: 'p-1',
      title: '3BHK Modular MCB Distribution Board',
      tag: 'Wiring & Circuit',
      image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=500&auto=format&fit=crop&q=80',
      date: 'Jan 2024',
      description: 'Full replacement of old fuse carriers with 12-way miniature circuit breakers and safety earthing.',
    },
    {
      id: 'p-2',
      title: 'Solar Inverter & Battery Bank Installation',
      tag: 'Power Setup',
      image: 'https://images.unsplash.com/photo-1581094288338-2314dddb7ece?w=500&auto=format&fit=crop&q=80',
      date: 'Nov 2023',
      description: '5kVA pure sinewave inverter setup with dual tubular battery rack and surge protection.',
    },
    {
      id: 'p-3',
      title: 'Commercial Restaurant Kitchen Wiring',
      tag: 'Commercial',
      image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=500&auto=format&fit=crop&q=80',
      date: 'Aug 2023',
      description: 'Heavy-duty industrial 3-phase wiring for commercial ovens and exhaust blowers.',
    },
  ],
};

export const MOCK_EARNINGS: WorkerEarningsSummary = {
  todayEarnings: 850,
  todayJobsCount: 2,
  thisWeekEarnings: 4650,
  thisWeekJobsCount: 11,
  thisMonthEarnings: 18400,
  thisMonthJobsCount: 42,
  walletBalance: 2450,
  pendingSettlement: 850,
  welfareContribution: 180,
};

export const MOCK_INCOMING_JOB: WorkerJob = {
  id: 'job-req-101',
  bookingNumber: 'BK-2024-8819',
  customerName: 'Ananya Patnaik',
  customerPhoneMasked: '+91 98765-XXXXX',
  customerPhoto: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
  serviceTitle: 'Ceiling Fan & Inverter Repair',
  trade: 'Master Electrician',
  category: 'Electrical',
  address: 'Plot 104, IRC Village, Near Crown Hotel, Nayapalli, Bhubaneswar',
  landmark: 'Opposite State Bank ATM',
  distanceKm: 2.1,
  estimatedTravelMins: 12,
  payoutAmount: 420,
  scheduledTime: 'Today, 2:30 PM (Immediate)',
  isEmergency: true,
  status: 'INCOMING',
  notes: 'Main inverter is beeping continuously and master bedroom fan stopped working.',
  tasksList: [
    'Inspect inverter fault codes & DC fuse',
    'Test battery terminal voltage',
    'Examine ceiling fan capacitor & coil',
    'Perform earth leakage check',
  ],
};

export const MOCK_ACTIVE_JOB: WorkerJob = {
  id: 'job-act-201',
  bookingNumber: 'BK-2024-7741',
  customerName: 'Subhashree Mohanty',
  customerPhoneMasked: '+91 94371-XXXXX',
  customerPhoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  serviceTitle: 'Main Distribution Board Tripping & Rewiring',
  trade: 'Master Electrician',
  category: 'Electrical',
  address: 'Flat 302, Niladri Vihar, Chandrasekharpur, Bhubaneswar',
  landmark: 'Near DAV Public School',
  distanceKm: 1.8,
  estimatedTravelMins: 9,
  payoutAmount: 650,
  scheduledTime: 'Today, 11:30 AM',
  isEmergency: false,
  status: 'ON_THE_WAY',
  otpCode: '4821',
  notes: 'Air conditioner circuit breaker trips every 10 minutes.',
  tasksList: [
    'Check 32A MCB load capacity',
    'Megger insulation resistance test',
    'Tighten distribution busbar terminals',
    'Customer start-shift OTP verification',
  ],
};

export const MOCK_WORKER_JOBS_LIST: WorkerJob[] = [
  MOCK_ACTIVE_JOB,
  {
    id: 'job-sch-301',
    bookingNumber: 'BK-2024-9912',
    customerName: 'Dr. Debasis Mishra',
    customerPhoneMasked: '+91 98610-XXXXX',
    customerPhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    serviceTitle: 'Clinic Backup Generator Transfer Switch',
    trade: 'Master Electrician',
    category: 'Electrical',
    address: 'Plot 45, Saheed Nagar, Janpath, Bhubaneswar',
    distanceKm: 3.2,
    estimatedTravelMins: 16,
    payoutAmount: 780,
    scheduledTime: 'Tomorrow, 10:00 AM',
    isEmergency: false,
    status: 'ACCEPTED',
    tasksList: ['Changeover switch wiring', 'Phase load balancing'],
  },
  {
    id: 'job-comp-401',
    bookingNumber: 'BK-2024-6621',
    customerName: 'Priyadarshini Sahoo',
    customerPhoneMasked: '+91 97781-XXXXX',
    customerPhoto: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    serviceTitle: 'Kitchen Geyser & Exhaust Point Installation',
    trade: 'Master Electrician',
    category: 'Electrical',
    address: 'Duplex 12, Kalinga Nagar, Ghatikia, Bhubaneswar',
    distanceKm: 4.1,
    estimatedTravelMins: 20,
    payoutAmount: 500,
    scheduledTime: 'Yesterday, 4:00 PM',
    isEmergency: false,
    status: 'COMPLETED',
    tasksList: ['Installed 16A modular power point', 'Connected 15L geyser'],
  },
  {
    id: 'job-comp-402',
    bookingNumber: 'BK-2024-5510',
    customerName: 'Manoj Kumar Panda',
    customerPhoneMasked: '+91 94372-XXXXX',
    customerPhoto: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    serviceTitle: 'Full House Electrical Earthing Resistance Check',
    trade: 'Master Electrician',
    category: 'Electrical',
    address: 'Plot 77, Jagamara, Khandagiri, Bhubaneswar',
    distanceKm: 3.8,
    estimatedTravelMins: 18,
    payoutAmount: 350,
    scheduledTime: '2 days ago',
    isEmergency: false,
    status: 'COMPLETED',
    tasksList: ['Checked chemical earth pit', 'Earth electrode salt recharge'],
  },
];

export const MOCK_SCHEDULE_DAYS = [
  { day: 'Mon', date: '2 Sep', shiftsCount: 3, earnings: '₹1,250', isToday: true },
  { day: 'Tue', date: '3 Sep', shiftsCount: 2, earnings: '₹780', isToday: false },
  { day: 'Wed', date: '4 Sep', shiftsCount: 4, earnings: '₹1,600', isToday: false },
  { day: 'Thu', date: '5 Sep', shiftsCount: 2, earnings: '₹850', isToday: false },
  { day: 'Fri', date: '6 Sep', shiftsCount: 3, earnings: '₹1,100', isToday: false },
  { day: 'Sat', date: '7 Sep', shiftsCount: 5, earnings: '₹2,100', isToday: false },
  { day: 'Sun', date: '8 Sep', shiftsCount: 0, earnings: 'Rest Day', isToday: false },
];

export const MOCK_SETTLEMENTS = [
  {
    id: 'settle-01',
    refNumber: 'SET-OD-2024-9941',
    date: 'Today, 6:00 PM',
    amount: 850,
    jobsCount: 2,
    bankName: 'State Bank of India (A/C **** 4819)',
    status: 'PROCESSING',
    breakdown: { baseWage: 825, incentive: 25, welfareDeduction: 0 },
  },
  {
    id: 'settle-02',
    refNumber: 'SET-OD-2024-9830',
    date: 'Yesterday, 7:30 PM',
    amount: 1450,
    jobsCount: 3,
    bankName: 'State Bank of India (A/C **** 4819)',
    status: 'CREDITED',
    breakdown: { baseWage: 1400, incentive: 50, welfareDeduction: 0 },
  },
  {
    id: 'settle-03',
    refNumber: 'SET-OD-2024-9712',
    date: '31 Aug 2024',
    amount: 2350,
    jobsCount: 5,
    bankName: 'State Bank of India (A/C **** 4819)',
    status: 'CREDITED',
    breakdown: { baseWage: 2280, incentive: 70, welfareDeduction: 0 },
  },
];

export const MOCK_WORKER_REVIEWS = [
  {
    id: 'rev-1',
    citizenName: 'Dr. Debasis Mishra',
    rating: 5,
    date: 'Yesterday',
    tradeTag: 'Wiring & Circuit',
    comment: 'Extremely professional master electrician. Arrived right on time, explained the MCB tripping issue clearly, and fixed the circuit safely.',
  },
  {
    id: 'rev-2',
    citizenName: 'Ananya Patnaik',
    rating: 5,
    date: '3 days ago',
    tradeTag: 'Inverter Setup',
    comment: 'Punctual, polite, and very knowledgeable about solar inverters. The cooperative transparent pricing gave me total peace of mind.',
  },
  {
    id: 'rev-3',
    citizenName: 'Manoj Kumar Panda',
    rating: 4.8,
    date: '1 week ago',
    tradeTag: 'Earthing Check',
    comment: 'Very thorough safety inspection. Cleaned up all dust after conduit drilling. 100% recommended!',
  },
];
