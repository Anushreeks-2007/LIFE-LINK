// src/pages/ChangePasswordPage.jsx  (staff and admin)
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Lock, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { useSession } from '../hooks/useSession';
import { changeRolePassword, ROLE_INFO } from '../services/authService';

export default function ChangePasswordPage() {
  const { user } = useSession();
  const [form, setForm] = useState({ current: '', next: '', confirm: '' });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const isRoleUser = user?.role === 'staff' || user?.role === 'admin';

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.current) return setError('Enter your current password.');
    if (form.next.length < 8 || !/[A-Za-z]/.test(form.next) || !/\d/.test(form.next))
      return setError('New password must be at least 8 characters with a letter and a number.');
    if (form.next !== form.confirm) return setError('New passwords do not match.');
    if (form.next === form.current) return setError('New password must be different from the current one.');

    setBusy(true);
    try {
      await changeRolePassword(user.role, form.current, form.next);
      setDone(true);
      setForm({ current: '', next: '', confirm: '' });
    } catch (err) {
      setError(err?.message || 'Could not change password.');
    } finally {
      setBusy(false);
    }
  };

  const fields = [
    ['current', 'Current password', 'current-password'],
    ['next', 'New password', 'new-password'],
    ['confirm', 'Confirm new password', 'new-password'],
  ];

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-slate-50 px-4 py-10">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <h1 className="text-xl font-semibold text-slate-900">Change password</h1>

        {!isRoleUser ? (
          <p className="mt-3 text-sm text-slate-600">
            Only staff and administrator accounts use this page. Citizens can reset their password with
            "Forgot password?" on the sign-in page.
          </p>
        ) : (
          <>
            <p className="mb-5 mt-1 text-sm text-slate-600">{ROLE_INFO[user.role].label}</p>
            {error && (
              <p className="mb-4 flex items-start gap-2 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" /> {error}
              </p>
            )}
            {done && (
              <p className="mb-4 flex items-center gap-2 rounded-lg bg-green-50 px-3 py-2 text-sm text-green-800">
                <CheckCircle2 className="h-4 w-4" /> Password changed. Use it the next time you sign in.
              </p>
            )}
            <form onSubmit={submit} className="space-y-4">
              {fields.map(([key, label, ac]) => (
                <label key={key} className="block text-sm font-medium text-slate-700">
                  {label}
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
                {busy && <Loader2 className="h-4 w-4 animate-spin" />} Update password
              </button>
            </form>
          </>
        )}

        <p className="mt-6 text-center text-sm">
          <Link to="/" className="text-teal-700 hover:underline">Back to home</Link>
        </p>
      </div>
    </div>
  );
}