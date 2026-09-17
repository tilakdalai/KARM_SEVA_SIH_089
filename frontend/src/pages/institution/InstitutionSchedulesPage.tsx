import React, { useState, useEffect } from 'react';
import {
  CalendarDays,
  Clock,
  Building,
  Users,
  CheckCircle2,
  Plus,
} from 'lucide-react';
import { institutionService, RecurringScheduleItem } from '../../services/institutionService';

export const InstitutionSchedulesPage: React.FC = () => {
  const [schedules, setSchedules] = useState<RecurringScheduleItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const data = await institutionService.getSchedules();
        setSchedules(data);
      } finally {
        setLoading(false);
      }
    };
    fetchSchedules();
  }, []);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-extrabold uppercase tracking-wider bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
              Shift Operations
            </span>
            <span className="text-xs text-slate-500 font-medium">Facility Rosters</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 mt-1">Schedules & Recurring Duty Rosters</h1>
          <p className="text-xs text-slate-500">
            Active shift distribution, recurring daily coverage, and lead supervisory personnel.
          </p>
        </div>

        <button
          onClick={() => alert('New shift schedule pattern creator modal...')}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition shadow-sm self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Shift Pattern</span>
        </button>
      </div>

      {/* Shifts Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900"></div>
        </div>
      ) : (
        <div className="space-y-4">
          {schedules.map((sch) => (
            <div
              key={sch.id}
              className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 space-y-4 hover:border-slate-300 transition"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-slate-100 pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded border border-indigo-200">
                      {sch.id}
                    </span>
                    <span className="text-[10px] font-extrabold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      ACTIVE SHIFT
                    </span>
                  </div>
                  <h2 className="text-base font-bold text-slate-900 mt-1.5 flex items-center gap-2">
                    <Building className="w-4 h-4 text-slate-500" />
                    {sch.facility_area}
                  </h2>
                  <div className="text-xs font-semibold text-indigo-700 mt-0.5">{sch.service_type}</div>
                </div>

                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-right sm:self-center">
                  <div className="text-[11px] text-slate-500 font-medium">Duty Strength</div>
                  <div className="text-base font-extrabold text-slate-900 flex items-center justify-end gap-1">
                    <Users className="w-4 h-4 text-indigo-600" />
                    {sch.personnel_count} Staff
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <div className="text-slate-500 text-[11px] font-medium flex items-center gap-1">
                    <CalendarDays className="w-3.5 h-3.5 text-slate-400" />
                    Recurring Frequency
                  </div>
                  <div className="font-bold text-slate-900 mt-1">{sch.recurring_pattern}</div>
                </div>

                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <div className="text-slate-500 text-[11px] font-medium flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    Shift Timings
                  </div>
                  <div className="font-bold text-slate-900 mt-1">{sch.shift_timings}</div>
                </div>

                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <div className="text-slate-500 text-[11px] font-medium flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-slate-400" />
                    Lead Supervisor / Officer
                  </div>
                  <div className="font-bold text-slate-900 mt-1">{sch.supervising_officer}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
