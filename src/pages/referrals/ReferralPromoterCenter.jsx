import { useEffect, useState } from "react";

import {
  Users,
  BarChart3,
  Megaphone,
  Wallet,
  Receipt,
} from "lucide-react";

/* ================= REFERRAL ================= */
import ReferralPrograms from "./ReferralPrograms";
import ReferralAnalytics from "./ReferralAnalytics";

/* ================= PROMOTER ================= */
import PromoterDashboard from "../promoter/PromoterDashboard";
import PromoterTransactions from "../promoter/PromoterTransactions";
import PromoterWallet from "../promoter/PromoterWallet";
import { useSelector } from "react-redux";
import useAuth from "@/hooks/useAuth";

export default function ReferralPromoterCenter() {
  const { isBuyer, isOrganizer, isSuperAdmin } = useAuth();

  const defaultTab =
    isOrganizer || isSuperAdmin
      ? "referral-programs"
      : "promoter-dashboard";

  const [activeTab, setActiveTab] = useState(defaultTab);

  useEffect(() => {
    setActiveTab(
      isOrganizer || isSuperAdmin
        ? "referral-programs"
        : "promoter-dashboard"
    );
  }, [isOrganizer, isSuperAdmin]);


  ;

  const tabs = isOrganizer || isSuperAdmin
    ? [
      {
        key: "referral-programs",
        label: "Referral Programs",
        icon: Users,
      },
      {
        key: "referral-analytics",
        label: "Referral Analytics",
        icon: BarChart3,
      },
    ]
    : [
      {
        key: "promoter-dashboard",
        label: "Promoter Dashboard",
        icon: Megaphone,
      },
      {
        key: "promoter-wallet",
        label: "Wallet",
        icon: Wallet,
      },
      {
        key: "promoter-transactions",
        label: "Transactions",
        icon: Receipt,
      },
    ];

  const renderContent = () => {
    switch (activeTab) {
      /* ================= REFERRAL ================= */
      case "referral-programs":
        return <ReferralPrograms />;

      case "referral-analytics":
        return <ReferralAnalytics />;

      /* ================= PROMOTER ================= */
      case "promoter-dashboard":
        return <PromoterDashboard />;

      case "promoter-wallet":
        return <PromoterWallet />;

      case "promoter-transactions":
        return <PromoterTransactions />;

      default:
        return isOrganizer || isSuperAdmin
          ? <ReferralPrograms />
          : <PromoterDashboard />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white border rounded-xl p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#2189ed]/10 flex items-center justify-center">
              <Users className="h-6 w-6 text-[#2189ed]" />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Referral & Promoter Center
              </h1>

              <p className="text-sm text-gray-500 mt-1">
                Manage referral campaigns, promoters, commissions, tracking, and
                performance analytics from one centralized workspace.
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="px-4 py-2 rounded-lg bg-[#2189ed]/10 border border-[#2189ed]/20">
              <p className="text-xs text-gray-500">
                Module
              </p>

              <p className="text-sm font-semibold text-[#2189ed]">
                Referral System
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border rounded-xl p-2 shadow-sm">
        <div className="flex flex-wrap gap-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;

            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`
                flex items-center gap-2
                px-4 py-2.5
                rounded-lg
                text-sm
                font-medium
                transition-all
                ${activeTab === tab.key
                    ? "bg-[#2189ed] text-white shadow-sm"
                    : "text-gray-600 hover:bg-[#2189ed]/10 hover:text-[#2189ed]"
                  }
              `}
              >
                <Icon size={16} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Content */}
      <div className="animate-in fade-in duration-200">
        {renderContent()}
      </div>
    </div>
  );
}