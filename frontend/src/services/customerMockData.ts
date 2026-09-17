export interface WorkerMock {
  id: string;
  name: string;
  photo: string;
  shramId: string;
  trade: string;
  tradeCategory: string;
  cooperativeName: string;
  rating: number;
  totalReviews: number;
  totalJobs: number;
  experienceYears: number;
  distanceKm: number;
  startingRate: number;
  rateUnit: string;
  isVerified: boolean;
  verificationBadges: string[];
  reviewBadges: string[];
  isAvailableNow: boolean;
  nextSlot?: string;
  bio: string;
  skills: string[];
  certificates: { name: string; issuer: string; year: string }[];
  portfolio: { title: string; image: string; tag: string }[];
  ratingsBreakdown: { 5: number; 4: number; 3: number; 2: number; 1: number };
  recentReviews: {
    id: string;
    userName: string;
    rating: number;
    date: string;
    comment: string;
    tradeTag: string;
  }[];
  serviceRadiusKm: number;
  serviceAreas: string[];
}

export interface ServiceCategoryMock {
  id: string;
  slug: string;
  title: string;
  hindiTitle: string;
  odiaTitle: string;
  iconName: string;
  startingPrice: number;
  availableWorkers: number;
  popular: boolean;
  shortDesc: string;
  color: string;
}

export interface ServiceDetailMock {
  id: string;
  slug: string;
  categoryId: string;
  categoryName: string;
  title: string;
  tagline: string;
  bannerImage: string;
  standardPrice: number;
  estimatedDuration: string;
  rating: number;
  reviewsCount: number;
  overview: string;
  inclusions: string[];
  exclusions: string[];
  safetyGuarantees: string[];
  faqs: { question: string; answer: string }[];
  matchedWorkerIds: string[];
}

export interface BookingMock {
  id: string;
  bookingNumber: string;
  serviceTitle: string;
  trade: string;
  workerId: string;
  workerName: string;
  workerPhoto: string;
  workerPhoneMasked: string;
  workerShramId: string;
  cooperativeName: string;
  status: 'ACTIVE' | 'SCHEDULED' | 'COMPLETED' | 'CANCELLED';
  scheduledDateTime: string;
  bookingAddress: string;
  addressType: 'Home' | 'Office' | 'Parents';
  totalAmount: number;
  baseFare: number;
  cooperativeFee: number;
  gstAmount: number;
  paymentStatus: 'PAID_ESCROW' | 'PAYMENT_PENDING' | 'REFUNDED';
  paymentMethod: string;
  otpCode: string;
  currentStep: number; // 1 to 5
  etaMinutes?: number;
  distanceKm?: number;
  replacementGuardActive: boolean;
  replacementWorkerAssigned?: boolean;
  notes?: string;
  timeline: {
    step: number;
    title: string;
    time: string;
    completed: boolean;
    active: boolean;
    description: string;
  }[];
}

export interface SavedAddressMock {
  id: string;
  label: 'Home' | 'Office' | 'Parents' | 'Other';
  recipientName: string;
  phone: string;
  flatPlot: string;
  areaLocality: string;
  district: string;
  pincode: string;
  isDefault: boolean;
}

export interface NotificationMock {
  id: string;
  type: 'BOOKING' | 'ETA' | 'PAYMENT' | 'COOPERATIVE' | 'SYSTEM';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
}

// 1. Service Categories Mock
export const MOCK_CATEGORIES: ServiceCategoryMock[] = [
  {
    id: 'cat-1',
    slug: 'electrician',
    title: 'Electrician',
    hindiTitle: 'इलेक्ट्रीशियन',
    odiaTitle: 'ବିଦ୍ୟୁତ ମିସ୍ତ୍ରୀ',
    iconName: 'Zap',
    startingPrice: 299,
    availableWorkers: 34,
    popular: true,
    shortDesc: 'Switches, wiring, MCB, fan & appliance setup',
    color: 'from-amber-500 to-amber-600',
  },
  {
    id: 'cat-2',
    slug: 'plumber',
    title: 'Plumber',
    hindiTitle: 'प्लंबर',
    odiaTitle: 'ପ୍ଲମ୍ବର',
    iconName: 'Droplet',
    startingPrice: 249,
    availableWorkers: 28,
    popular: true,
    shortDesc: 'Pipe leakage, taps, geysers, sanitary & water motors',
    color: 'from-blue-500 to-blue-600',
  },
  {
    id: 'cat-3',
    slug: 'carpenter',
    title: 'Carpenter',
    hindiTitle: 'बढ़ई',
    odiaTitle: 'ବଢ଼େଇ',
    iconName: 'Hammer',
    startingPrice: 349,
    availableWorkers: 19,
    popular: true,
    shortDesc: 'Furniture repair, door locks, hinges & modular woodwork',
    color: 'from-amber-700 to-amber-800',
  },
  {
    id: 'cat-4',
    slug: 'painter',
    title: 'Painter',
    hindiTitle: 'पेंटर',
    odiaTitle: 'ରଙ୍ଗ ମିସ୍ତ୍ରୀ',
    iconName: 'Paintbrush',
    startingPrice: 499,
    availableWorkers: 22,
    popular: false,
    shortDesc: 'Interior/exterior whitewash, wall putty & texture art',
    color: 'from-emerald-500 to-emerald-600',
  },
  {
    id: 'cat-5',
    slug: 'driver',
    title: 'Driver',
    hindiTitle: 'ड्राइवर',
    odiaTitle: 'ଚାଳକ / ଡ୍ରାଇଭର',
    iconName: 'Car',
    startingPrice: 450,
    availableWorkers: 16,
    popular: false,
    shortDesc: 'Verified commercial & private vehicle day/night drivers',
    color: 'from-indigo-500 to-indigo-600',
  },
  {
    id: 'cat-6',
    slug: 'patient-caregiver',
    title: 'Patient Caregiver',
    hindiTitle: 'रोगी परिचारक',
    odiaTitle: 'ରୋଗୀ ସେବକ',
    iconName: 'Stethoscope',
    startingPrice: 650,
    availableWorkers: 25,
    popular: true,
    shortDesc: 'Post-surgery vitals, medication schedule, mobility support',
    color: 'from-rose-500 to-rose-600',
  },
  {
    id: 'cat-7',
    slug: 'elderly-caregiver',
    title: 'Elderly Caregiver',
    hindiTitle: 'बुजुर्ग परिचारक',
    odiaTitle: 'ବୃଦ୍ଧ ସେବକ',
    iconName: 'HeartHandshake',
    startingPrice: 600,
    availableWorkers: 21,
    popular: true,
    shortDesc: 'Compassionate companion, diet tracking & emergency watch',
    color: 'from-teal-500 to-teal-600',
  },
  {
    id: 'cat-8',
    slug: 'child-caregiver',
    title: 'Child Caregiver',
    hindiTitle: 'बाल परिचारक',
    odiaTitle: 'ଶିଶୁ ପାଳନକାରୀ',
    iconName: 'Baby',
    startingPrice: 550,
    availableWorkers: 18,
    popular: false,
    shortDesc: 'Infant care, active supervision & verified background',
    color: 'from-orange-500 to-orange-600',
  },
  {
    id: 'cat-9',
    slug: 'cleaner',
    title: 'Deep Cleaner',
    hindiTitle: 'सफाई कर्मी',
    odiaTitle: 'ଗୃହ ସଫେଇ',
    iconName: 'Sparkles',
    startingPrice: 399,
    availableWorkers: 31,
    popular: true,
    shortDesc: 'Full house, kitchen, bathroom & sanitization deep cleaning',
    color: 'from-cyan-500 to-cyan-600',
  },
  {
    id: 'cat-10',
    slug: 'domestic-helper',
    title: 'Domestic Helper',
    hindiTitle: 'घरेलू सहायक',
    odiaTitle: 'ଘରୋଇ ସହାୟକ',
    iconName: 'Home',
    startingPrice: 300,
    availableWorkers: 40,
    popular: true,
    shortDesc: 'Dishwashing, floor mopping, dusting & meal assistance',
    color: 'from-pink-500 to-pink-600',
  },
  {
    id: 'cat-11',
    slug: 'gardener',
    title: 'Gardener',
    hindiTitle: 'माली',
    odiaTitle: 'ମାଳି',
    iconName: 'Flower2',
    startingPrice: 280,
    availableWorkers: 14,
    popular: false,
    shortDesc: 'Lawn trimming, potting, plant nourishment & pest care',
    color: 'from-green-600 to-green-700',
  },
  {
    id: 'cat-12',
    slug: 'appliance-technician',
    title: 'Appliance Technician',
    hindiTitle: 'उपकरण तकनीशियन',
    odiaTitle: 'ଯନ୍ତ୍ରାଂଶ ମିସ୍ତ୍ରୀ',
    iconName: 'Wrench',
    startingPrice: 399,
    availableWorkers: 26,
    popular: true,
    shortDesc: 'AC repair, refrigerator, washing machine & microwave fix',
    color: 'from-violet-500 to-violet-600',
  },
];

// 2. Verified Workers Mock
export const MOCK_WORKERS: WorkerMock[] = [
  {
    id: 'worker-1',
    name: 'Gopal Nayak',
    photo: 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?auto=format&fit=crop&w=400&q=80',
    shramId: 'KS-OD-2024-8841',
    trade: 'Master Electrician',
    tradeCategory: 'electrician',
    cooperativeName: 'Bhubaneswar Multi-Purpose Labour Cooperative',
    rating: 4.8,
    totalReviews: 92,
    totalJobs: 92,
    experienceYears: 8,
    distanceKm: 2.1,
    startingRate: 299,
    rateUnit: 'per visit / repair',
    isVerified: true,
    verificationBadges: ['Cooperative Verified', 'Police Cleared', 'ITI Certified'],
    reviewBadges: ['Punctual Master', 'Safety First', 'Zero Complaint'],
    isAvailableNow: true,
    nextSlot: 'Today, 2:30 PM',
    bio: 'Government ITI Certified Master Electrician with 8+ years experience in high-voltage residential wiring, inverter systems, and modular appliance installations. Dedicated to 100% electrical safety standards.',
    skills: [
      'Residential Concealed Wiring',
      'Inverter & Battery Setup',
      'Main Switchboard & MCB Upgrades',
      'Appliance Short-Circuit Diagnosis',
      'Solar Panel Maintenance'
    ],
    certificates: [
      { name: 'National Trade Certificate in Electrician Trade', issuer: 'Govt ITI Bhubaneswar (NCVT)', year: '2016' },
      { name: 'Domestic Electrical Safety Specialist (Level 4)', issuer: 'Skill India / NSDC', year: '2019' },
    ],
    portfolio: [
      { title: 'Concealed 3-Phase DB Box Fitting', image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=500&q=80', tag: 'Wiring' },
      { title: 'Inverter & Sine Wave UPS Bank', image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=500&q=80', tag: 'Power' },
      { title: 'Smart LED Architectural Strip Fitting', image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=500&q=80', tag: 'Lighting' },
    ],
    ratingsBreakdown: { 5: 78, 4: 12, 3: 2, 2: 0, 1: 0 },
    recentReviews: [
      {
        id: 'rev-1',
        userName: 'Subhashree Dash',
        rating: 5,
        date: '2 days ago',
        comment: 'Gopal reached exactly within 20 minutes! Diagnosed the MCB tripping problem in our kitchen in 5 mins. Very polite, clean work, and transparent rate.',
        tradeTag: 'Emergency Electrical Fix',
      },
      {
        id: 'rev-2',
        userName: 'Debabrata Mohanty',
        rating: 5,
        date: '1 week ago',
        comment: 'Installed 3 ceiling fans and replaced the main inverter battery. Carried all professional testing tools. Cooperative wage guarantee makes this platform trustworthy.',
        tradeTag: 'Inverter Installation',
      },
    ],
    serviceRadiusKm: 4.0,
    serviceAreas: ['Nayapalli', 'IRC Village', 'Jayadev Vihar', 'Saheed Nagar', 'Chandrasekharpur'],
  },
  {
    id: 'worker-2',
    name: 'Bikash Jena',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    shramId: 'KS-OD-2024-3329',
    trade: 'Expert Plumber',
    tradeCategory: 'plumber',
    cooperativeName: 'Khurda District Labour Cooperative Union',
    rating: 4.9,
    totalReviews: 114,
    totalJobs: 114,
    experienceYears: 10,
    distanceKm: 1.8,
    startingRate: 249,
    rateUnit: 'per service call',
    isVerified: true,
    verificationBadges: ['Cooperative Verified', 'Police Cleared', 'Master Craftsman'],
    reviewBadges: ['Leakage Specialist', 'Super Clean', 'Top Rated'],
    isAvailableNow: true,
    nextSlot: 'Today, 1:45 PM',
    bio: '10 years expertise in CPVC/UPVC pipelines, overhead water tank cleaning, pressure pump installation, and concealed leakage detection with modern acoustic sensors.',
    skills: [
      'Concealed Pipe Leakage Detection',
      'Bathroom Sanitary Ware Installation',
      'Water Motor & Automatic Level Controller',
      'Overhead Tank Descaling & Sanitization',
      'Kitchen Sink & Drain Unclogging'
    ],
    certificates: [
      { name: 'Advanced Plumbing & Sanitary Certification', issuer: 'Odisha State Skill Development Authority (OSDA)', year: '2015' },
    ],
    portfolio: [
      { title: 'Concealed Shower Mixer Fitting', image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=500&q=80', tag: 'Sanitary' },
      { title: '1000L Triple Layer Tank Installation', image: 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=500&q=80', tag: 'Plumbing' },
    ],
    ratingsBreakdown: { 5: 104, 4: 9, 3: 1, 2: 0, 1: 0 },
    recentReviews: [
      {
        id: 'rev-3',
        userName: 'Ramesh Chandra Panda',
        rating: 5,
        date: '3 days ago',
        comment: 'Fixed our stubborn bathroom ceiling leakage that 2 other plumbers failed to locate. Bikash had the right tools and did not damage our tiles.',
        tradeTag: 'Leakage Repair',
      },
    ],
    serviceRadiusKm: 4.5,
    serviceAreas: ['Nayapalli', 'Khandagiri', 'Baramunda', 'Bhubaneswar Old Town'],
  },
  {
    id: 'worker-3',
    name: 'Basanti Mahato',
    photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    shramId: 'KS-OD-2024-5102',
    trade: 'Senior Patient & Elderly Nurse',
    tradeCategory: 'patient-caregiver',
    cooperativeName: 'Bhubaneswar Women Caregiver Cooperative Society',
    rating: 4.95,
    totalReviews: 76,
    totalJobs: 76,
    experienceYears: 9,
    distanceKm: 2.8,
    startingRate: 650,
    rateUnit: 'per 8h shift',
    isVerified: true,
    verificationBadges: ['Cooperative Verified', 'ANM Nursing Registered', 'Police Cleared'],
    reviewBadges: ['Compassionate', 'Punctual Care', 'Vitals Expert'],
    isAvailableNow: false,
    nextSlot: 'Tomorrow, 8:00 AM',
    bio: 'Registered Auxiliary Nurse Midwife (ANM) specializing in post-operative care, elderly mobility, blood sugar/BP monitoring, Ryle’s tube feeding, and compassionate daily assistance.',
    skills: [
      'Post-Stroke Rehabilitation Care',
      'Diabetes & Vitals Logging',
      'Bed Sore Prevention & Wound Dressing',
      'Elderly Mobility & Physical Exercise',
      'Emergency First Aid Certified'
    ],
    certificates: [
      { name: 'Auxiliary Nurse & Midwife (ANM) Diploma', issuer: 'Odisha Nurses & Midwives Council', year: '2015' },
      { name: 'Geriatric Healthcare Companion', issuer: 'National Institute of Social Defence (NISD)', year: '2020' },
    ],
    portfolio: [
      { title: 'Vitals Management & Medicine Schedule Setup', image: 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&w=500&q=80', tag: 'Nursing' },
    ],
    ratingsBreakdown: { 5: 72, 4: 4, 3: 0, 2: 0, 1: 0 },
    recentReviews: [
      {
        id: 'rev-4',
        userName: 'Sanjukta Tripathy',
        rating: 5,
        date: 'Yesterday',
        comment: 'Basanti took care of my 82-year-old mother after hip replacement surgery with extraordinary warmth and diligence. Very blessed to find her through KARM SEVA.',
        tradeTag: 'Post-Op Elderly Care',
      },
    ],
    serviceRadiusKm: 5.0,
    serviceAreas: ['Nayapalli', 'Saheed Nagar', 'Patia', 'Khandagiri'],
  },
  {
    id: 'worker-4',
    name: 'Priyabrata Jena',
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    shramId: 'KS-OD-2024-1102',
    trade: 'Certified AC & Appliance Technician',
    tradeCategory: 'appliance-technician',
    cooperativeName: 'Bhubaneswar Multi-Purpose Labour Cooperative',
    rating: 4.7,
    totalReviews: 64,
    totalJobs: 64,
    experienceYears: 6,
    distanceKm: 3.2,
    startingRate: 399,
    rateUnit: 'per appliance service',
    isVerified: true,
    verificationBadges: ['Cooperative Verified', 'HVAC Certified', 'Police Cleared'],
    reviewBadges: ['Gas Leakage Expert', 'On-Time', 'Fair Pricing'],
    isAvailableNow: true,
    nextSlot: 'Today, 4:00 PM',
    bio: 'Specialist in inverter split AC jet cleaning, gas charging, refrigerator PCB debugging, and automatic front-load washing machine repairs.',
    skills: [
      'Split & Window AC Jet Foam Servicing',
      'R32 & R410A Refrigerant Leak Testing & Gas Top-Up',
      'Inverter Refrigerator PCB Diagnosis',
      'Fully Automatic Washing Machine Drum Repair'
    ],
    certificates: [
      { name: 'Refrigeration and Air Conditioning Technician', issuer: 'Directorate General of Training (DGT)', year: '2018' },
    ],
    portfolio: [
      { title: 'High-Pressure AC Jet Foam Wash', image: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=500&q=80', tag: 'HVAC' },
    ],
    ratingsBreakdown: { 5: 50, 4: 12, 3: 2, 2: 0, 1: 0 },
    recentReviews: [
      {
        id: 'rev-5',
        userName: 'Alok Kumar Mohanty',
        rating: 5,
        date: '5 days ago',
        comment: 'AC was not cooling in peak heat. Priyabrata did complete jet foam cleaning and checked gas pressure. Cooling is back like brand new.',
        tradeTag: 'AC Jet Cleaning',
      },
    ],
    serviceRadiusKm: 5.0,
    serviceAreas: ['Nayapalli', 'Jayadev Vihar', 'Patia', 'Infocity'],
  },
  {
    id: 'worker-5',
    name: 'Kailash Sahoo',
    photo: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=400&q=80',
    shramId: 'KS-OD-2024-9041',
    trade: 'Master Carpenter',
    tradeCategory: 'carpenter',
    cooperativeName: 'Khurda District Labour Cooperative Union',
    rating: 4.85,
    totalReviews: 88,
    totalJobs: 88,
    experienceYears: 12,
    distanceKm: 2.4,
    startingRate: 349,
    rateUnit: 'per repair session',
    isVerified: true,
    verificationBadges: ['Cooperative Verified', 'Police Cleared', '12 Yrs Veteran'],
    reviewBadges: ['Precision Woodwork', 'Fast Lock Repair', 'Affordable'],
    isAvailableNow: true,
    nextSlot: 'Today, 3:15 PM',
    bio: '12 years of craftsmanship in modular kitchen repairs, antique wooden restoration, hydraulic bed hinges, door latch alignments, and bespoke plywood assemblies.',
    skills: [
      'Hydraulic Bed Hinge & Channel Replacement',
      'Door Lock & Mortise Fitting',
      'Modular Kitchen Drawer Realignment',
      'Termite-Proof Wood Lacquering'
    ],
    certificates: [
      { name: 'Carpentry & Joinery Master Trade', issuer: 'National Skill Development Corporation (NSDC)', year: '2014' },
    ],
    portfolio: [
      { title: 'Custom Teakwood Door Lock Installation', image: 'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=500&q=80', tag: 'Carpentry' },
    ],
    ratingsBreakdown: { 5: 75, 4: 11, 3: 2, 2: 0, 1: 0 },
    recentReviews: [
      {
        id: 'rev-6',
        userName: 'Tanmay Das',
        rating: 5,
        date: '4 days ago',
        comment: 'Fixed our heavy main door alignment in 30 minutes and installed a digital smart lock without chipping the wood. Highly recommended.',
        tradeTag: 'Door Lock Repair',
      },
    ],
    serviceRadiusKm: 4.0,
    serviceAreas: ['Nayapalli', 'Saheed Nagar', 'Master Canteen', 'Unit 4'],
  },
  {
    id: 'worker-6',
    name: 'Rashmita Behera',
    photo: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80',
    shramId: 'KS-OD-2024-7720',
    trade: 'Deep Cleaning Specialist',
    tradeCategory: 'cleaner',
    cooperativeName: 'Bhubaneswar Women Caregiver Cooperative Society',
    rating: 4.88,
    totalReviews: 95,
    totalJobs: 95,
    experienceYears: 5,
    distanceKm: 1.5,
    startingRate: 399,
    rateUnit: 'per room deep clean',
    isVerified: true,
    verificationBadges: ['Cooperative Verified', 'Hygiene Trained', 'Police Cleared'],
    reviewBadges: ['Spotless Finish', 'Punctual Team', 'Eco-Friendly Chemicals'],
    isAvailableNow: true,
    nextSlot: 'Today, 2:00 PM',
    bio: 'Professional deep sanitization, kitchen degreasing, bathroom grout descaling, and high-suction upholstery vacuuming with safe, hospital-grade eco solutions.',
    skills: [
      'Modular Kitchen Chimney & Tile Degreasing',
      'Bathroom Hard Water Stain Removal',
      'Sofa & Mattress Steam Extraction',
      'Floor Buffing & Anti-Bacterial Sanitization'
    ],
    certificates: [
      { name: 'Certified Facility Hygiene Associate', issuer: 'Tourism & Hospitality Skill Council', year: '2021' },
    ],
    portfolio: [
      { title: 'Full Kitchen Degrease Transformation', image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=500&q=80', tag: 'Cleaning' },
    ],
    ratingsBreakdown: { 5: 84, 4: 9, 3: 2, 2: 0, 1: 0 },
    recentReviews: [
      {
        id: 'rev-7',
        userName: 'Pooja Patnaik',
        rating: 5,
        date: '6 days ago',
        comment: 'Bathroom and kitchen look brand new. Rashmita brought all her own scrubbers and eco-friendly liquids. Very thorough and trustworthy.',
        tradeTag: 'Kitchen Deep Clean',
      },
    ],
    serviceRadiusKm: 4.0,
    serviceAreas: ['Nayapalli', 'IRC Village', 'Acharya Vihar', 'Vani Vihar'],
  },
];

// 3. Service Details Mock
export const MOCK_SERVICES: ServiceDetailMock[] = [
  {
    id: 'srv-1',
    slug: 'electrician-maintenance',
    categoryId: 'cat-1',
    categoryName: 'Electrician',
    title: 'Complete Electrical Repair & Maintenance',
    tagline: 'Instant diagnostics, circuit repairs & appliance setup by verified cooperative electricians',
    bannerImage: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=800&q=80',
    standardPrice: 299,
    estimatedDuration: '45 - 90 mins',
    rating: 4.8,
    reviewsCount: 342,
    overview: 'Book a certified, cooperative-verified electrician for any household electrical troubleshooting. Covers switchboards, MCB trip fixes, socket replacements, ceiling fans, inverters, and emergency short-circuit inspections.',
    inclusions: [
      'Complete diagnostic check with multi-meter & safety load testing',
      'Minor wiring adjustments and switch/socket terminal tightening',
      'Ceiling fan / exhaust fan unmounting & remounting (up to 2 units)',
      'Post-service safety testing & 30-day cooperative service warranty'
    ],
    exclusions: [
      'New electrical spare parts / MCBs (charged at actual MRP or provided by customer)',
      'Major wall chipping / full house rewiring project scope',
      'High-tension 3-phase meter board grid adjustments'
    ],
    safetyGuarantees: [
      '100% Police & Cooperative background verified workers',
      'Zero upfront payment: Pay securely via Razorpay post-shift',
      'Replacement Guard: Automated standby dispatch if worker is delayed'
    ],
    faqs: [
      {
        question: 'How are the electrical service charges calculated?',
        answer: 'The base inspection and repair visit starts at ₹299. If spare parts are required, you can provide them directly or purchase them at standard cooperative verified MRP.'
      },
      {
        question: 'What if the electrician does not arrive on time?',
        answer: 'KARM SEVA active tracking monitors worker dispatch. If the worker is delayed by over 15 minutes, the cooperative auto-dispatches a replacement worker immediately.'
      }
    ],
    matchedWorkerIds: ['worker-1'],
  },
  {
    id: 'srv-2',
    slug: 'plumbing-leakage-fix',
    categoryId: 'cat-2',
    categoryName: 'Plumber',
    title: 'Water Leakage, Tap & Pipe Repair',
    tagline: 'Acoustic leakage detection, tap cartridge replacements & sanitary fitting fix',
    bannerImage: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80',
    standardPrice: 249,
    estimatedDuration: '30 - 60 mins',
    rating: 4.9,
    reviewsCount: 289,
    overview: 'Fast plumbing fix for leaking taps, concealed pipeline dampness, flush tanks, sink blockages, shower mixers, and water motor connection checks.',
    inclusions: [
      'Acoustic leakage localization & pressure test',
      'Repair or replacement of up to 3 tap washers/cartridges',
      'Sink trap and waste pipe cleaning & seal replacement',
      '30-day cooperative leakage warranty'
    ],
    exclusions: [
      'Sanitary porcelain fixtures (toilets/basins) purchasing cost',
      'Underground main water pipeline excavation'
    ],
    safetyGuarantees: [
      'Clean work practice: Zero water spillage damage guarantee',
      'Transparent rate card with no hidden travel fees',
      'Cooperative wage protection ensuring 100% payout to craftsman'
    ],
    faqs: [
      {
        question: 'Can the plumber bring replacement taps or washers?',
        answer: 'Yes, cooperative plumbers carry standard ISO-grade Teflon tapes, washers, braided hoses, and angle valves in their kit.'
      }
    ],
    matchedWorkerIds: ['worker-2'],
  },
  {
    id: 'srv-3',
    slug: 'patient-caregiver-shift',
    categoryId: 'cat-6',
    categoryName: 'Patient Caregiver',
    title: 'Verified Patient & Post-Surgery Nursing Care',
    tagline: 'Compassionate bedside care, medication monitoring & mobility assistance',
    bannerImage: 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&w=800&q=80',
    standardPrice: 650,
    estimatedDuration: '8-Hour Day/Night Shift',
    rating: 4.95,
    reviewsCount: 184,
    overview: 'Dedicated home nursing assistance for elderly recovery, stroke rehabilitation, surgical wound monitoring, vital signs tracking, and personal hygiene.',
    inclusions: [
      'Daily vitals logging (BP, Pulse, Blood Sugar, SpO2)',
      'Medication administration according to doctor prescription',
      'Assisted walking, wheelchair transfers & gentle range-of-motion physiotherapy',
      'Patient hygiene, sponge bath & bed sore prevention turns'
    ],
    exclusions: [
      'Prescription medicines and medical consumables (syringes, cotton, glucose strips)',
      'Full house cooking or heavy domestic cleaning'
    ],
    safetyGuarantees: [
      'ANM / GNM Nursing certified caregivers with hospital verification',
      'Emergency SOS direct escalation to cooperative supervisor',
      'Leave & Replacement Guarantee: 100% standby replacement during caregiver leaves'
    ],
    faqs: [
      {
        question: 'Can I book a 12-hour or 24-hour live-in caregiver?',
        answer: 'Yes, continuous multi-day and 24-hour rotational shifts can be scheduled with dedicated cooperative caregiver teams.'
      }
    ],
    matchedWorkerIds: ['worker-3'],
  },
  {
    id: 'srv-4',
    slug: 'deep-home-cleaning',
    categoryId: 'cat-9',
    categoryName: 'Deep Cleaner',
    title: 'Full Home & Kitchen Deep Sanitization',
    tagline: 'High-suction vacuuming, grout stain descaling & kitchen chimney degreasing',
    bannerImage: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80',
    standardPrice: 399,
    estimatedDuration: '2 - 3.5 hours',
    rating: 4.88,
    reviewsCount: 410,
    overview: 'Intensive deep cleaning for apartments, kitchens, and bathrooms. Uses high-power machines, industrial scrubbers, and skin-safe non-toxic disinfectants.',
    inclusions: [
      'Tile scrubbing, grout descaling & yellow stain removal',
      'Kitchen oil/grease removal on tiles, gas stove & countertops',
      'Window panes, sliding tracks & balcony high-pressure wash',
      'Complete floor machine buffing and anti-viral mopping'
    ],
    exclusions: [
      'Wall repainting or putty touch-up',
      'Internal cleaning of fragile locked cupboards without supervision'
    ],
    safetyGuarantees: [
      'Hospital-grade eco-friendly chemicals that are safe for kids and pets',
      'Trained women cooperative workforce teams with police verification',
      'Re-clean guarantee within 24 hours if any spot is missed'
    ],
    faqs: [
      {
        question: 'Do I need to provide cleaning liquids or buckets?',
        answer: 'No, cooperative cleaners bring their own professional solutions, scrubbers, microfiber cloths, and vacuum machines.'
      }
    ],
    matchedWorkerIds: ['worker-6'],
  },
];

// 4. Customer Bookings Mock
export const MOCK_BOOKINGS: BookingMock[] = [
  {
    id: 'book-101',
    bookingNumber: 'KS-BK-88319',
    serviceTitle: 'Emergency Electrical Repair',
    trade: 'Electrician',
    workerId: 'worker-1',
    workerName: 'Gopal Nayak',
    workerPhoto: 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?auto=format&fit=crop&w=400&q=80',
    workerPhoneMasked: '+91 98****3211',
    workerShramId: 'KS-OD-2024-8841',
    cooperativeName: 'Bhubaneswar Multi-Purpose Labour Cooperative',
    status: 'ACTIVE',
    scheduledDateTime: 'Today, 2:30 PM',
    bookingAddress: 'Plot 104, IRC Village, Nayapalli, Bhubaneswar · 751012',
    addressType: 'Home',
    totalAmount: 349,
    baseFare: 299,
    cooperativeFee: 25,
    gstAmount: 25,
    paymentStatus: 'PAID_ESCROW',
    paymentMethod: 'UPI / Razorpay Escrow',
    otpCode: '4821',
    currentStep: 3,
    etaMinutes: 14,
    distanceKm: 1.8,
    replacementGuardActive: true,
    replacementWorkerAssigned: false,
    notes: 'Main kitchen switchboard sparks when geyser is switched on. Needs urgent inspection.',
    timeline: [
      { step: 1, title: 'Booking Confirmed', time: '1:45 PM', completed: true, active: false, description: 'Booking created with cooperative escrow protection' },
      { step: 2, title: 'Worker Accepted Job', time: '1:48 PM', completed: true, active: false, description: 'Gopal Nayak confirmed with KARM ID #8841' },
      { step: 3, title: 'Worker On The Way', time: '2:15 PM', completed: false, active: true, description: 'Worker is 1.8 km away · ETA 14 mins' },
      { step: 4, title: 'Job In Progress', time: 'Pending Check-In', completed: false, active: false, description: 'Share OTP 4821 with worker upon arrival' },
      { step: 5, title: 'Service Completed', time: 'Pending', completed: false, active: false, description: 'Post-inspection approval & invoice generation' },
    ],
  },
  {
    id: 'book-102',
    bookingNumber: 'KS-BK-88204',
    serviceTitle: 'Bathroom Tap & Pipeline Leakage',
    trade: 'Plumber',
    workerId: 'worker-2',
    workerName: 'Bikash Jena',
    workerPhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    workerPhoneMasked: '+91 91****5671',
    workerShramId: 'KS-OD-2024-3329',
    cooperativeName: 'Khurda District Labour Cooperative Union',
    status: 'COMPLETED',
    scheduledDateTime: 'Yesterday, 11:00 AM',
    bookingAddress: 'Plot 104, IRC Village, Nayapalli, Bhubaneswar · 751012',
    addressType: 'Home',
    totalAmount: 299,
    baseFare: 249,
    cooperativeFee: 25,
    gstAmount: 25,
    paymentStatus: 'PAID_ESCROW',
    paymentMethod: 'UPI AutoPay',
    otpCode: '7732',
    currentStep: 5,
    replacementGuardActive: true,
    replacementWorkerAssigned: false,
    notes: 'Master bathroom shower pipe leaking inside wall partition.',
    timeline: [
      { step: 1, title: 'Booking Confirmed', time: '10:15 AM', completed: true, active: false, description: 'Booking confirmed' },
      { step: 2, title: 'Worker Assigned', time: '10:20 AM', completed: true, active: false, description: 'Bikash Jena accepted job' },
      { step: 3, title: 'Worker Arrived', time: '10:55 AM', completed: true, active: false, description: 'Checked in with OTP' },
      { step: 4, title: 'Work Executed', time: '11:40 AM', completed: true, active: false, description: 'Teflon joint replaced and pressure tested' },
      { step: 5, title: 'Completed & Rated', time: '11:50 AM', completed: true, active: false, description: '5-Star rating submitted' },
    ],
  },
  {
    id: 'book-103',
    bookingNumber: 'KS-BK-87910',
    serviceTitle: 'Elderly Nursing Care (8h Day Shift)',
    trade: 'Patient Caregiver',
    workerId: 'worker-3',
    workerName: 'Basanti Mahato',
    workerPhoto: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    workerPhoneMasked: '+91 97****8901',
    workerShramId: 'KS-OD-2024-5102',
    cooperativeName: 'Bhubaneswar Women Caregiver Cooperative Society',
    status: 'SCHEDULED',
    scheduledDateTime: 'Tomorrow, 8:00 AM - 4:00 PM',
    bookingAddress: 'Flat 302, Royal Residency, Saheed Nagar, Bhubaneswar · 751007',
    addressType: 'Parents',
    totalAmount: 750,
    baseFare: 650,
    cooperativeFee: 50,
    gstAmount: 50,
    paymentStatus: 'PAID_ESCROW',
    paymentMethod: 'Credit Card',
    otpCode: '1904',
    currentStep: 1,
    replacementGuardActive: true,
    replacementWorkerAssigned: false,
    notes: 'Elderly mother mobility support and BP/Blood sugar monitoring.',
    timeline: [
      { step: 1, title: 'Shift Scheduled', time: 'Confirmed', completed: true, active: true, description: 'Caregiver shift scheduled with replacement standby' },
      { step: 2, title: 'Shift Dispatch', time: 'Tomorrow 7:30 AM', completed: false, active: false, description: 'Caregiver leaves for location' },
      { step: 3, title: 'Arrival & OTP', time: 'Tomorrow 8:00 AM', completed: false, active: false, description: 'Share start OTP 1904' },
      { step: 4, title: 'Active 8h Shift', time: '8:00 AM - 4:00 PM', completed: false, active: false, description: 'Caregiver daily log active' },
      { step: 5, title: 'Shift Conclusion', time: '4:00 PM', completed: false, active: false, description: 'Shift sign-off' },
    ],
  },
];

// 5. Saved Addresses Mock
export const MOCK_ADDRESSES: SavedAddressMock[] = [
  {
    id: 'addr-1',
    label: 'Home',
    recipientName: 'Ananya Patnaik',
    phone: '+91 9876543210',
    flatPlot: 'Plot 104, Ground Floor',
    areaLocality: 'IRC Village, Nayapalli',
    district: 'Bhubaneswar',
    pincode: '751012',
    isDefault: true,
  },
  {
    id: 'addr-2',
    label: 'Parents',
    recipientName: 'Surendra Nath Patnaik (Father)',
    phone: '+91 9437012345',
    flatPlot: 'Flat 302, Royal Residency',
    areaLocality: 'Saheed Nagar',
    district: 'Bhubaneswar',
    pincode: '751007',
    isDefault: false,
  },
  {
    id: 'addr-3',
    label: 'Office',
    recipientName: 'Ananya Patnaik',
    phone: '+91 9876543210',
    flatPlot: 'Tower 2, 4th Floor, Fortune Towers',
    areaLocality: 'Maitree Vihar, Chandrasekharpur',
    district: 'Bhubaneswar',
    pincode: '751023',
    isDefault: false,
  },
];

// 6. Notifications Mock
export const MOCK_NOTIFICATIONS: NotificationMock[] = [
  {
    id: 'notif-1',
    type: 'ETA',
    title: 'Worker is on the way!',
    message: 'Gopal Nayak (Master Electrician) is 1.8 km away and estimated to arrive at 2:30 PM.',
    timestamp: '5 mins ago',
    read: false,
    actionUrl: '/customer/bookings/book-101',
  },
  {
    id: 'notif-2',
    type: 'BOOKING',
    title: 'Booking Confirmed · #KS-BK-88319',
    message: 'Your emergency electrical repair booking has been accepted by Bhubaneswar Labour Cooperative.',
    timestamp: '45 mins ago',
    read: false,
    actionUrl: '/customer/bookings/book-101',
  },
  {
    id: 'notif-3',
    type: 'COOPERATIVE',
    title: 'Cooperative Wage Transparency Notice',
    message: '100% of your service payment of ₹299 was settled directly to worker Bikash Jena.',
    timestamp: 'Yesterday',
    read: true,
    actionUrl: '/customer/bookings/book-102',
  },
  {
    id: 'notif-4',
    type: 'SYSTEM',
    title: 'Govt Subsidy Verified',
    message: 'Your address in Khurda District is eligible for seasonal monsoon electrical safety subsidies.',
    timestamp: '3 days ago',
    read: true,
  },
];
