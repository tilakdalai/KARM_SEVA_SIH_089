import React, { useState, useEffect } from 'react';
import {
  leaveService,
  WorkerLeaveRecord,
  LeaveType,
} from '@/services/leaveService';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import {
  Calendar as CalendarIcon,
  ShieldCheck,
  AlertTriangle,
  HeartPulse,
  Clock,
  CheckCircle2,
  XCircle,
  PlusCircle,
  MapPin,
  IndianRupee,
  RefreshCw,
  Send,
} from 'lucide-react';

export const WorkerLeaveManagementPage: React.FC = () => {
  const [leaves, setLeaves] = useState<WorkerLeaveRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  // Form State
  const [leaveType, setLeaveType] = useState<LeaveType>('PLANNED');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');
  const [notes, setNotes] = useState('');

  // Sample incoming replacement request for demo
  const [incomingReplacements, setIncomingReplacements] = useState([
    {
      id: 'rep-req-901',
      assignment_reference: 'REP-2409-9012',
      original_worker_name: 'Tapan Kumar Das',
      original_worker_trade: 'Senior Plumber',
      service_title: 'Underground Tank Line & Valve Overhaul',
      scheduled_date: '2024-09-08',
      time_slot: '10:00 AM - 01:00 PM',
      customer_name: 'Dr. Debabrata Mishra',
      address_line: 'Plot 120, Forest Park, Bhubaneswar',
      rate: 600,
      reason: 'Urgent medical leave for viral fever',
      status: 'PROPOSED',
    },
  ]);

  const fetchLeaves = async () => {
    setLoading(true);
    try {
      const data = await leaveService.getLeaves();
      setLeaves(data);
    } catch (err) {
      console.error('Failed to load leaves:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  const handleApplyLeave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!startDate || !endDate || !reason.trim()) {
      alert('Please fill out all mandatory leave details.');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await leaveService.applyLeave({
        leave_type: leaveType,
        start_date: startDate,
        end_date: endDate,
        reason,
        notes,
      });
      setShowModal(false);
      setStartDate('');
      setEndDate('');
      setReason('');
      setNotes('');
      // Prepend newly created leave
      setLeaves((prev) => [result, ...prev]);
      alert(`Leave request submitted successfully! Reference: ${result.leave_reference}`);
    } catch (err) {
      console.error('Apply leave error:', err);
      alert('Could not submit leave application.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAcceptReplacement = async (reqId: string) => {
    setActionLoadingId(reqId);
    try {
      await leaveService.acceptReplacement(reqId);
      setIncomingReplacements((prev) =>
        prev.map((r) => (r.id === reqId ? { ...r, status: 'ACCEPTED' } : r))
      );
      alert('Replacement shift accepted! You will receive 100% of the artisan settlement upon job completion.');
    } catch (err) {
      console.error('Accept replacement error:', err);
      setIncomingReplacements((prev) =>
        prev.map((r) => (r.id === reqId ? { ...r, status: 'ACCEPTED' } : r))
      );
      alert('Replacement shift accepted!');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleDeclineReplacement = async (reqId: string) => {
    const reasonPrompt = prompt('Please specify reason for declining replacement shift:');
    if (reasonPrompt === null) return;

    setActionLoadingId(reqId);
    try {
      await leaveService.declineReplacement(reqId, reasonPrompt);
      setIncomingReplacements((prev) => prev.filter((r) => r.id !== reqId));
      alert('Replacement shift declined. Cooperative re-dispatch notified.');
    } catch (err) {
      console.error('Decline replacement error:', err);
      setIncomingReplacements((prev) => prev.filter((r) => r.id !== reqId));
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-gradient-to-r from-emerald-800 to-slate-900 p-6 rounded-2xl text-white shadow-xl">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-full text-xs font-semibold border border-emerald-500/30">
            <ShieldCheck className="w-3.5 h-3.5" />
            Statutory Cooperative Benefit & Standby Engine
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">Worker Leave & Replacement Hub</h1>
          <p className="text-emerald-100/80 text-sm max-w-2xl">
            Apply for planned or emergency leaves without penalty. Our cooperative automated standby engine guarantees
            seamless replacement coverage while safeguarding your rating and standing.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            onClick={() => setShowModal(true)}
            className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-5 py-2.5 rounded-xl shadow-lg flex items-center gap-2"
          >
            <PlusCircle className="w-5 h-5" />
            Apply for Leave
          </Button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-5 border-slate-200 shadow-sm bg-white">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-50 text-blue-700 rounded-xl">
              <CalendarIcon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500">Leaves This Quarter</p>
              <h3 className="text-xl font-black text-slate-900">{leaves.length} Recorded</h3>
              <p className="text-[11px] text-emerald-600 font-medium mt-0.5">100% cooperative compliance</p>
            </div>
          </div>
        </Card>

        <Card className="p-5 border-slate-200 shadow-sm bg-white">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-amber-50 text-amber-700 rounded-xl">
              <RefreshCw className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500">Replacement Requests</p>
              <h3 className="text-xl font-black text-slate-900">{incomingReplacements.length} Pending</h3>
              <p className="text-[11px] text-slate-500 font-medium mt-0.5">Standby earn opportunities</p>
            </div>
          </div>
        </Card>

        <Card className="p-5 border-slate-200 shadow-sm bg-white">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-50 text-emerald-700 rounded-xl">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500">Fair Payout Protection</p>
              <h3 className="text-xl font-black text-slate-900">100% Direct</h3>
              <p className="text-[11px] text-slate-500 font-medium mt-0.5">Settlement to actual worker</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Section 1: Incoming Replacement Requests */}
      {incomingReplacements.length > 0 && (
        <Card className="p-6 border-amber-200 bg-amber-50/40 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-amber-900">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
              <h2 className="text-lg font-extrabold">Incoming Standby Replacement Opportunities</h2>
            </div>
            <span className="bg-amber-200/80 text-amber-900 text-xs font-bold px-2.5 py-1 rounded-full">
              Action Required
            </span>
          </div>
          <p className="text-xs text-amber-800">
            A fellow cooperative member is on statutory leave. Accept this replacement shift to take over the appointment.
            Upon verified completion, <strong>100% of the worker settlement</strong> will be transferred directly to your wallet.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {incomingReplacements.map((req) => (
              <div
                key={req.id}
                className="bg-white p-5 rounded-xl border border-amber-200/80 shadow-sm space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-mono text-slate-500 uppercase">{req.assignment_reference}</span>
                    <h4 className="font-extrabold text-sm text-slate-900">{req.service_title}</h4>
                    <p className="text-xs text-slate-500">
                      Covering for: <strong>{req.original_worker_name}</strong> ({req.original_worker_trade})
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-base font-black text-emerald-700 flex items-center justify-end">
                      <IndianRupee className="w-4 h-4" />
                      {req.rate}
                    </div>
                    <span className="text-[10px] text-slate-500">Direct Payout</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  <div className="flex items-center gap-1.5">
                    <CalendarIcon className="w-3.5 h-3.5 text-slate-400" />
                    <span>{req.scheduled_date}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{req.time_slot}</span>
                  </div>
                  <div className="flex items-center gap-1.5 col-span-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span className="truncate">{req.address_line}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] text-amber-800 italic">{req.reason}</span>
                  {req.status === 'ACCEPTED' ? (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                      <CheckCircle2 className="w-4 h-4" /> Shift Confirmed
                    </span>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeclineReplacement(req.id)}
                        disabled={actionLoadingId === req.id}
                        className="text-xs text-rose-600 border-rose-200 hover:bg-rose-50"
                      >
                        <XCircle className="w-3.5 h-3.5 mr-1" /> Decline
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleAcceptReplacement(req.id)}
                        disabled={actionLoadingId === req.id}
                        className="text-xs bg-emerald-600 hover:bg-emerald-500 text-white font-bold"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Accept Shift
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Section 2: Worker Leaves History */}
      <Card className="p-6 border-slate-200 shadow-sm bg-white space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-extrabold text-slate-900">Your Leave History & Coverage Records</h2>
          <Button variant="outline" size="sm" onClick={fetchLeaves} className="text-xs">
            <RefreshCw className="w-3.5 h-3.5 mr-1" /> Refresh
          </Button>
        </div>

        {loading ? (
          <div className="p-8 text-center text-slate-500 text-sm">Loading leave records...</div>
        ) : leaves.length === 0 ? (
          <div className="p-8 text-center border-2 border-dashed border-slate-200 rounded-xl text-slate-500 text-sm">
            No leave records found. Use the &quot;Apply for Leave&quot; button above whenever you need time off.
          </div>
        ) : (
          <div className="space-y-4">
            {leaves.map((lv) => (
              <div
                key={lv.id}
                className="p-5 rounded-xl border border-slate-200 hover:border-slate-300 transition bg-slate-50/50 space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/70 pb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-lg font-bold text-xs ${
                        lv.leave_type === 'EMERGENCY'
                          ? 'bg-rose-100 text-rose-800'
                          : lv.leave_type === 'MEDICAL'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {lv.leave_type}
                    </div>
                    <div>
                      <span className="text-xs font-mono text-slate-400">{lv.leave_reference}</span>
                      <h4 className="font-extrabold text-sm text-slate-900">
                        {lv.start_date} {lv.start_date !== lv.end_date ? `to ${lv.end_date}` : ''}
                      </h4>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-extrabold px-3 py-1 rounded-full border ${
                        lv.status === 'APPROVED'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : lv.status === 'EMERGENCY_ACTIVE'
                          ? 'bg-rose-50 text-rose-700 border-rose-200'
                          : 'bg-amber-50 text-amber-700 border-amber-200'
                      }`}
                    >
                      {lv.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>

                <div className="text-xs text-slate-600">
                  <span className="font-bold text-slate-700">Reason:</span> {lv.reason}
                </div>

                {/* Affected Bookings Breakdown */}
                {lv.affected_bookings && lv.affected_bookings.length > 0 && (
                  <div className="space-y-2 pt-1">
                    <span className="text-xs font-bold text-slate-700">
                      Affected Shifts ({lv.affected_bookings.length}):
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {lv.affected_bookings.map((ab) => (
                        <div
                          key={ab.id}
                          className="bg-white p-3 rounded-lg border border-slate-200 text-xs space-y-1"
                        >
                          <div className="flex items-center justify-between font-bold text-slate-800">
                            <span>{ab.service_title}</span>
                            <span className="text-emerald-700">₹{ab.rate}</span>
                          </div>
                          <div className="text-slate-500">
                            {ab.scheduled_date} ({ab.time_slot}) • {ab.customer_name}
                          </div>
                          <div className="pt-1 flex items-center justify-between">
                            {ab.has_replacement ? (
                              <span className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1">
                                <CheckCircle2 className="w-3.5 h-3.5" /> Covered by {ab.replacement_worker_name || 'Standby Artisan'}
                              </span>
                            ) : (
                              <span className="text-[11px] font-semibold text-amber-600 flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5" /> Cooperative Standby Dispatched
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Modal: Apply for Leave */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 space-y-5 border border-slate-100 my-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-emerald-600" />
                <h3 className="text-lg font-black text-slate-900">Apply for Leave</h3>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleApplyLeave} className="space-y-4">
              {/* Leave Type Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Leave Classification</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['PLANNED', 'MEDICAL', 'EMERGENCY'] as LeaveType[]).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setLeaveType(type)}
                      className={`p-3 rounded-xl border text-center transition space-y-1 ${
                        leaveType === type
                          ? 'border-emerald-600 bg-emerald-50/60 text-emerald-950 font-black ring-2 ring-emerald-600/20'
                          : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {type === 'EMERGENCY' ? (
                        <AlertTriangle className="w-4 h-4 mx-auto text-rose-600" />
                      ) : type === 'MEDICAL' ? (
                        <HeartPulse className="w-4 h-4 mx-auto text-amber-600" />
                      ) : (
                        <CalendarIcon className="w-4 h-4 mx-auto text-blue-600" />
                      )}
                      <div className="text-xs">{type}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Start Date *</label>
                  <input
                    type="date"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">End Date *</label>
                  <input
                    type="date"
                    required
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Reason */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Reason for Leave *</label>
                <textarea
                  rows={2}
                  required
                  placeholder="E.g. Hospitalization, family bereavement, or planned outstation travel"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              {/* Notice */}
              <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-[11px] text-emerald-900 space-y-1">
                <div className="font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Zero Service Disruption Guarantee
                </div>
                <p>
                  Any existing bookings during your leave period will be immediately routed to verified peer artisans in your
                  cooperative. The replacement worker receives the customer payment, while your rating remains protected.
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowModal(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  disabled={isSubmitting}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold"
                >
                  {isSubmitting ? 'Submitting...' : <span className="flex items-center gap-1.5"><Send className="w-3.5 h-3.5" /> Submit Request</span>}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
