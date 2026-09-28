import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Lead, LeadStatus, LeadSource } from '../../types';
import { Modal } from '../common/Modal';
import { Input, Select, Textarea } from '../common/FormControls';
import { Button } from '../common/Button';

interface LeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  leadToEdit?: Lead | null;
}

export const LeadModal: React.FC<LeadModalProps> = ({
  isOpen,
  onClose,
  leadToEdit,
}) => {
  const { addLead, updateLead } = useApp();

  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [source, setSource] = useState<LeadSource>('Referral');
  const [service, setService] = useState('');
  const [estimatedValue, setEstimatedValue] = useState('15000');
  const [status, setStatus] = useState<LeadStatus>('New');
  const [lastContact, setLastContact] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [nextFollowUp, setNextFollowUp] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (leadToEdit) {
      setName(leadToEdit.name);
      setCompany(leadToEdit.company);
      setEmail(leadToEdit.email);
      setPhone(leadToEdit.phone);
      setSource(leadToEdit.source);
      setService(leadToEdit.service);
      setEstimatedValue(leadToEdit.estimatedValue.toString());
      setStatus(leadToEdit.status);
      setLastContact(leadToEdit.lastContact);
      setNextFollowUp(leadToEdit.nextFollowUp);
      setNotes(leadToEdit.notes);
    } else {
      setName('');
      setCompany('');
      setEmail('');
      setPhone('');
      setSource('Inbound Website');
      setService('');
      setEstimatedValue('12000');
      setStatus('New');
      setLastContact(new Date().toISOString().split('T')[0]);
      const nextDate = new Date();
      nextDate.setDate(nextDate.getDate() + 3);
      setNextFollowUp(nextDate.toISOString().split('T')[0]);
      setNotes('');
    }
    setError('');
  }, [leadToEdit, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !company.trim() || !email.trim()) {
      setError('Please provide lead name, company, and email address.');
      return;
    }

    const val = parseFloat(estimatedValue) || 0;

    if (leadToEdit) {
      updateLead(leadToEdit.id, {
        name,
        company,
        email,
        phone,
        source,
        service: service || 'Design & Engineering Retainer',
        estimatedValue: val,
        status,
        lastContact,
        nextFollowUp,
        notes,
      });
    } else {
      addLead({
        name,
        company,
        email,
        phone,
        source,
        service: service || 'Design & Engineering Retainer',
        estimatedValue: val,
        status,
        lastContact,
        nextFollowUp,
        notes,
      });
    }

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={leadToEdit ? 'Edit Pipeline Opportunity' : 'Add New Lead'}
      subtitle="Track inquiries, potential deal sizes, and scheduled follow-ups"
      maxWidth="lg"
      footer={
        <>
          <Button variant="ghost" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="neon" size="sm" onClick={handleSubmit}>
            {leadToEdit ? 'Save Changes' : 'Create Lead'}
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
            label="Contact Name"
            placeholder="e.g. Sophia Chen"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <Input
            label="Company / Studio"
            placeholder="e.g. Aura Robotics"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Email Address"
            type="email"
            placeholder="sophia@domain.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            label="Phone Number"
            type="tel"
            placeholder="+1 (555) 019-2834"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Select
            label="Lead Source"
            value={source}
            onChange={(e) => setSource(e.target.value as LeadSource)}
            options={[
              { value: 'Referral', label: 'Referral' },
              { value: 'LinkedIn', label: 'LinkedIn' },
              { value: 'Twitter/X', label: 'Twitter/X' },
              { value: 'Inbound Website', label: 'Inbound Website' },
              { value: 'Dribbble', label: 'Dribbble' },
              { value: 'Clutch', label: 'Clutch' },
              { value: 'Conference', label: 'Conference' },
            ]}
          />

          <Select
            label="Pipeline Status"
            value={status}
            onChange={(e) => setStatus(e.target.value as LeadStatus)}
            options={[
              { value: 'New', label: 'New Lead' },
              { value: 'Contacted', label: 'Contacted' },
              { value: 'Qualified', label: 'Qualified' },
              { value: 'Proposal Sent', label: 'Proposal Sent' },
              { value: 'Negotiation', label: 'Negotiation' },
              { value: 'Won', label: 'Won' },
              { value: 'Lost', label: 'Lost' },
            ]}
          />

          <Input
            label="Est. Value ($)"
            type="number"
            min="0"
            step="500"
            placeholder="15000"
            value={estimatedValue}
            onChange={(e) => setEstimatedValue(e.target.value)}
          />
        </div>

        <Input
          label="Proposed Service / Scope"
          placeholder="e.g. Next.js SaaS WebApp Redesign & Design System"
          value={service}
          onChange={(e) => setService(e.target.value)}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Last Contact Date"
            type="date"
            value={lastContact}
            onChange={(e) => setLastContact(e.target.value)}
          />
          <Input
            label="Next Follow-up"
            type="date"
            value={nextFollowUp}
            onChange={(e) => setNextFollowUp(e.target.value)}
          />
        </div>

        <Textarea
          label="Discovery Notes / Requirements"
          placeholder="Notes on budget expectations, key stakeholder concerns, technical constraints..."
          rows={3}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </form>
    </Modal>
  );
};
