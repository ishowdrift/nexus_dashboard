import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Proposal, ProposalStatus } from '../../types';
import { Badge, BadgeVariant } from '../common/Badge';
import { Button } from '../common/Button';
import { EmptyState } from '../common/EmptyState';
import { ProposalModal } from './ProposalModal';
import { ProposalDetailModal } from './ProposalDetailModal';
import {
  FileSpreadsheet,
  Plus,
  Search,
  Calendar,
  DollarSign,
  TrendingUp,
  Building,
  CheckCircle2,
  Clock,
} from 'lucide-react';

const STATUS_OPTIONS: { label: string; value: 'All' | ProposalStatus }[] = [
  { label: 'All Proposals', value: 'All' },
  { label: 'Sent', value: 'Sent' },
  { label: 'Negotiating', value: 'Negotiating' },
  { label: 'Accepted', value: 'Accepted' },
  { label: 'Viewed', value: 'Viewed' },
  { label: 'Draft', value: 'Draft' },
  { label: 'Rejected', value: 'Rejected' },
];

export const ProposalsView: React.FC = () => {
  const { proposals, setSelectedProposalId, selectedProposalId } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<'All' | ProposalStatus>('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [proposalToEdit, setProposalToEdit] = useState<Proposal | null>(null);

  const filteredProposals = useMemo(() => {
    return proposals.filter((prop) => {
      const matchesStatus =
        selectedStatus === 'All' || prop.status === selectedStatus;
      const q = searchQuery.toLowerCase();
      const matchesQuery =
        !q ||
        prop.proposalNumber.toLowerCase().includes(q) ||
        prop.projectName.toLowerCase().includes(q) ||
        prop.clientName.toLowerCase().includes(q);
      return matchesStatus && matchesQuery;
    });
  }, [proposals, selectedStatus, searchQuery]);

  const totalProposedValue = proposals.reduce(
    (acc, p) => acc + p.proposalValue,
    0
  );
  const acceptedProposals = proposals.filter((p) => p.status === 'Accepted');
  const acceptedValue = acceptedProposals.reduce(
    (acc, p) => acc + p.proposalValue,
    0
  );
  const acceptanceRate =
    proposals.length > 0
      ? Math.round((acceptedProposals.length / proposals.length) * 100)
      : 0;

  const statusVariantMap: Record<ProposalStatus, BadgeVariant> = {
    Draft: 'slate',
    Sent: 'cyan',
    Viewed: 'blue',
    Negotiating: 'amber',
    Accepted: 'emerald',
    Rejected: 'rose',
  };

  const handleOpenAdd = () => {
    setProposalToEdit(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = () => {
    const prop = proposals.find((p) => p.id === selectedProposalId);
    if (prop) {
      setProposalToEdit(prop);
      setIsModalOpen(true);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            Proposals & Pitch Decks
            <span className="text-xs font-mono font-medium px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-400 border border-violet-500/20">
              {proposals.length} Proposals
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Track commercial estimates, validity countdowns, and accepted deal scopes
          </p>
        </div>

        <Button
          variant="neon"
          size="md"
          onClick={handleOpenAdd}
          icon={<Plus className="w-4 h-4" />}
        >
          Draft Proposal
        </Button>
      </div>

      {/* KPI Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-white/[0.06] bg-[#0E1218]/90 p-5 backdrop-blur-xl">
          <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
            Total Pipeline Value
          </span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-extrabold font-mono text-white">
              ${totalProposedValue.toLocaleString()}
            </span>
            <span className="text-xs text-slate-400 font-mono">
              across {proposals.length} pitches
            </span>
          </div>
        </div>

        <div className="rounded-2xl border border-white/[0.06] bg-[#0E1218]/90 p-5 backdrop-blur-xl">
          <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
            Accepted Revenue
          </span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-extrabold font-mono text-emerald-400">
              ${acceptedValue.toLocaleString()}
            </span>
            <span className="text-xs text-emerald-400 font-mono">
              Won & Contracted
            </span>
          </div>
        </div>

        <div className="rounded-2xl border border-white/[0.06] bg-[#0E1218]/90 p-5 backdrop-blur-xl">
          <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
            Acceptance Rate
          </span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-extrabold font-mono text-violet-400">
              {acceptanceRate}%
            </span>
            <span className="text-xs text-slate-400 font-mono">
              win velocity
            </span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 rounded-2xl border border-white/[0.06] bg-[#0E1218]/80 backdrop-blur-xl">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search proposals by reference, client, or scope..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#0A0D13] text-white text-xs pl-10 pr-4 py-2.5 rounded-xl border border-white/[0.08] focus:outline-none focus:border-emerald-500/50"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto">
          {STATUS_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setSelectedStatus(opt.value)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                selectedStatus === opt.value
                  ? 'bg-violet-500/15 text-violet-300 border border-violet-500/30'
                  : 'text-slate-400 hover:text-slate-200 bg-white/[0.02] border border-white/[0.04]'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Proposals Grid */}
      {filteredProposals.length === 0 ? (
        <EmptyState
          icon={<FileSpreadsheet className="w-6 h-6" />}
          title="No proposals found"
          description="Clear filters or draft a new commercial proposal."
          actionLabel="Draft Proposal"
          onAction={handleOpenAdd}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProposals.map((prop) => (
            <div
              key={prop.id}
              onClick={() => setSelectedProposalId(prop.id)}
              className="p-5 rounded-2xl border border-white/[0.06] bg-[#0E1218]/90 hover:bg-[#121620] hover:border-white/[0.12] transition-all cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <span className="text-xs font-mono font-semibold text-slate-300">
                    {prop.proposalNumber}
                  </span>
                  <Badge variant={statusVariantMap[prop.status]} size="xs" dot>
                    {prop.status}
                  </Badge>
                </div>

                <h3 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors line-clamp-1">
                  {prop.projectName}
                </h3>
                <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5 text-slate-400" />
                  {prop.clientName}
                </p>

                <p className="text-xs text-slate-400 mt-3 line-clamp-2 leading-relaxed">
                  {prop.scopeSummary || `${prop.deliverables.length} core deliverables`}
                </p>
              </div>

              <div className="mt-5 pt-4 border-t border-white/[0.05] flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono uppercase text-slate-400 block">
                    Commercial Value
                  </span>
                  <span className="text-base font-bold font-mono text-emerald-400">
                    ${prop.proposalValue.toLocaleString()}
                  </span>
                </div>

                <div className="text-right">
                  <span className="text-[10px] font-mono uppercase text-slate-400 block">
                    Valid Until
                  </span>
                  <span className="text-xs font-mono text-slate-300">
                    {prop.expirationDate}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Proposal Modal */}
      <ProposalModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        proposalToEdit={proposalToEdit}
      />

      {/* Proposal Detail Modal */}
      <ProposalDetailModal onEdit={handleOpenEdit} />
    </div>
  );
};
