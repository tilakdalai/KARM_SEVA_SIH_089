import React, { useState, useEffect } from 'react';
import {
  Search,
  Phone,
  ShieldCheck,
  Star,
  Building,
  Clock,
  CheckCircle2,
  RefreshCw,
  SlidersHorizontal,
  Download,
} from 'lucide-react';
import { institutionService, AssignedWorker } from '../../services/institutionService';

export const InstitutionWorkforcePage: React.FC = () => {
  const [workforce, setWorkforce] = useState<AssignedWorker[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [tradeFilter, setTradeFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWorkers = async () => {
      try {
        const data = await institutionService.getWorkforce();
        setWorkforce(data);
      } finally {
        setLoading(false);
      }
    };
    fetchWorkers();
  }, []);

  const filtered = workforce.filter((w) => {
    const matchesSearch =
      w.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.shram_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.assigned_location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTrade = tradeFilter === 'ALL' || w.trade.toLowerCase().includes(tradeFilter.toLowerCase());
    return matchesSearch && matchesTrade;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-extrabold uppercase tracking-wider bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
              Deployment Roster
            </span>
            <span className="text-xs text-slate-500 font-medium">Assigned Personnel</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 mt-1">Institutional Workforce Roster</h1>
          <p className="text-xs text-slate-500">
            Verified cooperative personnel deployed across AIIMS Bhubaneswar campus facilities.
          </p>
        </div>

        <button
          onClick={() => alert('Downloading official deployed workforce muster roll CSV...')}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition shadow-sm self-start sm:self-auto"
        >
          <Download className="w-4 h-4 text-slate-500" />
          <span>Export Muster Roll</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search worker by name, KARM ID, or campus ward..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900"
          />
        </div>

        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-slate-400" />
          <span className="text-xs text-slate-500 font-medium">Trade:</span>
          <select
            value={tradeFilter}
            onChange={(e) => setTradeFilter(e.target.value)}
            className="px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white font-semibold text-slate-800 focus:outline-none"
          >
            <option value="ALL">All Trades</option>
            <option value="Electrician">Electricians</option>
            <option value="Caregiver">Caregivers</option>
            <option value="Plumber">Plumbers</option>
            <option value="Housekeeping">Housekeeping / Cleaners</option>
          </select>
        </div>
      </div>

      {/* Workers Cards / Table Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((w) => (
            <div
              key={w.id}
              className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 space-y-4 hover:border-slate-300 transition flex flex-col justify-between"
            >
              <div className="space-y-3">
                {/* Top Member Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-slate-900 text-white flex items-center justify-center font-extrabold text-base shadow-sm">
                      {w.name.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-slate-900 text-sm">{w.name}</span>
                        {w.is_police_cleared && (
                          <span
                            title="Police & Cooperative Verified"
                            className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded flex items-center gap-0.5"
                          >
                            <ShieldCheck className="w-3 h-3 text-emerald-600" />
                            Verified
                          </span>
                        )}
                      </div>
                      <div className="text-xs font-semibold text-indigo-700 mt-0.5">{w.trade}</div>
                      <div className="font-mono text-[10px] text-slate-500">{w.shram_id}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 bg-amber-50 text-amber-900 px-2 py-0.5 rounded border border-amber-200 text-xs font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                    <span>{w.rating}</span>
                  </div>
                </div>

                {/* Assigned Deployment Info */}
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-1.5 text-xs">
                  <div className="flex items-center gap-1.5 text-slate-700 font-medium">
                    <Building className="w-3.5 h-3.5 text-slate-400" />
                    <span>Assigned Area: <strong className="text-slate-900">{w.assigned_location}</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-600 text-[11px]">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{w.shift}</span>
                  </div>
                  <div className="text-[10px] text-slate-500 pt-0.5">
                    Union Unit: <span className="font-medium text-slate-700">{w.cooperative_unit}</span>
                  </div>
                </div>

                {/* Today's Live Attendance Status */}
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium">Today's Shift Status:</span>
                  {w.attendance_today === 'PRESENT' ? (
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      PUNCHED IN (GEOFENCED)
                    </span>
                  ) : (
                    <div className="text-right">
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-amber-100 text-amber-800 flex items-center gap-1">
                        <RefreshCw className="w-3 h-3 text-amber-600 animate-spin" />
                        SUBSTITUTE DEPLOYED
                      </span>
                      {w.substitute_name && (
                        <div className="text-[10px] text-slate-500 mt-0.5">{w.substitute_name}</div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <a
                  href={`tel:${w.phone}`}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition"
                >
                  <Phone className="w-3.5 h-3.5 text-slate-500" />
                  <span>Call Worker</span>
                </a>
                <button
                  onClick={() => alert(`Requesting replacement or shift adjustment for ${w.name} via Khurda Cooperative...`)}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition"
                >
                  <span>Report / Shift Note</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
