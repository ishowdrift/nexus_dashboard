import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Proposal, ProposalStatus } from '../../types';
import { Modal } from '../common/Modal';
import { Input, Select, Textarea } from '../common/FormControls';
import { Button } from '../common/Button';

interface ProposalModalProps {
  isOpen: boolean;
  onClose: () => void;
  proposalToEdit?: Proposal | null;
}

export const ProposalModal: React.FC<ProposalModalProps> = ({
  isOpen,
  onClose,
  proposalToEdit,
}) => {
  const { addProposal, updateProposal, clients } = useApp();

  const [proposalNumber, setProposalNumber] = useState('');
  const [clientName, setClientName] = useState('');
  const [projectName, setProjectName] = useState('');
  const [proposalValue, setProposalValue] = useState('20000');
  const [dateSent, setDateSent] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [expirationDate, setExpirationDate] = useState('');
  const [status, setStatus] = useState<ProposalStatus>('Draft');
  const [scopeSummary, setScopeSummary] = useState('');
  const [deliverablesText, setDeliverablesText] = useState(
    'Phase 1: Architecture & Figma Prototypes\nPhase 2: Next.js + Tailwind Implementation\nPhase 3: Production QA & Deployment Handover'
  );
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (proposalToEdit) {
      setProposalNumber(proposalToEdit.proposalNumber);
      setClientName(proposalToEdit.clientName);
      setProjectName(proposalToEdit.projectName);
      setProposalValue(proposalToEdit.proposalValue.toString());
      setDateSent(proposalToEdit.dateSent);
      setExpirationDate(proposalToEdit.expirationDate);
      setStatus(proposalToEdit.status);
      setScopeSummary(proposalToEdit.scopeSummary);
      setDeliverablesText(proposalToEdit.deliverables.join('\n'));
      setNotes(proposalToEdit.notes || '');
    } else {
      const randomNum = Math.floor(100 + Math.random() * 900);
      setProposalNumber(`PROP-2026-${randomNum}`);
      setClientName(clients.length > 0 ? clients[0].company : '');
      setProjectName('');
      setProposalValue('18000');
      setDateSent(new Date().toISOString().split('T')[0]);
      const exp = new Date();
      exp.setDate(exp.getDate() + 14);
      setExpirationDate(exp.toISOString().split('T')[0]);
      setStatus('Sent');
      setScopeSummary('');
      setDeliverablesText(
        'Phase 1: Architecture & UX Blueprint\nPhase 2: High-Fidelity Frontend Development\nPhase 3: Automated Testing & Handover'
      );
      setNotes('');
    }
    setError('');
  }, [proposalToEdit, isOpen, clients]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim() || !projectName.trim()) {
      setError('Please provide client name and project title.');
      return;
    }

    const val = parseFloat(proposalValue) || 0;
    const deliverables = deliverablesText
      .split('\n')
      .map((d) => d.trim())
      .filter(Boolean);

    if (proposalToEdit) {
      updateProposal(proposalToEdit.id, {
        proposalNumber,
        clientName,
        projectName,
        proposalValue: val,
        dateSent,
        expirationDate,
        status,
        scopeSummary,
        deliverables,
        notes,
      });
    } else {
      addProposal({
        proposalNumber,
        clientName,
        projectName,
        proposalValue: val,
        dateSent,
        expirationDate,
        status,
        scopeSummary,
        deliverables,
        notes,
      });
    }

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={proposalToEdit ? 'Edit Formal Proposal' : 'Draft New Proposal'}
      subtitle="Craft commercial scopes, deliverables breakdown, and expiration terms"
      maxWidth="lg"
      footer={
        <>
          <Button variant="ghost" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="neon" size="sm" onClick={handleSubmit}>
            {proposalToEdit ? 'Save Changes' : 'Issue Proposal'}
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
            label="Proposal Reference ID"
            value={proposalNumber}
            onChange={(e) => setProposalNumber(e.target.value)}
            required
          />
          <Input
            label="Client / Company"
            placeholder="e.g. Zenith BioSciences"
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
            required
          />
        </div>

        <Input
          label="Proposed Project Scope"
          placeholder="e.g. Clinical Trial Analytics & Web Portal"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          required
        />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Input
            label="Proposal Value ($)"
            type="number"
            min="0"
            step="500"
            value={proposalValue}
            onChange={(e) => setProposalValue(e.target.value)}
          />
          <Input
            label="Date Sent"
            type="date"
            value={dateSent}
            onChange={(e) => setDateSent(e.target.value)}
          />
          <Input
            label="Expiration Date"
            type="date"
            value={expirationDate}
            onChange={(e) => setExpirationDate(e.target.value)}
            required
          />
        </div>

        <Select
          label="Proposal Status"
          value={status}
          onChange={(e) => setStatus(e.target.value as ProposalStatus)}
          options={[
            { value: 'Draft', label: 'Draft' },
            { value: 'Sent', label: 'Sent to Client' },
            { value: 'Viewed', label: 'Viewed by Client' },
            { value: 'Negotiating', label: 'In Negotiation' },
            { value: 'Accepted', label: 'Accepted / Won' },
            { value: 'Rejected', label: 'Declined / Expired' },
          ]}
        />

        <Textarea
          label="Executive Summary & Commercial Terms"
          placeholder="Brief executive narrative describing the problem and ROI..."
          rows={3}
          value={scopeSummary}
          onChange={(e) => setScopeSummary(e.target.value)}
        />

        <Textarea
          label="Deliverables (one per line)"
          placeholder="Phase 1: Architecture\nPhase 2: Implementation"
          rows={3}
          value={deliverablesText}
          onChange={(e) => setDeliverablesText(e.target.value)}
        />
      </form>
    </Modal>
  );
};
