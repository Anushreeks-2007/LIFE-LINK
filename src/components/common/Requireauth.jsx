import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useSession } from '../../hooks/useSession';

// <RequireAuth />                 any signed-in user
// <RequireAuth roles={['admin']} /> only those roles
export function RequireAuth({ roles }) {
  const { user, loading } = useSession();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-slate-500">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  // Not signed in: ask for the role first.
  if (!user) return <Navigate to="/select-role" state={{ from: location }} replace />;

  // Staff/admin still on the default password must change it first.
  // Delete this block if you want the change to be optional.
  if (user.mustChange && location.pathname !== '/change-password') {
    return <Navigate to="/change-password" replace />;
  }

  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />;

  return <Outlet />;
}