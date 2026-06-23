import React from 'react';
import { Calendar, Filter, RefreshCw } from 'lucide-react';
import EventSelect from '../common/EventSelect';

export default function PartnerFilters({
  activeFilter = 'all',
  onChangeFilter,
  startDate = '',
  onChangeStartDate,
  endDate = '',
  onChangeEndDate,
  events = [],
  selectedEventId = '',
  onChangeEventId,
  onClearFilters
}) {
  const filterPresets = [
    { value: 'all', label: 'All Dates' },
    { value: 'today', label: 'Today' },
    { value: 'yesterday', label: 'Yesterday' },
    { value: 'this_week', label: 'This Week' },
    { value: 'last_week', label: 'Last Week' },
    { value: 'this_month', label: 'This Month' },
    { value: 'last_month', label: 'Last Month' },
    { value: 'custom', label: 'Custom Range' }
  ];

  return (
    <div id="partner_filters_card" className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
          <Filter className="w-4 h-4 text-slate-400" />
          <span>Fiter Commisions & Revenue Ledgers</span>
        </div>
        <button
          id="btn_clear_filters"
          onClick={onClearFilters}
          className="text-[10px] font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 transition-colors"
        >
          <RefreshCw className="w-3 h-3" />
          <span>Reset All Filters</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
        {/* Date Filter Selection Dropdown */}
        <div>
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Date Span Preset</label>
          <select
            id="select_date_preset"
            value={activeFilter}
            onChange={(e) => onChangeFilter(e.target.value)}
            className="w-full text-xs px-3.5 py-2.5 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:border-blue-500 focus:outline-none text-slate-700 font-semibold"
          >
            {filterPresets.map(p => (
              <option key={p.value} value={p.value}>{p.label}</option>
            ))}
          </select>
        </div>

        {/* Event Wise Specific Filter */}
        <div>
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Filter by Event</label>
          <select
            id="select_event_filter"
            value={selectedEventId}
            onChange={(e) => onChangeEventId(e.target.value)}
            className="hidden w-full text-xs px-3.5 py-2.5 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:border-blue-500 focus:outline-none text-slate-700 font-semibold"
          >
            <option value="">All co-hosted events</option>
            {events.map((evt) => (
              <option key={evt.eventId || evt._id} value={evt._id}>{evt.eventName}</option>
            ))}
          </select>
          <EventSelect
            value={selectedEventId || ''}
            onChange={(id, event) => {
              onChangeEventId(id)
            }}
          />
        </div>

        {/* Custom Bounds Starts */}
        {activeFilter === 'custom' && (
          <div className="md:col-span-2 grid grid-cols-2 gap-3 transition-opacity duration-300">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Date Strart</label>
              <div className="relative">
                <input
                  id="input_filter_start_date"
                  type="date"
                  value={startDate}
                  onChange={(e) => onChangeStartDate(e.target.value)}
                  className="w-full text-xs pl-8 pr-3 py-2 border border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none text-slate-700 font-mono"
                />
                <Calendar className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-slate-400" />
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Date End</label>
              <div className="relative">
                <input
                  id="input_filter_end_date"
                  type="date"
                  value={endDate}
                  onChange={(e) => onChangeEndDate(e.target.value)}
                  className="w-full text-xs pl-8 pr-3 py-2 border border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none text-slate-700 font-mono"
                />
                <Calendar className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-slate-400" />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
