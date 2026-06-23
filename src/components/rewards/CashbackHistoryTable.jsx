import React from 'react';
import { Calendar, Receipt, Gift, ArrowDownLeft, ArrowUpRight, Ban } from 'lucide-react';

export default function CashbackHistoryTable({ transactions = [], isLoading = false }) {
  if (isLoading) {
    return (
      <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-xs space-y-4 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
        <div className="space-y-2">
          {[1, 2, 3, 4].map(n => (
            <div key={n} className="h-12 bg-gray-100 rounded w-full"></div>
          ))}
        </div>
      </div>
    );
  }

  if (!transactions || transactions.length === 0) {
    return (
      <div className="bg-white border border-gray-100 rounded-xl p-8 text-center">
        <div className="mx-auto w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center border border-gray-100 text-gray-400 mb-3">
          <Receipt className="w-5 h-5 text-gray-300" />
        </div>
        <h4 className="text-gray-700 font-medium text-sm">No Transactions Yet</h4>
        <p className="text-xs text-gray-400 mt-1 max-w-md mx-auto">
          Begin buying tickets to accumulate cashback and view itemized reward history!
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-xs overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-50 bg-gray-50/40 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
          <Gift className="w-4 h-4 text-emerald-600" /> Reward Flow Statement
        </h3>
        <span className="text-xs font-medium text-gray-500 font-mono">
          {transactions.length} entries
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/20 text-[10.5px] font-bold text-gray-400 uppercase tracking-wider">
              <th className="py-3.5 px-5">Date</th>
              <th className="py-3.5 px-5">Organiser & Associated Event</th>
              <th className="py-3.5 px-5 col-span-1">Order #</th>
              <th className="py-3.5 px-5">Transaction Type</th>
              <th className="py-3.5 px-5 text-right">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 text-sm">
            {transactions.map((tx) => {
              const {
                _id,
                organiserName,
                eventTitle,
                orderId,
                type,
                amount,
                createdAt,
                expiryDate,
                status
              } = tx;

              // Design badges based on type
              let typeBadge = null;
              let amountColor = "text-gray-900";
              let amountPrefix = "";
              let rowStyle = "";

              switch (type) {
                case 'earn':
                  typeBadge = (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                      <ArrowDownLeft className="w-3 h-3" /> Earned
                    </span>
                  );
                  amountColor = status === 'void' ? 'text-gray-400 line-through' : 'text-emerald-600 font-bold';
                  amountPrefix = "+";
                  rowStyle = status === 'void' ? 'bg-gray-50/30' : '';
                  break;
                case 'redeem':
                  typeBadge = (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100">
                      <ArrowUpRight className="w-3 h-3" /> Redeemed
                    </span>
                  );
                  amountColor = "text-amber-600 font-semibold";
                  amountPrefix = "-";
                  break;
                case 'expire':
                  typeBadge = (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-100">
                      <Ban className="w-3 h-3" /> Expired
                    </span>
                  );
                  amountColor = "text-rose-600 font-semibold";
                  amountPrefix = "-";
                  break;
                default:
                  typeBadge = (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-gray-700 bg-gray-50 px-2.5 py-0.5 rounded-full">
                      Refunded
                    </span>
                  );
                  amountColor = "text-gray-500";
                  amountPrefix = "";
              }

              return (
                <tr key={_id} className={`hover:bg-gray-50/50 transition-colors ${rowStyle}`}>
                  {/* Date column */}
                  <td className="py-4 px-5 text-xs text-gray-500 whitespace-nowrap min-w-[100px]">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-gray-400" />
                      {new Date(createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </div>
                  </td>

                  {/* Organizer & Event Title column */}
                  <td className="py-4 px-5 max-w-[280px]">
                    <div className="space-y-0.5">
                      <p className="font-semibold text-gray-800 line-clamp-1">{organiserName}</p>
                      <p className="text-xs text-gray-400 line-clamp-1 italic">{eventTitle}</p>
                    </div>
                  </td>

                  {/* Order Reference lookup */}
                  <td className="py-4 px-5 text-xs font-mono text-gray-400 font-bold whitespace-nowrap">
                    {orderId || 'N/A'}
                  </td>

                  {/* Transaction status badge */}
                  <td className="py-4 px-5 whitespace-nowrap">
                    {typeBadge}
                    {status === 'void' && (
                      <span className="ml-1.5 text-[10px] font-bold text-rose-600 bg-rose-50/60 border border-rose-100 px-1.5 py-0.5 rounded">
                        VOIDED
                      </span>
                    )}
                  </td>

                  {/* Final amount math values */}
                  <td className="py-4 px-5 text-right whitespace-nowrap">
                    <div className="space-y-0.5">
                      <span className={`font-mono text-xs ${amountColor}`}>
                        {amountPrefix}${Number(amount).toFixed(2)}
                      </span>
                      {type === 'earn' && expiryDate && status === 'completed' && (
                        <p className="text-[10px] text-gray-400">
                          Expires: {new Date(expiryDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </p>
                      )}
                    </div>
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
