'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth/AuthContext';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { 
  Sparkles, Zap, ArrowRight, Shield, Globe, Cpu, 
  MessageSquare, ChevronDown, CheckCircle2, ChevronRight 
} from 'lucide-react';

const TONES_DEMO = [
  { name: 'Professional', text: "Dear Team,\n\nI am writing to formally request a status update on the project deliverables. Your prompt attention to this matter is highly appreciated.\n\nBest regards,\nAlex" },
  { name: 'Casual', text: "Hey guys!\n\nJust wanted to check in and see how the project is coming along. Let me know when you get a sec!\n\nThanks,\nAlex" },
  { name: 'Bold', text: "Team,\n\nWe need the project updates now. Let's align immediately to hit our targets and push this over the finish line.\n\nBest,\nAlex" }
];

export default function LandingPage() {
  const { user } = useAuth();
  const [activeToneIndex, setActiveToneIndex] = useState(0);
  const [demoText, setDemoText] = useState('');
  const [typingIndex, setTypingIndex] = useState(0);
  const [faqOpen, setFaqOpen] = useState<number | null>(null);

  // Typewriter effect for Landing Page Demo
  useEffect(() => {
    const fullText = TONES_DEMO[activeToneIndex].text;
    setDemoText('');
    setTypingIndex(0);
  }, [activeToneIndex]);

  useEffect(() => {
    const fullText = TONES_DEMO[activeToneIndex].text;
    if (typingIndex < fullText.length) {
      const timeout = setTimeout(() => {
        setDemoText(prev => prev + fullText[typingIndex]);
        setTypingIndex(prev => prev + 1);
      }, 10);
      return () => clearTimeout(timeout);
    }
  }, [typingIndex, activeToneIndex]);

  const toggleFaq = (index: number) => {
    setFaqOpen(faqOpen === index ? null : index);
  };

  const faqItems = [
    {
      q: "How does VibeMail AI work?",
      a: "VibeMail AI uses advanced language models (specifically Gemini 1.5/2.5) to parse your email topics and refine them into highly-effective drafts based on your selected tone, intent, and length preferences."
    },
    {
      q: "Can I try VibeMail AI for free?",
      a: "Yes! Every new account starts with 5 free high-fidelity generation credits. No credit card is required. You can upgrade to our Premium tier at any time for unlimited generations."
    },
    {
      q: "What tones are available?",
      a: "We support Professional, Casual, Bold, Persuasive, Apologetic, and Humorous tones. You can also customize the lengths (Short, Medium, Long) to match any corporate or casual format."
    },
    {
      q: "Can I use my own API keys?",
      a: "Our app is built to run out-of-the-box. Developers can configure a backend `GEMINI_API_KEY` in the environment file to tap directly into real-time LLM engines."
    }
  ];

  return (
    <>
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-16 lg:pt-32 lg:pb-24 bg-zinc-950">
        
        {/* Glow blobs */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 h-[450px] w-[450px] rounded-full bg-violet-600/10 glow-blob -z-10"></div>
        <div className="absolute top-10 right-10 h-[300px] w-[300px] rounded-full bg-indigo-600/10 glow-blob -z-10"></div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Hero Left */}
            <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left">
              
              {/* Badge announcement */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-semibold text-violet-400 mb-6 animate-pulse">
                <Zap className="h-3.5 w-3.5 fill-violet-400" />
                <span>Next-Gen AI Email Generator</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight mb-6">
                Write emails <span className="gradient-text">10x faster</span>. <br />
                Keep your vibe.
              </h1>
              
              <p className="text-lg text-zinc-400 max-w-xl mb-8">
                Stop staring at blank drafts. Generate professionally structured, tone-adjusted emails in seconds. Save hours of editing and increase response rates.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                <Link
                  href={user ? "/dashboard" : "/signup"}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 px-6 py-4 text-base font-semibold text-white shadow-xl shadow-violet-500/20 hover:from-violet-500 hover:to-indigo-500 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  {user ? "Go to Dashboard" : "Start Writing Free"}
                  <ArrowRight className="h-5 w-5" />
                </Link>
                <Link
                  href="/pricing"
                  className="inline-flex items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-900/50 backdrop-blur-sm px-6 py-4 text-base font-semibold text-zinc-300 hover:text-white hover:bg-zinc-900 hover:border-zinc-700 transition-all"
                >
                  View Pricing
                </Link>
              </div>

              {/* Social Proof metrics */}
              <div className="grid grid-cols-3 gap-6 sm:gap-10 border-t border-zinc-900 mt-12 pt-8 w-full">
                <div>
                  <p className="text-2xl sm:text-3xl font-extrabold text-white">99%</p>
                  <p className="text-xs text-zinc-500 font-medium uppercase tracking-wider mt-1">Accuracy</p>
                </div>
                <div>
                  <p className="text-2xl sm:text-3xl font-extrabold text-white">2.5s</p>
                  <p className="text-xs text-zinc-500 font-medium uppercase tracking-wider mt-1">Generation</p>
                </div>
                <div>
                  <p className="text-2xl sm:text-3xl font-extrabold text-white">100k+</p>
                  <p className="text-xs text-zinc-500 font-medium uppercase tracking-wider mt-1">Emails Written</p>
                </div>
              </div>

            </div>

            {/* Hero Right - Interactive Tone Demo */}
            <div className="lg:col-span-5 w-full">
              <div className="glass-panel rounded-3xl p-6 shadow-2xl relative border border-zinc-800">
                <div className="flex items-center justify-between border-b border-zinc-900 pb-4 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-red-500/80"></span>
                    <span className="h-3 w-3 rounded-full bg-yellow-500/80"></span>
                    <span className="h-3 w-3 rounded-full bg-green-500/80"></span>
                  </div>
                  <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest font-mono">Mail Client Preview</span>
                </div>

                {/* Tone Selectors */}
                <div className="flex gap-2 mb-4 bg-zinc-900/80 p-1 rounded-xl border border-zinc-850">
                  {TONES_DEMO.map((tone, idx) => (
                    <button
                      key={tone.name}
                      onClick={() => setActiveToneIndex(idx)}
                      className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        activeToneIndex === idx 
                          ? 'bg-violet-600 text-white shadow-md' 
                          : 'text-zinc-400 hover:text-zinc-200'
                      }`}
                    >
                      {tone.name}
                    </button>
                  ))}
                </div>

                {/* Simulated Input Prompt */}
                <div className="mb-4 text-xs space-y-1.5">
                  <div className="text-[10px] text-zinc-500 font-semibold uppercase">Input Prompt:</div>
                  <div className="bg-zinc-900/40 border border-zinc-900 px-3 py-2 rounded-xl text-zinc-300">
                    "Ask Alexander for a status update on our deliverables..."
                  </div>
                </div>

                {/* Output Screen (Gmail-like) */}
                <div className="space-y-2.5 text-xs">
                  <div className="text-[10px] text-zinc-500 font-semibold uppercase flex justify-between">
                    <span>Generated Draft:</span>
                    <span className="text-violet-400 animate-pulse">AI is typing...</span>
                  </div>

                  <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-4 space-y-3 shadow-inner">
                    <div className="space-y-1.5 border-b border-zinc-900/60 pb-3">
                      <div className="flex items-center gap-2 text-zinc-500">
                        <span className="w-12">From:</span>
                        <span className="bg-zinc-900/60 border border-zinc-850 px-2 py-0.5 rounded text-[10px] text-zinc-300 font-mono">you@vibemail.ai</span>
                      </div>
                      <div className="flex items-center gap-2 text-zinc-500">
                        <span className="w-12">To:</span>
                        <span className="bg-zinc-900/60 border border-zinc-850 px-2 py-0.5 rounded text-[10px] text-zinc-300 font-mono">alex@example.com</span>
                      </div>
                      <div className="flex items-center gap-2 text-zinc-500">
                        <span className="w-12">Subject:</span>
                        <span className="font-semibold text-zinc-300 text-[10px]">Status Update: Project Deliverables</span>
                      </div>
                    </div>
                    
                    <div className="text-xs text-zinc-200 whitespace-pre-wrap leading-relaxed h-36 overflow-y-auto pr-1">
                      {demoText}
                      {typingIndex < TONES_DEMO[activeToneIndex].text.length && (
                        <span className="inline-block w-1.5 h-3.5 bg-violet-500 ml-0.5 animate-ping"></span>
                      )}
                    </div>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Feature Section */}
      <section className="py-20 border-t border-zinc-900 bg-zinc-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Supercharge Your Inbox</h2>
            <p className="text-zinc-400 max-w-xl mx-auto text-sm sm:text-base">
              Say goodbye to writer's block. VibeMail AI equips you with everything you need to communicate effectively.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Feature 1 */}
            <div className="glass-panel glass-panel-glow rounded-2xl p-6 border border-zinc-900 transition-all">
              <div className="h-12 w-12 rounded-xl bg-violet-600/10 border border-violet-500/20 flex items-center justify-center text-violet-400 mb-6">
                <Zap className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Instant Generation</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Generate high-quality emails matching your goals in under 3 seconds. Type a short description, and the AI does the rest.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="glass-panel glass-panel-glow rounded-2xl p-6 border border-zinc-900 transition-all">
              <div className="h-12 w-12 rounded-xl bg-violet-600/10 border border-violet-500/20 flex items-center justify-center text-violet-400 mb-6">
                <MessageSquare className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Adaptive Tone Shifts</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Shift the email's personality in one click. Choose from Casual, Professional, Bold, or Apologetic tones to match the exact context.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="glass-panel glass-panel-glow rounded-2xl p-6 border border-zinc-900 transition-all">
              <div className="h-12 w-12 rounded-xl bg-violet-600/10 border border-violet-500/20 flex items-center justify-center text-violet-400 mb-6">
                <Shield className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Private & Secure</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Your data is secure. Your email content is never stored on our database or used to train public LLM models.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 border-t border-zinc-900 bg-zinc-950">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">Frequently Asked Questions</h2>
            <p className="text-zinc-400 text-sm">Everything you need to know about VibeMail AI.</p>
          </div>

          <div className="space-y-4">
            {faqItems.map((item, index) => (
              <div 
                key={index}
                className="glass-panel rounded-2xl border border-zinc-900 overflow-hidden transition-all"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full flex items-center justify-between p-5 text-left font-bold text-white hover:text-violet-400 transition-colors focus:outline-none cursor-pointer"
                >
                  <span className="text-sm sm:text-base">{item.q}</span>
                  <ChevronDown 
                    className={`h-5 w-5 text-zinc-400 transition-transform duration-300 ${
                      faqOpen === index ? 'transform rotate-180 text-violet-400' : ''
                    }`} 
                  />
                </button>
                
                {/* Expander body */}
                <div 
                  className={`transition-all duration-300 ease-in-out ${
                    faqOpen === index 
                      ? 'max-h-40 border-t border-zinc-900 opacity-100 p-5' 
                      : 'max-h-0 opacity-0 overflow-hidden'
                  }`}
                >
                  <p className="text-sm text-zinc-400 leading-relaxed">{item.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-16 bg-zinc-950 border-t border-zinc-900 relative">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="glass-panel rounded-3xl p-8 sm:p-12 border border-zinc-800 text-center relative overflow-hidden shadow-2xl">
            <div className="absolute -top-10 -left-10 h-40 w-40 rounded-full bg-violet-600/10 glow-blob"></div>
            <div className="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-indigo-600/10 glow-blob"></div>

            <h2 className="text-3xl font-extrabold text-white mb-4">Ready to double your reply rates?</h2>
            <p className="text-zinc-400 max-w-md mx-auto text-sm sm:text-base mb-8">
              Sign up today and get 5 free generation credits. Start matching the exact vibe you need.
            </p>

            <Link
              href={user ? "/dashboard" : "/signup"}
              className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 px-8 py-4 text-base font-semibold text-white shadow-lg hover:from-violet-500 hover:to-indigo-500 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              Get Started For Free
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
