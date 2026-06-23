// pages/partners/PartnerDetails.jsx

import React, { useEffect, useState } from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import axios from "@/request/axiosReq";

import PartnerDashboard from "./PartnerDashboard.jsx";
import PartnerEarnings from "./PartnerEarnings.jsx";
import PartnerWallet from "./PartnerWallet.jsx";

import {
  ArrowLeft,
  Building2,
  Wallet,
  Award,
  LayoutDashboard,
  Mail,
  Phone,
  Globe,
  BadgeCheck,
  Loader2,
  AlertCircle,
  DollarSign,
  TrendingUp,
  Landmark,
} from "lucide-react";

export default function PartnerDetails() {
  const { partnerId } = useParams();

  const navigate = useNavigate();

  const [partner, setPartner] = useState(null);

  const [loading, setLoading] = useState(true);

  const [activeView, setActiveView] =
    useState("dashboard");

  // =========================================
  // LOAD PARTNER
  // =========================================
  const loadPartner = async () => {
    try {
      setLoading(true);

      const response = await axios.get(
        `/api/partners/dashboard?partnerId=${partnerId}`
      );

      if (response.data?.partner) {
        setPartner(response.data.partner);
      }
    } catch (error) {
      console.error(
        "Failed to load partner",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (partnerId) {
      loadPartner();
    }
  }, [partnerId]);

  // =========================================
  // LOADING
  // =========================================
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 animate-spin text-blue-600" />

          <p className="text-sm font-medium text-slate-600">
            Loading partner workspace...
          </p>
        </div>
      </div>
    );
  }

  // =========================================
  // NOT FOUND
  // =========================================
  if (!partner) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200 p-10 text-center">
          <div className="inline-flex p-4 rounded-full bg-red-50 mb-5">
            <AlertCircle className="w-10 h-10 text-red-500" />
          </div>

          <h2 className="text-2xl font-extrabold text-slate-900">
            Partner Not Found
          </h2>

          <p className="text-sm text-slate-500 mt-3">
            Requested partner does not exist.
          </p>

          <button
            onClick={() => navigate("/admin/partners")}
            className="mt-6 h-11 px-5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold transition-all"
          >
            Back To Partners
          </button>
        </div>
      </div>
    );
  }

  // =========================================
  // MAIN
  // =========================================
  return (
    <div className="min-h-screen bg-slate-50">
      {/* ========================================= */}
      {/* HEADER */}
      {/* ========================================= */}
      <div className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200">
        <div className="max-w-[1900px] mx-auto px-4 lg:px-8">
          <div className="min-h-[82px] py-4 flex flex-col xl:flex-row xl:items-center justify-between gap-5">
            {/* LEFT */}
            <div className="flex items-start gap-4">
              <button
                onClick={() => navigate("/admin/partners")}
                className="w-11 h-11 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 flex items-center justify-center transition-all shrink-0"
              >
                <ArrowLeft className="w-5 h-5 text-slate-700" />
              </button>

              <div className="w-16 h-16 rounded-3xl bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
                <Building2 className="w-8 h-8 text-blue-600" />
              </div>

              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl lg:text-3xl font-black text-slate-900 truncate">
                    {partner.companyName}
                  </h1>

                  <div className="px-3 py-1 rounded-xl bg-emerald-100 text-emerald-700 text-[11px] font-bold flex items-center gap-1 border border-emerald-200">
                    <BadgeCheck className="w-3.5 h-3.5" />

                    {partner.status || "Approved"}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-slate-500">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    {partner.email}
                  </div>

                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    {partner.phone}
                  </div>

                  {partner.website && (
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4" />
                      {partner.website}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* RIGHT ACTIONS */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() =>
                  setActiveView("dashboard")
                }
                className={`h-11 px-5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
                  activeView === "dashboard"
                    ? "bg-blue-600 text-white shadow-lg"
                    : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-100"
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </button>

              <button
                onClick={() =>
                  setActiveView("earnings")
                }
                className={`h-11 px-5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
                  activeView === "earnings"
                    ? "bg-blue-600 text-white shadow-lg"
                    : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-100"
                }`}
              >
                <Award className="w-4 h-4" />
                Commissions
              </button>

              <button
                onClick={() =>
                  setActiveView("wallet")
                }
                className={`h-11 px-5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
                  activeView === "wallet"
                    ? "bg-blue-600 text-white shadow-lg"
                    : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-100"
                }`}
              >
                <Wallet className="w-4 h-4" />
                Wallet
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================= */}
      {/* PAGE BODY */}
      {/* ========================================= */}
      <div className="max-w-[1900px] mx-auto p-4 lg:p-8 space-y-6">
        {/* ========================================= */}
        {/* TOP STATS */}
        {/* ========================================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
          {/* CARD */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Revenue Share
                </p>

                <h3 className="text-3xl font-black text-slate-900 mt-2">
                  {partner.revenueSharePercentage || 0}%
                </h3>
              </div>

              <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          {/* CARD */}
          <div className="bg-white rounded-3xl border border-emerald-200 p-6 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                  Redeemable
                </p>

                <h3 className="text-3xl font-black text-emerald-700 mt-2">
                  $
                  {Number(
                    partner?.wallet
                      ?.redeemableEarnings || 0
                  ).toFixed(2)}
                </h3>
              </div>

              <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
          </div>

          {/* CARD */}
          <div className="bg-white rounded-3xl border border-blue-200 p-6 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
                  Total Earnings
                </p>

                <h3 className="text-3xl font-black text-blue-700 mt-2">
                  $
                  {Number(
                    partner?.wallet
                      ?.totalEarnings || 0
                  ).toFixed(2)}
                </h3>
              </div>

              <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center">
                <Landmark className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          {/* CARD */}
          <div className="bg-white rounded-3xl border border-amber-200 p-6 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-amber-600">
                  Pending Earnings
                </p>

                <h3 className="text-3xl font-black text-amber-700 mt-2">
                  $
                  {Number(
                    partner?.wallet
                      ?.pendingEarnings || 0
                  ).toFixed(2)}
                </h3>
              </div>

              <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center">
                <Wallet className="w-6 h-6 text-amber-600" />
              </div>
            </div>
          </div>
        </div>

        {/* ========================================= */}
        {/* MAIN CONTENT */}
        {/* ========================================= */}
        <div className="min-w-0">
          {activeView === "dashboard" && (
            <PartnerDashboard
              partnerId={partnerId}
              onNavigateTo={setActiveView}
            />
          )}

          {activeView === "earnings" && (
            <PartnerEarnings
              partnerId={partnerId}
              onBackToDashboard={() =>
                setActiveView("dashboard")
              }
            />
          )}

          {activeView === "wallet" && (
            <PartnerWallet
              partnerId={partnerId}
              onBackToDashboard={() =>
                setActiveView("dashboard")
              }
            />
          )}
        </div>
      </div>
    </div>
  );
}