import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getHospitalById, updateHospitalBeds } from '../services/hospitalService';
import { useAuth } from '../contexts/AuthContext';
import { useOffline } from '../contexts/OfflineContext';
import {
  Bed,
  Save,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Building2,
  Clock
} from 'lucide-react';

export function BedAvailabilityManagementPage() {
  const { user } = useAuth();
  const { isOnline } = useOffline();
  const navigate = useNavigate();
  const hospitalId = user?.assignedHospitalId || 'hosp-001';

  const [hospital, setHospital] = useState(null);
  const [beds, setBeds] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [validationError, setValidationError] = useState(null);

  useEffect(() => {
    getHospitalById(hospitalId)
      .then((data) => {
        setHospital(data);
        setBeds(data?.beds || []);
      })
      .catch((err) => console.error(err))
      .finally(() => setIsLoading(false));
  }, [hospitalId]);

  const handleBedCountChange = (bedId, field, value) => {
    const num = Math.max(0, parseInt(value, 10) || 0);
    setBeds((prev) =>
      prev.map((b) => (b.id === bedId ? { ...b, [field]: num } : b))
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError(null);

    // Validation: Available beds cannot exceed Total beds
    for (const b of beds) {
      if (b.reported_available_beds > b.total_beds) {
        setValidationError(`Invalid bed count for "${b.bed_type}": Available beds (${b.reported_available_beds}) cannot exceed total capacity (${b.total_beds}).`);
        return;
      }
    }

    setIsSaving(true);
    try {
      const now = new Date().toISOString();
      const updatedBeds = beds.map((b) => ({ ...b, reported_at: now }));
      await updateHospitalBeds(hospitalId, updatedBeds, !isOnline);
      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
        navigate('/admin');
      }, 1500);
    } catch (err) {
      alert('Failed to update bed counts: ' + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="py-24 text-center text-xs font-semibold text-slate-400">
        <RefreshCw className="w-8 h-8 animate-spin mx-auto text-teal-600 mb-2" />
        <p>Loading Bed Inventory...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <Link
        to="/admin"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 transition"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Admin Overview
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-sky-700 bg-sky-50 px-2.5 py-0.5 rounded-full border border-sky-200">
            Live Bed Reporting
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
            Update Bed Availability
          </h1>
          <p className="text-xs text-slate-500">
            {hospital?.name} • Accurate counts prevent emergency diversions and save lives.
          </p>
        </div>

        <div className="text-right">
          <span className="text-xs font-bold text-slate-400 block">Status</span>
          <span className={`text-xs font-extrabold ${isOnline ? 'text-emerald-600' : 'text-amber-600'}`}>
            {isOnline ? 'Broadcasting Online' : 'Queuing Offline'}
          </span>
        </div>
      </div>

      {validationError && (
        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-2xl flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{validationError}</span>
        </div>
      )}

      {saveSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs rounded-2xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Bed availability broadcasted successfully!</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="space-y-4">
          {beds.map((b) => (
            <div
              key={b.id}
              className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs"
            >
              <div>
                <span className="font-extrabold text-sm text-slate-900 block">{b.bed_type}</span>
                <span className="text-[11px] text-slate-500">
                  Last reported: {new Date(b.reported_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                    Total Licensed
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={b.total_beds}
                    onChange={(e) => handleBedCountChange(b.id, 'total_beds', e.target.value)}
                    className="w-24 px-3 py-1.5 rounded-xl border border-slate-300 font-bold text-center"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-emerald-700 uppercase block mb-1">
                    Available Now
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={b.reported_available_beds}
                    onChange={(e) => handleBedCountChange(b.id, 'reported_available_beds', e.target.value)}
                    className="w-24 px-3 py-1.5 rounded-xl border-2 border-emerald-500 bg-emerald-50 text-emerald-950 font-black text-center text-sm"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <span className="text-[11px] text-slate-500">
            Updating resets the freshness timestamp to {new Date().toLocaleTimeString()}.
          </span>

          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center gap-2 bg-sky-700 hover:bg-sky-800 text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow-sm transition"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Broadcasting...' : 'Save & Broadcast Availability'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
