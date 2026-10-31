import React, { useState } from 'react';
import { OFFLINE_FIRST_AID_GUIDES } from '../../utils/syntheticData';
import { ChevronDown, ChevronUp, HeartPulse } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

export function FirstAidGuide() {
  const { t, language } = useLanguage();
  const [openGuideId, setOpenGuideId] = useState('fa-1');

  const toggleGuide = (id) => {
    setOpenGuideId((prev) => (prev === id ? null : id));
  };

  const getUrgencyBadge = (urgency) => {
    if (urgency === 'CRITICAL') {
      return (
        <span className="bg-rose-100 text-rose-800 text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-rose-200">
          {t('faCritical')}
        </span>
      );
    }
    return (
      <span className="bg-amber-100 text-amber-800 text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-amber-200">
        {t('faUrgent')}
      </span>
    );
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-2">
        <HeartPulse className="w-5 h-5 text-rose-600" />
        <h3 className="text-base sm:text-lg font-extrabold text-slate-900">{t('faTitle')}</h3>
      </div>
      <p className="text-xs text-slate-500 mb-5 leading-relaxed">{t('faIntro')}</p>

      <div className="space-y-3">
        {OFFLINE_FIRST_AID_GUIDES.map((guide) => {
          const isOpen = openGuideId === guide.id;
          // Optional per-language content: guide.i18n = { kn: { condition, steps }, hi: { ... } }
          const local = guide.i18n?.[language];
          const condition = local?.condition || guide.condition;
          const steps = local?.steps || guide.steps;
          return (
            <div
              key={guide.id}
              className={`rounded-2xl border transition ${
                isOpen ? 'border-teal-300 bg-teal-50/30' : 'border-slate-200 bg-slate-50/50'
              }`}
            >
              <button
                type="button"
                onClick={() => toggleGuide(guide.id)}
                className="w-full text-left p-4 flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-2.5">
                  <span className="font-bold text-sm text-slate-900">{condition}</span>
                  {getUrgencyBadge(guide.urgency)}
                </div>
                {isOpen ? (
                  <ChevronUp className="w-5 h-5 text-slate-400 shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" />
                )}
              </button>

              {isOpen && (
                <div className="px-4 pb-4 pt-1 border-t border-slate-100 text-xs">
                  <ol className="space-y-2 list-decimal list-inside text-slate-700 leading-relaxed font-medium">
                    {steps.map((step, idx) => (
                      <li key={idx} className="pl-1">
                        <span>{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}