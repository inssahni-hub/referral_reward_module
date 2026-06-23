import React from 'react';
import { ShoppingBag, CheckCircle, Clock, HeartHandshake, ArrowUpRight } from 'lucide-react';

export default function ReferralTransactionsTable({ transactions = [], onSettleEvent }) {
  if (transactions.length === 0) {
    return (
      <div className="bg-white border border-[#E5E2DE] rounded-sm p-10 text-center" id="empty-tx-table">
        <ShoppingBag className="w-12 h-12 text-[#A09E9B] mx-auto mb-3 opacity-60" />
        <h3 className="text-sm font-semibold text-[#1C1C1C]">No referral transactions yet</h3>
        <p className="text-xs text-[#706E6B] mt-1 max-w-sm mx-auto">
          When transactions are completed during checkout using promoter links, they will be logged here.
        </p>
      </div>
    );
  }

  // Group transactions by eventId so organizers can resolve/settle event completions easily
  const eventsWithPending = {};
  transactions.forEach(tx => {
    if (!tx.eventCompleted && tx.commissionStatus === 'pending') {
      if (!eventsWithPending[tx.eventId]) {
        eventsWithPending[tx.eventId] = {
          eventId: tx.eventId,
          eventName: tx.eventName,
          pendingCommissions: 0,
          txCount: 0
        };
      }
      eventsWithPending[tx.eventId].pendingCommissions += Number(tx.promoterCommission);
      eventsWithPending[tx.eventId].txCount += 1;
    }
  });

  const pendingEventsList = Object.values(eventsWithPending);

  return (
    <div className="space-y-6" id="referrals-tx-panel">
      {/* Settle Event Quick Panel */}
      {pendingEventsList.length > 0 && (
        <div className="bg-[#FFF9E6] border border-[#E5E2DE] rounded-sm p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[9px] bg-[#1C1C1C] text-white font-extrabold tracking-widest px-2.0 py-1 rounded-sm uppercase">
              Action Required
            </span>
            <h4 className="text-sm font-bold text-[#1C1C1C] mt-2">Pending Event Settlements Detected</h4>
            <p className="text-xs text-[#706E6B] mt-0.5 max-w-xl">
              Promoter commissions are locked in "Pending" state during pre-sales. Settle/Complete the events below to release pending commissions into modern redeemable wallets.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {pendingEventsList.map(ev => (
              <button
                key={`settle-btn-${ev.eventId}`}
                type="button"
                onClick={() => onSettleEvent(ev.eventId)}
                className="bg-[#1C1C1C] hover:bg-[#2D2D2D] text-white font-bold text-[10px] uppercase tracking-wider py-2.5 px-4 rounded-sm cursor-pointer transition-colors shrink-0"
              >
                Complete & Settle {ev.eventName} (${ev.pendingCommissions.toFixed(2)})
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Main Table */}
      <div className="bg-white border border-[#E5E2DE] rounded-sm overflow-hidden">
        <div className="p-4 border-b border-[#E5E2DE] bg-[#F7F5F2] flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-widest text-[#1C1C1C]">Referral Order Log ({transactions.length})</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#E5E2DE] text-[#706E6B] text-[10px] font-bold uppercase tracking-wider bg-[#F7F5F2]/40">
                <th className="py-3.5 px-5">Order Reference</th>
                <th className="py-3.5 px-5">Customer Profile</th>
                <th className="py-3.5 px-5">Line Item</th>
                <th className="py-3.5 px-5 text-right font-mono">Paid Amount</th>
                <th className="py-3.5 px-5 text-right font-mono">Commission</th>
                <th className="py-3.5 px-5 text-center">Settlement Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0EEEB] text-xs text-[#4A4A4A]">
              {transactions.map((tx) => (
                <tr key={tx._id} className="hover:bg-[#F7F5F2]/45 transition-colors">
                  {/* Order reference */}
                  <td className="py-3.5 px-5">
                    <div className="font-mono font-bold text-[#1C1C1C] text-xs mb-0.5">{tx.orderId}</div>
                    <div className="text-[10px] text-[#A09E9B] font-semibold">{new Date(tx.transactionDate).toLocaleDateString()}</div>
                    <div className="text-[9px] bg-[#F7F5F2] border border-[#E5E2DE] text-[#1C1C1C] px-1.5 py-0.5 rounded-sm mt-1 w-max font-bold font-mono uppercase">
                      Code: {tx.referralCode}
                    </div>
                  </td>

                  {/* Customer details */}
                  <td className="py-3.5 px-5">
                    <div className="font-semibold text-[#1C1C1C] leading-tight mb-0.5">{tx.buyerName}</div>
                    <div className="text-[10px] text-[#706E6B]">{tx.buyerEmail}</div>
                    <div className="text-[10px] text-[#706E6B]">{tx.buyerPhone}</div>
                  </td>

                  {/* Event item detail */}
                  <td className="py-3.5 px-5">
                    <div className="font-semibold text-[#1C1C1C]">{tx.eventName}</div>
                    <div className="text-[10px] text-[#706E6B] mt-0.5">Qty: {tx.ticketQuantity} ticket(s)</div>
                  </td>

                  {/* Price financials */}
                  <td className="py-3.5 px-5 text-right">
                    <div className="font-bold text-[#1C1C1C]">${tx.finalPaidAmount.toFixed(2)}</div>
                    <div className="text-[9px] text-[#A34E24] font-semibold">Saved: -${tx.discountGiven.toFixed(2)}</div>
                  </td>

                  {/* Promoter share */}
                  <td className="py-3.5 px-5 text-right">
                    <div className="font-bold text-[#1C1C1C]">${tx.promoterCommission.toFixed(2)}</div>
                    <div className="text-[9px] text-[#A09E9B] font-mono">{tx.promoterEmail}</div>
                  </td>

                  {/* Completion state */}
                  <td className="py-3.5 px-5 text-center whitespace-nowrap">
                    <div className="inline-flex flex-col items-center">
                      <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-0.5 rounded-sm border ${
                        tx.eventCompleted
                          ? 'bg-[#E5F2E1] text-[#2D5A27] border-[#2D5A27]/15'
                          : 'bg-[#FFF9E6] text-[#A34E24] border-[#A34E24]/15'
                      }`}>
                        {tx.eventCompleted ? (
                          <>
                            <CheckCircle className="w-3 h-3 text-[#2D5A27]" />
                            <span>Settled</span>
                          </>
                        ) : (
                          <>
                            <Clock className="w-3 h-3 text-[#A34E24] animate-pulse" />
                            <span>Pending</span>
                          </>
                        )}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
