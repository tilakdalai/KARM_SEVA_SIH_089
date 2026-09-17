import React from 'react';
import { ShieldCheck } from 'lucide-react';

export const AdminVerificationPage: React.FC = () => {
  const policies = [
    {
      group: 'GROUP A',
      title: 'Certified & High-Risk Trades',
      trades: 'Electricians, Commercial Drivers, Patient Caregivers',
      statutoryRequirement: 'Mandatory Government Certificate / State Driving Licence + Police Verification',
      verifiedCount: 4210,
      complianceRate: '98.4%',
    },
    {
      group: 'GROUP B',
      title: 'Experience & Skilled Trades',
      trades: 'Plumbers, Elderly Caregivers, Child Caregivers',
      statutoryRequirement: 'Prior Experience Proof + Cooperative Peer Vouching & Verification',
      verifiedCount: 3840,
      complianceRate: '94.2%',
    },
    {
      group: 'GROUP C',
      title: 'Artisan & Technical Trades',
      trades: 'Carpenters, Painters, Gardeners, Technicians',
      statutoryRequirement: 'Skill Assessment Evidence / Trade Portfolio + Peer Endorsement',
      verifiedCount: 2680,
      complianceRate: '91.8%',
    },
    {
      group: 'GROUP D',
      title: 'General & Support Services',
      trades: 'Housekeeping, General Helpers, Campus Cleaners',
      statutoryRequirement: 'Aadhaar / Voter ID Identity Verification + Local Address Proof',
      verifiedCount: 1690,
      complianceRate: '96.5%',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-extrabold uppercase tracking-wider bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
              Quality Assurance & Compliance
            </span>
            <span className="text-xs text-slate-500 font-medium">Group A/B/C/D Governance Policy</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 mt-1">Verification Policy & Quality Audit Oversight</h1>
          <p className="text-xs text-slate-500">
            State-level verification standards ensuring non-discriminatory, skill-calibrated public trust.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-emerald-50 text-emerald-800 px-3.5 py-2 rounded-lg border border-emerald-200 text-xs font-bold">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>12,420 Certified Digital Passports Active</span>
        </div>
      </div>

      {/* 4 Policy Groups */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {policies.map((p, idx) => (
          <div key={idx} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-extrabold px-2.5 py-1 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
                  {p.group}
                </span>
                <h2 className="text-base font-bold text-slate-900 mt-2">{p.title}</h2>
                <div className="text-xs text-slate-500 mt-0.5">{p.trades}</div>
              </div>

              <div className="text-right">
                <div className="text-lg font-extrabold text-slate-900">{p.verifiedCount.toLocaleString('en-IN')}</div>
                <div className="text-[10px] text-emerald-700 font-bold">{p.complianceRate} Audit Valid</div>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-1">
              <div className="font-bold text-slate-700 text-[11px] uppercase tracking-wider">
                Statutory Verification Requirement:
              </div>
              <p className="text-slate-600 text-xs leading-relaxed">{p.statutoryRequirement}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
