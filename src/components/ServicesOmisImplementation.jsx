import React from 'react';
import { motion } from 'framer-motion';
import { Settings2, ArrowRight, Users2, LifeBuoy } from 'lucide-react';

const ServicesOmisImplementation = () => {
  const features = [
    {
      icon: <Settings2 className="w-10 h-10 text-indigo-400" />,
      title: "System Setup",
      desc: "OMIS configured to your specific workflow. We ensure all settings match your operational needs."
    },
    {
      icon: <ArrowRight className="w-10 h-10 text-violet-400" />,
      title: "Data Migration",
      desc: "We move your client lists and history from old systems safely into your new environment."
    },
    {
      icon: <Users2 className="w-10 h-10 text-fuchsia-400" />,
      title: "Staff Training",
      desc: "Hands-on sessions to ensure your team is confident and productive from Day 1."
    },
    {
      icon: <LifeBuoy className="w-10 h-10 text-emerald-400" />,
      title: "Ongoing Support",
      desc: "Dedicated account management and priority support to keep your business running smoothly."
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
    <section className="py-24 bg-slate-950 text-white overflow-hidden border-t border-slate-900">
      <div className="container mx-auto px-4">
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16 max-w-3xl mx-auto"
        >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">OMIS Implementation Services</h2>
            <p className="text-xl text-slate-300">Most businesses are fully set up in 2–4 weeks. We don't just hand you a login — we guide your team from Day 1.</p>
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
              className="bg-slate-900/50 border border-slate-800 p-8 rounded-xl shadow-lg hover:shadow-2xl hover:border-indigo-500/30 transition-all duration-300 group"
            >
              <div className="mb-6 bg-slate-800/50 w-20 h-20 rounded-2xl flex items-center justify-center border border-slate-700 group-hover:bg-slate-800 transition-colors">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-4 group-hover:text-indigo-300 transition-colors">{feature.title}</h3>
              <p className="text-slate-400 leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default ServicesOmisImplementation;