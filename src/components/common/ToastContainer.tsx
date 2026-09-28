import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  const iconMap = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />,
    info: <Info className="w-5 h-5 text-cyan-400 shrink-0" />,
  };

  const borderGlowMap = {
    success: 'border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.15)]',
    error: 'border-rose-500/30 shadow-[0_0_20px_rgba(244,63,94,0.15)]',
    warning: 'border-amber-500/30 shadow-[0_0_20px_rgba(245,158,11,0.15)]',
    info: 'border-cyan-500/30 shadow-[0_0_20px_rgba(6,182,212,0.15)]',
  };

  return (
    <div
      aria-live="polite"
      className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none"
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl bg-[#0E131B]/95 backdrop-blur-xl border ${
            borderGlowMap[toast.type]
          } text-slate-100 transition-all duration-300 animate-in slide-in-from-bottom-5`}
        >
          {iconMap[toast.type]}
          <div className="flex-1 min-w-0">
            <h5 className="text-sm font-semibold text-white tracking-tight">{toast.title}</h5>
            {toast.message && (
              <p className="mt-0.5 text-xs text-slate-400 leading-snug break-words">
                {toast.message}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={() => removeToast(toast.id)}
            className="text-slate-400 hover:text-white p-1 rounded-md hover:bg-white/[0.06] transition-colors"
            aria-label="Dismiss toast"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};
