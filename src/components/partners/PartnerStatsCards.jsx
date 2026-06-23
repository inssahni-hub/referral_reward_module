import React from 'react';
import { DollarSign, Eye, ShieldAlert, Award, Calendar, Ticket } from 'lucide-react';

export default function PartnerStatsCards({ stats = {} }) {
  const formatVal = (val) => {
    const v = Number(val);
    return isNaN(v) ? '$0.00' : `$${v.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const cards = [
    {
      id: "stat_total_earn",
      title: "Total Revenue Share",
      value: formatVal(stats.totalEarnings),
      subtext: "Accumulated partner share",
      icon: DollarSign,
      color: "from-emerald-500/10 to-teal-500/10 text-emerald-600 border-emerald-500/20",
    },
    {
      id: "stat_pending_earn",
      title: "Pending Balance",
      value: formatVal(stats.pendingEarnings),
      subtext: "Held until event dates complete",
      icon: ShieldAlert,
      color: "from-amber-500/10 to-orange-500/10 text-amber-600 border-amber-500/20",
    },
    {
      id: "stat_redeemable_earn",
      title: "Redeemable Balance",
      value: formatVal(stats.redeemableEarnings - stats.withdrawnAmount),
      subtext: "Available for instant payout",
      icon: Award,
      color: "from-blue-500/10 to-blue-600/10 text-blue-600 border-blue-500/20",
    },
    {
      id: "stat_booking_fees",
      title: "Booking Fees Generated",
      value: formatVal(stats.totalBookingFeesGenerated),
      subtext: "Total platform processing fee",
      icon: Eye,
      color: "from-sky-500/10 to-cyan-500/10 text-sky-600 border-sky-500/20",
    },
    {
      id: "stat_events",
      title: "Co-Hosted Events",
      value: stats.totalEvents || 0,
      subtext: "Assigned partner campaigns",
      icon: Calendar,
      color: "from-pink-500/10 to-rose-500/10 text-pink-600 border-rose-500/20",
      isMoney: false,
    },
    
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
      {cards.map((card) => {
        const IconComponent = card.icon;
        return (
          <div
            id={card.id}
            key={card.id}
            className="group relative bg-white/70 backdrop-blur-md rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-300 flex flex-col justify-between overflow-hidden"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-400 tracking-wide uppercase">
                  {card.title}
                </p>
                <h3 className="text-2xl font-bold font-sans text-slate-800 mt-2 tracking-tight">
                  {card.isMoney === false ? card.value : card.value}
                </h3>
              </div>
              <div className={`p-2.5 rounded-xl border bg-gradient-to-br ${card.color}`}>
                <IconComponent className="w-5 h-5" />
              </div>
            </div>
            
            <div className="mt-4 flex items-center justify-between text-xs text-slate-500 border-t border-slate-50/50 pt-3">
              <span className="font-medium text-slate-500 truncate">{card.subtext}</span>
            </div>
            
            <div className="absolute top-0 right-0 w-32 h-32 bg-slate-100/30 rounded-full blur-2xl group-hover:bg-slate-200/50 transition-all duration-500 pointer-events-none translate-x-12 -translate-y-12"></div>
          </div>
        );
      })}
    </div>
  );
}
