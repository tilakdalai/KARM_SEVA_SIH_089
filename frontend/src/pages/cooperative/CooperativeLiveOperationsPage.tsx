import React from 'react';
import {
  Radio,
  MapPin,
  Activity,
  Zap,
} from 'lucide-react';

export const CooperativeLiveOperationsPage: React.FC = () => {

  const liveUnits = [
    {
      id: 'unit-1',
      workerName: 'Ramesh Chandra Behera',
      shramId: 'KS-OD-2024-8841',
      trade: 'Master Electrician',
      status: 'ON_ROUTE',
      location: 'Saheed Nagar, Near Durga Mandap (Lat: 20.2961, Lon: 85.8245)',
      activeBooking: 'BK-8841 (MCB Fault repair)',
      eta: '4 mins',
      battery: '94%',
    },
    {
      id: 'unit-2',
      workerName: 'Sunita Majhi',
      shramId: 'KS-OD-2024-3912',
      trade: 'Senior Patient Caregiver',
      status: 'ON_SITE',
      location: 'Royal Palms, Nayapalli (Lat: 20.2980, Lon: 85.8050)',
      activeBooking: 'BK-8842 (Post-op Care)',
      eta: 'Shift in Progress',
      battery: '82%',
    },
    {
      id: 'unit-3',
      workerName: 'Prakash Sahoo',
      shramId: 'KS-OD-2024-7718',
      trade: 'Carpenter & Wood Specialist',
      status: 'AVAILABLE_IDLE',
      location: 'Sector 5, Niladri Vihar (Lat: 20.3201, Lon: 85.8120)',
      activeBooking: 'Awaiting Next Dispatch',
      eta: 'Standby',
      battery: '88%',
    },
    {
      id: 'unit-4',
      workerName: 'Bhabani Shankar Rout',
      shramId: 'KS-OD-2024-9102',
      trade: 'Commercial Driver & Ambulance Pilot',
      status: 'AVAILABLE_IDLE',
      location: 'Khurda Bus Stand Hub (Lat: 20.1820, Lon: 85.6210)',
      activeBooking: 'Standby Emergency Transport',
      eta: 'Standby',
      battery: '98%',
    },
  ];

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-12">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Live Operations & GPS Workforce Radar
            </h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping" />
              142 ACTIVE TRANSPONDERS
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Real-time geospatial telemetry, active citizen job progress, and automated panic button monitoring.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => alert('Broadcasting high-priority SOS test to all active members...')}
            className="px-3.5 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition"
          >
            <Zap className="w-4 h-4" />
            Cooperative SOS Channel
          </button>
        </div>
      </div>

      {/* Geospatial Radar Simulation & List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Interactive Map Visual Mockup */}
        <div className="lg:col-span-2 bg-slate-900 rounded-2xl p-6 border border-slate-800 text-white relative overflow-hidden flex flex-col justify-between min-h-[460px] shadow-xl">
          {/* Background Grid Lines */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-40 pointer-events-none" />

          {/* Map Header Overlay */}
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-2 bg-slate-800/90 px-3 py-1.5 rounded-lg border border-slate-700 text-xs">
              <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
              <span>Bhubaneswar & Khurda District Geo-Fence Active</span>
            </div>
            <div className="text-[11px] font-mono text-slate-400 bg-slate-800/90 px-2.5 py-1 rounded border border-slate-700">
              REFRESH: 2.4s • GPS PRECISION: ±3m
            </div>
          </div>

          {/* Mock Markers on Map */}
          <div className="relative z-10 my-auto py-12 flex flex-wrap items-center justify-around gap-6">
            <div className="bg-emerald-500/20 border-2 border-emerald-400 p-3 rounded-xl backdrop-blur-md text-center max-w-[180px] shadow-lg animate-bounce">
              <MapPin className="w-6 h-6 text-emerald-400 mx-auto mb-1" />
              <div className="font-bold text-xs">Ramesh Behera</div>
              <div className="text-[10px] text-emerald-300 font-mono">ON THE WAY (BK-8841)</div>
            </div>

            <div className="bg-amber-500/20 border-2 border-amber-400 p-3 rounded-xl backdrop-blur-md text-center max-w-[180px] shadow-lg">
              <Activity className="w-6 h-6 text-amber-400 mx-auto mb-1" />
              <div className="font-bold text-xs">Sunita Majhi</div>
              <div className="text-[10px] text-amber-300 font-mono">ON SITE (BK-8842)</div>
            </div>

            <div className="bg-blue-500/20 border-2 border-blue-400 p-3 rounded-xl backdrop-blur-md text-center max-w-[180px] shadow-lg">
              <Radio className="w-6 h-6 text-blue-400 mx-auto mb-1" />
              <div className="font-bold text-xs">Prakash Sahoo</div>
              <div className="text-[10px] text-blue-300 font-mono">IDLE / READY (0.8km)</div>
            </div>
          </div>

          {/* Map Footer Overlay */}
          <div className="relative z-10 flex items-center justify-between text-xs bg-slate-800/80 p-3 rounded-xl border border-slate-700">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                Dispatched (21)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-400" />
                Standby Ready (121)
              </span>
            </div>
            <span className="text-slate-400 text-[11px]">GIS Layer: Survey of India Open Data</span>
          </div>
        </div>

        {/* Live Active Units Stream */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4 flex flex-col">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="font-bold text-slate-900 text-sm">Active Units Stream</div>
            <div className="text-xs text-slate-500">{liveUnits.length} Monitored</div>
          </div>

          <div className="space-y-3 flex-1 overflow-y-auto max-h-[400px]">
            {liveUnits.map((u) => (
              <div
                key={u.id}
                className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:border-slate-400 transition space-y-2"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-bold text-slate-900 text-xs">{u.workerName}</div>
                    <div className="text-[10px] font-mono text-slate-500">{u.shramId}</div>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      u.status === 'ON_ROUTE'
                        ? 'bg-amber-100 text-amber-800'
                        : u.status === 'ON_SITE'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {u.status.replace('_', ' ')}
                  </span>
                </div>

                <div className="text-xs text-slate-700 font-medium">
                  <strong>Task:</strong> {u.activeBooking}
                </div>

                <div className="text-[11px] text-slate-500 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                  {u.location}
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-slate-200 text-[11px] text-slate-600">
                  <span>ETA: <strong>{u.eta}</strong></span>
                  <span>Battery: <strong>{u.battery}</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
