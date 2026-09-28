import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Task, TaskStatus, Priority } from '../../types';
import { Modal } from '../common/Modal';
import { Input, Select, Textarea } from '../common/FormControls';
import { Button } from '../common/Button';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  taskToEdit?: Task | null;
}

export const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  onClose,
  taskToEdit,
}) => {
  const { addTask, updateTask, projects } = useApp();

  const [title, setTitle] = useState('');
  const [projectId, setProjectId] = useState('');
  const [priority, setPriority] = useState<Priority>('High');
  const [dueDate, setDueDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [status, setStatus] = useState<TaskStatus>('To Do');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title);
      setProjectId(taskToEdit.projectId || '');
      setPriority(taskToEdit.priority);
      setDueDate(taskToEdit.dueDate);
      setStatus(taskToEdit.status);
      setNotes(taskToEdit.notes || '');
    } else {
      setTitle('');
      setProjectId(projects.length > 0 ? projects[0].id : '');
      setPriority('High');
      setDueDate(new Date().toISOString().split('T')[0]);
      setStatus('To Do');
      setNotes('');
    }
    setError('');
  }, [taskToEdit, isOpen, projects]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Please provide a task title.');
      return;
    }

    const selectedProj = projects.find((p) => p.id === projectId);

    if (taskToEdit) {
      updateTask(taskToEdit.id, {
        title,
        projectId: projectId || undefined,
        projectName: selectedProj?.projectName,
        clientId: selectedProj?.clientId,
        clientName: selectedProj?.clientName,
        priority,
        dueDate,
        status,
        notes,
      });
    } else {
      addTask({
        title,
        projectId: projectId || undefined,
        projectName: selectedProj?.projectName,
        clientId: selectedProj?.clientId,
        clientName: selectedProj?.clientName,
        priority,
        dueDate,
        status,
        notes,
      });
    }

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={taskToEdit ? 'Edit Task' : 'Create New Task'}
      subtitle="Define actionable sprint milestones, priority tags, and deadlines"
      maxWidth="md"
      footer={
        <>
          <Button variant="ghost" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="neon" size="sm" onClick={handleSubmit}>
            {taskToEdit ? 'Save Changes' : 'Create Task'}
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
          label="Task Description"
          placeholder="e.g. Optimize WebGL Canvas rendering performance on mobile"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <Select
          label="Link to Project (Optional)"
          value={projectId}
          onChange={(e) => setProjectId(e.target.value)}
        >
          <option value="" className="bg-[#0E131B]">
            None / General Task
          </option>
          {projects.map((p) => (
            <option key={p.id} value={p.id} className="bg-[#0E131B]">
              {p.projectName} ({p.clientName})
            </option>
          ))}
        </Select>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Select
            label="Priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value as Priority)}
            options={[
              { value: 'High', label: 'High Priority' },
              { value: 'Medium', label: 'Medium Priority' },
              { value: 'Low', label: 'Low Priority' },
            ]}
          />

          <Select
            label="Sprint Status"
            value={status}
            onChange={(e) => setStatus(e.target.value as TaskStatus)}
            options={[
              { value: 'To Do', label: 'To Do' },
              { value: 'In Progress', label: 'In Progress' },
              { value: 'Done', label: 'Done' },
            ]}
          />

          <Input
            label="Due Date"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            required
          />
        </div>

        <Textarea
          label="Sub-tasks & Acceptance Criteria"
          placeholder="Detailed requirements, test procedures, references..."
          rows={3}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </form>
    </Modal>
  );
};
