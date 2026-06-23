import React, { useState } from 'react';

import axios from "@/request/axiosReq";
import { Sparkles, Calendar, Percent, DollarSign, LayoutList, Mail, Hash, AlertCircle, CheckCircle } from 'lucide-react';

import EventSelect from '../common/EventSelect.jsx';

export default function ReferralForm({ onProgramCreated }) {
  const [promoterEmail, setPromoterEmail] = useState('');
  const [referralCode, setReferralCode] = useState('');

  const [selectedEventId, setSelectedEventId] = useState("");
  const [selectedEventTitle, setSelectedEventTitle] = useState("");
  const [selectedEventSlug, setSelectedEventSlug] = useState("");

  const [discountType, setDiscountType] = useState('percentage');
  const [discountValue, setDiscountValue] = useState(10);
  const [discountMode, setDiscountMode] = useState('per_ticket');
  const [commissionType, setCommissionType] = useState('percentage');
  const [commissionValue, setCommissionValue] = useState(8);

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', text: '' });

  const generateRandomCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = 'PROMO-';
    for (let i = 0; i < 5; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setReferralCode(code);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', text: '' });

    if (!promoterEmail || !referralCode) {
      setLoading(false);
      setStatus({ type: 'error', text: 'Please complete all required fields.' });
      return;
    }

   

    try {
      const response = await axios.post('/api/referrals/create', {
        promoterEmail,
        referralCode: referralCode.toUpperCase(),
        eventName: selectedEventTitle,
        eventId: selectedEventId,
        eventSlug:selectedEventSlug,
        discountType,
        discountValue,
        discountMode,
        commissionType,
        commissionValue
      });

      setStatus({ type: 'success', text: response.data.message });
      setPromoterEmail('');
      setReferralCode('');

      if (onProgramCreated) {
        onProgramCreated(response.data.program);
      }
    } catch (err) {
      console.error(err);
      setStatus({
        type: 'error',
        text: err.response?.data?.error || 'Failed to create referral program.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-[#E5E2DE] rounded-sm p-8 max-w-2xl w-full" id="referral-form-block">
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[#F0EEEB]">
        <div>
          <h2 className="text-lg  font-semibold text-[#1C1C1C]">Create Referral Link</h2>
          <p className="text-xs text-[#706E6B] mt-0.5">Configure buyer incentives and promoter commissions for your events</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {status.text && (
          <div className={`p-4 rounded-sm border text-xs flex items-start gap-2 ${status.type === 'success' ? 'bg-[#E5F2E1] text-[#2D5A27] border-[#2D5A27]/20' : 'bg-[#FDF2F2] text-[#A34E24] border-[#A34E24]/20'
            }`}>
            {status.type === 'success' ? (
              <CheckCircle className="w-4 h-4 shrink-0 mt-0.5 text-[#2D5A27]" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-[#A34E24]" />
            )}
            <span>{status.text}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Promoter email */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-[#706E6B] mb-1.5 flex items-center gap-1">
              <Mail className="w-3.5 h-3.5 text-[#A09E9B]" /> Promoter Email *
            </label>
            <input
              type="email"
              placeholder="e.g. promoter@email.com"
              value={promoterEmail}
              onChange={(e) => setPromoterEmail(e.target.value)}
              required
              className="w-full text-xs px-3.5 py-2.5 bg-[#F7F5F2]/50 border border-[#E5E2DE] rounded-sm focus:outline-none focus:border-[#1C1C1C] focus:bg-white transition-colors"
            />
          </div>

          {/* Referral Code */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-[#706E6B] mb-1.5 flex items-center gap-1">
              <Hash className="w-3.5 h-3.5 text-[#A09E9B]" /> Customized Referral Code *
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="PROMO2026"
                value={referralCode}
                onChange={(e) => setReferralCode(e.target.value.replace(/\s+/g, ''))}
                required
                className="w-full text-xs px-3.5 py-2.5 bg-[#F7F5F2]/50 border border-[#E5E2DE] rounded-sm focus:outline-none focus:border-[#1C1C1C] focus:bg-white uppercase tracking-wider font-semibold"
              />
              <button
                type="button"
                onClick={generateRandomCode}
                className="px-3 text-xs font-bold text-[#1C1C1C] hover:bg-[#F7F5F2] rounded-sm transition-colors border border-[#E5E2DE] cursor-pointer"
              >
                Auto
              </button>
            </div>
          </div>
        </div>

        {/* Selected Event */}
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-[#706E6B] mb-1.5 flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-[#A09E9B]" /> Select Target Event *
          </label>

          <EventSelect
            value={selectedEventId}
            onChange={(id, event) => {
              setSelectedEventId(id);
              setSelectedEventTitle(event?.title || "");
              setSelectedEventSlug(event?.slug || "");
            }}
          />
        </div>

        {/* Discount section */}
        <div className="border border-[#E5E2DE] rounded-sm p-4 bg-[#F7F5F2]/30 space-y-4">
          <div className="flex items-center gap-2 border-b border-[#E5E2DE] pb-2">
            <Percent className="w-4 h-4 text-[#706E6B]" />
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#1C1C1C]">Buyer Discount Settings</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-[#A09E9B] uppercase mb-1.5">Discount Type</label>
              <select
                value={discountType}
                onChange={(e) => setDiscountType(e.target.value)}
                className="w-full text-xs px-3 py-2 bg-white border border-[#E5E2DE] rounded-sm focus:outline-none cursor-pointer"
              >
                <option value="percentage">Percentage (%)</option>
                <option value="fixed">Fixed Amount ($)</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-[#A09E9B] uppercase mb-1.5">Discount Value</label>
              <div className="relative">
                {discountType === 'fixed' && (
                  <DollarSign className="absolute left-3 top-2.5 w-3.5 h-3.5 text-gray-400" />
                )}
                <input
                  type="number"
                  min="0"
                  value={discountValue}
                  onChange={(e) => setDiscountValue(Number(e.target.value))}
                  className={`w-full text-xs py-2 px-3 border border-[#E5E2DE] bg-white rounded-sm focus:outline-none ${discountType === 'fixed' ? 'pl-7' : ''
                    }`}
                />
                {discountType === 'percentage' && (
                  <span className="absolute right-3 top-2 text-xs font-medium text-gray-400">%</span>
                )}
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-[#A09E9B] uppercase mb-1.5">Discount Mode</label>
              <select
                value={discountMode}
                onChange={(e) => setDiscountMode(e.target.value)}
                className="w-full text-xs px-3 py-2 bg-white border border-[#E5E2DE] rounded-sm focus:outline-none cursor-pointer"
              >
                <option value="per_ticket">Per Ticket</option>
                <option value="per_transaction">Per Transaction (Flat)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Commission Section */}
        <div className="border border-[#E5E2DE] rounded-sm p-4 bg-[#F7F5F2]/30 space-y-4">
          <div className="flex items-center gap-2 border-b border-[#E5E2DE] pb-2">
            <LayoutList className="w-4 h-4 text-[#706E6B]" />
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#1C1C1C]">Promoter Commission Settings</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-[#A09E9B] uppercase mb-1.5">Commission Type</label>
              <select
                value={commissionType}
                onChange={(e) => setCommissionType(e.target.value)}
                className="w-full text-xs px-3 py-2 bg-white border border-[#E5E2DE] rounded-sm focus:outline-none cursor-pointer"
              >
                <option value="percentage">Percentage (%) of Paid Value</option>
                <option value="fixed">Fixed Amount ($)</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-[#A09E9B] uppercase mb-1.5">Commission Value</label>
              <div className="relative">
                {commissionType === 'fixed' && (
                  <DollarSign className="absolute left-3 top-2.5 w-3.5 h-3.5 text-gray-400" />
                )}
                <input
                  type="number"
                  min="0"
                  value={commissionValue}
                  onChange={(e) => setCommissionValue(Number(e.target.value))}
                  className={`w-full text-xs py-2 px-3 border border-[#E5E2DE] bg-white rounded-sm focus:outline-none ${commissionType === 'fixed' ? 'pl-7' : ''
                    }`}
                />
                {commissionType === 'percentage' && (
                  <span className="absolute right-3 top-2 text-xs font-medium text-gray-400">%</span>
                )}
              </div>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#1C1C1C] hover:bg-[#2D2D2D] text-white font-bold text-[10px] uppercase tracking-[0.15em] py-3 px-4 rounded-sm transition-all cursor-pointer disabled:opacity-50"
        >
          {loading ? 'Creating referral...' : 'Activate Referral Link'}
        </button>
      </form>
    </div>
  );
}
