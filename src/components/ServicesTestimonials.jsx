import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Store, Utensils, Briefcase } from 'lucide-react';

const ServicesTestimonials = () => {
  const outcomes = [
    {
      title: "Inventory & Sales Clarity",
      industry: "Retail",
      icon: <Store className="w-6 h-6" />,
      description: "Stop guessing what's selling and what's sitting in the back room. Get clear visibility into product velocity and stock levels without manually cross-referencing spreadsheets.",
      stat: "~6 hrs/week reclaimed"
    },
    {
      title: "Revenue & Cost Visibility",
      industry: "Restaurant/Café",
      icon: <Utensils className="w-6 h-6" />,
      description: "Connect your POS and scheduling data to understand your true labor and food costs in real-time, allowing you to adjust menus and staffing proactively.",
      stat: "Food cost visibility in under 2 weeks"
    },
    {
      title: "Client & Retention Metrics",
      industry: "Service Business",
      icon: <Briefcase className="w-6 h-6" />,
      description: "Identify which clients are most profitable and spot early warning signs of churn before they happen. Move from reactive to proactive client management.",
      stat: "Retention blind spots identified in Week 1"
    }
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <section className="py-24 bg-black text-white border-t border-slate-900">
      <div className="container mx-auto px-4 max-w-7xl">
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
        >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">Built for Your Industry</h2>
            <p className="text-slate-300 text-xl font-medium">OMIS is designed around the real operational challenges of Canadian small businesses.</p>
        </motion.div>

        <motion.div 
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-8"
        >
            {outcomes.map((t, i) => (
                <motion.div
                    key={i}
                    variants={item}
                    whileHover={{ scale: 1.05 }}
                    className="bg-slate-900/50 border border-slate-800 p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 relative flex flex-col group"
                >
                    <div className="flex items-center justify-between mb-6">
                        <div className="w-12 h-12 bg-blue-900/50 rounded-xl flex items-center justify-center text-blue-400">
                            {t.icon}
                        </div>
                        <span className="text-xs text-blue-400 font-semibold bg-blue-950/50 px-3 py-1 rounded-md border border-blue-900/50 uppercase tracking-wider">
                            {t.industry}
                        </span>
                    </div>
                    
                    <h3 className="text-xl font-bold text-white mb-3">{t.title}</h3>
                    <p className="text-slate-300 text-base mb-8 flex-grow leading-relaxed">{t.description}</p>
                    
                    <div className="border-t border-slate-800 pt-6 mb-6">
                        <p className="font-bold text-blue-400 text-lg">{t.stat}</p>
                    </div>

                    <Button asChild variant="outline" className="w-full border-slate-700 text-slate-300 hover:bg-white hover:text-black font-bold rounded-xl transition-colors">
                        <Link to="/book-demo">See How It Works</Link>
                    </Button>
                </motion.div>
            ))}
        </motion.div>
      </div>
    </section>
  );
};

export default ServicesTestimonials;