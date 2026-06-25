'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth/AuthContext';
import { useI18n } from '@/lib/i18n/I18nContext';
import { useTheme } from '@/lib/theme/ThemeContext';
import { Menu, X, Mail, Sparkles, User, LogOut, CreditCard, Sun, Moon } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const { locale, setLocale, t } = useI18n();
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const renderLanguageToggle = () => (
    <div className="flex bg-zinc-900 border border-zinc-800 rounded-lg p-0.5 text-xs font-semibold">
      <button
        onClick={() => setLocale('en')}
        className={`px-2 py-1 rounded-md transition-all cursor-pointer ${
          locale === 'en' ? 'bg-violet-600 text-white shadow-sm' : 'text-zinc-400 hover:text-zinc-200'
        }`}
      >
        EN
      </button>
      <button
        onClick={() => setLocale('ru')}
        className={`px-2 py-1 rounded-md transition-all cursor-pointer ${
          locale === 'ru' ? 'bg-violet-600 text-white shadow-sm' : 'text-zinc-400 hover:text-zinc-200'
        }`}
      >
        RU
      </button>
    </div>
  );

  const renderThemeToggle = () => (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-xl border border-zinc-800 bg-zinc-900/40 hover:bg-zinc-900 text-zinc-400 hover:text-white transition-all cursor-pointer flex items-center justify-center"
      aria-label="Toggle Theme"
    >
      {theme === 'dark' ? (
        <Sun className="h-4 w-4 text-amber-400" />
      ) : (
        <Moon className="h-4 w-4 text-violet-400" />
      )}
    </button>
  );

  return (
    <div className="sticky top-4 z-50 w-full px-4 sm:px-6 lg:px-8 animate-fade-in">
      <nav className="mx-auto max-w-7xl premium-card bg-zinc-950/65 backdrop-blur-md rounded-2xl shadow-lg border border-zinc-800/80">
        <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tight text-white group">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-500 shadow-md shadow-violet-500/20 transition-transform group-hover:scale-105">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <span className="bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent group-hover:to-violet-400 transition-all font-display">
                VibeMail<span className="text-violet-500 font-extrabold">.AI</span>
              </span>
            </Link>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-sm font-medium text-zinc-300 hover:text-white transition-colors">
              {t('navHome')}
            </Link>
            <Link href="/pricing" className="text-sm font-medium text-zinc-300 hover:text-white transition-colors">
              {t('navPricing')}
            </Link>
            {user && (
              <>
                <Link href="/dashboard" className="text-sm font-medium text-zinc-300 hover:text-white transition-colors flex items-center gap-1.5">
                  <Mail className="h-4 w-4 text-violet-400" />
                  {t('navDashboard')}
                </Link>
                <Link href="/profile" className="text-sm font-medium text-zinc-300 hover:text-white transition-colors flex items-center gap-1.5">
                  <User className="h-4 w-4 text-violet-400" />
                  {t('navProfile')}
                </Link>
              </>
            )}
          </div>

          {/* Desktop Auth Actions */}
          <div className="hidden md:flex items-center gap-4">
            
            {/* Language Switcher */}
            {renderLanguageToggle()}

            {/* Theme Switcher */}
            {renderThemeToggle()}

            {user ? (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-[10px] font-mono">
                  <span className={`h-2 w-2 rounded-full ${user.plan === 'PRO' ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                  <span className="font-semibold text-zinc-300 uppercase">
                    {user.plan === 'PRO' ? t('proAccount') : t('freeAccount')}
                  </span>
                  {user.plan === 'FREE' && (
                    <span className="text-zinc-500 border-l border-zinc-800 pl-2">
                      {user.creditsMax - user.creditsUsed} {t('creditsLeft')}
                    </span>
                  )}
                </div>
                <button
                  onClick={logout}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-zinc-800 text-xs font-semibold text-zinc-400 hover:text-white hover:bg-zinc-900 transition-all cursor-pointer"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  {t('navSignOut')}
                </button>
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-sm font-medium text-zinc-300 hover:text-white transition-colors"
                >
                  {t('navLogin')}
                </Link>
                <Link
                  href="/signup"
                  className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-violet-500/20 hover:from-violet-500 hover:to-indigo-500 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  {t('navGetStarted')}
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-3">
            {renderThemeToggle()}
            {renderLanguageToggle()}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center rounded-xl p-2 text-zinc-400 hover:bg-zinc-900 hover:text-white focus:outline-none transition-colors"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

        </div>

        {/* Mobile Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-zinc-900 bg-zinc-950/95 backdrop-blur-lg rounded-b-2xl">
            <div className="space-y-1 px-2 pb-4 pt-3">
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="block rounded-xl px-4 py-2.5 text-base font-medium text-zinc-300 hover:bg-zinc-900 hover:text-white transition-all"
              >
                {t('navHome')}
              </Link>
              <Link
                href="/pricing"
                onClick={() => setMobileMenuOpen(false)}
                className="block rounded-xl px-4 py-2.5 text-base font-medium text-zinc-300 hover:bg-zinc-900 hover:text-white transition-all"
              >
                {t('navPricing')}
              </Link>
              {user && (
                <>
                  <Link
                    href="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block rounded-xl px-4 py-2.5 text-base font-medium text-zinc-300 hover:bg-zinc-900 hover:text-white transition-all"
                  >
                    {t('navDashboard')}
                  </Link>
                  <Link
                    href="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block rounded-xl px-4 py-2.5 text-base font-medium text-zinc-300 hover:bg-zinc-900 hover:text-white transition-all"
                  >
                    {t('navProfile')}
                  </Link>
                </>
              )}

              <div className="border-t border-zinc-900 mt-4 pt-4 px-4">
                {user ? (
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between rounded-xl bg-zinc-900 border border-zinc-800 p-3">
                      <div className="flex items-center gap-2">
                        <span className={`h-2.5 w-2.5 rounded-full ${user.plan === 'PRO' ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                        <span className="font-semibold text-zinc-300 text-sm uppercase">
                          {user.plan === 'PRO' ? t('proAccount') : t('freeAccount')}
                        </span>
                      </div>
                      {user.plan === 'FREE' && (
                        <span className="text-xs text-zinc-500 font-medium">
                          {user.creditsMax - user.creditsUsed} / {user.creditsMax}
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
                      {t('navSignOut')}
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    <Link
                      href="/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex w-full items-center justify-center rounded-xl border border-zinc-800 py-2.5 text-sm font-semibold text-zinc-300 hover:text-white hover:bg-zinc-900 transition-all"
                    >
                      {t('navLogin')}
                    </Link>
                    <Link
                      href="/signup"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 py-2.5 text-sm font-semibold text-white shadow-lg transition-all"
                    >
                      {t('navGetStarted')}
                    </Link>
                  </div>
                )}
              </div>

            </div>
          </div>
        )}
      </nav>
    </div>
  );
};
