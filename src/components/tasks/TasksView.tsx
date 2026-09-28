import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Task, TaskStatus, Priority } from '../../types';
import { Badge, BadgeVariant } from '../common/Badge';
import { Button } from '../common/Button';
import { EmptyState } from '../common/EmptyState';
import { TaskModal } from './TaskModal';
import {
  CheckSquare,
  Plus,
  Search,
  CheckCircle2,
  Circle,
  Clock,
  Calendar,
  Layers,
  Kanban,
  List,
  Trash2,
  Edit2,
  Sparkles,
} from 'lucide-react';

export const TasksView: React.FC = () => {
  const { tasks, projects, toggleTaskStatus, deleteTask } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterPeriod, setFilterPeriod] = useState<
    'all' | 'today' | 'upcoming' | 'overdue'
  >('all');
  const [filterPriority, setFilterPriority] = useState<'All' | Priority>('All');
  const [filterProject, setFilterProject] = useState<string>('All');
  const [viewMode, setViewMode] = useState<'list' | 'kanban'>('list');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);

  const todayStr = new Date().toISOString().split('T')[0];

  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => {
      // Period filter
      if (filterPeriod === 'today' && t.dueDate !== todayStr) return false;
      if (filterPeriod === 'upcoming' && t.dueDate <= todayStr) return false;
      if (
        filterPeriod === 'overdue' &&
        (t.dueDate >= todayStr || t.status === 'Done')
      )
        return false;

      // Priority filter
      if (filterPriority !== 'All' && t.priority !== filterPriority)
        return false;

      // Project filter
      if (filterProject !== 'All' && t.projectId !== filterProject) return false;

      // Search query
      const q = searchQuery.toLowerCase();
      if (
        q &&
        !t.title.toLowerCase().includes(q) &&
        !t.projectName?.toLowerCase().includes(q) &&
        !t.notes?.toLowerCase().includes(q)
      ) {
        return false;
      }

      return true;
    });
  }, [tasks, filterPeriod, filterPriority, filterProject, searchQuery, todayStr]);

  const priorityVariantMap: Record<Priority, BadgeVariant> = {
    High: 'rose',
    Medium: 'amber',
    Low: 'slate',
  };

  const handleOpenAdd = () => {
    setTaskToEdit(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (t: Task) => {
    setTaskToEdit(t);
    setIsModalOpen(true);
  };

  const todoTasks = filteredTasks.filter((t) => t.status === 'To Do');
  const inProgressTasks = filteredTasks.filter((t) => t.status === 'In Progress');
  const doneTasks = filteredTasks.filter((t) => t.status === 'Done');

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            Task Management & Sprints
            <span className="text-xs font-mono font-medium px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
              {doneTasks.length}/{tasks.length} Completed
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Prioritize client deliverables, track sprint velocity, and complete milestones
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* View Mode Toggle */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-white/[0.03] border border-white/[0.08]">
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'list'
                  ? 'bg-emerald-500/20 text-emerald-400'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="List View"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('kanban')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'kanban'
                  ? 'bg-emerald-500/20 text-emerald-400'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Kanban Board View"
            >
              <Kanban className="w-4 h-4" />
            </button>
          </div>

          <Button
            variant="neon"
            size="md"
            onClick={handleOpenAdd}
            icon={<Plus className="w-4 h-4" />}
          >
            Create Task
          </Button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 p-3 rounded-2xl border border-white/[0.06] bg-[#0E1218]/80 backdrop-blur-xl">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search tasks by title, project, or notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#0A0D13] text-white text-xs pl-10 pr-4 py-2.5 rounded-xl border border-white/[0.08] focus:outline-none focus:border-emerald-500/50"
          />
        </div>

        {/* Priority Filter */}
        <div className="flex items-center gap-2">
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value as any)}
            className="px-3 py-2 rounded-xl bg-[#0A0D13] border border-white/[0.08] text-xs text-slate-300 focus:outline-none cursor-pointer"
          >
            <option value="All" className="bg-[#0E131B]">All Priorities</option>
            <option value="High" className="bg-[#0E131B]">High Priority</option>
            <option value="Medium" className="bg-[#0E131B]">Medium Priority</option>
            <option value="Low" className="bg-[#0E131B]">Low Priority</option>
          </select>

          {/* Project Filter */}
          <select
            value={filterProject}
            onChange={(e) => setFilterProject(e.target.value)}
            className="px-3 py-2 rounded-xl bg-[#0A0D13] border border-white/[0.08] text-xs text-slate-300 focus:outline-none cursor-pointer max-w-[160px] truncate"
          >
            <option value="All" className="bg-[#0E131B]">All Projects</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id} className="bg-[#0E131B]">
                {p.projectName}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Date Period Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {[
          { label: 'All Sprints', value: 'all' },
          { label: 'Due Today', value: 'today' },
          { label: 'Upcoming', value: 'upcoming' },
          { label: 'Overdue', value: 'overdue' },
        ].map((period) => (
          <button
            key={period.value}
            type="button"
            onClick={() => setFilterPeriod(period.value as any)}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
              filterPeriod === period.value
                ? 'bg-blue-500/15 text-blue-300 border border-blue-500/30'
                : 'text-slate-400 hover:text-slate-200 bg-white/[0.02] border border-white/[0.04]'
            }`}
          >
            {period.label}
          </button>
        ))}
      </div>

      {/* Content: List or Kanban */}
      {filteredTasks.length === 0 ? (
        <EmptyState
          icon={<CheckSquare className="w-6 h-6" />}
          title="No tasks found"
          description="Try changing the filter parameters or create a new task."
          actionLabel="Add Task"
          onAction={handleOpenAdd}
        />
      ) : viewMode === 'list' ? (
        /* List Mode */
        <div className="rounded-2xl border border-white/[0.06] bg-[#0E1218]/90 overflow-hidden backdrop-blur-xl">
          <div className="divide-y divide-white/[0.04]">
            {filteredTasks.map((task) => {
              const isDone = task.status === 'Done';
              const isOverdue = !isDone && task.dueDate < todayStr;

              return (
                <div
                  key={task.id}
                  className={`p-4 sm:p-5 flex items-start sm:items-center justify-between gap-4 transition-colors ${
                    isDone
                      ? 'bg-emerald-500/[0.02] opacity-75'
                      : 'hover:bg-white/[0.02]'
                  }`}
                >
                  <div className="flex items-start gap-3.5 min-w-0 flex-1">
                    {/* Satisfying Toggle Button */}
                    <button
                      type="button"
                      onClick={() => toggleTaskStatus(task.id)}
                      className="mt-0.5 text-slate-400 hover:text-emerald-400 transition-transform active:scale-90 cursor-pointer shrink-0"
                      aria-label={isDone ? 'Mark as incomplete' : 'Mark as done'}
                    >
                      {isDone ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.7)]" />
                      ) : (
                        <Circle className="w-5 h-5" />
                      )}
                    </button>

                    <div className="min-w-0">
                      <p
                        className={`text-sm font-medium transition-all ${
                          isDone
                            ? 'line-through text-slate-400'
                            : 'text-slate-100'
                        }`}
                      >
                        {task.title}
                      </p>

                      <div className="flex items-center gap-3 mt-1 flex-wrap text-xs text-slate-400">
                        {task.projectName && (
                          <span className="font-mono text-slate-400 truncate">
                            {task.projectName}
                          </span>
                        )}
                        <Badge variant={priorityVariantMap[task.priority]} size="xs">
                          {task.priority}
                        </Badge>
                        <span
                          className={`font-mono flex items-center gap-1 ${
                            isOverdue ? 'text-rose-400 font-semibold' : 'text-slate-400'
                          }`}
                        >
                          <Clock className="w-3 h-3" />
                          {isOverdue ? `Overdue (${task.dueDate})` : `Due ${task.dueDate}`}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(task)}
                      className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/[0.05]"
                      title="Edit task"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteTask(task.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-rose-500/10"
                      title="Delete task"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Kanban Board Mode */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { title: 'To Do', items: todoTasks, variant: 'default' as const },
            { title: 'In Progress', items: inProgressTasks, variant: 'amber' as const },
            { title: 'Done', items: doneTasks, variant: 'emerald' as const },
          ].map((column) => (
            <div
              key={column.title}
              className="p-4 rounded-2xl border border-white/[0.06] bg-[#0E1218]/90 backdrop-blur-xl flex flex-col min-h-[400px]"
            >
              <div className="flex items-center justify-between pb-3 border-b border-white/[0.06] mb-3">
                <span className="text-xs font-semibold text-white">
                  {column.title}
                </span>
                <span className="text-xs font-mono text-slate-400 bg-white/[0.05] px-2 py-0.5 rounded-full">
                  {column.items.length}
                </span>
              </div>

              <div className="space-y-3 flex-1 overflow-y-auto">
                {column.items.map((task) => (
                  <div
                    key={task.id}
                    className="p-3.5 rounded-xl border border-white/[0.06] bg-[#0A0D13] hover:border-white/[0.12] transition-all space-y-2 group"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p
                        className={`text-xs font-medium ${
                          task.status === 'Done'
                            ? 'line-through text-slate-400'
                            : 'text-slate-100'
                        }`}
                      >
                        {task.title}
                      </p>
                      <Badge variant={priorityVariantMap[task.priority]} size="xs">
                        {task.priority}
                      </Badge>
                    </div>

                    {task.projectName && (
                      <p className="text-[11px] text-slate-400 truncate">
                        {task.projectName}
                      </p>
                    )}

                    <div className="flex items-center justify-between pt-2 border-t border-white/[0.04] text-[10px] font-mono text-slate-400">
                      <span>{task.dueDate}</span>
                      <button
                        type="button"
                        onClick={() => toggleTaskStatus(task.id)}
                        className="text-emerald-400 hover:text-emerald-300 font-sans"
                      >
                        {task.status === 'Done' ? 'Undo' : 'Mark Done'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Task Modal */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        taskToEdit={taskToEdit}
      />
    </div>
  );
};
