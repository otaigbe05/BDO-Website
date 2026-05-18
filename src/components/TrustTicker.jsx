import React from 'react';
import { motion } from 'framer-motion';

const TrustTicker = () => {
  const items = [
    "Built for Canadian Small Business",
    "No CRM Required",
    "Analytics show up to 40% revenue lift potential",
    "Power BI Consulting",
    "Your Data Stays Yours",
    "Custom Dashboards — No Templates",
    "Hands-On Implementation Support",
    "Designed for Owners, Not Data Scientists"
  ];

  return (
    <div className="relative flex overflow-hidden bg-blue-700 text-white py-4 border-y border-blue-800 font-sans">
      <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-blue-700 to-transparent z-10" />
      <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-blue-700 to-transparent z-10" />
      
      <motion.div
        className="flex whitespace-nowrap gap-12 px-6 items-center font-bold text-sm tracking-wider uppercase"
        animate={{ x: [0, -1000] }}
        transition={{
          repeat: Infinity,
          repeatType: "loop",
          duration: 35,
          ease: "linear",
        }}
      >
        {[...items, ...items, ...items].map((item, index) => (
          <span key={index} className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-blue-400" />
            {item}
          </span>
        ))}
      </motion.div>
    </div>
  );
};

export default TrustTicker;