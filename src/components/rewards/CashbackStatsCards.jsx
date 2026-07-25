import React from 'react';
import { Award, ArrowUpRight, TrendingUp, ShieldAlert, Sparkles } from 'lucide-react';

export default function CashbackStatsCards({ stats = {}, isLoading = false }) {
  const {
    totalDistributed = 0,
    totalRedeemed = 0,
    liability = 0
  } = stats;

  const cardItems = [
    {
      id: "stat-distributed",
      title: "Total Distributed",
      value: `$${Number(totalDistributed).toFixed(2)}`,
      description: "Total cashback incentives issued",
      icon: Award,
      iconBg: "bg-emerald-50 text-emerald-600 border border-emerald-100",
      accent: "emerald"
    },
    {
      id: "stat-redeemed",
      title: "Cashback Redeemed",
      value: `$${Number(totalRedeemed).toFixed(2)}`,
      description: "Utilized on future reservations",
      icon: TrendingUp,
      iconBg: "bg-amber-50 text-amber-600 border border-amber-100",
      accent: "amber"
    },
    {
      id: "stat-liability",
      title: "Cashback Liability",
      value: `$${Number(liability).toFixed(2)}`,
      description: "Active balance held in buyer wallets",
      icon: ShieldAlert,
      iconBg: "bg-rose-50 text-rose-600 border border-rose-100",
      accent: "rose"
    }
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((n) => (
          <div key={n} className="bg-white border border-gray-100 rounded-xl p-6 shadow-xs animate-pulse">
            <div className="flex justify-between items-start">
              <div className="space-y-3 w-2/3">
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-100 rounded w-full"></div>
              </div>
              <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {cardItems.map((card) => {
        const IconComponent = card.icon;
        return (
          <div
            key={card.id}
            id={card.id}
            className="relative bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden group"
          >
            {/* Left Accent Bar */}
            <div className="absolute left-0 top-0 h-full w-1.5 bg-[#2189ed]" />

            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <p className="text-sm font-medium text-slate-500">
                  {card.title}
                </p>

                <div className="flex items-end gap-2">
                  <h4 className="text-3xl font-bold text-slate-900 tracking-tight">
                    {card.value}
                  </h4>

                  <span className="text-xs text-slate-400 font-medium mb-1">
                    USD
                  </span>
                </div>

                <p className="text-xs text-slate-500 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#2189ed]" />
                  {card.description}
                </p>
              </div>

              <div className="w-12 h-12 rounded-xl bg-[#2189ed]/10 flex items-center justify-center transition-all duration-300 group-hover:bg-[#2189ed] group-hover:scale-105">
                <IconComponent className="w-5 h-5 text-[#2189ed] group-hover:text-white" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
