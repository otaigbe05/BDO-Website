import React from 'react';
import { motion } from 'framer-motion';

const OmisKPICard = ({ icon, value, label, trend, bgGradient }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={`rounded-xl p-5 shadow-lg border border-slate-700/50 relative overflow-hidden flex flex-col justify-between h-32 hover:shadow-2xl transition-shadow`}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${bgGradient} opacity-20`} />
      
      <div className="relative z-10 flex justify-between items-start mb-2">
        <div className="p-2 bg-black/20 rounded-lg backdrop-blur-sm">
          {icon}
        </div>
        {trend && (
          <span className="text-xs font-medium px-2 py-1 rounded-full bg-black/20 text-white/90">
            {trend}
          </span>
        )}
      </div>
      
      <div className="relative z-10">
        <h4 className="text-2xl font-bold text-white mb-1">{value}</h4>
        <p className="text-xs text-slate-300 font-medium uppercase tracking-wider">{label}</p>
      </div>
    </motion.div>
  );
};

export default OmisKPICard;