import React from 'react';
import { Radio, MapPin, Star, Phone } from 'lucide-react';
import { CooperativeWorker } from '../../services/cooperativeService';

interface LiveWorkersWidgetProps {
  workers: CooperativeWorker[];
}

export const LiveWorkersWidget: React.FC<LiveWorkersWidgetProps> = ({ workers }) => {
  const onlineWorkers = workers.filter((w) => w.is_online);

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full">
      <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
            <Radio className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-sm">Live Active Workforce</h3>
            <p className="text-xs text-slate-500">{onlineWorkers.length} Members Online & Dispatch Ready</p>
          </div>
        </div>
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          Live GPS
        </span>
      </div>

      <div className="p-4 sm:p-5 space-y-3 flex-1 overflow-y-auto max-h-80">
        {onlineWorkers.map((w) => (
          <div
            key={w.id}
            className="p-3 rounded-lg border border-slate-100 hover:border-slate-300 transition flex items-center justify-between gap-3 bg-slate-50/40"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-200 text-slate-700 font-bold flex items-center justify-center text-sm relative shrink-0">
                {w.name.split(' ').map((n) => n[0]).slice(0, 2).join('')}
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 text-xs">{w.name}</span>
                  <span className="text-[10px] font-mono text-slate-500">{w.shram_id}</span>
                </div>
                <div className="text-[11px] text-slate-600 font-medium">{w.trade}</div>
                <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
                  <span className="flex items-center gap-0.5 text-amber-600 font-semibold">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    {w.rating}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-0.5">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    Saheed Nagar, 1.2 km
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <a
                href={`tel:${w.phone || '9800000000'}`}
                className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition"
                title="Call Worker"
              >
                <Phone className="w-3.5 h-3.5" />
              </a>
              <span className="text-[10px] font-bold px-2 py-1 rounded bg-emerald-100 text-emerald-800">
                AVAILABLE
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
