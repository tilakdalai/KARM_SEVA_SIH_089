import { UserRole } from './role';

export interface User {
  id: string;
  name: string;
  email?: string | null;
  phone: string;
  role: UserRole;
  profilePhoto?: string | null;
  preferredLanguage?: 'en' | 'hi' | 'or';
  isActive: boolean;
  isVerified: boolean;
  shramId?: string | null;
  trade?: string | null;
  workRadiusKm?: number | null;
  cooperativeName?: string | null;
  organizationName?: string | null;
  institutionType?: string | null;
  district?: string | null;
  pincode?: string | null;
  createdAt?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}
