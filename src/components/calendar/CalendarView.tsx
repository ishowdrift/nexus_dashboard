import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Badge } from '../common/Badge';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  FolderGit2,
  CreditCard,
  Target,
  FileSpreadsheet,
  CheckSquare,
  Sparkles,
} from 'lucide-react';
import { NavigationSection } from '../../types';

interface CalendarEvent {
  id: string;
  title: string;
  subtitle: string;
  date: string;
  type: 'project' | 'payment' | 'proposal' | 'lead' | 'task';
  targetId: string;
}

export const CalendarView: React.FC = () => {
  const {
    projects,
    payments,
    proposals,
    leads,
    tasks,
    navigateTo,
  } = useApp();

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDateStr, setSelectedDateStr] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [typeFilter, setTypeFilter] = useState<'all' | 'project' | 'payment' | 'proposal' | 'lead' | 'task'>('all');

  // Compile calendar events from all entities
  const allEvents = useMemo<CalendarEvent[]>(() => {
    const list: CalendarEvent[] = [];

    // Project Deadlines
    projects.forEach((p) => {
      list.push({
        id: `p-${p.id}`,
        title: p.projectName,
        subtitle: `Project Deadline • ${p.clientName}`,
        date: p.deadline,
        type: 'project',
        targetId: p.id,
      });
    });

    // Payment Due Dates
    payments.forEach((pay) => {
      list.push({
        id: `pay-${pay.id}`,
        title: `${pay.invoiceNumber} ($${pay.amount.toLocaleString()})`,
        subtitle: `Invoice Due • ${pay.clientName}`,
        date: pay.dueDate,
        type: 'payment',
        targetId: pay.id,
      });
    });

    // Proposal Deadlines
    proposals.forEach((prop) => {
      list.push({
        id: `prop-${prop.id}`,
        title: `${prop.proposalNumber} Expiration`,
        subtitle: `Proposal • ${prop.clientName}`,
        date: prop.expirationDate,
        type: 'proposal',
        targetId: prop.id,
      });
    });

    // Lead Follow-ups
    leads.forEach((l) => {
      if (l.nextFollowUp) {
        list.push({
          id: `lead-${l.id}`,
          title: `Follow up: ${l.name}`,
          subtitle: `Lead Follow-up • ${l.company}`,
          date: l.nextFollowUp,
          type: 'lead',
          targetId: l.id,
        });
      }
    });

    // Tasks Due
    tasks.forEach((t) => {
      list.push({
        id: `task-${t.id}`,
        title: t.title,
        subtitle: `Task Due • Priority: ${t.priority}`,
        date: t.dueDate,
        type: 'task',
        targetId: t.id,
      });
    });

    return list;
  }, [projects, payments, proposals, leads, tasks]);

  const filteredEvents = useMemo(() => {
    if (typeFilter === 'all') return allEvents;
    return allEvents.filter((e) => e.type === typeFilter);
  }, [allEvents, typeFilter]);

  // Calendar matrix calculations
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleToday = () => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDateStr(today.toISOString().split('T')[0]);
  };

  // Group events by date string
  const eventsByDate = useMemo(() => {
    const map: Record<string, CalendarEvent[]> = {};
    filteredEvents.forEach((e) => {
      if (!map[e.date]) map[e.date] = [];
      map[e.date].push(e);
    });
    return map;
  }, [filteredEvents]);

  const selectedDateEvents = eventsByDate[selectedDateStr] || [];

  const typeConfig: Record<
    string,
    { label: string; dot: string; text: string; bg: string; icon: React.ReactNode; nav: NavigationSection }
  > = {
    project: {
      label: 'Project Deadline',
      dot: 'bg-amber-400',
      text: 'text-amber-300',
      bg: 'bg-amber-500/10 border-amber-500/20',
      icon: <FolderGit2 className="w-3.5 h-3.5 text-amber-400" />,
      nav: 'projects',
    },
    payment: {
      label: 'Invoice Due',
      dot: 'bg-emerald-400',
      text: 'text-emerald-300',
      bg: 'bg-emerald-500/10 border-emerald-500/20',
      icon: <CreditCard className="w-3.5 h-3.5 text-emerald-400" />,
      nav: 'payments',
    },
    proposal: {
      label: 'Proposal Decision',
      dot: 'bg-violet-400',
      text: 'text-violet-300',
      bg: 'bg-violet-500/10 border-violet-500/20',
      icon: <FileSpreadsheet className="w-3.5 h-3.5 text-violet-400" />,
      nav: 'proposals',
    },
    lead: {
      label: 'Lead Follow-up',
      dot: 'bg-cyan-400',
      text: 'text-cyan-300',
      bg: 'bg-cyan-500/10 border-cyan-500/20',
      icon: <Target className="w-3.5 h-3.5 text-cyan-400" />,
      nav: 'leads',
    },
    task: {
      label: 'Task Due',
      dot: 'bg-blue-400',
      text: 'text-blue-300',
      bg: 'bg-blue-500/10 border-blue-500/20',
      icon: <CheckSquare className="w-3.5 h-3.5 text-blue-400" />,
      nav: 'tasks',
    },
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            Master Calendar & Agenda
            <span className="text-xs font-mono font-medium px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              {filteredEvents.length} Events
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Consolidated timeline of project deliveries, invoice due dates, client follow-ups, and tasks
          </p>
        </div>

        {/* Month Navigation Controls */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleToday}
            className="px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] rounded-xl border border-white/[0.08] transition-colors"
          >
            Today
          </button>
          <div className="flex items-center gap-1 p-1 rounded-xl bg-white/[0.04] border border-white/[0.08]">
            <button
              type="button"
              onClick={handlePrevMonth}
              className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-white/[0.06]"
              aria-label="Previous month"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-3 text-xs font-semibold text-white font-mono min-w-[130px] text-center">
              {monthNames[month]} {year}
            </span>
            <button
              type="button"
              onClick={handleNextMonth}
              className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-white/[0.06]"
              aria-label="Next month"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Filter Badges */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {[
          { id: 'all', label: 'All Scheduled Events' },
          { id: 'project', label: 'Project Deadlines' },
          { id: 'payment', label: 'Invoice Settlements' },
          { id: 'proposal', label: 'Proposal Deadlines' },
          { id: 'lead', label: 'Lead Follow-ups' },
          { id: 'task', label: 'Sprint Tasks' },
        ].map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setTypeFilter(f.id as any)}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
              typeFilter === f.id
                ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
                : 'text-slate-400 hover:text-slate-200 bg-white/[0.02] border border-white/[0.04]'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Main Grid: Calendar Month on Left, Selected Day Agenda on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Month Calendar Grid (2 cols) */}
        <div className="lg:col-span-2 rounded-2xl border border-white/[0.06] bg-[#0E1218]/90 p-5 backdrop-blur-xl">
          {/* Day Names Header */}
          <div className="grid grid-cols-7 gap-1 text-center pb-3 border-b border-white/[0.06] text-[11px] font-mono uppercase tracking-wider text-slate-400">
            <span>Sun</span>
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
          </div>

          {/* Month Days Matrix */}
          <div className="grid grid-cols-7 gap-1 pt-2">
            {/* Blank leading cells */}
            {Array.from({ length: firstDayOfMonth }).map((_, i) => (
              <div key={`blank-${i}`} className="h-20 sm:h-24 p-1.5 opacity-20" />
            ))}

            {/* Days in Month */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const dayNum = i + 1;
              const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(
                dayNum
              ).padStart(2, '0')}`;
              const isSelected = selectedDateStr === dateStr;
              const todayStr = new Date().toISOString().split('T')[0];
              const isToday = todayStr === dateStr;
              const dayEvents = eventsByDate[dateStr] || [];

              return (
                <div
                  key={dayNum}
                  onClick={() => setSelectedDateStr(dateStr)}
                  className={`h-20 sm:h-24 p-1.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'border-emerald-500/60 bg-emerald-500/[0.05] shadow-[0_0_15px_rgba(16,185,129,0.15)]'
                      : isToday
                      ? 'border-cyan-500/40 bg-cyan-500/[0.03]'
                      : 'border-white/[0.03] bg-white/[0.01] hover:bg-white/[0.03] hover:border-white/[0.08]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-mono font-medium ${
                        isToday
                          ? 'w-5 h-5 rounded-full bg-cyan-400 text-slate-950 flex items-center justify-center font-bold'
                          : isSelected
                          ? 'text-emerald-400 font-bold'
                          : 'text-slate-400'
                      }`}
                    >
                      {dayNum}
                    </span>
                    {dayEvents.length > 0 && (
                      <span className="text-[10px] font-mono text-slate-400">
                        {dayEvents.length}
                      </span>
                    )}
                  </div>

                  {/* Event indicators dots/chips */}
                  <div className="space-y-1 overflow-hidden">
                    {dayEvents.slice(0, 2).map((ev) => (
                      <div
                        key={ev.id}
                        className={`text-[9px] truncate px-1 py-0.5 rounded border font-mono ${
                          typeConfig[ev.type]?.bg || 'bg-white/5 border-white/10'
                        } ${typeConfig[ev.type]?.text || 'text-slate-300'}`}
                      >
                        {ev.title}
                      </div>
                    ))}
                    {dayEvents.length > 2 && (
                      <span className="text-[8px] text-slate-400 font-mono block">
                        +{dayEvents.length - 2} more
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Day Agenda (1 col) */}
        <div className="rounded-2xl border border-white/[0.06] bg-[#0E1218]/90 p-5 backdrop-blur-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.06] mb-4">
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
                  Agenda Detail
                </span>
                <h3 className="text-base font-bold text-white font-mono mt-0.5">
                  {selectedDateStr}
                </h3>
              </div>
              <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                {selectedDateEvents.length} Items
              </span>
            </div>

            {selectedDateEvents.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">
                <Clock className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                No events or deadlines on this day.
              </div>
            ) : (
              <div className="space-y-3 max-h-[460px] overflow-y-auto">
                {selectedDateEvents.map((ev) => {
                  const cfg = typeConfig[ev.type];
                  return (
                    <div
                      key={ev.id}
                      onClick={() => navigateTo(cfg.nav, ev.targetId)}
                      className="p-3.5 rounded-xl border border-white/[0.06] bg-[#0A0D13] hover:border-white/[0.14] transition-all cursor-pointer group"
                    >
                      <div className="flex items-center gap-2 mb-1.5">
                        {cfg.icon}
                        <span className="text-[10px] font-mono uppercase text-slate-400">
                          {cfg.label}
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-white group-hover:text-emerald-300 transition-colors">
                        {ev.title}
                      </p>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        {ev.subtitle}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-white/[0.05] text-[11px] text-slate-400 font-mono">
            Click on any event card to view and manage its full record.
          </div>
        </div>
      </div>
    </div>
  );
};
