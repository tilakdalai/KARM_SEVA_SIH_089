import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { GovHeader } from '@/components/common/GovHeader';
import { BrandLogo } from '@/components/common/BrandLogo';

export const AuthLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gov-bg font-sans">
      <GovHeader />
      <div className="flex-1 flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="mb-6 text-center">
          <BrandLogo size="lg" showTagline={true} to="/" />
        </div>

        <div className="w-full max-w-lg bg-white border border-gov-border rounded-xl shadow-gov-card p-6 sm:p-8">
          <Outlet />
        </div>

        <div className="mt-8 text-center text-xs text-gov-muted">
          <Link to="/" className="text-gov-navy font-semibold hover:underline">
            ← Back to Public Portal
          </Link>
        </div>
      </div>
    </div>
  );
};
