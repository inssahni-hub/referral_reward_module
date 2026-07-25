import React from 'react';
import { CreditCard, Landmark, CheckCircle, Clock, Send, Sparkles, Coins } from 'lucide-react';

export default function PromoterWalletCard({ wallet = {}, onWithdrawClick }) {
  const redeemable = Number(wallet.redeemableEarnings || 0);
  const pending = Number(wallet.pendingEarnings || 0);

 return (
  <div
    className="bg-white border rounded-xl shadow-sm p-6 flex flex-col lg:flex-row items-stretch gap-6"
    id="promoter-wallet-banner"
  >
    {/* Wallet Card */}
    <div className="relative overflow-hidden bg-gradient-to-br from-[#2189ed] to-[#1b76cf] rounded-xl p-6 text-white lg:w-[380px] flex flex-col justify-between shrink-0 shadow-md">
      <div className="absolute right-0 bottom-0 opacity-10 translate-x-10 translate-y-10 pointer-events-none">
        <CreditCard className="w-64 h-64" />
      </div>

      <div className="flex items-start justify-between relative z-10">
        <div>
          <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/15 border border-white/20 text-[10px] uppercase tracking-widest font-semibold">
            Promoter Wallet
          </span>

          <h2 className="mt-4 text-4xl font-bold tracking-tight">
            ${redeemable.toFixed(2)}
          </h2>

          <p className="mt-2 text-sm text-blue-100">
            Available Redeemable Balance
          </p>
        </div>

        <Landmark className="w-7 h-7 text-white/80" />
      </div>

      <div className="relative z-10 mt-8 pt-5 border-t border-white/20 flex items-center justify-between">
        <div>
          <p className="text-xl font-semibold">
            ${pending.toFixed(2)}
          </p>

          <span className="text-xs text-blue-100">
            Pending Earnings
          </span>
        </div>

        <button
          type="button"
          onClick={onWithdrawClick}
          disabled={redeemable <= 0}
          className="flex items-center gap-2 px-4 py-2.5 bg-white text-[#2189ed] rounded-lg font-semibold text-sm hover:bg-blue-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          <Send className="w-4 h-4" />
          Request Transfer
        </button>
      </div>
    </div>

    {/* Information Section */}
    <div className="flex-1 flex flex-col justify-between">
      <div>
        <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-5">
          <Sparkles className="w-5 h-5 text-[#2189ed]" />
          Withdrawal Settlement Terms
        </h3>

        <ul className="space-y-4 text-sm text-gray-600">
          <li className="flex items-start gap-3">
            <span className="w-6 h-6 rounded-full bg-[#2189ed]/10 text-[#2189ed] flex items-center justify-center font-bold shrink-0">
              ✓
            </span>

            <span>
              Commissions are securely logged immediately after a successful
              buyer checkout and appear as{" "}
              <strong className="text-gray-900">
                Pending Earnings
              </strong>
              .
            </span>
          </li>

          <li className="flex items-start gap-3">
            <span className="w-6 h-6 rounded-full bg-[#2189ed]/10 text-[#2189ed] flex items-center justify-center font-bold shrink-0">
              ✓
            </span>

            <span>
              Pending earnings automatically become{" "}
              <strong className="text-gray-900">
                Redeemable Balance
              </strong>{" "}
              after the associated event has been successfully completed.
            </span>
          </li>

          <li className="flex items-start gap-3">
            <span className="w-6 h-6 rounded-full bg-[#2189ed]/10 text-[#2189ed] flex items-center justify-center font-bold shrink-0">
              ✓
            </span>

            <span>
              Withdrawals are available once your redeemable balance reaches a
              minimum of <strong className="text-gray-900">$1.00</strong> and
              can be transferred to your verified bank account.
            </span>
          </li>
        </ul>
      </div>

      <div className="mt-6 bg-[#2189ed]/5 border border-[#2189ed]/10 rounded-xl p-4 flex items-start gap-3">
        <Coins className="w-5 h-5 text-[#2189ed] shrink-0 mt-0.5" />

        <div>
          <p className="text-sm font-medium text-gray-900">
            Need to update your payout details?
          </p>

          <p className="text-sm text-gray-600 mt-1">
            You can securely provide or update your verified bank account
            information whenever you submit a withdrawal request.
          </p>
        </div>
      </div>
    </div>
  </div>
);
}
