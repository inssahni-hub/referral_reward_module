import React from 'react';
import { Ticket, DollarSign, Tag, Gift, BadgeAlert, Coins } from 'lucide-react';

export default function ReferralStatsCards({ stats = {} }) {
  const {
    ticketsSold = 0,
    revenueGenerated = 0,
    discountsGiven = 0,
    promoterCommissions = 0,
    organiserNetRevenue = 0,
    totalOrders = 0
  } = stats;

  const cardItems = [
    {
      id: 'stat-tickets',
      label: 'Tickets Sold',
      value: ticketsSold.toString(),
      subtext: `${totalOrders} conversion order${totalOrders !== 1 ? 's' : ''}`,
      icon: Ticket,
      className: 'bg-white border-[#E5E2DE]',
      iconClass: 'bg-[#F7F5F2] text-[#1C1C1C]'
    },
    {
      id: 'stat-revenue',
      label: 'Revenue Generated',
      value: `$${Number(revenueGenerated).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      subtext: 'Gross buyers investment',
      icon: DollarSign,
      className: 'bg-white border-[#E5E2DE]',
      iconClass: 'bg-[#F7F5F2] text-[#1C1C1C]'
    },
    {
      id: 'stat-discounts',
      label: 'Discounts Given',
      value: `$${Number(discountsGiven).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      subtext: 'Saved value for buyers',
      icon: Tag,
      className: 'bg-white border-[#E5E2DE]',
      iconClass: 'bg-[#F7F5F2] text-[#1C1C1C]'
    },
    {
      id: 'stat-commissions',
      label: 'Promoter Commissions',
      value: `$${Number(promoterCommissions).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      subtext: 'Pending & redeemable reward',
      icon: Coins,
      className: 'bg-white border-[#E5E2DE]',
      iconClass: 'bg-[#F7F5F2] text-[#1C1C1C]'
    },
    {
      id: 'stat-net',
      label: 'Organiser Net Revenue',
      value: `$${Number(organiserNetRevenue).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      subtext: 'Ticket margin profit yield',
      icon: Gift,
      className: 'bg-white border-[#E5E2DE]',
      iconClass: 'bg-[#F7F5F2] text-[#1C1C1C]'
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4" id="referrals-stat-container">
      {cardItems.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.id}
            className={`rounded-sm border p-4 shadow-none flex flex-col justify-between transition-all hover:scale-[1.01] hover:border-[#1C1C1C] ${card.className}`}
          >
            <div className="flex items-start justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#706E6B]">{card.label}</span>
              <div className={`p-1.5 rounded-sm shrink-0 ${card.iconClass}`}>
                <Icon className="w-3.5 h-3.5" />
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-lg md:text-xl font-bold font-mono text-[#1C1C1C] tracking-tight leading-none mb-1">
                {card.value}
              </h3>
              <p className="text-[10px] text-[#A09E9B] font-medium">{card.subtext}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
