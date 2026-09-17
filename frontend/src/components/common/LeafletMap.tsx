import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, Polyline } from 'react-leaflet';
import L from 'leaflet';

export interface MapMarkerItem {
  id: string;
  lat: number;
  lng: number;
  title: string;
  subtitle?: string;
  type: 'CUSTOMER' | 'WORKER' | 'EMERGENCY';
  rating?: number;
  matchScore?: number;
  trade?: string;
  isOnline?: boolean;
}

interface LeafletMapProps {
  center?: [number, number];
  zoom?: number;
  markers?: MapMarkerItem[];
  radiusKm?: number;
  showPolylineToWorkerId?: string;
  height?: string;
  className?: string;
}

// Custom DivIcons for crisp styling without asset loading issues
const createCustomerIcon = () =>
  L.divIcon({
    className: 'custom-customer-pin',
    html: `
      <div class="w-8 h-8 rounded-full bg-blue-600 border-2 border-white shadow-lg flex items-center justify-center text-white text-xs font-black animate-pulse">
        📍
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16],
  });

const createWorkerIcon = (isOnline: boolean = true, isEmergency: boolean = false) =>
  L.divIcon({
    className: 'custom-worker-pin',
    html: `
      <div class="relative">
        <div class="w-9 h-9 rounded-full ${
          isEmergency
            ? 'bg-rose-600 ring-4 ring-rose-300 animate-bounce'
            : isOnline
            ? 'bg-emerald-600 ring-2 ring-emerald-300'
            : 'bg-slate-500'
        } border-2 border-white shadow-xl flex items-center justify-center text-white text-xs font-black">
          🛠️
        </div>
        ${
          isOnline
            ? '<span class="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 border border-white rounded-full"></span>'
            : ''
        }
      </div>
    `,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -18],
  });

export const LeafletMap: React.FC<LeafletMapProps> = ({
  center = [20.2961, 85.8245], // Default Bhubaneswar coordinates
  zoom = 13,
  markers = [],
  radiusKm,
  showPolylineToWorkerId,
  height = '380px',
  className = '',
}) => {
  const customerMarker = markers.find((m) => m.type === 'CUSTOMER') || {
    id: 'cust-default',
    lat: center[0],
    lng: center[1],
    title: 'Customer Location',
    type: 'CUSTOMER' as const,
  };

  const activeWorkerMarker = showPolylineToWorkerId
    ? markers.find((m) => m.id === showPolylineToWorkerId)
    : undefined;

  const polylineCoords: [number, number][] = activeWorkerMarker
    ? [
        [customerMarker.lat, customerMarker.lng],
        [activeWorkerMarker.lat, activeWorkerMarker.lng],
      ]
    : [];

  return (
    <div
      style={{ height }}
      className={`w-full rounded-2xl overflow-hidden border border-slate-200 shadow-inner relative z-0 ${className}`}
    >
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={false}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Coverage Radius Circle */}
        {radiusKm && (
          <Circle
            center={center}
            radius={radiusKm * 1000}
            pathOptions={{
              color: '#059669',
              fillColor: '#10b981',
              fillOpacity: 0.1,
              weight: 1.5,
              dashArray: '4, 4',
            }}
          />
        )}

        {/* ETA Route Polyline */}
        {polylineCoords.length === 2 && (
          <Polyline
            positions={polylineCoords}
            pathOptions={{
              color: '#2563eb',
              weight: 3,
              dashArray: '6, 6',
              opacity: 0.8,
            }}
          />
        )}

        {/* Markers */}
        {markers.map((marker) => (
          <Marker
            key={marker.id}
            position={[marker.lat, marker.lng]}
            icon={
              marker.type === 'CUSTOMER'
                ? createCustomerIcon()
                : createWorkerIcon(marker.isOnline, marker.type === 'EMERGENCY')
            }
          >
            <Popup className="custom-leaflet-popup">
              <div className="p-1 space-y-1 text-xs">
                <div className="font-extrabold text-slate-900 flex items-center justify-between gap-2">
                  <span>{marker.title}</span>
                  {marker.matchScore && (
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-1.5 py-0.5 rounded">
                      {marker.matchScore}% Match
                    </span>
                  )}
                </div>
                {marker.subtitle && <p className="text-slate-600">{marker.subtitle}</p>}
                {marker.trade && (
                  <p className="text-slate-500 font-medium">
                    {marker.trade} {marker.rating ? `• ★ ${marker.rating}` : ''}
                  </p>
                )}
                {marker.type === 'CUSTOMER' && (
                  <span className="inline-block text-[10px] text-blue-700 font-bold bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
                    🔒 Address Protected (Locality Masked)
                  </span>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};
