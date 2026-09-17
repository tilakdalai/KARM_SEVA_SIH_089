import React, { useMemo } from 'react';
import { Calendar, MapPin, Briefcase, Building, Navigation } from 'lucide-react';
import { AnalyticsFilterParams } from '../../services/analyticsService';
import {
  INDIAN_STATES_AND_UTS,
  getDistrictsForState,
} from '@/constants/indianLocations';

interface AnalyticsFilterBarProps {
  filters: AnalyticsFilterParams & { state?: string };
  onChange: (updated: AnalyticsFilterParams & { state?: string }) => void;
  showServiceFilter?: boolean;
  showStateFilter?: boolean;
  showDistrictFilter?: boolean;
  showCooperativeFilter?: boolean;
  servicesList?: string[];
  districtsList?: string[];
}

const DEFAULT_SERVICES = [
  'All Trades',
  'Electrician',
  'Plumber',
  'Deep Cleaning',
  'Carpentry',
  'Driver',
  'Caregiver',
  'Painter',
  'Gardener',
  'Domestic Helper',
  'Technician',
];

export const AnalyticsFilterBar: React.FC<AnalyticsFilterBarProps> = ({
  filters,
  onChange,
  showServiceFilter = false,
  showStateFilter = true,
  showDistrictFilter = false,
  showCooperativeFilter = false,
  servicesList = DEFAULT_SERVICES,
}) => {
  const timeRanges: { id: AnalyticsFilterParams['time_range']; label: string }[] = [
    { id: '7d', label: '7 Days' },
    { id: '30d', label: '30 Days' },
    { id: '3m', label: '3 Months' },
    { id: '6m', label: '6 Months' },
    { id: '1y', label: '1 Year' },
    { id: 'custom', label: 'Custom' },
  ];

  // Dynamically compute available districts based on selected state
  const availableDistricts = useMemo(() => {
    if (!filters.state || filters.state === 'All India') {
      return [
        'All Districts',
        'New Delhi', 'Central Delhi', 'South Delhi',
        'Mumbai City', 'Mumbai Suburban', 'Pune', 'Nagpur',
        'Bengaluru Urban', 'Bengaluru Rural', 'Mysuru',
        'Chennai', 'Coimbatore', 'Madurai',
        'Kolkata', 'Howrah', 'North 24 Parganas',
        'Khordha (Bhubaneswar)', 'Cuttack', 'Puri', 'Ganjam (Berhampur)', 'Sundargarh (Rourkela)',
        'Ahmedabad', 'Surat', 'Vadodara',
        'Jaipur', 'Jodhpur', 'Kota',
        'Lucknow', 'Kanpur Nagar', 'Gautam Buddha Nagar (Noida)', 'Varanasi',
        'Hyderabad', 'Rangareddy', 'Warangal'
      ];
    }
    const dists = getDistrictsForState(filters.state);
    return ['All Districts', ...dists];
  }, [filters.state]);

  const handleStateChange = (stateVal: string) => {
    const isAll = !stateVal || stateVal === 'All India';
    onChange({
      ...filters,
      state: isAll ? undefined : stateVal,
      district: undefined, // Reset district when state changes
    });
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-sm mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        {/* Time Range Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mr-2 flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-emerald-600" />
            Period:
          </span>
          {timeRanges.map((range) => {
            const active = (filters.time_range || '30d') === range.id;
            return (
              <button
                key={range.id}
                type="button"
                onClick={() => onChange({ ...filters, time_range: range.id })}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                  active
                    ? 'bg-emerald-700 text-white shadow-sm ring-2 ring-emerald-600 ring-offset-1'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {range.label}
              </button>
            );
          })}
        </div>

        {/* Pan-India Secondary Filter Dropdowns */}
        <div className="flex flex-wrap items-center gap-3">
          {/* State / UT Filter */}
          {showStateFilter && (
            <div className="flex items-center gap-1.5">
              <Navigation className="w-3.5 h-3.5 text-emerald-600" />
              <select
                aria-label="Filter by State or UT"
                value={filters.state || ''}
                onChange={(e) => handleStateChange(e.target.value)}
                className="text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
              >
                <option value="">🇮🇳 All India (All States & UTs)</option>
                {INDIAN_STATES_AND_UTS.map((st) => (
                  <option key={st.code} value={st.name}>
                    {st.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* District Filter (Dynamic based on selected state) */}
          {showDistrictFilter && (
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-blue-600" />
              <select
                aria-label="Filter by district"
                value={filters.district || ''}
                onChange={(e) =>
                  onChange({
                    ...filters,
                    district: e.target.value === 'All Districts' || !e.target.value ? undefined : e.target.value,
                  })
                }
                className="text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
              >
                {availableDistricts.map((d) => (
                  <option key={d} value={d === 'All Districts' ? '' : d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Trade Filter */}
          {showServiceFilter && (
            <div className="flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5 text-slate-400" />
              <select
                aria-label="Filter by trade"
                value={filters.service || ''}
                onChange={(e) =>
                  onChange({
                    ...filters,
                    service: e.target.value === 'All Trades' || !e.target.value ? undefined : e.target.value,
                  })
                }
                className="text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {servicesList.map((s) => (
                  <option key={s} value={s === 'All Trades' ? '' : s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Cooperative Filter */}
          {showCooperativeFilter && (
            <div className="flex items-center gap-1.5">
              <Building className="w-3.5 h-3.5 text-slate-400" />
              <select
                aria-label="Filter by cooperative"
                value={filters.cooperative_id || ''}
                onChange={(e) =>
                  onChange({
                    ...filters,
                    cooperative_id: e.target.value || undefined,
                  })
                }
                className="text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="">All Cooperatives</option>
                <option value="DL-CENTRAL-COOP-01">Delhi Urban Craftsmen Union (DL)</option>
                <option value="MH-PUNE-COOP-02">Pune Shramik Sahakari Sanstha (MH)</option>
                <option value="KA-BLR-COOP-03">Bengaluru Labour Federation (KA)</option>
                <option value="OD-KHR-COOP-041">Bhubaneswar Urban Craftsmen (OD)</option>
                <option value="OD-CTC-COOP-012">Cuttack Shramik Vikas Union (OD)</option>
                <option value="TN-CHN-COOP-05">Chennai Artisan Guild (TN)</option>
                <option value="WB-KOL-COOP-06">Kolkata Labour Cooperative (WB)</option>
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Custom Date Pickers when custom is chosen */}
      {filters.time_range === 'custom' && (
        <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-3">
          <span className="text-xs text-slate-500 font-medium">Custom Range:</span>
          <input
            type="date"
            aria-label="Start Date"
            value={filters.start_date || ''}
            onChange={(e) => onChange({ ...filters, start_date: e.target.value })}
            className="text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-1.5"
          />
          <span className="text-xs text-slate-400">to</span>
          <input
            type="date"
            aria-label="End Date"
            value={filters.end_date || ''}
            onChange={(e) => onChange({ ...filters, end_date: e.target.value })}
            className="text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-1.5"
          />
        </div>
      )}
    </div>
  );
};
