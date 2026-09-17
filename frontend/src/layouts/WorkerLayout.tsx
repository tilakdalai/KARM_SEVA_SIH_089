import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { GovHeader } from '@/components/common/GovHeader';
import { WorkerHeader } from '@/components/worker/WorkerHeader';
import { WorkerBottomNav } from '@/components/worker/WorkerBottomNav';
import { MOCK_WORKER_PROFILE } from '@/services/workerDashboardMockData';

export const WorkerLayout: React.FC = () => {
  const [isOnline, setIsOnline] = useState(MOCK_WORKER_PROFILE.isOnline);

  const handleToggleOnline = () => {
    setIsOnline(!isOnline);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gov-bg font-sans">
      <GovHeader />
      <WorkerHeader
        isOnline={isOnline}
        onToggleOnline={handleToggleOnline}
      />
      
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Outlet />
      </main>

      <WorkerBottomNav />
    </div>
  );
};
