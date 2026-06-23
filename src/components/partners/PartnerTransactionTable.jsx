import React from 'react';
import { LayoutGrid, RefreshCw, AlertCircle, ArrowUpRight, CheckCircle2, XCircle } from 'lucide-react';

export default function PartnerTransactionTable({ transactions = [], payoutRequests = [] }) {
  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTxTypeStyles = (type) => {
    switch (type) {
      case 'earning_settled':
        return { label: 'Settlement Credit', text: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-100' };
      case 'withdrawal':
        return { label: 'Bank Withdrawal', text: 'text-slate-700', bg: 'bg-slate-100 border-slate-200' };
      case 'payout_rejected':
        return { label: 'Withdrawal Returned', text: 'text-sky-700', bg: 'bg-sky-50 border-sky-100' };
      case 'ticket_purchase':
        return { label: 'Ticket Purchase', text: 'text-blue-700', bg: 'bg-blue-50 border-blue-100' };
      case 'admin_adjustment':
        return { label: 'Admin Adjust', text: 'text-purple-700', bg: 'bg-purple-50 border-purple-100' };
      default:
        return { label: 'Adjustment', text: 'text-slate-600', bg: 'bg-slate-100 border-slate-200' };
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-rose-500" />;
      case 'pending':
      default:
        return <RefreshCw className="w-4 h-4 text-amber-500 animate-spin" />;
    }
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-1 gap-6">
      {/* Wallet Transactions ledger */}
      <div id="transactions_ledger_card" className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col justify-between">
        <div>
          <div className="px-6 py-5 border-b border-slate-50">
            <h3 className="text-base font-bold text-slate-800">Financial Ledger Activities (Transactions)</h3>
            <p className="text-slate-400 text-xs mt-0.5">Real-time ledger audit trail showing payouts, ticket trades and credits.</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/75 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-widest animate-fade-in">
                  <th className="px-6 py-3">Book Date</th>
                  <th className="px-6 py-3">Activity description</th>
                  <th className="px-6 py-3 text-center">Reference Type</th>
                  <th className="px-6 py-3 text-right">Value (USD)</th>
                  <th className="px-6 py-3 text-center">Security</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-600 text-xs">
                {transactions.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-10 text-center text-slate-400">
                      <div className="flex flex-col items-center justify-center gap-1 py-4">
                        <AlertCircle className="w-6 h-6 text-slate-300" />
                        <p className="font-semibold text-slate-500">No ledger transactions recorded yet.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  transactions.map((tx) => {
                    const style = getTxTypeStyles(tx.type);
                    return (
                      <tr id={`tx_row_${tx._id}`} key={tx._id} className="hover:bg-slate-50/50 transition-all duration-150">
                        <td className="px-6 py-4.5 whitespace-nowrap text-slate-450 text-[11px] font-medium font-mono">
                          {formatDate(tx.date)}
                        </td>
                        <td className="px-6 py-4.5 font-medium text-slate-700">
                          {tx.description}
                        </td>
                        <td className="px-6 py-4.5 text-center">
                          <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold border ${style.bg} ${style.text}`}>
                            {style.label}
                          </span>
                        </td>
                        <td className={`px-6 py-4.5 text-right font-black font-mono text-sm ${tx.amount < 0 ? 'text-slate-700' : 'text-emerald-600'}`}>
                          {tx.amount < 0 ? '-' : '+'}${Math.abs(tx.amount).toFixed(2)}
                        </td>
                        <td className="px-6 py-4.5 text-center">
                          <div className="flex justify-center">{getStatusIcon(tx.status)}</div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Direct Bank Wire Withdrawal Requests ledger */}
      <div id="payouts_ledger_card" className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col justify-between">
        <div>
          <div className="px-6 py-5 border-b border-slate-50">
            <h3 className="text-base font-bold text-slate-800">Bank Dispatch Wire Requests</h3>
            <p className="text-slate-400 text-xs mt-0.5">Audit history of physical payout dispatch wires initiated by partner directors.</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/75 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  <th className="px-6 py-3">Requested At</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Settlement Bank</th>
                  <th className="px-6 py-3 text-right">Requested Cash</th>
                  <th className="px-6 py-3">Audit Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-600 text-xs">
                {payoutRequests.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-10 text-center text-slate-400">
                      <div className="flex flex-col items-center justify-center gap-1 py-4">
                        <AlertCircle className="w-6 h-6 text-slate-300" />
                        <p className="font-semibold text-slate-500">No bank wire payout requests filed.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  payoutRequests.map((pay) => (
                    <tr id={`payout_row_${pay._id}`} key={pay._id} className="hover:bg-slate-50/30 transition-all">
                      <td className="px-6 py-4 whitespace-nowrap text-slate-450 text-[10px] font-medium font-mono">
                        {formatDate(pay.requestedAt)}
                      </td>
                      <td className="px-6 py-4">
                        {pay.status === 'approved' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-100 shadow-sm">
                            Approved
                          </span>
                        ) : pay.status === 'rejected' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-100">
                            Rejected
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-100">
                            Pending Clear
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 font-semibold text-slate-700">
                        {pay.paymentDetails?.bankName} ({pay.paymentDetails?.holderName})
                      </td>
                      <td className="px-6 py-4 text-right font-black font-mono text-sm text-slate-800">
                        ${Number(pay.amount).toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-slate-400 text-[10px] max-w-xs truncate">
                        {pay.notes || 'Awaiting administrative verification'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
