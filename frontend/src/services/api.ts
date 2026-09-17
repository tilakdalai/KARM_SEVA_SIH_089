import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { APP_CONFIG } from '@/constants/config';

export const apiClient = axios.create({
  baseURL: APP_CONFIG.API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Request Interceptor: Attach JWT Token if present
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token =
      localStorage.getItem(APP_CONFIG.STORAGE_KEYS.AUTH_TOKEN) ||
      localStorage.getItem('shramsetu_auth_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

// Response Interceptor: Handle Global 401s and standardized error shapes
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Clear token upon unauthorized session expiry
      localStorage.removeItem(APP_CONFIG.STORAGE_KEYS.AUTH_TOKEN);
      localStorage.removeItem('shramsetu_auth_token');
    }
    return Promise.reject(error);
  }
);
