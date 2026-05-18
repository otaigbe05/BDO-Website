import React from 'react';
import { motion } from 'framer-motion';
import { DollarSign, Clock, TrendingUp, CalendarDays } from 'lucide-react';
import ROICalculatorChart from './ROICalculatorChart';

const formatCurrency = (val) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);
const formatNumber = (val) => new Intl.NumberFormat('en-US', { maximumFractionDigits: 1 }).format(val);

const ResultCard = ({ title, value, icon, colorClass, delay }) => (
  <motion.div 
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay }}
    className={`rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 relative overflow-hidden ${colorClass}`}
  >
    <div className="absolute top-0 right-0 p-4 opacity-20 transform translate-x-4 -translate-y-4">
      {React.cloneElement(icon, { className: 'w-24 h-24' })}
    </div>
    <div className="relative z-10">
      <div className="bg-white/20 w-12 h-12 rounded-xl flex items-center justify-center mb-4 backdrop-blur-sm border border-white/30">
        {icon}
      </div>
      <p className="text-white font-bold uppercase tracking-wider text-sm mb-1 drop-shadow-sm">{title}</p>
      <h3 className="text-4xl font-extrabold tracking-tight drop-shadow-md">{value}</h3>
    </div>
  </motion.div>
);

const ROICalculatorResults = ({ results, inputs }) => {
  if (!results) return null;

  return (
    <div className="space-y-8" id="roi-results-container">
      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <ResultCard 
          title="Total Annual Savings" 
          value={formatCurrency(results.totalSavings)} 
          icon={<DollarSign className="w-6 h-6 text-white" />} 
          colorClass="bg-gradient-to-br from-emerald-600 to-emerald-800" 
          delay={0.1} 
        />
        <ResultCard 
          title="Time Saved Per Year" 
          value={`${formatNumber(results.timeSavedHours)} hrs`} 
          icon={<Clock className="w-6 h-6 text-white" />} 
          colorClass="bg-gradient-to-br from-blue-600 to-blue-800" 
          delay={0.2} 
        />
        <ResultCard 
          title="Est. ROI Percentage" 
          value={`${formatNumber(results.roi)}%`} 
          icon={<TrendingUp className="w-6 h-6 text-white" />} 
          colorClass="bg-gradient-to-br from-purple-600 to-purple-800" 
          delay={0.3} 
        />
        <ResultCard 
          title="Payback Period" 
          value={`${formatNumber(results.paybackPeriod)} mo`} 
          icon={<CalendarDays className="w-6 h-6 text-white" />} 
          colorClass="bg-gradient-to-br from-orange-600 to-orange-800" 
          delay={0.4} 
        />
      </div>

      {/* Chart Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-2xl shadow-xl border border-slate-300 p-6 md:p-8"
      >
        <h3 className="text-xl font-bold text-slate-900 mb-2">Cost Comparison: Before vs. After OMIS</h3>
        <p className="text-slate-800 font-medium text-sm mb-6">Visual breakdown of your annual cost reductions</p>
        <ROICalculatorChart results={results} inputs={inputs} />
      </motion.div>

      {/* Detailed Table */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white rounded-2xl shadow-xl border border-slate-300 overflow-hidden"
      >
        <div className="p-6 border-b border-slate-200 bg-slate-50">
          <h3 className="text-xl font-bold text-slate-900">Savings Breakdown</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <tbody className="divide-y divide-slate-200">
              <tr className="hover:bg-slate-50 transition-colors">
                <td className="p-4 text-slate-800 font-bold">Manual Reporting Cost Savings</td>
                <td className="p-4 text-right text-emerald-700 font-bold">+{formatCurrency(results.costSaved)}</td>
              </tr>
              <tr className="hover:bg-slate-50 transition-colors">
                <td className="p-4 text-slate-800 font-bold">Software Cost Reduction</td>
                <td className="p-4 text-right text-emerald-700 font-bold">+{formatCurrency(results.softwareCostReduction)}</td>
              </tr>
              <tr className="bg-slate-50">
                <td className="p-4 text-slate-900 font-bold text-lg">Gross Total Savings</td>
                <td className="p-4 text-right text-emerald-700 font-bold text-lg">{formatCurrency(results.totalSavings)}</td>
              </tr>
              <tr className="hover:bg-slate-50 transition-colors">
                <td className="p-4 text-slate-800 font-bold flex items-center gap-2">
                  Estimated OMIS Annual Cost
                  <span className="text-[10px] bg-slate-200 text-slate-800 px-2 py-0.5 rounded-full font-bold">Pro Plan</span>
                </td>
                <td className="p-4 text-right text-red-600 font-bold">-{formatCurrency(results.omisCost)}</td>
              </tr>
              <tr className="bg-blue-50 border-t-2 border-blue-200">
                <td className="p-5 text-blue-900 font-bold text-xl">Net Annual Value</td>
                <td className="p-5 text-right text-blue-800 font-extrabold text-2xl">{formatCurrency(results.totalSavings - results.omisCost)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default ROICalculatorResults;