import React, { useState, useEffect } from 'react';
import { useOffline } from '../contexts/OfflineContext';
import {
  dbGetHospitals,
  dbGetEmergencyPatients,
  dbGetSyncQueue,
  dbResetToDefaults
} from '../services/db';
import { formatDateTime, formatRelativeTime } from '../utils/formatters';
import {
  Wifi,
  WifiOff,
  RefreshCw,
  Database,
  CheckCircle2,
  AlertTriangle,
  Building2,
  User,
  Clock,
  Layers,
  Trash2
} from 'lucide-react';

export function OfflineStatusPage() {
  const {
    isOnline,
    browserOnline,
    simulateOffline,
    toggleSimulatedOffline,
    pendingQueueCount,
    lastSyncTime,
    triggerSync,
    syncStatus,
    refreshQueueCount,
  } = useOffline();

  const [cachedHospitals, setCachedHospitals] = useState([]);
  const [cachedPatients, setCachedPatients] = useState([]);
  const [syncQueue, setSyncQueue] = useState([]);
  const [resetSuccess, setResetSuccess] = useState(false);

  const loadData = async () => {
    try {
      const h = await dbGetHospitals();
      const p = await dbGetEmergencyPatients();
      const q = await dbGetSyncQueue();
      setCachedHospitals(h || []);
      setCachedPatients(p || []);
      setSyncQueue(q || []);
      await refreshQueueCount();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadData();
  }, [pendingQueueCount, syncStatus]);

  const handleResetData = async () => {
    const confirm = window.confirm(
      'Reset all local records back to default synthetic demonstration data?'
    );
    if (!confirm) return;

    await dbResetToDefaults();
    setResetSuccess(true);
    await loadData();
    setTimeout(() => setResetSuccess(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200">
            Resilience Diagnostics
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
            Offline Status & Storage Monitor
          </h1>
          <p className="text-xs text-slate-500">
            Inspect local IndexedDB data caches, queued offline actions, and test offline capabilities.
          </p>
        </div>

        {/* Sync Button */}
        <button
          type="button"
          onClick={triggerSync}
          disabled={!isOnline || syncStatus === 'syncing'}
          className="inline-flex items-center gap-2 bg-teal-700 hover:bg-teal-800 disabled:bg-slate-300 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-sm transition shrink-0"
        >
          <RefreshCw className={`w-4 h-4 ${syncStatus === 'syncing' ? 'animate-spin' : ''}`} />
          <span>{syncStatus === 'syncing' ? 'Syncing...' : 'Trigger Sync Now'}</span>
        </button>
      </div>

      {/* Network State Card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white ${
              isOnline ? 'bg-emerald-600' : 'bg-amber-500'
            }`}>
              {isOnline ? <Wifi className="w-6 h-6" /> : <WifiOff className="w-6 h-6" />}
            </div>
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Effective State</span>
              <h3 className="text-xl font-black text-slate-900">
                {isOnline ? 'Online (Connected)' : 'Offline (Zero Connectivity)'}
              </h3>
              <p className="text-xs text-slate-500">
                Physical connection: {browserOnline ? 'Connected' : 'Disconnected'} • Software simulation: {simulateOffline ? 'Active' : 'Inactive'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={toggleSimulatedOffline}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs border transition ${
              simulateOffline
                ? 'bg-amber-100 border-amber-300 text-amber-900 hover:bg-amber-200'
                : 'bg-slate-100 border-slate-300 text-slate-800 hover:bg-slate-200'
            }`}
          >
            {simulateOffline ? 'Disable Offline Simulation' : 'Simulate Offline Mode'}
          </button>
        </div>

        {/* Cached Data Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
            <span className="text-[10px] font-bold uppercase text-slate-400 block">Cached Facilities</span>
            <span className="text-2xl font-black text-slate-900 block mt-0.5">{cachedHospitals.length}</span>
            <span className="text-[11px] text-slate-500">Full bed & drug inventories</span>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
            <span className="text-[10px] font-bold uppercase text-slate-400 block">Cached Patient Records</span>
            <span className="text-2xl font-black text-slate-900 block mt-0.5">{cachedPatients.length}</span>
            <span className="text-[11px] text-slate-500">Temporary intakes & transfers</span>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
            <span className="text-[10px] font-bold uppercase text-amber-600 block">Pending Sync Actions</span>
            <span className="text-2xl font-black text-amber-700 block mt-0.5">{syncQueue.length}</span>
            <span className="text-[11px] text-slate-500">Waiting for connection replay</span>
          </div>
        </div>
      </div>

      {/* Sync Queue Inspector */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
            <Layers className="w-5 h-5 text-teal-600" />
            Pending Synchronization Queue
          </h3>
          <span className="text-xs font-semibold text-slate-400">
            {syncQueue.length} queued action{syncQueue.length === 1 ? '' : 's'}
          </span>
        </div>

        {syncQueue.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 uppercase font-bold text-[10px]">
                  <th className="pb-3">Queue ID</th>
                  <th className="pb-3">Action Type</th>
                  <th className="pb-3">Queued At</th>
                  <th className="pb-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {syncQueue.map((item) => (
                  <tr key={item.queue_id} className="hover:bg-slate-50 transition">
                    <td className="py-3 font-mono text-slate-500">#{item.queue_id}</td>
                    <td className="py-3 font-bold text-slate-900">{item.actionType}</td>
                    <td className="py-3 text-slate-600">{formatRelativeTime(item.created_at)}</td>
                    <td className="py-3 text-right">
                      <span className="bg-amber-100 text-amber-900 text-[10px] font-bold px-2 py-0.5 rounded">
                        Queued for Sync
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-900 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>All local modifications are fully synchronized with the database.</span>
          </div>
        )}
      </div>

      {/* Capabilities Breakdown: Offline vs Online */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-3">
          <h4 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            Fully Operable in Zero Connectivity
          </h4>
          <ul className="space-y-1.5 text-xs text-slate-600 leading-relaxed font-medium">
            <li>• Hospital discovery from local cached directory</li>
            <li>• Phone dialers directly through cellular phone dialer</li>
            <li>• Emergency first aid instructions and CPR protocols</li>
            <li>• Emergency QR token display and scanning</li>
            <li>• Registering unconscious patient intakes (`LL-EMG-XXXX`)</li>
            <li>• Creating transfer handover notes into offline queue</li>
          </ul>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-3">
          <h4 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            Requires Active Internet Handshake
          </h4>
          <ul className="space-y-1.5 text-xs text-slate-600 leading-relaxed font-medium">
            <li>• Real-time remote bed telemetry updates from other facilities</li>
            <li>• Remote family SMS dispatch via cellular SMS gateways</li>
            <li>• Cross-hospital real-time cloud database syncing</li>
            <li>• Real-time traffic congestion on external map tiles</li>
          </ul>
        </div>
      </div>

      {/* Reset Data Button */}
      <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
        <span className="text-xs text-slate-500">
          Restore original synthetic demonstration hospitals and test profiles.
        </span>

        <button
          type="button"
          onClick={handleResetData}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-700 hover:text-rose-800 bg-rose-50 hover:bg-rose-100 border border-rose-200 px-4 py-2 rounded-xl transition"
        >
          <Trash2 className="w-4 h-4" /> Reset Local Database
        </button>
      </div>

      {resetSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs rounded-xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Local database reset to fresh demonstration records!</span>
        </div>
      )}
    </div>
  );
}
