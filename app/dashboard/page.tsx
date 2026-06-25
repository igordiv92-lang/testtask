'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth/AuthContext';
import { useI18n } from '@/lib/i18n/I18nContext';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { 
  Sparkles, Send, Copy, Check, Edit2, Save, Download, Trash2,
  RotateCcw, AlertTriangle, HelpCircle, MessageSquare, History,
  Briefcase, Heart, Smile, Star, ArrowUpRight, User, Terminal
} from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';

interface SavedDraft {
  id: string;
  prompt: string;
  tone: string;
  length: string;
  content: string;
  timestamp: string;
}

const TEMPLATES_EN = [
  { label: 'Cold Sales Pitch', text: 'Reach out to a potential client to introduce VibeMail AI, detailing how it saves 10 hours a week, and ask for a 15-minute intro call.', category: 'Sales' },
  { label: 'Schedule Team Sync', text: 'Propose a 30-minute project sync next Thursday to align on timelines, asking everyone to list their availability.', category: 'Business' },
  { label: 'Apologize for Delay', text: 'Apologize to the manager for submitting the project reports late due to database maintenance issues.', category: 'Business' },
  { label: 'Resignation Letter', text: 'Draft a polite resignation letter giving a two-week notice, thanking the team for the opportunities, and offering transition support.', category: 'Personal' },
  { label: 'Follow-up on Proposal', text: 'Friendly follow-up to a client regarding the contract proposal sent last Tuesday, asking if they have any feedback.', category: 'Sales' }
];

const TEMPLATES_RU = [
  { label: 'Холодное предложение', text: 'Связаться с потенциальным клиентом, чтобы рассказать о VibeMail AI (экономит 10 часов в неделю) и предложить 15-минутный созвон.', category: 'Sales' },
  { label: 'Встреча команды', text: 'Предложить провести 30-минутный синк команды в следующий четверг для синхронизации графиков и попросить всех указать удобное время.', category: 'Business' },
  { label: 'Извинение за задержку', text: 'Принести извинения руководителю за задержку отчетов по проекту из-за технических работ на базе данных.', category: 'Business' },
  { label: 'Заявление об увольнении', text: 'Составить вежливое заявление об увольнении с уведомлением за две недели, поблагодарив команду за совместную работу.', category: 'Personal' },
  { label: 'Напоминание о предложении', text: 'Дружелюбное напоминание клиенту по поводу предложения о контракте, отправленного в прошлый вторник.', category: 'Sales' }
];

const TONES = [
  { name: 'Professional', labelEn: 'Professional', labelRu: 'Строгий', icon: Briefcase },
  { name: 'Casual', labelEn: 'Casual', labelRu: 'Дружелюбный', icon: Smile },
  { name: 'Bold', labelEn: 'Bold', labelRu: 'Смелый', icon: Star },
  { name: 'Persuasive', labelEn: 'Persuasive', labelRu: 'Убеждающий', icon: Sparkles },
  { name: 'Apologetic', labelEn: 'Apologetic', labelRu: 'Извиняющийся', icon: Heart },
  { name: 'Humorous', labelEn: 'Humorous', labelRu: 'С юмором', icon: MessageSquare }
];

const getLengthLabel = (length: string, locale: string) => {
  if (locale === 'ru') {
    switch (length) {
      case 'Short': return 'Короткое';
      case 'Medium': return 'Среднее';
      case 'Long': return 'Длинное';
      default: return length;
    }
  }
  return length;
};

export default function DashboardPage() {
  const { user, triggerCreditDeduction } = useAuth();
  const { locale, t } = useI18n();
  
  const templates = locale === 'ru' ? TEMPLATES_RU : TEMPLATES_EN;
  
  const [prompt, setPrompt] = useState('');
  const [selectedTone, setSelectedTone] = useState('Professional');
  const [selectedLength, setSelectedLength] = useState<'Short' | 'Medium' | 'Long'>('Medium');
  
  // Refinement states
  const [refineText, setRefineText] = useState('');
  const [refining, setRefining] = useState(false);

  const [generating, setGenerating] = useState(false);
  const [rawResult, setRawResult] = useState('');
  const [displayedResult, setDisplayedResult] = useState('');
  const [typingIndex, setTypingIndex] = useState(0);
  
  const [copied, setCopied] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editedText, setEditedText] = useState('');

  // History states
  const [historyList, setHistoryList] = useState<SavedDraft[]>([]);
  const [showHistory, setShowHistory] = useState(true);

  // Load history on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('vibemail_draft_history');
      if (saved) {
        try {
          setHistoryList(JSON.parse(saved));
        } catch (e) {
          console.error(e);
        }
      }
    }
  }, []);

  // Save history to localStorage on change
  const saveHistoryList = (list: SavedDraft[]) => {
    setHistoryList(list);
    localStorage.setItem('vibemail_draft_history', JSON.stringify(list));
  };

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
      }, 4);
      return () => clearTimeout(timeout);
    }
  }, [typingIndex, rawResult]);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error(locale === 'ru' ? 'Пожалуйста, введите тему письма или выберите шаблон.' : 'Please enter an email topic or select a template.');
      return;
    }

    if (user && user.plan === 'FREE' && user.creditsUsed >= user.creditsMax) {
      toast.error(locale === 'ru' ? 'Лимит кредитов исчерпан. Пожалуйста, перейдите на тариф Pro для безлимитного доступа!' : 'Credit limit reached. Please upgrade to Pro for unlimited access!');
      return;
    }

    setGenerating(true);
    setRawResult('');
    setEditMode(false);

    try {
      // Deduct credit first
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
        toast.success(locale === 'ru' ? 'Черновик письма успешно сгенерирован!' : 'Email draft successfully generated!');
        
        // Save to history list
        const newDraft: SavedDraft = {
          id: Date.now().toString(),
          prompt: prompt,
          tone: selectedTone,
          length: selectedLength,
          content: data.result,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        saveHistoryList([newDraft, ...historyList]);
      } else {
        throw new Error(data.error || 'Server error encountered.');
      }
    } catch (err: any) {
      toast.error(err.message || (locale === 'ru' ? 'Ошибка генерации. Пожалуйста, попробуйте еще раз.' : 'Generation failed. Please try again.'));
    } finally {
      setGenerating(false);
    }
  };

  // Refine / Tweak the existing email draft
  const handleRefine = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!refineText.trim()) return;
    if (!rawResult) {
      toast.error(locale === 'ru' ? 'Пожалуйста, сначала сгенерируйте черновик письма.' : 'Please generate an email draft first.');
      return;
    }

    setRefining(true);
    const instruction = refineText;
    setRefineText('');

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          refinePrompt: instruction,
          previousDraft: editMode ? editedText : rawResult
        })
      });

      const data = await response.json();
      if (response.ok && data.result) {
        setRawResult(data.result);
        setEditedText(data.result);
        toast.success(locale === 'ru' ? 'Черновик успешно скорректирован!' : 'Draft refined successfully!');
      } else {
        throw new Error(data.error || 'Refinement failed.');
      }
    } catch (err: any) {
      toast.error(err.message || (locale === 'ru' ? 'Не удалось доработать черновик.' : 'Tweak action failed.'));
    } finally {
      setRefining(false);
    }
  };

  const handleCopy = () => {
    const textToCopy = editMode ? editedText : rawResult;
    if (!textToCopy) return;

    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    toast.success(locale === 'ru' ? 'Скопировано в буфер обмена!' : 'Copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const textToDownload = editMode ? editedText : rawResult;
    if (!textToDownload) return;

    const blob = new Blob([textToDownload], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `vibemail_draft_${Date.now()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success(locale === 'ru' ? 'Черновик сохранен в формате .TXT' : 'Draft downloaded as .TXT');
  };

  const loadHistoryItem = (item: SavedDraft) => {
    setPrompt(item.prompt);
    setSelectedTone(item.tone);
    setSelectedLength(item.length as any);
    setRawResult(item.content);
    setEditedText(item.content);
    setEditMode(false);
    toast.info(t('draftReloadedInfo'));
  };

  const deleteHistoryItem = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const filtered = historyList.filter(item => item.id !== id);
    saveHistoryList(filtered);
    toast.success(t('draftDeletedInfo'));
  };

  // Helper to split subject line from body
  const parseMailContent = (text: string) => {
    const lines = text.split('\n');
    let subject = 'Subject: (Generated Email)';
    let body = text;

    if (lines[0]?.toLowerCase().startsWith('subject:')) {
      subject = lines[0];
      body = lines.slice(1).join('\n').trim();
    }
    return { subject, body };
  };

  const mailDetails = parseMailContent(editMode ? editedText : displayedResult);

  return (
    <>
      <Navbar />
      <main className="flex-1 py-10 px-4 sm:px-6 lg:px-8 bg-zinc-950">
        <div className="mx-auto max-w-7xl">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-zinc-900 pb-6 mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
                {t('dashTitle')}
                <span className="text-xs bg-violet-600/20 text-violet-400 border border-violet-500/20 px-2 py-0.5 rounded font-mono">
                  v1.1 (Premium Pro Edition)
                </span>
              </h1>
              <p className="text-sm text-zinc-400 mt-1">
                {locale === 'ru' 
                  ? 'Генерируйте и дорабатывайте черновики писем с помощью ИИ.' 
                  : 'Generate and tweak email drafts using AI models.'}
              </p>
            </div>

            {/* Plan indicator */}
            {user && (
              <div className="inline-flex items-center gap-3 bg-zinc-900 border border-zinc-800 rounded-2xl p-3">
                <div className="text-right">
                  <div className="text-[10px] text-zinc-500 font-semibold uppercase">{t('workspacePlanLabel')}</div>
                  <div className="text-sm font-bold text-white uppercase flex items-center gap-1">
                    {user.plan === 'PRO' ? t('proAccount') : t('freeAccount')}
                    {user.plan === 'PRO' && <Sparkles className="h-3.5 w-3.5 text-violet-400" />}
                  </div>
                </div>
                <div className="border-l border-zinc-800 h-8 pl-3 flex flex-col justify-center">
                  <div className="text-[10px] text-zinc-500 font-semibold uppercase">{t('generationsLeftLabel')}</div>
                  <div className="text-sm font-bold text-white">
                    {user.plan === 'PRO' ? t('unlimited') : `${user.creditsUsed} / ${user.creditsMax}`}
                  </div>
                </div>
                {user.plan === 'FREE' && (
                  <Link
                    href="/pricing"
                    className="inline-flex items-center gap-1 ml-2 px-3 py-1.5 rounded-lg bg-violet-600 hover:bg-violet-500 text-xs font-bold text-white transition-colors"
                  >
                    {t('upgradeLink')}
                    <ArrowUpRight className="h-3 w-3" />
                  </Link>
                )}
              </div>
            )}
          </div>

          {/* Collapsible history toggle for desktop */}
          <div className="flex justify-end mb-4">
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-colors cursor-pointer border border-zinc-900 bg-zinc-900/30 px-3 py-1.5 rounded-lg"
            >
              <History className="h-3.5 w-3.5 text-violet-400" />
              {showHistory 
                ? (locale === 'ru' ? 'Скрыть черновики' : 'Hide Saved Drafts') 
                : (locale === 'ru' ? 'Показать черновики' : 'Show Saved Drafts')}
            </button>
          </div>

          {/* Responsive Layout Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Form controls */}
            <div className={`space-y-6 ${showHistory ? 'lg:col-span-4' : 'lg:col-span-5'}`}>
              
              {/* Card 1: Textarea with templates */}
              <div className="glass-panel border border-zinc-900 rounded-3xl p-6 shadow-md">
                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                  {t('promptLabel')}
                </label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder={t('promptPlaceholder')}
                  rows={4}
                  className="block w-full rounded-xl bg-zinc-950 border border-zinc-900 px-3.5 py-3 text-sm text-white placeholder-zinc-500 focus:border-violet-500 focus:outline-none transition-all resize-none"
                />

                {/* Templates library */}
                <div className="mt-4">
                  <div className="text-[10px] font-semibold text-zinc-500 uppercase mb-2">{t('suggestionsLabel')}</div>
                  <div className="flex flex-wrap gap-2">
                    {templates.map((item, idx) => (
                      <button
                        key={idx}
                        onClick={() => setPrompt(item.text)}
                        className="px-2.5 py-1.5 rounded-lg border border-zinc-900 bg-zinc-900/40 hover:bg-zinc-900 text-[10px] font-medium text-zinc-400 hover:text-white transition-all cursor-pointer text-left"
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Card 2: Tone select */}
              <div className="glass-panel border border-zinc-900 rounded-3xl p-6">
                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">
                  {t('toneLabel')}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {TONES.map((t) => {
                    const IconComponent = t.icon;
                    const isActive = selectedTone === t.name;
                    return (
                      <button
                        key={t.name}
                        onClick={() => setSelectedTone(t.name)}
                        className={`flex flex-col items-center p-2.5 rounded-xl border transition-all cursor-pointer ${
                          isActive 
                            ? 'border-violet-600 bg-violet-600/10 text-white font-semibold' 
                            : 'border-zinc-900 bg-zinc-950 text-zinc-400 hover:text-zinc-200'
                        }`}
                      >
                        <IconComponent className="h-4 w-4 mb-1 text-zinc-500" />
                        <span className="text-[10px] truncate">
                          {locale === 'ru' ? t.labelRu : t.labelEn}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Card 3: Length select */}
              <div className="glass-panel border border-zinc-900 rounded-3xl p-6">
                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">
                  {t('lengthLabel')}
                </label>
                <div className="flex bg-zinc-950 border border-zinc-900 p-1 rounded-xl">
                  {(['Short', 'Medium', 'Long'] as const).map((len) => (
                    <button
                      key={len}
                      onClick={() => setSelectedLength(len)}
                      className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        selectedLength === len 
                          ? 'bg-violet-600 text-white shadow-md' 
                          : 'text-zinc-500 hover:text-zinc-300'
                      }`}
                    >
                      {getLengthLabel(len, locale)}
                    </button>
                  ))}
                </div>
              </div>

              {/* CTA button */}
              <button
                onClick={handleGenerate}
                disabled={generating || refining}
                className="w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 py-4 text-sm font-bold text-white shadow-lg hover:from-violet-500 hover:to-indigo-500 hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer"
              >
                {generating ? (
                  <>
                    <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin"></span>
                    {t('generatingState')}
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    {t('generateBtn')}
                  </>
                )}
              </button>

            </div>

            {/* Center Column: Gmail Email Mock Client */}
            <div className={`space-y-6 ${
              showHistory 
                ? 'lg:col-span-5' 
                : 'lg:col-span-7'
            }`}>
              
              <div className="glass-panel border border-zinc-900 rounded-3xl p-6 shadow-xl min-h-[480px] flex flex-col justify-between">
                
                <div>
                  
                  {/* Mock Client Headers */}
                  <div className="border-b border-zinc-900 pb-4 mb-4 space-y-2.5">
                    
                    {/* Header info bar */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <Terminal className="h-4 w-4 text-violet-400" />
                        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest font-mono">
                          {t('aiOutputLabel')}
                        </span>
                      </div>

                      {/* Controls */}
                      {rawResult && !generating && (
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => setEditMode(!editMode)}
                            className="p-2 rounded-lg border border-zinc-900 hover:bg-zinc-900 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                            title="Toggle edit mode"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={handleCopy}
                            className="p-2 rounded-lg border border-zinc-900 hover:bg-zinc-900 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                            title="Copy to clipboard"
                          >
                            {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                          </button>
                          <button
                            onClick={handleDownload}
                            className="p-2 rounded-lg border border-zinc-900 hover:bg-zinc-900 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                            title="Download .TXT"
                          >
                            <Download className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      )}
                    </div>

                    {/* From / To email inputs mockup */}
                    <div className="space-y-1.5 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="text-zinc-500 w-12 font-medium">From:</span>
                        <div className="bg-zinc-900/40 border border-zinc-900 px-3 py-1 rounded-lg text-zinc-300 font-mono text-[10px] flex-1">
                          you@vibemail.ai
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-zinc-500 w-12 font-medium">To:</span>
                        <div className="bg-zinc-900/40 border border-zinc-900 px-3 py-1 rounded-lg text-zinc-300 font-mono text-[10px] flex-1">
                          recipient@example.com
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-zinc-500 w-12 font-medium">Subject:</span>
                        <div className="bg-zinc-900/40 border border-zinc-900 px-3 py-1 rounded-lg text-zinc-300 font-semibold text-[10px] flex-1">
                          {generating 
                            ? (locale === 'ru' ? 'ИИ пишет тему...' : 'composing subject...') 
                            : mailDetails.subject.replace(/subject:/i, '').trim() || (locale === 'ru' ? '(Без темы)' : '(No Subject)')}
                        </div>
                      </div>
                    </div>

                  </div>

                  {/* Mail Body screen */}
                  <div className="min-h-[260px] flex flex-col justify-start">
                    {generating ? (
                      <div className="h-48 flex flex-col items-center justify-center text-center gap-2">
                        <div className="h-6 w-6 rounded-full border-2 border-violet-500 border-t-transparent animate-spin"></div>
                        <p className="text-xs text-zinc-400">
                          {locale === 'ru' ? 'ИИ пишет текст письма...' : 'AI is drafting email content...'}
                        </p>
                      </div>
                    ) : editMode ? (
                      <textarea
                        value={editedText}
                        onChange={(e) => setEditedText(e.target.value)}
                        rows={11}
                        className="block w-full h-[260px] rounded-xl bg-zinc-950 border border-zinc-900 p-4 text-xs font-mono text-zinc-300 focus:outline-none focus:border-violet-500 transition-all resize-none leading-relaxed"
                      />
                    ) : rawResult ? (
                      <div className="bg-zinc-950/40 border border-zinc-900/60 p-4 rounded-xl text-xs font-mono text-zinc-200 leading-relaxed whitespace-pre-wrap h-[260px] overflow-y-auto">
                        {mailDetails.body}
                        {typingIndex < rawResult.length && (
                          <span className="inline-block w-1.5 h-3.5 bg-violet-500 ml-0.5 animate-ping"></span>
                        )}
                      </div>
                    ) : (
                      <div className="h-48 border border-dashed border-zinc-900 rounded-xl flex flex-col items-center justify-center text-center p-6 text-zinc-500 gap-2">
                        <HelpCircle className="h-6 w-6 text-zinc-700" />
                        <h4 className="text-xs font-bold text-zinc-400">{t('emptyCanvasTitle')}</h4>
                        <p className="text-[10px] text-zinc-600 max-w-xs leading-normal">
                          {t('emptyCanvasText')}
                        </p>
                      </div>
                    )}
                  </div>

                </div>

                {/* Refinement input panel */}
                {rawResult && !generating && (
                  <form onSubmit={handleRefine} className="border-t border-zinc-900 pt-4 mt-4">
                    <div className="text-[10px] font-semibold text-zinc-500 uppercase mb-2">{t('tweakLabel')}</div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={refineText}
                        onChange={(e) => setRefineText(e.target.value)}
                        disabled={refining}
                        placeholder={t('tweakPlaceholder')}
                        className="flex-1 rounded-xl bg-zinc-950 border border-zinc-900 px-3.5 py-2.5 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-violet-500 transition-all"
                      />
                      <button
                        type="submit"
                        disabled={refining}
                        className="px-4 py-2.5 bg-violet-600 hover:bg-violet-500 text-xs font-bold text-white rounded-xl shadow-md transition-all flex items-center gap-1 cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
                      >
                        {refining ? (
                          <span className="h-3 w-3 rounded-full border border-white/30 border-t-white animate-spin"></span>
                        ) : (
                          t('refineBtn')
                        )}
                      </button>
                    </div>
                  </form>
                )}

              </div>
            </div>

            {/* Right Column: History Sidebar */}
            {showHistory && (
              <div className="lg:col-span-3 space-y-4">
                <div className="glass-panel border border-zinc-900 rounded-3xl p-5 shadow-md">
                  <div className="flex items-center gap-1.5 border-b border-zinc-900 pb-3 mb-3">
                    <History className="h-4 w-4 text-violet-400" />
                    <h3 className="text-sm font-bold text-white">{t('savedDraftsTitle')}</h3>
                  </div>

                  {historyList.length === 0 ? (
                    <div className="py-8 text-center text-xs text-zinc-600 leading-normal">
                      {t('noSavedDrafts')}
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
                      {historyList.map((item) => (
                        <div
                          key={item.id}
                          onClick={() => loadHistoryItem(item)}
                          className="group border border-zinc-900 bg-zinc-950/60 p-3 rounded-xl hover:border-zinc-800 transition-all cursor-pointer text-left relative overflow-hidden"
                        >
                          <div className="flex items-center justify-between text-[10px] text-zinc-500 font-semibold mb-1">
                            <span className="uppercase text-[9px] bg-zinc-900 px-1.5 py-0.5 rounded text-violet-400 font-mono">
                              {locale === 'ru' 
                                ? (TONES.find(t => t.name === item.tone)?.labelRu || item.tone) 
                                : item.tone}
                            </span>
                            <span>{item.timestamp}</span>
                          </div>
                          
                          <p className="text-xs text-zinc-300 font-bold truncate pr-6">
                            {item.prompt}
                          </p>
                          <p className="text-[10px] text-zinc-500 truncate mt-1 font-mono">
                            {parseMailContent(item.content).subject}
                          </p>

                          {/* Delete button */}
                          <button
                            onClick={(e) => deleteHistoryItem(item.id, e)}
                            className="absolute top-2.5 right-2 opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-zinc-900 text-zinc-500 hover:text-red-400 transition-all cursor-pointer"
                            title="Remove draft"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

          </div>

        </div>
      </main>
      <Footer />
    </>
  );
}
