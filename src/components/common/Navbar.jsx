// src/components/common/Navbar.jsx
// Before sign-in: only the brand logo. After sign-in: links for the signed-in role.
import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import { useSession } from '../../hooks/useSession';
import { LanguageSelector } from './LanguageSelector';
import { AuthButton } from './AuthButton';
import {
  Activity, PhoneCall, Search, MapPin, Mic, Database,
  Building2, Stethoscope, User, Menu, X, AlertCircle,ChevronDown
} from 'lucide-react';

const COMMON_LINKS = [
  { to: '/hospitals', icon: Search, label: 'navHospitals' },
  { to: '/map', icon: MapPin, label: 'navMap' },
  { to: '/voice-assistant', icon: Mic, label: 'navVoice' },
  { to: '/offline-status', icon: Database, label: 'navOffline' },
];

const ROLE_LINK = {
  admin: { to: '/admin', icon: Building2, label: 'navAdmin', active: 'bg-sky-100 text-sky-900', idle: 'text-sky-700 hover:bg-sky-50', iconCls: 'text-sky-600' },
  staff: { to: '/staff/scan', icon: Stethoscope, label: 'navStaff', active: 'bg-emerald-100 text-emerald-900', idle: 'text-emerald-700 hover:bg-emerald-50', iconCls: 'text-emerald-600' },
  citizen: { to: '/profile', icon: User, label: 'navProfile', active: 'bg-slate-100 text-slate-900', idle: 'text-slate-600 hover:text-slate-900 hover:bg-slate-50', iconCls: 'text-slate-500' },
};

// whitespace-nowrap keeps every label on one line
const linkBase = 'inline-flex items-center gap-1.5 whitespace-nowrap px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors';

export function Navbar() {
  const { t } = useLanguage();
  const { user, role } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const closeMenu = () => setMobileMenuOpen(false);

  const signedIn = Boolean(user);
  const roleLink = ROLE_LINK[role];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          {/* Brand logo: never shrinks, never wraps */}
          <Link
            to={signedIn ? '/' : '/select-role'}
            onClick={closeMenu}
            className="flex shrink-0 items-center gap-2 group focus:outline-none focus:ring-2 focus:ring-teal-600 rounded-lg p-1"
          >
            <div className="w-9 h-9 shrink-0 rounded-xl bg-gradient-to-tr from-teal-700 to-teal-500 flex items-center justify-center text-white shadow-md shadow-teal-700/20 group-hover:scale-105 transition">
              <Activity className="w-5 h-5 stroke-[1.75]" />
            </div>
            <div className="leading-tight">
              <div className="flex items-center gap-1.5">
                <span className="whitespace-nowrap font-extrabold text-lg tracking-tight text-slate-900 group-hover:text-teal-900 transition">
                  LIFE-LINK
                </span>
                <span className="hidden sm:inline text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-teal-50 text-teal-700 border border-teal-200">
                  Health
                </span>
              </div>
              <p className="hidden xl:block whitespace-nowrap text-[10px] text-slate-600 font-medium">
                Connecting Lives, Saving Time.
              </p>
            </div>
          </Link>

          {signedIn && (
            <>
              {/* Desktop links (xl and up; smaller screens use the menu button) */}
              <nav className="hidden xl:flex items-center gap-1">
                {COMMON_LINKS.map(({ to, icon: Icon, label }) => (
                  <NavLink
                    key={to}
                    to={to}
                    className={({ isActive }) =>
                      `${linkBase} ${isActive ? 'bg-teal-50 text-teal-700' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'}`
                    }
                  >
                    <Icon className="w-3.5 h-3.5 text-teal-700" />
                    {t(label)}
                  </NavLink>
                ))}
                {roleLink && (
                  <NavLink
                    to={roleLink.to}
                    className={({ isActive }) => `${linkBase} ${isActive ? roleLink.active : roleLink.idle}`}
                  >
                    <roleLink.icon className={`w-3.5 h-3.5 ${roleLink.iconCls}`} />
                    {t(roleLink.label)}
                  </NavLink>
                )}
              </nav>

              {/* Right actions */}
              <div className="relative shrink-0 [&_select]:appearance-none [&_select]:pr-8">
                <LanguageSelector />
                <ChevronDown
                  className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-700"
                  strokeWidth={2}
                  aria-hidden="true"
                />
              </div>
                <div className="hidden xl:block">
                  <AuthButton />
                </div>
                <Link
                  to="/emergency"
                  onClick={closeMenu}
                  className="inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs px-3 py-2 rounded-xl shadow-md shadow-rose-600/40 emergency-pulse transition active:scale-95"
                  aria-label="Emergency Assistance"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span className="tracking-wide uppercase font-extrabold">Emergency</span>
                </Link>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="xl:hidden p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-600"
                  aria-label="Toggle navigation menu"
                  aria-expanded={mobileMenuOpen}
                >
                  {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Mobile / tablet menu */}
      {signedIn && mobileMenuOpen && (
        <div className="xl:hidden bg-white border-b border-slate-200 px-3 pt-2 pb-6 shadow-xl space-y-2">
          <div className="grid grid-cols-2 gap-2 pb-2">
            {COMMON_LINKS.map(({ to, icon: Icon, label }) => (
              <Link
                key={to}
                to={to}
                onClick={closeMenu}
                className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 hover:bg-teal-50 text-slate-800 text-xs font-semibold"
              >
                <Icon className="w-4 h-4 text-teal-800" />
                {t(label)}
              </Link>
            ))}
          </div>

          <div className="border-t border-slate-100 pt-3 space-y-1">
            {roleLink && (
              <Link
                to={roleLink.to}
                onClick={closeMenu}
                className="flex items-center gap-2 p-2 rounded-lg text-xs font-medium text-slate-900 hover:bg-slate-100"
              >
                <roleLink.icon className={`w-4 h-4 ${roleLink.iconCls}`} />
                {t(roleLink.label)}
              </Link>
            )}
            <Link
              to="/settings"
              onClick={closeMenu}
              className="flex items-center gap-2 p-2 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-100"
            >
              <Activity className="w-4 h-4 text-slate-700" />
              {t('navSettings')}
            </Link>
            <Link
              to="/privacy-help"
              onClick={closeMenu}
              className="flex items-center gap-2 p-2 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-100"
            >
              <AlertCircle className="w-4 h-4 text-slate-700" />
              {t('navPrivacy')}
            </Link>
            <div className="pt-2" onClick={closeMenu}>
              <AuthButton />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}