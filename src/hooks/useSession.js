// src/hooks/useSession.js
import { useEffect, useState } from 'react';
import { getCurrentUser, onAuthChange } from '../services/authService';

export function useSession() {
  const [state, setState] = useState({ user: null, loading: true });

  useEffect(() => {
    let active = true;
    getCurrentUser().then((u) => active && setState({ user: u, loading: false }));
    const off = onAuthChange((u) => active && setState({ user: u, loading: false }));
    return () => {
      active = false;
      off();
    };
  }, []);

  return { user: state.user, role: state.user?.role ?? null, loading: state.loading };
}