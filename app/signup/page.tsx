'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth/AuthContext';
import { useI18n } from '@/lib/i18n/I18nContext';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Sparkles, Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function SignupPage() {
  const { signup } = useAuth();
  const { t } = useI18n();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !confirmPassword) {
      toast.error(t('fillAllFieldsError'));
      return;
    }

    if (password.length < 6) {
      toast.error(t('passwordMinLengthError'));
      return;
    }

    if (password !== confirmPassword) {
      toast.error(t('passwordMismatchError'));
      return;
    }

    setSubmitting(true);
    try {
      await signup(email, password);
      toast.success('Successfully created account and logged in!');
    } catch (err: any) {
      toast.error(err.message || 'Failed to create account.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="flex-1 flex items-center justify-center py-20 px-4 relative overflow-hidden bg-zinc-950 dot-grid">
        
        {/* Decorative background blobs */}
        <div className="absolute top-1/4 left-1/4 h-[300px] w-[300px] rounded-full bg-violet-600/10 glow-blob -z-10"></div>
        <div className="absolute bottom-1/4 right-1/4 h-[250px] w-[250px] rounded-full bg-indigo-600/10 glow-blob -z-10"></div>

        <div className="w-full max-w-md">
          <div className="premium-card rounded-[32px] p-8 shadow-2xl relative border border-zinc-900">
            
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-500 shadow-md shadow-violet-500/20 mb-4 animate-bounce">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-white mb-2 font-display">{t('signupTitle')}</h1>
              <p className="text-sm text-zinc-400">{t('signupSubtitle')}</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                  {t('emailLabel')}
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Mail className="h-4 w-4 text-zinc-500" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="block w-full rounded-xl bg-zinc-950 border border-zinc-900 px-3 py-2.5 pl-10 text-sm text-white placeholder-zinc-650 focus:border-violet-500 focus:outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                  {t('passwordLabel')}
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Lock className="h-4 w-4 text-zinc-500" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min. 6 characters"
                    className="block w-full rounded-xl bg-zinc-950 border border-zinc-900 px-3 py-2.5 pl-10 pr-10 text-sm text-white placeholder-zinc-650 focus:border-violet-500 focus:outline-none transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-zinc-500 hover:text-zinc-300 focus:outline-none cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                  {t('confirmPasswordLabel')}
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Lock className="h-4 w-4 text-zinc-500" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat password"
                    className="block w-full rounded-xl bg-zinc-950 border border-zinc-900 px-3 py-2.5 pl-10 pr-10 text-sm text-white placeholder-zinc-650 focus:border-violet-500 focus:outline-none transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full flex items-center justify-center rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 py-3.5 text-sm font-semibold text-white shadow-lg hover:from-violet-500 hover:to-indigo-500 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
              >
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t('signupCreating')}
                  </>
                ) : (
                  t('signupBtn')
                )}
              </button>
            </form>

            {/* Switch Mode Footer */}
            <div className="mt-8 text-center border-t border-zinc-900 pt-6">
              <p className="text-sm text-zinc-400">
                {t('alreadyHaveAccount')}{' '}
                <Link href="/login" className="text-violet-400 hover:text-violet-300 font-semibold transition-colors">
                  {t('signInLink')}
                </Link>
              </p>
            </div>

          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
