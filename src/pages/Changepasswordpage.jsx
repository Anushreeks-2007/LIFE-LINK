// src/pages/ChangePasswordPage.jsx  (staff and admin)
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { useSession } from '../hooks/useSession';
import { changeRolePassword } from '../services/authService';
import { useLanguage } from '../contexts/LanguageContext';
import { translateError } from '../utils/translateError';

const ROLE_HOME = { staff: '/staff/scan', admin: '/admin' };

export default function ChangePasswordPage() {
  const { user } = useSession();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [form, setForm] = useState({ current: '', next: '', confirm: '' });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const isRoleUser = user?.role === 'staff' || user?.role === 'admin';

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.current) return setError(t('cpErrCurrent'));
    if (form.next.length < 8 || !/[A-Za-z]/.test(form.next) || !/\d/.test(form.next))
      return setError(t('pwRuleNew'));
    if (form.next !== form.confirm) return setError(t('pwMismatchNew'));
    if (form.next === form.current) return setError(t('pwSame'));

    setBusy(true);
    try {
      await changeRolePassword(form.current, form.next);
      setDone(true);
      setForm({ current: '', next: '', confirm: '' });
      // Send them to their home screen after a short pause.
      setTimeout(() => navigate(ROLE_HOME[user.role] || '/', { replace: true }), 1500);
    } catch (err) {
      setError(translateError(err, t, 'cpFail'));
    } finally {
      setBusy(false);
    }
  };

  const fields = [
    ['current', 'cpCurrent', 'current-password'],
    ['next', 'cpNew', 'new-password'],
    ['confirm', 'cpConfirm', 'new-password'],
  ];

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-slate-50 px-4 py-10">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <h1 className="text-xl font-semibold text-slate-900">{t('cpTitle')}</h1>

        {!isRoleUser ? (
          <p className="mt-3 text-sm text-slate-600">{t('cpOnlyRoles')}</p>
        ) : (
          <>
            <p className="mb-5 mt-1 text-sm text-slate-600">
              {user.role === 'admin' ? t('cpAdminInfo') : t('cpStaffInfo')}
            </p>
            {user.mustChange && !done && (
              <p className="mb-4 flex items-start gap-2 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" /> {t('cpMustChange')}
              </p>
            )}
            {error && (
              <p className="mb-4 flex items-start gap-2 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" /> {error}
              </p>
            )}
            {done && (
              <p className="mb-4 flex items-center gap-2 rounded-lg bg-green-50 px-3 py-2 text-sm text-green-800">
                <CheckCircle2 className="h-4 w-4" /> {t('cpDone')}
              </p>
            )}
            <form onSubmit={submit} className="space-y-4">
              {fields.map(([key, labelKey, ac]) => (
                <label key={key} className="block text-sm font-medium text-slate-700">
                  {t(labelKey)}
                  <div className="relative mt-1">
                    <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      type="password"
                      value={form[key]}
                      onChange={set(key)}
                      autoComplete={ac}
                      className="w-full rounded-lg border border-slate-300 py-2.5 pl-10 pr-3 focus:border-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-600/30"
                    />
                  </div>
                </label>
              ))}
              <button
                type="submit"
                disabled={busy}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 font-medium text-white hover:bg-slate-800 disabled:opacity-60"
              >
                {busy && <Loader2 className="h-4 w-4 animate-spin" />} {t('cpUpdate')}
              </button>
            </form>
          </>
        )}

        <p className="mt-6 text-center text-sm">
          <Link to="/" className="text-teal-700 hover:underline">{t('backHome')}</Link>
        </p>
      </div>
    </div>
  );
}