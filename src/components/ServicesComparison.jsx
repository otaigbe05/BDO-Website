import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

const ServicesComparison = () => {
  const [hoveredColumn, setHoveredColumn] = useState(null);

  const rows = [
    { feature: "You already have data", analytics: true, omis: false },
    { feature: "Want dashboards & insights", analytics: true, omis: true },
    { feature: "Want a full operational system", analytics: false, omis: true },
    { feature: "Want workflow automation", analytics: false, omis: true },
    { feature: "Need data cleanup", analytics: true, omis: "Optional" },
    { feature: "Need staff training", analytics: "Optional", omis: true },
    { feature: "Need ongoing support", analytics: "Optional", omis: true },
    { feature: "Want to keep current tools", analytics: true, omis: false },
    { feature: "Want everything in one place", analytics: false, omis: true },
  ];

  const renderValue = (val) => {
      if (val === true) return <Check className="w-7 h-7 text-teal-700 mx-auto" strokeWidth={3} />;
      if (val === false) return <X className="w-7 h-7 text-slate-800 mx-auto" strokeWidth={3} />;
      return <span className="text-base md:text-lg font-extrabold text-slate-900">{val}</span>;
  };

  return (
    <section className="py-24 bg-white border-b border-slate-300">
      <div className="container mx-auto px-4 max-w-6xl">
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
        >
            <h2 className="text-4xl md:text-5xl font-extrabold mb-6 text-slate-900">Which Path Is Right for You?</h2>
            <p className="text-slate-900 text-xl font-bold">Compare our service offerings side-by-side.</p>
        </motion.div>

        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white border-2 border-slate-300 rounded-2xl overflow-hidden shadow-xl relative"
        >
            <div className="overflow-x-auto relative z-10">
                <table className="w-full text-left border-collapse min-w-[600px] relative">
                    <colgroup>
                        <col className="w-1/3" />
                        <col className="w-1/3" />
                        <col className="w-1/3" />
                    </colgroup>
                    <thead>
                        <tr className="bg-slate-100 border-b-2 border-slate-300">
                            <th className="p-6 text-xl font-extrabold text-slate-900 uppercase tracking-wide">Feature</th>
                            <th 
                                className={cn(
                                    "p-6 text-xl font-extrabold text-blue-800 text-center border-l-2 border-slate-300 transition-colors duration-300 cursor-pointer uppercase tracking-wide",
                                    hoveredColumn === 'analytics' ? "bg-blue-50/80" : ""
                                )}
                                onMouseEnter={() => setHoveredColumn('analytics')}
                                onMouseLeave={() => setHoveredColumn(null)}
                            >
                                Power BI Analytics
                            </th>
                            <th 
                                className={cn(
                                    "p-6 text-xl font-extrabold text-teal-800 text-center border-l-2 border-slate-300 transition-colors duration-300 cursor-pointer uppercase tracking-wide",
                                    hoveredColumn === 'omis' ? "bg-teal-50/80" : ""
                                )}
                                onMouseEnter={() => setHoveredColumn('omis')}
                                onMouseLeave={() => setHoveredColumn(null)}
                            >
                                OMIS Implementation
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((row, index) => (
                            <tr key={index} className="border-b border-slate-200 hover:bg-slate-50 transition-colors">
                                <td className="p-5 font-bold text-slate-900 text-lg pl-8 bg-transparent">{row.feature}</td>
                                <td 
                                    className={cn(
                                        "p-5 text-center border-l-2 border-slate-200 transition-colors duration-300 cursor-pointer",
                                        hoveredColumn === 'analytics' ? "bg-blue-50/50" : ""
                                    )}
                                    onMouseEnter={() => setHoveredColumn('analytics')}
                                    onMouseLeave={() => setHoveredColumn(null)}
                                >
                                    {renderValue(row.analytics)}
                                </td>
                                <td 
                                    className={cn(
                                        "p-5 text-center border-l-2 border-slate-200 transition-colors duration-300 cursor-pointer",
                                        hoveredColumn === 'omis' ? "bg-teal-50/50" : ""
                                    )}
                                    onMouseEnter={() => setHoveredColumn('omis')}
                                    onMouseLeave={() => setHoveredColumn(null)}
                                >
                                    {renderValue(row.omis)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            
            <div className="p-8 text-center bg-slate-100 border-t-2 border-slate-300">
                 <Button 
                    asChild 
                    size="lg" 
                    className="bg-blue-700 hover:bg-blue-800 text-white font-bold text-xl px-10 h-16 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105"
                >
                    <Link to="/book-demo">Talk to an Expert</Link>
                </Button>
            </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ServicesComparison;