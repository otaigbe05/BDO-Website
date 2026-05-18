import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

const OmisHero = () => {
  const omisAppLink = "https://omis-crm.com/";

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#F0F9FF] pt-20 border-b border-blue-100 shadow-sm">
       {/* Background Effects */}
       <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#F0F9FF] via-[#E6F4FE] to-[#E0F2FE] z-0 pointer-events-none" />
       <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent z-10" />

      <div className="container mx-auto px-4 relative z-20 text-center">
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-5xl mx-auto"
        >
            <span className="inline-block py-1.5 px-3.5 rounded-full bg-blue-100 border border-blue-200 text-blue-700 text-sm font-semibold mb-6 tracking-wide">
                Now Available for All Industries
            </span>
            <h1 className="text-5xl md:text-7xl font-bold text-slate-900 mb-6 leading-tight tracking-tight">
                OMIS: Instant Business Insights <br className="hidden md:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-600">No CRM Required.</span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-700 mb-10 max-w-3xl mx-auto leading-relaxed font-medium">
                Turn your scattered data into dashboards, forecasts, and recommendations — without changing your workflow.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                 <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg px-8 h-14 rounded-full shadow-lg shadow-blue-200 transition-all hover:scale-105">
                     <a href={omisAppLink} target="_blank" rel="noopener noreferrer">
                        Try OMIS Now <ExternalLink className="ml-2 w-5 h-5" />
                     </a>
                 </Button>
                 <Button asChild size="lg" variant="outline" className="border-blue-200 bg-white/60 text-slate-800 hover:bg-white hover:text-blue-600 font-bold text-lg px-8 h-14 rounded-full transition-all">
                    <Link to="/book-demo">
                        Book a Demo <ArrowRight className="ml-2 w-5 h-5" />
                    </Link>
                 </Button>
            </div>
        </motion.div>
        
        {/* Dashboard Preview Image */}
        <motion.div
             initial={{ opacity: 0, y: 60 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 1, delay: 0.4 }}
             className="mt-16 mx-auto max-w-6xl relative"
        >
            <div className="rounded-xl overflow-hidden shadow-2xl shadow-blue-200/50 border border-blue-100 bg-white">
                <img 
                    src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=2000" 
                    alt="OMIS Dashboard Interface" 
                    className="w-full h-auto opacity-95"
                />
                 {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-white/20 via-transparent to-transparent pointer-events-none" />
            </div>
        </motion.div>
      </div>
    </section>
  );
};
export default OmisHero;