import React, { useState, useEffect } from 'react';
import {
  recurringService,
  RecurringScheduleRecord,
  CalendarEventRecord,
} from '@/services/recurringService';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import {
  Calendar as CalendarIcon,
  MapPin,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  User,
} from 'lucide-react';

export const WorkerScheduleCalendarPage: React.FC = () => {
  const [schedules, setSchedules] = useState<RecurringScheduleRecord[]>([]);
  const [calendarEvents, setCalendarEvents] = useState<CalendarEventRecord[]>([]);
  const [currentMonth, setCurrentMonth] = useState('2026-09');
  const [selectedEvent, setSelectedEvent] = useState<CalendarEventRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [schedData, eventsData] = await Promise.all([
        recurringService.getRecurringSchedules(),
        recurringService.getCalendarEvents(currentMonth),
      ]);
      setSchedules(schedData);
      setCalendarEvents(eventsData);
      if (eventsData.length > 0) {
        setSelectedEvent(eventsData[0]);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentMonth]);

  const pendingProposals = schedules.filter((s) => s.status === 'PENDING_WORKER_ACCEPTANCE');

  const handleAccept = async (scheduleId: string) => {
    setActionLoading(true);
    try {
      await recurringService.acceptProposal(scheduleId);
      await fetchData();
    } finally {
      setActionLoading(false);
    }
  };

  const handleDecline = async (scheduleId: string) => {
    const reason = prompt('Please specify reason for declining recurring proposal:');
    if (!reason) return;
    setActionLoading(true);
    try {
      await recurringService.declineProposal(scheduleId, reason);
      await fetchData();
    } finally {
      setActionLoading(false);
    }
  };

  // 30-day matrix
  const daysInMonth = Array.from({ length: 30 }, (_, i) => {
    const dayNum = i + 1;
    const dateStr = `2026-09-${dayNum < 10 ? '0' + dayNum : dayNum}`;
    const dayEvents = calendarEvents.filter((e) => e.date === dateStr);
    return { dayNum, dateStr, dayEvents };
  });

  return (
    <div className="space-y-6 pb-16 font-sans">
      {/* Top Banner */}
      <div className="rounded-3xl bg-gov-navy text-white p-6 sm:p-8 shadow-md space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold text-emerald-300 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/40">
              KS-OD-2024-8841
            </span>
            <span className="text-[10px] font-black uppercase text-purple-200 bg-purple-900/60 px-2 py-0.5 rounded">
              Artisan Shift Roster
            </span>
          </div>
          <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
            <ShieldCheck className="w-4 h-4" /> 100% Guaranteed Escrow Settlements
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
          Workforce Shift Schedule & Recurring Proposals
        </h1>
        <p className="text-xs sm:text-sm text-slate-300">
          Review consensual recurring shift requests, manage your standing week slots, and view daily service routes
        </p>
      </div>

      {/* Pending Proposals Desk */}
      {pendingProposals.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-amber-500 animate-bounce" />
            <h2 className="font-black text-sm text-gov-navy uppercase tracking-wider">
              Pending Recurring Shift Proposals ({pendingProposals.length})
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pendingProposals.map((prop) => (
              <Card
                key={prop.id}
                className="p-5 border-amber-300 bg-amber-50/40 shadow-sm space-y-4"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-mono text-[10px] font-bold text-amber-900 bg-amber-200/80 px-2 py-0.5 rounded">
                      {prop.schedule_reference}
                    </span>
                    <h3 className="font-black text-sm text-gov-navy mt-1">
                      {prop.service_title}
                    </h3>
                    <p className="text-xs text-slate-600 flex items-center gap-1.5 mt-0.5">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      <span>Citizen: <strong>{prop.customer_name}</strong></span>
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-slate-500 uppercase block">Total Payout</span>
                    <span className="font-black text-base text-gov-navy">₹{prop.total_projected_amount}</span>
                    <span className="text-[10px] text-emerald-700 block font-bold">
                      ₹{prop.rate_per_instance} × {prop.total_occurrences} shifts
                    </span>
                  </div>
                </div>

                {/* Custom Slot list if custom */}
                {prop.custom_slots && prop.custom_slots.length > 0 && (
                  <div className="p-2.5 bg-white rounded-lg border border-amber-200 text-xs space-y-1">
                    <span className="font-bold text-[10px] uppercase text-slate-500">Requested Slots:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {prop.custom_slots.map((s, idx) => (
                        <span key={idx} className="bg-amber-100/70 text-amber-950 font-bold px-2 py-0.5 rounded text-[11px]">
                          {s.day_of_week}: {s.start_time}–{s.end_time}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="text-xs text-slate-500 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{prop.address_line}, {prop.district}</span>
                </div>

                <div className="flex items-center gap-2 pt-1 border-t border-amber-200">
                  <Button
                    size="sm"
                    variant="primary"
                    disabled={actionLoading}
                    onClick={() => handleAccept(prop.id)}
                    className="flex-1 text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white"
                    leftIcon={<CheckCircle2 className="w-3.5 h-3.5" />}
                  >
                    Accept Proposal
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={actionLoading}
                    onClick={() => handleDecline(prop.id)}
                    className="text-xs font-bold text-rose-700 border-rose-200 hover:bg-rose-50"
                    leftIcon={<XCircle className="w-3.5 h-3.5" />}
                  >
                    Decline
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Visual Shift Calendar */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gov-navy"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Calendar Grid (8 cols) */}
          <div className="lg:col-span-8 space-y-4">
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-base text-gov-navy">September 2026 Shift Roster</h3>
                  <span className="text-xs bg-emerald-50 text-emerald-800 font-bold px-2 py-0.5 rounded border border-emerald-200">
                    {calendarEvents.length} Active Shifts
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setCurrentMonth('2026-08')}
                    className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentMonth('2026-10')}
                    className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Day headers */}
              <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-extrabold text-slate-400 uppercase py-1 border-b">
                <span>Mon</span>
                <span>Tue</span>
                <span>Wed</span>
                <span>Thu</span>
                <span>Fri</span>
                <span>Sat</span>
                <span>Sun</span>
              </div>

              {/* Days Matrix */}
              <div className="grid grid-cols-7 gap-1.5">
                {daysInMonth.map((day) => {
                  const hasEvents = day.dayEvents.length > 0;
                  const isSelected = selectedEvent && selectedEvent.date === day.dateStr;

                  return (
                    <div
                      key={day.dayNum}
                      onClick={() => {
                        if (hasEvents) setSelectedEvent(day.dayEvents[0]);
                      }}
                      className={`min-h-[72px] p-1.5 rounded-xl border transition flex flex-col justify-between ${
                        hasEvents
                          ? isSelected
                            ? 'bg-purple-50 border-purple-500 shadow-sm cursor-pointer'
                            : 'bg-emerald-50/40 border-emerald-200 hover:border-emerald-400 cursor-pointer'
                          : 'bg-slate-50/40 border-slate-100 text-slate-400'
                      }`}
                    >
                      <span className="text-[11px] font-bold text-slate-700">{day.dayNum}</span>

                      {hasEvents && (
                        <div className="space-y-1">
                          {day.dayEvents.map((evt) => (
                            <div
                              key={evt.id}
                              className={`text-[9px] font-extrabold p-1 rounded leading-tight truncate ${
                                evt.event_type === 'RECURRING_INSTANCE'
                                  ? 'bg-purple-700 text-white'
                                  : 'bg-blue-700 text-white'
                              }`}
                              title={evt.title}
                            >
                              {evt.start_time} {evt.customer_name.split(' ')[0]}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right: Selected Shift Details (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <Card header={<span className="font-black text-xs uppercase tracking-wider text-gov-navy">Shift Execution Card</span>}>
              {selectedEvent ? (
                <div className="space-y-4 text-xs">
                  <div className="space-y-1 border-b pb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-purple-100 text-purple-800">
                        {selectedEvent.event_type.replace('_', ' ')}
                      </span>
                      <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                        {selectedEvent.status}
                      </span>
                    </div>
                    <h4 className="font-extrabold text-sm text-gov-navy mt-1">
                      {selectedEvent.title}
                    </h4>
                  </div>

                  <div className="space-y-2 text-slate-600">
                    <div className="flex items-center justify-between">
                      <span className="text-gov-muted">Shift Date:</span>
                      <span className="font-bold text-slate-800">{selectedEvent.date} ({selectedEvent.day_of_week})</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gov-muted">Shift Window:</span>
                      <span className="font-mono font-bold text-slate-800">{selectedEvent.time_slot}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gov-muted">Citizen Client:</span>
                      <span className="font-bold text-slate-800">{selectedEvent.customer_name}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gov-muted">Settlement Amount:</span>
                      <span className="font-black text-emerald-700">₹{selectedEvent.rate}.00</span>
                    </div>
                  </div>

                  <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 space-y-1">
                    <span className="text-[10px] font-bold uppercase text-emerald-800 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" /> Same-Day DBT Escrow Settlement
                    </span>
                    <p className="text-[11px] text-emerald-900 leading-relaxed">
                      Upon completing this shift and verifying the citizen OTP, ₹{(selectedEvent.rate * 0.9).toFixed(2)} (90%) is transferred directly to your bank account with zero platform deduction.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-10 text-slate-400 space-y-2">
                  <CalendarIcon className="w-8 h-8 mx-auto text-slate-300" />
                  <p className="text-xs">Select any active shift in the calendar to view customer details.</p>
                </div>
              )}
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};
