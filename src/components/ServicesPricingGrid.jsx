import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const ServicesPricingGrid = () => {
  const plans = [
    { 
      title: "Analytics Services", 
      price: "from $199", 
      period: "/mo",
      desc: "Monthly retainer for ongoing reporting and insights.",
      color: "text-blue-700",
      bgHover: "hover:border-blue-400",
      delay: 0
    },
    { 
      title: "OMIS Implementation", 
      price: "from $499", 
      period: "one-time",
      desc: "Full setup including data migration and training.",
      color: "text-teal-700",
      bgHover: "hover:border-teal-400",
      delay: 0.1
    },
    { 
      title: "Custom Dashboards", 
      price: "$99", 
      period: "each",
      desc: "Fixed price per unique dashboard view created.",
      color: "text-purple-700",
      bgHover: "hover:border-purple-400",
      delay: 0.2
    },
    { 
      title: "Data Cleanup", 
      price: "$199", 
      period: "one-time",
      desc: "Deep clean of your existing databases.",
      color: "text-sky-700",
      bgHover: "hover:border-sky-400",
      delay: 0.3
    },
  ];

  return (
    <section className="py-24 bg-slate-50 border-b border-slate-300">
      <div className="container mx-auto px-4 max-w-7xl">
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
        >
            <h2 className="text-4xl md:text-5xl font-extrabold mb-6 text-slate-900">Simple, Transparent Pricing</h2>
            <p className="text-slate-900 text-xl font-bold">Clear costs upfront. Full pricing available during your consultation.</p>
        </motion.div>

        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-8">
            {plans.map((plan, index) => (
                <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: plan.delay }}
                    whileHover={{ scale: 1.05 }}
                    className={`bg-white border-2 border-slate-300 p-8 rounded-2xl text-center shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col justify-between h-full group ${plan.bgHover}`}
                >
                    <div>
                      <h3 className="text-2xl font-extrabold text-slate-900 mb-4 group-hover:text-slate-900">{plan.title}</h3>
                      <div className="flex items-baseline justify-center gap-1 mb-2">
                        <span className={`text-4xl font-black ${plan.color}`}>{plan.price}</span>
                      </div>
                      <div className="text-slate-900 font-extrabold uppercase text-sm tracking-wider mb-6 pb-6 border-b-2 border-slate-100">{plan.period}</div>
                      <p className="text-slate-900 font-bold text-lg mb-8 leading-relaxed">{plan.desc}</p>
                    </div>
                    <Button asChild size="lg" className="w-full bg-blue-700 text-white font-bold text-lg hover:bg-blue-800 shadow-md">
                        <Link to="/book-demo">
                          Get Started <ArrowRight className="w-5 h-5 ml-2 stroke-[2.5]" />
                        </Link>
                    </Button>
                </motion.div>
            ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesPricingGrid;