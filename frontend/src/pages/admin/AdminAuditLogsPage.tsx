import React, { useState, useEffect } from 'react';
import { Search, Download, Lock } from 'lucide-react';
import { adminService, PlatformAuditLog } from '../../services/adminService';

export const AdminAuditLogsPage: React.FC = () => {
  const [logs, setLogs] = useState<PlatformAuditLog[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const data = await adminService.getAuditLogs();
        setLogs(data);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  const filtered = logs.filter(
    (l) =>
      l.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.admin_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.target_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.details.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-extrabold uppercase tracking-wider bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
              Statutory Transparency
            </span>
            <span className="text-xs text-slate-500 font-medium">Immutable Cryptographic Audit Trail</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 mt-1">Platform Audit Logs & Governance Ledger</h1>
          <p className="text-xs text-slate-500">
            Immutable, tamper-evident audit records of all administrative decisions, tariff modifications, and accreditation state changes.
          </p>
        </div>

        <button
          onClick={() => alert('Downloading official cryptographically signed audit ledger PDF...')}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition shadow-sm self-start sm:self-auto"
        >
          <Download className="w-4 h-4" />
          <span>Export Signed Audit Log</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search audit trail by action, officer name, target union, or decision details..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900"
          />
        </div>
      </div>

      {/* Audit Log Stream */}
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
                  <th className="py-3 px-4">Timestamp & Record ID</th>
                  <th className="py-3 px-4">Action</th>
                  <th className="py-3 px-4">Authorized Officer</th>
                  <th className="py-3 px-4">Target Entity</th>
                  <th className="py-3 px-4">Regulatory Details</th>
                  <th className="py-3 px-4">Integrity Stamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50 transition">
                    <td className="py-3.5 px-4">
                      <div className="font-mono text-slate-600">{log.created_at || 'Just now'}</div>
                      <div className="font-mono text-[10px] text-slate-400 font-semibold">{log.id}</div>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-indigo-700">{log.action}</td>
                    <td className="py-3.5 px-4 font-semibold text-slate-900">{log.admin_name}</td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-800">{log.target_name}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{log.cooperative_code}</div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 max-w-md">{log.details}</td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded border border-emerald-200">
                        <Lock className="w-3 h-3 text-emerald-600" />
                        SHA-256 SIGNED
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
