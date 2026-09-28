import React from 'react';

export type ButtonVariant =
  | 'primary'
  | 'neon'
  | 'secondary'
  | 'outline'
  | 'ghost'
  | 'danger';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  isLoading?: boolean;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-emerald-500 text-black font-semibold hover:bg-emerald-400 active:bg-emerald-600 shadow-[0_0_20px_rgba(16,185,129,0.25)] hover:shadow-[0_0_25px_rgba(16,185,129,0.4)] border border-emerald-400/40',
  neon:
    'bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 font-semibold hover:brightness-110 shadow-[0_0_20px_rgba(6,182,212,0.3)] border border-cyan-400/40',
  secondary:
    'bg-slate-800/80 text-slate-200 hover:bg-slate-700/80 active:bg-slate-850 border border-slate-700/60 hover:text-white',
  outline:
    'bg-transparent text-slate-300 hover:text-white border border-slate-700/80 hover:border-slate-500 hover:bg-slate-800/40',
  ghost:
    'bg-transparent text-slate-400 hover:text-slate-100 hover:bg-white/[0.05] border border-transparent',
  danger:
    'bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 active:bg-rose-500/30 border border-rose-500/30 hover:border-rose-500/50',
};

const sizeClasses = {
  xs: 'px-2.5 py-1 text-xs gap-1.5 rounded-lg',
  sm: 'px-3 py-1.5 text-xs font-medium gap-2 rounded-lg',
  md: 'px-4 py-2 text-sm font-medium gap-2 rounded-xl',
  lg: 'px-5 py-2.5 text-base font-semibold gap-2.5 rounded-xl',
};

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'secondary',
  size = 'md',
  icon,
  iconPosition = 'left',
  isLoading = false,
  className = '',
  disabled,
  ...props
}) => {
  return (
    <button
      disabled={disabled || isLoading}
      className={`inline-flex items-center justify-center transition-all duration-200 cursor-pointer select-none disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#080A0E] ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {isLoading ? (
        <svg
          className="animate-spin h-4 w-4 text-current"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      ) : (
        icon && iconPosition === 'left' && <span className="shrink-0">{icon}</span>
      )}
      <span>{children}</span>
      {!isLoading && icon && iconPosition === 'right' && (
        <span className="shrink-0">{icon}</span>
      )}
    </button>
  );
};
