import React from 'react';
import { Calendar, Filter, RefreshCw } from 'lucide-react';
import EventSelect from '../common/EventSelect';

export default function CashbackFilters({
  filterType,
  setFilterType,
  selectedEventId,
  setSelectedEventId,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  events = [],
  onRefresh
}) {
  const filterOptions = [
    { value: 'all', label: 'All Time' },
    { value: 'today', label: 'Today' },
    { value: 'yesterday', label: 'Yesterday' },
    { value: 'this_week', label: 'This Week' },
    { value: 'this_month', label: 'This Month' },
    { value: 'custom', label: 'Custom Range' }
  ];

  return (
    <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-xs flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-emerald-600" />
          <h3 className="text-sm font-semibold text-gray-800">Analytics Filters</h3>
        </div>

        {onRefresh && (
          <button
            onClick={onRefresh}
            className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-emerald-600 transition-colors bg-gray-50 hover:bg-emerald-50 px-2.5 py-1.5 rounded-md border border-gray-200"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Refresh Data
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Filter Type */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-gray-500">Time Period</label>
          <div className="flex flex-wrap gap-1.5">
            <select
              id="filter-type-select"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full text-sm bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 py-2 px-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            >
              {filterOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Event Wise Filter */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-gray-500">Event Association</label>

          <EventSelect
            value={selectedEventId}
            onChange={(id, event) => {
              setSelectedEventId(id)
            }}
          />
        </div>

        {/* Custom Date Ranges */}
        {filterType === 'custom' && (
          <div className="grid grid-cols-2 gap-2 md:col-span-1">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-500 flex items-center gap-1">
                <Calendar className="w-3 h-3 text-gray-400" /> Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full text-sm bg-gray-50 border border-gray-200 text-gray-700 py-1.5 px-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-500 flex items-center gap-1">
                <Calendar className="w-3 h-3 text-gray-400" /> End Date
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full text-sm bg-gray-50 border border-gray-200 text-gray-700 py-1.5 px-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
