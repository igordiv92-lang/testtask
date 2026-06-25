'use client';

import React from 'react';
import { useAuth } from '@/lib/auth/AuthContext';
import { useI18n } from '@/lib/i18n/I18nContext';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { 
  User, Mail, Calendar, Shield, CreditCard, 
  LogOut, ArrowRight, Sparkles, CheckCircle2 
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const { locale, t } = useI18n();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success(t('logoutSuccess'));
    } catch {
      toast.error(locale === 'ru' ? 'Не удалось выйти из системы.' : 'Failed to log out.');
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center text-zinc-400">
        <span>{t('loadingAccount')}</span>
      </div>
    );
  }

  // Calculate percentage of credits used
  const creditsLeft = user.creditsMax - user.creditsUsed;
  const creditsPercentage = Math.min(100, Math.max(0, (user.creditsUsed / user.creditsMax) * 100));

  return (
    <>
      <Navbar />
      <main className="flex-1 py-16 px-4 bg-zinc-950 relative overflow-hidden">
        
        {/* Glow blobs */}
        <div className="absolute top-1/4 left-1/4 h-[300px] w-[300px] rounded-full bg-violet-600/5 glow-blob -z-10"></div>
        <div className="absolute bottom-1/4 right-1/4 h-[300px] w-[300px] rounded-full bg-indigo-600/5 glow-blob -z-10"></div>

        <div className="mx-auto max-w-3xl">
          
          <h1 className="text-3xl font-extrabold text-white mb-2">{t('myProfile')}</h1>
          <p className="text-sm text-zinc-400 mb-8">{t('profileSubtitle')}</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
            
            {/* Left Card - User details */}
            <div className="md:col-span-1 glass-panel border border-zinc-900 rounded-3xl p-6 text-center">
              
              {/* Avatar placeholder */}
              <div className="mx-auto h-20 w-20 rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-500 shadow-lg shadow-violet-500/20 flex items-center justify-center text-white mb-4">
                <User className="h-10 w-10" />
              </div>

              <h3 className="font-bold text-white text-base truncate">{user.email.split('@')[0]}</h3>
              <p className="text-xs text-zinc-500 truncate mb-4">{user.email}</p>

              {/* Status Badge */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-semibold text-zinc-300 uppercase mb-6">
                <span className={`h-1.5 w-1.5 rounded-full ${user.plan === 'PRO' ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                {user.plan === 'PRO' ? t('proAccount') : t('freeAccount')}
              </div>

              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 rounded-xl border border-zinc-800 hover:border-zinc-700 py-2.5 text-xs font-semibold text-zinc-400 hover:text-white hover:bg-zinc-900 transition-all cursor-pointer"
              >
                <LogOut className="h-4 w-4" />
                {t('navSignOut')}
              </button>

            </div>

            {/* Right Panel - Stats & Limits */}
            <div className="md:col-span-2 space-y-6">
              
              {/* Card: Account details list */}
              <div className="glass-panel border border-zinc-900 rounded-3xl p-6 space-y-4">
                <h4 className="text-sm font-bold text-white border-b border-zinc-900 pb-3">
                  {locale === 'ru' ? 'Информация об аккаунте' : 'Account Information'}
                </h4>
                
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="h-4 w-4 text-zinc-500" />
                  <div className="flex-1 flex justify-between">
                    <span className="text-zinc-500">{t('emailLabel')}</span>
                    <span className="text-zinc-300 font-semibold">{user.email}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-sm">
                  <Calendar className="h-4 w-4 text-zinc-500" />
                  <div className="flex-1 flex justify-between">
                    <span className="text-zinc-500">{t('joinedDate')}</span>
                    <span className="text-zinc-300 font-semibold">
                      {locale === 'ru' ? '25 июня 2026 г.' : 'June 25, 2026'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-sm">
                  <Shield className="h-4 w-4 text-zinc-500" />
                  <div className="flex-1 flex justify-between">
                    <span className="text-zinc-500">{t('securityTier')}</span>
                    <span className="text-zinc-300 font-semibold flex items-center gap-1">
                      {t('standardSsl')}
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                    </span>
                  </div>
                </div>
              </div>

              {/* Card: Credits tracker */}
              <div className="glass-panel border border-zinc-900 rounded-3xl p-6">
                <h4 className="text-sm font-bold text-white mb-4">
                  {locale === 'ru' ? 'Использование кредитов' : 'Credit Usage'}
                </h4>
                
                {user.plan === 'PRO' ? (
                  <div className="bg-zinc-900/60 border border-zinc-900 rounded-2xl p-4 flex items-center gap-3">
                    <Sparkles className="h-6 w-6 text-violet-400" />
                    <div>
                      <h5 className="text-sm font-bold text-white">
                        {locale === 'ru' ? 'Безлимитный доступ к генерации' : 'Unlimited Generation Access'}
                      </h5>
                      <p className="text-xs text-zinc-500 mt-0.5">{t('usageProDesc')}</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex justify-between items-end text-xs font-semibold uppercase tracking-wider">
                      <span className="text-zinc-500">{t('usageUsed')}</span>
                      <span className="text-zinc-300">
                        {locale === 'ru' ? `${user.creditsUsed} / ${user.creditsMax} кредитов` : `${user.creditsUsed} / ${user.creditsMax} credits`}
                      </span>
                    </div>

                    {/* Progress Bar wrapper */}
                    <div className="w-full bg-zinc-900 h-2.5 rounded-full overflow-hidden border border-zinc-850">
                      <div 
                        className="bg-gradient-to-r from-violet-500 to-indigo-500 h-full rounded-full transition-all duration-500"
                        style={{ width: `${creditsPercentage}%` }}
                      ></div>
                    </div>

                    <p className="text-xs text-zinc-500 leading-relaxed">
                      {t('usageDesc', { credits: creditsLeft })}
                    </p>

                    {creditsLeft <= 2 && (
                      <Link
                        href="/pricing"
                        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-xs font-bold text-white py-3 shadow-md transition-all"
                      >
                        {t('upgradeUnlimitedBtn')}
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    )}
                  </div>
                )}
              </div>

            </div>

          </div>

        </div>
      </main>
      <Footer />
    </>
  );
}
