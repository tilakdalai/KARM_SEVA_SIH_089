import React, { useState, useEffect } from 'react';
import {
  Wallet,
  TrendingUp,
  Download,
  ShieldCheck,
  Award,
  CheckCircle2,
  RefreshCw,
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
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { AnalyticsFilterBar } from '@/components/analytics/AnalyticsFilterBar';
import { EmptyAnalyticsState } from '@/components/analytics/EmptyAnalyticsState';
import {
  analyticsService,
  WorkerAnalyticsResponse,
  AnalyticsFilterParams,
} from '@/services/analyticsService';

export const WorkerEarningsPage: React.FC = () => {
  const [filters, setFilters] = useState<AnalyticsFilterParams>({
    time_range: '30d',
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<WorkerAnalyticsResponse | null>(null);

  const fetchWorkerAnalytics = async () => {
    setLoading(true);
    try {
      const res = await analyticsService.getWorkerAnalytics(filters);
      setData(res);
    } catch (err) {
      console.error('Failed to load worker analytics', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkerAnalytics();
  }, [filters]);

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-black text-gov-navy tracking-tight flex items-center gap-2">
            <Wallet className="w-6 h-6 text-gov-green" />
            <span>Worker Earnings & Performance Analytics</span>
          </h1>
          <p className="text-xs sm:text-sm text-gov-muted">
            Direct cooperative payouts, performance metrics, and skill breakdown
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={fetchWorkerAnalytics}
            disabled={loading}
            className="text-xs"
            leftIcon={<RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />}
          >
            Refresh
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => alert('Downloading official PDF earnings statement...')}
            className="text-xs font-bold"
            leftIcon={<Download className="w-4 h-4" />}
          >
            Tax Statement
          </Button>
        </div>
      </div>

      {/* Filter Bar */}
      <AnalyticsFilterBar
        filters={filters}
        onChange={setFilters}
        showServiceFilter={true}
      />

      {loading ? (
        <div className="p-12 flex justify-center items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-700" />
        </div>
      ) : !data ? (
        <EmptyAnalyticsState onAction={() => setFilters({ time_range: '30d' })} />
      ) : (
        <>
          {/* Key Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-500 uppercase">Net Payouts</span>
                <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700">
                  <Wallet className="w-4 h-4" />
                </span>
              </div>
              <p className="text-2xl font-black text-emerald-700">₹{data.net_earnings.toLocaleString()}</p>
              <p className="text-[11px] text-slate-500 mt-1">85% direct craftsman share</p>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-500 uppercase">Completed Jobs</span>
                <span className="p-1.5 rounded-lg bg-blue-50 text-blue-700">
                  <CheckCircle2 className="w-4 h-4" />
                </span>
              </div>
              <p className="text-2xl font-black text-blue-700">{data.completed_jobs}</p>
              <p className="text-[11px] text-slate-500 mt-1">Verified OTP handoffs</p>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-500 uppercase">Completion Rate</span>
                <span className="p-1.5 rounded-lg bg-amber-50 text-amber-700">
                  <TrendingUp className="w-4 h-4" />
                </span>
              </div>
              <p className="text-2xl font-black text-amber-700">{data.completion_rate}%</p>
              <p className="text-[11px] text-slate-500 mt-1">Job fulfillment reliability</p>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-500 uppercase">Rating Score</span>
                <span className="p-1.5 rounded-lg bg-purple-50 text-purple-700">
                  <Award className="w-4 h-4" />
                </span>
              </div>
              <p className="text-2xl font-black text-purple-700">{data.average_rating} / 5.0</p>
              <p className="text-[11px] text-slate-500 mt-1">Citizen verified feedback</p>
            </div>
          </div>

          {/* Recharts Analytics Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Earnings Timeseries Trend */}
            <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-emerald-600" />
                    Earnings Trend (₹)
                  </h3>
                  <p className="text-xs text-slate-500">Weekly and monthly progression</p>
                </div>
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
                  Verified Escrow
                </span>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data.earnings_trend} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="earningsGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#138a5b" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#138a5b" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip
                      formatter={(val: any) => [`₹${Number(val).toLocaleString()}`, 'Net Earnings']}
                      labelFormatter={(label) => `Date: ${label}`}
                    />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke="#138a5b"
                      strokeWidth={2.5}
                      fillOpacity={1}
                      fill="url(#earningsGradient)"
                      name="Earnings"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Trade Distribution Pie Chart */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-1">
                  Earnings by Trade
                </h3>
                <p className="text-xs text-slate-500 mb-3">Service category share</p>

                <div className="h-48 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={data.trade_breakdown}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={70}
                        innerRadius={40}
                        paddingAngle={3}
                      >
                        {data.trade_breakdown.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color || '#138a5b'} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(val: any) => [`₹${Number(val).toLocaleString()}`, 'Earnings']} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                {data.trade_breakdown.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="truncate max-w-[120px]">{item.name}</span>
                    </div>
                    <span className="font-semibold">₹{item.value.toLocaleString()} ({item.percentage}%)</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Transparent Cooperative Payout Policy Card */}
          <Card header={<span className="font-extrabold text-sm text-gov-navy flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-gov-green" /> Statutory Wage Protection</span>}>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-slate-500 font-bold">Platform Commission:</span>
                <p className="text-xl font-black text-gov-navy">0% (Zero)</p>
                <span className="text-[10px] text-gov-green font-bold">Public Digital Infrastructure</span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-slate-500 font-bold">Direct Craftsman Payout:</span>
                <p className="text-xl font-black text-emerald-700">85% Direct</p>
                <span className="text-[10px] text-slate-500">Instant Escrow Payout</span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-slate-500 font-bold">Cooperative Welfare Corpus:</span>
                <p className="text-xl font-black text-blue-700">10% Dedicated</p>
                <span className="text-[10px] text-slate-500">State Labour Board backed</span>
              </div>
            </div>
          </Card>
        </>
      )}
    </div>
  );
};
