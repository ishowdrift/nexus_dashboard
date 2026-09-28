import React from 'react';
import { useApp } from '../../context/AppContext';
import { LeadStatus } from '../../types';
import { ArrowRight, Sparkles } from 'lucide-react';

interface StageConfig {
  key: LeadStatus;
  label: string;
  color: string;
  bgColor: string;
  borderColor: string;
}

const STAGES: StageConfig[] = [
  {
    key: 'New',
    label: 'Lead',
    color: 'text-slate-300',
    bgColor: 'bg-slate-500/10',
    borderColor: 'border-slate-500/20',
  },
  {
    key: 'Contacted',
    label: 'Contacted',
    color: 'text-cyan-400',
    bgColor: 'bg-cyan-500/10',
    borderColor: 'border-cyan-500/20',
  },
  {
    key: 'Proposal Sent',
    label: 'Proposal',
    color: 'text-violet-400',
    bgColor: 'bg-violet-500/10',
    borderColor: 'border-violet-500/20',
  },
  {
    key: 'Negotiation',
    label: 'Negotiation',
    color: 'text-amber-400',
    bgColor: 'bg-amber-500/10',
    borderColor: 'border-amber-500/20',
  },
  {
    key: 'Won',
    label: 'Won',
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-500/15',
    borderColor: 'border-emerald-500/30',
  },
];

export const PipelineBar: React.FC = () => {
  const { leads, navigateTo } = useApp();

  const stageData = STAGES.map((stage) => {
    // Note: also map 'Qualified' into Lead/Contacted bucket if needed
    const stageLeads = leads.filter((l) => {
      if (stage.key === 'New') return l.status === 'New' || l.status === 'Qualified';
      return l.status === stage.key;
    });

    const count = stageLeads.length;
    const value = stageLeads.reduce((acc, l) => acc + l.estimatedValue, 0);

    return {
      ...stage,
      count,
      value,
    };
  });

  const totalPipelineValue = leads
    .filter((l) => l.status !== 'Lost')
    .reduce((acc, l) => acc + l.estimatedValue, 0);

  return (
    <div className="rounded-2xl border border-white/[0.06] bg-[#0E1218]/90 p-6 backdrop-blur-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-semibold text-white tracking-tight">
              Conversion Pipeline
            </h3>
            <span className="flex items-center gap-1 text-[11px] font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/20">
              <Sparkles className="w-3 h-3" />
              Active Funnel
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Stage velocity and deal values currently under active negotiation
          </p>
        </div>

        <div className="text-right">
          <span className="text-[11px] text-slate-400 font-mono uppercase tracking-wider block">
            Pipeline Potential
          </span>
          <span className="text-lg font-bold font-mono text-emerald-400">
            ${totalPipelineValue.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Visual Pipeline Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
        {stageData.map((stage, idx) => (
          <div
            key={stage.key}
            onClick={() => navigateTo('leads')}
            className={`p-4 rounded-xl border ${stage.borderColor} ${stage.bgColor} hover:brightness-110 transition-all cursor-pointer relative group flex flex-col justify-between`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-200">
                {stage.label}
              </span>
              <span className={`text-xs font-mono font-bold ${stage.color}`}>
                {stage.count}
              </span>
            </div>

            <div className="mt-2">
              <p className={`text-sm font-bold font-mono ${stage.color}`}>
                ${stage.value.toLocaleString()}
              </p>
              <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                {stage.count === 1 ? '1 opportunity' : `${stage.count} opportunities`}
              </p>
            </div>

            {/* Stepper indicator arrow on right (except last) */}
            {idx < stageData.length - 1 && (
              <div className="hidden md:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-6 h-6 rounded-full bg-[#0E1218] border border-white/10 items-center justify-center text-slate-400">
                <ArrowRight className="w-3 h-3" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
