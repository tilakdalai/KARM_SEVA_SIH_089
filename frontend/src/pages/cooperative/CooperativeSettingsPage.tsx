import React, { useState } from 'react';
import {
  Save,
  CheckCircle2,
} from 'lucide-react';

export const CooperativeSettingsPage: React.FC = () => {
  const [unionName, setUnionName] = useState('Khurda District Urban Workers Cooperative Union');
  const [registrationCode] = useState('OD-KHR-COOP-041');
  const [district, setDistrict] = useState('Khurda / Bhubaneswar');
  const [officerInCharge, setOfficerInCharge] = useState('Sub-Divisional Cooperative Officer (Central)');
  const [welfarePercent, setWelfarePercent] = useState(10);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Cooperative Union Governance & Settings
            </h1>
            <span className="text-xs font-mono font-bold bg-slate-100 text-slate-800 px-2.5 py-0.5 rounded border border-slate-200">
              REG: {registrationCode}
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Odisha Cooperative Societies Act registry configurations and default floor allocation rules.
          </p>
        </div>
      </div>

      {saved && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-bold text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          Settings successfully updated and synchronized across all district dispatch nodes.
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSave} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Cooperative Legal Name *
            </label>
            <input
              type="text"
              required
              value={unionName}
              onChange={(e) => setUnionName(e.target.value)}
              className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:border-amber-500 font-semibold"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Registration Gazette Code *
            </label>
            <input
              type="text"
              required
              disabled
              value={registrationCode}
              className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-slate-200 bg-slate-100 font-mono text-slate-600"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Jurisdiction District *
            </label>
            <input
              type="text"
              required
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Designated Cooperative Officer *
            </label>
            <input
              type="text"
              required
              value={officerInCharge}
              onChange={(e) => setOfficerInCharge(e.target.value)}
              className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
            Worker Welfare Reserve Allocation (%) *
          </label>
          <input
            type="number"
            min="5"
            max="15"
            value={welfarePercent}
            onChange={(e) => setWelfarePercent(Number(e.target.value))}
            className="w-full text-xs px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:border-amber-500 font-semibold"
          />
          <p className="text-[11px] text-slate-500 mt-1">
            Mandatory 10% reserve for insurance premiums (PMSBY/BSKY) and zero-interest safety toolkit funds.
          </p>
        </div>

        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold shadow-md transition flex items-center gap-2"
          >
            <Save className="w-4 h-4 text-amber-400" />
            Save Governance Configurations
          </button>
        </div>
      </form>
    </div>
  );
};
