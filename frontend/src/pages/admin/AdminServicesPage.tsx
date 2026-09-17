import React from 'react';
import {
  IndianRupee,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

export const AdminServicesPage: React.FC = () => {
  const benchmarks = [
    {
      trade: 'Cleaner & Housekeeping',
      group: 'GROUP_D',
      stateFloorRate: 450,
      gazetteClassification: 'Semi-Skilled Urban Service',
      coopCount: 48,
      status: 'GAZETTE_COMPLIANT',
    },
    {
      trade: 'Master Electrician',
      group: 'GROUP_A',
      stateFloorRate: 550,
      gazetteClassification: 'Highly Skilled Certified Trade (Licence Required)',
      coopCount: 48,
      status: 'GAZETTE_COMPLIANT',
    },
    {
      trade: 'Master Plumber',
      group: 'GROUP_B',
      stateFloorRate: 500,
      gazetteClassification: 'Skilled Trade (Experience / Peer Endorsed)',
      coopCount: 44,
      status: 'GAZETTE_COMPLIANT',
    },
    {
      trade: 'Patient & Elderly Caregiver',
      group: 'GROUP_A',
      stateFloorRate: 650,
      gazetteClassification: 'Certified Healthcare Assistant',
      coopCount: 36,
      status: 'GAZETTE_COMPLIANT',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-extrabold uppercase tracking-wider bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
              Statutory Floor Pricing
            </span>
            <span className="text-xs text-slate-500 font-medium">Odisha State Gazette Standards</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 mt-1">State Services & Minimum Floor Tariff Catalog</h1>
          <p className="text-xs text-slate-500">
            Official minimum floor wage protection preventing race-to-the-bottom undercut pricing across all cooperatives.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-emerald-50 text-emerald-800 px-3.5 py-2 rounded-lg border border-emerald-200 text-xs font-bold">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Odisha Minimum Wages Act Sync Active</span>
        </div>
      </div>

      {/* Benchmarks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {benchmarks.map((b, idx) => (
          <div key={idx} className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-slate-900 text-base">{b.trade}</span>
                  <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded">
                    {b.group}
                  </span>
                </div>
                <div className="text-xs text-slate-500 mt-1">{b.gazetteClassification}</div>
              </div>

              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                ACTIVE
              </span>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-600">Statutory Floor Minimum Rate:</span>
              <span className="text-base font-extrabold text-slate-900 flex items-center gap-0.5">
                <IndianRupee className="w-4 h-4 text-emerald-600" />
                {b.stateFloorRate}/day
              </span>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
              <span>Adopted across <strong className="text-slate-800">{b.coopCount} Cooperatives</strong></span>
              <span>100% Minimum Wage Compliance</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
