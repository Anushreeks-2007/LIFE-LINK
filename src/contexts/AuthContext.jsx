import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../services/supabaseClient';

const AuthContext = createContext(null);

export const ROLES = {
  PUBLIC: 'public',
  HOSPITAL_ADMIN: 'hospital_admin',
  HEALTHCARE_STAFF: 'healthcare_staff',
};

const DEFAULT_DEMO_USERS = {
  [ROLES.PUBLIC]: {
    id: 'user-public-001',
    email: 'citizen@lifelink.demo',
    displayName: 'Rahul Sharma (Public Citizen)',
    role: ROLES.PUBLIC,
    assignedHospitalId: null,
  },
  [ROLES.HOSPITAL_ADMIN]: {
    id: 'user-admin-001',
    email: 'admin.apex@lifelink.demo',
    displayName: 'Dr. Neha Sen (Apex Hospital Administrator)',
    role: ROLES.HOSPITAL_ADMIN,
    assignedHospitalId: 'hosp-001', // Apex Trauma
    hospitalName: 'Apex Trauma & Emergency Institute',
  },
  [ROLES.HEALTHCARE_STAFF]: {
    id: 'user-staff-001',
    email: 'paramedic.patil@lifelink.demo',
    displayName: 'Paramedic S. Patil (EMS Unit 4 / ER Staff)',
    role: ROLES.HEALTHCARE_STAFF,
    assignedHospitalId: 'hosp-001',
    hospitalName: 'Apex Trauma & Emergency Institute',
    staffBadge: 'EMS-KA-4091',
  },
};

export function AuthProvider({ children }) {
  const [role, setRole] = useState(() => {
    return localStorage.getItem('lifelink_demo_role') || ROLES.PUBLIC;
  });

  const [user, setUser] = useState(() => {
    return DEFAULT_DEMO_USERS[role] || DEFAULT_DEMO_USERS[ROLES.PUBLIC];
  });

  const [isLoading, setIsLoading] = useState(false);

  // Sync state when role changes in demo mode
  const switchDemoRole = (newRole) => {
    if (DEFAULT_DEMO_USERS[newRole]) {
      setRole(newRole);
      setUser(DEFAULT_DEMO_USERS[newRole]);
      localStorage.setItem('lifelink_demo_role', newRole);
    }
  };

  const loginDemo = (selectedRole) => {
    switchDemoRole(selectedRole);
  };

  const logout = async () => {
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    }
    switchDemoRole(ROLES.PUBLIC);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        switchDemoRole,
        loginDemo,
        logout,
        isLoading,
        isSupabaseConfigured,
        isPublic: role === ROLES.PUBLIC,
        isAdmin: role === ROLES.HOSPITAL_ADMIN,
        isStaff: role === ROLES.HEALTHCARE_STAFF,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
