import React, { useState, useEffect } from 'react';
import {
  matchingService,
  RadarUnitRecord,
  CooperativeRadarRecord,
} from '@/services/matchingService';
import { LeafletMap, MapMarkerItem } from '@/components/common/LeafletMap';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import {
  Radio,
  ShieldCheck,
  Zap,
  MapPin,
  RefreshCw,
  Search,
  Filter,
  Users,
} from 'lucide-react';

export const EmergencyAllocationMapPage: React.FC = () => {
  const [radarData, setRadarData] = useState<CooperativeRadarRecord | null>(null);
  const [selectedTrade, setSelectedTrade] = useState('ALL');
  const [selectedUnit, setSelectedUnit] = useState<RadarUnitRecord | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchRadar = async () => {
    setLoading(true);
    try {
      const data = await matchingService.getRadar(selectedTrade === 'ALL' ? undefined : selectedTrade);
      setRadarData(data);
      if (data.units.length > 0 && !selectedUnit) {
        setSelectedUnit(data.units[0]);
      }
    } catch (err) {
      console.error('Failed to load GIS radar data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRadar();
  }, [selectedTrade]);

  const mapMarkers: MapMarkerItem[] = radarData
    ? radarData.units.map((u) => ({
        id: u.worker_id,
        lat: u.lat,
        lng: u.lng,
        title: u.worker_name,
        subtitle: `${u.locality} • ${u.trade}`,
        trade: u.trade,
        rating: u.rating,
        type: 'WORKER',
        isOnline: u.is_online,
      }))
    : [];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Command Center Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 p-6 rounded-3xl text-white shadow-xl border-l-4 border-emerald-500 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-full text-xs font-bold border border-emerald-500/30">
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            Live Cooperative Operations & Emergency Dispatch Command
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Geographic Workforce Radar & Emergency Standby Desk
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm max-w-3xl leading-relaxed">
            Real-time geospatial tracking of registered cooperative members. Monitor online availability, allocate fast-track
            emergency requests, and ensure 15-minute standby emergency SLA fulfillment.
          </p>
        </div>

        <Button
          onClick={fetchRadar}
          variant="outline"
          className="border-slate-700 hover:bg-slate-800 text-white text-xs flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" /> Refresh Radar
        </Button>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="p-4 border-slate-200 bg-white shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-50 text-emerald-700 rounded-xl">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500">Active Artisans Online</p>
              <h3 className="text-lg font-black text-slate-900">{radarData?.total_active_units || 0} Craftsmen</h3>
            </div>
          </div>
        </Card>

        <Card className="p-4 border-slate-200 bg-white shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-rose-50 text-rose-700 rounded-xl">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500">Standby Emergency Units</p>
              <h3 className="text-lg font-black text-slate-900">
                {radarData?.units.filter((u) => u.standby_available).length || 0} Ready
              </h3>
            </div>
          </div>
        </Card>

        <Card className="p-4 border-slate-200 bg-white shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-50 text-blue-700 rounded-xl">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500">Police Cleared Ratio</p>
              <h3 className="text-lg font-black text-slate-900">100% Verified</h3>
            </div>
          </div>
        </Card>

        <Card className="p-4 border-slate-200 bg-white shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-50 text-amber-700 rounded-xl">
              <Radio className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500">Average Emergency ETA</p>
              <h3 className="text-lg font-black text-slate-900">12.4 Mins</h3>
            </div>
          </div>
        </Card>
      </div>

      {/* Main Radar Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Interactive Map (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          <Card className="p-4 border-slate-200 bg-white shadow-sm space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-600" />
                <h3 className="font-extrabold text-sm text-slate-900">
                  Bhubaneswar Urban Jurisdiction ({radarData?.cooperative_code || 'OD-KHR-COOP-041'})
                </h3>
              </div>

              {/* Trade Filter */}
              <div className="flex items-center gap-2">
                <Filter className="w-3.5 h-3.5 text-slate-400" />
                <select
                  value={selectedTrade}
                  onChange={(e) => setSelectedTrade(e.target.value)}
                  className="text-xs p-1.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="ALL">All Trade Disciplines</option>
                  <option value="Electrician">Electricians</option>
                  <option value="Plumber">Plumbers</option>
                  <option value="Caregiver">Caregivers</option>
                  <option value="Carpenter">Carpenters</option>
                </select>
              </div>
            </div>

            {/* Leaflet Map with 8km Radius Circle */}
            <LeafletMap
              center={[20.2961, 85.8245]}
              zoom={13}
              markers={mapMarkers}
              radiusKm={8.0}
              showPolylineToWorkerId={selectedUnit?.worker_id}
              height="450px"
            />
          </Card>
        </div>

        {/* Right: Selected Artisan & Standby Pool Roster (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          {selectedUnit && (
            <Card className="p-5 border-emerald-200 bg-emerald-50/40 shadow-sm space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold text-emerald-800 uppercase bg-emerald-100 px-2 py-0.5 rounded border border-emerald-200">
                  {selectedUnit.shram_id}
                </span>
                <span className="text-[10px] font-bold text-emerald-700 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span> Online
                </span>
              </div>

              <div>
                <h3 className="font-black text-base text-slate-900">{selectedUnit.worker_name}</h3>
                <p className="text-slate-600 font-medium">
                  {selectedUnit.trade} • {selectedUnit.locality}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 bg-white p-3 rounded-xl border border-slate-200">
                <div>
                  <span className="text-[10px] text-slate-400 block">Rating</span>
                  <span className="font-bold text-slate-800">★ {selectedUnit.rating}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Shifts Today</span>
                  <span className="font-bold text-slate-800">{selectedUnit.active_jobs_today} Active</span>
                </div>
              </div>

              <div className="p-2.5 bg-white rounded-xl border border-slate-200 text-[11px] text-slate-600 space-y-1">
                <div className="font-bold text-slate-800 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Standby Dispatch Qualification
                </div>
                <p>Police Cleared • High Proximity Score • Direct 100% Payout</p>
              </div>
            </Card>
          )}

          {/* Unit List */}
          <Card className="p-4 border-slate-200 bg-white shadow-sm space-y-3">
            <h4 className="font-extrabold text-xs text-slate-800 flex items-center justify-between">
              <span>Craftsman Units ({radarData?.units.length || 0})</span>
              <Search className="w-3.5 h-3.5 text-slate-400" />
            </h4>

            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {loading ? (
                <div className="p-4 text-center text-xs text-slate-400">Loading units...</div>
              ) : radarData?.units.map((u) => (
                <button
                  key={u.worker_id}
                  type="button"
                  onClick={() => setSelectedUnit(u)}
                  className={`w-full p-3 rounded-xl border text-left transition space-y-1 ${
                    selectedUnit?.worker_id === u.worker_id
                      ? 'border-emerald-600 bg-emerald-50/70 shadow-2xs'
                      : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-black text-slate-900">{u.worker_name}</span>
                    <span className="text-[10px] text-slate-500">★ {u.rating}</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span>{u.trade}</span>
                    <span>{u.locality}</span>
                  </div>
                </button>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
