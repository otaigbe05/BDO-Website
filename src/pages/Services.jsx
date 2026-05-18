import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { BarChart, Rocket, FileSpreadsheet, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Breadcrumbs from '@/components/Breadcrumbs';

// Import Section Components
import ServicesHero from '@/components/ServicesHero';
import ServicesComparison from '@/components/ServicesComparison';
import ServicesPricingGrid from '@/components/ServicesPricingGrid';
import ServicesClientStories from '@/components/ServicesClientStories';
import NewsletterSignup from '@/components/NewsletterSignup';
import ServicesFinalCTA from '@/components/ServicesFinalCTA';

const Services = () => {
    const siteUrl = "https://www.bdoanalyticssolutions.com/services";

    const fadeInUp = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
    };

    return (
        <div className="bg-white font-sans text-slate-900 min-h-screen">
            <Helmet>
                <title>Data Analytics Services | Power BI & OMIS Implementation | BDO Analytics Solutions</title>
                <meta name="description" content="Professional data analytics services including Power BI consulting, custom dashboards, data cleanup, and OMIS CRM implementation for small businesses." />
                <link rel="canonical" href={siteUrl} />
                <meta property="og:title" content="Data Analytics Services | Power BI & OMIS Implementation" />
                <meta property="og:description" content="Professional analytics services tailored for small business growth." />
            </Helmet>

            <Breadcrumbs />

            <main>
                <ServicesHero />
                
                {/* Choose Your Solution Section */}
                <section className="py-24 bg-slate-50">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 tracking-tight">Choose Your Solution</h2>
                            <p className="text-lg text-slate-600 font-medium max-w-2xl mx-auto">
                                Three paths designed to meet you exactly where you are.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8">
                            {/* Option 1: Power BI Analytics */}
                            <motion.div 
                                initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}
                                className="bg-white p-8 rounded-3xl shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-300 flex flex-col"
                            >
                                <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 border border-blue-100">
                                    <BarChart className="w-8 h-8 text-blue-600" />
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900 mb-3">Power BI Analytics</h3>
                                <p className="text-slate-600 font-medium mb-8 flex-grow">
                                    Custom dashboard development, data warehouse creation, and ongoing analytics consulting for businesses with complex reporting needs.
                                </p>
                                <Button asChild variant="outline" className="w-full border-blue-200 text-blue-700 hover:bg-blue-50 font-bold py-6">
                                    <Link to="/contact">Learn More <ArrowRight className="ml-2 w-4 h-4" /></Link>
                                </Button>
                            </motion.div>

                            {/* Option 2: OMIS Implementation */}
                            <motion.div 
                                initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}
                                className="bg-slate-900 p-8 rounded-3xl shadow-xl border border-slate-800 hover:-translate-y-1 transition-all duration-300 flex flex-col relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/20 rounded-bl-full -mr-16 -mt-16 blur-xl"></div>
                                <div className="w-16 h-16 bg-blue-900/50 rounded-2xl flex items-center justify-center mb-6 border border-blue-800/50 relative z-10">
                                    <Rocket className="w-8 h-8 text-blue-400" />
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-3 relative z-10">OMIS Implementation</h3>
                                <p className="text-slate-300 font-medium mb-8 flex-grow relative z-10">
                                    Rapid deployment of our Operational Management Information System. Automated, live dashboards built specifically for SMBs.
                                </p>
                                <Button asChild className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-6 relative z-10 shadow-lg shadow-blue-900/50">
                                    <Link to="/omis-product">Get Started <ArrowRight className="ml-2 w-4 h-4" /></Link>
                                </Button>
                            </motion.div>

                            {/* Option 3: Business Templates */}
                            <motion.div 
                                initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}
                                className="bg-white p-8 rounded-3xl shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-300 flex flex-col relative overflow-hidden"
                            >
                                <div className="absolute top-6 right-6 bg-blue-100 text-blue-800 text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
                                    New
                                </div>
                                <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mb-6 border border-emerald-100">
                                    <span className="text-3xl" role="img" aria-label="Clipboard">📋</span>
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900 mb-3 pr-16">Business Reporting Templates</h3>
                                <p className="text-slate-600 font-medium mb-8 flex-grow">
                                    Not ready for a full platform? Start with our industry-specific Excel templates for auto shops, clinics, barbers, salons, and more. Plug in your numbers and your reports are done instantly.
                                </p>
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-slate-900 font-bold">From $29</span>
                                </div>
                                <Button asChild variant="outline" className="w-full border-slate-300 text-slate-800 hover:bg-slate-50 font-bold py-6">
                                    <Link to="/business-templates">Browse Templates <ArrowRight className="ml-2 w-4 h-4" /></Link>
                                </Button>
                            </motion.div>
                        </div>
                    </div>
                </section>

                <ServicesComparison />
                <ServicesPricingGrid />
                <ServicesClientStories />
                
                <section className="py-24 bg-slate-50 border-t border-slate-300">
                    <div className="container mx-auto px-4">
                        <NewsletterSignup />
                    </div>
                </section>

                <ServicesFinalCTA />
            </main>
        </div>
    );
};

export default Services;