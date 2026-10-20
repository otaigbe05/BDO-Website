import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, ExternalLink, CalendarCheck, Wallet, FileSignature, BellRing, Users2, LayoutDashboard, BarChart2, FileSpreadsheet, RefreshCw } from 'lucide-react';
import ThreeDoors, { ProductBand } from '@/components/ThreeDoors';
import TemplateShowcase from '@/components/TemplateShowcase';

const Home = () => {
    const siteUrl = "https://www.bdoanalyticssolutions.com";

    const fadeInUp = {
        initial: { opacity: 0, y: 20 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true },
        transition: { duration: 0.6, ease: "easeOut" }
    };

    // OMIS features, all in the OMIS colour (green) so the page reads by product.
    const omisFeatures = [
        { icon: <CalendarCheck className="w-7 h-7" />, title: "Online Booking", desc: "Clients book their own appointments, day or night" },
        { icon: <Wallet className="w-7 h-7" />, title: "Deposits", desc: "Paid straight into your own Stripe account. We never hold your funds" },
        { icon: <FileSignature className="w-7 h-7" />, title: "Digital Waivers", desc: "Clients sign before they arrive: no paper, no chasing" },
        { icon: <BellRing className="w-7 h-7" />, title: "SMS & Email Reminders", desc: "Fewer no-shows, automatically" },
        { icon: <Users2 className="w-7 h-7" />, title: "Per-Staff Booking Links", desc: "Every team member gets their own bookable page" },
        { icon: <LayoutDashboard className="w-7 h-7" />, title: "Business Dashboard", desc: "Bookings, deposits, and client activity in one place" },
    ];

    const consultingServices = [
        { icon: <BarChart2 className="w-7 h-7" />, title: "Power BI Dashboards", desc: "Custom dashboards built around how you actually run your business" },
        { icon: <FileSpreadsheet className="w-7 h-7" />, title: "Data Audit & Cleanup", desc: "We untangle scattered spreadsheets, POS exports, and legacy tools" },
        { icon: <RefreshCw className="w-7 h-7" />, title: "Automated Reporting", desc: "Reports that update themselves instead of eating your Sunday night" },
    ];

    const verticals = [
        { name: "Tattoo & piercing", href: "/for/tattoo" },
        { name: "Barbershops", href: "/for/barbers" },
        { name: "Auto repair", href: "/for/auto" },
        { name: "Spas & salons", href: "/for/spa" },
        { name: "Personal training", href: "/for/personal-training" },
    ];

    return (
        <>
            <Helmet>
                <title>Websites, Booking Software and Data Analytics | BDO Analytics Solutions</title>
                <meta name="description" content="Websites for businesses that run on appointments, with OMIS online booking, reminders and deposits built in, plus data and analytics consulting. For barbershops, tattoo studios, auto shops, spas, salons and personal trainers. Built in Canada." />
                <link rel="canonical" href={siteUrl} />
            </Helmet>

            <div className="bg-white overflow-hidden font-sans">
                {/* One company, three doors (components/ThreeDoors.jsx). */}
                <ThreeDoors />

                {/* 1. Websites (blue) */}
                <ProductBand product="websites" />
                <TemplateShowcase />

                {/* 2. OMIS booking (green): what it does and who uses it, in one place. */}
                <ProductBand product="omis" />
                <section className="py-20 bg-white">
                    <div className="container mx-auto px-4">
                        <motion.div {...fadeInUp} className="max-w-4xl mx-auto text-center mb-14">
                            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-5">The system that runs the shop</h2>
                            <p className="text-xl text-slate-800 font-medium leading-relaxed">
                                OMIS is our booking software for appointment-based businesses: booking, deposits, waivers and reminders. Built and supported by BDO Analytics Solutions, and live today across five industries in Ontario.
                            </p>
                        </motion.div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                            {omisFeatures.map((feature, i) => (
                                <motion.div
                                    key={feature.title}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.06, duration: 0.45 }}
                                    className="group bg-white p-7 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-emerald-300 transition-all duration-300 flex flex-col"
                                >
                                    <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center mb-5 text-emerald-700 border border-emerald-200 group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-300">
                                        {feature.icon}
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 mb-2">{feature.title}</h3>
                                    <p className="text-slate-800 font-medium leading-relaxed">{feature.desc}</p>
                                </motion.div>
                            ))}
                        </div>

                        <div className="max-w-6xl mx-auto mt-12 flex flex-wrap items-center justify-center gap-3">
                            <span className="font-bold text-slate-900">Live today for:</span>
                            {verticals.map((v) => (
                                <Link key={v.href} to={v.href} className="rounded-full bg-emerald-50 px-4 py-2 text-sm font-bold text-emerald-800 ring-1 ring-emerald-200 hover:bg-emerald-100">{v.name}</Link>
                            ))}
                        </div>

                        <div className="mt-12 flex flex-wrap justify-center gap-4">
                            <Button asChild size="lg" className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold h-14 px-8 rounded-full shadow-lg">
                                <a href="https://omis-crm.com/" target="_blank" rel="noopener noreferrer">Try OMIS free for 14 days <ExternalLink className="ml-2 w-5 h-5" /></a>
                            </Button>
                            <Button asChild size="lg" variant="outline" className="border-emerald-700 text-emerald-800 hover:bg-emerald-50 font-bold h-14 px-8 rounded-full">
                                <Link to="/omis-product">See how OMIS works <ArrowRight className="ml-2 w-5 h-5" /></Link>
                            </Button>
                            <Button asChild size="lg" variant="ghost" className="text-emerald-800 hover:bg-emerald-50 font-bold h-14 px-6 rounded-full">
                                <Link to="/roi-calculator">Calculate your return</Link>
                            </Button>
                        </div>
                    </div>
                </section>

                {/* 3. Data and analytics (purple): its own service, for any business. */}
                <ProductBand product="analytics" />
                <section className="py-20 bg-violet-50/40">
                    <div className="container mx-auto px-4">
                        <motion.div {...fadeInUp} className="max-w-4xl mx-auto text-center mb-14">
                            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-5">Make sense of your numbers</h2>
                            <p className="text-xl text-slate-800 font-medium leading-relaxed">
                                The work BDO started with, for any business, shop or not: dashboards you will actually use, clean data, and reports that build themselves.
                            </p>
                        </motion.div>

                        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                            {consultingServices.map((item, i) => (
                                <motion.div
                                    key={item.title}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.08 }}
                                    className="bg-white p-7 rounded-3xl border border-violet-200 shadow-sm"
                                >
                                    <div className="w-14 h-14 bg-violet-50 rounded-2xl flex items-center justify-center mb-5 border border-violet-200 text-violet-700">
                                        {item.icon}
                                    </div>
                                    <h3 className="text-2xl font-bold text-slate-900 mb-3">{item.title}</h3>
                                    <p className="text-slate-800 font-medium">{item.desc}</p>
                                </motion.div>
                            ))}
                        </div>

                        <div className="mt-12 flex flex-wrap justify-center gap-4">
                            <Button asChild size="lg" className="bg-violet-700 hover:bg-violet-800 text-white font-bold h-14 px-8 rounded-full shadow-lg">
                                <Link to="/contact">Book a call <ArrowRight className="ml-2 w-5 h-5" /></Link>
                            </Button>
                            <Button asChild size="lg" variant="outline" className="border-violet-700 text-violet-800 hover:bg-violet-50 font-bold h-14 px-8 rounded-full">
                                <Link to="/services">See our data services</Link>
                            </Button>
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
};

export default Home;