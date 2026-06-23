import React from 'react';
import { Calendar, Ticket, Award, HelpCircle } from 'lucide-react';

export default function PartnerEventsTable({ eventsList = [] }) {
  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getEventStatusBadge = (dateStr) => {
    const isPast = new Date(dateStr) < new Date();
    if (isPast) {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-150 text-slate-700 border border-slate-200">
          ✓ Event Ended
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
        ● Live / Upcomming
      </span>
    );
  };

  return (
    <div id="events_table_card" className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="px-6 py-5 border-b border-slate-50 flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-slate-800">Co-Hosted Campaigns & Event Metrics</h3>
          <p className="text-slate-400 text-xs mt-0.5">Summary of ticket counts and booking revenues attribution per event.</p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/75 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              <th className="px-6 py-3">Event Name</th>
              <th className="px-6 py-3">Event Date</th>
              <th className="px-6 py-3 text-center">Tickets Registered</th>
              <th className="px-6 py-3 text-right">Booking Fees Pool</th>
              <th className="px-6 py-3 text-right">Partner Revenue Share</th>
              <th className="px-6 py-3 text-center">Campaign Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-600 text-xs">
            {eventsList.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-10 text-center text-slate-400">
                  <div className="flex flex-col items-center justify-center gap-1.5 py-4">
                    <HelpCircle className="w-6 h-6 text-slate-350" />
                    <p className="font-medium text-slate-500">No event metrics logged yet.</p>
                    <p className="text-[10px] text-slate-400">Newly co-hosted initiatives appear automatically upon ticket sales activity.</p>
                  </div>
                </td>
              </tr>
            ) : (
              eventsList.map((e) => (
                <tr id={`evt_row_${e.eventId}`} key={e.eventId} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 font-bold text-slate-800">{e.eventName}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 font-medium">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>{formatDate(e.eventDate)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center font-mono">
                    <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-semibold text-[11px]">
                      <Ticket className="w-3.5 h-3.5 text-slate-400" />
                      <span>{e.ticketsSold}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right font-semibold text-slate-600 font-mono">${Number(e.bookingFees).toFixed(2)}</td>
                  <td className="px-6 py-4 text-right text-sm text-emerald-600 font-black font-mono flex-nowrap">
                    <div className="inline-flex items-center gap-1">
                      <Award className="w-3.5 h-3.5 text-slate-400" />
                      <span>+${Number(e.partnerEarnings).toFixed(2)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">{getEventStatusBadge(e.eventDate)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
