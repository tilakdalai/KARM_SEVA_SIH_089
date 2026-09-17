import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MOCK_WORKER_JOBS_LIST, WorkerJob } from '@/services/workerDashboardMockData';
import { bookingService, BookingRecord } from '@/services/bookingService';
import { ActiveJobStateCard } from '@/components/worker/ActiveJobStateCard';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { 
  ArrowLeft, 
  ShieldCheck, 
  CheckSquare, 
  FileText, 
  AlertTriangle,
  Loader2
} from 'lucide-react';

function mapBookingToWorkerJob(booking: BookingRecord): WorkerJob {
  let workerStatus: WorkerJob['status'] = 'ACCEPTED';
  if (booking.status === 'ON_THE_WAY') workerStatus = 'ON_THE_WAY';
  else if (booking.status === 'ARRIVED') workerStatus = 'ARRIVED';
  else if (booking.status === 'STARTED') workerStatus = 'IN_PROGRESS';
  else if (booking.status === 'COMPLETED') workerStatus = 'COMPLETED';

  return {
    id: booking.id,
    bookingNumber: booking.booking_reference,
    customerName: booking.customer_name || 'Citizen Customer',
    customerPhoneMasked: booking.customer_phone ? `+91 ${booking.customer_phone.slice(0, 5)} XXXXX` : '+91 98765 XXXXX',
    customerPhoto: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    serviceTitle: booking.service_title,
    trade: booking.service_category || 'Tradesperson',
    category: booking.service_category || 'General',
    scheduledTime: `${booking.scheduled_date} (${booking.time_slot})`,
    address: `${booking.address_line}, ${booking.landmark ? booking.landmark + ', ' : ''}${booking.district} - ${booking.pincode}`,
    landmark: booking.landmark || undefined,
    payoutAmount: Math.round(booking.total_amount * 0.9),
    status: workerStatus,
    distanceKm: 2.1,
    estimatedTravelMins: 15,
    isEmergency: false,
    otpCode: booking.otp_code || '1234',
    tasksList: [
      'Safety site assessment & diagnostic check',
      'Execution adhering to standard cooperative procedure',
      'Post-service quality validation & customer demonstration',
      'Clean work area & request completion OTP verification',
    ],
    notes: booking.description || undefined,
  };
}

export const WorkerJobDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [job, setJob] = useState<WorkerJob | null>(null);
  const [loading, setLoading] = useState(true);
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);

  useEffect(() => {
    let isMounted = true;
    if (!id) return;

    setLoading(true);
    bookingService
      .getBookingDetail(id)
      .then((record) => {
        if (!isMounted) return;
        if (record) {
          setJob(mapBookingToWorkerJob(record));
        } else {
          // Check mock fallback
          const mockMatch = MOCK_WORKER_JOBS_LIST.find((j) => j.id === id);
          if (mockMatch) {
            setJob(mockMatch);
          } else {
            setJob(null);
          }
        }
      })
      .catch((err) => {
        console.warn('[WorkerJobDetailPage] Error fetching booking details:', err);
        const mockMatch = MOCK_WORKER_JOBS_LIST.find((j) => j.id === id);
        setJob(mockMatch || null);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [id]);

  const toggleTask = (task: string) => {
    if (completedTasks.includes(task)) {
      setCompletedTasks(completedTasks.filter((t) => t !== task));
    } else {
      setCompletedTasks([...completedTasks, task]);
    }
  };

  if (loading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center space-y-3">
        <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
        <p className="text-xs text-slate-500 font-bold">Loading Shift Details...</p>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="py-16 text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-red-50 text-red-500 flex items-center justify-center mx-auto">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-base font-extrabold text-slate-900">Shift Record Not Found</h2>
          <p className="text-xs text-slate-500 mt-1">
            The requested booking assignment could not be retrieved from the database.
          </p>
        </div>
        <Button onClick={() => navigate('/worker/jobs')} className="text-xs font-bold">
          Return to Jobs Feed
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-16">
      
      {/* Back Button & Reference */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <button
          type="button"
          onClick={() => navigate('/worker/jobs')}
          className="inline-flex items-center space-x-1.5 text-xs font-bold text-slate-600 hover:text-gov-navy transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Jobs Feed</span>
        </button>

        <div className="flex items-center space-x-2">
          <span className="text-xs text-gov-muted">Shift Reference:</span>
          <span className="font-mono font-bold text-xs bg-slate-100 text-gov-navy px-2 py-0.5 rounded border border-slate-200">
            {job.bookingNumber}
          </span>
        </div>
      </div>

      {/* Main Lifecycle Card Controller */}
      <ActiveJobStateCard
        job={job}
        onStatusChange={(st) => setJob((prev) => (prev ? { ...prev, status: st } : null))}
      />

      {/* 2-Column Grid: Tasks Checklist & Payout Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Task Inspection Checklist (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <Card header={<span className="font-extrabold text-sm text-gov-navy flex items-center gap-2"><CheckSquare className="w-4 h-4 text-gov-green" /> Standard Service Checklist</span>}>
            <div className="space-y-3 text-xs">
              <p className="text-gov-muted">
                Complete all required safety diagnostic steps for cooperative quality audit:
              </p>

              <div className="space-y-2">
                {job.tasksList.map((task, idx) => {
                  const isDone = completedTasks.includes(task);
                  return (
                    <div
                      key={idx}
                      onClick={() => toggleTask(task)}
                      className={`p-3 rounded-xl border flex items-center space-x-3 cursor-pointer transition-all ${
                        isDone
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-950 font-bold'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-white'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isDone}
                        onChange={() => {}}
                        className="rounded border-slate-300 text-gov-green focus:ring-gov-green"
                      />
                      <span>{task}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </Card>

          {/* Customer Special Instructions */}
          {job.notes && (
            <Card header={<span className="font-extrabold text-sm text-gov-navy flex items-center gap-2"><FileText className="w-4 h-4 text-blue-600" /> Customer Problem Notes</span>}>
              <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-950 space-y-1">
                <span className="font-bold block">Reported Symptoms:</span>
                <p className="italic leading-relaxed">"{job.notes}"</p>
              </div>
            </Card>
          )}
        </div>

        {/* Right: Payout Transparency & Safety Insurance (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <Card header={<span className="font-extrabold text-sm text-gov-navy flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-gov-green" /> Payout & Insurance Breakdown</span>}>
            <div className="space-y-3 text-xs">
              
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-gov-muted">Craftsman Base Wage:</span>
                <span className="font-bold text-gov-navy">₹{job.payoutAmount}</span>
              </div>

              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-gov-muted">Cooperative On-Time Incentive:</span>
                <span className="font-bold text-emerald-700">+ ₹25 (Bonus)</span>
              </div>

              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-gov-muted">Welfare Fund Contribution:</span>
                <span className="font-bold text-slate-500">₹0 (Govt Subsidized)</span>
              </div>

              <div className="flex justify-between pt-2 font-black text-base text-gov-navy">
                <span>Net Credited to Wallet:</span>
                <span className="text-emerald-800">₹{job.payoutAmount + 25}</span>
              </div>

              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-[11px] text-emerald-900 space-y-1 mt-2">
                <span className="font-bold block">✓ Accidental Work Insurance Active</span>
                <p className="leading-tight">
                  Covered under State Unorganized Workers Welfare Board Scheme during shift.
                </p>
              </div>

              <Button
                variant="outline"
                className="w-full text-xs font-bold py-2.5 mt-2"
                onClick={() => alert('Emergency cooperative escalation team alerted.')}
                leftIcon={<AlertTriangle className="w-4 h-4 text-red-500" />}
              >
                Emergency Dispatch Dispute Escalation
              </Button>
            </div>
          </Card>
        </div>

      </div>

    </div>
  );
};
