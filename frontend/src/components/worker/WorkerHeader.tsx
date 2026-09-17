import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { MOCK_WORKER_PROFILE } from '@/services/workerDashboardMockData';
import { 
  ShieldCheck, 
  User, 
  LogOut, 
  Award, 
  Compass, 
  HeartHandshake, 
  Sparkles, 
  ChevronDown 
} from 'lucide-react';
import { NotificationBell } from '@/components/common/NotificationBell';

interface WorkerHeaderProps {
  isOnline: boolean;
  onToggleOnline: () => void;
}

export const WorkerHeader: React.FC<WorkerHeaderProps> = ({
  isOnline,
  onToggleOnline,
}) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-40 bg-gov-navy text-white shadow-md border-b border-blue-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
        
        {/* Brand & KARM ID */}
        <div className="flex items-center space-x-3">
          <Link to="/worker" className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-gov-green text-white font-black text-sm flex items-center justify-center shadow-xs">
              K
            </div>
            <div className="hidden sm:block">
              <span className="font-black text-sm tracking-tight block leading-tight">
                KARM SEVA
              </span>
              <span className="text-[10px] text-emerald-300 font-bold uppercase tracking-wider block">
                Seva Partner Portal
              </span>
            </div>
          </Link>

          {/* KARM ID Badge Chip */}
          <div className="flex items-center space-x-1.5 bg-white/10 border border-white/20 px-2.5 py-1 rounded-full text-xs font-bold" title="Verified KARM ID">
            <ShieldCheck className="w-3.5 h-3.5 text-gov-green" />
            <span className="text-[10px] text-emerald-300 font-bold">KARM ID:</span>
            <span className="font-mono text-[11px] text-emerald-200">
              {MOCK_WORKER_PROFILE.shramId}
            </span>
          </div>
        </div>

        {/* Live Availability Toggle & Actions */}
        <div className="flex items-center space-x-2.5 sm:space-x-4">
          
          {/* ONLINE / OFFLINE Switch Button */}
          <button
            type="button"
            onClick={onToggleOnline}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-full border text-xs font-black transition-all shadow-xs ${
              isOnline
                ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 hover:bg-emerald-500/30'
                : 'bg-red-500/20 border-red-400 text-red-300 hover:bg-red-500/30'
            }`}
          >
            <span className={`w-2.5 h-2.5 rounded-full ${isOnline ? 'bg-emerald-400 animate-pulse' : 'bg-red-400'}`} />
            <span className="uppercase tracking-wider">
              {isOnline ? 'Online (Dispatch Active)' : 'Offline (Paused)'}
            </span>
          </button>

          {/* Canonical Notification Center Dropdown */}
          <div className="bg-white/10 rounded-xl">
            <NotificationBell />
          </div>

          {/* Profile Menu Trigger */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex items-center space-x-2 p-1.5 rounded-xl bg-white/10 hover:bg-white/20 transition-colors"
            >
              <img
                src={MOCK_WORKER_PROFILE.profilePhoto}
                alt={MOCK_WORKER_PROFILE.name}
                className="w-7 h-7 rounded-lg object-cover border border-white/30"
              />
              <ChevronDown className="w-3.5 h-3.5 text-slate-300 hidden sm:block" />
            </button>

            {/* Dropdown Menu */}
            {isMenuOpen && (
              <div 
                className="absolute right-0 mt-2 w-56 bg-white rounded-2xl border border-slate-200 shadow-xl py-2 z-50 text-xs text-gov-text animate-in fade-in-50 duration-150"
                onClick={() => setIsMenuOpen(false)}
              >
                <div className="px-4 py-2 border-b border-slate-100">
                  <p className="font-extrabold text-gov-navy truncate">{MOCK_WORKER_PROFILE.name}</p>
                  <p className="text-[11px] text-gov-muted">{MOCK_WORKER_PROFILE.trade}</p>
                </div>

                <div className="py-1">
                  <Link to="/worker/profile" className="flex items-center space-x-2 px-4 py-2 hover:bg-slate-50 font-bold">
                    <User className="w-4 h-4 text-slate-400" />
                    <span>My Profile & KYC</span>
                  </Link>

                  <Link to="/worker/skills" className="flex items-center space-x-2 px-4 py-2 hover:bg-slate-50 font-bold">
                    <Award className="w-4 h-4 text-gov-green" />
                    <span>Digital KARM ID Passport</span>
                  </Link>

                  <Link to="/worker/availability" className="flex items-center space-x-2 px-4 py-2 hover:bg-slate-50 font-bold">
                    <Compass className="w-4 h-4 text-blue-600" />
                    <span>Radius & Work Availability</span>
                  </Link>

                  <Link to="/worker/leave" className="flex items-center space-x-2 px-4 py-2 hover:bg-slate-50 font-bold">
                    <HeartHandshake className="w-4 h-4 text-purple-600" />
                    <span>Apply for Leave & Standby</span>
                  </Link>

                  <Link to="/worker/onboard" className="flex items-center space-x-2 px-4 py-2 hover:bg-slate-50 font-bold text-amber-900 bg-amber-50/50">
                    <Sparkles className="w-4 h-4 text-amber-600" />
                    <span>Re-open Onboarding Wizard</span>
                  </Link>
                </div>

                <div className="pt-1 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full flex items-center space-x-2 px-4 py-2 hover:bg-red-50 text-red-600 font-bold transition-colors text-left"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>

      </div>
    </header>
  );
};
