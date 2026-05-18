import React from 'react';
import { motion } from 'framer-motion';
import { Database, LayoutDashboard, FileBarChart, Target } from 'lucide-react';

const ServicesAnalytics = () => {
  const features = [
    {
      icon: <Database className="w-10 h-10 text-blue-400" />,
      title: "Data Audit & Cleaning",
      desc: "We review and prepare your data for analysis, ensuring it's clean, accurate, and ready for insights."
    },
    {
      icon: <LayoutDashboard className="w-10 h-10 text-teal-400" />,
      title: "Custom Dashboard Design",
      desc: "Tailored views for CEOs, managers, and staff. Visualize your most critical metrics at a glance."
    },
    {
      icon: <FileBarChart className="w-10 h-10 text-indigo-400" />,
      title: "Automated Reporting",
      desc: "Weekly or monthly PDF reports delivered to your inbox. Stay updated without lifting a finger."
    },
    {
      icon: <Target className="w-10 h-10 text-sky-400" />,
      title: "Goal Tracking",
      desc: "Visualize performance vs. targets in real time. Know exactly where you stand every day."
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
    <section className="py-24 bg-black text-white overflow-hidden border-t border-slate-900">
      <div className="container mx-auto px-4">
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16 max-w-3xl mx-auto"
        >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">Power BI Analytics Services</h2>
            <p className="text-xl text-slate-300">For businesses with existing data in SQL, Excel, or legacy tools. We transform raw information into interactive dashboards that tell a story.</p>
        </motion.div>

        <motion.div 
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 xl:grid-cols-4 gap-8"
        >
          {features.map((feature, index) => (
            <motion.div 
              key={index}
              variants={item}
              whileHover={{ scale: 1.05 }}
              className="bg-slate-900/50 border border-slate-800 p-8 rounded-xl shadow-lg hover:shadow-2xl hover:border-blue-500/30 transition-all duration-300 group"
            >
              <div className="mb-6 bg-slate-800/50 w-20 h-20 rounded-2xl flex items-center justify-center border border-slate-700 group-hover:bg-slate-800 transition-colors">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-4 group-hover:text-blue-300 transition-colors">{feature.title}</h3>
              <p className="text-slate-400 leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default ServicesAnalytics;