import React from 'react';
import { Link } from 'react-router-dom';
import { StatusBadge } from '../common/StatusBadge';
import { formatRelativeTime } from '../../utils/formatters';
import {
  MapPin,
  Phone,
  Bed,
  Navigation,
  Clock,
  ShieldAlert,
  ChevronRight,
  Activity
} from 'lucide-react';

export function HospitalCard({ hospital }) {
  const {
    id,
    name,
    address,
    hospital_type,
    emergency_services_available,
    contact_phone,
    emergency_phone,
    distanceKm,
    totalAvailableBeds,
    last_updated,
    services = [],
    beds = [],
    medicines = [],
  } = hospital;

  const estimatedMinutes = distanceKm ? Math.max(3, Math.round((distanceKm / 35) * 60)) : null;

  // Find ICU bed availability
  const icuBedInfo = beds.find((b) => b.bed_type.toLowerCase().includes('icu'));

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm hover:shadow-md transition group relative overflow-hidden flex flex-col justify-between">
      {/* Top Header */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-2">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              {emergency_services_available ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-200">
                  <ShieldAlert className="w-3.5 h-3.5 text-rose-600" /> 24/7 Emergency
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
                  Day Clinic / OPD Only
                </span>
              )}
              <StatusBadge reportedAt={last_updated} label={last_updated ? formatRelativeTime(last_updated) : 'Unknown'} />
            </div>

            <Link
              to={`/hospitals/${id}`}
              className="font-bold text-base sm:text-lg text-slate-900 group-hover:text-teal-700 transition block leading-snug"
            >
              {name}
            </Link>
            <p className="text-xs text-slate-500 font-medium">{hospital_type}</p>
          </div>

          {/* Distance & ETA Badge */}
          {distanceKm != null && (
            <div className="text-right shrink-0 bg-slate-50 border border-slate-200 p-2 rounded-xl">
              <span className="text-base font-extrabold text-slate-900 block leading-tight">
                {distanceKm} <span className="text-xs font-semibold text-slate-500">km</span>
              </span>
              <span className="text-[11px] font-semibold text-teal-700 block">
                ~{estimatedMinutes} mins
              </span>
            </div>
          )}
        </div>

        {/* Address */}
        <p className="text-xs text-slate-600 flex items-start gap-1.5 mb-3">
          <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
          <span className="line-clamp-1">{address}</span>
        </p>

        {/* Live Metrics: Bed Availability & Critical Stock */}
        <div className="grid grid-cols-2 gap-2 p-3 bg-slate-50 rounded-xl border border-slate-100 mb-3 text-xs">
          <div>
            <span className="text-[11px] text-slate-500 block font-medium">Reported Beds:</span>
            <span className="font-extrabold text-slate-900 flex items-center gap-1">
              <Bed className="w-4 h-4 text-teal-600" />
              {totalAvailableBeds > 0 ? (
                <span className="text-emerald-700">{totalAvailableBeds} Available</span>
              ) : (
                <span className="text-rose-600">0 Available</span>
              )}
            </span>
          </div>

          <div>
            <span className="text-[11px] text-slate-500 block font-medium">ICU Status:</span>
            <span className="font-extrabold text-slate-900 flex items-center gap-1">
              <Activity className="w-4 h-4 text-sky-600" />
              {icuBedInfo ? (
                icuBedInfo.reported_available_beds > 0 ? (
                  <span className="text-emerald-700">{icuBedInfo.reported_available_beds} ICU open</span>
                ) : (
                  <span className="text-rose-600">Full</span>
                )
              ) : (
                <span className="text-slate-500">N/A</span>
              )}
            </span>
          </div>
        </div>

        {/* Service tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {services.slice(0, 3).map((svc, idx) => (
            <span
              key={idx}
              className="text-[10px] font-medium bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md border border-slate-200"
            >
              {svc}
            </span>
          ))}
          {services.length > 3 && (
            <span className="text-[10px] text-slate-400 font-medium px-1 py-0.5">
              +{services.length - 3} more
            </span>
          )}
        </div>
      </div>

      {/* Card Action Buttons */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
        <a
          href={`tel:${emergency_phone || contact_phone}`}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 px-3 py-2 rounded-xl transition"
        >
          <Phone className="w-3.5 h-3.5" /> Call
        </a>

        <div className="flex items-center gap-2">
          <Link
            to={`/map?hospitalId=${id}`}
            className="inline-flex items-center gap-1 text-xs font-semibold text-slate-700 hover:text-teal-700 bg-slate-100 hover:bg-slate-200 px-3 py-2 rounded-xl transition"
          >
            <Navigation className="w-3.5 h-3.5" /> Route
          </Link>

          <Link
            to={`/hospitals/${id}`}
            className="inline-flex items-center gap-1 text-xs font-bold text-white bg-teal-700 hover:bg-teal-800 px-3.5 py-2 rounded-xl shadow-sm transition"
          >
            Details <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
