import React, { useState } from 'react';
import { Badge } from '@/components/common/Badge';
import {
  Coins,
  CheckCircle2,
  Building2,
  Server,
  Info
} from 'lucide-react';

export const TransparentRevenueSection: React.FC = () => {
  const [serviceAmount, setServiceAmount] = useState<number>(500);

  const workerShare = Math.round(serviceAmount * 0.85);
  const coopShare = Math.round(serviceAmount * 0.10);
  const platformShare = Math.round(serviceAmount * 0.05);

  // Private aggregator comparison (typically 25-35% platform commission)
  const privateAggregatorFee = Math.round(serviceAmount * 0.28);
  const privateWorkerEarnings = serviceAmount - privateAggregatorFee;

  return (
    <section id="revenue-section" className="py-16 bg-white border-b border-gov-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <Badge variant="success" size="md" icon={<Coins className="w-3.5 h-3.5" />}>
            Statutory Public Trust Architecture
          </Badge>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-gov-navy tracking-tight">
            Transparent 85 / 10 / 5 Revenue Model
          </h2>
          <p className="text-xs sm:text-sm text-gov-muted leading-relaxed">
            Unlike commercial gig monopolies that extract 25% to 35% commissions from workers, KARM SEVA operates on a democratic cooperative escrow mandate. Every single rupee is publicly accounted for.
          </p>
        </div>

        {/* Interactive Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Interactive Slider & Breakdown */}
          <div className="lg:col-span-7 bg-slate-50 border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Test Booking Value
                </span>
                <span className="text-xl font-black text-gov-navy">
                  ₹{serviceAmount}
                </span>
              </div>
              <input
                type="range"
                min="200"
                max="3000"
                step="50"
                value={serviceAmount}
                onChange={(e) => setServiceAmount(Number(e.target.value))}
                className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-bold mt-1">
                <span>₹200 (Minor Repair)</span>
                <span>₹1,500 (Full Shift)</span>
                <span>₹3,000 (Major Work)</span>
              </div>
            </div>

            {/* Split Breakdown Cards */}
            <div className="space-y-3 pt-2">
              
              {/* 85% Seva Partner Share */}
              <div className="p-4 rounded-xl bg-white border-2 border-emerald-500/60 shadow-xs flex items-center justify-between gap-4">
                <div className="flex items-center space-x-3.5">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-black text-sm shrink-0">
                    85%
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm text-gov-navy flex items-center gap-1.5">
                      <span>Seva Partner Direct Share</span>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      Direct DBT/UPI credit to worker bank account upon OTP completion
                    </p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-lg font-black text-emerald-700">₹{workerShare}</div>
                  <div className="text-[10px] font-bold text-slate-400">Zero Middlemen</div>
                </div>
              </div>

              {/* 10% Seva Cooperative Welfare */}
              <div className="p-4 rounded-xl bg-white border border-purple-200 shadow-xs flex items-center justify-between gap-4">
                <div className="flex items-center space-x-3.5">
                  <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center font-black text-sm shrink-0">
                    10%
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm text-gov-navy flex items-center gap-1.5">
                      <span>Cooperative Welfare Fund</span>
                      <Building2 className="w-3.5 h-3.5 text-purple-600" />
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      Member medical insurance, toolkits, ITI skill training &amp; emergency support
                    </p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-lg font-black text-purple-700">₹{coopShare}</div>
                  <div className="text-[10px] font-bold text-slate-400">Worker-Owned</div>
                </div>
              </div>

              {/* 5% Platform Infrastructure Fee */}
              <div className="p-4 rounded-xl bg-white border border-blue-200 shadow-xs flex items-center justify-between gap-4">
                <div className="flex items-center space-x-3.5">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center font-black text-sm shrink-0">
                    5%
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm text-gov-navy flex items-center gap-1.5">
                      <span>Public Platform Infra Fee</span>
                      <Server className="w-3.5 h-3.5 text-blue-600" />
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      Sovereign server operations, SMS OTP gateway, and DPDP compliance
                    </p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-lg font-black text-blue-700">₹{platformShare}</div>
                  <div className="text-[10px] font-bold text-slate-400">Non-Profit Cap</div>
                </div>
              </div>

            </div>
          </div>

          {/* Right Column: Contrast with Commercial Gig Platforms */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-gradient-to-br from-gov-navy to-slate-900 text-white rounded-2xl p-6 sm:p-7 shadow-xl space-y-5">
              <div className="flex items-center justify-between">
                <Badge variant="saffron" size="sm">
                  The Fairness Benchmark
                </Badge>
                <span className="text-[10px] text-slate-400">Fairwork India Standard</span>
              </div>

              <h3 className="text-lg sm:text-xl font-black text-white leading-snug">
                Why KARM SEVA Puts ₹{workerShare - privateWorkerEarnings} More in the Craftsman’s Pocket
              </h3>

              <div className="space-y-3 pt-2 text-xs">
                <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 flex justify-between items-center">
                  <span className="text-slate-300">Commercial Platform Cut (~28%):</span>
                  <span className="font-black text-red-400">-₹{privateAggregatorFee}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 flex justify-between items-center">
                  <span className="text-slate-300">Worker Payout on Commercial Apps:</span>
                  <span className="font-bold text-slate-300">₹{privateWorkerEarnings}</span>
                </div>
                <div className="p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-500/50 flex justify-between items-center text-sm">
                  <span className="text-emerald-300 font-bold">Worker Payout on KARM SEVA:</span>
                  <span className="font-black text-emerald-400 text-base">₹{workerShare}</span>
                </div>
              </div>

              <div className="pt-2 text-[11px] text-slate-400 leading-relaxed border-t border-slate-800 flex items-start gap-2">
                <Info className="w-4 h-4 text-gov-saffron shrink-0 mt-0.5" />
                <span>
                  Plus, the 10% cooperative welfare allocation stays within the local guild, funding medical benefits, life insurance, and certified skill upgrades.
                </span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
