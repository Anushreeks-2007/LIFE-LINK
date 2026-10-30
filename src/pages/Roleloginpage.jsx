import { useEffect, useState } from 'react';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import { User, Lock, Eye, EyeOff, AlertCircle, Loader2, Stethoscope, ShieldCheck } from 'lucide-react';
import { signInWithRole, getCurrentUser } from '../services/authService';

const ROLE_CONFIG = {
  staff: { title: 'ER staff sign in', icon: Stethoscope, home: '/staff/scan' },
  admin: { title: 'Hospital admin sign in', icon: ShieldCheck, home: '/admin' },
};

export function RoleLoginPage() {
  const { role } = useParams();
  const navigate = useNavigate();
  const config = ROLE_CONFIG[role];

  const [form, setForm] = useState({ username: '', password: '' });
  const [showPw, setShowPw] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  // Already signed in? Go straight to the right place.
  useEffect(() => {
    if (!config) return;
    let active = true;
    getCurrentUser().then((u) => {
      if (!active || !u) return;
      navigate(u.mustChange ? '/change-password' : ROLE_CONFIG[u.role]?.home || '/', { replace: true });
    });
    return () => {
      active = false;
    };
  }, [config, navigate]);

  if (!config) return <Navigate to="/select-role" replace />;
  const Icon = config.icon;

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.username.trim()) return setError('Enter your username.');
    if (!form.password) return setError('Enter your password.');

    setBusy(true);
    try {
      const { user } = await signInWithRole({ role, ...form });
      navigate(user.mustChange ? '/change-password' : config.home, { replace: true });
    } catch (err) {
      setError(err?.message || 'Could not sign in. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-slate-50 px-4 py-10">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="mb-6 flex flex-col items-center text-center">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-red-600 text-white">
            <Icon className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-semibold text-slate-900">{config.title}</h1>
          <p className="mt-1 text-sm text-slate-600">Use the username and password given to you.</p>
        </div>

        <div role="alert" aria-live="polite">
          {error && (
            <p className="mb-4 flex items-start gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" /> {error}
            </p>
          )}
        </div>

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <div>
            <label htmlFor="username" className="mb-1 block text-sm font-medium text-slate-700">
              Username
            </label>
            <div className="relative">
              <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                id="username"
                name="username"
                value={form.username}
                onChange={set('username')}
                autoComplete="username"
                autoCapitalize="none"
                className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-10 pr-3 text-slate-900 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-600/30"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="mb-1 block text-sm font-medium text-slate-700">
              Password
            </label>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                id="password"
                name="password"
                type={showPw ? 'text' : 'password'}
                value={form.password}
                onChange={set('password')}
                autoComplete="current-password"
                className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-10 pr-10 text-slate-900 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-600/30"
              />
              <button
                type="button"
                onClick={() => setShowPw((s) => !s)}
                aria-label={showPw ? 'Hide password' : 'Show password'}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={busy}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 font-medium text-white transition hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-600/40 disabled:opacity-60"
          >
            {busy && <Loader2 className="h-4 w-4 animate-spin" />} Sign in
          </button>
        </form>

        <p className="mt-6 text-center text-sm">
          <Link to="/select-role" className="font-medium text-red-700 hover:underline">
            Choose a different role
          </Link>
        </p>
      </div>
    </div>
  );
}