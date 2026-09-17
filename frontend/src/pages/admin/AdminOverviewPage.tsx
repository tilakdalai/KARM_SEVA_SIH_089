import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  ShieldCheck,
  Building,
  UserCheck,
  Building2,
  CheckCircle2,
  Activity,
  IndianRupee,
  Wallet,
  TrendingUp,
  Star,
  CheckSquare,
  MapPin,
  FileCode2,
  ChevronRight,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import {
  adminService,
  SystemAdminKPIs,
  GovernanceAnalyticsData,
  CooperativeRecord,
} from '../../services/adminService';

export const AdminOverviewPage: React.FC = () => {
  const [kpis, setKpis] = useState<SystemAdminKPIs | null>(null);
  const [analytics, setAnalytics] = useState<GovernanceAnalyticsData | null>(null);
  const [cooperatives, setCooperatives] = useState<CooperativeRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [k, a, c] = await Promise.all([
          adminService.getKPIs(),
          adminService.getAnalytics(),
          adminService.getCooperatives(),
        ]);
        setKpis(k);
        setAnalytics(a);
        setCooperatives(c);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-slate-900"></div>
      </div>
    );
  }

  const kpiCards = [
    { title: 'Registered Workers', value: (kpis?.registered_workers || 14850).toLocaleString('en-IN'), sub: 'State-wide Roster', icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-50 border-indigo-200' },
    { title: 'Verified Workers', value: (kpis?.verified_workers || 12420).toLocaleString('en-IN'), sub: '83.6% Verified', icon: ShieldCheck, color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-200' },
    { title: 'Active Cooperatives', value: kpis?.active_cooperatives || 48, sub: '30 Districts', icon: Building, color: 'text-blue-600', bg: 'bg-blue-50 border-blue-200' },
    { title: 'Citizens Served', value: (kpis?.citizens_served || 42910).toLocaleString('en-IN'), sub: 'Direct Household Bookings', icon: UserCheck, color: 'text-amber-600', bg: 'bg-amber-50 border-amber-200' },
    { title: 'Institutions', value: kpis?.institutions || 134, sub: 'Govt / Hospitals / Schools', icon: Building2, color: 'text-purple-600', bg: 'bg-purple-50 border-purple-200' },
    { title: 'Jobs Completed', value: (kpis?.jobs_completed || 68240).toLocaleString('en-IN'), sub: '99.2% Fulfillment', icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-200' },
    { title: 'Active Jobs', value: kpis?.active_jobs || 412, sub: 'Live Shift Telemetry', icon: Activity, color: 'text-cyan-600', bg: 'bg-cyan-50 border-cyan-200' },
    { title: 'Total Gross Value', value: `₹${((kpis?.total_transaction_value || 38450000) / 10000000).toFixed(2)} Cr`, sub: 'Direct Escrow Cleared', icon: IndianRupee, color: 'text-slate-900', bg: 'bg-slate-50 border-slate-200' },
    { title: 'Worker Take-Home', value: `₹${((kpis?.worker_earnings || 34605000) / 10000000).toFixed(2)} Cr`, sub: '90% Direct DBT Bank Credit', icon: Wallet, color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-200' },
    { title: 'Cooperative Trust Fund', value: `₹${((kpis?.cooperative_revenue || 3845000) / 100000).toFixed(1)} L`, sub: '10% Welfare & Insurance', icon: TrendingUp, color: 'text-indigo-700', bg: 'bg-indigo-50 border-indigo-200' },
    { title: 'Average Citizen Rating', value: `${kpis?.average_rating || 4.88} / 5.0`, sub: 'From 58,400+ Reviews', icon: Star, color: 'text-amber-500', bg: 'bg-amber-50 border-amber-200' },
    { title: 'Complaint Resolution', value: kpis?.complaint_resolution_rate || '98.7%', sub: '48-hr SLA Standard', icon: CheckSquare, color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-200' },
  ];

  const pieColors = ['#10B981', '#3B82F6', '#F59E0B', '#8B5CF6', '#EC4899'];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 rounded-2xl p-6 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 border border-slate-800">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            National Public Digital Infrastructure (DPI) Oversight Command Center
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Odisha Public Labour Digital Infrastructure Platform
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm max-w-3xl leading-relaxed">
            Real-time macroeconomic telemetry across 48 registered worker cooperatives, 14,800+ tradespeople, and ₹3.84 Cr in zero-commission transparent direct bank transfers.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            to="/admin/cooperatives"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md transition"
          >
            <Building className="w-4 h-4" />
            <span>Cooperative Registry</span>
          </Link>
          <Link
            to="/admin/audit-logs"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition"
          >
            <FileCode2 className="w-4 h-4" />
            <span>Audit Trail</span>
          </Link>
        </div>
      </div>

      {/* 12 Macroeconomic KPIs Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3 sm:gap-4">
        {kpiCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className={`p-4 rounded-xl border ${card.bg} bg-white shadow-sm flex flex-col justify-between hover:border-slate-300 transition`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold text-slate-600 uppercase tracking-wider">
                  {card.title}
                </span>
                <div className={`p-1.5 rounded-md ${card.bg}`}>
                  <Icon className={`w-4 h-4 ${card.color}`} />
                </div>
              </div>
              <div className="mt-2.5">
                <div className="text-xl sm:text-2xl font-extrabold text-slate-900">{card.value}</div>
                <div className="text-[10px] text-slate-500 font-medium mt-0.5">{card.sub}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Interactive Geographic State Map & District Telemetry */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-3">
          <div>
            <h2 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
              <MapPin className="w-5 h-5 text-indigo-600" />
              State-Wide Geographic Workforce & Demand Radar
            </h2>
            <p className="text-xs text-slate-500">Live district telemetry and workforce density distribution</p>
          </div>
          <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
            6 High-Density District Nodes
          </span>
        </div>

        {/* District Node Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
          {analytics?.geographic_demand.map((geo, idx) => (
            <div
              key={idx}
              className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 hover:border-indigo-300 transition space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-slate-900 text-xs">{geo.district}</span>
                <span
                  className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded ${
                    geo.density === 'VERY_HIGH'
                      ? 'bg-rose-100 text-rose-800'
                      : geo.density === 'HIGH'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}
                >
                  {geo.density}
                </span>
              </div>
              <div className="text-xs space-y-0.5 text-slate-600">
                <div>Active Workers: <strong className="text-slate-900">{geo.workers.toLocaleString('en-IN')}</strong></div>
                <div>Completed Jobs: <strong className="text-slate-900">{geo.jobs.toLocaleString('en-IN')}</strong></div>
              </div>
              <div className="text-[10px] text-slate-400 font-mono">GPS: {geo.lat.toFixed(2)}° N, {geo.lng.toFixed(2)}° E</div>
            </div>
          ))}
        </div>
      </div>

      {/* Visual Analytics Telemetry: 4 Key Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Worker Registration & Verification Growth */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 space-y-3">
          <div className="flex items-center justify-between border-b pb-2.5">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Worker Registration & Verification Growth</h3>
              <p className="text-[11px] text-slate-500">Cumulative onboarding across registered unions</p>
            </div>
            <span className="text-[10px] font-bold bg-slate-100 px-2 py-0.5 rounded text-slate-700">Monthly</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={analytics?.worker_growth || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Area type="monotone" dataKey="registered" stroke="#6366f1" fill="#e0e7ff" name="Registered Workers" />
                <Area type="monotone" dataKey="verified" stroke="#10b981" fill="#d1fae5" name="Verified Workers" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Service Demand Breakdown */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 space-y-3">
          <div className="flex items-center justify-between border-b pb-2.5">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Citizen & Institutional Service Demand</h3>
              <p className="text-[11px] text-slate-500">Order distribution across registered trades</p>
            </div>
            <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">68K+ Jobs</span>
          </div>

          <div className="h-64 w-full flex items-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={analytics?.service_demand || []}
                  dataKey="percentage"
                  nameKey="trade"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                >
                  {(analytics?.service_demand || []).map((_, index) => (
                    <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Employment Generated (Person-Days & Earnings) */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 space-y-3">
          <div className="flex items-center justify-between border-b pb-2.5">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Employment Generated & Worker Earnings</h3>
              <p className="text-[11px] text-slate-500">Quarterly Person-Days & Direct DBT Disbursed (₹ Cr)</p>
            </div>
            <span className="text-[10px] font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded">Quarterly</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics?.employment_generated || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="quarter" tick={{ fontSize: 11 }} />
                <YAxis yAxisId="left" tick={{ fontSize: 11 }} />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11 }} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Bar yAxisId="left" dataKey="person_days" fill="#3b82f6" name="Person-Days Created" radius={[4, 4, 0, 0]} />
                <Bar yAxisId="right" dataKey="earnings_cr" fill="#10b981" name="Worker DBT (₹ Cr)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 4: 0% Commission Transparent Revenue Escrow */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 space-y-3">
          <div className="flex items-center justify-between border-b pb-2.5">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">0% Commission Escrow Split Model</h3>
              <p className="text-[11px] text-slate-500">Statutory breakdown of total gross transaction flow</p>
            </div>
            <span className="text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
              0% Platform Fee
            </span>
          </div>

          <div className="space-y-3 pt-2">
            <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200 flex items-center justify-between text-xs">
              <div className="space-y-0.5">
                <span className="font-bold text-emerald-900">Direct Worker Take-Home (90%)</span>
                <div className="text-[11px] text-emerald-700">Automated DBT to Worker Bank Account</div>
              </div>
              <span className="font-extrabold text-sm text-emerald-900">₹3.46 Cr</span>
            </div>

            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200 flex items-center justify-between text-xs">
              <div className="space-y-0.5">
                <span className="font-bold text-blue-900">Cooperative Welfare Trust (10%)</span>
                <div className="text-[11px] text-blue-700">PMSBY/BSKY Insurance, Toolkit Loans & Training</div>
              </div>
              <span className="font-extrabold text-sm text-blue-900">₹38.45 Lakh</span>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between text-xs">
              <div className="space-y-0.5">
                <span className="font-bold text-slate-900">Platform Middleware Commission (0%)</span>
                <div className="text-[11px] text-slate-500">Digital Public Infrastructure (State Funded)</div>
              </div>
              <span className="font-extrabold text-sm text-slate-900">₹0.00 (0.0%)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Cooperative Monitoring Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 space-y-4">
        <div className="flex items-center justify-between border-b pb-3">
          <div>
            <h2 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <Building className="w-5 h-5 text-indigo-600" />
              State Cooperative Societies Performance & Accreditation
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">Active workforce, verification health, complaints, and accreditation status</p>
          </div>

          <Link
            to="/admin/cooperatives"
            className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
          >
            <span>Full Cooperative Registry</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-2.5 px-3">Cooperative Code & Name</th>
                <th className="py-2.5 px-3">District</th>
                <th className="py-2.5 px-3">Active Workers</th>
                <th className="py-2.5 px-3">Verification Rate</th>
                <th className="py-2.5 px-3">Jobs Done</th>
                <th className="py-2.5 px-3">Avg Rating</th>
                <th className="py-2.5 px-3">Complaint %</th>
                <th className="py-2.5 px-3">Gross Revenue</th>
                <th className="py-2.5 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {cooperatives.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50 transition">
                  <td className="py-3 px-3">
                    <div className="font-bold text-slate-900">{c.name}</div>
                    <div className="font-mono text-[10px] text-slate-500">{c.code}</div>
                  </td>
                  <td className="py-3 px-3 font-semibold text-slate-700">{c.district}</td>
                  <td className="py-3 px-3 font-bold text-slate-900">{c.active_workers.toLocaleString('en-IN')}</td>
                  <td className="py-3 px-3 font-semibold text-emerald-700">{c.verification_rate}</td>
                  <td className="py-3 px-3 font-mono text-slate-800">{c.jobs_completed.toLocaleString('en-IN')}</td>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-1 font-bold text-amber-600">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      <span>{c.average_rating}</span>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-slate-600">{c.complaint_rate}</td>
                  <td className="py-3 px-3 font-bold text-slate-900">₹{(c.revenue / 100000).toFixed(1)} L</td>
                  <td className="py-3 px-3">
                    <span
                      className={`text-[10px] font-extrabold px-2 py-0.5 rounded ${
                        c.status === 'ACTIVE'
                          ? 'bg-emerald-100 text-emerald-800'
                          : c.status === 'UNDER_REVIEW'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {c.status.replace('_', ' ')}
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
