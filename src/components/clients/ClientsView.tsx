import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Client, ClientStatus } from '../../types';
import { Badge, BadgeVariant } from '../common/Badge';
import { Button } from '../common/Button';
import { EmptyState } from '../common/EmptyState';
import { ClientModal } from './ClientModal';
import { ClientDetailModal } from './ClientDetailModal';
import {
  Users2,
  Plus,
  Search,
  Building,
  Mail,
  Phone,
  FolderGit2,
  DollarSign,
  ArrowUpRight,
  TrendingUp,
} from 'lucide-react';

export const ClientsView: React.FC = () => {
  const { clients, projects, payments, setSelectedClientId, selectedClientId } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<'All' | ClientStatus>('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [clientToEdit, setClientToEdit] = useState<Client | null>(null);

  const filteredClients = useMemo(() => {
    return clients.filter((c) => {
      const matchesStatus =
        selectedStatus === 'All' || c.status === selectedStatus;
      const q = searchQuery.toLowerCase();
      const matchesQuery =
        !q ||
        c.name.toLowerCase().includes(q) ||
        c.company.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q);
      return matchesStatus && matchesQuery;
    });
  }, [clients, selectedStatus, searchQuery]);

  const totalRevenue = clients.reduce((acc, c) => acc + c.totalRevenue, 0);
  const totalOutstanding = clients.reduce((acc, c) => acc + c.outstandingBalance, 0);
  const activeCount = clients.filter((c) => c.status === 'Active' || c.status === 'Retainer').length;

  const statusVariantMap: Record<ClientStatus, BadgeVariant> = {
    Active: 'emerald',
    Retainer: 'cyan',
    'Lead Won': 'amber',
    Completed: 'slate',
    Past: 'slate',
  };

  const handleOpenAdd = () => {
    setClientToEdit(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = () => {
    const client = clients.find((c) => c.id === selectedClientId);
    if (client) {
      setClientToEdit(client);
      setIsModalOpen(true);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            Client Directory
            <span className="text-xs font-mono font-medium px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              {clients.length} Accounts
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Accounts overview, lifetime revenue, outstanding balances, and active projects
          </p>
        </div>

        <Button
          variant="neon"
          size="md"
          onClick={handleOpenAdd}
          icon={<Plus className="w-4 h-4" />}
        >
          Add New Client
        </Button>
      </div>

      {/* KPI Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-white/[0.06] bg-[#0E1218]/90 p-5 backdrop-blur-xl">
          <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
            Active Accounts
          </span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-extrabold font-mono text-white">
              {activeCount}
            </span>
            <span className="text-xs text-cyan-400 font-mono">
              of {clients.length} total
            </span>
          </div>
        </div>

        <div className="rounded-2xl border border-white/[0.06] bg-[#0E1218]/90 p-5 backdrop-blur-xl">
          <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
            Client Lifetime Value
          </span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-extrabold font-mono text-emerald-400">
              ${totalRevenue.toLocaleString()}
            </span>
            <span className="text-xs text-emerald-400 font-mono">
              Collected
            </span>
          </div>
        </div>

        <div className="rounded-2xl border border-white/[0.06] bg-[#0E1218]/90 p-5 backdrop-blur-xl">
          <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
            Receivable Balance
          </span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-extrabold font-mono text-amber-400">
              ${totalOutstanding.toLocaleString()}
            </span>
            <span className="text-xs text-slate-400 font-mono">
              pending collection
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
            placeholder="Search clients by company, contact person, or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#0A0D13] text-white text-xs pl-10 pr-4 py-2.5 rounded-xl border border-white/[0.08] focus:outline-none focus:border-emerald-500/50"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto">
          {(['All', 'Active', 'Retainer', 'Completed'] as const).map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setSelectedStatus(st as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                selectedStatus === st
                  ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                  : 'text-slate-400 hover:text-slate-200 bg-white/[0.02] border border-white/[0.04]'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Clients Grid */}
      {filteredClients.length === 0 ? (
        <EmptyState
          icon={<Users2 className="w-6 h-6" />}
          title="No clients found"
          description="Try modifying your search criteria or add your first client."
          actionLabel="Add Client"
          onAction={handleOpenAdd}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredClients.map((client) => {
            const clientProjectCount = projects.filter(
              (p) => p.clientId === client.id || p.clientName.toLowerCase().includes(client.company.toLowerCase())
            ).length;

            return (
              <div
                key={client.id}
                onClick={() => setSelectedClientId(client.id)}
                className="p-5 rounded-2xl border border-white/[0.06] bg-[#0E1218]/90 hover:bg-[#121620] hover:border-white/[0.12] transition-all cursor-pointer flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-emerald-500 flex items-center justify-center text-sm font-bold text-white shadow-[0_0_12px_rgba(16,185,129,0.25)] shrink-0">
                      {client.company.charAt(0)}
                    </div>
                    <Badge variant={statusVariantMap[client.status]} size="xs" dot>
                      {client.status}
                    </Badge>
                  </div>

                  <h3 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors truncate">
                    {client.company}
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Contact: {client.name}
                  </p>

                  <div className="mt-4 space-y-1.5 text-xs text-slate-400">
                    <div className="flex items-center gap-2 truncate">
                      <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{client.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{client.phone || 'No phone'}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-white/[0.05] flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-mono uppercase text-slate-400 block">
                      Lifetime Revenue
                    </span>
                    <span className="text-sm font-bold font-mono text-emerald-400">
                      ${client.totalRevenue.toLocaleString()}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] font-mono uppercase text-slate-400 block">
                      Projects
                    </span>
                    <span className="text-xs font-mono font-medium text-slate-200">
                      {clientProjectCount} engagements
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Client Modal */}
      <ClientModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        clientToEdit={clientToEdit}
      />

      {/* Client Detail Modal */}
      <ClientDetailModal onEdit={handleOpenEdit} />
    </div>
  );
};
