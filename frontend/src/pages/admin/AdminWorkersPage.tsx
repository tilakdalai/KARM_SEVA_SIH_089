import React, { useState, useEffect } from 'react';
import {
  Search,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Star,
  SlidersHorizontal,
  X,
} from 'lucide-react';
import { adminService, PlatformWorkerRecord } from '../../services/adminService';

export const AdminWorkersPage: React.FC = () => {
  const [workers, setWorkers] = useState<PlatformWorkerRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [tradeFilter, setTradeFilter] = useState('ALL');
  const [groupFilter, setGroupFilter] = useState('ALL');
  const [flagFilter, setFlagFilter] = useState('ALL'); // ALL, FLAGGED_ONLY
  const [loading, setLoading] = useState(true);

  // Flag Resolution Modal State
  const [selectedWorker, setSelectedWorker] = useState<PlatformWorkerRecord | null>(null);
  const [resolutionType, setResolutionType] = useState<'CLEARED' | 'WARNING_ISSUED' | 'SUSPENDED'>('CLEARED');
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const fetchWorkers = async () => {
    try {
      setLoading(true);
      const data = await adminService.getWorkers();
      setWorkers(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkers();
  }, []);

  const handleResolveFlag = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedWorker) return;
    setSubmitting(true);
    try {
      await adminService.resolveWorkerFlag(selectedWorker.id, resolutionType, resolutionNotes);
      setMessage(`Flag resolution recorded for ${selectedWorker.name} (${selectedWorker.shram_id}). Audit log registered.`);
      setSelectedWorker(null);
      fetchWorkers();
      setTimeout(() => setMessage(null), 3500);
    } finally {
      setSubmitting(false);
    }
  };

  const filtered = workers.filter((w) => {
    const matchesSearch =
      w.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.shram_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.district.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.cooperative_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTrade = tradeFilter === 'ALL' || w.trade.toLowerCase().includes(tradeFilter.toLowerCase());
    const matchesGroup = groupFilter === 'ALL' || w.trade_group === groupFilter;
    const matchesFlag = flagFilter === 'ALL' || (flagFilter === 'FLAGGED_ONLY' && w.flagged);
    return matchesSearch && matchesTrade && matchesGroup && matchesFlag;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-extrabold uppercase tracking-wider bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
              State Workforce Directory
            </span>
            <span className="text-xs text-slate-500 font-medium">14,850 Registered • 83.6% Verified</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 mt-1">Platform Workers & Compliance Directory</h1>
          <p className="text-xs text-slate-500">
            State-wide worker directory, trade group policy distribution, and compliance review desk.
          </p>
        </div>

        <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-xs text-amber-900 space-y-0.5 max-w-sm">
          <div className="font-bold flex items-center gap-1">
            <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Governance Guardrail</span>
          </div>
          <p className="text-[11px] text-amber-800">
            System Administrators inspect compliance and resolve flags. Direct document modification is restricted to local Cooperatives.
          </p>
        </div>
      </div>

      {message && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-sm font-semibold flex items-center gap-2 shadow-sm animate-pulse">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by partner name, KARM ID, district, or union..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          <SlidersHorizontal className="w-4 h-4 text-slate-400" />
          <select
            value={tradeFilter}
            onChange={(e) => setTradeFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white font-semibold text-slate-800 focus:outline-none"
          >
            <option value="ALL">All Trades</option>
            <option value="Electrician">Electricians</option>
            <option value="Caregiver">Caregivers</option>
            <option value="Driver">Drivers</option>
            <option value="Plumber">Plumbers</option>
            <option value="Housekeeping">Housekeeping</option>
          </select>

          <select
            value={groupFilter}
            onChange={(e) => setGroupFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white font-semibold text-slate-800 focus:outline-none"
          >
            <option value="ALL">All Trade Groups</option>
            <option value="GROUP_A">Group A (Cert/Licence)</option>
            <option value="GROUP_B">Group B (Experience/Vouch)</option>
            <option value="GROUP_C">Group C (Skill Assessment)</option>
            <option value="GROUP_D">Group D (Basic/Sanitation)</option>
          </select>

          <select
            value={flagFilter}
            onChange={(e) => setFlagFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white font-semibold text-slate-800 focus:outline-none"
          >
            <option value="ALL">All Compliance States</option>
            <option value="FLAGGED_ONLY">Flagged for Audit (1)</option>
          </select>
        </div>
      </div>

      {/* Workers Roster Table */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900"></div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">Seva Partner &amp; KARM ID</th>
                  <th className="py-3 px-4">Trade & Policy Group</th>
                  <th className="py-3 px-4">Cooperative Union</th>
                  <th className="py-3 px-4">District</th>
                  <th className="py-3 px-4">Rating</th>
                  <th className="py-3 px-4">Jobs & DBT Disbursed</th>
                  <th className="py-3 px-4">Police Clearance</th>
                  <th className="py-3 px-4">Status & Compliance</th>
                  <th className="py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((w) => (
                  <tr key={w.id} className="hover:bg-slate-50 transition">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{w.name}</div>
                      <div className="font-mono text-[10px] text-slate-500 font-semibold">{w.shram_id}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-800">{w.trade}</div>
                      <span className="inline-block text-[9px] font-mono font-bold bg-slate-100 text-slate-700 px-1.5 py-0.2 rounded mt-0.5">
                        {w.trade_group}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-slate-800 text-[11px] max-w-xs">{w.cooperative_name}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{w.cooperative_code}</div>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-700">{w.district}</td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1 font-bold text-amber-600">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                        <span>{w.rating}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-mono font-bold text-slate-900">{w.jobs_completed} Jobs</div>
                      <div className="text-[10px] text-emerald-700 font-bold">₹{w.earnings_total.toLocaleString('en-IN')} DBT</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          w.police_verification === 'CLEARED'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {w.police_verification}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      {w.flagged ? (
                        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-rose-100 text-rose-800 flex items-center gap-1 w-max">
                          <AlertTriangle className="w-3 h-3 text-rose-600" />
                          FLAGGED
                        </span>
                      ) : (
                        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 flex items-center gap-1 w-max">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          VERIFIED
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      {w.flagged ? (
                        <button
                          onClick={() => {
                            setSelectedWorker(w);
                            setResolutionNotes(w.flag_reason || '');
                          }}
                          className="px-2.5 py-1 rounded bg-rose-600 hover:bg-rose-700 text-white font-bold text-[11px] shadow-sm transition"
                        >
                          Inspect Flag
                        </button>
                      ) : (
                        <button
                          onClick={() => alert(`Reviewing certified dossier for ${w.name} (${w.shram_id}). Read-only mode active.`)}
                          className="px-2.5 py-1 rounded border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-bold text-[11px] shadow-sm transition"
                        >
                          View Dossier
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Flag Resolution Modal */}
      {selectedWorker && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 border border-slate-200">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="font-extrabold text-base text-slate-900">Inspect Compliance Flag</h3>
                <p className="text-xs text-slate-500">{selectedWorker.name} ({selectedWorker.shram_id})</p>
              </div>
              <button onClick={() => setSelectedWorker(null)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleResolveFlag} className="space-y-4 text-xs">
              <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-lg text-rose-900 space-y-1">
                <div className="font-bold flex items-center gap-1">
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                  Regulatory Flag Reason
                </div>
                <p className="text-xs">{selectedWorker.flag_reason || 'Compliance verification audit pending.'}</p>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Select Adjudication Resolution
                </label>
                <select
                  value={resolutionType}
                  onChange={(e) => setResolutionType(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 font-bold text-slate-800 bg-white focus:outline-none"
                >
                  <option value="WARNING_ISSUED">Issue 7-Day Compliance Rectification Warning</option>
                  <option value="CLEARED">Clear Flag (Verified by State Registrar)</option>
                  <option value="SUSPENDED">Suspend Active Shift Dispatch</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Adjudication Findings & Notes <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={3}
                  required
                  value={resolutionNotes}
                  onChange={(e) => setResolutionNotes(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:ring-2 focus:ring-slate-900 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedWorker(null)}
                  className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 font-bold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold transition shadow-sm"
                >
                  {submitting ? 'Saving...' : 'Submit Resolution & Log Audit'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
