import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ClientStatus } from '../../types';
import { Modal } from '../common/Modal';
import { Badge, BadgeVariant } from '../common/Badge';
import { Button } from '../common/Button';
import { ConfirmDialog } from '../common/ConfirmDialog';
import {
  Building,
  Mail,
  Phone,
  Globe,
  MapPin,
  FolderGit2,
  CreditCard,
  Calendar,
  DollarSign,
  Plus,
  Clock,
  CheckCircle2,
  Edit2,
  Trash2,
  ExternalLink,
} from 'lucide-react';

interface ClientDetailModalProps {
  onEdit: () => void;
}

export const ClientDetailModal: React.FC<ClientDetailModalProps> = ({ onEdit }) => {
  const {
    clients,
    projects,
    payments,
    selectedClientId,
    setSelectedClientId,
    deleteClient,
    setSelectedProjectId,
    navigateTo,
  } = useApp();

  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);

  const client = clients.find((c) => c.id === selectedClientId);

  if (!client) return null;

  const clientProjects = projects.filter((p) => p.clientId === client.id || p.clientName.toLowerCase().includes(client.company.toLowerCase()));
  const clientPayments = payments.filter((pay) => pay.clientId === client.id || pay.clientName.toLowerCase().includes(client.company.toLowerCase()));

  const statusVariantMap: Record<ClientStatus, BadgeVariant> = {
    Active: 'emerald',
    Retainer: 'cyan',
    'Lead Won': 'amber',
    Completed: 'slate',
    Past: 'slate',
  };

  return (
    <>
      <Modal
        isOpen={Boolean(selectedClientId)}
        onClose={() => setSelectedClientId(null)}
        maxWidth="3xl"
        title={
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-emerald-500 flex items-center justify-center text-sm font-bold text-white shadow-[0_0_15px_rgba(16,185,129,0.3)]">
              {client.company.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold text-white">{client.company}</span>
                <Badge variant={statusVariantMap[client.status]} size="xs" dot>
                  {client.status}
                </Badge>
              </div>
              <p className="text-xs text-slate-400 font-normal mt-0.5">
                Primary Contact: <strong className="text-slate-200">{client.name}</strong>
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
              <span>Delete Client</span>
            </button>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={onEdit} icon={<Edit2 className="w-3.5 h-3.5" />}>
                Edit Profile
              </Button>
              <Button variant="neon" size="sm" onClick={() => setSelectedClientId(null)}>
                Done
              </Button>
            </div>
          </div>
        }
      >
        <div className="space-y-6 text-slate-200">
          {/* Section 1: Client Information & Quick Financials */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] md:col-span-2 space-y-3">
              <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block">
                Contact & Account Details
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <a
                  href={`mailto:${client.email}`}
                  className="flex items-center gap-2 text-slate-300 hover:text-emerald-400 transition-colors"
                >
                  <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="truncate">{client.email}</span>
                </a>
                <a
                  href={`tel:${client.phone}`}
                  className="flex items-center gap-2 text-slate-300 hover:text-cyan-400 transition-colors"
                >
                  <Phone className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span className="truncate">{client.phone}</span>
                </a>
                {client.website && (
                  <a
                    href={client.website}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors"
                  >
                    <Globe className="w-4 h-4 text-slate-400 shrink-0" />
                    <span className="truncate">{client.website.replace('https://', '')}</span>
                    <ExternalLink className="w-3 h-3 text-slate-400" />
                  </a>
                )}
                {client.billingAddress && (
                  <div className="flex items-center gap-2 text-slate-400 sm:col-span-2">
                    <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                    <span className="truncate">{client.billingAddress}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Financial Overview Card */}
            <div className="p-4 rounded-xl bg-emerald-500/[0.04] border border-emerald-500/20 flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-400 block">
                  Lifetime Value
                </span>
                <p className="text-2xl font-bold font-mono text-white mt-1">
                  ${client.totalRevenue.toLocaleString()}
                </p>
              </div>

              <div className="mt-3 pt-3 border-t border-emerald-500/10">
                <span className="text-[10px] font-mono uppercase text-slate-400 block">
                  Outstanding Balance
                </span>
                <p
                  className={`text-sm font-bold font-mono mt-0.5 ${
                    client.outstandingBalance > 0 ? 'text-amber-400' : 'text-emerald-400'
                  }`}
                >
                  ${client.outstandingBalance.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* Section 2: Associated Projects */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FolderGit2 className="w-4 h-4 text-amber-400" />
                <h4 className="text-sm font-semibold text-white tracking-tight">
                  Projects ({clientProjects.length})
                </h4>
              </div>
              <Button
                variant="ghost"
                size="xs"
                onClick={() => {
                  setSelectedClientId(null);
                  navigateTo('projects');
                }}
              >
                + New Project
              </Button>
            </div>

            {clientProjects.length === 0 ? (
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] text-xs text-slate-400 text-center">
                No projects registered for this client.
              </div>
            ) : (
              <div className="space-y-2">
                {clientProjects.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => {
                      setSelectedClientId(null);
                      setSelectedProjectId(p.id);
                      navigateTo('projects', p.id);
                    }}
                    className="p-3.5 rounded-xl bg-white/[0.02] hover:bg-white/[0.04] border border-white/[0.05] transition-all cursor-pointer flex items-center justify-between gap-3 group"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-white group-hover:text-emerald-300 transition-colors truncate">
                          {p.projectName}
                        </span>
                        <Badge
                          variant={p.status === 'Completed' ? 'slate' : 'emerald'}
                          size="xs"
                        >
                          {p.status}
                        </Badge>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Due {p.deadline} • {p.tasksCount.completed}/{p.tasksCount.total} tasks completed
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-xs font-mono font-bold text-white block">
                        ${p.budget.toLocaleString()}
                      </span>
                      <span className="text-[10px] font-mono text-emerald-400">
                        {p.progress}% done
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section 3: Invoices & Payments */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-cyan-400" />
                <h4 className="text-sm font-semibold text-white tracking-tight">
                  Invoices & Transactions ({clientPayments.length})
                </h4>
              </div>
              <Button
                variant="ghost"
                size="xs"
                onClick={() => {
                  setSelectedClientId(null);
                  navigateTo('payments');
                }}
              >
                + New Invoice
              </Button>
            </div>

            {clientPayments.length === 0 ? (
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] text-xs text-slate-400 text-center">
                No invoices issued for this client yet.
              </div>
            ) : (
              <div className="space-y-2">
                {clientPayments.map((pay) => (
                  <div
                    key={pay.id}
                    className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.05] flex items-center justify-between gap-3"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-semibold text-white">
                          {pay.invoiceNumber}
                        </span>
                        <Badge
                          variant={
                            pay.status === 'Paid'
                              ? 'emerald'
                              : pay.status === 'Overdue'
                              ? 'rose'
                              : 'amber'
                          }
                          size="xs"
                          dot
                        >
                          {pay.status}
                        </Badge>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5 truncate">
                        {pay.notes || `Issued ${pay.issueDate} • Due ${pay.dueDate}`}
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-sm font-mono font-bold text-white block">
                        ${pay.amount.toLocaleString()}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">
                        {pay.paidDate ? `Settled ${pay.paidDate}` : `Due ${pay.dueDate}`}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section 4: Communication Notes */}
          <div className="space-y-2">
            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block">
              Communication Notes & Relationship History
            </span>
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] text-xs text-slate-300 leading-relaxed">
              {client.notes || 'No specialized client notes recorded.'}
            </div>
          </div>

          {/* Section 5: Activity Timeline */}
          <div className="space-y-3">
            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block">
              Activity Timeline
            </span>
            <div className="space-y-3 pl-2 border-l border-white/[0.08]">
              <div className="relative pl-4">
                <span className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                <p className="text-xs text-white font-medium">Recent interaction & review</p>
                <p className="text-[11px] text-slate-400 font-mono mt-0.5">{client.lastInteraction}</p>
              </div>
              <div className="relative pl-4">
                <span className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-cyan-400" />
                <p className="text-xs text-white font-medium">Account onboarded & contracted</p>
                <p className="text-[11px] text-slate-400 font-mono mt-0.5">{client.createdAt}</p>
              </div>
            </div>
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        isOpen={isConfirmDeleteOpen}
        onClose={() => setIsConfirmDeleteOpen(false)}
        onConfirm={() => {
          deleteClient(client.id);
          setSelectedClientId(null);
        }}
        title="Delete Client Record"
        message={`Are you sure you want to remove "${client.company}"? This will not delete past invoices or history.`}
        confirmText="Delete Client"
      />
    </>
  );
};
