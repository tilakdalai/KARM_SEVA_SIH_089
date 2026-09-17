import React, { useState } from 'react';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { 
  HeartHandshake, 
  ShieldCheck, 
  CheckCircle2 
} from 'lucide-react';

export const WorkerLeavePage: React.FC = () => {
  const [leaveType, setLeaveType] = useState<'PLANNED' | 'EMERGENCY_MEDICAL'>('PLANNED');
  const [startDate, setStartDate] = useState('2024-09-08');
  const [endDate, setEndDate] = useState('2024-09-10');
  const [reason, setReason] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 4000);
  };

  return (
    <div className="space-y-6 pb-16 max-w-4xl mx-auto">
      
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-black text-gov-navy tracking-tight flex items-center gap-2">
          <HeartHandshake className="w-6 h-6 text-purple-600" />
          <span>Cooperative Leave & Standby Protection</span>
        </h1>
        <p className="text-xs sm:text-sm text-gov-muted">
          Apply for planned or emergency time off without losing customer bookings or your rating standing
        </p>
      </div>

      {/* Replacement Guard Assurance Banner */}
      <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200 text-xs text-purple-950 space-y-1">
        <div className="flex items-center gap-2 font-bold">
          <ShieldCheck className="w-4 h-4 text-purple-700" />
          <span>Cooperative Replacement Continuity Policy</span>
        </div>
        <p className="text-[11px] text-purple-800 leading-relaxed">
          When you request scheduled leave, the Khurda Labour Cooperative Union automatically assigns an accredited standby craftsman to your existing bookings. You retain 100% of your performance score and zero cancellation penalties.
        </p>
      </div>

      {isSubmitted && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-900 flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-gov-green" />
          <span>Leave application registered. Standby worker assigned for 8 Sep to 10 Sep.</span>
        </div>
      )}

      {/* Leave Application Form */}
      <Card header={<span className="font-extrabold text-sm text-gov-navy">Submit Leave Request</span>}>
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          {/* Leave Type Toggle */}
          <div>
            <label className="block font-bold text-slate-700 mb-1.5">
              Leave Category *
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setLeaveType('PLANNED')}
                className={`p-3 rounded-xl font-bold border text-left transition-all ${
                  leaveType === 'PLANNED'
                    ? 'border-gov-green bg-emerald-50 text-emerald-900 shadow-xs ring-1 ring-gov-green'
                    : 'border-slate-200 bg-slate-50 text-slate-700'
                }`}
              >
                📅 Advance Planned Leave (Family / Personal)
              </button>

              <button
                type="button"
                onClick={() => setLeaveType('EMERGENCY_MEDICAL')}
                className={`p-3 rounded-xl font-bold border text-left transition-all ${
                  leaveType === 'EMERGENCY_MEDICAL'
                    ? 'border-purple-600 bg-purple-50 text-purple-900 shadow-xs ring-1 ring-purple-600'
                    : 'border-slate-200 bg-slate-50 text-slate-700'
                }`}
              >
                🏥 Emergency Medical Leave (Instant Standby)
              </button>
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Start Date *
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full font-medium border border-slate-200 rounded-xl px-3 py-2.5 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-gov-green"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                End Date (Inclusive) *
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full font-medium border border-slate-200 rounded-xl px-3 py-2.5 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-gov-green"
                required
              />
            </div>
          </div>

          {/* Reason */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Reason for Leave (Optional)
            </label>
            <textarea
              rows={2}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Attending sister's wedding in Cuttack."
              className="w-full font-medium border border-slate-200 rounded-xl p-3 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-gov-green"
            />
          </div>

          <Button type="submit" variant="primary" className="py-2.5 px-6 text-xs font-bold shadow-md">
            Submit Leave Request & Confirm Standby
          </Button>
        </form>
      </Card>

      {/* Previous Leave History */}
      <Card header={<span className="font-extrabold text-sm text-gov-navy">Cooperative Leave History</span>}>
        <div className="space-y-2 text-xs">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="font-bold text-gov-navy">Planned Festival Leave</span>
              <p className="text-[11px] text-gov-muted">14 Aug 2024 · 1 Day (Standby: Manoj Panda)</p>
            </div>
            <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
              Approved & Completed
            </span>
          </div>
        </div>
      </Card>

    </div>
  );
};
