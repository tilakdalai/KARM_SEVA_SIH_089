import { apiClient } from './api';

export interface SystemAdminKPIs {
  registered_workers: number;
  verified_workers: number;
  active_cooperatives: number;
  citizens_served: number;
  institutions: number;
  jobs_completed: number;
  active_jobs: number;
  total_transaction_value: number;
  worker_earnings: number;
  cooperative_revenue: number;
  average_rating: number;
  complaint_resolution_rate: string;
  jurisdiction: string;
}

export interface CooperativeRecord {
  id: string;
  code: string;
  name: string;
  district: string;
  state: string;
  registration_no: string;
  active_workers: number;
  verification_rate: string;
  jobs_completed: number;
  average_rating: number;
  complaint_rate: string;
  revenue: number;
  welfare_fund_balance: number;
  status: 'ACTIVE' | 'UNDER_REVIEW' | 'SUSPENDED';
  accreditation_date: string;
}

export interface GovernanceAnalyticsData {
  service_demand: Array<{ trade: string; percentage: number; volume: number }>;
  worker_growth: Array<{ month: string; registered: number; verified: number }>;
  employment_generated: Array<{ quarter: string; person_days: number; earnings_cr: number }>;
  jobs_completed: Array<{ week: string; jobs: number }>;
  geographic_demand: Array<{
    district: string;
    workers: number;
    jobs: number;
    lat: number;
    lng: number;
    density: string;
  }>;
  revenue_distribution: Array<{ category: string; amount: number; fill: string }>;
  skill_demand: Array<{ skill: string; index: number }>;
  complaint_trend: Array<{ month: string; received: number; resolved: number }>;
}

export interface PlatformWorkerRecord {
  id: string;
  shram_id: string;
  name: string;
  trade: string;
  trade_group: string;
  cooperative_code: string;
  cooperative_name: string;
  district: string;
  status: string;
  rating: number;
  jobs_completed: number;
  earnings_total: number;
  police_verification: string;
  flagged: boolean;
  flag_reason?: string;
}

export interface PlatformDisputeRecord {
  id: string;
  booking_id: string;
  citizen_name: string;
  worker_name: string;
  cooperative_name: string;
  issue: string;
  filing_date: string;
  claim_amount: number;
  status: string;
  resolution?: string;
}

export interface PlatformAuditLog {
  id: string;
  action: string;
  admin_name: string;
  cooperative_code: string;
  target_type: string;
  target_name: string;
  details: string;
  created_at: string;
}

export interface SystemSettingsData {
  platform_commission_percent: number;
  welfare_allocation_percent: number;
  worker_takehome_percent: number;
  state_gazette_sync_enabled: boolean;
  audit_strict_mode: boolean;
  replacement_sla_minutes: number;
  jurisdiction_state: string;
  nodal_authority: string;
}

export const adminService = {
  getKPIs: async (): Promise<SystemAdminKPIs> => {
    try {
      const response = await apiClient.get('/admin/metrics');
      if (response.data?.data?.metrics) {
        return response.data.data.metrics;
      }
    } catch {
      // fallback mock
    }
    return {
      registered_workers: 14850,
      verified_workers: 12420,
      active_cooperatives: 48,
      citizens_served: 42910,
      institutions: 134,
      jobs_completed: 68240,
      active_jobs: 412,
      total_transaction_value: 38450000.0,
      worker_earnings: 34605000.0,
      cooperative_revenue: 3845000.0,
      average_rating: 4.88,
      complaint_resolution_rate: '98.7%',
      jurisdiction: 'State of Odisha (DPI Framework PS26089)',
    };
  },

  getCooperatives: async (status?: string, district?: string): Promise<CooperativeRecord[]> => {
    try {
      const params = new URLSearchParams();
      if (status && status !== 'ALL') params.append('status', status);
      if (district && district !== 'ALL') params.append('district', district);
      const response = await apiClient.get(`/admin/cooperatives?${params.toString()}`);
      if (response.data?.data?.cooperatives) {
        return response.data.data.cooperatives;
      }
    } catch {
      // fallback
    }
    return [
      {
        id: 'coop-01',
        code: 'OD-KHR-COOP-041',
        name: 'Khurda District Urban Workers Cooperative Union',
        district: 'Khurda / Bhubaneswar',
        state: 'Odisha',
        registration_no: 'ARCS/BBS/2021/041',
        active_workers: 2420,
        verification_rate: '94.8%',
        jobs_completed: 18450,
        average_rating: 4.89,
        complaint_rate: '0.3%',
        revenue: 14280000.0,
        welfare_fund_balance: 1428000.0,
        status: 'ACTIVE',
        accreditation_date: '2021-08-15',
      },
      {
        id: 'coop-02',
        code: 'OD-CTC-COOP-019',
        name: 'Cuttack Municipal Shramik Kalyan Cooperative',
        district: 'Cuttack',
        state: 'Odisha',
        registration_no: 'ARCS/CTC/2022/019',
        active_workers: 1890,
        verification_rate: '92.1%',
        jobs_completed: 14200,
        average_rating: 4.82,
        complaint_rate: '0.5%',
        revenue: 9840000.0,
        welfare_fund_balance: 984000.0,
        status: 'ACTIVE',
        accreditation_date: '2022-03-10',
      },
      {
        id: 'coop-03',
        code: 'OD-PUR-COOP-007',
        name: 'Puri Coastal Pilgrim & Hospitality Workers Union',
        district: 'Puri',
        state: 'Odisha',
        registration_no: 'ARCS/PUR/2022/007',
        active_workers: 1140,
        verification_rate: '89.4%',
        jobs_completed: 9680,
        average_rating: 4.78,
        complaint_rate: '0.8%',
        revenue: 6420000.0,
        welfare_fund_balance: 642000.0,
        status: 'UNDER_REVIEW',
        accreditation_date: '2022-09-01',
      },
      {
        id: 'coop-04',
        code: 'OD-GNJ-COOP-033',
        name: 'Ganjam Artisan & Skilled Labour Cooperative Society',
        district: 'Ganjam / Berhampur',
        state: 'Odisha',
        registration_no: 'ARCS/GNJ/2023/033',
        active_workers: 1650,
        verification_rate: '95.6%',
        jobs_completed: 12100,
        average_rating: 4.91,
        complaint_rate: '0.2%',
        revenue: 7910000.0,
        welfare_fund_balance: 791000.0,
        status: 'ACTIVE',
        accreditation_date: '2023-01-20',
      },
      {
        id: 'coop-05',
        code: 'OD-SBP-COOP-012',
        name: 'Sambalpur Industrial Belt Tradesmen Union',
        district: 'Sambalpur',
        state: 'Odisha',
        registration_no: 'ARCS/SBP/2023/012',
        active_workers: 980,
        verification_rate: '78.2%',
        jobs_completed: 4820,
        average_rating: 4.65,
        complaint_rate: '1.8%',
        revenue: 3120000.0,
        welfare_fund_balance: 312000.0,
        status: 'SUSPENDED',
        accreditation_date: '2023-06-14',
      },
    ];
  },

  updateCooperativeStatus: async (code: string, action: string, reason: string, admin_notes?: string) => {
    try {
      const response = await apiClient.post(`/admin/cooperatives/${code}/action`, {
        action,
        reason,
        admin_notes,
      });
      return response.data?.data?.cooperative;
    } catch {
      return null;
    }
  },

  getAnalytics: async (): Promise<GovernanceAnalyticsData> => {
    try {
      const response = await apiClient.get('/admin/analytics');
      if (response.data?.data?.analytics) {
        return response.data.data.analytics;
      }
    } catch {
      // fallback
    }
    return {
      service_demand: [
        { trade: 'Cleaners', percentage: 38, volume: 25930 },
        { trade: 'Electricians', percentage: 26, volume: 17740 },
        { trade: 'Plumbers', percentage: 18, volume: 12280 },
        { trade: 'Caregivers', percentage: 12, volume: 8180 },
        { trade: 'Others', percentage: 6, volume: 4110 },
      ],
      worker_growth: [
        { month: 'Jan', registered: 3400, verified: 2900 },
        { month: 'Feb', registered: 5200, verified: 4500 },
        { month: 'Mar', registered: 7100, verified: 6200 },
        { month: 'Apr', registered: 9400, verified: 8100 },
        { month: 'May', registered: 11600, verified: 9900 },
        { month: 'Jun', registered: 13200, verified: 11300 },
        { month: 'Jul', registered: 14100, verified: 12000 },
        { month: 'Aug', registered: 14850, verified: 12420 },
      ],
      employment_generated: [
        { quarter: 'Q1', person_days: 148000, earnings_cr: 7.4 },
        { quarter: 'Q2', person_days: 215000, earnings_cr: 10.7 },
        { quarter: 'Q3', person_days: 298000, earnings_cr: 14.9 },
        { quarter: 'Q4', person_days: 350000, earnings_cr: 17.5 },
      ],
      jobs_completed: [
        { week: 'W1', jobs: 1420 },
        { week: 'W2', jobs: 1680 },
        { week: 'W3', jobs: 1890 },
        { week: 'W4', jobs: 2140 },
      ],
      geographic_demand: [
        { district: 'Khurda / Bhubaneswar', workers: 4200, jobs: 28400, lat: 20.2961, lng: 85.8245, density: 'VERY_HIGH' },
        { district: 'Cuttack', workers: 2900, jobs: 18200, lat: 20.4625, lng: 85.883, density: 'HIGH' },
        { district: 'Puri', workers: 1850, jobs: 9800, lat: 19.8135, lng: 85.8312, density: 'MEDIUM' },
        { district: 'Ganjam / Berhampur', workers: 2400, jobs: 13400, lat: 19.315, lng: 84.7941, density: 'HIGH' },
        { district: 'Sambalpur', workers: 1600, jobs: 7200, lat: 21.4669, lng: 83.9812, density: 'MEDIUM' },
        { district: 'Balasore', workers: 1200, jobs: 5800, lat: 21.4934, lng: 86.9135, density: 'GROWING' },
      ],
      revenue_distribution: [
        { category: 'Direct Worker Take-Home (90%)', amount: 34605000.0, fill: '#10B981' },
        { category: 'Cooperative Welfare Trust (10%)', amount: 3845000.0, fill: '#3B82F6' },
        { category: 'Platform Commission (0%)', amount: 0.0, fill: '#F59E0B' },
      ],
      skill_demand: [
        { skill: 'Industrial Substation Wiring', index: 95 },
        { skill: 'Hospital Sanitization & Bio-Waste', index: 92 },
        { skill: 'High Pressure Plumbing Fixtures', index: 84 },
        { skill: 'Elderly ICU Care', index: 79 },
        { skill: 'Commercial AC / Chiller Service', index: 74 },
      ],
      complaint_trend: [
        { month: 'May', received: 28, resolved: 28 },
        { month: 'Jun', received: 34, resolved: 33 },
        { month: 'Jul', received: 22, resolved: 22 },
        { month: 'Aug', received: 19, resolved: 19 },
      ],
    };
  },

  getWorkers: async (): Promise<PlatformWorkerRecord[]> => {
    try {
      const response = await apiClient.get('/admin/workers');
      if (response.data?.data?.workers) {
        return response.data.data.workers;
      }
    } catch {
      // fallback
    }
    return [
      {
        id: 'pw-01',
        shram_id: 'KS-OD-2024-8841',
        name: 'Ramesh Chandra Behera',
        trade: 'Master Electrician',
        trade_group: 'GROUP_A',
        cooperative_code: 'OD-KHR-COOP-041',
        cooperative_name: 'Khurda District Urban Workers Cooperative Union',
        district: 'Khurda / Bhubaneswar',
        status: 'VERIFIED',
        rating: 4.9,
        jobs_completed: 142,
        earnings_total: 98400.0,
        police_verification: 'CLEARED',
        flagged: false,
      },
      {
        id: 'pw-02',
        shram_id: 'KS-OD-2024-3912',
        name: 'Sunita Majhi',
        trade: 'Patient Caregiver',
        trade_group: 'GROUP_A',
        cooperative_code: 'OD-KHR-COOP-041',
        cooperative_name: 'Khurda District Urban Workers Cooperative Union',
        district: 'Khurda / Bhubaneswar',
        status: 'VERIFIED',
        rating: 4.95,
        jobs_completed: 98,
        earnings_total: 76500.0,
        police_verification: 'CLEARED',
        flagged: false,
      },
      {
        id: 'pw-03',
        shram_id: 'KS-OD-2024-9918',
        name: 'Bikash Ranjan Rout',
        trade: 'Heavy Commercial Driver',
        trade_group: 'GROUP_A',
        cooperative_code: 'OD-SBP-COOP-012',
        cooperative_name: 'Sambalpur Industrial Belt Tradesmen Union',
        district: 'Sambalpur',
        status: 'SUSPENDED',
        rating: 3.9,
        jobs_completed: 21,
        earnings_total: 14200.0,
        police_verification: 'REJECTED_EXPIRED',
        flagged: true,
        flag_reason: 'Driving license expired during annual audit. Regulatory verification pending.',
      },
      {
        id: 'pw-04',
        shram_id: 'KS-OD-2024-5520',
        name: 'Gita Rani Jena',
        trade: 'Housekeeping Specialist',
        trade_group: 'GROUP_D',
        cooperative_code: 'OD-KHR-COOP-041',
        cooperative_name: 'Khurda District Urban Workers Cooperative Union',
        district: 'Khurda / Bhubaneswar',
        status: 'VERIFIED',
        rating: 4.88,
        jobs_completed: 215,
        earnings_total: 128900.0,
        police_verification: 'CLEARED',
        flagged: false,
      },
    ];
  },

  resolveWorkerFlag: async (workerId: string, resolution: string, notes: string) => {
    try {
      const response = await apiClient.post(`/admin/workers/${workerId}/flag-resolution`, {
        resolution,
        notes,
      });
      return response.data;
    } catch {
      return null;
    }
  },

  getDisputes: async (): Promise<PlatformDisputeRecord[]> => {
    try {
      const response = await apiClient.get('/admin/disputes');
      if (response.data?.data?.disputes) {
        return response.data.data.disputes;
      }
    } catch {
      // fallback
    }
    return [
      {
        id: 'DSP-2024-019',
        booking_id: 'BK-2024-9120',
        citizen_name: 'Priyanka Sahoo',
        worker_name: 'Ramesh Chandra Behera',
        cooperative_name: 'Khurda District Urban Workers Cooperative Union',
        issue: 'Citizen requested additional unbilled 3-phase rewiring outside initial scope.',
        filing_date: '2024-08-28',
        claim_amount: 850.0,
        status: 'RESOLVED',
        resolution: 'Cooperative conciliation officer mediated. Citizen authorized supplementary tariff under Gazette rate.',
      },
      {
        id: 'DSP-2024-022',
        booking_id: 'BK-2024-9411',
        citizen_name: 'Utkal Builders Ltd',
        worker_name: 'Sambalpur Plumbing Batch 4',
        cooperative_name: 'Sambalpur Industrial Belt Tradesmen Union',
        issue: 'Delayed replacement arrival past 45-minute SLA threshold.',
        filing_date: '2024-08-30',
        claim_amount: 1500.0,
        status: 'UNDER_CONCILIATION',
        resolution: 'Hearing scheduled with District Cooperative Registrar.',
      },
    ];
  },

  getAuditLogs: async (limit = 50): Promise<PlatformAuditLog[]> => {
    try {
      const response = await apiClient.get(`/admin/audit-logs?limit=${limit}`);
      if (response.data?.data?.audit_logs) {
        return response.data.data.audit_logs;
      }
    } catch {
      // fallback
    }
    return [
      {
        id: 'aud-001',
        action: 'COOPERATIVE_APPROVE',
        admin_name: 'Dr. Pradeep Kumar Jena (IAS)',
        cooperative_code: 'OD-KHR-COOP-041',
        target_type: 'COOPERATIVE',
        target_name: 'Khurda District Urban Workers Cooperative Union',
        details: 'State System Admin renewed annual cooperative accreditation after audit inspection.',
        created_at: '2024-08-30T10:15:00Z',
      },
      {
        id: 'aud-002',
        action: 'COOPERATIVE_SUSPEND',
        admin_name: 'Dr. Pradeep Kumar Jena (IAS)',
        cooperative_code: 'OD-SBP-COOP-012',
        target_type: 'COOPERATIVE',
        target_name: 'Sambalpur Industrial Belt Tradesmen Union',
        details: 'Temporary suspension issued due to delay in statutory welfare fund allocation.',
        created_at: '2024-08-29T16:40:00Z',
      },
    ];
  },

  getSettings: async (): Promise<SystemSettingsData> => {
    try {
      const response = await apiClient.get('/admin/settings');
      if (response.data?.data?.settings) {
        return response.data.data.settings;
      }
    } catch {
      // fallback
    }
    return {
      platform_commission_percent: 0.0,
      welfare_allocation_percent: 10.0,
      worker_takehome_percent: 90.0,
      state_gazette_sync_enabled: true,
      audit_strict_mode: true,
      replacement_sla_minutes: 45,
      jurisdiction_state: 'Odisha',
      nodal_authority: 'Directorate of Cooperative Societies & Odisha State Labour Directorate',
    };
  },

  updateSettings: async (payload: Partial<SystemSettingsData>) => {
    try {
      const response = await apiClient.put('/admin/settings', payload);
      return response.data?.data?.updated_settings;
    } catch {
      return null;
    }
  },
};
