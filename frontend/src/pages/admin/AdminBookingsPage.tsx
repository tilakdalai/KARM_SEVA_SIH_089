import React from 'react';
import { ShieldCheck } from 'lucide-react';

export const AdminBookingsPage: React.FC = () => {
  const liveBookings = [
    {
      id: 'BK-2024-9120',
      citizen: 'Priyanka Sahoo',
      worker: 'Ramesh Chandra Behera',
      trade: 'Master Electrician',
      cooperative: 'Khurda District Urban Workers Cooperative Union',
      district: 'Bhubaneswar',
      amount: 650.0,
      shift_status: 'SERVICE_IN_PROGRESS',
      otp_verified: true,
    },
    {
      id: 'BK-2024-9121',
      citizen: 'Soumya Ranjan Mohapatra',
      worker: 'Sunita Majhi',
      trade: 'Patient Caregiver',
      cooperative: 'Khurda District Urban Workers Cooperative Union',
      district: 'Bhubaneswar',
      amount: 750.0,
      shift_status: 'ON_THE_WAY',
      otp_verified: true,
    },
    {
      id: 'BK-2024-9122',
      citizen: 'DAV Public School',
      worker: 'Cuttack Sanitization Batch 2 (6 Staff)',
      trade: 'Housekeeping Specialist',
      cooperative: 'Cuttack Municipal Shramik Kalyan Cooperative',
      district: 'Cuttack',
      amount: 2700.0,
      shift_status: 'COMPLETED',
      otp_verified: true,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-extrabold uppercase tracking-wider bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
              Live Operations Radar
            </span>
            <span className="text-xs text-slate-500 font-medium">68,240 Total Jobs • 412 Active Shifts</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 mt-1">Live Job Dispatches & Shift Telemetry</h1>
          <p className="text-xs text-slate-500">
            Real-time citizen and institutional job execution telemetry across Odisha districts.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-emerald-50 text-emerald-800 px-3.5 py-2 rounded-lg border border-emerald-200 text-xs font-bold">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Biometric / Geofence OTP Verified</span>
        </div>
      </div>

      {/* Live Dispatches Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Booking ID</th>
                <th className="py-3 px-4">Citizen / Institution</th>
                <th className="py-3 px-4">Assigned Worker & Trade</th>
                <th className="py-3 px-4">Cooperative Unit</th>
                <th className="py-3 px-4">District</th>
                <th className="py-3 px-4">Tariff Amount</th>
                <th className="py-3 px-4">Live Shift Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {liveBookings.map((b) => (
                <tr key={b.id} className="hover:bg-slate-50 transition">
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-900">{b.id}</td>
                  <td className="py-3.5 px-4 font-bold text-slate-800">{b.citizen}</td>
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900">{b.worker}</div>
                    <div className="text-[10px] text-indigo-700 font-semibold">{b.trade}</div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 text-[11px]">{b.cooperative}</td>
                  <td className="py-3.5 px-4 font-semibold text-slate-700">{b.district}</td>
                  <td className="py-3.5 px-4 font-extrabold text-slate-900">₹{b.amount.toLocaleString('en-IN')}</td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`text-[10px] font-extrabold px-2 py-0.5 rounded ${
                        b.shift_status === 'COMPLETED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : b.shift_status === 'SERVICE_IN_PROGRESS'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {b.shift_status.replace(/_/g, ' ')}
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
