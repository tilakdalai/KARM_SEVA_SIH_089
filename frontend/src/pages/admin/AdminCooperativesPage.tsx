import React, { useState, useEffect } from 'react';
import {
  Search,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Star,
  ShieldCheck,
  Building2,
  Calendar,
  X,
  SlidersHorizontal,
} from 'lucide-react';
import { adminService, CooperativeRecord } from '../../services/adminService';

export const AdminCooperativesPage: React.FC = () => {
  const [cooperatives, setCooperatives] = useState<CooperativeRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);

  // Action Modal State
  const [selectedCoop, setSelectedCoop] = useState<CooperativeRecord | null>(null);
  const [actionType, setActionType] = useState<'APPROVE' | 'SUSPEND' | 'PUT_UNDER_REVIEW'>('APPROVE');
  const [reason, setReason] = useState('');
  const [adminNotes, setAdminNotes] = useState('');
  const [submittingAction, setSubmittingAction] = useState(false);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const fetchCooperatives = async () => {
    try {
      setLoading(true);
      const data = await adminService.getCooperatives(statusFilter);
      setCooperatives(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCooperatives();
  }, [statusFilter]);

  const handleOpenActionModal = (coop: CooperativeRecord, action: 'APPROVE' | 'SUSPEND' | 'PUT_UNDER_REVIEW') => {
    setSelectedCoop(coop);
    setActionType(action);
    setReason(
      action === 'APPROVE'
        ? 'Annual regulatory inspection verified under Odisha Cooperative Societies Act, 1962.'
        : action === 'SUSPEND'
        ? 'Statutory non-compliance in welfare fund remittance or high unresolved citizen disputes.'
        : 'Quality audit triggered for trade document verification verification anomalies.'
    );
    setAdminNotes('');
  };

  const handleExecuteAction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCoop) return;
    setSubmittingAction(true);
    try {
      await adminService.updateCooperativeStatus(selectedCoop.code, actionType, reason, adminNotes);
      setActionMessage(`Cooperative ${selectedCoop.name} accreditation updated to ${actionType}. Immutable audit log generated.`);
      setSelectedCoop(null);
      fetchCooperatives();
      setTimeout(() => setActionMessage(null), 3000);
    } finally {
      setSubmittingAction(false);
    }
  };

  const filtered = cooperatives.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.district.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-extrabold uppercase tracking-wider bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
              State Cooperative Registry
            </span>
            <span className="text-xs text-slate-500 font-medium">Registrar of Cooperative Societies (RCS)</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 mt-1">Cooperative Societies Monitoring & Accreditation</h1>
          <p className="text-xs text-slate-500">
            Regulatory audit, workforce health, welfare fund governance, and accreditation state machines.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-emerald-50 text-emerald-800 px-3.5 py-2 rounded-lg border border-emerald-200 text-xs font-bold">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>48 Registered Unions (100% Statutory Compliant)</span>
        </div>
      </div>

      {actionMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-sm font-semibold flex items-center gap-2 shadow-sm animate-pulse">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{actionMessage}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search cooperative by union name, code (e.g. OD-KHR), or district..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900"
          />
        </div>

        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-slate-400" />
          <span className="text-xs text-slate-500 font-medium">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white font-semibold text-slate-800 focus:outline-none"
          >
            <option value="ALL">All Cooperatives</option>
            <option value="ACTIVE">Active (Accredited)</option>
            <option value="UNDER_REVIEW">Under Review</option>
            <option value="SUSPENDED">Suspended</option>
          </select>
        </div>
      </div>

      {/* Cooperatives Cards List */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900"></div>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((coop) => (
            <div
              key={coop.id}
              className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-5 hover:border-slate-300 transition"
            >
              {/* Top Row */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs bg-slate-100 text-slate-800 px-2 py-0.5 rounded">
                      {coop.code}
                    </span>
                    <span
                      className={`text-[10px] font-extrabold px-2 py-0.5 rounded ${
                        coop.status === 'ACTIVE'
                          ? 'bg-emerald-100 text-emerald-800'
                          : coop.status === 'UNDER_REVIEW'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {coop.status.replace('_', ' ')}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">Reg: {coop.registration_no}</span>
                  </div>

                  <h2 className="text-lg font-bold text-slate-900 mt-1.5">{coop.name}</h2>
                  <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-slate-400" />
                    <span>Jurisdiction: <strong className="text-slate-800">{coop.district}, {coop.state}</strong></span>
                    <span>•</span>
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>Accredited since {coop.accreditation_date}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-center">
                  <div className="flex items-center gap-1 bg-amber-50 text-amber-900 px-3 py-1.5 rounded-lg border border-amber-200 text-xs font-bold">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
                    <span>{coop.average_rating}</span>
                  </div>
                </div>
              </div>

              {/* 5 Operational Telemetry Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <div className="text-[11px] text-slate-500 font-medium">Active Workers</div>
                  <div className="font-extrabold text-base text-slate-900 mt-1">
                    {coop.active_workers.toLocaleString('en-IN')}
                  </div>
                  <div className="text-[10px] text-emerald-700 font-semibold">{coop.verification_rate} Verified</div>
                </div>

                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <div className="text-[11px] text-slate-500 font-medium">Jobs Completed</div>
                  <div className="font-extrabold text-base text-slate-900 mt-1">
                    {coop.jobs_completed.toLocaleString('en-IN')}
                  </div>
                  <div className="text-[10px] text-slate-500">99.1% on-time</div>
                </div>

                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <div className="text-[11px] text-slate-500 font-medium">Dispute Rate</div>
                  <div className="font-extrabold text-base text-slate-900 mt-1">{coop.complaint_rate}</div>
                  <div className="text-[10px] text-slate-500">&lt; 1% State Target</div>
                </div>

                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <div className="text-[11px] text-slate-500 font-medium">Gross Turnover</div>
                  <div className="font-extrabold text-base text-slate-900 mt-1">
                    ₹{(coop.revenue / 100000).toFixed(1)} L
                  </div>
                  <div className="text-[10px] text-emerald-700 font-semibold">90% Direct DBT</div>
                </div>

                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <div className="text-[11px] text-slate-500 font-medium">Welfare Trust Fund</div>
                  <div className="font-extrabold text-base text-indigo-900 mt-1">
                    ₹{(coop.welfare_fund_balance / 100000).toFixed(1)} L
                  </div>
                  <div className="text-[10px] text-indigo-700 font-semibold">10% Remittance Locked</div>
                </div>
              </div>

              {/* Action Buttons for System Admin */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 text-xs">
                <div className="text-slate-500 flex items-center gap-1">
                  <span>Authorized Action:</span>
                  <span className="font-semibold text-slate-800">State Regulatory Oversight</span>
                </div>

                <div className="flex items-center gap-2">
                  {coop.status !== 'ACTIVE' && (
                    <button
                      onClick={() => handleOpenActionModal(coop, 'APPROVE')}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Approve & Restore</span>
                    </button>
                  )}

                  {coop.status !== 'UNDER_REVIEW' && (
                    <button
                      onClick={() => handleOpenActionModal(coop, 'PUT_UNDER_REVIEW')}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs transition"
                    >
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>Put Under Review</span>
                    </button>
                  )}

                  {coop.status !== 'SUSPENDED' && (
                    <button
                      onClick={() => handleOpenActionModal(coop, 'SUSPEND')}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Suspend Accreditation</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Accreditation Action Modal */}
      {selectedCoop && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 border border-slate-200">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="font-extrabold text-base text-slate-900">
                  {actionType === 'APPROVE' ? 'Approve Cooperative' : actionType === 'SUSPEND' ? 'Suspend Accreditation' : 'Initiate Regulatory Review'}
                </h3>
                <p className="text-xs text-slate-500">{selectedCoop.name} ({selectedCoop.code})</p>
              </div>
              <button onClick={() => setSelectedCoop(null)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleExecuteAction} className="space-y-4 text-xs">
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-900 space-y-1">
                <div className="font-bold flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4 text-amber-600" />
                  Mandatory Audit Log Notice
                </div>
                <p className="text-[11px] leading-relaxed">
                  This action is recorded in the permanent Government Audit Trail with your IAS Digital Signature and IP address.
                </p>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Official Regulatory Reason <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={3}
                  required
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-slate-900 focus:outline-none"
                  placeholder="State regulatory reason..."
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Additional Internal Governance Notes
                </label>
                <input
                  type="text"
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none"
                  placeholder="e.g. Dispatched enquiry officer Mr. Mohapatra"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedCoop(null)}
                  className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 font-bold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingAction}
                  className={`px-5 py-2 rounded-lg text-white font-bold transition shadow-sm ${
                    actionType === 'APPROVE'
                      ? 'bg-emerald-600 hover:bg-emerald-500'
                      : actionType === 'SUSPEND'
                      ? 'bg-rose-600 hover:bg-rose-700'
                      : 'bg-amber-600 hover:bg-amber-700'
                  }`}
                >
                  {submittingAction ? 'Processing & Logging...' : 'Execute Regulatory Action'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
