// src/components/common/RequireAuth.jsx
// Wrap routes with this to force login. Unauthenticated visitors are sent to /auth
// and returned to the page they wanted after signing in.
import { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { getCurrentUser, onAuthChange } from '../../services/authService';

export function RequireAuth({ children }) {
  const location = useLocation();
  const [user, setUser] = useState(undefined); // undefined = still checking

  useEffect(() => {
    let active = true;
    getCurrentUser().then((u) => active && setUser(u));
    const off = onAuthChange((u) => active && setUser(u));
    return () => {
      active = false;
      off();
    };
  }, []);

  if (user === undefined) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-slate-500">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }
  if (!user) return <Navigate to="/auth" state={{ from: location }} replace />;
  return children;
}