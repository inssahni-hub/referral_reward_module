import React from 'react';
import { Wallet, Info, Tag, ArrowUpRight } from 'lucide-react';

export default function CashbackWalletCard({ wallet }) {
  const {
    organiserName = "Organiser",
    balance = 0,
    usedAmount = 0,
    expiredAmount = 0
  } = wallet;

  return (
    <div
      id={`wallet-${organiserName.replace(/\s+/g, '-').toLowerCase()}`}
      className="bg-white border border-gray-100 rounded-xl p-6 shadow-xs hover:shadow-md transition-all duration-300 relative group overflow-hidden"
    >
      {/* Visual background splash */}
      <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-emerald-50 rounded-full opacity-45 group-hover:scale-110 transition-transform duration-500" />

      <div className="relative space-y-4">
        {/* Header containing Organizer name */}
        <div className="flex justify-between items-start gap-3">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded uppercase tracking-wider font-mono">
              Organiser Wallet
            </span>
            <h3 className="font-semibold text-gray-800 line-clamp-1 group-hover:text-emerald-700 transition-colors">
              {organiserName}
            </h3>
          </div>
          <div className="p-2 border border-gray-100 rounded-lg bg-gray-50 text-gray-500">
            <Wallet className="w-5 h-5 text-emerald-600" />
          </div>
        </div>

        {/* Central Wallet Balance value */}
        <div className="border-t border-b border-gray-50 py-3.5 flex justify-between items-center">
          <div>
            <p className="text-xs text-gray-400 font-medium">Available Balance</p>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-3xl font-extrabold text-gray-900 leading-none">
                ${Number(balance).toFixed(2)}
              </span>
              <span className="text-xs font-mono text-gray-400">USD</span>
            </div>
          </div>
          <div className="flex flex-col items-end text-right">
            <span className="text-[10px] text-gray-400 font-medium">Accumulated Rewards</span>
            <span className="text-xs font-mono font-semibold text-emerald-600">
              +${Number(Number(balance) + Number(usedAmount)).toFixed(2)}
            </span>
          </div>
        </div>

        {/* Breakdown of Used and Expired Amounts */}
        <div className="grid grid-cols-2 gap-3 pt-1">
          <div className="bg-gray-50/60 p-2.5 rounded-lg border border-gray-100">
            <p className="text-[10px] text-gray-400 font-medium">Redeemed</p>
            <p className="text-sm font-semibold text-gray-700 font-mono mt-0.5">
              ${Number(usedAmount).toFixed(2)}
            </p>
          </div>
          <div className="bg-gray-50/60 p-2.5 rounded-lg border border-gray-100">
            <p className="text-[10px] text-gray-400 font-medium">Expired</p>
            <p className="text-sm font-semibold text-gray-600 font-mono mt-0.5">
              ${Number(expiredAmount).toFixed(2)}
            </p>
          </div>
        </div>

        {/* Dynamic constraint badge */}
        <div className="text-[10.5px] text-amber-600 bg-amber-50/55 rounded-lg p-2 flex items-start gap-1.5 border border-amber-100/50">
          <Info className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
          <span>
            Redeemable <strong>only</strong> for upcoming events published by <strong>{organiserName}</strong>.
          </span>
        </div>
      </div>
    </div>
  );
}
