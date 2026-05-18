import React from 'react';
import { motion } from 'framer-motion';
import { Settings, Users, Database, LayoutTemplate } from 'lucide-react';
import ServicePathFeatureList from './ServicePathFeatureList';

const ServiceOmisBlock = () => {
  const features = [
    "System Setup & Configuration",
    "Data Migration from Legacy Tools",
    "Comprehensive Staff Training",
    "Ongoing Technical Support"
  ];

  const gridItems = [
    { icon: <Database className="w-7 h-7" />, title: "Centralized Data", desc: "One source of truth for all clients." },
    { icon: <Users className="w-7 h-7" />, title: "Team Management", desc: "Assign roles and track performance." },
    { icon: <LayoutTemplate className="w-7 h-7" />, title: "Custom Workflows", desc: "Processes that match your business." },
    { icon: <Settings className="w-7 h-7" />, title: "Automation", desc: "Reduce manual data entry errors." },
  ];

  return (
    <section className="py-24 bg-slate-50 border-b border-slate-300 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row-reverse gap-16 items-start">
          
          {/* Content Right (displayed left on mobile due to reverse flex) using generic component */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:w-1/3 flex-shrink-0"
          >
             <ServicePathFeatureList 
              icon={Settings}
              pathName="Implementation Path"
              title="OMIS Implementation Services"
              description="Most businesses are fully set up in 2–4 weeks. We don't just hand you a login — we guide your team from Day 1 to ensure full adoption."
              features={features}
              price="$499"
              pricePeriod=" one-time"
              ctaLabel="Start Implementation"
              ctaLink="/book-demo"
              themeColor="teal"
            />
          </motion.div>

          {/* Visualization Left (Grid) */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="lg:w-2/3 w-full"
          >
            <div className="grid sm:grid-cols-2 gap-6">
               {gridItems.map((item, index) => (
                 <motion.div 
                   key={index}
                   whileHover={{ scale: 1.02, backgroundColor: "#ffffff", borderColor: "#0d9488" }}
                   className="bg-white border-2 border-slate-300 shadow-md hover:shadow-xl p-8 rounded-2xl flex flex-col justify-center min-h-[220px] group transition-all duration-300"
                 >
                   <div className="w-14 h-14 rounded-xl bg-teal-50 border-2 border-teal-200 text-teal-800 flex items-center justify-center mb-5 group-hover:bg-teal-700 group-hover:text-white transition-colors duration-300 shadow-sm">
                     {item.icon}
                   </div>
                   <h3 className="text-xl font-extrabold text-slate-900 mb-3">{item.title}</h3>
                   <p className="text-slate-900 font-bold leading-relaxed">{item.desc}</p>
                 </motion.div>
               ))}
            </div>
            
            {/* Context Image Overlay */}
            <div className="mt-8 relative rounded-2xl overflow-hidden h-72 border-2 border-slate-300 group shadow-lg">
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent z-10"></div>
                <img 
                    src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1200" 
                    alt="Team working on implementation" 
                    className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute bottom-8 left-8 z-20">
                    <p className="text-white font-extrabold text-2xl drop-shadow-md mb-2">Guided Setup Process</p>
                    <p className="text-teal-200 font-bold text-lg drop-shadow-md">We handle the heavy lifting</p>
                </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default ServiceOmisBlock;