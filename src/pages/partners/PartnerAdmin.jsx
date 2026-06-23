import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import axios from "@/request/axiosReq";
import {
  ShieldAlert, Users, CreditCard, CalendarRange,
  UserPlus, PlusCircle, RefreshCw, Check, X,
  HelpCircle, Sparkles, Sliders, ArrowUpRight, DollarSign
} from 'lucide-react';

export default function PartnerAdmin() {
  const navigate = useNavigate();
  const [partners, setPartners] = useState([]);
  const [earnings, setEarnings] = useState([]);
  const [payouts, setPayouts] = useState([]);
  const [transactions, setTransactions] = useState([]);

  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Manual partner creation state
  const [showAddForm, setShowAddForm] = useState(false);
  const [companyName, setCompanyName] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [taxInfo, setTaxInfo] = useState('');
  const [sharePct, setSharePct] = useState(30);

  // Wallet adjustment state
  const [adjustingPartnerId, setAdjustingPartnerId] = useState('');
  const [adjustAmount, setAdjustAmount] = useState('');
  const [adjustType, setAdjustType] = useState('credit'); // credit or debit
  const [adjustDesc, setAdjustDesc] = useState('');

  // Filter tab
  const [activeTab, setActiveTab] = useState('applications');

  const fetchAdminState = async () => {
    setIsLoading(true);
    setErrorMsg('');
    try {
      const response = await axios.get('/api/partners/admin/all');
      if (response.data) {
        setPartners(response.data.partners || []);
        setEarnings(response.data.earnings || []);
        setPayouts(response.data.payouts || []);
        setTransactions(response.data.transactions || []);
      }
    } catch (error) {
      console.error("Admin Load Error:", error);
      setErrorMsg("Failed to connect back-office administrative API.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminState();
  }, []);

  // Post Actions
  const handleApprovePartner = async (partnerId, share) => {
    try {
      const specShare = share !== undefined ? share : 30;
      await axios.post(`/api/partners/approve/${partnerId}`, { revenueSharePercentage: specShare });
      setSuccessMsg("Partner application approved and co-host wallet initialized.");
      fetchAdminState();
    } catch (error) {
      setErrorMsg(error.response?.data?.error || "Error approving partner.");
    }
  };

  const handleRejectPartner = async (partnerId) => {
    try {
      await axios.post(`/api/partners/reject/${partnerId}`, { reason: "Audit verify check failed" });
      setSuccessMsg("Partner application rejected.");
      fetchAdminState();
    } catch (error) {
      setErrorMsg(error.response?.data?.error || "Error rejecting partner.");
    }
  };

  const handleAddPartnerSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    try {
      await axios.post('/api/partners/admin/add', {
        companyName,
        contactPerson,
        email,
        phone,
        taxInfo,
        revenueSharePercentage: sharePct,
        isOrganiser: false
      });
      setSuccessMsg(`Manually onboarded approved partner '${companyName}'!`);
      // reset
      setCompanyName('');
      setContactPerson('');
      setEmail('');
      setPhone('');
      setTaxInfo('');
      setShowAddForm(false);
      fetchAdminState();
    } catch (error) {
      setErrorMsg(error.response?.data?.error || "Failed to add partner manually.");
    }
  };

  const handleToggleOrganiser = async (partnerId, currentVal) => {
    try {
      await axios.post(`/api/partners/admin/convert/${partnerId}`, { isOrganiser: !currentVal });
      setSuccessMsg("Corporate organizer assignment updated.");
      fetchAdminState();
    } catch (error) {
      setErrorMsg(error.response?.data?.error || "Failed to convert organizer.");
    }
  };

  const handleAdjustWalletSubmit = async (e) => {
    e.preventDefault();
    if (!adjustingPartnerId || !adjustAmount) return;
    setErrorMsg('');
    try {
      await axios.post(`/api/partners/admin/adjust/${adjustingPartnerId}`, {
        amount: Number(adjustAmount),
        type: adjustType,
        description: adjustDesc || `Manual adjustment by admin (${adjustType === 'credit' ? 'Credit' : 'Debit'})`
      });
      setSuccessMsg("Wallet balance adjusted and ledger event recorded.");
      setAdjustingPartnerId('');
      setAdjustAmount('');
      setAdjustDesc('');
      fetchAdminState();
    } catch (error) {
      setErrorMsg(error.response?.data?.error || "Balance adjustment failed.");
    }
  };

  const handleProcessPayout = async (payoutId, status) => {
    try {
      await axios.post(`/api/partners/admin/payout/${payoutId}`, {
        status,
        remarks: `Processed and ${status} via Admin Desk.`
      });
      setSuccessMsg(`Payout request status changed to: ${status}.`);
      fetchAdminState();
    } catch (error) {
      setErrorMsg(error.response?.data?.error || "Error modifying payout status.");
    }
  };

  // Run Settlement Engine Cron Sweeper right now!
  const handleTriggerSettlement = async () => {
    setErrorMsg('');
    setSuccessMsg('');
    try {
      const response = await axios.post('/api/partners/admin/settle');
      if (response.data?.success) {
        setSuccessMsg(response.data.message || "Manual settlement sweeps check completed.");
        fetchAdminState();
      }
    } catch (error) {
      setErrorMsg("Trigger settlement error: " + (error.response?.data?.error || error.message));
    }
  };

  const applications = partners.filter(p => p.status === 'pending');
  const approvedPartners = partners.filter(p => p.status === 'approved');

  return (
    <div id="admin_portal_root" className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <h1 className="text-xl font-black text-slate-900 flex items-center gap-2 tracking-tight">
            <span>Partners</span>
           
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">Manage partner listings, adjust ledger reserves, authorize payouts, and disburse event revenues.</p>
        </div>

        <button
          id="btn_admin_refresh"
          onClick={fetchAdminState}
          className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors"
        >
          <RefreshCw className="w-4 h-4 text-slate-500" />
        </button>
      </div>

      {successMsg && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-100 text-emerald-800 text-xs font-bold rounded-xl shadow-sm">
          {successMsg}
        </div>
      )}

      {errorMsg && (
        <div className="p-3.5 bg-rose-50 border border-rose-105 text-rose-800 text-xs font-bold rounded-xl shadow-sm">
          {errorMsg}
        </div>
      )}

      {/* Settlement Engine triggers */}
      <div className="bg-blue-50  rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-extrabold flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            <span>Co-Host Event Settlement Desk</span>
          </h3>
          <p className="text-[11px] mt-1 max-w-xl leading-relaxed">
            Platform ticket booking commissions remain pending in escrow ledger states until event dates complete.
            Click below to instantly trigger the **Settlement Engine** to evaluate past event sales and disburse cleared funds to partner wallets.
          </p>
        </div>
        <button
          id="btn_trigger_settlement_now"
          onClick={handleTriggerSettlement}
          className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs rounded-xl shadow-md transition-colors whitespace-nowrap active:scale-95"
        >
          Trigger Settlement Engine
        </button>
      </div>

      {/* Controls panel Tab Switches */}
      <div className="flex border-b border-slate-100 gap-2 overflow-x-auto text-sm font-bold text-slate-400">
        <button
          id="tab_opt_apps"
          onClick={() => setActiveTab('applications')}
          className={`pb-3.5 px-4 border-b-2 transition-all ${activeTab === 'applications' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500'}`}
        >
          Enrolment Applications ({applications.length})
        </button>
        <button
          id="tab_opt_partners"
          onClick={() => setActiveTab('partners')}
          className={`pb-3.5 px-4 border-b-2 transition-all ${activeTab === 'partners' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500'}`}
        >
          Co-Host Directory ({approvedPartners.length})
        </button>
        <button
          id="tab_opt_payouts"
          onClick={() => setActiveTab('payouts')}
          className={`pb-3.5 px-4 border-b-2 transition-all ${activeTab === 'payouts' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500'}`}
        >
          Bank Wire Requests ({payouts.filter(p => p.status === 'pending').length} pending)
        </button>
      </div>

      {/* Tab: Applications queue */}
      {activeTab === 'applications' && (
        <div id="panel_applications" className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-50 flex items-center justify-between">
            <h3 className="font-bold text-slate-800 text-sm">Escrow Application Evaluation Queue</h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-650 border-collapse">
              <thead>
                <tr className="bg-slate-50/75 border-b border-slate-100 font-bold text-slate-400 text-[10px] uppercase tracking-wide">
                  <th className="px-6 py-3">Applicant Company</th>
                  <th className="px-6 py-3">Tax verification (EIN)</th>
                  <th className="px-6 py-3">Contact</th>
                  <th className="px-6 py-3">Platform share coeff</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {applications.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-10 text-center text-slate-400">
                      No pending partner applications in the verification queue.
                    </td>
                  </tr>
                ) : (
                  applications.map((app) => (
                    <tr id={`app_row_${app._id}`} key={app._id} className="hover:bg-slate-50/50">
                      <td className="px-6 py-4">
                        <p className="font-bold text-slate-800">{app.companyName}</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">{app.description || 'No description supplied'}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-mono bg-slate-100 px-2 py-0.5 rounded font-bold text-slate-600">{app.taxInfo}</span>
                      </td>
                      <td className="px-6 py-4">
                        <p>{app.contactPerson}</p>
                        <p className="text-[10px] text-slate-400 font-mono mt-0.5">{app.email} • {app.phone}</p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1">
                          <input
                            id={`input_share_pct_${app._id}`}
                            type="number"
                            defaultValue={app.revenueSharePercentage || 30}
                            min="5"
                            max="90"
                            className="w-12 px-2 py-1 border border-slate-200 rounded text-center text-xs font-bold"
                          />
                          <span className="font-bold text-slate-500">%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right flex justify-end gap-2 mt-2">
                        <button
                          id={`btn_reject_app_${app._id}`}
                          onClick={() => handleRejectPartner(app._id)}
                          className="p-1 px-2.5 rounded bg-rose-50 text-rose-600 border border-rose-100 hover:bg-rose-100 flex items-center gap-1 font-bold transition-all text-[11px]"
                        >
                          <X className="w-3.5 h-3.5" />
                          <span>Reject</span>
                        </button>
                        <button
                          id={`btn_approve_app_${app._id}`}
                          onClick={() => {
                            const val = document.getElementById(`input_share_pct_${app._id}`)?.value || 30;
                            handleApprovePartner(app._id, Number(val));
                          }}
                          className="p-1 px-2.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-100 hover:bg-emerald-100 flex items-center gap-1 font-bold transition-all text-[11px]"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Approve</span>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: Approved Directory */}
      {activeTab === 'partners' && (
        <div id="panel_directory" className="space-y-6">
          <div className="flex justify-between items-center bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
            <div>
              <h3 className="font-bold text-slate-800 text-sm">Co-Host Directory Registry</h3>
              <p className="text-slate-400 text-xs mt-0.5">Adjust ratios, credit/debit active balances manually, and bind ticket operators.</p>
            </div>
            <button
              id="btn_toggle_add_manual"
              onClick={() => setShowAddForm(!showAddForm)}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-slate-900 border border-slate-800 text-white hover:text-white font-bold text-xs rounded-xl"
            >
              <UserPlus className="w-4 h-4" />
              <span>Onboard Partner Manually</span>
            </button>
          </div>

          {/* Manual onboard form disclosure */}
          {showAddForm && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-md max-w-2xl">
              <h3 className="font-extrabold text-slate-800 text-sm mb-4 flex items-center gap-2">
                <PlusCircle className="w-4.5 h-4.5 text-blue-600" />
                <span>Onboard Approved Partner (Skip verification)</span>
              </h3>
              <form onSubmit={handleAddPartnerSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">Company legal name</label>
                    <input
                      id="manual_company_name"
                      type="text"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="e.g. Paramount Shows"
                      className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg text-slate-705 font-medium"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">Primary Representative</label>
                    <input
                      id="manual_contact_person"
                      type="text"
                      value={contactPerson}
                      onChange={(e) => setContactPerson(e.target.value)}
                      placeholder="e.g. Dwight Schrute"
                      className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg text-slate-705 font-medium"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">Email</label>
                    <input
                      id="manual_email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg text-slate-705 font-medium font-mono"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">Tax EIN Code</label>
                    <input
                      id="manual_tax_info"
                      type="text"
                      value={taxInfo}
                      onChange={(e) => setTaxInfo(e.target.value)}
                      className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg text-slate-705 font-medium font-mono"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">Phone</label>
                    <input
                      id="manual_phone"
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg text-slate-705"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">Co-Host commission split %</label>
                    <input
                      id="manual_share_pct"
                      type="number"
                      value={sharePct}
                      onChange={(e) => setSharePct(Number(e.target.value))}
                      className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg text-slate-705 font-bold"
                      required
                    />
                  </div>
                </div>
                <div className="flex gap-2 text-xs pt-1">
                  <button
                    id="btn_cancel_manual_add"
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="px-4 py-2 border rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    id="btn_submit_manual_add"
                    type="submit"
                    className="px-4 py-2 bg-slate-900 text-white font-bold rounded-lg hover:bg-slate-800"
                  >
                    Onboard Partner
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Directory Listings table */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <table className="w-full text-left text-xs text-slate-600 border-collapse">
              <thead>
                <tr className="bg-slate-50/75 border-b border-slate-100 font-bold text-slate-400 text-[10px] uppercase tracking-wide">
                  <th className="px-6 py-3">Partner Details</th>
                   <th className="px-6 py-3">Email</th>
                  <th className="px-6 py-3 text-center">Share Ratio</th>
                  <th className="px-6 py-3 text-right">Wallet aggregates</th>
                 
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {approvedPartners.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-10 text-center text-slate-400">
                      No approved co-hosts found.
                    </td>
                  </tr>
                ) : (
                  approvedPartners.map((part) => (
                    <tr id={`dir_row_${part._id}`} key={part._id} className="hover:bg-slate-50/50">
                      <td className="px-6 py-4">
                        <div
                          onClick={() => navigate(`/admin/partner/${part._id}`)}
                          className="cursor-pointer group"
                        >
                          <p className="font-bold text-slate-800 group-hover:text-blue-600 transition-colors flex items-center gap-1">
                            {part.companyName}

                            <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-all" />
                          </p>

                          <p className="text-[10px] text-slate-400 mt-0.5">
                            {part.contactPerson} • {part.phone}
                          </p>
                        </div>
                      </td>
                       <td className="px-6 py-4">
                       
                        <p className="text-[10px] text-slate-400 font-mono mt-0.5">{part.email}</p>
                      </td>
                      <td className="px-6 py-4 text-center font-bold text-slate-700">
                        {part.revenueSharePercentage}%
                      </td>
                      <td className="px-6 py-4 text-right">
                        <p className="font-bold text-emerald-600 font-mono">+${Number(part.wallet?.redeemableEarnings || 0).toFixed(2)} redeemable</p>
                        <p className="text-[10px] text-slate-400 font-mono">Pending: ${Number(part.wallet?.pendingEarnings || 0).toFixed(2)} • Out: ${Number(part.wallet?.withdrawnAmount || 0).toFixed(2)}</p>
                      </td>
                     
                      <td className="px-6 py-4 text-right flex justify-end gap-2 mt-1">
                        <button
                          id={`btn_open_adjust_${part._id}`}
                          onClick={() => {
                            setAdjustingPartnerId(part._id);
                            // default description
                            setAdjustDesc(`Administrative wallet adjustment credit/debit`);
                          }}
                          className="p-1 px-2 rounded border border-slate-200 hover:bg-slate-50 text-blue-600 font-bold text-[10px]"
                        >
                          $ Adjust Wallet
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Interactive wallet balance adjustment inline panel */}
          {adjustingPartnerId && (
            <div className="bg-slate-900 text-white rounded-2xl p-6 border border-slate-750 max-w-xl animate-fade-in">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                <h4 className="font-bold text-xs flex items-center gap-1.5 uppercase text-amber-400">
                  <Sliders className="w-4 h-4" />
                  <span>Wallet Cash Adjust Ledger</span>
                </h4>
                <button onClick={() => setAdjustingPartnerId('')} className="text-slate-400 hover:text-white">
                  <X className="w-4.5 h-4.5" />
                </button>
              </div>

              <form onSubmit={handleAdjustWalletSubmit} className="space-y-4 text-slate-800">
                <div className="grid grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">Adjustment Action</label>
                    <select
                      id="adjust_action_type"
                      value={adjustType}
                      onChange={(e) => setAdjustType(e.target.value)}
                      className="w-full text-xs px-3.5 py-2.5 bg-white border border-slate-700/50 rounded-xl focus:outline-none"
                    >
                      <option value="credit">Credit (+) Add cash</option>
                      <option value="debit">Debit (-) Take cash</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">Adjustment value (USD)</label>
                    <div className="relative">
                      <input
                        id="adjust_action_amount"
                        type="number"
                        step="0.01"
                        value={adjustAmount}
                        onChange={(e) => setAdjustAmount(e.target.value)}
                        placeholder="0.00"
                        className="w-full text-xs pl-7 pr-3 py-2.5 bg-white border border-slate-700/50 rounded-xl focus:outline-none font-mono"
                        required
                      />
                      <DollarSign className="absolute left-2 top-3 w-4 h-4 text-slate-400" />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">Reason / Description logs</label>
                  <input
                    id="adjust_action_reason"
                    type="text"
                    value={adjustDesc}
                    onChange={(e) => setAdjustDesc(e.target.value)}
                    placeholder="Provide detailed description explaining adjustment audit"
                    className="w-full text-xs px-3.5 py-2.5 bg-white border border-slate-700/50 rounded-xl focus:outline-none"
                    required
                  />
                </div>

                <div className="flex gap-2 pt-1 text-xs text-white">
                  <button type="button" onClick={() => setAdjustingPartnerId('')} className="px-4.5 py-2 border border-slate-700 hover:bg-slate-800 rounded-xl text-slate-400">
                    Cancel
                  </button>
                  <button type="submit" className="px-5 py-2 bg-blue-600 hover:bg-blue-500 font-bold rounded-xl shadow-md">
                    Commit Wallet Change
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      )}

      {/* Tab: Payout processing */}
      {activeTab === 'payouts' && (
        <div id="panel_payouts" className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden animate-fade-in">
          <div className="px-6 py-4 border-b border-slate-50">
            <h3 className="font-bold text-slate-800 text-sm">Payout Requests Wire Clearing Desk</h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600 border-collapse">
              <thead>
                <tr className="bg-slate-50/75 border-b border-slate-100 font-bold text-slate-400 text-[10px] uppercase tracking-wide">
                  <th className="px-6 py-3">Applicant Co-Host</th>
                  <th className="px-6 py-3">Requested amount</th>
                  <th className="px-6 py-3">Settlement Banking coordinates</th>
                  <th className="px-6 py-3">Wire status</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {payouts.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-10 text-center text-slate-400">
                      No payout records logged in clearing board files.
                    </td>
                  </tr>
                ) : (
                  payouts.map((pay) => {
                    const partnerObj = partners.find(p => p._id === pay.partnerId) || {};
                    return (
                      <tr id={`p_row_${pay._id}`} key={pay._id} className="hover:bg-slate-50/30">
                        <td className="px-6 py-4">
                          <p className="font-bold text-slate-800">{partnerObj.companyName || 'Unknown Partner'}</p>
                          <p className="text-[10px] text-slate-400 mt-0.5">{partnerObj.email}</p>
                        </td>
                        <td className="px-6 py-4 font-black text-slate-800 font-mono text-sm">
                          ${pay.amount.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 font-medium">
                          <p className="text-slate-705 font-bold">{pay.paymentDetails?.bankName}</p>
                          <p className="text-[10px] text-slate-400 font-mono">Account: {pay.paymentDetails?.accountNumber} • Routing: {pay.paymentDetails?.routingNumber}</p>
                          <p className="text-[10px] text-slate-500">Holder: {pay.paymentDetails?.holderName}</p>
                        </td>
                        <td className="px-6 py-4">
                          {pay.status === 'approved' ? (
                            <span className="inline-flex px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
                              Approved & Wired
                            </span>
                          ) : pay.status === 'rejected' ? (
                            <span className="inline-flex px-2 py-0.5 rounded-full text-[9px] font-bold bg-rose-50 text-rose-700 border border-rose-100">
                              Rejected
                            </span>
                          ) : (
                            <span className="inline-flex px-2 py-0.5 rounded-full text-[9px] font-bold bg-amber-50 text-amber-700 border border-amber-100">
                              Awaiting Settlement Check
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right flex justify-end gap-2 mt-4 select-none">
                          {pay.status === 'pending' ? (
                            <>
                              <button
                                id={`btn_reject_payout_${pay._id}`}
                                onClick={() => handleProcessPayout(pay._id, 'rejected')}
                                className="p-1 px-2 rounded hover:bg-slate-100 text-rose-600 font-bold border border-slate-200"
                              >
                                Reject
                              </button>
                              <button
                                id={`btn_approve_payout_${pay._id}`}
                                onClick={() => handleProcessPayout(pay._id, 'approved')}
                                className="p-1 px-2 rounded bg-blue-600 hover:bg-blue-500 text-white font-extrabold shadow"
                              >
                                Authorize Wire
                              </button>
                            </>
                          ) : (
                            <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider">{pay.processedAt ? new Date(pay.processedAt).toLocaleDateString() : 'Historical'}</span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
