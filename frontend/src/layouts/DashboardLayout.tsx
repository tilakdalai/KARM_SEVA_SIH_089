import React from 'react';
import { Outlet } from 'react-router-dom';
import { GovHeader } from '@/components/common/GovHeader';
import { Navbar } from '@/components/common/Navbar';
import { RoleSidebar } from '@/components/layout/RoleSidebar';
import { Footer } from '@/components/common/Footer';

export const DashboardLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gov-bg font-sans">
      <GovHeader />
      <Navbar />
      <div className="flex-1 flex flex-col md:flex-row w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 gap-6">
        <RoleSidebar />
        <main className="flex-1 min-w-0 bg-transparent">
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  );
};
