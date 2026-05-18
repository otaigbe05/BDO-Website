import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Slicers from './Slicers';
import { getRevenueData, getSalesCategoryData, getKPIData, getTimeRangeLabels } from '@/lib/dashboardData';

const ServicesDashboardMockup = ({ className = "" }) => {
  const [timeRange, setTimeRange] = useState("Last 6 months");
  const [salesCategory, setSalesCategory] = useState("Services");
  const [clientSegment, setClientSegment] = useState("All Clients");

  const [data, setData] = useState({
    kpi: getKPIData("Last 6 months", "Services", "All Clients"),
    revenue: getRevenueData("Last 6 months", "Services", "All Clients"),
    category: getSalesCategoryData("Services"),
    labels: getTimeRangeLabels("Last 6 months")
  });

  useEffect(() => {
    // Simulate slight network delay for realism or just instant update
    setData({
      kpi: getKPIData(timeRange, salesCategory, clientSegment),
      revenue: getRevenueData(timeRange, salesCategory, clientSegment),
      category: getSalesCategoryData(salesCategory),
      labels: getTimeRangeLabels(timeRange)
    });
  }, [timeRange, salesCategory, clientSegment]);

  return (
    <div className={`w-full text-white overflow-hidden ${className}`}>
      <div className="mx-auto">
        <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="w-full"
        >
             <div className="bg-slate-950 rounded-xl border border-slate-800 shadow-2xl overflow-hidden relative">
                 
                 {/* Integrated Slicers */}
                 <Slicers 
                    timeRange={timeRange} setTimeRange={setTimeRange}
                    salesCategory={salesCategory} setSalesCategory={setSalesCategory}
                    clientSegment={clientSegment} setClientSegment={setClientSegment}
                 />

                 <div className="p-6">
                    {/* Dashboard Header */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 border-b border-slate-800 pb-4 gap-4">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded bg-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.5)]"></div>
                            <div>
                                <h3 className="font-extrabold text-3xl text-white">Executive Overview</h3>
                                <p className="text-xs text-slate-500">Real-time performance metrics</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-slate-400">
                            <span className="hidden sm:inline">Last Updated: Just now</span>
                            <span className="text-white bg-slate-800 border border-slate-700 px-3 py-1 rounded-full flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                                Live Data
                            </span>
                        </div>
                    </div>

                    {/* KPI Cards */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        {[
                            { label: "Total Revenue", val: `$${data.kpi.revenue.toLocaleString()}`, grow: `${data.kpi.revTrend}${Math.abs(data.kpi.growth/2).toFixed(1)}%` },
                            { label: "Growth Rate", val: `${data.kpi.growth}%`, grow: `${data.kpi.growthTrend}2.1%` },
                            { label: "Active Clients", val: data.kpi.clients.toLocaleString(), grow: `${data.kpi.clientTrend}58` },
                            { label: "Conversion", val: `${data.kpi.conversion}%`, grow: `${data.kpi.convTrend}0.4%` },
                        ].map((kpi, i) => (
                            <motion.div 
                                key={i} 
                                layout
                                className="bg-slate-900/40 p-4 rounded-lg border border-slate-800 hover:border-slate-700 transition-colors"
                            >
                                <p className="text-slate-400 text-sm mb-1">{kpi.label}</p>
                                <AnimatePresence mode="wait">
                                    <motion.div 
                                        key={kpi.val}
                                        initial={{ opacity: 0, y: 5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -5 }}
                                        className="text-2xl font-bold text-white mb-1"
                                    >
                                        {kpi.val}
                                    </motion.div>
                                </AnimatePresence>
                                <div className={`text-xs font-semibold ${kpi.grow.includes('+') ? 'text-teal-400' : 'text-red-400'}`}>
                                    {kpi.grow} vs last period
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Charts Area */}
                    <div className="grid md:grid-cols-3 gap-6 h-auto md:h-80">
                        {/* Line Chart Area */}
                        <div className="md:col-span-2 bg-slate-900/40 rounded-lg border border-slate-800 p-6 flex flex-col min-h-[300px]">
                            <h4 className="text-sm font-semibold text-slate-300 mb-6 flex justify-between">
                                <span>Revenue Trend</span>
                                <span className="text-slate-500 font-normal">{timeRange}</span>
                            </h4>
                            <div className="flex-1 flex items-end justify-between gap-2 px-2">
                                <AnimatePresence mode='popLayout'>
                                    {data.revenue.map((item, i) => (
                                        <div key={i} className="flex flex-col items-center flex-1 h-full justify-end group gap-2">
                                            {/* Tooltip on hover */}
                                            <div className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] bg-slate-800 px-2 py-1 rounded text-white mb-1 absolute -translate-y-8">
                                                ${item.value.toLocaleString()}
                                            </div>
                                            
                                            <motion.div 
                                                initial={{ height: 0 }}
                                                animate={{ height: `${item.height}%` }}
                                                transition={{ duration: 0.5, type: "spring" }}
                                                className="w-full bg-gradient-to-t from-blue-900/80 to-blue-500 rounded-t-sm hover:from-blue-800 hover:to-blue-400 transition-colors relative"
                                            >
                                                <div className="absolute top-0 w-full h-[2px] bg-blue-300/30"></div>
                                            </motion.div>
                                            <span className="text-xs text-slate-500">{data.labels[i]}</span>
                                        </div>
                                    ))}
                                </AnimatePresence>
                            </div>
                        </div>

                        {/* Donut Chart Area */}
                        <div className="bg-slate-900/40 rounded-lg border border-slate-800 p-6 flex flex-col items-center justify-center relative min-h-[300px]">
                            <h4 className="text-sm font-semibold text-slate-300 w-full mb-4 text-left">Sales by Category</h4>
                            <div className="relative w-48 h-48">
                                <svg viewBox="0 0 100 100" className="w-full h-full rotate-[-90deg]">
                                    {/* Background Circle */}
                                    <circle cx="50" cy="50" r="40" fill="transparent" stroke="#1e293b" strokeWidth="15" />
                                    
                                    {/* Animated Segment */}
                                    <motion.circle 
                                        cx="50" cy="50" r="40" 
                                        fill="transparent" 
                                        stroke="#0891b2" // Teal
                                        strokeWidth="15" 
                                        strokeLinecap="round"
                                        strokeDasharray="251.2"
                                        initial={{ strokeDashoffset: 251.2 }}
                                        animate={{ strokeDashoffset: 251.2 - (251.2 * (data.category.main / 100)) }}
                                        transition={{ duration: 1, ease: "easeOut" }}
                                    />
                                    
                                    {/* Secondary Segment (Implied remainder) */}
                                    <motion.circle 
                                        cx="50" cy="50" r="40" 
                                        fill="transparent" 
                                        stroke="#2563eb" // Blue
                                        strokeWidth="15" 
                                        strokeLinecap="round"
                                        strokeDasharray="251.2"
                                        initial={{ strokeDashoffset: 251.2 }}
                                        animate={{ strokeDashoffset: 251.2 - (251.2 * ((100 - data.category.main) / 100)) }}
                                        className="opacity-30"
                                        style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
                                    />
                                </svg>
                                <div className="absolute inset-0 flex items-center justify-center flex-col">
                                    <AnimatePresence mode="wait">
                                        <motion.span 
                                            key={data.category.main}
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className="text-3xl font-bold text-white"
                                        >
                                            {data.category.main}%
                                        </motion.span>
                                    </AnimatePresence>
                                    <span className="text-xs text-slate-400 uppercase tracking-wider mt-1">{data.category.label}</span>
                                </div>
                            </div>
                            <div className="flex gap-4 mt-6">
                                <div className="flex items-center gap-2 text-xs text-slate-400">
                                    <span className="w-3 h-3 rounded-full bg-teal-600"></span>
                                    {data.category.label}
                                </div>
                                <div className="flex items-center gap-2 text-xs text-slate-400">
                                    <span className="w-3 h-3 rounded-full bg-blue-900/50"></span>
                                    Other
                                </div>
                            </div>
                        </div>
                    </div>
                 </div>
             </div>
             <p className="text-center mt-6 text-slate-500 text-sm font-medium">
                 Sample data shown for demonstration purposes
             </p>
        </motion.div>
      </div>
    </div>
  );
};

export default ServicesDashboardMockup;