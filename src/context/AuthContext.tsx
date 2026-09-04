import React, { createContext, useContext, useMemo, useState, useCallback } from 'react';

type User = { username: string };

type AuthContextValue = {
  user: User | null;
  login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// Simulated network delay so the Login lesson has a real loading state to
// assert against with Detox's `waitFor(...).toBeVisible()` / `toBeNotVisible()`.
const FAKE_LATENCY_MS = 700;

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = useCallback(async (username: string, password: string) => {
    await new Promise(resolve => setTimeout(resolve, FAKE_LATENCY_MS));

    if (!username.trim()) {
      return { success: false, error: 'Username is required' };
    }
    if (password.length < 4) {
      return { success: false, error: 'Password must be at least 4 characters' };
    }
    if (username.toLowerCase() === 'locked') {
      return { success: false, error: 'This account is locked. Contact support.' };
    }

    setUser({ username });
    return { success: true };
  }, []);

  const logout = useCallback(() => setUser(null), []);

  const value = useMemo(() => ({ user, login, logout }), [user, login, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
};
