import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  CheckCircle2,
  Clock,
  XCircle,
  Star,
  Download,
  Phone,
  MoreVertical,
  SlidersHorizontal,
} from 'lucide-react';
import { cooperativeService, CooperativeWorker } from '../../services/cooperativeService';

export const CooperativeWorkersPage: React.FC = () => {
  const [workers, setWorkers] = useState<CooperativeWorker[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTrade, setSelectedTrade] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');

  useEffect(() => {
    const fetchWorkers = async () => {
      setIsLoading(true);
      try {
        const data = await cooperativeService.getWorkers();
        setWorkers(data);
      } catch {
        // Handled
      } finally {
        setIsLoading(false);
      }
    };
    fetchWorkers();
  }, []);

  const filteredWorkers = workers.filter((w) => {
    const matchesSearch =
      w.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.shram_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.trade.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTrade = selectedTrade === 'ALL' || w.trade.toLowerCase().includes(selectedTrade.toLowerCase());
    const matchesStatus = selectedStatus === 'ALL' || w.onboarding_status === selectedStatus;
    return matchesSearch && matchesTrade && matchesStatus;
  });

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-12">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Cooperative Workforce Roster
            </h1>
            <span className="text-xs font-bold bg-blue-100 text-blue-800 px-2.5 py-0.5 rounded-full">
              {workers.length} Members
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Comprehensive member registry, verification badges, and live deployment statuses.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => alert('Exporting full worker roster CSV...')}
            className="px-3.5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition"
          >
            <Download className="w-4 h-4" />
            Export Member List
          </button>
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
            placeholder="Search by name, KARM ID, or trade..."
            className="w-full text-xs pl-9 pr-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:border-amber-500"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <SlidersHorizontal className="w-4 h-4" />
            <span>Filter:</span>
          </div>
          <select
            value={selectedTrade}
            onChange={(e) => setSelectedTrade(e.target.value)}
            className="text-xs px-3 py-2 rounded-lg border border-slate-300 bg-white focus:outline-none focus:border-amber-500"
          >
            <option value="ALL">All Trades</option>
            <option value="Electrician">Electrician</option>
            <option value="Plumber">Plumber</option>
            <option value="Caregiver">Caregiver</option>
            <option value="Carpenter">Carpenter</option>
            <option value="Housekeeping">Housekeeping</option>
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="text-xs px-3 py-2 rounded-lg border border-slate-300 bg-white focus:outline-none focus:border-amber-500"
          >
            <option value="ALL">All Statuses</option>
            <option value="VERIFIED">Verified</option>
            <option value="SUBMITTED">Under Review</option>
            <option value="DRAFT">Draft</option>
            <option value="REJECTED">Suspended/Rejected</option>
          </select>
        </div>
      </div>

      {/* Roster Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">
                <th className="py-3.5 px-4">KARM ID</th>
                <th className="py-3.5 px-4">Member Name</th>
                <th className="py-3.5 px-4">Trade & Group</th>
                <th className="py-3.5 px-4">Verification</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Rating</th>
                <th className="py-3.5 px-4">Jobs</th>
                <th className="py-3.5 px-4">Cooperative Unit</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {isLoading ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400">
                    Loading member roster...
                  </td>
                </tr>
              ) : filteredWorkers.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-400">
                    No workers match your filter criteria.
                  </td>
                </tr>
              ) : (
                filteredWorkers.map((w) => (
                  <tr key={w.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3 px-4 font-mono font-bold text-slate-900 text-[11px]">
                      {w.shram_id}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 font-bold flex items-center justify-center text-xs shrink-0">
                          {w.name.split(' ').map((n) => n[0]).slice(0, 2).join('')}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900">{w.name}</div>
                          <div className="text-[11px] text-slate-400">{w.phone || '+91 98450 XXXXX'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-800">{w.trade}</div>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                        {w.trade_group} • {w.experience_years} yrs
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {w.is_verified || w.onboarding_status === 'VERIFIED' ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          Verified
                        </span>
                      ) : w.onboarding_status === 'SUBMITTED' ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                          <Clock className="w-3.5 h-3.5 text-amber-600" />
                          Pending Review
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                          <XCircle className="w-3.5 h-3.5 text-rose-600" />
                          Unverified
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      {w.is_online ? (
                        <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-700">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                          ONLINE
                        </span>
                      ) : (
                        <span className="text-[11px] font-medium text-slate-400">OFFLINE</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1 font-bold text-slate-900">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        {w.rating}
                      </div>
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-800">{w.total_jobs}</td>
                    <td className="py-3 px-4 text-slate-500 text-[11px] max-w-xs truncate">
                      {w.cooperative_name}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <a
                          href={`tel:${w.phone || '9800000000'}`}
                          className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600"
                          title="Call Member"
                        >
                          <Phone className="w-3.5 h-3.5" />
                        </a>
                        <Link
                          to={`/cooperative/verification/${w.id}`}
                          className="px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 text-white font-semibold text-[11px] transition"
                        >
                          Dossier
                        </Link>
                        <button
                          onClick={() => alert(`Action menu for ${w.name}`)}
                          className="p-1.5 text-slate-400 hover:text-slate-700"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
