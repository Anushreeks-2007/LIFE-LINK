import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { getHospitals } from '../services/hospitalService';
import { HospitalCard } from '../components/hospital/HospitalCard';
import { HospitalFilters } from '../components/hospital/HospitalFilters';
import { getUserLocation, DEFAULT_USER_COORDS } from '../utils/geoUtils';
import { useLanguage } from '../contexts/LanguageContext';
import { useOffline } from '../contexts/OfflineContext';
import { Search, MapPin, Mic, AlertCircle, Building2, RefreshCw } from 'lucide-react';

export function HospitalDiscoveryPage() {
  const { t } = useLanguage();
  const { isOnline } = useOffline();
  const [searchParams, setSearchParams] = useSearchParams();

  const [hospitals, setHospitals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filter States
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [emergencyOnly, setEmergencyOnly] = useState(searchParams.get('emergency') === '1');
  const [hasIcu, setHasIcu] = useState(searchParams.get('icu') === '1');
  const [hasOxygen, setHasOxygen] = useState(searchParams.get('oxygen') === '1');
  const [hasBlood, setHasBlood] = useState(searchParams.get('blood') === '1');
  const [sortBy, setSortBy] = useState('distance');

  // Location State
  const [userLocation, setUserLocation] = useState(DEFAULT_USER_COORDS);
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState(null);

  // Load Hospitals
  const loadData = async () => {
    setIsLoading(true);
    try {
      const data = await getHospitals({
        searchQuery,
        emergencyOnly,
        hasIcu,
        hasOxygen,
        hasBlood,
        sortBy,
        userLocation,
      });
      setHospitals(data);
    } catch (err) {
      console.error('Failed to load hospitals:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [searchQuery, emergencyOnly, hasIcu, hasOxygen, hasBlood, sortBy, userLocation]);

  const handleRequestLocation = async () => {
    setIsLocating(true);
    setLocationError(null);
    try {
      const pos = await getUserLocation();
      setUserLocation(pos);
    } catch (err) {
      console.warn('GPS location request failed:', err);
      setLocationError(t('hdisc_gps'));
      setUserLocation(DEFAULT_USER_COORDS);
    } finally {
      setIsLocating(false);
    }
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setEmergencyOnly(false);
    setHasIcu(false);
    setHasOxygen(false);
    setHasBlood(false);
    setSortBy('distance');
    setSearchParams({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">
              {t('hdisc_badge')}
            </span>
            {!isOnline && (
              <span className="text-xs font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                {t('hdisc_cached')}
              </span>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {t('navHospitals')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            {t('hdisc_sub')}
          </p>
        </div>

        {/* Quick View Switches */}
        <div className="flex items-center gap-2">
          <Link
            to="/voice-assistant"
            className="inline-flex items-center gap-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 px-3.5 py-2 rounded-xl text-xs font-bold shadow-sm transition"
          >
            <Mic className="w-4 h-4 text-teal-600" />
            <span>{t('hdisc_voice')}</span>
          </Link>

          <Link
            to="/map"
            className="inline-flex items-center gap-1.5 bg-teal-700 hover:bg-teal-800 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-sm transition"
          >
            <MapPin className="w-4 h-4" />
            <span>{t('navMap')}</span>
          </Link>
        </div>
      </div>

      {/* GPS Status Message if any */}
      {locationError && (
        <div className="bg-amber-50 border border-amber-200 text-amber-900 text-xs p-3 rounded-2xl flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>{locationError}</span>
        </div>
      )}

      {/* Filter Component */}
      <HospitalFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        emergencyOnly={emergencyOnly}
        setEmergencyOnly={setEmergencyOnly}
        hasIcu={hasIcu}
        setHasIcu={setHasIcu}
        hasOxygen={hasOxygen}
        setHasOxygen={setHasOxygen}
        hasBlood={hasBlood}
        setHasBlood={setHasBlood}
        sortBy={sortBy}
        setSortBy={setSortBy}
        userLocation={userLocation}
        requestLocation={handleRequestLocation}
        isLocating={isLocating}
      />

      {/* Hospital Results Count */}
      <div className="flex items-center justify-between text-xs text-slate-500 font-medium px-1">
        <span>
          {t('hdisc_showing')} <strong>{hospitals.length}</strong> {t('hdisc_matching')}
        </span>
        <button
          type="button"
          onClick={loadData}
          className="hover:text-slate-800 inline-flex items-center gap-1"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} /> {t('hdisc_refresh')}
        </button>
      </div>

      {/* Hospitals Grid */}
      {isLoading ? (
        <div className="py-20 text-center text-slate-400 text-xs font-semibold space-y-2">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto text-teal-600" />
          <p>{t('loading')}</p>
        </div>
      ) : hospitals.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {hospitals.map((hospital) => (
            <HospitalCard key={hospital.id} hospital={hospital} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-md mx-auto space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-base">{t('noHospitalsFound')}</h3>
            <p className="text-xs text-slate-500 mt-1">
              {t('hdisc_try')}
            </p>
          </div>
          <button
            type="button"
            onClick={handleResetFilters}
            className="inline-flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition"
          >
            {t('hdisc_reset')}
          </button>
        </div>
      )}
    </div>
  );
}
