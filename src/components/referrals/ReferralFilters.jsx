import React from 'react';
import { Filter, Calendar, Mail, Tag, ListFilter, RotateCcw } from 'lucide-react';
import EventSelect from '../common/EventSelect.jsx';

export default function ReferralFilters({
  filters = {},
  setFilters,
  onApplyFilters,
  onResetFilters
}) {
  const handleTimeFilterChange = (val) => {
    setFilters(prev => ({
      ...prev,
      timeFilter: val,
      // Reset custom date fields if timeFilter is not custom
      ...(val !== 'custom' ? { startDate: '', endDate: '' } : {})
    }));
  };

  const handleFieldChange = (key, val) => {
    setFilters(prev => ({ ...prev, [key]: val }));
  };

  return (
    <div className="bg-white border border-[#E5E2DE] p-6 rounded-sm shadow-none" id="referral-filters-card">
      <div className="flex items-center justify-between border-b border-[#F0EEEB] pb-3 mb-4">
        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-[#1C1C1C]" />
          <h3 className="text-xs font-bold uppercase tracking-widest text-[#1C1C1C]">Filter Analytics</h3>
        </div>
        <button
          type="button"
          onClick={onResetFilters}
          className="text-xs text-[#706E6B] hover:text-[#1C1C1C] font-semibold flex items-center gap-1 transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Reset Filters
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Date Filter selector */}
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-[#706E6B] mb-1.5 flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-[#A09E9B]" /> Date Range Filter
          </label>
          <select
            value={filters.timeFilter || 'this_month'}
            onChange={(e) => handleTimeFilterChange(e.target.value)}
            className="w-full text-xs px-3 py-2 bg-[#F7F5F2]/50 border border-[#E5E2DE] rounded-sm focus:outline-none focus:border-[#1C1C1C] cursor-pointer"
          >
            <option value="today">Today</option>
            <option value="yesterday">Yesterday</option>
            <option value="this_week">This Week</option>
            <option value="last_week">Last Week</option>
            <option value="this_month">This Month</option>
            <option value="custom">Custom Date Range</option>
          </select>
        </div>

        {/* Selected Event filter */}
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-[#706E6B] mb-1.5 flex items-center gap-1">
            <ListFilter className="w-3.5 h-3.5 text-[#A09E9B]" /> Event Specific
          </label>
       
           <EventSelect
                      value={filters.eventId || ''}
                      onChange={(id, event) => {
                        handleFieldChange('eventId', id)
                      }}
                    />
        </div>

        {/* Customized Referral Code filter */}
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-[#706E6B] mb-1.5 flex items-center gap-1">
            <Tag className="w-3.5 h-3.5 text-[#A09E9B]" /> Referral Code
          </label>
          <input
            type="text"
            placeholder="Search e.g. PROMO2"
            value={filters.referralCode || ''}
            onChange={(e) => handleFieldChange('referralCode', e.target.value)}
            className="w-full text-xs px-3 py-2 bg-[#F7F5F2]/50 border border-[#E5E2DE] rounded-sm focus:outline-none focus:border-[#1C1C1C] uppercase"
          />
        </div>

        {/* Promoter Email address filter */}
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-wider text-[#706E6B] mb-1.5 flex items-center gap-1">
            <Mail className="w-3.5 h-3.5 text-[#A09E9B]" /> Promoter Email
          </label>
          <input
            type="email"
            placeholder="Search promoter@email.com"
            value={filters.promoterEmail || ''}
            onChange={(e) => handleFieldChange('promoterEmail', e.target.value)}
            className="w-full text-xs px-3 py-2 bg-[#F7F5F2]/50 border border-[#E5E2DE] rounded-sm focus:outline-none focus:border-[#1C1C1C]"
          />
        </div>
      </div>

      {/* Conditionally render custom date inputs */}
      {filters.timeFilter === 'custom' && (
        <div className="grid grid-cols-2 gap-4 mt-4 p-4 bg-[#F7F5F2] rounded-sm border border-[#E5E2DE]">
          <div>
            <label className="block text-[10px] font-bold text-[#1C1C1C] uppercase mb-1">Start Date</label>
            <input
              type="date"
              value={filters.startDate || ''}
              onChange={(e) => handleFieldChange('startDate', e.target.value)}
              className="w-full text-xs px-3 py-2 bg-white border border-[#E5E2DE] rounded-sm focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-[#1C1C1C] uppercase mb-1">End Date</label>
            <input
              type="date"
              value={filters.endDate || ''}
              onChange={(e) => handleFieldChange('endDate', e.target.value)}
              className="w-full text-xs px-3 py-2 bg-white border border-[#E5E2DE] rounded-sm focus:outline-none"
            />
          </div>
        </div>
      )}

      <div className="mt-4 flex justify-end">
        <button
          type="button"
          onClick={onApplyFilters}
          className="bg-[#1C1C1C] hover:bg-[#2D2D2D] text-white font-bold text-[10px] uppercase tracking-[0.15em] py-2.5 px-6 rounded-sm cursor-pointer transition-colors shadow-none"
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
}
