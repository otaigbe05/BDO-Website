import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Home, Phone } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-slate-50 relative overflow-hidden font-sans px-4">
      <Helmet>
        <title>404 - Page Not Found | BDO Analytics Solutions</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      {/* Animated Background Elements */}
      <motion.div 
        animate={{ rotate: 360 }} 
        transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
        className="absolute top-[-10%] right-[-5%] w-[40rem] h-[40rem] bg-blue-100 rounded-full blur-3xl opacity-50 pointer-events-none"
      />
      <motion.div 
        animate={{ rotate: -360 }} 
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-[-10%] left-[-5%] w-[30rem] h-[30rem] bg-indigo-100 rounded-full blur-3xl opacity-50 pointer-events-none"
      />

      <div className="relative z-10 text-center max-w-2xl mx-auto">
        <motion.h1 
          initial={{ opacity: 0, scale: 0.5, y: -50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, type: "spring", bounce: 0.5 }}
          className="text-8xl md:text-9xl font-extrabold text-slate-900 tracking-tight mb-4 drop-shadow-sm"
        >
          404
        </motion.h1>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Page Not Found</h2>
          <p className="text-lg text-slate-700 font-medium mb-10 leading-relaxed">
            Oops! The page you're looking for seems to have gone missing or never existed. 
            Let's get you back on track to exploring our analytics solutions.
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <Button asChild size="lg" className="w-full sm:w-auto bg-blue-700 hover:bg-blue-800 text-white font-bold h-14 px-8 rounded-full shadow-md transition-all hover:scale-105">
            <Link to="/">
              <Home className="mr-2 w-5 h-5" /> Go Home
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="w-full sm:w-auto border-2 border-slate-300 text-slate-900 hover:bg-slate-100 font-bold h-14 px-8 rounded-full transition-all hover:scale-105">
            <Link to="/contact">
              <Phone className="mr-2 w-5 h-5" /> Contact Us
            </Link>
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFoundPage;