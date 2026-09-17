import React from 'react';
import { Cooperative } from '@/services/workerService';
import { 
  Building2, 
  MapPin, 
  UserCheck, 
  Phone, 
  Users, 
  CheckCircle2, 
  ShieldCheck 
} from 'lucide-react';

interface Step2Props {
  cooperatives: Cooperative[];
  selectedCoopId: string;
  onSelect: (coop: Cooperative) => void;
}

export const Step2Cooperative: React.FC<Step2Props> = ({
  cooperatives,
  selectedCoopId,
  onSelect,
}) => {
  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      <div className="space-y-1">
        <h2 className="text-xl sm:text-2xl font-black text-gov-navy tracking-tight flex items-center gap-2">
          <Building2 className="w-6 h-6 text-gov-green" />
          <span>Step 2: Choose Your Local Labour Cooperative</span>
        </h2>
        <p className="text-xs sm:text-sm text-gov-muted">
          Your cooperative provides collective wage bargaining, accident insurance, legal support & credential verification
        </p>
      </div>

      <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-900 flex items-center gap-2.5">
        <ShieldCheck className="w-5 h-5 text-blue-700 shrink-0" />
        <span>
          <strong>Why a Cooperative?</strong> Unlike private gig platforms that take high commissions, KARM SEVA is 100% cooperative-backed. Your cooperative ensures fair rates, prompt payouts, and pension protection.
        </span>
      </div>

      {/* Cooperative Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {cooperatives.map((coop) => {
          const isSelected = selectedCoopId === coop.id;
          return (
            <div
              key={coop.id}
              onClick={() => onSelect(coop)}
              className={`p-5 rounded-2xl border-2 transition-all cursor-pointer relative flex flex-col justify-between ${
                isSelected
                  ? 'border-gov-green bg-emerald-50/50 shadow-md ring-2 ring-gov-green/20'
                  : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-xs'
              }`}
            >
              {/* Selected Badge */}
              {isSelected && (
                <div className="absolute top-4 right-4 flex items-center gap-1 text-[11px] font-black text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-gov-green" />
                  <span>Selected</span>
                </div>
              )}

              <div className="space-y-3">
                <div>
                  <span className="text-[10px] font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 uppercase">
                    {coop.code}
                  </span>
                  <h3 className="font-black text-sm sm:text-base text-gov-navy mt-1.5 leading-snug">
                    {coop.name}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium flex items-center gap-1 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{coop.address}</span>
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1.5">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-500 flex items-center gap-1">
                      <UserCheck className="w-3.5 h-3.5 text-gov-green" />
                      <span>Authorized Officer:</span>
                    </span>
                    <strong className="text-slate-800">{coop.officer_name}</strong>
                  </div>

                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-500 flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      <span>Helpline:</span>
                    </span>
                    <span className="font-mono font-bold text-slate-700">{coop.contact_phone}</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-[11px] text-gov-muted flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-slate-400" />
                  <span>{coop.registered_workers_count} Active Craftsmen</span>
                </span>
                <span className="text-[11px] font-bold text-gov-green">
                  {isSelected ? '✓ Assigned' : 'Click to Select'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
