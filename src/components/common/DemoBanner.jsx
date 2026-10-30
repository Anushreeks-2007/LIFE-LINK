import React from 'react';
import { useAuth, ROLES } from '../../contexts/AuthContext';
import { useOffline } from '../../contexts/OfflineContext';
import { ShieldAlert, Wifi, WifiOff, RefreshCw, User, Building2, Stethoscope } from 'lucide-react';

export function DemoBanner() {
  const { role, switchDemoRole, user } = useAuth();
  const { isOnline, simulateOffline, toggleSimulatedOffline, pendingQueueCount, syncStatus, triggerSync } = useOffline();

  return (
    <div className="bg-slate-900 text-white text-xs px-3 py-2 border-b border-slate-800 shadow-sm">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        {/* Left: Demo Mode Warning */}
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 font-bold bg-amber-500 text-slate-950 px-2 py-0.5 rounded text-[11px] uppercase tracking-wider">
            <ShieldAlert className="w-3.5 h-3.5" /> Demo Mode
          </span>
          <span className="text-slate-300 hidden md:inline">
            Fictional healthcare data. In real emergencies, call <strong>112 / 108</strong>.
          </span>
        </div>

        {/* Center: Role Switcher */}
        <div className="flex items-center gap-1.5 bg-slate-800/80 p-1 rounded-md">
          <span className="text-slate-400 text-[11px] px-1 hidden sm:inline">Role:</span>
          <button
            type="button"
            onClick={() => switchDemoRole(ROLES.PUBLIC)}
            className={`inline-flex items-center gap-1 px-2 py-1 rounded transition text-[11px] font-medium ${
              role === ROLES.PUBLIC
                ? 'bg-teal-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-700'
            }`}
            title="Public Patient / Citizen View"
          >
            <User className="w-3 h-3" /> Citizen
          </button>
          <button
            type="button"
            onClick={() => switchDemoRole(ROLES.HOSPITAL_ADMIN)}
            className={`inline-flex items-center gap-1 px-2 py-1 rounded transition text-[11px] font-medium ${
              role === ROLES.HOSPITAL_ADMIN
                ? 'bg-sky-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-700'
            }`}
            title="Hospital Admin View (Apex Trauma)"
          >
            <Building2 className="w-3 h-3" /> Admin
          </button>
          <button
            type="button"
            onClick={() => switchDemoRole(ROLES.HEALTHCARE_STAFF)}
            className={`inline-flex items-center gap-1 px-2 py-1 rounded transition text-[11px] font-medium ${
              role === ROLES.HEALTHCARE_STAFF
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-700'
            }`}
            title="Emergency Paramedic / Staff View"
          >
            <Stethoscope className="w-3 h-3" /> ER Staff
          </button>
        </div>

        {/* Right: Network & Sync status */}
        <div className="flex items-center gap-2">
          {pendingQueueCount > 0 && (
            <button
              type="button"
              onClick={triggerSync}
              disabled={!isOnline || syncStatus === 'syncing'}
              className="inline-flex items-center gap-1 bg-amber-600 hover:bg-amber-500 text-white px-2 py-0.5 rounded text-[11px] font-medium transition"
            >
              <RefreshCw className={`w-3 h-3 ${syncStatus === 'syncing' ? 'animate-spin' : ''}`} />
              Sync ({pendingQueueCount})
            </button>
          )}

          <button
            type="button"
            onClick={toggleSimulatedOffline}
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold transition border ${
              simulateOffline
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 hover:bg-amber-500/30'
                : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30'
            }`}
            title="Click to toggle simulated offline state"
          >
            {simulateOffline ? (
              <>
                <WifiOff className="w-3 h-3 text-amber-400" />
                <span>Simulated Offline</span>
              </>
            ) : (
              <>
                <Wifi className="w-3 h-3 text-emerald-400" />
                <span>Online</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
