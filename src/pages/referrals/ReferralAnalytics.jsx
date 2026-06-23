import React, { useState, useEffect } from 'react';
import axios from "@/request/axiosReq";
import { ChartSpline, RefreshCw, AlertTriangle } from 'lucide-react';

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
      <div className="bg-white p-6 border border-[#E5E2DE] rounded-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-none animate-fade-in">
        <div>
          <span className="text-[10px] uppercase tracking-[0.2em] text-[#A09E9B] font-bold block mb-1">Performance</span>
          <h1 className="text-2xl  text-[#1C1C1C] font-semibold leading-snug flex items-center gap-1.5">
            Referral Performance Analytics
          </h1>
          <p className="text-xs text-[#706E6B] mt-0.5">Audit conversions, track promoter payouts, and verify margins.</p>
        </div>

        <button
          type="button"
          onClick={fetchAnalytics}
          disabled={loading}
          className="p-2.5 text-[#706E6B] hover:text-[#1C1C1C] border border-[#E5E2DE] hover:bg-[#F7F5F2] rounded-sm transition-all cursor-pointer disabled:opacity-50"
          title="Reload Performance Metrics"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Filters card */}
      <ReferralFilters
        filters={filters}
        setFilters={setFilters}
        onApplyFilters={handleApplyFilters}
        onResetFilters={handleResetFilters}
      />

      {loading ? (
        <div className="space-y-6" id="analytics-skeleton">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[1, 2, 3, 4, 5].map(n => (
              <div key={n} className="h-24 bg-white border border-[#E5E2DE] rounded-sm animate-pulse"></div>
            ))}
          </div>
          <div className="h-56 bg-white border border-[#E5E2DE] rounded-sm animate-pulse"></div>
        </div>
      ) : (
        <div className="space-y-6" id="analytics-live-content">
          {/* Bento stats cards */}
          <ReferralStatsCards stats={analyticsData.stats} />

          {/* Visualization area */}
          <div className="grid grid-cols-1 gap-6">
            <ReferralRevenueChart chartData={analyticsData.chartData} />
            <ReferralAnalyticsTable eventsBreakdown={analyticsData.eventsBreakdown} />
          </div>
        </div>
      )}
    </div>
  );
}
