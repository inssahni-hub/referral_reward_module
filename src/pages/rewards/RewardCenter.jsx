// pages/organizer/rewards/RewardCenter.jsx

import { useState } from "react";
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


export default function RewardCenter() {
  const [activeTab, setActiveTab] = useState("overview");

  const tabs = [
    {
      key: "overview",
      label: "Overview",
      icon: LayoutDashboard,
    },
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

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return <RewardDashboard />;

      case "programs":
        return <RewardPrograms />;

    case "analytics":
        return <RewardAnalytics />;

      default:
        return <RewardDashboard />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}

      <div className="bg-white border rounded-xl p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
              <Wallet className="h-6 w-6 text-emerald-600" />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Buyer Rewards
              </h1>

              <p className="text-sm text-gray-500 mt-1">
                Create cashback programs, reward ticket buyers,
                increase repeat purchases, and track loyalty performance.
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="px-4 py-2 rounded-lg bg-emerald-50 border border-emerald-100">
              <p className="text-xs text-gray-500">
                Module
              </p>

              <p className="text-sm font-semibold text-emerald-700">
                Buyer Rewards
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
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={`
                  flex items-center gap-2
                  px-4 py-2.5
                  rounded-lg
                  text-sm font-medium
                  transition-all
                  ${
                    activeTab === tab.key
                      ? "bg-emerald-600 text-white shadow-sm"
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

      {/* Active Tab Content */}

      <div className="animate-in fade-in duration-200">
        {renderContent()}
      </div>
    </div>
  );
}