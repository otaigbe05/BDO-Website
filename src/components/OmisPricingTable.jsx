import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const OmisPricingTable = () => {
  const tiers = [
    {
      name: "Starter",
      price: "$29",
      desc: "For small teams (1 user only)",
      features: ["1 user only", "Basic reporting", "Customer management", "Email support"],
      cta: "Start Free Trial",
      link: "https://omis-crm.com/",
      highlight: false
    },
    {
      name: "Professional",
      price: "$79",
      desc: "For growing businesses (up to 5 users)",
      features: ["Up to 5 users", "Advanced analytics", "Integrations", "API access", "Priority support"],
      cta: "Get Professional",
      link: "https://omis-crm.com/",
      highlight: true
    },
    {
      name: "Enterprise",
      price: "$199",
      desc: "For large organizations (unlimited users)",
      features: ["Unlimited users", "Custom features", "Custom integrations", "Dedicated account manager", "24/7 support"],
      cta: "Contact Sales",
      link: "/contact",
      highlight: false
    },
     {
      name: "Custom",
      price: "Custom",
      desc: "For specialized needs with bespoke solutions",
      features: ["Tailored solutions", "Bespoke development", "Custom integrations", "White-label options", "SLA agreements"],
      cta: "Book Consultation",
      link: "/contact",
      highlight: false
    }
  ];

  return (
    <div className="w-full max-w-7xl mx-auto">
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        {tiers.map((tier, index) => (
          <motion.div
            key={tier.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className={`relative flex flex-col p-8 bg-white rounded-2xl shadow-sm border transition-all duration-300 hover:shadow-lg ${
                tier.highlight ? 'border-blue-600 shadow-md scale-105 z-10' : 'border-slate-200 hover:border-blue-300'
            }`}
          >
             {tier.highlight && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-semibold tracking-wide shadow-sm">
                    Most Popular
                </div>
            )}
            
            <div className="mb-8">
                <h3 className="text-xl font-bold text-slate-900 mb-2">{tier.name}</h3>
                <p className="text-sm text-slate-500 h-10">{tier.desc}</p>
                <div className="mt-4 flex items-baseline text-slate-900">
                    <span className="text-4xl font-extrabold tracking-tight">{tier.price}</span>
                    {tier.price !== "Custom" && <span className="text-slate-500 ml-1 font-medium">/month</span>}
                </div>
            </div>

            <ul className="flex-1 space-y-4 mb-8">
                {tier.features.map(f => (
                    <li key={f} className="flex items-start gap-3 text-sm text-slate-600">
                        <Check className="w-5 h-5 text-emerald-500 shrink-0" />
                        <span>{f}</span>
                    </li>
                ))}
            </ul>

            <Button 
                asChild 
                size="lg"
                className={`w-full ${tier.highlight ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-white text-slate-900 border-2 border-slate-200 hover:border-slate-300 hover:bg-slate-50'}`}
            >
                {tier.link.startsWith('http') ? (
                     <a href={tier.link} target="_blank" rel="noopener noreferrer">{tier.cta}</a>
                ) : (
                    <Link to={tier.link}>{tier.cta}</Link>
                )}
            </Button>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
export default OmisPricingTable;