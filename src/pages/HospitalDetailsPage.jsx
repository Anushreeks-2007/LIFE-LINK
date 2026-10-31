import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getHospitalById } from '../services/hospitalService';
import { StatusBadge } from '../components/common/StatusBadge';
import { formatRelativeTime, formatDateTime, isTimestampOutdated } from '../utils/formatters';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth, ROLES } from '../contexts/AuthContext';
import {
  MapPin,
  Phone,
  Bed,
  Pill,
  Navigation,
  Clock,
  ShieldCheck,
  ShieldAlert,
  ArrowLeft,
  Building2,
  AlertTriangle,
  Send,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';

export function HospitalDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { role } = useAuth();

  const [hospital, setHospital] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getHospitalById(id)
      .then((data) => setHospital(data))
      .catch((err) => console.error('Failed to load hospital details:', err))
      .finally(() => setIsLoading(false));
  }, [id]);

  if (isLoading) {
    return (
      <div className="py-24 text-center text-slate-400 text-xs font-semibold">
        <RefreshCw className="w-8 h-8 animate-spin mx-auto text-teal-600 mb-2" />
        <p>{t('loading')}</p>
      </div>
    );
  }

  if (!hospital) {
    return (
      <div className="max-w-2xl mx-auto py-16 text-center space-y-4">
        <Building2 className="w-12 h-12 text-slate-300 mx-auto" />
        <h2 className="text-xl font-bold text-slate-800">{t('hd_nf')}</h2>
        <p className="text-xs text-slate-500">{t('hd_nfText')}</p>
        <Link to="/hospitals" className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-700 hover:underline">
          <ArrowLeft className="w-4 h-4" /> {t('hd_ret')}
        </Link>
      </div>
    );
  }

  const isOutdated = isTimestampOutdated(hospital.last_updated);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Back Button */}
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 transition"
      >
        <ArrowLeft className="w-4 h-4" /> {t('back')}
      </button>

      {/* Outdated Availability Banner */}
      {isOutdated && (
        <div className="bg-amber-50 border border-amber-300 rounded-2xl p-4 text-xs text-amber-900 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-sm">{t('hd_staleTitle')}</h4>
            <p className="mt-0.5">
              {t('hd_staleText').replace('{time}', formatRelativeTime(hospital.last_updated))}
            </p>
          </div>
        </div>
      )}

      {/* Hospital Hero Banner */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              {hospital.emergency_services_available ? (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-extrabold bg-rose-100 text-rose-800 border border-rose-200">
                  <ShieldAlert className="w-4 h-4 text-rose-600" /> {t('hd_emgBadge')}
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
                  {t('hd_day')}
                </span>
              )}
              <StatusBadge type="verified" label={hospital.verification_status || t('hd_verified')} />
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {hospital.name}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
              {hospital.hospital_type}
            </p>
          </div>

          {/* Quick Action Dialers */}
          <div className="flex flex-wrap sm:flex-col items-center sm:items-end gap-2">
            <a
              href={`tel:${hospital.emergency_phone || hospital.contact_phone}`}
              className="inline-flex items-center gap-1.5 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl shadow-md shadow-rose-600/20 emergency-pulse transition"
            >
              <Phone className="w-4 h-4" /> {t('hd_desk')} {hospital.emergency_phone || hospital.contact_phone}
            </a>

            <Link
              to={`/map?hospitalId=${hospital.id}`}
              className="inline-flex items-center gap-1.5 bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-sm transition"
            >
              <Navigation className="w-4 h-4" /> {t('directions')}
            </Link>
          </div>
        </div>

        {/* Address and Last Updated */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-100 text-xs text-slate-600">
          <p className="flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
            <span>{hospital.address}</span>
          </p>

          <p className="flex items-center gap-1.5 text-slate-500 font-medium">
            <Clock className="w-4 h-4 text-slate-400" />
            <span>{t('common_lastReported')} {formatDateTime(hospital.last_updated)} ({formatRelativeTime(hospital.last_updated)})</span>
          </p>
        </div>
      </div>

      {/* Bed Availability Breakdown */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bed className="w-5 h-5 text-teal-600" />
            <h2 className="text-lg font-black text-slate-900">
              {t('hd_bedTitle')}
            </h2>
          </div>
          <span className="text-xs font-semibold text-slate-400">
            {t('hd_src')}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 uppercase font-bold text-[10px]">
                <th className="pb-3">{t('hd_thClass')}</th>
                <th className="pb-3">{t('hd_thTot')}</th>
                <th className="pb-3">{t('hd_thAvail')}</th>
                <th className="pb-3">{t('common_status')}</th>
                <th className="pb-3 text-right">{t('common_timestamp')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {(hospital.beds || []).map((bed) => {
                const available = Number(bed.reported_available_beds) || 0;
                let status = 'available';
                if (available === 0) status = 'unavailable';
                else if (available <= 2) status = 'limited';

                return (
                  <tr key={bed.id} className="hover:bg-slate-50/60 transition">
                    <td className="py-3.5 font-bold text-slate-900">{bed.bed_type}</td>
                    <td className="py-3.5 text-slate-600">{bed.total_beds}</td>
                    <td className="py-3.5">
                      <span className={`font-black text-sm ${available > 0 ? 'text-emerald-700' : 'text-rose-600'}`}>
                        {available}
                      </span>
                    </td>
                    <td className="py-3.5">
                      <StatusBadge type={status} reportedAt={bed.reported_at} />
                    </td>
                    <td className="py-3.5 text-right text-slate-500">
                      {formatRelativeTime(bed.reported_at)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {role === ROLES.HOSPITAL_ADMIN && (
          <div className="pt-2">
            <Link
              to="/admin/beds"
              className="text-xs font-bold text-sky-700 hover:underline inline-flex items-center gap-1"
            >
              {t('hd_updLink')}
            </Link>
          </div>
        )}
      </div>

      {/* Essential Medicine Inventory */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Pill className="w-5 h-5 text-teal-600" />
            <h2 className="text-lg font-black text-slate-900">
              {t('hd_medTitle')}
            </h2>
          </div>
          <span className="text-xs font-semibold text-slate-400">
            {t('hd_supplies')}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 uppercase font-bold text-[10px]">
                <th className="pb-3">{t('hd_thDrug')}</th>
                <th className="pb-3">{t('hd_thStock')}</th>
                <th className="pb-3">{t('hd_thUnit')}</th>
                <th className="pb-3 text-right">{t('hd_thAt')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {(hospital.medicines || []).map((med) => (
                <tr key={med.id} className="hover:bg-slate-50/60 transition">
                  <td className="py-3.5 font-bold text-slate-900">{med.medicine_name}</td>
                  <td className="py-3.5">
                    <span className={`font-black text-sm ${med.reported_quantity > 5 ? 'text-emerald-700' : 'text-amber-700'}`}>
                      {med.reported_quantity}
                    </span>
                  </td>
                  <td className="py-3.5 text-slate-600">{med.unit}</td>
                  <td className="py-3.5 text-right text-slate-500">
                    {formatRelativeTime(med.reported_at)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {role === ROLES.HOSPITAL_ADMIN && (
          <div className="pt-2">
            <Link
              to="/admin/medicines"
              className="text-xs font-bold text-sky-700 hover:underline inline-flex items-center gap-1"
            >
              {t('hd_manage')}
            </Link>
          </div>
        )}
      </div>

      {/* Services and Clinical Capabilities */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-4">
        <h2 className="text-lg font-black text-slate-900">
          {t('hd_services')}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
          {(hospital.services || []).map((svc, idx) => (
            <div
              key={idx}
              className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs font-semibold text-slate-800"
            >
              <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
              <span>{svc}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
