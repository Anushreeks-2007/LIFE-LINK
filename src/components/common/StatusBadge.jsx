import React from 'react';
import { CheckCircle2, AlertTriangle, XCircle, Clock, ShieldCheck } from 'lucide-react';
import { isTimestampOutdated } from '../../utils/formatters';
import { useLanguage } from '../../contexts/LanguageContext';

export function StatusBadge({ type, label, reportedAt, showIcon = true }) {
  const { t } = useLanguage();
  // If reportedAt timestamp is outdated (>6h), force Outdated appearance
  const outdated = reportedAt ? isTimestampOutdated(reportedAt) : false;

  if (outdated) {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-900 border border-amber-300">
        {showIcon && <Clock className="w-3.5 h-3.5 text-amber-700" />}
        {label || t('sbOutdated')}
      </span>
    );
  }

  switch (type) {
    case 'available':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-900 border border-emerald-300">
          {showIcon && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />}
          {label || t('statusAvailable')}
        </span>
      );
    case 'limited':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-900 border border-yellow-300">
          {showIcon && <AlertTriangle className="w-3.5 h-3.5 text-yellow-700" />}
          {label || t('sbLimited')}
        </span>
      );
    case 'unavailable':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-100 text-rose-900 border border-rose-300">
          {showIcon && <XCircle className="w-3.5 h-3.5 text-rose-700" />}
          {label || t('sbUnavailable')}
        </span>
      );
    case 'verified':
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-teal-100 text-teal-900 border border-teal-300">
          {showIcon && <ShieldCheck className="w-3.5 h-3.5 text-teal-700" />}
          {label || t('sbVerified')}
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-800 border border-slate-300">
          {label || t('sbUnknown')}
        </span>
      );
  }
}