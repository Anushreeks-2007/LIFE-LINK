import { supabase, isSupabaseConfigured } from './supabaseClient';

export const isDemoAuth = !isSupabaseConfigured || !supabase;

/* ------------------------------ demo helpers ------------------------------ */
const USERS_KEY = 'lifelink_demo_users';
const STAFF_KEY = 'lifelink_demo_staff';
const SESSION_KEY = 'lifelink_demo_session';
const listeners = new Set();

/**
 * DEFAULT STAFF / ADMIN ACCOUNTS (demo mode).
 * Change these usernames and passwords to whatever you want to hand out.
 * They are seeded once into localStorage; after a user changes their password,
 * the new one is stored and the default stops working.
 *
 * To reset everything while testing, run in the browser console:
 *   localStorage.removeItem('lifelink_demo_staff')
 */
const DEFAULT_ACCOUNTS = [
  { username: 'erstaff', role: 'staff', name: 'ER Staff', password: 'Staff@12345' },
  { username: 'hospitaladmin', role: 'admin', name: 'Hospital Admin', password: 'Admin@12345' },
];

// In Supabase mode a username maps to this email domain (see setup notes).
const STAFF_EMAIL_DOMAIN = 'lifelink.staff';
const usernameToEmail = (username) => `${username.trim().toLowerCase()}@${STAFF_EMAIL_DOMAIN}`;

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

async function loadStaffStore() {
  const existing = readJSON(STAFF_KEY, null);
  if (existing) return existing;
  const store = {};
  for (const a of DEFAULT_ACCOUNTS) {
    store[a.username] = {
      username: a.username,
      role: a.role,
      name: a.name,
      hash: await sha256(a.password),
      mustChange: true,
    };
  }
  localStorage.setItem(STAFF_KEY, JSON.stringify(store));
  return store;
}

function setDemoSession(user) {
  if (user) localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  else localStorage.removeItem(SESSION_KEY);
  listeners.forEach((cb) => cb(user));
}

/**
 * Gives every user object the same shape: { role, name, mustChange, ... }.
 * Role comes from app_metadata, which users cannot edit (user_metadata they can,
 * so never trust it for roles). Anyone without a role is a citizen.
 */
function normalizeUser(u) {
  if (!u) return null;
  const role = u.role || u.app_metadata?.role || 'citizen';
  const isRoleUser = role === 'staff' || role === 'admin';
  const mustChange =
    u.mustChange !== undefined
      ? u.mustChange
      : isRoleUser && !u.user_metadata?.password_changed;
  return {
    ...u,
    role,
    name: u.name || u.user_metadata?.full_name || u.user_metadata?.name,
    mustChange,
  };
}

/* -------------------------------- citizen API ------------------------------ */
export async function signUp({ name, email, password }) {
  email = email.trim().toLowerCase();

  if (isDemoAuth) {
    const users = readJSON(USERS_KEY, {});
    if (users[email]) throw new Error('An account with this email already exists. Sign in instead.');
    users[email] = { name, email, hash: await sha256(password) };
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    const user = { id: `demo-${email}`, name, email, provider: 'email', role: 'citizen' };
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
  return { user: normalizeUser(data.user), needsEmailConfirmation: !data.session };
}

export async function signIn({ email, password }) {
  email = email.trim().toLowerCase();

  if (isDemoAuth) {
    const record = readJSON(USERS_KEY, {})[email];
    if (!record || record.hash !== (await sha256(password))) {
      throw new Error('Incorrect email or password.');
    }
    const user = { id: `demo-${email}`, name: record.name, email, provider: 'email', role: 'citizen' };
    setDemoSession(user);
    return { user };
  }

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return { user: normalizeUser(data.user) };
}

export async function signInWithGoogle() {
  if (isDemoAuth) {
    // Simulated Google sign-in so the flow can be demonstrated without credentials.
    const user = {
      id: 'demo-google-user',
      name: 'Demo Google User',
      email: 'demo.user@gmail.com',
      provider: 'google',
      role: 'citizen',
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

/* ----------------------------- staff / admin API --------------------------- */
// `role` is the card the person picked ('staff' | 'admin'). The account's real
// role must match it, so admin credentials cannot be used on the staff screen.
export async function signInWithRole({ role, username, password }) {
  const uname = username.trim().toLowerCase();
  const wrong = new Error('Incorrect username or password.');

  if (isDemoAuth) {
    const record = (await loadStaffStore())[uname];
    if (!record || record.role !== role || record.hash !== (await sha256(password))) throw wrong;
    const user = {
      id: `demo-${record.role}-${record.username}`,
      name: record.name,
      username: record.username,
      email: `${record.username}@${STAFF_EMAIL_DOMAIN}`,
      provider: 'username',
      role: record.role,
      mustChange: record.mustChange,
    };
    setDemoSession(user);
    return { user };
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email: usernameToEmail(uname),
    password,
  });
  if (error) throw wrong;
  const user = normalizeUser(data.user);
  if (user.role !== role) {
    await supabase.auth.signOut();
    throw wrong;
  }
  return { user };
}

export const ROLE_INFO = {
  staff: { label: 'ER staff: choose a new password for your account.' },
  admin: { label: 'Hospital admin: choose a new password for your account.' },
};

// Verifies the current password, saves the new one, and clears the "must change" flag.
export async function changeRolePassword(currentPassword, newPassword) {
  if (isDemoAuth) {
    const session = readJSON(SESSION_KEY, null);
    if (!session || !session.username) throw new Error('You are not signed in.');
    const store = await loadStaffStore();
    const record = store[session.username];
    if (!record || record.hash !== (await sha256(currentPassword))) {
      throw new Error('Current password is incorrect.');
    }
    record.hash = await sha256(newPassword);
    record.mustChange = false;
    localStorage.setItem(STAFF_KEY, JSON.stringify(store));
    setDemoSession({ ...session, mustChange: false });
    return;
  }

  const { data: sessionData } = await supabase.auth.getSession();
  const email = sessionData.session?.user?.email;
  if (!email) throw new Error('You are not signed in.');

  // Re-check the current password before allowing the change.
  const { error: authError } = await supabase.auth.signInWithPassword({
    email,
    password: currentPassword,
  });
  if (authError) throw new Error('Current password is incorrect.');

  const { error } = await supabase.auth.updateUser({
    password: newPassword,
    data: { password_changed: true },
  });
  if (error) throw error;
}

/* --------------------------------- session -------------------------------- */
export async function signOut() {
  if (isDemoAuth) return setDemoSession(null);
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getCurrentUser() {
  if (isDemoAuth) return normalizeUser(readJSON(SESSION_KEY, null));
  const { data } = await supabase.auth.getSession();
  return normalizeUser(data.session?.user ?? null);
}

// cb(user | null, event). Returns an unsubscribe function.
export function onAuthChange(cb) {
  if (isDemoAuth) {
    const handler = (user) => cb(normalizeUser(user), user ? 'SIGNED_IN' : 'SIGNED_OUT');
    listeners.add(handler);
    return () => listeners.delete(handler);
  }
  const { data } = supabase.auth.onAuthStateChange((event, session) =>
    cb(normalizeUser(session?.user ?? null), event)
  );
  return () => data.subscription.unsubscribe();
}