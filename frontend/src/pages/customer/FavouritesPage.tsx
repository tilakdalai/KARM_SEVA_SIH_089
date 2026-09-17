import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MOCK_WORKERS } from '@/services/customerMockData';
import { WorkerCard } from '@/components/customer/WorkerCard';
import { Button } from '@/components/common/Button';
import { Heart, ArrowLeft } from 'lucide-react';

export const FavouritesPage: React.FC = () => {
  const navigate = useNavigate();
  // Mock favourites list (first 2 workers)
  const favouriteWorkers = MOCK_WORKERS.slice(0, 2);

  return (
    <div className="space-y-6 pb-14">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center space-x-1.5 text-xs font-bold text-slate-600 hover:text-gov-navy transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>
      </div>

      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-black text-gov-navy tracking-tight flex items-center gap-2">
          <Heart className="w-6 h-6 text-rose-500 fill-rose-500" />
          <span>Favourite Trusted Craftsmen</span>
        </h1>
        <p className="text-xs sm:text-sm text-gov-muted">
          Your saved verified workers for instant 1-click rebooking and scheduling
        </p>
      </div>

      {favouriteWorkers.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 space-y-3">
          <Heart className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="font-extrabold text-gov-navy text-base">No favourite workers saved yet</h3>
          <p className="text-xs text-gov-muted">Browse craftsmen profiles and click the heart icon to save them here.</p>
          <Button size="sm" variant="primary" onClick={() => navigate('/customer/workers')} className="text-xs">
            Discover Workers
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {favouriteWorkers.map((worker) => (
            <WorkerCard key={worker.id} worker={worker} />
          ))}
        </div>
      )}

    </div>
  );
};
