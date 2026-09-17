import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ClipboardList,
  UserPlus2,
  Search,
  Building2,
  Calendar,
  Clock,
  CheckCircle2,
  IndianRupee,
} from 'lucide-react';
import { institutionService, WorkforceRequestRecord } from '../../services/institutionService';

export const InstitutionRequestsListPage: React.FC = () => {
  const [requests, setRequests] = useState<WorkforceRequestRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const data = await institutionService.getRequests();
        setRequests(data);
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, []);

  const filteredRequests = requests.filter((r) => {
    const matchesSearch =
      r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.facility_location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-extrabold uppercase tracking-wider bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
              Procurement History
            </span>
            <span className="text-xs text-slate-500 font-medium">Requisitions Tracker</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 mt-1">Bulk Workforce Requisitions</h1>
          <p className="text-xs text-slate-500">
            Monitor real-time candidate allocation and deployment progress with partner cooperative unions.
          </p>
        </div>

        <Link
          to="/institution/request"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-sm transition self-start sm:self-auto"
        >
          <UserPlus2 className="w-4 h-4" />
          <span>New Requisition</span>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by requisition title, ID, or campus location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-medium">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white font-semibold text-slate-800 focus:outline-none"
          >
            <option value="ALL">All Statuses</option>
            <option value="ACTIVE_DEPLOYED">Active Deployed</option>
            <option value="ALLOCATING">Allocating</option>
            <option value="SUBMITTED">Submitted</option>
            <option value="COMPLETED">Completed</option>
          </select>
        </div>
      </div>

      {/* Requests Cards List */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900"></div>
        </div>
      ) : filteredRequests.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center border border-slate-200 space-y-3">
          <ClipboardList className="w-12 h-12 text-slate-300 mx-auto" />
          <div className="font-bold text-slate-800 text-sm">No Requisitions Found</div>
          <p className="text-xs text-slate-500">There are no workforce orders matching your search filters.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredRequests.map((req) => (
            <div
              key={req.id}
              className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 space-y-4 hover:border-slate-300 transition"
            >
              {/* Card Top Row */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-slate-100 pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                      {req.id}
                    </span>
                    <span
                      className={`text-[10px] font-extrabold px-2 py-0.5 rounded ${
                        req.status === 'ACTIVE_DEPLOYED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : req.status === 'ALLOCATING'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {req.status.replace('_', ' ')}
                    </span>
                  </div>
                  <h2 className="text-base font-bold text-slate-900 mt-1">{req.title}</h2>
                  <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5 text-slate-400" />
                    <span>{req.facility_location}</span>
                  </div>
                </div>

                <div className="text-right sm:self-center">
                  <div className="text-xs text-slate-500">Estimated Monthly Value</div>
                  <div className="text-lg font-extrabold text-slate-900 flex items-center sm:justify-end gap-1">
                    <IndianRupee className="w-4 h-4 text-emerald-600" />
                    {req.estimated_monthly_cost.toLocaleString('en-IN')}
                  </div>
                </div>
              </div>

              {/* Trade Breakdown & Allocation Progress */}
              <div className="space-y-2">
                <div className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                  Trade Allocations & Cooperative Assignment
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {req.items.map((it) => {
                    const percent = Math.round((it.allocated_workers_count / it.quantity_required) * 100);
                    return (
                      <div
                        key={it.id}
                        className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-2"
                      >
                        <div className="flex items-center justify-between font-bold text-slate-900">
                          <span>{it.trade}</span>
                          <span className="font-mono text-[11px]">
                            {it.allocated_workers_count} / {it.quantity_required} Assigned
                          </span>
                        </div>
                        <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${
                              percent === 100 ? 'bg-emerald-500' : 'bg-blue-500'
                            }`}
                            style={{ width: `${percent}%` }}
                          ></div>
                        </div>
                        <div className="text-[10px] text-slate-500 flex items-center justify-between">
                          <span>Rate: ₹{it.daily_floor_rate}/day</span>
                          <span className="font-semibold text-slate-700">{percent}% Complete</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Shift & Cooperative Metadata */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-slate-100 text-xs text-slate-600">
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>
                      {req.start_date} to {req.end_date} ({req.duration_months} Month)
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>
                      {req.shift_start_time} - {req.shift_end_time} ({req.recurring_frequency})
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 font-medium text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200 text-[11px]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Assigned Union: {req.cooperative_name}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
