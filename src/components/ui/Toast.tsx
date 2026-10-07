import React from 'react';
import { useApp } from '../../context/AppContext';
import { RotateCcw, X } from 'lucide-react';

export const Toast: React.FC = () => {
  const { toast, dismissToast } = useApp();

  if (!toast) return null;

  return (
    <div className="fixed bottom-20 sm:bottom-6 inset-x-0 z-[70] flex justify-center px-4 pointer-events-none animate-in fade-in slide-in-from-bottom-3 duration-200">
      <div className="pointer-events-auto max-w-sm w-full bg-white/95 dark:bg-slate-900/95 text-slate-800 dark:text-slate-100 backdrop-blur-md px-4 py-2.5 rounded-2xl shadow-xl shadow-slate-900/10 dark:shadow-black/40 border border-slate-200/90 dark:border-slate-800 flex items-center justify-between gap-3 text-xs sm:text-sm">
        <span className="font-semibold text-slate-800 dark:text-slate-100 truncate">
          {toast.message}
        </span>
        <div className="flex items-center gap-1.5 shrink-0">
          {toast.actionLabel && toast.onAction && (
            <button
              type="button"
              onClick={() => {
                toast.onAction?.();
                dismissToast();
              }}
              className="px-3 py-1 rounded-xl bg-blue-600 hover:bg-blue-500 active:scale-95 text-white font-bold text-xs flex items-center gap-1 transition-all cursor-pointer shadow-xs"
            >
              <RotateCcw size={13} />
              <span>{toast.actionLabel}</span>
            </button>
          )}
          <button
            type="button"
            onClick={dismissToast}
            className="p-1 text-slate-400 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white rounded-lg transition-colors cursor-pointer"
            aria-label="Dismiss"
          >
            <X size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};
