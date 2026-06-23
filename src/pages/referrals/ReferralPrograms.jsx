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
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-white p-6 border border-[#E5E2DE] rounded-sm">
        <div>
          <span className="text-[10px] uppercase tracking-[0.2em] text-[#A09E9B] font-bold block mb-1">Campaigns</span>
          <h1 className="text-2xl  font-semibold text-[#1C1C1C] leading-snug">Referral & Commission Programs</h1>
          <p className="text-xs text-[#706E6B] mt-0.5">Configure partner links and lock in customer discount structures.</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={fetchData}
            className="p-2.5 text-[#706E6B] hover:text-[#1C1C1C] border border-[#E5E2DE] hover:bg-[#F7F5F2] rounded-sm transition-all cursor-pointer"
            title="Refresh Data Logs"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="bg-[#1C1C1C] hover:bg-[#2D2D2D] text-white font-bold text-[10px] uppercase tracking-[0.15em] py-3 px-5 rounded-sm shadow-none cursor-pointer flex items-center gap-1.5 transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            {showCreateForm ? 'Close Form' : 'Create Referral Link'}
          </button>
        </div>
      </div>

      {message.text && (
        <div className={`p-4 rounded-sm text-xs border flex items-center gap-2 ${
          message.type === 'success' ? 'bg-[#E5F2E1] text-[#2D5A27] border-[#2D5A27]/25' :
          message.type === 'info' ? 'bg-white text-[#1C1C1C] border-[#E5E2DE]' :
          'bg-[#FDF2F2] text-[#A34E24] border-[#A34E24]/25'
        }`}>
          <CheckCircle2 className="w-4 h-4 shrink-0" />
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
        <div className="border-b border-[#E5E2DE] pb-2 mb-4">
          <h2 className="text-xs font-bold uppercase tracking-widest text-[#706E6B] flex items-center gap-1.5">
            <LinkIcon className="w-3.5 h-3.5 text-[#1C1C1C]" /> Active Referral Links ({programs.length})
          </h2>
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
          <div className="bg-white border border-[#E5E2DE] rounded-sm p-10 text-center max-w-lg mx-auto" id="programs-empty-state">
            <LinkIcon className="w-12 h-12 text-[#A09E9B]/50 mx-auto mb-3" />
            <h3 className="text-sm font-semibold text-[#1C1C1C]">No active referral links</h3>
            <p className="text-xs text-[#706E6B] mt-1 pb-4">
              Get started by creating a customized referral code above that links promoters to buyer benefits.
            </p>
            <button
              onClick={() => setShowCreateForm(true)}
              className="bg-white hover:bg-[#F7F5F2] border border-[#E5E2DE] text-[#1C1C1C] font-bold text-[10px] uppercase tracking-wider py-2.5 px-4 rounded-sm cursor-pointer transition-colors"
            >
              Generate First Link Now
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
        <div className="border-b border-[#E5E2DE] pb-2 mb-4">
          <h2 className="text-xs font-bold uppercase tracking-widest text-[#706E6B] flex items-center gap-1.5">
            <ShoppingCart className="w-3.5 h-3.5 text-[#1C1C1C]" /> Sales Transactions & Settlements
          </h2>
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
