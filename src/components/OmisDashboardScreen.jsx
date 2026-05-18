import React, { useState } from 'react';
import { LayoutDashboard, Calendar, Users, FileText, PieChart, BarChart2, Settings, HelpCircle, Shield, Plus, DollarSign, CheckCircle2, ChevronRight } from 'lucide-react';

const OmisDashboardScreen = () => {
  const [branchFilter, setBranchFilter] = useState('Main Branch');

  const sidebarLinks = [
    { icon: <LayoutDashboard className="w-5 h-5" />, label: 'Dashboard', active: true },
    { icon: <Calendar className="w-5 h-5" />, label: 'Calendar' },
    { icon: <Users className="w-5 h-5" />, label: 'Clients' },
    { icon: <FileText className="w-5 h-5" />, label: 'Invoices' },
    { icon: <PieChart className="w-5 h-5" />, label: 'Analytics Suite' },
    { icon: <BarChart2 className="w-5 h-5" />, label: 'Reports' },
    { icon: <Settings className="w-5 h-5" />, label: 'Settings' },
    { icon: <HelpCircle className="w-5 h-5" />, label: 'Support' },
    { icon: <Shield className="w-5 h-5" />, label: 'User Management' },
  ];

  const team = [
    { id: 1, name: 'Grace Patel', role: 'Veterinarian', count: '0 today', initials: 'GP', color: 'bg-emerald-100 text-emerald-700' },
    { id: 2, name: 'Michael Chen', role: 'Vet Tech', count: '0 today', initials: 'MC', color: 'bg-blue-100 text-blue-700' },
    { id: 3, name: 'Sophia Lee', role: 'Receptionist', count: '0 today', initials: 'SL', color: 'bg-purple-100 text-purple-700' },
    { id: 4, name: 'Amanda Garcia', role: 'Groomer', count: '0 today', initials: 'AG', color: 'bg-orange-100 text-orange-700' },
  ];

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
      <div className="flex-1 flex flex-col overflow-hidden bg-slate-50/50">
        {/* Header */}
        <header className="px-8 py-8 flex justify-between items-start border-b border-slate-200 bg-white">
           <div>
             <h1 className="text-3xl font-bold text-slate-900 mb-2">Good morning Benjamin</h1>
             <div className="flex items-center gap-3">
                 <div className="w-10 h-10 bg-indigo-100 text-indigo-700 rounded-lg flex items-center justify-center font-bold text-lg">H</div>
                 <div>
                    <h2 className="text-lg font-bold text-slate-900 leading-tight">Hamilton Vet Clinic</h2>
                    <p className="text-sm text-slate-500 font-medium">Veterinary Clinic</p>
                 </div>
             </div>
           </div>
           <div className="flex items-center gap-4">
                <select 
                  value={branchFilter}
                  onChange={(e) => setBranchFilter(e.target.value)}
                  className="px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-700 font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm cursor-pointer hover:border-blue-400 transition-colors"
                >
                    <option>Main Branch</option>
                    <option>Downtown Clinic</option>
                </select>
                <button className="bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 px-5 py-2.5 rounded-xl font-bold transition-all shadow-sm">
                    View Calendar
                </button>
                <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all shadow-sm">
                    <Plus className="w-5 h-5" />
                    New Pet Owner
                </button>
           </div>
        </header>

        {/* Dashboard Content */}
        <div className="flex-1 p-8 overflow-y-auto">
            {/* KPI Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all hover:-translate-y-1 group cursor-pointer">
                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                        <Calendar className="w-6 h-6" />
                    </div>
                    <p className="text-slate-500 font-bold text-sm mb-1 uppercase tracking-wide">Today's Appointments</p>
                    <h3 className="text-4xl font-black text-slate-900 mb-2">0</h3>
                    <p className="text-slate-400 text-sm font-medium">0 completed, 0 upcoming</p>
                </div>
                
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all hover:-translate-y-1 group cursor-pointer">
                    <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center mb-4 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                        <Users className="w-6 h-6" />
                    </div>
                    <p className="text-slate-500 font-bold text-sm mb-1 uppercase tracking-wide">Total Pet Owners</p>
                    <h3 className="text-4xl font-black text-slate-900 mb-2">0</h3>
                    <p className="text-slate-400 text-sm font-medium">
                        <span className="text-emerald-500 font-bold">+0 this month</span> • 0 vs last period
                    </p>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all hover:-translate-y-1 group cursor-pointer">
                    <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-4 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                        <DollarSign className="w-6 h-6" />
                    </div>
                    <p className="text-slate-500 font-bold text-sm mb-1 uppercase tracking-wide">Monthly Revenue</p>
                    <h3 className="text-4xl font-black text-slate-900 mb-2">$0</h3>
                    <p className="text-slate-400 text-sm font-medium">0 pending invoices</p>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all hover:-translate-y-1 group cursor-pointer">
                    <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center mb-4 group-hover:bg-orange-600 group-hover:text-white transition-colors">
                        <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <p className="text-slate-500 font-bold text-sm mb-1 uppercase tracking-wide">No Shows</p>
                    <h3 className="text-4xl font-black text-slate-900 mb-2">0</h3>
                    <p className="text-slate-400 text-sm font-medium">0 today</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Schedule */}
                <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col min-h-[300px]">
                    <div className="flex justify-between items-center mb-8">
                        <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-blue-600" /> Today's Schedule
                        </h3>
                        <a href="#" className="text-blue-600 font-bold hover:underline text-sm">View all</a>
                    </div>
                    <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
                        <Calendar className="w-16 h-16 mb-4 text-slate-200" strokeWidth={1.5} />
                        <p className="text-lg font-medium">No upcoming appointments</p>
                    </div>
                </div>

                {/* Team */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold text-slate-900">Team</h3>
                    </div>
                    <div className="space-y-4">
                        {team.map((member) => (
                            <div key={member.id} className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer group border border-transparent hover:border-slate-200">
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${member.color}`}>
                                        {member.initials}
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{member.name}</p>
                                        <p className="text-xs text-slate-500 font-medium">{member.role}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-sm font-semibold text-slate-400 bg-slate-100 px-2 py-1 rounded-md">{member.count}</span>
                                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-blue-500 transition-colors" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default OmisDashboardScreen;