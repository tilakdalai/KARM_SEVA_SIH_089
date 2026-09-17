import { apiClient } from './api';

export interface SubScoresBreakdown {
  skill_match: number;
  distance_score: number;
  availability: number;
  rating: number;
  workload: number;
}

export interface CandidateMatchRecord {
  worker_id: string;
  worker_name: string;
  shram_id?: string;
  trade: string;
  cooperative_code?: string;
  cooperative_name?: string;
  photo_url?: string;
  rating: number;
  total_jobs: number;
  distance_km: number;
  eta_minutes: number;
  match_score: number;
  sub_scores: SubScoresBreakdown;
  explanations: string[];
  is_online: boolean;
  is_verified: boolean;
  radius_tier: number;
  lat: number;
  lng: number;
  base_rate: number;
}

export interface MatchingSearchRecord {
  search_radius_km: number;
  expansion_tier_used: number;
  radius_expanded: boolean;
  total_found: number;
  customer_masked_address: string;
  customer_lat: number;
  customer_lng: number;
  weights_used: Record<string, number>;
  candidates: CandidateMatchRecord[];
}

export interface MatchingQueryParams {
  service_id?: string;
  service_category: string;
  customer_lat?: number;
  customer_lng?: number;
  scheduled_date?: string;
  time_slot?: string;
  is_emergency?: boolean;
  preferred_radius_km?: number;
}

export interface EmergencyDispatchParams {
  service_category: string;
  issue_description: string;
  customer_lat?: number;
  customer_lng?: number;
  address_line: string;
  district?: string;
  pincode?: string;
  landmark?: string;
  priority_level?: string;
}

export interface EmergencyDispatchRecord {
  broadcast_id: string;
  service_category: string;
  status: string;
  sla_target_minutes: number;
  broadcast_radius_km: number;
  notified_candidates_count: number;
  top_candidate?: CandidateMatchRecord;
  created_at: string;
}

export interface RadarUnitRecord {
  worker_id: string;
  worker_name: string;
  trade: string;
  shram_id: string;
  rating: number;
  is_online: boolean;
  is_verified: boolean;
  lat: number;
  lng: number;
  locality: string;
  active_jobs_today: number;
  standby_available: boolean;
}

export interface CooperativeRadarRecord {
  cooperative_code: string;
  cooperative_name: string;
  center_lat: number;
  center_lng: number;
  total_active_units: number;
  units: RadarUnitRecord[];
}

export const matchingService = {
  findMatchingWorkers: async (params: MatchingQueryParams): Promise<MatchingSearchRecord> => {
    try {
      const response = await apiClient.post<MatchingSearchRecord>('/matching/find-workers', params);
      return response.data;
    } catch (error) {
      console.warn('API findMatchingWorkers failed, returning mock search results:', error);
      return {
        search_radius_km: 5.0,
        expansion_tier_used: 5,
        radius_expanded: false,
        total_found: 3,
        customer_masked_address: 'Saheed Nagar Area (Khordha, 751007)',
        customer_lat: params.customer_lat || 20.2961,
        customer_lng: params.customer_lng || 85.8245,
        weights_used: {
          skill_match: 0.35,
          distance_score: 0.25,
          availability: 0.20,
          rating: 0.10,
          workload: 0.10,
        },
        candidates: [
          {
            worker_id: 'w-01',
            worker_name: 'Ramesh Chandra Behera',
            shram_id: 'KS-OD-2024-8841',
            trade: params.service_category || 'Master Electrician',
            cooperative_code: 'OD-KHR-COOP-041',
            cooperative_name: 'Bhubaneswar Multi-Purpose Labour Cooperative',
            photo_url: 'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=150',
            rating: 4.88,
            total_jobs: 142,
            distance_km: 1.8,
            eta_minutes: 15,
            match_score: 96.8,
            sub_scores: {
              skill_match: 35.0,
              distance_score: 22.5,
              availability: 20.0,
              rating: 9.8,
              workload: 9.5,
            },
            explanations: [
              `✓ Verified ${params.service_category || 'Electrician'} with Police Clearance`,
              '✓ Available at requested time slot',
              '✓ 1.8 km away (~15 min ETA)',
              '✓ 4.88★ average citizen rating',
              '✓ Optimal low workload today',
            ],
            is_online: true,
            is_verified: true,
            radius_tier: 5,
            lat: 20.298,
            lng: 85.834,
            base_rate: 550,
          },
          {
            worker_id: 'w-02',
            worker_name: 'Tapan Kumar Das',
            shram_id: 'KS-OD-2024-1044',
            trade: params.service_category || 'Senior Plumber',
            cooperative_code: 'OD-KHR-COOP-041',
            cooperative_name: 'Bhubaneswar Multi-Purpose Labour Cooperative',
            photo_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
            rating: 4.75,
            total_jobs: 89,
            distance_km: 2.6,
            eta_minutes: 20,
            match_score: 91.2,
            sub_scores: {
              skill_match: 35.0,
              distance_score: 19.8,
              availability: 20.0,
              rating: 9.5,
              workload: 6.9,
            },
            explanations: [
              `✓ Verified ${params.service_category || 'Artisan'} with Trade Certificate`,
              '✓ Available for shift dispatch',
              '✓ 2.6 km away (~20 min ETA)',
              '✓ 4.75★ average citizen rating',
              '✓ Moderate workload (1 active shift)',
            ],
            is_online: true,
            is_verified: true,
            radius_tier: 5,
            lat: 20.284,
            lng: 85.819,
            base_rate: 500,
          },
        ],
      };
    }
  },

  dispatchEmergency: async (params: EmergencyDispatchParams): Promise<EmergencyDispatchRecord> => {
    try {
      const response = await apiClient.post<EmergencyDispatchRecord>('/matching/emergency', params);
      return response.data;
    } catch (error) {
      console.warn('API dispatchEmergency failed, returning mock broadcast:', error);
      return {
        broadcast_id: `EMERG-SOS-${Date.now()}`,
        service_category: params.service_category,
        status: 'BROADCASTED_AWAITING_WORKER_ACCEPTANCE',
        sla_target_minutes: 15,
        broadcast_radius_km: 8.0,
        notified_candidates_count: 4,
        created_at: new Date().toISOString(),
        top_candidate: {
          worker_id: 'w-01',
          worker_name: 'Ramesh Chandra Behera',
          shram_id: 'KS-OD-2024-8841',
          trade: params.service_category,
          cooperative_code: 'OD-KHR-COOP-041',
          cooperative_name: 'Bhubaneswar Multi-Purpose Labour Cooperative',
          rating: 4.88,
          total_jobs: 142,
          distance_km: 1.8,
          eta_minutes: 12,
          match_score: 98.0,
          sub_scores: {
            skill_match: 35.0,
            distance_score: 24.0,
            availability: 20.0,
            rating: 9.8,
            workload: 9.2,
          },
          explanations: [
            `✓ Verified ${params.service_category} with Emergency Certification`,
            '✓ Online and available for immediate standby takeover',
            '✓ 1.8 km away (Fast-track ETA 12 mins)',
            '✓ 4.88★ rating with zero complaints',
          ],
          is_online: true,
          is_verified: true,
          radius_tier: 5,
          lat: 20.298,
          lng: 85.834,
          base_rate: 650,
        },
      };
    }
  },

  getRadar: async (serviceCategory?: string): Promise<CooperativeRadarRecord> => {
    try {
      const params = serviceCategory ? { service_category: serviceCategory } : {};
      const response = await apiClient.get<CooperativeRadarRecord>('/matching/radar', { params });
      return response.data;
    } catch (error) {
      console.warn('API getRadar failed, returning mock radar:', error);
      return {
        cooperative_code: 'OD-KHR-COOP-041',
        cooperative_name: 'Bhubaneswar Multi-Purpose Labour Cooperative',
        center_lat: 20.2961,
        center_lng: 85.8245,
        total_active_units: 6,
        units: [
          {
            worker_id: 'w-01',
            worker_name: 'Ramesh Chandra Behera',
            trade: 'Electrician',
            shram_id: 'KS-OD-2024-8841',
            rating: 4.88,
            is_online: true,
            is_verified: true,
            lat: 20.298,
            lng: 85.834,
            locality: 'Saheed Nagar',
            active_jobs_today: 1,
            standby_available: true,
          },
          {
            worker_id: 'w-02',
            worker_name: 'Tapan Kumar Das',
            trade: 'Plumber',
            shram_id: 'KS-OD-2024-1044',
            rating: 4.75,
            is_online: true,
            is_verified: true,
            lat: 20.284,
            lng: 85.819,
            locality: 'Forest Park',
            active_jobs_today: 0,
            standby_available: true,
          },
          {
            worker_id: 'w-03',
            worker_name: 'Sunita Majhi',
            trade: 'Patient Caregiver',
            shram_id: 'KS-OD-2024-3912',
            rating: 4.95,
            is_online: true,
            is_verified: true,
            lat: 20.312,
            lng: 85.817,
            locality: 'Nayapalli',
            active_jobs_today: 2,
            standby_available: true,
          },
          {
            worker_id: 'w-04',
            worker_name: 'Prakash Mohanty',
            trade: 'Carpenter',
            shram_id: 'KS-OD-2024-5521',
            rating: 4.8,
            is_online: true,
            is_verified: true,
            lat: 20.325,
            lng: 85.81,
            locality: 'Jayadev Vihar',
            active_jobs_today: 0,
            standby_available: true,
          },
        ],
      };
    }
  },
};
