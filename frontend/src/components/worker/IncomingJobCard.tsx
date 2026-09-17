import React, { useState } from 'react';
import { WorkerJob } from '@/services/workerDashboardMockData';
import { Button } from '@/components/common/Button';
import { 
  MapPin, 
  Clock, 
  Zap, 
  CheckCircle2, 
  X 
} from 'lucide-react';

interface IncomingJobCardProps {
  job: WorkerJob;
  onAccept: (jobId: string) => void;
  onDecline: (jobId: string) => void;
}

export const IncomingJobCard: React.FC<IncomingJobCardProps> = ({
  job,
  onAccept,
  onDecline,
}) => {
  const [isAccepting, setIsAccepting] = useState(false);
  const [isDeclining, setIsDeclining] = useState(false);

  const handleAccept = () => {
    setIsAccepting(true);
    setTimeout(() => {
      onAccept(job.id);
      setIsAccepting(false);
    }, 600);
  };

  const handleDecline = () => {
    setIsDeclining(true);
    setTimeout(() => {
      onDecline(job.id);
      setIsDeclining(false);
    }, 400);
  };

  return (
    <div className="rounded-3xl bg-gradient-to-br from-amber-500/10 via-white to-amber-50/40 border-2 border-amber-400 p-5 sm:p-6 shadow-md relative overflow-hidden animate-in zoom-in-95 duration-200 space-y-4">
      
      {/* Top Banner Ribbon */}
      <div className="flex items-center justify-between gap-2 border-b border-amber-200/80 pb-3">
        <div className="flex items-center space-x-2">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping" />
          <span className="text-xs font-black uppercase tracking-wider text-amber-950 flex items-center gap-1">
            <Zap className="w-4 h-4 text-amber-600 fill-amber-500" />
            <span>Incoming Job Request (Nearby Dispatch)</span>
          </span>
        </div>

        {job.isEmergency && (
          <span className="text-[10px] font-black uppercase tracking-wider text-red-700 bg-red-100 px-2.5 py-0.5 rounded-full border border-red-200 animate-pulse">
            🚨 Immediate Need
          </span>
        )}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        
        {/* Left: Service & Customer Info (8 cols) */}
        <div className="md:col-span-8 space-y-2">
          <div className="flex items-start space-x-3">
            <img
              src={job.customerPhoto}
              alt={job.customerName}
              className="w-12 h-12 rounded-2xl object-cover border border-slate-200 shrink-0"
            />
            <div className="space-y-0.5">
              <h3 className="text-base sm:text-lg font-black text-gov-navy leading-snug">
                {job.serviceTitle}
              </h3>
              <p className="text-xs text-gov-muted flex flex-wrap items-center gap-x-2">
                <span className="font-bold text-slate-800">Customer: {job.customerName}</span>
                <span>·</span>
                <span className="font-mono text-[11px]">{job.customerPhoneMasked}</span>
              </p>
            </div>
          </div>

          {/* Location & Travel Distance */}
          <div className="p-3 rounded-xl bg-white border border-amber-200/60 space-y-1 text-xs">
            <div className="flex flex-wrap items-center justify-between gap-2 text-slate-700 font-medium">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
                <span className="font-bold">{job.address}</span>
              </span>
              <span className="text-[11px] font-black text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                📍 {job.distanceKm} km away (Est. {job.estimatedTravelMins} mins)
              </span>
            </div>
            {job.notes && (
              <p className="text-[11px] text-gov-muted italic pt-0.5">
                Issue: "{job.notes}"
              </p>
            )}
          </div>
        </div>

        {/* Right: Guaranteed Payout & Schedule (4 cols) */}
        <div className="md:col-span-4 bg-white border border-amber-200 rounded-2xl p-4 text-center space-y-3 shadow-xs">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
              Guaranteed Wage Payout
            </span>
            <div className="flex items-baseline justify-center gap-1 mt-0.5">
              <span className="text-3xl font-black text-emerald-800">₹{job.payoutAmount}</span>
              <span className="text-[11px] text-gov-muted">/ visit</span>
            </div>
            <span className="text-[10px] text-emerald-700 font-bold block">
              ✓ 100% direct escrow release
            </span>
          </div>

          <div className="text-[11px] font-bold text-slate-700 flex items-center justify-center gap-1 bg-slate-50 py-1.5 rounded-lg">
            <Clock className="w-3.5 h-3.5 text-gov-green" />
            <span>{job.scheduledTime}</span>
          </div>
        </div>

      </div>

      {/* Action Buttons: Accept / Decline */}
      <div className="flex flex-col sm:flex-row gap-3 pt-2 border-t border-amber-200/80">
        <Button
          variant="primary"
          onClick={handleAccept}
          isLoading={isAccepting}
          className="flex-1 py-3 text-xs sm:text-sm font-black shadow-md bg-gov-green hover:bg-gov-greenDark text-white"
          leftIcon={<CheckCircle2 className="w-4 h-4" />}
        >
          Accept Shift Request
        </Button>

        <Button
          variant="outline"
          onClick={handleDecline}
          isLoading={isDeclining}
          className="py-3 text-xs font-bold text-slate-600 hover:text-red-700 hover:border-red-300"
          leftIcon={<X className="w-4 h-4" />}
        >
          Decline & Pass to Standby
        </Button>
      </div>

    </div>
  );
};
