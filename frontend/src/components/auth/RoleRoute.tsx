import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { UserRole } from '@/types/role';
import { ROLE_CONFIGS } from '@/constants/roles';

interface RoleRouteProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
}

export const RoleRoute: React.FC<RoleRouteProps> = ({ children, allowedRoles }) => {
  const { user, activeRole } = useAuth();

  const currentRole = user?.role || activeRole;

  // System Admin has universal oversight across all role dashboards
  if (currentRole === 'SYSTEM_ADMIN') {
    return <>{children}</>;
  }

  if (!allowedRoles.includes(currentRole)) {
    // Redirect to user's assigned dashboard
    const redirectPath = ROLE_CONFIGS[currentRole]?.dashboardPath || '/customer';
    return <Navigate to={redirectPath} replace />;
  }

  return <>{children}</>;
};
