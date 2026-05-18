import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const ServicesFinalCTA = () => {
  return (
    <section className="py-28 bg-[#F0F9FF] border-b border-blue-200 text-center relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#F0F9FF] to-[#E0F2FE] z-0 pointer-events-none opacity-80" />
      
      <div className="container mx-auto px-4 max-w-4xl relative z-10">
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
        >
            <h2 className="text-4xl md:text-6xl font-extrabold mb-8 text-slate-900 drop-shadow-sm tracking-tight">Ready to Transform Your Business?</h2>
            <p className="text-xl md:text-2xl text-slate-900 mb-12 leading-relaxed font-bold">
                Talk to an expert at BDO Analytics Solutions and get a recommendation based on your data readiness. No pressure, just clarity.
            </p>
            <Button asChild size="lg" className="bg-blue-700 hover:bg-blue-800 text-white font-extrabold h-16 px-12 rounded-full text-xl shadow-xl shadow-blue-900/20 transition-all hover:scale-105 hover:shadow-blue-700/40">
                <Link to="/book-demo">
                    Book a Free Consultation <ArrowRight className="ml-3 w-6 h-6 stroke-[3]" />
                </Link>
            </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default ServicesFinalCTA;