import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Lead, LeadStatus } from '../../types';
import { Badge, BadgeVariant } from '../common/Badge';
import { Button } from '../common/Button';
import { EmptyState } from '../common/EmptyState';
import { LeadModal } from './LeadModal';
import { LeadDetailDrawer } from './LeadDetailDrawer';
import {
  Search,
  Plus,
  Filter,
  ArrowUpDown,
  Building,
  Mail,
  Calendar,
  DollarSign,
  MoreVertical,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

const STATUS_PILLS: { label: string; value: 'All' | LeadStatus }[] = [
  { label: 'All Leads', value: 'All' },
  { label: 'New', value: 'New' },
  { label: 'Contacted', value: 'Contacted' },
  { label: 'Qualified', value: 'Qualified' },
  { label: 'Proposal Sent', value: 'Proposal Sent' },
  { label: 'Negotiation', value: 'Negotiation' },
  { label: 'Won', value: 'Won' },
  { label: 'Lost', value: 'Lost' },
];

export const LeadsView: React.FC = () => {
  const { leads, setSelectedLeadId, selectedLeadId } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<'All' | LeadStatus>('All');
  const [sortBy, setSortBy] = useState<'value' | 'date' | 'name' | 'followup'>('value');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [leadToEdit, setLeadToEdit] = useState<Lead | null>(null);

  const filteredLeads = useMemo(() => {
    return leads
      .filter((lead) => {
        const matchesStatus =
          selectedStatus === 'All' || lead.status === selectedStatus;
        const q = searchQuery.toLowerCase();
        const matchesQuery =
          !q ||
          lead.name.toLowerCase().includes(q) ||
          lead.company.toLowerCase().includes(q) ||
          lead.service.toLowerCase().includes(q) ||
          lead.email.toLowerCase().includes(q);
        return matchesStatus && matchesQuery;
      })
      .sort((a, b) => {
        if (sortBy === 'value') return b.estimatedValue - a.estimatedValue;
        if (sortBy === 'date') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        if (sortBy === 'name') return a.name.localeCompare(b.name);
        if (sortBy === 'followup') return new Date(a.nextFollowUp).getTime() - new Date(b.nextFollowUp).getTime();
        return 0;
      });
  }, [leads, selectedStatus, searchQuery, sortBy]);

  const statusVariantMap: Record<LeadStatus, BadgeVariant> = {
    New: 'default',
    Contacted: 'cyan',
    Qualified: 'blue',
    'Proposal Sent': 'violet',
    Negotiation: 'amber',
    Won: 'emerald',
    Lost: 'rose',
  };

  const handleOpenAdd = () => {
    setLeadToEdit(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = () => {
    const lead = leads.find((l) => l.id === selectedLeadId);
    if (lead) {
      setLeadToEdit(lead);
      setIsModalOpen(true);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            Lead Management
            <span className="text-xs font-mono font-medium px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              {leads.length} Active Deals
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Qualify opportunities, schedule follow-ups, and convert wins directly into active projects
          </p>
        </div>

        <Button
          variant="neon"
          size="md"
          onClick={handleOpenAdd}
          icon={<Plus className="w-4 h-4" />}
        >
          Add New Lead
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 p-3 rounded-2xl border border-white/[0.06] bg-[#0E1218]/80 backdrop-blur-xl">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search leads by name, company, email, or proposed service..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#0A0D13] text-white text-xs pl-10 pr-4 py-2.5 rounded-xl border border-white/[0.08] focus:outline-none focus:border-emerald-500/50"
          />
        </div>

        {/* Sort Select */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#0A0D13] border border-white/[0.08] text-xs text-slate-300">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-400">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent text-white focus:outline-none cursor-pointer"
            >
              <option value="value" className="bg-[#0E131B]">Deal Value</option>
              <option value="followup" className="bg-[#0E131B]">Next Follow-up</option>
              <option value="date" className="bg-[#0E131B]">Date Added</option>
              <option value="name" className="bg-[#0E131B]">Contact Name</option>
            </select>
          </div>
        </div>
      </div>

      {/* Status Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {STATUS_PILLS.map((pill) => {
          const isSelected = selectedStatus === pill.value;
          const count =
            pill.value === 'All'
              ? leads.length
              : leads.filter((l) => l.status === pill.value).length;

          return (
            <button
              key={pill.value}
              type="button"
              onClick={() => setSelectedStatus(pill.value)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                isSelected
                  ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 shadow-[0_0_12px_rgba(16,185,129,0.2)]'
                  : 'text-slate-400 hover:text-slate-200 bg-white/[0.02] border border-white/[0.04]'
              }`}
            >
              <span>{pill.label}</span>
              <span
                className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                  isSelected ? 'bg-emerald-500/20 text-emerald-200' : 'bg-white/[0.05] text-slate-400'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Leads List / Table Hybrid */}
      {filteredLeads.length === 0 ? (
        <EmptyState
          icon={<Filter className="w-6 h-6" />}
          title="No matching leads"
          description="Try changing your search query or status filter to see other opportunities."
          actionLabel="Clear Filters"
          onAction={() => {
            setSearchQuery('');
            setSelectedStatus('All');
          }}
        />
      ) : (
        <div className="rounded-2xl border border-white/[0.06] bg-[#0E1218]/90 overflow-hidden backdrop-blur-xl">
          <div className="divide-y divide-white/[0.04]">
            {filteredLeads.map((lead) => (
              <div
                key={lead.id}
                onClick={() => setSelectedLeadId(lead.id)}
                className="p-4 sm:p-5 hover:bg-white/[0.03] transition-colors cursor-pointer group flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                {/* Left: Contact & Company */}
                <div className="flex items-start gap-4 min-w-0">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-slate-800 to-slate-700 border border-white/10 flex items-center justify-center text-sm font-bold text-white shrink-0 group-hover:border-emerald-500/40 transition-colors">
                    {lead.name.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-semibold text-white group-hover:text-emerald-300 transition-colors">
                        {lead.name}
                      </span>
                      <Badge variant={statusVariantMap[lead.status]} size="xs" dot>
                        {lead.status}
                      </Badge>
                      <span className="text-[11px] font-mono text-slate-400">
                        via {lead.source}
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 font-medium mt-0.5 flex items-center gap-1.5">
                      <Building className="w-3.5 h-3.5 text-slate-400" />
                      {lead.company}
                    </p>

                    <p className="text-xs text-slate-400 line-clamp-1 mt-1">
                      {lead.service}
                    </p>
                  </div>
                </div>

                {/* Right: Deal Value, Follow-up, Arrow */}
                <div className="flex items-center justify-between md:justify-end gap-6 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-white/[0.04]">
                  {/* Next Follow-up */}
                  <div className="text-left md:text-right">
                    <span className="text-[10px] font-mono uppercase text-slate-400 block">
                      Next Follow-up
                    </span>
                    <span className="text-xs font-mono text-emerald-400 font-medium">
                      {lead.nextFollowUp || 'None scheduled'}
                    </span>
                  </div>

                  {/* Value */}
                  <div className="text-right">
                    <span className="text-[10px] font-mono uppercase text-slate-400 block">
                      Estimated Value
                    </span>
                    <span className="text-base font-bold font-mono text-white">
                      ${lead.estimatedValue.toLocaleString()}
                    </span>
                  </div>

                  <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add / Edit Modal */}
      <LeadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        leadToEdit={leadToEdit}
      />

      {/* Detail Drawer */}
      <LeadDetailDrawer onEdit={handleOpenEdit} />
    </div>
  );
};
