import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  glow?: 'none' | 'emerald' | 'cyan' | 'violet' | 'amber';
  interactive?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  glow = 'none',
  interactive = false,
  ...props
}) => {
  const glowStyles = {
    none: '',
    emerald: 'shadow-[0_0_25px_-5px_rgba(16,185,129,0.12)] border-emerald-500/20',
    cyan: 'shadow-[0_0_25px_-5px_rgba(6,182,212,0.12)] border-cyan-500/20',
    violet: 'shadow-[0_0_25px_-5px_rgba(139,92,246,0.12)] border-violet-500/20',
    amber: 'shadow-[0_0_25px_-5px_rgba(245,158,11,0.12)] border-amber-500/20',
  };

  return (
    <div
      className={`rounded-2xl border border-white/[0.06] bg-[#0E1218]/80 backdrop-blur-xl transition-all duration-200 ${
        interactive
          ? 'hover:border-white/[0.14] hover:bg-[#121720]/90 hover:-translate-y-0.5 cursor-pointer'
          : ''
      } ${glowStyles[glow]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
