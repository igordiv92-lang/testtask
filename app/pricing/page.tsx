'use client';

import React, { useState } from 'react';
import { useAuth } from '@/lib/auth/AuthContext';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Check, Loader2, Sparkles, CreditCard, Lock, User, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';

export default function PricingPage() {
  const { user, upgradePlan } = useAuth();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [modalOpen, setModalOpen] = useState(false);
  const [upgrading, setUpgrading] = useState(false);
  
  // Mock credit card state
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');

  const monthlyPrice = 19;
  const yearlyPrice = 15; // billed as $180/yr

  const handleOpenUpgrade = () => {
    if (!user) {
      toast.error('Please register or log in first to upgrade.');
      return;
    }
    if (user.plan === 'PRO') {
      toast.success('You are already a Pro subscriber!');
      return;
    }
    setModalOpen(true);
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cardNumber.length < 16 || expiry.length < 4 || cvc.length < 3) {
      toast.error('Please fill in valid card details.');
      return;
    }

    setUpgrading(true);
    try {
      await upgradePlan();
      toast.success('Payment successful! Your account has been upgraded to PRO.');
      setModalOpen(false);
      // Reset card details
      setCardNumber('');
      setExpiry('');
      setCvc('');
    } catch (err: any) {
      toast.error(err.message || 'Payment processing failed.');
    } finally {
      setUpgrading(false);
    }
  };

  const freeFeatures = [
    '5 email generations',
    'Standard response templates',
    '3 tone selections (Professional, Casual, Bold)',
    'Standard generation speed',
  ];

  const proFeatures = [
    'Unlimited email generations',
    'All premium tone selections',
    'Custom email length control',
    'Typewriter animation UI features',
    'Priority API server routing',
    '24/7 dedicated support',
  ];

  return (
    <>
      <Navbar />
      <main className="flex-1 py-16 px-4 bg-zinc-950 relative overflow-hidden">
        
        {/* Glow blobs */}
        <div className="absolute top-10 left-10 h-[300px] w-[300px] rounded-full bg-violet-600/5 glow-blob -z-10"></div>
        <div className="absolute bottom-10 right-10 h-[300px] w-[300px] rounded-full bg-indigo-600/5 glow-blob -z-10"></div>

        <div className="mx-auto max-w-5xl">
          
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-extrabold text-white tracking-tight mb-4">
              Simple, transparent pricing
            </h1>
            <p className="text-sm sm:text-base text-zinc-400 max-w-md mx-auto">
              Choose the plan that matches your workflow. Upgrade or downgrade at any time.
            </p>

            {/* Billing Cycle Toggle */}
            <div className="inline-flex items-center gap-2 mt-8 bg-zinc-900 border border-zinc-800 p-1.5 rounded-xl">
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  billingCycle === 'monthly'
                    ? 'bg-violet-600 text-white shadow-md'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle('yearly')}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  billingCycle === 'yearly'
                    ? 'bg-violet-600 text-white shadow-md'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Yearly (Save 20%)
              </button>
            </div>
          </div>

          {/* Pricing Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto items-stretch">
            
            {/* Free Plan Card */}
            <div className="glass-panel rounded-3xl p-8 border border-zinc-800 flex flex-col justify-between relative shadow-lg">
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Free Starter</h3>
                <p className="text-xs text-zinc-400 mb-6">Perfect for trying out VibeMail AI</p>
                <div className="flex items-baseline text-white mb-8">
                  <span className="text-5xl font-extrabold tracking-tight">$0</span>
                  <span className="text-sm text-zinc-500 font-semibold ml-2">/month</span>
                </div>

                <ul className="space-y-4 border-t border-zinc-900 pt-6">
                  {freeFeatures.map((f, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-violet-400 shrink-0" />
                      <span className="text-sm text-zinc-300">{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8 pt-4">
                {user && user.plan === 'FREE' ? (
                  <div className="w-full text-center py-3 text-sm font-semibold rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300">
                    Your Current Plan
                  </div>
                ) : (
                  <Link
                    href={user ? "/dashboard" : "/signup"}
                    className="block w-full text-center py-3 text-sm font-semibold rounded-xl border border-zinc-800 bg-zinc-900/50 hover:bg-zinc-900 hover:border-zinc-700 transition-all text-white"
                  >
                    {user ? "Go to Dashboard" : "Sign Up Free"}
                  </Link>
                )}
              </div>
            </div>

            {/* Pro Plan Card */}
            <div className="glass-panel rounded-3xl p-8 border-2 border-violet-600/60 flex flex-col justify-between relative shadow-xl shadow-violet-600/5">
              
              {/* Popular tag */}
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-violet-600 text-[10px] uppercase font-bold tracking-wider px-3.5 py-1 text-white shadow-md shadow-violet-500/10">
                Most Popular
              </div>

              <div>
                <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-1.5">
                  Vibe Pro
                  <Sparkles className="h-4 w-4 text-violet-400" />
                </h3>
                <p className="text-xs text-zinc-400 mb-6">For power users who write emails daily</p>
                <div className="flex items-baseline text-white mb-8">
                  <span className="text-5xl font-extrabold tracking-tight">
                    ${billingCycle === 'monthly' ? monthlyPrice : yearlyPrice}
                  </span>
                  <span className="text-sm text-zinc-500 font-semibold ml-2">/month</span>
                  {billingCycle === 'yearly' && (
                    <span className="text-[10px] text-zinc-500 ml-2 font-medium bg-zinc-900 px-2 py-0.5 border border-zinc-800 rounded">
                      Billed annually ($180)
                    </span>
                  )}
                </div>

                <ul className="space-y-4 border-t border-zinc-900 pt-6">
                  {proFeatures.map((f, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-violet-400 shrink-0" />
                      <span className="text-sm text-zinc-300">{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8 pt-4">
                {user && user.plan === 'PRO' ? (
                  <div className="w-full text-center py-3 text-sm font-semibold rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300">
                    Your Active Plan
                  </div>
                ) : (
                  <button
                    onClick={handleOpenUpgrade}
                    className="w-full py-3 text-sm font-semibold rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:from-violet-500 hover:to-indigo-500 hover:scale-[1.01] active:scale-[0.99] transition-all shadow-lg shadow-violet-500/20 cursor-pointer"
                  >
                    Upgrade to Pro
                  </button>
                )}
              </div>
            </div>

          </div>

        </div>

        {/* Upgrade Modal (Mock Stripe payment checkout flow) */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="w-full max-w-md glass-panel border border-zinc-800 rounded-3xl p-6 shadow-2xl relative">
              
              {/* Modal Close */}
              <button
                onClick={() => setModalOpen(false)}
                className="absolute top-4 right-4 text-zinc-500 hover:text-zinc-300 cursor-pointer"
              >
                ✕
              </button>

              <div className="text-center mb-6">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-violet-600/10 border border-violet-500/20 text-violet-400 mb-3">
                  <CreditCard className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-bold text-white">Upgrade to Vibe Pro</h3>
                <p className="text-xs text-zinc-400 mt-1">
                  Secure mock checkout — enter any valid details
                </p>
              </div>

              <form onSubmit={handleCheckout} className="space-y-4">
                
                {/* Simulated Order Summary */}
                <div className="bg-zinc-900/60 border border-zinc-900 rounded-xl p-3.5 text-xs text-zinc-400">
                  <div className="flex justify-between font-medium text-zinc-300 mb-1">
                    <span>Vibe Pro subscription ({billingCycle})</span>
                    <span>${billingCycle === 'monthly' ? monthlyPrice : yearlyPrice}.00/mo</span>
                  </div>
                  <div className="flex justify-between border-t border-zinc-800 mt-2 pt-2 font-bold text-white text-sm">
                    <span>Total due now</span>
                    <span>${billingCycle === 'monthly' ? monthlyPrice : yearlyPrice * 12}.00</span>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">
                    Card Number
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      maxLength={16}
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, ''))}
                      placeholder="4242 4242 4242 4242"
                      className="block w-full rounded-xl bg-zinc-900 border border-zinc-800/80 px-3 py-2 text-sm text-white placeholder-zinc-600 focus:border-violet-500 focus:outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={4}
                      value={expiry}
                      onChange={(e) => setExpiry(e.target.value.replace(/\D/g, ''))}
                      placeholder="MM/YY"
                      className="block w-full rounded-xl bg-zinc-900 border border-zinc-800/80 px-3 py-2 text-sm text-white placeholder-zinc-600 focus:border-violet-500 focus:outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">
                      CVC / CVV
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={3}
                      value={cvc}
                      onChange={(e) => setCvc(e.target.value.replace(/\D/g, ''))}
                      placeholder="123"
                      className="block w-full rounded-xl bg-zinc-900 border border-zinc-800/80 px-3 py-2 text-sm text-white placeholder-zinc-600 focus:border-violet-500 focus:outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 text-[10px] text-zinc-500 mt-2">
                  <Lock className="h-3.5 w-3.5 shrink-0" />
                  <span>Payments are processed securely via mock SSL protocol.</span>
                </div>

                <button
                  type="submit"
                  disabled={upgrading}
                  className="w-full mt-4 flex items-center justify-center rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 py-3 text-sm font-semibold text-white shadow-lg hover:from-violet-500 hover:to-indigo-500 transition-all cursor-pointer"
                >
                  {upgrading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing payment...
                    </>
                  ) : (
                    `Pay $${billingCycle === 'monthly' ? monthlyPrice : yearlyPrice * 12}.00`
                  )}
                </button>
              </form>

            </div>
          </div>
        )}

      </main>
      <Footer />
    </>
  );
}
