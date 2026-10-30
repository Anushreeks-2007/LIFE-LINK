import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import { useAuth, ROLES } from '../../contexts/AuthContext';
import { LanguageSelector } from './LanguageSelector';
import { AuthButton } from './AuthButton';
import {
  Activity,
  PhoneCall,
  Search,
  MapPin,
  Mic,
  Database,
  Building2,
  Stethoscope,
  User,
  Menu,
  X,
  QrCode,
  AlertCircle
} from 'lucide-react';

export function Navbar() {
  const { t } = useLanguage();
  const { role, user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          {/* Brand Logo */}
          <Link
            to="/"
            onClick={closeMenu}
            className="flex items-center gap-2.5 group focus:outline-none focus:ring-2 focus:ring-teal-600 rounded-lg p-1"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-700 to-teal-500 flex items-center justify-center text-white shadow-md shadow-teal-700/20 group-hover:scale-105 transition">
              <Activity className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg tracking-tight text-slate-900 group-hover:text-teal-700 transition">
                  LIFE-LINK
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-teal-50 text-teal-700 border border-teal-200">
                  Health
                </span>
              </div>
              <p className="text-[10px] text-slate-500 font-medium hidden sm:block">
                Connecting Lives, Saving Time.
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            <NavLink
              to="/hospitals"
              className={({ isActive }) =>
                `inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition ${
                  isActive
                    ? 'bg-teal-50 text-teal-800'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`
              }
            >
              <Search className="w-4 h-4 text-teal-600" />
              {t('navHospitals')}
            </NavLink>

            <NavLink
              to="/map"
              className={({ isActive }) =>
                `inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition ${
                  isActive
                    ? 'bg-teal-50 text-teal-800'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`
              }
            >
              <MapPin className="w-4 h-4 text-teal-600" />
              {t('navMap')}
            </NavLink>

            <NavLink
              to="/voice-assistant"
              className={({ isActive }) =>
                `inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition ${
                  isActive
                    ? 'bg-teal-50 text-teal-800'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`
              }
            >
              <Mic className="w-4 h-4 text-teal-600" />
              {t('navVoice')}
            </NavLink>

            <NavLink
              to="/offline-status"
              className={({ isActive }) =>
                `inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition ${
                  isActive
                    ? 'bg-teal-50 text-teal-800'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`
              }
            >
              <Database className="w-4 h-4 text-teal-600" />
              {t('navOffline')}
            </NavLink>

            {/* Role-Specific Nav Item */}
            {role === ROLES.HOSPITAL_ADMIN && (
              <NavLink
                to="/admin"
                className={({ isActive }) =>
                  `inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition ${
                    isActive
                      ? 'bg-sky-100 text-sky-900'
                      : 'text-sky-700 hover:bg-sky-50'
                  }`
                }
              >
                <Building2 className="w-4 h-4 text-sky-600" />
                {t('navAdmin')}
              </NavLink>
            )}

            {role === ROLES.HEALTHCARE_STAFF && (
              <NavLink
                to="/staff/scan"
                className={({ isActive }) =>
                  `inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition ${
                    isActive
                      ? 'bg-emerald-100 text-emerald-900'
                      : 'text-emerald-700 hover:bg-emerald-50'
                  }`
                }
              >
                <Stethoscope className="w-4 h-4 text-emerald-600" />
                {t('navStaff')}
              </NavLink>
            )}

            {role === ROLES.PUBLIC && (
              <NavLink
                to="/profile"
                className={({ isActive }) =>
                  `inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition ${
                    isActive
                      ? 'bg-slate-100 text-slate-900'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`
                }
              >
                <User className="w-4 h-4 text-slate-500" />
                {t('navProfile')}
              </NavLink>
            )}
          </nav>

          {/* Right Action Area */}
          <div className="flex items-center gap-2 sm:gap-3">
            <LanguageSelector />
            <div className="hidden sm:block">
              <AuthButton />
            </div>


            {/* Prominent Emergency Button */}
            <Link
              to="/emergency"
              onClick={closeMenu}
              className="inline-flex items-center gap-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs sm:text-sm px-3.5 py-2 rounded-xl shadow-md shadow-rose-600/30 hover:shadow-rose-600/50 emergency-pulse transition active:scale-95"
              aria-label="Emergency Assistance"
            >
              <PhoneCall className="w-4 h-4 stroke-[2.5]" />
              <span className="tracking-wide uppercase font-extrabold">Emergency</span>
            </Link>

            {/* Mobile Menu Trigger */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 shadow-xl space-y-2 animate-in slide-in-from-top duration-200">
          <div className="grid grid-cols-2 gap-2 pb-2">
            <Link
              to="/hospitals"
              onClick={closeMenu}
              className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-50 hover:bg-teal-50 text-slate-800 text-xs font-semibold"
            >
              <Search className="w-4 h-4 text-teal-600" />
              {t('navHospitals')}
            </Link>
            <Link
              to="/map"
              onClick={closeMenu}
              className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-50 hover:bg-teal-50 text-slate-800 text-xs font-semibold"
            >
              <MapPin className="w-4 h-4 text-teal-600" />
              {t('navMap')}
            </Link>
            <Link
              to="/voice-assistant"
              onClick={closeMenu}
              className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-50 hover:bg-teal-50 text-slate-800 text-xs font-semibold"
            >
              <Mic className="w-4 h-4 text-teal-600" />
              {t('navVoice')}
            </Link>
            <Link
              to="/offline-status"
              onClick={closeMenu}
              className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-50 hover:bg-teal-50 text-slate-800 text-xs font-semibold"
            >
              <Database className="w-4 h-4 text-teal-600" />
              {t('navOffline')}
            </Link>
          </div>

          <div className="border-t border-slate-100 pt-3 space-y-1">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-1">
              Role Workflows
            </p>
            <Link
              to="/profile"
              onClick={closeMenu}
              className="flex items-center gap-2 p-2 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-100"
            >
              <User className="w-4 h-4 text-slate-500" />
              Emergency Profile & My QR Code
            </Link>
            <Link
              to="/staff/scan"
              onClick={closeMenu}
              className="flex items-center gap-2 p-2 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-100"
            >
              <QrCode className="w-4 h-4 text-emerald-600" />
              Scan Patient QR / Unidentified Intake
            </Link>
            <Link
              to="/admin"
              onClick={closeMenu}
              className="flex items-center gap-2 p-2 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-100"
            >
              <Building2 className="w-4 h-4 text-sky-600" />
              Hospital Bed & Medicine Management
            </Link>
            <Link
              to="/settings"
              onClick={closeMenu}
              className="flex items-center gap-2 p-2 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-100"
            >
              <Activity className="w-4 h-4 text-slate-500" />
              {t('navSettings')}
            </Link>
            <Link
              to="/privacy-help"
              onClick={closeMenu}
              className="flex items-center gap-2 p-2 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-100"
            >
              <AlertCircle className="w-4 h-4 text-slate-500" />
              {t('navPrivacy')}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
