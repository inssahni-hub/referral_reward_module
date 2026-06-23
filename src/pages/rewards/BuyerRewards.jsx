import React, { useEffect, useState } from 'react';
import axiosReq from "@/request/axiosReq";
import { Wallet, ShieldCheck, Milestone, ShoppingBag, Landmark, ArrowRight, ArrowDownLeft, Info, HelpCircle } from 'lucide-react';
import CashbackWalletCard from '../../components/rewards/CashbackWalletCard.jsx';
import CashbackHistoryTable from '../../components/rewards/CashbackHistoryTable.jsx';

export default function BuyerRewards({ buyerId = '69e82921e2f94bbebbe37f3c' }) {
  const [data, setData] = useState({ wallets: [], transactions: [], summary: { totalAvailable: 0, totalUsed: 0, totalExpired: 0 } });
  const [isLoading, setIsLoading] = useState(true);
  const [errorText, setErrorText] = useState(null);

  const fetchRewards = async () => {
    try {
      setIsLoading(true);
      setErrorText(null);

      const { data: response } = await axiosReq.get(
        "/api/cashback/rewards",
        {
          params: { buyerId },
        }
      );

      setData(response?.data || {
        wallets: [],
        transactions: [],
        summary: {
          totalAvailable: 0,
          totalUsed: 0,
          totalExpired: 0,
        },
      });

    } catch (err) {
      console.error("Rewards Error:", err);

      setErrorText(
        err?.response?.data?.message ||
        "Failed to load rewards data"
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRewards();
  }, [buyerId]);

  const { wallets = [], transactions = [], summary } = data;

  return (
    <div className="space-y-6">
      {/* Introduction Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white border border-gray-100 rounded-xl p-6 shadow-xs">
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
            <Landmark className="w-5 h-5 text-emerald-600" /> My Loyalist Reward Wallet
          </h2>
          <p className="text-xs text-gray-400">
            Track and check your organiser-segregated cashback balances and redemption logs.
          </p>
        </div>
        <div className="text-xs text-gray-500 bg-gray-50 border border-gray-200 py-1.5 px-3 rounded-lg font-medium select-none flex items-center gap-2">
          <span>Active Account:</span>
          <span className="font-mono font-bold text-emerald-700">{buyerId}</span>
        </div>
      </div>

      {errorText && (
        <div className="p-4 bg-rose-50 text-rose-800 text-xs rounded-xl border border-rose-100 font-mono">
          Error: {errorText}
        </div>
      )}

      {/* Aggregate Header Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-emerald-600 to-emerald-700 text-white rounded-xl p-5 shadow-xs relative overflow-hidden group">
          <div className="absolute right-0 bottom-0 translate-x-2 translate-y-2 opacity-15 pointer-events-none">
            <Wallet className="w-28 h-28" />
          </div>
          <p className="text-xs text-emerald-100/90 font-semibold uppercase tracking-wider">Active Wallet Balance</p>
          <div className="flex items-baseline gap-1 mt-1.5">
            <span className="text-3xl font-extrabold tracking-tight">${Number(summary?.totalAvailable || 0).toFixed(2)}</span>
            <span className="text-xs text-emerald-200/90 font-mono">USD</span>
          </div>
          <p className="text-[10px] text-emerald-100/80 mt-2 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" /> Combined active credit across all promoters
          </p>
        </div>

        <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-xs relative overflow-hidden group">
          <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Total Cashback Used</p>
          <div className="flex items-baseline gap-1 mt-1.5">
            <span className="text-3xl font-extrabold text-gray-900 tracking-tight">${Number(summary?.totalUsed || 0).toFixed(2)}</span>
            <span className="text-xs text-gray-400 font-mono">USD</span>
          </div>
          <p className="text-[10px] text-gray-400 mt-2 flex items-center gap-1">
            <Milestone className="w-3.5 h-3.5 text-amber-500" /> Life savings redeemed on repeat orders
          </p>
        </div>

        <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-xs relative overflow-hidden group">
          <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Expired Credits</p>
          <div className="flex items-baseline gap-1 mt-1.5">
            <span className="text-3xl font-extrabold text-gray-500 tracking-tight">${Number(summary?.totalExpired || 0).toFixed(2)}</span>
            <span className="text-xs text-gray-400 font-mono">USD</span>
          </div>
          <p className="text-[10px] text-gray-400 mt-2 flex items-center gap-1">
            <Info className="w-3.5 h-3.5 text-gray-400" /> Expired portions due to campaign validity limits
          </p>
        </div>
      </div>

      {/* Organizer Wallets Grid */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="font-bold text-gray-800 text-sm flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-emerald-600" /> Organiser-Wise Wallets
          </h3>
          <span className="text-xs text-gray-400">Cashback cannot be merged or shared</span>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
            {[1, 2].map(n => (
              <div key={n} className="bg-gray-100 h-36 rounded-xl border border-gray-200"></div>
            ))}
          </div>
        ) : wallets.length === 0 ? (
          <div className="bg-gray-50 border border-dashed border-gray-200 rounded-xl p-8 text-center">
            <p className="text-xs text-gray-400 font-medium">No Organiser Wallets Configured</p>
            <p className="text-[10px] text-gray-400 mt-0.5">Purchasing from ticket centers will automatically spawn your wallets.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wallets.map(wallet => (
              <CashbackWalletCard key={wallet._id} wallet={wallet} />
            ))}
          </div>
        )}
      </div>

      {/* Transaction History Section */}
      <div className="space-y-4">
        <CashbackHistoryTable transactions={transactions} isLoading={isLoading} />
      </div>
    </div>
  );
}
