// src/components/common/AuthButton.jsx
// Drop this into your Navbar: shows "Sign in" or the user's name + "Sign out".
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn, LogOut } from 'lucide-react';
import { getCurrentUser, onAuthChange, signOut } from '../../services/authService';

export function AuthButton() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    let active = true;
    getCurrentUser().then((u) => active && setUser(u));
    const off = onAuthChange((u) => active && setUser(u));
    return () => {
      active = false;
      off();
    };
  }, []);

  if (!user) {
    return (
      <Link
        to="/auth"
        className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-700"
      >
        <LogIn className="h-4 w-4" /> Sign in
      </Link>
    );
  }

  const label = user.user_metadata?.full_name || user.name || user.email;
  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="max-w-[10rem] truncate text-slate-700" title={user.email}>{label}</span>
      <button
        onClick={async () => {
          await signOut();
          navigate('/auth');
        }}
        className="inline-flex items-center gap-1 rounded-lg border border-slate-300 px-2.5 py-1.5 text-slate-700 hover:bg-slate-100"
      >
        <LogOut className="h-4 w-4" /> Sign out
      </button>
    </div>
  );
}