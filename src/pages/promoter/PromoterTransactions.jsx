import React, { useState, useEffect } from 'react';
import axios from "@/request/axiosReq";
import { Tag, RefreshCw, Mail } from 'lucide-react';
import PromoterTransactionTable from '@/components/promoter/PromoterTransactionTable.jsx';

export default function PromoterTransactions() {
  const [loggedInEmail] = useState('p2@gmail1.com');
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchTransactions = async () => {
    if (!loggedInEmail) return;
    try {
      setLoading(true);
      const response = await axios.get('/api/promoter/dashboard', { params: { email: loggedInEmail } });
      setTransactions(response.data.recentTransactions);
    } catch (err) {
      console.error('Error fetching transactions listing:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [loggedInEmail]);

  if (!loggedInEmail) {
    return (
      <div className="bg-white border border-[#E5E2DE] p-10 max-w-md mx-auto text-center rounded-sm space-y-4" id="promoter-tx-unauth">
        <Mail className="w-12 h-12 text-[#1C1C1C] mx-auto opacity-60" />
        <h3 className="text-sm font-semibold text-[#1C1C1C]">Please Authorize Promoter Account First</h3>
        <p className="text-xs text-[#706E6B] leading-relaxed">
          Head over to the Promoter Dashboard and authenticate your email address to unlock purchase transactions.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6" id="promoter-tx-page">
      <div className="bg-white p-6 border border-[#E5E2DE] rounded-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-none animate-fade-in">
        <div>
          <span className="text-[10px] uppercase tracking-[0.2em] text-[#A09E9B] font-bold block mb-1">Ledger History</span>
          <h1 className="text-2xl  text-[#1C1C1C] font-semibold leading-snug flex items-center gap-2">
            Sales Conversion Ledger
          </h1>
          <p className="text-xs text-[#706E6B] mt-0.5">
            Real-time audit history of customers purchasing with your promo codes.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchTransactions}
          disabled={loading}
          className="p-2.5 text-[#706E6B] hover:text-[#1C1C1C] border border-[#E5E2DE] hover:bg-[#F7F5F2] rounded-sm transition-all cursor-pointer disabled:opacity-50 shrink-0"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {loading ? (
        <div className="h-40 bg-white border border-[#E5E2DE] rounded-sm animate-pulse"></div>
      ) : (
        <PromoterTransactionTable transactions={transactions} />
      )}
    </div>
  );
}
