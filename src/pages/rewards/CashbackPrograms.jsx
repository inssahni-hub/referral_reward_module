import React, { useState, useEffect } from 'react';
import axiosReq from "@/request/axiosReq";
import { ToggleLeft, ToggleRight, Settings, Plus, Play, CheckCircle, HelpCircle, ArrowRight, ShieldCheck, Flame } from 'lucide-react';
import CashbackProgramForm from '../../components/rewards/CashbackProgramForm.jsx';

export default function CashbackPrograms() {
  const [organisers, setOrganisers] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [activeProgram, setActiveProgram] = useState(null); // program currently being edited
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [errorText, setErrorText] = useState(null);

  const [cronMessage, setCronMessage] = useState(null);
  const [isCronRunning, setIsCronRunning] = useState(false);

  const loadContext = async () => {
    try {
      setIsLoading(true);
      setErrorText(null);

      const res = await axiosReq.get(
        "/api/cashback/programs"
      );

      if (res?.data?.success) {
        setOrganisers(
          res?.data?.data?.organisers || []
        );

        setPrograms(
          res?.data?.data?.programs || []
        );
      } else {
        setErrorText(
          res?.data?.error ||
          "Failed to read organizer programs list"
        );
      }
    } catch (err) {
      console.error(err);

      setErrorText(
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Server unreachable"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const triggerManualCron = async () => {
    try {
      setIsCronRunning(true);
      setCronMessage(null);

      const res = await axiosReq.post(
        "/api/cashback/cleanup"
      );

      if (res?.data?.success) {
        setCronMessage(
          `Success! Expired credits voided: ${res.data.data.expiredTransactionsCount || 0
          }, Wallets checked: ${res.data.data.walletsAdjustedCount || 0
          }`
        );

        await loadContext();
      } else {
        setCronMessage(
          "Settle failed: " +
          (res?.data?.error || "Unknown error")
        );
      }
    } catch (err) {
      console.error(err);

      setCronMessage(
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Error contacting cron cleanup"
      );
    } finally {
      setIsCronRunning(false);
    }
  };

  useEffect(() => {
    loadContext();
  }, []);

  const handleProgramSaved = (savedProgram) => {
    // Refresh program lists
    loadContext();
    setActiveProgram(null);
    setIsFormOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
            <Settings className="w-5 h-5 text-emerald-600" /> Reward Rules & Campaigns Studio
          </h2>
          <p className="text-xs text-gray-400">
            Define incentive programs, customize min purchases, configure cap filters, and adjust credit retention timelines.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 shrink-0">
          <button
            onClick={triggerManualCron}
            disabled={isCronRunning}
            className="text-xs bg-amber-50 hover:bg-amber-100/80 active:bg-amber-200 border border-amber-200 text-amber-800 font-semibold py-2 px-3.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
          >
            <Flame className="w-4 h-4 text-amber-500 shrink-0" />
            {isCronRunning ? 'Cleaning...' : 'Trigger Settlement Run'}
          </button>

          <button
            onClick={() => {
              setActiveProgram(null);
              setIsFormOpen(!isFormOpen);
            }}
            className="text-xs bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-semibold py-2 px-3.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 shrink-0" />
            {isFormOpen ? 'Close Editor' : 'Create Campaign'}
          </button>
        </div>
      </div>

      {cronMessage && (
        <div className="p-3 bg-amber-50 border border-amber-100 rounded-lg text-amber-850 font-medium text-xs flex items-center gap-2 animate-fadeIn font-mono">
          <ShieldCheck className="w-4 h-4 text-amber-600" />
          {cronMessage}
        </div>
      )}

      {errorText && (
        <div className="p-4 bg-rose-50 text-rose-800 text-xs rounded-xl border border-rose-100 font-mono">
          Error: {errorText}
        </div>
      )}

      {/* Editor Panel Grid split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className={`lg:col-span-2 space-y-6`}>
          {/* Active programs listings table */}
          <div className="bg-white border border-gray-100 rounded-xl shadow-xs overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-50 bg-gray-50/40 flex justify-between items-center">
              <h3 className="text-sm font-semibold text-gray-800">Deployed Reward Guidelines</h3>
              <span className="text-xs text-gray-400 font-mono">{programs.length} active configurations</span>
            </div>

            {isLoading ? (
              <div className="p-8 text-center animate-pulse space-y-3">
                <div className="h-4 bg-gray-200 rounded w-1/3 mx-auto"></div>
                <div className="h-10 bg-gray-100 rounded w-full"></div>
              </div>
            ) : programs.length === 0 ? (
              <div className="p-8 text-center bg-white border border-gray-100 rounded-xl space-y-1">
                <Settings className="w-8 h-8 text-gray-300 mx-auto" />
                <h4 className="text-gray-700 font-semibold text-sm">No Reward Programs Created</h4>
                <p className="text-xs text-gray-400 mt-0.5">Deploy your first cashback guidelines using the button or form right away!</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50/20 text-[10.2px] font-bold text-gray-400 uppercase tracking-wider">
                      <th className="py-3 px-5">Event</th>
                      <th className="py-3 px-5">Rule Rate</th>
                      <th className="py-3 px-5">Eligibility (Min Purchase)</th>
                      <th className="py-3 px-5">Caps</th>
                      <th className="py-3 px-5">Retention Period</th>
                      <th className="py-3 px-5">Status</th>
                      <th className="py-3 px-5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 text-xs">
                    {programs.map((prog) => {
                      
                      const hasSpecificExpiry = prog.expiryDate || prog.expiryDays;

                      return (
                        <tr key={prog._id} className="hover:bg-gray-50/70 transition-colors">
                          <td className="py-4 px-5">
                            <span className="font-semibold text-gray-800 line-clamp-1">{prog?.eventId?.title}</span>
                            <span className="text-[10px] text-gray-400 font-mono italic">Organiser: {prog?.organiserId?.name}</span>
                          </td>
                          <td className="py-4 px-5">
                            <span className="font-bold text-gray-900">
                              {prog.cashbackType === 'percentage' ? `${prog.value}%` : `$${prog.value}`}
                            </span>
                          </td>
                          <td className="py-4 px-5">
                            <span className="text-gray-600">orders &gt;= ${prog.minPurchase}</span>
                          </td>
                          <td className="py-4 px-5">
                            <span className="text-gray-500 font-mono">
                              {prog.maxCashback ? `$${prog.maxCashback}` : 'Unlimited'}
                            </span>
                          </td>
                          <td className="py-4 px-5 max-w-[130px] line-clamp-2 mt-2.5">
                            <span className="text-gray-500">
                              {prog.expiryDays ? `${prog.expiryDays} Days` : (prog.expiryDate ? new Date(prog.expiryDate).toLocaleDateString() : 'Forever Credit')}
                            </span>
                          </td>
                          <td className="py-4 px-5">
                            {prog.enabled ? (
                              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full">
                                ACTIVE
                              </span>
                            ) : (
                              <span className="text-[10px] font-bold text-gray-400 bg-gray-100 border border-gray-200 px-2 py-0.5 rounded-full">
                                INACTIVE
                              </span>
                            )}
                          </td>
                          <td className="py-4 px-5 text-right">
                            <button
                              onClick={() => {
                                setActiveProgram(prog);
                                setIsFormOpen(true);
                              }}
                              className="text-emerald-600 font-bold hover:text-emerald-700 active:text-emerald-800 transition-colors cursor-pointer text-xs"
                            >
                              Edit Rules
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Configurations Form split */}
        <div className="lg:col-span-1">
          {isFormOpen || activeProgram ? (
            <div className="transition-all animate-fadeIn">
              <CashbackProgramForm
                organisers={organisers}
                activeProgram={activeProgram}
                onProgramSaved={handleProgramSaved}
              />
            </div>
          ) : (
            <div className="bg-emerald-50 border border-dashed border-emerald-200 rounded-xl p-6 text-center space-y-4">
              <div className="bg-white border border-emerald-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto text-emerald-600">
                <Settings className="w-5 h-5 animate-spin" style={{ animationDuration: '6s' }} />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-emerald-800">Create New Guideline Programs</h4>
                <p className="text-xs text-emerald-700/80">
                  Select promoter properties, establish maximum cap rates, enable expiry settings, and publish active rules instantly.
                </p>
              </div>
              <button
                onClick={() => {
                  setActiveProgram(null);
                  setIsFormOpen(true);
                }}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
              >
                Launch Creation Wizard
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
