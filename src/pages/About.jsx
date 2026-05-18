import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Lightbulb, 
  Zap, 
  Shield, 
  TrendingUp, 
  CheckCircle2, 
  BarChart2, 
  ArrowRight,
  Database,
  LineChart,
  Target
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Breadcrumbs from '@/components/Breadcrumbs';

const About = () => {
  const siteUrl = "https://www.bdoanalyticssolutions.com/about";

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  return (
    <div className="bg-slate-50 font-sans min-h-screen">
      <Helmet>
        <title>About Us | BDO Analytics Solutions | Democratizing Data</title>
        <meta name="description" content="Learn about BDO Analytics Solutions, our mission to democratize data intelligence for small businesses, and the core values behind the OMIS platform." />
        <link rel="canonical" href={siteUrl} />
      </Helmet>

      <div className="bg-white border-b border-slate-200">
        <Breadcrumbs />
      </div>

      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden bg-white border-b border-slate-200">
        <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#0066FF 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>
        <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-[800px] h-[800px] bg-blue-50 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-blue-700 font-bold text-sm mb-6 shadow-sm">
              <BarChart2 className="w-4 h-4" />
              <span>BDO Analytics Solutions</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight mb-8 leading-tight">
              Democratizing Data Intelligence for <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-indigo-600">Every Business</span>
            </h1>
            <p className="text-xl text-slate-700 font-medium leading-relaxed max-w-3xl mx-auto">
              We bridge the gap between complex raw data and strategic decisions. Our mission is to bring enterprise-level clarity to growing businesses without the enterprise-level complexity.
            </p>
          </motion.div>
        </div>
      </section>

      {/* About Intro */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="space-y-6"
          >
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Our Story & Mission</h2>
            <div className="w-20 h-1.5 bg-blue-600 rounded-full mb-8"></div>
            <p className="text-lg text-slate-700 font-medium leading-relaxed">
              Founded on the belief that every business owner deserves absolute clarity, BDO Analytics Solutions was built to eliminate the guesswork from daily operations. Too often, small and medium businesses are forced to choose between overly simplistic reporting or bloated, expensive enterprise software.
            </p>
            <p className="text-lg text-slate-700 font-medium leading-relaxed">
              We exist to provide a third option: powerful, automated, and practical data intelligence. Through our flagship platform, OMIS, and our dedicated analytics consulting, we transform fragmented spreadsheets and siloed software into a unified command center.
            </p>
          </motion.div>
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-100 to-purple-50 rounded-3xl transform rotate-3 scale-105 opacity-50"></div>
            <div className="relative bg-white p-8 rounded-3xl shadow-xl border border-slate-200 aspect-square flex flex-col justify-center items-center text-center">
              <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mb-6 border-8 border-white shadow-lg">
                <Target className="w-10 h-10 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Our Vision</h3>
              <p className="text-slate-600 font-medium text-lg">
                A business landscape where decisions are driven by undeniable facts, and operational efficiency is accessible to teams of all sizes.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* What We Stand For */}
      <section className="py-24 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 tracking-tight">What We Stand For</h2>
            <p className="text-lg text-slate-600 font-medium max-w-2xl mx-auto">The four pillars that guide our platform development and client partnerships.</p>
          </div>

          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {[
              {
                icon: Lightbulb,
                title: "Practical Intelligence",
                desc: "We focus on actionable insights, not just vanity metrics. If a data point doesn't help you make a better decision, it's just noise.",
                color: "text-amber-600",
                bg: "bg-amber-50",
                border: "border-amber-200"
              },
              {
                icon: Zap,
                title: "Simplicity With Depth",
                desc: "Intuitive, clean interfaces powered by robust, enterprise-grade data models beneath the surface.",
                color: "text-blue-600",
                bg: "bg-blue-50",
                border: "border-blue-200"
              },
              {
                icon: Shield,
                title: "Consistency & Trust",
                desc: "Reliable, accurate reporting that you can base your biggest financial and operational decisions on.",
                color: "text-emerald-600",
                bg: "bg-emerald-50",
                border: "border-emerald-200"
              },
              {
                icon: TrendingUp,
                title: "Scalability From Day One",
                desc: "Systems designed to grow seamlessly alongside your business, accommodating more data without breaking.",
                color: "text-purple-600",
                bg: "bg-purple-50",
                border: "border-purple-200"
              }
            ].map((pillar, idx) => (
              <motion.div 
                key={idx}
                variants={fadeInUp}
                whileHover={{ y: -5 }}
                className="bg-white p-8 rounded-3xl shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-300 relative overflow-hidden group"
              >
                <div className={`absolute top-0 right-0 w-32 h-32 ${pillar.bg} rounded-bl-full -mr-16 -mt-16 transition-transform group-hover:scale-110 z-0`}></div>
                <div className="relative z-10">
                  <div className={`w-14 h-14 ${pillar.bg} ${pillar.border} border rounded-2xl flex items-center justify-center mb-6 shadow-sm`}>
                    <pillar.icon className={`w-7 h-7 ${pillar.color}`} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">{pillar.title}</h3>
                  <p className="text-slate-600 font-medium leading-relaxed">{pillar.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Why OMIS? */}
      <section className="py-24 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6 tracking-tight">Why OMIS?</h2>
              <p className="text-lg text-slate-300 font-medium mb-8 leading-relaxed">
                The Operational Management Information System (OMIS) was built specifically to solve the data fragmentation problem. It's not just a dashboard; it's a dedicated analytics layer for your business.
              </p>
              <ul className="space-y-6">
                {[
                  "Automated Data Pipelines: Say goodbye to manual Excel exports.",
                  "No CRM Bloat: We focus purely on analytics, avoiding the clunkiness of trying to be a CRM.",
                  "Customized KPI Tracking: Track what actually matters to your specific industry.",
                  "Rapid Implementation: Get up and running in days, not months."
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start gap-4">
                    <CheckCircle2 className="w-6 h-6 text-blue-400 shrink-0 mt-0.5" />
                    <span className="text-slate-200 font-medium text-lg">{item}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-10">
                <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg shadow-blue-900/50">
                  <Link to="/omis-product">Explore OMIS Features <ArrowRight className="ml-2 w-5 h-5" /></Link>
                </Button>
              </div>
            </motion.div>
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              className="relative"
            >
              <div className="bg-slate-800 border border-slate-700 p-8 rounded-3xl shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
                <div className="flex items-center gap-4 mb-8 pb-8 border-b border-slate-700">
                  <div className="w-12 h-12 bg-blue-900/50 rounded-xl flex items-center justify-center">
                    <Database className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-white">Your Data Source</h4>
                    <p className="text-sm text-slate-400">POS, ERP, Spreadsheets</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-emerald-900/50 rounded-xl flex items-center justify-center">
                    <LineChart className="w-6 h-6 text-emerald-400" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-white">OMIS Output</h4>
                    <p className="text-sm text-slate-400">Clear, Live Dashboards</p>
                  </div>
                </div>
                <div className="absolute top-1/2 right-8 -translate-y-1/2 opacity-10">
                  <BarChart2 className="w-48 h-48 text-white" />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Our Approach */}
      <section className="py-24 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 tracking-tight">Our Approach</h2>
            <p className="text-lg text-slate-600 font-medium max-w-2xl mx-auto">We don't just hand you software. We partner with you to transform your operations.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: "01", title: "Audit & Clean", desc: "We identify where your data lives, assess its quality, and clean historical inaccuracies to establish a single source of truth." },
              { step: "02", title: "Model & Connect", desc: "We build secure, automated pipelines connecting your existing tools directly to our robust data warehouse." },
              { step: "03", title: "Visualize & Automate", desc: "We deploy OMIS dashboards tailored to your KPIs, ensuring your team has real-time insights without manual updates." }
            ].map((item, idx) => (
              <motion.div 
                key={idx}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeInUp}
                className="bg-white p-8 rounded-3xl shadow-md border border-slate-200 relative"
              >
                <span className="absolute top-6 right-8 text-6xl font-extrabold text-slate-100">{item.step}</span>
                <h3 className="text-2xl font-bold text-slate-900 mb-4 relative z-10">{item.title}</h3>
                <p className="text-slate-600 font-medium relative z-10 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Looking Ahead & Commitment */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              className="p-10 rounded-3xl bg-blue-50 border border-blue-100"
            >
              <h3 className="text-2xl font-bold text-slate-900 mb-4 tracking-tight">Looking Ahead</h3>
              <p className="text-slate-700 font-medium leading-relaxed">
                As the business landscape evolves, so do we. We are constantly expanding OMIS integrations, exploring predictive analytics, and refining our models to ensure our clients stay ahead of the curve. Our roadmap is driven directly by the real-world needs of the business owners we serve.
              </p>
            </motion.div>
            
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              className="p-10 rounded-3xl bg-indigo-50 border border-indigo-100"
            >
              <h3 className="text-2xl font-bold text-slate-900 mb-4 tracking-tight">Our Commitment</h3>
              <p className="text-slate-700 font-medium leading-relaxed">
                We measure our success entirely by yours. If our dashboards don't save you time, increase your margins, or provide critical clarity, we haven't done our job. We are committed to being a true partner in your operational growth.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Final CTA - Enhanced Contrast and Readability */}
      <section className="py-24 bg-slate-900 text-white text-center relative overflow-hidden">
        {/* Semi-transparent dark overlay for background depth */}
        <div className="absolute inset-0 bg-black/30 z-0"></div>
        {/* Subtle pattern with lower opacity */}
        <div className="absolute inset-0 bg-blue-900/10 z-0"></div>
        
        <div className="max-w-4xl mx-auto px-4 relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h2 className="text-3xl md:text-5xl font-extrabold mb-6 tracking-tight text-white">
              Ready to see OMIS in action?
            </h2>
            <p className="text-lg md:text-xl text-slate-200 font-medium mb-10 max-w-2xl mx-auto leading-relaxed">
              Stop guessing and start knowing. Book a free consultation today to see how we can transform your reporting.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
              <Button asChild size="lg" className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white font-bold text-lg px-10 py-7 rounded-xl shadow-2xl shadow-blue-900/50 transition-all duration-300 hover:-translate-y-1 active:scale-95">
                <Link to="/book-demo">Book a Demo</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="w-full sm:w-auto border-0 bg-white hover:bg-slate-100 text-slate-900 font-bold text-lg px-10 py-7 rounded-xl shadow-xl transition-all duration-300 hover:-translate-y-1 active:scale-95">
                <Link to="/omis-product#pricing">View Pricing</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

    </div>
  );
};

export default About;