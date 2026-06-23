import React, { useState, useEffect } from 'react';
import axios from "@/request/axiosReq";
import PartnerStatsCards from '../../components/partners/PartnerStatsCards.jsx';
import PartnerRevenueChart from '../../components/partners/PartnerRevenueChart.jsx';
import PartnerEventsTable from '../../components/partners/PartnerEventsTable.jsx';
import { Calendar, HelpCircle, RefreshCw, Layers, ExternalLink, ArrowRightLeft } from 'lucide-react';

export default function PartnerDashboard({ partnerId, onNavigateTo }) {
  const [analytics, setAnalytics] = useState(null);
  const [partner, setPartner] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');

  const fetchDashboardData = async () => {
    if (!partnerId) return;
    setIsLoading(true);
    setErrorMsg('');
    try {
      const response = await axios.get(`/api/partners/dashboard?partnerId=${partnerId}`);
      if (response.data) {
        
        setAnalytics(response.data.analytics || {});
        setPartner(response.data.partner || {});
        console.log(response)
      }
    } catch (error) {
      console.error("Dashboard Fetch Error:", error);
      setErrorMsg(error.response?.data?.error || "Error establishing connection. Please refresh.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [partnerId]);

  return (
    <div id="partner_dashboard_view" className="space-y-6">
      {/* Header Context */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <h1 className="text-2xl font-black font-sans tracking-tight text-slate-900 flex items-center gap-2">
            <span>Co-Host Partner Hub</span>
            {partner && (
              <span className="text-xs bg-blue-50 border border-blue-100 text-blue-700 px-2.5 py-0.5 rounded-full font-bold">
                {partner.companyName}
              </span>
            )}
          </h1>
          <p className="text-slate-500 text-xs mt-0.5">
            Audit booking fee distributions, commission coefficients, campaigns performance, and live event settlement records.
          </p>
        </div>

   
      </div>

      {errorMsg && (
        <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl text-rose-600 text-xs font-semibold">
          {errorMsg}
        </div>
      )}

      {/* Main Stats Card Grid */}
      <PartnerStatsCards stats={analytics || {}} />

      {/* Bento Layout Analytics Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
        <div className="lg:col-span-1">
          <PartnerRevenueChart eventsList={analytics?.eventsList || []} />
        </div>
        <div className="lg:col-span-2">
          <PartnerEventsTable eventsList={analytics?.eventsList || []} />
        </div>
      </div>
    </div>
  );
}
