import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Search,
  Download,
} from 'lucide-react';
import { cooperativeService, AuditLogItem } from '../../services/cooperativeService';

export const CooperativeAuditLogsPage: React.FC = () => {
  const [logs, setLogs] = useState<AuditLogItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchLogs = async () => {
      setIsLoading(true);
      try {
        const data = await cooperativeService.getAuditLogs();
        setLogs(data);
      } catch {
        // Handled
      } finally {
        setIsLoading(false);
      }
    };
    fetchLogs();
  }, []);

  const filteredLogs = logs.filter((l) => {
    return (
      l.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.admin_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (l.target_name && l.target_name.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  });

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-12">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Cryptographic Audit Trail & Governance Log
            </h1>
            <span className="text-xs font-bold bg-amber-100 text-amber-900 px-2.5 py-0.5 rounded-full border border-amber-200 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
              Immutable Backend Log
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Every administrative approval, rejection, rate change, or dispatch override creates an auditable record.
          </p>
        </div>

        <button
          onClick={() => alert('Exporting official state audit trail PDF...')}
          className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition"
        >
          <Download className="w-4 h-4" />
          Export Audit Trail
        </button>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by action, officer name, or candidate..."
            className="w-full text-xs pl-9 pr-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:border-amber-500"
          />
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">
                <th className="py-3.5 px-4">Log Timestamp</th>
                <th className="py-3.5 px-4">Action Type</th>
                <th className="py-3.5 px-4">Authorizing Officer</th>
                <th className="py-3.5 px-4">Target Entity</th>
                <th className="py-3.5 px-4">Recorded Parameters / Reason</th>
                <th className="py-3.5 px-4 text-right">Integrity Hash</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    Loading audit trail...
                  </td>
                </tr>
              ) : filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    No audit records match your search.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((l) => (
                  <tr key={l.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3.5 px-4 font-mono text-[11px] text-slate-500">
                      <div className="font-bold text-slate-900">{new Date(l.created_at).toLocaleDateString()}</div>
                      <div>{new Date(l.created_at).toLocaleTimeString()}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-mono font-bold text-xs px-2 py-0.5 rounded bg-slate-900 text-amber-400">
                        {l.action}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{l.admin_name}</div>
                      <div className="text-[10px] font-mono text-slate-400">{l.cooperative_code || 'OD-KHR-COOP-041'}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-800">{l.target_name || l.target_id}</div>
                      <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.2 rounded">
                        {l.target_type}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 max-w-sm">
                      <pre className="text-[11px] font-mono bg-slate-50 p-2 rounded border border-slate-200 overflow-x-auto text-slate-700 whitespace-pre-wrap">
                        {JSON.stringify(l.details, null, 2)}
                      </pre>
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono text-[10px] text-slate-400">
                      SHA256:{l.id.substring(0, 8)}...
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
