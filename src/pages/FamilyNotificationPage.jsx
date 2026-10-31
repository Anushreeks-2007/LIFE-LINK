import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getEmergencyPatient } from '../services/emergencyPatientService';
import { sendEmergencyFamilyNotification } from '../services/notificationService';
import { dbGetHospitals } from '../services/db';
import { formatDateTime, formatRelativeTime } from '../utils/formatters';
import { useAuth } from '../contexts/AuthContext';
import { useOffline } from '../contexts/OfflineContext';
import {
  Send,
  Phone,
  MessageSquare,
  Users,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ArrowLeft,
  RefreshCw,
  Building2,
  Info
} from 'lucide-react';

export function FamilyNotificationPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isOnline } = useOffline();

  const [patient, setPatient] = useState(null);
  const [hospitals, setHospitals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Form Fields
  const [recipientName, setRecipientName] = useState('');
  const [recipientPhone, setRecipientPhone] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [sendSuccess, setSendSuccess] = useState(false);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const pat = await getEmergencyPatient(id);
      setPatient(pat);
      const hospList = await dbGetHospitals();
      setHospitals(hospList || []);

      // If patient is linked to a registered profile, auto-populate emergency contact
      if (pat?.linked_profile) {
        setRecipientName(pat.linked_profile.emergency_contact_name || '');
        setRecipientPhone(pat.linked_profile.emergency_contact_phone || '');
      } else {
        setRecipientName('Anjali Sharma (Family Contact)');
        setRecipientPhone('+91 98765 43210');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [id]);

  const handleSendNotification = async (e) => {
    e.preventDefault();
    if (!recipientName || !recipientPhone || !patient) return;

    setIsSending(true);
    try {
      const currentHosp = hospitals.find((h) => h.id === patient.current_hospital_id);
      await sendEmergencyFamilyNotification({
        patientId: patient.id,
        recipientName,
        recipientPhone,
        hospitalName: currentHosp?.name || 'Apex Trauma Institute',
        hospitalPhone: currentHosp?.emergency_phone || '+91 80 2234 5099',
        staffName: user?.displayName || 'Paramedic Staff',
        patientIdentifier: patient.temporary_patient_id,
        isOffline: !isOnline,
      });

      setSendSuccess(true);
      await loadData();
      setTimeout(() => setSendSuccess(false), 4000);
    } catch (err) {
      alert(t('fam_fail') + err.message);
    } finally {
      setIsSending(false);
    }
  };

  if (isLoading) {
    return (
      <div className="py-24 text-center text-xs font-semibold text-slate-400">
        <RefreshCw className="w-8 h-8 animate-spin mx-auto text-teal-600 mb-2" />
        <p>{t('fam_loading')}</p>
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
          <span className="text-xs font-bold uppercase tracking-wider text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200">
            {t('fam_badge')}
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
            {t('fam_title')}
          </h1>
          <p className="text-xs text-slate-500">
            {t('fam_sub')}
          </p>
        </div>

        <div className="bg-slate-900 text-white p-3 rounded-2xl shrink-0">
          <span className="text-[10px] text-teal-300 font-bold uppercase block tracking-wider">{t('pat_label')}</span>
          <span className="font-mono font-black text-sm text-emerald-400">{patient.temporary_patient_id}</span>
        </div>
      </div>

      {/* Simulated Disclaimer Banner */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs text-slate-700 flex items-start gap-3">
        <Info className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
        <div>
          <h4 className="font-bold text-slate-900">{t('fam_demoTitle')}</h4>
          <p className="text-slate-600 mt-0.5 leading-relaxed">
            {t('fam_demoText')}
          </p>
        </div>
      </div>

      {/* Dispatch Form */}
      <form onSubmit={handleSendNotification} className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-5">
        <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-rose-600" />
          {t('fam_cDetails')}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="font-bold text-slate-700 block mb-1">
              {t('fam_rName')}
            </label>
            <input
              type="text"
              required
              value={recipientName}
              onChange={(e) => setRecipientName(e.target.value)}
              placeholder={t('fam_phName')}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-600"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">
              {t('fam_rPhone')}
            </label>
            <input
              type="tel"
              required
              value={recipientPhone}
              onChange={(e) => setRecipientPhone(e.target.value)}
              placeholder="+91 98765 43210"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-600"
            />
          </div>
        </div>

        {/* Message Preview */}
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
            {t('fam_preview')}
          </span>
          <p className="font-mono text-slate-800 text-[11px] leading-relaxed">
            [LIFE-LINK EMERGENCY ALERT] Medical emergency notification regarding patient ({patient.temporary_patient_id}). Currently admitted at {currentHospital?.name || 'Apex Trauma'}. Handled by: {user?.displayName || 'Emergency Staff'}. Immediate assistance contact: {currentHospital?.emergency_phone || '+91 80 2234 5099'}.
          </p>
        </div>

        {sendSuccess && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs rounded-xl flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{t('fam_sent')}</span>
          </div>
        )}

        <div className="pt-2 flex items-center justify-between">
          <span className="text-[11px] text-slate-500">
            {isOnline ? t('fam_direct') : t('fam_queued')}
          </span>

          <button
            type="submit"
            disabled={isSending}
            className="inline-flex items-center gap-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow-md shadow-rose-600/20 transition"
          >
            <Send className="w-4 h-4" />
            <span>{isSending ? t('fam_sending') : t('fam_dispatch')}</span>
          </button>
        </div>
      </form>

      {/* Notification History Log */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-4">
        <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
          <Clock className="w-4 h-4 text-teal-600" />
          {t('fam_history')}
        </h3>

        {patient.notification_logs && patient.notification_logs.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 uppercase font-bold text-[10px]">
                  <th className="pb-3">{t('fam_thRec')}</th>
                  <th className="pb-3">{t('fam_thChan')}</th>
                  <th className="pb-3">{t('common_status')}</th>
                  <th className="pb-3">{t('fam_thSender')}</th>
                  <th className="pb-3 text-right">{t('fam_thTime')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {patient.notification_logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/60 transition">
                    <td className="py-3 font-bold text-slate-800">
                      {log.recipient_name} ({log.recipient_phone})
                    </td>
                    <td className="py-3 text-slate-600">{log.channel}</td>
                    <td className="py-3">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        {log.status}
                      </span>
                    </td>
                    <td className="py-3 text-slate-600">{log.dispatched_by}</td>
                    <td className="py-3 text-right text-slate-500">{formatRelativeTime(log.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-xs text-slate-500 italic">{t('fam_none')}</p>
        )}
      </div>
    </div>
  );
}
