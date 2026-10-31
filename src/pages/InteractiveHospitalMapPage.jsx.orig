import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { getHospitals } from '../services/hospitalService';
import { HospitalMap } from '../components/maps/HospitalMap';
import { getUserLocation, DEFAULT_USER_COORDS } from '../utils/geoUtils';
import { useLanguage } from '../contexts/LanguageContext';
import { useOffline } from '../contexts/OfflineContext';
import { MapPin, Navigation, Phone, ShieldAlert, Bed, RefreshCw, AlertTriangle } from 'lucide-react';

export function InteractiveHospitalMapPage() {
  const { t } = useLanguage();
  const { isOnline } = useOffline();
  const [searchParams] = useSearchParams();
  const hospitalIdParam = searchParams.get('hospitalId');

  const [hospitals, setHospitals] = useState([]);
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [userLocation, setUserLocation] = useState(DEFAULT_USER_COORDS);
  const [isLocating, setIsLocating] = useState(false);
  const [filterEmergency, setFilterEmergency] = useState(false);

  useEffect(() => {
    getHospitals({ emergencyOnly: filterEmergency, userLocation })
      .then((data) => {
        setHospitals(data);
        if (hospitalIdParam) {
          const target = data.find((h) => h.id === hospitalIdParam);
          if (target) setSelectedHospital(target);
        } else if (data.length > 0 && !selectedHospital) {
          setSelectedHospital(data[0]);
        }
      })
      .catch((err) => console.error(err));
  }, [filterEmergency, hospitalIdParam, userLocation]);

  const handleRequestLocation = async () => {
    setIsLocating(true);
    try {
      const pos = await getUserLocation();
      setUserLocation(pos);
    } catch {
      setUserLocation(DEFAULT_USER_COORDS);
    } finally {
      setIsLocating(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200">
              Interactive Route Navigation
            </span>
            {!isOnline && (
              <span className="text-xs font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                Offline Coordinates Loaded
              </span>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {t('navMap')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Locate nearest facilities and generate estimated emergency transit lines.
          </p>
        </div>

        {/* GPS trigger */}
        <button
          type="button"
          onClick={handleRequestLocation}
          disabled={isLocating}
          className="inline-flex items-center gap-1.5 bg-white border border-slate-300 text-slate-800 hover:bg-slate-50 px-4 py-2 rounded-xl text-xs font-bold shadow-sm transition"
        >
          <MapPin className={`w-4 h-4 text-teal-600 ${isLocating ? 'animate-bounce' : ''}`} />
          {isLocating ? 'Updating GPS...' : 'Locate My Position'}
        </button>
      </div>

      {/* Main Map + Sidebar Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Interactive Map (2 Columns on Desktop) */}
        <div className="lg:col-span-2">
          <HospitalMap
            hospitals={hospitals}
            selectedHospital={selectedHospital}
            onSelectHospital={setSelectedHospital}
            userLocation={userLocation}
          />
        </div>

        {/* Hospital Selection Sidebar (1 Column on Desktop) */}
        <div className="space-y-3">
          <div className="flex items-center justify-between pb-1">
            <h3 className="font-extrabold text-sm text-slate-900">
              Facilities ({hospitals.length})
            </h3>
            <button
              type="button"
              onClick={() => setFilterEmergency(!filterEmergency)}
              className={`text-xs font-bold px-2.5 py-1 rounded-lg border transition ${
                filterEmergency
                  ? 'bg-rose-600 text-white border-rose-600'
                  : 'bg-slate-100 text-slate-700 border-slate-200'
              }`}
            >
              24/7 Only
            </button>
          </div>

          <div className="space-y-2.5 max-h-[460px] overflow-y-auto pr-1">
            {hospitals.map((hosp) => {
              const isSelected = selectedHospital && selectedHospital.id === hosp.id;
              return (
                <div
                  key={hosp.id}
                  onClick={() => setSelectedHospital(hosp)}
                  className={`p-3.5 rounded-2xl border text-xs cursor-pointer transition ${
                    isSelected
                      ? 'border-teal-500 bg-teal-50/50 shadow-sm'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h4 className="font-bold text-slate-900 line-clamp-1">{hosp.name}</h4>
                    {hosp.distanceKm != null && (
                      <span className="font-extrabold text-teal-800 shrink-0">
                        {hosp.distanceKm} km
                      </span>
                    )}
                  </div>

                  <p className="text-[11px] text-slate-500 line-clamp-1 mb-2">
                    {hosp.address}
                  </p>

                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-semibold text-slate-700">
                      {hosp.totalAvailableBeds || 0} Beds reported
                    </span>
                    <Link
                      to={`/hospitals/${hosp.id}`}
                      className="text-teal-700 font-bold hover:underline"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Details →
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
