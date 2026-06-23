import React, { useState } from 'react';
import { X, ArrowDownRight, ShieldCheck, RefreshCw } from 'lucide-react';

export default function PartnerWithdrawModal({
  isOpen = false,
  onClose,
  availableBalance = 0,
  onSubmitWithdraw
}) {
  const [amount, setAmount] = useState('');
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [holderName, setHolderName] = useState('');
  const [routingNumber, setRoutingNumber] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    const amt = Number(amount);
    if (isNaN(amt) || amt <= 0) {
      setErrorMsg('Please supply a positive withdrawal amount.');
      return;
    }

    if (amt > availableBalance) {
      setErrorMsg(`Withdrawal amount exceeds your current available balance ($${availableBalance.toFixed(2)}).`);
      return;
    }

    if (!bankName || !accountNumber || !holderName || !routingNumber) {
      setErrorMsg('All banking details must be completely supplied for payout validation.');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmitWithdraw({
        amount: amt,
        paymentDetails: {
          bankName,
          accountNumber,
          holderName,
          routingNumber
        }
      });
      // Clear inputs
      setAmount('');
      setBankName('');
      setAccountNumber('');
      setHolderName('');
      setRoutingNumber('');
      onClose();
    } catch (err) {
      setErrorMsg(err.message || 'Failed to submit payout dispatch request.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div id="withdraw_modal" className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        onClick={onClose} 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300"
      ></div>

      {/* Modal Container */}
      <div className="relative bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl border border-slate-100 z-10 animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-50 bg-slate-50/50">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg">
              <ArrowDownRight className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-slate-800 text-sm">Request Cash Withdrawal</h3>
          </div>
          <button 
            id="close_withdraw_modal"
            onClick={onClose} 
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100/80 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="p-4 bg-blue-50 border border-blue-100/50 rounded-2xl flex items-center justify-between">
            <div>
              <p className="text-[10px] text-blue-500 font-bold uppercase tracking-wider">Available Balance</p>
              <h4 className="text-2xl font-black text-blue-950 font-mono mt-0.5">${availableBalance.toFixed(2)}</h4>
            </div>
            <ShieldCheck className="w-8 h-8 text-blue-500/80" />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Amount (USD)</label>
            <input
              id="input_withdraw_amount"
              type="number"
              step="0.01"
              min="1"
              max={availableBalance}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="w-full text-sm px-4 py-3 border border-slate-200 focus:border-blue-500 bg-slate-50/20 rounded-2xl focus:outline-none font-semibold font-mono"
              required
            />
          </div>

          <div className="border-t border-slate-100 pt-3">
            <h4 className="text-xs font-bold text-slate-700 tracking-wide mb-3">Settlement Banking Coordinates</h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">Account Holder Name</label>
                <input
                  id="input_bank_holder"
                  type="text"
                  value={holderName}
                  onChange={(e) => setHolderName(e.target.value)}
                  placeholder="Official Company / Person Legal Name"
                  className="w-full text-xs px-3.5 py-2.5 border border-slate-200 focus:border-blue-500 rounded-xl focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">Bank Name</label>
                <input
                  id="input_bank_name"
                  type="text"
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  placeholder="e.g. Chase Bank"
                  className="w-full text-xs px-3.5 py-2.5 border border-slate-200 focus:border-blue-500 rounded-xl focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">Routing Number (ABA)</label>
                <input
                  id="input_bank_routing"
                  type="text"
                  value={routingNumber}
                  onChange={(e) => setRoutingNumber(e.target.value)}
                  placeholder="9-digit code"
                  className="w-full text-xs px-3.5 py-2.5 border border-slate-200 focus:border-blue-500 rounded-xl focus:outline-none font-mono"
                  required
                />
              </div>
              <div className="col-span-2">
                <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">Account Number</label>
                <input
                  id="input_bank_account"
                  type="text"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  placeholder="Direct checking/savings account number"
                  className="w-full text-xs px-3.5 py-2.5 border border-slate-200 focus:border-blue-500 rounded-xl focus:outline-none font-mono"
                  required
                />
              </div>
            </div>
          </div>

          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-100 text-rose-600 rounded-xl text-xs font-semibold">
              {errorMsg}
            </div>
          )}

          <div className="pt-2 flex gap-3 text-xs">
            <button
              id="btn_cancel_withdraw"
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 rounded-2xl border border-slate-200 hover:bg-slate-50 font-bold hover:text-slate-800 text-slate-500 text-center transition-all"
            >
              Cancel
            </button>
            <button
              id="btn_submit_withdraw_request"
              type="submit"
              disabled={isSubmitting || !amount || Number(amount) <= 0}
              className="flex-1 px-4 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-center inline-flex items-center justify-center gap-1.5 transition-all shadow-md shadow-slate-950/10 disabled:bg-slate-100 disabled:text-slate-400"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Submitting...</span>
                </>
              ) : (
                <span>Submit Withdrawal Request</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
