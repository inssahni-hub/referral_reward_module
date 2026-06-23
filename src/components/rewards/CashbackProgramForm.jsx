import React, { useState, useEffect } from 'react';
import { Percent, DollarSign, Calendar, ToggleLeft, ToggleRight, Sparkles, HelpCircle, Save, Info } from 'lucide-react';
import EventSelect from '../common/EventSelect';
import axios from "@/request/axiosReq";

export default function CashbackProgramForm({
  organisers = [],
  onProgramSaved,
  activeProgram = null
}) {
  const [selectedOrganiser, setSelectedOrganiser] = useState('');
  const [selectedEventId, setSelectedEventId] = useState("");
  const [enabled, setEnabled] = useState(true);
  const [cashbackType, setCashbackType] = useState('percentage');
  const [value, setValue] = useState('');
  const [minPurchase, setMinPurchase] = useState('0');
  const [maxCashback, setMaxCashback] = useState('');
  const [expiryDays, setExpiryDays] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [rules, setRules] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [errorText, setErrorText] = useState(null);

  // Sync if editing
  useEffect(() => {
    if (activeProgram) {
      setSelectedOrganiser(activeProgram.organiserId || '');
      setEnabled(activeProgram.enabled !== false);
      setCashbackType(activeProgram.cashbackType || 'percentage');
      setValue(activeProgram.value || '');
      setMinPurchase(activeProgram.minPurchase || '0');
      setMaxCashback(activeProgram.maxCashback || '');
      setExpiryDays(activeProgram.expiryDays || '');
      setExpiryDate(activeProgram.expiryDate ? activeProgram.expiryDate.split('T')[0] : '');
      setRules(activeProgram.rules ? activeProgram.rules.join('\n') : '');
    } else {
      // Default to first organiser
      if (organisers.length > 0 && !selectedOrganiser) {
        setSelectedOrganiser(organisers[0]._id);
      }
    }
  }, [activeProgram, organisers]);

 const handleSubmit = async (e) => {
  e.preventDefault();

  setIsLoading(true);
  setMessage(null);
  setErrorText(null);

  try {
    /* Validation */
    if (!selectedEventId) {
      throw new Error("Please select an event");
    }

    if (!selectedOrganiser) {
      throw new Error("Please select an organiser");
    }

    if (!value || isNaN(value) || Number(value) <= 0) {
      throw new Error(
        "Please enter a valid credit rate/value greater than 0"
      );
    }

    const payload = {
      organiserId: selectedOrganiser,
      eventId: selectedEventId,
      enabled,
      cashbackType,
      value: Number(value),
      minPurchase: Number(minPurchase || 0),
      maxCashback: maxCashback
        ? Number(maxCashback)
        : null,
      expiryDays: expiryDays
        ? Number(expiryDays)
        : null,
      expiryDate: expiryDate
        ? new Date(expiryDate).toISOString()
        : null,
      rules: rules
        ? rules
            .split("\n")
            .filter((r) => r.trim() !== "")
        : [],
    };

    const { data } = await axios.post(
      "/api/cashback/program",
      payload
    );

    if (!data.success) {
      throw new Error(
        data.error ||
        "Failed to submit cashback rules."
      );
    }

    setMessage(
      "Cashback incentive program saved successfully!"
    );

    onProgramSaved?.(data.data);

    // Reset form for new entry
    if (!activeProgram) {
      setSelectedEventId("");
      setSelectedOrganiser("");

      setValue("");
      setMinPurchase("0");
      setMaxCashback("");
      setExpiryDays("");
      setExpiryDate("");
      setRules("");

      setEnabled(true);
      setCashbackType("percentage");
    }

  } catch (err) {
    console.error("Cashback Program Error:", err);

    setErrorText(
      err?.response?.data?.error ||
      err?.message ||
      "Failed to save cashback program."
    );
  } finally {
    setIsLoading(false);
  }
};

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-gray-100 rounded-xl shadow-xs overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-50 bg-gray-50/40">
        <h3 className="font-semibold text-gray-800 flex items-center gap-2 text-sm">
          <Sparkles className="w-4.5 h-4.5 text-emerald-600" />
          {activeProgram ? 'Modify Cashback Campaign' : 'Initiate New Cashback Campaign'}
        </h3>
      </div>

      <div className="p-6 space-y-5">
        {message && (
          <div className="p-3 bg-emerald-50 text-emerald-800 text-xs rounded-lg border border-emerald-100 font-medium">
            {message}
          </div>
        )}

        {errorText && (
          <div className="p-3 bg-rose-50 text-rose-800 text-xs rounded-lg border border-rose-100 font-medium font-mono">
            Error: {errorText}
          </div>
        )}

        {/* Selected Organiser */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Event</label>

          <EventSelect
            value={selectedEventId}
            onChange={(id, event) => {
              setSelectedEventId(id);
              setSelectedOrganiser(event?.organizerId || "");

            }}
          />
          <p className="text-[10px] text-gray-400">Campaign criteria are restricted to transactions by the designated promoter.</p>
        </div>

        {/* Check Enabled toggle */}
        <div className="flex items-center justify-between bg-gray-50/40 p-3 rounded-lg border border-gray-100">
          <div>
            <p className="text-xs font-semibold text-gray-700">Campaign Status Flag</p>
            <p className="text-[10px] text-gray-400">Activates or suspends reward calculations on ticketing checkouts.</p>
          </div>
          <button
            type="button"
            onClick={() => setEnabled(!enabled)}
            className="text-gray-600 focus:outline-none cursor-pointer"
          >
            {enabled ? (
              <span className="flex items-center text-emerald-600 text-xs font-semibold gap-1">
                Active <ToggleRight className="w-8 h-8" />
              </span>
            ) : (
              <span className="flex items-center text-gray-400 text-xs font-semibold gap-1">
                Paused <ToggleLeft className="w-8 h-8" />
              </span>
            )}
          </button>
        </div>

        {/* Choose Type */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Cashback Type</label>
            <select
              id="cashback-type-select"
              value={cashbackType}
              onChange={(e) => {
                setCashbackType(e.target.value);
                setValue('');
              }}
              className="w-full text-sm bg-gray-50 border border-gray-200 text-gray-700 py-2 px-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            >
              <option value="percentage">Percentage Reward (%)</option>
              <option value="fixed">Fixed Reward Amount ($)</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              {cashbackType === 'percentage' ? 'Reward Percentage' : 'Flat Credit Value'}
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                {cashbackType === 'percentage' ? <Percent className="w-3.5 h-3.5" /> : <DollarSign className="w-3.5 h-3.5" />}
              </span>
              <input
                id="cashback-value-input"
                type="number"
                step="any"
                placeholder={cashbackType === 'percentage' ? "e.g. 10" : "e.g. 15.00"}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="w-full text-sm bg-gray-50 border border-gray-200 text-gray-700 py-2 pl-9 pr-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>
          </div>
        </div>

        {/* Limits Block */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Min Event Purchase</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                <DollarSign className="w-3.5 h-3.5" />
              </span>
              <input
                id="min-purchase-input"
                type="number"
                placeholder="0"
                value={minPurchase}
                onChange={(e) => setMinPurchase(e.target.value)}
                className="w-full text-sm bg-gray-50 border border-gray-200 text-gray-700 py-2 pl-9 pr-3 rounded-lg focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1">
              Max Cashback Allowed <HelpCircle className="w-3 h-3 text-gray-300" title="Cap on earned cash amount per transaction" />
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                <DollarSign className="w-3.5 h-3.5" />
              </span>
              <input
                id="max-cashback-input"
                type="number"
                placeholder="Optional size cap"
                value={maxCashback}
                onChange={(e) => setMaxCashback(e.target.value)}
                className="w-full text-sm bg-gray-50 border border-gray-200 text-gray-700 py-2 pl-9 pr-3 rounded-lg focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Expiration Rules */}
        <div className="grid grid-cols-2 gap-4 border-t border-gray-50 pt-3">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Days to Expire</label>
            <input
              id="expiry-days-input"
              type="number"
              placeholder="e.g. 90 (days)"
              value={expiryDays}
              onChange={(e) => {
                setExpiryDays(e.target.value);
                setExpiryDate('');
              }}
              className="w-full text-sm bg-gray-50 border border-gray-200 text-gray-700 py-2 px-3 rounded-lg focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-gray-400" /> Hard Expiry Date
            </label>
            <input
              id="expiry-date-input"
              type="date"
              value={expiryDate}
              onChange={(e) => {
                setExpiryDate(e.target.value);
                setExpiryDays('');
              }}
              className="w-full text-sm bg-gray-50 border border-gray-200 text-gray-700 py-2 px-3 rounded-lg focus:outline-none"
            />
          </div>
        </div>

        {/* Helper Note */}
        <div className="text-[10px] text-emerald-700 bg-emerald-50 p-2.5 rounded-lg border border-emerald-100 flex items-start gap-1.5">
          <Info className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
          <span>If expiry days or a hard date limits are declared, reward logs will auto-expire. If left empty, credits persist indefinitely.</span>
        </div>

        {/* Terms Rules */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Campaign Explanations & Guidelines</label>
          <textarea
            id="campaign-rules-textarea"
            rows="2"
            placeholder="e.g. valid on premium entries&#10;only applies to first 100 entries"
            value={rules}
            onChange={(e) => setRules(e.target.value)}
            className="w-full text-xs font-mono bg-gray-50 border border-gray-200 text-gray-700 p-2.5 rounded-lg focus:outline-none"
          />
          <p className="text-[10px] text-gray-400">One condition block per text line.</p>
        </div>

        <button
          id="save-program-btn"
          type="submit"
          disabled={isLoading}
          className="w-full bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-semibold py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {isLoading ? 'Processing Save...' : 'Secure & Deploy Campaign'}
        </button>
      </div>
    </form>
  );
}
