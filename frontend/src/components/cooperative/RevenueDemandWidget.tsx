import React from 'react';
import { IndianRupee, TrendingUp, Zap, Users } from 'lucide-react';

export const RevenueDemandWidget: React.FC = () => {
  const topDemands = [
    { trade: 'Master Electrician', bookings: 24, revenue: '₹14,200', growth: '+18%' },
    { trade: 'Patient Caregiver', bookings: 16, revenue: '₹19,200', growth: '+32%' },
    { trade: 'Master Plumber', bookings: 11, revenue: '₹8,400', growth: '+8%' },
    { trade: 'Sanitation Specialist', bookings: 7, revenue: '₹6,800', growth: '+12%' },
  ];

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full">
      <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-sm">Service Demand & Worker Utilization</h3>
            <p className="text-xs text-slate-500">Real-time trade category trends across Khurda District</p>
          </div>
        </div>
        <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
          Today's Peak Hours
        </span>
      </div>

      <div className="p-4 sm:p-5 space-y-4 flex-1">
        {/* Utilization Bar */}
        <div>
          <div className="flex items-center justify-between text-xs font-medium text-slate-600 mb-1.5">
            <span className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-slate-400" />
              Active Member Workforce Utilization
            </span>
            <span className="font-bold text-slate-900">78.4% Capacity</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 h-full rounded-full w-[78.4%]" />
          </div>
        </div>

        {/* Top Demanded Trades Table */}
        <div className="space-y-2 pt-2">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Top Performing Trades Today</div>
          <div className="divide-y divide-slate-100">
            {topDemands.map((item, idx) => (
              <div key={idx} className="py-2 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded bg-slate-100 text-slate-600 font-bold flex items-center justify-center text-[10px]">
                    0{idx + 1}
                  </div>
                  <span className="font-semibold text-slate-800">{item.trade}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-slate-500">{item.bookings} jobs</span>
                  <span className="font-bold text-slate-900 flex items-center">
                    <IndianRupee className="w-3 h-3 text-slate-400" />
                    {item.revenue.replace('₹', '')}
                  </span>
                  <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                    {item.growth}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Escrow note */}
        <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-[11px] text-emerald-800 flex items-center gap-2">
          <Zap className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>All member escrow balances are reconciled directly with Odisha State Cooperative Bank.</span>
        </div>
      </div>
    </div>
  );
};
