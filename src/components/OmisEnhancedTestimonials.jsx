import React from 'react';
import { motion } from 'framer-motion';
import { Star, TrendingUp, Clock, DollarSign } from 'lucide-react';

const OmisEnhancedTestimonials = () => {
  const caseStudies = [
    {
      company: "Bloom Boutique Retail",
      challenge: "Managing inventory across 3 locations using disjointed Excel sheets led to frequent stockouts.",
      solution: "Connected Shopify & Square POS data into a unified OMIS dashboard.",
      results: [
        { icon: <Clock className="w-4 h-4" />, text: "15 hours saved weekly" },
        { icon: <TrendingUp className="w-4 h-4" />, text: "22% revenue increase" }
      ]
    },
    {
      company: "Apex Dental Group",
      challenge: "Unable to accurately track patient churn or measure the ROI of marketing campaigns.",
      solution: "Implemented OMIS forecasting and patient segmentation models.",
      results: [
        { icon: <DollarSign className="w-4 h-4" />, text: "$40k retained revenue" },
        { icon: <TrendingUp className="w-4 h-4" />, text: "18% less churn" }
      ]
    }
  ];

  const testimonials = [
    {
      name: "Marcus Chen",
      role: "Founder",
      company: "Urban Fitness Studio",
      image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=150&h=150",
      quote: "Finally, analytics that don't require a data team. OMIS just works. We spotted revenue patterns we'd been missing for years within the first week of setup."
    },
    {
      name: "Sarah Johnson",
      role: "Operations Manager",
      company: "The Local Cafe",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150&h=150",
      quote: "The forecasting feature helped us plan inventory perfectly. No more overstocking perishables. It has literally paid for itself 10x over."
    },
    {
      name: "David Alistair",
      role: "CEO",
      company: "BuildRight Contractors",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150&h=150",
      quote: "We didn't need a heavy Salesforce implementation. We just needed clarity on our pipeline and cash flow. OMIS delivered exactly what was promised."
    }
  ];

  return (
    <div className="w-full max-w-7xl mx-auto py-24">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-4">Proven Results & Success Stories</h2>
        <p className="text-slate-600 text-lg">See how businesses are transforming their operations with OMIS.</p>
      </div>

      {/* Case Studies */}
      <div className="grid md:grid-cols-2 gap-8 mb-16">
        {caseStudies.map((study, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white border border-slate-200 rounded-2xl p-8 hover:border-blue-300 hover:shadow-xl transition-all shadow-md"
          >
            <h3 className="text-2xl font-bold text-slate-900 mb-6 border-b border-slate-100 pb-4">{study.company}</h3>
            <div className="space-y-4 mb-6">
              <div>
                <span className="text-slate-500 text-sm font-semibold uppercase tracking-wider">Challenge</span>
                <p className="text-slate-700 mt-1">{study.challenge}</p>
              </div>
              <div>
                <span className="text-blue-600 text-sm font-semibold uppercase tracking-wider">Solution</span>
                <p className="text-slate-700 mt-1">{study.solution}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-4 pt-4 border-t border-slate-100">
              {study.results.map((res, i) => (
                <div key={i} className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-lg border border-slate-200">
                  <div className="text-emerald-600">{res.icon}</div>
                  <span className="text-slate-800 font-medium text-sm">{res.text}</span>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Testimonials */}
      <div className="grid md:grid-cols-3 gap-6">
        {testimonials.map((test, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 + (idx * 0.1) }}
            className="bg-white border border-slate-200 rounded-2xl p-8 shadow-md hover:shadow-lg relative flex flex-col transition-shadow"
          >
            <div className="flex gap-1 mb-6">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-blue-500 text-blue-500" />)}
            </div>
            <p className="text-slate-700 italic mb-8 flex-1 leading-relaxed">"{test.quote}"</p>
            <div className="flex items-center gap-4">
              <img src={test.image} alt={test.name} loading="lazy" className="w-12 h-12 rounded-full object-cover border-2 border-slate-100" />
              <div>
                <h4 className="text-slate-900 font-bold text-sm">{test.name}</h4>
                <p className="text-slate-500 text-xs">{test.role}, {test.company}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default OmisEnhancedTestimonials;