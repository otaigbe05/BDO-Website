import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

const plans = [
  {
    name: "Starter",
    monthly: "$29",
    annual: "$290",
    summary: "1 user · up to 200 clients · 1 location",
    features: ["Appointments and calendar", "Invoice management", "Basic reporting", "Email support"],
    highlight: false,
  },
  {
    name: "Professional",
    monthly: "$79",
    annual: "$790",
    summary: "Up to 5 users · unlimited clients · up to 5 locations",
    features: ["Advanced analytics and reports", "SMS reminders", "Bulk data import", "API access", "Priority support"],
    highlight: true,
  },
  {
    name: "Enterprise",
    monthly: "$199",
    annual: "$1,990",
    summary: "Unlimited users, clients, and locations",
    features: ["Custom integrations", "Dedicated account manager", "24/7 support"],
    highlight: false,
  },
];

const OmisPricingTable = () => {
  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="grid md:grid-cols-3 gap-8">
        {plans.map((plan, index) => (
          <motion.div
            key={plan.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className={`relative flex flex-col p-8 bg-white rounded-2xl shadow-sm border transition-all duration-300 hover:shadow-lg ${
              plan.highlight ? 'border-blue-600 border-2 shadow-md' : 'border-slate-200 hover:border-blue-300'
            }`}
          >
            {plan.highlight && (
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-semibold tracking-wide shadow-sm">
                Most Popular
              </div>
            )}

            <div className="mb-6">
              <h3 className="text-xl font-bold text-slate-900 mb-2">{plan.name}</h3>
              <p className="text-sm text-slate-500 min-h-[40px]">{plan.summary}</p>
              <div className="mt-4 flex items-baseline text-slate-900">
                <span className="text-4xl font-extrabold tracking-tight">{plan.monthly}</span>
                <span className="text-slate-500 ml-1 font-medium">/month</span>
              </div>
              <p className="text-sm text-slate-500 mt-1">or {plan.annual}/year</p>
            </div>

            <ul className="flex-1 space-y-3 mb-8">
              {plan.features.map((f) => (
                <li key={f} className="flex items-start gap-3 text-sm text-slate-600">
                  <Check className="w-5 h-5 text-emerald-500 shrink-0" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>

            <Button
              asChild
              size="lg"
              className={`w-full ${plan.highlight ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-white text-slate-900 border-2 border-slate-200 hover:border-slate-300 hover:bg-slate-50'}`}
            >
              <a href="https://www.omis-crm.com/pricing" target="_blank" rel="noopener noreferrer">Start Free Trial</a>
            </Button>
          </motion.div>
        ))}
      </div>
      <p className="text-center text-sm text-slate-500 mt-8">
        All plans in CAD. No setup fees. Cancel anytime from Settings. Current plans and pricing are always at{' '}
        <a href="https://www.omis-crm.com/pricing" target="_blank" rel="noopener noreferrer" className="text-blue-700 font-semibold hover:underline">omis-crm.com/pricing</a>.
      </p>
    </div>
  );
};
export default OmisPricingTable;
