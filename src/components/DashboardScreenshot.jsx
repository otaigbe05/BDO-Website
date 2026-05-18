import React from 'react';
import { 
  LayoutDashboard, 
  Calendar, 
  Users, 
  FileText, 
  BarChart2, 
  FileBarChart, 
  MapPin, 
  Settings, 
  HelpCircle,
  ChevronDown,
  DollarSign,
  TrendingUp,
  Activity,
  UserPlus
} from 'lucide-react';

const DashboardScreenshot = () => {
  return (
    <div className="w-full bg-white rounded-xl overflow-hidden shadow-2xl border border-slate-200 font-sans text-slate-600 flex md:flex-row flex-col select-none transform transition-transform duration-700 hover:scale-[1.01]">
      {/* Sidebar */}
      <div className="w-full md:w-64 bg-white border-r border-slate-100 flex flex-col shrink-0">
        <div className="p-6">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center text-white">
              <Activity size={20} />
            </div>
            <div>
              <h2 className="font-bold text-slate-900 text-lg leading-none">OMIS</h2>
              <span className="text-[10px] text-slate-400 font-semibold tracking-wider">CRM PLATFORM</span>
            </div>
          </div>
          
          <div className="mt-6 relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                <MapPin size={16} />
            </div>
            <select className="w-full bg-white border border-teal-400 text-slate-700 text-sm rounded-lg py-2 pl-9 pr-3 appearance-none focus:outline-none focus:ring-2 focus:ring-teal-500/20 cursor-pointer">
              <option>Down Town Mississauga</option>
              <option>Toronto HQ</option>
              <option>Vancouver Branch</option>
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
        </div>

        <nav className="flex-1 px-4 pb-4 space-y-1 overflow-y-auto">
          {[
            { icon: <LayoutDashboard size={18} />, label: "Dashboard" },
            { icon: <Calendar size={18} />, label: "Calendar" },
            { icon: <Users size={18} />, label: "Clients" },
            { icon: <FileText size={18} />, label: "Invoices" },
            { icon: <BarChart2 size={18} />, label: "Analytics Suite", active: true },
            { icon: <FileBarChart size={18} />, label: "Reports" },
            { icon: <MapPin size={18} />, label: "Locations" },
            { icon: <Settings size={18} />, label: "Settings" },
          ].map((item, idx) => (
            <div 
              key={idx}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium cursor-pointer transition-colors ${
                item.active 
                  ? "bg-teal-50 text-teal-700" 
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <span className={item.active ? "text-teal-600" : "text-slate-400"}>{item.icon}</span>
              {item.label}
              {item.active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-teal-500" />}
            </div>
          ))}
        </nav>
        
        <div className="p-4 border-t border-slate-100">
           <div className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-slate-500 hover:bg-slate-50 cursor-pointer">
              <HelpCircle size={18} className="text-slate-400" />
              Support
           </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-slate-50/30 p-4 md:p-8 min-w-0 overflow-x-auto">
        <div className="flex items-start gap-4 mb-8">
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-600/20 shrink-0">
                <BarChart2 size={24} />
            </div>
            <div>
                <h1 className="text-2xl font-bold text-slate-900">Analytics Suite</h1>
                <p className="text-slate-500">Real-time business intelligence</p>
            </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-2 rounded-xl border border-slate-200 shadow-sm mb-6 flex flex-wrap items-center gap-2">
            {[
                { label: "Date", value: "All Years" },
                { label: "Quarter", value: "All Quarters" },
                { label: "Month", value: "All Months" },
                { label: "Location", value: "All Locations" },
                { label: "Category", value: "All Categories" },
            ].map((filter, idx) => (
                <div key={idx} className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 rounded-md border border-slate-100 cursor-pointer transition-colors min-w-fit">
                    <span className="text-xs font-semibold text-slate-400">{filter.label}:</span>
                    <span className="text-sm font-medium text-slate-700">{filter.value}</span>
                    <ChevronDown size={12} className="text-slate-400" />
                </div>
            ))}
            <div className="ml-auto px-3 text-xs font-medium text-slate-400">
                Active Filters <span className="text-slate-900 font-bold ml-1">0</span>
            </div>
        </div>

        {/* Tabs */}
        <div className="flex overflow-x-auto pb-2 mb-6 gap-1 border-b border-slate-200">
            {["Executive", "Revenue", "Customers", "Services", "Locations", "Forecasting", "Timeline"].map((tab, idx) => (
                <button 
                    key={idx}
                    className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors whitespace-nowrap flex items-center gap-2 ${
                        idx === 0 
                            ? "bg-white text-slate-900 border-b-2 border-slate-900" 
                            : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
                    }`}
                >
                    {idx === 0 && <Activity size={14} />}
                    {idx === 1 && <DollarSign size={14} />}
                    {idx === 2 && <Users size={14} />}
                    {tab}
                </button>
            ))}
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            {[
                { title: "Total Revenue", value: "$125,450", color: "from-blue-500 to-blue-600", icon: <DollarSign className="opacity-80" /> },
                { title: "Total Profit", value: "$42,890", color: "from-emerald-500 to-emerald-600", icon: <TrendingUp className="opacity-80" /> },
                { title: "Avg Order Value", value: "$287", color: "from-orange-500 to-orange-600", icon: <BarChart2 className="opacity-80" /> },
                { title: "Total Customers", value: "487", color: "from-purple-500 to-purple-600", icon: <UserPlus className="opacity-80" /> },
                { title: "Profit Margin %", value: "34.2%", color: "from-pink-500 to-pink-600", icon: <Activity className="opacity-80" /> },
            ].map((card, idx) => (
                <div key={idx} className={`bg-gradient-to-br ${card.color} rounded-xl p-5 text-white shadow-lg relative overflow-hidden group`}>
                     <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
                        {React.cloneElement(card.icon, { size: 60 })}
                     </div>
                     <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center mb-3 backdrop-blur-sm">
                        {card.icon}
                     </div>
                     <p className="text-blue-50 text-xs font-medium mb-1 opacity-90">{card.title}</p>
                     <h3 className="text-2xl font-bold tracking-tight">{card.value}</h3>
                </div>
            ))}
        </div>

        {/* AI Assistant */}
        <div className="mt-8 border-t border-slate-200 pt-6">
            <h4 className="font-bold text-slate-900 mb-1">AI Analytics Assistant</h4>
            <p className="text-slate-500 text-sm">Ask questions about your business data in natural language</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardScreenshot;