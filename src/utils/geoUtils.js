// Geolocation utilities for calculating distance and transit time

/**
 * Calculates Great-circle distance between two points in km using Haversine formula
 */
export function calculateDistanceKm(lat1, lon1, lat2, lon2) {
  if (lat1 == null || lon1 == null || lat2 == null || lon2 == null) return null;
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return parseFloat((R * c).toFixed(1));
}

/**
 * Estimate transit time in minutes given distance in km (assumes ~35km/h emergency vehicle speed in urban setting)
 */
export function estimateEmergencyDurationMinutes(distanceKm) {
  if (!distanceKm) return null;
  const averageSpeedKmH = 35;
  const hours = distanceKm / averageSpeedKmH;
  return Math.max(3, Math.round(hours * 60));
}

/**
 * Requests the user's current GPS position
 */
export function getUserLocation() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser.'));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        resolve({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
        });
      },
      (err) => {
        // Fallback default coordinate (Bangalore city center: 12.9716, 77.5946)
        reject(err);
      },
      {
        enableHighAccuracy: true,
        timeout: 8000,
        maximumAge: 60000,
      }
    );
  });
}

// Default demonstration reference location (Bangalore Central)
export const DEFAULT_USER_COORDS = {
  latitude: 12.9716,
  longitude: 77.5946,
  label: "Bangalore City Center"
};
