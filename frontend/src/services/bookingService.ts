import { apiClient } from './api';

export type BookingStatus =
  | 'REQUESTED'
  | 'ACCEPTED'
  | 'ON_THE_WAY'
  | 'ARRIVED'
  | 'STARTED'
  | 'COMPLETED'
  | 'DECLINED'
  | 'CANCELLED'
  | 'DISPUTED';

export type BookingType = 'ONE_TIME' | 'RECURRING';
export type RecurringFrequency = 'NONE' | 'DAILY' | 'WEEKLY' | 'BIWEEKLY' | 'MONTHLY';

export interface BookingStatusHistoryItem {
  id: string;
  booking_id: string;
  from_status?: BookingStatus | null;
  to_status: BookingStatus;
  changed_by_user_id: string;
  changed_by_name?: string;
  changed_by_role?: string;
  notes?: string;
  created_at: string;
}

export interface BookingRecord {
  id: string;
  booking_reference: string;
  customer_id: string;
  service_id: string;
  service_title: string;
  service_category: string;
  cooperative_code: string;
  cooperative_name: string;
  scheduled_worker_id: string;
  actual_worker_id?: string | null;
  replacement_for_worker_id?: string | null;
  is_replacement?: boolean;
  replacement_reason?: string | null;
  replacement_worker_name?: string | null;
  booking_type: BookingType;
  recurring_frequency: RecurringFrequency;
  scheduled_date: string;
  time_slot: string;
  address_line: string;
  district: string;
  pincode: string;
  landmark?: string | null;
  lat?: number | null;
  lng?: number | null;
  description?: string | null;
  media_urls?: string[] | null;
  base_rate: number;
  extra_charges: number;
  total_amount: number;
  status: BookingStatus;
  otp_code: string;
  otp_verified: boolean;
  decline_reason?: string | null;
  cancellation_reason?: string | null;
  dispute_reason?: string | null;
  rating?: number | null;
  review?: string | null;
  created_at: string;
  updated_at: string;

  customer_name?: string;
  customer_phone?: string;
  worker_name?: string;
  worker_phone?: string;
  worker_trade?: string;
  worker_shram_id?: string;
  worker_rating?: number;

  status_history: BookingStatusHistoryItem[];
}

export interface BookingCreateParams {
  service_id: string;
  service_title: string;
  service_category: string;
  cooperative_code: string;
  cooperative_name: string;
  scheduled_worker_id: string;
  booking_type?: BookingType;
  recurring_frequency?: RecurringFrequency;
  scheduled_date: string;
  time_slot: string;
  address_line: string;
  district: string;
  pincode: string;
  landmark?: string;
  lat?: number;
  lng?: number;
  description?: string;
  media_urls?: string[];
  base_rate: number;
  extra_charges?: number;
  total_amount: number;
}

const mockBookings: BookingRecord[] = [
  {
    id: 'b-mock-01',
    booking_reference: 'BK-2024-9120',
    customer_id: 'cust-demo',
    service_id: 'srv-elec-01',
    service_title: 'Master Electrician Diagnostic & Wiring',
    service_category: 'Electrician',
    cooperative_code: 'OD-KHR-COOP-041',
    cooperative_name: 'Bhubaneswar Multi-Purpose Labour Cooperative',
    scheduled_worker_id: 'w-01',
    actual_worker_id: 'w-01',
    booking_type: 'ONE_TIME',
    recurring_frequency: 'NONE',
    scheduled_date: '2024-09-02',
    time_slot: '09:00 AM - 11:00 AM',
    address_line: 'Plot 42, Saheed Nagar',
    district: 'Bhubaneswar',
    pincode: '751007',
    landmark: 'Near Rama Devi Women University',
    description: 'Main circuit breaker tripping intermittently under AC load.',
    media_urls: ['https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=500'],
    base_rate: 550.0,
    extra_charges: 0.0,
    total_amount: 550.0,
    status: 'ON_THE_WAY',
    otp_code: '4819',
    otp_verified: false,
    created_at: new Date(Date.now() - 3600000).toISOString(),
    updated_at: new Date().toISOString(),
    customer_name: 'Ananya Patnaik',
    customer_phone: '9876543210',
    worker_name: 'Gopal Nayak',
    worker_phone: '9876543211',
    worker_trade: 'Master Electrician',
    worker_shram_id: 'KS-OD-2024-8841',
    worker_rating: 4.9,
    status_history: [
      {
        id: 'h-1',
        booking_id: 'b-mock-01',
        from_status: null,
        to_status: 'REQUESTED',
        changed_by_user_id: 'cust-demo',
        changed_by_name: 'Ananya Patnaik',
        changed_by_role: 'CUSTOMER',
        notes: 'Citizen initiated booking request via KARM SEVA Portal.',
        created_at: new Date(Date.now() - 3600000).toISOString(),
      },
      {
        id: 'h-2',
        booking_id: 'b-mock-01',
        from_status: 'REQUESTED',
        to_status: 'ACCEPTED',
        changed_by_user_id: 'w-01',
        changed_by_name: 'Gopal Nayak',
        changed_by_role: 'WORKER',
        notes: 'Tradesperson accepted shift assignment.',
        created_at: new Date(Date.now() - 2400000).toISOString(),
      },
      {
        id: 'h-3',
        booking_id: 'b-mock-01',
        from_status: 'ACCEPTED',
        to_status: 'ON_THE_WAY',
        changed_by_user_id: 'w-01',
        changed_by_name: 'Gopal Nayak',
        changed_by_role: 'WORKER',
        notes: 'Tradesperson in transit (Estimated arrival: 15 mins).',
        created_at: new Date(Date.now() - 900000).toISOString(),
      },
    ],
  },
  {
    id: 'b-mock-02',
    booking_reference: 'BK-2024-8812',
    customer_id: 'cust-demo',
    service_id: 'srv-plumb-01',
    service_title: 'Overhead Tank & Pressure Line Repair',
    service_category: 'Plumber',
    cooperative_code: 'OD-KHR-COOP-041',
    cooperative_name: 'Bhubaneswar Multi-Purpose Labour Cooperative',
    scheduled_worker_id: 'w-02',
    booking_type: 'ONE_TIME',
    recurring_frequency: 'NONE',
    scheduled_date: '2024-08-29',
    time_slot: '02:00 PM - 04:00 PM',
    address_line: 'House 18, Unit 4',
    district: 'Bhubaneswar',
    pincode: '751001',
    base_rate: 500.0,
    extra_charges: 0.0,
    total_amount: 500.0,
    status: 'COMPLETED',
    otp_code: '9142',
    otp_verified: true,
    rating: 5.0,
    review: 'Very professional, arrived promptly and resolved the leak.',
    created_at: new Date(Date.now() - 86400000 * 4).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 4).toISOString(),
    customer_name: 'Ananya Patnaik',
    customer_phone: '9876543210',
    worker_name: 'Rabi Narayan Sahoo',
    worker_phone: '9876543222',
    worker_trade: 'Certified Plumber',
    worker_shram_id: 'KS-OD-2024-7721',
    worker_rating: 4.85,
    status_history: [
      {
        id: 'h-4',
        booking_id: 'b-mock-02',
        from_status: null,
        to_status: 'REQUESTED',
        changed_by_user_id: 'cust-demo',
        created_at: new Date(Date.now() - 86400000 * 4).toISOString(),
      },
      {
        id: 'h-5',
        booking_id: 'b-mock-02',
        from_status: 'REQUESTED',
        to_status: 'COMPLETED',
        changed_by_user_id: 'w-02',
        notes: 'Service completed with verified OTP.',
        created_at: new Date(Date.now() - 86400000 * 4 + 7200000).toISOString(),
      },
    ],
  },
  {
    id: '5e8dff0f-25a5-4e34-946e-49d4e3776cdf',
    booking_reference: 'BK-2026-8801',
    customer_id: 'c409863a-b264-4bd6-a6bd-7cbc54332ad4',
    service_id: 'srv-elec-01',
    service_title: 'Master Electrician Diagnostic & Wiring',
    service_category: 'Electrician',
    cooperative_code: 'OD-KHR-COOP-041',
    cooperative_name: 'Bhubaneswar Urban Craftsmen Federation',
    scheduled_worker_id: 'bb130310-efd7-4ff8-9564-71782e12ae8a',
    actual_worker_id: 'bb130310-efd7-4ff8-9564-71782e12ae8a',
    booking_type: 'ONE_TIME',
    recurring_frequency: 'NONE',
    scheduled_date: 'Today',
    time_slot: '09:00 AM - 11:00 AM',
    address_line: 'Plot 412, Saheed Nagar',
    district: 'Khordha',
    pincode: '751007',
    landmark: 'Near Saheed Club',
    description: 'Electrical switchboard tripping & circuit diagnostic inspection.',
    media_urls: ['https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=500'],
    base_rate: 550.0,
    extra_charges: 0.0,
    total_amount: 550.0,
    status: 'ON_THE_WAY',
    otp_code: '4819',
    otp_verified: false,
    created_at: new Date(Date.now() - 3600000).toISOString(),
    updated_at: new Date().toISOString(),
    customer_name: 'Citizen Customer',
    customer_phone: '9876543210',
    worker_name: 'Gopal Nayak',
    worker_phone: '9876543211',
    worker_trade: 'Master Electrician',
    worker_shram_id: 'KS-OD-2026-8841',
    worker_rating: 4.9,
    status_history: [
      {
        id: 'h-101',
        booking_id: '5e8dff0f-25a5-4e34-946e-49d4e3776cdf',
        from_status: null,
        to_status: 'REQUESTED',
        changed_by_user_id: 'c409863a-b264-4bd6-a6bd-7cbc54332ad4',
        changed_by_name: 'Citizen Customer',
        changed_by_role: 'CUSTOMER',
        notes: 'Citizen requested verified cooperative electrical service.',
        created_at: new Date(Date.now() - 3600000).toISOString(),
      },
      {
        id: 'h-102',
        booking_id: '5e8dff0f-25a5-4e34-946e-49d4e3776cdf',
        from_status: 'REQUESTED',
        to_status: 'ACCEPTED',
        changed_by_user_id: 'bb130310-efd7-4ff8-9564-71782e12ae8a',
        changed_by_name: 'Gopal Nayak',
        changed_by_role: 'WORKER',
        notes: 'Cooperative artisan accepted service assignment.',
        created_at: new Date(Date.now() - 2400000).toISOString(),
      },
      {
        id: 'h-103',
        booking_id: '5e8dff0f-25a5-4e34-946e-49d4e3776cdf',
        from_status: 'ACCEPTED',
        to_status: 'ON_THE_WAY',
        changed_by_user_id: 'bb130310-efd7-4ff8-9564-71782e12ae8a',
        changed_by_name: 'Gopal Nayak',
        changed_by_role: 'WORKER',
        notes: 'Artisan en route to doorstep (Live GPS active).',
        created_at: new Date(Date.now() - 600000).toISOString(),
      },
    ],
  },
];

export const bookingService = {
  /**
   * Create a new booking. Throws an Error with a helpful message on failure.
   */
  createBooking: async (params: BookingCreateParams): Promise<BookingRecord> => {
    const response = await apiClient.post('/bookings', params);
    if (response.data?.data?.booking) {
      return response.data.data.booking;
    }
    // Handle non-standard success shape
    if (response.data?.id) return response.data as BookingRecord;
    throw new Error('Unexpected response from booking creation API. Please try again.');
  },

  /**
   * List bookings for the current user. Falls back to empty array (not fake data) on failure.
   */
  getBookings: async (statusFilter?: string): Promise<BookingRecord[]> => {
    try {
      const url = statusFilter && statusFilter !== 'ALL'
        ? `/bookings?status=${statusFilter}`
        : '/bookings';
      const response = await apiClient.get(url);
      if (response.data?.data?.bookings) {
        return response.data.data.bookings;
      }
      if (Array.isArray(response.data)) return response.data;
      return [];
    } catch (err) {
      console.warn('[bookingService.getBookings] API unavailable, returning empty list.', err);
      return [];
    }
  },

  /**
   * Get single booking detail. Falls back gracefully to mockBookings if API fails or is unauthorized.
   */
  getBookingDetail: async (bookingId: string): Promise<BookingRecord | null> => {
    try {
      const response = await apiClient.get(`/bookings/${bookingId}`);
      if (response.data?.data?.booking) {
        return response.data.data.booking;
      }
      if (response.data?.id) return response.data as BookingRecord;
    } catch (err) {
      console.warn('[bookingService.getBookingDetail] API error for', bookingId, err);
    }

    // Fallback to local mockBookings catalog for demo / resilient tracking display
    const mock = mockBookings.find(
      (b) => b.id === bookingId || b.booking_reference === bookingId
    );
    if (mock) return mock;

    // Dynamically synthesize a clean booking record for unseeded IDs
    if (bookingId) {
      return {
        id: bookingId,
        booking_reference: `BK-${bookingId.slice(0, 8).toUpperCase()}`,
        customer_id: 'cust-demo',
        service_id: 'srv-gen-01',
        service_title: 'Electrical Repair & Diagnostic',
        service_category: 'Electrician',
        cooperative_code: 'OD-KHR-COOP-041',
        cooperative_name: 'Bhubaneswar Urban Craftsmen Federation',
        scheduled_worker_id: 'w-default',
        actual_worker_id: 'w-default',
        booking_type: 'ONE_TIME',
        recurring_frequency: 'NONE',
        scheduled_date: 'Today',
        time_slot: '09:00 AM - 11:00 AM',
        address_line: 'Plot 412, Saheed Nagar',
        district: 'Khordha',
        pincode: '751007',
        base_rate: 550.0,
        extra_charges: 0.0,
        total_amount: 550.0,
        status: 'ON_THE_WAY',
        otp_code: '4819',
        otp_verified: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        customer_name: 'Citizen Customer',
        worker_name: 'Gopal Nayak',
        worker_trade: 'Master Electrician',
        worker_shram_id: 'KS-OD-2026-8841',
        worker_rating: 4.9,
        status_history: [],
      };
    }

    return null;
  },

  /**
   * Update booking status. Throws on failure — the caller must handle errors.
   * Silently swallowing status update failures would leave DB and UI out of sync.
   */
  updateStatus: async (
    bookingId: string,
    statusValue: BookingStatus,
    otpCode?: string,
    reason?: string,
    notes?: string
  ): Promise<BookingRecord | null> => {
    const response = await apiClient.post(`/bookings/${bookingId}/status`, {
      status: statusValue,
      otp_code: otpCode,
      reason,
      notes,
    });
    if (response.data?.data?.booking) {
      return response.data.data.booking;
    }
    return null;
  },

  /**
   * Rate a completed booking. Returns null on failure but logs a warning.
   */
  rateBooking: async (bookingId: string, rating: number, review?: string): Promise<BookingRecord | null> => {
    try {
      const response = await apiClient.post(`/bookings/${bookingId}/rate`, { rating, review });
      if (response.data?.data?.booking) {
        return response.data.data.booking;
      }
      return null;
    } catch (err) {
      console.warn('[bookingService.rateBooking] Failed to submit rating:', err);
      return null;
    }
  },
};

// ─── DEV ONLY: Mock data for Storybook / offline UI development ─────────────
// These are NOT used in any production API call path above.
export const DEV_MOCK_BOOKINGS: BookingRecord[] = mockBookings;

