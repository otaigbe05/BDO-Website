import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import OmisCustomersScreen from './OmisCustomersScreen';
import OmisAnalyticsScreen from './OmisAnalyticsScreen';
import OmisDashboardScreen from './OmisDashboardScreen';
import { LayoutDashboard, Users, PieChart, Info } from 'lucide-react';

const OmisDashboardScreens = () => {
  const [activeTab, setActiveTab] = useState('Dashboard');

  const tabs = [
    { id: 'Dashboard', label: 'Main Dashboard', icon: <LayoutDashboard className="w-5 h-5" />, desc: 'Your daily operational command center.' },
    { id: 'Customers', label: 'Customer Management', icon: <Users className="w-5 h-5" />, desc: 'Interactive CRM and client tracking.' },
    { id: 'Analytics', label: 'Analytics Suite', icon: <PieChart className="w-5 h-5" />, desc: 'Deep financial and performance insights.' },
  ];

  const fadeIn = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  };

  return (
    <section className="py-24 bg-slate-100 overflow-hidden border-y border-slate-200">
      <div className="container mx-auto px-4 max-w-[1400px]">
        <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight">Experience OMIS in Action</h2>
            <p className="text-xl text-slate-600 font-medium">Explore the interactive screens below to see how OMIS transforms chaotic business data into clear, operational workflows.</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-12">
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-3 px-6 py-4 rounded-2xl font-bold text-lg transition-all duration-300 w-full sm:w-auto ${
                        activeTab === tab.id 
                            ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/20 scale-105' 
                            : 'bg-white text-slate-600 hover:bg-blue-50 hover:text-blue-700 shadow-md hover:shadow-lg'
                    }`}
                >
                    {tab.icon}
                    {tab.label}
                </button>
            ))}
        </div>

        {/* Interactive Screen Display */}
        <div className="relative mx-auto bg-white p-2 md:p-4 rounded-3xl shadow-2xl border border-slate-200">
             {/* Browser-like window dots */}
             <div className="flex gap-2 p-3 pb-4">
                 <div className="w-3.5 h-3.5 rounded-full bg-red-400"></div>
                 <div className="w-3.5 h-3.5 rounded-full bg-amber-400"></div>
                 <div className="w-3.5 h-3.5 rounded-full bg-emerald-400"></div>
             </div>
             
             <div className="overflow-hidden rounded-2xl relative bg-slate-50">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.4, ease: "easeInOut" }}
                        className="w-full"
                    >
                        {activeTab === 'Dashboard' && <OmisDashboardScreen />}
                        {activeTab === 'Customers' && <OmisCustomersScreen />}
                        {activeTab === 'Analytics' && <OmisAnalyticsScreen />}
                    </motion.div>
                </AnimatePresence>
             </div>
        </div>

        {/* Disclaimer Section */}
        <motion.div 
          initial={fadeIn.initial}
          whileInView={fadeIn.animate}
          viewport={{ once: true }}
          transition={fadeIn.transition}
          className="mt-12 max-w-4xl mx-auto bg-[#F3F4F6] border border-[#E5E7EB] rounded-lg p-[20px] shadow-sm flex flex-col md:flex-row items-center gap-4 text-center md:text-left"
        >
          <div className="flex-shrink-0">
            <Info className="w-5 h-5 text-[#6B7280]" />
          </div>
          <p className="text-[14px] text-[#6B7280] leading-relaxed font-medium">
            Disclaimer: The dashboards shown above are mockups for illustration purposes only. Names, data, and customer information are not real and are used as examples. The actual OMIS software may look different from what appears here. These mockups are intended to demonstrate the types of features and functionality available in the OMIS platform.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default OmisDashboardScreens;