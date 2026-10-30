// src/components/common/AuthButton.jsx
// Shows the signed-in user as a round badge with their initials, plus a sign-out icon.
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { useSession } from '../../hooks/useSession';
import { signOut } from '../../services/authService';

const AVATAR_COLORS = {
  admin: 'bg-sky-600',
  staff: 'bg-emerald-600',
  citizen: 'bg-teal-700',
};

function getInitials(user) {
  const source = (user?.name || user?.username || user?.email || '?').trim();
  const words = source.split(/[\s._@-]+/).filter(Boolean);
  if (words.length === 0) return '?';
  const first = words[0][0];
  const last = words.length > 1 ? words[words.length - 1][0] : '';
  return (first + last).toUpperCase();
}

export function AuthButton() {
  const { user, role } = useSession();
  const navigate = useNavigate();

  if (!user) return null;

  const displayName = user.name || user.email || 'Account';
  const color = AVATAR_COLORS[role] || AVATAR_COLORS.citizen;
  const avatarCls = `flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white ${color}`;
  const isRoleUser = role === 'staff' || role === 'admin';

  const handleSignOut = async () => {
    try {
      await signOut();
    } finally {
      navigate('/select-role', { replace: true });
    }
  };

  return (
    <div className="flex items-center gap-2">
      {isRoleUser ? (
        // Staff and admin can tap their badge to change their password.
        <Link
          to="/change-password"
          title={`${displayName}: change password`}
          aria-label={`${displayName}: change password`}
          className={`${avatarCls} focus:outline-none focus:ring-2 focus:ring-teal-600 focus:ring-offset-2`}
        >
          {getInitials(user)}
        </Link>
      ) : (
        <span title={displayName} aria-label={displayName} className={avatarCls}>
          {getInitials(user)}
        </span>
      )}

      <button
        type="button"
        onClick={handleSignOut}
        title="Sign out"
        aria-label="Sign out"
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-600"
      >
        <LogOut className="h-4 w-4" />
      </button>
    </div>
  );
}