import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, AlertCircle, CheckCircle2, Loader2, HeartPulse } from 'lucide-react';
import {
  isDemoAuth,
  signUp,
  signIn,
  signInWithGoogle,
  sendPasswordReset,
  getCurrentUser,
  onAuthChange,
} from '../services/authService';
import { useLanguage } from '../contexts/LanguageContext';
import { translateError } from '../utils/translateError';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function GoogleLogo() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.9 2.4 30.4 0 24 0 14.6 0 6.5 5.4 2.6 13.2l7.9 6.1C12.4 13.6 17.7 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.7c-.6 3-2.3 5.5-4.8 7.2l7.5 5.8c4.4-4.1 7.1-10.1 7.1-17.5z" />
      <path fill="#FBBC05" d="M10.5 28.7c-.5-1.4-.8-3-.8-4.7s.3-3.2.8-4.7l-7.9-6.1C.9 16.4 0 20.1 0 24s.9 7.6 2.6 10.8l7.9-6.1z" />
      <path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.5-5.8c-2.1 1.4-4.9 2.3-8.4 2.3-6.3 0-11.6-4.1-13.5-9.8l-7.9 6.1C6.5 42.6 14.6 48 24 48z" />
    </svg>
  );
}

function Field({ id, label, icon: Icon, type = 'text', value, onChange, autoComplete, right, hint }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-sm font-medium text-slate-700">
        {label}
      </label>
      <div className="relative">
        <Icon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          id={id}
          name={id}
          type={type}
          value={value}
          onChange={onChange}
          autoComplete={autoComplete}
          className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-10 pr-10 text-slate-900 placeholder-slate-400 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-600/30"
        />
        {right}
      </div>
      {hint && <p className="mt-1 text-xs text-slate-500">{hint}</p>}
    </div>
  );
}

export function AuthPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();
  const redirectTo = location.state?.from?.pathname || '/';

  const [mode, setMode] = useState('signin'); // 'signin' | 'signup' | 'forgot'
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [showPw, setShowPw] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  // Already signed in? Also handles the return trip from Google / email-confirm links.
  useEffect(() => {
    let active = true;
    getCurrentUser().then((u) => active && u && navigate(redirectTo, { replace: true }));
    const off = onAuthChange((u) => u && navigate(redirectTo, { replace: true }));
    return () => {
      active = false;
      off();
    };
  }, [navigate, redirectTo]);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const switchMode = (next) => {
    setMode(next);
    setError('');
    setNotice('');
    setForm((f) => ({ ...f, password: '', confirm: '' }));
  };

  const validate = () => {
    if (mode === 'signup' && form.name.trim().length < 2) return t('errName');
    if (!EMAIL_RE.test(form.email.trim())) return t('errEmail');
    if (mode === 'forgot') return '';
    if (mode === 'signup') {
      if (form.password.length < 8) return t('errPwLen');
      if (!/[A-Za-z]/.test(form.password) || !/\d/.test(form.password)) return t('errPwMix');
      if (form.password !== form.confirm) return t('errPwMatch');
    } else if (!form.password) {
      return t('errEnterPassword');
    }
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setNotice('');
    const problem = validate();
    if (problem) return setError(problem);

    setBusy(true);
    try {
      if (mode === 'signin') {
        await signIn(form);
        navigate(redirectTo, { replace: true });
      } else if (mode === 'signup') {
        const { needsEmailConfirmation } = await signUp(form);
        if (needsEmailConfirmation) {
          setNotice(t('noticeCreated'));
          setMode('signin');
        } else {
          navigate(redirectTo, { replace: true });
        }
      } else {
        const res = await sendPasswordReset(form.email);
        setNotice(res.demo ? t('noticeDemoReset') : t('noticeResetSent'));
      }
    } catch (err) {
      setError(translateError(err, t, 'errGeneric'));
    } finally {
      setBusy(false);
    }
  };

  const handleGoogle = async () => {
    setError('');
    setNotice('');
    setBusy(true);
    try {
      await signInWithGoogle();
      if (isDemoAuth) navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(translateError(err, t, 'errGoogle'));
      setBusy(false);
    }
  };

  const titles = {
    signin: [t('authSignInTitle'), t('authSignInSub')],
    signup: [t('authSignUpTitle'), t('authSignUpSub')],
    forgot: [t('authForgotTitle'), t('authForgotSub')],
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-slate-50 px-4 py-10">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="mb-6 flex flex-col items-center text-center">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-red-600 text-white">
            <HeartPulse className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-semibold text-slate-900">{titles[mode][0]}</h1>
          <p className="mt-1 text-sm text-slate-600">{titles[mode][1]}</p>
        </div>

        {isDemoAuth && (
          <p className="mb-4 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800">{t('demoBanner')}</p>
        )}

        <div role="alert" aria-live="polite">
          {error && (
            <p className="mb-4 flex items-start gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" /> {error}
            </p>
          )}
          {notice && (
            <p className="mb-4 flex items-start gap-2 rounded-lg bg-green-50 px-3 py-2 text-sm text-green-800">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" /> {notice}
            </p>
          )}
        </div>

        {mode !== 'forgot' && (
          <>
            <button
              type="button"
              onClick={handleGoogle}
              disabled={busy}
              className="flex w-full items-center justify-center gap-3 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-800 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-red-600/30 disabled:opacity-60"
            >
              <GoogleLogo />
              {t('continueGoogle')}
            </button>
            <div className="my-5 flex items-center gap-3 text-xs text-slate-400">
              <span className="h-px flex-1 bg-slate-200" />
              {t('orEmail')}
              <span className="h-px flex-1 bg-slate-200" />
            </div>
          </>
        )}

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          {mode === 'signup' && (
            <Field id="name" label={t('fullName')} icon={User} value={form.name} onChange={set('name')} autoComplete="name" />
          )}

          <Field
            id="email"
            label={t('email')}
            icon={Mail}
            type="email"
            value={form.email}
            onChange={set('email')}
            autoComplete="email"
          />

          {mode !== 'forgot' && (
            <Field
              id="password"
              label={t('password')}
              icon={Lock}
              type={showPw ? 'text' : 'password'}
              value={form.password}
              onChange={set('password')}
              autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
              hint={mode === 'signup' ? t('pwHint') : undefined}
              right={
                <button
                  type="button"
                  onClick={() => setShowPw((s) => !s)}
                  aria-label={showPw ? t('hidePassword') : t('showPassword')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              }
            />
          )}

          {mode === 'signup' && (
            <Field
              id="confirm"
              label={t('confirmPassword')}
              icon={Lock}
              type={showPw ? 'text' : 'password'}
              value={form.confirm}
              onChange={set('confirm')}
              autoComplete="new-password"
            />
          )}

          {mode === 'signin' && (
            <div className="text-right">
              <button
                type="button"
                onClick={() => switchMode('forgot')}
                className="text-sm font-medium text-red-700 hover:underline"
              >
                {t('forgotLink')}
              </button>
            </div>
          )}

          <button
            type="submit"
            disabled={busy}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 font-medium text-white transition hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-600/40 disabled:opacity-60"
          >
            {busy && <Loader2 className="h-4 w-4 animate-spin" />}
            {mode === 'signin' && t('login')}
            {mode === 'signup' && t('createAccount')}
            {mode === 'forgot' && t('sendReset')}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600">
          {mode === 'signin' && (
            <>
              {t('newToApp')}{' '}
              <button onClick={() => switchMode('signup')} className="font-medium text-red-700 hover:underline">
                {t('createAccount')}
              </button>
            </>
          )}
          {mode === 'signup' && (
            <>
              {t('haveAccount')}{' '}
              <button onClick={() => switchMode('signin')} className="font-medium text-red-700 hover:underline">
                {t('login')}
              </button>
            </>
          )}
          {mode === 'forgot' && (
            <button onClick={() => switchMode('signin')} className="font-medium text-red-700 hover:underline">
              {t('backToSignIn')}
            </button>
          )}
        </p>

        <p className="mt-4 text-center text-xs text-slate-500">
          {t('emergencyNote')} {t('noAccountNeeded')}{' '}
          <Link to="/privacy-help" className="underline">{t('navPrivacy')}</Link>
        </p>

        <p className="mt-3 text-center text-xs">
          <Link to="/select-role" className="font-medium text-red-700 hover:underline">{t('changeRole')}</Link>
        </p>
      </div>
    </div>
  );
}