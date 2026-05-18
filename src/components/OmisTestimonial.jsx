import React from 'react';
import { motion } from 'framer-motion';

const OmisTestimonial = ({ name, role, company, quote, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5 }}
      className="bg-white p-8 rounded-2xl border border-slate-200 shadow-md relative hover:shadow-xl hover:-translate-y-1 transition-all"
    >
      <p className="text-slate-700 italic mb-6 leading-relaxed font-medium">"{quote}"</p>
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-teal-500 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md">
          {name.charAt(0)}
        </div>
        <div>
            <p className="text-slate-900 font-bold text-sm">{name}</p>
            <p className="text-slate-500 text-xs font-medium">{role}{company ? `, ${company}` : ''}</p>
        </div>
      </div>
    </motion.div>
  );
};

export default OmisTestimonial;