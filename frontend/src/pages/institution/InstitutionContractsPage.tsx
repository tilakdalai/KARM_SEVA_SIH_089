import React, { useState, useEffect } from 'react';
import {
  Download,
  ShieldCheck,
  Calendar,
  Users2,
  IndianRupee,
  Building,
  CheckCircle2,
} from 'lucide-react';
import { institutionService, InstitutionalContractRecord } from '../../services/institutionService';

export const InstitutionContractsPage: React.FC = () => {
  const [contracts, setContracts] = useState<InstitutionalContractRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContracts = async () => {
      try {
        const data = await institutionService.getContracts();
        setContracts(data);
      } finally {
        setLoading(false);
      }
    };
    fetchContracts();
  }, []);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-extrabold uppercase tracking-wider bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
              Legal & Procurement
            </span>
            <span className="text-xs text-slate-500 font-medium">B2B / B2G Agreements</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 mt-1">Service Level Agreements (SLAs)</h1>
          <p className="text-xs text-slate-500">
            Binding tripartite agreements with Odisha State registered worker cooperatives.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-emerald-50 text-emerald-800 px-3.5 py-2 rounded-lg border border-emerald-200 text-xs font-semibold">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Odisha Cooperative Societies Act, 1962 Compliant</span>
        </div>
      </div>

      {/* Contracts List */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900"></div>
        </div>
      ) : (
        <div className="space-y-6">
          {contracts.map((cnt) => (
            <div
              key={cnt.id}
              className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-5 hover:border-slate-300 transition"
            >
              {/* Contract Top Row */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                      {cnt.id}
                    </span>
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                      {cnt.status}
                    </span>
                  </div>
                  <h2 className="text-lg font-bold text-slate-900 mt-1.5">{cnt.contract_title}</h2>
                  <div className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                    <Building className="w-3.5 h-3.5 text-slate-400" />
                    <span>Contracting Union: <strong className="text-slate-800">{cnt.cooperative_name}</strong> ({cnt.cooperative_code})</span>
                  </div>
                </div>

                <div className="text-right sm:self-center">
                  <div className="text-xs text-slate-500">Monthly Contract Value</div>
                  <div className="text-2xl font-extrabold text-slate-900 flex items-center sm:justify-end gap-1">
                    <IndianRupee className="w-5 h-5 text-emerald-600" />
                    {cnt.monthly_billing_amount.toLocaleString('en-IN')}
                  </div>
                  <div className="text-[11px] text-slate-500">Fixed Government Tariff</div>
                </div>
              </div>

              {/* SLA Terms & Guarantees */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-3">
                <div className="font-bold text-slate-800 text-[11px] uppercase tracking-wider">
                  Service Level Commitments & Terms
                </div>
                <p className="text-slate-700 leading-relaxed text-xs">
                  {cnt.sla_terms}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-200/80">
                  <div className="flex items-center gap-2">
                    <Users2 className="w-4 h-4 text-indigo-600 shrink-0" />
                    <div>
                      <div className="text-[10px] text-slate-500 font-medium">Duty Strength</div>
                      <div className="font-bold text-slate-900">{cnt.total_workers_assigned} Workers Deployed</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-indigo-600 shrink-0" />
                    <div>
                      <div className="text-[10px] text-slate-500 font-medium">Contract Period</div>
                      <div className="font-bold text-slate-900">{cnt.start_date} to {cnt.end_date}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <div>
                      <div className="text-[10px] text-slate-500 font-medium">Digital Verification</div>
                      <div className="font-bold text-emerald-700">Digitally Countersigned</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-1">
                <div className="text-xs text-slate-500">
                  Executed via KARM SEVA Institutional Smart Contracts Engine
                </div>

                <button
                  onClick={() => alert(`Downloading legally executed SLA contract for ${cnt.id}...`)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition shadow-sm"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Signed SLA Agreement (PDF)</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
