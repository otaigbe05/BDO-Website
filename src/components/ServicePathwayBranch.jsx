import React from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Settings, ChevronDown } from 'lucide-react';

const ServicePathwayBranch = () => {
  return (
    <section className="py-20 bg-slate-950 text-white relative border-b border-slate-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-6 text-white">Choose Your Solution</h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            We offer two distinct approaches depending on your current business infrastructure.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 md:gap-0 relative max-w-6xl mx-auto">
          {/* Vertical Divider for Desktop */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-slate-800 via-blue-900/50 to-slate-800 -translate-x-1/2 z-10" />
          
          {/* Mobile Divider */}
          <div className="md:hidden w-full h-px bg-slate-800 my-4" />

          {/* Left Path: Analytics */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="md:pr-16 flex flex-col items-center md:items-end text-center md:text-right group cursor-pointer"
          >
            <div className="w-20 h-20 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center mb-6 shadow-lg group-hover:shadow-blue-900/20 group-hover:border-blue-500/50 transition-all duration-300 group-hover:scale-105">
              <BarChart3 className="w-10 h-10 text-blue-400" />
            </div>
            <h3 className="text-2xl font-bold mb-3 text-white group-hover:text-blue-300 transition-colors">
              Power BI Analytics
            </h3>
            <p className="text-slate-400 leading-relaxed mb-6 max-w-sm">
              You already have data but need better insights. We transform your raw Excel or SQL data into interactive business intelligence dashboards.
            </p>
            <div className="flex items-center gap-2 text-sm font-semibold text-blue-400 animate-pulse">
              Explore Analytics <ChevronDown className="w-4 h-4" />
            </div>
          </motion.div>

          {/* Right Path: OMIS */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="md:pl-16 flex flex-col items-center md:items-start text-center md:text-left group cursor-pointer"
          >
            <div className="w-20 h-20 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center mb-6 shadow-lg group-hover:shadow-teal-900/20 group-hover:border-teal-500/50 transition-all duration-300 group-hover:scale-105">
              <Settings className="w-10 h-10 text-teal-400" />
            </div>
            <h3 className="text-2xl font-bold mb-3 text-white group-hover:text-teal-300 transition-colors">
              OMIS Implementation
            </h3>
            <p className="text-slate-400 leading-relaxed mb-6 max-w-sm">
              You need a system to manage operations. We implement our custom CRM/ERP solution to streamline your workflows from day one.
            </p>
            <div className="flex items-center gap-2 text-sm font-semibold text-teal-400 animate-pulse">
              Explore Implementation <ChevronDown className="w-4 h-4" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ServicePathwayBranch;