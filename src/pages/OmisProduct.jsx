import React, { useState, Suspense, lazy } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { 
  BarChart2, 
  TrendingUp, 
  Users, 
  Bell, 
  Globe, 
  Wallet, 
  Layers, 
  ShoppingBag,
  Plug,
  LineChart,
  Lightbulb,
  Utensils,
  Hammer,
  Monitor,
  Briefcase,
  Store,
  Check
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { sendEmail } from '@/lib/email';
import HeroSection from '@/components/HeroSection';
import OmisComparison from '@/components/OmisComparison';
import NewsletterSignup from '@/components/NewsletterSignup';
import Breadcrumbs from '@/components/Breadcrumbs';
import OmisDashboardScreens from '@/components/OmisDashboardScreens';
import OmisPricingTable from '@/components/OmisPricingTable';

const OmisProduct = () => {
    const { toast } = useToast();
    const siteUrl = "https://www.bdoanalyticssolutions.com/omis-product";
    const omisAppLink = "https://www.omis-crm.com";
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [contactForm, setContactForm] = useState({ name: '', email: '', company: '', message: '' });

    const handleContactSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await sendEmail(contactForm);
            toast({
                title: "Message Sent!",
                description: "We'll be in touch shortly.",
            });
            setContactForm({ name: '', email: '', company: '', message: '' });
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Error sending message",
                description: "Please try again later.",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const howItWorksSteps = [
        { icon: <Plug className="w-8 h-8 text-blue-600" />, title: "1. Connect Your Data", desc: "Upload files or connect tools like Excel, SQL, Stripe, and more." },
        { icon: <LineChart className="w-8 h-8 text-teal-600" />, title: "2. OMIS Analyzes Everything", desc: "Your data is cleaned, structured, and transformed automatically." },
        { icon: <Lightbulb className="w-8 h-8 text-amber-500" />, title: "3. Get Insights & Grow", desc: "Dashboards, forecasts, and recommendations guide your next steps." },
    ];

    return (
        <div className="bg-white text-slate-900 font-sans min-h-screen">
            <Helmet>
                <title>OMIS - Instant Business Insights | BDO Analytics Solutions</title>
                <meta name="description" content="OMIS: The no-CRM analytics platform for small business by BDO Analytics Solutions. Automated dashboards, forecasting, and insights without the complexity." />
                <link rel="canonical" href={siteUrl} />
            </Helmet>

            <Breadcrumbs />

            {/* Hero with new gradient styling */}
            <HeroSection 
                headline={
                    <span>
                        OMIS: Your Data, <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-500">
                            Transformed Into Decisions
                        </span>
                    </span>
                }
                subheadline="Turn your scattered data into dashboards, forecasts, and recommendations — without changing your workflow."
                primaryCtaText="Book a Demo"
                primaryCtaLink="/book-demo"
                secondaryCtaText="Try OMIS Now"
                secondaryCtaLink={omisAppLink}
                showDashboardPreview={false}
            />

            {/* Interactive Dashboard Screens Integration */}
            <OmisDashboardScreens />

            <section className="py-24 bg-white relative overflow-hidden border-t border-slate-100">
                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-4xl mx-auto text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-bold mb-6 text-slate-900 tracking-tight">Running Without a CRM? You're Not Alone.</h2>
                        <p className="text-slate-600 text-lg font-light leading-relaxed">Most small businesses operate in chaos. OMIS brings order.</p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                        {[
                            { title: "Scattered Data", desc: "Sales in Stripe, expenses in Xero, customer lists in Excel. Nothing talks to each other." },
                            { title: "No Clear Picture", desc: "You don't know if you're profitable until your accountant tells you at the end of the year." },
                            { title: "Time Wasted", desc: "Hours spent manually updating spreadsheets that are outdated the moment you finish." }
                        ].map((point, i) => (
                            <motion.div 
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="bg-slate-50 p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow"
                            >
                                <div className="w-12 h-1 bg-red-500 mb-6 rounded-full" />
                                <h3 className="text-xl font-bold mb-3 text-slate-900">{point.title}</h3>
                                <p className="text-slate-600 leading-relaxed font-light">{point.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

             <section className="py-24 bg-white border-t border-slate-50">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-bold mb-6 text-slate-900">How OMIS Works</h2>
                    </div>
                    
                    <div className="grid md:grid-cols-3 gap-12 max-w-6xl mx-auto mb-24 relative">
                        {howItWorksSteps.map((step, i) => (
                            <motion.div 
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.2 }}
                                className="flex flex-col items-center text-center bg-white p-6"
                            >
                                <div className="w-24 h-24 bg-slate-50 rounded-full border border-slate-200 flex items-center justify-center mb-6 shadow-md">
                                    {step.icon}
                                </div>
                                <h3 className="text-2xl font-bold mb-3 text-slate-900">{step.title}</h3>
                                <p className="text-slate-600 max-w-xs">{step.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
             </section>

            {/* Pricing Section rendered via imported component */}
            <section className="py-24 bg-slate-50 border-t border-slate-100" id="pricing">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16 max-w-3xl mx-auto">
                        <h2 className="text-3xl md:text-5xl font-bold mb-6 text-slate-900">Simple, Transparent Pricing</h2>
                        <p className="text-lg text-slate-600">Choose the perfect plan for your business needs. No hidden fees.</p>
                    </div>

                    <OmisPricingTable />
                </div>
            </section>

            <section className="py-12 bg-white border-t border-slate-50">
                <div className="container mx-auto px-4">
                    <OmisComparison />
                </div>
            </section>

            <section className="py-24 bg-white border-t border-slate-50">
                <div className="container mx-auto px-4">
                    <NewsletterSignup />
                </div>
            </section>
        </div>
    );
};

export default OmisProduct;