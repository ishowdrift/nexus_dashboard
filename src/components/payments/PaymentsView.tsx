import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Payment, PaymentStatus } from '../../types';
import { Badge, BadgeVariant } from '../common/Badge';
import { Button } from '../common/Button';
import { EmptyState } from '../common/EmptyState';
import { PaymentModal } from './PaymentModal';
import { InvoiceReceiptModal } from './InvoiceReceiptModal';
import {
  CreditCard,
  Plus,
  Search,
  CheckCircle,
  Clock,
  AlertCircle,
  DollarSign,
  FileText,
  Building,
  TrendingUp,
} from 'lucide-react';

const STATUS_FILTERS: { label: string; value: 'All' | PaymentStatus }[] = [
  { label: 'All Invoices', value: 'All' },
  { label: 'Pending', value: 'Pending' },
  { label: 'Overdue', value: 'Overdue' },
  { label: 'Paid', value: 'Paid' },
  { label: 'Partial', value: 'Partial' },
];

export const PaymentsView: React.FC = () => {
  const {
    payments,
    financialMetrics,
    markPaymentPaid,
    setSelectedInvoiceReceiptId,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<'All' | PaymentStatus>('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [paymentToEdit, setPaymentToEdit] = useState<Payment | null>(null);

  const filteredPayments = useMemo(() => {
    return payments.filter((pay) => {
      const matchesStatus =
        selectedStatus === 'All' || pay.status === selectedStatus;
      const q = searchQuery.toLowerCase();
      const matchesQuery =
        !q ||
        pay.invoiceNumber.toLowerCase().includes(q) ||
        pay.clientName.toLowerCase().includes(q) ||
        pay.projectName.toLowerCase().includes(q);
      return matchesStatus && matchesQuery;
    });
  }, [payments, selectedStatus, searchQuery]);

  const statusVariantMap: Record<PaymentStatus, BadgeVariant> = {
    Pending: 'amber',
    Paid: 'emerald',
    Overdue: 'rose',
    Partial: 'cyan',
  };

  const handleOpenAdd = () => {
    setPaymentToEdit(null);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            Financial Ledger & Invoices
            <span className="text-xs font-mono font-medium px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              ${financialMetrics.totalRevenue.toLocaleString()} Collected
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Real-time accounts receivable, overdue milestone tracking, and invoice voucher generation
          </p>
        </div>

        <Button
          variant="neon"
          size="md"
          onClick={handleOpenAdd}
          icon={<Plus className="w-4 h-4" />}
        >
          Issue New Invoice
        </Button>
      </div>

      {/* KPI Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-white/[0.06] bg-[#0E1218]/90 p-5 backdrop-blur-xl">
          <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
            Total Revenue Collected
          </span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-extrabold font-mono text-emerald-400">
              ${financialMetrics.totalRevenue.toLocaleString()}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 font-mono mt-2">
            Settled in full
          </p>
        </div>

        <div className="rounded-2xl border border-white/[0.06] bg-[#0E1218]/90 p-5 backdrop-blur-xl">
          <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
            Pending Receivables
          </span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-extrabold font-mono text-amber-400">
              ${financialMetrics.pendingAmount.toLocaleString()}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 font-mono mt-2">
            Awaiting due dates
          </p>
        </div>

        <div className="rounded-2xl border border-white/[0.06] bg-[#0E1218]/90 p-5 backdrop-blur-xl">
          <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
            Overdue Invoices
          </span>
          <div className="flex items-baseline gap-2 mt-2">
            <span
              className={`text-3xl font-extrabold font-mono ${
                financialMetrics.overdueAmount > 0 ? 'text-rose-400' : 'text-slate-200'
              }`}
            >
              ${financialMetrics.overdueAmount.toLocaleString()}
            </span>
          </div>
          <p
            className={`text-[11px] font-mono mt-2 ${
              financialMetrics.overdueAmount > 0 ? 'text-rose-400' : 'text-slate-400'
            }`}
          >
            {financialMetrics.overdueAmount > 0
              ? 'Requires urgent follow-up'
              : 'Zero overdue accounts'}
          </p>
        </div>

        <div className="rounded-2xl border border-white/[0.06] bg-[#0E1218]/90 p-5 backdrop-blur-xl">
          <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
            Paid Settlement Rate
          </span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-extrabold font-mono text-cyan-400">
              91.4%
            </span>
          </div>
          <p className="text-[11px] text-slate-400 font-mono mt-2">
            Within 14-day terms
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 rounded-2xl border border-white/[0.06] bg-[#0E1218]/80 backdrop-blur-xl">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by invoice #, client name, or project..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#0A0D13] text-white text-xs pl-10 pr-4 py-2.5 rounded-xl border border-white/[0.08] focus:outline-none focus:border-emerald-500/50"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto">
          {STATUS_FILTERS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setSelectedStatus(opt.value)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                selectedStatus === opt.value
                  ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                  : 'text-slate-400 hover:text-slate-200 bg-white/[0.02] border border-white/[0.04]'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Payments Table / Hybrid List */}
      {filteredPayments.length === 0 ? (
        <EmptyState
          icon={<CreditCard className="w-6 h-6" />}
          title="No invoices found"
          description="Clear search filters or generate your first invoice."
          actionLabel="New Invoice"
          onAction={handleOpenAdd}
        />
      ) : (
        <div className="rounded-2xl border border-white/[0.06] bg-[#0E1218]/90 overflow-hidden backdrop-blur-xl">
          <div className="divide-y divide-white/[0.04]">
            {filteredPayments.map((pay) => {
              const isPaid = pay.status === 'Paid';
              const isOverdue = pay.status === 'Overdue';

              return (
                <div
                  key={pay.id}
                  className="p-4 sm:p-5 hover:bg-white/[0.02] transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-4 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-center text-slate-300 shrink-0">
                      <CreditCard className="w-5 h-5 text-emerald-400" />
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-bold font-mono text-white">
                          {pay.invoiceNumber}
                        </span>
                        <Badge variant={statusVariantMap[pay.status]} size="xs" dot>
                          {pay.status}
                        </Badge>
                        <span className="text-[11px] font-mono text-slate-400">
                          Due: {pay.dueDate}
                        </span>
                      </div>

                      <p className="text-xs text-slate-300 font-medium mt-0.5 flex items-center gap-1.5">
                        <Building className="w-3.5 h-3.5 text-slate-400" />
                        {pay.clientName}
                      </p>

                      <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">
                        {pay.projectName}
                      </p>
                    </div>
                  </div>

                  {/* Right Side: Amount & Actions */}
                  <div className="flex items-center justify-between md:justify-end gap-5 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-white/[0.04]">
                    <div className="text-left md:text-right">
                      <span className="text-[10px] font-mono uppercase text-slate-400 block">
                        Amount
                      </span>
                      <span className="text-base font-bold font-mono text-white">
                        ${pay.amount.toLocaleString()}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="xs"
                        onClick={() => setSelectedInvoiceReceiptId(pay.id)}
                        icon={<FileText className="w-3.5 h-3.5" />}
                      >
                        Receipt
                      </Button>

                      {!isPaid && (
                        <Button
                          variant="primary"
                          size="xs"
                          onClick={() => markPaymentPaid(pay.id)}
                          icon={<CheckCircle className="w-3.5 h-3.5" />}
                        >
                          Mark Paid
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Add Invoice Modal */}
      <PaymentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        paymentToEdit={paymentToEdit}
      />

      {/* Invoice Receipt Modal */}
      <InvoiceReceiptModal />
    </div>
  );
};
