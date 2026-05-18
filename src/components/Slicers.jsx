import React from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

const SlicerDropdown = ({ label, options, value, onChange }) => {
  return (
    <div className="relative group">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none bg-slate-800 hover:bg-slate-700 text-white pl-4 pr-10 py-2 rounded-lg border border-slate-700 hover:border-blue-500/50 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm font-medium w-full md:w-auto min-w-[140px]"
      >
        {options.map((opt) => (
          <option key={opt} value={opt} className="bg-slate-800 text-white">
            {opt}
          </option>
        ))}
      </select>
      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none group-hover:text-blue-400 transition-colors" />
    </div>
  );
};

const Slicers = ({ 
  timeRange, setTimeRange,
  salesCategory, setSalesCategory,
  clientSegment, setClientSegment
}) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 p-4 bg-slate-900/50 border-b border-slate-800/50 backdrop-blur-sm">
      <SlicerDropdown 
        label="Time Range" 
        options={["Last 3 months", "Last 6 months", "Last 12 months"]} 
        value={timeRange}
        onChange={setTimeRange}
      />
      <SlicerDropdown 
        label="Category" 
        options={["Services", "Products", "Mixed"]} 
        value={salesCategory}
        onChange={setSalesCategory}
      />
      <SlicerDropdown 
        label="Segment" 
        options={["All Clients", "New Clients", "Returning Clients"]} 
        value={clientSegment}
        onChange={setClientSegment}
      />
    </div>
  );
};

export default Slicers;