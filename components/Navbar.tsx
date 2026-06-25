'use client';

import React, { useState } from 'react';
import Link from 'next/navigation';
import { useAuth } from '@/lib/auth/AuthContext';
import { Menu, X, Mail, Sparkles, User, LogOut, CreditCard } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full glass-panel border-b border-zinc-800/80 bg-zinc-950/70 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tight text-white group">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-500 shadow-md shadow-violet-500/20 transition-transform group-hover:scale-105">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <span className="bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent group-hover:to-violet-400 transition-all">
                VibeMail<span className="text-violet-500 font-extrabold">.AI</span>
              </span>
            </Link>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-sm font-medium text-zinc-300 hover:text-white transition-colors">
              Home
            </Link>
            <Link href="/pricing" className="text-sm font-medium text-zinc-300 hover:text-white transition-colors">
              Pricing
            </Link>
            {user && (
              <>
                <Link href="/dashboard" className="text-sm font-medium text-zinc-300 hover:text-white transition-colors flex items-center gap-1">
                  <Mail className="h-4 w-4 text-violet-400" />
                  Dashboard
                </Link>
                <Link href="/profile" className="text-sm font-medium text-zinc-300 hover:text-white transition-colors flex items-center gap-1">
                  <User className="h-4 w-4 text-violet-400" />
                  Profile
                </Link>
              </>
            )}
          </div>

          {/* Desktop Auth Actions */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-xs">
                  <span className={`h-2 w-2 rounded-full ${user.plan === 'PRO' ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                  <span className="font-semibold text-zinc-300 uppercase">{user.plan}</span>
                  {user.plan === 'FREE' && (
                    <span className="text-zinc-500 border-l border-zinc-800 pl-2">
                      {user.creditsMax - user.creditsUsed} left
                    </span>
                  )}
                </div>
                <button
                  onClick={logout}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-zinc-800 text-sm font-medium text-zinc-400 hover:text-white hover:bg-zinc-900 transition-all cursor-pointer"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </button>
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-sm font-medium text-zinc-300 hover:text-white transition-colors"
                >
                  Log In
                </Link>
                <Link
                  href="/signup"
                  className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-violet-500/20 hover:from-violet-500 hover:to-indigo-500 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  Get Started Free
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center rounded-xl p-2 text-zinc-400 hover:bg-zinc-900 hover:text-white focus:outline-none transition-colors"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-zinc-800/80 bg-zinc-950/95 backdrop-blur-lg">
          <div className="space-y-1 px-2 pb-4 pt-3">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block rounded-xl px-4 py-2.5 text-base font-medium text-zinc-300 hover:bg-zinc-900 hover:text-white transition-all"
            >
              Home
            </Link>
            <Link
              href="/pricing"
              onClick={() => setMobileMenuOpen(false)}
              className="block rounded-xl px-4 py-2.5 text-base font-medium text-zinc-300 hover:bg-zinc-900 hover:text-white transition-all"
            >
              Pricing
            </Link>
            {user && (
              <>
                <Link
                  href="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block rounded-xl px-4 py-2.5 text-base font-medium text-zinc-300 hover:bg-zinc-900 hover:text-white transition-all"
                >
                  Dashboard
                </Link>
                <Link
                  href="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block rounded-xl px-4 py-2.5 text-base font-medium text-zinc-300 hover:bg-zinc-900 hover:text-white transition-all"
                >
                  Profile
                </Link>
              </>
            )}

            <div className="border-t border-zinc-900 mt-4 pt-4 px-4">
              {user ? (
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between rounded-xl bg-zinc-900 border border-zinc-800 p-3">
                    <div className="flex items-center gap-2">
                      <span className={`h-2.5 w-2.5 rounded-full ${user.plan === 'PRO' ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                      <span className="font-semibold text-zinc-300 text-sm uppercase">{user.plan} Account</span>
                    </div>
                    {user.plan === 'FREE' && (
                      <span className="text-xs text-zinc-500 font-medium">
                        {user.creditsMax - user.creditsUsed} / {user.creditsMax} credits
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-zinc-800 py-2.5 text-sm font-semibold text-zinc-400 hover:text-white hover:bg-zinc-900 transition-all cursor-pointer"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex w-full items-center justify-center rounded-xl border border-zinc-800 py-2.5 text-sm font-semibold text-zinc-300 hover:text-white hover:bg-zinc-900 transition-all"
                  >
                    Log In
                  </Link>
                  <Link
                    href="/signup"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 py-2.5 text-sm font-semibold text-white shadow-lg transition-all hover:from-violet-500 hover:to-indigo-500"
                  >
                    Get Started Free
                  </Link>
                </div>
              )}
            </div>

          </div>
        </div>
      )}
    </nav>
  );
};
