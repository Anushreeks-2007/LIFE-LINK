import React from 'react';
import { VoiceAssistantWidget } from '../components/voice/VoiceAssistantWidget';
import { useLanguage } from '../contexts/LanguageContext';
import { Sparkles, Mic, Volume2, ShieldCheck, HelpCircle } from 'lucide-react';

export function VoiceAssistantPage() {
  const { t } = useLanguage();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Title */}
      <div className="text-center max-w-xl mx-auto">
        <div className="inline-flex items-center gap-1.5 bg-teal-50 border border-teal-200 text-teal-800 px-3 py-1 rounded-full text-xs font-bold mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Multilingual Emergency Voice Navigation</span>
        </div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          {t('featVoiceTitle')}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-2">
          Speak in your native language to instantly discover trauma centers, verified ICU beds, and emergency medicine supplies hands-free.
        </p>
      </div>

      {/* Main Interactive Voice Widget */}
      <VoiceAssistantWidget standalone />

      {/* Multilingual Voice Guidelines */}
      <div className="bg-slate-50 border border-slate-200/80 rounded-3xl p-6 sm:p-8 space-y-4">
        <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-teal-600" />
          Supported Voice Commands Across Languages
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          {/* English */}
          <div className="p-4 bg-white rounded-2xl border border-slate-200 space-y-2">
            <span className="font-extrabold text-teal-800 block text-xs uppercase tracking-wider">
              English Commands
            </span>
            <ul className="space-y-1.5 text-slate-600 font-medium">
              <li>• "Find nearby hospital with ICU bed"</li>
              <li>• "Find emergency trauma center"</li>
              <li>• "Hospital with anti-venom medicine"</li>
              <li>• "Cardiac emergency center"</li>
            </ul>
          </div>

          {/* Kannada */}
          <div className="p-4 bg-white rounded-2xl border border-slate-200 space-y-2">
            <span className="font-extrabold text-teal-800 block text-xs uppercase tracking-wider">
              ಕನ್ನಡ (Kannada)
            </span>
            <ul className="space-y-1.5 text-slate-600 font-medium">
              <li>• "ಹತ್ತಿರದ ಆಸ್ಪತ್ರೆಯನ್ನು ಹುಡುಕಿ"</li>
              <li>• "ಐಸಿಯು ಹಾಸಿಗೆ ಲಭ್ಯತೆ ಎಲ್ಲಿದೆ?"</li>
              <li>• "24/7 ತುರ್ತು ಚಿಕಿತ್ಸಾ ಆಸ್ಪತ್ರೆ"</li>
              <li>• "ಹಾವು ಕಡಿತದ ಔಷಧ ಹೊಂದಿರುವ ಆಸ್ಪತ್ರೆ"</li>
            </ul>
          </div>

          {/* Hindi */}
          <div className="p-4 bg-white rounded-2xl border border-slate-200 space-y-2">
            <span className="font-extrabold text-teal-800 block text-xs uppercase tracking-wider">
              हिन्दी (Hindi)
            </span>
            <ul className="space-y-1.5 text-slate-600 font-medium">
              <li>• "मेरे पास एक अस्पताल खोजें"</li>
              <li>• "उपलब्ध आईसीयू बेड वाला अस्पताल"</li>
              <li>• "इमरजेंसी ट्रॉमा सेंटर कहां है?"</li>
              <li>• "सांप के काटने की दवा वाला अस्पताल"</li>
            </ul>
          </div>
        </div>

        <div className="pt-2 text-[11px] text-slate-500 flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-teal-600 shrink-0" />
          <span>Voice recognition operates using deterministic local matching. Audio data is processed in-browser.</span>
        </div>
      </div>
    </div>
  );
}
