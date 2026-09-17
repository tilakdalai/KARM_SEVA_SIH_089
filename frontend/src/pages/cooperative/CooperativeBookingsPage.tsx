import React, { useState } from 'react';
import {
  Search,
  Filter,
  MapPin,
  IndianRupee,
  Phone,
  Eye,
  CheckCircle2,
  Clock,
  AlertCircle,
} from 'lucide-react';

export const CooperativeBookingsPage: React.FC = () => {
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const bookings = [
    {
      id: 'BK-8841',
      customerName: 'Amiya Patnaik',
      customerPhone: '+91 98450 11990',
      address: 'Plot 104, Saheed Nagar, Bhubaneswar',
      serviceTitle: 'Emergency Distribution Board Tripping & MCB Fix',
      trade: 'Master Electrician',
      workerName: 'Ramesh Chandra Behera',
      shramId: 'KS-OD-2024-8841',
      status: 'IN_PROGRESS',
      stage: 'ON THE WAY',
      amount: 450,
      createdAt: 'Today, 10:45 AM',
      otp: '4821',
    },
    {
      id: 'BK-8842',
      customerName: 'Dr. Smita Mishra',
      customerPhone: '+91 94370 22331',
      address: 'Flat 302, Royal Palms, Nayapalli, Bhubaneswar',
      serviceTitle: '12-Hour Day Post-Op Patient Caregiving Shift',
      trade: 'Senior Patient Caregiver',
      workerName: 'Sunita Majhi',
      shramId: 'KS-OD-2024-3912',
      status: 'IN_PROGRESS',
      stage: 'SERVICE STARTED',
      amount: 1200,
      createdAt: 'Today, 08:00 AM',
      otp: '9102',
    },
    {
      id: 'BK-8840',
      customerName: 'Debabrata Das',
      customerPhone: '+91 98610 44556',
      address: 'Plot 88, Chandrasekharpur, Bhubaneswar',
      serviceTitle: 'Overhead Tank Pipeline Leak & Pressure Pump Check',
      trade: 'Master Plumber',
      workerName: 'Tapan Kumar Das',
      shramId: 'KS-OD-2024-1044',
      status: 'COMPLETED',
      stage: 'COMPLETED',
      amount: 450,
      createdAt: 'Today, 09:15 AM',
      otp: '7731',
    },
    {
      id: 'BK-8843',
      customerName: 'Kalinga Hospital Staff Quarters',
      customerPhone: '+91 97760 99881',
      address: 'Sector 5, Niladri Vihar, Bhubaneswar',
      serviceTitle: 'Modular Kitchen Hinge Replacement',
      trade: 'Carpenter & Wood Specialist',
      workerName: 'Prakash Sahoo',
      shramId: 'KS-OD-2024-7718',
      status: 'DISPATCHED',
      stage: 'ACCEPTED',
      amount: 600,
      createdAt: 'Today, 11:15 AM',
      otp: '3382',
    },
  ];

  const filteredBookings = bookings.filter((b) => {
    const matchesSearch =
      b.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.workerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.serviceTitle.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'ALL' || b.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-12">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Live Bookings Dispatcher
            </h1>
            <span className="text-xs font-bold bg-purple-100 text-purple-800 px-2.5 py-0.5 rounded-full">
              58 Total Today
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Real-time citizen requests, allocated union workers, OTP shift verifications, and escrow status.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search booking ID, customer, worker..."
            className="w-full text-xs pl-9 pr-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:border-amber-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-xs text-slate-500">Status:</span>
          {['ALL', 'IN_PROGRESS', 'DISPATCHED', 'COMPLETED'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                filterStatus === st
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {st.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">
                <th className="py-3.5 px-4">Booking ID</th>
                <th className="py-3.5 px-4">Citizen & Location</th>
                <th className="py-3.5 px-4">Requested Service</th>
                <th className="py-3.5 px-4">Assigned Member</th>
                <th className="py-3.5 px-4">Shift Stage</th>
                <th className="py-3.5 px-4">Amount</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredBookings.map((b) => (
                <tr key={b.id} className="hover:bg-slate-50/80 transition">
                  <td className="py-3.5 px-4">
                    <span className="font-mono font-bold text-slate-900">{b.id}</span>
                    <div className="text-[10px] text-slate-400">{b.createdAt}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900">{b.customerName}</div>
                    <div className="text-[11px] text-slate-500 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                      {b.address}
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-slate-800 max-w-xs">{b.serviceTitle}</div>
                    <span className="text-[10px] font-bold text-slate-500">{b.trade}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900">{b.workerName}</div>
                    <span className="text-[10px] font-mono text-slate-500">{b.shramId}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    {b.status === 'COMPLETED' ? (
                      <span className="inline-flex items-center gap-1 font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 text-[11px]">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        COMPLETED
                      </span>
                    ) : b.status === 'IN_PROGRESS' ? (
                      <span className="inline-flex items-center gap-1 font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 text-[11px]">
                        <Clock className="w-3 h-3 text-amber-600 animate-spin" />
                        {b.stage}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 font-bold text-blue-800 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 text-[11px]">
                        <AlertCircle className="w-3 h-3 text-blue-600" />
                        {b.stage}
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-extrabold text-slate-900 flex items-center">
                      <IndianRupee className="w-3.5 h-3.5 text-slate-400" />
                      {b.amount}
                    </div>
                    <span className="text-[10px] text-emerald-600 font-bold">ESCROW SECURE</span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <a
                        href={`tel:${b.customerPhone}`}
                        className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600"
                        title="Call Citizen"
                      >
                        <Phone className="w-3.5 h-3.5" />
                      </a>
                      <button
                        onClick={() => alert(`Viewing full shift tracking telemetry for booking ${b.id}`)}
                        className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-[11px] font-semibold"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    </div>
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
