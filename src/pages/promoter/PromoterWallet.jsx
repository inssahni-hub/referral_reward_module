import React, { useState, useEffect } from 'react';
import axios from "@/request/axiosReq";
import { Mail, RefreshCw, Milestone, Landmark, Clock, Coins, CheckCircle, ArrowUpRight, ArrowDownLeft } from 'lucide-react';

import PromoterWalletCard from '@/components/promoter/PromoterWalletCard.jsx';
import PromoterWithdrawModal from '@/components/promoter/PromoterWithdrawModal.jsx';

export default function PromoterWallet() {
  const [loggedInEmail] = useState('p2@gmail1.com');
  const [data, setData] = useState({
    wallet: {
      totalEarnings: 0,
      pendingEarnings: 0,
      redeemableEarnings: 0,
      withdrawnEarnings: 0
    },
    payoutRequests: [],
    ledger: []
  });

  const [loading, setLoading] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);

  const fetchWalletDetails = async () => {
    if (!loggedInEmail) return;
    try {
      setLoading(true);
      const response = await axios.get('/api/promoter/wallet', { params: { email: loggedInEmail } });
      setData(response.data);
    } catch (err) {
      console.error('Error loading promoter wallet specifics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWalletDetails();
  }, [loggedInEmail]);

  if (!loggedInEmail) {
    return (
      <div className="bg-white border border-[#E5E2DE] p-10 max-w-md mx-auto text-center rounded-sm space-y-4 animate-fade-in" id="promoter-wallet-unauth">
        <Mail className="w-12 h-12 text-[#1C1C1C] mx-auto opacity-60" />
        <h3 className="text-sm font-semibold text-[#1C1C1C]">Please Authorize Promoter Account First</h3>
        <p className="text-xs text-[#706E6B] leading-relaxed">
          Head over to the Promoter Dashboard and authenticate your email address to unlock wallet statement details.
        </p>
      </div>
    );
  }

  const handleWithdrawSuccess = () => {
    fetchWalletDetails();
  };

  return (
    <div className="space-y-6" id="promoter-wallet-sheet">
      {/* Page Title */}
      <div className="bg-white p-6 border border-[#E5E2DE] rounded-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-none animate-fade-in">
        <div>
          <span className="text-[10px] uppercase tracking-[0.2em] text-[#A09E9B] font-bold block mb-1">Redemptions & Funds</span>
          <h1 className="text-2xl text-[#1C1C1C] font-semibold leading-snug flex items-center gap-2">
            Promoter Balance & Payouts
          </h1>
          <p className="text-xs text-[#706E6B] mt-0.5">
            Redeem commission balances and review complete ledger credit activities.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchWalletDetails}
          disabled={loading}
          className="p-2.5 text-[#706E6B] hover:text-[#1C1C1C] border border-[#E5E2DE] hover:bg-[#F7F5F2] rounded-sm transition-all cursor-pointer disabled:opacity-50 shrink-0"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {loading ? (
        <div className="h-64 bg-white border border-[#E5E2DE] rounded-sm animate-pulse"></div>
      ) : (
        <div className="space-y-6" id="promoter-wallet-content">
          {/* Main Wallet balance summary */}
          <PromoterWalletCard
            wallet={{ ...data.wallet, promoterEmail: loggedInEmail }}
            onWithdrawClick={() => setShowWithdraw(true)}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Withdrawal / Payout request logs */}
            <div className="bg-white border border-[#E5E2DE] rounded-sm flex flex-col shadow-none">
              <div className="p-4 border-b border-[#E5E2DE] bg-[#F7F5F2]">
                <h3 className="text-xs font-bold text-[#1C1C1C] flex items-center gap-1.5 uppercase tracking-wider">
                  <Landmark className="w-3.5 h-3.5 text-[#1C1C1C]" /> Bank Payout Requests
                </h3>
              </div>

              <div className="flex-1 overflow-x-auto">
                {data.payoutRequests.length === 0 ? (
                  <div className="p-8 text-center" id="payout-empty shadow-sm">
                    <Milestone className="w-10 h-10 text-[#A09E9B] mx-auto mb-2 opacity-60" />
                    <h5 className="text-xs font-semibold text-[#1C1C1C]">No withdrawal requests yet</h5>
                    <p className="text-xs text-[#706E6B] mt-1 leading-relaxed">
                      Once balance redemptions are created, transfer request statuses can be tracked here.
                    </p>
                  </div>
                ) : (
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-[#E5E2DE] text-[#706E6B] text-[10px] font-bold uppercase tracking-wider bg-[#F7F5F2]/40">
                        <th className="py-2.5 px-4 font-semibold">Amount</th>
                        <th className="py-2.5 px-4 font-semibold">Bank Destination</th>
                        <th className="py-2.5 px-4 font-semibold">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F0EEEB] text-xs text-[#4A4A4A]">
                      {data.payoutRequests.map((req) => (
                        <tr key={req._id} className="hover:bg-[#F7F5F2]/45 transition-colors">
                          <td className="py-3 px-4">
                            <div className="font-bold text-[#1C1C1C] font-mono">${req.amount.toFixed(2)}</div>
                            <div className="text-[9px] text-[#A09E9B]">{new Date(req.requestedAt).toLocaleDateString()}</div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="font-semibold text-[#1C1C1C]">{req.bankDetails?.bankName}</div>
                            <div className="text-[10px] text-[#706E6B] font-mono">Acct: *{req.bankDetails?.accountNumber?.slice(-4)}</div>
                          </td>
                          <td className="py-3 px-4">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-sm border border-[#2D5A27]/15 bg-[#E5F2E1] text-[#2D5A27] text-[10px] font-bold">
                              <CheckCircle className="w-3 h-3 text-[#2D5A27]" /> Settled
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>

            {/* Complete balance Ledger statement */}
            <div className="bg-white border border-[#E5E2DE] rounded-sm flex flex-col shadow-none">
              <div className="p-4 border-b border-[#E5E2DE] bg-[#F7F5F2]">
                <h3 className="text-xs font-bold text-[#1C1C1C] flex items-center gap-1.5 uppercase tracking-wider">
                  <Coins className="w-3.5 h-3.5 text-[#1C1C1C]" /> Core Wallet Transactions
                </h3>
              </div>

              <div className="flex-1 overflow-x-auto">
                {data.ledger.length === 0 ? (
                  <div className="p-8 text-center" id="ledger-empty shadow-sm">
                    <Clock className="w-10 h-10 text-[#A09E9B] mx-auto mb-2 opacity-60" />
                    <h5 className="text-xs font-semibold text-[#1C1C1C]">No transactions recorded</h5>
                    <p className="text-xs text-[#706E6B] mt-1 leading-relaxed">
                      Earnings credits and withdrawal receipts appear here chronologically.
                    </p>
                  </div>
                ) : (
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-[#E5E2DE] text-[#706E6B] text-[10px] font-bold uppercase tracking-wider bg-[#F7F5F2]/40">
                        <th className="py-2.5 px-4 font-semibold">Ledger Type</th>
                        <th className="py-2.5 px-4 font-semibold">Statement Reference</th>
                        <th className="py-2.5 px-4 text-right font-semibold">Credit / Debit</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F0EEEB] text-xs text-[#4A4A4A]">
                      {data.ledger.map((line) => {
                        const isCredit = Number(line.amount) > 0;
                        return (
                          <tr key={line._id} className="hover:bg-[#F7F5F2]/45 transition-colors">
                            <td className="py-3 px-4 flex items-center gap-2">
                              <div className={`p-1 rounded-sm shrink-0 border ${
                                isCredit ? 'bg-[#E5F2E1] border-[#2D5A27]/10 text-[#2D5A27]' : 'bg-[#FFF9E6] border-[#A34E24]/10 text-[#A34E24]'
                              }`}>
                                {isCredit ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownLeft className="w-3.5 h-3.5" />}
                              </div>
                              <div>
                                <div className="font-bold text-[#1C1C1C]">
                                  {isCredit ? 'Commission' : 'Withdrawal'}
                                </div>
                                <div className="text-[9px] text-[#A09E9B]">
                                  {new Date(line.createdAt).toLocaleDateString()}
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-4 text-[#706E6B]">
                              <div className="font-semibold text-[#1C1C1C] shrink-0 line-clamp-1">{line.description}</div>
                              <div className="text-[9px] text-[#A09E9B] font-mono">Ref: #{line.referenceId?.slice(-8)}</div>
                            </td>
                            <td className={`py-3 px-4 text-right font-mono font-bold ${
                              isCredit ? 'text-[#2D5A27]' : 'text-[#A34E24]'
                            }`}>
                              {isCredit ? `+$${line.amount.toFixed(2)}` : `-$${Math.abs(line.amount).toFixed(2)}`}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Conditionally reveal bank withdrawal modal */}
      {showWithdraw && (
        <PromoterWithdrawModal
          wallet={{ ...data.wallet, promoterEmail: loggedInEmail }}
          onClose={() => setShowWithdraw(false)}
          onWithdrawSuccess={handleWithdrawSuccess}
        />
      )}
    </div>
  );
}
