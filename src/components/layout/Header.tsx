import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Search,
  Bell,
  Plus,
  Target,
  Users2,
  FolderGit2,
  FileSpreadsheet,
  CreditCard,
  CheckSquare,
  Check,
  ChevronDown,
  Sparkles,
  Menu,
} from 'lucide-react';
import { Button } from '../common/Button';

interface HeaderProps {
  onMobileMenuToggle?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onMobileMenuToggle }) => {
  const {
    currentSection,
    setIsCommandPaletteOpen,
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    navigateTo,
    settings,
  } = useApp();

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isQuickMenuOpen, setIsQuickMenuOpen] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const quickRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Close menus on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setIsNotifOpen(false);
      }
      if (quickRef.current && !quickRef.current.contains(e.target as Node)) {
        setIsQuickMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Format greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const currentDateStr = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  }).format(new Date());

  const sectionTitles: Record<string, string> = {
    overview: 'Executive Dashboard',
    leads: 'Lead Generation Pipeline',
    clients: 'Client Directory & Accounts',
    projects: 'Active Projects & Milestones',
    proposals: 'Proposals & Pitches',
    payments: 'Financial Ledger & Invoices',
    tasks: 'Actionable Tasks & Sprints',
    calendar: 'Master Calendar & Agenda',
    settings: 'Studio OS Settings',
  };

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between h-20 px-4 md:px-8 border-b border-white/[0.06] bg-[#080A0E]/80 backdrop-blur-2xl">
      {/* Left: Mobile Toggle & Title */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMobileMenuToggle}
          className="md:hidden p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/[0.05] transition-colors"
          aria-label="Toggle Navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg md:text-xl font-bold tracking-tight text-white">
              {sectionTitles[currentSection] || 'NEXUS'}
            </h1>
          </div>
          <p className="text-xs text-slate-400 flex items-center gap-1.5 hidden sm:flex">
            <span>{getGreeting()}, <strong className="text-slate-200 font-semibold">{settings.freelancerName}</strong></span>
            <span className="text-slate-600">•</span>
            <span>{currentDateStr}</span>
          </p>
        </div>
      </div>

      {/* Right Controls: Search, Quick Add, Notifications, Profile */}
      <div className="flex items-center gap-2.5 sm:gap-3.5">
        {/* Global Search Bar (Trigger) */}
        <button
          type="button"
          onClick={() => setIsCommandPaletteOpen(true)}
          className="flex items-center gap-3 px-3 py-2 text-xs text-slate-400 bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.08] hover:border-white/[0.14] rounded-xl transition-all cursor-pointer group"
          title="Search anything (Ctrl+K)"
        >
          <Search className="w-4 h-4 text-slate-400 group-hover:text-emerald-400 transition-colors" />
          <span className="hidden lg:inline text-slate-400 group-hover:text-slate-200">
            Search leads, clients, projects, tasks...
          </span>
          <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono text-slate-400 bg-black/40 border border-white/10 rounded">
            ⌘K
          </kbd>
        </button>

        {/* Quick Add Menu */}
        <div className="relative" ref={quickRef}>
          <Button
            variant="neon"
            size="sm"
            onClick={() => setIsQuickMenuOpen((prev) => !prev)}
            icon={<Plus className="w-4 h-4" />}
            className="hidden sm:inline-flex"
          >
            <span>New</span>
            <ChevronDown className="w-3.5 h-3.5 ml-1 opacity-75" />
          </Button>

          {/* Mobile Icon Button */}
          <button
            type="button"
            onClick={() => setIsQuickMenuOpen((prev) => !prev)}
            className="sm:hidden p-2 text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 rounded-xl hover:bg-emerald-500/20"
            aria-label="Create New Record"
          >
            <Plus className="w-5 h-5" />
          </button>

          {/* Quick Dropdown */}
          {isQuickMenuOpen && (
            <div className="absolute right-0 mt-2 w-56 p-1.5 rounded-2xl bg-[#0E131B] border border-white/[0.1] shadow-[0_20px_50px_rgba(0,0,0,0.8)] z-50 text-slate-200 animate-in fade-in zoom-in-95 duration-150">
              <div className="px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider text-slate-400 border-b border-white/[0.06]">
                Quick Create
              </div>
              <button
                type="button"
                onClick={() => {
                  navigateTo('leads');
                  setIsQuickMenuOpen(false);
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs rounded-xl hover:bg-white/[0.06] hover:text-white transition-colors text-left"
              >
                <Target className="w-4 h-4 text-emerald-400" />
                <span>New Lead</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  navigateTo('clients');
                  setIsQuickMenuOpen(false);
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs rounded-xl hover:bg-white/[0.06] hover:text-white transition-colors text-left"
              >
                <Users2 className="w-4 h-4 text-cyan-400" />
                <span>New Client</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  navigateTo('projects');
                  setIsQuickMenuOpen(false);
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs rounded-xl hover:bg-white/[0.06] hover:text-white transition-colors text-left"
              >
                <FolderGit2 className="w-4 h-4 text-amber-400" />
                <span>New Project</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  navigateTo('proposals');
                  setIsQuickMenuOpen(false);
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs rounded-xl hover:bg-white/[0.06] hover:text-white transition-colors text-left"
              >
                <FileSpreadsheet className="w-4 h-4 text-violet-400" />
                <span>New Proposal</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  navigateTo('payments');
                  setIsQuickMenuOpen(false);
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs rounded-xl hover:bg-white/[0.06] hover:text-white transition-colors text-left"
              >
                <CreditCard className="w-4 h-4 text-rose-400" />
                <span>New Invoice / Payment</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  navigateTo('tasks');
                  setIsQuickMenuOpen(false);
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs rounded-xl hover:bg-white/[0.06] hover:text-white transition-colors text-left"
              >
                <CheckSquare className="w-4 h-4 text-blue-400" />
                <span>New Task</span>
              </button>
            </div>
          )}
        </div>

        {/* Notifications Dropdown */}
        <div className="relative" ref={notifRef}>
          <button
            type="button"
            onClick={() => setIsNotifOpen((prev) => !prev)}
            className="relative p-2.5 text-slate-300 hover:text-white bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.08] rounded-xl transition-colors cursor-pointer"
            aria-label="View notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-emerald-500 px-1 text-[10px] font-bold text-black shadow-[0_0_10px_rgba(16,185,129,0.8)]">
                {unreadCount}
              </span>
            )}
          </button>

          {isNotifOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-[#0E131B] border border-white/[0.1] shadow-[0_20px_50px_rgba(0,0,0,0.8)] z-50 text-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06] bg-[#0A0D13]/60">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-semibold text-white">Notifications</span>
                  {unreadCount > 0 && (
                    <span className="text-[10px] px-1.5 py-0.2 bg-emerald-500/10 text-emerald-400 rounded-full border border-emerald-500/20">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    type="button"
                    onClick={markAllNotificationsRead}
                    className="text-[11px] text-slate-400 hover:text-emerald-400 transition-colors flex items-center gap-1"
                  >
                    <Check className="w-3 h-3" />
                    Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-white/[0.04]">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-xs text-slate-400">
                    No notifications right now.
                  </div>
                ) : (
                  notifications.map((notif) => (
                    <div
                      key={notif.id}
                      onClick={() => {
                        markNotificationRead(notif.id);
                        navigateTo(notif.linkSection, notif.targetId);
                        setIsNotifOpen(false);
                      }}
                      className={`p-3.5 hover:bg-white/[0.04] transition-colors cursor-pointer flex items-start gap-3 ${
                        !notif.read ? 'bg-emerald-500/[0.03]' : 'opacity-70'
                      }`}
                    >
                      <div
                        className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                          !notif.read
                            ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]'
                            : 'bg-slate-600'
                        }`}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-slate-200 truncate">
                          {notif.title}
                        </p>
                        <p className="text-[11px] text-slate-400 line-clamp-2 mt-0.5">
                          {notif.message}
                        </p>
                        <span className="text-[10px] text-slate-400 font-mono mt-1 inline-block">
                          {notif.date}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
