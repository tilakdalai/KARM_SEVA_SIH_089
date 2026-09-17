import React from 'react';
import { UserX, RefreshCw, AlertCircle } from 'lucide-react';

export const LeaveReplacementWidget: React.FC = () => {
  const alerts = [
    {
      id: 'lr-1',
      workerName: 'Tapan Kumar Das',
      shramId: 'KS-OD-2024-1044',
      trade: 'Master Plumber',
      leaveType: 'Medical Emergency (Fever)',
      affectedJob: 'Job #BK-8841 (Saheed Nagar)',
      suggestedReplacement: 'Lalit Pradhan (4.8★, 1.1km)',
      urgency: 'HIGH',
      slaTimer: '18 mins remaining',
    },
    {
      id: 'lr-2',
      workerName: 'Bijay Mohanty',
      shramId: 'KS-OD-2024-4011',
      trade: 'Patient Caregiver',
      leaveType: 'Approved Casual Leave',
      affectedJob: 'Job #BK-8890 (Nayapalli Shift)',
      suggestedReplacement: 'Sunita Majhi (4.95★, 2.3km)',
      urgency: 'SCHEDULED',
      slaTimer: 'Shift begins in 3 hrs',
    },
  ];

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full">
      <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center">
            <UserX className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-sm">Leave & Replacement Dispatch</h3>
            <p className="text-xs text-slate-500">Automated SLA backup matching for absent workers</p>
          </div>
        </div>
        <span className="text-xs font-bold bg-rose-50 text-rose-700 px-2 py-0.5 rounded border border-rose-200">
          2 Pending Actions
        </span>
      </div>

      <div className="p-4 sm:p-5 space-y-3 flex-1 overflow-y-auto max-h-80">
        {alerts.map((item) => (
          <div
            key={item.id}
            className="p-3.5 rounded-lg border border-rose-200 bg-rose-50/30 hover:border-rose-300 transition space-y-2.5"
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 text-xs">{item.workerName}</span>
                  <span className="text-[10px] font-mono bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded">
                    {item.shramId}
                  </span>
                </div>
                <div className="text-xs text-rose-700 font-medium mt-0.5 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {item.leaveType} • {item.trade}
                </div>
              </div>
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-rose-100 text-rose-800">
                {item.urgency}
              </span>
            </div>

            <div className="bg-white p-2.5 rounded-md border border-slate-200 text-xs space-y-1">
              <div className="text-slate-500 font-medium text-[11px]">Affected Citizen Booking: <span className="text-slate-800 font-semibold">{item.affectedJob}</span></div>
              <div className="text-emerald-700 font-bold text-xs flex items-center gap-1.5">
                <RefreshCw className="w-3.5 h-3.5 text-emerald-600 animate-spin" />
                Suggested Backup: {item.suggestedReplacement}
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] font-medium text-slate-500">{item.slaTimer}</span>
              <button
                onClick={() => alert(`Replacement assigned: ${item.suggestedReplacement}`)}
                className="px-3 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded text-xs font-semibold shadow-sm transition"
              >
                Authorize Replacement
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
