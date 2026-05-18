import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, Download } from 'lucide-react';

const TemplateCard = ({ template, onBuyClick }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-xl hover:border-blue-200 transition-all duration-300 flex flex-col group"
    >
      <div className="p-8 flex-grow">
        <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-6 border border-blue-100 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
          {template.icon}
        </div>
        
        <div className="text-sm font-semibold text-blue-600 mb-2 uppercase tracking-wider">
          {template.industry}
        </div>
        
        <h3 className="text-2xl font-bold text-slate-900 mb-3">{template.name}</h3>
        <p className="text-slate-600 mb-6 leading-relaxed">
          {template.description}
        </p>
        
        <div className="flex items-end gap-2 mb-8">
          <span className="text-4xl font-extrabold text-slate-900">${template.price}</span>
          <span className="text-slate-500 mb-1 font-medium">/one-time</span>
        </div>
        
        <ul className="space-y-3 mb-8">
          {['Instant Download', 'Fully Customizable', 'No Subscription Required'].map((feature, i) => (
            <li key={i} className="flex items-center text-sm text-slate-700">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-2" />
              {feature}
            </li>
          ))}
        </ul>
      </div>
      
      <div className="p-6 bg-slate-50 border-t border-slate-100 mt-auto">
        <Button 
          onClick={() => onBuyClick(template)}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold h-12 shadow-sm group-hover:shadow-md transition-all"
        >
          Buy Now <ArrowRight className="ml-2 w-4 h-4" />
        </Button>
      </div>
    </motion.div>
  );
};

export default TemplateCard;