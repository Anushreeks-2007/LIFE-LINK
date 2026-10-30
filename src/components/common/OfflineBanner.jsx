import React from 'react';
import { useOffline } from '../../contexts/OfflineContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { WifiOff, AlertTriangle, RefreshCw } from 'lucide-react';
import { formatRelativeTime } from '../../utils/formatters';

export function OfflineBanner() {
  const { isOnline, simulateOffline, toggleSimulatedOffline, pendingQueueCount, lastSyncTime, triggerSync, syncStatus } = useOffline();
  const { t } = useLanguage();

  if (isOnline) return null;

  return (
    <div className="bg-amber-500 text-slate-950 px-4 py-2 border-b border-amber-600 shadow-sm offline-banner-pattern">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="p-1 bg-amber-600 text-white rounded-full">
            <WifiOff className="w-4 h-4" />
          </span>
          <div>
            <span className="font-bold uppercase tracking-wide">
              {simulateOffline ? 'Simulated Offline Mode' : 'Network Offline'}
            </span>
            <span className="mx-2 hidden sm:inline">•</span>
            <span className="text-slate-900 font-medium">
              Accessing locally cached hospitals & emergency guides. Remote notifications & live sync require connectivity.
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {lastSyncTime && (
            <span className="text-slate-800 text-[11px] hidden md:inline">
              Last synced: {formatRelativeTime(lastSyncTime)}
            </span>
          )}

          {pendingQueueCount > 0 && (
            <span className="bg-slate-950 text-amber-300 px-2 py-0.5 rounded font-bold text-[11px]">
              {pendingQueueCount} Pending Update{pendingQueueCount > 1 ? 's' : ''}
            </span>
          )}

          {simulateOffline ? (
            <button
              type="button"
              onClick={toggleSimulatedOffline}
              className="bg-slate-950 hover:bg-slate-800 text-white px-2.5 py-1 rounded font-semibold text-xs transition"
            >
              Resume Online
            </button>
          ) : (
            <button
              type="button"
              onClick={triggerSync}
              disabled={syncStatus === 'syncing'}
              className="inline-flex items-center gap-1 bg-slate-950 hover:bg-slate-800 text-white px-2.5 py-1 rounded font-semibold text-xs transition"
            >
              <RefreshCw className={`w-3 h-3 ${syncStatus === 'syncing' ? 'animate-spin' : ''}`} />
              Retry Connection
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
