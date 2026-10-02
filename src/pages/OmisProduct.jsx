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
        { icon: <Plug className="w-8 h-8 text-blue-600" />, title: "1. Set Up Your Booking Page", desc: "Add your services, staff, and hours — live in a day, no technical skills required." },
        { icon: <LineChart className="w-8 h-8 text-teal-600" />, title: "2. Clients Book & Pay Deposits", desc: "Bookings, digital waivers, and deposits go straight into your own Stripe account." },
        { icon: <Lightbulb className="w-8 h-8 text-amber-500" />, title: "3. Fewer No-Shows, Less Admin", desc: "Automated SMS/email reminders and a business dashboard keep you on top of it all." },
    ];

    return (
        <div className="bg-white text-slate-900 font-sans min-h-screen">
            <Helmet>
                <title>OMIS - Booking, Deposits & Waivers | BDO Analytics Solutions</title>
                <meta name="description" content="OMIS is a booking, deposit, and waiver platform for appointment-based businesses. Live today for tattoo and piercing studios, barbershops, auto repair shops, spas and salons, and personal trainers. Deposits go straight to your own Stripe account." />
                <link rel="canonical" href={siteUrl} />
            </Helmet>

            <Breadcrumbs />

            {/* Hero with new gradient styling */}
            <HeroSection
                headline={
                    <span>
                        OMIS: Booking, Deposits, <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-500">
                            and Waivers
                        </span>
                    </span>
                }
                subheadline="Online booking, deposits paid directly into your own Stripe account, digital waivers, and automated reminders — built for appointment-based businesses."
                primaryCtaText="Book a Demo"
                primaryCtaLink="/book-demo"
                secondaryCtaText="Try OMIS Now"
                secondaryCtaLink={omisAppLink}
                showDashboardPreview={false}
            />

            {/* Live Verticals */}
            <section className="py-16 bg-slate-50 border-b border-slate-200">
                <div className="container mx-auto px-4 text-center">
                    <p className="text-sm font-extrabold text-slate-500 uppercase tracking-wider mb-6">Live Today For</p>
                    <div className="flex flex-wrap justify-center gap-4">
                        {[
                            { name: "Tattoo & Piercing", href: "https://www.omis-crm.com/tattoo" },
                            { name: "Barbershops", href: "https://www.omis-crm.com/barbers" },
                            { name: "Auto Repair Shops", href: "https://www.omis-crm.com/auto" },
                            { name: "Spas & Salons", href: "https://www.omis-crm.com/spa" },
                            { name: "Personal Training", href: "https://www.omis-crm.com/personal-training" },
                        ].map((v) => (
                            <a
                                key={v.name}
                                href={v.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-white px-6 py-3 rounded-full border border-slate-300 shadow-sm hover:shadow-md hover:border-blue-400 transition-all font-bold text-slate-900"
                            >
                                {v.name}
                            </a>
                        ))}
                    </div>
                </div>
            </section>

            {/* Interactive Dashboard Screens Integration */}
            <OmisDashboardScreens />

            <section className="py-24 bg-white relative overflow-hidden border-t border-slate-100">
                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-4xl mx-auto text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-bold mb-6 text-slate-900 tracking-tight">Running Your Booking Book on Paper or DMs?</h2>
                        <p className="text-slate-600 text-lg font-light leading-relaxed">Most appointment-based businesses lose time and money the same three ways. OMIS fixes all three.</p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                        {[
                            { title: "No-Shows", desc: "Clients skip appointments with nothing on the line — deposits fix that." },
                            { title: "Manual Booking", desc: "Phone tag and DMs to book a slot, instead of clients booking themselves in seconds." },
                            { title: "Paper Waivers", desc: "Chasing signatures at the door instead of having them done before the client arrives." }
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

            {/* Trust: software, not a payment processor */}
            <section className="py-20 bg-slate-900 text-white">
                <div className="container mx-auto px-4 max-w-5xl">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">We're software, not a middleman.</h2>
                        <p className="text-slate-300 text-lg max-w-3xl mx-auto">
                            OMIS is built and supported by BDO Analytics Solutions. Every deposit a client pays lands straight in your own Stripe account. We never hold your money, and we take no cut of deposits.
                        </p>
                    </div>
                    <ul className="grid sm:grid-cols-2 gap-x-10 gap-y-5 max-w-4xl mx-auto">
                        {[
                            "Deposits are charged on your own Stripe account — OMIS never holds, routes, or touches the money.",
                            "Card details never pass through OMIS; clients pay on Stripe's own hosted checkout page.",
                            "Your data is hosted in Canada (AWS Canada Central, Montreal) and encrypted in transit and at rest.",
                            "Your business data always belongs to you and is never sold.",
                        ].map((item) => (
                            <li key={item} className="flex items-start gap-3 text-slate-200 font-medium">
                                <Check className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                                <span>{item}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </section>

            {/* Pricing Section rendered via imported component */}
            <section className="py-24 bg-slate-50 border-t border-slate-100" id="pricing">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16 max-w-3xl mx-auto">
                        <h2 className="text-3xl md:text-5xl font-bold mb-6 text-slate-900">Simple Pricing</h2>
                        <p className="text-lg text-slate-600">Prices in CAD, month-to-month, no contract. 14-day free trial with full access — no credit card required to start.</p>
                    </div>

                    <OmisPricingTable />
                </div>
            </section>

            <section className="py-12 bg-white border-t border-slate-50">
                <div className="container mx-auto px-4">
                    <OmisComparison />
                </div>
            </section>
        </div>
    );
};

export default OmisProduct;