import React, { useState } from 'react';
import { Landmark, X, AlertCircle, CheckCircle, HelpCircle, Coins, Send } from 'lucide-react';
import axios from 'axios';

export default function PromoterWithdrawModal({ wallet = {}, onClose, onWithdrawSuccess }) {
  const redeemable = Number(wallet.redeemableEarnings || 0);

  const [amount, setAmount] = useState(redeemable);
  const [accountHolder, setAccountHolder] = useState('');
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [routingNumber, setRoutingNumber] = useState('');

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', text: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', text: '' });

    const wAmt = Number(amount);
    if (isNaN(wAmt) || wAmt <= 0) {
      setLoading(false);
      setStatus({ type: 'error', text: 'Please enter a valid amount greater than zero.' });
      return;
    }

    if (wAmt > redeemable) {
      setLoading(false);
      setStatus({
        type: 'error',
        text: `The maximum amount you can withdraw is your current redeemable balance: $${redeemable.toFixed(2)}.`
      });
      return;
    }

    try {
      const response = await axios.post('/api/promoter/payout', {
        promoterEmail: wallet.promoterEmail,
        amount: wAmt,
        bankDetails: {
          accountHolder: accountHolder.trim(),
          bankName: bankName.trim(),
          accountNumber: accountNumber.trim(),
          routingNumber: routingNumber.trim()
        }
      });

      setStatus({ type: 'success', text: response.data.message });
      setTimeout(() => {
        if (onWithdrawSuccess) {
          onWithdrawSuccess();
        }
        onClose();
      }, 1500);

    } catch (err) {
      console.error(err);
      setStatus({
        type: 'error',
        text: err.response?.data?.error || 'Database error processing bank transfer. Please retry.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-none flex items-center justify-center p-4 z-50 animate-fade-in" id="promoter-withdraw-modal-wrapper">
      <div className="bg-white border border-[#E5E2DE] shadow-xl max-w-lg w-full overflow-hidden flex flex-col max-h-[90vh] rounded-sm">
        {/* Header */}
        <div className="p-5 border-b border-[#E5E2DE] flex items-center justify-between bg-[#F7F5F2]">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-[#F7F5F2] text-[#1C1C1C] border border-[#E5E2DE] rounded-sm">
              <Landmark className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-serif italic text-[#1C1C1C] font-semibold leading-tight">Request Payout Withdrawal</h3>
              <p className="text-[10px] text-[#706E6B]">Direct-to-bank electronic ACH settlement credit</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-[#706E6B] hover:text-[#1C1C1C] rounded-sm hover:bg-[#E5E2DE]/30 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
          {status.text && (
            <div className={`p-4 rounded-sm flex items-start gap-2.5 text-xs border ${
              status.type === 'success'
                ? 'bg-[#E5F2E1] border-[#2D5A27]/20 text-[#2D5A27]'
                : 'bg-[#FFF9E6] border-[#A34E24]/20 text-[#A34E24]'
            }`}>
              {status.type === 'success' ? (
                <CheckCircle className="w-4.5 h-4.5 shrink-0 text-[#2D5A27]" />
              ) : (
                <AlertCircle className="w-4.5 h-4.5 shrink-0 text-[#A34E24]" />
              )}
              <span className="leading-snug">{status.text}</span>
            </div>
          )}

          {/* Balance Preview */}
          <div className="bg-[#F7F5F2] border border-[#E5E2DE] rounded-sm p-4 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-[#706E6B] font-bold uppercase tracking-wider">Your Available Balance</span>
              <div className="text-xl font-mono font-bold text-[#1C1C1C] mt-0.5">
                ${redeemable.toFixed(2)}
              </div>
            </div>
            <Coins className="w-8 h-8 text-[#1C1C1C] opacity-60" />
          </div>

          {/* Amount field */}
          <div>
            <label className="block text-[10px] font-bold text-[#706E6B] uppercase mb-1.5">
              Withdrawal Amount ($) *
            </label>
            <input
              type="number"
              step="0.01"
              min="1.00"
              max={redeemable}
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              required
              className="w-full text-xs px-3.5 py-2.5 bg-[#F7F5F2]/50 border border-[#E5E2DE] rounded-sm focus:outline-none focus:border-[#1C1C1C] font-mono font-bold text-[#1C1C1C]"
            />
          </div>

          <div className="border-t border-[#E5E2DE] pt-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#1C1C1C] flex items-center gap-1.5 mb-1">
              <Landmark className="w-3.5 h-3.5 text-[#1C1C1C]" /> Bank Deposit Particulars
            </h4>

            {/* Account Holder Name */}
            <div>
              <label className="block text-[10px] font-bold text-[#706E6B] uppercase mb-1.5">
                Account Holder Name *
              </label>
              <input
                type="text"
                placeholder="e.g. Chad Stevenson"
                value={accountHolder}
                onChange={(e) => setAccountHolder(e.target.value)}
                required
                className="w-full text-xs px-3 py-2 bg-text bg-[#F7F5F2]/40 border border-[#E5E2DE] rounded-sm focus:outline-none focus:border-[#1C1C1C]"
              />
            </div>

            {/* Bank Name */}
            <div>
              <label className="block text-[10px] font-bold text-[#706E6B] uppercase mb-1.5">
                Bank / Institution Name *
              </label>
              <input
                type="text"
                placeholder="e.g. Silicon Valley Bank"
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                required
                className="w-full text-xs px-3 py-2 bg-[#F7F5F2]/40 border border-[#E5E2DE] rounded-sm focus:outline-none focus:border-[#1C1C1C]"
              />
            </div>

            {/* Grid for Routing & Acct Numbers */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-[#706E6B] uppercase mb-1.5">
                  Routing Code (9 digit) *
                </label>
                <input
                  type="text"
                  placeholder="021000021"
                  maxLength="9"
                  value={routingNumber}
                  onChange={(e) => setRoutingNumber(e.target.value.replace(/\D/g, ''))}
                  required
                  className="w-full text-xs px-3 py-2 bg-[#F7F5F2]/40 border border-[#E5E2DE] rounded-sm focus:outline-none focus:border-[#1C1C1C] font-mono"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-[#706E6B] uppercase mb-1.5">
                  Account Number *
                </label>
                <input
                  type="text"
                  placeholder="12345678"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, ''))}
                  required
                  className="w-full text-xs px-3 py-2 bg-[#F7F5F2]/40 border border-[#E5E2DE] rounded-sm focus:outline-none focus:border-[#1C1C1C] font-mono"
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-[#E5E2DE] flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 text-[10px] font-bold text-[#706E6B] uppercase tracking-wider py-3 border border-[#E5E2DE] hover:bg-[#F7F5F2] rounded-sm cursor-pointer transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || amount <= 0}
              className="flex-1 bg-[#1C1C1C] hover:bg-[#2D2D2D] disabled:opacity-45 text-white font-bold text-[10px] uppercase tracking-wider py-3 rounded-sm cursor-pointer transition-colors flex items-center justify-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              {loading ? 'Processing...' : 'Submit Withdrawal'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
