import React, { useState, useEffect } from 'react';
import axiosReq from "@/request/axiosReq";
import { BarChart3, TrendingUp, HelpCircle, Activity, Landmark, Ticket } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import CashbackFilters from '../../components/rewards/CashbackFilters.jsx';
import CashbackStatsCards from '../../components/rewards/CashbackStatsCards.jsx';
import CashbackAnalyticsTable from '../../components/rewards/CashbackAnalyticsTable.jsx';

export default function CashbackAnalytics({ originalOrganisers = [] }) {
  // Let organizers select who they are logging in as to simulate multi-promoter options!
  const [selectedOrganiserId, setSelectedOrganiserId] = useState('69bbe50b5ae4ab424b54daf0');
  const [filterType, setFilterType] = useState('all');
  const [selectedEventId, setSelectedEventId] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const [analytics, setAnalytics] = useState({ totalDistributed: 0, totalRedeemed: 0, liability: 0, eventWiseStats: [], trend: [] });
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorText, setErrorText] = useState(null);

  // Fetch initial events and promoters lists to pass to filters
  const loadFilterContext = async () => {
    try {
      const res = await axiosReq.get(
        "/api/cashback/events"
      );

      if (res?.data?.success) {
        const filteredEvents =
          res.data.data.events.filter(
            (event) =>
              event.organiserId === selectedOrganiserId
          );

        setEvents(filteredEvents);
      }
    } catch (err) {
      console.error(
        "Error fetching event contexts:",
        err
      );
    }
  };

  const fetchAnalytics = async () => {
    try {
      setIsLoading(true);
      setErrorText(null);

      const params = {
        organiserId: selectedOrganiserId,
        filterType,
        eventId: selectedEventId,
      };

      if (filterType === "custom") {
        if (startDate) {
          params.startDate = startDate;
        }

        if (endDate) {
          params.endDate = endDate;
        }
      }

      const res = await axiosReq.get(
        "/api/cashback/analytics",
        {
          params,
        }
      );

      if (res?.data?.success) {
        setAnalytics(res.data.data);
      } else {
        setErrorText(
          res?.data?.error ||
          "Failed to read analytics payload"
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

  useEffect(() => {
    loadFilterContext();
  }, [selectedOrganiserId]);

  useEffect(() => {
    fetchAnalytics();
  }, [
    selectedOrganiserId,
    filterType,
    selectedEventId,
    startDate,
    endDate,
  ]);

  return (
    <div className="space-y-6">
      {/* Title block with promoter simulator select */}
      <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-xs flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-emerald-600" /> Promoter Analytics Workspace
          </h2>
          <p className="text-xs text-gray-400">
            Monitor real-time cashback obligations, customer conversions, and event performance ratios.
          </p>
        </div>

        {/* Switch identity toggle to simulate multiple promoters */}
        <div className="hidden flex items-center gap-2 bg-gray-50 p-2 border border-gray-200 rounded-lg select-none shrink-0 w-full sm:w-auto">
          <span className="text-xs font-semibold text-gray-500 whitespace-nowrap pl-1 pl-1.5 flex items-center gap-1">
            <Landmark className="w-3.5 h-3.5" /> Simulation Identity:
          </span>
          <select
            id="simulation-organiser-select"
            value={selectedOrganiserId}
            onChange={(e) => {
              setSelectedOrganiserId(e.target.value);
              setSelectedEventId('all'); // reset events when organizer changes
            }}
            className="text-xs bg-white border border-gray-200 rounded py-1 px-2.5 font-bold font-mono text-emerald-700"
          >
            <option value="org_rock_nation">Rock Nation Events</option>
            <option value="org_jazz_club">Classic Jazz Club</option>
          </select>
        </div>
      </div>

      {errorText && (
        <div className="p-4 bg-rose-50 text-rose-800 text-xs rounded-xl border border-rose-100 font-mono">
          Error: {errorText}
        </div>
      )}

      {/* Primary Statistics cards layout */}
      <CashbackStatsCards stats={analytics} isLoading={isLoading} />

      {/* Filter and timeline selectors */}
      <CashbackFilters
        filterType={filterType}
        setFilterType={setFilterType}
        selectedEventId={selectedEventId}
        setSelectedEventId={setSelectedEventId}
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
        events={events}
        onRefresh={fetchAnalytics}
      />

      {/* Analytic visual layout split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Trend chart using recharts */}
        <div className="lg:col-span-2 bg-white border border-gray-100 rounded-xl p-5 shadow-xs space-y-4">
          <div className="space-y-1">
            <h3 className="text-sm font-semibold text-gray-800 flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-emerald-600 animate-pulse" /> Earned vs Redeemed Reward Trends
            </h3>
            <p className="text-[11px] text-gray-400">Activity increments logged per date period</p>
          </div>

          <div id="analytics-trend-chart-container" className="h-[280px]">
            {!isLoading && analytics?.trend?.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={analytics.trend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorEarned" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorRedeemed" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                  <XAxis dataKey="date" stroke="#9ca3af" fontSize={11} strokeWidth={0.5} tickLine={false} />
                  <YAxis stroke="#9ca3af" fontSize={11} strokeWidth={0.5} tickLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #f3f4f6', fontSize: '11px' }}
                    labelClassName="font-semibold text-gray-800"
                  />
                  <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                  <Area type="monotone" name="Incentives Issued ($)" dataKey="earned" stroke="#10b981" fillOpacity={1} fill="url(#colorEarned)" strokeWidth={2.5} />
                  <Area type="monotone" name="Incentives Redeemed ($)" dataKey="redeemed" stroke="#f59e0b" fillOpacity={1} fill="url(#colorRedeemed)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            ) : isLoading ? (
              <div className="h-full flex items-center justify-center bg-gray-50 rounded-lg animate-pulse">
                <span className="text-xs text-gray-400">Loading trend visuals...</span>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center p-6 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                <Activity className="w-8 h-8 text-gray-300 stroke-1" />
                <span className="text-xs text-gray-400 mt-2">No timeline activity to represent graph indicators</span>
              </div>
            )}
          </div>
        </div>

        {/* Info panel / constraints overview */}
        <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-xs flex flex-col justify-between gap-4">
          <div className="space-y-4">
            <div className="space-y-1">
              <h3 className="text-sm font-semibold text-gray-800">Operational Guideline Highlights</h3>
              <p className="text-[11px] text-gray-400">Compliance & settlement parameters</p>
            </div>

            <div className="space-y-3.5 text-xs">
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-md bg-emerald-50 text-emerald-600 font-mono font-bold flex items-center justify-center shrink-0">
                  1
                </span>
                <p className="text-gray-600 leading-normal">
                  <strong>Atomic Balance Deductions</strong>: Reward usages are deducted immediately from buyer wallets on checkouts, locked with transaction order tokens for security.
                </p>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-md bg-amber-50 text-amber-600 font-mono font-bold flex items-center justify-center shrink-0">
                  2
                </span>
                <p className="text-gray-600 leading-normal">
                  <strong>Non-transferable Bounds</strong>: Cashback are generated specific to your organization database. Cross-organizer transactions are programmatically restricted.
                </p>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-md bg-rose-50 text-rose-600 font-mono font-bold flex items-center justify-center shrink-0">
                  3
                </span>
                <p className="text-gray-600 leading-normal">
                  <strong>Expiry Automation Logs</strong>: Settlement and daily cron jobs automatically monitor and expire outdated credit logs to clean liabilities.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-emerald-50 border border-emerald-100/50 rounded-lg p-3 text-[10.5px] text-emerald-800 space-y-1.5">
            <span className="font-bold flex items-center gap-1">
              <Ticket className="w-4 h-4 text-emerald-600 animate-bounce" /> Current Liability Rate
            </span>
            <p>
              Your liability represents total outstanding claims across all valid buyer wallets (${Number(analytics.liability).toFixed(2)}). Ensure sufficient funding for ticket settle.
            </p>
          </div>
        </div>
      </div>

      {/* Event list performance table */}
      <CashbackAnalyticsTable eventWiseStats={analytics.eventWiseStats} isLoading={isLoading} />
    </div>
  );
}
