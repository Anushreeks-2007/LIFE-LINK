import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Link } from 'react-router-dom';
import { dbGetProfileById, dbSaveProfile } from '../services/db';
import { maskPhoneNumber } from '../utils/formatters';
import {
  QrCode,
  Printer,
  ShieldAlert,
  ShieldCheck,
  RefreshCw,
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  Copy,
  ExternalLink
} from 'lucide-react';
import { syncProfileToCloud } from '../services/emergencyPatientService';
export function QRCodeGenerationPage() {
  const [profile, setProfile] = useState(null);
  const [copied, setCopied] = useState(false);
  const [revokeSuccess, setRevokeSuccess] = useState(false);

    useEffect(() => {
    dbGetProfileById('prof-demo-001').then(async (res) => {
      setProfile(res);
      await syncProfileToCloud(res);
    });
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const handleRevoke = async () => {
    if (!profile) return;
    const confirmRevoke = window.confirm(
      'Are you sure you want to revoke this emergency QR token? Any existing printed cards will become invalid immediately.'
    );
    if (!confirmRevoke) return;

    const newProfile = {
      ...profile,
      qr_token: `LL-TOKEN-${Math.random().toString(36).substring(2, 8).toUpperCase()}-SECURE`,
      is_revoked: false,
      updated_at: new Date().toISOString(),
    };
    await dbSaveProfile(newProfile);
    await syncProfileToCloud(newProfile);
    setProfile(newProfile);
    setRevokeSuccess(true);
    setTimeout(() => setRevokeSuccess(false), 3000);
  };

  const tokenUrl = profile ? `lifelink://verify?token=${profile.qr_token}` : '';

  const copyToken = () => {
    if (profile?.qr_token) {
      navigator.clipboard.writeText(profile.qr_token);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!profile) {
    return (
      <div className="py-20 text-center text-xs font-semibold text-slate-400">
        <RefreshCw className="w-8 h-8 animate-spin mx-auto text-teal-600 mb-2" />
        <p>Loading Emergency QR details...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Back Link */}
      <Link
        to="/profile"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 transition"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Profile Management
      </Link>

      <div className="text-center space-y-1">
        <span className="text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200">
          Emergency ID Card
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Emergency QR Access Token
        </h1>
        <p className="text-xs text-slate-500">
          Print or save this card in your wallet, phone lockscreen, or helmet.
        </p>
      </div>

      {/* Security Statement */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs text-slate-700 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
        <div>
          <h4 className="font-bold text-slate-900">Privacy Safeguard Guarantee</h4>
          <p className="text-slate-600 mt-0.5 leading-relaxed">
            This QR code stores <strong>NO personal health identifiers or raw family phone numbers</strong>. It contains only a secure cryptographic token ({profile.qr_token}) that authorized medical staff decrypt upon authenticated clinical intake.
          </p>
        </div>
      </div>

      {/* Printable Emergency Wallet Card */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-700 relative overflow-hidden">
        {/* Card Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-700/80 mb-6">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-rose-500 animate-pulse" />
            <span className="font-extrabold text-sm uppercase tracking-wider text-teal-300">
              LIFE-LINK EMERGENCY CARD
            </span>
          </div>
          <span className="text-[10px] font-bold bg-slate-800 px-2.5 py-1 rounded-full border border-slate-600 text-slate-300">
            OFFICIAL TOKEN
          </span>
        </div>

        {/* Card Body: QR + Core Demographics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
          {/* QR Code */}
          <div className="bg-white p-4 rounded-2xl flex flex-col items-center justify-center shadow-md">
            <QRCodeSVG
              value={tokenUrl}
              size={160}
              level="H"
              includeMargin={false}
            />
            <span className="text-[10px] font-mono font-bold text-slate-600 mt-2 block tracking-wider">
              {profile.qr_token}
            </span>
          </div>

          {/* Demographics & Critical Alerts */}
          <div className="space-y-3 text-xs">
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Full Name</span>
              <span className="text-base font-black text-white">{profile.name}</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Blood Group</span>
                <span className="text-sm font-black text-rose-400">{profile.blood_group}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Age / Gender</span>
                <span className="font-bold text-slate-200">{profile.age} Yrs • {profile.gender}</span>
              </div>
            </div>

            <div>
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Emergency Contact</span>
              <span className="font-bold text-slate-200">
                {profile.emergency_contact_name} ({profile.emergency_contact_relationship})
              </span>
              <span className="block text-[11px] text-teal-300 font-mono">
                {maskPhoneNumber(profile.emergency_contact_phone)}
              </span>
            </div>

            {profile.allergies && (
              <div className="bg-rose-950/60 border border-rose-800/80 p-2 rounded-xl text-[11px]">
                <span className="text-rose-300 font-extrabold uppercase block text-[9px]">Critical Allergy Alert</span>
                <span className="text-rose-100 font-bold">{profile.allergies}</span>
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-700/80 flex items-center justify-between text-[10px] text-slate-400">
          <span>Scan with LIFE-LINK Emergency Terminal</span>
          <span>Status: Verified Active</span>
        </div>
      </div>

      {revokeSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs rounded-xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>New token generated! Old QR cards have been revoked.</span>
        </div>
      )}

      {/* Action Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition shadow-sm"
          >
            <Printer className="w-4 h-4" /> Print Card
          </button>

          <button
            type="button"
            onClick={copyToken}
            className="inline-flex items-center gap-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs px-3.5 py-2.5 rounded-xl transition shadow-sm"
          >
            <Copy className="w-4 h-4 text-slate-500" />
            <span>{copied ? 'Copied Token!' : 'Copy Token'}</span>
          </button>
        </div>

        <button
          type="button"
          onClick={handleRevoke}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-700 hover:text-rose-800 bg-rose-50 hover:bg-rose-100 border border-rose-200 px-3.5 py-2.5 rounded-xl transition"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Revoke & Regenerate QR
        </button>
      </div>
    </div>
  );
}
