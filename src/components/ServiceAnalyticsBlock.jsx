import React from 'react';
import { motion } from 'framer-motion';
import { BarChart3 } from 'lucide-react';
import ServicesDashboardMockup from './ServicesDashboardMockup';
import ServicePathFeatureList from './ServicePathFeatureList';

const ServiceAnalyticsBlock = () => {
  const features = [
    "Data Audit & Cleaning",
    "Custom Dashboard Design",
    "Automated Reporting",
    "Goal Tracking"
  ];

  return (
    <section className="py-24 bg-white border-b border-slate-300 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-16 items-start">
          
          {/* Content Left using generic component */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:w-1/3 flex-shrink-0"
          >
            <ServicePathFeatureList 
              icon={BarChart3}
              pathName="Analytics Path"
              title="Power BI Analytics Services"
              description="For businesses with existing data in SQL, Excel, or legacy tools. We transform raw information into interactive dashboards that tell a story."
              features={features}
              price="$199"
              pricePeriod="/mo"
              ctaLabel="Get Started"
              ctaLink="/book-demo"
              themeColor="blue"
            />
          </motion.div>

          {/* Visualization Right */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="lg:w-2/3 w-full"
          >
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-300 to-cyan-300 rounded-2xl opacity-50 group-hover:opacity-70 blur transition duration-500"></div>
              <ServicesDashboardMockup className="rounded-xl bg-white border-2 border-slate-300 relative z-10 shadow-xl" />
            </div>
            <p className="text-center mt-6 text-slate-800 font-bold text-sm">
              Sample data shown for demonstration purposes
            </p>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default ServiceAnalyticsBlock;