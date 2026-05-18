import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

const ServicesHero = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });
  
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section ref={ref} className="relative min-h-[85vh] flex items-center justify-center overflow-hidden bg-[#F0F9FF] py-20 px-8 border-b border-blue-200 shadow-sm">
       {/* Background Image with Gradient Overlay */}
       <div className="absolute inset-0 z-0 overflow-hidden">
          <motion.div style={{ y, opacity }} className="absolute inset-0">
             <div className="absolute inset-0 bg-gradient-to-br from-[#F0F9FF]/90 via-[#E0F2FE]/95 to-[#DBEAFE] z-10" />
             <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent z-10" />
             <img 
               src="https://images.unsplash.com/photo-1686061592689-312bbfb5c055?auto=format&fit=crop&q=80&w=2000" 
               alt="Data Analytics Background" 
               className="w-full h-full object-cover opacity-10 grayscale"
             />
          </motion.div>
       </div>

      <div className="container mx-auto relative z-20 text-center">
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-5xl mx-auto"
        >
            <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-5xl sm:text-6xl md:text-8xl font-extrabold text-slate-900 mb-8 leading-tight tracking-tight drop-shadow-sm"
            >
                Data Analytics Services <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-teal-700">Built for Your Business</span>
            </motion.h1>
            
            <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-xl md:text-2xl text-slate-900 mb-12 max-w-4xl mx-auto leading-relaxed font-bold drop-shadow-sm"
            >
                Two service paths designed to meet you where you are: <span className="text-blue-800 font-extrabold">Advanced Analytics</span> for businesses with data, and <span className="text-teal-800 font-extrabold">Operational Systems</span> for those who need structure.
            </motion.p>
            
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="flex flex-col sm:flex-row gap-6 justify-center items-center"
            >
                 <Button 
                    asChild 
                    size="lg" 
                    className="bg-blue-700 hover:bg-blue-800 text-white font-bold text-xl px-10 h-16 rounded-full shadow-lg shadow-blue-200 transition-all hover:scale-105"
                 >
                    <Link to="/book-demo">
                        Book a Demo <ArrowRight className="ml-2 w-6 h-6 stroke-[2.5]" />
                    </Link>
                 </Button>
                 
                 <Button 
                    asChild 
                    size="lg" 
                    variant="outline" 
                    className="border-2 border-slate-300 text-slate-900 hover:bg-white/90 hover:text-blue-700 hover:border-blue-400 font-bold text-xl px-10 h-16 rounded-full transition-all hover:scale-105 backdrop-blur-md bg-white/70"
                 >
                     <a href="https://omis-crm.com/" target="_blank" rel="noopener noreferrer">
                        Try OMIS Now <ExternalLink className="ml-2 w-6 h-6 stroke-[2.5]" />
                    </a>
                 </Button>
            </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default ServicesHero;