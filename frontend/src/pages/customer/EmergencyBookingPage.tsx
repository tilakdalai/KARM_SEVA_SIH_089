import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  matchingService,
  CandidateMatchRecord,
  EmergencyDispatchRecord,
} from '@/services/matchingService';
import { LeafletMap, MapMarkerItem } from '@/components/common/LeafletMap';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import {
  AlertTriangle,
  Zap,
  Droplets,
  HeartPulse,
  Key,
  ShieldCheck,
  MapPin,
  Sparkles,
  ArrowRight,
  Radio,
} from 'lucide-react';

const emergencyCategories = [
  {
    id: 'em-elec',
    category: 'Electrician',
    title: 'Electrical Sparking / Meter Tripping',
    icon: Zap,
    color: 'text-amber-600 bg-amber-50 border-amber-300',
    desc: 'Short circuits, wire sparking, smoking distribution boxes, main breaker trip',
  },
  {
    id: 'em-plumb',
    category: 'Plumber',
    title: 'High-Pressure Pipe Burst / Flood',
    icon: Droplets,
    color: 'text-blue-600 bg-blue-50 border-blue-300',
    desc: 'Main supply burst, overhead tank line fracture, bathroom flooding',
  },
  {
    id: 'em-care',
    category: 'Caregiver',
    title: 'Patient / Elderly Urgent Attendance',
    icon: HeartPulse,
    color: 'text-rose-600 bg-rose-50 border-rose-300',
    desc: 'Immediate vitals assistance, mobility aid, standby night attendant',
  },
  {
    id: 'em-carp',
    category: 'Carpenter',
    title: 'Emergency Lock Jam / Window Security',
    icon: Key,
    color: 'text-purple-600 bg-purple-50 border-purple-300',
    desc: 'Main door lock jammed, broken hinge, security latch emergency repair',
  },
];

export const EmergencyBookingPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedCat, setSelectedCat] = useState(emergencyCategories[0]);
  const [addressLine, setAddressLine] = useState('Plot 42, Saheed Nagar, Near Utkal Hospital');
  const [district, setDistrict] = useState('Khordha');
  const [pincode, setPincode] = useState('751007');
  const [description, setDescription] = useState('Sparks coming from main DB box under heavy air conditioner load.');
  const [customerCoords] = useState<[number, number]>([20.2961, 85.8245]);

  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [broadcastResult, setBroadcastResult] = useState<EmergencyDispatchRecord | null>(null);
  const [nearbyCandidates, setNearbyCandidates] = useState<CandidateMatchRecord[]>([]);
  const [selectedWorker, setSelectedWorker] = useState<CandidateMatchRecord | null>(null);

  // Load nearby online standby candidates
  useEffect(() => {
    const fetchNearby = async () => {
      try {
        const res = await matchingService.findMatchingWorkers({
          service_category: selectedCat.category,
          customer_lat: customerCoords[0],
          customer_lng: customerCoords[1],
          is_emergency: true,
          preferred_radius_km: 8.0,
        });
        setNearbyCandidates(res.candidates);
        if (res.candidates.length > 0) {
          setSelectedWorker(res.candidates[0]);
        }
      } catch (err) {
        console.error('Failed to load nearby emergency artisans:', err);
      }
    };
    fetchNearby();
  }, [selectedCat, customerCoords]);

  const handleDispatchSOS = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsBroadcasting(true);
    try {
      const result = await matchingService.dispatchEmergency({
        service_category: selectedCat.category,
        issue_description: description,
        customer_lat: customerCoords[0],
        customer_lng: customerCoords[1],
        address_line: addressLine,
        district,
        pincode,
        priority_level: 'CRITICAL',
      });
      setBroadcastResult(result);
    } catch (err) {
      console.error('Emergency SOS dispatch failed:', err);
    } finally {
      setIsBroadcasting(false);
    }
  };

  // Prepare map markers
  const mapMarkers: MapMarkerItem[] = [
    {
      id: 'cust-pin',
      lat: customerCoords[0],
      lng: customerCoords[1],
      title: 'Your Location (Saheed Nagar)',
      subtitle: 'Locality protected for privacy',
      type: 'CUSTOMER',
    },
    ...nearbyCandidates.map((c) => ({
      id: c.worker_id,
      lat: c.lat,
      lng: c.lng,
      title: c.worker_name,
      subtitle: `${c.distance_km} km away • ETA ~${c.eta_minutes} mins`,
      trade: c.trade,
      rating: c.rating,
      matchScore: c.match_score,
      type: 'WORKER' as const,
      isOnline: c.is_online,
    })),
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Emergency Glowing Banner */}
      <div className="bg-gradient-to-r from-rose-900 via-slate-900 to-amber-950 p-6 rounded-3xl text-white shadow-2xl border-2 border-rose-500/40 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <AlertTriangle className="w-64 h-64 text-rose-500" />
        </div>
        <div className="relative z-10 space-y-2 max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-rose-500 text-white px-3 py-1 rounded-full text-xs font-black tracking-wider uppercase shadow-md animate-pulse">
            <Radio className="w-4 h-4" />
            15-Minute SLA Emergency Standby Allocation
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
            Urgent Artisan SOS Fast-Track
          </h1>
          <p className="text-rose-100/90 text-sm leading-relaxed">
            Need urgent assistance? Our cooperative matching radar instantly identifies verified, police-cleared artisans
            within 8km who are online and ready for immediate dispatch. Zero surge pricing guaranteed by law.
          </p>
        </div>
      </div>

      {!broadcastResult ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Form & Category Selector (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <Card className="p-6 border-slate-200 bg-white shadow-sm space-y-5">
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-rose-600" />
                1. Select Emergency Type
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {emergencyCategories.map((cat) => {
                  const Icon = cat.icon;
                  const isSelected = selectedCat.id === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setSelectedCat(cat)}
                      className={`p-4 rounded-2xl border-2 text-left transition space-y-1.5 ${
                        isSelected
                          ? 'border-rose-600 bg-rose-50/70 shadow-md ring-2 ring-rose-500/20'
                          : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className={`p-2 rounded-xl ${cat.color}`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        {isSelected && (
                          <span className="text-xs font-extrabold text-rose-700 bg-rose-100 px-2 py-0.5 rounded-full">
                            SELECTED
                          </span>
                        )}
                      </div>
                      <div className="font-extrabold text-sm text-slate-900">{cat.title}</div>
                      <p className="text-xs text-slate-500 leading-snug">{cat.desc}</p>
                    </button>
                  );
                })}
              </div>

              {/* Location & Details */}
              <form onSubmit={handleDispatchSOS} className="space-y-4 pt-2 border-t border-slate-100">
                <h3 className="text-sm font-extrabold text-slate-800 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-emerald-600" />
                  2. Confirm Emergency Address
                </h3>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Premises Address *</label>
                  <input
                    type="text"
                    required
                    value={addressLine}
                    onChange={(e) => setAddressLine(e.target.value)}
                    className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-rose-500 focus:outline-none"
                    placeholder="Plot / Flat number, building, landmark"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">District</label>
                    <input
                      type="text"
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-rose-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">PIN Code</label>
                    <input
                      type="text"
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                      className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-rose-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Describe Immediate Danger / Situation</label>
                  <textarea
                    rows={2}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-rose-500 focus:outline-none"
                    placeholder="E.g. sparks emitting from meter box, water leaking into living room"
                  />
                </div>

                <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-900 flex items-start gap-2">
                  <ShieldCheck className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
                  <p className="text-[11px] leading-relaxed">
                    <strong>Address Privacy Guarantee:</strong> Your exact street address remains masked until a verified artisan accepts
                    the standby dispatch. Only approximate locality (Saheed Nagar) is broadcasted.
                  </p>
                </div>

                <Button
                  type="submit"
                  disabled={isBroadcasting}
                  className="w-full py-3.5 bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-black text-sm rounded-xl shadow-xl flex items-center justify-center gap-2"
                >
                  {isBroadcasting ? (
                    'Broadcasting Emergency Radar...'
                  ) : (
                    <>
                      <Radio className="w-5 h-5 animate-pulse" />
                      DISPATCH 15-MIN EMERGENCY SOS NOW
                    </>
                  )}
                </Button>
              </form>
            </Card>
          </div>

          {/* Right Column: Interactive Map & Live Standby Pool (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <Card className="p-4 border-slate-200 bg-white shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-600" />
                  <h3 className="font-extrabold text-sm text-slate-900">Live Cooperative GIS Radar</h3>
                </div>
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  {nearbyCandidates.length} Artisans Online
                </span>
              </div>

              {/* Leaflet OSM Map */}
              <LeafletMap
                center={customerCoords}
                zoom={13}
                markers={mapMarkers}
                radiusKm={8.0}
                showPolylineToWorkerId={selectedWorker?.worker_id}
                height="320px"
              />

              {/* Selected Candidate Card with Explainability */}
              {selectedWorker && (
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/80 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-slate-500 uppercase">{selectedWorker.shram_id}</span>
                      <h4 className="font-black text-sm text-slate-900">{selectedWorker.worker_name}</h4>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                        {selectedWorker.match_score}% Score
                      </div>
                      <span className="text-[10px] text-slate-500 font-medium">~{selectedWorker.eta_minutes} min ETA</span>
                    </div>
                  </div>

                  <div className="space-y-1 pt-1 border-t border-slate-200/80">
                    <span className="text-[10px] font-bold text-slate-500 uppercase">Deterministic Match Checklist:</span>
                    {selectedWorker.explanations.map((exp, i) => (
                      <div key={i} className="text-[11px] text-slate-700 font-medium flex items-center gap-1.5">
                        <span>{exp}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          </div>
        </div>
      ) : (
        /* Emergency Broadcast Active Screen */
        <Card className="p-8 border-rose-300 bg-rose-50/40 shadow-2xl max-w-3xl mx-auto text-center space-y-6">
          <div className="w-20 h-20 mx-auto rounded-full bg-rose-600 text-white flex items-center justify-center shadow-xl animate-bounce">
            <Radio className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-mono font-bold text-rose-700 uppercase bg-rose-100 px-3 py-1 rounded-full">
              {broadcastResult.broadcast_id}
            </span>
            <h2 className="text-2xl font-black text-slate-900">
              Emergency SOS Broadcasted to {broadcastResult.notified_candidates_count} Standby Artisans
            </h2>
            <p className="text-xs text-slate-600 max-w-lg mx-auto">
              Our cooperative radar has notified verified <strong>{broadcastResult.service_category}</strong> artisans within{' '}
              {broadcastResult.broadcast_radius_km} km. Standby response SLA is active.
            </p>
          </div>

          {/* Top Candidate ETA Card */}
          {broadcastResult.top_candidate && (
            <div className="bg-white p-6 rounded-2xl border border-rose-200 shadow-md max-w-md mx-auto text-left space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Top Matched Artisan
                  </span>
                  <h4 className="font-black text-base text-slate-900 mt-1">
                    {broadcastResult.top_candidate.worker_name}
                  </h4>
                  <p className="text-xs text-slate-500">
                    {broadcastResult.top_candidate.trade} • {broadcastResult.top_candidate.distance_km} km away
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-black text-rose-600">~{broadcastResult.top_candidate.eta_minutes}</div>
                  <span className="text-[10px] text-slate-500 uppercase font-bold">Minutes ETA</span>
                </div>
              </div>

              <div className="space-y-1 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
                {broadcastResult.top_candidate.explanations.map((exp, idx) => (
                  <div key={idx} className="text-[11px] font-medium">
                    {exp}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center justify-center gap-3 pt-2">
            <Button
              variant="outline"
              onClick={() => setBroadcastResult(null)}
              className="text-xs border-slate-300"
            >
              Cancel Broadcast
            </Button>
            <Button
              onClick={() => navigate('/customer/bookings')}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5"
            >
              <span>Track in Booking Manager</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};
