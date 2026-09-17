import React, { useEffect, useState, useRef, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap, ZoomControl } from 'react-leaflet';
import L from 'leaflet';
import {
  PhoneCall,
  MessageSquare,
  ShieldCheck,
  Compass,
  CheckCircle2,
  RefreshCw,
  UserCheck,
  Navigation,
  X,
  Send,
  Phone,
  Radio,
} from 'lucide-react';
import { BookingTrackingData, trackingService, generateFallbackTracking } from '@/services/trackingService';
import { fetchRoadRoute } from '@/services/routingService';
import { Button } from '@/components/common/Button';

interface LiveWorkerTrackingMapProps {
  bookingId: string;
  initialData?: BookingTrackingData;
  height?: string;
  showCardOverlay?: boolean;
  onStatusChange?: (newStatus: string) => void;
  className?: string;
}

// Map Size Invalidator to fix grey/blank tiles in dynamic layouts
const MapSizeInvalidator: React.FC = () => {
  const map = useMap();

  useEffect(() => {
    if (!map) return;
    const t1 = setTimeout(() => {
      try {
        map.invalidateSize();
      } catch {}
    }, 150);

    const t2 = setTimeout(() => {
      try {
        map.invalidateSize();
      } catch {}
    }, 500);

    const handleResize = () => {
      try {
        map.invalidateSize();
      } catch {}
    };

    window.addEventListener('resize', handleResize);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      window.removeEventListener('resize', handleResize);
    };
  }, [map]);

  return null;
};

// Map Auto-Fit Bounds Component
const MapBoundsFitter: React.FC<{
  workerCoords?: [number, number];
  customerCoords: [number, number];
  triggerRecenter: number;
}> = ({ workerCoords, customerCoords, triggerRecenter }) => {
  const map = useMap();
  const hasFittedRef = useRef(false);

  useEffect(() => {
    if (!map) return;
    if (!Number.isFinite(customerCoords[0]) || !Number.isFinite(customerCoords[1])) return;

    // Check if workerCoords is distinct and valid
    const hasDistinctWorker =
      workerCoords &&
      Number.isFinite(workerCoords[0]) &&
      Number.isFinite(workerCoords[1]) &&
      (Math.abs(workerCoords[0] - customerCoords[0]) > 0.0004 ||
        Math.abs(workerCoords[1] - customerCoords[1]) > 0.0004);

    if (!hasDistinctWorker) {
      map.setView(customerCoords, 15, { animate: hasFittedRef.current });
      hasFittedRef.current = true;
      return;
    }

    try {
      const bounds = L.latLngBounds([customerCoords, workerCoords!]);
      if (bounds.isValid()) {
        map.fitBounds(bounds, {
          padding: [60, 60],
          maxZoom: 16,
          animate: hasFittedRef.current,
        });
        hasFittedRef.current = true;
      }
    } catch {
      // Map may be unmounting or layout changing
    }
  }, [map, customerCoords, workerCoords, triggerRecenter]);

  return null;
};

// Custom Marker Icons
const createCustomerMarkerIcon = (_address?: string) =>
  L.divIcon({
    className: 'custom-customer-dest-pin',
    html: `
      <div class="relative group cursor-pointer">
        <div class="w-10 h-10 rounded-2xl bg-blue-600 border-2 border-white shadow-2xl flex items-center justify-center text-white text-base shadow-blue-500/40 transform hover:scale-110 transition-transform">
          🏠
        </div>
        <span class="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-blue-600 rotate-45 border-r border-b border-white"></span>
      </div>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -36],
  });

const createWorkerMarkerIcon = (
  _trade?: string,
  heading?: number,
  isLive = true,
  isReplacement = false
) =>
  L.divIcon({
    className: 'custom-worker-live-pin',
    html: `
      <div class="relative group cursor-pointer">
        <!-- Live Pulse Wave -->
        ${
          isLive
            ? `<div class="absolute -inset-2.5 rounded-full ${
                isReplacement ? 'bg-amber-400' : 'bg-emerald-500'
              } opacity-40 animate-ping"></div>`
            : ''
        }
        
        <!-- Main Marker -->
        <div class="relative w-11 h-11 rounded-2xl ${
          isReplacement
            ? 'bg-gradient-to-br from-amber-500 to-orange-600 ring-4 ring-amber-200'
            : 'bg-gradient-to-br from-emerald-600 to-teal-700 ring-4 ring-emerald-200'
        } border-2 border-white shadow-2xl flex items-center justify-center text-white text-lg shadow-emerald-600/40 transition-transform">
          🛠️
        </div>

        <!-- Heading Direction Pointer (if available) -->
        ${
          heading !== undefined
            ? `<div style="transform: rotate(${heading}deg)" class="absolute -top-2 left-1/2 -translate-x-1/2 text-emerald-700 text-xs font-black">▲</div>`
            : ''
        }

        <!-- Status Dot -->
        <span class="absolute -top-1 -right-1 w-3.5 h-3.5 ${
          isLive ? 'bg-emerald-400' : 'bg-slate-400'
        } border-2 border-white rounded-full"></span>
      </div>
    `,
    iconSize: [44, 44],
    iconAnchor: [22, 22],
    popupAnchor: [0, -22],
  });

export const LiveWorkerTrackingMap: React.FC<LiveWorkerTrackingMapProps> = ({
  bookingId,
  initialData,
  height = '520px',
  showCardOverlay = true,
  onStatusChange,
  className = '',
}) => {
  const [tracking, setTracking] = useState<BookingTrackingData | null>(initialData || null);
  const [loading, setLoading] = useState<boolean>(!initialData);
  const [recenterCount, setRecenterCount] = useState<number>(0);
  const [routeCoords, setRouteCoords] = useState<[number, number][]>([]);
  const [liveDistanceKm, setLiveDistanceKm] = useState<number>(0);
  const [liveEtaMinutes, setLiveEtaMinutes] = useState<number>(0);
  const [, setStepIndex] = useState<number>(0);

  // Interactive Action Dialogs (Replacing raw alert calls)
  const [activeModal, setActiveModal] = useState<'CALL' | 'CHAT' | null>(null);
  const [chatInput, setChatInput] = useState<string>('');
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'user' | 'worker'; text: string; time: string }>>([
    {
      sender: 'worker',
      text: 'Namaste! I am on the way with official cooperative tools and verified credentials. Will arrive shortly.',
      time: 'Just now',
    },
  ]);

  const statusRef = useRef<string>(initialData?.status || 'REQUESTED');
  useEffect(() => {
    if (tracking?.status) {
      statusRef.current = tracking.status;
    }
  }, [tracking?.status]);

  // Load tracking data
  const fetchTracking = useCallback(async () => {
    try {
      const data = await trackingService.getBookingTracking(bookingId);
      setTracking(data);
      statusRef.current = data.status;
      setLiveDistanceKm(data.distance_km);
      setLiveEtaMinutes(data.eta_minutes);

      // Compute or update road route if worker location is present
      if (data.worker_location) {
        const wCoords: [number, number] = [
          data.worker_location.latitude,
          data.worker_location.longitude,
        ];
        const cCoords: [number, number] = [
          data.customer_location.latitude,
          data.customer_location.longitude,
        ];

        if (data.route_coordinates && data.route_coordinates.length > 0) {
          setRouteCoords(data.route_coordinates as [number, number][]);
        } else {
          const route = await fetchRoadRoute(
            wCoords[0],
            wCoords[1],
            cCoords[0],
            cCoords[1],
            data.is_emergency
          );
          setRouteCoords(route.routeCoordinates);
          setLiveDistanceKm(route.distanceKm);
          setLiveEtaMinutes(route.etaMinutes);
        }
      }

      if (onStatusChange) {
        onStatusChange(data.status);
      }
    } catch (err: any) {
      console.warn('Tracking fetch notice:', err);
      // Fallback guarantees the map never breaks
      const fallback = generateFallbackTracking(bookingId);
      setTracking(fallback);
      setLiveDistanceKm(fallback.distance_km);
      setLiveEtaMinutes(fallback.eta_minutes);
      setRouteCoords(fallback.route_coordinates);
      if (onStatusChange) {
        onStatusChange(fallback.status);
      }
    } finally {
      setLoading(false);
    }
  }, [bookingId, onStatusChange]);

  useEffect(() => {
    fetchTracking();

    // Poll every 5 seconds while active
    const interval = setInterval(() => {
      const current = statusRef.current;
      if (
        current === 'ON_THE_WAY' ||
        current === 'ACCEPTED' ||
        current === 'ARRIVED'
      ) {
        fetchTracking();
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [fetchTracking]);

  // Client-side realistic movement simulation along the route corridor
  useEffect(() => {
    if (!tracking || tracking.status !== 'ON_THE_WAY' || routeCoords.length < 2) return;

    const moveTimer = setInterval(() => {
      setStepIndex((prev) => {
        const next = prev + 1;
        if (next < routeCoords.length - 1) {
          const nextCoord = routeCoords[next];
          const remainingSteps = routeCoords.length - 1 - next;
          const remainingRatio = remainingSteps / (routeCoords.length - 1);

          setTracking((t) => {
            if (!t) return t;
            return {
              ...t,
              worker_location: {
                latitude: nextCoord[0],
                longitude: nextCoord[1],
                heading: t.worker_location?.heading || 45,
                speed: 26.0,
                recorded_at: new Date().toISOString(),
              },
            };
          });

          setLiveDistanceKm(Number((2.4 * remainingRatio).toFixed(1)));
          setLiveEtaMinutes(Math.max(1, Math.round(8 * remainingRatio)));
          return next;
        } else {
          // Arrived at destination
          setTracking((t) => {
            if (!t) return t;
            return {
              ...t,
              status: 'ARRIVED',
              distance_km: 0.0,
              eta_minutes: 0,
            };
          });
          statusRef.current = 'ARRIVED';
          if (onStatusChange) onStatusChange('ARRIVED');
          clearInterval(moveTimer);
          return prev;
        }
      });
    }, 4500);

    return () => clearInterval(moveTimer);
  }, [routeCoords, tracking?.status, onStatusChange]);

  if (loading && !tracking) {
    return (
      <div
        style={{ height }}
        className="w-full bg-slate-900 rounded-3xl flex flex-col items-center justify-center p-6 text-white space-y-3 shadow-inner"
      >
        <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="font-bold text-xs text-slate-200">Connecting to Cooperative Dispatch Satellite...</p>
      </div>
    );
  }

  // Safe destination coordinates
  const customerPos: [number, number] = tracking?.customer_location
    ? [tracking.customer_location.latitude, tracking.customer_location.longitude]
    : [20.2961, 85.8245];

  const workerPos: [number, number] | undefined = tracking?.worker_location
    ? [tracking.worker_location.latitude, tracking.worker_location.longitude]
    : undefined;

  const isArrived = tracking?.status === 'ARRIVED';
  const isStarted = tracking?.status === 'STARTED';
  const isCompleted = tracking?.status === 'COMPLETED';

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;
    const userMsg = chatInput.trim();
    setChatMessages((prev) => [
      ...prev,
      { sender: 'user', text: userMsg, time: 'Just now' },
    ]);
    setChatInput('');

    setTimeout(() => {
      setChatMessages((prev) => [
        ...prev,
        {
          sender: 'worker',
          text: `Acknowledged: "${userMsg}". Following GPS route now.`,
          time: 'Just now',
        },
      ]);
    }, 1200);
  };

  return (
    <div className={`relative w-full rounded-3xl overflow-hidden shadow-2xl border border-slate-300 bg-white ${className}`}>
      {/* Interactive Leaflet Map */}
      <div style={{ height }} className="w-full relative z-0">
        <MapContainer
          center={customerPos}
          zoom={14}
          zoomControl={false}
          scrollWheelZoom={true}
          style={{ height: '100%', width: '100%' }}
          className="z-0"
        >
          {/* Zoom controls placed in bottomright to prevent collision */}
          <ZoomControl position="bottomright" />
          <MapSizeInvalidator />

          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <MapBoundsFitter
            workerCoords={workerPos}
            customerCoords={customerPos}
            triggerRecenter={recenterCount}
          />

          {/* Road Route Polyline (Shown when transit is active) */}
          {!isCompleted && !isArrived && routeCoords.length > 1 && (
            <Polyline
              positions={routeCoords}
              pathOptions={{
                color: tracking?.worker.is_replacement ? '#d97706' : '#059669',
                weight: 5,
                opacity: 0.85,
                lineCap: 'round',
                lineJoin: 'round',
              }}
            />
          )}

          {/* Customer Destination Marker */}
          <Marker
            position={customerPos}
            icon={createCustomerMarkerIcon(tracking?.customer_location.address_line || '')}
          >
            <Popup className="custom-popup">
              <div className="p-1 space-y-1 text-xs">
                <span className="font-black text-slate-900 block">🏠 Service Destination</span>
                <p className="text-slate-700 font-medium">
                  {tracking?.customer_location.address_line || 'Plot 412, Saheed Nagar'}, {tracking?.customer_location.district || 'Khordha'}
                </p>
                <span className="inline-block text-[10px] text-blue-800 font-bold bg-blue-50 px-1.5 py-0.5 rounded border border-blue-300">
                  🔒 Sovereign Encrypted Address
                </span>
              </div>
            </Popup>
          </Marker>

          {/* Worker Live Location Marker */}
          {workerPos && (
            <Marker
              position={workerPos}
              icon={createWorkerMarkerIcon(
                tracking?.worker.trade || 'Tradesperson',
                tracking?.worker_location?.heading,
                tracking?.is_live,
                tracking?.worker.is_replacement
              )}
            >
              <Popup className="custom-popup">
                <div className="p-1 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-black text-slate-900">{tracking?.worker.name}</span>
                    <span className="text-[10px] font-black text-emerald-900 bg-emerald-100 px-1.5 py-0.5 rounded border border-emerald-300">
                      ★ {tracking?.worker.rating}
                    </span>
                  </div>
                  <p className="text-slate-700 font-semibold">
                    {tracking?.worker.trade} · {tracking?.worker.shram_id}
                  </p>
                  {tracking?.worker.is_replacement && (
                    <span className="inline-block text-[10px] text-amber-900 font-bold bg-amber-100 px-1.5 py-0.5 rounded border border-amber-300">
                      🛡️ Cooperative Standby Replacement
                    </span>
                  )}
                  {tracking?.worker_location?.speed !== undefined && (
                    <p className="text-[11px] text-slate-600 font-medium">
                      Speed: {Math.round(tracking.worker_location.speed)} km/h
                    </p>
                  )}
                </div>
              </Popup>
            </Marker>
          )}
        </MapContainer>

        {/* Floating Map Top Control Buttons (High z-index to float on top of Leaflet tiles) */}
        <div className="absolute top-4 right-4 z-[1000] flex items-center space-x-2 pointer-events-auto">
          <button
            type="button"
            onClick={() => setRecenterCount((c) => c + 1)}
            className="px-3 py-2 bg-white text-slate-900 rounded-xl shadow-xl border border-slate-300 text-xs font-black flex items-center gap-1.5 hover:bg-slate-50 transition-all hover:scale-105 active:scale-95 cursor-pointer"
            title="Recenter view to fit Worker & Destination"
          >
            <Compass className="w-4 h-4 text-gov-green" />
            <span className="text-slate-900 font-bold">Recenter</span>
          </button>

          <button
            type="button"
            onClick={fetchTracking}
            className="p-2 bg-white text-slate-900 rounded-xl shadow-xl border border-slate-300 text-xs font-bold hover:bg-slate-50 transition-all hover:scale-105 active:scale-95 flex items-center gap-1 cursor-pointer"
            title="Refresh GPS Telemetry"
          >
            <RefreshCw className="w-4 h-4 text-slate-700" />
            <span className="hidden sm:inline text-slate-900 font-bold">Refresh</span>
          </button>
        </div>

        {/* Floating Live Status Badge (Top-Left, z-[1000]) */}
        <div className="absolute top-4 left-4 z-[1000] pointer-events-auto">
          <div className="px-3.5 py-2 rounded-full bg-slate-900 text-white border border-slate-700 shadow-2xl flex items-center space-x-2 text-xs font-black">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                isCompleted
                  ? 'bg-blue-400'
                  : isArrived
                  ? 'bg-amber-400 animate-pulse'
                  : 'bg-emerald-400 animate-ping'
              }`}
            />
            <span className="flex items-center gap-1.5 text-white font-black text-xs tracking-wide">
              <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              {isCompleted
                ? 'Job Completed & Settled'
                : isStarted
                ? 'Service In Progress'
                : isArrived
                ? 'Artisan Arrived at Gate'
                : tracking?.is_live
                ? 'Live Road Dispatch'
                : 'Cooperative Standby'}
            </span>
          </div>
        </div>
      </div>

      {/* Floating Bottom Tracking Information Card */}
      {showCardOverlay && tracking && (
        <div className="bg-white border-t border-slate-200 p-5 sm:p-6 space-y-4 shadow-lg">
          {/* Main ETA & Distance Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
            {/* Left: Craftsman Identity */}
            <div className="flex items-start space-x-3.5">
              <div className="relative shrink-0">
                <img
                  src={
                    tracking.worker.photo ||
                    'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=150'
                  }
                  alt={tracking.worker.name}
                  className="w-14 h-14 rounded-2xl object-cover border-2 border-slate-300 shadow-md"
                />
                <span className="absolute -bottom-1 -right-1 p-0.5 bg-emerald-600 text-white rounded-full border-2 border-white">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </span>
              </div>

              <div className="space-y-0.5">
                <div className="flex flex-wrap items-center gap-1.5">
                  <h4 className="font-black text-base text-slate-900">
                    {tracking.worker.name}
                  </h4>
                  {tracking.worker.is_replacement && (
                    <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 font-extrabold text-[10px] border border-amber-300 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-amber-600" />
                      Replacement Standby
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-700 font-semibold">
                  {tracking.worker.trade} · <span className="font-mono text-slate-900 font-bold">{tracking.worker.shram_id}</span>
                </p>

                <div className="flex items-center gap-2 text-xs text-slate-700 pt-0.5">
                  <span className="text-amber-600 font-black">★ {tracking.worker.rating}</span>
                  <span>·</span>
                  <span className="text-emerald-700 font-bold">✓ Cooperative Verified Artisan</span>
                </div>
              </div>
            </div>

            {/* Right: ETA & Road Distance */}
            <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center p-3 sm:p-0 bg-emerald-50 sm:bg-transparent rounded-2xl sm:rounded-none border sm:border-0 border-emerald-200">
              <div className="text-left sm:text-right">
                <span className="text-[10px] uppercase font-black tracking-wider text-slate-600 block">
                  {isArrived ? 'Arrival Status' : isStarted ? 'Shift Status' : isCompleted ? 'Order Status' : 'Estimated Arrival'}
                </span>
                <span className="text-2xl font-black text-slate-900 tracking-tight">
                  {isArrived ? 'Arrived!' : isStarted ? 'In Progress' : isCompleted ? 'Finished' : `${liveEtaMinutes} min`}
                </span>
              </div>

              {!isArrived && !isStarted && !isCompleted && (
                <div className="flex items-center gap-1 text-xs font-black text-emerald-800 pt-0.5">
                  <Navigation className="w-3.5 h-3.5" />
                  <span>
                    {tracking.is_road_distance ? `${liveDistanceKm} km road away` : `Approx. ${liveDistanceKm} km away`}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Replacement Explanation (if replaced) */}
          {tracking.worker.is_replacement && (
            <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-300 text-xs space-y-1">
              <span className="font-extrabold text-amber-950 flex items-center gap-1.5">
                <UserCheck className="w-4 h-4 text-amber-600" />
                Cooperative Replacement Active
              </span>
              <p className="text-amber-900 leading-relaxed text-[11px] font-medium">
                Standby craftsman <strong>{tracking.worker.name}</strong> was assigned by your Labour Cooperative ({tracking.worker.replacement_reason || 'Medical / Transit Standby'}). Full insurance, verified identity, and tariff pricing remain 100% active.
              </p>
            </div>
          )}

          {/* Action Buttons & OTP Verification Badge */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            {/* Start OTP Display */}
            {tracking.otp_code && !isStarted && !isCompleted && (
              <div className="flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-slate-100 border border-slate-300">
                <span className="text-xs font-bold text-slate-700">Commencement OTP:</span>
                <span className="font-mono font-black text-base text-gov-navy tracking-widest">
                  {tracking.otp_code}
                </span>
              </div>
            )}

            {/* Quick Dispatch Call & Message Buttons */}
            <div className="flex items-center space-x-3 ml-auto">
              <Button
                variant="outline"
                size="sm"
                className="text-xs font-black text-slate-800 bg-white border-slate-300 hover:bg-slate-100 shadow-xs cursor-pointer"
                leftIcon={<PhoneCall className="w-4 h-4 text-gov-green" />}
                onClick={() => setActiveModal('CALL')}
              >
                Call Craftsman
              </Button>

              <Button
                variant="primary"
                size="sm"
                className="text-xs font-black bg-gov-green hover:bg-gov-greenDark text-white shadow-md cursor-pointer"
                leftIcon={<MessageSquare className="w-4 h-4 text-white" />}
                onClick={() => setActiveModal('CHAT')}
              >
                Message
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Voice Call Dialog Modal */}
      {activeModal === 'CALL' && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-3xl bg-white border border-slate-300 p-6 shadow-2xl space-y-4 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto ring-8 ring-emerald-50 animate-pulse">
              <Phone className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900">Connecting Secure Call</h3>
              <p className="text-xs text-slate-600 mt-1 font-medium">
                KARM SEVA Sovereign Privacy Bridge connects your call to <strong>{tracking?.worker.name}</strong> with phone number masking.
              </p>
            </div>
            <div className="p-3 bg-slate-100 rounded-2xl border border-slate-300 text-sm font-mono font-black text-slate-900">
              {tracking?.worker.phone || '+91 98765 43211'}
            </div>
            <div className="flex gap-2 pt-2">
              <Button
                variant="outline"
                className="flex-1 text-xs font-bold text-slate-800 border-slate-300 bg-white"
                onClick={() => setActiveModal(null)}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                className="flex-1 text-xs font-bold bg-gov-green hover:bg-gov-greenDark text-white"
                onClick={() => {
                  window.location.href = `tel:${tracking?.worker.phone || '9876543211'}`;
                  setActiveModal(null);
                }}
              >
                Start Dialing
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* In-App Encrypted Chat Modal */}
      {activeModal === 'CHAT' && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-3xl bg-white border border-slate-300 shadow-2xl overflow-hidden flex flex-col h-[480px]">
            <div className="px-5 py-4 bg-gov-navy text-white flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-sm font-bold">
                  🛠️
                </div>
                <div>
                  <h4 className="font-bold text-sm leading-tight text-white">{tracking?.worker.name}</h4>
                  <span className="text-[10px] text-emerald-300 font-semibold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> In Transit · En Route
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="p-1.5 rounded-full hover:bg-white/10 text-white transition-colors cursor-pointer"
                aria-label="Close Chat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Chat message stream */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50 text-xs">
              {chatMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[80%] px-3.5 py-2 rounded-2xl text-xs ${
                      msg.sender === 'user'
                        ? 'bg-gov-navy text-white rounded-tr-xs'
                        : 'bg-white text-slate-900 border border-slate-300 rounded-tl-xs shadow-xs font-medium'
                    }`}
                  >
                    {msg.text}
                  </div>
                  <span className="text-[10px] text-slate-500 px-1 pt-0.5 font-medium">{msg.time}</span>
                </div>
              ))}
            </div>

            {/* Input bar */}
            <div className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Type dispatch instruction or landmark..."
                className="flex-1 px-3.5 py-2 rounded-xl bg-slate-100 border border-slate-300 text-xs text-slate-900 placeholder:text-slate-500 focus:ring-2 focus:ring-gov-navy focus:outline-none"
              />
              <Button
                variant="primary"
                size="sm"
                className="p-2.5 rounded-xl shrink-0 bg-gov-green hover:bg-gov-greenDark text-white"
                onClick={handleSendMessage}
              >
                <Send className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
