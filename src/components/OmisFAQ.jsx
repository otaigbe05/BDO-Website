import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp } from 'lucide-react';

const OmisFAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const faqs = [
    {
      question: "How long does it take to set up OMIS?",
      answer: "Most businesses are fully up and running within 2-4 hours. Our onboarding team handles the data connection and initial dashboard setup so you don't have to."
    },
    {
      question: "How much does OMIS cost?",
      answer: "We offer flexible pricing starting at $29/month for small teams, scaling up to customized enterprise plans. There are no hidden fees or long-term contracts required."
    },
    {
      question: "Is my business data secure?",
      answer: "Absolutely. We use enterprise-grade encryption (TLS 1.3 in transit, AES-256 at rest) and host on SOC2-certified AWS infrastructure. We never share or sell your data."
    },
    {
      question: "What software does OMIS integrate with?",
      answer: "OMIS seamlessly connects with over 50+ popular tools including Stripe, QuickBooks, Xero, Square, Shopify, Excel, Google Sheets, and most major databases."
    },
    {
      question: "What happens if I want to delete my account?",
      answer: "You can request account deletion at any time. We initiate a 30-day grace period to prevent accidental loss, after which your personal data is permanently anonymized."
    },
    {
      question: "What kind of support do you offer?",
      answer: "All plans include email support. Our Growth and Pro plans include priority support and dedicated strategy calls to help you maximize the value of your data."
    },
    {
      question: "How soon will I see an ROI?",
      answer: "Many clients discover actionable insights on day one—identifying wasted spend, uncovering hidden revenue opportunities, or simply saving 10+ hours a week on manual reporting."
    },
    {
      question: "Do I need technical skills to use it?",
      answer: "Not at all! OMIS is built specifically for business owners, not data scientists. If you can read a clear chart, you can use our platform."
    }
  ];

  return (
    <div className="w-full max-w-4xl mx-auto py-12">
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-4">Frequently Asked Questions</h2>
        <p className="text-slate-800 font-medium">Everything you need to know about getting started with OMIS.</p>
      </div>
      
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div 
            key={index}
            className={`border rounded-2xl overflow-hidden transition-all shadow-sm ${activeIndex === index ? 'bg-blue-50/50 border-blue-300' : 'bg-white border-slate-300 hover:border-blue-400'}`}
          >
            <button
              onClick={() => setActiveIndex(activeIndex === index ? null : index)}
              className="w-full px-6 py-5 text-left flex justify-between items-center focus:outline-none"
            >
              <span className={`font-bold text-lg ${activeIndex === index ? 'text-blue-800' : 'text-slate-900'}`}>
                {faq.question}
              </span>
              {activeIndex === index ? (
                <ChevronUp className="w-5 h-5 text-blue-700 shrink-0" />
              ) : (
                <ChevronDown className="w-5 h-5 text-slate-600 shrink-0" />
              )}
            </button>
            <AnimatePresence>
              {activeIndex === index && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="px-6 pb-5 text-slate-800 font-medium leading-relaxed border-t border-slate-200 pt-4">
                    {faq.answer}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OmisFAQ;