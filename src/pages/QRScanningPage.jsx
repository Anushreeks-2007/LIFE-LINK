import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { resolveQRProfileToken } from '../services/emergencyPatientService';
import { useAuth, ROLES } from '../contexts/AuthContext';
import {
  QrCode,
  Camera,
  AlertCircle,
  CheckCircle2,
  UserCheck,
  Stethoscope,
  ArrowRight,
  ShieldAlert,
  UserPlus,
  RefreshCw,
  Search
} from 'lucide-react';

export function QRScanningPage() {
  const { role, user } = useAuth();
  const navigate = useNavigate();

  const [inputToken, setInputToken] = useState('');
  const [resolvedProfile, setResolvedProfile] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const handleResolveToken = async (tokenToTest) => {
    const cleanToken = (tokenToTest || inputToken).trim();
    if (!cleanToken) return;

    setErrorMessage(null);
    setResolvedProfile(null);
    setIsScanning(true);

    try {
      const profile = await resolveQRProfileToken(cleanToken);
      setResolvedProfile(profile);
    } catch (err) {
      setErrorMessage(err.message || 'Unrecognized QR token reference.');
    } finally {
      setIsScanning(false);
    }
  };

  const handleSimulateDemoScan = () => {
    setInputToken('LL-TOKEN-8F492E-SECURE');
    handleResolveToken('LL-TOKEN-8F492E-SECURE');
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
            Emergency Staff Terminal
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
            Emergency Patient QR Scanner
          </h1>
          <p className="text-xs text-slate-500">
            Authorized scanner for decoding patient emergency tokens during clinical intake.
          </p>
        </div>

        <Link
          to="/staff/unidentified-patient"
          className="inline-flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white px-3.5 py-2 rounded-xl text-xs font-bold transition shadow-sm shrink-0"
        >
          <UserPlus className="w-4 h-4" />
          <span>Unidentified Intake</span>
        </Link>
      </div>

      {/* Staff Permission Badge */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 text-xs text-slate-700 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Stethoscope className="w-4 h-4 text-emerald-600" />
          <span>
            Operator: <strong>{user?.displayName || 'Authorized Emergency Officer'}</strong>
          </span>
        </div>
        <span className="text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
          Authorized Terminal
        </span>
      </div>

      {/* Scanner Box */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-6">
        {/* Video / Camera Scanner Viewport Mockup */}
        <div className="relative aspect-video rounded-2xl bg-slate-950 flex flex-col items-center justify-center text-white overflow-hidden border-2 border-dashed border-teal-500/50">
          <div className="w-48 h-48 border-2 border-emerald-400 rounded-2xl relative flex items-center justify-center animate-pulse">
            <div className="absolute inset-x-0 top-1/2 h-0.5 bg-emerald-400 shadow-[0_0_12px_#34d399]" />
            <Camera className="w-12 h-12 text-slate-600" />
          </div>

          <p className="text-xs text-slate-400 mt-3 font-medium">
            Point camera at patient's printed or lockscreen QR card
          </p>

          {/* Quick Demo Simulator Button */}
          <button
            type="button"
            onClick={handleSimulateDemoScan}
            className="mt-3 bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs px-4 py-2 rounded-xl shadow-md transition"
          >
            Simulate Scan (Demo Token: LL-TOKEN-8F492E-SECURE)
          </button>
        </div>

        {/* Manual Token Fallback */}
        <div className="pt-2">
          <label className="text-xs font-bold text-slate-700 block mb-1">
            Manual Token Entry / Barcode Scanner Input
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={inputToken}
              onChange={(e) => setInputToken(e.target.value)}
              placeholder="e.g. LL-TOKEN-8F492E-SECURE"
              className="flex-1 px-4 py-2 text-xs rounded-xl border border-slate-300 font-mono focus:ring-2 focus:ring-teal-600"
            />
            <button
              type="button"
              onClick={() => handleResolveToken()}
              disabled={isScanning}
              className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
            >
              {isScanning ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Search className="w-3.5 h-3.5" />}
              Decode
            </button>
          </div>
        </div>

        {/* Error Feedback */}
        {errorMessage && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Resolved Patient Profile Result */}
        {resolvedProfile && (
          <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-5 space-y-4 animate-in slide-in-from-bottom duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-emerald-200">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-700" />
                <h3 className="font-extrabold text-sm text-emerald-950">
                  Verified Identity Retrieved
                </h3>
              </div>
              <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded">
                Active Profile
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-[10px] text-emerald-800 font-bold block uppercase">Patient Name</span>
                <span className="text-base font-black text-slate-900">{resolvedProfile.name}</span>
              </div>
              <div>
                <span className="text-[10px] text-emerald-800 font-bold block uppercase">Blood Group</span>
                <span className="text-base font-black text-rose-600">{resolvedProfile.blood_group}</span>
              </div>
              <div>
                <span className="text-[10px] text-emerald-800 font-bold block uppercase">Emergency Contact</span>
                <span className="font-bold text-slate-800">
                  {resolvedProfile.emergency_contact_name} ({resolvedProfile.emergency_contact_relationship})
                </span>
                <span className="block text-slate-600 font-mono text-[11px]">
                  {resolvedProfile.emergency_contact_phone}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-emerald-800 font-bold block uppercase">Secondary Contact</span>
                <span className="font-bold text-slate-800">{resolvedProfile.secondary_contact_name}</span>
                <span className="block text-slate-600 font-mono text-[11px]">{resolvedProfile.secondary_contact_phone}</span>
              </div>
            </div>

            {resolvedProfile.allergies && (
              <div className="p-3 bg-rose-100/80 border border-rose-300 rounded-xl text-xs text-rose-950">
                <span className="font-black uppercase text-[10px] block text-rose-800">CRITICAL ALLERGY WARNING</span>
                <p className="font-bold mt-0.5">{resolvedProfile.allergies}</p>
              </div>
            )}

            {resolvedProfile.relevant_medical_notes && (
              <div className="p-3 bg-white/80 border border-emerald-200 rounded-xl text-xs text-slate-800">
                <span className="font-bold text-[10px] text-slate-500 uppercase block">Medical Conditions</span>
                <p className="font-medium mt-0.5">{resolvedProfile.relevant_medical_notes}</p>
              </div>
            )}

            <div className="pt-2 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => navigate('/staff/unidentified-patient')}
                className="inline-flex items-center gap-1.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs px-4 py-2 rounded-xl transition"
              >
                <UserCheck className="w-4 h-4" /> Link to Incident Intake
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
