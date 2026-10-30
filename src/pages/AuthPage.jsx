import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, ROLES } from '../contexts/AuthContext';
import { ShieldCheck, User, Building2, Stethoscope, Lock, Mail, ArrowRight, CheckCircle2 } from 'lucide-react';

export function AuthPage() {
  const { loginDemo, role, user, isSupabaseConfigured } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authMsg, setAuthMsg] = useState(null);

  const handleDemoSignIn = (selectedRole) => {
    loginDemo(selectedRole);
    if (selectedRole === ROLES.HOSPITAL_ADMIN) {
      navigate('/admin');
    } else if (selectedRole === ROLES.HEALTHCARE_STAFF) {
      navigate('/staff/scan');
    } else {
      navigate('/profile');
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!email) return;
    // In demo mode, sign in as public or matched role
    loginDemo(ROLES.PUBLIC);
    setAuthMsg('Authenticated in local demonstration mode.');
    setTimeout(() => navigate('/profile'), 600);
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12 space-y-8">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-800 flex items-center justify-center mx-auto">
          <Lock className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          LIFE-LINK Portal Access
        </h1>
        <p className="text-xs text-slate-500">
          Sign in to manage your emergency profile, staff workflows, or hospital facilities.
        </p>
      </div>

      {/* 1-Click Role-Based Demo Login */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-4">
        <div>
          <span className="text-[10px] font-black uppercase tracking-wider text-teal-700 block mb-1">
            Quick Testing Access
          </span>
          <h2 className="font-bold text-sm text-slate-900">
            Sign In with a Demonstration Role
          </h2>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Test role-based permissions with pre-configured synthetic profiles.
          </p>
        </div>

        <div className="space-y-2.5">
          <button
            type="button"
            onClick={() => handleDemoSignIn(ROLES.PUBLIC)}
            className="w-full text-left p-3.5 rounded-2xl border border-slate-200 hover:border-teal-500 hover:bg-teal-50/40 transition flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center">
                <User className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold text-xs text-slate-900 block">Public Citizen / Patient</span>
                <span className="text-[10px] text-slate-500">Emergency Profile & QR Code</span>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-teal-700 transition" />
          </button>

          <button
            type="button"
            onClick={() => handleDemoSignIn(ROLES.HEALTHCARE_STAFF)}
            className="w-full text-left p-3.5 rounded-2xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/40 transition flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                <Stethoscope className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold text-xs text-slate-900 block">Emergency Paramedic / Staff</span>
                <span className="text-[10px] text-slate-500">Scan QR & Register Unconscious Intake</span>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-700 transition" />
          </button>

          <button
            type="button"
            onClick={() => handleDemoSignIn(ROLES.HOSPITAL_ADMIN)}
            className="w-full text-left p-3.5 rounded-2xl border border-slate-200 hover:border-sky-500 hover:bg-sky-50/40 transition flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-sky-100 text-sky-800 flex items-center justify-center">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold text-xs text-slate-900 block">Hospital Administrator</span>
                <span className="text-[10px] text-slate-500">Manage Bed Counts & Drug Inventory</span>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-sky-700 transition" />
          </button>
        </div>
      </div>

      {/* Standard Email / Password Form */}
      <form onSubmit={handleFormSubmit} className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-4">
        <h3 className="font-bold text-xs text-slate-700 uppercase tracking-wider">
          Standard Sign In
        </h3>

        <div>
          <label className="text-xs font-semibold text-slate-700 block mb-1">Email Address</label>
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@example.com"
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-600"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-700 block mb-1">Password</label>
          <div className="relative">
            <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-600"
            />
          </div>
        </div>

        {authMsg && (
          <div className="text-xs text-emerald-800 bg-emerald-50 p-2.5 rounded-xl border border-emerald-200 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{authMsg}</span>
          </div>
        )}

        <button
          type="submit"
          className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition shadow-sm"
        >
          Sign In
        </button>
      </form>
    </div>
  );
}
