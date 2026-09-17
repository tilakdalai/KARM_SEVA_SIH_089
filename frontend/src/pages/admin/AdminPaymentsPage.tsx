import React from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  Wallet,
  TrendingUp,
  Download,
} from 'lucide-react';

export const AdminPaymentsPage: React.FC = () => {
  const settlementBatches = [
    {
      id: 'DBT-BATCH-2024-09-01',
      date: 'Today (01 Sep 2024)',
      workersCount: 842,
      grossAmount: 542000.0,
      workerTakeHome: 487800.0, // 90%
      welfareAllocation: 54200.0, // 10%
      platformFee: 0.0, // 0%
      bankRef: 'OSCB-RTGS-994102941',
      status: 'CLEARED_AND_SETTLED',
    },
    {
      id: 'DBT-BATCH-2024-08-31',
      date: 'Yesterday (31 Aug 2024)',
      workersCount: 796,
      grossAmount: 512400.0,
      workerTakeHome: 461160.0,
      welfareAllocation: 51240.0,
      platformFee: 0.0,
      bankRef: 'OSCB-RTGS-882194012',
      status: 'CLEARED_AND_SETTLED',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-extrabold uppercase tracking-wider bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
              Escrow Architecture
            </span>
            <span className="text-xs text-slate-500 font-medium">Odisha State Cooperative Bank (OSCB)</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 mt-1">Payments, Escrow & Direct DBT Flow</h1>
          <p className="text-xs text-slate-500">
            Automated direct bank settlements under the 90% worker + 10% welfare + 0% platform commission statutory formula.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-emerald-50 text-emerald-800 px-3.5 py-2 rounded-lg border border-emerald-200 text-xs font-bold">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>0.00% Middleware Deduction Audited</span>
        </div>
      </div>

      {/* 3 Macro Settlement Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-emerald-50 p-5 rounded-xl border border-emerald-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-emerald-800 text-xs font-bold uppercase">
            <span>Direct Worker Take-Home (90%)</span>
            <Wallet className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-extrabold text-emerald-950">₹3.46 Cr</div>
          <div className="text-[11px] text-emerald-700 font-medium">Same-Day DBT to Worker Accounts</div>
        </div>

        <div className="bg-blue-50 p-5 rounded-xl border border-blue-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-blue-800 text-xs font-bold uppercase">
            <span>Welfare Trust Fund (10%)</span>
            <TrendingUp className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-extrabold text-blue-950">₹38.45 Lakh</div>
          <div className="text-[11px] text-blue-700 font-medium">PMSBY/BSKY Insurance & Safety Toolkits</div>
        </div>

        <div className="bg-slate-900 p-5 rounded-xl text-white shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase">
            <span>Platform Middleware Fee</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-extrabold text-emerald-400">₹0.00 (0%)</div>
          <div className="text-[11px] text-slate-400 font-medium">100% Free Public Digital Rail (Govt Funded)</div>
        </div>
      </div>

      {/* Daily Settlement Batches Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 space-y-4">
        <div className="flex items-center justify-between border-b pb-3">
          <div>
            <h2 className="font-bold text-slate-900 text-base">OSCB Daily Direct Bank Clearing Batches</h2>
            <p className="text-xs text-slate-500">Immutable ledger entries synchronized with State Treasury Gateway</p>
          </div>

          <button
            onClick={() => alert('Downloading signed OSCB settlement audit ledger...')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Clearing Ledger</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-2.5 px-3">Batch ID</th>
                <th className="py-2.5 px-3">Date</th>
                <th className="py-2.5 px-3">Workers Paid</th>
                <th className="py-2.5 px-3">Gross Turnover</th>
                <th className="py-2.5 px-3">Worker 90% DBT</th>
                <th className="py-2.5 px-3">Coop 10% Trust</th>
                <th className="py-2.5 px-3">Bank UTR / Ref</th>
                <th className="py-2.5 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {settlementBatches.map((b) => (
                <tr key={b.id} className="hover:bg-slate-50 transition">
                  <td className="py-3 px-3 font-mono font-bold text-slate-900">{b.id}</td>
                  <td className="py-3 px-3 font-medium text-slate-700">{b.date}</td>
                  <td className="py-3 px-3 font-bold text-slate-900">{b.workersCount} Staff</td>
                  <td className="py-3 px-3 font-bold text-slate-900">₹{b.grossAmount.toLocaleString('en-IN')}</td>
                  <td className="py-3 px-3 font-bold text-emerald-700">₹{b.workerTakeHome.toLocaleString('en-IN')}</td>
                  <td className="py-3 px-3 font-bold text-blue-700">₹{b.welfareAllocation.toLocaleString('en-IN')}</td>
                  <td className="py-3 px-3 font-mono text-[10px] text-slate-500">{b.bankRef}</td>
                  <td className="py-3 px-3">
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 flex items-center gap-1 w-max">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      SETTLED
                    </span>
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
