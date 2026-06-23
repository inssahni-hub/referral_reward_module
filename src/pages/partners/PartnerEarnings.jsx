import React, { useState, useEffect } from 'react';
import axios from "@/request/axiosReq";
import PartnerFilters from '../../components/partners/PartnerFilters.jsx';
import PartnerEarningsTable from '../../components/partners/PartnerEarningsTable.jsx';
import { Award, ArrowLeft, RefreshCw, FileSpreadsheet } from 'lucide-react';

export default function PartnerEarnings({ partnerId, onBackToDashboard }) {
  const [earnings, setEarnings] = useState([]);
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  // Filter States
  const [activeFilter, setActiveFilter] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedEventId, setSelectedEventId] = useState('');

  // Fetch unique event configurations to populate event-wise selectors
  const fetchUniqueEvents = async () => {
    if (!partnerId) return;
    try {
      const response = await axios.get(`/api/partners/dashboard?partnerId=${partnerId}`);
      if (response.data?.analytics?.eventsList) {
        setEvents(response.data.analytics.eventsList);
      }
    } catch (err) {
      console.warn("Failed to prefetch filter event lists:", err);
    }
  };

  const fetchEarningsData = async () => {
    if (!partnerId) return;
    setIsLoading(true);
    setErrorMsg('');
    try {
      let url = `/api/partners/earnings?partnerId=${partnerId}`;
      if (activeFilter !== 'all') {
        url += `&filter=${activeFilter}`;
      }
      if (activeFilter === 'custom') {
        if (startDate) url += `&startDate=${startDate}`;
        if (endDate) url += `&endDate=${endDate}`;
      }
      if (selectedEventId) {
        url += `&eventId=${selectedEventId}`;
      }

      const response = await axios.get(url);
      if (response.data?.success) {
        setEarnings(response.data.earnings || []);
      }
    } catch (error) {
      console.error("Fetch Earnings Error:", error);
      setErrorMsg(error.response?.data?.error || "Failed to fetch matching earnings record ledger.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUniqueEvents();
  }, [partnerId]);

  useEffect(() => {
    fetchEarningsData();
  }, [partnerId, activeFilter, startDate, endDate, selectedEventId]);

  const handleClearFilters = () => {
    setActiveFilter('all');
    setStartDate('');
    setEndDate('');
    setSelectedEventId('');
  };

  return (
    <div id="partner_earnings_page" className="space-y-6">
      {/* Header navbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div className="flex items-center gap-3">
          <button
            id="btn_back_earnings"
            onClick={onBackToDashboard}
            className="p-2 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-slate-500" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <span>Commission Settlement Ledgers</span>
              <span className="p-1 px-2.2 text-[9px] font-bold bg-emerald-50 text-emerald-700 rounded-full border border-emerald-100 uppercase tracking-widest leading-none">
                Share ledger
              </span>
            </h1>
            <p className="text-slate-500 text-xs mt-0.5">Filter, audit, and inspect ticket booking fee share payouts credited to your co-host wallet.</p>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            id="btn_refresh_earnings"
            onClick={fetchEarningsData}
            className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-500 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            id="btn_export_earnings"
            onClick={() => alert("CSV Export feature initialized! (Mocked download initiated successfully).")}
            className="hidden inline-flex items-center gap-1.5 px-4.5 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 font-bold text-xs text-slate-700 transition-all active:scale-[0.98]"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {errorMsg && (
        <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl text-rose-600 text-xs font-semibold">
          {errorMsg}
        </div>
      )}

      {/* Embedded Advanced Filters component */}
      <PartnerFilters
        activeFilter={activeFilter}
        onChangeFilter={setActiveFilter}
        startDate={startDate}
        onChangeStartDate={setStartDate}
        endDate={endDate}
        onChangeEndDate={setEndDate}
        events={events}
        selectedEventId={selectedEventId}
        onChangeEventId={setSelectedEventId}
        onClearFilters={handleClearFilters}
      />

      {/* Table view */}
      <PartnerEarningsTable earnings={earnings} isLoading={isLoading} />
    </div>
  );
}
