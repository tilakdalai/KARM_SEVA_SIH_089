import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldAlert,
  Search,
  CheckCircle2,
  Clock,
  ArrowRight,
  FileText,
  Award,
  Filter,
} from 'lucide-react';
import { cooperativeService, VerificationQueueItem } from '../../services/cooperativeService';

export const CooperativeVerificationPage: React.FC = () => {
  const [queue, setQueue] = useState<VerificationQueueItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterGroup, setFilterGroup] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchQueue = async () => {
      setIsLoading(true);
      try {
        const data = await cooperativeService.getVerificationQueue();
        setQueue(data);
      } catch {
        // Handled
      } finally {
        setIsLoading(false);
      }
    };
    fetchQueue();
  }, []);

  const filteredQueue = queue.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.shram_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.trade.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGroup = filterGroup === 'ALL' || item.trade_group === filterGroup;
    return matchesSearch && matchesGroup;
  });

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-12">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Worker Verification & Accreditation Pipeline
            </h1>
            <span className="text-xs font-bold bg-amber-100 text-amber-800 px-2.5 py-0.5 rounded-full border border-amber-200">
              {queue.length} Pending Actions
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Cooperative vetting officer desk. Validate identity documents, ITI trade certificates, and past experience dossiers.
          </p>
        </div>
      </div>

      {/* Guidelines Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl text-xs space-y-1">
          <div className="font-bold text-blue-900 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-blue-700" />
            Group A (High Safety)
          </div>
          <p className="text-blue-800 text-[11px] leading-relaxed">
            Electricians, Drivers, Caregivers require mandatory certificate upload (ITI / DL / Nursing diploma) + police clearance.
          </p>
        </div>
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs space-y-1">
          <div className="font-bold text-emerald-900 flex items-center gap-1.5">
            <Award className="w-4 h-4 text-emerald-700" />
            Group B (Essential Trades)
          </div>
          <p className="text-emerald-800 text-[11px] leading-relaxed">
            Plumbers, Elderly Caregivers require minimum 3 years verified trade experience & Aadhaar/Voter ID validation.
          </p>
        </div>
        <div className="p-4 bg-purple-50 border border-purple-200 rounded-xl text-xs space-y-1">
          <div className="font-bold text-purple-900 flex items-center gap-1.5">
            <FileText className="w-4 h-4 text-purple-700" />
            Group C & D (Guild Trades)
          </div>
          <p className="text-purple-800 text-[11px] leading-relaxed">
            Carpenters, Painters, Sanitation staff qualify via peer references and digital portfolio assessment.
          </p>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search candidate name, trade, KARM ID..."
            className="w-full text-xs pl-9 pr-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:border-amber-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-xs text-slate-500">Group:</span>
          {['ALL', 'GROUP_A', 'GROUP_B', 'GROUP_C', 'GROUP_D'].map((grp) => (
            <button
              key={grp}
              onClick={() => setFilterGroup(grp)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                filterGroup === grp
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {grp.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Queue Grid */}
      <div className="space-y-3">
        {isLoading ? (
          <div className="py-12 text-center text-xs text-slate-400">Loading verification dossier queue...</div>
        ) : filteredQueue.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-400 bg-white rounded-xl border border-slate-200">
            No candidate dossiers currently pending for selected criteria.
          </div>
        ) : (
          filteredQueue.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm hover:border-amber-400 hover:shadow-md transition flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className="font-extrabold text-slate-900 text-base">{item.name}</span>
                  <span className="font-mono text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200">
                    {item.shram_id}
                  </span>
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                    {item.trade_group}
                  </span>
                  <span className="text-[11px] text-slate-400 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    Submitted {new Date(item.submitted_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                <div className="text-xs text-slate-600">
                  <strong className="text-slate-800">{item.trade}</strong> • {item.experience_years} Years Documented Experience
                </div>

                <div className="flex items-center gap-4 text-xs text-slate-500 pt-1 flex-wrap">
                  <span className="flex items-center gap-1">
                    <ShieldAlert className="w-3.5 h-3.5 text-amber-500" />
                    Doc: <span className="font-semibold text-slate-700">{item.identity_doc_type || 'Aadhaar / National ID'}</span>
                  </span>
                  <span className="flex items-center gap-1 font-mono text-slate-600">
                    Masked: {item.identity_doc_masked || 'XXXX-XXXX-8841'}
                  </span>
                  <span className="flex items-center gap-1">
                    <Award className="w-3.5 h-3.5 text-blue-500" />
                    {item.certifications_count} Trade Certificates Attached
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <Link
                  to={`/cooperative/verification/${item.id}`}
                  className="px-5 py-2.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-sm transition flex items-center gap-2"
                >
                  Review Candidate Dossier
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
