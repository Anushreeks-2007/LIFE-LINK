import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useNavigate, Link } from 'react-router-dom';
import {
  registerUnidentifiedPatient,
  generateTemporaryPatientId
} from '../services/emergencyPatientService';
import { dbGetHospitals } from '../services/db';
import { useAuth } from '../contexts/AuthContext';
import { useOffline } from '../contexts/OfflineContext';
import {
  ShieldAlert,
  AlertTriangle,
  Clock,
  MapPin,
  Stethoscope,
  Save,
  ArrowLeft
} from 'lucide-react';

const EMPTY_FORM = {
  foundLocation: '',
  estimatedAge: '',
  apparentGender: '',
  triageColor: '',
  emergencyObservations: '',
  currentHospitalId: '',
  reportedBy: '',
};

export function UnidentifiedPatientPage() {
  const { t } = useLanguage(); // <-- was missing
  const { user } = useAuth();
  const { isOnline } = useOffline();
  const navigate = useNavigate();

  const [hospitals, setHospitals] = useState([]);
  const [temporaryId, setTemporaryId] = useState('');
  const [formData, setFormData] = useState(EMPTY_FORM); // all empty
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Generic handler: works for every input via its "name"
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    setTemporaryId(generateTemporaryPatientId());
    dbGetHospitals().then((list) => setHospitals(list || [])); // no auto-select
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const created = await registerUnidentifiedPatient({
        ...formData,
        isOffline: !isOnline,
      });
      navigate(`/patients/${created.id}`);
    } catch (err) {
      console.error('Failed to register unidentified patient:', err);
      alert(t('unid_fail') + err.message);
      setIsSubmitting(false);
    }
  };

  const inputCls =
    'w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-600';

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <Link
        to="/staff/scan"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 transition"
      >
        <ArrowLeft className="w-4 h-4" /> {t('unid_back')}
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200">
            {t('unid_badge')}
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
            {t('unid_title')}
          </h1>
          <p className="text-xs text-slate-500">{t('unid_sub')}</p>
        </div>

        <div className="text-right bg-slate-900 text-white p-3 rounded-2xl shrink-0">
          <span className="text-[10px] text-teal-300 font-bold uppercase block tracking-wider">
            {t('unid_tempId')}
          </span>
          <span className="font-mono font-black text-base sm:text-lg text-emerald-400">
            {temporaryId}
          </span>
        </div>
      </div>

      {!isOnline && (
        <div className="bg-amber-50 border border-amber-300 rounded-2xl p-4 text-xs text-amber-900 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-sm">{t('unid_offTitle')}</h4>
            <p className="mt-0.5">
              {t('unid_off1')} <strong>{temporaryId}</strong> {t('unid_off2')}
            </p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-6">
        {/* Triage & Location */}
        <div>
          <h3 className="font-extrabold text-sm text-slate-900 mb-4 flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-rose-600" />
            {t('unid_s1')}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1">{t('unid_urg')}</label>
              <select
                name="triageColor"
                required
                value={formData.triageColor}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-bold focus:ring-2 focus:ring-teal-600"
              >
                <option value="" disabled>-- Select --</option>
                <option value="RED (Immediate / Critical)">{t('unid_red')}</option>
                <option value="YELLOW (Urgent)">{t('unid_yel')}</option>
                <option value="GREEN (Delayed)">{t('unid_grn')}</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">{t('unid_loc')}</label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  name="foundLocation"
                  required
                  value={formData.foundLocation}
                  onChange={handleChange}
                  placeholder={t('unid_phLoc')}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-600"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Physical traits */}
        <div className="pt-4 border-t border-slate-100">
          <h3 className="font-extrabold text-sm text-slate-900 mb-4 flex items-center gap-2">
            <Stethoscope className="w-4 h-4 text-teal-600" />
            {t('unid_s2')}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1">{t('unid_age')}</label>
              <input
                type="text"
                name="estimatedAge"
                required
                value={formData.estimatedAge}
                onChange={handleChange}
                placeholder={t('unid_phAge')}
                className={inputCls}
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">{t('unid_gender')}</label>
              <select
                name="apparentGender"
                required
                value={formData.apparentGender}
                onChange={handleChange}
                className={inputCls}
              >
                <option value="" disabled>-- Select --</option>
                <option value="Male">{t('unid_male')}</option>
                <option value="Female">{t('unid_female')}</option>
                <option value="Other / Unknown">{t('unid_other')}</option>
              </select>
            </div>
          </div>
        </div>

        {/* Clinical observations */}
        <div className="pt-4 border-t border-slate-100">
          <h3 className="font-extrabold text-sm text-slate-900 mb-4 flex items-center gap-2">
            <Clock className="w-4 h-4 text-teal-600" />
            {t('unid_s3')}
          </h3>

          <div className="space-y-4 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1">{t('unid_obs')}</label>
              <textarea
                rows={4}
                name="emergencyObservations"
                required
                value={formData.emergencyObservations}
                onChange={handleChange}
                placeholder={t('unid_phObs')}
                className={inputCls}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-bold text-slate-700 block mb-1">{t('unid_recv')}</label>
                <select
                  name="currentHospitalId"
                  required
                  value={formData.currentHospitalId}
                  onChange={handleChange}
                  className={inputCls + ' font-bold'}
                >
                  <option value="" disabled>-- Select hospital --</option>
                  {hospitals.map((h) => (
                    <option key={h.id} value={h.id}>{h.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">{t('unid_officer')}</label>
                <input
                  type="text"
                  name="reportedBy"
                  required
                  value={formData.reportedBy}
                  onChange={handleChange}
                  placeholder="Enter reporting officer name"
                  className={inputCls}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <span className="text-[11px] text-slate-500">{t('unid_foot')}</span>

          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 bg-rose-600 hover:bg-rose-700 disabled:opacity-60 text-white font-bold text-xs px-6 py-3 rounded-xl shadow-md shadow-rose-600/30 transition"
          >
            <Save className="w-4 h-4" />
            <span>{isSubmitting ? t('unid_registering') : t('unid_create')}</span>
          </button>
        </div>
      </form>
    </div>
  );
}