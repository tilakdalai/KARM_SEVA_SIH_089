import React from 'react';
import {
  IndianRupee,
  Users,
  Download,
} from 'lucide-react';

export const CooperativeWelfarePage: React.FC = () => {
  const welfareSchemes = [
    {
      id: 'WLF-01',
      title: 'Pradhan Mantri Suraksha Bima Yojana (PMSBY)',
      coverage: '₹2,00,000 Accidental Death & Disability',
      premiumSource: '100% Subsidized by Cooperative Welfare Escrow',
      activeEnrolledMembers: 248,
      status: 'ALL_MEMBERS_COVERED',
    },
    {
      id: 'WLF-02',
      title: 'Biju Swasthya Kalyan Yojana (BSKY) / Ayushman Card Integration',
      coverage: '₹5,00,000 Annual Cashless Hospitalization per family',
      premiumSource: 'Government of Odisha Direct Beneficiary Mapping',
      activeEnrolledMembers: 236,
      status: 'INTEGRATED_ACTIVE',
    },
    {
      id: 'WLF-03',
      title: 'Cooperative Emergency Tool & Safety Equipment Grant',
      coverage: '₹5,000 Zero-interest micro-loan for ISI-grade toolkits',
      premiumSource: 'Khurda Cooperative Union Revolving Fund',
      activeEnrolledMembers: 54,
      status: 'OPEN_FOR_APPLICATIONS',
    },
  ];

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-12">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Worker Welfare, Insurance & Pension Trust
            </h1>
            <span className="text-xs font-bold bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full border border-emerald-200">
              100% Social Security Coverage
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Khurda District Urban Workers Cooperative Union Welfare Board. Automatic social protection financed through platform escrow.
          </p>
        </div>

        <button
          onClick={() => alert('Exporting Welfare Registry for District Labour Officer...')}
          className="px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition"
        >
          <Download className="w-4 h-4" />
          Export Welfare Roster
        </button>
      </div>

      {/* Welfare Fund Status Card */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-1">
            Current Cooperative Welfare Reserve (OSCB Account)
          </div>
          <div className="text-3xl font-black flex items-center text-white">
            <IndianRupee className="w-7 h-7 text-amber-400" />
            4,86,400.00
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            Accumulated via 10% transparent escrow allocation. Audited monthly under Odisha Cooperative Societies Act.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-3.5 bg-slate-800/80 rounded-xl border border-slate-700 text-right">
            <div className="text-[10px] text-slate-400 uppercase font-bold">Claims Paid (2024)</div>
            <div className="text-lg font-bold text-emerald-400">14 Claims (₹92,000)</div>
          </div>
        </div>
      </div>

      {/* Welfare Schemes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {welfareSchemes.map((s) => (
          <div
            key={s.id}
            className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between space-y-4"
          >
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] font-bold text-slate-400">{s.id}</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                  {s.status.replace(/_/g, ' ')}
                </span>
              </div>

              <h3 className="font-extrabold text-slate-900 text-base leading-snug">{s.title}</h3>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                <div className="text-[10px] uppercase font-bold text-slate-400">Policy Benefit</div>
                <div className="font-bold text-slate-800">{s.coverage}</div>
              </div>

              <p className="text-xs text-slate-500 font-medium">Source: {s.premiumSource}</p>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <div className="text-xs text-slate-600 font-bold flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-slate-400" />
                {s.activeEnrolledMembers} Covered
              </div>

              <button
                onClick={() => alert(`Reviewing beneficiary roster for ${s.title}`)}
                className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs transition"
              >
                Beneficiaries
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
