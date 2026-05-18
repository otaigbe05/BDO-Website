import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const ServicesPricing = () => {
  const plans = [
    { 
      title: "Analytics Services", 
      price: "from $199", 
      period: "/mo",
      desc: "Monthly retainer for ongoing reporting and insights.",
      color: "text-blue-400"
    },
    { 
      title: "OMIS Implementation", 
      price: "from $499", 
      period: "one-time",
      desc: "Full setup including data migration and training.",
      color: "text-indigo-400"
    },
    { 
      title: "Custom Dashboards", 
      price: "$99", 
      period: "each",
      desc: "Fixed price per unique dashboard view created.",
      color: "text-teal-400"
    },
    { 
      title: "Data Cleanup", 
      price: "$199", 
      period: "one-time",
      desc: "Deep clean of your existing databases.",
      color: "text-sky-400"
    },
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
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <section className="py-24 bg-slate-950 text-white border-t border-slate-900">
      <div className="container mx-auto px-4 max-w-7xl">
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
        >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">Simple, Transparent Pricing</h2>
            <p className="text-slate-300 text-xl font-medium">Clear costs upfront. Full pricing available during your consultation.</p>
        </motion.div>

        <motion.div 
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 xl:grid-cols-4 gap-8"
        >
            {plans.map((plan, index) => (
                <motion.div
                    key={index}
                    variants={item}
                    whileHover={{ scale: 1.05 }}
                    className="bg-slate-900/50 border border-slate-800 p-8 rounded-xl text-center shadow-lg hover:shadow-2xl hover:border-slate-600 transition-all duration-300 flex flex-col justify-between h-full"
                >
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2">{plan.title}</h3>
                      <div className={`text-3xl font-extrabold ${plan.color} mb-1`}>{plan.price}</div>
                      <div className="text-slate-500 text-sm mb-4">{plan.period}</div>
                      <p className="text-slate-400 mb-8">{plan.desc}</p>
                    </div>
                    <Button asChild className="w-full bg-white text-black hover:bg-slate-200">
                        <Link to="/book-demo">
                          Get Started <ArrowRight className="w-4 h-4 ml-2" />
                        </Link>
                    </Button>
                </motion.div>
            ))}
        </motion.div>
      </div>
    </section>
  );
};

export default ServicesPricing;