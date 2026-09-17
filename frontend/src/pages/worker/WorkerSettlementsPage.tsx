import React from 'react';
import { MOCK_SETTLEMENTS } from '@/services/workerDashboardMockData';
import { Card } from '@/components/common/Card';
import { 
  Building2, 
  FileText 
} from 'lucide-react';

export const WorkerSettlementsPage: React.FC = () => {
  return (
    <div className="space-y-6 pb-16 max-w-4xl mx-auto">
      
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-black text-gov-navy tracking-tight flex items-center gap-2">
          <Building2 className="w-6 h-6 text-gov-green" />
          <span>Bank Settlements & Remittances</span>
        </h1>
        <p className="text-xs sm:text-sm text-gov-muted">
          Daily cooperative batch remittances credited directly to your registered bank account
        </p>
      </div>

      {/* Settlements List */}
      <div className="space-y-4">
        {MOCK_SETTLEMENTS.map((settle) => (
          <Card key={settle.id} className="p-5 border-slate-200 bg-white">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-xs font-bold text-blue-800 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                    {settle.refNumber}
                  </span>
                  <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                    settle.status === 'CREDITED'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {settle.status}
                  </span>
                </div>

                <h4 className="font-extrabold text-sm text-gov-navy">
                  Batch Payout for {settle.jobsCount} Completed Shifts
                </h4>

                <p className="text-xs text-gov-muted">
                  Transferred to {settle.bankName} · {settle.date}
                </p>
              </div>

              <div className="text-left sm:text-right shrink-0">
                <span className="text-[10px] text-gov-muted uppercase block">Settled Amount</span>
                <span className="font-black text-2xl text-emerald-800">
                  ₹{settle.amount.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Breakdown Sub-strip */}
            <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between text-[11px] text-slate-500">
              <span>Base Wages: ₹{settle.breakdown.baseWage} · On-Time Incentives: ₹{settle.breakdown.incentive}</span>
              <button
                type="button"
                onClick={() => alert(`Downloading remittance slip for ${settle.refNumber}`)}
                className="font-bold text-gov-green hover:underline flex items-center gap-1"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Download Remittance Slip</span>
              </button>
            </div>
          </Card>
        ))}
      </div>

    </div>
  );
};
