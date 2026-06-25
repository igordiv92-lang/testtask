import React from 'react';
import Link from 'next/link';
import { Sparkles, Mail } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-zinc-900 bg-zinc-950 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          <div className="flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tight text-white group">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-violet-600 to-indigo-500 shadow-md shadow-violet-500/20">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <span className="bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
                VibeMail<span className="text-violet-500 font-extrabold">.AI</span>
              </span>
            </Link>
            <p className="text-sm text-zinc-500 max-w-xs">
              Generate beautiful, tone-perfect emails in seconds. Keep your vibe and save hours of editing.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-zinc-300 uppercase tracking-wider mb-4">Product</h4>
            <ul className="space-y-2.5">
              <li>
                <Link href="/dashboard" className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors">
                  AI Generator
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors">
                  Pricing Plans
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-zinc-300 uppercase tracking-wider mb-4">Legal</h4>
            <ul className="space-y-2.5">
              <li>
                <span className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer">
                  Privacy Policy
                </span>
              </li>
              <li>
                <span className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer">
                  Terms of Service
                </span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-zinc-300 uppercase tracking-wider mb-4">Connect</h4>
            <div className="flex gap-4">
              <span className="h-10 w-10 flex items-center justify-center rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 transition-all cursor-pointer">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                  <path d="M9 18c-4.51 2-5-2-7-2" />
                </svg>
              </span>
              <span className="h-10 w-10 flex items-center justify-center rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 transition-all cursor-pointer">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                </svg>
              </span>
              <span className="h-10 w-10 flex items-center justify-center rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 transition-all cursor-pointer">
                <Mail className="h-5 w-5" />
              </span>
            </div>
          </div>

        </div>

        <div className="border-t border-zinc-900 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-zinc-600">
            &copy; {new Date().getFullYear()} VibeMail AI. All rights reserved.
          </p>
          <p className="text-xs text-zinc-600 flex items-center gap-1">
            Built with 💜 by AI-First Developer.
          </p>
        </div>
      </div>
    </footer>
  );
};
