import React, { useState, useEffect } from 'react';
import { paymentService, SettlementCycleRecord } from '@/services/paymentService';
import {
  IndianRupee,
  CheckCircle2,
  Download,
  Send,
  RefreshCw,
  Building2,
} from 'lucide-react';
import { Button } from '@/components/common/Button';

export const CooperativeSettlementsPage: React.FC = () => {
  const [cycles, setCycles] = useState<SettlementCycleRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCycles = async () => {
    try {
      setLoading(true);
      const data = await paymentService.getSettlementCycles('OD-KHR-COOP-041');
      setCycles(data);
    } catch (err) {
      console.error('Failed to fetch settlement cycles:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCycles();
  }, []);

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-12">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Direct Worker DBT Bank Settlements & Weekly Cycles
            </h1>
            <span className="text-xs font-bold bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full border border-emerald-200">
              Same-Day Automated Clearing
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Aadhaar-seeded direct benefit transfers (DBT) & weekly institutional contract settlement batches.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchCycles}
            className="text-xs flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Refresh
          </Button>

          <Button
            size="sm"
            onClick={() => alert('Initiating manual on-demand mid-day settlement batch clearing...')}
            className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm"
          >
            <Send className="w-4 h-4" />
            Trigger Clearing Batch
          </Button>
        </div>
      </div>

      {/* Batch Cards */}
      <div className="space-y-4">
        {loading ? (
          <div className="p-12 text-center text-xs text-slate-400 bg-white rounded-2xl border">
            Loading settlement cycles...
          </div>
        ) : cycles.map((c) => (
          <div
            key={c.id}
            className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            <div className="space-y-1.5">
              <div className="flex items-center gap-3">
                <span className="font-mono font-bold text-slate-900 text-sm">{c.cycle_reference}</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  {c.status}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200">
                  {c.cycle_type} CYCLE
                </span>
              </div>
              <div className="text-xs text-slate-600 font-medium">
                Period: <strong>{c.start_date} to {c.end_date}</strong> • Total Shifts:{' '}
                <strong>{c.total_transactions} transactions</strong>
              </div>
              <div className="text-[11px] font-mono text-slate-400 flex items-center gap-2">
                <Building2 className="w-3.5 h-3.5 text-slate-500" />
                <span>Cooperative: {c.cooperative_code} • Gateway: Odisha State Cooperative Bank DBT</span>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="text-right">
                <div className="text-[10px] uppercase font-bold text-slate-400">Total Net Disbursed</div>
                <div className="text-xl font-extrabold text-slate-900 flex items-center justify-end">
                  <IndianRupee className="w-4 h-4 text-slate-400" />
                  {c.total_amount.toLocaleString('en-IN')}
                </div>
              </div>

              <button
                onClick={() => alert(`Downloading bank credit report for ${c.cycle_reference}`)}
                className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 transition"
                title="Download Bank Statement"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
