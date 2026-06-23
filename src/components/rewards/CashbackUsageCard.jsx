import React, { useState } from 'react';
import { ToggleLeft, ToggleRight, CheckCircle2, AlertCircle, Sparkles, Tag, HelpCircle } from 'lucide-react';

export default function CashbackUsageCard({
  organiserName,
  walletBalance = 0,
  originalTotal = 0,
  onApplyCashbackState, // callback to notify parent (useCashback, amountToUse)
  isApplied = false
}) {
  const [useRewards, setUseRewards] = useState(isApplied);
  const maxDeductible = Math.min(walletBalance, originalTotal);

  const handleToggle = () => {
    const nextState = !useRewards;
    setUseRewards(nextState);
    if (onApplyCashbackState) {
      onApplyCashbackState(nextState, nextState ? maxDeductible : 0);
    }
  };

  // Skip rendering if no balance is available to use
  if (walletBalance <= 0) {
    return (
      <div className="bg-gray-50/50 border border-dashed border-gray-200 rounded-xl p-5 text-center">
        <p className="text-xs text-gray-400 font-medium font-mono">
          No previous reward credits available under {organiserName}
        </p>
        <p className="text-[10px] text-gray-400 mt-1">
          Complete this transaction to seed your active reward wallet for subsequent purchases.
        </p>
      </div>
    );
  }

  return (
    <div
      className={`border rounded-xl p-5 transition-all duration-350 ${
        useRewards
          ? 'bg-emerald-50/45 border-emerald-200/80 shadow-xs'
          : 'bg-white border-gray-100 shadow-xs'
      }`}
    >
      <div className="flex justify-between items-start gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded font-mono">
              Credit Suggestion
            </span>
            <span className="text-[10px] uppercase font-bold tracking-wider text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded font-mono">
              {organiserName}
            </span>
          </div>
          <h4 className="text-sm font-bold text-gray-800">
            Apply Loyalist Reward Cash
          </h4>
          <p className="text-xs text-gray-500">
            You hold an active balance of <strong className="text-emerald-600 font-bold">${Number(walletBalance).toFixed(2)}</strong> from previous events by this organizer.
          </p>
        </div>

        <button
          type="button"
          onClick={handleToggle}
          className="focus:outline-none shrink-0 transition-transform hover:scale-105"
        >
          {useRewards ? (
            <span className="flex items-center text-emerald-600 font-semibold text-xs gap-1">
              Applied <ToggleRight className="w-9 h-9 text-emerald-600 cursor-pointer" />
            </span>
          ) : (
            <span className="flex items-center text-gray-400 font-semibold text-xs gap-1">
              Disabled <ToggleLeft className="w-9 h-9 text-gray-400 cursor-pointer" />
            </span>
          )}
        </button>
      </div>

      {useRewards && (
        <div className="mt-4 border-t border-emerald-100/60 pt-3 space-y-3.5">
          <div className="flex justify-between items-center text-xs">
            <span className="text-gray-500 font-medium flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              Applied Reward Deductible
            </span>
            <span className="font-mono font-bold text-emerald-700">
              -${Number(maxDeductible).toFixed(2)}
            </span>
          </div>

          <div className="p-2.5 bg-emerald-50 rounded-lg text-[10.5px] text-emerald-800 flex items-start gap-2 border border-emerald-100/50">
            <Sparkles className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
            <span>
              Fantastic! We subtracted the maximum available credit of <strong>${Number(maxDeductible).toFixed(2)}</strong> of your {organiserName} wallet balance.
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
