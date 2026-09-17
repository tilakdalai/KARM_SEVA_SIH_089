import React, { useState } from 'react';
import { MOCK_SCHEDULE_DAYS, MOCK_WORKER_JOBS_LIST } from '@/services/workerDashboardMockData';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';
import { 
  Calendar, 
  MapPin 
} from 'lucide-react';

export const WorkerSchedulePage: React.FC = () => {
  const [selectedDay, setSelectedDay] = useState('2 Sep');

  return (
    <div className="space-y-6 pb-16">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-black text-gov-navy tracking-tight flex items-center gap-2">
            <Calendar className="w-6 h-6 text-gov-green" />
            <span>Weekly Shift Schedule</span>
          </h1>
          <p className="text-xs sm:text-sm text-gov-muted">
            Manage your daily booked shifts, available slots, and planned rest days
          </p>
        </div>

        <Button
          size="sm"
          variant="outline"
          onClick={() => window.location.href = '/worker/leave'}
          className="text-xs font-bold"
        >
          Request Planned Leave
        </Button>
      </div>

      {/* Week Days Selector Bar */}
      <div className="grid grid-cols-7 gap-2">
        {MOCK_SCHEDULE_DAYS.map((d) => {
          const isSelected = selectedDay === d.date;
          return (
            <button
              key={d.date}
              type="button"
              onClick={() => setSelectedDay(d.date)}
              className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-between ${
                isSelected
                  ? 'bg-gov-navy text-white border-gov-navy shadow-md ring-2 ring-gov-navy/20'
                  : d.isToday
                  ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <span className={`text-[10px] font-bold uppercase ${isSelected ? 'text-emerald-300' : 'text-slate-400'}`}>
                {d.day}
              </span>
              <span className="text-sm sm:text-base font-black my-1">
                {d.date.split(' ')[0]}
              </span>
              <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                isSelected 
                  ? 'bg-white/20 text-white' 
                  : d.shiftsCount > 0 
                  ? 'bg-emerald-100 text-emerald-800' 
                  : 'bg-slate-100 text-slate-400'
              }`}>
                {d.shiftsCount > 0 ? `${d.shiftsCount} Shifts` : 'Off'}
              </span>
            </button>
          );
        })}
      </div>

      {/* Shifts Scheduled for Selected Day */}
      <div className="space-y-4">
        <h3 className="font-black text-base text-gov-navy flex items-center justify-between">
          <span>Booked Shifts for {selectedDay}</span>
          <span className="text-xs font-normal text-gov-muted">3 Confirmed Bookings</span>
        </h3>

        <div className="space-y-3">
          {MOCK_WORKER_JOBS_LIST.map((job) => (
            <Card key={job.id} className="p-4 border-slate-200 bg-white">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-bold uppercase text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                      {job.scheduledTime}
                    </span>
                    <Badge variant={job.status === 'COMPLETED' ? 'neutral' : 'success'} size="sm">
                      {job.status}
                    </Badge>
                  </div>

                  <h4 className="font-extrabold text-sm text-gov-navy">
                    {job.serviceTitle}
                  </h4>

                  <p className="text-xs text-gov-muted flex items-center gap-2">
                    <span className="font-bold text-slate-700">Customer: {job.customerName}</span>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      <span>{job.address}</span>
                    </span>
                  </p>
                </div>

                <div className="text-left sm:text-right shrink-0">
                  <span className="text-[10px] text-gov-muted uppercase block">Guaranteed Wage</span>
                  <span className="font-black text-base text-emerald-800">₹{job.payoutAmount}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

    </div>
  );
};
