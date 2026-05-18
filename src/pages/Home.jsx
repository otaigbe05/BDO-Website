import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, BarChart3, TrendingUp, Bell, Target, Award, CheckCircle2 } from 'lucide-react';
import HeroSection from '@/components/HeroSection';
import TrustTicker from '@/components/TrustTicker';
import NewsletterSignup from '@/components/NewsletterSignup';

const Home = () => {
    const siteUrl = "https://www.bdoanalyticssolutions.com";

    const fadeInUp = {
        initial: { opacity: 0, y: 20 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true },
        transition: { duration: 0.6, ease: "easeOut" }
    };

    const features = [
        { 
            icon: <BarChart3 className="w-8 h-8" />, 
            title: "Live Dashboards", 
            desc: "Real-time visual insights tailored to your business",
            glowColor: "from-blue-500/10 via-transparent to-transparent",
            iconColor: "text-blue-700",
            iconBg: "bg-blue-50",
            iconBorder: "border-blue-200",
            hoverIconBg: "group-hover:bg-blue-600 group-hover:text-white",
            hoverBorder: "group-hover:border-blue-400",
            linkColor: "text-blue-700 hover:text-blue-800"
        },
        { 
            icon: <TrendingUp className="w-8 h-8" />, 
            title: "Smart Forecasting", 
            desc: "Predict trends and plan ahead with confidence",
            glowColor: "from-emerald-500/10 via-transparent to-transparent",
            iconColor: "text-emerald-700",
            iconBg: "bg-emerald-50",
            iconBorder: "border-emerald-200",
            hoverIconBg: "group-hover:bg-emerald-600 group-hover:text-white",
            hoverBorder: "group-hover:border-emerald-400",
            linkColor: "text-emerald-700 hover:text-emerald-800"
        },
        { 
            icon: <Bell className="w-8 h-8" />, 
            title: "Automated Alerts", 
            desc: "Get notified when metrics need your attention",
            glowColor: "from-violet-500/10 via-transparent to-transparent",
            iconColor: "text-violet-700",
            iconBg: "bg-violet-50",
            iconBorder: "border-violet-200",
            hoverIconBg: "group-hover:bg-violet-600 group-hover:text-white",
            hoverBorder: "group-hover:border-violet-400",
            linkColor: "text-violet-700 hover:text-violet-800"
        },
        { 
            icon: <Target className="w-8 h-8" />, 
            title: "Actionable Insights", 
            desc: "Skip the guesswork with clear recommendations",
            glowColor: "from-amber-500/10 via-transparent to-transparent",
            iconColor: "text-amber-700",
            iconBg: "bg-amber-50",
            iconBorder: "border-amber-200",
            hoverIconBg: "group-hover:bg-amber-600 group-hover:text-white",
            hoverBorder: "group-hover:border-amber-400",
            linkColor: "text-amber-700 hover:text-amber-800"
        },
        { 
            icon: <Award className="w-8 h-8" />, 
            title: "Industry Benchmarks", 
            desc: "See how you stack up against competitors",
            glowColor: "from-rose-500/10 via-transparent to-transparent",
            iconColor: "text-rose-700",
            iconBg: "bg-rose-50",
            iconBorder: "border-rose-200",
            hoverIconBg: "group-hover:bg-rose-600 group-hover:text-white",
            hoverBorder: "group-hover:border-rose-400",
            linkColor: "text-rose-700 hover:text-rose-800"
        },
    ];

    return (
        <>
            <Helmet>
                <title>Turn Business Data Into Clear Insights — No CRM Needed | BDO Analytics Solutions</title>
                <meta name="description" content="OMIS analyzes your existing data and gives you dashboards, forecasts, and recommendations instantly. Small business analytics without the CRM complexity." />
                <link rel="canonical" href={siteUrl} />
            </Helmet>

            <div className="bg-white overflow-hidden font-sans">
                <HeroSection 
                    headline={
                        <span>
                            Turn Your Business Data Into Clear, Actionable Insights <br className="hidden md:block" />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-teal-700">
                                — No CRM Needed
                            </span>
                        </span>
                    }
                    subheadline="OMIS transforms your existing data into dashboards, forecasts, and recommendations — without forcing you into a complex CRM system. BDO Analytics Solutions gives small businesses the clarity they need to grow."
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
                            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">Running Without a CRM? You're Not Alone.</h2>
                            <p className="text-xl text-slate-800 font-medium leading-relaxed">
                                Most small businesses don't use CRMs — and that's perfectly fine. But you still need to understand your numbers.
                            </p>
                        </motion.div>

                        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                            {[
                                { title: "Scattered Data", desc: "Sales in one place, expenses in another, customer info in spreadsheets" },
                                { title: "No Clear Picture", desc: "Hard to see trends, predict slow months, or identify your best customers" },
                                { title: "Time Wasted", desc: "Hours spent manually creating reports that are outdated by the time you finish" }
                            ].map((item, i) => (
                                <motion.div 
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                    className="bg-slate-50 p-8 rounded-2xl border border-slate-300"
                                >
                                    <h3 className="text-2xl font-bold text-slate-900 mb-3">{item.title}</h3>
                                    <p className="text-slate-800 font-medium mb-4">{item.desc}</p>
                                    <Link to="/services" className="inline-flex items-center font-bold text-blue-700 hover:text-blue-800 transition-colors group">
                                      Fix this with us <ArrowRight className="ml-1 w-4 h-4 transition-transform group-hover:translate-x-1" />
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="py-24 bg-blue-50/50 border-y border-slate-200">
                    <div className="container mx-auto px-4">
                        <motion.div {...fadeInUp} className="max-w-4xl mx-auto text-center mb-16">
                            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">OMIS: Analytics Made Simple</h2>
                            <p className="text-xl text-slate-800 font-medium leading-relaxed">
                                Connect your data sources and OMIS does the rest. Get professional dashboards, forecasts, and insights — without hiring a data analyst.
                            </p>
                        </motion.div>

                        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                            {[
                                { title: "Quick Setup", desc: "Connect in minutes, fully implemented in weeks. No technical skills required." },
                                { title: "Always Up-to-Date", desc: "Live dashboards refresh automatically. No manual updates." },
                                { title: "Clear Recommendations", desc: "Don't just see numbers — get told what to do next." }
                            ].map((item, i) => (
                                <motion.div 
                                    key={i}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                    className="bg-white p-10 rounded-3xl shadow-lg border border-slate-300 hover:shadow-xl hover:scale-105 hover:border-blue-400 transition-all duration-300 flex flex-col"
                                >
                                    <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 mx-auto border border-blue-200">
                                        <CheckCircle2 className="w-8 h-8 text-blue-700" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-slate-900 mb-4 text-center">{item.title}</h3>
                                    <p className="text-slate-800 font-medium text-center leading-relaxed flex-grow">{item.desc}</p>
                                    <div className="mt-6 text-center">
                                        <Link to="/omis-product" className="inline-flex items-center font-bold text-blue-700 hover:text-blue-800 transition-colors group">
                                          Learn More <ArrowRight className="ml-1 w-4 h-4 transition-transform group-hover:translate-x-1" />
                                        </Link>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="py-24 bg-white border-b border-slate-200 relative">
                    <div className="container mx-auto px-4">
                        <motion.div {...fadeInUp} className="text-center mb-16">
                            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">Everything You Need to Make Smart Decisions</h2>
                        </motion.div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                            {features.map((feature, i) => (
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

                <section className="py-24 bg-slate-50 border-b border-slate-200">
                    <div className="container mx-auto px-4">
                        <NewsletterSignup />
                    </div>
                </section>
            </div>
        </>
    );
};

export default Home;