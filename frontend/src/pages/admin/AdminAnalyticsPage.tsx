import React, { useState, useEffect } from 'react';
import {
  Cpu,
  Sparkles,
  GraduationCap,
  MapPin,
  RefreshCw,
  ShieldCheck,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Button } from '@/components/common/Button';
import { AnalyticsFilterBar } from '@/components/analytics/AnalyticsFilterBar';
import { EmptyAnalyticsState } from '@/components/analytics/EmptyAnalyticsState';
import {
  analyticsService,
  AdminImpactAnalyticsResponse,
  AnalyticsFilterParams,
} from '@/services/analyticsService';
import {
  aiService,
  SkillGapResponse,
  SkillGapItem,
} from '@/services/aiService';

export const AdminAnalyticsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'impact' | 'ai_market'>('impact');

  // Platform Impact State
  const [filters, setFilters] = useState<AnalyticsFilterParams>({
    time_range: '30d',
  });
  const [impactLoading, setImpactLoading] = useState(false);
  const [impactData, setImpactData] = useState<AdminImpactAnalyticsResponse | null>(null);

  // AI Market State
  const [skillGaps, setSkillGaps] = useState<SkillGapResponse | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState('Khordha');
  const [aiLoading, setAiLoading] = useState(false);

  const fetchImpactAnalytics = async () => {
    setImpactLoading(true);
    try {
      const res = await analyticsService.getAdminImpactAnalytics(filters);
      setImpactData(res);
    } catch (err) {
      console.error('Failed to fetch admin impact analytics', err);
    } finally {
      setImpactLoading(false);
    }
  };

  const fetchAiAnalytics = async () => {
    setAiLoading(true);
    try {
      const gapData = await aiService.getSkillGapAnalytics('Odisha');
      setSkillGaps(gapData);
    } finally {
      setAiLoading(false);
    }
  };

  useEffect(() => {
    fetchImpactAnalytics();
  }, [filters]);

  useEffect(() => {
    if (activeTab === 'ai_market') {
      fetchAiAnalytics();
    }
  }, [selectedDistrict, activeTab]);

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-16">
      {/* Top Header */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-xl flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-700" />
              State Macro Governance
            </span>
            <span className="text-[10px] font-black uppercase tracking-wider bg-indigo-100 text-indigo-800 px-2.5 py-1 rounded-xl flex items-center gap-1">
              <Cpu className="w-3 h-3 text-indigo-600" />
              AI Labor Market Engine
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
            Odisha Multi-District Platform Impact & Labor Analytics
          </h1>
          <p className="text-xs text-slate-500">
            Real backend aggregation of statutory disbursements, 0% platform fee enforcement, and macro labor balancing.
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl">
          <button
            type="button"
            onClick={() => setActiveTab('impact')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
              activeTab === 'impact'
                ? 'bg-white dark:bg-slate-900 text-emerald-800 dark:text-emerald-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Platform Impact Metrics
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('ai_market')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 ${
              activeTab === 'ai_market'
                ? 'bg-white dark:bg-slate-900 text-indigo-700 dark:text-indigo-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            AI Labor & Skill Gaps
          </button>
        </div>
      </div>

      {/* TAB 1: PLATFORM IMPACT & GOVERNANCE */}
      {activeTab === 'impact' && (
        <div className="space-y-6">
          <AnalyticsFilterBar
            filters={filters}
            onChange={setFilters}
            showServiceFilter={true}
            showDistrictFilter={true}
            showCooperativeFilter={true}
          />

          {impactLoading ? (
            <div className="p-16 flex justify-center items-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-700" />
            </div>
          ) : !impactData ? (
            <EmptyAnalyticsState onAction={() => setFilters({ time_range: '30d' })} />
          ) : (
            <>
              {/* Macro Impact Stat Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
                  <span className="text-xs font-bold text-slate-500 uppercase">Total Platform GMV</span>
                  <p className="text-2xl font-black text-slate-900 dark:text-slate-100 mt-1">₹{impactData.platform_gmv.toLocaleString()}</p>
                  <p className="text-[11px] text-emerald-700 font-semibold mt-1">Direct citizen-to-coop escrow</p>
                </div>

                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
                  <span className="text-xs font-bold text-slate-500 uppercase">Worker Direct Earnings</span>
                  <p className="text-2xl font-black text-emerald-700 mt-1">₹{impactData.worker_disbursements.toLocaleString()}</p>
                  <p className="text-[11px] text-slate-500 mt-1">85% direct craftsman disbursal</p>
                </div>

                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
                  <span className="text-xs font-bold text-slate-500 uppercase">Cooperative Welfare Corpus</span>
                  <p className="text-2xl font-black text-blue-700 mt-1">₹{impactData.cooperative_corpus.toLocaleString()}</p>
                  <p className="text-[11px] text-slate-500 mt-1">10% district worker security pool</p>
                </div>

                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
                  <span className="text-xs font-bold text-slate-500 uppercase">State Trust Index</span>
                  <p className="text-2xl font-black text-purple-700 mt-1">{impactData.average_satisfaction_rating} / 5.0</p>
                  <p className="text-[11px] text-slate-500 mt-1">{impactData.dispute_resolution_rate}% Dispute Resolution</p>
                </div>
              </div>

              {/* Charts Section */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* GMV Timeseries Trend */}
                <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                        State Gross Merchandise Value (GMV) Trend
                      </h3>
                      <p className="text-xs text-slate-500">Economic transactions routed through cooperatives</p>
                    </div>
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
                      Zero Platform Tax
                    </span>
                  </div>

                  <div className="h-72 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={impactData.gmv_trend} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                        <defs>
                          <linearGradient id="adminGmv" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#138a5b" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#138a5b" stopOpacity={0.0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                        <YAxis tick={{ fontSize: 11 }} />
                        <Tooltip formatter={(val: any) => [`₹${Number(val).toLocaleString()}`, 'GMV']} />
                        <Area
                          type="monotone"
                          dataKey="value"
                          stroke="#138a5b"
                          strokeWidth={2}
                          fillOpacity={1}
                          fill="url(#adminGmv)"
                          name="State GMV"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* District Distribution Bar Chart */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-1">
                      District Economic Activity
                    </h3>
                    <p className="text-xs text-slate-500 mb-4">Volume distribution across major districts</p>

                    <div className="h-56 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={impactData.district_distribution}
                          layout="vertical"
                          margin={{ top: 0, right: 20, left: 30, bottom: 0 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                          <XAxis type="number" tick={{ fontSize: 10 }} />
                          <YAxis dataKey="name" type="category" tick={{ fontSize: 10 }} width={80} />
                          <Tooltip formatter={(val: any) => [`${val}%`, 'State Share']} />
                          <Bar dataKey="percentage" fill="#2563eb" radius={[0, 4, 4, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500">
                    Active in <strong>6 key industrial & urban clusters</strong> across Odisha.
                  </div>
                </div>
              </div>

              {/* Service Distribution Pie and Citizen Reach */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm md:col-span-1">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-1">
                    Statewide Trade Distribution
                  </h3>
                  <p className="text-xs text-slate-500 mb-2">Demand breakdown by craft type</p>

                  <div className="h-44 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={impactData.service_distribution}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={65}
                          innerRadius={35}
                          paddingAngle={3}
                        >
                          {impactData.service_distribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color || '#138a5b'} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(val: any) => [`${val}%`, 'Share']} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm md:col-span-2 flex flex-col justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-1">
                      Citizen Inclusion & Informal Sector Formalization
                    </h3>
                    <p className="text-xs text-slate-500 mb-4">
                      Public digital infrastructure metrics tracking direct benefit transfers and welfare enrollments
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                      <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                        <span className="text-slate-500">Total Registered Artisans</span>
                        <p className="text-xl font-black text-slate-900 dark:text-slate-100 mt-1">{impactData.total_active_workers}</p>
                        <span className="text-[10px] text-emerald-700 font-semibold">100% Aadhaar & Police cleared</span>
                      </div>

                      <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                        <span className="text-slate-500">Citizens Served</span>
                        <p className="text-xl font-black text-blue-700 mt-1">{impactData.total_citizens_served}</p>
                        <span className="text-[10px] text-slate-400">Zero commission charged</span>
                      </div>

                      <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                        <span className="text-slate-500">Dispute Settlement Rate</span>
                        <p className="text-xl font-black text-purple-700 mt-1">{impactData.dispute_resolution_rate}%</p>
                        <span className="text-[10px] text-purple-600 font-semibold">Cooperative conciliation desk</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
                    <span>Audit Status: <strong>Statutory Compliant (Odisha Cooperative Societies Act)</strong></span>
                    <span className="text-emerald-700 font-bold">100% On-Chain Escrow</span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* TAB 2: AI LABOR MARKET & SKILL GAP ENGINE */}
      {activeTab === 'ai_market' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-slate-400" />
              <select
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                className="bg-slate-50 dark:bg-slate-800 font-bold text-xs text-slate-800 dark:text-slate-200 p-2 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none"
              >
                <option value="Khordha">Khordha District</option>
                <option value="Cuttack">Cuttack District</option>
                <option value="Puri">Puri District</option>
                <option value="Ganjam">Ganjam District</option>
                <option value="Sambalpur">Sambalpur District</option>
              </select>
            </div>

            <Button
              size="sm"
              variant="outline"
              onClick={fetchAiAnalytics}
              disabled={aiLoading}
              className="rounded-xl"
            >
              <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${aiLoading ? 'animate-spin' : ''}`} />
              Re-run Multi-District Inference
            </Button>
          </div>

          {/* Skill Gap Matrix */}
          {skillGaps && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-indigo-600" />
                    State Vocational Skill-Gap Matrix
                  </h3>
                  <p className="text-xs text-slate-500">
                    High-demand certifications needed for industrial and institutional workforce tenders
                  </p>
                </div>
                <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full">
                  Skill Development Quota
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {skillGaps.gaps.map((gap: SkillGapItem, idx: number) => (
                  <div key={idx} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-slate-800 dark:text-slate-200">{gap.trade}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        gap.gap_severity === 'HIGH_DEFICIT' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {gap.gap_severity}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Market Demand: <strong>{gap.demand_index}/100</strong>
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Trained Supply: <strong>{gap.supply_index}/100</strong>
                    </div>
                    <p className="text-[11px] text-indigo-900 dark:text-indigo-300 pt-1 border-t border-slate-200 dark:border-slate-700 font-medium">
                      Curriculum: {gap.proposed_training_batch.curriculum} ({gap.proposed_training_batch.seats} seats)
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
