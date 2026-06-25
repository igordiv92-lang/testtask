'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth/AuthContext';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { 
  Sparkles, Send, Copy, Check, Edit2, Save, 
  RotateCcw, AlertTriangle, HelpCircle, MessageSquare,
  Briefcase, Heart, Smile, Star, ArrowUpRight
} from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/navigation';

const SUGGESTIONS = [
  { label: 'Schedule a sync', text: 'Ask the team for a 30-minute sync next Wednesday to align on project deliverables.' },
  { label: 'Apology for delay', text: 'Apologize to Alex for sending the report late due to technical difficulties.' },
  { label: 'Sales cold outreach', text: 'Introduce VibeMail AI to a potential partner and ask for a 10-minute feedback call.' }
];

const TONES = [
  { name: 'Professional', icon: Briefcase, color: 'text-blue-400 border-blue-500/20 bg-blue-500/5' },
  { name: 'Casual', icon: Smile, color: 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5' },
  { name: 'Bold', icon: Star, color: 'text-amber-400 border-amber-500/20 bg-amber-500/5' },
  { name: 'Persuasive', icon: Sparkles, color: 'text-purple-400 border-purple-500/20 bg-purple-500/5' },
  { name: 'Apologetic', icon: Heart, color: 'text-rose-400 border-rose-500/20 bg-rose-500/5' },
  { name: 'Humorous', icon: MessageSquare, color: 'text-pink-400 border-pink-500/20 bg-pink-500/5' }
];

export default function DashboardPage() {
  const { user, triggerCreditDeduction } = useAuth();
  
  const [prompt, setPrompt] = useState('');
  const [selectedTone, setSelectedTone] = useState('Professional');
  const [selectedLength, setSelectedLength] = useState<'Short' | 'Medium' | 'Long'>('Medium');
  
  const [generating, setGenerating] = useState(false);
  const [rawResult, setRawResult] = useState('');
  const [displayedResult, setDisplayedResult] = useState('');
  const [typingIndex, setTypingIndex] = useState(0);
  
  const [copied, setCopied] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editedText, setEditedText] = useState('');

  // Typewriter effect on result changes
  useEffect(() => {
    setDisplayedResult('');
    setTypingIndex(0);
  }, [rawResult]);

  useEffect(() => {
    if (typingIndex < rawResult.length) {
      const timeout = setTimeout(() => {
        setDisplayedResult(prev => prev + rawResult[typingIndex]);
        setTypingIndex(prev => prev + 1);
      }, 5);
      return () => clearTimeout(timeout);
    }
  }, [typingIndex, rawResult]);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter an email topic or prompt.');
      return;
    }

    if (user && user.plan === 'FREE' && user.creditsUsed >= user.creditsMax) {
      toast.error('Credit limit reached. Please upgrade to Pro for unlimited access!');
      return;
    }

    setGenerating(true);
    setRawResult('');
    setEditMode(false);

    try {
      // Deduct credit first (simulates API checkout count logic)
      await triggerCreditDeduction();

      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          tone: selectedTone,
          length: selectedLength
        })
      });

      const data = await response.json();
      if (response.ok && data.result) {
        setRawResult(data.result);
        setEditedText(data.result);
        toast.success('Email draft successfully written!');
      } else {
        throw new Error(data.error || 'Server error encountered.');
      }
    } catch (err: any) {
      toast.error(err.message || 'Generation failed. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  const handleCopy = () => {
    const textToCopy = editMode ? editedText : rawResult;
    if (!textToCopy) return;

    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    toast.success('Copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <Navbar />
      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8 bg-zinc-950">
        <div className="mx-auto max-w-7xl">
          
          {/* Header Dashboard Info */}
          <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-zinc-900 pb-6 mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-extrabold text-white">Vibe Workspace</h1>
              <p className="text-sm text-zinc-400 mt-1">Configure your email prompt and tone below.</p>
            </div>

            {/* User credit status banner */}
            {user && (
              <div className="inline-flex items-center gap-3 bg-zinc-900 border border-zinc-800 rounded-2xl p-3">
                <div className="text-right">
                  <div className="text-xs text-zinc-500 font-semibold uppercase">Active Plan</div>
                  <div className="text-sm font-bold text-white uppercase flex items-center gap-1">
                    {user.plan}
                    {user.plan === 'PRO' && <Sparkles className="h-3.5 w-3.5 text-violet-400" />}
                  </div>
                </div>
                <div className="border-l border-zinc-800 h-8 pl-3 flex flex-col justify-center">
                  <div className="text-xs text-zinc-500 font-semibold uppercase">Generations Left</div>
                  <div className="text-sm font-bold text-white">
                    {user.plan === 'PRO' ? 'Unlimited' : `${user.creditsMax - user.creditsUsed} / ${user.creditsMax}`}
                  </div>
                </div>
                {user.plan === 'FREE' && (
                  <Link
                    href="/pricing"
                    className="inline-flex items-center gap-1 ml-2 px-3 py-1.5 rounded-lg bg-violet-600 hover:bg-violet-500 text-xs font-bold text-white transition-colors"
                  >
                    Upgrade
                    <ArrowUpRight className="h-3 w-3" />
                  </Link>
                )}
              </div>
            )}
          </div>

          {/* Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Input Controls Panel */}
            <div className="lg:col-span-6 space-y-6">
              
              {/* Text Area Prompt */}
              <div className="glass-panel border border-zinc-900 rounded-3xl p-6 shadow-md">
                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                  What is this email about?
                </label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe the context, who you're emailing, and what you need to achieve..."
                  rows={4}
                  className="block w-full rounded-xl bg-zinc-950 border border-zinc-850 px-3.5 py-3 text-sm text-white placeholder-zinc-500 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500 transition-all resize-none"
                />

                {/* Suggestions Chips */}
                <div className="mt-4">
                  <div className="text-[10px] font-semibold text-zinc-500 uppercase mb-2">Suggestions:</div>
                  <div className="flex flex-wrap gap-2">
                    {SUGGESTIONS.map((s, idx) => (
                      <button
                        key={idx}
                        onClick={() => setPrompt(s.text)}
                        className="px-3 py-1.5 rounded-lg border border-zinc-900 bg-zinc-900/50 hover:bg-zinc-900 hover:border-zinc-800 text-xs font-medium text-zinc-400 hover:text-white transition-all cursor-pointer"
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Tone Selection Card Grid */}
              <div className="glass-panel border border-zinc-900 rounded-3xl p-6 shadow-md">
                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">
                  Select Tone
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {TONES.map((tone) => {
                    const IconComponent = tone.icon;
                    const isActive = selectedTone === tone.name;
                    return (
                      <button
                        key={tone.name}
                        onClick={() => setSelectedTone(tone.name)}
                        className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                          isActive 
                            ? 'border-violet-600 bg-violet-600/10 text-white font-semibold' 
                            : 'border-zinc-900 bg-zinc-950 text-zinc-400 hover:text-zinc-200 hover:border-zinc-800'
                        }`}
                      >
                        <IconComponent className={`h-5 w-5 mb-1.5 ${isActive ? 'text-violet-400' : 'text-zinc-500'}`} />
                        <span className="text-xs">{tone.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Length control segmented slider */}
              <div className="glass-panel border border-zinc-900 rounded-3xl p-6 shadow-md">
                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">
                  Select Length
                </label>
                <div className="flex bg-zinc-950 border border-zinc-900 rounded-2xl p-1">
                  {(['Short', 'Medium', 'Long'] as const).map((len) => (
                    <button
                      key={len}
                      onClick={() => setSelectedLength(len)}
                      className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        selectedLength === len 
                          ? 'bg-violet-600 text-white shadow-md' 
                          : 'text-zinc-500 hover:text-zinc-300'
                      }`}
                    >
                      {len}
                    </button>
                  ))}
                </div>
              </div>

              {/* CTA Generate button */}
              <button
                onClick={handleGenerate}
                disabled={generating}
                className="w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 py-4 text-sm font-bold text-white shadow-lg shadow-violet-500/20 hover:from-violet-500 hover:to-indigo-500 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:scale-100 disabled:pointer-events-none transition-all cursor-pointer"
              >
                {generating ? (
                  <>
                    <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin"></span>
                    Writing Draft...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Generate Email Draft
                  </>
                )}
              </button>

            </div>

            {/* Output Panel */}
            <div className="lg:col-span-6">
              <div className="glass-panel border border-zinc-900 rounded-3xl p-6 shadow-lg h-full flex flex-col justify-between min-h-[480px]">
                
                {/* Header info */}
                <div>
                  <div className="flex items-center justify-between border-b border-zinc-900 pb-4 mb-4">
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-violet-500 animate-ping"></span>
                      <span className="text-xs font-bold text-white tracking-wide uppercase">AI Workspace Output</span>
                    </div>

                    {/* Copy/Edit utilities */}
                    {rawResult && !generating && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setEditMode(!editMode)}
                          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-zinc-800 text-xs font-medium text-zinc-400 hover:text-white hover:bg-zinc-900 transition-all cursor-pointer"
                        >
                          {editMode ? (
                            <>
                              <Save className="h-3.5 w-3.5 text-emerald-400" />
                              View Mode
                            </>
                          ) : (
                            <>
                              <Edit2 className="h-3.5 w-3.5" />
                              Edit Text
                            </>
                          )}
                        </button>
                        <button
                          onClick={handleCopy}
                          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-zinc-800 text-xs font-medium text-zinc-400 hover:text-white hover:bg-zinc-900 transition-all cursor-pointer"
                        >
                          {copied ? (
                            <>
                              <Check className="h-3.5 w-3.5 text-emerald-400" />
                              Copied
                            </>
                          ) : (
                            <>
                              <Copy className="h-3.5 w-3.5" />
                              Copy Draft
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Render Screen */}
                  <div className="flex-1 min-h-[300px]">
                    {generating ? (
                      <div className="h-60 flex flex-col items-center justify-center text-center gap-3">
                        <div className="relative flex h-10 w-10 items-center justify-center">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-25"></span>
                          <span className="relative inline-flex rounded-full h-7 w-7 bg-violet-600 flex items-center justify-center text-white">
                            <Sparkles className="h-4 w-4" />
                          </span>
                        </div>
                        <p className="text-sm font-semibold text-zinc-300">VibeMail AI is composing your draft...</p>
                        <p className="text-xs text-zinc-500">Evaluating tone constraints and outline subjects.</p>
                      </div>
                    ) : editMode ? (
                      <textarea
                        value={editedText}
                        onChange={(e) => setEditedText(e.target.value)}
                        rows={14}
                        className="block w-full h-[320px] rounded-xl bg-zinc-950 border border-zinc-900 p-4 text-xs font-mono text-zinc-200 focus:outline-none focus:border-violet-500 transition-all resize-none leading-relaxed"
                      />
                    ) : rawResult ? (
                      <div className="bg-zinc-950/60 border border-zinc-900/60 p-5 rounded-2xl text-xs font-mono text-zinc-200 leading-relaxed whitespace-pre-wrap h-[340px] overflow-y-auto">
                        {displayedResult}
                        {typingIndex < rawResult.length && (
                          <span className="inline-block w-1.5 h-3.5 bg-violet-500 ml-0.5 animate-ping"></span>
                        )}
                      </div>
                    ) : (
                      <div className="h-60 border-2 border-dashed border-zinc-900 rounded-2xl flex flex-col items-center justify-center text-center p-6 text-zinc-500 gap-2">
                        <HelpCircle className="h-8 w-8 text-zinc-700" />
                        <h4 className="text-sm font-bold text-zinc-400">Empty Draft Canvas</h4>
                        <p className="text-xs text-zinc-600 max-w-xs">
                          Your generated email content will appear here in real-time with copy and formatting tools.
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer terms warning */}
                {rawResult && !generating && (
                  <div className="border-t border-zinc-900 pt-4 text-[10px] text-zinc-500 flex items-center gap-1.5 mt-4">
                    <AlertTriangle className="h-3.5 w-3.5 text-amber-500/80 shrink-0" />
                    <span>Review draft for precise dates and details before sending.</span>
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
