import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ProjectStatus, Priority } from '../../types';
import { Modal } from '../common/Modal';
import { Badge, BadgeVariant } from '../common/Badge';
import { Button } from '../common/Button';
import { ConfirmDialog } from '../common/ConfirmDialog';
import {
  FolderGit2,
  Calendar,
  DollarSign,
  Clock,
  CheckCircle2,
  Circle,
  Plus,
  Edit2,
  Trash2,
  Layers,
  Sparkles,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';

interface ProjectDetailModalProps {
  onEdit: () => void;
}

export const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({ onEdit }) => {
  const {
    projects,
    tasks,
    selectedProjectId,
    setSelectedProjectId,
    updateProjectProgress,
    changeProjectStatus,
    deleteProject,
    toggleTaskStatus,
    addTask,
    navigateTo,
  } = useApp();

  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [isAddingTask, setIsAddingTask] = useState(false);

  const project = projects.find((p) => p.id === selectedProjectId);

  if (!project) return null;

  const projectTasks = tasks.filter((t) => t.projectId === project.id);

  const statusVariantMap: Record<ProjectStatus, BadgeVariant> = {
    Planning: 'default',
    'In Progress': 'emerald',
    Review: 'amber',
    'Waiting for Client': 'violet',
    Completed: 'cyan',
    Archived: 'slate',
  };

  const priorityVariantMap: Record<Priority, BadgeVariant> = {
    High: 'rose',
    Medium: 'amber',
    Low: 'slate',
  };

  const handleQuickAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    addTask({
      title: newTaskTitle.trim(),
      projectId: project.id,
      projectName: project.projectName,
      clientId: project.clientId,
      clientName: project.clientName,
      priority: 'Medium',
      dueDate: project.deadline,
      status: 'To Do',
    });

    setNewTaskTitle('');
    setIsAddingTask(false);
  };

  return (
    <>
      <Modal
        isOpen={Boolean(selectedProjectId)}
        onClose={() => setSelectedProjectId(null)}
        maxWidth="3xl"
        title={
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-emerald-500 flex items-center justify-center text-sm font-bold text-slate-950 shadow-[0_0_15px_rgba(245,158,11,0.25)]">
              <FolderGit2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold text-white">{project.projectName}</span>
                <Badge variant={statusVariantMap[project.status]} size="xs" dot>
                  {project.status}
                </Badge>
                <Badge variant={priorityVariantMap[project.priority]} size="xs">
                  {project.priority} Priority
                </Badge>
              </div>
              <p className="text-xs text-slate-400 font-normal mt-0.5">
                Client: <strong className="text-slate-200">{project.clientName}</strong> • {project.serviceType}
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
              <span>Delete Project</span>
            </button>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSelectedProjectId(null);
                  navigateTo('payments');
                }}
                icon={<DollarSign className="w-3.5 h-3.5 text-emerald-400" />}
              >
                Invoices
              </Button>
              <Button variant="outline" size="sm" onClick={onEdit} icon={<Edit2 className="w-3.5 h-3.5" />}>
                Edit
              </Button>
              <Button variant="neon" size="sm" onClick={() => setSelectedProjectId(null)}>
                Done
              </Button>
            </div>
          </div>
        }
      >
        <div className="space-y-6 text-slate-200">
          {/* Progress Indicator Card with Interactive Slider */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-cyan-500/5 to-transparent border border-emerald-500/20">
            <div className="flex items-center justify-between mb-2">
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 block font-semibold">
                  Milestone Progress
                </span>
                <p className="text-xs text-slate-400 mt-0.5">
                  Drag slider to update live progress completion percentage
                </p>
              </div>
              <span className="text-3xl font-extrabold font-mono text-white">
                {project.progress}%
              </span>
            </div>

            <div className="w-full h-2.5 rounded-full bg-slate-800/80 overflow-hidden my-3">
              <div
                className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-cyan-400 shadow-[0_0_15px_rgba(16,185,129,0.7)] transition-all duration-300"
                style={{ width: `${project.progress}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-xs font-mono text-slate-400">
              <input
                type="range"
                min="0"
                max="100"
                value={project.progress}
                onChange={(e) =>
                  updateProjectProgress(project.id, parseInt(e.target.value, 10))
                }
                className="w-full accent-emerald-400 bg-slate-800 rounded-lg cursor-pointer"
              />
            </div>
          </div>

          {/* Financial Breakdown */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
              <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block">
                Total Contract Budget
              </span>
              <p className="text-xl font-bold font-mono text-white mt-1">
                ${project.budget.toLocaleString()}
              </p>
            </div>
            <div className="p-4 rounded-xl bg-emerald-500/[0.04] border border-emerald-500/20">
              <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-400 block">
                Amount Paid
              </span>
              <p className="text-xl font-bold font-mono text-emerald-400 mt-1">
                ${project.amountPaid.toLocaleString()}
              </p>
            </div>
            <div className="p-4 rounded-xl bg-amber-500/[0.04] border border-amber-500/20">
              <span className="text-[11px] font-mono uppercase tracking-wider text-amber-400 block">
                Remaining Receivable
              </span>
              <p className="text-xl font-bold font-mono text-amber-400 mt-1">
                ${project.amountRemaining.toLocaleString()}
              </p>
            </div>
          </div>

          {/* Timeline & Milestones */}
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-3">
            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block">
              Engagement Timeline & Milestones
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-2.5 rounded-lg bg-black/30 border border-white/[0.04]">
                <span className="text-[10px] font-mono text-slate-400 block">Kickoff</span>
                <span className="font-mono text-slate-200">{project.startDate}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-black/30 border border-white/[0.04]">
                <span className="text-[10px] font-mono text-slate-400 block">Current Stage</span>
                <span className="font-mono text-emerald-400 font-semibold">{project.status}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-black/30 border border-white/[0.04]">
                <span className="text-[10px] font-mono text-slate-400 block">Target Deadline</span>
                <span className="font-mono text-cyan-300 font-semibold">{project.deadline}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-black/30 border border-white/[0.04]">
                <span className="text-[10px] font-mono text-slate-400 block">Sprints Done</span>
                <span className="font-mono text-slate-200">
                  {project.tasksCount.completed} / {project.tasksCount.total}
                </span>
              </div>
            </div>
          </div>

          {/* Key Deliverables */}
          {project.deliverables && project.deliverables.length > 0 && (
            <div className="space-y-2">
              <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block">
                Contract Deliverables
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {project.deliverables.map((deliv, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] text-xs flex items-center gap-2"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span className="text-slate-200 truncate">{deliv}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Project Associated Tasks Checklist */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
                Action Items & Sprints ({projectTasks.length})
              </span>
              <Button
                variant="ghost"
                size="xs"
                onClick={() => setIsAddingTask((prev) => !prev)}
                icon={<Plus className="w-3.5 h-3.5" />}
              >
                {isAddingTask ? 'Cancel' : 'Add Task'}
              </Button>
            </div>

            {/* Quick Add Task Form */}
            {isAddingTask && (
              <form onSubmit={handleQuickAddTask} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Task title..."
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  className="flex-1 bg-[#0A0D13] text-white text-xs px-3.5 py-2 rounded-xl border border-white/[0.1] focus:outline-none focus:border-emerald-500"
                  autoFocus
                />
                <Button variant="neon" size="xs" type="submit">
                  Save
                </Button>
              </form>
            )}

            {projectTasks.length === 0 ? (
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.05] text-xs text-slate-400 text-center">
                No specific tasks linked to this project.
              </div>
            ) : (
              <div className="space-y-2">
                {projectTasks.map((t) => {
                  const isDone = t.status === 'Done';
                  return (
                    <div
                      key={t.id}
                      onClick={() => toggleTaskStatus(t.id)}
                      className={`p-3 rounded-xl border flex items-center justify-between gap-3 cursor-pointer transition-colors ${
                        isDone
                          ? 'bg-emerald-500/[0.03] border-emerald-500/20 text-slate-400'
                          : 'bg-white/[0.02] border-white/[0.05] hover:bg-white/[0.04]'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {isDone ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 shadow-[0_0_8px_rgba(52,211,153,0.5)]" />
                        ) : (
                          <Circle className="w-4 h-4 text-slate-400 shrink-0" />
                        )}
                        <span
                          className={`text-xs font-medium truncate ${
                            isDone ? 'line-through text-slate-400' : 'text-slate-200'
                          }`}
                        >
                          {t.title}
                        </span>
                      </div>

                      <Badge
                        variant={
                          t.priority === 'High'
                            ? 'rose'
                            : t.priority === 'Medium'
                            ? 'amber'
                            : 'slate'
                        }
                        size="xs"
                      >
                        {t.priority}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Project Notes */}
          {project.notes && (
            <div className="space-y-2">
              <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block">
                Technical Notes & Context
              </span>
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] text-xs text-slate-300 leading-relaxed">
                {project.notes}
              </div>
            </div>
          )}
        </div>
      </Modal>

      <ConfirmDialog
        isOpen={isConfirmDeleteOpen}
        onClose={() => setIsConfirmDeleteOpen(false)}
        onConfirm={() => {
          deleteProject(project.id);
          setSelectedProjectId(null);
        }}
        title="Delete Project"
        message={`Are you sure you want to remove project "${project.projectName}"? Associated records and invoice references will remain.`}
        confirmText="Delete Project"
      />
    </>
  );
};
