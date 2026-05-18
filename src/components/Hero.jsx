import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const Hero = () => {
  return (
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden bg-[#F0F9FF] pt-20 pb-20 border-b border-blue-100 shadow-sm">
       <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-[#F0F9FF] to-[#E0F2FE]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(59,130,246,0.05),_transparent)]" />
       </div>

      <div className="container mx-auto px-4 relative z-10 text-center">
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto"
        >
            <h1 className="text-5xl md:text-7xl font-bold text-slate-900 mb-6 leading-tight tracking-tight">
                Unlock Your <span className="text-blue-600">Business Data</span>
            </h1>
            <p className="text-xl text-slate-700 mb-10 max-w-2xl mx-auto leading-relaxed font-medium">
                Advanced analytics and automated reporting for small businesses. See the big picture without the technical overhead.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                 <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg px-8 h-14 rounded-full shadow-lg">
                    <Link to="/book-demo">Get Started <ArrowRight className="ml-2 w-5 h-5" /></Link>
                 </Button>
            </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;