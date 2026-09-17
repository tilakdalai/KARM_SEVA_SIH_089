import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MOCK_WORKER_JOBS_LIST, WorkerJob } from '@/services/workerDashboardMockData';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';
import { 
  Briefcase, 
  MapPin, 
  Clock, 
  ChevronRight, 
  KeyRound 
} from 'lucide-react';

export const WorkerJobsPage: React.FC = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<'ALL' | 'ACTIVE' | 'SCHEDULED' | 'COMPLETED'>('ALL');

  const filteredJobs = MOCK_WORKER_JOBS_LIST.filter((j) => {
    if (filter === 'ALL') return true;
    if (filter === 'ACTIVE') return ['ACCEPTED', 'ON_THE_WAY', 'ARRIVED', 'IN_PROGRESS'].includes(j.status);
    if (filter === 'SCHEDULED') return j.status === 'ACCEPTED';
    if (filter === 'COMPLETED') return j.status === 'COMPLETED';
    return true;
  });

  const getStatusBadge = (st: WorkerJob['status']) => {
    switch (st) {
      case 'ON_THE_WAY':
      case 'ARRIVED':
      case 'IN_PROGRESS':
        return <Badge variant="success" size="sm">ACTIVE SHIFT</Badge>;
      case 'ACCEPTED':
        return <Badge variant="info" size="sm">SCHEDULED</Badge>;
      case 'COMPLETED':
        return <Badge variant="neutral" size="sm">COMPLETED</Badge>;
      default:
        return <Badge variant="neutral" size="sm">{st}</Badge>;
    }
  };

  return (
    <div className="space-y-6 pb-16">
      
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-black text-gov-navy tracking-tight flex items-center gap-2">
          <Briefcase className="w-6 h-6 text-gov-green" />
          <span>My Shifts & Dispatch Jobs</span>
        </h1>
        <p className="text-xs sm:text-sm text-gov-muted">
          Manage your ongoing customer repair dispatches, upcoming appointments & shift history
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs">
        {[
          { id: 'ALL', label: 'All Jobs' },
          { id: 'ACTIVE', label: 'Active Shift (1)' },
          { id: 'SCHEDULED', label: 'Upcoming Scheduled' },
          { id: 'COMPLETED', label: 'Completed History' },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setFilter(tab.id as any)}
            className={`px-4 py-2 rounded-xl font-bold whitespace-nowrap transition-all ${
              filter === tab.id
                ? 'bg-gov-navy text-white shadow-xs'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Jobs Feed List */}
      <div className="space-y-4">
        {filteredJobs.map((job) => (
          <Card
            key={job.id}
            onClick={() => navigate(`/worker/jobs/${job.id}`)}
            className="p-5 border-slate-200 hover:border-gov-green hover:shadow-md transition-all cursor-pointer bg-white"
          >
            <div className="flex flex-col lg:flex-row justify-between gap-4 items-start lg:items-center">
              
              {/* Left: Customer & Service Info */}
              <div className="flex items-start space-x-3.5 min-w-0">
                <img
                  src={job.customerPhoto}
                  alt={job.customerName}
                  className="w-14 h-14 rounded-2xl object-cover border border-slate-200 shrink-0"
                />
                <div className="space-y-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-black text-base text-gov-navy truncate">
                      {job.serviceTitle}
                    </h3>
                    {getStatusBadge(job.status)}
                    {job.isEmergency && (
                      <span className="text-[10px] font-black text-red-700 bg-red-50 px-2 py-0.5 rounded border border-red-200">
                        SOS Urgent
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-gov-muted flex flex-wrap items-center gap-x-2">
                    <span className="font-bold text-slate-800">Customer: {job.customerName}</span>
                    <span>·</span>
                    <span className="font-mono text-[11px]">{job.customerPhoneMasked}</span>
                  </p>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 pt-0.5">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-gov-green" />
                      <span>{job.scheduledTime}</span>
                    </span>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{job.distanceKm} km away ({job.estimatedTravelMins} mins)</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Right: OTP, Payout & Action */}
              <div className="w-full lg:w-auto pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-100 flex flex-row lg:flex-col justify-between items-center lg:items-end gap-3 shrink-0">
                
                {job.otpCode && job.status !== 'COMPLETED' && (
                  <div className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-lg">
                    <KeyRound className="w-3.5 h-3.5 text-gov-green" />
                    <span className="text-[11px] text-emerald-800 font-bold">Start OTP:</span>
                    <span className="font-mono font-black text-xs text-emerald-900">{job.otpCode}</span>
                  </div>
                )}

                <div className="text-left lg:text-right">
                  <span className="text-[10px] text-gov-muted uppercase block">Guaranteed Wage</span>
                  <span className="font-black text-xl text-emerald-800">₹{job.payoutAmount}</span>
                </div>

                <Button
                  size="sm"
                  variant="primary"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/worker/jobs/${job.id}`);
                  }}
                  className="text-xs font-bold shadow-xs"
                  rightIcon={<ChevronRight className="w-3.5 h-3.5" />}
                >
                  Manage Shift
                </Button>

              </div>

            </div>
          </Card>
        ))}
      </div>

    </div>
  );
};
