import React, { useState, useEffect } from 'react';
import axios from "@/request/axiosReq";
import PartnerWalletCard from '../../components/partners/PartnerWalletCard.jsx';
import PartnerWithdrawModal from '../../components/partners/PartnerWithdrawModal.jsx';
import PartnerTransactionTable from '../../components/partners/PartnerTransactionTable.jsx';
import { ArrowLeft, RefreshCw, Wallet2, FileCheck2 } from 'lucide-react';

export default function PartnerWallet({ partnerId, onBackToDashboard }) {
  const [wallet, setWallet] = useState({});
  const [transactions, setTransactions] = useState([]);
  const [payoutRequests, setPayoutRequests] = useState([]);
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Modal Overlay state triggers
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);

  const fetchWalletDetails = async () => {
    if (!partnerId) return;
    setIsLoading(true);
    setErrorMsg('');
    try {
      const response = await axios.get(`/api/partners/wallet?partnerId=${partnerId}`);
      if (response.data?.success) {
        setWallet(response.data.wallet || {});
        setTransactions(response.data.transactions || []);
        setPayoutRequests(response.data.payoutRequests || []);
      }

      // Also get available events for ticket purchase dropdown
      const devDashObj = await axios.get(`/api/partners/dashboard?partnerId=${partnerId}`);
      if (devDashObj.data?.analytics?.eventsList) {
        setEvents(devDashObj.data.analytics.eventsList);
      }
    } catch (error) {
      console.error("Wallet Fetch Error:", error);
      setErrorMsg(error.response?.data?.error || "Failed to establish ledger wallet socket connection.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWalletDetails();
  }, [partnerId]);

  // Handle payout wire submit
  const handlePayoutSubmit = async (payoutData) => {
    try {
      setErrorMsg('');
      setSuccessMsg('');
      const response = await axios.post('/api/partners/payout', {
        partnerId,
        amount: payoutData.amount,
        paymentDetails: payoutData.paymentDetails
      });
      if (response.data?.success) {
        setSuccessMsg(`Bank payout file dispatched for $${payoutData.amount.toFixed(2)} Chase Wire settlement review.`);
        fetchWalletDetails(); // Reload ledger state
      }
    } catch (error) {
      const msg = error.response?.data?.error || error.message || "Failed to submit payout wire.";
      throw new Error(msg);
    }
  };

  // Handle ticket purchase utilizing available balance
  const handleTicketPurchase = async (purchaseData) => {
    try {
      setErrorMsg('');
      setSuccessMsg('');
      const response = await axios.post('/api/partners/wallet/purchase-ticket', {
        partnerId,
        eventName: purchaseData.eventName,
        ticketCount: purchaseData.ticketCount,
        totalAmount: purchaseData.totalAmount
      });
      if (response.data?.success) {
        setSuccessMsg(`Successfully booked promotional entries to '${purchaseData.eventName}'. Check your ticket wallet.`);
        fetchWalletDetails(); // Reload ledger state
      }
    } catch (error) {
      const msg = error.response?.data?.error || error.message || "Purchase failed.";
      throw new Error(msg);
    }
  };

  const redeemable = Number(wallet.redeemableEarnings || 0);
  const withdrawn = Number(wallet.withdrawnAmount || 0);
  const availableBalance = Math.max(0, redeemable - withdrawn);

  return (
    <div id="partner_wallet_page" className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div className="flex items-center gap-3">
          <button
            id="btn_back_wallet"
            onClick={onBackToDashboard}
            className="p-2 border border-slate-200 rounded-xl hover:bg-slate-50 transition-all"
          >
            <ArrowLeft className="w-4 h-4 text-slate-500" />
          </button>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <Wallet2 className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">Partner Settlement Safe</h1>
              <p className="text-slate-500 text-xs mt-0.5">Disburse ledger balances, review dispatch locks, and purchase co-hosted tickets.</p>
            </div>
          </div>
        </div>

        <button
          id="btn_refresh_wallet"
          onClick={fetchWalletDetails}
          className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-500 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {errorMsg && (
        <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl text-rose-600 text-xs font-semibold">
          {errorMsg}
        </div>
      )}

      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl text-emerald-700 text-xs font-bold flex items-center gap-2">
          <FileCheck2 className="w-4.5 h-4.5 flex-shrink-0 text-emerald-500" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Wallet Card + Ticket Form */}
      <PartnerWalletCard
        wallet={wallet}
        onOpenWithdraw={() => setIsWithdrawOpen(true)}
        onPurchaseTickets={handleTicketPurchase}
        isLoading={isLoading}
        events={events}
      />

      {/* Ledger transactions sections */}
      <div className="border-t border-slate-100 pt-3">
        <PartnerTransactionTable
          transactions={transactions}
          payoutRequests={payoutRequests}
        />
      </div>

      {/* Withdraw overlay dialog box */}
      <PartnerWithdrawModal
        isOpen={isWithdrawOpen}
        onClose={() => setIsWithdrawOpen(false)}
        availableBalance={availableBalance}
        onSubmitWithdraw={handlePayoutSubmit}
      />
    </div>
  );
}
