import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Project, ProjectStatus, Priority } from '../../types';
import { Modal } from '../common/Modal';
import { Input, Select, Textarea } from '../common/FormControls';
import { Button } from '../common/Button';

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectToEdit?: Project | null;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({
  isOpen,
  onClose,
  projectToEdit,
}) => {
  const { addProject, updateProject, clients } = useApp();

  const [projectName, setProjectName] = useState('');
  const [clientId, setClientId] = useState('');
  const [clientName, setClientName] = useState('');
  const [serviceType, setServiceType] = useState('');
  const [startDate, setStartDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [deadline, setDeadline] = useState('');
  const [budget, setBudget] = useState('20000');
  const [amountPaid, setAmountPaid] = useState('0');
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<ProjectStatus>('Planning');
  const [priority, setPriority] = useState<Priority>('High');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (projectToEdit) {
      setProjectName(projectToEdit.projectName);
      setClientId(projectToEdit.clientId);
      setClientName(projectToEdit.clientName);
      setServiceType(projectToEdit.serviceType);
      setStartDate(projectToEdit.startDate);
      setDeadline(projectToEdit.deadline);
      setBudget(projectToEdit.budget.toString());
      setAmountPaid(projectToEdit.amountPaid.toString());
      setProgress(projectToEdit.progress);
      setStatus(projectToEdit.status);
      setPriority(projectToEdit.priority);
      setNotes(projectToEdit.notes);
    } else {
      setProjectName('');
      if (clients.length > 0) {
        setClientId(clients[0].id);
        setClientName(clients[0].company);
      } else {
        setClientId('');
        setClientName('');
      }
      setServiceType('');
      setStartDate(new Date().toISOString().split('T')[0]);
      const nextDate = new Date();
      nextDate.setDate(nextDate.getDate() + 30);
      setDeadline(nextDate.toISOString().split('T')[0]);
      setBudget('20000');
      setAmountPaid('5000');
      setProgress(10);
      setStatus('In Progress');
      setPriority('High');
      setNotes('');
    }
    setError('');
  }, [projectToEdit, isOpen, clients]);

  const handleClientChange = (cId: string) => {
    setClientId(cId);
    const selected = clients.find((c) => c.id === cId);
    if (selected) {
      setClientName(selected.company);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectName.trim()) {
      setError('Please provide a project name.');
      return;
    }

    const b = parseFloat(budget) || 0;
    const p = parseFloat(amountPaid) || 0;
    const remaining = Math.max(0, b - p);

    const clientFinal =
      clientName || (clients.find((c) => c.id === clientId)?.company ?? 'General Account');

    if (projectToEdit) {
      updateProject(projectToEdit.id, {
        projectName,
        clientId,
        clientName: clientFinal,
        serviceType: serviceType || 'Frontend & UI Engineering',
        startDate,
        deadline,
        budget: b,
        amountPaid: p,
        amountRemaining: remaining,
        progress,
        status,
        priority,
        notes,
      });
    } else {
      addProject({
        projectName,
        clientId: clientId || 'client-default',
        clientName: clientFinal,
        serviceType: serviceType || 'Frontend & UI Engineering',
        startDate,
        deadline,
        budget: b,
        amountPaid: p,
        amountRemaining: remaining,
        progress,
        status,
        priority,
        notes,
        deliverables: ['Discovery Brief', 'UI Design System', 'Production Release'],
      });
    }

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={projectToEdit ? 'Edit Project Milestones' : 'Create New Project'}
      subtitle="Configure scope, client assignment, deadlines, and budget tracking"
      maxWidth="lg"
      footer={
        <>
          <Button variant="ghost" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="neon" size="sm" onClick={handleSubmit}>
            {projectToEdit ? 'Save Changes' : 'Initialize Project'}
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

        <Input
          label="Project Title"
          placeholder="e.g. Vanguard HFT Analytics Platform 2.0"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          required
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Assigned Client"
            value={clientId}
            onChange={(e) => handleClientChange(e.target.value)}
          >
            {clients.map((c) => (
              <option key={c.id} value={c.id} className="bg-[#0E131B]">
                {c.company} ({c.name})
              </option>
            ))}
          </Select>

          <Input
            label="Service / Scope Type"
            placeholder="e.g. Next.js App, Design Tokens, Web Audio"
            value={serviceType}
            onChange={(e) => setServiceType(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Kickoff Date"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <Input
            label="Delivery Deadline"
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Total Budget ($)"
            type="number"
            min="0"
            step="100"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
          />
          <Input
            label="Amount Paid ($)"
            type="number"
            min="0"
            step="100"
            value={amountPaid}
            onChange={(e) => setAmountPaid(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Project Status"
            value={status}
            onChange={(e) => setStatus(e.target.value as ProjectStatus)}
            options={[
              { value: 'Planning', label: 'Planning' },
              { value: 'In Progress', label: 'In Progress' },
              { value: 'Review', label: 'Review / QA' },
              { value: 'Waiting for Client', label: 'Waiting for Client' },
              { value: 'Completed', label: 'Completed' },
              { value: 'Archived', label: 'Archived' },
            ]}
          />

          <Select
            label="Priority Level"
            value={priority}
            onChange={(e) => setPriority(e.target.value as Priority)}
            options={[
              { value: 'High', label: 'High Priority' },
              { value: 'Medium', label: 'Medium Priority' },
              { value: 'Low', label: 'Low Priority' },
            ]}
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-medium tracking-wide text-slate-300 uppercase">
              Current Progress ({progress}%)
            </label>
            <span className="text-xs font-mono text-emerald-400 font-bold">
              {progress}%
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={progress}
            onChange={(e) => setProgress(parseInt(e.target.value, 10))}
            className="w-full accent-emerald-400 bg-slate-800 rounded-lg cursor-pointer"
          />
        </div>

        <Textarea
          label="Project Deliverables & Notes"
          placeholder="Key milestones, technical considerations, repositories..."
          rows={3}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </form>
    </Modal>
  );
};
