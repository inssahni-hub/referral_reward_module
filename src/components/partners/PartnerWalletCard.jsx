import React, { useState } from 'react';
import { CreditCard, ArrowDownRight, RefreshCw, ShoppingCart, HelpCircle } from 'lucide-react';

export default function PartnerWalletCard({
  wallet = {},
  onOpenWithdraw,
  onPurchaseTickets,
  isLoading = false,
  events = []
}) {
  const [selectedEvent, setSelectedEvent] = useState('');
  const [ticketCount, setTicketCount] = useState(1);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [purchaseErr, setPurchaseErr] = useState('');
  const [purchaseSuccess, setPurchaseSuccess] = useState('');

  const total = Number(wallet.totalEarnings || 0);
  const pending = Number(wallet.pendingEarnings || 0);
  const redeemable = Number(wallet.redeemableEarnings || 0);
  const withdrawn = Number(wallet.withdrawnAmount || 0);
  const available = Math.max(0, redeemable - withdrawn);

  const TICKET_PRICE = 45.00; // Mock face value per ticket
  const totalAmount = ticketCount * TICKET_PRICE;

  const handleTicketPurchaseCommit = async (e) => {
    e.preventDefault();
    setPurchaseErr('');
    setPurchaseSuccess('');

    if (!selectedEvent) {
      setPurchaseErr('Please select an event for ticket allocation.');
      return;
    }

    if (totalAmount > available) {
      setPurchaseErr(`Insufficient available balance ($${available.toFixed(2)}) to purchase ${ticketCount} ticket(s) costing $${totalAmount.toFixed(2)}.`);
      return;
    }

    setIsPurchasing(true);
    try {
      await onPurchaseTickets({
        eventName: selectedEvent,
        ticketCount,
        totalAmount
      });
      setPurchaseSuccess(`Successfully purchased ${ticketCount} ticket(s) for '${selectedEvent}'! $${totalAmount.toFixed(2)} has been deducted from your redeemable wallet.`);
      setTicketCount(1);
    } catch (err) {
      setPurchaseErr(err.message || 'Ticket purchase transaction failed.');
    } finally {
      setIsPurchasing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-slate-100 rounded-3xl h-60 w-full animate-pulse border border-slate-200"></div>
    );
  }

  return (
    <div id="wallet_card_root" className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Interactive Main Pass Balance Card */}
      <div className="lg:col-span-2 bg-gradient-to-br from-[#2189ed] via-[#1c75cb] to-[#155fa8] rounded-3xl p-6 text-white border border-[#1c75cb] shadow-xl relative overflow-hidden flex flex-col justify-between">
        {/* Background Decorations */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl -translate-y-1/3 translate-x-1/3 pointer-events-none"></div>

        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3 pointer-events-none"></div>

        {/* Header */}
        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/15 rounded-xl backdrop-blur-md">
              <CreditCard className="w-5 h-5 text-white" />
            </div>

            <span className="text-sm font-semibold text-blue-100 tracking-wide uppercase">
              Partner Ledger Card
            </span>
          </div>

          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 border border-white/20 text-xs font-semibold text-white backdrop-blur">
            ✓ Connected
          </span>
        </div>

        {/* Available Balance */}
        <div className="my-8 relative z-10">
          <p className="text-xs text-blue-100 font-semibold tracking-widest uppercase">
            Redeemable Balance
          </p>

          <div className="flex items-end gap-2 mt-2">
            <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight">
              $
              {available.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </h2>

            <span className="text-blue-100 text-sm font-medium mb-1">
              USD
            </span>
          </div>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-3 gap-4 border-t border-white/20 pt-5 relative z-10">
          <div>
            <p className="text-[11px] uppercase tracking-wider text-blue-100 font-semibold">
              Total Earnings
            </p>

            <p className="text-lg font-bold mt-1">
              ${total.toFixed(2)}
            </p>
          </div>

          <div className="border-l border-white/20 pl-4">
            <p className="text-[11px] uppercase tracking-wider text-blue-100 font-semibold">
              Pending
            </p>

            <p className="text-lg font-bold mt-1">
              ${pending.toFixed(2)}
            </p>
          </div>

          <div className="border-l border-white/20 pl-4">
            <p className="text-[11px] uppercase tracking-wider text-blue-100 font-semibold">
              Withdrawn
            </p>

            <p className="text-lg font-bold mt-1">
              ${withdrawn.toFixed(2)}
            </p>
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-6 pt-2 relative z-10">
          <button
            id="btn_request_payout"
            onClick={onOpenWithdraw}
            disabled={available <= 0}
            className="
                w-full
                inline-flex
                items-center
                justify-center
                gap-2
                px-5
                py-3
                rounded-xl
                bg-white
                text-[#2189ed]
                font-semibold
                text-sm
                shadow-lg
                hover:bg-blue-50
                hover:shadow-xl
                active:scale-[0.98]
                transition-all
                disabled:bg-white/10
                disabled:text-white/40
                disabled:border
                disabled:border-white/10
                disabled:cursor-not-allowed
              "
          >
            <ArrowDownRight className="w-4 h-4" />
            <span>Withdraw Redeemable Balance</span>
          </button>
        </div>
      </div>

      {/* Box: Ticket Purchase Using Balance */}
      <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm flex flex-col justify-between hidden">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="p-2 bg-slate-100 rounded-lg text-slate-700">
              <ShoppingCart className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-slate-800 text-base">Utilize Wallet for Tickets</h3>
          </div>
          <p className="text-xs text-slate-500 mb-4 leading-relaxed">
            Co-hosts can purchase promotional, VIP or standard entries for any live event instantly using their available redeemable balance.
          </p>

          <form onSubmit={handleTicketPurchaseCommit} className="space-y-3.5">
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Select Active Event</label>
              <select
                id="select_purchase_event"
                value={selectedEvent}
                onChange={(e) => setSelectedEvent(e.target.value)}
                className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-550"
              >
                <option value="">-- Choose Campaign event --</option>
                {events.map(e => (
                  <option key={e.eventId || e._id} value={e.eventName}>{e.eventName}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Ticket Count</label>
                <input
                  id="input_ticket_count"
                  type="number"
                  min="1"
                  max="10"
                  value={ticketCount}
                  onChange={(e) => setTicketCount(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full text-xs px-3 py-2 border border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-550 font-mono"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Deduction Cost</label>
                <div className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 font-mono">
                  ${totalAmount.toFixed(2)}
                </div>
              </div>
            </div>

            {purchaseErr && (
              <div className="p-2.5 rounded-lg text-xs bg-rose-50 text-rose-600 border border-rose-100 font-medium">
                {purchaseErr}
              </div>
            )}

            {purchaseSuccess && (
              <div className="p-2.5 rounded-lg text-xs bg-emerald-50 text-emerald-700 border border-emerald-100 font-medium">
                {purchaseSuccess}
              </div>
            )}

            <button
              id="btn_purchase_tickets"
              type="submit"
              disabled={isPurchasing || !selectedEvent || available < totalAmount}
              className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 hover:border-slate-300 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors disabled:bg-slate-100 disabled:text-slate-400 disabled:border-slate-200 disabled:cursor-not-allowed"
            >
              {isPurchasing ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <ShoppingCart className="w-3.5 h-3.5" />
                  <span>Purchase with Wallet Cash</span>
                </>
              )}
            </button>
          </form>
        </div>

        <div className="mt-4 flex items-center gap-1.5 text-[10px] text-slate-400">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Face value rate is standard flat: $45.00 / ticket</span>
        </div>
      </div>
    </div>
  );
}
