// pages/organizer/rewards/RewardCenter.jsx

import { useEffect, useMemo, useState } from "react";
import {
  LayoutDashboard,
  Gift,
  Receipt,
  BarChart3,
  Settings,
  Wallet,
} from "lucide-react";

import RewardDashboard from "./BuyerRewards";
import RewardPrograms from "./CashbackPrograms";

import RewardAnalytics from "./CashbackAnalytics";
import { useSelector } from "react-redux";
import useAuth from "@/hooks/useAuth";

export default function RewardCenter() {
  const { isBuyer, isOrganizer, isSuperAdmin } = useAuth();

  /* Default tab based on role */
  const defaultTab = isBuyer ? "overview" : "programs";

  const [activeTab, setActiveTab] = useState(defaultTab);

  /* Update active tab whenever auth state changes */
  useEffect(() => {
    setActiveTab(defaultTab);
  }, [defaultTab]);

  /* Dynamic Tabs */
  const tabs = useMemo(() => {
    if (isBuyer) {
      return [
        {
          key: "overview",
          label: "Overview",
          icon: LayoutDashboard,
        },
      ];
    }

    if (isOrganizer || isSuperAdmin) {
      return [
        {
          key: "programs",
          label: "Programs",
          icon: Gift,
        },
        {
          key: "analytics",
          label: "Analytics",
          icon: BarChart3,
        },
      ];
    }

    return [];
  }, [isBuyer, isOrganizer, isSuperAdmin]);

  /* Dynamic Content */
  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return <RewardDashboard />;

      case "programs":
        return <RewardPrograms />;

      case "analytics":
        return <RewardAnalytics />;

      default:
        return isBuyer ? (
          <RewardDashboard />
        ) : (
          <RewardPrograms />
        );
    }
  };


  return (
    <div className="space-y-6">
      {/* Page Header */}

      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#2189ed]/10 flex items-center justify-center">
              <Wallet className="h-6 w-6 text-[#2189ed]" />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                Buyer Rewards
              </h1>

              <p className="text-sm text-slate-500 mt-1">
                Create cashback programs, reward ticket buyers,
                increase repeat purchases, and track loyalty performance.
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="px-4 py-2 rounded-lg bg-[#2189ed]/10 border border-[#2189ed]/20">
              <p className="text-xs text-slate-500">
                Module
              </p>

              <p className="text-sm font-semibold text-[#2189ed]">
                Buyer Rewards
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}

      <div className="bg-white border border-slate-200 rounded-xl p-2 shadow-sm">
        <div className="flex flex-wrap gap-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;

            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={`
            flex items-center gap-2
            px-4 py-2.5
            rounded-lg
            text-sm font-semibold
            transition-all duration-200
            ${activeTab === tab.key
                    ? "bg-[#2189ed] text-white shadow-md"
                    : "text-slate-600 hover:bg-[#2189ed]/10 hover:text-[#2189ed]"
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

      {/* Active Tab Content */}

      <div className="animate-in fade-in duration-200">
        {renderContent()}
      </div>
    </div>
  );
}