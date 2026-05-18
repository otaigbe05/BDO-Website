import React from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Settings, ArrowDown, ArrowRight } from 'lucide-react';

const ServicePathwayVisual = () => {
  return (
    <section className="py-20 bg-slate-50 relative border-b border-slate-300 overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-extrabold mb-6 text-slate-900 tracking-tight">Choose Your Solution</h2>
          <p className="text-slate-900 font-bold text-xl max-w-2xl mx-auto">
            We offer two distinct approaches depending on your current business infrastructure.
          </p>
        </motion.div>

        <div className="relative max-w-5xl mx-auto">
          {/* Connecting Lines (Desktop) */}
          <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-300 via-slate-400 to-teal-300 -translate-y-1/2 z-0"></div>

          <div className="grid md:grid-cols-2 gap-12 relative z-10">
            {/* Left Branch: Analytics */}
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-white border-2 border-slate-300 p-8 rounded-2xl shadow-lg hover:shadow-xl hover:border-blue-500 transition-all group cursor-pointer"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-blue-700 transition-all duration-300 shadow-sm">
                  <BarChart3 className="w-10 h-10 text-blue-700 group-hover:text-white transition-colors stroke-[2.5]" />
                </div>
                <h3 className="text-2xl font-extrabold text-slate-900 mb-3 group-hover:text-blue-800 transition-colors">Power BI Analytics</h3>
                <p className="text-slate-900 font-bold mb-4 text-lg">Transform raw data into insights</p>
                <div className="hidden md:flex items-center text-blue-700 font-extrabold opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0 text-lg">
                  View Path <ArrowRight className="ml-2 w-5 h-5 stroke-[3]" />
                </div>
                <div className="md:hidden mt-4">
                    <ArrowDown className="w-6 h-6 text-slate-800 animate-bounce stroke-[2.5]" />
                </div>
              </div>
            </motion.div>

            {/* Right Branch: OMIS */}
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="bg-white border-2 border-slate-300 p-8 rounded-2xl shadow-lg hover:shadow-xl hover:border-teal-500 transition-all group cursor-pointer"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 rounded-2xl bg-teal-50 border border-teal-200 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-teal-700 transition-all duration-300 shadow-sm">
                  <Settings className="w-10 h-10 text-teal-700 group-hover:text-white transition-colors stroke-[2.5]" />
                </div>
                <h3 className="text-2xl font-extrabold text-slate-900 mb-3 group-hover:text-teal-800 transition-colors">OMIS Implementation</h3>
                <p className="text-slate-900 font-bold mb-4 text-lg">Streamline operations & workflow</p>
                <div className="hidden md:flex items-center text-teal-700 font-extrabold opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0 text-lg">
                  View Path <ArrowRight className="ml-2 w-5 h-5 stroke-[3]" />
                </div>
                <div className="md:hidden mt-4">
                    <ArrowDown className="w-6 h-6 text-slate-800 animate-bounce stroke-[2.5]" />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicePathwayVisual;