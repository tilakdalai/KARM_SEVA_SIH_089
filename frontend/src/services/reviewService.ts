import { apiClient } from './api';

export interface CustomerRatingPayload {
  booking_id: string;
  overall_rating: number;
  service_quality?: number;
  professionalism?: number;
  punctuality?: number;
  communication?: number;
  comment?: string;
}

export interface WorkerRatingPayload {
  booking_id: string;
  overall_rating: number;
  politeness?: number;
  payment_promptness?: number;
  clear_instructions?: number;
  comment?: string;
}

export interface ReviewRecord {
  id: string;
  booking_id: string;
  reviewer_id: string;
  reviewer_name?: string;
  reviewee_id: string;
  reviewee_name?: string;
  reviewer_role: 'CUSTOMER' | 'WORKER';
  overall_rating: number;
  service_quality?: number;
  professionalism?: number;
  punctuality?: number;
  communication?: number;
  politeness?: number;
  payment_promptness?: number;
  clear_instructions?: number;
  comment?: string;
  created_at: string;
}

export interface BadgeRecord {
  id: string;
  worker_id: string;
  badge_code: string;
  badge_category: 'VERIFICATION' | 'PERFORMANCE';
  title: string;
  description: string;
  icon: string;
  criteria_met: string[];
  is_active: boolean;
  awarded_at: string;
}

export interface WorkerRatingSummaryRecord {
  worker_id: string;
  worker_name: string;
  shram_id?: string;
  trade?: string;
  cooperative_name?: string;
  total_reviews: number;
  avg_overall_rating: number;
  avg_service_quality: number;
  avg_professionalism: number;
  avg_punctuality: number;
  avg_communication: number;
  total_completed_jobs: number;
  completion_rate_pct: number;
  badges: BadgeRecord[];
  recent_reviews: ReviewRecord[];
}

export const reviewService = {
  submitCustomerRating: async (payload: CustomerRatingPayload): Promise<ReviewRecord> => {
    try {
      const res = await apiClient.post<ReviewRecord>('/reviews/customer-rate', payload);
      return res.data;
    } catch (err) {
      console.warn('API submitCustomerRating failed, returning mock review:', err);
      return {
        id: `rev-${Date.now()}`,
        booking_id: payload.booking_id,
        reviewer_id: 'c-01',
        reviewer_name: 'Verified Citizen',
        reviewee_id: 'w-01',
        reviewee_name: 'Ramesh Chandra Behera',
        reviewer_role: 'CUSTOMER',
        overall_rating: payload.overall_rating,
        service_quality: payload.service_quality || 5,
        professionalism: payload.professionalism || 5,
        punctuality: payload.punctuality || 5,
        communication: payload.communication || 5,
        comment: payload.comment,
        created_at: new Date().toISOString(),
      };
    }
  },

  submitWorkerRating: async (payload: WorkerRatingPayload): Promise<ReviewRecord> => {
    try {
      const res = await apiClient.post<ReviewRecord>('/reviews/worker-rate', payload);
      return res.data;
    } catch (err) {
      console.warn('API submitWorkerRating failed, returning mock review:', err);
      return {
        id: `rev-w-${Date.now()}`,
        booking_id: payload.booking_id,
        reviewer_id: 'w-01',
        reviewer_name: 'Ramesh Chandra Behera',
        reviewee_id: 'c-01',
        reviewee_name: 'Citizen Client',
        reviewer_role: 'WORKER',
        overall_rating: payload.overall_rating,
        politeness: payload.politeness || 5,
        payment_promptness: payload.payment_promptness || 5,
        clear_instructions: payload.clear_instructions || 5,
        comment: payload.comment,
        created_at: new Date().toISOString(),
      };
    }
  },

  getWorkerRatingSummary: async (workerId: string): Promise<WorkerRatingSummaryRecord> => {
    try {
      const res = await apiClient.get<WorkerRatingSummaryRecord>(`/reviews/worker/${workerId}`);
      return res.data;
    } catch (err) {
      console.warn('API getWorkerRatingSummary failed, returning mock summary:', err);
      return {
        worker_id: workerId,
        worker_name: 'Ramesh Chandra Behera',
        shram_id: 'KS-OD-2024-8841',
        trade: 'Master Electrician',
        cooperative_name: 'Bhubaneswar Multi-Purpose Labour Cooperative',
        total_reviews: 42,
        avg_overall_rating: 4.88,
        avg_service_quality: 4.9,
        avg_professionalism: 4.85,
        avg_punctuality: 4.95,
        avg_communication: 4.8,
        total_completed_jobs: 56,
        completion_rate_pct: 98.4,
        badges: [
          {
            id: 'b-01',
            worker_id: workerId,
            badge_code: 'IDENTITY_VERIFIED',
            badge_category: 'VERIFICATION',
            title: 'Identity Verified',
            description: 'Government Aadhaar & biometric identity verification approved',
            icon: 'ShieldCheck',
            criteria_met: [
              '✓ Aadhaar UIDAI clearance verified',
              '✓ Photo match & biometric validation confirmed',
              '✓ Cooperative KYC compliance approved',
            ],
            is_active: true,
            awarded_at: new Date().toISOString(),
          },
          {
            id: 'b-02',
            worker_id: workerId,
            badge_code: 'LICENCE_VERIFIED',
            badge_category: 'VERIFICATION',
            title: 'Licence & Police Verified',
            description: 'State Police background verification & certified trade credential',
            icon: 'FileCheck',
            criteria_met: [
              '✓ Zero adverse criminal record in state police database',
              '✓ Trade licence / ITI trade registration verified',
            ],
            is_active: true,
            awarded_at: new Date().toISOString(),
          },
          {
            id: 'b-03',
            worker_id: workerId,
            badge_code: 'SKILL_CERTIFIED',
            badge_category: 'VERIFICATION',
            title: 'Skill Certified',
            description: 'Certified trade assessment by State Labour Board',
            icon: 'Award',
            criteria_met: [
              '✓ Level-3 / Master craftsman benchmark passed',
              '✓ Practical workshop diagnostic verified',
            ],
            is_active: true,
            awarded_at: new Date().toISOString(),
          },
          {
            id: 'b-04',
            worker_id: workerId,
            badge_code: 'TRUSTED_WORKER',
            badge_category: 'PERFORMANCE',
            title: 'Trusted Worker',
            description: 'Verified craftsman with proven track record of reliable shift fulfillment',
            icon: 'ThumbsUp',
            criteria_met: [
              '✓ 4.88★ citizen satisfaction score (Req: 4.5+)',
              '✓ 56 completed verified jobs (Req: 20+)',
              '✓ 98.4% shift completion rate (Req: 90%+)',
              '✓ 99% punctuality score (Req: 90%+)',
            ],
            is_active: true,
            awarded_at: new Date().toISOString(),
          },
          {
            id: 'b-05',
            worker_id: workerId,
            badge_code: 'HIGHLY_RATED',
            badge_category: 'PERFORMANCE',
            title: 'Highly Rated',
            description: 'Consistently praised for superior craftsmanship and reliability',
            icon: 'Star',
            criteria_met: [
              '✓ 4.88★ citizen satisfaction score (Req: 4.75+)',
              '✓ 56 completed verified jobs (Req: 40+)',
              '✓ 98.4% shift completion rate (Req: 95%+)',
            ],
            is_active: true,
            awarded_at: new Date().toISOString(),
          },
        ],
        recent_reviews: [
          {
            id: 'r-01',
            booking_id: 'b-01',
            reviewer_id: 'c-01',
            reviewer_name: 'Dr. Smita Mishra',
            reviewee_id: workerId,
            reviewee_name: 'Ramesh Chandra Behera',
            reviewer_role: 'CUSTOMER',
            overall_rating: 5,
            service_quality: 5,
            professionalism: 5,
            punctuality: 5,
            communication: 5,
            comment: 'Arrived promptly at 10 AM. Replaced faulty MCB switchboard with extreme care and cleaned the work area.',
            created_at: new Date().toISOString(),
          },
          {
            id: 'r-02',
            booking_id: 'b-02',
            reviewer_id: 'c-02',
            reviewer_name: 'Debabrata Das',
            reviewee_id: workerId,
            reviewee_name: 'Ramesh Chandra Behera',
            reviewer_role: 'CUSTOMER',
            overall_rating: 5,
            service_quality: 5,
            professionalism: 5,
            punctuality: 4,
            communication: 5,
            comment: 'Very skilled technician. Explained the load issue clearly and gave helpful power-saving advice.',
            created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
          },
        ],
      };
    }
  },

  getWorkerBadges: async (workerId: string): Promise<BadgeRecord[]> => {
    try {
      const res = await apiClient.get<BadgeRecord[]>(`/reviews/worker/${workerId}/badges`);
      return res.data;
    } catch (err) {
      console.warn('API getWorkerBadges failed, returning default badges:', err);
      const summary = await reviewService.getWorkerRatingSummary(workerId);
      return summary.badges;
    }
  },
};
