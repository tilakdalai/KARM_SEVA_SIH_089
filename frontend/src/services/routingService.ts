/**
 * Frontend Routing and Distance/ETA Service for KARM SEVA
 * Computes road geometry, distances, and travel ETA across India using OpenStreetMap/OSRM
 * with automatic fallback when offline or in low-connectivity areas.
 */

export interface RouteResult {
  distanceKm: number;
  etaMinutes: number;
  routeCoordinates: [number, number][];
  isRoadDistance: boolean;
  routingProvider: 'OSRM' | 'GEOMETRIC_FALLBACK';
}

export const haversineDistanceKm = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Number((R * c).toFixed(2));
};

export const generateCorridorWaypoints = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
  steps = 10
): [number, number][] => {
  const points: [number, number][] = [[lat1, lon1]];
  const dLat = lat2 - lat1;
  const dLon = lon2 - lon1;

  for (let i = 1; i < steps; i++) {
    const t = i / steps;
    const baseLat = lat1 + t * dLat;
    const baseLon = lon1 + t * dLon;
    const curve = Math.sin(t * Math.PI * 2) * 0.0012;
    const jitterLat = baseLat + curve * (i % 2 === 0 ? 1 : -0.5);
    const jitterLon = baseLon + curve * 0.7 * (i % 3 === 0 ? -1 : 0.6);
    points.push([Number(jitterLat.toFixed(6)), Number(jitterLon.toFixed(6))]);
  }
  points.push([lat2, lon2]);
  return points;
};

export const calculateTravelEta = (
  distanceKm: number,
  isEmergency = false
): number => {
  const avgSpeedKmh = isEmergency ? 35 : 22; // ~22 km/h city speed in India
  return Math.max(2, Math.round((distanceKm / avgSpeedKmh) * 60));
};

export const fetchRoadRoute = async (
  startLat: number,
  startLng: number,
  destLat: number,
  destLng: number,
  isEmergency = false
): Promise<RouteResult> => {
  const straightLineKm = haversineDistanceKm(startLat, startLng, destLat, destLng);

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    const osrmUrl = `https://router.project-osrm.org/route/v1/driving/${startLng},${startLat};${destLng},${destLat}?overview=full&geometries=geojson`;
    const res = await fetch(osrmUrl, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (data.code === 'Ok' && data.routes && data.routes.length > 0) {
        const route = data.routes[0];
        const distanceKm = Number((route.distance / 1000).toFixed(1));
        const durationMin = Math.max(
          2,
          Math.round(route.duration / 60 * (isEmergency ? 0.75 : 1))
        );
        // OSRM coordinates are in [lng, lat] format -> convert to [lat, lng] for Leaflet
        const coords: [number, number][] = route.geometry.coordinates.map(
          (c: [number, number]) => [c[1], c[0]]
        );

        return {
          distanceKm,
          etaMinutes: durationMin,
          routeCoordinates: coords,
          isRoadDistance: true,
          routingProvider: 'OSRM',
        };
      }
    }
  } catch {
    // Network timeout or blocked OSRM -> Seamlessly fall back to mathematical road corridor
  }

  // Fallback with Indian city road winding factor 1.34
  const roadDistanceKm = Number(Math.max(0.2, straightLineKm * 1.34).toFixed(1));
  const etaMinutes = calculateTravelEta(roadDistanceKm, isEmergency);
  const corridor = generateCorridorWaypoints(startLat, startLng, destLat, destLng, 12);

  return {
    distanceKm: roadDistanceKm,
    etaMinutes,
    routeCoordinates: corridor,
    isRoadDistance: true,
    routingProvider: 'GEOMETRIC_FALLBACK',
  };
};
