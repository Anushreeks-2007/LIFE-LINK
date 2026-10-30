import { calculateDistanceKm, estimateEmergencyDurationMinutes } from '../utils/geoUtils';

/**
 * Fetches turn-by-turn or polyline route from start to destination using OSRM
 * Gracefully falls back to offline geometric line if offline or API is down
 */
export async function getRoute(startCoords, destCoords) {
  if (!startCoords || !destCoords) {
    throw new Error('Start and destination coordinates are required.');
  }

  const { latitude: lat1, longitude: lon1 } = startCoords;
  const { latitude: lat2, longitude: lon2 } = destCoords;

  const directDistanceKm = calculateDistanceKm(lat1, lon1, lat2, lon2);
  const estimatedDuration = estimateEmergencyDurationMinutes(directDistanceKm);

  // If browser is offline, return offline geometric route
  if (!navigator.onLine) {
    return {
      coordinates: [
        [lat1, lon1],
        [lat2, lon2],
      ],
      distanceKm: directDistanceKm,
      durationMinutes: estimatedDuration,
      isOfflineEstimated: true,
      note: 'Route calculated using offline direct estimation. Live traffic and turn-by-turn guidance unavailable offline.',
    };
  }

  try {
    const osrmUrl = `https://router.project-osrm.org/route/v1/driving/${lon1},${lat1};${lon2},${lat2}?overview=full&geometries=geojson`;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);

    const response = await fetch(osrmUrl, { signal: controller.signal });
    clearTimeout(timeout);

    if (!response.ok) {
      throw new Error(`OSRM responded with status ${response.status}`);
    }

    const data = await response.json();
    if (data.code === 'Ok' && data.routes && data.routes.length > 0) {
      const route = data.routes[0];
      // OSRM geojson returns coordinates as [lon, lat], Leaflet expects [lat, lon]
      const latLngs = route.geometry.coordinates.map(([lon, lat]) => [lat, lon]);
      return {
        coordinates: latLngs,
        distanceKm: parseFloat((route.distance / 1000).toFixed(1)),
        durationMinutes: Math.round(route.duration / 60),
        isOfflineEstimated: false,
        note: 'Calculated via OpenStreetMap / OSRM routing engine. Does not reflect live emergency traffic surges.',
      };
    }
  } catch (err) {
    console.warn('[Map Engine] OSRM routing request failed or timed out. Falling back to direct line:', err);
  }

  // Graceful fallback
  return {
    coordinates: [
      [lat1, lon1],
      [lat2, lon2],
    ],
    distanceKm: directDistanceKm,
    durationMinutes: estimatedDuration,
    isOfflineEstimated: true,
    note: 'Estimated route generated. Real-time routing service was unreachable.',
  };
}
