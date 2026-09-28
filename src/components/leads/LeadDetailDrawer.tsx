import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { LeadStatus } from '../../types';
import { Badge, BadgeVariant } from '../common/Badge';
import { Button } from '../common/Button';
import { ConfirmDialog } from '../common/ConfirmDialog';
import {
  X,
  Mail,
  Phone,
  Building,
  Calendar,
  DollarSign,
  ArrowRightCircle,
  Edit2,
  Trash2,
  Clock,
  Sparkles,
  CheckCircle,
} from 'lucide-react';

interface LeadDetailDrawerProps {
  onEdit: () => void;
}

export const LeadDetailDrawer: React.FC<LeadDetailDrawerProps> = ({ onEdit }) => {
  const {
    leads,
    selectedLeadId,
    setSelectedLeadId,
    changeLeadStatus,
    convertLeadToClientAndProject,
    deleteLead,
    navigateTo,
  } = useApp();

  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [quickNote, setQuickNote] = useState('');

  const lead = leads.find((l) => l.id === selectedLeadId);

  if (!lead) return null;

  const statusVariantMap: Record<LeadStatus, BadgeVariant> = {
    New: 'default',
    Contacted: 'cyan',
    Qualified: 'blue',
    'Proposal Sent': 'violet',
    Negotiation: 'amber',
    Won: 'emerald',
    Lost: 'rose',
  };

  const handleConvert = () => {
    const { projectId } = convertLeadToClientAndProject(lead.id);
    setSelectedLeadId(null);
    navigateTo('projects', projectId);
  };

  return (
    <>
      <div className="fixed inset-0 z-40 flex justify-end">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-[#050608]/70 backdrop-blur-sm"
          onClick={() => setSelectedLeadId(null)}
        />

        {/* Drawer Panel */}
        <div className="relative w-full max-w-lg h-full bg-[#0E131B] border-l border-white/[0.08] shadow-2xl z-10 flex flex-col overflow-y-auto animate-in slide-in-from-right duration-200 text-slate-100">
          {/* Header */}
          <div className="flex items-start justify-between p-6 border-b border-white/[0.06] bg-[#0A0D13]/60">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <Badge variant={statusVariantMap[lead.status]} dot>
                  {lead.status}
                </Badge>
                <span className="text-xs font-mono text-slate-400">
                  via {lead.source}
                </span>
              </div>
              <h3 className="text-xl font-bold tracking-tight text-white">
                {lead.name}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 text-slate-400" />
                {lead.company}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onEdit}
                className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/[0.06] transition-colors"
                title="Edit lead"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setSelectedLeadId(null)}
                className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/[0.06] transition-colors"
                title="Close drawer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Action Callout if Won or Ready to Convert */}
          <div className="p-6 bg-gradient-to-r from-emerald-500/10 via-cyan-500/5 to-transparent border-b border-emerald-500/20">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" />
                  Estimated Deal Value:
                </p>
                <p className="text-2xl font-black font-mono text-white mt-0.5">
                  ${lead.estimatedValue.toLocaleString()}
                </p>
              </div>

              <Button
                variant="neon"
                size="sm"
                onClick={handleConvert}
                icon={<ArrowRightCircle className="w-4 h-4" />}
              >
                Convert to Client & Project
              </Button>
            </div>
          </div>

          {/* Body Content */}
          <div className="p-6 space-y-6 flex-1">
            {/* Quick Status Bar */}
            <div>
              <label className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block mb-2">
                Pipeline Stage Progression
              </label>
              <div className="grid grid-cols-4 gap-1.5 p-1 rounded-xl bg-black/40 border border-white/[0.06] text-xs">
                {(['Contacted', 'Qualified', 'Negotiation', 'Won'] as LeadStatus[]).map(
                  (st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => changeLeadStatus(lead.id, st)}
                      className={`py-1.5 px-2 rounded-lg text-xs font-medium transition-all ${
                        lead.status === st
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {st}
                    </button>
                  )
                )}
              </div>
            </div>

            {/* Proposed Service */}
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
              <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
                Proposed Service & Solution
              </span>
              <p className="text-sm font-semibold text-slate-100 mt-1">
                {lead.service}
              </p>
            </div>

            {/* Contact Information */}
            <div className="space-y-3">
              <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block">
                Direct Contact Details
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <a
                  href={`mailto:${lead.email}`}
                  className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.06] transition-colors"
                >
                  <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="text-xs text-slate-300 truncate">{lead.email}</span>
                </a>
                <a
                  href={`tel:${lead.phone}`}
                  className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.06] transition-colors"
                >
                  <Phone className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span className="text-xs text-slate-300 truncate">
                    {lead.phone || 'No phone provided'}
                  </span>
                </a>
              </div>
            </div>

            {/* Schedule Follow-up dates */}
            <div className="grid grid-cols-2 gap-3 p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
              <div>
                <span className="text-[10px] font-mono uppercase text-slate-400 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-400" />
                  Last Contact
                </span>
                <p className="text-xs font-mono text-slate-200 mt-1">
                  {lead.lastContact}
                </p>
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase text-slate-400 flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-emerald-400" />
                  Next Follow-up
                </span>
                <p className="text-xs font-mono text-emerald-400 font-semibold mt-1">
                  {lead.nextFollowUp || 'Not scheduled'}
                </p>
              </div>
            </div>

            {/* Notes Section */}
            <div>
              <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block mb-2">
                Requirements & Strategic Notes
              </span>
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] text-xs text-slate-300 leading-relaxed min-h-[90px]">
                {lead.notes || 'No discovery notes recorded yet.'}
              </div>
            </div>
          </div>

          {/* Footer with Delete Option */}
          <div className="p-6 border-t border-white/[0.06] bg-[#0A0D13]/60 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setIsConfirmDeleteOpen(true)}
              className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1.5 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete Lead</span>
            </button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedLeadId(null)}
            >
              Close
            </Button>
          </div>
        </div>
      </div>

      <ConfirmDialog
        isOpen={isConfirmDeleteOpen}
        onClose={() => setIsConfirmDeleteOpen(false)}
        onConfirm={() => deleteLead(lead.id)}
        title="Delete Opportunity"
        message={`Are you sure you want to delete lead "${lead.name}" (${lead.company})? This action cannot be undone.`}
        confirmText="Delete Lead"
      />
    </>
  );
};
