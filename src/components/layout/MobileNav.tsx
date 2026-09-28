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
  X,
  Sparkles,
} from 'lucide-react';

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ isOpen, onClose }) => {
  const { currentSection, setCurrentSection, settings, financialMetrics } = useApp();

  const navItems = [
    { id: 'overview' as NavigationSection, label: 'Overview', icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: 'leads' as NavigationSection, label: 'Leads Hub', icon: <Target className="w-5 h-5" />, badge: financialMetrics.totalLeadsCount },
    { id: 'clients' as NavigationSection, label: 'Clients', icon: <Users2 className="w-5 h-5" /> },
    { id: 'projects' as NavigationSection, label: 'Projects', icon: <FolderGit2 className="w-5 h-5" />, badge: financialMetrics.activeProjectsCount },
    { id: 'proposals' as NavigationSection, label: 'Proposals', icon: <FileSpreadsheet className="w-5 h-5" /> },
    { id: 'payments' as NavigationSection, label: 'Payments', icon: <CreditCard className="w-5 h-5" />, badge: financialMetrics.overdueAmount > 0 ? 1 : undefined },
    { id: 'tasks' as NavigationSection, label: 'Tasks', icon: <CheckSquare className="w-5 h-5" />, badge: financialMetrics.pendingTasksCount },
    { id: 'calendar' as NavigationSection, label: 'Calendar', icon: <Calendar className="w-5 h-5" /> },
    { id: 'settings' as NavigationSection, label: 'Settings', icon: <Settings className="w-5 h-5" /> },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 md:hidden flex">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#050608]/80 backdrop-blur-md"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="relative w-72 max-w-[80vw] h-full bg-[#0A0D13] border-r border-white/[0.08] shadow-2xl flex flex-col z-10 animate-in slide-in-from-left duration-200">
        <div className="flex items-center justify-between p-5 border-b border-white/[0.06]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center text-slate-950 font-black">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="font-bold text-white tracking-tight">NEXUS PRO</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/[0.06]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = currentSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentSection(item.id);
                  onClose();
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-emerald-500/15 text-emerald-300 border-l-2 border-emerald-400'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-white/[0.04]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={isActive ? 'text-emerald-400' : 'text-slate-400'}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="px-2 py-0.5 text-xs font-mono rounded-full bg-white/[0.06] text-slate-300">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/[0.06] bg-[#07090D]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-600 to-emerald-500 flex items-center justify-center text-xs font-bold text-white">
              {settings.freelancerName.charAt(0)}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-slate-200 truncate">
                {settings.freelancerName}
              </p>
              <p className="text-[10px] text-slate-400 truncate">{settings.agencyName}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
