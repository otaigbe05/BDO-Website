import React from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  BarChart, 
  Users, 
  Activity, 
  Filter,
  ChevronDown,
  Sparkles
} from 'lucide-react';
import OmisSidebar from './OmisSidebar';
import OmisKPICard from './OmisKPICard';
import { Button } from '@/components/ui/button';

const OmisAnalyticsDashboard = () => {
  return (
    <div className="flex w-full h-full bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 text-left">
      <OmisSidebar activePage="analytics" />
      
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 bg-slate-900/50">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-1">Analytics Suite</h2>
              <p className="text-sm text-slate-400">Real-time business intelligence</p>
            </div>
            <Button className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white border-none shadow-lg">
              <Sparkles className="w-4 h-4 mr-2" />
              Ask Analytics AI
            </Button>
          </div>

          {/* Filters Bar */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 bg-slate-800 px-3 py-1.5 rounded-md border border-slate-700 text-sm text-slate-300 cursor-pointer hover:bg-slate-700">
              <Filter className="w-4 h-4" />
              <span>Active Filters</span>
              <span className="bg-slate-600 text-white text-xs px-1.5 py-0.5 rounded-full">0</span>
            </div>
            
            {['All Time', 'All Quarters', 'All Months', 'All Locations', 'All Categories'].map((filter) => (
              <div key={filter} className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-md border border-slate-800 text-sm text-slate-300 cursor-pointer hover:border-slate-600 transition-colors">
                <span>{filter}</span>
                <ChevronDown className="w-4 h-4 text-slate-500" />
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6 overflow-y-auto bg-slate-950/50">
          {/* Tabs */}
          <div className="flex border-b border-slate-800 mb-6 overflow-x-auto hide-scrollbar">
            {['Executive', 'Revenue', 'Customers', 'Services', 'Locations', 'Forecasting', 'Timeline'].map((tab, i) => (
              <button 
                key={tab}
                className={`px-4 py-2 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                  i === 0 
                    ? 'border-blue-500 text-blue-400' 
                    : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-600'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* KPI Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
            <OmisKPICard 
              icon={<DollarSign className="w-5 h-5 text-blue-300" />}
              value="$942K"
              label="Total Revenue"
              trend="+12.5%"
              bgGradient="from-blue-600 to-blue-900"
            />
            <OmisKPICard 
              icon={<TrendingUp className="w-5 h-5 text-emerald-300" />}
              value="$317.7K"
              label="Total Profit"
              trend="+8.2%"
              bgGradient="from-emerald-600 to-teal-900"
            />
            <OmisKPICard 
              icon={<BarChart className="w-5 h-5 text-amber-300" />}
              value="$677.7"
              label="Avg Order Value"
              trend="+2.1%"
              bgGradient="from-amber-600 to-orange-900"
            />
            <OmisKPICard 
              icon={<Users className="w-5 h-5 text-purple-300" />}
              value="246"
              label="Total Customers"
              trend="+15"
              bgGradient="from-purple-600 to-indigo-900"
            />
            <OmisKPICard 
              icon={<Activity className="w-5 h-5 text-pink-300" />}
              value="35.0%"
              label="Profit Margin %"
              trend="+1.2%"
              bgGradient="from-pink-600 to-rose-900"
            />
          </div>

          {/* Placeholder for charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="bg-slate-900 border border-slate-800 rounded-xl h-64 flex items-center justify-center text-slate-500">
              Revenue Over Time Chart Area
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-xl h-64 flex items-center justify-center text-slate-500">
              Customer Growth Chart Area
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OmisAnalyticsDashboard;