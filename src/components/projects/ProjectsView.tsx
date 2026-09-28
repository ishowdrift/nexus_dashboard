import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Project, ProjectStatus } from '../../types';
import { Badge, BadgeVariant } from '../common/Badge';
import { Button } from '../common/Button';
import { EmptyState } from '../common/EmptyState';
import { ProjectModal } from './ProjectModal';
import { ProjectDetailModal } from './ProjectDetailModal';
import {
  FolderGit2,
  Plus,
  Search,
  Clock,
  DollarSign,
  ArrowUpDown,
  Building,
  CheckCircle2,
} from 'lucide-react';

const STATUS_OPTIONS: { label: string; value: 'All' | ProjectStatus }[] = [
  { label: 'All Projects', value: 'All' },
  { label: 'In Progress', value: 'In Progress' },
  { label: 'Review', value: 'Review' },
  { label: 'Planning', value: 'Planning' },
  { label: 'Waiting for Client', value: 'Waiting for Client' },
  { label: 'Completed', value: 'Completed' },
];

export const ProjectsView: React.FC = () => {
  const { projects, setSelectedProjectId, selectedProjectId } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<'All' | ProjectStatus>('All');
  const [sortBy, setSortBy] = useState<'deadline' | 'progress' | 'budget' | 'name'>('deadline');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projectToEdit, setProjectToEdit] = useState<Project | null>(null);

  const filteredProjects = useMemo(() => {
    return projects
      .filter((p) => {
        const matchesStatus =
          selectedStatus === 'All' || p.status === selectedStatus;
        const q = searchQuery.toLowerCase();
        const matchesQuery =
          !q ||
          p.projectName.toLowerCase().includes(q) ||
          p.clientName.toLowerCase().includes(q) ||
          p.serviceType.toLowerCase().includes(q);
        return matchesStatus && matchesQuery;
      })
      .sort((a, b) => {
        if (sortBy === 'deadline') return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
        if (sortBy === 'progress') return b.progress - a.progress;
        if (sortBy === 'budget') return b.budget - a.budget;
        if (sortBy === 'name') return a.projectName.localeCompare(b.projectName);
        return 0;
      });
  }, [projects, selectedStatus, searchQuery, sortBy]);

  const statusVariantMap: Record<ProjectStatus, BadgeVariant> = {
    Planning: 'default',
    'In Progress': 'emerald',
    Review: 'amber',
    'Waiting for Client': 'violet',
    Completed: 'cyan',
    Archived: 'slate',
  };

  const handleOpenAdd = () => {
    setProjectToEdit(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = () => {
    const project = projects.find((p) => p.id === selectedProjectId);
    if (project) {
      setProjectToEdit(project);
      setIsModalOpen(true);
    }
  };

  const totalBudget = projects.reduce((acc, p) => acc + p.budget, 0);
  const activeCount = projects.filter(
    (p) => p.status === 'In Progress' || p.status === 'Review' || p.status === 'Planning'
  ).length;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            Project Deliverables
            <span className="text-xs font-mono font-medium px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
              {activeCount} Active Sprints
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Production sprint tracking, milestone deliverables, deadlines, and financials
          </p>
        </div>

        <Button
          variant="neon"
          size="md"
          onClick={handleOpenAdd}
          icon={<Plus className="w-4 h-4" />}
        >
          New Project
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 p-3 rounded-2xl border border-white/[0.06] bg-[#0E1218]/80 backdrop-blur-xl">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search projects by title, client, or technical scope..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#0A0D13] text-white text-xs pl-10 pr-4 py-2.5 rounded-xl border border-white/[0.08] focus:outline-none focus:border-emerald-500/50"
          />
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#0A0D13] border border-white/[0.08] text-xs text-slate-300">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-400">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent text-white focus:outline-none cursor-pointer"
            >
              <option value="deadline" className="bg-[#0E131B]">Upcoming Deadline</option>
              <option value="progress" className="bg-[#0E131B]">Progress %</option>
              <option value="budget" className="bg-[#0E131B]">Budget Value</option>
              <option value="name" className="bg-[#0E131B]">Project Name</option>
            </select>
          </div>
        </div>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {STATUS_OPTIONS.map((opt) => {
          const isSelected = selectedStatus === opt.value;
          const count =
            opt.value === 'All'
              ? projects.length
              : projects.filter((p) => p.status === opt.value).length;

          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => setSelectedStatus(opt.value)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                isSelected
                  ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30 shadow-[0_0_12px_rgba(245,158,11,0.2)]'
                  : 'text-slate-400 hover:text-slate-200 bg-white/[0.02] border border-white/[0.04]'
              }`}
            >
              <span>{opt.label}</span>
              <span
                className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                  isSelected ? 'bg-amber-500/20 text-amber-200' : 'bg-white/[0.05] text-slate-400'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <EmptyState
          icon={<FolderGit2 className="w-6 h-6" />}
          title="No projects match this filter"
          description="Clear filters to view all current and completed projects."
          actionLabel="Clear Filter"
          onAction={() => {
            setSearchQuery('');
            setSelectedStatus('All');
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProjects.map((project) => {
            const isCompleted = project.status === 'Completed';

            return (
              <div
                key={project.id}
                onClick={() => setSelectedProjectId(project.id)}
                className="p-5 rounded-2xl border border-white/[0.06] bg-[#0E1218]/90 hover:bg-[#121620] hover:border-white/[0.12] transition-all cursor-pointer flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <Badge variant={statusVariantMap[project.status]} size="xs" dot>
                      {project.status}
                    </Badge>
                    <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {project.deadline}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors line-clamp-1">
                    {project.projectName}
                  </h3>

                  <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
                    <Building className="w-3.5 h-3.5 text-slate-400" />
                    {project.clientName}
                  </p>

                  <p className="text-xs text-slate-400 mt-2 line-clamp-2">
                    {project.serviceType}
                  </p>
                </div>

                <div className="mt-5 space-y-3 pt-4 border-t border-white/[0.05]">
                  {/* Progress Bar */}
                  <div>
                    <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-1.5">
                      <span>Progress</span>
                      <span className="text-white font-bold">{project.progress}%</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-slate-800/80 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isCompleted
                            ? 'bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.5)]'
                            : 'bg-gradient-to-r from-emerald-500 to-cyan-400 shadow-[0_0_10px_rgba(16,185,129,0.5)]'
                        }`}
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                  </div>

                  {/* Financial & Tasks row */}
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-300 flex items-center gap-1">
                      <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                      ${project.budget.toLocaleString()}
                    </span>
                    <span className="text-slate-400">
                      {project.tasksCount.completed}/{project.tasksCount.total} tasks
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Project Modal */}
      <ProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        projectToEdit={projectToEdit}
      />

      {/* Project Detail Modal */}
      <ProjectDetailModal onEdit={handleOpenEdit} />
    </div>
  );
};
