import { apiClient } from './api';

export type LeaveType = 'PLANNED' | 'MEDICAL' | 'EMERGENCY';
export type LeaveStatus = 'PENDING' | 'APPROVED' | 'EMERGENCY_ACTIVE' | 'COMPLETED' | 'CANCELLED';
export type ReplacementSource = 'ORIGINAL_WORKER_SUGGESTED' | 'COOPERATIVE_ASSIGNED' | 'SYSTEM_RECOMMENDED';
export type ReplacementStatus = 'PROPOSED' | 'ACCEPTED' | 'DECLINED' | 'COMPLETED' | 'CANCELLED';

export interface AffectedBookingSummary {
  id: string;
  booking_reference: string;
  service_title: string;
  scheduled_date: string;
  time_slot: string;
  customer_name: string;
  customer_phone?: string;
  address_line: string;
  rate: number;
  has_replacement: boolean;
  replacement_worker_name?: string;
}

export interface ReplacementCandidate {
  worker_id: string;
  worker_name: string;
  shram_id?: string;
  trade: string;
  cooperative_name?: string;
  rating: number;
  distance_km: number;
  jobs_completed: number;
  match_score: number;
  is_available: boolean;
  verification_status: string;
}

export interface ReplacementAssignmentRecord {
  id: string;
  assignment_reference: string;
  leave_id: string;
  booking_id?: string;
  booking_instance_id?: string;
  original_worker_id: string;
  original_worker_name?: string;
  replacement_worker_id: string;
  replacement_worker_name?: string;
  replacement_source: ReplacementSource;
  status: ReplacementStatus;
  match_score: number;
  decline_reason?: string;
  created_at: string;
  updated_at: string;
}

export interface WorkerLeaveRecord {
  id: string;
  leave_reference: string;
  worker_id: string;
  cooperative_code: string;
  leave_type: LeaveType;
  start_date: string;
  end_date: string;
  reason: string;
  status: LeaveStatus;
  affected_job_count: number;
  notes?: string;
  created_at: string;
  updated_at: string;
  worker_name?: string;
  worker_trade?: string;
  worker_shram_id?: string;
  worker_phone?: string;
  affected_bookings?: AffectedBookingSummary[];
  replacement_assignments?: ReplacementAssignmentRecord[];
}

export interface LeaveApplyPayload {
  leave_type: LeaveType;
  start_date: string;
  end_date: string;
  reason: string;
  suggested_replacement_worker_id?: string;
  notes?: string;
}

export interface ProposeReplacementPayload {
  leave_id: string;
  booking_id?: string;
  booking_instance_id?: string;
  replacement_worker_id: string;
  replacement_source?: ReplacementSource;
}

export const leaveService = {
  // Apply for leave
  applyLeave: async (payload: LeaveApplyPayload): Promise<WorkerLeaveRecord> => {
    try {
      const response = await apiClient.post<WorkerLeaveRecord>('/leave', payload);
      return response.data;
    } catch (error) {
      console.warn('API leave apply failed, returning fallback mock:', error);
      return {
        id: `lv-mock-${Date.now()}`,
        leave_reference: `LV-2024-${Math.floor(1000 + Math.random() * 9000)}`,
        worker_id: 'w-01',
        cooperative_code: 'OD-KHR-COOP-041',
        leave_type: payload.leave_type,
        start_date: payload.start_date,
        end_date: payload.end_date,
        reason: payload.reason,
        status: payload.leave_type === 'PLANNED' ? 'PENDING' : 'EMERGENCY_ACTIVE',
        affected_job_count: 2,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        worker_name: 'Ramesh Chandra Behera',
        worker_trade: 'Master Electrician',
        worker_shram_id: 'KS-OD-2024-8841',
        affected_bookings: [
          {
            id: 'bk-mock-101',
            booking_reference: 'BK-2024-91823',
            service_title: 'Master Electrician Inspection & Repair',
            scheduled_date: payload.start_date,
            time_slot: '09:00 AM - 11:00 AM',
            customer_name: 'Amit Mohanty',
            address_line: 'Plot 42, Saheed Nagar, Bhubaneswar',
            rate: 550,
            has_replacement: false,
          },
        ],
      };
    }
  },

  // Get leaves
  getLeaves: async (leaveType?: string, status?: string): Promise<WorkerLeaveRecord[]> => {
    try {
      const params: any = {};
      if (leaveType) params.leave_type = leaveType;
      if (status) params.status = status;
      const response = await apiClient.get<WorkerLeaveRecord[]>('/leave', { params });
      return response.data;
    } catch (error) {
      console.warn('API getLeaves failed, returning fallback mock list:', error);
      return [
        {
          id: 'lv-01',
          leave_reference: 'LV-2024-4192',
          worker_id: 'w-01',
          cooperative_code: 'OD-KHR-COOP-041',
          leave_type: 'EMERGENCY',
          start_date: '2024-09-06',
          end_date: '2024-09-07',
          reason: 'Severe fever and hospital observation.',
          status: 'EMERGENCY_ACTIVE',
          affected_job_count: 2,
          created_at: new Date(Date.now() - 3600000).toISOString(),
          updated_at: new Date(Date.now() - 3600000).toISOString(),
          worker_name: 'Ramesh Chandra Behera',
          worker_trade: 'Master Electrician',
          worker_shram_id: 'KS-OD-2024-8841',
          affected_bookings: [
            {
              id: 'bk-mock-101',
              booking_reference: 'BK-2024-91823',
              service_title: 'Master Electrician Diagnostic',
              scheduled_date: '2024-09-06',
              time_slot: '09:00 AM - 11:00 AM',
              customer_name: 'Amit Mohanty',
              address_line: 'Saheed Nagar, Bhubaneswar',
              rate: 550,
              has_replacement: true,
              replacement_worker_name: 'Tapan Kumar Standby',
            },
          ],
          replacement_assignments: [
            {
              id: 'rep-01',
              assignment_reference: 'REP-2409-1082',
              leave_id: 'lv-01',
              booking_id: 'bk-mock-101',
              original_worker_id: 'w-01',
              original_worker_name: 'Ramesh Chandra Behera',
              replacement_worker_id: 'w-02',
              replacement_worker_name: 'Tapan Kumar Standby',
              replacement_source: 'SYSTEM_RECOMMENDED',
              status: 'ACCEPTED',
              match_score: 96.5,
              created_at: new Date(Date.now() - 3000000).toISOString(),
              updated_at: new Date(Date.now() - 3000000).toISOString(),
            },
          ],
        },
        {
          id: 'lv-02',
          leave_reference: 'LV-2024-8821',
          worker_id: 'w-03',
          cooperative_code: 'OD-KHR-COOP-041',
          leave_type: 'PLANNED',
          start_date: '2024-09-10',
          end_date: '2024-09-12',
          reason: 'Family wedding ceremony in Balasore.',
          status: 'PENDING',
          affected_job_count: 1,
          created_at: new Date(Date.now() - 86400000).toISOString(),
          updated_at: new Date(Date.now() - 86400000).toISOString(),
          worker_name: 'Sunita Majhi',
          worker_trade: 'Patient Caregiver',
          worker_shram_id: 'KS-OD-2024-3912',
          affected_bookings: [
            {
              id: 'bk-mock-102',
              booking_reference: 'BK-2024-10291',
              service_title: 'Elderly Mobility & Vitals Care',
              scheduled_date: '2024-09-11',
              time_slot: '08:00 AM - 12:00 PM',
              customer_name: 'Priyamvada Patnaik',
              address_line: 'Nayapalli, Bhubaneswar',
              rate: 650,
              has_replacement: false,
            },
          ],
        },
      ];
    }
  },

  // Get candidate recommendations
  getReplacementCandidates: async (leaveId: string): Promise<ReplacementCandidate[]> => {
    try {
      const response = await apiClient.get<ReplacementCandidate[]>(`/leave/${leaveId}/candidates`);
      return response.data;
    } catch (error) {
      console.warn('API getReplacementCandidates failed, returning fallback mock candidates:', error);
      return [
        {
          worker_id: 'w-standby-01',
          worker_name: 'Tapan Kumar Standby',
          shram_id: 'KS-OD-2024-9999',
          trade: 'Master Electrician',
          cooperative_name: 'Bhubaneswar Multi-Purpose Labour Cooperative',
          rating: 4.88,
          distance_km: 1.8,
          jobs_completed: 142,
          match_score: 97.2,
          is_available: true,
          verification_status: 'POLICE_CLEARED',
        },
        {
          worker_id: 'w-standby-02',
          worker_name: 'Subrat Jena',
          shram_id: 'KS-OD-2024-4412',
          trade: 'Certified Electrician',
          cooperative_name: 'Bhubaneswar Multi-Purpose Labour Cooperative',
          rating: 4.75,
          distance_km: 2.4,
          jobs_completed: 88,
          match_score: 93.0,
          is_available: true,
          verification_status: 'VERIFIED',
        },
        {
          worker_id: 'w-standby-03',
          worker_name: 'Bikash Mohapatra',
          shram_id: 'KS-OD-2024-7719',
          trade: 'Senior Electrical Technician',
          cooperative_name: 'Bhubaneswar Multi-Purpose Labour Cooperative',
          rating: 4.7,
          distance_km: 3.1,
          jobs_completed: 65,
          match_score: 89.5,
          is_available: true,
          verification_status: 'VERIFIED',
        },
      ];
    }
  },

  // Propose replacement
  proposeReplacement: async (payload: ProposeReplacementPayload): Promise<ReplacementAssignmentRecord> => {
    const response = await apiClient.post<ReplacementAssignmentRecord>('/leave/replacement/propose', payload);
    return response.data;
  },

  // Replacement Worker Accepts Assignment
  acceptReplacement: async (assignmentId: string): Promise<ReplacementAssignmentRecord> => {
    const response = await apiClient.post<ReplacementAssignmentRecord>(`/leave/replacement/${assignmentId}/accept`);
    return response.data;
  },

  // Replacement Worker Declines Assignment
  declineReplacement: async (assignmentId: string, reason?: string): Promise<ReplacementAssignmentRecord> => {
    const response = await apiClient.post<ReplacementAssignmentRecord>(`/leave/replacement/${assignmentId}/decline`, {
      reason,
    });
    return response.data;
  },

  // Approve Planned Leave
  approveLeave: async (leaveId: string): Promise<WorkerLeaveRecord> => {
    const response = await apiClient.post<WorkerLeaveRecord>(`/leave/${leaveId}/approve`);
    return response.data;
  },
};
