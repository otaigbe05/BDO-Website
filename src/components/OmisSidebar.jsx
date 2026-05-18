import React from 'react';
import { 
  LayoutDashboard, 
  Calendar, 
  Users, 
  FileText, 
  BarChart2, 
  FileBarChart, 
  Settings, 
  LifeBuoy, 
  Shield 
} from 'lucide-react';

const OmisSidebar = ({ activePage = 'analytics' }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: 'calendar', label: 'Calendar', icon: <Calendar className="w-5 h-5" /> },
    { id: 'clients', label: 'Clients', icon: <Users className="w-5 h-5" /> },
    { id: 'invoices', label: 'Invoices', icon: <FileText className="w-5 h-5" /> },
    { id: 'analytics', label: 'Analytics Suite', icon: <BarChart2 className="w-5 h-5" /> },
    { id: 'reports', label: 'Reports', icon: <FileBarChart className="w-5 h-5" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-5 h-5" /> },
    { id: 'support', label: 'Support', icon: <LifeBuoy className="w-5 h-5" /> },
    { id: 'users', label: 'User Management', icon: <Shield className="w-5 h-5" /> },
  ];

  return (
    <div className="hidden lg:flex flex-col w-64 bg-slate-950 border-r border-slate-800 h-full min-h-[600px] text-slate-300">
      <div className="p-6 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <BarChart2 className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-white text-lg tracking-tight">OMIS</span>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
        {navItems.map((item) => {
          const isActive = activePage === item.id || (activePage === 'customers' && item.id === 'clients');
          return (
            <button
              key={item.id}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                isActive 
                  ? 'bg-blue-600/10 text-blue-400 font-medium' 
                  : 'hover:bg-slate-900 hover:text-white'
              }`}
            >
              {item.icon}
              <span className="text-sm">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default OmisSidebar;