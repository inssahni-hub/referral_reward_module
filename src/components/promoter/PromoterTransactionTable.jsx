import React from 'react';
import { Tag, CheckCircle, Clock } from 'lucide-react';

export default function PromoterTransactionTable({ transactions = [] }) {
  if (transactions.length === 0) {
    return (
      <div className="bg-white border border-[#E5E2DE] rounded-sm p-8 text-center" id="promoter-empty-tx">
        <Tag className="w-12 h-12 text-[#A09E9B] mx-auto mb-3 opacity-60" />
        <h3 className="text-sm font-semibold text-[#1C1C1C]">No payouts conversions yet</h3>
        <p className="text-xs text-[#706E6B] mt-1 max-w-sm mx-auto">
          Share your referral links with audiences. Once ticket sales come through your code, they will be instantly listed here!
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-[#E5E2DE] rounded-sm overflow-hidden shadow-none" id="promoter-conversions-table">
      <div className="p-4 border-b border-[#E5E2DE] bg-[#F7F5F2] flex items-center justify-between">
        <h3 className="text-xs font-bold uppercase tracking-widest text-[#1C1C1C]">Referral Sales Conversion Ledger ({transactions.length})</h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#E5E2DE] text-[#706E6B] text-[10px] font-bold uppercase tracking-wider bg-[#F7F5F2]/40">
              <th className="py-3 px-5">Order ID</th>
              <th className="py-3 px-5">Buyer Account</th>
              <th className="py-3 px-5">Ticket Item Detail</th>
              <th className="py-3 px-5 text-right font-mono">Discount Given</th>
              <th className="py-3 px-5 text-right font-mono">Commission Earned</th>
              <th className="py-3 px-5 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F0EEEB] text-xs text-[#4A4A4A]">
            {transactions.map((tx) => (
              <tr key={tx._id} className="hover:bg-[#F7F5F2]/45 transition-colors">
                {/* Order ID & Date */}
                <td className="py-3.5 px-5">
                  <div className="font-mono font-bold text-[#1C1C1C] mb-0.5">{tx.orderId}</div>
                  <div className="text-[10px] text-[#A09E9B] font-semibold">
                    {new Date(tx.transactionDate).toLocaleDateString()}
                  </div>
                  <span className="inline-block mt-1 text-[9px] font-bold bg-[#F7F5F2] border border-[#E5E2DE] text-[#1C1C1C] px-1.5 py-0.5 rounded-sm">
                    {tx.referralCode}
                  </span>
                </td>

                {/* Buyer identity */}
                <td className="py-3.5 px-5 whitespace-nowrap">
                  <div className="font-semibold text-[#1C1C1C] leading-tight mb-0.5">{tx.buyerName}</div>
                  <div className="text-[10px] text-[#706E6B] font-medium">{tx.buyerEmail}</div>
                  <div className="text-[10px] text-[#706E6B] font-medium">{tx.buyerPhone}</div>
                </td>

                {/* Tickets description */}
                <td className="py-3.5 px-5">
                  <div className="font-semibold text-[#1C1C1C] leading-tight mb-1">{tx.eventName}</div>
                  <div className="text-[10px] text-[#706E6B]">Qty: {tx.ticketQuantity} ticket(s)</div>
                </td>

                {/* Discount */}
                <td className="py-3.5 px-5 text-right font-bold text-[#A34E24] font-mono">
                  -${Number(tx.discountGiven || 0).toFixed(2)}
                </td>

                {/* Commission */}
                <td className="py-3.5 px-5 text-right font-bold text-[#2D5A27] font-mono">
                  +${Number(tx.promoterCommission || 0).toFixed(2)}
                </td>

                {/* Status indicator */}
                <td className="py-3.5 px-5 text-center whitespace-nowrap">
                  <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-0.5 rounded-sm border ${
                    tx.eventCompleted
                      ? 'bg-[#E5F2E1] text-[#2D5A27] border-[#2D5A27]/15'
                      : 'bg-[#FFF9E6] text-[#A34E24] border-[#A34E24]/15'
                  }`}>
                    {tx.eventCompleted ? (
                      <>
                        <CheckCircle className="w-3 h-3 text-[#2D5A27]" />
                        <span>Redeemable</span>
                      </>
                    ) : (
                      <>
                        <Clock className="w-3 h-3 text-[#A34E24] animate-pulse" />
                        <span>Pending</span>
                      </>
                    )}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
