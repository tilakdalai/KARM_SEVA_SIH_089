import { apiClient } from './api';

export type RecurrenceType = 'ONE_TIME' | 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'CUSTOM_SLOT';
export type ScheduleStatus = 'PENDING_WORKER_ACCEPTANCE' | 'ACTIVE' | 'PAUSED' | 'CANCELLED' | 'DECLINED' | 'COMPLETED';
export type InstanceStatus = 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'SKIPPED';

export interface CustomSlotItem {
  day_of_week: string; // "Monday", "Wednesday", etc.
  start_time: string;  // "09:00"
  end_time: string;    // "12:00"
}

export interface BookingInstanceRecord {
  id: string;
  instance_reference: string;
  recurring_schedule_id: string;
  customer_id: string;
  worker_id: string;
  service_title: string;
  instance_date: string;
  day_of_week?: string;
  start_time: string;
  end_time: string;
  time_slot: string;
  rate: number;
  status: InstanceStatus;
  otp_code: string;
  otp_verified: boolean;
  notes?: string;
  created_at: string;
  updated_at: string;
  customer_name?: string;
  worker_name?: string;
}

export interface RecurringScheduleRecord {
  id: string;
  schedule_reference: string;
  customer_id: string;
  worker_id: string;
  service_id: string;
  service_title: string;
  service_category: string;
  cooperative_code: string;
  cooperative_name: string;
  recurrence_type: RecurrenceType;
  custom_slots?: CustomSlotItem[];
  start_date: string;
  end_date?: string;
  total_occurrences: number;
  rate_per_instance: number;
  total_projected_amount: number;
  address_line: string;
  district: string;
  pincode: string;
  landmark?: string;
  status: ScheduleStatus;
  decline_reason?: string;
  cancellation_reason?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  customer_name?: string;
  customer_phone?: string;
  worker_name?: string;
  worker_phone?: string;
  worker_trade?: string;
  worker_shram_id?: string;
  instances: BookingInstanceRecord[];
}

export interface CalendarEventRecord {
  id: string;
  title: string;
  date: string;
  day_of_week: string;
  start_time: string;
  end_time: string;
  time_slot: string;
  event_type: 'RECURRING_INSTANCE' | 'ONE_TIME_BOOKING';
  status: string;
  worker_name: string;
  customer_name: string;
  rate: number;
  schedule_reference?: string;
  otp_code?: string;
}

export interface RecurringScheduleCreatePayload {
  service_id: string;
  service_title: string;
  service_category: string;
  cooperative_code: string;
  cooperative_name: string;
  worker_id: string;
  recurrence_type: RecurrenceType;
  custom_slots?: CustomSlotItem[];
  start_date: string;
  end_date?: string;
  total_occurrences: number;
  rate_per_instance: number;
  address_line: string;
  district: string;
  pincode: string;
  landmark?: string;
  notes?: string;
}

export const MOCK_RECURRING_SCHEDULES: RecurringScheduleRecord[] = [
  {
    id: 'rec-mock-01',
    schedule_reference: 'REC-2024-8821',
    customer_id: 'cust-1',
    worker_id: 'wrk-1',
    service_id: 'srv-clean-01',
    service_title: 'Weekly Deep Sanitation & Pest Repellent',
    service_category: 'Sanitation',
    cooperative_code: 'OD-BHUB-CLEAN-01',
    cooperative_name: 'Bhubaneswar Urban Sanitation Cooperative',
    recurrence_type: 'CUSTOM_SLOT',
    custom_slots: [
      { day_of_week: 'Monday', start_time: '09:00', end_time: '12:00' },
      { day_of_week: 'Thursday', start_time: '14:00', end_time: '17:00' },
    ],
    start_date: '2026-09-07',
    end_date: '2026-10-07',
    total_occurrences: 8,
    rate_per_instance: 450,
    total_projected_amount: 3600,
    address_line: 'Plot 104, Saheed Nagar',
    district: 'Khordha',
    pincode: '751007',
    landmark: 'Opposite State Library',
    status: 'ACTIVE',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    customer_name: 'Amiya Patnaik',
    worker_name: 'Sunita Majhi',
    worker_shram_id: 'KS-OD-2024-3912',
    instances: [
      {
        id: 'inst-01',
        instance_reference: 'INST-2409-10291',
        recurring_schedule_id: 'rec-mock-01',
        customer_id: 'cust-1',
        worker_id: 'wrk-1',
        service_title: 'Weekly Deep Sanitation',
        instance_date: '2026-09-07',
        day_of_week: 'Monday',
        start_time: '09:00',
        end_time: '12:00',
        time_slot: '09:00 AM - 12:00 PM',
        rate: 450,
        status: 'SCHEDULED',
        otp_code: '4819',
        otp_verified: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 'inst-02',
        instance_reference: 'INST-2409-10292',
        recurring_schedule_id: 'rec-mock-01',
        customer_id: 'cust-1',
        worker_id: 'wrk-1',
        service_title: 'Weekly Deep Sanitation',
        instance_date: '2026-09-10',
        day_of_week: 'Thursday',
        start_time: '14:00',
        end_time: '17:00',
        time_slot: '02:00 PM - 05:00 PM',
        rate: 450,
        status: 'SCHEDULED',
        otp_code: '9120',
        otp_verified: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ],
  },
  {
    id: 'rec-mock-02',
    schedule_reference: 'REC-2024-9104',
    customer_id: 'cust-1',
    worker_id: 'wrk-2',
    service_id: 'srv-elderly-01',
    service_title: 'Elderly Patient Caregiving & Vitals Monitoring',
    service_category: 'Caregiving',
    cooperative_code: 'OD-BHUB-CARE-01',
    cooperative_name: 'Odisha Caregivers Federation',
    recurrence_type: 'DAILY',
    start_date: '2026-09-05',
    total_occurrences: 6,
    rate_per_instance: 800,
    total_projected_amount: 4800,
    address_line: 'Flat 302, Royal Palms, Nayapalli',
    district: 'Khordha',
    pincode: '751012',
    status: 'PENDING_WORKER_ACCEPTANCE',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    customer_name: 'Dr. Smita Mishra',
    worker_name: 'Ramesh Chandra Behera',
    worker_shram_id: 'KS-OD-2024-8841',
    instances: [],
  },
];

export const recurringService = {
  proposeRecurring: async (payload: RecurringScheduleCreatePayload): Promise<RecurringScheduleRecord> => {
    try {
      const resp = await apiClient.post<RecurringScheduleRecord>('/recurring', payload);
      return resp.data;
    } catch {
      const mockRecord: RecurringScheduleRecord = {
        id: `rec-${Date.now()}`,
        schedule_reference: `REC-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
        customer_id: 'curr-cust',
        worker_id: payload.worker_id,
        service_id: payload.service_id,
        service_title: payload.service_title,
        service_category: payload.service_category,
        cooperative_code: payload.cooperative_code,
        cooperative_name: payload.cooperative_name,
        recurrence_type: payload.recurrence_type,
        custom_slots: payload.custom_slots,
        start_date: payload.start_date,
        end_date: payload.end_date,
        total_occurrences: payload.total_occurrences,
        rate_per_instance: payload.rate_per_instance,
        total_projected_amount: payload.rate_per_instance * payload.total_occurrences,
        address_line: payload.address_line,
        district: payload.district,
        pincode: payload.pincode,
        landmark: payload.landmark,
        status: 'PENDING_WORKER_ACCEPTANCE',
        notes: payload.notes,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        instances: [],
      };
      MOCK_RECURRING_SCHEDULES.unshift(mockRecord);
      return mockRecord;
    }
  },

  getRecurringSchedules: async (statusFilter?: string): Promise<RecurringScheduleRecord[]> => {
    try {
      const params = statusFilter ? { status: statusFilter } : {};
      const resp = await apiClient.get<RecurringScheduleRecord[]>('/recurring', { params });
      return resp.data;
    } catch {
      if (!statusFilter || statusFilter === 'ALL') return MOCK_RECURRING_SCHEDULES;
      return MOCK_RECURRING_SCHEDULES.filter((s) => s.status === statusFilter);
    }
  },

  getRecurringScheduleDetail: async (id: string): Promise<RecurringScheduleRecord> => {
    try {
      const resp = await apiClient.get<RecurringScheduleRecord>(`/recurring/${id}`);
      return resp.data;
    } catch {
      const found = MOCK_RECURRING_SCHEDULES.find((s) => s.id === id);
      if (found) return found;
      return MOCK_RECURRING_SCHEDULES[0];
    }
  },

  getCalendarEvents: async (month?: string): Promise<CalendarEventRecord[]> => {
    try {
      const params = month ? { month } : {};
      const resp = await apiClient.get<CalendarEventRecord[]>('/recurring/calendar', { params });
      return resp.data;
    } catch {
      return [
        {
          id: 'mock-cal-1',
          title: 'Weekly Deep Sanitation (09:00 AM - 12:00 PM)',
          date: '2026-09-07',
          day_of_week: 'Monday',
          start_time: '09:00',
          end_time: '12:00',
          time_slot: '09:00 AM - 12:00 PM',
          event_type: 'RECURRING_INSTANCE',
          status: 'SCHEDULED',
          worker_name: 'Sunita Majhi',
          customer_name: 'Amiya Patnaik',
          rate: 450,
          schedule_reference: 'REC-2024-8821',
          otp_code: '4819',
        },
        {
          id: 'mock-cal-2',
          title: 'Weekly Deep Sanitation (02:00 PM - 05:00 PM)',
          date: '2026-09-10',
          day_of_week: 'Thursday',
          start_time: '14:00',
          end_time: '17:00',
          time_slot: '02:00 PM - 05:00 PM',
          event_type: 'RECURRING_INSTANCE',
          status: 'SCHEDULED',
          worker_name: 'Sunita Majhi',
          customer_name: 'Amiya Patnaik',
          rate: 450,
          schedule_reference: 'REC-2024-8821',
          otp_code: '9120',
        },
        {
          id: 'mock-cal-3',
          title: 'Emergency MCB Fix - BK-2024-8841',
          date: '2026-09-08',
          day_of_week: 'Tuesday',
          start_time: '10:00',
          end_time: '12:00',
          time_slot: '10:00 AM - 12:00 PM',
          event_type: 'ONE_TIME_BOOKING',
          status: 'ON_THE_WAY',
          worker_name: 'Ramesh Chandra Behera',
          customer_name: 'Amiya Patnaik',
          rate: 550,
          schedule_reference: 'BK-2024-8841',
          otp_code: '7721',
        },
      ];
    }
  },

  acceptProposal: async (id: string): Promise<RecurringScheduleRecord> => {
    try {
      const resp = await apiClient.post<RecurringScheduleRecord>(`/recurring/${id}/accept`);
      return resp.data;
    } catch {
      const found = MOCK_RECURRING_SCHEDULES.find((s) => s.id === id);
      if (found) {
        found.status = 'ACTIVE';
      }
      return found || MOCK_RECURRING_SCHEDULES[0];
    }
  },

  declineProposal: async (id: string, reason: string): Promise<RecurringScheduleRecord> => {
    try {
      const resp = await apiClient.post<RecurringScheduleRecord>(`/recurring/${id}/decline`, { reason });
      return resp.data;
    } catch {
      const found = MOCK_RECURRING_SCHEDULES.find((s) => s.id === id);
      if (found) {
        found.status = 'DECLINED';
        found.decline_reason = reason;
      }
      return found || MOCK_RECURRING_SCHEDULES[0];
    }
  },

  pauseSchedule: async (id: string, notes?: string): Promise<RecurringScheduleRecord> => {
    try {
      const resp = await apiClient.post<RecurringScheduleRecord>(`/recurring/${id}/pause`, { notes });
      return resp.data;
    } catch {
      const found = MOCK_RECURRING_SCHEDULES.find((s) => s.id === id);
      if (found) {
        found.status = 'PAUSED';
      }
      return found || MOCK_RECURRING_SCHEDULES[0];
    }
  },

  resumeSchedule: async (id: string): Promise<RecurringScheduleRecord> => {
    try {
      const resp = await apiClient.post<RecurringScheduleRecord>(`/recurring/${id}/resume`);
      return resp.data;
    } catch {
      const found = MOCK_RECURRING_SCHEDULES.find((s) => s.id === id);
      if (found) {
        found.status = 'ACTIVE';
      }
      return found || MOCK_RECURRING_SCHEDULES[0];
    }
  },

  cancelSchedule: async (id: string, reason?: string): Promise<RecurringScheduleRecord> => {
    try {
      const resp = await apiClient.post<RecurringScheduleRecord>(`/recurring/${id}/cancel`, { reason });
      return resp.data;
    } catch {
      const found = MOCK_RECURRING_SCHEDULES.find((s) => s.id === id);
      if (found) {
        found.status = 'CANCELLED';
        found.cancellation_reason = reason;
      }
      return found || MOCK_RECURRING_SCHEDULES[0];
    }
  },

  cancelSingleInstance: async (instanceId: string, reason?: string): Promise<BookingInstanceRecord> => {
    try {
      const resp = await apiClient.post<BookingInstanceRecord>(`/recurring/instances/${instanceId}/cancel`, { reason });
      return resp.data;
    } catch {
      return {
        id: instanceId,
        instance_reference: 'INST-CANCELLED',
        recurring_schedule_id: 'rec-mock-01',
        customer_id: 'cust-1',
        worker_id: 'wrk-1',
        service_title: 'Cancelled Shift',
        instance_date: '2026-09-07',
        start_time: '09:00',
        end_time: '12:00',
        time_slot: '09:00 AM - 12:00 PM',
        rate: 450,
        status: 'CANCELLED',
        otp_code: '0000',
        otp_verified: false,
        notes: reason,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
    }
  },
};

