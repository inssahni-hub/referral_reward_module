import React from 'react';
import { CreditCard, Landmark, CheckCircle, Clock, Send, Sparkles, Coins } from 'lucide-react';

export default function PromoterWalletCard({ wallet = {}, onWithdrawClick }) {
  const redeemable = Number(wallet.redeemableEarnings || 0);
  const pending = Number(wallet.pendingEarnings || 0);

  return (
    <div className="bg-white border border-[#E5E2DE] p-6 flex flex-col md:flex-row items-stretch justify-between gap-6 rounded-sm shadow-none" id="promoter-wallet-banner">
      {/* Visual bank credit card look */}
      <div className="bg-[#1C1C1C] rounded-sm p-6 text-white md:w-96 flex flex-col justify-between relative overflow-hidden shrink-0 border border-[#1C1C1C]">
        <div className="absolute right-0 bottom-0 opacity-5 transform translate-x-12 translate-y-12 shrink-0">
          <CreditCard className="w-64 h-64" />
        </div>

        <div className="flex items-start justify-between">
          <div>
            <span className="text-[9px] text-[#A09E9B] font-bold tracking-widest border border-white/25 px-2.5 py-1 rounded-sm uppercase">
              Promoter Ledger
            </span>
            <div className="text-3xl font-serif italic text-white mt-3 font-semibold">
              ${redeemable.toFixed(2)}
            </div>
            <p className="text-[10px] text-[#A09E9B] mt-1 uppercase tracking-wider font-semibold">Available Redeemable Balance</p>
          </div>
          <Landmark className="w-6 h-6 text-[#A09E9B] opacity-80" />
        </div>

        <div className="mt-8 border-t border-white/20 pt-4 flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-white font-mono">${pending.toFixed(2)}</div>
            <span className="text-[9px] text-[#A09E9B] uppercase tracking-wider font-semibold">Locked Pending Events</span>
          </div>
          <button
            type="button"
            onClick={onWithdrawClick}
            disabled={redeemable <= 0}
            className="bg-[#2D5A27] hover:bg-[#346a2e] disabled:opacity-40 disabled:hover:bg-[#2D5A27] text-white font-bold text-[10px] uppercase tracking-wider py-2.5 px-4 rounded-sm cursor-pointer transition-colors flex items-center gap-1.5 shrink-0"
          >
            <Send className="w-3.5 h-3.5" /> Request Transfer
          </button>
        </div>
      </div>

      {/* Guide lines and bank statement tips */}
      <div className="flex-1 flex flex-col justify-between">
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-widest text-[#1C1C1C] flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-[#1C1C1C]" /> Withdrawal Settlement Terms
          </h3>
          <ul className="text-xs text-[#706E6B] space-y-2 list-none">
            <li className="flex items-start gap-1.5 leading-relaxed">
              <span className="text-[#2D5A27] mt-0.5 font-bold">✓</span>
              <span>Commissions are securely logged immediately upon buyer checkout, appearing as <strong>Pending Earnings</strong>.</span>
            </li>
            <li className="flex items-start gap-1.5 leading-relaxed">
              <span className="text-[#2D5A27] mt-0.5 font-bold">✓</span>
              <span>Pending amounts automatically convert into <strong>Redeemable Balance</strong> the instant an event completes.</span>
            </li>
            <li className="flex items-start gap-1.5 leading-relaxed">
              <span className="text-[#2D5A27] mt-0.5 font-bold">✓</span>
              <span>Reallocated balances can be drawn down to verified routing routing banks starting from a <strong>$1.00</strong> floor.</span>
            </li>
          </ul>
        </div>

        <div className="mt-4 p-3 bg-[#F7F5F2] rounded-sm border border-[#E5E2DE] flex items-center gap-2.5 text-xs text-[#706E6B]">
          <Coins className="w-4 h-4 text-[#1C1C1C] shrink-0" />
          <span>Need to update payout instructions? Simply input your verified account information during any checkout withdrawal step.</span>
        </div>
      </div>
    </div>
  );
}
