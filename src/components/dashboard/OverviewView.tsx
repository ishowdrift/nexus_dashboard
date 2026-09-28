import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  FolderGit2,
  Target,
  CreditCard,
  TrendingUp,
  AlertCircle,
  Plus,
  ArrowUpRight,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { RevenueChart } from './RevenueChart';
import { PipelineBar } from './PipelineBar';
import { ActiveProjectsOverview } from './ActiveProjectsOverview';
import { TodayTasksWidget } from './TodayTasksWidget';
import { UpcomingDeadlinesWidget } from './UpcomingDeadlinesWidget';
import { Button } from '../common/Button';

export const OverviewView: React.FC = () => {
  const { financialMetrics, settings, navigateTo, setIsCommandPaletteOpen } = useApp();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const currentDate = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date());

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Editorial Header Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-gradient-to-br from-[#10141D] via-[#0E1219] to-[#0A0C11] p-6 sm:p-8 backdrop-blur-2xl">
        {/* Subtle ambient neon glow spot */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20">
                <Sparkles className="w-3.5 h-3.5" />
                Studio Intelligence Active
              </span>
              <span className="text-xs text-slate-400 font-mono">
                {currentDate}
              </span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
              {getGreeting()},{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
                {settings.freelancerName}
              </span>
            </h2>

            <p className="mt-2 text-sm text-slate-300 max-w-xl leading-relaxed">
              You have{' '}
              <strong className="text-emerald-400 font-semibold">
                {financialMetrics.activeProjectsCount} active projects
              </strong>{' '}
              moving toward milestone sign-offs, with{' '}
              <strong className="text-cyan-300 font-semibold">
                ${financialMetrics.pendingAmount.toLocaleString()}
              </strong>{' '}
              in scheduled milestone receivables.
            </p>
          </div>

          {/* Quick Primary Actions */}
          <div className="flex items-center gap-3 shrink-0">
            <Button
              variant="outline"
              size="md"
              onClick={() => setIsCommandPaletteOpen(true)}
              className="text-xs"
            >
              Quick Search (⌘K)
            </Button>
            <Button
              variant="neon"
              size="md"
              onClick={() => navigateTo('leads')}
              icon={<Plus className="w-4 h-4" />}
            >
              Add New Lead
            </Button>
          </div>
        </div>
      </div>

      {/* 4 High-Level Metric Cards (Restrained, Editorial Presentation) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Active Projects */}
        <div
          onClick={() => navigateTo('projects')}
          className="rounded-2xl border border-white/[0.06] bg-[#0E1218]/90 p-5 backdrop-blur-xl hover:border-emerald-500/30 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
              Active Projects
            </span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 group-hover:scale-110 transition-transform">
              <FolderGit2 className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-mono text-white">
              {financialMetrics.activeProjectsCount}
            </span>
            <span className="text-xs text-emerald-400 font-mono">
              All on schedule
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400 pt-3 border-t border-white/[0.04]">
            <span>Average Progress</span>
            <span className="text-slate-200 font-mono font-medium">74%</span>
          </div>
        </div>

        {/* Metric 2: Total Pipeline Leads */}
        <div
          onClick={() => navigateTo('leads')}
          className="rounded-2xl border border-white/[0.06] bg-[#0E1218]/90 p-5 backdrop-blur-xl hover:border-cyan-500/30 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
              Pipeline Leads
            </span>
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 group-hover:scale-110 transition-transform">
              <Target className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-mono text-white">
              {financialMetrics.totalLeadsCount}
            </span>
            <span className="text-xs text-cyan-400 font-mono">
              ${financialMetrics.pipelineValue.toLocaleString()} potential
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400 pt-3 border-t border-white/[0.04]">
            <span>Win Conversion</span>
            <span className="text-cyan-300 font-mono font-medium">42.8%</span>
          </div>
        </div>

        {/* Metric 3: Pending Payments */}
        <div
          onClick={() => navigateTo('payments')}
          className="rounded-2xl border border-white/[0.06] bg-[#0E1218]/90 p-5 backdrop-blur-xl hover:border-violet-500/30 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
              Pending Invoices
            </span>
            <div className="p-2 rounded-xl bg-violet-500/10 text-violet-400 group-hover:scale-110 transition-transform">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-mono text-white">
              ${financialMetrics.pendingAmount.toLocaleString()}
            </span>
            {financialMetrics.overdueAmount > 0 && (
              <span className="text-[10px] text-rose-400 bg-rose-500/10 px-1.5 py-0.5 rounded border border-rose-500/20 font-mono">
                ${financialMetrics.overdueAmount.toLocaleString()} overdue
              </span>
            )}
          </div>
          <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400 pt-3 border-t border-white/[0.04]">
            <span>Awaiting Settlement</span>
            <span className="text-violet-300 font-mono font-medium">3 invoices</span>
          </div>
        </div>

        {/* Metric 4: Monthly Revenue */}
        <div
          onClick={() => navigateTo('payments')}
          className="rounded-2xl border border-white/[0.06] bg-[#0E1218]/90 p-5 backdrop-blur-xl hover:border-emerald-500/30 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
              Total Revenue
            </span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 group-hover:scale-110 transition-transform">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-mono text-emerald-400">
              ${financialMetrics.totalRevenue.toLocaleString()}
            </span>
            <span className="text-xs text-emerald-400 font-mono">
              +18.4%
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400 pt-3 border-t border-white/[0.04]">
            <span>Year-to-date pace</span>
            <span className="text-emerald-300 font-mono font-medium">On Track</span>
          </div>
        </div>
      </div>

      {/* Revenue Velocity Chart */}
      <RevenueChart />

      {/* Conversion Pipeline Stepper */}
      <PipelineBar />

      {/* Active Projects Grid */}
      <ActiveProjectsOverview />

      {/* Split Row: Today's Tasks & Upcoming Deadlines */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TodayTasksWidget />
        <UpcomingDeadlinesWidget />
      </div>
    </div>
  );
};
