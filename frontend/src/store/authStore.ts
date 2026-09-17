import { create } from 'zustand';
import { User } from '@/types/user';
import { UserRole } from '@/types/role';
import { APP_CONFIG } from '@/constants/config';
import { authService, RegisterPayload, LoginPayload } from '@/services/authService';

interface AuthStore {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  activeRole: UserRole;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  initAuth: () => Promise<void>;
  login: (credentials: LoginPayload) => Promise<User>;
  register: (payload: RegisterPayload) => Promise<User>;
  logout: () => Promise<void>;
  clearError: () => void;
  switchDemoRole: (role: UserRole) => void;
}

const getAuthToken = () =>
  localStorage.getItem(APP_CONFIG.STORAGE_KEYS.AUTH_TOKEN) ||
  localStorage.getItem('shramsetu_auth_token');

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  token: getAuthToken(),
  isAuthenticated: !!getAuthToken(),
  activeRole: 'CUSTOMER',
  isLoading: false,
  error: null,

  initAuth: async () => {
    const token = getAuthToken();
    if (!token) {
      set({ user: null, isAuthenticated: false, isLoading: false });
      return;
    }

    try {
      set({ isLoading: true, error: null });
      const user = await authService.getMyProfile();
      set({
        user,
        isAuthenticated: true,
        activeRole: user.role,
        isLoading: false,
      });
    } catch {
      // If token is expired/invalid, clear local token
      localStorage.removeItem(APP_CONFIG.STORAGE_KEYS.AUTH_TOKEN);
      localStorage.removeItem('shramsetu_auth_token');
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  },

  login: async (credentials: LoginPayload) => {
    set({ isLoading: true, error: null });
    try {
      const data = await authService.login(credentials);
      localStorage.setItem(APP_CONFIG.STORAGE_KEYS.AUTH_TOKEN, data.access_token);
      set({
        user: data.user,
        token: data.access_token,
        isAuthenticated: true,
        activeRole: data.user.role,
        isLoading: false,
        error: null,
      });
      return data.user;
    } catch (err: unknown) {
      let msg = 'Failed to sign in. Please verify your credentials.';
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosErr = err as { response?: { data?: { message?: string } } };
        if (axiosErr.response?.data?.message) {
          msg = axiosErr.response.data.message;
        }
      } else if (err instanceof Error) {
        msg = err.message;
      }
      set({ isLoading: false, error: msg });
      throw new Error(msg);
    }
  },

  register: async (payload: RegisterPayload) => {
    set({ isLoading: true, error: null });
    try {
      const data = await authService.register(payload);
      localStorage.setItem(APP_CONFIG.STORAGE_KEYS.AUTH_TOKEN, data.access_token);
      set({
        user: data.user,
        token: data.access_token,
        isAuthenticated: true,
        activeRole: data.user.role,
        isLoading: false,
        error: null,
      });
      return data.user;
    } catch (err: unknown) {
      let msg = 'Registration failed. Please check form inputs.';
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosErr = err as { response?: { data?: { message?: string } } };
        if (axiosErr.response?.data?.message) {
          msg = axiosErr.response.data.message;
        }
      } else if (err instanceof Error) {
        msg = err.message;
      }
      set({ isLoading: false, error: msg });
      throw new Error(msg);
    }
  },

  logout: async () => {
    try {
      await authService.logout();
    } finally {
      localStorage.removeItem(APP_CONFIG.STORAGE_KEYS.AUTH_TOKEN);
      localStorage.removeItem('shramsetu_auth_token');
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        activeRole: 'CUSTOMER',
        error: null,
      });
    }
  },

  clearError: () => set({ error: null }),

  switchDemoRole: (role: UserRole) => {
    const currUser = get().user;
    if (currUser) {
      set({
        activeRole: role,
        user: { ...currUser, role },
      });
    } else {
      set({ activeRole: role });
    }
  },
}));
