import React from 'react';
import { BarChart3, TrendingUp, DollarSign } from 'lucide-react';

export default function PartnerRevenueChart({ eventsList = [] }) {
  // If we have no events, put mock values to make it look full and beautiful
  const defaultChartData = [
    { name: 'Indie Rock', fees: 300, share: 90 },
    { name: 'Food & Wine', fees: 400, share: 120 },
    { name: 'Summer Music', fees: 550, share: 165 },
    { name: 'Global Tech', fees: 1100, share: 330 }
  ];

  const chartData = eventsList.length > 0 
    ? eventsList.map(e => ({
        name: e.eventName.substring(0, 12) + (e.eventName.length > 12 ? '..' : ''),
        fees: e.bookingFees,
        share: e.partnerEarnings
      })).reverse() // chronological left to right
    : [];

  // Let's calculate standard scaling variables for the SVG viewbox (500x200)
  const maxVal = Math.max(...chartData.map(d => d.fees), 400);
  const padding = 35;
  const graphWidth = 430;
  const graphHeight = 140;

  return (
    <div id="revenue_chart_card" className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
              <BarChart3 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-sm">Revenue Distribution Analytics</h3>
              <p className="text-slate-400 text-[10px]">Booking fee volume mapped against commissions</p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-[10px]">
            <div className="flex items-center gap-1.5 font-medium text-slate-500">
              <span className="w-2 pb-0.5 h-2 rounded-full bg-slate-200 inline-block"></span>
              <span>Total Fees</span>
            </div>
            <div className="flex items-center gap-1.5 font-medium text-emerald-600">
              <span className="w-2 pb-0.5 h-2 rounded-full bg-emerald-500 inline-block"></span>
              <span>Your Share</span>
            </div>
          </div>
        </div>

        {/* Dynamic SVG Canvas and Coordinates Grid */}
        <div className="relative h-44 w-full mt-4">
          <svg className="w-full h-full overflow-visible" viewBox="0 0 500 200">
            {/* Grid Lines */}
            {[0, 0.25, 0.5, 0.75, 1].map((r, i) => {
              const y = padding + (1 - r) * graphHeight;
              const labelVal = Math.round(r * maxVal);
              return (
                <g key={i}>
                  <line 
                    x1={padding} 
                    y1={y} 
                    x2={padding + graphWidth} 
                    y2={y} 
                    className="stroke-slate-100" 
                    strokeWidth="1" 
                    strokeDasharray="4 4" 
                  />
                  <text 
                    x={padding - 5} 
                    y={y + 4} 
                    textAnchor="end" 
                    className="fill-slate-400 font-mono text-[9px] font-medium"
                  >
                    ${labelVal}
                  </text>
                </g>
              );
            })}

            {/* Bars and Markers */}
            {chartData.map((d, index) => {
              const barWidth = 35;
              const spacing = graphWidth / chartData.length;
              const x = padding + (index * spacing) + (spacing - barWidth) / 2;

              // Booking fees bar height
              const feesHeight = (d.fees / maxVal) * graphHeight;
              const feesY = padding + graphHeight - feesHeight;

              // Earnings bar height
              const shareHeight = (d.share / maxVal) * graphHeight;
              const shareY = padding + graphHeight - shareHeight;

              return (
                <g key={index} className="group/bar cursor-pointer">
                  {/* Total Booking Fees Bar */}
                  <rect
                    x={x}
                    y={feesY}
                    width={barWidth}
                    height={feesHeight}
                    rx="4"
                    className="fill-slate-100 hover:fill-slate-200/85 transition-colors duration-200"
                  />

                  {/* Partner Share Bar */}
                  <rect
                    x={x + 3}
                    y={shareY}
                    width={barWidth - 6}
                    height={shareHeight}
                    rx="3"
                    className="fill-emerald-500 hover:fill-emerald-400 transition-colors duration-200"
                  />

                  {/* Tooltip Hover Value Display */}
                  <g className="opacity-0 group-hover/bar:opacity-100 transition-opacity duration-200 pointer-events-none">
                    <rect
                      x={x - 15}
                      y={feesY - 32}
                      width={65}
                      height={26}
                      rx="4"
                      className="fill-slate-900 shadow-lg"
                    />
                    <text
                      x={x + barWidth / 2}
                      y={feesY - 15}
                      textAnchor="middle"
                      className="fill-white font-mono text-[9px] font-bold"
                    >
                      Share: ${d.share.toFixed(0)}
                    </text>
                  </g>

                  {/* X Axis Label */}
                  <text
                    x={x + barWidth / 2}
                    y={padding + graphHeight + 15}
                    textAnchor="middle"
                    className="fill-slate-500 font-sans text-[10px] font-semibold"
                  >
                    {d.name}
                  </text>
                </g>
              );
            })}

            {/* Bottom baseline */}
            <line
              x1={padding}
              y1={padding + graphHeight}
              x2={padding + graphWidth}
              y2={padding + graphHeight}
              className="stroke-slate-200"
              strokeWidth="1.5"
            />
          </svg>
        </div>
      </div>

      <div className="mt-4 border-t border-slate-50 pt-3 flex items-center justify-between text-xs text-slate-500">
        <div className="flex items-center gap-1">
          <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
          <span className="font-semibold text-slate-700">Healthy commission distribution</span>
        </div>
        <span className="font-medium text-[9px] text-slate-400">Values in USD</span>
      </div>
    </div>
  );
}
