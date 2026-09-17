import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  KeyRound,
  Play,
  Pause,
  PlusCircle,
  AlertTriangle,
  Layers,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';

export const RecurringSchedulesPage: React.FC = () => {
  const navigate = useNavigate();
  const [schedules, setSchedules] = useState<RecurringScheduleRecord[]>([]);
  const [calendarEvents, setCalendarEvents] = useState<CalendarEventRecord[]>([]);
  const [activeTab, setActiveTab] = useState<'CALENDAR' | 'SCHEDULES'>('CALENDAR');
  const [currentMonth, setCurrentMonth] = useState('2026-09');
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // Selected event in calendar
  const [selectedEvent, setSelectedEvent] = useState<CalendarEventRecord | null>(null);

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

  const handlePause = async (scheduleId: string) => {
    if (!confirm('Pause all future instances of this recurring schedule?')) return;
    setActionLoading(true);
    try {
      await recurringService.pauseSchedule(scheduleId, 'Paused by citizen');
      await fetchData();
    } finally {
      setActionLoading(false);
    }
  };

  const handleResume = async (scheduleId: string) => {
    setActionLoading(true);
    try {
      await recurringService.resumeSchedule(scheduleId);
      await fetchData();
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancelSchedule = async (scheduleId: string) => {
    const reason = prompt('Please enter cancellation reason for remaining instances:');
    if (!reason) return;
    setActionLoading(true);
    try {
      await recurringService.cancelSchedule(scheduleId, reason);
      await fetchData();
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancelInstance = async (instanceId: string) => {
    if (!confirm('Cancel only this specific date shift? (Your overall recurring contract remains active)')) return;
    setActionLoading(true);
    try {
      await recurringService.cancelSingleInstance(instanceId, 'Citizen cancelled single date');
      await fetchData();
    } finally {
      setActionLoading(false);
    }
  };

  // Generate a mock 30-day calendar matrix for the month
  const daysInMonth = Array.from({ length: 30 }, (_, i) => {
    const dayNum = i + 1;
    const dateStr = `2026-09-${dayNum < 10 ? '0' + dayNum : dayNum}`;
    const dayEvents = calendarEvents.filter((e) => e.date === dateStr);
    return { dayNum, dateStr, dayEvents };
  });

  return (
    <div className="space-y-6 pb-16 font-sans">
      {/* Top Banner & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-extrabold uppercase tracking-wider bg-purple-100 text-purple-800 px-2 py-0.5 rounded">
              Recurring & Care Contracts Rail
            </span>
            <span className="text-xs text-slate-500 font-medium">Consensual Shift Dispatch</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-gov-navy tracking-tight">
            Recurring Schedules & Visual Calendar
          </h1>
          <p className="text-xs sm:text-sm text-gov-muted">
            Manage your standing shifts, custom day slots, and pause or resume recurring services with zero penalties
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate('/customer/book')}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-600 text-white font-extrabold text-xs shadow-md transition self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Propose Recurring Service</span>
        </button>
      </div>

      {/* Mode Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 text-xs font-bold">
        <button
          type="button"
          onClick={() => setActiveTab('CALENDAR')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition ${
            activeTab === 'CALENDAR'
              ? 'bg-gov-navy text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <CalendarIcon className="w-4 h-4" />
          <span>Monthly Shift Calendar</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('SCHEDULES')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition ${
            activeTab === 'SCHEDULES'
              ? 'bg-gov-navy text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>All Recurring Contracts ({schedules.length})</span>
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gov-navy"></div>
        </div>
      ) : activeTab === 'CALENDAR' ? (
        /* CALENDAR-STYLE VIEW */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Calendar Grid (8 cols) */}
          <div className="lg:col-span-8 space-y-4">
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-base text-gov-navy">September 2026</h3>
                  <span className="text-xs bg-emerald-50 text-emerald-800 font-bold px-2 py-0.5 rounded border border-emerald-200">
                    {calendarEvents.length} Shifts Scheduled
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
                              {evt.start_time} {evt.worker_name.split(' ')[0]}
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
            <Card header={<span className="font-black text-xs uppercase tracking-wider text-gov-navy">Shift Details Inspector</span>}>
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
                      <span className="text-gov-muted">Date & Shift:</span>
                      <span className="font-bold text-slate-800">{selectedEvent.date} ({selectedEvent.day_of_week})</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gov-muted">Time Window:</span>
                      <span className="font-mono font-bold text-slate-800">{selectedEvent.time_slot}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gov-muted">Assigned Craftsman:</span>
                      <span className="font-bold text-emerald-700">{selectedEvent.worker_name}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gov-muted">Per-Shift Tariff:</span>
                      <span className="font-black text-slate-800">₹{selectedEvent.rate}.00</span>
                    </div>
                  </div>

                  {selectedEvent.otp_code && (
                    <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-center">
                      <span className="text-[10px] font-bold uppercase text-emerald-800 flex items-center justify-center gap-1">
                        <KeyRound className="w-3 h-3" /> Shift Verification OTP
                      </span>
                      <div className="font-mono font-black text-xl text-emerald-950 tracking-widest mt-0.5">
                        {selectedEvent.otp_code}
                      </div>
                    </div>
                  )}

                  <div className="pt-2">
                    <button
                      type="button"
                      disabled={actionLoading}
                      onClick={() => handleCancelInstance(selectedEvent.id)}
                      className="w-full py-2 rounded-xl text-xs font-bold text-rose-700 bg-rose-50 border border-rose-200 hover:bg-rose-100 transition"
                    >
                      Skip / Cancel This Date Only
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-10 text-slate-400 space-y-2">
                  <CalendarIcon className="w-8 h-8 mx-auto text-slate-300" />
                  <p className="text-xs">Click on any date in the calendar to inspect shift verification details.</p>
                </div>
              )}
            </Card>

            {/* Anti-Exploitation Guarantee Notice */}
            <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-2 text-xs">
              <div className="flex items-center gap-2 font-bold text-emerald-400">
                <ShieldCheck className="w-4 h-4" />
                <span>Statutory Consent Assurance</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Recurring schedules are activated only after explicit tradesperson acceptance. You can pause or cancel at any time with 0% penalty and 100% direct bank payout clarity.
              </p>
            </div>
          </div>
        </div>
      ) : (
        /* SCHEDULES LIST VIEW */
        <div className="space-y-4">
          {schedules.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 space-y-3">
              <CalendarIcon className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="font-extrabold text-gov-navy text-base">No active recurring arrangements</h3>
              <p className="text-xs text-gov-muted">Propose a weekly or custom-slot recurring service with your preferred worker.</p>
              <Button size="sm" variant="primary" onClick={() => navigate('/customer/book')} className="text-xs">
                Propose Recurring Arrangement
              </Button>
            </div>
          ) : (
            schedules.map((s) => (
              <Card key={s.id} className="p-6 border-slate-200 hover:border-purple-300 transition bg-white space-y-5">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 border-b border-slate-100 pb-4">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-bold text-purple-800 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                        {s.schedule_reference}
                      </span>
                      <span className="text-[10px] font-black uppercase text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                        {s.recurrence_type.replace('_', ' ')}
                      </span>
                      <span
                        className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded ${
                          s.status === 'ACTIVE'
                            ? 'bg-emerald-100 text-emerald-800'
                            : s.status === 'PENDING_WORKER_ACCEPTANCE'
                            ? 'bg-amber-100 text-amber-800'
                            : s.status === 'PAUSED'
                            ? 'bg-slate-200 text-slate-700'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {s.status.replace(/_/g, ' ')}
                      </span>
                    </div>

                    <h3 className="font-black text-lg text-gov-navy">{s.service_title}</h3>

                    <p className="text-xs text-gov-muted flex items-center gap-2">
                      <span>Worker: <strong>{s.worker_name}</strong></span>
                      <span>·</span>
                      <span>{s.cooperative_name}</span>
                    </p>
                  </div>

                  <div className="text-left lg:text-right">
                    <span className="text-[10px] text-gov-muted uppercase block">Projected Total ({s.total_occurrences} shifts)</span>
                    <span className="font-black text-xl text-gov-navy">₹{s.total_projected_amount}.00</span>
                    <span className="text-[11px] text-emerald-700 block font-semibold">₹{s.rate_per_instance} / shift</span>
                  </div>
                </div>

                {/* Custom Slots or Schedule Days */}
                {s.custom_slots && s.custom_slots.length > 0 && (
                  <div className="p-3 bg-purple-50/50 rounded-xl border border-purple-200 space-y-1.5 text-xs">
                    <span className="font-extrabold text-purple-900 block text-[11px] uppercase tracking-wider">
                      Custom Slot Pattern:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {s.custom_slots.map((slot, idx) => (
                        <span key={idx} className="bg-white border border-purple-300 text-purple-900 font-bold px-2.5 py-1 rounded-lg">
                          {slot.day_of_week}: {slot.start_time} – {slot.end_time}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Status Notice if Pending */}
                {s.status === 'PENDING_WORKER_ACCEPTANCE' && (
                  <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-xs flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>
                      Awaiting tradesperson acceptance. Booking dates and OTPs will generate automatically once accepted.
                    </span>
                  </div>
                )}

                {/* Action Controls */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <div className="text-xs text-slate-500 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{s.address_line}, {s.district}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {s.status === 'ACTIVE' && (
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={actionLoading}
                        onClick={() => handlePause(s.id)}
                        className="text-xs font-bold text-slate-700"
                        leftIcon={<Pause className="w-3.5 h-3.5" />}
                      >
                        Pause Schedule
                      </Button>
                    )}

                    {s.status === 'PAUSED' && (
                      <Button
                        size="sm"
                        variant="primary"
                        disabled={actionLoading}
                        onClick={() => handleResume(s.id)}
                        className="text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white"
                        leftIcon={<Play className="w-3.5 h-3.5" />}
                      >
                        Resume Schedule
                      </Button>
                    )}

                    {['ACTIVE', 'PAUSED', 'PENDING_WORKER_ACCEPTANCE'].includes(s.status) && (
                      <button
                        type="button"
                        disabled={actionLoading}
                        onClick={() => handleCancelSchedule(s.id)}
                        className="px-3 py-1.5 rounded-lg text-xs font-bold text-rose-700 bg-rose-50 border border-rose-200 hover:bg-rose-100 transition"
                      >
                        Cancel Future Shifts
                      </button>
                    )}
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
};
