import React from 'react';
import { Ticket, BarChart3, CornerDownRight } from 'lucide-react';

export default function CashbackAnalyticsTable({ eventWiseStats = [], isLoading = false }) {
  if (isLoading) {
    return (
      <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-xs animate-pulse space-y-4">
        <div className="h-4 bg-gray-200 rounded w-1/3"></div>
        <div className="space-y-2">
          {[1, 2, 3].map(n => (
            <div key={n} className="h-10 bg-gray-100 rounded w-full"></div>
          ))}
        </div>
      </div>
    );
  }

  if (!eventWiseStats || eventWiseStats.length === 0) {
    return (
      <div className="bg-white border border-gray-100 rounded-xl p-8 text-center shadow-xs">
        <div className="mx-auto w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center border border-gray-100 text-gray-400 mb-3">
          <Ticket className="w-5 h-5 text-gray-300" />
        </div>
        <h4 className="text-gray-700 font-medium text-sm">No Event Performance Yet</h4>
        <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto">
          No tickets have been bought under eligible reward programs within the specified timeframe.
        </p>
      </div>
    );
  }

  // Find max value to draw relative progress bar percentages
  const maxAlloc = Math.max(...eventWiseStats.map(s => s.amount), 0.1);

  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-xs overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-50 bg-gray-50/40 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-emerald-600" /> Ticket & Rewards Distribution per Event
        </h3>
        <span className="text-xs font-mono font-medium text-gray-500">
          {eventWiseStats.length} events
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/20 text-[10.5px] font-bold text-gray-400 uppercase tracking-wider">
              <th className="py-3.5 px-5">Event Identifier</th>
              <th className="py-3.5 px-5">Event Title</th>
              <th className="py-3.5 px-5 select-none shrink-0 text-center">Reward Volume Percentage</th>
              <th className="py-3.5 px-5 text-right">Incentives Distributed</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 text-sm">
            {eventWiseStats.map((stat) => {
              const { eventId, eventTitle, amount } = stat;
              const ratio = Math.min((amount / maxAlloc) * 100, 100);

              return (
                <tr key={eventId} className="hover:bg-gray-50/50 transition-colors">
                  {/* Event ID badge */}
                  <td className="py-4 px-5 font-mono text-xs text-gray-400 font-bold whitespace-nowrap">
                    {eventId}
                  </td>

                  {/* Title */}
                  <td className="py-4 px-5">
                    <p className="font-semibold text-gray-800 line-clamp-1">{eventTitle}</p>
                  </td>

                  {/* Visual proportional indicator bar */}
                  <td className="py-4 px-5 max-w-[200px] shrink-0">
                    <div className="flex items-center gap-3">
                      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-emerald-500/80 rounded-full transition-all duration-300"
                          style={{ width: `${ratio}%` }}
                        />
                      </div>
                      <span className="text-xs font-semibold text-gray-500 w-8 font-mono shrink-0">
                        {Math.round(ratio)}%
                      </span>
                    </div>
                  </td>

                  {/* Cashback Earned counter */}
                  <td className="py-4 px-5 text-right font-mono text-emerald-600 font-bold whitespace-nowrap">
                    ${Number(amount).toFixed(2)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
