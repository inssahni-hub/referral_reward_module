import { useState } from "react";

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

export default function ReferralPromoterCenter() {
  const [activeTab, setActiveTab] = useState("referral-programs");

  const tabs = [
    /* ================= REFERRAL ================= */
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

    /* ================= PROMOTER ================= */
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
      /* REFERRAL */
      case "referral-programs":
        return <ReferralPrograms />;

      case "referral-analytics":
        return <ReferralAnalytics />;

      /* PROMOTER */
      case "promoter-dashboard":
        return <PromoterDashboard />;

      case "promoter-wallet":
        return <PromoterWallet />;

      case "promoter-transactions":
        return <PromoterTransactions />;

      default:
        return <ReferralPrograms />;
    }
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="bg-white border rounded-xl p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900">
          Referral/PromoterCenter
        </h1>

        <p className="text-sm text-gray-500 mt-1">
          Manage referral programs and promoter system in one unified dashboard.
        </p>
      </div>

      {/* TABS */}
      <div className="bg-white border rounded-xl p-2 shadow-sm">
        <div className="flex flex-wrap gap-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;

            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`
                  flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all
                  ${
                    activeTab === tab.key
                      ? "bg-indigo-600 text-white"
                      : "text-gray-600 hover:bg-gray-100"
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

      {/* CONTENT */}
      <div className="animate-in fade-in duration-200">
        {renderContent()}
      </div>
    </div>
  );
}