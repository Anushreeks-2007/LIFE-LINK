import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { updatePassword, onAuthChange, getCurrentUser, isDemoAuth } from '../services/authService';

export function ResetPasswordPage() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  // Supabase signs the user in via the email link (PASSWORD_RECOVERY event).
  useEffect(() => {
    getCurrentUser().then((u) => u && setReady(true));
    return onAuthChange((u, event) => {
      if (event === 'PASSWORD_RECOVERY' || u) setReady(true);
    });
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    if (password.length < 8 || !/[A-Za-z]/.test(password) || !/\d/.test(password))
      return setError('Password must be at least 8 characters with a letter and a number.');
    if (password !== confirm) return setError('Passwords do not match.');

    setBusy(true);
    try {
      await updatePassword(password);
      setDone(true);
      setTimeout(() => navigate('/'), 1500);
    } catch (err) {
      setError(err?.message || 'Could not update password. Request a new reset link.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-slate-50 px-4 py-10">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <h1 className="text-2xl font-semibold text-slate-900">Choose a new password</h1>

        {isDemoAuth ? (
          <p className="mt-4 text-sm text-slate-600">Password reset needs Supabase. It is not available in demo mode.</p>
        ) : !ready ? (
          <p className="mt-4 text-sm text-slate-600">
            Open this page from the reset link in your email. If the link has expired, request a new one from the sign-in page.
          </p>
        ) : done ? (
          <p className="mt-4 flex items-center gap-2 rounded-lg bg-green-50 px-3 py-2 text-sm text-green-800">
            <CheckCircle2 className="h-4 w-4" /> Password updated. Redirecting…
          </p>
        ) : (
          <form onSubmit={submit} className="mt-5 space-y-4">
            {error && (
              <p className="flex items-start gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" /> {error}
              </p>
            )}
            {[
              ['New password', password, setPassword, 'new-password'],
              ['Confirm new password', confirm, setConfirm, 'new-password'],
            ].map(([label, value, setter, ac]) => (
              <label key={label} className="block text-sm font-medium text-slate-700">
                {label}
                <div className="relative mt-1">
                  <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="password"
                    value={value}
                    onChange={(e) => setter(e.target.value)}
                    autoComplete={ac}
                    className="w-full rounded-lg border border-slate-300 py-2.5 pl-10 pr-3 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-600/30"
                  />
                </div>
              </label>
            ))}
            <button
              type="submit"
              disabled={busy}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 font-medium text-white hover:bg-red-700 disabled:opacity-60"
            >
              {busy && <Loader2 className="h-4 w-4 animate-spin" />} Update password
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
