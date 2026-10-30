import * as client from './supabaseClient';

// Works whether supabaseClient.js exports `supabase` (named) or a default export.
const supabase = client.supabase ?? client.default ?? null;

export const isDemoAuth =
  !import.meta.env.VITE_SUPABASE_URL ||
  !import.meta.env.VITE_SUPABASE_ANON_KEY ||
  !supabase;

/* ------------------------------ demo helpers ------------------------------ */
const USERS_KEY = 'lifelink_demo_users';
const SESSION_KEY = 'lifelink_demo_session';
const listeners = new Set();

const readJSON = (key, fallback) => {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback;
  } catch {
    return fallback;
  }
};

async function sha256(text) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

function setDemoSession(user) {
  if (user) localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  else localStorage.removeItem(SESSION_KEY);
  listeners.forEach((cb) => cb(user));
}

/* -------------------------------- public API ------------------------------- */
export async function signUp({ name, email, password }) {
  email = email.trim().toLowerCase();

  if (isDemoAuth) {
    const users = readJSON(USERS_KEY, {});
    if (users[email]) throw new Error('An account with this email already exists. Sign in instead.');
    users[email] = { name, email, hash: await sha256(password) };
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    const user = { id: `demo-${email}`, name, email, provider: 'email' };
    setDemoSession(user);
    return { user, needsEmailConfirmation: false };
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: name },
      emailRedirectTo: `${window.location.origin}/auth`,
    },
  });
  if (error) throw error;
  // If "Confirm email" is on in Supabase, there is no session until the link is clicked.
  return { user: data.user, needsEmailConfirmation: !data.session };
}

export async function signIn({ email, password }) {
  email = email.trim().toLowerCase();

  if (isDemoAuth) {
    const record = readJSON(USERS_KEY, {})[email];
    if (!record || record.hash !== (await sha256(password))) {
      throw new Error('Incorrect email or password.');
    }
    const user = { id: `demo-${email}`, name: record.name, email, provider: 'email' };
    setDemoSession(user);
    return { user };
  }

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return { user: data.user };
}

export async function signInWithGoogle() {
  if (isDemoAuth) {
    // Simulated Google sign-in so the flow can be demonstrated without credentials.
    const user = {
      id: 'demo-google-user',
      name: 'Demo Google User',
      email: 'demo.user@gmail.com',
      provider: 'google',
    };
    setDemoSession(user);
    return { user };
  }

  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: `${window.location.origin}/auth` },
  });
  if (error) throw error;
  // The browser now redirects to Google, then back to /auth.
  return {};
}

export async function sendPasswordReset(email) {
  email = email.trim().toLowerCase();

  if (isDemoAuth) {
    // No email is sent in demo mode.
    return { demo: true };
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  });
  if (error) throw error;
  return {};
}

export async function updatePassword(newPassword) {
  if (isDemoAuth) throw new Error('Password reset is not available in demo mode.');
  const { error } = await supabase.auth.updateUser({ password: newPassword });
  if (error) throw error;
}

export async function signOut() {
  if (isDemoAuth) return setDemoSession(null);
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getCurrentUser() {
  if (isDemoAuth) return readJSON(SESSION_KEY, null);
  const { data } = await supabase.auth.getSession();
  return data.session?.user ?? null;
}

// cb(user | null, event). Returns an unsubscribe function.
export function onAuthChange(cb) {
  if (isDemoAuth) {
    const handler = (user) => cb(user, user ? 'SIGNED_IN' : 'SIGNED_OUT');
    listeners.add(handler);
    return () => listeners.delete(handler);
  }
  const { data } = supabase.auth.onAuthStateChange((event, session) =>
    cb(session?.user ?? null, event)
  );
  return () => data.subscription.unsubscribe();
}
