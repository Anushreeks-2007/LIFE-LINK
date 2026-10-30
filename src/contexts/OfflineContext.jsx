import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { dbGetSyncQueue } from '../services/db';
import { processSyncQueue } from '../services/syncService';

const OfflineContext = createContext(null);

export function OfflineProvider({ children }) {
  const [browserOnline, setBrowserOnline] = useState(() => navigator.onLine);
  const [simulateOffline, setSimulateOffline] = useState(false);
  const [syncStatus, setSyncStatus] = useState('idle'); // 'idle' | 'syncing' | 'synced' | 'error'
  const [pendingQueueCount, setPendingQueueCount] = useState(0);
  const [lastSyncTime, setLastSyncTime] = useState(null);

  const effectiveOnline = browserOnline && !simulateOffline;

  const refreshQueueCount = useCallback(async () => {
    try {
      const queue = await dbGetSyncQueue();
      setPendingQueueCount(queue.length);
    } catch {
      setPendingQueueCount(0);
    }
  }, []);

  const triggerSync = useCallback(async () => {
    if (!effectiveOnline) {
      console.warn('[Offline Engine] Cannot sync while offline.');
      return;
    }
    setSyncStatus('syncing');
    try {
      const res = await processSyncQueue();
      await refreshQueueCount();
      if (res.success) {
        setSyncStatus('synced');
        setLastSyncTime(new Date().toISOString());
        setTimeout(() => setSyncStatus('idle'), 3000);
      } else {
        setSyncStatus('error');
      }
    } catch (err) {
      console.error('Sync failed:', err);
      setSyncStatus('error');
    }
  }, [effectiveOnline, refreshQueueCount]);

  // Online / offline event listeners
  useEffect(() => {
    const handleOnline = () => {
      setBrowserOnline(true);
      if (!simulateOffline) {
        triggerSync();
      }
    };
    const handleOffline = () => {
      setBrowserOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    refreshQueueCount();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [simulateOffline, triggerSync, refreshQueueCount]);

  const toggleSimulatedOffline = () => {
    setSimulateOffline((prev) => {
      const next = !prev;
      if (!next && browserOnline) {
        // Just returned online
        setTimeout(() => triggerSync(), 500);
      }
      return next;
    });
  };

  return (
    <OfflineContext.Provider
      value={{
        isOnline: effectiveOnline,
        browserOnline,
        simulateOffline,
        toggleSimulatedOffline,
        syncStatus,
        pendingQueueCount,
        lastSyncTime,
        triggerSync,
        refreshQueueCount,
      }}
    >
      {children}
    </OfflineContext.Provider>
  );
}

export function useOffline() {
  const context = useContext(OfflineContext);
  if (!context) {
    throw new Error('useOffline must be used within an OfflineProvider');
  }
  return context;
}
