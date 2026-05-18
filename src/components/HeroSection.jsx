import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, ExternalLink, TrendingUp, Zap, Clock, BarChart3 } from 'lucide-react';
import { Link } from 'react-router-dom';

const AnimatedCounter = ({ end, suffix = "", duration = 2 }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (isInView) {
      let startTime;
      const animate = (time) => {
        if (!startTime) startTime = time;
        const progress = Math.min((time - startTime) / (duration * 1000), 1);
        setCount(Math.floor(progress * end));
        if (progress < 1) requestAnimationFrame(animate);
      };
      requestAnimationFrame(animate);
    }
  }, [isInView, end, duration]);

  return <span ref={ref}>{count}{suffix}</span>;
};

const HeroSection = ({ 
  headline, 
  subheadline, 
  primaryCtaText = "Book a Demo", 
  primaryCtaLink = "/book-demo",
  secondaryCtaText = "Try OMIS Now",
  secondaryCtaLink = "https://omis-crm.com/",
  backgroundImage = "https://images.unsplash.com/photo-1516383274235-5f42d6c6426d?auto=format&fit=crop&q=80&w=2000",
  showDashboardPreview = false,
  dashboardImage = "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=2000",
  minHeight = "min-h-[85vh]"
}) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });
  
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const stats = [
    { icon: <TrendingUp className="w-5 h-5" />, value: 40, suffix: "%", label: "Up to", mainLabel: "Potential Lift*" },
    { icon: <Zap className="w-5 h-5" />, value: 10, suffix: "x", label: "Up to", mainLabel: "Faster Reporting*" },
    { icon: <Clock className="w-5 h-5" />, value: 8, suffix: " hrs", label: "Up to", mainLabel: "Saved Weekly*" },
    { icon: <BarChart3 className="w-5 h-5" />, value: 3, suffix: "", label: "", mainLabel: "Simple Steps" },
  ];

  return (
    <motion.section 
      ref={ref} 
      style={{ opacity }}
      className={`relative ${minHeight} flex items-center justify-center overflow-hidden bg-[#F0F9FF] pt-28 pb-24 border-b border-blue-200 shadow-sm`}
    >
       {/* Background Effects */}
       <div className="absolute inset-0 z-0 overflow-hidden">
          <motion.div style={{ y }} className="absolute inset-0">
             {/* Grid Pattern */}
             <div className="absolute inset-0 bg-[linear-gradient(rgba(0,102,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,102,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_10%,transparent_100%)]" />
             <div className="absolute inset-0 bg-gradient-to-br from-[#F0F9FF]/90 to-[#E0F2FE]/90 z-10 backdrop-blur-[1px]" />
             
             {/* Particles */}
             {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{
                    y: [0, -20, 0],
                    x: [0, Math.random() * 20 - 10, 0],
                    opacity: [0.3, 0.6, 0.3],
                  }}
                  transition={{
                    duration: 4 + Math.random() * 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: i * 0.5,
                  }}
                  className={`absolute rounded-full bg-blue-400 blur-xl pointer-events-none z-10`}
                  style={{
                    width: Math.random() * 100 + 50,
                    height: Math.random() * 100 + 50,
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                />
             ))}
             
             <img 
               src={backgroundImage} 
               alt="Background" 
               className="absolute inset-0 w-full h-full object-cover opacity-10 grayscale mix-blend-multiply pointer-events-none z-0"
             />
          </motion.div>
       </div>

       {/* Bottom Fade */}
       <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent z-10" />

      <div className="container mx-auto px-4 relative z-20 text-center">
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-5xl mx-auto"
        >
            <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1 }}
                className="text-4xl md:text-6xl lg:text-7xl font-bold text-slate-900 mb-6 leading-tight tracking-tight drop-shadow-sm"
            >
                {headline}
            </motion.h1>
            
            <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="text-lg md:text-2xl text-slate-800 mb-10 max-w-3xl mx-auto leading-relaxed font-semibold drop-shadow-sm"
            >
                {subheadline}
            </motion.p>
            
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
            >
                 <Button 
                    asChild 
                    size="lg" 
                    className="bg-blue-700 hover:bg-blue-800 text-white font-bold text-lg px-8 h-14 rounded-full shadow-[0_10px_20px_rgba(0,102,255,0.3)] transition-all hover:scale-105"
                    aria-label={primaryCtaText}
                 >
                     {primaryCtaLink.startsWith('http') ? (
                        <a href={primaryCtaLink} target="_blank" rel="noopener noreferrer">
                            {primaryCtaText} <ExternalLink className="ml-2 w-5 h-5" />
                        </a>
                     ) : (
                        <Link to={primaryCtaLink}>
                            {primaryCtaText} <ArrowRight className="ml-2 w-5 h-5" />
                        </Link>
                     )}
                 </Button>
                 
                 <Button 
                    asChild 
                    size="lg" 
                    variant="outline" 
                    className="border-2 border-slate-300 bg-white/90 backdrop-blur-sm text-slate-900 hover:bg-white hover:text-blue-700 hover:border-blue-400 font-bold text-lg px-8 h-14 rounded-full shadow-sm transition-all hover:scale-105"
                    aria-label={secondaryCtaText}
                 >
                    {secondaryCtaLink.startsWith('http') ? (
                         <a href={secondaryCtaLink} target="_blank" rel="noopener noreferrer">
                            {secondaryCtaText} <ExternalLink className="ml-2 w-5 h-5" />
                        </a>
                    ) : (
                        <Link to={secondaryCtaLink}>
                            {secondaryCtaText} <ArrowRight className="ml-2 w-5 h-5" />
                        </Link>
                    )}
                 </Button>
            </motion.div>

            {/* Animated Stat Cards */}
            <motion.div 
              className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: { staggerChildren: 0.1, delayChildren: 0.7 }
                }
              }}
            >
              {stats.map((stat, idx) => (
                <motion.div 
                  key={idx}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 }
                  }}
                  className="bg-white/80 backdrop-blur-md border border-slate-200 shadow-sm p-4 rounded-2xl flex flex-col items-center justify-center hover:bg-white transition-colors"
                >
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 mb-2">
                    {stat.icon}
                  </div>
                  <div className="text-2xl font-black text-slate-900 mb-1">
                    {stat.label && <span className="text-sm font-bold mr-1">{stat.label}</span>}
                    <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                  </div>
                  <div className="text-xs font-bold text-slate-600 uppercase tracking-wide text-center">
                    {stat.mainLabel}
                  </div>
                </motion.div>
              ))}
            </motion.div>
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5, duration: 0.8 }}
              className="text-xs text-slate-500 mt-6 font-medium leading-relaxed max-w-4xl mx-auto"
            >
              *Up to 40% potential lift based on McKinsey & Company data-driven business research (2019, 2022) and BARC big data studies. Up to 10x faster reporting based on BlackLine 2024 Finance Automation Report. Up to 8 hrs saved weekly based on EasyInsights automation research and PwC finance studies. Results vary by business type and implementation. Individual outcomes are not guaranteed.
            </motion.p>
        </motion.div>
        
        {/* Dashboard Preview Image */}
        {showDashboardPreview && (
            <motion.div
                initial={{ opacity: 0, y: 60 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.9 }}
                className="mt-20 mx-auto max-w-6xl relative perspective-1000 z-30"
            >
                <motion.div 
                    whileHover={{ scale: 1.02, rotateX: 2 }}
                    className="rounded-xl overflow-hidden shadow-[0_20px_50px_rgba(0,102,255,0.2)] border-2 border-slate-200 bg-white relative group transition-transform duration-500"
                >
                    <img 
                        src={dashboardImage} 
                        alt="OMIS Dashboard Interface" 
                        className="w-full h-auto opacity-100 transition-opacity duration-500"
                    />
                </motion.div>
            </motion.div>
        )}
      </div>
    </motion.section>
  );
};

export default HeroSection;
