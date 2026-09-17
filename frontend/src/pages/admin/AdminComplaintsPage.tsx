import React, { useState, useEffect } from 'react';
import {
  complaintService,
  ComplaintRecord,
} from '@/services/complaintService';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import {
  AlertTriangle,
  CheckCircle2,
  Scale,
  RefreshCw,
  Search,
  X,
} from 'lucide-react';

export const AdminComplaintsPage: React.FC = () => {
  const [complaints, setComplaints] = useState<ComplaintRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<string>('ESCALATED');
  const [searchQuery, setSearchQuery] = useState('');

  const [activeComplaint, setActiveComplaint] = useState<ComplaintRecord | null>(null);
  const [resolveModalOpen, setResolveModalOpen] = useState(false);
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const data = await complaintService.listComplaints();
      setComplaints(data);
    } catch (err) {
      console.error('Failed to load admin complaints:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const handleTribunalResolve = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeComplaint) return;
    try {
      setActionLoading(true);
      await complaintService.resolveComplaint(
        activeComplaint.id,
        `[State DPI Tribunal Order] ${resolutionNotes}`
      );
      setResolveModalOpen(false);
      setResolutionNotes('');
      fetchComplaints();
    } catch (err) {
      alert('Failed to record tribunal resolution');
    } finally {
      setActionLoading(false);
    }
  };

  const filteredComplaints = complaints.filter((c) => {
    const matchesStatus = selectedStatus === 'ALL' || c.status === selectedStatus;
    const matchesSearch =
      c.complaint_reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.cooperative_code.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const countEscalated = complaints.filter((c) => c.status === 'ESCALATED').length;
  const countSafety = complaints.filter((c) => c.category === 'SAFETY').length;
  const countDamage = complaints.filter((c) => c.category === 'DAMAGE').length;

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-16">
      {/* Header */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <Scale className="w-6 h-6 text-purple-700" />
              <span>State DPI Grievance Tribunal & Appellate Desk</span>
            </h1>
            <span className="text-xs font-bold bg-purple-100 text-purple-900 px-2.5 py-0.5 rounded-full border border-purple-200">
              Appellate Authority
            </span>
          </div>
          <p className="text-xs text-slate-500">
            State-level dispute arbitration, statutory safety interventions, and cooperative conciliation oversight.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={fetchComplaints}
          className="text-xs flex items-center gap-1.5 self-start md:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Refresh Tribunal
        </Button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4 bg-gradient-to-br from-purple-50/50 to-white border-purple-200">
          <div className="text-[11px] font-bold text-purple-900 uppercase tracking-wider">Escalated Grievances</div>
          <div className="text-3xl font-black text-purple-900 mt-1">{countEscalated}</div>
          <span className="text-[10px] text-slate-400">Transferred from cooperatives</span>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-rose-50/50 to-white border-rose-200">
          <div className="text-[11px] font-bold text-rose-900 uppercase tracking-wider">Critical Safety Flags</div>
          <div className="text-3xl font-black text-rose-800 mt-1">{countSafety}</div>
          <span className="text-[10px] text-slate-400">High-voltage / structural alerts</span>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-amber-50/50 to-white border-amber-200">
          <div className="text-[11px] font-bold text-amber-900 uppercase tracking-wider">Damage / Compensation Claims</div>
          <div className="text-3xl font-black text-amber-800 mt-1">{countDamage}</div>
          <span className="text-[10px] text-slate-400">Property damage under review</span>
        </Card>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex flex-wrap gap-1.5">
          {['ESCALATED', 'ALL', 'OPEN', 'UNDER_REVIEW', 'RESOLVED'].map((tab) => (
            <button
              key={tab}
              onClick={() => setSelectedStatus(tab)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                selectedStatus === tab
                  ? 'bg-purple-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tab.replace('_', ' ')}
            </button>
          ))}
        </div>

        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search ref, cooperative, keywords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-900 w-full sm:w-64"
          />
        </div>
      </div>

      {/* Complaints List */}
      <div className="space-y-4">
        {loading ? (
          <div className="p-12 text-center text-xs text-slate-400 bg-white rounded-3xl border">
            Loading tribunal files...
          </div>
        ) : filteredComplaints.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-400 bg-white rounded-3xl border">
            No complaints matching current tribunal filter.
          </div>
        ) : (
          filteredComplaints.map((c) => (
            <div
              key={c.id}
              className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4 hover:border-slate-300 transition"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-3">
                  <span className="font-mono font-black text-sm text-slate-900">{c.complaint_reference}</span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-purple-100 text-purple-900 border border-purple-200">
                    {c.status}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border">
                    {c.category}
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">Coop: {c.cooperative_code}</span>
                </div>
                <div className="text-[11px] text-slate-400">
                  Lodged by <strong>{c.created_by_name}</strong> • {new Date(c.created_at).toLocaleDateString()}
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 text-xs">
                <div className="lg:col-span-2 space-y-2">
                  <h4 className="font-black text-sm text-slate-900">{c.title}</h4>
                  <p className="text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-2xl border border-slate-200">
                    "{c.description}"
                  </p>

                  {c.escalation_reason && (
                    <div className="p-3 rounded-2xl bg-purple-50 border border-purple-200 text-purple-950 space-y-1">
                      <div className="font-black text-[11px] flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5 text-purple-600" />
                        <span>Escalation Grounds ({new Date(c.escalated_at || '').toLocaleDateString()}):</span>
                      </div>
                      <p className="text-[11px] leading-relaxed">{c.escalation_reason}</p>
                    </div>
                  )}

                  {c.resolution_notes && (
                    <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 space-y-1">
                      <div className="font-black text-[11px] flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Tribunal Binding Order:</span>
                      </div>
                      <p className="text-[11px] leading-relaxed">{c.resolution_notes}</p>
                    </div>
                  )}
                </div>

                <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200 flex flex-col justify-between">
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Tribunal Authority
                    </span>

                    {c.status !== 'RESOLVED' ? (
                      <Button
                        size="sm"
                        onClick={() => {
                          setActiveComplaint(c);
                          setResolveModalOpen(true);
                        }}
                        className="w-full text-xs font-bold bg-purple-800 hover:bg-purple-900 text-white shadow-xs"
                      >
                        Issue Final Tribunal Order
                      </Button>
                    ) : (
                      <div className="text-center py-2 text-emerald-800 font-bold text-xs flex items-center justify-center gap-1">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Case Closed by State
                      </div>
                    )}
                  </div>

                  <div className="text-[10px] text-slate-400 border-t border-slate-200 pt-2 flex justify-between">
                    <span>Audit Events: {c.actions.length}</span>
                    <span>State Jurisdiction</span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Tribunal Resolution Modal */}
      {resolveModalOpen && activeComplaint && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-extrabold text-base text-purple-950">Issue State Tribunal Binding Resolution</h3>
              <button onClick={() => setResolveModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleTribunalResolve} className="space-y-4 text-xs">
              <p className="text-slate-600 font-medium">
                Issuing appellate order for complaint <strong>{activeComplaint.complaint_reference}</strong>.
              </p>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Tribunal Ruling & Disciplinary / Compensation Order <span className="text-rose-500">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  value={resolutionNotes}
                  onChange={(e) => setResolutionNotes(e.target.value)}
                  placeholder="Specify enforceable binding decision, worker disciplinary actions, or escrow payout adjustments..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-700"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setResolveModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 font-bold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-5 py-2 rounded-xl bg-purple-800 hover:bg-purple-900 text-white font-bold transition shadow-sm"
                >
                  {actionLoading ? 'Issuing...' : 'Issue Final Tribunal Order'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
