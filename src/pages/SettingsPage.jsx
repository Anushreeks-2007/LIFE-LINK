import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth, ROLES } from '../contexts/AuthContext';
import { LanguageSelector } from '../components/common/LanguageSelector';
import {
  Settings,
  Globe,
  User,
  Building2,
  Stethoscope,
  Volume2,
  Database,
  Smartphone,
  CheckCircle2
} from 'lucide-react';

export function SettingsPage() {
  const { language, setLanguage, t } = useLanguage();
  const { role, switchDemoRole } = useAuth();

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200">
          Application Preferences
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
          {t('navSettings')}
        </h1>
        <p className="text-xs text-slate-500">
          Configure preferred language, speech settings, and role demonstration modes.
        </p>
      </div>

      {/* Language Section */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-4">
        <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
          <Globe className="w-4 h-4 text-teal-600" />
          Preferred Interface Language
        </h3>
        <p className="text-xs text-slate-500">
          Changes all interface labels, emergency warnings, voice prompts, and button actions.
        </p>
        <LanguageSelector variant="pills" />
      </div>

      {/* Demonstration Role Switcher */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-4">
        <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
          <User className="w-4 h-4 text-teal-600" />
          Active Testing Role (Demonstration Mode)
        </h3>
        <p className="text-xs text-slate-500">
          Switch between stakeholder perspectives to test authorized workflows.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            type="button"
            onClick={() => switchDemoRole(ROLES.PUBLIC)}
            className={`p-4 rounded-2xl border text-left transition ${
              role === ROLES.PUBLIC
                ? 'bg-teal-50 border-teal-500 shadow-sm'
                : 'border-slate-200 hover:bg-slate-50'
            }`}
          >
            <User className="w-5 h-5 text-teal-600 mb-2" />
            <span className="font-extrabold text-xs text-slate-900 block">Public Citizen</span>
            <span className="text-[11px] text-slate-500">View hospitals & own profile</span>
          </button>

          <button
            type="button"
            onClick={() => switchDemoRole(ROLES.HEALTHCARE_STAFF)}
            className={`p-4 rounded-2xl border text-left transition ${
              role === ROLES.HEALTHCARE_STAFF
                ? 'bg-emerald-50 border-emerald-500 shadow-sm'
                : 'border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Stethoscope className="w-5 h-5 text-emerald-600 mb-2" />
            <span className="font-extrabold text-xs text-slate-900 block">Emergency Staff</span>
            <span className="text-[11px] text-slate-500">QR scanner & patient intake</span>
          </button>

          <button
            type="button"
            onClick={() => switchDemoRole(ROLES.HOSPITAL_ADMIN)}
            className={`p-4 rounded-2xl border text-left transition ${
              role === ROLES.HOSPITAL_ADMIN
                ? 'bg-sky-50 border-sky-500 shadow-sm'
                : 'border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Building2 className="w-5 h-5 text-sky-600 mb-2" />
            <span className="font-extrabold text-xs text-slate-900 block">Hospital Admin</span>
            <span className="text-[11px] text-slate-500">Manage beds & medicines</span>
          </button>
        </div>
      </div>

      {/* PWA & Mobile Installation */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-3">
        <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
          <Smartphone className="w-4 h-4 text-teal-600" />
          Progressive Web App (PWA) Offline Installation
        </h3>
        <p className="text-xs text-slate-600 leading-relaxed">
          LIFE-LINK complies with W3C PWA standards. On mobile devices (Android / iOS Safari), tap <strong>"Add to Home Screen"</strong> from browser options to install LIFE-LINK as an offline native-like emergency app.
        </p>
      </div>
    </div>
  );
}
