import React from 'react';
import { Link } from 'react-router-dom';
import { Activity, ShieldCheck, Heart, PhoneCall, Wifi, Lock } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center text-white">
                <Activity className="w-5 h-5 stroke-[2.5]" />
              </div>
              <span className="font-extrabold text-base text-white tracking-tight">
                LIFE-LINK
              </span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              Connecting Lives, Saving Time. Offline-first emergency healthcare coordination platform.
            </p>
            <div className="flex items-center gap-2 pt-1 text-[11px] text-teal-400">
              <Wifi className="w-3.5 h-3.5" />
              <span>Offline-First Progressive Web App</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-2">
            <h4 className="text-white font-bold uppercase tracking-wider text-[11px]">
              Emergency Care
            </h4>
            <ul className="space-y-1.5">
              <li>
                <Link to="/emergency" className="text-rose-400 hover:text-rose-300 font-semibold flex items-center gap-1">
                  <PhoneCall className="w-3 h-3" /> Emergency Assistance (112/108)
                </Link>
              </li>
              <li>
                <Link to="/hospitals" className="hover:text-white transition">
                  {t('navHospitals')}
                </Link>
              </li>
              <li>
                <Link to="/map" className="hover:text-white transition">
                  {t('navMap')}
                </Link>
              </li>
              <li>
                <Link to="/voice-assistant" className="hover:text-white transition">
                  {t('navVoice')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Clinical Workflows */}
          <div className="space-y-2">
            <h4 className="text-white font-bold uppercase tracking-wider text-[11px]">
              Clinical Workflows
            </h4>
            <ul className="space-y-1.5">
              <li>
                <Link to="/staff/scan" className="hover:text-white transition">
                  Scan Patient QR Token
                </Link>
              </li>
              <li>
                <Link to="/staff/unidentified-patient" className="hover:text-white transition">
                  Register Unconscious Intake
                </Link>
              </li>
              <li>
                <Link to="/admin" className="hover:text-white transition">
                  Hospital Bed & Medicine Admin
                </Link>
              </li>
              <li>
                <Link to="/offline-status" className="hover:text-white transition">
                  Offline Sync & Cached Records
                </Link>
              </li>
            </ul>
          </div>

          {/* Privacy & Disclaimer */}
          <div className="space-y-2">
            <h4 className="text-white font-bold uppercase tracking-wider text-[11px] flex items-center gap-1">
              <Lock className="w-3.5 h-3.5 text-teal-400" /> Privacy & Disclaimer
            </h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              LIFE-LINK complements rather than replaces professional emergency services. In acute life-threatening emergencies, contact government ambulance services (108 / 112) immediately.
            </p>
            <div className="pt-1">
              <Link to="/privacy-help" className="text-teal-400 hover:underline text-[11px]">
                Read Security & Privacy Charter →
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-500 text-[11px]">
          <p>© {new Date().getFullYear()} LIFE-LINK Emergency Platform. Demonstration Prototype.</p>
          <div className="flex items-center gap-4">
            <Link to="/privacy-help" className="hover:text-slate-300">Privacy Policy</Link>
            <Link to="/settings" className="hover:text-slate-300">Language & Settings</Link>
            <Link to="/offline-status" className="hover:text-slate-300">Offline Diagnostics</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
