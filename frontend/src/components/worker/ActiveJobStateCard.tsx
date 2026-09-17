import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { WorkerJob } from '@/services/workerDashboardMockData';
import { bookingService, BookingStatus } from '@/services/bookingService';
import { trackingService } from '@/services/trackingService';
import { Button } from '@/components/common/Button';
import { 
  Navigation, 
  MapPin, 
  PhoneCall, 
  KeyRound, 
  CheckCircle2, 
  ChevronRight 
} from 'lucide-react';

interface ActiveJobCardProps {
  job: WorkerJob;
  onStatusChange?: (newStatus: WorkerJob['status']) => void;
}

const LIFECYCLE_STEPS: Array<{ key: WorkerJob['status']; label: string; actionText: string }> = [
  { key: 'ACCEPTED', label: '1. Accepted', actionText: 'Start Travel' },
  { key: 'ON_THE_WAY', label: '2. On The Way', actionText: 'Mark as Arrived' },
  { key: 'ARRIVED', label: '3. Arrived at Site', actionText: 'Enter Start OTP' },
  { key: 'IN_PROGRESS', label: '4. Service in Progress', actionText: 'Complete Shift' },
  { key: 'COMPLETED', label: '5. Completed & Settled', actionText: 'Shift Settled' },
];

export const ActiveJobStateCard: React.FC<ActiveJobCardProps> = ({
  job,
  onStatusChange,
}) => {
  const navigate = useNavigate();
  const [currentStatus, setCurrentStatus] = useState<WorkerJob['status']>(job.status);
  const [enteredOtp, setEnteredOtp] = useState('');
  const [otpError, setOtpError] = useState(false);
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);

  const getStepIndex = (st: WorkerJob['status']) => {
    switch (st) {
      case 'ACCEPTED': return 0;
      case 'ON_THE_WAY': return 1;
      case 'ARRIVED': return 2;
      case 'IN_PROGRESS': return 3;
      case 'COMPLETED': return 4;
      default: return 0;
    }
  };

  const currentStepIdx = getStepIndex(currentStatus);

  const handleAdvanceState = () => {
    if (currentStatus === 'ACCEPTED') {
      updateStatus('ON_THE_WAY');
    } else if (currentStatus === 'ON_THE_WAY') {
      updateStatus('ARRIVED');
    } else if (currentStatus === 'ARRIVED') {
      setIsOtpModalOpen(true);
    } else if (currentStatus === 'IN_PROGRESS') {
      updateStatus('COMPLETED');
    }
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (enteredOtp.trim() === '4821' || enteredOtp.trim().length === 4) {
      setIsOtpModalOpen(false);
      setOtpError(false);
      updateStatus('IN_PROGRESS', enteredOtp.trim());
    } else {
      setOtpError(true);
    }
  };

  const updateStatus = (st: WorkerJob['status'], otp?: string) => {
    setCurrentStatus(st);
    if (onStatusChange) onStatusChange(st);

    // Sync to backend database
    const backendStatus: BookingStatus = st === 'IN_PROGRESS' ? 'STARTED' : (st as BookingStatus);
    bookingService.updateStatus(job.id, backendStatus, otp).catch(() => {});

    // When starting travel, broadcast worker GPS coordinates
    if (st === 'ON_THE_WAY' && typeof navigator !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          trackingService
            .updateWorkerLocation(job.id, {
              latitude: pos.coords.latitude,
              longitude: pos.coords.longitude,
              heading: pos.coords.heading || undefined,
              speed: pos.coords.speed ? pos.coords.speed * 3.6 : undefined, // m/s to km/h
              accuracy: pos.coords.accuracy,
            })
            .catch(() => {});
        },
        () => {
          // Graceful fallback if permission denied or GPS unavailable
        },
        { enableHighAccuracy: true, timeout: 8000 }
      );
    }
  };

  return (
    <div className="rounded-3xl bg-white border-2 border-gov-green shadow-md p-5 sm:p-6 space-y-5 relative overflow-hidden">
      
      {/* Top Bar Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-100 pb-3">
        <div>
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-gov-green animate-pulse" />
            <span className="text-xs font-black uppercase tracking-wider text-emerald-900">
              Active Shift In Progress
            </span>
            <span className="font-mono text-[11px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
              {job.bookingNumber}
            </span>
          </div>
          <h3 className="text-lg font-black text-gov-navy mt-1">
            {job.serviceTitle}
          </h3>
        </div>

        <div className="text-left sm:text-right">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Payout Value</span>
          <span className="text-2xl font-black text-emerald-700">₹{job.payoutAmount}</span>
        </div>
      </div>

      {/* 5-Stage Visual Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between items-center text-[11px] font-bold text-slate-600">
          <span>Shift Stage: <strong className="text-gov-green">{LIFECYCLE_STEPS[currentStepIdx]?.label}</strong></span>
          <span>{currentStepIdx + 1} / 5</span>
        </div>

        <div className="grid grid-cols-5 gap-1.5">
          {LIFECYCLE_STEPS.map((s, idx) => {
            const isPassed = idx <= currentStepIdx;
            const isCurr = idx === currentStepIdx;
            return (
              <div
                key={s.key}
                className={`h-2 rounded-full transition-all ${
                  isCurr
                    ? 'bg-gov-green ring-2 ring-gov-green/30 animate-pulse'
                    : isPassed
                    ? 'bg-emerald-500'
                    : 'bg-slate-100'
                }`}
              />
            );
          })}
        </div>
      </div>

      {/* Customer & Address Details */}
      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div className="flex items-center space-x-3">
            <img
              src={job.customerPhoto}
              alt={job.customerName}
              className="w-10 h-10 rounded-xl object-cover border border-slate-200"
            />
            <div>
              <h4 className="font-extrabold text-sm text-gov-navy">{job.customerName}</h4>
              <p className="text-[11px] font-mono text-slate-500">{job.customerPhoneMasked}</p>
            </div>
          </div>

          <Button
            size="sm"
            variant="outline"
            onClick={() => alert(`Connecting masked cooperative bridge to ${job.customerName}`)}
            className="text-xs font-bold"
            leftIcon={<PhoneCall className="w-3.5 h-3.5 text-gov-green" />}
          >
            Call Customer
          </Button>
        </div>

        <div className="pt-2 border-t border-slate-200/60 flex items-start space-x-2 text-slate-700">
          <MapPin className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="font-bold block">{job.address}</span>
            {job.landmark && (
              <span className="text-[11px] text-gov-muted block">Landmark: {job.landmark}</span>
            )}
          </div>
        </div>
      </div>

      {/* Operational State Action Button */}
      <div className="flex flex-col sm:flex-row gap-3 pt-1">
        {currentStatus !== 'COMPLETED' ? (
          <Button
            variant="primary"
            size="lg"
            onClick={handleAdvanceState}
            className="flex-1 py-3 text-xs sm:text-sm font-black shadow-md"
            rightIcon={<ChevronRight className="w-4 h-4" />}
          >
            {currentStatus === 'ACCEPTED' && 'Start Travel to Location'}
            {currentStatus === 'ON_THE_WAY' && 'Mark as Arrived at Site'}
            {currentStatus === 'ARRIVED' && 'Verify Customer Start OTP (4821)'}
            {currentStatus === 'IN_PROGRESS' && 'Mark Job Completed & Release Wage'}
          </Button>
        ) : (
          <div className="flex-1 p-3.5 rounded-xl bg-emerald-100 border border-emerald-300 text-emerald-900 font-black text-center text-xs flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-gov-green" />
            <span>Shift Completed! ₹{job.payoutAmount} credited to daily settlement.</span>
          </div>
        )}

        <Button
          variant="outline"
          onClick={() => navigate(`/worker/jobs/${job.id}`)}
          className="py-3 text-xs font-bold"
          leftIcon={<Navigation className="w-4 h-4 text-blue-600" />}
        >
          View Job Sheet
        </Button>
      </div>

      {/* Start OTP Modal */}
      {isOtpModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl border border-gov-border shadow-2xl max-w-sm w-full p-6 space-y-4 text-center">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-gov-green flex items-center justify-center mx-auto">
              <KeyRound className="w-6 h-6" />
            </div>

            <div>
              <h3 className="font-black text-base text-gov-navy">Enter Citizen Start-Job OTP</h3>
              <p className="text-xs text-gov-muted mt-1">
                Ask <strong>{job.customerName}</strong> for the 4-digit start OTP shown on their KARM SEVA app.
              </p>
            </div>

            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div>
                <input
                  type="text"
                  maxLength={4}
                  value={enteredOtp}
                  onChange={(e) => {
                    setEnteredOtp(e.target.value);
                    setOtpError(false);
                  }}
                  placeholder="e.g. 4821"
                  className="w-40 mx-auto text-center font-mono text-2xl tracking-widest font-black border-2 border-slate-300 rounded-xl py-2 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-gov-green"
                  autoFocus
                  required
                />
                {otpError && (
                  <p className="text-[11px] text-red-600 font-bold mt-1">
                    Incorrect OTP. Please enter 4821 to proceed.
                  </p>
                )}
                <span className="text-[10px] text-slate-400 block mt-1">
                  (Demo OTP code is: <strong>4821</strong>)
                </span>
              </div>

              <div className="flex gap-2">
                <Button type="submit" variant="primary" className="flex-1 py-2.5 text-xs font-bold">
                  Verify & Start Shift
                </Button>
                <Button type="button" variant="outline" onClick={() => setIsOtpModalOpen(false)} className="text-xs">
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
