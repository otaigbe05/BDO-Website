import React from 'react';
import { 
  Search, 
  Plus, 
  MapPin, 
  Activity,
  MoreVertical
} from 'lucide-react';
import OmisSidebar from './OmisSidebar';
import { Button } from '@/components/ui/button';

const OmisCustomersPage = () => {
  const customers = [
    { initials: 'AK', name: 'Aurora Kim', email: 'aurora.kim@example.com', phone: '555-0238', visits: 0, lastVisit: 'Dec 12', color: 'bg-rose-500' },
    { initials: 'LC', name: 'Luna Chen', email: 'luna.chen@example.com', phone: '555-0237', visits: 0, lastVisit: 'Feb 7', color: 'bg-blue-500' },
    { initials: 'MR', name: 'Mateo Rivera', email: 'mateo.rivera@example.com', phone: '555-0235', visits: 0, lastVisit: 'Jan 4', color: 'bg-emerald-500' },
    { initials: 'EC', name: 'Elijah Cruz', email: 'elijah.cruz@example.com', phone: '555-0234', visits: 0, lastVisit: 'Oct 16', color: 'bg-purple-500' },
  ];

  return (
    <div className="flex w-full h-full bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 text-left">
      <OmisSidebar activePage="customers" />
      
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 bg-slate-900/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">Customers</h2>
            <p className="text-sm text-slate-400">Manage your customers and their records</p>
          </div>
          <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
            <Plus className="w-4 h-4 mr-2" />
            Add Customer
          </Button>
        </div>

        {/* Toolbar */}
        <div className="p-6 pb-2">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input 
                type="text" 
                placeholder="Search customers..." 
                className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
            <div className="flex gap-2">
              <div className="flex items-center gap-2 bg-slate-950 px-3 py-2 rounded-lg border border-slate-800 text-sm text-slate-300 cursor-pointer hover:border-slate-600">
                <MapPin className="w-4 h-4" />
                <span>Main Branch</span>
              </div>
              <div className="flex items-center gap-2 bg-slate-950 px-3 py-2 rounded-lg border border-slate-800 text-sm text-slate-300 cursor-pointer hover:border-slate-600">
                <Activity className="w-4 h-4" />
                <span>All Status</span>
              </div>
            </div>
          </div>
        </div>

        {/* Customer List */}
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
            <div className="grid grid-cols-12 gap-4 p-4 border-b border-slate-800 text-xs font-semibold text-slate-400 uppercase tracking-wider bg-slate-900/50">
              <div className="col-span-4">Customer</div>
              <div className="col-span-3">Contact Info</div>
              <div className="col-span-2">Visits</div>
              <div className="col-span-2">Last Visit</div>
              <div className="col-span-1 text-right">Actions</div>
            </div>
            
            <div className="divide-y divide-slate-800/50">
              {customers.map((c, i) => (
                <div key={i} className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-slate-900 transition-colors cursor-pointer group">
                  <div className="col-span-4 flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md ${c.color}`}>
                      {c.initials}
                    </div>
                    <div>
                      <p className="font-semibold text-white group-hover:text-blue-400 transition-colors">{c.name}</p>
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mt-1">
                        Active
                      </span>
                    </div>
                  </div>
                  
                  <div className="col-span-3">
                    <p className="text-sm text-slate-300 truncate">{c.email}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{c.phone}</p>
                  </div>
                  
                  <div className="col-span-2">
                    <p className="text-sm text-slate-300 font-medium">{c.visits}</p>
                  </div>
                  
                  <div className="col-span-2">
                    <p className="text-sm text-slate-400">{c.lastVisit}</p>
                  </div>
                  
                  <div className="col-span-1 flex justify-end">
                    <button className="p-2 text-slate-500 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OmisCustomersPage;