import React from 'react';
import { Sparkles, Coins, HelpCircle, Ticket, Milestone, PiggyBank, CheckSquare } from 'lucide-react';

export default function PromoterStatsCards({ wallet = {} }) {
  const {
    totalEarnings = 0,
    pendingEarnings = 0,
    redeemableEarnings = 0,
    withdrawnEarnings = 0,
    ticketsSold = 0,
    referralRevenue = 0
  } = wallet;

  const cards = [
    {
      id: 'p-stat-redeemable',
      label: 'Redeemable Balance',
      value: `$${Number(redeemableEarnings).toFixed(2)}`,
      subtext: 'Available for instant withdrawal',
      icon: Coins,
      color: 'bg-white border-[#E5E2DE] text-[#1C1C1C]',
      iconBg: 'bg-[#E5F2E1] text-[#2D5A27] border border-[#2D5A27]/10'
    },
    {
      id: 'p-stat-pending',
      label: 'Pending Earnings',
      value: `$${Number(pendingEarnings).toFixed(2)}`,
      subtext: 'Awaiting event completion',
      icon: HelpCircle,
      color: 'bg-white border-[#E5E2DE] text-[#1C1C1C]',
      iconBg: 'bg-[#FFF9E6] text-[#A34E24] border border-[#A34E24]/10'
    },
    {
      id: 'p-stat-withdrawn',
      label: 'Withdrawn Earnings',
      value: `$${Number(withdrawnEarnings).toFixed(2)}`,
      subtext: 'Transferred to bank statement',
      icon: PiggyBank,
      color: 'bg-white border-[#E5E2DE] text-[#1C1C1C]',
      iconBg: 'bg-[#F7F5F2] text-[#1C1C1C] border border-[#E5E2DE]'
    },
    {
      id: 'p-stat-total',
      label: 'All-time Commissions',
      value: `$${Number(totalEarnings).toFixed(2)}`,
      subtext: 'Sum of all referral codes',
      icon: Sparkles,
      color: 'bg-white border-[#E5E2DE] text-[#1C1C1C]',
      iconBg: 'bg-[#F7F5F2] text-[#1C1C1C] border border-[#E5E2DE]'
    },
    {
      id: 'p-stat-tickets',
      label: 'Tickets Sold',
      value: ticketsSold.toString(),
      subtext: 'Through custom links',
      icon: Ticket,
      color: 'bg-white border-[#E5E2DE] text-[#1C1C1C]',
      iconBg: 'bg-[#F7F5F2] text-[#1C1C1C] border border-[#E5E2DE]'
    },
    {
      id: 'p-stat-revenue',
      label: 'Referral Ticket Sales',
      value: `$${Number(referralRevenue).toFixed(2)}`,
      subtext: 'Gross consumer paid yield',
      icon: Milestone,
      color: 'bg-white border-[#E5E2DE] text-[#1C1C1C]',
      iconBg: 'bg-[#F7F5F2] text-[#1C1C1C] border border-[#E5E2DE]'
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-6 gap-4" id="promoter-stats-panel">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.id}
            className={`border rounded-sm p-4 shadow-none flex flex-col justify-between transition-all hover:scale-[1.01] hover:border-[#1C1C1C] ${card.color}`}
          >
            <div className="flex items-start justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#706E6B] leading-snug">{card.label}</span>
              <div className={`p-1.5 rounded-sm shrink-0 flex items-center justify-center ${card.iconBg}`}>
                <Icon className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-lg md:text-xl font-mono font-bold text-[#1C1C1C] tracking-tight mb-0.5 leading-none">
                {card.value}
              </h3>
              <p className="text-[10px] text-[#A09E9B] font-medium leading-tight mt-1">{card.subtext}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
