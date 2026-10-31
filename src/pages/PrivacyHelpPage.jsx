import React from 'react';
import { ShieldCheck, Lock, AlertTriangle, EyeOff, FileText, HeartPulse, HelpCircle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export function PrivacyHelpPage() {
  const { t } = useLanguage();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200">
          {t('priv_badge')}
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
          {t('navPrivacy')}
        </h1>
        <p className="text-xs text-slate-500">
          {t('priv_sub')}
        </p>
      </div>

      {/* Official Emergency Disclaimer */}
      <div className="bg-rose-50 border border-rose-200 rounded-3xl p-6 sm:p-8 space-y-3">
        <div className="flex items-center gap-2 text-rose-800 font-extrabold text-sm">
          <HeartPulse className="w-5 h-5 text-rose-600" />
          <span>{t('priv_discTitle')}</span>
        </div>
        <p className="text-xs sm:text-sm text-rose-950 font-medium leading-relaxed">
          {t('priv_disc')}
        </p>
      </div>

      {/* Privacy Architecture Pillars */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-6">
        <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-teal-600" />
          {t('priv_arch')}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
            <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
              <EyeOff className="w-4 h-4 text-teal-600" />
              {t('priv_1t')}
            </h3>
            <p className="text-slate-600 leading-relaxed font-normal">
              {t('priv_1')}
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
            <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
              <Lock className="w-4 h-4 text-teal-600" />
              {t('priv_2t')}
            </h3>
            <p className="text-slate-600 leading-relaxed font-normal">
              {t('priv_2')}
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
            <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
              <FileText className="w-4 h-4 text-teal-600" />
              {t('priv_3t')}
            </h3>
            <p className="text-slate-600 leading-relaxed font-normal">
              {t('priv_3')}
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
            <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              {t('priv_4t')}
            </h3>
            <p className="text-slate-600 leading-relaxed font-normal">
              {t('priv_4')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
