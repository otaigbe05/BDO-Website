import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Loader2, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const NewsletterSignup = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({ name: '', email: '', company: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.email) return;

    setIsSubmitting(true);
    
    // Simulate API call and save to localStorage
    setTimeout(() => {
      const existingSubs = JSON.parse(localStorage.getItem('newsletter_subs') || '[]');
      existingSubs.push({ ...formData, date: new Date().toISOString() });
      localStorage.setItem('newsletter_subs', JSON.stringify(existingSubs));
      
      setIsSubmitting(false);
      setIsSuccess(true);
      
      toast({
        title: "Subscribed successfully! 🎉",
        description: "Thanks for signing up. Check your email for updates.",
      });
      
      setFormData({ name: '', email: '', company: '' });
      
      // Reset success state after a few seconds
      setTimeout(() => setIsSuccess(false), 5000);
    }, 1000);
  };

  const bgClass = 'bg-white border-slate-300 text-slate-900';
  const textClass = 'text-slate-800 font-medium';
  const inputBgClass = 'bg-slate-50 border-slate-300 text-slate-900 placeholder:text-slate-500 focus:border-blue-600 focus:ring-blue-600/20';

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`max-w-2xl mx-auto rounded-3xl p-8 md:p-10 border-2 shadow-xl relative overflow-hidden ${bgClass}`}
    >
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-blue-100 rounded-full blur-3xl pointer-events-none"></div>
      
      <div className="relative z-10">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 bg-blue-700 rounded-xl flex items-center justify-center shadow-md">
            <Mail className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-2xl font-extrabold text-slate-900">Get Analytics Insights Weekly</h3>
        </div>
        <p className={`mb-8 ${textClass}`}>
          Join 5,000+ business owners receiving our best tips on revenue growth, data strategy, and industry benchmarks.
        </p>

        {isSuccess ? (
          <div className="bg-emerald-50 border-2 border-emerald-200 text-emerald-900 p-4 rounded-xl flex items-center gap-3 shadow-sm">
             <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center text-white font-bold shrink-0">✓</div>
             <p className="font-bold">You're on the list! Keep an eye on your inbox.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="sr-only" htmlFor="firstName">First Name</label>
                <input 
                  id="firstName"
                  type="text" 
                  placeholder="First Name" 
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className={`w-full px-4 py-3 rounded-xl border-2 outline-none transition-all focus:ring-2 font-medium ${inputBgClass}`}
                />
              </div>
              <div>
                <label className="sr-only" htmlFor="companyName">Company (Optional)</label>
                <input 
                  id="companyName"
                  type="text" 
                  placeholder="Company (Optional)" 
                  value={formData.company}
                  onChange={(e) => setFormData({...formData, company: e.target.value})}
                  className={`w-full px-4 py-3 rounded-xl border-2 outline-none transition-all focus:ring-2 font-medium ${inputBgClass}`}
                />
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <label className="sr-only" htmlFor="emailAddress">Work Email Address</label>
              <input 
                id="emailAddress"
                type="email" 
                placeholder="Work Email Address" 
                required
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className={`flex-1 px-4 py-3 rounded-xl border-2 outline-none transition-all focus:ring-2 font-medium ${inputBgClass}`}
              />
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="bg-blue-700 hover:bg-blue-800 text-white py-3 px-8 h-auto rounded-xl font-bold whitespace-nowrap shadow-md shrink-0 transition-transform hover:scale-105"
              >
                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Send className="w-4 h-4 mr-2" /> Subscribe</>}
              </Button>
            </div>
            <p className="text-sm text-slate-700 mt-3 text-center sm:text-left font-medium">
              We care about your data. Read our <a href="/privacy-policy" className="underline text-blue-700 hover:text-blue-900 font-bold">Privacy Policy</a>.
            </p>
          </form>
        )}
      </div>
    </motion.div>
  );
};

export default NewsletterSignup;