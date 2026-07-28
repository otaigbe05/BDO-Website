import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

const OmisPricingTable = () => {
  const features = [
    "Online booking page",
    "Deposits paid directly into your own Stripe account",
    "Digital waivers",
    "SMS & email reminders",
    "Per-staff booking links",
    "Business dashboard",
  ];

  return (
    <div className="w-full max-w-2xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative flex flex-col p-10 bg-white rounded-3xl shadow-lg border-2 border-blue-600"
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-semibold tracking-wide shadow-sm">
          Founding Rate — First 10 Businesses Per Industry
        </div>

        <div className="mb-8 text-center">
          <div className="flex items-baseline justify-center text-slate-900">
            <span className="text-5xl font-extrabold tracking-tight">$39</span>
            <span className="text-slate-500 ml-1 font-medium">/month, locked for life</span>
          </div>
          <p className="text-sm text-slate-500 mt-2">Plus applicable taxes. Limited to the first 10 businesses per industry.</p>
        </div>

        <ul className="flex-1 space-y-4 mb-8">
          {features.map(f => (
            <li key={f} className="flex items-start gap-3 text-sm text-slate-600">
              <Check className="w-5 h-5 text-emerald-500 shrink-0" />
              <span>{f}</span>
            </li>
          ))}
        </ul>

        <Button asChild size="lg" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
          <a href="https://omis-crm.com/" target="_blank" rel="noopener noreferrer">Try OMIS Now</a>
        </Button>
      </motion.div>
    </div>
  );
};
export default OmisPricingTable;