import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Client, ClientStatus } from '../../types';
import { Modal } from '../common/Modal';
import { Input, Select, Textarea } from '../common/FormControls';
import { Button } from '../common/Button';

interface ClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  clientToEdit?: Client | null;
}

export const ClientModal: React.FC<ClientModalProps> = ({
  isOpen,
  onClose,
  clientToEdit,
}) => {
  const { addClient, updateClient } = useApp();

  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [status, setStatus] = useState<ClientStatus>('Active');
  const [website, setWebsite] = useState('');
  const [billingAddress, setBillingAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (clientToEdit) {
      setName(clientToEdit.name);
      setCompany(clientToEdit.company);
      setEmail(clientToEdit.email);
      setPhone(clientToEdit.phone);
      setStatus(clientToEdit.status);
      setWebsite(clientToEdit.website || '');
      setBillingAddress(clientToEdit.billingAddress || '');
      setNotes(clientToEdit.notes);
    } else {
      setName('');
      setCompany('');
      setEmail('');
      setPhone('');
      setStatus('Active');
      setWebsite('');
      setBillingAddress('');
      setNotes('');
    }
    setError('');
  }, [clientToEdit, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !company.trim() || !email.trim()) {
      setError('Please provide client contact name, company name, and email.');
      return;
    }

    const today = new Date().toISOString().split('T')[0];

    if (clientToEdit) {
      updateClient(clientToEdit.id, {
        name,
        company,
        email,
        phone,
        status,
        website,
        billingAddress,
        notes,
        lastInteraction: today,
      });
    } else {
      addClient({
        name,
        company,
        email,
        phone,
        status,
        totalRevenue: 0,
        outstandingBalance: 0,
        lastInteraction: today,
        website,
        billingAddress,
        notes,
      });
    }

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={clientToEdit ? 'Edit Client Record' : 'Add New Client'}
      subtitle="Enterprise accounts, billing information, and studio relationships"
      maxWidth="lg"
      footer={
        <>
          <Button variant="ghost" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="neon" size="sm" onClick={handleSubmit}>
            {clientToEdit ? 'Save Changes' : 'Create Client'}
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
            label="Primary Contact Name"
            placeholder="e.g. Elena Rostova"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <Input
            label="Company / Organization"
            placeholder="e.g. Vanguard FinTech Group"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Billing Email"
            type="email"
            placeholder="elena@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            label="Direct Phone"
            type="tel"
            placeholder="+1 (555) 304-9982"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Account Status"
            value={status}
            onChange={(e) => setStatus(e.target.value as ClientStatus)}
            options={[
              { value: 'Active', label: 'Active Account' },
              { value: 'Retainer', label: 'Recurring Retainer' },
              { value: 'Lead Won', label: 'New Client (Lead Won)' },
              { value: 'Completed', label: 'Completed Past Engagement' },
            ]}
          />
          <Input
            label="Official Website"
            type="url"
            placeholder="https://company.com"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
          />
        </div>

        <Input
          label="Billing / Tax Address"
          placeholder="e.g. 500 Howard Street, Suite 400, San Francisco, CA"
          value={billingAddress}
          onChange={(e) => setBillingAddress(e.target.value)}
        />

        <Textarea
          label="Relationship Notes & Communication Guidelines"
          placeholder="Preferred communication channels, payment approval workflows, special requirements..."
          rows={3}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </form>
    </Modal>
  );
};
