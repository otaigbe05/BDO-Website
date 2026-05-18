import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { CheckCircle2, Loader2, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import Breadcrumbs from '@/components/Breadcrumbs';
import HeroSection from '@/components/HeroSection';
import { sendEmail } from '@/lib/email';

const BookDemoPage = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    businessType: '',
    preferredTime: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const siteUrl = "https://www.bdoanalyticssolutions.com/book-demo";
  const omisAppLink = "https://omis-crm.com/";

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await sendEmail(formData);
      
      toast({
        title: "Demo Request Sent! 🎉",
        description: "We'll reach out within 24 hours to schedule your personalized demo.",
        duration: 6000,
      });
      setFormData({ name: '', email: '', phone: '', businessType: '', preferredTime: '', message: '' });

    } catch (error) {
      toast({
        variant: "destructive",
        title: "Something went wrong",
        description: "Please try again or contact us directly at info@bdoanalyticssolutions.com",
        duration: 6000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const benefits = [
    "Personalized walkthrough of OMIS features tailored to your industry",
    "Explore live dashboards built from sample business data",
    "Discover actionable insights and get your questions answered",
    "No obligation — just clear paths to better decision-making"
  ];

  return (
    <div className="bg-slate-50 font-sans min-h-screen">
      <Helmet>
        <title>Book a Free Demo | See OMIS in Action | BDO Analytics Solutions</title>
        <meta name="description" content="Schedule a personalized demo of OMIS. See how our analytics platform can transform your business data into clear insights." />
        <link rel="canonical" href={siteUrl} />
      </Helmet>

      <Breadcrumbs />

      <HeroSection 
            headline="Book Your OMIS Demo"
            subheadline="Get a personalized demo tailored to your business. See exactly how OMIS turns your data into actionable insights."
            primaryCtaText="Skip to Form"
            primaryCtaLink="#booking-form"
            secondaryCtaText="Try OMIS Now"
            secondaryCtaLink={omisAppLink}
            backgroundImage="https://horizons-cdn.hostinger.com/c48fe537-27be-40d7-8d60-8141bf615504/6c791827b7678a9f8d9ad64649fb7527.png"
            minHeight="min-h-[60vh]"
        />

      <section className="py-24 px-4 relative z-10" id="booking-form">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
            {/* Benefits */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="sticky top-32">
                <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-8 tracking-tight">Why schedule a demo?</h2>
                <ul className="space-y-6">
                  {benefits.map((benefit, i) => (
                    <motion.li 
                      key={i} 
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.2 + (i * 0.1), duration: 0.5 }}
                      className="flex items-start gap-4"
                    >
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <CheckCircle2 className="w-5 h-5 text-blue-700" />
                      </div>
                      <p className="text-lg text-slate-700 leading-relaxed">{benefit}</p>
                    </motion.li>
                  ))}
                </ul>

                <div className="mt-12 p-8 rounded-3xl bg-blue-50 border border-blue-100">
                  <p className="text-slate-700 font-medium italic">
                    "Most business owners we talk to are surprised by how much time they were losing to manual reporting — and how quickly that changes."
                  </p>
                  <p className="text-sm font-bold text-slate-900 mt-4">— BDO Analytics Team</p>
                </div>
              </div>
            </motion.div>

            {/* Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="bg-white p-8 md:p-10 rounded-3xl shadow-xl border border-slate-200"
            >
              <div className="mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">Select a Time</h2>
                <p className="text-slate-600">Fill out the details below and we'll reach out to schedule.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-bold text-slate-900">Full Name *</label>
                    <input 
                      type="text" 
                      id="name" 
                      name="name" 
                      value={formData.name} 
                      onChange={handleChange} 
                      required 
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all text-slate-900 bg-slate-50"
                      placeholder="Jane Doe"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-bold text-slate-900">Email Address *</label>
                    <input 
                      type="email" 
                      id="email" 
                      name="email" 
                      value={formData.email} 
                      onChange={handleChange} 
                      required 
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all text-slate-900 bg-slate-50"
                      placeholder="jane@company.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="phone" className="text-sm font-bold text-slate-900">Phone Number</label>
                  <input 
                    type="tel" 
                    id="phone" 
                    name="phone" 
                    value={formData.phone} 
                    onChange={handleChange} 
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all text-slate-900 bg-slate-50"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="businessType" className="text-sm font-bold text-slate-900">Business Type *</label>
                    <div className="relative">
                      <select 
                        id="businessType" 
                        name="businessType" 
                        value={formData.businessType} 
                        onChange={handleChange} 
                        required 
                        className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none bg-slate-50 transition-all text-slate-900 appearance-none"
                      >
                        <option value="" disabled>Select industry</option>
                        <option value="Retail">Retail</option>
                        <option value="Healthcare">Healthcare</option>
                        <option value="Manufacturing">Manufacturing</option>
                        <option value="Finance">Finance</option>
                        <option value="Other">Other</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="preferredTime" className="text-sm font-bold text-slate-900">Preferred Time</label>
                    <div className="relative">
                      <select 
                        id="preferredTime" 
                        name="preferredTime" 
                        value={formData.preferredTime} 
                        onChange={handleChange} 
                        className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none bg-slate-50 transition-all text-slate-900 appearance-none"
                      >
                        <option value="" disabled>Select time</option>
                        <option value="Morning">Morning</option>
                        <option value="Afternoon">Afternoon</option>
                        <option value="Evening">Evening</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-bold text-slate-900">Additional Notes</label>
                  <textarea 
                    id="message" 
                    name="message" 
                    value={formData.message} 
                    onChange={handleChange} 
                    rows={4} 
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none resize-none transition-all text-slate-900 bg-slate-50"
                    placeholder="Tell us a little about your goals or what systems you currently use..."
                  ></textarea>
                </div>

                <Button 
                  type="submit" 
                  size="lg" 
                  className="w-full bg-blue-700 hover:bg-blue-800 text-white py-6 text-lg rounded-xl shadow-lg shadow-blue-600/20 font-bold transition-all hover:scale-[1.02]" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Sending Request...
                    </>
                  ) : (
                    <>
                      Request My Demo <Send className="ml-2 w-5 h-5" />
                    </>
                  )}
                </Button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BookDemoPage;