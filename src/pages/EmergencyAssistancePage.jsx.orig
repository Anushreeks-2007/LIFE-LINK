import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FirstAidGuide } from '../components/emergency/FirstAidGuide';
import { getHospitals } from '../services/hospitalService';
import { HospitalCard } from '../components/hospital/HospitalCard';
import { useLanguage } from '../contexts/LanguageContext';
import { useOffline } from '../contexts/OfflineContext';
import { DEFAULT_USER_COORDS } from '../utils/geoUtils';
import {
  PhoneCall,
  ShieldAlert,
  AlertTriangle,
  HeartPulse,
  Search,
  MapPin,
  Ambulance,
  PhoneForwarded,
  ArrowRight
} from 'lucide-react';

export function EmergencyAssistancePage() {
  const { t } = useLanguage();
  const { isOnline } = useOffline();
  const [nearestEmergencyHospitals, setNearestEmergencyHospitals] = useState([]);

  useEffect(() => {
    getHospitals({ emergencyOnly: true, userLocation: DEFAULT_USER_COORDS, sortBy: 'distance' })
      .then((data) => setNearestEmergencyHospitals(data.slice(0, 2)))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Emergency Alert Header */}
      <div className="bg-rose-600 text-white rounded-3xl p-6 sm:p-8 shadow-xl shadow-rose-600/20 space-y-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-white/20 rounded-xl">
            <HeartPulse className="w-6 h-6 stroke-[2.5]" />
          </div>
          <span className="text-xs font-black uppercase tracking-widest bg-rose-700/80 px-3 py-1 rounded-full">
            Immediate Emergency Response
          </span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
          Facing a Critical Medical Emergency?
        </h1>

        <p className="text-xs sm:text-sm text-rose-100 max-w-2xl leading-relaxed">
          {t('emergencyDisclaimer')}
        </p>

        {/* 1-Touch Hotlines Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-2">
          <a
            href="tel:108"
            className="flex items-center justify-between p-4 bg-white text-rose-900 rounded-2xl shadow-md hover:bg-rose-50 transition transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <div className="flex items-center gap-3">
              <Ambulance className="w-6 h-6 text-rose-600" />
              <div>
                <span className="text-[11px] font-bold text-slate-500 uppercase block">Ambulance</span>
                <span className="text-xl font-black text-rose-600">Dial 108</span>
              </div>
            </div>
            <PhoneCall className="w-5 h-5 text-rose-600" />
          </a>

          <a
            href="tel:112"
            className="flex items-center justify-between p-4 bg-white text-rose-900 rounded-2xl shadow-md hover:bg-rose-50 transition transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <div className="flex items-center gap-3">
              <ShieldAlert className="w-6 h-6 text-rose-600" />
              <div>
                <span className="text-[11px] font-bold text-slate-500 uppercase block">All Emergencies</span>
                <span className="text-xl font-black text-rose-600">Dial 112</span>
              </div>
            </div>
            <PhoneCall className="w-5 h-5 text-rose-600" />
          </a>

          <a
            href="tel:1077"
            className="flex items-center justify-between p-4 bg-white text-rose-900 rounded-2xl shadow-md hover:bg-rose-50 transition transform hover:-translate-y-0.5 active:translate-y-0 sm:col-span-2 md:col-span-1"
          >
            <div className="flex items-center gap-3">
              <PhoneForwarded className="w-6 h-6 text-rose-600" />
              <div>
                <span className="text-[11px] font-bold text-slate-500 uppercase block">Disaster Relief</span>
                <span className="text-xl font-black text-rose-600">Dial 1077</span>
              </div>
            </div>
            <PhoneCall className="w-5 h-5 text-rose-600" />
          </a>
        </div>
      </div>

      {/* Offline Alert if disconnected */}
      {!isOnline && (
        <div className="bg-amber-50 border border-amber-300 rounded-2xl p-4 text-xs text-amber-900 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-sm">Offline Mode Active</h4>
            <p className="mt-0.5">
              {t('offlineNotice')}
            </p>
          </div>
        </div>
      )}

      {/* Nearest 24/7 Trauma Centers */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-rose-600" />
            <h2 className="text-lg font-black text-slate-900">
              Nearest 24/7 Emergency Casualty Facilities
            </h2>
          </div>
          <Link to="/hospitals?emergency=1" className="text-xs font-bold text-teal-700 hover:underline">
            View All Emergency Facilities →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {nearestEmergencyHospitals.map((hosp) => (
            <HospitalCard key={hosp.id} hospital={hosp} />
          ))}
        </div>
      </div>

      {/* Offline First Aid Guides */}
      <FirstAidGuide />
    </div>
  );
}
