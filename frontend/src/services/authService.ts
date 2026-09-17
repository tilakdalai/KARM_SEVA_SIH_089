import { apiClient } from './api';
import { APIResponse } from '@/types/api';
import { User } from '@/types/user';
import { UserRole } from '@/types/role';

export interface RegisterPayload {
  name: string;
  phone: string;
  email?: string;
  password: string;
  role: UserRole;
  preferred_language?: string;
  trade?: string;
  work_radius_km?: number;
  cooperative_name?: string;
  organization_name?: string;
  institution_type?: string;
  address?: string;
  district?: string;
  pincode?: string;
}

export interface LoginPayload {
  credential: string;
  password: string;
}

export interface AuthResponseData {
  access_token: string;
  token_type: string;
  user: User;
}

export const authService = {
  async register(payload: RegisterPayload): Promise<AuthResponseData> {
    const response = await apiClient.post<APIResponse<AuthResponseData>>('/auth/register', payload);
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'Registration failed');
    }
    return response.data.data;
  },

  async login(payload: LoginPayload): Promise<AuthResponseData> {
    const response = await apiClient.post<APIResponse<AuthResponseData>>('/auth/login', payload);
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'Login failed');
    }
    return response.data.data;
  },

  async getMyProfile(): Promise<User> {
    const response = await apiClient.get<APIResponse<User>>('/auth/me');
    if (!response.data.success || !response.data.data) {
      throw new Error(response.data.message || 'Failed to fetch user profile');
    }
    return response.data.data;
  },

  async logout(): Promise<void> {
    try {
      await apiClient.post('/auth/logout');
    } catch {
      // Best-effort logout notification
    }
  },
};
