import React from 'react';
import { useApp } from '../../context/AppContext';
import { Badge } from '../common/Badge';
import { FolderGit2, ArrowUpRight, Clock, DollarSign } from 'lucide-react';

export const ActiveProjectsOverview: React.FC = () => {
  const { projects, setSelectedProjectId, navigateTo } = useApp();

  const activeProjects = projects.filter(
    (p) => p.status !== 'Completed' && p.status !== 'Archived'
  );

  return (
    <div className="rounded-2xl border border-white/[0.06] bg-[#0E1218]/90 p-6 backdrop-blur-xl">
      <div className="flex items-center justify-between mb-5">
        <div>
          <div className="flex items-center gap-2">
            <FolderGit2 className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-semibold text-white tracking-tight">
              Active Engagements
            </h3>
            <span className="text-xs font-mono text-slate-400">
              ({activeProjects.length})
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Production progress, delivery countdowns, and financial status
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigateTo('projects')}
          className="text-xs font-medium text-emerald-400 hover:text-emerald-300 flex items-center gap-1 transition-colors"
        >
          <span>View All</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="space-y-3.5">
        {activeProjects.map((project) => {
          const isOverdue = new Date(project.deadline) < new Date();
          const paidPercentage = Math.round((project.amountPaid / project.budget) * 100);

          return (
            <div
              key={project.id}
              onClick={() => {
                setSelectedProjectId(project.id);
                navigateTo('projects', project.id);
              }}
              className="p-4 rounded-xl border border-white/[0.05] bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/[0.1] transition-all cursor-pointer group"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-white group-hover:text-emerald-300 transition-colors truncate">
                      {project.projectName}
                    </span>
                    <Badge
                      variant={
                        project.status === 'In Progress'
                          ? 'emerald'
                          : project.status === 'Review'
                          ? 'amber'
                          : 'cyan'
                      }
                      size="xs"
                      dot
                    >
                      {project.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">{project.clientName}</p>
                </div>

                <div className="flex items-center gap-3 shrink-0 text-xs">
                  <span
                    className={`flex items-center gap-1 font-mono ${
                      isOverdue ? 'text-rose-400 font-semibold' : 'text-slate-400'
                    }`}
                  >
                    <Clock className="w-3.5 h-3.5" />
                    Due {project.deadline}
                  </span>
                  <span className="flex items-center gap-1 font-mono text-slate-300">
                    <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                    ${project.budget.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Progress and Payment Bar */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                  <span>Milestone Progress: <strong className="text-slate-200">{project.progress}%</strong></span>
                  <span>Paid: <strong className="text-emerald-400">${project.amountPaid.toLocaleString()}</strong> ({paidPercentage}%)</span>
                </div>

                <div className="w-full h-1.5 rounded-full bg-slate-800/80 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-cyan-400 shadow-[0_0_10px_rgba(16,185,129,0.5)] transition-all duration-500"
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
