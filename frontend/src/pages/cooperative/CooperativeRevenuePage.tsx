import React from 'react';
import {
  IndianRupee,
  Download,
  ShieldCheck,
} from 'lucide-react';

export const CooperativeRevenuePage: React.FC = () => {
  const transactions = [
    {
      id: 'TXN-99120',
      bookingId: 'BK-8841',
      date: 'Today, 11:30 AM',
      workerName: 'Ramesh Chandra Behera',
      customerName: 'Amiya Patnaik',
      grossAmount: 450,
      workerShare: 405, // 90%
      coopWelfareShare: 45, // 10% dedicated to worker medical/pension fund
      platformFee: 0, // 0% platform take
      status: 'ESCROW_RECONCILED',
    },
    {
      id: 'TXN-99119',
      bookingId: 'BK-8842',
      date: 'Today, 10:15 AM',
      workerName: 'Sunita Majhi',
      customerName: 'Dr. Smita Mishra',
      grossAmount: 1200,
      workerShare: 1080,
      coopWelfareShare: 120,
      platformFee: 0,
      status: 'ESCROW_RECONCILED',
    },
    {
      id: 'TXN-99118',
      bookingId: 'BK-8840',
      date: 'Today, 09:45 AM',
      workerName: 'Tapan Kumar Das',
      customerName: 'Debabrata Das',
      grossAmount: 450,
      workerShare: 405,
      coopWelfareShare: 45,
      platformFee: 0,
      status: 'DISBURSED_TO_BANK',
    },
  ];

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-12">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Revenue, Escrow & Welfare Ledger
            </h1>
            <span className="text-xs font-bold bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full border border-emerald-200">
              0% Platform Commission
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Odisha State Cooperative Bank escrow gateway. 90% direct member payout + 10% dedicated union welfare fund.
          </p>
        </div>

        <button
          onClick={() => alert('Downloading RBI / State Cooperative Audited Ledger CSV...')}
          className="px-3.5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition"
        >
          <Download className="w-4 h-4" />
          Download Audit Ledger
        </button>
      </div>

      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Today's Gross Volume</div>
          <div className="text-3xl font-black text-slate-900 flex items-center">
            <IndianRupee className="w-6 h-6 text-slate-400" />
            48,600
          </div>
          <div className="text-xs text-emerald-600 font-semibold mt-1">100% Escrow Protected</div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Member Take-Home Share (90%)</div>
          <div className="text-3xl font-black text-emerald-700 flex items-center">
            <IndianRupee className="w-6 h-6 text-emerald-500" />
            43,740
          </div>
          <div className="text-xs text-slate-500 font-medium mt-1">Direct DBT to worker Aadhaar Bank Accounts</div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Union Welfare Fund (10%)</div>
          <div className="text-3xl font-black text-blue-700 flex items-center">
            <IndianRupee className="w-6 h-6 text-blue-500" />
            4,860
          </div>
          <div className="text-xs text-slate-500 font-medium mt-1">Worker accidental insurance & safety gear</div>
        </div>
      </div>

      {/* Escrow Transactions Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-slate-900 text-sm">Escrow Settlement Ledger (Real-time)</h3>
          <span className="text-xs text-slate-500">Gateway: OSCB / NPCI Unified Escrow</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">
                <th className="py-3.5 px-4">Txn ID / Ref</th>
                <th className="py-3.5 px-4">Booking Ref</th>
                <th className="py-3.5 px-4">Member Beneficiary</th>
                <th className="py-3.5 px-4">Gross Amt</th>
                <th className="py-3.5 px-4">Worker Payout (90%)</th>
                <th className="py-3.5 px-4">Welfare Fund (10%)</th>
                <th className="py-3.5 px-4">Settlement Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {transactions.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50/80 transition">
                  <td className="py-3.5 px-4">
                    <span className="font-mono font-bold text-slate-900">{t.id}</span>
                    <div className="text-[10px] text-slate-400">{t.date}</div>
                  </td>
                  <td className="py-3.5 px-4 font-mono font-semibold text-slate-700">{t.bookingId}</td>
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900">{t.workerName}</div>
                    <div className="text-[10px] text-slate-500">Citizen: {t.customerName}</div>
                  </td>
                  <td className="py-3.5 px-4 font-extrabold text-slate-900">₹{t.grossAmount}</td>
                  <td className="py-3.5 px-4 font-bold text-emerald-700">₹{t.workerShare}</td>
                  <td className="py-3.5 px-4 font-bold text-blue-700">₹{t.coopWelfareShare}</td>
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center gap-1 font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 text-[10px]">
                      <ShieldCheck className="w-3 h-3 text-emerald-600" />
                      {t.status.replace('_', ' ')}
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
