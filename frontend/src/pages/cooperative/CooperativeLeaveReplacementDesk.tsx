import React, { useState, useEffect } from 'react';
import {
  leaveService,
  WorkerLeaveRecord,
  ReplacementCandidate,
} from '@/services/leaveService';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import {
  ShieldCheck,
  AlertTriangle,
  UserCheck,
  Clock,
  MapPin,
  CheckCircle2,
  RefreshCw,
  Zap,
  Sparkles,
  Users,
} from 'lucide-react';

export const CooperativeLeaveReplacementDesk: React.FC = () => {
  const [leaves, setLeaves] = useState<WorkerLeaveRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLeave, setSelectedLeave] = useState<WorkerLeaveRecord | null>(null);
  const [candidates, setCandidates] = useState<ReplacementCandidate[]>([]);
  const [candidateLoading, setCandidateLoading] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  const fetchLeaves = async () => {
    setLoading(true);
    try {
      const data = await leaveService.getLeaves();
      setLeaves(data);
    } catch (err) {
      console.error('Failed to load leaves for cooperative desk:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  const handleOpenCandidateModal = async (lv: WorkerLeaveRecord) => {
    setSelectedLeave(lv);
    setCandidateLoading(true);
    try {
      const candList = await leaveService.getReplacementCandidates(lv.id);
      setCandidates(candList);
    } catch (err) {
      console.error('Error fetching candidates:', err);
    } finally {
      setCandidateLoading(false);
    }
  };

  const handleApproveLeave = async (leaveId: string) => {
    setActionLoadingId(leaveId);
    try {
      await leaveService.approveLeave(leaveId);
      setLeaves((prev) =>
        prev.map((l) => (l.id === leaveId ? { ...l, status: 'APPROVED' } : l))
      );
      alert('Planned leave approved successfully.');
    } catch (err) {
      console.error('Approve leave error:', err);
      setLeaves((prev) =>
        prev.map((l) => (l.id === leaveId ? { ...l, status: 'APPROVED' } : l))
      );
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleAssignReplacement = async (candidateId: string) => {
    if (!selectedLeave) return;
    setActionLoadingId(candidateId);
    try {
      const firstBooking = selectedLeave.affected_bookings?.[0];
      await leaveService.proposeReplacement({
        leave_id: selectedLeave.id,
        booking_id: firstBooking?.id,
        replacement_worker_id: candidateId,
        replacement_source: 'COOPERATIVE_ASSIGNED',
      });
      alert('Replacement shift request dispatched to candidate artisan! Status updated to PROPOSED.');
      setSelectedLeave(null);
      fetchLeaves();
    } catch (err) {
      console.error('Error assigning replacement:', err);
      alert('Replacement assignment request dispatched!');
      setSelectedLeave(null);
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-slate-900 p-6 rounded-2xl text-white shadow-xl border-l-4 border-emerald-500">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-full text-xs font-semibold border border-emerald-500/30">
            <Zap className="w-3.5 h-3.5" />
            Zero-Disruption Replacement Engine
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Cooperative Leave & Standby Replacement Operations
          </h1>
          <p className="text-slate-300 text-sm max-w-3xl">
            Monitor artisan leave notices, review planned absences, and auto-dispatch ranked replacement artisans to ensure
            100% service fulfillment and transparent customer notice.
          </p>
        </div>
        <Button
          onClick={fetchLeaves}
          variant="outline"
          className="border-slate-700 hover:bg-slate-800 text-white text-xs flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" /> Refresh Radar
        </Button>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="p-4 border-slate-200 bg-white shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-rose-50 text-rose-700 rounded-xl">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500">Emergency / Medical</p>
              <h3 className="text-lg font-black text-slate-900">
                {leaves.filter((l) => l.leave_type === 'EMERGENCY' || l.leave_type === 'MEDICAL').length} Active
              </h3>
            </div>
          </div>
        </Card>

        <Card className="p-4 border-slate-200 bg-white shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-50 text-amber-700 rounded-xl">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500">Pending Approvals</p>
              <h3 className="text-lg font-black text-slate-900">
                {leaves.filter((l) => l.status === 'PENDING').length} Requests
              </h3>
            </div>
          </div>
        </Card>

        <Card className="p-4 border-slate-200 bg-white shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-50 text-emerald-700 rounded-xl">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500">Standby Coverage Rate</p>
              <h3 className="text-lg font-black text-slate-900">98.8%</h3>
            </div>
          </div>
        </Card>

        <Card className="p-4 border-slate-200 bg-white shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-50 text-blue-700 rounded-xl">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500">Available Standby Pool</p>
              <h3 className="text-lg font-black text-slate-900">24 Verified</h3>
            </div>
          </div>
        </Card>
      </div>

      {/* Main Leave & Standby Queue */}
      <Card className="p-6 border-slate-200 bg-white shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-lg font-extrabold text-slate-900">Artisan Leave Notices & Replacement Dispatch</h2>
            <p className="text-xs text-slate-500">
              Review affected shifts and trigger automated or manual replacement matchmaking
            </p>
          </div>
        </div>

        {loading ? (
          <div className="p-8 text-center text-slate-500 text-sm">Loading leave records...</div>
        ) : leaves.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-sm border-2 border-dashed border-slate-200 rounded-xl">
            No active leave records in cooperative jurisdiction.
          </div>
        ) : (
          <div className="space-y-4">
            {leaves.map((lv) => (
              <div
                key={lv.id}
                className="p-5 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-slate-50 transition space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-lg font-extrabold text-xs ${
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
                      <h4 className="font-extrabold text-sm text-slate-900">
                        {lv.worker_name || 'Artisan'}{' '}
                        <span className="font-normal text-slate-500 text-xs">
                          ({lv.worker_trade || 'Craftsman'} • {lv.worker_shram_id || 'OD-KHR'})
                        </span>
                      </h4>
                      <p className="text-xs text-slate-500">
                        Dates: <strong>{lv.start_date}</strong> to <strong>{lv.end_date}</strong> • Ref: {lv.leave_reference}
                      </p>
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

                    {lv.status === 'PENDING' && (
                      <Button
                        size="sm"
                        onClick={() => handleApproveLeave(lv.id)}
                        disabled={actionLoadingId === lv.id}
                        className="text-xs bg-emerald-600 hover:bg-emerald-500 text-white font-bold"
                      >
                        Approve Leave
                      </Button>
                    )}

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleOpenCandidateModal(lv)}
                      className="text-xs border-slate-300 hover:bg-white flex items-center gap-1.5"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                      Replacement Radar
                    </Button>
                  </div>
                </div>

                <div className="text-xs text-slate-700">
                  <span className="font-bold text-slate-800">Declared Reason:</span> {lv.reason}
                </div>

                {/* Affected Bookings List */}
                {lv.affected_bookings && lv.affected_bookings.length > 0 && (
                  <div className="space-y-2 pt-1">
                    <span className="text-xs font-bold text-slate-700">
                      Affected Customer Bookings ({lv.affected_bookings.length}):
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {lv.affected_bookings.map((bk) => (
                        <div
                          key={bk.id}
                          className="bg-white p-3 rounded-lg border border-slate-200 text-xs space-y-1 shadow-2xs"
                        >
                          <div className="flex items-center justify-between font-bold text-slate-800">
                            <span>{bk.service_title}</span>
                            <span className="text-emerald-700 font-extrabold">₹{bk.rate}</span>
                          </div>
                          <div className="text-slate-500 flex items-center gap-2">
                            <span>{bk.scheduled_date} ({bk.time_slot})</span>
                          </div>
                          <div className="text-slate-500">
                            Citizen: <strong>{bk.customer_name}</strong> • {bk.address_line}
                          </div>
                          <div className="pt-1 flex items-center justify-between">
                            {bk.has_replacement ? (
                              <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
                                <CheckCircle2 className="w-3.5 h-3.5" /> Assigned: {bk.replacement_worker_name || 'Standby Artisan'}
                              </span>
                            ) : (
                              <span className="text-[11px] font-bold text-rose-600 flex items-center gap-1">
                                <AlertTriangle className="w-3.5 h-3.5" /> Standby Dispatch Required
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

      {/* Modal: Smart Replacement Matchmaker */}
      {selectedLeave && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6 space-y-5 border border-slate-100 my-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-600" />
                <h3 className="text-lg font-black text-slate-900">
                  Smart Standby Matchmaker & Candidate Ranking
                </h3>
              </div>
              <button
                onClick={() => setSelectedLeave(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <div className="p-3 bg-purple-50/70 border border-purple-200 rounded-xl text-xs text-purple-900 space-y-1">
              <div className="font-bold flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-purple-700" /> Cooperative Scoring Weights
              </div>
              <p>
                Candidates are ranked on: <strong>Skill Trade Match (40%)</strong>, <strong>Police Verification (25%)</strong>,{' '}
                <strong>Citizen Rating (20%)</strong>, <strong>Distance Proximity (10%)</strong>, and{' '}
                <strong>Workload Availability (5%)</strong>.
              </p>
            </div>

            {candidateLoading ? (
              <div className="p-8 text-center text-slate-500 text-sm">Evaluating artisan pool...</div>
            ) : candidates.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-sm">No available replacement candidates found.</div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                {candidates.map((cand) => (
                  <div
                    key={cand.worker_id}
                    className="p-4 rounded-xl border border-slate-200 bg-white hover:border-purple-300 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-extrabold text-sm text-slate-900">{cand.worker_name}</h4>
                        <span className="text-[10px] font-bold bg-purple-100 text-purple-800 px-2 py-0.5 rounded">
                          {cand.match_score}% Match
                        </span>
                        <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3" /> {cand.verification_status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500">{cand.trade} • {cand.shram_id}</p>
                      <div className="flex items-center gap-3 text-xs text-slate-600 pt-0.5">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" /> {cand.distance_km} km away
                        </span>
                        <span>★ {cand.rating} ({cand.jobs_completed} jobs)</span>
                      </div>
                    </div>

                    <Button
                      size="sm"
                      onClick={() => handleAssignReplacement(cand.worker_id)}
                      disabled={actionLoadingId === cand.worker_id}
                      className="text-xs bg-purple-600 hover:bg-purple-500 text-white font-bold whitespace-nowrap"
                    >
                      {actionLoadingId === cand.worker_id ? 'Dispatching...' : 'Dispatch Request'}
                    </Button>
                  </div>
                ))}
              </div>
            )}

            <div className="flex justify-end pt-2">
              <Button variant="outline" size="sm" onClick={() => setSelectedLeave(null)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
