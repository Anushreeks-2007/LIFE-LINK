// Maps the English error messages thrown by authService to translation keys.
// Unknown messages (for example from Supabase) are shown as they are.
const ERROR_KEYS = {
  'Incorrect username or password.': 'errBadCredentials',
  'Incorrect email or password.': 'errBadEmailCredentials',
  'An account with this email already exists. Sign in instead.': 'errEmailExists',
  'Current password is incorrect.': 'errCurrentWrong',
  'You are not signed in.': 'errNotSignedIn',
  'Password reset is not available in demo mode.': 'errResetDemo',
};

export function translateError(err, t, fallbackKey = 'errGeneric') {
  const key = ERROR_KEYS[err?.message];
  if (key) return t(key);
  return err?.message || t(fallbackKey);
}