import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, LayoutDashboard, CalendarDays, Users, Receipt, UserCog, BellRing, FileLineChart, Download, ShieldCheck } from 'lucide-react';
import Breadcrumbs from '@/components/Breadcrumbs';

const Omis = () => {
    const siteUrl = "https://www.bdoanalyticssolutions.com/omis";
    const omisAppLink = "https://omis-crm.com/";

    const features = [
        {
            title: "Interactive Dashboards",
            description: "Get a bird's-eye view of your business instantly. Customize widgets to see revenue, appointments, and task lists upon login.",
            icon: <LayoutDashboard className="w-6 h-6 text-blue-500" />
        },
        {
            title: "Smart Scheduling",
            description: "Drag-and-drop calendar management. Handle multiple staff schedules, room allocations, and recurring appointments with ease.",
            icon: <CalendarDays className="w-6 h-6 text-green-500" />
        },
        {
            title: "Comprehensive CRM",
            description: "Store detailed client profiles, including history, notes, files, and preferences. Never ask for the same details twice.",
            icon: <Users className="w-6 h-6 text-purple-500" />
        },
        {
            title: "Billing & Invoicing",
            description: "Create professional invoices in seconds. Track payments, manage outstanding balances, and handle refunds directly.",
            icon: <Receipt className="w-6 h-6 text-orange-500" />
        },
        {
            title: "Staff Management",
            description: "Manage employee profiles, track performance metrics, and assign specific roles and permissions securely.",
            icon: <UserCog className="w-6 h-6 text-indigo-500" />
        },
        {
            title: "Automated Reminders",
            description: "Reduce no-shows with automated email and SMS reminders for upcoming appointments.",
            icon: <BellRing className="w-6 h-6 text-rose-500" />
        },
        {
            title: "Advanced Reporting",
            description: "Generate detailed reports on sales, staff productivity, and client retention. Filter by date range and export for analysis.",
            icon: <FileLineChart className="w-6 h-6 text-teal-500" />
        },
        {
            title: "Data Export",
            description: "Your data belongs to you. Easily export lists and reports to CSV or Excel for external processing or backup.",
            icon: <Download className="w-6 h-6 text-slate-500" />
        },
        {
            title: "Enterprise Security",
            description: "Bank-grade encryption, secure login protocols, and regular backups ensure your business data is always safe.",
            icon: <ShieldCheck className="w-6 h-6 text-emerald-500" />
        }
    ];

    return (
        <div className="bg-slate-50 font-sans">
            <Helmet>
                <title>OMIS Platform | CRM & Scheduling for Small Business | BDO Analytics Solutions</title>
                <meta name="description" content="Discover OMIS: The all-in-one operational management system. Scheduling, CRM, billing, and reporting in one secure platform from BDO Analytics Solutions." />
                <link rel="canonical" href={siteUrl} />
                <meta property="og:title" content="OMIS Platform | The Operating System for Small Business | BDO Analytics Solutions" />
                <meta property="og:description" content="Streamline your operations with OMIS. One platform for scheduling, CRM, and billing." />
            </Helmet>

            <Breadcrumbs />

            {/* Hero Section */}
            <section className="bg-white pt-16 pb-24 border-b border-slate-100">
                <div className="container mx-auto px-4 text-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 bg-green-50 border border-green-100 text-green-700 rounded-full font-medium text-sm mb-8"
                    >
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                        </span>
                        Live & Ready to Use
                    </motion.div>
                    <motion.h1 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-6xl font-bold text-slate-900 leading-tight mb-6 max-w-4xl mx-auto tracking-tight"
                    >
                        The Operating System for <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Small Business</span>
                    </motion.h1>
                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed"
                    >
                        OMIS from BDO Analytics Solutions replaces your fragmented tools with one cohesive platform. Manage your clients, schedule, and finances in one place—while automatically building the data you need to grow.
                    </motion.p>
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="flex justify-center gap-4"
                    >
                        <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700 text-lg shadow-lg shadow-blue-600/20 rounded-xl px-8 h-14">
                            <a href={omisAppLink} target="_blank" rel="noopener noreferrer">
                                Try OMIS Now <ArrowRight className="ml-2 w-5 h-5" />
                            </a>
                        </Button>
                    </motion.div>
                    
                    <motion.div 
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" }}
                        className="mt-16 rounded-2xl shadow-2xl shadow-slate-200/50 border border-slate-200/60 overflow-hidden max-w-5xl mx-auto bg-white"
                    >
                        <img 
                            src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=2426" 
                            alt="OMIS Platform Interface Dashboard" 
                            className="w-full h-auto"
                        />
                    </motion.div>
                </div>
            </section>

            {/* Detailed Features Grid */}
            <section className="py-24 bg-slate-50">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-20">
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">Everything You Need to Run Smoothly</h2>
                        <p className="mt-4 text-lg text-slate-600">No more switching between tabs. OMIS handles it all.</p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {features.map((feature, index) => (
                            <motion.div
                                key={feature.title}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.4, delay: index * 0.05 }}
                                className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-lg hover:border-blue-100 transition-all duration-300 group"
                            >
                                <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-50 transition-colors">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                                <p className="text-slate-600 leading-relaxed">{feature.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

             {/* CTA Section */}
            <section className="py-24 bg-white border-t border-slate-100">
                <div className="container mx-auto px-4">
                    <div className="bg-slate-900 rounded-[2.5rem] p-12 md:p-20 text-center relative overflow-hidden shadow-2xl">
                         <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
                         <div className="absolute bottom-0 left-0 w-72 h-72 bg-purple-600/20 rounded-full blur-3xl -ml-20 -mb-20 pointer-events-none"></div>
                        
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="relative z-10"
                        >
                            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-tight">Ready to Simplify Your Operations?</h2>
                            <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-10">
                                Join the businesses that are saving hours every week with OMIS from BDO Analytics Solutions. No credit card required to start exploring.
                            </p>
                            <Button asChild size="lg" className="bg-white text-slate-900 hover:bg-blue-50 text-lg px-10 py-7 h-auto rounded-xl shadow-xl transition-transform hover:scale-105">
                                <a href={omisAppLink} target="_blank" rel="noopener noreferrer">
                                    Try OMIS Now <ArrowRight className="ml-2 w-5 h-5" />
                                </a>
                            </Button>
                        </motion.div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Omis;