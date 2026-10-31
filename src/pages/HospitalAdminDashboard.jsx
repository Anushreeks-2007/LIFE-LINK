import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Link } from 'react-router-dom';
import { getHospitalById } from '../services/hospitalService';
import { formatDateTime, formatRelativeTime, isTimestampOutdated } from '../utils/formatters';
import { useAuth } from '../contexts/AuthContext';
import {
  Building2,
  Bed,
  Pill,
  Clock,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Activity,
  RefreshCw
} from 'lucide-react';

export function HospitalAdminDashboard() {
  const { user } = useAuth();
  const hospitalId = user?.assignedHospitalId || 'hosp-001';

  const [hospital, setHospital] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getHospitalById(hospitalId)
      .then((data) => setHospital(data))
      .catch((err) => console.error(err))
      .finally(() => setIsLoading(false));
  }, [hospitalId]);

  if (isLoading) {
    return (
      <div className="py-24 text-center text-xs font-semibold text-slate-400">
        <RefreshCw className="w-8 h-8 animate-spin mx-auto text-teal-600 mb-2" />
        <p>{t('adm_loading')}</p>
      </div>
    );
  }

  const isOutdated = isTimestampOutdated(hospital?.last_updated);
  const totalBeds = (hospital?.beds || []).reduce((sum, b) => sum + (Number(b.total_beds) || 0), 0);
  const availableBeds = (hospital?.beds || []).reduce((sum, b) => sum + (Number(b.reported_available_beds) || 0), 0);
  const occupiedBeds = Math.max(0, totalBeds - availableBeds);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-sky-700 bg-sky-50 px-2.5 py-0.5 rounded-full border border-sky-200">
            {t('adm_badge')}
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
            {hospital?.name || t('adm_defaultTitle')}
          </h1>
          <p className="text-xs text-slate-500">
            {t('adm_sub')}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/admin/beds"
            className="inline-flex items-center gap-1.5 bg-sky-700 hover:bg-sky-800 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-sm transition"
          >
            <Bed className="w-4 h-4" /> {t('adm_updBeds')}
          </Link>
          <Link
            to="/admin/medicines"
            className="inline-flex items-center gap-1.5 bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-sm transition"
          >
            <Pill className="w-4 h-4" /> {t('adm_updMeds')}
          </Link>
        </div>
      </div>

      {/* Freshness Status Banner */}
      <div className={`rounded-2xl p-4 text-xs flex items-center justify-between border ${
        isOutdated ? 'bg-amber-50 border-amber-300 text-amber-900' : 'bg-emerald-50 border-emerald-300 text-emerald-900'
      }`}>
        <div className="flex items-center gap-2.5">
          {isOutdated ? <AlertTriangle className="w-5 h-5 text-amber-600" /> : <ShieldCheck className="w-5 h-5 text-emerald-600" />}
          <div>
            <span className="font-bold block">
              {isOutdated ? t('adm_outdated') : t('adm_current')}
            </span>
            <span className="text-[11px] opacity-80">
              {t('adm_lastTx')} {formatDateTime(hospital?.last_updated)} ({formatRelativeTime(hospital?.last_updated)})
            </span>
          </div>
        </div>

        <Link
          to="/admin/beds"
          className="text-xs font-bold underline shrink-0"
        >
          {t('adm_transmit')}
        </Link>
      </div>

      {/* Key Metric Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm space-y-1">
          <span className="text-[11px] font-bold uppercase text-slate-400">{t('adm_totCap')}</span>
          <span className="text-3xl font-black text-slate-900 block">{totalBeds}</span>
          <span className="text-[11px] text-slate-500 font-medium">{t('adm_licensed')}</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm space-y-1">
          <span className="text-[11px] font-bold uppercase text-emerald-600">{t('adm_availBeds')}</span>
          <span className="text-3xl font-black text-emerald-700 block">{availableBeds}</span>
          <span className="text-[11px] text-slate-500 font-medium">{t('adm_openIntake')}</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm space-y-1">
          <span className="text-[11px] font-bold uppercase text-slate-400">{t('adm_occ')}</span>
          <span className="text-3xl font-black text-slate-900 block">{occupiedBeds}</span>
          <span className="text-[11px] text-slate-500 font-medium">{t('adm_inpat')}</span>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm space-y-1">
          <span className="text-[11px] font-bold uppercase text-teal-600">{t('adm_drugs')}</span>
          <span className="text-3xl font-black text-teal-800 block">{hospital?.medicines?.length || 0}</span>
          <span className="text-[11px] text-slate-500 font-medium">{t('adm_drugsSub')}</span>
        </div>
      </div>

      {/* Bed Category Status Summary */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
            <Bed className="w-5 h-5 text-teal-600" />
            {t('adm_typeCap')}
          </h3>
          <Link to="/admin/beds" className="text-xs font-bold text-sky-700 hover:underline">
            {t('adm_edit')}
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          {(hospital?.beds || []).map((bed) => (
            <div key={bed.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-900 block">{bed.bed_type}</span>
                <span className="text-slate-500 text-[11px]">{t('adm_totalBeds').replace('{n}', bed.total_beds)}</span>
              </div>
              <div className="text-right">
                <span className={`text-lg font-black block ${bed.reported_available_beds > 0 ? 'text-emerald-700' : 'text-rose-600'}`}>
                  {bed.reported_available_beds} {t('adm_available')}
                </span>
                <span className="text-[10px] text-slate-400">{formatRelativeTime(bed.reported_at)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
