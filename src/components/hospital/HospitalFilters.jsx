import React from 'react';
import { Search, SlidersHorizontal, MapPin, ShieldAlert, Activity, Droplet, Wind } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

export function HospitalFilters({
  searchQuery,
  setSearchQuery,
  emergencyOnly,
  setEmergencyOnly,
  hasIcu,
  setHasIcu,
  hasOxygen,
  setHasOxygen,
  hasBlood,
  setHasBlood,
  sortBy,
  setSortBy,
  userLocation,
  requestLocation,
  isLocating,
}) {
  const { t } = useLanguage();

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-sm space-y-4">
      {/* Search Input Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('searchPlaceholder')}
            className="w-full pl-11 pr-4 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-teal-600 transition"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold p-1"
            >
              Clear
            </button>
          )}
        </div>

        {/* Location Detection Button */}
        <button
          type="button"
          onClick={requestLocation}
          disabled={isLocating}
          className={`inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold border transition ${
            userLocation
              ? 'bg-teal-50 border-teal-200 text-teal-800'
              : 'bg-slate-50 border-slate-300 text-slate-700 hover:bg-slate-100'
          }`}
        >
          <MapPin className={`w-4 h-4 ${isLocating ? 'animate-bounce text-teal-600' : 'text-slate-500'}`} />
          {isLocating
            ? 'Detecting GPS...'
            : userLocation
            ? 'GPS Location Active'
            : 'Use My GPS Location'}
        </button>
      </div>

      {/* Filter Chips & Sorting */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100">
        <div className="flex flex-wrap items-center gap-2">
          {/* Emergency 24/7 Filter */}
          <button
            type="button"
            onClick={() => setEmergencyOnly(!emergencyOnly)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition ${
              emergencyOnly
                ? 'bg-rose-600 text-white border-rose-600 shadow-sm'
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            {t('filterEmergency24x7')}
          </button>

          {/* Has ICU Filter */}
          <button
            type="button"
            onClick={() => setHasIcu(!hasIcu)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition ${
              hasIcu
                ? 'bg-teal-700 text-white border-teal-700 shadow-sm'
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            {t('filterHasICU')}
          </button>

          {/* Oxygen Beds Filter */}
          <button
            type="button"
            onClick={() => setHasOxygen(!hasOxygen)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition ${
              hasOxygen
                ? 'bg-teal-700 text-white border-teal-700 shadow-sm'
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <Wind className="w-3.5 h-3.5" />
            {t('filterHasOxygen')}
          </button>

          {/* Blood Bank Filter */}
          <button
            type="button"
            onClick={() => setHasBlood(!hasBlood)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition ${
              hasBlood
                ? 'bg-teal-700 text-white border-teal-700 shadow-sm'
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <Droplet className="w-3.5 h-3.5" />
            {t('filterHasBlood')}
          </button>
        </div>

        {/* Sort Select */}
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-slate-400" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="text-xs font-semibold bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-600"
          >
            <option value="distance">{t('sortByDistance')}</option>
            <option value="availability">{t('sortByAvailability')}</option>
            <option value="name">Sort by Name</option>
          </select>
        </div>
      </div>
    </div>
  );
}
