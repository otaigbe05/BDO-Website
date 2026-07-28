import React from 'react';
import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';

const OmisComparison = () => {
  const comparisonData = [
    { feature: "Booking", omis: "Clients self-book online, anytime", manual: "Phone tag and DMs during business hours", omisAdvantage: true },
    { feature: "Deposits", omis: "Collected automatically into your own Stripe account", manual: "Collected in person, or not at all", omisAdvantage: true },
    { feature: "Waivers", omis: "Signed digitally before the appointment", manual: "Signed on paper at the door", omisAdvantage: true },
    { feature: "No-Shows", omis: "Reduced by deposits and reminders", manual: "No protection against last-minute cancellations", omisAdvantage: true },
    { feature: "Reminders", omis: "Automatic SMS & email", manual: "Manual texts and calls, if any", omisAdvantage: true },
    { feature: "Staff Scheduling", omis: "Per-staff booking links", manual: "Shared calendar or notebook", omisAdvantage: true },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-4">OMIS vs. Manual Booking</h2>
        <p className="text-slate-600 text-lg">Stop losing time and money to phone tag and no-shows.</p>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xl"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr>
                <th className="p-6 border-b border-slate-200 bg-slate-50 text-slate-700 font-semibold w-1/3">Feature / Metric</th>
                <th className="p-6 border-b border-blue-200 bg-blue-50 text-blue-700 font-bold w-1/3 text-center text-lg">OMIS</th>
                <th className="p-6 border-b border-slate-200 bg-slate-50 text-slate-600 font-semibold w-1/3 text-center">Manual / Phone & DMs</th>
              </tr>
            </thead>
            <tbody>
              {comparisonData.map((row, idx) => (
                <tr key={idx} className={`border-b border-slate-100 hover:bg-slate-50/50 transition-colors ${idx % 2 === 0 ? 'bg-slate-50/30' : 'bg-white'}`}>
                  <td className="p-6 text-slate-700 font-medium">{row.feature}</td>
                  <td className="p-6 text-center bg-blue-50/30">
                    <div className="flex flex-col items-center justify-center gap-2">
                      {row.omisAdvantage && <div className="bg-emerald-100 p-1 rounded-full"><Check className="w-4 h-4 text-emerald-600" /></div>}
                      <span className="font-bold text-slate-900">{row.omis}</span>
                    </div>
                  </td>
                  <td className="p-6 text-center">
                    <div className="flex flex-col items-center justify-center gap-2 text-slate-500">
                      <div className="bg-red-50 p-1 rounded-full"><X className="w-4 h-4 text-red-400" /></div>
                      <span>{row.manual}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default OmisComparison;