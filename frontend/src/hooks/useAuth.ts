import { useAuthStore } from '@/store/authStore';
import { UserRole } from '@/types/role';
import { ROLE_CONFIGS } from '@/constants/roles';

export function useAuth() {
  const {
    user,
    token,
    isAuthenticated,
    activeRole,
    isLoading,
    error,
    login,
    register,
    logout,
    clearError,
    switchDemoRole,
  } = useAuthStore();

  const hasRole = (role: UserRole) => activeRole === role;
  const currentDashboardPath = user ? ROLE_CONFIGS[user.role]?.dashboardPath || '/customer' : '/login';

  return {
    user,
    token,
    isAuthenticated,
    activeRole,
    isLoading,
    error,
    login,
    register,
    logout,
    clearError,
    switchDemoRole,
    switchRole: switchDemoRole,
    hasRole,
    currentDashboardPath,
  };
}
