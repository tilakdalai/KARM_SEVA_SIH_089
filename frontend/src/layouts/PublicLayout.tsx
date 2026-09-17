import React from 'react';
import { Outlet } from 'react-router-dom';
import { GovHeader } from '@/components/common/GovHeader';
import { Navbar } from '@/components/common/Navbar';
import { Footer } from '@/components/common/Footer';

export const PublicLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gov-bg text-gov-text font-sans">
      <GovHeader />
      <Navbar />
      <main className="flex-1 w-full">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};
