import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Payment, PaymentStatus } from '../../types';
import { Modal } from '../common/Modal';
import { Input, Select, Textarea } from '../common/FormControls';
import { Button } from '../common/Button';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  paymentToEdit?: Payment | null;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  paymentToEdit,
}) => {
  const { addPayment, updatePayment, clients, projects, settings } = useApp();

  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [clientId, setClientId] = useState('');
  const [clientName, setClientName] = useState('');
  const [projectId, setProjectId] = useState('');
  const [projectName, setProjectName] = useState('');
  const [amount, setAmount] = useState('7500');
  const [issueDate, setIssueDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [dueDate, setDueDate] = useState('');
  const [paidDate, setPaidDate] = useState('');
  const [status, setStatus] = useState<PaymentStatus>('Pending');
  const [paymentMethod, setPaymentMethod] = useState('SWIFT Wire Transfer');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (paymentToEdit) {
      setInvoiceNumber(paymentToEdit.invoiceNumber);
      setClientId(paymentToEdit.clientId);
      setClientName(paymentToEdit.clientName);
      setProjectId(paymentToEdit.projectId);
      setProjectName(paymentToEdit.projectName);
      setAmount(paymentToEdit.amount.toString());
      setIssueDate(paymentToEdit.issueDate);
      setDueDate(paymentToEdit.dueDate);
      setPaidDate(paymentToEdit.paidDate || '');
      setStatus(paymentToEdit.status);
      setPaymentMethod(paymentToEdit.paymentMethod || 'SWIFT Wire Transfer');
      setNotes(paymentToEdit.notes || '');
    } else {
      const rand = Math.floor(100 + Math.random() * 900);
      setInvoiceNumber(`${settings.invoicePrefix || 'INV-2026'}-${rand}`);
      if (clients.length > 0) {
        setClientId(clients[0].id);
        setClientName(clients[0].company);
      }
      if (projects.length > 0) {
        setProjectId(projects[0].id);
        setProjectName(projects[0].projectName);
      }
      setAmount('7500');
      setIssueDate(new Date().toISOString().split('T')[0]);
      const due = new Date();
      due.setDate(due.getDate() + 14);
      setDueDate(due.toISOString().split('T')[0]);
      setPaidDate('');
      setStatus('Pending');
      setPaymentMethod('SWIFT Wire Transfer');
      setNotes('Milestone delivery billing');
    }
    setError('');
  }, [paymentToEdit, isOpen, clients, projects, settings]);

  const handleClientChange = (cId: string) => {
    setClientId(cId);
    const client = clients.find((c) => c.id === cId);
    if (client) {
      setClientName(client.company);
      const clientProj = projects.find((p) => p.clientId === cId);
      if (clientProj) {
        setProjectId(clientProj.id);
        setProjectName(clientProj.projectName);
      }
    }
  };

  const handleProjectChange = (pId: string) => {
    setProjectId(pId);
    const proj = projects.find((p) => p.id === pId);
    if (proj) {
      setProjectName(proj.projectName);
      setClientId(proj.clientId);
      setClientName(proj.clientName);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!invoiceNumber.trim()) {
      setError('Please provide an invoice reference number.');
      return;
    }

    const val = parseFloat(amount) || 0;

    if (paymentToEdit) {
      updatePayment(paymentToEdit.id, {
        invoiceNumber,
        clientId,
        clientName,
        projectId,
        projectName,
        amount: val,
        issueDate,
        dueDate,
        paidDate: status === 'Paid' ? paidDate || new Date().toISOString().split('T')[0] : undefined,
        status,
        paymentMethod,
        notes,
      });
    } else {
      addPayment({
        invoiceNumber,
        clientId,
        clientName,
        projectId,
        projectName,
        amount: val,
        issueDate,
        dueDate,
        paidDate: status === 'Paid' ? paidDate || new Date().toISOString().split('T')[0] : undefined,
        status,
        paymentMethod,
        notes,
      });
    }

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={paymentToEdit ? 'Edit Invoice / Receivable' : 'Issue New Invoice'}
      subtitle="Record milestone receivables, payments due, and settlement statuses"
      maxWidth="lg"
      footer={
        <>
          <Button variant="ghost" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="neon" size="sm" onClick={handleSubmit}>
            {paymentToEdit ? 'Save Changes' : 'Generate Invoice'}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-400">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Invoice Reference"
            value={invoiceNumber}
            onChange={(e) => setInvoiceNumber(e.target.value)}
            required
          />
          <Input
            label="Invoice Amount ($)"
            type="number"
            min="0"
            step="100"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Client Account"
            value={clientId}
            onChange={(e) => handleClientChange(e.target.value)}
          >
            {clients.map((c) => (
              <option key={c.id} value={c.id} className="bg-[#0E131B]">
                {c.company} ({c.name})
              </option>
            ))}
          </Select>

          <Select
            label="Associated Project"
            value={projectId}
            onChange={(e) => handleProjectChange(e.target.value)}
          >
            {projects.map((p) => (
              <option key={p.id} value={p.id} className="bg-[#0E131B]">
                {p.projectName}
              </option>
            ))}
          </Select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Input
            label="Issue Date"
            type="date"
            value={issueDate}
            onChange={(e) => setIssueDate(e.target.value)}
          />
          <Input
            label="Due Date"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            required
          />
          <Select
            label="Payment Status"
            value={status}
            onChange={(e) => setStatus(e.target.value as PaymentStatus)}
            options={[
              { value: 'Pending', label: 'Pending Payment' },
              { value: 'Paid', label: 'Paid / Settled' },
              { value: 'Overdue', label: 'Overdue' },
              { value: 'Partial', label: 'Partial Payment' },
            ]}
          />
        </div>

        {status === 'Paid' && (
          <Input
            label="Paid Date"
            type="date"
            value={paidDate}
            onChange={(e) => setPaidDate(e.target.value)}
          />
        )}

        <Select
          label="Settlement Method"
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
          options={[
            { value: 'SWIFT Wire Transfer', label: 'SWIFT Wire Transfer' },
            { value: 'ACH Direct Deposit', label: 'ACH Direct Deposit' },
            { value: 'Stripe ACH / Card', label: 'Stripe ACH / Card' },
            { value: 'UK BACS Transfer', label: 'UK BACS Transfer' },
            { value: 'Crypto (USDC / ETH)', label: 'Crypto (USDC / ETH)' },
          ]}
        />

        <Textarea
          label="Invoice Notes & Milestone Description"
          placeholder="e.g. Milestone 2 Frontend Delivery and WebSocket Engine Handover"
          rows={2}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </form>
    </Modal>
  );
};
