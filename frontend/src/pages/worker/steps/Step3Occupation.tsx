import React from 'react';
import { TradePolicy } from '@/services/workerService';
import { 
  Wrench, 
  Zap, 
  Car, 
  HeartHandshake, 
  Paintbrush, 
  Hammer, 
  Sparkles, 
  Home, 
  Baby, 
  Flower2, 
  Tv 
} from 'lucide-react';

interface Step3Props {
  policies: TradePolicy[];
  selectedTrade: string;
  onSelect: (trade: TradePolicy) => void;
}

export const Step3Occupation: React.FC<Step3Props> = ({
  policies,
  selectedTrade,
  onSelect,
}) => {
  const getTradeIcon = (slug: string) => {
    switch (slug) {
      case 'electrician': return <Zap className="w-5 h-5 text-amber-500" />;
      case 'driver': return <Car className="w-5 h-5 text-blue-600" />;
      case 'patient-caregiver': return <HeartHandshake className="w-5 h-5 text-rose-500" />;
      case 'plumber': return <Wrench className="w-5 h-5 text-cyan-600" />;
      case 'elderly-caregiver': return <HeartHandshake className="w-5 h-5 text-emerald-600" />;
      case 'child-caregiver': return <Baby className="w-5 h-5 text-pink-500" />;
      case 'carpenter': return <Hammer className="w-5 h-5 text-amber-700" />;
      case 'painter': return <Paintbrush className="w-5 h-5 text-indigo-600" />;
      case 'appliance-technician': return <Tv className="w-5 h-5 text-blue-700" />;
      case 'gardener': return <Flower2 className="w-5 h-5 text-green-600" />;
      case 'cleaner': return <Sparkles className="w-5 h-5 text-teal-600" />;
      case 'domestic-helper': return <Home className="w-5 h-5 text-orange-600" />;
      default: return <Wrench className="w-5 h-5 text-slate-600" />;
    }
  };

  const getGroupBadge = (req: TradePolicy['certificate_requirement']) => {
    switch (req) {
      case 'Mandatory':
        return (
          <span className="text-[10px] font-black uppercase text-red-700 bg-red-100 px-2 py-0.5 rounded border border-red-200">
            Mandatory Lic./Cert.
          </span>
        );
      case 'Optional':
        return (
          <span className="text-[10px] font-black uppercase text-blue-700 bg-blue-100 px-2 py-0.5 rounded border border-blue-200">
            Optional Cert Badge
          </span>
        );
      case 'Evidence':
        return (
          <span className="text-[10px] font-black uppercase text-amber-800 bg-amber-100 px-2 py-0.5 rounded border border-amber-200">
            Skill Evidence / Test
          </span>
        );
      case 'None':
      default:
        return (
          <span className="text-[10px] font-black uppercase text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-200">
            No Formal Cert Required
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      <div className="space-y-1">
        <h2 className="text-xl sm:text-2xl font-black text-gov-navy tracking-tight flex items-center gap-2">
          <Wrench className="w-6 h-6 text-gov-green" />
          <span>Step 3: Select Primary Occupation & Trade Policy</span>
        </h2>
        <p className="text-xs sm:text-sm text-gov-muted">
          KARM SEVA applies occupation-specific verification policies (Groups A, B, C, and D)
        </p>
      </div>

      {/* Group Verification Policy Summary Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-xs">
        <div className="p-2.5 rounded-xl bg-red-50/60 border border-red-200">
          <span className="font-black text-red-900 block text-[11px]">Group A</span>
          <span className="text-[10px] text-red-700">ITI / DL / Nursing mandatory</span>
        </div>
        <div className="p-2.5 rounded-xl bg-blue-50/60 border border-blue-200">
          <span className="font-black text-blue-900 block text-[11px]">Group B</span>
          <span className="text-[10px] text-blue-700">Experience primary; optional cert badge</span>
        </div>
        <div className="p-2.5 rounded-xl bg-amber-50/60 border border-amber-200">
          <span className="font-black text-amber-900 block text-[11px]">Group C</span>
          <span className="text-[10px] text-amber-800">Experience + photo portfolio evidence</span>
        </div>
        <div className="p-2.5 rounded-xl bg-emerald-50/60 border border-emerald-200">
          <span className="font-black text-emerald-900 block text-[11px]">Group D</span>
          <span className="text-[10px] text-emerald-800">Certificate-free; trust via completed jobs</span>
        </div>
      </div>

      {/* Trade Selection Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {policies.map((p) => {
          const isSelected = selectedTrade === p.trade;
          return (
            <div
              key={p.slug}
              onClick={() => onSelect(p)}
              className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                isSelected
                  ? 'border-gov-green bg-emerald-50/60 shadow-md ring-2 ring-gov-green/20'
                  : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-xs'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between">
                  <div className="p-2 rounded-xl bg-slate-50 border border-slate-200">
                    {getTradeIcon(p.slug)}
                  </div>
                  {getGroupBadge(p.certificate_requirement)}
                </div>

                <div>
                  <h3 className="font-black text-sm text-gov-navy">
                    {p.trade}
                  </h3>
                  <p className="text-[11px] text-gov-muted leading-tight mt-1">
                    {p.description}
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                <span className="font-mono text-slate-400 font-bold">{p.group}</span>
                <span className="font-bold text-gov-green">
                  {isSelected ? '✓ Selected' : 'Choose Trade'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
