import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { getRoute } from '../../services/mapService';
import { Navigation, MapPin, Phone, ShieldAlert, Bed, AlertTriangle } from 'lucide-react';
import { useOffline } from '../../contexts/OfflineContext';

export function HospitalMap({
  hospitals = [],
  selectedHospital = null,
  onSelectHospital,
  userLocation = null,
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersLayerRef = useRef(null);
  const routeLayerRef = useRef(null);

  const { isOnline } = useOffline();
  const [routeInfo, setRouteInfo] = useState(null);
  const [isLoadingRoute, setIsLoadingRoute] = useState(false);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const initialLat = userLocation?.latitude || 12.9716;
      const initialLon = userLocation?.longitude || 77.5946;

      const map = L.map(mapContainerRef.current, {
        center: [initialLat, initialLon],
        zoom: 13,
        zoomControl: true,
      });

      // OpenStreetMap Tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(map);

      markersLayerRef.current = L.layerGroup().addTo(map);
      routeLayerRef.current = L.layerGroup().addTo(map);
      mapInstanceRef.current = map;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update Markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersLayer = markersLayerRef.current;
    if (!map || !markersLayer) return;

    markersLayer.clearLayers();

    // 1. User Location Marker
    if (userLocation && userLocation.latitude && userLocation.longitude) {
      const userIcon = L.divIcon({
        className: 'user-marker',
        html: `
          <div style="position:relative; width:24px; height:24px;">
            <div style="position:absolute; width:24px; height:24px; background:rgba(14,165,233,0.3); border-radius:50%; animation: ping 1.5s cubic-bezier(0,0,0.2,1) infinite;"></div>
            <div style="position:absolute; top:4px; left:4px; width:16px; height:16px; background:#0284c7; border:3px solid white; border-radius:50%; box-shadow:0 2px 4px rgba(0,0,0,0.3);"></div>
          </div>
        `,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      });

      L.marker([userLocation.latitude, userLocation.longitude], { icon: userIcon })
        .bindPopup('<strong>Your Current Location</strong><br>GPS Active')
        .addTo(markersLayer);
    }

    // 2. Hospital Markers
    hospitals.forEach((hosp) => {
      const isEmergency = hosp.emergency_services_available;
      const isSelected = selectedHospital && selectedHospital.id === hosp.id;

      const markerColor = isEmergency ? '#dc2626' : '#0f766e';
      const markerBorder = isSelected ? '#f59e0b' : 'white';
      const markerScale = isSelected ? 'transform: scale(1.2);' : '';

      const hospitalIcon = L.divIcon({
        className: 'hospital-marker',
        html: `
          <div style="display:flex; align-items:center; justify-content:center; width:34px; height:34px; background:${markerColor}; border:3px solid ${markerBorder}; border-radius:50%; box-shadow:0 3px 6px rgba(0,0,0,0.3); ${markerScale} transition:transform 0.2s;">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 6v12M6 12h12"/>
            </svg>
          </div>
        `,
        iconSize: [34, 34],
        iconAnchor: [17, 17],
      });

      const marker = L.marker([hosp.latitude, hosp.longitude], { icon: hospitalIcon });

      // Popup Content
      const popupHtml = `
        <div style="font-family:system-ui; font-size:12px; line-height:1.4; min-width:180px;">
          <div style="font-weight:bold; font-size:14px; color:#0f172a; margin-bottom:2px;">${hosp.name}</div>
          <div style="color:#64748b; font-size:11px; margin-bottom:6px;">${hosp.hospital_type}</div>
          <div style="font-weight:600; color:#0f766e; margin-bottom:8px;">
            ${hosp.totalAvailableBeds || 0} Reported Beds Available
          </div>
          <div style="display:flex; gap:4px;">
            <a href="tel:${hosp.emergency_phone || hosp.contact_phone}" style="display:inline-block; padding:4px 8px; background:#fee2e2; color:#b91c1c; border-radius:6px; font-weight:bold; text-decoration:none;">Call</a>
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml);
      marker.on('click', () => {
        if (onSelectHospital) onSelectHospital(hosp);
      });

      marker.addTo(markersLayer);
    });
  }, [hospitals, selectedHospital, userLocation, onSelectHospital]);

  // Request & Draw Route when selectedHospital changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    const routeLayer = routeLayerRef.current;
    if (!map || !routeLayer) return;

    routeLayer.clearLayers();
    setRouteInfo(null);

    if (!selectedHospital) return;

    // Center on selected hospital
    map.panTo([selectedHospital.latitude, selectedHospital.longitude], { animate: true });

    if (userLocation && userLocation.latitude && userLocation.longitude) {
      setIsLoadingRoute(true);
      getRoute(userLocation, selectedHospital)
        .then((route) => {
          setRouteInfo(route);
          if (route && route.coordinates && route.coordinates.length > 0) {
            const polyline = L.polyline(route.coordinates, {
              color: '#0284c7',
              weight: 5,
              opacity: 0.85,
              dashArray: route.isOfflineEstimated ? '8, 8' : undefined,
            }).addTo(routeLayer);

            // Fit map to contain both start and end
            map.fitBounds(polyline.getBounds(), { padding: [50, 50] });
          }
        })
        .catch((err) => {
          console.warn('Could not generate route:', err);
        })
        .finally(() => {
          setIsLoadingRoute(false);
        });
    }
  }, [selectedHospital, userLocation]);

  return (
    <div className="relative w-full h-[520px] rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-slate-100">
      <div ref={mapContainerRef} className="w-full h-full z-10" />

      {/* Map Legend (Top Left) */}
      <div className="absolute top-3 left-3 z-20 bg-white/95 backdrop-blur px-3 py-2 rounded-xl border border-slate-200 shadow-sm text-xs space-y-1.5 pointer-events-auto">
        <span className="font-bold text-slate-800 text-[11px] uppercase tracking-wider block">
          Map Legend
        </span>
        <div className="flex items-center gap-2 text-slate-700">
          <span className="w-3 h-3 rounded-full bg-rose-600 inline-block border border-white shadow-sm" />
          <span>24/7 Emergency Hospital</span>
        </div>
        <div className="flex items-center gap-2 text-slate-700">
          <span className="w-3 h-3 rounded-full bg-teal-600 inline-block border border-white shadow-sm" />
          <span>General Clinic / Hospital</span>
        </div>
        <div className="flex items-center gap-2 text-slate-700">
          <span className="w-3 h-3 rounded-full bg-sky-600 inline-block border border-white shadow-sm" />
          <span>Your Location</span>
        </div>
      </div>

      {/* Route Info Overlay (Bottom Center/Left) */}
      {selectedHospital && (
        <div className="absolute bottom-3 left-3 right-3 sm:right-auto sm:max-w-md z-20 bg-white/95 backdrop-blur p-3.5 rounded-2xl border border-slate-200 shadow-lg pointer-events-auto animate-in slide-in-from-bottom duration-200">
          <div className="flex items-start justify-between gap-2 mb-1">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 block">
                Selected Facility
              </span>
              <h4 className="font-bold text-slate-900 text-sm">{selectedHospital.name}</h4>
            </div>
            {selectedHospital.emergency_services_available && (
              <span className="bg-rose-100 text-rose-800 text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0">
                24/7 Emergency
              </span>
            )}
          </div>

          <p className="text-xs text-slate-600 line-clamp-1 mb-2.5">
            {selectedHospital.address}
          </p>

          {/* Route Stats */}
          {isLoadingRoute ? (
            <p className="text-xs text-slate-500 italic">Calculating fastest emergency route...</p>
          ) : routeInfo ? (
            <div className="space-y-2">
              <div className="flex items-center gap-4 bg-slate-50 p-2 rounded-xl text-xs font-semibold">
                <div>
                  <span className="text-[10px] text-slate-400 block font-normal">Distance:</span>
                  <span className="text-slate-900 font-extrabold">{routeInfo.distanceKm} km</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-normal">Est. Transit:</span>
                  <span className="text-teal-700 font-extrabold">~{routeInfo.durationMinutes} mins</span>
                </div>
              </div>

              {routeInfo.isOfflineEstimated && (
                <p className="text-[11px] text-amber-700 flex items-center gap-1 bg-amber-50 p-1.5 rounded-lg border border-amber-200">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                  {routeInfo.note}
                </p>
              )}
            </div>
          ) : (
            <p className="text-xs text-slate-400">Enable GPS to view live route and duration.</p>
          )}

          <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
            <a
              href={`tel:${selectedHospital.emergency_phone || selectedHospital.contact_phone}`}
              className="inline-flex items-center gap-1 text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded-lg transition"
            >
              <Phone className="w-3.5 h-3.5" /> Call Hospital
            </a>

            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${selectedHospital.latitude},${selectedHospital.longitude}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs font-bold text-white bg-teal-700 hover:bg-teal-800 px-3 py-1.5 rounded-lg transition shadow-sm"
            >
              <Navigation className="w-3.5 h-3.5" /> External Maps
            </a>
          </div>
        </div>
      )}

      {/* Offline Notice Overlay */}
      {!isOnline && (
        <div className="absolute top-3 right-3 z-20 bg-amber-500/90 text-slate-950 font-bold px-3 py-1 rounded-xl text-xs flex items-center gap-1.5 shadow-sm">
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>Offline Map Mode</span>
        </div>
      )}
    </div>
  );
}
