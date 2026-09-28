import React from 'react';

export type BadgeVariant =
  | 'default'
  | 'emerald'
  | 'cyan'
  | 'amber'
  | 'rose'
  | 'violet'
  | 'slate'
  | 'blue';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  dot?: boolean;
  className?: string;
  size?: 'xs' | 'sm' | 'md';
}

const variantStyles: Record<BadgeVariant, { bg: string; text: string; dot: string; border: string }> = {
  default: {
    bg: 'bg-white/[0.04]',
    text: 'text-slate-300',
    dot: 'bg-slate-400',
    border: 'border-white/[0.08]',
  },
  emerald: {
    bg: 'bg-emerald-500/10',
    text: 'text-emerald-400',
    dot: 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]',
    border: 'border-emerald-500/20',
  },
  cyan: {
    bg: 'bg-cyan-500/10',
    text: 'text-cyan-400',
    dot: 'bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]',
    border: 'border-cyan-500/20',
  },
  amber: {
    bg: 'bg-amber-500/10',
    text: 'text-amber-400',
    dot: 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]',
    border: 'border-amber-500/20',
  },
  rose: {
    bg: 'bg-rose-500/10',
    text: 'text-rose-400',
    dot: 'bg-rose-400 shadow-[0_0_8px_rgba(251,113,133,0.8)]',
    border: 'border-rose-500/20',
  },
  violet: {
    bg: 'bg-violet-500/10',
    text: 'text-violet-400',
    dot: 'bg-violet-400 shadow-[0_0_8px_rgba(167,139,250,0.8)]',
    border: 'border-violet-500/20',
  },
  slate: {
    bg: 'bg-slate-800/50',
    text: 'text-slate-400',
    dot: 'bg-slate-500',
    border: 'border-slate-700/50',
  },
  blue: {
    bg: 'bg-blue-500/10',
    text: 'text-blue-400',
    dot: 'bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.8)]',
    border: 'border-blue-500/20',
  },
};

const sizeStyles = {
  xs: 'text-[10px] px-2 py-0.5 tracking-wider uppercase font-semibold',
  sm: 'text-xs px-2.5 py-1 font-medium',
  md: 'text-sm px-3 py-1.5 font-medium',
};

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  dot = false,
  className = '',
  size = 'sm',
}) => {
  const styles = variantStyles[variant];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border backdrop-blur-md transition-colors ${styles.bg} ${styles.text} ${styles.border} ${sizeStyles[size]} ${className}`}
    >
      {dot && <span className={`h-1.5 w-1.5 rounded-full ${styles.dot}`} />}
      {children}
    </span>
  );
};
