import React from 'react';
import { Sparkles, ArrowRight, Percent, DollarSign, Info } from 'lucide-react';

export default function CashbackRewardBanner({ program }) {
  if (!program || !program.enabled) return null;

  const {
    cashbackType = 'percentage',
    value = 0,
    minPurchase = 0,
    maxCashback = null,
    expiryDate = null
  } = program;

  const isExpired = expiryDate && new Date(expiryDate) < new Date();
  if (isExpired) return null;

  // Format terms text
  const label = cashbackType === 'percentage' ? `${value}%` : `$${value}`;
  const conditionTerms = minPurchase > 0 ? `orders over $${minPurchase}` : 'all purchases';
  const limitTerm = maxCashback ? `capped at $${maxCashback} max` : '';

  return (
    <div className="bg-emerald-600 text-white rounded-xl p-5 shadow-xs relative overflow-hidden group">
      {/* Dynamic decorative backdrop shapes */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full translate-x-12 -translate-y-12 rotate-45 transform pointer-events-none transition-transform group-hover:scale-110 duration-500" />
      <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-emerald-500 rounded-full opacity-30 transform pointer-events-none" />

      <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="bg-white/15 p-2.5 rounded-xl text-white shrink-0 mt-0.5 sm:mt-0">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>

          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[10px] uppercase font-bold bg-white/20 px-2 py-0.5 rounded tracking-wide font-mono">
                Exclusive Incentive
              </span>
              {limitTerm && (
                <span className="text-[10px] uppercase font-bold bg-emerald-700/60 px-2 py-0.5 rounded tracking-wide font-mono">
                  {limitTerm}
                </span>
              )}
            </div>
            <h4 className="text-base font-bold tracking-tight">
              Earn {label} Cashback Rewards Back!
            </h4>
            <p className="text-xs text-emerald-100/90 font-medium">
              We credit your loyalty wallet with {label} refund value on {conditionTerms} for future tickets.
            </p>
          </div>
        </div>

        <div className="shrink-0 bg-white text-emerald-700 font-bold text-xs py-2 px-3.5 rounded-lg shadow-sm flex items-center gap-1 hover:bg-emerald-50 transition-colors uppercase cursor-pointer select-none">
          Eligible Program
          <ArrowRight className="w-3.5 h-3.5" />
        </div>
      </div>
    </div>
  );
}
