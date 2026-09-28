import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckSquare, ArrowUpRight, CheckCircle2, Circle, Clock } from 'lucide-react';
import { Badge } from '../common/Badge';

export const TodayTasksWidget: React.FC = () => {
  const { tasks, toggleTaskStatus, navigateTo } = useApp();

  const todayTasks = tasks.slice(0, 5);

  return (
    <div className="rounded-2xl border border-white/[0.06] bg-[#0E1218]/90 p-6 backdrop-blur-xl flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <CheckSquare className="w-5 h-5 text-blue-400" />
            <h3 className="text-base font-semibold text-white tracking-tight">
              Today's Focus
            </h3>
          </div>
          <button
            type="button"
            onClick={() => navigateTo('tasks')}
            className="text-xs font-medium text-emerald-400 hover:text-emerald-300 flex items-center gap-1 transition-colors"
          >
            <span>All Tasks</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-2.5">
          {todayTasks.map((task) => {
            const isDone = task.status === 'Done';
            return (
              <div
                key={task.id}
                onClick={() => toggleTaskStatus(task.id)}
                className={`p-3 rounded-xl border border-white/[0.05] flex items-start gap-3 transition-all cursor-pointer ${
                  isDone
                    ? 'bg-emerald-500/[0.04] border-emerald-500/20 opacity-75'
                    : 'bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/[0.1]'
                }`}
              >
                <button
                  type="button"
                  aria-label={isDone ? 'Mark as incomplete' : 'Mark as complete'}
                  className="mt-0.5 text-slate-400 hover:text-emerald-400 transition-colors shrink-0"
                >
                  {isDone ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.5)]" />
                  ) : (
                    <Circle className="w-4 h-4" />
                  )}
                </button>

                <div className="flex-1 min-w-0">
                  <p
                    className={`text-xs font-medium leading-snug transition-all ${
                      isDone
                        ? 'line-through text-slate-400'
                        : 'text-slate-200 hover:text-white'
                    }`}
                  >
                    {task.title}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    {task.projectName && (
                      <span className="text-[10px] text-slate-400 truncate font-mono">
                        {task.projectName.split(' ')[0]}
                      </span>
                    )}
                    <Badge
                      variant={
                        task.priority === 'High'
                          ? 'rose'
                          : task.priority === 'Medium'
                          ? 'amber'
                          : 'slate'
                      }
                      size="xs"
                    >
                      {task.priority}
                    </Badge>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-white/[0.05] flex items-center justify-between text-xs text-slate-400">
        <span className="flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-emerald-400" />
          Keep momentum: complete highest-priority first
        </span>
      </div>
    </div>
  );
};
