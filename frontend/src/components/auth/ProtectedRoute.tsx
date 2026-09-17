import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { LoadingSpinner } from '@/components/feedback/LoadingSpinner';
import { useAuthStore } from '@/store/authStore';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const initAuth = useAuthStore((state) => state.initAuth);
  const location = useLocation();

  useEffect(() => {
    if (!user && isAuthenticated) {
      initAuth();
    }
  }, [user, isAuthenticated, initAuth]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gov-bg">
        <LoadingSpinner message="Verifying security credentials..." size="lg" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
