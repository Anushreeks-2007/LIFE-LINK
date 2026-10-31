import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useNavigate, Link } from 'react-router-dom';
import { getHospitalById, updateHospitalMedicines } from '../services/hospitalService';
import { useAuth } from '../contexts/AuthContext';
import { useOffline } from '../contexts/OfflineContext';
import {
  Pill,
  Save,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Building2,
  Droplet
} from 'lucide-react';

export function MedicineInventoryManagementPage() {
  const { user } = useAuth();
  const { isOnline } = useOffline();
  const navigate = useNavigate();
  const hospitalId = user?.assignedHospitalId || 'hosp-001';

  const [hospital, setHospital] = useState(null);
  const [medicines, setMedicines] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    getHospitalById(hospitalId)
      .then((data) => {
        setHospital(data);
        setMedicines(data?.medicines || []);
      })
      .catch((err) => console.error(err))
      .finally(() => setIsLoading(false));
  }, [hospitalId]);

  const handleQuantityChange = (medId, value) => {
    const num = Math.max(0, parseInt(value, 10) || 0);
    setMedicines((prev) =>
      prev.map((m) => (m.id === medId ? { ...m, reported_quantity: num } : m))
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const now = new Date().toISOString();
      const updated = medicines.map((m) => ({ ...m, reported_at: now }));
      await updateHospitalMedicines(hospitalId, updated, !isOnline);
      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
        navigate('/admin');
      }, 1500);
    } catch (err) {
      alert(t('med_fail') + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="py-24 text-center text-xs font-semibold text-slate-400">
        <RefreshCw className="w-8 h-8 animate-spin mx-auto text-teal-600 mb-2" />
        <p>{t('med_loading')}</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <Link
        to="/admin"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 transition"
      >
        <ArrowLeft className="w-4 h-4" /> {t('adm_back')}
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200">
            {t('med_badge')}
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
            {t('med_title')}
          </h1>
          <p className="text-xs text-slate-500">
            {hospital?.name} {t('med_sub')}
          </p>
        </div>

        <div className="text-right">
          <span className="text-xs font-bold text-slate-400 block">{t('common_status')}</span>
          <span className={`text-xs font-extrabold ${isOnline ? 'text-emerald-600' : 'text-amber-600'}`}>
            {isOnline ? t('common_broadcastOnline') : t('common_queueOffline')}
          </span>
        </div>
      </div>

      {saveSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs rounded-2xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{t('med_ok')}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="space-y-4">
          {medicines.map((m) => {
            const isLow = m.reported_quantity <= 5;
            return (
              <div
                key={m.id}
                className={`p-4 rounded-2xl border transition flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs ${
                  isLow ? 'bg-amber-50/60 border-amber-300' : 'bg-slate-50/50 border-slate-200'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-extrabold text-sm text-slate-900">{m.medicine_name}</span>
                    {isLow && (
                      <span className="bg-amber-200 text-amber-900 text-[10px] font-extrabold px-2 py-0.5 rounded">
                        {t('med_low')}
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-slate-500">
                    {t('med_unit')} {m.unit} {t('med_lastUpd')} {new Date(m.reported_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase block">
                    {t('med_stock').replace('{unit}', m.unit)}
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={m.reported_quantity}
                    onChange={(e) => handleQuantityChange(m.id, e.target.value)}
                    className="w-24 px-3 py-1.5 rounded-xl border border-slate-300 font-black text-center text-sm"
                  />
                </div>
              </div>
            );
          })}
        </div>

        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <span className="text-[11px] text-slate-500">
            {t('med_foot')}
          </span>

          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center gap-2 bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow-sm transition"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? t('med_updating') : t('med_save')}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
