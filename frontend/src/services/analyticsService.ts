import { apiClient } from './api';

export interface TimeseriesPoint {
  date: string;
  value: number;
  secondary_value?: number;
  label?: string;
}

export interface DistributionItem {
  name: string;
  value: number;
  percentage: number;
  color?: string;
}

export interface LeaderboardItem {
  worker_id: string;
  worker_name: string;
  trade: string;
  rating: number;
  completed_jobs: number;
  completion_rate: number;
  earnings: number;
}

export interface CustomerAnalyticsResponse {
  total_spent: number;
  total_bookings: number;
  completed_bookings: number;
  active_bookings: number;
  favorite_services: DistributionItem[];
}

export interface WorkerAnalyticsResponse {
  gross_earnings: number;
  net_earnings: number;
  completed_jobs: number;
  average_rating: number;
  completion_rate: number;
  earnings_trend: TimeseriesPoint[];
  jobs_trend: TimeseriesPoint[];
  trade_breakdown: DistributionItem[];
}

export interface CooperativeAnalyticsResponse {
  total_jobs: number;
  completed_jobs: number;
  active_jobs: number;
  emergency_jobs: number;
  total_revenue: number;
  worker_share: number;
  cooperative_share: number;
  platform_share: number;
  workforce_utilization_rate: number;
  replacement_frequency_rate: number;
  complaint_rate: number;
  revenue_trend: TimeseriesPoint[];
  service_distribution: DistributionItem[];
  top_workers: LeaderboardItem[];
}

export interface InstitutionAnalyticsResponse {
  total_monthly_spend: number;
  total_attendance_hours: number;
  average_attendance_rate: number;
  active_headcount: number;
  spend_trend: TimeseriesPoint[];
  service_usage: DistributionItem[];
}

export interface AdminImpactAnalyticsResponse {
  platform_gmv: number;
  worker_disbursements: number;
  cooperative_corpus: number;
  platform_revenue: number;
  total_active_workers: number;
  total_citizens_served: number;
  average_satisfaction_rating: number;
  dispute_resolution_rate: number;
  gmv_trend: TimeseriesPoint[];
  district_distribution: DistributionItem[];
  service_distribution: DistributionItem[];
}

export interface AnalyticsFilterParams {
  time_range?: '7d' | '30d' | '3m' | '6m' | '1y' | 'custom';
  start_date?: string;
  end_date?: string;
  service?: string;
  district?: string;
  cooperative_id?: string;
}

export const analyticsService = {
  getCustomerAnalytics: async (params?: AnalyticsFilterParams): Promise<CustomerAnalyticsResponse> => {
    const res = await apiClient.get('/analytics/customer', { params });
    return res.data;
  },

  getWorkerAnalytics: async (params?: AnalyticsFilterParams): Promise<WorkerAnalyticsResponse> => {
    const res = await apiClient.get('/analytics/worker', { params });
    return res.data;
  },

  getCooperativeAnalytics: async (params?: AnalyticsFilterParams): Promise<CooperativeAnalyticsResponse> => {
    const res = await apiClient.get('/analytics/cooperative', { params });
    return res.data;
  },

  getInstitutionAnalytics: async (params?: AnalyticsFilterParams): Promise<InstitutionAnalyticsResponse> => {
    const res = await apiClient.get('/analytics/institution', { params });
    return res.data;
  },

  getAdminImpactAnalytics: async (params?: AnalyticsFilterParams): Promise<AdminImpactAnalyticsResponse> => {
    const res = await apiClient.get('/analytics/admin', { params });
    return res.data;
  },
};
