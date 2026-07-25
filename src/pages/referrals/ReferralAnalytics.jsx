import React, { useState, useEffect } from 'react';
import axios from "@/request/axiosReq";
import { ChartSpline, RefreshCw, AlertTriangle, BarChart3 } from 'lucide-react';

import ReferralFilters from '@/components/referrals/ReferralFilters.jsx';
import ReferralStatsCards from '@/components/referrals/ReferralStatsCards.jsx';
import ReferralRevenueChart from '@/components/referrals/ReferralRevenueChart.jsx';
import ReferralAnalyticsTable from '@/components/referrals/ReferralAnalyticsTable.jsx';

export default function ReferralAnalytics() {
  const [filters, setFilters] = useState({
    timeFilter: 'this_month',
    startDate: '',
    endDate: '',
    eventId: '',
    referralCode: '',
    promoterEmail: ''
  });

  const [analyticsData, setAnalyticsData] = useState({
    stats: {
      ticketsSold: 0,
      revenueGenerated: 0,
      discountsGiven: 0,
      promoterCommissions: 0,
      organiserNetRevenue: 0,
      totalOrders: 0
    },
    chartData: [],
    eventsBreakdown: []
  });

  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      // Clean query and pass values
      const queryParams = {};
      if (filters.timeFilter) queryParams.timeFilter = filters.timeFilter;
      if (filters.timeFilter === 'custom') {
        if (filters.startDate) queryParams.startDate = filters.startDate;
        if (filters.endDate) queryParams.endDate = filters.endDate;
      }
      if (filters.eventId) queryParams.eventId = filters.eventId;
      if (filters.referralCode) queryParams.referralCode = filters.referralCode;
      if (filters.promoterEmail) queryParams.promoterEmail = filters.promoterEmail;

      const response = await axios.get('/api/referrals/analytics', { params: queryParams });
      setAnalyticsData(response.data);
    } catch (err) {
      console.error('Error fetching referral analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const handleApplyFilters = () => {
    fetchAnalytics();
  };

  const handleResetFilters = () => {
    const defaultFilters = {
      timeFilter: 'this_month',
      startDate: '',
      endDate: '',
      eventId: '',
      referralCode: '',
      promoterEmail: ''
    };
    setFilters(defaultFilters);
    // Explicitly refetch utilizing clear state references
    setLoading(true);
    axios.get('/api/referrals/analytics', { params: { timeFilter: 'this_month' } })
      .then(res => setAnalyticsData(res.data))
      .catch(e => console.error(e))
      .finally(() => setLoading(false));
  };

  return (
    <div className="space-y-6" id="referrals-analytics-page">
      {/* Banner */}
      {/* Page Header */}
      <div className="bg-white border rounded-xl p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#2189ed]/10 flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-[#2189ed]" />
            </div>

            <div>
              <span className="text-xs uppercase font-semibold tracking-wider text-[#2189ed]">
                Analytics
              </span>

              <h1 className="text-2xl font-bold text-gray-900 mt-1">
                Referral Performance Analytics
              </h1>

              <p className="text-sm text-gray-500 mt-1">
                Monitor referral conversions, promoter commissions, campaign
                performance, and revenue insights.
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={fetchAnalytics}
              disabled={loading}
              className="h-10 w-10 rounded-lg border border-gray-200 hover:bg-[#2189ed]/10 hover:border-[#2189ed]/20 transition flex items-center justify-center disabled:opacity-50"
            >
              <RefreshCw className="w-4 h-4 text-gray-600" />
            </button>

            <div className="px-4 py-2 rounded-lg bg-[#2189ed]/10 border border-[#2189ed]/20">
              <p className="text-xs text-gray-500">
                Module
              </p>

              <p className="text-sm font-semibold text-[#2189ed]">
                Referral Analytics
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white border rounded-xl p-5 shadow-sm">
        <ReferralFilters
          filters={filters}
          setFilters={setFilters}
          onApplyFilters={handleApplyFilters}
          onResetFilters={handleResetFilters}
        />
      </div>

      {loading ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-5">
            {[1, 2, 3, 4, 5].map((n) => (
              <div
                key={n}
                className="h-28 bg-white border rounded-xl shadow-sm animate-pulse"
              />
            ))}
          </div>

          <div className="h-72 bg-white border rounded-xl shadow-sm animate-pulse" />
        </div>
      ) : (
        <div className="space-y-6">

          <ReferralStatsCards
            stats={analyticsData.stats}
          />

          <div className="bg-white border rounded-xl p-6 shadow-sm">
            <ReferralRevenueChart
              chartData={analyticsData.chartData}
            />
          </div>

          <div className="bg-white border rounded-xl p-6 shadow-sm">
            <ReferralAnalyticsTable
              eventsBreakdown={analyticsData.eventsBreakdown}
            />
          </div>

        </div>
      )}
    </div>
  );
}
