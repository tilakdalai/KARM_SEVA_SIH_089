import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  MOCK_WORKER_PROFILE, 
  MOCK_EARNINGS, 
  MOCK_ACTIVE_JOB, 
  WorkerJob 
} from '@/services/workerDashboardMockData';
import { bookingService, BookingRecord } from '@/services/bookingService';
import { analyticsService, WorkerAnalyticsResponse } from '@/services/analyticsService';
import { IncomingJobCard } from '@/components/worker/IncomingJobCard';
import { ActiveJobStateCard } from '@/components/worker/ActiveJobStateCard';
import { EarningsStatCard } from '@/components/worker/EarningsStatCard';
import { ProfileCompletionBar } from '@/components/worker/ProfileCompletionBar';
import { useAuth } from '@/hooks/useAuth';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { 
  ShieldCheck, 
  Wallet, 
  Briefcase, 
  Star, 
  Award, 
  Calendar, 
  HeartHandshake, 
  ChevronRight 
} from 'lucide-react';

export const WorkerDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [isOnline, setIsOnline] = useState(MOCK_WORKER_PROFILE.isOnline);
  const [incomingJob, setIncomingJob] = useState<WorkerJob | null>(null);
  const [activeJob, setActiveJob] = useState<WorkerJob>(MOCK_ACTIVE_JOB);
  const [analytics, setAnalytics] = useState<WorkerAnalyticsResponse | null>(null);

  useEffect(() => {
    let isMounted = true;
    bookingService.getBookings().then((bookings: BookingRecord[]) => {
      if (!isMounted || !bookings?.length) return;
      const requested = bookings.find((b) => b.status === 'REQUESTED');
      if (requested) {
        setIncomingJob({
          id: requested.id,
          bookingNumber: requested.booking_reference,
          serviceTitle: requested.service_title,
          customerName: requested.customer_name || 'Citizen Customer',
          customerPhoneMasked: '+91 98765 XXXXX',
          customerPhoto: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
          trade: requested.service_category || 'Electrician',
          category: requested.service_category || 'Electrical',
          address: requested.address_line,
          distanceKm: 1.8,
          estimatedTravelMins: 15,
          payoutAmount: requested.total_amount * 0.85,
          scheduledTime: requested.time_slot,
          isEmergency: false,
          status: 'INCOMING',
          tasksList: ['Initial diagnostic check', 'Equipment setup', 'Safety isolation'],
        });
      }
      const active = bookings.find((b) => ['ACCEPTED', 'ON_THE_WAY', 'ARRIVED', 'STARTED'].includes(b.status));
      if (active) {
        setActiveJob({
          id: active.id,
          bookingNumber: active.booking_reference,
          serviceTitle: active.service_title,
          customerName: active.customer_name || 'Ananya Patnaik',
          customerPhoneMasked: '+91 98765 XXXXX',
          customerPhoto: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
          trade: active.service_category || 'Electrician',
          category: active.service_category || 'Electrical',
          address: active.address_line,
          distanceKm: 1.8,
          estimatedTravelMins: 15,
          payoutAmount: active.total_amount * 0.85,
          scheduledTime: active.time_slot,
          isEmergency: false,
          status: (active.status === 'STARTED' ? 'IN_PROGRESS' : active.status) as any,
          otpCode: active.otp_code,
          tasksList: ['Initial diagnostic check', 'Equipment setup', 'Safety isolation'],
        });
      }
    });

    analyticsService.getWorkerAnalytics({ time_range: '30d' }).then((data) => {
      if (isMounted && data) setAnalytics(data);
    }).catch(() => {});

    return () => {
      isMounted = false;
    };
  }, []);

  const handleAcceptIncoming = async (jobId: string) => {
    try {
      await bookingService.updateStatus(jobId, 'ACCEPTED');
      if (incomingJob) {
        setActiveJob({ ...incomingJob, status: 'ACCEPTED' });
        setIncomingJob(null);
      }
    } catch (err: any) {
      console.error('[WorkerDashboard] Failed to accept job:', err);
      alert('Could not accept job. Please try again.');
    }
  };

  const handleDeclineIncoming = async (jobId: string) => {
    try {
      await bookingService.updateStatus(jobId, 'DECLINED', undefined, 'Worker unavailable');
      setIncomingJob(null);
    } catch (err: any) {
      console.error('[WorkerDashboard] Failed to decline job:', err);
    }
  };

  return (
    <div className="space-y-6 pb-16">
      
      {/* Worker Trust Banner & Status Card */}
      <div className="rounded-3xl bg-gradient-to-r from-gov-navy via-blue-950 to-slate-900 text-white p-6 sm:p-8 shadow-md relative overflow-hidden">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          
          <div className="flex items-center space-x-4">
            <div className="relative shrink-0">
              <img
                src={MOCK_WORKER_PROFILE.profilePhoto}
                alt={MOCK_WORKER_PROFILE.name}
                className="w-16 h-16 rounded-2xl object-cover border-2 border-gov-green shadow-sm"
              />
              <div className="absolute -bottom-1 -right-1 bg-gov-green text-white p-1 rounded-full border-2 border-gov-navy shadow-xs">
                <ShieldCheck className="w-3.5 h-3.5" />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-mono font-bold text-emerald-300 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/40">
                  {user?.shramId || MOCK_WORKER_PROFILE.shramId}
                </span>
                <span className="text-[10px] font-black uppercase text-purple-200 bg-purple-900/60 px-2 py-0.5 rounded border border-purple-400/30">
                  {user?.trade ? 'Verified Member' : MOCK_WORKER_PROFILE.tradeGroup}
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight">
                {user?.name || MOCK_WORKER_PROFILE.name}
              </h1>
              <p className="text-xs text-slate-300">
                {user?.trade || MOCK_WORKER_PROFILE.trade} · <strong>{user?.cooperativeName || MOCK_WORKER_PROFILE.cooperativeName}</strong>
              </p>
            </div>
          </div>

          {/* Live Availability Toggle Switch */}
          <div className="flex flex-col sm:items-end gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setIsOnline(!isOnline)}
              className={`flex items-center justify-center space-x-2 px-4 py-2 rounded-2xl border text-xs font-black transition-all shadow-xs w-full sm:w-auto ${
                isOnline
                  ? 'bg-gov-green hover:bg-gov-greenDark text-white border-emerald-400'
                  : 'bg-red-950/80 hover:bg-red-900 text-red-200 border-red-500/40'
              }`}
            >
              <span className={`w-2.5 h-2.5 rounded-full ${isOnline ? 'bg-white animate-pulse' : 'bg-red-400'}`} />
              <span className="uppercase tracking-wider">
                {isOnline ? 'LIVE: ONLINE & DISPATCH READY' : 'PAUSED: OFFLINE'}
              </span>
            </button>
            <span className="text-[10px] text-slate-300">
              Operates within {MOCK_WORKER_PROFILE.preferredRadiusKm} km radius
            </span>
          </div>

        </div>
      </div>

      {/* Profile Completion Bar */}
      <ProfileCompletionBar percentage={MOCK_WORKER_PROFILE.profileCompletionPercentage} />

      {/* 4 Quick Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <EarningsStatCard
          label="Recent Earnings"
          amount={analytics ? analytics.net_earnings : MOCK_EARNINGS.todayEarnings}
          subtext={analytics ? `${analytics.completed_jobs} shifts completed` : `${MOCK_EARNINGS.todayJobsCount} shifts completed today`}
          variant="green"
          icon={<Wallet className="w-4 h-4 text-emerald-600" />}
        />

        <EarningsStatCard
          label="Net Disbursal"
          amount={analytics ? analytics.gross_earnings : MOCK_EARNINGS.thisWeekEarnings}
          subtext="85% statutory direct payout"
          variant="blue"
          icon={<Briefcase className="w-4 h-4 text-blue-600" />}
        />

        <EarningsStatCard
          label="Citizen Rating"
          amount={`${analytics ? analytics.average_rating.toFixed(1) : MOCK_WORKER_PROFILE.rating}★`}
          subtext={`${analytics ? analytics.completed_jobs : MOCK_WORKER_PROFILE.totalJobs} total jobs · 98% on-time`}
          variant="amber"
          icon={<Star className="w-4 h-4 text-amber-500 fill-amber-400" />}
        />

        <EarningsStatCard
          label="Craftsman Badge"
          amount="Master"
          subtext="Cooperative Verified Class A"
          variant="purple"
          icon={<Award className="w-4 h-4 text-purple-600" />}
        />
      </div>

      {/* 1. Incoming Job Request (if any) */}
      {incomingJob && (
        <section className="space-y-2">
          <IncomingJobCard
            job={incomingJob}
            onAccept={handleAcceptIncoming}
            onDecline={handleDeclineIncoming}
          />
        </section>
      )}

      {/* 2. Active Job Operational Lifecycle Widget */}
      <section className="space-y-2">
        <ActiveJobStateCard
          job={activeJob}
          onStatusChange={(st) => setActiveJob((prev) => ({ ...prev, status: st }))}
        />
      </section>

      {/* Secondary Cooperative & Welfare Shortcuts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Weekly Schedule Shortcut */}
        <Card header={<span className="font-extrabold text-sm text-gov-navy flex items-center gap-2"><Calendar className="w-4 h-4 text-blue-600" /> Weekly Shift Schedule</span>}>
          <div className="space-y-3 text-xs">
            <p className="text-gov-muted">
              You have <strong>3 upcoming confirmed bookings</strong> scheduled this week across Saheed Nagar and Nayapalli.
            </p>
            <Button
              size="sm"
              variant="outline"
              onClick={() => navigate('/worker/schedule')}
              className="w-full text-xs font-bold"
              rightIcon={<ChevronRight className="w-3.5 h-3.5" />}
            >
              Open Schedule Planner
            </Button>
          </div>
        </Card>

        {/* Cooperative Leave & Standby Replacement */}
        <Card header={<span className="font-extrabold text-sm text-gov-navy flex items-center gap-2"><HeartHandshake className="w-4 h-4 text-purple-600" /> Leave & Replacement Guard</span>}>
          <div className="space-y-3 text-xs">
            <p className="text-gov-muted">
              Need personal or medical time off? Apply for cooperative-covered standby without losing your standing or rating.
            </p>
            <Button
              size="sm"
              variant="outline"
              onClick={() => navigate('/worker/leave')}
              className="w-full text-xs font-bold"
              rightIcon={<ChevronRight className="w-3.5 h-3.5" />}
            >
              Request Scheduled Leave
            </Button>
          </div>
        </Card>

        {/* Digital Skill Passport */}
        <Card header={<span className="font-extrabold text-sm text-gov-navy flex items-center gap-2"><Award className="w-4 h-4 text-gov-green" /> Digital Skill Passport</span>}>
          <div className="space-y-3 text-xs">
            <p className="text-gov-muted">
              ITI Diploma & Workman Permit verified. Explore Skill India upskilling modules for higher commercial hourly rates.
            </p>
            <Button
              size="sm"
              variant="outline"
              onClick={() => navigate('/worker/skills')}
              className="w-full text-xs font-bold"
              rightIcon={<ChevronRight className="w-3.5 h-3.5" />}
            >
              View Skill Passport
            </Button>
          </div>
        </Card>

      </div>

    </div>
  );
};
