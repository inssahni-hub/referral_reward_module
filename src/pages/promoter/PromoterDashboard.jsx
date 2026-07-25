import React, { useState, useEffect } from 'react';
import axios from "@/request/axiosReq";
import { Sparkles, Mail, LayoutDashboard, Copy, Check, RefreshCw, LogOut, Tags, ArrowRightLeft } from 'lucide-react';

import PromoterStatsCards from '@/components/promoter/PromoterStatsCards.jsx';
import PromoterTransactionTable from '@/components/promoter/PromoterTransactionTable.jsx';

export default function PromoterDashboard() {
  const [emailInput, setEmailInput] = useState('');
  const [loggedInEmail, setLoggedInEmail] = useState('p2@gmail1.com');
  const [data, setData] = useState({
    wallet: {
      totalEarnings: 0,
      pendingEarnings: 0,
      redeemableEarnings: 0,
      withdrawnEarnings: 0,
      ticketsSold: 0,
      referralRevenue: 0
    },
    referralLinks: [],
    recentTransactions: []
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [copiedCode, setCopiedCode] = useState('');

  const fetchPromoterData = async (email) => {
    try {
      setLoading(true);
      const response = await axios.get('/api/promoter/dashboard', { params: { email } });
      setData(response.data);
    } catch (err) {
      console.error('Error fetching promoter dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (loggedInEmail) {
      fetchPromoterData(loggedInEmail);
    }
  }, [loggedInEmail]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (!emailInput.trim()) return;

    const formattedEmail = emailInput.trim().toLowerCase();
    localStorage.setItem('promoter_email', formattedEmail);
    setLoggedInEmail(formattedEmail);
    setEmailInput('');
  };

  const handleLogout = () => {
    localStorage.removeItem('promoter_email');
    setLoggedInEmail('');
    setData({
      wallet: {},
      referralLinks: [],
      recentTransactions: []
    });
  };

  const handleCopyLink = (code, eventId) => {
    const refUrl = `${window.location.origin}/checkout?code=${code}&eventId=${eventId}`;
    navigator.clipboard.writeText(refUrl);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(''), 2000);
  };

  if (!loggedInEmail) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4 animate-fade-in" id="promoter-auth-portal">
        <div className="bg-white border border-[#E5E2DE] p-10 max-w-md w-full text-center space-y-6 rounded-sm">
          <div className="mx-auto w-12 h-12 bg-[#F7F5F2] text-[#1C1C1C] border border-[#E5E2DE] rounded-sm flex items-center justify-center">
            <Mail className="w-5 h-5" />
          </div>

          <div>
            <h2 className="text-2xl  text-[#1C1C1C] font-semibold">Promoter Portal</h2>
            <p className="text-xs text-[#706E6B] mt-1 whitespace-pre-line leading-relaxed">
              Authenticate with your unique promoter email to review custom links, commissions, and request payouts.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 text-left">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-[#706E6B] mb-1.5 font-semibold">
                Promoter Email Address
              </label>
              <input
                type="email"
                placeholder="e.g. prompt@email.com"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                required
                className="w-full text-sm placeholder-[#A09E9B] px-3 py-2 bg-[#F7F5F2]/50 border border-[#E5E2DE] rounded-sm focus:outline-none focus:border-[#1C1C1C] transition-all"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#1C1C1C] hover:bg-[#2D2D2D] text-white font-bold text-[10px] uppercase tracking-wider py-3 px-4 rounded-sm transition-colors shadow-none cursor-pointer"
            >
              Access Promoter Workspace
            </button>
          </form>

          <div className="pt-4 border-t border-[#F0EEEB] text-[10px] text-[#A09E9B] font-semibold uppercase tracking-wider">
            Don't have a code? Ask your Organizer to assign you.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6" id="promoter-dashboard-page">
      {/* Header */}
      {/* Page Header */}
      <div className="bg-white border rounded-xl p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#2189ed]/10 flex items-center justify-center">
              <Tags className="w-6 h-6 text-[#2189ed]" />
            </div>

            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-[#2189ed]">
                Promoter Workspace
              </span>

              <h1 className="text-2xl font-bold text-gray-900 mt-1">
                Welcome, {loggedInEmail}
              </h1>

              <p className="text-sm text-gray-500 mt-1">
                Monitor referral performance, commissions, referral links, and
                recent sales from one centralized dashboard.
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => fetchPromoterData(loggedInEmail)}
              disabled={loading}
              className="h-10 w-10 rounded-lg border border-gray-200 hover:bg-[#2189ed]/10 hover:border-[#2189ed]/20 flex items-center justify-center transition disabled:opacity-50"
            >
              <RefreshCw className="w-4 h-4 text-gray-600" />
            </button>

            <button
              type="button"
              onClick={handleLogout}
              className="bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 px-4 py-2.5 rounded-lg font-semibold flex items-center gap-2 transition"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-6 gap-5">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div
                key={n}
                className="h-28 bg-white border rounded-xl shadow-sm animate-pulse"
              />
            ))}
          </div>

          <div className="h-52 bg-white border rounded-xl shadow-sm animate-pulse" />
        </div>
      ) : (
        <div className="space-y-6" id="promoter-live-dashboard">
          {/* Stats indicators grid */}
          <PromoterStatsCards wallet={data.wallet} />

          {/* Promotional links cards grid */}
          <div>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Tags className="w-5 h-5 text-[#2189ed]" />
                Active Referral Links
              </h2>

              <span className="text-sm text-gray-500">
                {data.referralLinks.length} Links
              </span>
            </div>
            {data.referralLinks.length === 0 ? (
              <div className="bg-white border rounded-xl p-10 text-center">
                <div className="w-16 h-16 rounded-full bg-[#2189ed]/10 flex items-center justify-center mx-auto mb-4">
                  <Tags className="w-8 h-8 text-[#2189ed]" />
                </div>

                <h3 className="text-lg font-semibold text-gray-900">
                  No Referral Links
                </h3>

                <p className="text-sm text-gray-500 mt-2">
                  You don't have any referral campaigns assigned yet.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4" id="promoter-links-grid">
                {data.referralLinks.map(prog => {
                  const pUrl = `${window.location.origin}/checkout?code=${prog.referralCode}&eventId=${prog.eventId}`;
                  return (
                    <div key={prog._id} className="bg-white border border-[#E5E2DE] p-5 rounded-sm shadow-none space-y-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="px-3 py-1 rounded-full bg-[#2189ed]/10 text-[#2189ed] text-xs font-semibold">
                            {prog.eventName}
                          </span>
                          <h4 className="font-mono font-bold text-[#1C1C1C] mt-2 uppercase tracking-wide text-sm">{prog.referralCode}</h4>
                        </div>
                        <span className="px-3 py-1 rounded-full bg-green-50 text-green-700 text-xs font-semibold">
                          {prog.discountType === "percentage"
                            ? `${prog.discountValue}% OFF`
                            : `$${prog.discountValue} OFF`}
                        </span>
                      </div>

                      <div className="text-xs font-semibold text-[#4A4A4A] border border-dashed border-[#E5E2DE] p-3 bg-[#F7F5F2] rounded-sm flex items-center justify-between">
                        <span>Earn: <strong className="text-[#A34E24]">{prog.commissionType === 'percentage' ? `${prog.commissionValue}%` : `$${prog.commissionValue}`}</strong></span>
                        <span className="text-[9px] text-[#706E6B]">({prog.discountMode === 'per_ticket' ? 'per ticket' : 'flat'})</span>
                      </div>

                      <div className="pt-1">
                        <button
                          type="button"
                          onClick={() => handleCopyLink(prog.referralCode, prog.eventId)}
                          className={`w-full rounded-lg py-2.5 font-semibold transition flex items-center justify-center gap-2
${copiedCode === prog.referralCode
                              ? "bg-green-50 border border-green-200 text-green-700"
                              : "bg-[#2189ed] hover:bg-[#1976d2] text-white"
                            }`}
                        >
                          {copiedCode === prog.referralCode ? (
                            <>
                              <Check className="w-3.5 h-3.5" /> Link Copied
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" /> Copy Referral Link
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Quick conversions display list */}
          <div className="pt-4">
            <div className="border-b border-[#E5E2DE] pb-2 mb-4">
              <h2 className="text-xs font-bold uppercase tracking-widest text-[#1C1C1C] flex items-center gap-1.5">
                <ArrowRightLeft className="w-4 h-4 text-[#1C1C1C]" /> Recent Referral Sales
              </h2>
            </div>
            <PromoterTransactionTable transactions={data.recentTransactions} />
          </div>
        </div>
      )}
    </div>
  );
}
