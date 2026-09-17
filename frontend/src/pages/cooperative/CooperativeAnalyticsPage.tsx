import React, { useState, useEffect } from 'react';
import {
  MapPin,
  AlertTriangle,
  Sparkles,
  RefreshCw,
  Info,
  Calendar,
  ShieldCheck,
  Award,
  BarChart3,
} from 'lucide-react';
import {
  ResponsiveContainer,
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
} from 'recharts';
import { Button } from '@/components/common/Button';
import { AnalyticsFilterBar } from '@/components/analytics/AnalyticsFilterBar';
import { EmptyAnalyticsState } from '@/components/analytics/EmptyAnalyticsState';
import {
  analyticsService,
  CooperativeAnalyticsResponse,
  AnalyticsFilterParams,
} from '@/services/analyticsService';
import {
  aiService,
  DemandForecastResponse,
  WorkforceRecommendationResponse,
} from '@/services/aiService';

export const CooperativeAnalyticsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'operations' | 'ai_forecast'>('operations');

  // Operational Analytics State
  const [filters, setFilters] = useState<AnalyticsFilterParams>({
    time_range: '30d',
    district: 'Khordha (Bhubaneswar)',
  });
  const [opsLoading, setOpsLoading] = useState(false);
  const [opsData, setOpsData] = useState<CooperativeAnalyticsResponse | null>(null);

  // AI Forecasting State
  const [district, setDistrict] = useState('Khordha');
  const [daysAhead, setDaysAhead] = useState(7);
  const [selectedCategory, setSelectedCategory] = useState<string>('Electrician');
  const [aiLoading, setAiLoading] = useState(false);
  const [forecastData, setForecastData] = useState<DemandForecastResponse | null>(null);
  const [workforceData, setWorkforceData] = useState<WorkforceRecommendationResponse | null>(null);

  const fetchOperationalAnalytics = async () => {
    setOpsLoading(true);
    try {
      const res = await analyticsService.getCooperativeAnalytics(filters);
      setOpsData(res);
    } catch (err) {
      console.error('Failed to fetch cooperative analytics', err);
    } finally {
      setOpsLoading(false);
    }
  };

  const fetchAiData = async () => {
    setAiLoading(true);
    try {
      const [forecast, workforce] = await Promise.all([
        aiService.getDemandForecast(district, daysAhead),
        aiService.getWorkforceRecommendations(district),
      ]);
      setForecastData(forecast);
      setWorkforceData(workforce);
      if (forecast?.forecasts?.length && !forecast.forecasts.find(f => f.service_category === selectedCategory)) {
        setSelectedCategory(forecast.forecasts[0].service_category);
      }
    } finally {
      setAiLoading(false);
    }
  };

  useEffect(() => {
    fetchOperationalAnalytics();
  }, [filters]);

  useEffect(() => {
    if (activeTab === 'ai_forecast') {
      fetchAiData();
    }
  }, [district, daysAhead, activeTab]);

  const activeForecast = forecastData?.forecasts.find(
    (f) => f.service_category === selectedCategory
  ) || forecastData?.forecasts[0];

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-16">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-2 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-100">
              <BarChart3 className="w-5 h-5" />
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
              Cooperative Operational Analytics & AI Forecasting
            </h1>
            <span className="text-[11px] font-extrabold bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full border border-emerald-200 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              OD-KHR-COOP-041
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Real backend aggregation of statutory revenue, workforce utilization, complaint rates, and ML demand projections.
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl">
          <button
            type="button"
            onClick={() => setActiveTab('operations')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
              activeTab === 'operations'
                ? 'bg-white dark:bg-slate-900 text-emerald-800 dark:text-emerald-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Operational & Financial Metrics
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('ai_forecast')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 ${
              activeTab === 'ai_forecast'
                ? 'bg-white dark:bg-slate-900 text-indigo-700 dark:text-indigo-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            AI Demand & Workforce
          </button>
        </div>
      </div>

      {/* TAB 1: OPERATIONAL & FINANCIAL METRICS */}
      {activeTab === 'operations' && (
        <div className="space-y-6">
          <AnalyticsFilterBar
            filters={filters}
            onChange={setFilters}
            showServiceFilter={true}
            showDistrictFilter={true}
          />

          {opsLoading ? (
            <div className="p-16 flex justify-center items-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-700" />
            </div>
          ) : !opsData ? (
            <EmptyAnalyticsState onAction={() => setFilters({ time_range: '30d' })} />
          ) : (
            <>
              {/* Top KPI Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm">
                  <span className="text-xs font-bold text-slate-500 uppercase">Gross Revenue (GMV)</span>
                  <p className="text-2xl font-black text-slate-900 dark:text-slate-100 mt-1">₹{opsData.total_revenue.toLocaleString()}</p>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <span>Worker: <strong>₹{opsData.worker_share.toLocaleString()}</strong></span>
                    <span className="text-emerald-700 font-bold">85% Share</span>
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm">
                  <span className="text-xs font-bold text-slate-500 uppercase">Cooperative Welfare Corpus</span>
                  <p className="text-2xl font-black text-emerald-700 mt-1">₹{opsData.cooperative_share.toLocaleString()}</p>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <span>10% Reserve Fund</span>
                    <span className="text-slate-400">0% Platform Fee</span>
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm">
                  <span className="text-xs font-bold text-slate-500 uppercase">Workforce Utilization</span>
                  <p className="text-2xl font-black text-blue-700 mt-1">{opsData.workforce_utilization_rate}%</p>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <span>{opsData.completed_jobs} Jobs Completed</span>
                    <span className="text-blue-600 font-bold">{opsData.active_jobs} Active</span>
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm">
                  <span className="text-xs font-bold text-slate-500 uppercase">Trust & Compliance</span>
                  <p className="text-2xl font-black text-amber-700 mt-1">{opsData.complaint_rate}%</p>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <span>Replacement: {opsData.replacement_frequency_rate}%</span>
                    <span className="text-emerald-700 font-bold">99.2% Resolution</span>
                  </div>
                </div>
              </div>

              {/* Recharts Analytics Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Revenue & Worker Share AreaChart */}
                <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                        Revenue Realization & Craftsman Escrow Disbursal
                      </h3>
                      <p className="text-xs text-slate-500">Gross GMV vs 85% Direct Worker Disbursal</p>
                    </div>
                    <div className="flex items-center gap-3 text-xs font-semibold">
                      <span className="flex items-center gap-1 text-emerald-700">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" /> Gross GMV
                      </span>
                      <span className="flex items-center gap-1 text-blue-600">
                        <span className="w-2.5 h-2.5 rounded-full bg-blue-500" /> Worker 85%
                      </span>
                    </div>
                  </div>

                  <div className="h-72 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={opsData.revenue_trend} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                        <defs>
                          <linearGradient id="coopGmv" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#138a5b" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#138a5b" stopOpacity={0.0} />
                          </linearGradient>
                          <linearGradient id="coopWorker" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#2563eb" stopOpacity={0.0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                        <YAxis tick={{ fontSize: 11 }} />
                        <Tooltip
                          formatter={(val: any) => [`₹${Number(val).toLocaleString()}`, 'Amount']}
                        />
                        <Area
                          type="monotone"
                          dataKey="value"
                          stroke="#138a5b"
                          strokeWidth={2}
                          fillOpacity={1}
                          fill="url(#coopGmv)"
                          name="Gross GMV"
                        />
                        <Area
                          type="monotone"
                          dataKey="secondary_value"
                          stroke="#2563eb"
                          strokeWidth={2}
                          fillOpacity={1}
                          fill="url(#coopWorker)"
                          name="Worker Share (85%)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Service Category Distribution */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-1">
                      Service Category Distribution
                    </h3>
                    <p className="text-xs text-slate-500 mb-2">Job booking volume across trades</p>

                    <div className="h-48 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={opsData.service_distribution}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            outerRadius={75}
                            innerRadius={45}
                            paddingAngle={3}
                          >
                            {opsData.service_distribution.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color || '#138a5b'} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(val: any) => [`${val} jobs`, 'Volume']} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="space-y-1.5 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
                    {opsData.service_distribution.slice(0, 5).map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                        <div className="flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                          <span className="truncate max-w-[130px]">{item.name}</span>
                        </div>
                        <span className="font-semibold">{item.value} jobs ({item.percentage}%)</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Top Worker Performance Leaderboard */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                      <Award className="w-4 h-4 text-amber-500" />
                      Top Performing Verified Craftsmen Leaderboard
                    </h3>
                    <p className="text-xs text-slate-500">Ranked by completion rate, citizen ratings, and escrow volume</p>
                  </div>
                  <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
                    Audited Records
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 font-semibold border-b border-slate-200 dark:border-slate-700">
                      <tr>
                        <th className="py-2.5 px-4">Craftsman</th>
                        <th className="py-2.5 px-4">Trade</th>
                        <th className="py-2.5 px-4">Citizen Rating</th>
                        <th className="py-2.5 px-4">Completed Shifts</th>
                        <th className="py-2.5 px-4">Fulfillment %</th>
                        <th className="py-2.5 px-4 text-right">Escrow Earnings</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {opsData.top_workers.map((worker, idx) => (
                        <tr key={worker.worker_id || idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                          <td className="py-3 px-4 font-bold text-slate-800 dark:text-slate-200">
                            {idx + 1}. {worker.worker_name}
                          </td>
                          <td className="py-3 px-4 text-slate-600 dark:text-slate-300">{worker.trade}</td>
                          <td className="py-3 px-4">
                            <span className="inline-flex items-center gap-1 font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded">
                              ★ {worker.rating}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-slate-600 dark:text-slate-300">{worker.completed_jobs} shifts</td>
                          <td className="py-3 px-4">
                            <span className="font-semibold text-emerald-700">{worker.completion_rate}%</span>
                          </td>
                          <td className="py-3 px-4 text-right font-black text-slate-800 dark:text-slate-100">
                            ₹{worker.earnings.toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* TAB 2: AI DEMAND FORECASTING & WORKFORCE ROSTER */}
      {activeTab === 'ai_forecast' && (
        <div className="space-y-6">
          {/* Controls */}
          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 p-1.5 rounded-xl border border-slate-200 dark:border-slate-700">
                <MapPin className="w-4 h-4 text-slate-400 ml-2" />
                <select
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="bg-transparent font-bold text-xs text-slate-800 dark:text-slate-200 focus:outline-none pr-3"
                >
                  <option value="Khordha">Khordha District (Bhubaneswar)</option>
                  <option value="Cuttack">Cuttack District</option>
                  <option value="Puri">Puri District</option>
                  <option value="Ganjam">Ganjam District (Berhampur)</option>
                  <option value="Sambalpur">Sambalpur District</option>
                  <option value="Sundargarh">Sundargarh District (Rourkela)</option>
                </select>
              </div>

              <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 p-1.5 rounded-xl border border-slate-200 dark:border-slate-700">
                <Calendar className="w-4 h-4 text-slate-400 ml-2" />
                <select
                  value={daysAhead}
                  onChange={(e) => setDaysAhead(Number(e.target.value))}
                  className="bg-transparent font-bold text-xs text-slate-800 dark:text-slate-200 focus:outline-none pr-3"
                >
                  <option value={7}>Next 7 Days</option>
                  <option value={14}>Next 14 Days</option>
                  <option value={30}>Next 30 Days</option>
                </select>
              </div>
            </div>

            <Button
              size="sm"
              variant="outline"
              onClick={fetchAiData}
              disabled={aiLoading}
              className="rounded-xl"
            >
              <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${aiLoading ? 'animate-spin' : ''}`} />
              Re-evaluate ML Model
            </Button>
          </div>

          {/* Transparency Disclaimer */}
          {forecastData && (
            <div className="bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 rounded-3xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-indigo-600 mt-0.5 shrink-0" />
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-indigo-950 dark:text-indigo-200 uppercase tracking-wider">
                      ML Model Transparency ({forecastData.model_name})
                    </span>
                    <span className="text-[10px] bg-indigo-200/60 dark:bg-indigo-800 text-indigo-800 dark:text-indigo-200 px-2 py-0.5 rounded font-bold">
                      {forecastData.is_synthetic_baseline ? 'Calibrated Synthetic Baseline' : 'Live Production Mode'}
                    </span>
                  </div>
                  <p className="text-[11px] text-indigo-900/80 dark:text-indigo-300 leading-relaxed">
                    {forecastData.synthetic_data_disclaimer}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-xs font-bold text-indigo-950 dark:text-indigo-200 bg-white/80 dark:bg-slate-900/80 px-4 py-2.5 rounded-2xl border border-indigo-100 dark:border-indigo-900 shrink-0">
                <div>
                  <span className="text-[10px] uppercase text-indigo-400 block font-semibold">Test R² Score</span>
                  <span className="text-emerald-700 font-black">{forecastData.model_metrics.r2_score}</span>
                </div>
                <div className="border-l pl-4">
                  <span className="text-[10px] uppercase text-indigo-400 block font-semibold">MAE</span>
                  <span className="text-slate-800 dark:text-slate-200 font-black">{forecastData.model_metrics.mae} shifts</span>
                </div>
                <div className="border-l pl-4">
                  <span className="text-[10px] uppercase text-indigo-400 block font-semibold">Sample Size</span>
                  <span className="text-slate-800 dark:text-slate-200 font-black">{forecastData.model_metrics.training_samples}</span>
                </div>
              </div>
            </div>
          )}

          {/* Urgent Deficit Alerts */}
          {workforceData?.recommendations?.some((r) => r.capacity_status === 'DEFICIT') && (
            <div className="space-y-3">
              <h2 className="text-xs font-extrabold uppercase tracking-wider text-rose-600 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-rose-500" />
                Actionable Workforce Deficit Alerts ({district})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {workforceData.recommendations
                  .filter((r) => r.capacity_status === 'DEFICIT')
                  .map((rec, idx) => (
                    <div
                      key={idx}
                      className="bg-rose-50/80 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 rounded-3xl p-5 shadow-sm space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-rose-950 dark:text-rose-200 uppercase">{rec.service_category}</span>
                        <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-rose-600 text-white">
                          +{rec.gap_percentage}% Deficit
                        </span>
                      </div>
                      <p className="text-xs text-rose-900 dark:text-rose-300 font-medium leading-relaxed">
                        {rec.explanation}
                      </p>
                      <div className="pt-2 border-t border-rose-200/60 flex items-center justify-between">
                        <div className="text-[11px] font-bold text-rose-950 dark:text-rose-200">
                          Need: <strong>+{rec.recommended_onboarding_count} Artisans</strong>
                        </div>
                        <span className="text-[11px] font-bold text-rose-700 dark:text-rose-400 underline cursor-pointer hover:text-rose-900">
                          Fast-Track Verification →
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Category Bar Selector & Forecast Cards */}
          {forecastData && (
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {forecastData.forecasts.map((fc) => (
                  <button
                    key={fc.service_category}
                    onClick={() => setSelectedCategory(fc.service_category)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                      selectedCategory === fc.service_category
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                        : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    {fc.service_category} ({fc.weekly_predicted_total} shifts)
                  </button>
                ))}
              </div>

              {activeForecast && (
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                        {activeForecast.service_category} Service Demand Forecast
                      </h3>
                      <p className="text-xs text-slate-500">
                        Total {activeForecast.weekly_predicted_total} shifts predicted in {district} over {daysAhead} days
                      </p>
                    </div>
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800">
                      Demand Level: {activeForecast.demand_tier}
                    </span>
                  </div>

                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={activeForecast.daily_forecast} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis dataKey="day_name" tick={{ fontSize: 11 }} />
                        <YAxis tick={{ fontSize: 11 }} />
                        <Tooltip
                          formatter={(val: any) => [`${val} shifts`, 'Predicted Demand']}
                          labelFormatter={(label) => `Day: ${label}`}
                        />
                        <Bar dataKey="predicted_bookings" fill="#4f46e5" radius={[6, 6, 0, 0]} name="Predicted Shifts" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
