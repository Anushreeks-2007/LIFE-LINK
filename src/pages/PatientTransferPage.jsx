import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getEmergencyPatient, recordPatientTransfer } from '../services/emergencyPatientService';
import { dbGetHospitals } from '../services/db';
import { useAuth } from '../contexts/AuthContext';
import { useOffline } from '../contexts/OfflineContext';
import {
  Ambulance,
  Building2,
  ArrowRight,
  ArrowLeft,
  Clock,
  Save,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  ShieldCheck
} from 'lucide-react';

export function PatientTransferPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isOnline } = useOffline();

  const [patient, setPatient] = useState(null);
  const [hospitals, setHospitals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [formData, setFormData] = useState({
    destinationHospitalId: 'hosp-001',
    reason: 'Urgent Level 1 trauma surgery and specialized neuro-intensive care required.',
    handoverNotes: 'Patient intubated on transport ventilator. 18G IV cannula patent in right antecubital fossa. Normal saline 500ml running at 100ml/hr. Vitals: BP 120/80, HR 84 bpm, SpO2 99%.',
    transportUnit: 'Apex Advanced Life Support Unit 02',
    authorizedOfficer: user?.displayName || 'Dr. Ramesh K. (Emergency CMO)',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    Promise.all([getEmergencyPatient(id), dbGetHospitals()])
      .then(([pat, hospList]) => {
        setPatient(pat);
        setHospitals(hospList || []);
        // Default destination to a different hospital than current
        const alt = hospList.find((h) => h.id !== pat?.current_hospital_id);
        if (alt) {
          setFormData((prev) => ({ ...prev, destinationHospitalId: alt.id }));
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setIsLoading(false));
  }, [id, user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!patient) return;
    setIsSubmitting(true);
    try {
      await recordPatientTransfer({
        patientId: patient.id,
        sourceHospitalId: patient.current_hospital_id,
        destinationHospitalId: formData.destinationHospitalId,
        reason: formData.reason,
        handoverNotes: formData.handoverNotes,
        transportUnit: formData.transportUnit,
        authorizedOfficer: formData.authorizedOfficer,
        isOffline: !isOnline,
      });

      navigate(`/patients/${patient.id}`);
    } catch (err) {
      alert(t('xfer_fail') + err.message);
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="py-24 text-center text-xs font-semibold text-slate-400">
        <RefreshCw className="w-8 h-8 animate-spin mx-auto text-teal-600 mb-2" />
        <p>{t('xfer_loading')}</p>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="max-w-md mx-auto py-16 text-center space-y-4">
        <p className="text-xs text-rose-600">{t('pat_notFoundShort')}</p>
        <Link to="/staff/scan" className="text-xs font-bold text-teal-700 underline">{t('common_return')}</Link>
      </div>
    );
  }

  const currentHospital = hospitals.find((h) => h.id === patient.current_hospital_id);
  const targetHospital = hospitals.find((h) => h.id === formData.destinationHospitalId);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <Link
        to={`/patients/${patient.id}`}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 transition"
      >
        <ArrowLeft className="w-4 h-4" /> {t('pat_backRecord')}
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200">
            {t('xfer_badge')}
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
            {t('xfer_title')}
          </h1>
          <p className="text-xs text-slate-500">
            {t('xfer_sub')}
          </p>
        </div>

        <div className="bg-slate-900 text-white p-3 rounded-2xl shrink-0">
          <span className="text-[10px] text-teal-300 font-bold uppercase block tracking-wider">{t('pat_label')}</span>
          <span className="font-mono font-black text-sm text-emerald-400">{patient.temporary_patient_id}</span>
        </div>
      </div>

      {!isOnline && (
        <div className="bg-amber-50 border border-amber-300 rounded-2xl p-4 text-xs text-amber-900 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-sm">{t('xfer_offTitle')}</h4>
            <p className="mt-0.5">
              {t('xfer_offText')}
            </p>
          </div>
        </div>
      )}

      {/* Transfer Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-6">
        {/* Source and Destination Facilities */}
        <div>
          <h3 className="font-extrabold text-sm text-slate-900 mb-4 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-teal-600" />
            {t('xfer_s1')}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
              <span className="text-[10px] text-slate-400 font-bold uppercase block">{t('xfer_origin')}</span>
              <span className="font-extrabold text-slate-900 text-sm block mt-1">
                {currentHospital?.name || t('xfer_curHosp')}
              </span>
              <span className="text-[11px] text-slate-500">{currentHospital?.address}</span>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">
                {t('xfer_dest')}
              </label>
              <select
                value={formData.destinationHospitalId}
                onChange={(e) => setFormData({ ...formData, destinationHospitalId: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 font-bold focus:ring-2 focus:ring-teal-600"
              >
                {hospitals.map((h) => (
                  <option key={h.id} value={h.id} disabled={h.id === patient.current_hospital_id}>
                    {h.name} {h.id === patient.current_hospital_id ? t('xfer_curFac') : ''}
                  </option>
                ))}
              </select>
              {targetHospital && (
                <p className="text-[11px] text-teal-700 font-medium mt-1">
                  {t('xfer_reportedAvail').replace('{n}', targetHospital.totalAvailableBeds || 0)}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Clinical Handover & Reasons */}
        <div className="pt-4 border-t border-slate-100">
          <h3 className="font-extrabold text-sm text-slate-900 mb-4 flex items-center gap-2">
            <Ambulance className="w-4 h-4 text-teal-600" />
            {t('xfer_s2')}
          </h3>

          <div className="space-y-4 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1">
                {t('xfer_reason')}
              </label>
              <input
                type="text"
                required
                value={formData.reason}
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                placeholder={t('xfer_phReason')}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-600"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">
                {t('xfer_notes')}
              </label>
              <textarea
                rows={4}
                required
                value={formData.handoverNotes}
                onChange={(e) => setFormData({ ...formData, handoverNotes: e.target.value })}
                placeholder={t('xfer_phNotes')}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-600"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  {t('xfer_amb')}
                </label>
                <input
                  type="text"
                  required
                  value={formData.transportUnit}
                  onChange={(e) => setFormData({ ...formData, transportUnit: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-600"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  {t('xfer_auth')}
                </label>
                <input
                  type="text"
                  required
                  value={formData.authorizedOfficer}
                  onChange={(e) => setFormData({ ...formData, authorizedOfficer: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-600"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <span className="text-[11px] text-slate-500">
            {t('xfer_foot')}
          </span>

          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow-sm transition"
          >
            <Save className="w-4 h-4" />
            <span>{isSubmitting ? t('xfer_recording') : t('xfer_confirm')}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
