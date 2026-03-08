import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Role =
  | 'admin'
  | 'rd'
  | 'packing'
  | 'production'
  | 'marketing';

const ROLE_LABELS: Record<Role, string> = {
  admin: 'Admin',
  rd: 'R&D Team',
  packing: 'Packing Team',
  production: 'Production Manager',
  marketing: 'Marketing Team',
};

const STORAGE_KEY = 'ablos_auth';

interface AuthState {
  user: string | null;
  role: Role | null;
}

interface AuthContextType extends AuthState {
  login: (role: Role) => void;
  logout: () => void;
  isAuthenticated: boolean;
  roleLabel: string | null;
}

const AuthContext = createContext<AuthContextType | null>(null);

function loadFromStorage(): AuthState {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return { user: null, role: null };
    const data = JSON.parse(raw) as AuthState;
    return { user: data.user, role: data.role };
  } catch {
    return { user: null, role: null };
  }
}

function saveToStorage(state: AuthState) {
  try {
    if (state.user && state.role) {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } else {
      sessionStorage.removeItem(STORAGE_KEY);
    }
  } catch {
    // ignore
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>(() => loadFromStorage());

  useEffect(() => {
    saveToStorage(state);
  }, [state]);

  const login = (role: Role) => {
    const label = ROLE_LABELS[role];
    setState({ user: label, role });
  };

  const logout = () => {
    setState({ user: null, role: null });
  };

  const value: AuthContextType = {
    ...state,
    login,
    logout,
    isAuthenticated: !!state.user && !!state.role,
    roleLabel: state.role ? ROLE_LABELS[state.role] : null,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

export { ROLE_LABELS };
