
export function OfflineStatusPage() {
  const { isOnline, simulateOffline, toggleSimulatedOffline, pendingQueueCount, lastSyncTime, triggerSync, syncStatus } = useOffline();
  const { t } = useLanguage();

  if (isOnline) return null;

  const isSyncing = syncStatus === 'syncing';

  return (
    <div
      role="status"
      aria-live="polite"
      className="bg-amber-500 text-slate-950 px-4 py-2 border-b border-amber-600 shadow-sm offline-banner-pattern"
    >
      {/* ... */}
      <WifiOff className="w-4 h-4" aria-hidden="true" />
      {/* ... */}
      <button
        type="button"
        onClick={triggerSync}
        disabled={isSyncing}
        className="inline-flex items-center gap-1 bg-slate-950 hover:bg-slate-800 disabled:opacity-60 disabled:cursor-not-allowed text-white px-2.5 py-1 rounded font-semibold text-xs transition"
      >
        <RefreshCw className={`w-3 h-3 ${isSyncing ? 'animate-spin' : ''}`} aria-hidden="true" />
        {isSyncing ? t('offline.retrying') : t('offline.retry')}
      </button>
    </div>
  );
}