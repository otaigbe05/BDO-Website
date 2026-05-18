import React, { useState } from 'react';
import { Search, Filter, LayoutDashboard, Calendar, Users, FileText, PieChart, BarChart2, Settings, HelpCircle, Shield, DollarSign, TrendingUp, Zap, ArrowUpRight, ArrowDownRight, Sparkles } from 'lucide-react';

const OmisAnalyticsScreen = () => {
  const [activeTab, setActiveTab] = useState('Executive');
  const [dateFilter, setDateFilter] = useState('All Time');

  const sidebarLinks = [
    { icon: <LayoutDashboard className="w-5 h-5" />, label: 'Dashboard' },
    { icon: <Calendar className="w-5 h-5" />, label: 'Calendar' },
    { icon: <Users className="w-5 h-5" />, label: 'Clients' },
    { icon: <FileText className="w-5 h-5" />, label: 'Invoices' },
    { icon: <PieChart className="w-5 h-5" />, label: 'Analytics Suite', active: true },
    { icon: <BarChart2 className="w-5 h-5" />, label: 'Reports' },
    { icon: <Settings className="w-5 h-5" />, label: 'Settings' },
    { icon: <HelpCircle className="w-5 h-5" />, label: 'Support' },
    { icon: <Shield className="w-5 h-5" />, label: 'User Management' },
  ];

  const tabs = ['Executive', 'Revenue', 'Customers', 'Services', 'Locations', 'Forecasting', 'Timeline'];

  return (
    <div className="flex h-[800px] w-full bg-slate-50 rounded-2xl overflow-hidden border border-slate-200 shadow-2xl font-sans text-left">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-slate-200 flex flex-col hidden md:flex">
        <div className="p-6 border-b border-slate-200 flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
             <span className="text-white font-bold text-xl">O</span>
          </div>
          <span className="font-bold text-xl text-slate-900 tracking-tight">OMIS</span>
        </div>
        <div className="flex-1 py-6 px-4 overflow-y-auto space-y-1">
          {sidebarLinks.map((link, idx) => (
            <button 
              key={idx} 
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${link.active ? 'bg-blue-50 text-blue-700 font-bold' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium'}`}
            >
              {link.icon}
              {link.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 px-8 py-6 flex justify-between items-center">
           <div>
             <h1 className="text-2xl font-bold text-slate-900 mb-1">Analytics Suite</h1>
             <p className="text-sm text-slate-500 font-medium">Real-time business intelligence</p>
           </div>
           <div className="flex items-center gap-4">
               <span className="text-sm font-semibold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg">Active Filters: <span className="text-slate-900">0</span></span>
           </div>
        </header>

        {/* Filters Bar */}
        <div className="bg-white border-b border-slate-200 px-8 py-4 flex flex-wrap gap-3">
             <select 
               value={dateFilter}
               onChange={(e) => setDateFilter(e.target.value)}
               className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm cursor-pointer hover:bg-slate-100 transition-colors"
             >
                 <option>All Time</option>
                 <option>This Year</option>
                 <option>Last Year</option>
             </select>
             {['All Quarters', 'All Months', 'All Locations', 'All Categories'].map((filter, i) => (
                <select 
                  key={i}
                  className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm cursor-pointer hover:bg-slate-100 transition-colors"
                >
                    <option>{filter}</option>
                </select>
             ))}
        </div>

        {/* Tabs */}
        <div className="px-8 pt-6">
            <div className="flex gap-1 border-b border-slate-200 overflow-x-auto pb-px scrollbar-hide">
                {tabs.map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-5 py-3 text-sm font-bold whitespace-nowrap transition-colors border-b-2 ${activeTab === tab ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-900 hover:border-slate-300'}`}
                    >
                        {tab}
                    </button>
                ))}
            </div>
        </div>

        {/* Analytics Grid */}
        <div className="flex-1 p-8 overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-8">
                {/* Metric Cards */}
                <div className="bg-white p-6 rounded-2xl border border-blue-100 shadow-sm hover:shadow-lg transition-all cursor-pointer group hover:-translate-y-1 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-[#0066FF]"></div>
                    <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-[#0066FF] transition-colors">
                        <DollarSign className="w-6 h-6 text-[#0066FF] group-hover:text-white transition-colors" />
                    </div>
                    <p className="text-slate-500 font-medium text-sm mb-1">Total Revenue</p>
                    <h3 className="text-3xl font-black text-slate-900">$942K</h3>
                    <p className="text-emerald-600 text-sm font-bold flex items-center gap-1 mt-2">
                        <ArrowUpRight className="w-4 h-4" /> +12.5%
                    </p>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-emerald-100 shadow-sm hover:shadow-lg transition-all cursor-pointer group hover:-translate-y-1 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-[#10B981]"></div>
                    <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-[#10B981] transition-colors">
                        <TrendingUp className="w-6 h-6 text-[#10B981] group-hover:text-white transition-colors" />
                    </div>
                    <p className="text-slate-500 font-medium text-sm mb-1">Total Profit</p>
                    <h3 className="text-3xl font-black text-slate-900">$317.7K</h3>
                    <p className="text-emerald-600 text-sm font-bold flex items-center gap-1 mt-2">
                        <ArrowUpRight className="w-4 h-4" /> +8.2%
                    </p>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-orange-100 shadow-sm hover:shadow-lg transition-all cursor-pointer group hover:-translate-y-1 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-[#F97316]"></div>
                    <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-[#F97316] transition-colors">
                        <BarChart2 className="w-6 h-6 text-[#F97316] group-hover:text-white transition-colors" />
                    </div>
                    <p className="text-slate-500 font-medium text-sm mb-1">Avg Order Value</p>
                    <h3 className="text-3xl font-black text-slate-900">$677.7</h3>
                    <p className="text-slate-400 text-sm font-medium mt-2">Consistent</p>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-purple-100 shadow-sm hover:shadow-lg transition-all cursor-pointer group hover:-translate-y-1 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-[#A855F7]"></div>
                    <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-[#A855F7] transition-colors">
                        <Users className="w-6 h-6 text-[#A855F7] group-hover:text-white transition-colors" />
                    </div>
                    <p className="text-slate-500 font-medium text-sm mb-1">Total Customers</p>
                    <h3 className="text-3xl font-black text-slate-900">246</h3>
                    <p className="text-emerald-600 text-sm font-bold flex items-center gap-1 mt-2">
                        <ArrowUpRight className="w-4 h-4" /> +24 new
                    </p>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-pink-100 shadow-sm hover:shadow-lg transition-all cursor-pointer group hover:-translate-y-1 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-[#EC4899]"></div>
                    <div className="w-12 h-12 bg-pink-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-[#EC4899] transition-colors">
                        <Zap className="w-6 h-6 text-[#EC4899] group-hover:text-white transition-colors" />
                    </div>
                    <p className="text-slate-500 font-medium text-sm mb-1">Profit Margin %</p>
                    <h3 className="text-3xl font-black text-slate-900">35.0%</h3>
                    <p className="text-red-500 text-sm font-bold flex items-center gap-1 mt-2">
                        <ArrowDownRight className="w-4 h-4" /> -1.2%
                    </p>
                </div>
            </div>

            {/* AI Assistant Section */}
            <div className="bg-gradient-to-br from-indigo-900 via-blue-900 to-slate-900 rounded-3xl p-8 text-white relative overflow-hidden shadow-xl">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 opacity-20 blur-[100px] rounded-full"></div>
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div>
                        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full mb-6 border border-white/20">
                            <Sparkles className="w-4 h-4 text-blue-300" />
                            <span className="text-sm font-bold text-blue-100 tracking-wide uppercase">AI Analytics Assistant</span>
                        </div>
                        <h3 className="text-3xl font-bold mb-3 leading-tight">Ask your data questions <br/> in plain English</h3>
                        <p className="text-blue-200 text-lg font-medium max-w-xl mb-8">
                            "Why did profit margin drop last month?" or "Which service is growing fastest?" OMIS AI finds the answer instantly.
                        </p>
                        <button className="bg-white text-indigo-900 hover:bg-blue-50 px-8 py-4 rounded-xl font-bold text-lg transition-all hover:scale-105 shadow-lg flex items-center gap-2">
                            <Sparkles className="w-5 h-5" />
                            Ask Analytics AI
                        </button>
                    </div>
                    <div className="hidden lg:block w-1/3">
                        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-2xl">
                            <div className="flex gap-3 mb-4 opacity-50">
                                <div className="w-8 h-8 rounded-full bg-blue-400/30"></div>
                                <div className="h-8 bg-white/10 rounded-lg flex-1"></div>
                            </div>
                            <div className="flex gap-3 flex-row-reverse">
                                <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center">
                                    <Sparkles className="w-4 h-4 text-white" />
                                </div>
                                <div className="bg-indigo-500/20 border border-indigo-400/30 rounded-xl rounded-tr-none p-4 text-sm font-medium text-blue-50">
                                    Profit margins dropped 1.2% primarily due to increased supply costs in the Westside branch during Q3.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default OmisAnalyticsScreen;