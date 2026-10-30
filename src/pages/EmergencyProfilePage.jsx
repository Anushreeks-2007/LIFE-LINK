import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { dbGetProfileById, dbSaveProfile } from '../services/db';
import { SYNTHETIC_REGISTERED_PROFILE } from '../utils/syntheticData';
import {
  User,
  Phone,
  Heart,
  AlertTriangle,
  QrCode,
  Save,
  CheckCircle2,
  ShieldCheck,
  Lock,
  ArrowRight
} from 'lucide-react';

export function EmergencyProfilePage() {
  const { user } = useAuth();

  const [profile, setProfile] = useState({
    name: 'Rahul Sharma',
    age: '32',
    gender: 'Male',
    blood_group: 'O+',
    emergency_contact_name: 'Anjali Sharma',
    emergency_contact_relationship: 'Sister',
    emergency_contact_phone: '+91 98765 43210',
    secondary_contact_name: 'Dr. Arvind Rao',
    secondary_contact_phone: '+91 94480 11223',
    allergies: 'Severe Penicillin Allergy (Anaphylaxis risk)',
    relevant_medical_notes: 'Type 1 Diabetes Mellitus (Uses Insulin glargine 20u daily).',
    organ_donor_consent: true,
  });

  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    dbGetProfileById('prof-demo-001').then((saved) => {
      if (saved) {
        setProfile(saved);
      }
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updated = {
      ...profile,
      id: profile.id || 'prof-demo-001',
      qr_token: profile.qr_token || 'LL-TOKEN-8F492E-SECURE',
      is_revoked: false,
    };
    await dbSaveProfile(updated);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200">
            Emergency Preparedness
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
            Personal Emergency Medical Profile
          </h1>
          <p className="text-xs text-slate-500">
            Information stored here is linked to your secure emergency QR card to protect you in an unconscious emergency.
          </p>
        </div>

        <Link
          to="/profile/qr"
          className="inline-flex items-center gap-1.5 bg-teal-700 hover:bg-teal-800 text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-sm transition"
        >
          <QrCode className="w-4 h-4" />
          <span>View My QR Card</span>
        </Link>
      </div>

      {/* Privacy Guarantee Banner */}
      <div className="bg-teal-50 border border-teal-200 rounded-2xl p-4 text-xs text-teal-900 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-teal-700 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h4 className="font-bold text-sm">Privacy & Access Protection</h4>
          <p className="text-teal-800">
            Your full phone number and home address are NEVER stored openly inside the QR code. Only an unpredictable, revocable reference token is encoded. Authorized healthcare personnel can only retrieve critical triage notes after scanning.
          </p>
        </div>
      </div>

      {/* Profile Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-6">
        {/* Personal Details */}
        <div>
          <h3 className="font-extrabold text-sm text-slate-900 mb-4 flex items-center gap-2">
            <User className="w-4 h-4 text-teal-600" />
            1. Personal Demographics
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="sm:col-span-2">
              <label className="font-bold text-slate-700 block mb-1">Full Legal Name</label>
              <input
                type="text"
                required
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-600"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Blood Group</label>
              <select
                value={profile.blood_group}
                onChange={(e) => setProfile({ ...profile, blood_group: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-600 font-bold"
              >
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="O+">O+</option>
                <option value="O-">O- (Universal Red Cells)</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
              </select>
            </div>
          </div>
        </div>

        {/* Emergency Contacts */}
        <div className="pt-4 border-t border-slate-100">
          <h3 className="font-extrabold text-sm text-slate-900 mb-4 flex items-center gap-2">
            <Phone className="w-4 h-4 text-teal-600" />
            2. Primary Emergency Family Contact
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Contact Name</label>
              <input
                type="text"
                required
                value={profile.emergency_contact_name}
                onChange={(e) => setProfile({ ...profile, emergency_contact_name: e.target.value })}
                placeholder="e.g. Anjali Sharma"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-600"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Relationship</label>
              <input
                type="text"
                required
                value={profile.emergency_contact_relationship}
                onChange={(e) => setProfile({ ...profile, emergency_contact_relationship: e.target.value })}
                placeholder="Sister, Spouse, Parent"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-600"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Mobile Phone (With Country Code)</label>
              <input
                type="tel"
                required
                value={profile.emergency_contact_phone}
                onChange={(e) => setProfile({ ...profile, emergency_contact_phone: e.target.value })}
                placeholder="+91 98765 43210"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-600"
              />
            </div>
          </div>
        </div>

        {/* Clinical Allergies & Conditions */}
        <div className="pt-4 border-t border-slate-100">
          <h3 className="font-extrabold text-sm text-slate-900 mb-4 flex items-center gap-2">
            <Heart className="w-4 h-4 text-rose-600" />
            3. Critical Medical Alert & Allergies
          </h3>
          <div className="space-y-4 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Known Severe Drug or Food Allergies
              </label>
              <input
                type="text"
                value={profile.allergies}
                onChange={(e) => setProfile({ ...profile, allergies: e.target.value })}
                placeholder="e.g. Severe Penicillin anaphylaxis, Sulfa drugs, Peanuts"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-600"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">
                Relevant Medical History / Chronic Conditions
              </label>
              <textarea
                rows={3}
                value={profile.relevant_medical_notes}
                onChange={(e) => setProfile({ ...profile, relevant_medical_notes: e.target.value })}
                placeholder="e.g. Type 1 Diabetes on daily insulin, Asthma, Epilepsy, Pacemaker implant"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-600"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="organDonor"
                checked={profile.organ_donor_consent}
                onChange={(e) => setProfile({ ...profile, organ_donor_consent: e.target.checked })}
                className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500"
              />
              <label htmlFor="organDonor" className="font-semibold text-slate-800">
                I voluntarily declare my pledge as an Organ & Tissue Donor in emergency scenarios.
              </label>
            </div>
          </div>
        </div>

        {saveSuccess && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs rounded-xl flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Emergency Profile and QR token updated successfully.</span>
          </div>
        )}

        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <button
            type="submit"
            className="inline-flex items-center gap-2 bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow-sm transition"
          >
            <Save className="w-4 h-4" /> Save Profile
          </button>

          <Link
            to="/profile/qr"
            className="text-xs font-bold text-teal-700 hover:underline flex items-center gap-1"
          >
            Proceed to QR Code Card <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </form>
    </div>
  );
}
