import React, { useState } from 'react';
import { ChartSpline, Coins, HelpCircle } from 'lucide-react';

export default function ReferralRevenueChart({ chartData = [] }) {
  const [hoverIndex, setHoverIndex] = useState(null);

  // If there's no data, show a placeholder
  if (chartData.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center flex flex-col items-center justify-center min-h-[300px]" id="empty-chart">
        <ChartSpline className="w-12 h-12 text-gray-300 mb-2" />
        <h3 className="text-sm font-semibold text-gray-700">No analytical data for chart</h3>
        <p className="text-xs text-gray-400 mt-1 max-w-xs">
          Select other filters or generate mock tickets purchase transactions to populate live time-series intervals.
        </p>
      </div>
    );
  }

  // Dimensions of SVG canvas
  const paddingX = 60;
  const paddingY = 40;
  const h = 220;
  const w = 600;

  // Max value tracker
  const maxVal = Math.max(
    ...chartData.map(d => Math.max(d.revenue, d.commission, d.netRevenue)),
    50 // base floor if small amounts
  ) * 1.15; // 15% padding on top

  // Calculate coordinates for points
  const pointsRevenue = [];
  const pointsCommission = [];
  const pointsNetRevenue = [];

  chartData.forEach((d, idx) => {
    const x = paddingX + (idx / (chartData.length - 1 || 1)) * (w - paddingX * 2);
    const yRevenue = h - paddingY - (d.revenue / maxVal) * (h - paddingY * 2);
    const yCommission = h - paddingY - (d.commission / maxVal) * (h - paddingY * 2);
    const yNetRevenue = h - paddingY - (d.netRevenue / maxVal) * (h - paddingY * 2);

    pointsRevenue.push({ x, y: yRevenue, data: d });
    pointsCommission.push({ x, y: yCommission, data: d });
    pointsNetRevenue.push({ x, y: yNetRevenue, data: d });
  });

  // Polyline formatted strings
  const strRev = pointsRevenue.map(p => `${p.x},${p.y}`).join(' ');
  const strComm = pointsCommission.map(p => `${p.x},${p.y}`).join(' ');
  const strNet = pointsNetRevenue.map(p => `${p.x},${p.y}`).join(' ');

  // Gradient area formula
  const fillRev = `${pointsRevenue[0]?.x},${h - paddingY} ` + strRev + ` ${pointsRevenue[pointsRevenue.length - 1]?.x},${h - paddingY}`;
  const fillNet = `${pointsNetRevenue[0]?.x},${h - paddingY} ` + strNet + ` ${pointsNetRevenue[pointsNetRevenue.length - 1]?.x},${h - paddingY}`;

  // Horizontal guide gridlines values
  const ticksY = [0, maxVal * 0.25, maxVal * 0.5, maxVal * 0.75, maxVal];

  return (
    <div className="bg-white border border-[#E5E2DE] rounded-sm p-6 w-full" id="referrals-revenue-chart-view">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#F0EEEB] pb-4 mb-4">
        <div>
          <h3 className="text-xs font-bold uppercase tracking-widest text-[#1C1C1C]">Financial Revenue Trends</h3>
          <p className="text-[11px] text-[#706E6B] mt-0.5">Daily distributions of gross revenues, net margins, and payouts</p>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-3.5 text-[10px] uppercase tracking-wider text-[#706E6B] font-bold">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 bg-[#1C1C1C] rounded-none inline-block"></span>
            <span>Gross Revenue</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 bg-[#2D5A27] rounded-none inline-block"></span>
            <span>Organiser Net</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 bg-[#A34E24] rounded-none inline-block"></span>
            <span>Promoter Share</span>
          </div>
        </div>
      </div>

      <div className="relative w-full overflow-x-auto">
        {/* Main SVG Chart Area */}
        <svg viewBox={`0 0 ${w} ${h}`} width="100%" height={h} className="min-w-[500px]">
          <defs>
            <linearGradient id="gradientRev" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1C1C1C" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#1C1C1C" stopOpacity="0.00" />
            </linearGradient>
            <linearGradient id="gradientNet" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2D5A27" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#2D5A27" stopOpacity="0.00" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {ticksY.map((tick, i) => {
            const y = h - paddingY - (tick / maxVal) * (h - paddingY * 2);
            return (
              <g key={`tick-${i}`}>
                <line
                  x1={paddingX}
                  y1={y}
                  x2={w - paddingX}
                  y2={y}
                  stroke="#F3F1ED"
                  strokeWidth="1"
                />
                <text
                  x={paddingX - 10}
                  y={y + 4}
                  textAnchor="end"
                  className="fill-[#A09E9B] font-mono text-[9px]"
                >
                  ${Math.round(tick)}
                </text>
              </g>
            );
          })}

          {/* X Axis Labels */}
          {chartData.map((d, i) => {
            // Show up to 5 labels to prevent clutter
            const division = Math.ceil(chartData.length / 5) || 1;
            if (i % division !== 0 && i !== chartData.length - 1) return null;

            const x = paddingX + (i / (chartData.length - 1 || 1)) * (w - paddingX * 2);
            const dateObj = new Date(d.date + 'T00:00:00');
            const formatStr = dateObj.toLocaleDateString(undefined, { month: 'short', day: 'numeric', timeZone: 'UTC' });

            return (
              <g key={`x-lbl-${i}`}>
                <line
                  x1={x}
                  y1={h - paddingY}
                  x2={x}
                  y2={h - paddingY + 4}
                  stroke="#E5E2DE"
                  strokeWidth="1"
                />
                <text
                  x={x}
                  y={h - paddingY + 16}
                  textAnchor="middle"
                  className="fill-[#706E6B] font-semibold text-[9px]"
                >
                  {formatStr}
                </text>
              </g>
            );
          })}

          {/* Area under curves */}
          {chartData.length > 1 && (
            <>
              <polygon points={fillRev} fill="url(#gradientRev)" />
              <polygon points={fillNet} fill="url(#gradientNet)" />
            </>
          )}

          {/* Line paths */}
          {chartData.length > 1 ? (
            <>
              <polyline
                points={strRev}
                fill="none"
                stroke="#1C1C1C"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <polyline
                points={strNet}
                fill="none"
                stroke="#2D5A27"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <polyline
                points={strComm}
                fill="none"
                stroke="#A34E24"
                strokeWidth="1.5"
                strokeDasharray="4 3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </>
          ) : (
            // Single point circles
            <>
              <circle cx={pointsRevenue[0]?.x} cy={pointsRevenue[0]?.y} r="5" fill="#1C1C1C" />
              <circle cx={pointsNetRevenue[0]?.x} cy={pointsNetRevenue[0]?.y} r="5" fill="#2D5A27" />
              <circle cx={pointsCommission[0]?.x} cy={pointsCommission[0]?.y} r="4" fill="#A34E24" />
            </>
          )}

          {/* Vertical overlay bars for mouse interactive hovers */}
          {chartData.map((d, idx) => {
            const x = paddingX + (idx / (chartData.length - 1 || 1)) * (w - paddingX * 2);
            return (
              <rect
                key={`bar-h-${idx}`}
                x={x - (w - paddingX * 2) / (chartData.length * 2 || 2)}
                y={paddingY}
                width={(w - paddingX * 2) / (chartData.length || 1)}
                height={h - paddingY * 2}
                fill="transparent"
                className="cursor-pointer"
                onMouseEnter={() => setHoverIndex(idx)}
                onMouseLeave={() => setHoverIndex(null)}
              />
            );
          })}

          {/* Hover highlight markers */}
          {hoverIndex !== null && pointsRevenue[hoverIndex] && (
            <g>
              <line
                x1={pointsRevenue[hoverIndex].x}
                y1={paddingY}
                x2={pointsRevenue[hoverIndex].x}
                y2={h - paddingY}
                stroke="#E5E2DE"
                strokeWidth="1"
                strokeDasharray="3 3"
              />
              {/* Highlight Nodes */}
              <circle cx={pointsRevenue[hoverIndex].x} cy={pointsRevenue[hoverIndex].y} r="4" fill="#1C1C1C" stroke="#ffffff" strokeWidth="2" />
              <circle cx={pointsNetRevenue[hoverIndex].x} cy={pointsNetRevenue[hoverIndex].y} r="4" fill="#2D5A27" stroke="#ffffff" strokeWidth="2" />
              <circle cx={pointsCommission[hoverIndex].x} cy={pointsCommission[hoverIndex].y} r="4" fill="#A34E24" stroke="#ffffff" strokeWidth="2" />
            </g>
          )}
        </svg>

        {/* Floating HTML Legend overlay for details of the hover node */}
        {hoverIndex !== null && chartData[hoverIndex] && (
          <div className="absolute top-1 right-2 bg-white border border-[#E5E2DE] text-[#1C1C1C] p-3 rounded-none shadow-none text-xs space-y-1.5 z-30 transition-all font-sans">
            <div className="font-bold border-b border-[#F0EEEB] pb-1 mb-1 text-[#706E6B]">
              {new Date(chartData[hoverIndex].date + 'T00:00:00').toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', timeZone: 'UTC' })}
            </div>
            <div className="flex items-center gap-4 justify-between">
              <span className="text-[#706E6B]">Gross Sale:</span>
              <span className="font-bold text-[#1C1C1C] font-mono">${chartData[hoverIndex].revenue.toFixed(2)}</span>
            </div>
            <div className="flex items-center gap-4 justify-between">
              <span className="text-[#2D5A27]">Net Profit:</span>
              <span className="font-bold text-[#2D5A27] font-mono">${chartData[hoverIndex].netRevenue.toFixed(2)}</span>
            </div>
            <div className="flex items-center gap-4 justify-between">
              <span className="text-[#A34E24]">Commission:</span>
              <span className="font-bold text-[#A34E24] font-mono">${chartData[hoverIndex].commission.toFixed(2)}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
