import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BookingMock } from '@/services/customerMockData';
import { 
  Clock, 
  MapPin, 
  ChevronRight, 
  ShieldCheck, 
  KeyRound 
} from 'lucide-react';
import { Button } from '@/components/common/Button';

interface ActiveJobBannerProps {
  booking: BookingMock;
}

export const ActiveJobBanner: React.FC<ActiveJobBannerProps> = ({ booking }) => {
  const navigate = useNavigate();

  return (
    <div className="rounded-2xl bg-gradient-to-r from-gov-navy via-slate-900 to-blue-950 text-white p-4 sm:p-5 shadow-lg border border-blue-900 relative overflow-hidden">
      {/* Background Pulse Ambient Glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gov-green/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 space-y-3.5">
        
        {/* Top Tag & Status */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
          <div className="flex items-center space-x-2">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              Active Job In Progress
            </span>
            <span className="text-white/40">·</span>
            <span className="text-[11px] font-mono text-slate-300">
              #{booking.bookingNumber}
            </span>
          </div>

          {/* OTP Code Badge */}
          <div className="flex items-center gap-1.5 bg-white/10 border border-white/20 px-2.5 py-1 rounded-lg">
            <KeyRound className="w-3.5 h-3.5 text-gov-saffron" />
            <span className="text-[11px] text-slate-300">Start OTP:</span>
            <span className="font-mono font-black text-xs text-white tracking-wider">
              {booking.otpCode}
            </span>
          </div>
        </div>

        {/* Center Content: Worker & ETA */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-xl overflow-hidden border-2 border-white/30 shrink-0">
              <img 
                src={booking.workerPhoto} 
                alt={booking.workerName} 
                className="w-full h-full object-cover" 
              />
            </div>
            <div>
              <h4 className="font-extrabold text-sm sm:text-base text-white flex items-center gap-1.5">
                <span>{booking.workerName}</span>
                <span className="text-[10px] font-normal text-slate-300 bg-white/10 px-1.5 py-0.5 rounded">
                  {booking.trade}
                </span>
              </h4>
              <p className="text-xs text-slate-300 mt-0.5 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-emerald-400" />
                <span>{booking.serviceTitle}</span>
              </p>
            </div>
          </div>

          {/* ETA Pill & Action */}
          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-between sm:justify-end">
            <div className="text-left sm:text-right">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">
                Estimated Arrival
              </span>
              <div className="flex items-center gap-1 text-emerald-400 font-extrabold text-sm sm:text-base">
                <Clock className="w-4 h-4 animate-pulse" />
                <span>{booking.etaMinutes} mins ({booking.distanceKm} km)</span>
              </div>
            </div>

            <Button
              size="sm"
              variant="primary"
              onClick={() => navigate(`/customer/bookings/${booking.id}`)}
              className="text-xs font-bold py-2 px-3.5 bg-gov-green hover:bg-gov-greenDark text-white shadow-md"
              rightIcon={<ChevronRight className="w-3.5 h-3.5" />}
            >
              Track Live
            </Button>
          </div>
        </div>

        {/* Bottom Replacement Guard Guarantee */}
        <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[10px] text-slate-400">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-gov-green" />
            <span>Cooperative Replacement Guard Active (Standby worker ready if delayed)</span>
          </span>
          <span className="font-mono text-slate-300">
            {booking.workerPhoneMasked}
          </span>
        </div>

      </div>
    </div>
  );
};
