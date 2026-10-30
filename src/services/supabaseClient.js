import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl !== 'https://your-project.supabase.co' &&
  !supabaseUrl.includes('example')
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

if (!isSupabaseConfigured) {
  console.info(
    '%c[LIFE-LINK] DEMONSTRATION MODE ACTIVE%c\nSupabase credentials not configured in .env. Using high-fidelity IndexedDB offline data layer with synthetic records.',
    'background: #0f766e; color: #fff; font-weight: bold; padding: 2px 6px; border-radius: 4px;',
    'color: inherit;'
  );
}
