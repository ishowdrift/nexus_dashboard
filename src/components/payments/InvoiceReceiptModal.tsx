import React from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { Printer, CheckCircle, Clock, Sparkles } from 'lucide-react';

export const InvoiceReceiptModal: React.FC = () => {
  const {
    payments,
    clients,
    settings,
    selectedInvoiceReceiptId,
    setSelectedInvoiceReceiptId,
    markPaymentPaid,
  } = useApp();

  const payment = payments.find((p) => p.id === selectedInvoiceReceiptId);

  if (!payment) return null;

  const client = clients.find((c) => c.id === payment.clientId);

  const subtotal = payment.amount;
  const tax = Math.round(subtotal * (settings.taxRate / 100));
  const grandTotal = subtotal + tax;

  const isPaid = payment.status === 'Paid';

  const handlePrint = () => {
    window.print();
  };

  return (
    <Modal
      isOpen={Boolean(selectedInvoiceReceiptId)}
      onClose={() => setSelectedInvoiceReceiptId(null)}
      maxWidth="2xl"
      title="Commercial Invoice Receipt"
      subtitle={`Official billing voucher #${payment.invoiceNumber}`}
      footer={
        <div className="w-full flex items-center justify-between">
          {!isPaid ? (
            <Button
              variant="primary"
              size="sm"
              onClick={() => markPaymentPaid(payment.id)}
              icon={<CheckCircle className="w-4 h-4" />}
            >
              Mark as Paid
            </Button>
          ) : (
            <span className="text-xs text-emerald-400 font-mono flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4" />
              Settled on {payment.paidDate || payment.dueDate}
            </span>
          )}

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrint}
              icon={<Printer className="w-4 h-4" />}
            >
              Print / Save PDF
            </Button>
            <Button
              variant="neon"
              size="sm"
              onClick={() => setSelectedInvoiceReceiptId(null)}
            >
              Done
            </Button>
          </div>
        </div>
      }
    >
      <div className="p-6 rounded-2xl bg-[#090C10] border border-white/[0.08] text-slate-200 space-y-6">
        {/* Invoice Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b border-white/[0.08]">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-7 h-7 rounded-lg bg-emerald-400 text-black flex items-center justify-center font-black text-xs">
                N
              </div>
              <span className="font-bold text-white text-base tracking-tight">
                {settings.agencyName}
              </span>
            </div>
            <p className="text-xs text-slate-400">{settings.freelancerName}</p>
            <p className="text-xs text-slate-400">{settings.email}</p>
          </div>

          <div className="text-left sm:text-right">
            <h3 className="text-xl font-bold font-mono text-white tracking-tight">
              {payment.invoiceNumber}
            </h3>
            <p className="text-xs font-mono text-slate-400 mt-1">
              Issued: {payment.issueDate}
            </p>
            <p className="text-xs font-mono text-slate-400">
              Due Date: <strong className="text-white">{payment.dueDate}</strong>
            </p>

            {/* Status Stamp */}
            <div className="mt-2 sm:inline-block">
              <span
                className={`inline-block px-3 py-1 rounded-full text-xs font-mono uppercase font-bold tracking-wider border ${
                  isPaid
                    ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                    : payment.status === 'Overdue'
                    ? 'bg-rose-500/15 text-rose-400 border-rose-500/30'
                    : 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                }`}
              >
                {payment.status}
              </span>
            </div>
          </div>
        </div>

        {/* Bill To */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block mb-1">
              Billed To
            </span>
            <p className="text-sm font-bold text-white">{payment.clientName}</p>
            {client && (
              <>
                <p className="text-slate-400 mt-0.5">Attn: {client.name}</p>
                <p className="text-slate-400">{client.email}</p>
                {client.billingAddress && (
                  <p className="text-slate-400 mt-1 leading-relaxed">
                    {client.billingAddress}
                  </p>
                )}
              </>
            )}
          </div>

          <div className="sm:text-right">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block mb-1">
              Payment Terms
            </span>
            <p className="text-slate-300">Method: {payment.paymentMethod || 'Wire Transfer'}</p>
            <p className="text-slate-400 mt-0.5">Project: {payment.projectName}</p>
          </div>
        </div>

        {/* Line Items Table */}
        <div className="rounded-xl border border-white/[0.06] overflow-hidden bg-black/20">
          <table className="w-full text-left text-xs">
            <thead className="bg-white/[0.04] text-[10px] font-mono uppercase text-slate-400 border-b border-white/[0.06]">
              <tr>
                <th className="p-3">Description / Milestone Deliverable</th>
                <th className="p-3 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              <tr>
                <td className="p-3.5">
                  <p className="font-semibold text-white">
                    {payment.projectName}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {payment.notes || 'Full milestone sign-off and production deliverables'}
                  </p>
                </td>
                <td className="p-3.5 text-right font-mono font-bold text-white text-sm">
                  ${subtotal.toLocaleString()}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Calculations */}
        <div className="flex justify-end pt-2">
          <div className="w-64 space-y-2 text-xs">
            <div className="flex justify-between text-slate-400">
              <span>Subtotal:</span>
              <span className="font-mono text-slate-200">${subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Tax ({settings.taxRate}%):</span>
              <span className="font-mono text-slate-200">${tax.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-base font-bold text-white pt-2 border-t border-white/[0.08]">
              <span>Total Due:</span>
              <span className="font-mono text-emerald-400">${grandTotal.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};
