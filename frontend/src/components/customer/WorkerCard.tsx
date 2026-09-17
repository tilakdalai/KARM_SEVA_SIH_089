import React from 'react';
import { useNavigate } from 'react-router-dom';
import { WorkerMock } from '@/services/customerMockData';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { 
  Star, 
  ShieldCheck, 
  MapPin, 
  Briefcase, 
  Clock, 
  Award, 
  ChevronRight, 
  Sparkles
} from 'lucide-react';

interface WorkerCardProps {
  worker: WorkerMock;
  compact?: boolean;
  onBookClick?: (worker: WorkerMock) => void;
}

export const WorkerCard: React.FC<WorkerCardProps> = ({ 
  worker, 
  compact = false,
  onBookClick
}) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/customer/workers/${worker.id}`);
  };

  const handleBook = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onBookClick) {
      onBookClick(worker);
    } else {
      navigate(`/customer/workers/${worker.id}`);
    }
  };

  return (
    <Card 
      onClick={handleCardClick}
      className={`border border-slate-200 hover:border-gov-green hover:shadow-md transition-all cursor-pointer bg-white group overflow-hidden ${
        compact ? 'p-3.5' : 'p-4 sm:p-5'
      }`}
    >
      <div className="flex flex-col sm:flex-row gap-4 items-start">
        
        {/* Left: Worker Photo & Availability Badge */}
        <div className="relative shrink-0 mx-auto sm:mx-0">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border-2 border-slate-100 shadow-xs group-hover:scale-102 transition-transform">
            <img 
              src={worker.photo} 
              alt={worker.name} 
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>

          {/* Verification Shield Indicator */}
          {worker.isVerified && (
            <div 
              className="absolute -bottom-1 -right-1 bg-gov-green text-white p-1 rounded-full border-2 border-white shadow-xs"
              title="Verified by Labour Cooperative"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
            </div>
          )}

          {/* Live Availability Pill */}
          <div className="mt-2 text-center">
            {worker.isAvailableNow ? (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>Available Now</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[10px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                <Clock className="w-2.5 h-2.5" />
                <span className="truncate max-w-[80px]">{worker.nextSlot || 'Tomorrow'}</span>
              </span>
            )}
          </div>
        </div>

        {/* Center: Worker Details */}
        <div className="flex-1 min-w-0 space-y-2 w-full">
          
          {/* Header Row: Name, KARM ID & Distance */}
          <div>
            <div className="flex flex-wrap items-center justify-between gap-1">
              <div className="flex items-center space-x-2">
                <h3 className="font-extrabold text-base text-gov-navy group-hover:text-gov-green transition-colors truncate">
                  {worker.name}
                </h3>
                <span className="text-[10px] font-mono font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                  {worker.shramId}
                </span>
              </div>

              {/* Distance Pill */}
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-gov-navy bg-slate-50 px-2 py-0.5 rounded-full border border-slate-200">
                <MapPin className="w-3 h-3 text-gov-green" />
                <span>{worker.distanceKm} km away</span>
              </span>
            </div>

            {/* Trade & Cooperative Affiliation */}
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-gov-muted mt-0.5">
              <span className="font-bold text-slate-800 flex items-center gap-1">
                <Briefcase className="w-3 h-3 text-slate-400" />
                <span>{worker.trade}</span>
              </span>
              <span>·</span>
              <span className="truncate max-w-[200px]" title={worker.cooperativeName}>
                {worker.cooperativeName}
              </span>
            </div>
          </div>

          {/* Metrics Row: Rating, Jobs, Experience */}
          <div className="flex flex-wrap items-center gap-3 pt-1 text-xs">
            <div className="flex items-center gap-1 font-bold text-slate-900 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
              <span>{(worker.rating ?? 4.8).toFixed(1)}</span>
              <span className="text-[10px] text-slate-500 font-normal">({worker.totalReviews ?? 36})</span>
            </div>

            <div className="flex items-center gap-1 text-slate-600 font-medium">
              <Sparkles className="w-3.5 h-3.5 text-gov-green" />
              <span><strong>{worker.totalJobs ?? 48}</strong> Jobs Done</span>
            </div>

            <div className="flex items-center gap-1 text-slate-600 font-medium">
              <Award className="w-3.5 h-3.5 text-blue-600" />
              <span><strong>{worker.experienceYears ?? 4}+</strong> Yrs Exp</span>
            </div>
          </div>

          {/* Badges Row */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {(worker.reviewBadges || []).slice(0, 2).map((badge, idx) => (
              <span 
                key={idx} 
                className="text-[10px] font-bold text-emerald-800 bg-emerald-50/80 px-2 py-0.5 rounded border border-emerald-200/80"
              >
                ✓ {badge}
              </span>
            ))}
            {(worker.verificationBadges || []).some((b) => b.includes('ITI') || b.includes('Certified')) && (
              <span className="text-[10px] font-bold text-blue-800 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                🎓 Govt ITI Certified
              </span>
            )}
          </div>
        </div>

        {/* Right: Pricing & Book Action */}
        <div className="w-full sm:w-auto sm:text-right shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 flex sm:flex-col justify-between sm:justify-center items-center sm:items-end gap-2">
          <div>
            <span className="text-[10px] text-gov-muted uppercase tracking-wider block">
              Standard Rate
            </span>
            <div className="flex items-baseline gap-1 sm:justify-end">
              <span className="text-lg font-black text-gov-navy">
                ₹{worker.startingRate}
              </span>
              <span className="text-[10px] text-gov-muted">
                {worker.rateUnit ? `/ ${worker.rateUnit.split(' ')[0]}` : ''}
              </span>
            </div>
          </div>

          <Button
            size="sm"
            variant="primary"
            onClick={handleBook}
            className="text-xs font-bold px-4 py-1.5 shadow-xs"
            rightIcon={<ChevronRight className="w-3.5 h-3.5" />}
          >
            View & Book
          </Button>
        </div>

      </div>
    </Card>
  );
};
