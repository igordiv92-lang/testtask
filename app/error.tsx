'use client';

import { useEffect } from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('App Router Boundary Exception:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-3xl p-8 text-center shadow-2xl relative">
        
        {/* Glow blob */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[200px] w-[200px] rounded-full bg-red-600/10 glow-blob -z-10"></div>

        <div className="mx-auto h-16 w-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500 mb-6">
          <AlertTriangle className="h-8 w-8" />
        </div>

        <h2 className="text-xl font-bold text-white mb-2">Something went wrong</h2>
        <p className="text-sm text-zinc-400 mb-6">
          We encountered an unexpected error on this page. Please try reloading the page context.
        </p>

        <div className="bg-zinc-950 border border-zinc-850 p-4 rounded-xl text-left mb-6 overflow-x-auto">
          <code className="text-xs font-mono text-red-400 whitespace-pre-wrap">
            {error.message || 'Unknown render exception'}
          </code>
        </div>

        <button
          onClick={() => reset()}
          className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-500/20 hover:from-violet-500 hover:to-indigo-500 transition-all cursor-pointer"
        >
          <RotateCcw className="h-4 w-4" />
          Reload Workspace
        </button>
      </div>
    </div>
  );
}
