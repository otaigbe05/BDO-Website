import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, ExternalLink, CalendarCheck, Wallet, FileSignature, BellRing, Users2, LayoutDashboard, BarChart2, FileSpreadsheet, RefreshCw } from 'lucide-react';
import HeroSection from '@/components/HeroSection';
import TrustTicker from '@/components/TrustTicker';

const Home = () => {
    const siteUrl = "https://www.bdoanalyticssolutions.com";

    const fadeInUp = {
        initial: { opacity: 0, y: 20 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true },
        transition: { duration: 0.6, ease: "easeOut" }
    };

    const omisFeatures = [
        {
            icon: <CalendarCheck className="w-8 h-8" />,
            title: "Online Booking",
            desc: "Clients book their own appointments, day or night",
            glowColor: "from-blue-500/10 via-transparent to-transparent",
            iconColor: "text-blue-700",
            iconBg: "bg-blue-50",
            iconBorder: "border-blue-200",
            hoverIconBg: "group-hover:bg-blue-600 group-hover:text-white",
            hoverBorder: "group-hover:border-blue-400",
            linkColor: "text-blue-700 hover:text-blue-800"
        },
        {
            icon: <Wallet className="w-8 h-8" />,
            title: "Deposits",
            desc: "Paid straight into your own Stripe account — we never hold your funds",
            glowColor: "from-emerald-500/10 via-transparent to-transparent",
            iconColor: "text-emerald-700",
            iconBg: "bg-emerald-50",
            iconBorder: "border-emerald-200",
            hoverIconBg: "group-hover:bg-emerald-600 group-hover:text-white",
            hoverBorder: "group-hover:border-emerald-400",
            linkColor: "text-emerald-700 hover:text-emerald-800"
        },
        {
            icon: <FileSignature className="w-8 h-8" />,
            title: "Digital Waivers",
            desc: "Clients sign before they arrive — no paper, no chasing",
            glowColor: "from-violet-500/10 via-transparent to-transparent",
            iconColor: "text-violet-700",
            iconBg: "bg-violet-50",
            iconBorder: "border-violet-200",
            hoverIconBg: "group-hover:bg-violet-600 group-hover:text-white",
            hoverBorder: "group-hover:border-violet-400",
            linkColor: "text-violet-700 hover:text-violet-800"
        },
        {
            icon: <BellRing className="w-8 h-8" />,
            title: "SMS & Email Reminders",
            desc: "Fewer no-shows, automatically",
            glowColor: "from-amber-500/10 via-transparent to-transparent",
            iconColor: "text-amber-700",
            iconBg: "bg-amber-50",
            iconBorder: "border-amber-200",
            hoverIconBg: "group-hover:bg-amber-600 group-hover:text-white",
            hoverBorder: "group-hover:border-amber-400",
            linkColor: "text-amber-700 hover:text-amber-800"
        },
        {
            icon: <Users2 className="w-8 h-8" />,
            title: "Per-Staff Booking Links",
            desc: "Every team member gets their own bookable page",
            glowColor: "from-rose-500/10 via-transparent to-transparent",
            iconColor: "text-rose-700",
            iconBg: "bg-rose-50",
            iconBorder: "border-rose-200",
            hoverIconBg: "group-hover:bg-rose-600 group-hover:text-white",
            hoverBorder: "group-hover:border-rose-400",
            linkColor: "text-rose-700 hover:text-rose-800"
        },
        {
            icon: <LayoutDashboard className="w-8 h-8" />,
            title: "Business Dashboard",
            desc: "Bookings, deposits, and client activity in one place",
            glowColor: "from-teal-500/10 via-transparent to-transparent",
            iconColor: "text-teal-700",
            iconBg: "bg-teal-50",
            iconBorder: "border-teal-200",
            hoverIconBg: "group-hover:bg-teal-600 group-hover:text-white",
            hoverBorder: "group-hover:border-teal-400",
            linkColor: "text-teal-700 hover:text-teal-800"
        },
    ];

    const consultingServices = [
        { icon: <BarChart2 className="w-7 h-7" />, title: "Power BI Dashboards", desc: "Custom dashboards built around how you actually run your business" },
        { icon: <FileSpreadsheet className="w-7 h-7" />, title: "Data Audit & Cleanup", desc: "We untangle scattered spreadsheets, POS exports, and legacy tools" },
        { icon: <RefreshCw className="w-7 h-7" />, title: "Automated Reporting", desc: "Reports that update themselves instead of eating your Sunday night" },
    ];

    const verticals = [
        { name: "Tattoo & Piercing Studios", href: "https://www.omis-crm.com/tattoo" },
        { name: "Barbershops", href: "https://www.omis-crm.com/barbers" },
        { name: "Auto Repair Shops", href: "https://www.omis-crm.com/auto" },
    ];

    return (
        <>
            <Helmet>
                <title>Data & Analytics Consulting + OMIS | BDO Analytics Solutions</title>
                <meta name="description" content="BDO Analytics Solutions is a Toronto-based data and analytics consulting practice — and the builder of OMIS, the booking, deposits, and client-management platform for appointment-based businesses." />
                <link rel="canonical" href={siteUrl} />
            </Helmet>

            <div className="bg-white overflow-hidden font-sans">
                <HeroSection
                    headline={
                        <span>
                            We turn business data into <br className="hidden md:block" />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-teal-700">
                                better decisions.
                            </span>
                        </span>
                    }
                    subheadline="BDO Analytics Solutions is a Toronto-based data and analytics consulting practice — and the builder of OMIS, the booking, deposits, and client-management platform for appointment-based businesses."
                    primaryCtaText="Book a Demo"
                    primaryCtaLink="/book-demo"
                    secondaryCtaText="Try OMIS Now"
                    secondaryCtaLink="https://omis-crm.com/"
                    showDashboardPreview={false}
                />

                <TrustTicker />

                <section className="py-24 bg-white border-t border-slate-200">
                    <div className="container mx-auto px-4">
                        <motion.div {...fadeInUp} className="max-w-4xl mx-auto text-center mb-16">
                            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">Our Consulting Practice</h2>
                            <p className="text-xl text-slate-800 font-medium leading-relaxed">
                                Before OMIS, there's the work we've always done: making sense of your business's numbers.
                            </p>
                        </motion.div>

                        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                            {consultingServices.map((item, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                    className="bg-slate-50 p-8 rounded-2xl border border-slate-300"
                                >
                                    <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mb-5 border border-blue-100 text-blue-700">
                                        {item.icon}
                                    </div>
                                    <h3 className="text-2xl font-bold text-slate-900 mb-3">{item.title}</h3>
                                    <p className="text-slate-800 font-medium mb-4">{item.desc}</p>
                                    <Link to="/services" className="inline-flex items-center font-bold text-blue-700 hover:text-blue-800 transition-colors group">
                                      See our services <ArrowRight className="ml-1 w-4 h-4 transition-transform group-hover:translate-x-1" />
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="py-24 bg-blue-50/50 border-y border-slate-200">
                    <div className="container mx-auto px-4">
                        <motion.div {...fadeInUp} className="max-w-4xl mx-auto text-center mb-16">
                            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">Meet OMIS</h2>
                            <p className="text-xl text-slate-800 font-medium leading-relaxed">
                                Our flagship product: online booking, deposits, digital waivers, and client management for appointment-based businesses. Live today for three industries.
                            </p>
                        </motion.div>

                        <div className="grid sm:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12">
                            {verticals.map((v, i) => (
                                <motion.a
                                    key={i}
                                    href={v.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                    className="bg-white p-6 rounded-2xl shadow-md border border-slate-300 hover:shadow-lg hover:border-blue-400 transition-all duration-300 flex items-center justify-between font-bold text-slate-900"
                                >
                                    {v.name}
                                    <ExternalLink className="w-4 h-4 text-blue-700" />
                                </motion.a>
                            ))}
                        </div>

                        <div className="text-center">
                            <Button asChild size="lg" className="bg-blue-700 hover:bg-blue-800 text-white font-bold h-14 px-8 rounded-full shadow-lg transition-transform hover:scale-105">
                                <a href="https://omis-crm.com/" target="_blank" rel="noopener noreferrer">
                                    Explore OMIS <ArrowRight className="ml-2 w-5 h-5" />
                                </a>
                            </Button>
                        </div>
                    </div>
                </section>

                <section className="py-24 bg-white border-b border-slate-200 relative">
                    <div className="container mx-auto px-4">
                        <motion.div {...fadeInUp} className="text-center mb-16">
                            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">What OMIS Gives Your Business</h2>
                        </motion.div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                            {omisFeatures.map((feature, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.08, duration: 0.5 }}
                                    className={`relative group bg-white p-8 rounded-3xl border border-slate-300 shadow-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-[6px] hover:scale-[1.02] ${feature.hoverBorder} flex flex-col overflow-hidden z-10`}
                                >
                                    <div className={`absolute inset-0 bg-gradient-to-br ${feature.glowColor} opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-[-1]`} />
                                    
                                    <div className={`w-16 h-16 ${feature.iconBg} rounded-2xl flex items-center justify-center mb-6 ${feature.iconColor} border ${feature.iconBorder} ${feature.hoverIconBg} transition-colors duration-300`}>
                                        {feature.icon}
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                                    <p className="text-slate-800 font-medium leading-relaxed flex-grow">{feature.desc}</p>
                                    <Link to="/omis-product" className={`inline-flex items-center font-bold ${feature.linkColor} transition-colors group-hover:translate-x-1 mt-4 duration-300`}>
                                      Explore Feature <ArrowRight className="ml-1 w-4 h-4" />
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                        
                        <div className="text-center mt-16">
                            <Button asChild size="lg" className="bg-blue-700 hover:bg-blue-800 text-white font-bold h-14 px-8 rounded-full shadow-lg transition-transform hover:scale-105">
                                <Link to="/roi-calculator">Calculate Your ROI</Link>
                            </Button>
                        </div>
                    </div>
                </section>

            </div>
        </>
    );
};

export default Home;