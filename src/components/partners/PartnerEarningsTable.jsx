import React from 'react';
import { Calendar, Percent, RefreshCw, FileText } from 'lucide-react';

export default function PartnerEarningsTable({ earnings = [], isLoading = false }) {
  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'redeemable':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100 shadow-sm animate-pulse">
            ● Redeemable
          </span>
        );
      case 'withdrawn':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100">
            ✓ Paid out
          </span>
        );
      case 'pending':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-100">
            ◌ Pending Event
          </span>
        );
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
        <div className="space-y-4">
          <div className="h-6 w-1/4 bg-slate-100 rounded-md animate-pulse"></div>
          <div className="space-y-2">
            {[1, 2, 3, 4].map(idx => (
              <div key={idx} className="h-12 w-full bg-slate-50 rounded-lg animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div id="earnings_table_card" className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="px-6 py-5 border-b border-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-800">Booking Fee Earnings Ledger</h2>
          <p className="text-xs text-slate-500 mt-0.5">Individual event shares deducted from platform booking fee revenues.</p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/75 border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
              <th className="px-6 py-3.5">Co-Hosted Event</th>
              <th className="px-6 py-3.5">Event Date</th>
              <th className="px-6 py-3.5 text-right">Total Booking Fees</th>
              <th className="px-6 py-3.5 text-center">Your Share %</th>
              <th className="px-6 py-3.5 text-right">Your Earnings</th>
              <th className="px-6 py-3.5 text-center">Status</th>
              <th className="px-6 py-3.5">Settlement Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {earnings.length === 0 ? (
              <tr>
                <td colSpan="7" className="px-6 py-12 text-center text-slate-400 text-sm">
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <FileText className="w-8 h-8 text-slate-300" />
                    <p className="font-medium">No ledger entries match current filters.</p>
                    <p className="text-xs text-slate-400">Apply for events and publish booking revenues to generate commission share.</p>
                  </div>
                </td>
              </tr>
            ) : (
              earnings.map((earn) => (
                <tr id={`row_${earn._id}`} key={earn._id} className="hover:bg-slate-50/50 transition-colors duration-200">
                  <td className="px-6 py-4.5 font-semibold text-slate-800 text-sm">
                    {earn.eventName}
                  </td>
                  <td className="px-6 py-4.5 text-slate-500 text-sm">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-slate-400" />
                      <span>{formatDate(earn.eventDate)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4.5 text-right font-medium text-slate-600 text-sm">
                    ${Number(earn.bookingFeesGenerated).toFixed(2)}
                  </td>
                  <td className="px-6 py-4.5 text-center text-sm">
                    <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-mono text-xs">
                      <Percent className="w-3.5 h-3.5" />
                      <span>{earn.revenueSharePercentage}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4.5 text-right font-bold text-emerald-600 text-sm">
                    +${Number(earn.earnings).toFixed(2)}
                  </td>
                  <td className="px-6 py-4.5 text-center">
                    {getStatusBadge(earn.status)}
                  </td>
                  <td className="px-6 py-4.5 text-slate-500 text-xs">
                    <div className="flex items-center gap-1.5">
                      <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
                      <span>{earn.settlementDate ? formatDate(earn.settlementDate) : 'Pending release'}</span>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
