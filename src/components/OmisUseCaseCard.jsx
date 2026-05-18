import React from 'react';
import { motion } from 'framer-motion';

const OmisUseCaseCard = ({ icon, title, description, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5 }}
      whileHover={{ y: -5, backgroundColor: "#F0F9FF", borderColor: "#93C5FD" }}
      className="bg-white border border-slate-300 shadow-md p-6 rounded-xl transition-all cursor-default group"
    >
      <div className="mb-4 text-teal-700 group-hover:scale-110 transition-transform duration-300 origin-left">
        {icon}
      </div>
      <h3 className="text-lg font-bold text-slate-900 mb-2 tracking-wide group-hover:text-teal-800 transition-colors">{title}</h3>
      <p className="text-slate-800 font-medium text-sm leading-relaxed">{description}</p>
    </motion.div>
  );
};
export default OmisUseCaseCard;