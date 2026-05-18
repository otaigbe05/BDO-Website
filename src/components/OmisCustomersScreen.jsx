import React, { useState } from 'react';
import { Search, Plus, Filter, LayoutDashboard, Calendar, Users, FileText, PieChart, BarChart2, Settings, HelpCircle, Shield } from 'lucide-react';

const OmisCustomersScreen = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [branchFilter, setBranchFilter] = useState('Main Branch');

  const initialCustomers = [
    { id: 1, name: 'Eleanor Pena', status: 'Active', email: 'eleanor.pena@example.com', phone: '(555) 123-4567', visits: 12, lastVisit: '2023-10-15', initials: 'EP', color: 'bg-blue-100 text-blue-700' },
    { id: 2, name: 'Darrell Steward', status: 'Inactive', email: 'darrell.s@example.com', phone: '(555) 234-5678', visits: 3, lastVisit: '2023-08-22', initials: 'DS', color: 'bg-emerald-100 text-emerald-700' },
    { id: 3, name: 'Wade Warren', status: 'Active', email: 'wade.w@example.com', phone: '(555) 345-6789', visits: 8, lastVisit: '2023-10-28', initials: 'WW', color: 'bg-purple-100 text-purple-700' },
    { id: 4, name: 'Esther Howard', status: 'Active', email: 'esther.h@example.com', phone: '(555) 456-7890', visits: 15, lastVisit: '2023-11-02', initials: 'EH', color: 'bg-amber-100 text-amber-700' },
    { id: 5, name: 'Cameron Williamson', status: 'Inactive', email: 'cameron.w@example.com', phone: '(555) 567-8901', visits: 1, lastVisit: '2023-05-14', initials: 'CW', color: 'bg-pink-100 text-pink-700' },
  ];

  const filteredCustomers = initialCustomers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) || customer.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All Status' || customer.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const sidebarLinks = [
    { icon: <LayoutDashboard className="w-5 h-5" />, label: 'Dashboard' },
    { icon: <Calendar className="w-5 h-5" />, label: 'Calendar' },
    { icon: <Users className="w-5 h-5" />, label: 'Clients', active: true },
    { icon: <FileText className="w-5 h-5" />, label: 'Invoices' },
    { icon: <PieChart className="w-5 h-5" />, label: 'Analytics Suite' },
    { icon: <BarChart2 className="w-5 h-5" />, label: 'Reports' },
    { icon: <Settings className="w-5 h-5" />, label: 'Settings' },
    { icon: <HelpCircle className="w-5 h-5" />, label: 'Support' },
    { icon: <Shield className="w-5 h-5" />, label: 'User Management' },
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
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 px-8 py-6 flex justify-between items-center">
           <div>
             <h1 className="text-2xl font-bold text-slate-900 mb-1">Customers</h1>
             <p className="text-sm text-slate-500 font-medium">Manage your customers and their records</p>
           </div>
           <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all shadow-sm hover:shadow-md">
             <Plus className="w-5 h-5" />
             Add Customer
           </button>
        </header>

        {/* Filters */}
        <div className="p-8 pb-4 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
            <div className="relative w-full sm:w-96">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input 
                  type="text" 
                  placeholder="Search customers..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-900 font-medium shadow-sm transition-shadow"
                />
            </div>
            <div className="flex gap-3 w-full sm:w-auto">
                <select 
                  value={branchFilter}
                  onChange={(e) => setBranchFilter(e.target.value)}
                  className="px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm cursor-pointer"
                >
                    <option>Main Branch</option>
                    <option>Downtown</option>
                    <option>Westside</option>
                </select>
                <select 
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm cursor-pointer"
                >
                    <option>All Status</option>
                    <option>Active</option>
                    <option>Inactive</option>
                </select>
            </div>
        </div>

        {/* Customer Grid */}
        <div className="flex-1 p-8 pt-4 overflow-y-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredCustomers.map((customer) => (
                    <div key={customer.id} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer group">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${customer.color}`}>
                                    {customer.initials}
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900 text-lg group-hover:text-blue-600 transition-colors">{customer.name}</h3>
                                    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-bold mt-1 ${customer.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
                                        {customer.status}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-3 mt-6 pt-6 border-t border-slate-100">
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-500 font-medium">Email</span>
                                <span className="text-slate-900 font-semibold">{customer.email}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-500 font-medium">Phone</span>
                                <span className="text-slate-900 font-semibold">{customer.phone}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-500 font-medium">Total Visits</span>
                                <span className="text-slate-900 font-bold">{customer.visits}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-500 font-medium">Last Visit</span>
                                <span className="text-slate-900 font-semibold">{customer.lastVisit}</span>
                            </div>
                        </div>
                    </div>
                ))}
                {filteredCustomers.length === 0 && (
                  <div className="col-span-full py-12 text-center text-slate-500 font-medium">
                    No customers found matching your filters.
                  </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default OmisCustomersScreen;