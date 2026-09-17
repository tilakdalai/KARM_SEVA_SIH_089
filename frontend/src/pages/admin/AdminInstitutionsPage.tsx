import React from 'react';
import { CheckCircle2, ShieldCheck } from 'lucide-react';

export const AdminInstitutionsPage: React.FC = () => {
  const institutions = [
    {
      id: 'inst-01',
      name: 'All India Institute of Medical Sciences (AIIMS Bhubaneswar)',
      type: 'Autonomous Government Hospital & Medical College',
      district: 'Bhubaneswar',
      active_slas: 2,
      workers_deployed: 28,
      monthly_procurement: 184500.0,
      nodal_officer: 'Dr. Manoranjan Mohanty',
      cooperative: 'Khurda District Urban Workers Cooperative Union',
      status: 'ACTIVE_SLA',
    },
    {
      id: 'inst-02',
      name: 'DAV Public School (Unit 8, Bhubaneswar)',
      type: 'Educational Institution',
      district: 'Bhubaneswar',
      active_slas: 1,
      workers_deployed: 14,
      monthly_procurement: 92400.0,
      nodal_officer: 'S. N. Pattnaik',
      cooperative: 'Khurda District Urban Workers Cooperative Union',
      status: 'ACTIVE_SLA',
    },
    {
      id: 'inst-03',
      name: 'SCB Medical College & Hospital (Cuttack)',
      type: 'State Government Medical Directorate',
      district: 'Cuttack',
      active_slas: 3,
      workers_deployed: 45,
      monthly_procurement: 320000.0,
      nodal_officer: 'Dr. Arati Tripathy',
      cooperative: 'Cuttack Municipal Shramik Kalyan Cooperative',
      status: 'ACTIVE_SLA',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-extrabold uppercase tracking-wider bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
              B2B / B2G Framework
            </span>
            <span className="text-xs text-slate-500 font-medium">134 Registered Institutions</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 mt-1">Institutional Procurement Oversight</h1>
          <p className="text-xs text-slate-500">
            Public and private institutional SLA compliance, workforce deployments, and escrow clearing.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-emerald-50 text-emerald-800 px-3.5 py-2 rounded-lg border border-emerald-200 text-xs font-bold">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Odisha Public Procurement Rules 2014 Compliant</span>
        </div>
      </div>

      {/* Institutional Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Organization & Directorate</th>
                <th className="py-3 px-4">Type & District</th>
                <th className="py-3 px-4">Active SLAs</th>
                <th className="py-3 px-4">Deployed Staff</th>
                <th className="py-3 px-4">Monthly Value</th>
                <th className="py-3 px-4">Contracting Union</th>
                <th className="py-3 px-4">Nodal Officer</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {institutions.map((inst) => (
                <tr key={inst.id} className="hover:bg-slate-50 transition">
                  <td className="py-3.5 px-4 font-bold text-slate-900">{inst.name}</td>
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-slate-800">{inst.type}</div>
                    <div className="text-[10px] text-slate-500">{inst.district}</div>
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-indigo-700">{inst.active_slas} SLAs</td>
                  <td className="py-3.5 px-4 font-bold text-slate-900">{inst.workers_deployed} Staff</td>
                  <td className="py-3.5 px-4 font-extrabold text-slate-900">
                    ₹{inst.monthly_procurement.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3.5 px-4 font-medium text-slate-700">{inst.cooperative}</td>
                  <td className="py-3.5 px-4 text-slate-600">{inst.nodal_officer}</td>
                  <td className="py-3.5 px-4">
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 flex items-center gap-1 w-max">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      ACTIVE SLA
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
