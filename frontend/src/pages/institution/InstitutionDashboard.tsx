import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FileCheck2,
  Users2,
  CheckSquare,
  Clock,
  IndianRupee,
  Receipt,
  UserPlus2,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
  RefreshCw,
  Sparkles,
  BarChart3,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { institutionService, InstitutionalMetrics, WorkforceRequestRecord, AssignedWorker } from '../../services/institutionService';
import {
  analyticsService,
  InstitutionAnalyticsResponse,
  AnalyticsFilterParams,
} from '../../services/analyticsService';
import { AnalyticsFilterBar } from '../../components/analytics/AnalyticsFilterBar';

export const InstitutionDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<InstitutionalMetrics | null>(null);
  const [requests, setRequests] = useState<WorkforceRequestRecord[]>([]);
  const [workforce, setWorkforce] = useState<AssignedWorker[]>([]);
  const [analytics, setAnalytics] = useState<InstitutionAnalyticsResponse | null>(null);
  const [filters, setFilters] = useState<AnalyticsFilterParams>({ time_range: '30d' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [m, reqs, wf, an] = await Promise.all([
          institutionService.getMetrics(),
          institutionService.getRequests(),
          institutionService.getWorkforce(),
          analyticsService.getInstitutionAnalytics(filters),
        ]);
        setMetrics(m);
        setRequests(reqs);
        setWorkforce(wf);
        setAnalytics(an);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [filters]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-slate-900"></div>
      </div>
    );
  }

  const metricCards = [
    {
      title: 'Active Contracts',
      value: metrics?.active_contracts || 3,
      subtitle: 'Verified Union SLAs',
      icon: FileCheck2,
      color: 'text-indigo-600',
      bg: 'bg-indigo-50 border-indigo-200',
    },
    {
      title: 'Workers Assigned',
      value: metrics?.workers_assigned || 28,
      subtitle: 'Across 4 trades',
      icon: Users2,
      color: 'text-blue-600',
      bg: 'bg-blue-50 border-blue-200',
    },
    {
      title: "Today's Attendance",
      value: metrics?.todays_attendance || '96.4%',
      subtitle: metrics?.attendance_fraction || '27/28 Present',
      icon: CheckSquare,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50 border-emerald-200',
    },
    {
      title: 'Upcoming Service',
      value: '09:00 AM',
      subtitle: 'Main Day Shift',
      icon: Clock,
      color: 'text-amber-600',
      bg: 'bg-amber-50 border-amber-200',
    },
    {
      title: 'Monthly Spend',
      value: `₹${(metrics?.monthly_spend || 184500).toLocaleString('en-IN')}`,
      subtitle: '0% middleman markups',
      icon: IndianRupee,
      color: 'text-slate-900',
      bg: 'bg-slate-50 border-slate-200',
    },
    {
      title: 'Pending Invoice',
      value: `₹${(metrics?.pending_invoice || 42800).toLocaleString('en-IN')}`,
      subtitle: 'Due by 10 Sep 2024',
      icon: Receipt,
      color: 'text-rose-600',
      bg: 'bg-rose-50 border-rose-200',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner with Requisition CTA */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 rounded-2xl p-6 text-white shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold">
            <ShieldCheck className="w-4 h-4" />
            Direct Cooperative Bulk Workforce Channel
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Institutional Procurement & Workforce Operations
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
            Deploy, schedule, and audit verified cooperative trades (Electricians, Cleaners, Plumbers, Caregivers) under transparent government gazette rates.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            to="/institution/request"
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold shadow-md transition transform hover:-translate-y-0.5"
          >
            <UserPlus2 className="w-4 h-4" />
            <span>Request Workforce</span>
          </Link>
          <Link
            to="/institution/invoices"
            className="flex items-center gap-2 px-4 py-3 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-sm font-bold border border-slate-600 transition"
          >
            <Receipt className="w-4 h-4" />
            <span>Invoices</span>
          </Link>
        </div>
      </div>

      {/* 6 Metric Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4">
        {metricCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className={`p-4 rounded-xl border ${card.bg} bg-white shadow-sm flex flex-col justify-between`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">{card.title}</span>
                <div className={`p-2 rounded-lg ${card.bg}`}>
                  <Icon className={`w-4 h-4 ${card.color}`} />
                </div>
              </div>
              <div className="mt-3">
                <div className="text-xl sm:text-2xl font-extrabold text-slate-900">{card.value}</div>
                <div className="text-[11px] text-slate-500 font-medium mt-0.5">{card.subtitle}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Two Column Grid: Active Deployments & Today's Attendance */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Workforce Roster (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 p-5 space-y-4">
          <div className="flex items-center justify-between border-b pb-3">
            <div>
              <h2 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <Users2 className="w-5 h-5 text-indigo-600" />
                Deployed Personnel at AIIMS Facilities
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">Direct union trades on duty today</p>
            </div>
            <Link
              to="/institution/workforce"
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
            >
              <span>View Full Roster</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="divide-y divide-slate-100">
            {workforce.slice(0, 4).map((w) => (
              <div key={w.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-300 flex items-center justify-center font-bold text-slate-700 text-sm">
                    {w.name.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm">{w.name}</span>
                      <span className="text-[10px] font-mono bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded font-semibold">
                        {w.shram_id}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      {w.trade} • <span className="text-slate-700 font-medium">{w.assigned_location}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <span
                    className={`text-[10px] font-extrabold px-2 py-0.5 rounded ${
                      w.attendance_today === 'PRESENT'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {w.attendance_today === 'PRESENT' ? 'PUNCHED IN (GEOFENCED)' : 'SUBSTITUTE DEPLOYED'}
                  </span>
                  <span className="text-xs text-slate-500 font-medium">{w.shift.split('(')[0]}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Attendance Compliance & SLA Guarantee (1 col) */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-emerald-600" />
                Attendance Compliance
              </h3>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                Live Geofence
              </span>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-600">Morning Shift Check-in:</span>
                <span className="font-bold text-slate-900">100% On-Time</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full w-[96.4%]"></div>
              </div>
              <div className="text-[11px] text-slate-500 flex items-center justify-between">
                <span>27 Present</span>
                <span>1 Cooperative Substitute</span>
                <span>0 Unexcused</span>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-blue-50/70 border border-blue-200 text-xs text-blue-900 space-y-1">
              <div className="font-bold flex items-center gap-1.5">
                <RefreshCw className="w-3.5 h-3.5 text-blue-600 animate-spin" />
                Automatic Replacement SLA
              </div>
              <p className="text-[11px] text-blue-700">
                1 Plumber replacement was automatically dispatched by Khurda Cooperative within 25 minutes of sickness notification.
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-slate-900 to-indigo-900 rounded-xl p-5 text-white shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                Next Monthly Cycle
              </span>
              <span className="text-xs font-mono font-bold text-slate-300">01 Oct 2024</span>
            </div>
            <div className="text-base font-extrabold">Need Additional Trades for Oct?</div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Combine multi-trade requirements (Electricians, Cleaners, Technicians) under one composite government requisition order.
            </p>
            <Link
              to="/institution/request"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-300 hover:text-emerald-200"
            >
              <span>Build Multi-Trade Requisition</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Institutional Spend & Trade Allocation Analytics */}
      {analytics && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-slate-900 dark:text-slate-100 text-base flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-emerald-600" />
              Institutional Spend & Workforce Utilization Analytics
            </h2>
            <span className="text-xs text-slate-500 font-medium">Real-time Cooperative Billing</span>
          </div>

          <AnalyticsFilterBar
            filters={filters}
            onChange={setFilters}
            showServiceFilter={true}
          />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Monthly Spend Timeseries */}
            <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    Expenditure Trend (₹)
                  </h3>
                  <p className="text-xs text-slate-500">Weekly progression of direct contractor payments</p>
                </div>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
                  ₹{analytics.total_monthly_spend.toLocaleString()} Total
                </span>
              </div>

              <div className="h-60 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={analytics.spend_trend} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="instSpendGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#2563eb" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip formatter={(val: any) => [`₹${Number(val).toLocaleString()}`, 'Spend']} />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke="#2563eb"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#instSpendGrad)"
                      name="Spend (₹)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Service / Trade Usage Pie */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-1">
                  Workforce Allocation by Trade
                </h3>
                <p className="text-xs text-slate-500 mb-2">Active headcount distribution</p>

                <div className="h-44 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={analytics.service_usage}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={65}
                        innerRadius={35}
                        paddingAngle={3}
                      >
                        {analytics.service_usage.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color || '#2563eb'} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(val: any) => [`${val} Workers`, 'Headcount']} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                {analytics.service_usage.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="truncate max-w-[130px]">{item.name}</span>
                    </div>
                    <span className="font-semibold">{item.value} ({item.percentage}%)</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Recent Requisitions Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 space-y-4">
        <div className="flex items-center justify-between border-b pb-3">
          <div>
            <h2 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <FileCheck2 className="w-5 h-5 text-indigo-600" />
              Recent Workforce Requisitions & SLA Status
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">Tracking allocation with Khurda Cooperative Union</p>
          </div>
          <Link
            to="/institution/requests"
            className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
          >
            <span>View All Requests</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-2.5 px-3">Requisition ID</th>
                <th className="py-2.5 px-3">Summary / Facility</th>
                <th className="py-2.5 px-3">Trades & Headcount</th>
                <th className="py-2.5 px-3">Duration & Shift</th>
                <th className="py-2.5 px-3">Est. Monthly</th>
                <th className="py-2.5 px-3">Allocation Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {requests.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50 transition">
                  <td className="py-3 px-3 font-mono font-bold text-slate-800">{r.id}</td>
                  <td className="py-3 px-3">
                    <div className="font-bold text-slate-900">{r.title}</div>
                    <div className="text-[11px] text-slate-500">{r.facility_location}</div>
                  </td>
                  <td className="py-3 px-3">
                    <div className="flex flex-wrap gap-1">
                      {r.items.map((it) => (
                        <span key={it.id} className="bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded font-semibold text-[10px]">
                          {it.quantity_required}x {it.trade}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <div className="font-medium text-slate-800">{r.duration_months} Month(s) • {r.recurring_frequency}</div>
                    <div className="text-[11px] text-slate-500">{r.shift_start_time} - {r.shift_end_time}</div>
                  </td>
                  <td className="py-3 px-3 font-bold text-slate-900">
                    ₹{r.estimated_monthly_cost.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className={`text-[10px] font-extrabold px-2 py-0.5 rounded ${
                        r.status === 'ACTIVE_DEPLOYED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : r.status === 'ALLOCATING'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {r.status.replace('_', ' ')}
                    </span>
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
