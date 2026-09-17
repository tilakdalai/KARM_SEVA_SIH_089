import { apiClient } from './api';

export type ComplaintCategory =
  | 'SERVICE_QUALITY'
  | 'WORKER_BEHAVIOUR'
  | 'CUSTOMER_BEHAVIOUR'
  | 'PAYMENT'
  | 'NO_SHOW'
  | 'DAMAGE'
  | 'SAFETY'
  | 'INCORRECT_CHARGE'
  | 'OTHER';

export type ComplaintStatus = 'OPEN' | 'UNDER_REVIEW' | 'RESOLVED' | 'ESCALATED';

export interface ComplaintActionHistoryRecord {
  id: string;
  complaint_id: string;
  actor_id: string;
  actor_name: string;
  actor_role: string;
  from_status?: ComplaintStatus;
  to_status: ComplaintStatus;
  action: string;
  notes?: string;
  created_at: string;
}

export interface ComplaintRecord {
  id: string;
  complaint_reference: string;
  booking_id?: string;
  category: ComplaintCategory;
  title: string;
  description: string;
  evidence: string[];
  created_by_id: string;
  created_by_name?: string;
  created_by_role: string;
  cooperative_code: string;
  assigned_to_id?: string;
  assigned_to_name?: string;
  status: ComplaintStatus;
  resolution_notes?: string;
  resolved_by_id?: string;
  resolved_by_name?: string;
  resolved_at?: string;
  escalated_at?: string;
  escalation_reason?: string;
  created_at: string;
  updated_at: string;
  actions: ComplaintActionHistoryRecord[];
}

export interface FileComplaintPayload {
  booking_id?: string;
  category: ComplaintCategory;
  title: string;
  description: string;
  evidence?: string[];
  cooperative_code?: string;
}

export const complaintService = {
  fileComplaint: async (payload: FileComplaintPayload): Promise<ComplaintRecord> => {
    try {
      const res = await apiClient.post<ComplaintRecord>('/complaints', payload);
      return res.data;
    } catch (err) {
      console.warn('API fileComplaint failed, returning mock complaint:', err);
      const ref = `CMP-${new Date().getFullYear()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
      return {
        id: `cmp-${Date.now()}`,
        complaint_reference: ref,
        booking_id: payload.booking_id,
        category: payload.category,
        title: payload.title,
        description: payload.description,
        evidence: payload.evidence || [],
        created_by_id: 'c-01',
        created_by_name: 'Verified Citizen',
        created_by_role: 'CUSTOMER',
        cooperative_code: payload.cooperative_code || 'OD-KHR-COOP-041',
        status: 'OPEN',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        actions: [
          {
            id: `act-${Date.now()}`,
            complaint_id: `cmp-${Date.now()}`,
            actor_id: 'c-01',
            actor_name: 'Verified Citizen',
            actor_role: 'CUSTOMER',
            to_status: 'OPEN',
            action: 'FILED',
            notes: `Grievance lodged under category ${payload.category}`,
            created_at: new Date().toISOString(),
          },
        ],
      };
    }
  },

  listComplaints: async (params?: {
    category?: ComplaintCategory;
    status?: ComplaintStatus;
    cooperative_code?: string;
  }): Promise<ComplaintRecord[]> => {
    try {
      const res = await apiClient.get<ComplaintRecord[]>('/complaints', { params });
      return res.data;
    } catch (err) {
      console.warn('API listComplaints failed, returning mock complaints:', err);
      return [
        {
          id: 'cmp-01',
          complaint_reference: 'CMP-2024-88A21F',
          booking_id: 'bk-mock-01',
          category: 'DAMAGE',
          title: 'Switchboard casing cracked during installation',
          description: 'Outer PVC plate cracked due to overtightened screw. Replacement requested.',
          evidence: ['https://storage.karmseva.gov.in/evidence/crack_01.jpg'],
          created_by_id: 'c-01',
          created_by_name: 'Dr. Smita Mishra',
          created_by_role: 'CUSTOMER',
          cooperative_code: 'OD-KHR-COOP-041',
          assigned_to_name: 'Cooperative Conciliation Officer',
          status: 'UNDER_REVIEW',
          created_at: new Date(Date.now() - 3600000 * 12).toISOString(),
          updated_at: new Date().toISOString(),
          actions: [
            {
              id: 'act-01',
              complaint_id: 'cmp-01',
              actor_id: 'c-01',
              actor_name: 'Dr. Smita Mishra',
              actor_role: 'CUSTOMER',
              to_status: 'OPEN',
              action: 'FILED',
              notes: 'Grievance lodged by citizen client',
              created_at: new Date(Date.now() - 3600000 * 12).toISOString(),
            },
            {
              id: 'act-02',
              complaint_id: 'cmp-01',
              actor_id: 'coop-admin-01',
              actor_name: 'Cooperative Conciliation Officer',
              actor_role: 'COOPERATIVE_ADMIN',
              from_status: 'OPEN',
              to_status: 'UNDER_REVIEW',
              action: 'UNDER_REVIEW',
              notes: 'Artisan contacted to provide replacement faceplate on revisit.',
              created_at: new Date(Date.now() - 3600000 * 4).toISOString(),
            },
          ],
        },
        {
          id: 'cmp-02',
          complaint_reference: 'CMP-2024-91BC42',
          booking_id: 'bk-mock-02',
          category: 'SAFETY',
          title: 'Uninsulated cable exposed near water pipe',
          description: 'Urgent intervention requested to prevent short circuit danger.',
          evidence: [],
          created_by_id: 'c-02',
          created_by_name: 'Debabrata Das',
          created_by_role: 'CUSTOMER',
          cooperative_code: 'OD-KHR-COOP-041',
          status: 'ESCALATED',
          escalated_at: new Date(Date.now() - 3600000 * 2).toISOString(),
          escalation_reason: 'High-risk safety hazard escalated directly to State DPI Safety Tribunal.',
          created_at: new Date(Date.now() - 3600000 * 20).toISOString(),
          updated_at: new Date().toISOString(),
          actions: [
            {
              id: 'act-03',
              complaint_id: 'cmp-02',
              actor_id: 'c-02',
              actor_name: 'Debabrata Das',
              actor_role: 'CUSTOMER',
              to_status: 'OPEN',
              action: 'FILED',
              notes: 'Filed safety hazard',
              created_at: new Date(Date.now() - 3600000 * 20).toISOString(),
            },
            {
              id: 'act-04',
              complaint_id: 'cmp-02',
              actor_id: 'coop-admin-01',
              actor_name: 'Cooperative Conciliation Officer',
              actor_role: 'COOPERATIVE_ADMIN',
              from_status: 'OPEN',
              to_status: 'ESCALATED',
              action: 'ESCALATED',
              notes: 'Escalated to State DPI Safety Tribunal',
              created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
            },
          ],
        },
      ];
    }
  },

  getComplaintDetail: async (id: string): Promise<ComplaintRecord> => {
    try {
      const res = await apiClient.get<ComplaintRecord>(`/complaints/${id}`);
      return res.data;
    } catch (err) {
      console.warn('API getComplaintDetail failed, returning fallback:', err);
      const list = await complaintService.listComplaints();
      return list.find((c) => c.id === id) || list[0];
    }
  },

  updateStatus: async (
    id: string,
    status: ComplaintStatus,
    notes?: string
  ): Promise<ComplaintRecord> => {
    const res = await apiClient.post<ComplaintRecord>(`/complaints/${id}/status`, { status, notes });
    return res.data;
  },

  resolveComplaint: async (id: string, resolution_notes: string): Promise<ComplaintRecord> => {
    const res = await apiClient.post<ComplaintRecord>(`/complaints/${id}/resolve`, {
      resolution_notes,
    });
    return res.data;
  },

  escalateComplaint: async (id: string, escalation_reason: string): Promise<ComplaintRecord> => {
    const res = await apiClient.post<ComplaintRecord>(`/complaints/${id}/escalate`, {
      escalation_reason,
    });
    return res.data;
  },
};
