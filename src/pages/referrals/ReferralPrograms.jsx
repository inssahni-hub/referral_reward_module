import React, { useState, useEffect } from 'react';
import axios from "@/request/axiosReq";
import { Plus, Link as LinkIcon, ShoppingCart, HelpCircle, CheckCircle2, RefreshCw } from 'lucide-react';
import ReferralForm from '@/components/referrals/ReferralForm.jsx';
import ReferralLinkCard from '@/components/referrals/ReferralLinkCard.jsx';
import ReferralTransactionsTable from '@/components/referrals/ReferralTransactionsTable.jsx';

export default function ReferralPrograms() {
  const [programs, setPrograms] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const fetchData = async () => {
    try {
      setLoading(true);
      const progRes = await axios.get('/api/referrals/list');
      setPrograms(progRes.data);

      const txRes = await axios.get('/api/referrals/transactions');
      setTransactions(txRes.data.transactions);
    } catch (err) {
      console.error('Error fetching referral programs data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleProgramCreated = (newProg) => {
    setPrograms(prev => [newProg, ...prev]);
    setShowCreateForm(false);
    setMessage({ type: 'success', text: `Referral code "${newProg.referralCode}" activated successfully!` });
    setTimeout(() => setMessage({ type: '', text: '' }), 4000);
  };

  const handleSettleEvent = async (eventId) => {
    try {
      setMessage({ type: 'info', text: 'Settle in progress...' });
      const res = await axios.post('/api/referrals/settle-event', { eventId });
      setMessage({ type: 'success', text: res.data.message });
      await fetchData();
      setTimeout(() => setMessage({ type: '', text: '' }), 4000);
    } catch (err) {
      console.error(err);
      setMessage({ type: 'error', text: err.response?.data?.error || 'Failed to settle event.' });
    }
  };

  return (
    <div className="space-y-6" id="referrals-programs-page">
      {/* Banner Area */}
      {/* Page Header */}
      <div className="bg-white border rounded-xl p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#2189ed]/10 flex items-center justify-center">
              <LinkIcon className="w-6 h-6 text-[#2189ed]" />
            </div>

            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-[#2189ed]">
                Referral Programs
              </span>

              <h1 className="text-2xl font-bold text-gray-900 mt-1">
                Referral & Commission Programs
              </h1>

              <p className="text-sm text-gray-500 mt-1">
                Configure partner referral links, promoter commissions, customer
                discounts, and settlement rules.
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={fetchData}
              className="h-10 w-10 rounded-lg border border-gray-200 hover:bg-[#2189ed]/10 hover:border-[#2189ed]/20 transition flex items-center justify-center cursor-pointer"
            >
              <RefreshCw className="w-4 h-4 text-gray-600" />
            </button>

            <button
              type="button"
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="bg-[#2189ed] hover:bg-[#1976d2] text-white px-5 py-2.5 rounded-lg font-semibold flex items-center gap-2 transition cursor-pointer shadow-sm"
            >
              <Plus className="w-4 h-4" />

              {showCreateForm
                ? "Close Form"
                : "Create Referral Link"}
            </button>
          </div>
        </div>
      </div>

      {message.text && (
        <div
          className={`p-4 rounded-xl border flex items-center gap-2 ${message.type === "success"
            ? "bg-green-50 border-green-200 text-green-700"
            : message.type === "info"
              ? "bg-[#2189ed]/10 border-[#2189ed]/20 text-[#2189ed]"
              : "bg-red-50 border-red-200 text-red-700"
            }`}
        >
          <CheckCircle2 className="w-5 h-5" />
          <span>{message.text}</span>
        </div>
      )}

      {/* Conditionally reveal creation form */}
      {showCreateForm && (
        <div className="flex justify-center" id="embedded-referral-form">
          <ReferralForm onProgramCreated={handleProgramCreated} />
        </div>
      )}

      {/* Main split dashboard grids */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <LinkIcon className="w-5 h-5 text-[#2189ed]" />
            Active Referral Links
          </h2>

          <span className="text-sm text-gray-500">
            {programs.length} Programs
          </span>
        </div>
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4" id="cards-skeleton">
            {[1, 2, 3].map(n => (
              <div key={n} className="bg-white border border-[#E5E2DE] rounded-sm p-5 space-y-3 animate-pulse">
                <div className="h-4 bg-gray-100 rounded-none w-1/3"></div>
                <div className="h-6 bg-gray-100 rounded-none w-3/4"></div>
                <div className="h-14 bg-gray-50 rounded-none"></div>
              </div>
            ))}
          </div>
        ) : programs.length === 0 ? (
          <div className="bg-white border rounded-xl p-10 text-center">
            <div className="w-16 h-16 rounded-full bg-[#2189ed]/10 flex items-center justify-center mx-auto mb-4">
              <LinkIcon className="w-8 h-8 text-[#2189ed]" />
            </div>

            <h3 className="text-lg font-semibold text-gray-900">
              No Referral Programs
            </h3>

            <p className="text-sm text-gray-500 mt-2 mb-6">
              Create your first referral campaign to start rewarding promoters and
              customers.
            </p>

            <button
              onClick={() => setShowCreateForm(true)}
              className="bg-[#2189ed] hover:bg-[#1976d2] text-white px-5 py-2.5 rounded-lg font-semibold"
            >
              Create Referral Program
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4" id="programs-grid">
            {programs.map(prog => (
              <ReferralLinkCard key={prog._id} program={prog} />
            ))}
          </div>
        )}
      </div>

      {/* Referral Transactions and Order History Log */}
      <div className="pt-4">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-[#2189ed]" />
            Sales Transactions
          </h2>

          <span className="text-sm text-gray-500">
            Referral Settlements
          </span>
        </div>
        {loading ? (
          <div className="h-40 bg-white border border-[#E5E2DE] rounded-sm animate-pulse"></div>
        ) : (
          <ReferralTransactionsTable
            transactions={transactions}
            onSettleEvent={handleSettleEvent}
          />
        )}
      </div>
    </div>
  );
}
