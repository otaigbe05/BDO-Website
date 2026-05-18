import React from 'react';
import { motion } from 'framer-motion';

const OmisFeatureCard = ({ icon, title, description, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5 }}
      whileHover={{ scale: 1.05, backgroundColor: "#F0F9FF", borderColor: "#93C5FD" }}
      className="bg-white p-6 rounded-xl border border-slate-300 shadow-md hover:shadow-xl transition-all duration-300 h-full group"
    >
      <div className="w-12 h-12 bg-blue-50 border border-blue-100 rounded-lg flex items-center justify-center mb-4 text-blue-700 group-hover:bg-blue-700 group-hover:text-white transition-colors">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-slate-900 mb-2 tracking-wide group-hover:text-blue-800 transition-colors">{title}</h3>
      <p className="text-slate-800 text-sm leading-relaxed font-medium">{description}</p>
    </motion.div>
  );
};
export default OmisFeatureCard;