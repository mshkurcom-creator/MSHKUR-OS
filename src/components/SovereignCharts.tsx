/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface ChartProps {
  theme: 'luxury' | 'minimal' | 'chinese' | 'cosmos' | 'grok';
}

export const SovereignAreaChart: React.FC<ChartProps> = ({ theme }) => {
  // Let's model a beautiful wavy referral curve of high growth
  const data = [
    { label: 'يناير', value: 12 },
    { label: 'فبراير', value: 18 },
    { label: 'مارس', value: 34 },
    { label: 'أبريل', value: 29 },
    { label: 'مايو', value: 48 },
    { label: 'يونيو', value: 65 },
  ];

  const maxVal = 70;
  const width = 500;
  const height = 180;
  const padding = 25;

  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;

  // Compute SVG plotting path points
  const points = data.map((d, index) => {
    const x = padding + (index / (data.length - 1)) * chartWidth;
    const y = padding + chartHeight - (d.value / maxVal) * chartHeight;
    return { x, y };
  });

  const linePath = points.reduce((acc, p, i) => {
    return acc + (i === 0 ? `M ${p.x} ${p.y}` : ` L ${p.x} ${p.y}`);
  }, '');

  // Fill area path (closes at base of graph)
  const areaPath = points.length > 0 
    ? `${linePath} L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z`
    : '';

  // Theme styling definitions
  const strokeColor = 
    theme === 'luxury' ? '#c5a059' : 
    theme === 'chinese' ? '#e63946' : 
    theme === 'cosmos' ? '#38bdf8' : 
    theme === 'grok' ? '#208084' : '#208084';

  const stopColor = 
    theme === 'luxury' ? 'rgba(197, 160, 89, 0.4)' : 
    theme === 'chinese' ? 'rgba(230, 57, 70, 0.4)' : 
    theme === 'cosmos' ? 'rgba(56, 189, 248, 0.4)' : 
    theme === 'grok' ? 'rgba(32, 128, 132, 0.4)' : 'rgba(32, 128, 132, 0.2)';

  return (
    <div className="w-full h-full flex flex-col justify-between">
      <div className="flex justify-between items-center mb-1">
        <h4 className="text-sm font-semibold opacity-75">نمو الإحالات السيادية الأخير</h4>
        <span className="text-xs font-mono text-accent" style={{ color: strokeColor }}>+24% هذا الشهر</span>
      </div>

      <div className="relative w-full overflow-hidden flex-1">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
          <defs>
            <linearGradient id={`areaGlow-${theme}`} x1="0" y1="y1" x2="0" y2="1">
              <stop offset="0%" stopColor={stopColor} />
              <stop offset="100%" stopColor="transparent" />
            </linearGradient>
            <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="6" stdDeviation="4" floodColor={strokeColor} floodOpacity="0.3"/>
            </filter>
          </defs>

          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
            const y = padding + ratio * chartHeight;
            return (
              <line
                key={i}
                x1={padding}
                y1={y}
                x2={width - padding}
                y2={y}
                stroke="currentColor"
                className="opacity-[0.06]"
                strokeWidth="1"
                strokeDasharray="4 4"
              />
            );
          })}

          {/* Area Fill */}
          <path d={areaPath} fill={`url(#areaGlow-${theme})`} />

          {/* Top Line */}
          <path
            d={linePath}
            fill="none"
            stroke={strokeColor}
            strokeWidth="3.5"
            strokeLinecap="round"
            filter="url(#shadow)"
          />

          {/* Dot Markers */}
          {points.map((p, i) => (
            <g key={i} className="group cursor-pointer">
              <circle
                cx={p.x}
                cy={p.y}
                r="5"
                fill={strokeColor}
                stroke="#111"
                strokeWidth="2"
                className="transition-all duration-300 group-hover:r-7"
              />
              {/* Tooltip-style hover value */}
              <text
                x={p.x}
                y={p.y - 12}
                textAnchor="middle"
                fill={strokeColor}
                fontSize="10"
                fontWeight="bold"
                className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              >
                {data[i].value}
              </text>
            </g>
          ))}

          {/* X Axis Labels */}
          {data.map((d, i) => (
            <text
              key={i}
              x={points[i].x}
              y={height - 2}
              textAnchor="middle"
              fill="currentColor"
              className="opacity-40 text-[10px]"
              fontSize="10"
            >
              {d.label}
            </text>
          ))}
        </svg>
      </div>
    </div>
  );
};

interface CircleProps extends ChartProps {
  progressValue?: number; // e.g. 14250 points out of 20000 limit
  maxLimit?: number;
  percent?: number;
}

export const SovereignRadialProgress: React.FC<CircleProps> = ({ theme, progressValue, maxLimit, percent }) => {
  const finalPercent = percent !== undefined ? percent : (progressValue && maxLimit ? Math.min((progressValue / maxLimit) * 100, 100) : 0);
  const finalValue = progressValue !== undefined ? progressValue : (percent !== undefined ? percent : 0);
  const finalLimit = maxLimit !== undefined ? maxLimit : 100;

  const radius = 65;
  const strokeWidth = 10;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (finalPercent / 100) * circumference;

  const color = 
    theme === 'luxury' ? '#c5a059' : 
    theme === 'chinese' ? '#e63946' : 
    theme === 'cosmos' ? '#38bdf8' : 
    theme === 'grok' ? '#208084' : '#208084';

  return (
    <div className="relative flex flex-col items-center justify-center">
      <svg className="w-36 h-36 transform -rotate-90 overflow-visible">
        {/* Track */}
        <circle
          cx="72"
          cy="72"
          r={radius}
          fill="transparent"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth={strokeWidth}
        />
        {/* Glow Shadow under indicator */}
        <circle
          cx="72"
          cy="72"
          r={radius}
          fill="transparent"
          stroke={color}
          strokeWidth={strokeWidth + 2}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="opacity-20 blur-[3px]"
        />
        {/* Progress Indicator */}
        <circle
          cx="72"
          cy="72"
          r={radius}
          fill="transparent"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      {/* Absolute overlay labels */}
      <div className="absolute flex flex-col items-center justify-center text-center">
        <span className="text-xs opacity-50 font-medium">النقاط والرتبة</span>
        <span className="text-xl font-bold font-display" style={{ color }}>
          {finalValue.toLocaleString()}{percent !== undefined ? '%' : ''}
        </span>
        {percent === undefined && (
          <span className="text-[10px] opacity-40">من {finalLimit.toLocaleString()}</span>
        )}
      </div>
    </div>
  );
};
