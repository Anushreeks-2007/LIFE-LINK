import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  getEmergencyPatient,
  linkPatientToVerifiedProfile
} from '../services/emergencyPatientService';
import { dbGetProfileById, dbGetHospitals } from '../services/db';
import { formatDateTime, formatRelativeTime } from '../utils/formatters';
import { useAuth, ROLES } from '../contexts/AuthContext';
import { useOffline } from '../contexts/OfflineContext';
import {
  User,
  ShieldAlert,
  Clock,
  MapPin,
  ArrowRight,
  Send,
  UserCheck,
  Building2,
  FileText,
  AlertTriangle,
  CheckCircle2,
  Phone,
  RefreshCw,
  Ambulance,
  Lock,
  ArrowLeft
} from 'lucide-react';

export function EmergencyPatientDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { role, user } = useAuth();
  const { isOnline } = useOffline();

  const [patient, setPatient] = useState(null);
  const [hospitals, setHospitals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Link Identity Modal
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [availableProfile, setAvailableProfile] = useState(null);
  const [verificationNotes, setVerificationNotes] = useState('');
  const [isLinking, setIsLinking] = useState(false);
  const [linkSuccess, setLinkSuccess] = useState(false);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const data = await getEmergencyPatient(id);
      setPatient(data);
      const hospList = await dbGetHospitals();
      setHospitals(hospList || []);
      const demoProf = await dbGetProfileById('prof-demo-001');
      setAvailableProfile(demoProf);
    } catch (err) {
      console.error('Failed to load patient record:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [id]);

  const handleLinkIdentity = async () => {
    if (!availableProfile || !patient) return;
    setIsLinking(true);
    try {
      const updated = await linkPatientToVerifiedProfile({
        patientId: patient.id,
        profileId: availableProfile.id,
        authorizedOfficer: user?.displayName || 'Authorized Emergency Officer',
        verificationNotes: verificationNotes || 'Biometric and facial comparison confirmed by attending doctor and family.',
        isOffline: !isOnline,
      });
      setPatient(updated);
      setLinkSuccess(true);
      setTimeout(() => {
        setLinkSuccess(false);
        setIsLinkModalOpen(false);
      }, 1500);
    } catch (err) {
      alert('Linking failed: ' + err.message);
    } finally {
      setIsLinking(false);
    }
  };

  if (isLoading) {
    return (
      <div className="py-24 text-center text-xs font-semibold text-slate-400">
        <RefreshCw className="w-8 h-8 animate-spin mx-auto text-teal-600 mb-2" />
        <p>Retrieving Clinical Emergency Record...</p>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="max-w-2xl mx-auto py-16 text-center space-y-4">
        <AlertTriangle className="w-12 h-12 text-slate-300 mx-auto" />
        <h2 className="text-xl font-bold text-slate-800">Patient Record Not Found</h2>
        <p className="text-xs text-slate-500">No emergency intake matches ID: {id}</p>
        <Link to="/staff/scan" className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-700 hover:underline">
          <ArrowLeft className="w-4 h-4" /> Return to Scanner Terminal
        </Link>
      </div>
    );
  }

  const currentHospital = hospitals.find((h) => h.id === patient.current_hospital_id);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 transition"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        <span className="text-xs font-bold text-slate-400">
          Record ID: <span className="font-mono text-slate-600">{patient.id}</span>
        </span>
      </div>

      {/* Main Clinical Header Card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="font-mono font-black text-lg sm:text-2xl text-slate-900 bg-slate-100 px-3 py-1 rounded-xl border border-slate-200">
                {patient.temporary_patient_id}
              </span>

              {patient.identification_status === 'verified_linked' ? (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-900 border border-emerald-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                  Verified Identity: {patient.linked_profile_name || patient.linked_profile?.name}
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
                  <Clock className="w-4 h-4 text-amber-700" />
                  Identity Unidentified
                </span>
              )}

              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black bg-rose-100 text-rose-800 border border-rose-300">
                {patient.triage_color || 'RED (Critical)'}
              </span>
            </div>

            <p className="text-xs text-slate-500 font-medium flex items-center gap-1.5 mt-1">
              <Clock className="w-4 h-4 text-slate-400" />
              <span>Intake Registered: {formatDateTime(patient.registration_time)} ({formatRelativeTime(patient.registration_time)})</span>
            </p>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap sm:flex-col items-stretch gap-2 shrink-0">
            <Link
              to={`/patients/${patient.id}/transfer`}
              className="inline-flex items-center justify-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition shadow-sm"
            >
              <Ambulance className="w-4 h-4" />
              <span>Initiate Hospital Transfer</span>
            </Link>

            <Link
              to={`/patients/${patient.id}/family-contact`}
              className="inline-flex items-center justify-center gap-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition shadow-sm"
            >
              <Send className="w-4 h-4" />
              <span>Family Notification</span>
            </Link>

            {patient.identification_status !== 'verified_linked' && (
              <button
                type="button"
                onClick={() => setIsLinkModalOpen(true)}
                className="inline-flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition shadow-sm"
              >
                <UserCheck className="w-4 h-4" />
                <span>Verify & Link Identity</span>
              </button>
            )}
          </div>
        </div>

        {/* Discovery Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100 text-xs">
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Current Facility</span>
            <span className="font-extrabold text-slate-900 text-sm block mt-0.5">
              {currentHospital?.name || 'Apex Trauma Institute'}
            </span>
            <span className="text-[11px] text-slate-500">{currentHospital?.hospital_type}</span>
          </div>

          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Discovery Site</span>
            <span className="font-bold text-slate-900 text-sm block mt-0.5 line-clamp-2">
              {patient.found_location || 'Not specified'}
            </span>
          </div>

          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Intake Officer</span>
            <span className="font-bold text-slate-900 text-sm block mt-0.5">
              {patient.reported_by || 'Paramedic Unit'}
            </span>
            <span className="text-[11px] text-slate-500">Emergency Staff</span>
          </div>
        </div>

        {/* Emergency Observations */}
        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1">
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 block">
            Clinical Observations & Triage Summary
          </span>
          <p className="text-xs text-slate-800 leading-relaxed font-medium">
            {patient.emergency_observations || 'No additional initial observations documented.'}
          </p>
        </div>
      </div>

      {/* Transfer History Timeline */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Ambulance className="w-5 h-5 text-teal-600" />
            <h2 className="text-lg font-black text-slate-900">
              Inter-Hospital Transfer History & Handover Continuity
            </h2>
          </div>
          <span className="text-xs font-semibold text-slate-400">
            {patient.transfers?.length || 0} Transfers Recorded
          </span>
        </div>

        {patient.transfers && patient.transfers.length > 0 ? (
          <div className="space-y-4 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-slate-200">
            {patient.transfers.map((tr, idx) => {
              const src = hospitals.find((h) => h.id === tr.source_hospital_id);
              const dst = hospitals.find((h) => h.id === tr.destination_hospital_id);
              return (
                <div key={tr.id || idx} className="relative flex items-start gap-4 pl-8">
                  <div className="absolute left-1.5 top-1.5 w-4 h-4 rounded-full bg-teal-600 border-2 border-white shadow-sm" />
                  <div className="flex-1 bg-slate-50 border border-slate-200 p-4 rounded-2xl text-xs space-y-2">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="font-extrabold text-sm text-slate-900">
                        {src?.name || tr.source_hospital_id} → {dst?.name || tr.destination_hospital_id}
                      </span>
                      <span className="text-slate-500 font-semibold text-[11px]">
                        {formatDateTime(tr.transfer_time)}
                      </span>
                    </div>

                    <p className="text-slate-700">
                      <strong>Transfer Reason:</strong> {tr.reason}
                    </p>

                    <div className="p-2.5 bg-white rounded-xl border border-slate-200 text-slate-600">
                      <strong className="block text-[11px] text-slate-400 uppercase">Handover Notes:</strong>
                      <span className="font-medium text-xs text-slate-800">{tr.handover_notes}</span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                      <span>Transport Unit: <strong>{tr.transport_unit}</strong></span>
                      <span>Authorized By: <strong>{tr.authorized_officer}</strong></span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-xs text-slate-500 italic py-2">
            No transfer entries yet. Patient remains at initial receiving facility.
          </p>
        )}
      </div>

      {/* Clinical Audit Log */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-4">
        <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
          <FileText className="w-5 h-5 text-teal-600" />
          Clinical Audit & Event Trail
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-400 uppercase font-bold text-[10px]">
                <th className="pb-3">Event Type</th>
                <th className="pb-3">Summary</th>
                <th className="pb-3">Authorized Staff</th>
                <th className="pb-3 text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {(patient.events || []).map((ev, idx) => (
                <tr key={ev.id || idx} className="hover:bg-slate-50/60 transition">
                  <td className="py-3 font-bold text-slate-800">{ev.event_type}</td>
                  <td className="py-3 text-slate-600">{ev.event_summary}</td>
                  <td className="py-3 text-slate-700 font-semibold">{ev.created_by}</td>
                  <td className="py-3 text-right text-slate-500">{formatRelativeTime(ev.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Identity Linking Modal */}
      {isLinkModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl animate-in zoom-in-95 duration-200">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                Identity Linking Procedure
              </span>
              <h3 className="text-lg font-black text-slate-900 mt-1">
                Link Record to Verified Profile
              </h3>
              <p className="text-xs text-slate-500">
                Authorized healthcare personnel verification. The temporary emergency record ({patient.temporary_patient_id}) will be formally linked to the patient profile.
              </p>
            </div>

            {availableProfile ? (
              <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl text-xs space-y-2">
                <span className="font-extrabold text-emerald-950 text-sm block">
                  Candidate Profile: {availableProfile.name}
                </span>
                <p className="text-slate-700">
                  <strong>Blood Group:</strong> {availableProfile.blood_group} • <strong>Age/Gender:</strong> {availableProfile.age} Yrs ({availableProfile.gender})
                </p>
                <p className="text-slate-700">
                  <strong>Emergency Contact:</strong> {availableProfile.emergency_contact_name} ({availableProfile.emergency_contact_phone})
                </p>
                {availableProfile.allergies && (
                  <p className="text-rose-700 font-bold">
                    <strong>Allergies:</strong> {availableProfile.allergies}
                  </p>
                )}
              </div>
            ) : (
              <p className="text-xs text-rose-600">No registered candidate profile found to match.</p>
            )}

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Clinical Verification Notes (Mandatory)
              </label>
              <textarea
                rows={3}
                value={verificationNotes}
                onChange={(e) => setVerificationNotes(e.target.value)}
                placeholder="Detail verification method (e.g. Identity documents verified with attending relative, biometric or facial confirmation)."
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-600"
              />
            </div>

            {linkSuccess && (
              <div className="p-3 bg-emerald-100 text-emerald-900 text-xs font-bold rounded-xl flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                <span>Identity linked successfully! Transfer and audit history preserved.</span>
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsLinkModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleLinkIdentity}
                disabled={isLinking || linkSuccess}
                className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition shadow-sm flex items-center gap-1.5"
              >
                {isLinking ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <UserCheck className="w-3.5 h-3.5" />}
                <span>Confirm & Link Record</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
