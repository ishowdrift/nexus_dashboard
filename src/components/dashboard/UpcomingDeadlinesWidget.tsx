import React from 'react';
import { useApp } from '../../context/AppContext';
import { Calendar, ArrowUpRight, AlertCircle, Clock } from 'lucide-react';
import { Badge } from '../common/Badge';

export const UpcomingDeadlinesWidget: React.FC = () => {
  const { projects, payments, navigateTo } = useApp();

  // Combine project deadlines and payment due dates
  const deadlines = [
    ...projects
      .filter((p) => p.status !== 'Completed')
      .map((p) => ({
        id: `p-${p.id}`,
        title: p.projectName,
        category: 'Project Milestone',
        dueDate: p.deadline,
        type: 'project' as const,
        amount: p.budget,
        client: p.clientName,
        targetId: p.id,
      })),
    ...payments
      .filter((pay) => pay.status === 'Pending' || pay.status === 'Overdue')
      .map((pay) => ({
        id: `pay-${pay.id}`,
        title: `${pay.invoiceNumber} Due (${pay.clientName})`,
        category: 'Invoice Settlement',
        dueDate: pay.dueDate,
        type: 'payment' as const,
        amount: pay.amount,
        client: pay.clientName,
        targetId: pay.id,
      })),
  ].sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

  const calculateDaysLeft = (dateStr: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const target = new Date(dateStr);
    target.setHours(0, 0, 0, 0);
    const diffTime = target.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="rounded-2xl border border-white/[0.06] bg-[#0E1218]/90 p-6 backdrop-blur-xl flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-cyan-400" />
            <h3 className="text-base font-semibold text-white tracking-tight">
              Upcoming Deadlines
            </h3>
          </div>
          <button
            type="button"
            onClick={() => navigateTo('calendar')}
            className="text-xs font-medium text-emerald-400 hover:text-emerald-300 flex items-center gap-1 transition-colors"
          >
            <span>Full Agenda</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-3">
          {deadlines.slice(0, 4).map((item) => {
            const daysLeft = calculateDaysLeft(item.dueDate);
            const isOverdue = daysLeft < 0;
            const isUrgent = daysLeft >= 0 && daysLeft <= 3;

            return (
              <div
                key={item.id}
                onClick={() =>
                  navigateTo(item.type === 'project' ? 'projects' : 'payments', item.targetId)
                }
                className="p-3 rounded-xl border border-white/[0.05] bg-white/[0.02] hover:bg-white/[0.04] transition-all cursor-pointer flex items-center justify-between gap-3 group"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-semibold text-slate-200 group-hover:text-emerald-300 transition-colors truncate">
                      {item.title}
                    </p>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5 truncate">
                    {item.client} • {item.category}
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <Badge
                    variant={isOverdue ? 'rose' : isUrgent ? 'amber' : 'cyan'}
                    size="xs"
                    dot
                  >
                    {isOverdue
                      ? `${Math.abs(daysLeft)}d overdue`
                      : daysLeft === 0
                      ? 'Today'
                      : daysLeft === 1
                      ? 'Tomorrow'
                      : `In ${daysLeft} days`}
                  </Badge>
                  <p className="text-[10px] font-mono text-slate-400 mt-1">
                    {item.dueDate}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-white/[0.05] flex items-center justify-between text-xs text-slate-400">
        <span className="flex items-center gap-1.5 font-mono">
          <Clock className="w-3.5 h-3.5 text-cyan-400" />
          Synchronized with studio calendar
        </span>
      </div>
    </div>
  );
};
