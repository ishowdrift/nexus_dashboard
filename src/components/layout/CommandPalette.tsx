import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Search,
  Target,
  Users2,
  FolderGit2,
  FileSpreadsheet,
  CreditCard,
  CheckSquare,
  ArrowRight,
  X,
} from 'lucide-react';
import { NavigationSection } from '../../types';

interface SearchResultItem {
  id: string;
  type: NavigationSection;
  title: string;
  subtitle: string;
  tag?: string;
  targetId: string;
}

export const CommandPalette: React.FC = () => {
  const {
    isCommandPaletteOpen,
    setIsCommandPaletteOpen,
    leads,
    clients,
    projects,
    proposals,
    payments,
    tasks,
    navigateTo,
  } = useApp();

  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isCommandPaletteOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isCommandPaletteOpen]);

  const results = useMemo<SearchResultItem[]>(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      // Recent / quick suggestions
      return [
        ...projects.slice(0, 3).map((p) => ({
          id: `p-${p.id}`,
          type: 'projects' as NavigationSection,
          title: p.projectName,
          subtitle: `Project • ${p.clientName} • ${p.status}`,
          tag: `${p.progress}%`,
          targetId: p.id,
        })),
        ...leads.slice(0, 2).map((l) => ({
          id: `l-${l.id}`,
          type: 'leads' as NavigationSection,
          title: l.name,
          subtitle: `Lead • ${l.company} • ${l.service}`,
          tag: `$${l.estimatedValue.toLocaleString()}`,
          targetId: l.id,
        })),
      ];
    }

    const items: SearchResultItem[] = [];

    // Search Projects
    projects.forEach((p) => {
      if (
        p.projectName.toLowerCase().includes(q) ||
        p.clientName.toLowerCase().includes(q) ||
        p.serviceType.toLowerCase().includes(q)
      ) {
        items.push({
          id: `proj-${p.id}`,
          type: 'projects',
          title: p.projectName,
          subtitle: `Project • ${p.clientName} • ${p.status}`,
          tag: `${p.progress}%`,
          targetId: p.id,
        });
      }
    });

    // Search Clients
    clients.forEach((c) => {
      if (
        c.name.toLowerCase().includes(q) ||
        c.company.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q)
      ) {
        items.push({
          id: `client-${c.id}`,
          type: 'clients',
          title: c.company,
          subtitle: `Client • ${c.name} • ${c.email}`,
          tag: `$${c.totalRevenue.toLocaleString()}`,
          targetId: c.id,
        });
      }
    });

    // Search Leads
    leads.forEach((l) => {
      if (
        l.name.toLowerCase().includes(q) ||
        l.company.toLowerCase().includes(q) ||
        l.service.toLowerCase().includes(q)
      ) {
        items.push({
          id: `lead-${l.id}`,
          type: 'leads',
          title: l.name,
          subtitle: `Lead • ${l.company} • ${l.status}`,
          tag: `$${l.estimatedValue.toLocaleString()}`,
          targetId: l.id,
        });
      }
    });

    // Search Proposals
    proposals.forEach((prop) => {
      if (
        prop.proposalNumber.toLowerCase().includes(q) ||
        prop.projectName.toLowerCase().includes(q) ||
        prop.clientName.toLowerCase().includes(q)
      ) {
        items.push({
          id: `prop-${prop.id}`,
          type: 'proposals',
          title: `${prop.proposalNumber}: ${prop.projectName}`,
          subtitle: `Proposal • ${prop.clientName} • ${prop.status}`,
          tag: `$${prop.proposalValue.toLocaleString()}`,
          targetId: prop.id,
        });
      }
    });

    // Search Invoices
    payments.forEach((pay) => {
      if (
        pay.invoiceNumber.toLowerCase().includes(q) ||
        pay.clientName.toLowerCase().includes(q) ||
        pay.projectName.toLowerCase().includes(q)
      ) {
        items.push({
          id: `pay-${pay.id}`,
          type: 'payments',
          title: `${pay.invoiceNumber} (${pay.clientName})`,
          subtitle: `Invoice • Due ${pay.dueDate} • ${pay.status}`,
          tag: `$${pay.amount.toLocaleString()}`,
          targetId: pay.id,
        });
      }
    });

    // Search Tasks
    tasks.forEach((t) => {
      if (
        t.title.toLowerCase().includes(q) ||
        (t.projectName && t.projectName.toLowerCase().includes(q)) ||
        (t.clientName && t.clientName.toLowerCase().includes(q))
      ) {
        items.push({
          id: `task-${t.id}`,
          type: 'tasks',
          title: t.title,
          subtitle: `Task • ${t.projectName || 'General'} • Priority: ${t.priority}`,
          tag: t.status,
          targetId: t.id,
        });
      }
    });

    return items.slice(0, 10);
  }, [query, projects, clients, leads, proposals, payments, tasks]);

  const handleSelect = (item: SearchResultItem) => {
    navigateTo(item.type, item.targetId);
    setIsCommandPaletteOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, results.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + results.length) % Math.max(1, results.length));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (results[selectedIndex]) {
        handleSelect(results[selectedIndex]);
      }
    } else if (e.key === 'Escape') {
      setIsCommandPaletteOpen(false);
    }
  };

  if (!isCommandPaletteOpen) return null;

  const iconMap: Record<NavigationSection, React.ReactNode> = {
    overview: <Search className="w-4 h-4 text-slate-400" />,
    leads: <Target className="w-4 h-4 text-emerald-400" />,
    clients: <Users2 className="w-4 h-4 text-cyan-400" />,
    projects: <FolderGit2 className="w-4 h-4 text-amber-400" />,
    proposals: <FileSpreadsheet className="w-4 h-4 text-violet-400" />,
    payments: <CreditCard className="w-4 h-4 text-rose-400" />,
    tasks: <CheckSquare className="w-4 h-4 text-blue-400" />,
    calendar: <Search className="w-4 h-4 text-slate-400" />,
    settings: <Search className="w-4 h-4 text-slate-400" />,
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 sm:px-6"
    >
      <div
        className="fixed inset-0 bg-[#050608]/85 backdrop-blur-md"
        onClick={() => setIsCommandPaletteOpen(false)}
      />

      <div
        className="relative w-full max-w-2xl bg-[#0E131B] border border-white/[0.12] rounded-2xl shadow-[0_25px_70px_rgba(0,0,0,0.85)] overflow-hidden z-10 animate-in zoom-in-95 duration-150"
        onKeyDown={handleKeyDown}
      >
        {/* Search Bar Input */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-white/[0.08] bg-[#0A0D13]">
          <Search className="w-5 h-5 text-emerald-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Type to search across everything (leads, clients, projects, tasks, invoices)..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            className="w-full bg-transparent text-white placeholder-slate-500 text-sm focus:outline-none"
          />
          <button
            type="button"
            onClick={() => setIsCommandPaletteOpen(false)}
            className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-white/[0.06]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-2">
          {results.length === 0 ? (
            <div className="p-8 text-center text-sm text-slate-400">
              No matching records found for "{query}".
            </div>
          ) : (
            <div className="space-y-1">
              <div className="px-3 py-1 text-[10px] font-mono uppercase tracking-wider text-slate-400">
                {query ? 'Search Results' : 'Suggested Jumps'}
              </div>
              {results.map((item, idx) => {
                const isSelected = idx === selectedIndex;
                return (
                  <div
                    key={item.id}
                    onClick={() => handleSelect(item)}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-emerald-500/10 border border-emerald-500/30 text-white'
                        : 'text-slate-300 hover:bg-white/[0.04]'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="p-2 rounded-lg bg-white/[0.04] border border-white/[0.06] shrink-0">
                        {iconMap[item.type]}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold truncate text-slate-100">
                          {item.title}
                        </p>
                        <p className="text-xs text-slate-400 truncate">
                          {item.subtitle}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0 ml-3">
                      {item.tag && (
                        <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-white/[0.06] text-slate-300">
                          {item.tag}
                        </span>
                      )}
                      <ArrowRight className="w-4 h-4 text-slate-400" />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Command Footer */}
        <div className="flex items-center justify-between px-5 py-2.5 bg-[#080A0E] border-t border-white/[0.06] text-[11px] text-slate-400 font-mono">
          <div className="flex items-center gap-3">
            <span>↑↓ Navigate</span>
            <span>↵ Select</span>
            <span>Esc Close</span>
          </div>
          <span className="text-emerald-400">NEXUS Global Search</span>
        </div>
      </div>
    </div>
  );
};
