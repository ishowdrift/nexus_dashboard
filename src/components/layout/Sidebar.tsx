import React from 'react';
import { useApp } from '../../context/AppContext';
import { NavigationSection } from '../../types';
import {
  LayoutDashboard,
  Target,
  Users2,
  FolderGit2,
  FileSpreadsheet,
  CreditCard,
  CheckSquare,
  Calendar,
  Settings,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

interface NavItem {
  id: NavigationSection;
  label: string;
  icon: React.ReactNode;
  badge?: number;
}

export const Sidebar: React.FC = () => {
  const {
    currentSection,
    setCurrentSection,
    sidebarCollapsed,
    setSidebarCollapsed,
    financialMetrics,
    settings,
  } = useApp();

  const navItems: NavItem[] = [
    {
      id: 'overview',
      label: 'Overview',
      icon: <LayoutDashboard className="w-5 h-5 shrink-0" />,
    },
    {
      id: 'leads',
      label: 'Leads Hub',
      icon: <Target className="w-5 h-5 shrink-0" />,
      badge: financialMetrics.totalLeadsCount,
    },
    {
      id: 'clients',
      label: 'Clients',
      icon: <Users2 className="w-5 h-5 shrink-0" />,
    },
    {
      id: 'projects',
      label: 'Projects',
      icon: <FolderGit2 className="w-5 h-5 shrink-0" />,
      badge: financialMetrics.activeProjectsCount,
    },
    {
      id: 'proposals',
      label: 'Proposals',
      icon: <FileSpreadsheet className="w-5 h-5 shrink-0" />,
    },
    {
      id: 'payments',
      label: 'Payments & Invoices',
      icon: <CreditCard className="w-5 h-5 shrink-0" />,
      badge: financialMetrics.overdueAmount > 0 ? 1 : undefined,
    },
    {
      id: 'tasks',
      label: 'Tasks',
      icon: <CheckSquare className="w-5 h-5 shrink-0" />,
      badge: financialMetrics.pendingTasksCount,
    },
    {
      id: 'calendar',
      label: 'Calendar & Agenda',
      icon: <Calendar className="w-5 h-5 shrink-0" />,
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: <Settings className="w-5 h-5 shrink-0" />,
    },
  ];

  return (
    <aside
      className={`flex max-md:hidden flex-col shrink-0 h-screen sticky top-0 z-30 border-r border-white/[0.06] bg-[#0A0D13]/90 backdrop-blur-2xl transition-all duration-300 ${
        sidebarCollapsed ? 'w-20' : 'w-64'
      }`}
      aria-label="Main Navigation"
    >
      {/* Brand Header */}
      <div className="flex items-center justify-between h-20 px-5 border-b border-white/[0.05]">
        <div
          className={`flex items-center gap-3 overflow-hidden cursor-pointer ${
            sidebarCollapsed ? 'justify-center w-full' : ''
          }`}
          onClick={() => setCurrentSection('overview')}
        >
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-500 text-slate-950 font-black shadow-[0_0_20px_rgba(16,185,129,0.35)] shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          {!sidebarCollapsed && (
            <div className="min-w-0">
              <span className="text-lg font-bold tracking-tight text-white flex items-center gap-1.5">
                NEXUS
                <span className="text-[10px] uppercase tracking-widest font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                  PRO
                </span>
              </span>
              <p className="text-[11px] text-slate-400 truncate tracking-wide">
                {settings.agencyName}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-6 space-y-1.5 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
          {!sidebarCollapsed ? 'Workspace Menu' : '•••'}
        </div>
        {navItems.map((item) => {
          const isActive = currentSection === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentSection(item.id)}
              title={sidebarCollapsed ? item.label : undefined}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all group relative cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-r from-emerald-500/15 to-transparent text-emerald-300 border-l-2 border-emerald-400 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-white/[0.04]'
              } ${sidebarCollapsed ? 'justify-center px-0' : ''}`}
            >
              <div
                className={`transition-colors ${
                  isActive ? 'text-emerald-400' : 'text-slate-400 group-hover:text-slate-200'
                }`}
              >
                {item.icon}
              </div>

              {!sidebarCollapsed && (
                <span className="truncate flex-1 text-left">{item.label}</span>
              )}

              {!sidebarCollapsed && item.badge !== undefined && item.badge > 0 && (
                <span
                  className={`px-2 py-0.5 text-[11px] font-mono rounded-full ${
                    item.id === 'payments' && financialMetrics.overdueAmount > 0
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30 shadow-[0_0_10px_rgba(244,63,94,0.3)]'
                      : isActive
                      ? 'bg-emerald-500/20 text-emerald-300'
                      : 'bg-white/[0.06] text-slate-400'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom Profile Area & Collapse Toggle */}
      <div className="p-3 border-t border-white/[0.05] bg-[#07090D]/60 space-y-3">
        {/* User Mini Profile */}
        <div
          onClick={() => setCurrentSection('settings')}
          className={`flex items-center gap-3 p-2 rounded-xl hover:bg-white/[0.04] transition-colors cursor-pointer ${
            sidebarCollapsed ? 'justify-center' : ''
          }`}
          title="Account Settings"
        >
          <div className="relative shrink-0">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-cyan-600 to-emerald-500 flex items-center justify-center text-xs font-bold text-white shadow-[0_0_12px_rgba(16,185,129,0.3)]">
              {settings.freelancerName.charAt(0)}
            </div>
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-[#0A0D13]" />
          </div>
          {!sidebarCollapsed && (
            <div className="min-w-0 flex-1 text-left">
              <p className="text-xs font-semibold text-slate-200 truncate">
                {settings.freelancerName}
              </p>
              <p className="text-[11px] text-slate-400 truncate">{settings.roleTitle}</p>
            </div>
          )}
        </div>

        {/* Collapse Button */}
        <button
          type="button"
          onClick={() => setSidebarCollapsed((prev) => !prev)}
          className="w-full flex items-center justify-center p-2 text-xs text-slate-400 hover:text-slate-200 hover:bg-white/[0.04] rounded-lg transition-colors border border-white/[0.04]"
          aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {sidebarCollapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <div className="flex items-center gap-2">
              <ChevronLeft className="w-4 h-4" />
              <span>Collapse Sidebar</span>
            </div>
          )}
        </button>
      </div>
    </aside>
  );
};
