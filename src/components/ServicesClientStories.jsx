import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Store, Utensils, Briefcase } from 'lucide-react';

const ServicesClientStories = () => {
  const outcomes = [
    {
      title: "Inventory & Sales Clarity",
      industry: "Retail",
      icon: <Store className="w-6 h-6" />,
      description: "Stop guessing what's selling and what's sitting in the back room. Get clear visibility into product velocity and stock levels without manually cross-referencing spreadsheets.",
      stat: "~6 hrs/week reclaimed",
      delay: 0
    },
    {
      title: "Revenue & Cost Visibility",
      industry: "Restaurant/Café",
      icon: <Utensils className="w-6 h-6" />,
      description: "Connect your POS and scheduling data to understand your true labor and food costs in real-time, allowing you to adjust menus and staffing proactively.",
      stat: "Food cost visibility in under 2 weeks",
      delay: 0.1
    },
    {
      title: "Client & Retention Metrics",
      industry: "Service Business",
      icon: <Briefcase className="w-6 h-6" />,
      description: "Identify which clients are most profitable and spot early warning signs of churn before they happen. Move from reactive to proactive client management.",
      stat: "Retention blind spots identified in Week 1",
      delay: 0.2
    }
  ];

  return (
    <section className="py-24 bg-white border-b border-slate-300">
      <div className="container mx-auto px-4 max-w-7xl">
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
        >
            <h2 className="text-4xl md:text-5xl font-extrabold mb-6 text-slate-900">What to Expect</h2>
            <p className="text-slate-900 text-xl font-bold">Real outcomes tailored to the realities of your industry.</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
            {outcomes.map((item, i) => (
                <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: item.delay }}
                    whileHover={{ scale: 1.03 }}
                    className="bg-slate-50 border-2 border-slate-300 p-8 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 relative flex flex-col group hover:border-blue-400"
                >
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-700">
                            {item.icon}
                        </div>
                        <span className="text-sm text-blue-800 font-extrabold bg-blue-100 px-3 py-1 rounded-md border border-blue-200 uppercase tracking-wider">
                            {item.industry}
                        </span>
                    </div>
                    
                    <h3 className="text-2xl font-bold text-slate-900 mb-4">{item.title}</h3>
                    <p className="text-slate-700 text-base mb-8 flex-grow leading-relaxed">{item.description}</p>
                    
                    <div className="border-t-2 border-slate-200 pt-6 mb-6">
                        <p className="font-extrabold text-blue-700 text-lg">{item.stat}</p>
                    </div>

                    <Button asChild className="w-full bg-slate-900 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors">
                        <Link to="/book-demo">See How It Works</Link>
                    </Button>
                </motion.div>
            ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesClientStories;