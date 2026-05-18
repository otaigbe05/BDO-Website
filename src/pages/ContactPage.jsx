import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Mail, Phone, Send, Building, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import Breadcrumbs from '@/components/Breadcrumbs';
import { sendEmail } from '@/lib/email';
import HeroSection from '@/components/HeroSection';

const ContactPage = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    industry: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const siteUrl = "https://www.bdoanalyticssolutions.com/contact";
  const ogImageUrl = `https://www.bdoanalyticssolutions.com/og-image.jpg`;
  const omisAppLink = "https://omis-crm.com/";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "name": "Contact BDO Analytics Solutions",
    "url": siteUrl,
    "description": "Get in touch with BDO Analytics Solutions. Schedule a free demo to see how our CRM and Power BI dashboards can help your small business grow.",
     "mainContentOfPage": {
        "@type": "WebPageElement",
        "cssSelector": ".contact-form"
     },
     "publisher": {
        "@type": "Organization",
        "name": "BDO Analytics Solutions",
        "logo": {
            "@type": "ImageObject",
            "url": "https://www.bdoanalyticssolutions.com/og-image.jpg"
        }
      }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await sendEmail(formData);

      toast({
        title: "Message Sent! 🚀",
        description: "Thanks for reaching out! We'll get back to you as soon as possible.",
        duration: 6000,
      });
      setFormData({ name: '', email: '', phone: '', company: '', industry: '', message: '' });

    } catch (error) {
      console.error('EmailJS Error:', error);
      toast({
        variant: "destructive",
        title: "Oh no! Something went wrong.",
        description: "There was a problem sending your message. Please try again or contact us directly.",
        duration: 6000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const industries = ["Dental", "Veterinary", "Physiotherapy", "Spa & Wellness", "Restaurant", "Auto Repair", "Fitness", "Retail", "Cleaning", "Property Management", "Tutoring", "Other"];

  return (
    <div className="bg-slate-50 font-sans">
      <Helmet>
        <title>Contact Us | Book a Demo | BDO Analytics Solutions</title>
        <meta name="description" content="Get in touch with BDO Analytics Solutions. Schedule a free demo to see how our CRM and Power BI dashboards can help your small business grow." />
        <link rel="canonical" href={siteUrl} />

        <meta property="og:title" content="Contact Us & Book a Demo | BDO Analytics Solutions" />
        <meta property="og:description" content="Have questions? Want to see our platform in action? Contact us today to schedule a personalized demo for your business." />
        <meta property="og:url" content={siteUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content={ogImageUrl} />

        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      <Breadcrumbs />

      <HeroSection
            headline="Get In Touch"
            subheadline="We're here to answer your questions and help you get started."
            primaryCtaText="Book a Demo"
            primaryCtaLink="/book-demo"
            secondaryCtaText="Try OMIS Now"
            secondaryCtaLink={omisAppLink}
            backgroundImage="https://images.unsplash.com/photo-1516383274235-5f42d6c6426d?auto=format&fit=crop&q=80&w=2000"
            minHeight="min-h-[50vh]"
        />

      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">Send Us a Message</h2>
            <p className="mt-4 text-xl text-slate-800 font-medium">We'd love to hear from you.</p>
          </div>

          <div className="grid lg:grid-cols-5 gap-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-3 bg-white p-8 md:p-12 rounded-3xl shadow-xl shadow-slate-200/50 border-2 border-slate-200"
            >
              <h3 className="text-2xl font-extrabold mb-8 text-slate-900">Send Us a Message</h3>
              <form
                onSubmit={handleSubmit}
                className="space-y-6 contact-form"
              >
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-bold text-slate-900 mb-2">Full Name *</label>
                      <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required className="w-full px-4 py-3 rounded-xl border-2 border-slate-300 focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 outline-none transition-all text-slate-900 placeholder:text-slate-500 font-medium" />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-bold text-slate-900 mb-2">Email *</label>
                      <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required className="w-full px-4 py-3 rounded-xl border-2 border-slate-300 focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 outline-none transition-all text-slate-900 placeholder:text-slate-500 font-medium" />
                    </div>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="phone" className="block text-sm font-bold text-slate-900 mb-2">Phone Number</label>
                      <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border-2 border-slate-300 focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 outline-none transition-all text-slate-900 placeholder:text-slate-500 font-medium" />
                    </div>
                    <div>
                      <label htmlFor="company" className="block text-sm font-bold text-slate-900 mb-2">Company Name</label>
                      <input type="text" id="company" name="company" value={formData.company} onChange={handleChange} className="w-full px-4 py-3 rounded-xl border-2 border-slate-300 focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 outline-none transition-all text-slate-900 placeholder:text-slate-500 font-medium" />
                    </div>
                 </div>

                <div>
                  <label htmlFor="industry" className="block text-sm font-bold text-slate-900 mb-2">Industry *</label>
                  <select id="industry" name="industry" value={formData.industry} onChange={handleChange} required className="w-full px-4 py-3 rounded-xl border-2 border-slate-300 focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 outline-none bg-white transition-all text-slate-900 font-medium">
                    <option value="" disabled>Select your industry</option>
                    {industries.map(i => <option key={i} value={i} className="text-slate-900">{i}</option>)}
                  </select>
                </div>
                 <div>
                  <label htmlFor="message" className="block text-sm font-bold text-slate-900 mb-2">Message</label>
                  <textarea id="message" name="message" value={formData.message} onChange={handleChange} rows={4} className="w-full px-4 py-3 rounded-xl border-2 border-slate-300 focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 outline-none resize-none transition-all text-slate-900 placeholder:text-slate-500 font-medium" placeholder="Tell us about your business goals..."></textarea>
                </div>
                <Button type="submit" size="lg" className="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold py-3 text-lg rounded-xl shadow-md" disabled={isSubmitting}>
                   {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      Send Message <Send className="ml-2 w-5 h-5" />
                    </>
                  )}
                </Button>
              </form>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:col-span-2 space-y-6"
            >
              <div className="bg-white p-8 rounded-3xl shadow-md border-2 border-slate-200 hover:border-blue-300 transition-colors">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center border border-blue-100">
                        <Mail className="w-7 h-7 text-blue-700" />
                    </div>
                    <div>
                        <h4 className="font-extrabold text-slate-900 text-lg">Email Us</h4>
                        <a href="mailto:info@bdoanalyticssolutions.com" className="text-blue-700 font-bold hover:underline">info@bdoanalyticssolutions.com</a>
                    </div>
                </div>
              </div>
              <div className="bg-white p-8 rounded-3xl shadow-md border-2 border-slate-200 hover:border-blue-300 transition-colors">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center border border-blue-100">
                        <Phone className="w-7 h-7 text-blue-700" />
                    </div>
                    <div>
                        <h4 className="font-extrabold text-slate-900 text-lg">Call Us</h4>
                        <a href="tel:+14168485058" className="text-blue-700 font-bold hover:underline">+1-416-848-5058</a>
                    </div>
                </div>
              </div>
              <div className="bg-white p-8 rounded-3xl shadow-md border-2 border-slate-200 hover:border-blue-300 transition-colors">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center border border-blue-100">
                        <Building className="w-7 h-7 text-blue-700" />
                    </div>
                    <div>
                        <h4 className="font-extrabold text-slate-900 text-lg">Our Office</h4>
                        <p className="text-slate-800 font-medium">Toronto, ON, Canada</p>
                    </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
