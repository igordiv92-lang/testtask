'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthService, UserSession } from './service';
import { useRouter, usePathname } from 'next/navigation';

interface AuthContextType {
  user: UserSession | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  triggerCreditDeduction: () => Promise<void>;
  upgradePlan: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserSession | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  // Load current session on mount and when pathname changes
  useEffect(() => {
    const session = AuthService.getCurrentSession();
    setUser(session);
    setLoading(false);
  }, [pathname]);

  // Route protection rules:
  // If not logged in and trying to access dashboard/profile, redirect to login.
  // If logged in and trying to access login/signup, redirect to dashboard.
  useEffect(() => {
    if (loading) return;

    const session = AuthService.getCurrentSession();
    const protectedRoutes = ['/dashboard', '/profile'];
    const authRoutes = ['/login', '/signup'];

    const isProtectedRoute = protectedRoutes.some(route => pathname?.startsWith(route));
    const isAuthRoute = authRoutes.some(route => pathname?.startsWith(route));

    if (!session && isProtectedRoute) {
      router.push('/login');
    } else if (session && isAuthRoute) {
      router.push('/dashboard');
    }
  }, [user, loading, pathname, router]);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const session = await AuthService.login(email, password);
      setUser(session);
      router.push('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const signup = async (email: string, password: string) => {
    setLoading(true);
    try {
      const session = await AuthService.signup(email, password);
      setUser(session);
      router.push('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await AuthService.logout();
      setUser(null);
      router.push('/');
    } finally {
      setLoading(false);
    }
  };

  const triggerCreditDeduction = async () => {
    if (!user) return;
    const updated = await AuthService.deductCredit(user.email);
    setUser(updated);
  };

  const upgradePlan = async () => {
    if (!user) return;
    const updated = await AuthService.upgradeToPremium(user.email);
    setUser(updated);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, triggerCreditDeduction, upgradePlan }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
