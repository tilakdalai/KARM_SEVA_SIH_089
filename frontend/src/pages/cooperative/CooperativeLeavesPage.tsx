import React, { useState } from 'react';
import {
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  Clock,
  ShieldAlert,
} from 'lucide-react';

export const CooperativeLeavesPage: React.FC = () => {
  const [leaves, setLeaves] = useState([
    {
      id: 'LV-101',
      workerName: 'Tapan Kumar Das',
      shramId: 'KS-OD-2024-1044',
      trade: 'Master Plumber',
      leaveType: 'Medical Emergency (Viral Fever)',
      startDate: '2024-09-02',
      endDate: '2024-09-04',
      status: 'PENDING_REPLACEMENT',
      assignedReplacement: 'Lalit Pradhan (4.8★, Khurda Unit)',
      affectedBookingsCount: 2,
    },
    {
      id: 'LV-102',
      workerName: 'Bijay Mohanty',
      shramId: 'KS-OD-2024-4011',
      trade: 'Senior Patient Caregiver',
      leaveType: 'Casual / Family Function',
      startDate: '2024-09-03',
      endDate: '2024-09-03',
      status: 'REPLACEMENT_RESOLVED',
      assignedReplacement: 'Sunita Majhi (4.95★, Khurda Unit)',
      affectedBookingsCount: 1,
    },
    {
      id: 'LV-103',
      workerName: 'Ranjan Sahoo',
      shramId: 'KS-OD-2024-6621',
      trade: 'Master Mason & Tile Layer',
      leaveType: 'Annual Cooperative Welfare Leave',
      startDate: '2024-09-05',
      endDate: '2024-09-08',
      status: 'APPROVED_STANDBY',
      assignedReplacement: 'Auto-allocation pool active',
      affectedBookingsCount: 0,
    },
  ]);

  const handleApprove = (id: string) => {
    setLeaves((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: 'REPLACEMENT_RESOLVED' } : item))
    );
    alert(`Leave and replacement authorization recorded for ${id}. Audit log created.`);
  };

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-12">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Leave & Automated Replacement Manager
            </h1>
            <span className="text-xs font-bold bg-rose-100 text-rose-800 px-2.5 py-0.5 rounded-full border border-rose-200">
              3 Active Requests
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Automated SLA contingency protocol: ensuring zero interrupted shifts for citizens through union peer matching.
          </p>
        </div>
      </div>

      {/* Contingency Protocol Card */}
      <div className="bg-amber-50 p-4 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
        <div>
          <strong>Odisha Public Service Guarantee (SLA):</strong> When a verified worker reports sudden sickness, the system automatically suggests the nearest union member possessing identical trade certifications within a 3km radius.
        </div>
      </div>

      {/* Leave Requests Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">
                <th className="py-3.5 px-4">Leave ID</th>
                <th className="py-3.5 px-4">Member Details</th>
                <th className="py-3.5 px-4">Category & Reason</th>
                <th className="py-3.5 px-4">Dates</th>
                <th className="py-3.5 px-4">Affected Citizen Shifts</th>
                <th className="py-3.5 px-4">Recommended Replacement</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {leaves.map((l) => (
                <tr key={l.id} className="hover:bg-slate-50/80 transition">
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-900">{l.id}</td>
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900">{l.workerName}</div>
                    <div className="text-[11px] font-mono text-slate-400">{l.shramId}</div>
                    <span className="text-[10px] font-semibold text-slate-600">{l.trade}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-semibold text-slate-800">{l.leaveType}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-slate-700">{l.startDate} to {l.endDate}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    {l.affectedBookingsCount > 0 ? (
                      <span className="inline-flex items-center gap-1 font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                        <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
                        {l.affectedBookingsCount} Active Bookings
                      </span>
                    ) : (
                      <span className="text-slate-400 font-medium">None</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-emerald-700 flex items-center gap-1">
                      <RefreshCw className="w-3.5 h-3.5 text-emerald-600" />
                      {l.assignedReplacement}
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    {l.status === 'REPLACEMENT_RESOLVED' ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        Resolved & Assigned
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                        <Clock className="w-3.5 h-3.5 text-amber-600" />
                        Pending Authorization
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    {l.status !== 'REPLACEMENT_RESOLVED' ? (
                      <button
                        onClick={() => handleApprove(l.id)}
                        className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-sm transition"
                      >
                        Authorize Match
                      </button>
                    ) : (
                      <span className="text-slate-400 text-xs font-semibold">Locked</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
