import React, { useState, useEffect } from 'react';
import {
  complaintService,
  ComplaintRecord,
  ComplaintStatus,
} from '@/services/complaintService';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import {
  AlertTriangle,
  CheckCircle2,
  ShieldAlert,
  RefreshCw,
  Search,
  FileText,
  X,
  ExternalLink,
} from 'lucide-react';

export const CooperativeComplaintsPage: React.FC = () => {
  const [complaints, setComplaints] = useState<ComplaintRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [resolveModalOpen, setResolveModalOpen] = useState(false);
  const [escalateModalOpen, setEscalateModalOpen] = useState(false);
  const [activeComplaint, setActiveComplaint] = useState<ComplaintRecord | null>(null);
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [escalationReason, setEscalationReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const data = await complaintService.listComplaints({
        cooperative_code: 'OD-KHR-COOP-041',
      });
      setComplaints(data);
    } catch (err) {
      console.error('Failed to load complaints:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const handleStartReview = async (c: ComplaintRecord) => {
    try {
      await complaintService.updateStatus(c.id, 'UNDER_REVIEW', 'Cooperative conciliation officer commenced dispute inquiry.');
      fetchComplaints();
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const handleResolve = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeComplaint) return;
    try {
      setActionLoading(true);
      await complaintService.resolveComplaint(activeComplaint.id, resolutionNotes);
      setResolveModalOpen(false);
      setResolutionNotes('');
      fetchComplaints();
    } catch (err) {
      alert('Failed to resolve complaint');
    } finally {
      setActionLoading(false);
    }
  };

  const handleEscalate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeComplaint) return;
    try {
      setActionLoading(true);
      await complaintService.escalateComplaint(activeComplaint.id, escalationReason);
      setEscalateModalOpen(false);
      setEscalationReason('');
      fetchComplaints();
    } catch (err) {
      alert('Failed to escalate complaint');
    } finally {
      setActionLoading(false);
    }
  };

  const filteredComplaints = complaints.filter((c) => {
    const matchesStatus = selectedStatus === 'ALL' || c.status === selectedStatus;
    const matchesSearch =
      c.complaint_reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.created_by_name && c.created_by_name.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

  const countOpen = complaints.filter((c) => c.status === 'OPEN').length;
  const countUnderReview = complaints.filter((c) => c.status === 'UNDER_REVIEW').length;
  const countEscalated = complaints.filter((c) => c.status === 'ESCALATED').length;
  const countResolved = complaints.filter((c) => c.status === 'RESOLVED').length;

  const getStatusBadge = (status: ComplaintStatus) => {
    switch (status) {
      case 'OPEN':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-rose-100 text-rose-800 border border-rose-200">OPEN GRIEVANCE</span>;
      case 'UNDER_REVIEW':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-100 text-amber-900 border border-amber-200">UNDER 48H REVIEW</span>;
      case 'RESOLVED':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 border border-emerald-200">RESOLVED</span>;
      case 'ESCALATED':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-purple-100 text-purple-900 border border-purple-200">ESCALATED TO DPI</span>;
    }
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-16">
      {/* Header */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <ShieldAlert className="w-6 h-6 text-rose-600" />
              <span>Complaints & Conciliation Grievance Desk</span>
            </h1>
            <span className="text-xs font-bold bg-amber-100 text-amber-900 px-2.5 py-0.5 rounded-full border border-amber-200">
              48h Mandatory SLA
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Official statutory dispute conciliation protocol for citizen and artisan grievances under Odisha Cooperative Framework.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={fetchComplaints}
          className="text-xs flex items-center gap-1.5 self-start md:self-auto"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Refresh Desk
        </Button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 bg-gradient-to-br from-rose-50/50 to-white border-rose-200">
          <div className="text-[11px] font-bold text-rose-900 uppercase tracking-wider">New Complaints</div>
          <div className="text-2xl font-black text-rose-800 mt-1">{countOpen}</div>
          <span className="text-[10px] text-slate-400">Awaiting conciliation</span>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-amber-50/50 to-white border-amber-200">
          <div className="text-[11px] font-bold text-amber-900 uppercase tracking-wider">Under Conciliation</div>
          <div className="text-2xl font-black text-amber-800 mt-1">{countUnderReview}</div>
          <span className="text-[10px] text-slate-400">Active officer inquiries</span>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-purple-50/50 to-white border-purple-200">
          <div className="text-[11px] font-bold text-purple-900 uppercase tracking-wider">Escalated to State</div>
          <div className="text-2xl font-black text-purple-800 mt-1">{countEscalated}</div>
          <span className="text-[10px] text-slate-400">Transferred to State Tribunal</span>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-emerald-50/50 to-white border-emerald-200">
          <div className="text-[11px] font-bold text-emerald-900 uppercase tracking-wider">Resolved</div>
          <div className="text-2xl font-black text-emerald-800 mt-1">{countResolved}</div>
          <span className="text-[10px] text-slate-400">Successfully settled</span>
        </Card>
      </div>

      {/* Search & Filter Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex flex-wrap gap-1.5">
          {['ALL', 'OPEN', 'UNDER_REVIEW', 'ESCALATED', 'RESOLVED'].map((tab) => (
            <button
              key={tab}
              onClick={() => setSelectedStatus(tab)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                selectedStatus === tab
                  ? 'bg-slate-900 text-white shadow-xs'
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
            placeholder="Search complaint ref, citizen, title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900 w-full sm:w-64"
          />
        </div>
      </div>

      {/* Complaints List */}
      <div className="space-y-4">
        {loading ? (
          <div className="p-12 text-center text-xs text-slate-400 bg-white rounded-3xl border">
            Loading grievances...
          </div>
        ) : filteredComplaints.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-400 bg-white rounded-3xl border">
            No complaints found matching current filters.
          </div>
        ) : (
          filteredComplaints.map((c) => (
            <div
              key={c.id}
              className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4 hover:border-slate-300 transition"
            >
              {/* Card Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-3">
                  <span className="font-mono font-black text-sm text-slate-900">{c.complaint_reference}</span>
                  {getStatusBadge(c.status)}
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border">
                    {c.category.replace('_', ' ')}
                  </span>
                </div>
                <div className="text-[11px] text-slate-400">
                  Filed on {new Date(c.created_at).toLocaleString()} by <strong>{c.created_by_name}</strong> ({c.created_by_role})
                </div>
              </div>

              {/* Body */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 text-xs">
                <div className="lg:col-span-2 space-y-2">
                  <h4 className="font-black text-sm text-slate-900">{c.title}</h4>
                  <p className="text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-2xl border border-slate-200">
                    "{c.description}"
                  </p>

                  {/* Evidence Attachments */}
                  {c.evidence && c.evidence.length > 0 && (
                    <div className="flex items-center gap-2 pt-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Evidence:</span>
                      {c.evidence.map((url, idx) => (
                        <a
                          key={idx}
                          href={url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-700 hover:underline bg-blue-50 px-2 py-0.5 rounded border border-blue-200"
                        >
                          <FileText className="w-3 h-3" />
                          <span>Attachment {idx + 1}</span>
                          <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                        </a>
                      ))}
                    </div>
                  )}

                  {/* Resolution Notes if Resolved */}
                  {c.resolution_notes && (
                    <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 space-y-1">
                      <div className="font-black text-[11px] flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Binding Resolution Order ({new Date(c.resolved_at || '').toLocaleDateString()})</span>
                      </div>
                      <p className="text-[11px] leading-relaxed">{c.resolution_notes}</p>
                    </div>
                  )}

                  {/* Escalation Notes if Escalated */}
                  {c.escalation_reason && (
                    <div className="p-3 rounded-2xl bg-purple-50 border border-purple-200 text-purple-900 space-y-1">
                      <div className="font-black text-[11px] flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5 text-purple-600" />
                        <span>Escalated to State DPI Tribunal: {c.escalation_reason}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Right: Actions and Timeline */}
                <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200 flex flex-col justify-between">
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Conciliation Actions
                    </span>

                    {c.status === 'OPEN' && (
                      <Button
                        size="sm"
                        onClick={() => handleStartReview(c)}
                        className="w-full text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white shadow-xs"
                      >
                        Begin 48h Conciliation Review
                      </Button>
                    )}

                    {['OPEN', 'UNDER_REVIEW'].includes(c.status) && (
                      <div className="space-y-2">
                        <Button
                          size="sm"
                          onClick={() => {
                            setActiveComplaint(c);
                            setResolveModalOpen(true);
                          }}
                          className="w-full text-xs font-bold bg-emerald-700 hover:bg-emerald-800 text-white shadow-xs"
                        >
                          Record Resolution Order
                        </Button>

                        <button
                          type="button"
                          onClick={() => {
                            setActiveComplaint(c);
                            setEscalateModalOpen(true);
                          }}
                          className="w-full py-1.5 rounded-xl border border-purple-300 text-purple-800 hover:bg-purple-50 text-xs font-bold transition"
                        >
                          Escalate to State DPI Admin
                        </button>
                      </div>
                    )}

                    {c.status === 'RESOLVED' && (
                      <div className="text-center py-2 text-emerald-800 font-bold text-xs flex items-center justify-center gap-1">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Case Closed
                      </div>
                    )}
                  </div>

                  {/* Action Count */}
                  <div className="text-[10px] text-slate-400 border-t border-slate-200 pt-2 flex justify-between">
                    <span>{c.actions.length} audit trail events</span>
                    <span>Coop: {c.cooperative_code}</span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Resolution Modal */}
      {resolveModalOpen && activeComplaint && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-extrabold text-base text-slate-900">Record Binding Dispute Resolution</h3>
              <button onClick={() => setResolveModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleResolve} className="space-y-4 text-xs">
              <p className="text-slate-600 font-medium">
                Resolving dispute for complaint <strong>{activeComplaint.complaint_reference}</strong> ({activeComplaint.category}).
              </p>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Conciliation Settlement Decision & Actions Taken <span className="text-rose-500">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  value={resolutionNotes}
                  onChange={(e) => setResolutionNotes(e.target.value)}
                  placeholder="Detail the agreed settlement (e.g. free revisit scheduled, tariff adjustment credited, replacement part supplied)..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-600"
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
                  className="px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold transition shadow-sm"
                >
                  {actionLoading ? 'Recording...' : 'Issue Binding Resolution'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Escalation Modal */}
      {escalateModalOpen && activeComplaint && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-extrabold text-base text-purple-950">Escalate to State DPI Administrator</h3>
              <button onClick={() => setEscalateModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEscalate} className="space-y-4 text-xs">
              <p className="text-slate-600 font-medium">
                Escalating complaint <strong>{activeComplaint.complaint_reference}</strong> to the State DPI Grievance Tribunal.
              </p>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Reason for State Escalation <span className="text-rose-500">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  value={escalationReason}
                  onChange={(e) => setEscalationReason(e.target.value)}
                  placeholder="Specify grounds for escalation (e.g. uncooperative party, safety hazard, jurisdictional conflict)..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEscalateModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 font-bold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-5 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold transition shadow-sm"
                >
                  {actionLoading ? 'Escalating...' : 'Confirm Escalation'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
