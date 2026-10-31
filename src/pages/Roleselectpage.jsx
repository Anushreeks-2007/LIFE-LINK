import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HeartPulse, User, Stethoscope, ShieldCheck } from 'lucide-react';
import { getCurrentUser } from '../services/authService';
import { useLanguage } from '../contexts/LanguageContext';

const ROLES = [
  { to: '/auth', icon: User, title: 'roleCitizen', text: 'roleCitizenDesc' },
  { to: '/login/staff', icon: Stethoscope, title: 'roleStaff', text: 'roleStaffDesc' },
  { to: '/login/admin', icon: ShieldCheck, title: 'roleAdmin', text: 'roleAdminDesc' },
];

export function RoleSelectPage() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  // Already signed in? Skip the role screen.
  useEffect(() => {
    let active = true;
    getCurrentUser().then((u) => active && u && navigate('/', { replace: true }));
    return () => {
      active = false;
    };
  }, [navigate]);

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-slate-50 px-4 py-10">
      <div className="w-full max-w-3xl">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-red-600 text-white">
            <HeartPulse className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-semibold text-slate-900">{t('roleWelcome')}</h1>
          <p className="mt-1 text-sm text-slate-600">{t('roleChoose')}</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {ROLES.map(({ to, icon: Icon, title, text }) => (
            <Link
              key={title}
              to={to}
              className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-600/40"
            >
              <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 text-slate-700 transition group-hover:bg-red-600 group-hover:text-white">
                <Icon className="h-5 w-5" />
              </span>
              <h2 className="text-lg font-semibold text-slate-900">{t(title)}</h2>
              <p className="mt-1 text-sm text-slate-600">{t(text)}</p>
            </Link>
          ))}
        </div>

        <p className="mt-8 text-center text-xs text-slate-500">
          {t('emergencyNote')}{' '}
          <Link to="/privacy-help" className="underline">{t('navPrivacy')}</Link>
        </p>
      </div>
    </div>
  );
}