import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { Globe } from 'lucide-react';

export function LanguageSelector({ variant = 'navbar' }) {
  const { language, setLanguage } = useLanguage();

  const languages = [
    { code: 'en', label: 'English', native: 'English' },
    { code: 'kn', label: 'Kannada', native: 'ಕನ್ನಡ' },
    { code: 'hi', label: 'Hindi', native: 'हिन्दी' },
  ];

  if (variant === 'pills') {
    return (
      <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-lg border border-slate-200">
        {languages.map((lang) => (
          <button
            key={lang.code}
            type="button"
            onClick={() => setLanguage(lang.code)}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition ${
              language === lang.code
                ? 'bg-teal-700 text-white shadow-sm'
                : 'text-slate-700 hover:text-slate-900 hover:bg-slate-200'
            }`}
          >
            {lang.native}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="relative inline-flex items-center">
      <Globe className="w-4 h-4 text-slate-500 absolute left-2 pointer-events-none" />
      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
        aria-label="Select Interface Language"
        className="appearance-none bg-white text-slate-800 text-xs font-semibold pl-7 pr-7 py-1.5 rounded-lg border border-slate-300 hover:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500 transition cursor-pointer"
      >
        <option value="en">English</option>
        <option value="kn">ಕನ್ನಡ (Kannada)</option>
        <option value="hi">हिन्दी (Hindi)</option>
      </select>
    </div>
  );
}
