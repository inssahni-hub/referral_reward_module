import React from 'react';
import { Sparkles, Calendar, ReceiptText, ArrowUpRight } from 'lucide-react';

export default function ReferralAnalyticsTable({ eventsBreakdown = [] }) {
  if (eventsBreakdown.length === 0) {
    return (
      <div className="bg-white border border-[#E5E2DE] rounded-sm p-8 text-center" id="empty-analytics-table">
        <ReceiptText className="w-12 h-12 text-[#A09E9B] mx-auto mb-3 opacity-60" />
        <h3 className="text-sm font-semibold text-[#1C1C1C]">No event conversions yet</h3>
        <p className="text-xs text-[#706E6B] mt-1 max-w-sm mx-auto">
          Create referral codes and share them with promoters. Once sales come in, their specific performance will look like this.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-[#E5E2DE] rounded-sm overflow-hidden" id="analytics-breakdown-details">
      <div className="p-5 border-b border-[#E5E2DE] flex items-center justify-between bg-[#F7F5F2]">
        <div>
          <h3 className="text-xs font-bold uppercase tracking-widest text-[#1C1C1C]">Performance Event Breakdown</h3>
          <p className="text-[11px] text-[#706E6B] mt-0.5">Yields, commissions, and tickets sold grouped by ticketed events</p>
        </div>
        <span className="text-[9px] bg-[#1C1C1C] text-white font-extrabold px-2.5 py-1 rounded-sm flex items-center gap-1 uppercase tracking-widest">
          <Sparkles className="w-3 h-3" /> {eventsBreakdown.length} active
        </span>
      </div>

      <div className="overflow-x-auto font-sans">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#E5E2DE] text-[#706E6B] text-[10px] font-bold uppercase tracking-wider bg-[#F7F5F2]/40">
              <th className="py-3 px-5">Event Detail</th>
              <th className="py-3 px-5 text-center">Tickets Sold</th>
              <th className="py-3 px-5 text-right">Gross Referral Sales</th>
              <th className="py-3 px-5 text-right">Promoter Payouts</th>
              <th className="py-3 px-5 text-right">Organiser Net Share</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F0EEEB] text-xs text-[#4A4A4A]">
            {eventsBreakdown.map((item) => {
              const netShare = item.revenue - item.commissions;
              return (
                <tr key={item.eventId} className="hover:bg-[#F7F5F2]/45 transition-colors">
                  <td className="py-3 px-5">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 bg-[#F7F5F2] text-[#1C1C1C] border border-[#E5E2DE] rounded-sm shrink-0">
                        <Calendar className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <div className="font-semibold text-[#1C1C1C] leading-tight mb-0.5">{item.eventName}</div>
                        <div className="text-[10px] text-[#A09E9B] font-mono">ID: {item.eventId}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-5 text-center font-bold text-[#1C1C1C]">
                    {item.ticketsSold}
                  </td>
                  <td className="py-3 px-5 text-right font-bold text-[#2D5A27]">
                    ${Number(item.revenue || 0).toFixed(2)}
                  </td>
                  <td className="py-3 px-5 text-right font-medium text-[#A34E24]">
                    ${Number(item.commissions || 0).toFixed(2)}
                  </td>
                  <td className="py-3 px-5 text-right">
                    <span className="inline-flex items-center gap-1 font-bold text-[#1C1C1C] px-2 py-1 bg-[#F7F5F2] rounded-sm border border-[#E5E2DE] text-xs font-mono">
                      ${Number(netShare || 0).toFixed(2)}
                      <ArrowUpRight className="w-3 h-3 text-[#2D5A27]" />
                    </span>
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
