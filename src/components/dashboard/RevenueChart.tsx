import React, { useState } from 'react';
import { revenueHistory } from '../../data/initialData';
import { TrendingUp, DollarSign } from 'lucide-react';

export const RevenueChart: React.FC = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<'actual' | 'comparison'>('actual');

  const data = revenueHistory;
  const maxVal = Math.max(...data.map((d) => Math.max(d.revenue, d.projected))) * 1.15;
  const minVal = 0;

  // Chart dimensions in SVG viewBox coordinate space
  const width = 600;
  const height = 220;
  const paddingX = 40;
  const paddingY = 30;

  const chartW = width - paddingX * 2;
  const chartH = height - paddingY * 2;

  const points = data.map((d, i) => {
    const x = paddingX + (i / (data.length - 1)) * chartW;
    const y = height - paddingY - ((d.revenue - minVal) / (maxVal - minVal)) * chartH;
    return { x, y, ...d };
  });

  const projectedPoints = data.map((d, i) => {
    const x = paddingX + (i / (data.length - 1)) * chartW;
    const y = height - paddingY - ((d.projected - minVal) / (maxVal - minVal)) * chartH;
    return { x, y, ...d };
  });

  // Generate smooth SVG curve path
  const generatePath = (pts: { x: number; y: number }[]) => {
    if (pts.length === 0) return '';
    let path = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = i > 0 ? pts[i - 1] : pts[i];
      const p1 = pts[i];
      const p2 = pts[i + 1];
      const p3 = i != pts.length - 2 ? pts[i + 2] : p2;

      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;

      path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
    }
    return path;
  };

  const linePath = generatePath(points);
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${height - paddingY} L ${points[0].x} ${height - paddingY} Z`;

  const projectedLinePath = generatePath(projectedPoints);

  const activePoint = hoveredIndex !== null ? points[hoveredIndex] : points[points.length - 1];

  const total6M = data.reduce((acc, d) => acc + d.revenue, 0);
  const avgMonthly = Math.round(total6M / data.length);
  const growthRate = Math.round(
    ((data[data.length - 1].revenue - data[0].revenue) / data[0].revenue) * 100
  );

  return (
    <div className="rounded-2xl border border-white/[0.06] bg-[#0E1218]/90 p-6 backdrop-blur-xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-semibold text-white tracking-tight">
              Revenue Velocity
            </h3>
            <span className="flex items-center gap-1 text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
              <TrendingUp className="w-3 h-3" />
              +{growthRate}% YoY
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Cash collected over the past 6 months vs targets
          </p>
        </div>

        {/* View toggle */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-black/40 border border-white/[0.06] text-xs">
          <button
            type="button"
            onClick={() => setViewMode('actual')}
            className={`px-3 py-1 rounded-lg transition-all ${
              viewMode === 'actual'
                ? 'bg-emerald-500/20 text-emerald-300 font-medium'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Actual
          </button>
          <button
            type="button"
            onClick={() => setViewMode('comparison')}
            className={`px-3 py-1 rounded-lg transition-all ${
              viewMode === 'comparison'
                ? 'bg-emerald-500/20 text-emerald-300 font-medium'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            vs Projected
          </button>
        </div>
      </div>

      {/* KPI highlight row */}
      <div className="grid grid-cols-3 gap-4 mb-4 p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.04]">
        <div>
          <p className="text-[11px] text-slate-400 uppercase tracking-wider font-mono">
            {activePoint.month}
          </p>
          <p className="text-lg font-bold font-mono text-white mt-0.5 flex items-center">
            <DollarSign className="w-4 h-4 text-emerald-400 -mr-0.5" />
            {activePoint.revenue.toLocaleString()}
          </p>
        </div>
        <div>
          <p className="text-[11px] text-slate-400 uppercase tracking-wider font-mono">
            6-Mo Total
          </p>
          <p className="text-lg font-bold font-mono text-slate-200 mt-0.5">
            ${total6M.toLocaleString()}
          </p>
        </div>
        <div>
          <p className="text-[11px] text-slate-400 uppercase tracking-wider font-mono">
            Monthly Avg
          </p>
          <p className="text-lg font-bold font-mono text-cyan-300 mt-0.5">
            ${avgMonthly.toLocaleString()}
          </p>
        </div>
      </div>

      {/* SVG Interactive Chart */}
      <div className="relative w-full overflow-hidden">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-48 sm:h-56 select-none overflow-visible"
        >
          <defs>
            <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10B981" stopOpacity="0.35" />
              <stop offset="60%" stopColor="#06B6D4" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
            </linearGradient>

            <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Grid lines */}
          {[0, 0.33, 0.66, 1].map((ratio) => {
            const y = height - paddingY - ratio * chartH;
            const val = Math.round(minVal + ratio * (maxVal - minVal));
            return (
              <g key={ratio}>
                <line
                  x1={paddingX}
                  y1={y}
                  x2={width - paddingX}
                  y2={y}
                  stroke="rgba(255, 255, 255, 0.05)"
                  strokeDasharray="4 4"
                />
                <text
                  x={paddingX - 8}
                  y={y + 3}
                  textAnchor="end"
                  fill="rgba(148, 163, 184, 0.4)"
                  fontSize="10"
                  fontFamily="monospace"
                >
                  ${(val / 1000).toFixed(0)}k
                </text>
              </g>
            );
          })}

          {/* Area fill */}
          <path d={areaPath} fill="url(#revenueGradient)" />

          {/* Projected line (if toggled) */}
          {viewMode === 'comparison' && (
            <path
              d={projectedLinePath}
              fill="none"
              stroke="#64748B"
              strokeWidth="2"
              strokeDasharray="5 5"
              opacity="0.7"
            />
          )}

          {/* Main glowing line */}
          <path
            d={linePath}
            fill="none"
            stroke="#10B981"
            strokeWidth="3"
            filter="url(#neonGlow)"
            strokeLinecap="round"
          />

          {/* Data Points */}
          {points.map((pt, idx) => {
            const isHovered = hoveredIndex === idx;
            return (
              <g
                key={pt.month}
                className="cursor-pointer"
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {/* Vertical hover crosshair */}
                {isHovered && (
                  <line
                    x1={pt.x}
                    y1={paddingY}
                    x2={pt.x}
                    y2={height - paddingY}
                    stroke="rgba(52, 211, 153, 0.3)"
                    strokeWidth="1.5"
                    strokeDasharray="2 2"
                  />
                )}

                {/* Point circle */}
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={isHovered ? 6 : 4}
                  fill="#0B0D11"
                  stroke="#34D399"
                  strokeWidth={isHovered ? 3 : 2}
                  className="transition-all duration-150"
                />

                {/* Month label on x-axis */}
                <text
                  x={pt.x}
                  y={height - 8}
                  textAnchor="middle"
                  fill={isHovered ? '#34D399' : 'rgba(148, 163, 184, 0.6)'}
                  fontSize="11"
                  fontFamily="monospace"
                >
                  {pt.month.split(' ')[0]}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
};
