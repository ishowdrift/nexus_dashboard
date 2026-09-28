import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ProposalStatus } from '../../types';
import { Modal } from '../common/Modal';
import { Badge, BadgeVariant } from '../common/Badge';
import { Button } from '../common/Button';
import { ConfirmDialog } from '../common/ConfirmDialog';
import {
  FileSpreadsheet,
  Calendar,
  DollarSign,
  Clock,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Edit2,
  Trash2,
  Building,
  Check,
} from 'lucide-react';

interface ProposalDetailModalProps {
  onEdit: () => void;
}

export const ProposalDetailModal: React.FC<ProposalDetailModalProps> = ({ onEdit }) => {
  const {
    proposals,
    selectedProposalId,
    setSelectedProposalId,
    changeProposalStatus,
    acceptProposal,
    deleteProposal,
    navigateTo,
  } = useApp();

  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);

  const proposal = proposals.find((p) => p.id === selectedProposalId);

  if (!proposal) return null;

  const statusVariantMap: Record<ProposalStatus, BadgeVariant> = {
    Draft: 'slate',
    Sent: 'cyan',
    Viewed: 'blue',
    Negotiating: 'amber',
    Accepted: 'emerald',
    Rejected: 'rose',
  };

  const isAccepted = proposal.status === 'Accepted';

  const handleAccept = () => {
    acceptProposal(proposal.id);
    setSelectedProposalId(null);
    navigateTo('projects');
  };

  return (
    <>
      <Modal
        isOpen={Boolean(selectedProposalId)}
        onClose={() => setSelectedProposalId(null)}
        maxWidth="3xl"
        title={
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-violet-600 to-cyan-500 flex items-center justify-center text-sm font-bold text-white shadow-[0_0_15px_rgba(139,92,246,0.3)]">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold text-white">
                  {proposal.proposalNumber}
                </span>
                <Badge variant={statusVariantMap[proposal.status]} size="xs" dot>
                  {proposal.status}
                </Badge>
              </div>
              <p className="text-xs text-slate-400 font-normal mt-0.5">
                Client: <strong className="text-slate-200">{proposal.clientName}</strong>
              </p>
            </div>
          </div>
        }
        footer={
          <div className="w-full flex items-center justify-between">
            <button
              type="button"
              onClick={() => setIsConfirmDeleteOpen(true)}
              className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1.5 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete Proposal</span>
            </button>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={onEdit} icon={<Edit2 className="w-3.5 h-3.5" />}>
                Edit
              </Button>
              <Button variant="neon" size="sm" onClick={() => setSelectedProposalId(null)}>
                Done
              </Button>
            </div>
          </div>
        }
      >
        <div className="space-y-6 text-slate-200">
          {/* Acceptance Callout Banner */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-violet-500/10 via-emerald-500/10 to-transparent border border-white/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 block font-semibold">
                Commercial Contract Value
              </span>
              <p className="text-3xl font-extrabold font-mono text-white mt-1">
                ${proposal.proposalValue.toLocaleString()}
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Sent on {proposal.dateSent} • Valid until {proposal.expirationDate}
              </p>
            </div>

            {!isAccepted && (
              <Button
                variant="primary"
                size="md"
                onClick={handleAccept}
                icon={<Check className="w-4 h-4" />}
              >
                Mark as Accepted & Start Project
              </Button>
            )}
          </div>

          {/* Quick Status Stage Changer */}
          <div className="space-y-2">
            <label className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block">
              Update Commercial Stage
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5 p-1 rounded-xl bg-black/40 border border-white/[0.06] text-xs">
              {(['Draft', 'Sent', 'Viewed', 'Negotiating', 'Accepted', 'Rejected'] as ProposalStatus[]).map(
                (st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => changeProposalStatus(proposal.id, st)}
                    className={`py-1.5 px-2 rounded-lg text-xs font-medium transition-all ${
                      proposal.status === st
                        ? 'bg-violet-500/20 text-violet-300 border border-violet-500/30'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {st}
                  </button>
                )
              )}
            </div>
          </div>

          {/* Project Title Scope */}
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block">
              Proposed Project Specification
            </span>
            <h4 className="text-base font-bold text-white mt-1">
              {proposal.projectName}
            </h4>
          </div>

          {/* Executive Summary */}
          {proposal.scopeSummary && (
            <div className="space-y-2">
              <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block">
                Executive Scope & Narrative
              </span>
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] text-xs text-slate-300 leading-relaxed">
                {proposal.scopeSummary}
              </div>
            </div>
          )}

          {/* Proposed Deliverables */}
          <div className="space-y-2">
            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block">
              Contract Deliverables Breakdown
            </span>
            <div className="space-y-2">
              {proposal.deliverables.map((deliv, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] text-xs flex items-center gap-2.5"
                >
                  <span className="w-5 h-5 rounded-md bg-emerald-500/10 text-emerald-400 font-mono text-[10px] font-bold flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <span className="text-slate-200">{deliv}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        isOpen={isConfirmDeleteOpen}
        onClose={() => setIsConfirmDeleteOpen(false)}
        onConfirm={() => {
          deleteProposal(proposal.id);
          setSelectedProposalId(null);
        }}
        title="Delete Proposal"
        message={`Are you sure you want to delete proposal ${proposal.proposalNumber}?`}
        confirmText="Delete Proposal"
      />
    </>
  );
};
