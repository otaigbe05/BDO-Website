import React, { useState, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import Breadcrumbs from '@/components/Breadcrumbs';
import ROICalculatorForm from '@/components/ROICalculatorForm';
import ROICalculatorResults from '@/components/ROICalculatorResults';
import ROICalculatorEmail from '@/components/ROICalculatorEmail';
import { calculateAllMetrics } from '@/lib/roiCalculatorLogic';

const ROICalculator = () => {
  const [results, setResults] = useState(null);
  const [currentInputs, setCurrentInputs] = useState(null);
  const resultsRef = useRef(null);

  const handleCalculate = (inputs) => {
    const calculatedResults = calculateAllMetrics(inputs);
    setCurrentInputs(inputs);
    setResults(calculatedResults);
    
    // Smooth scroll to results
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  return (
    <div className="bg-white min-h-screen font-sans">
      <Helmet>
        <title>OMIS ROI Calculator - BDO Analytics Solutions</title>
        <meta name="description" content="Calculate your potential return on investment, time saved, and cost reduction by switching from manual reporting to the OMIS analytics platform." />
        <link rel="canonical" href="https://www.bdoanalyticssolutions.com/roi-calculator" />
      </Helmet>

      <Breadcrumbs />

      {/* Hero Section with New Gradient Styling */}
      <section className="relative pt-24 pb-32 overflow-hidden bg-[#F0F9FF] border-b border-blue-100 shadow-sm">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-[#F0F9FF] to-[#E0F2FE]" />
          <img 
            src="https://images.unsplash.com/photo-1516383274235-5f42d6c6426d?auto=format&fit=crop&q=80&w=2000" 
            alt="Business Analytics Graph Background" 
            className="w-full h-full object-cover opacity-5 grayscale"
          />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto text-center"
          >
            <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 mb-6 tracking-tight">
              OMIS <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-600">ROI Calculator</span>
            </h1>
            <p className="text-xl text-slate-700 leading-relaxed font-semibold">
              Stop guessing. See exactly how much time and money you could save by automating your business intelligence with OMIS.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content with clean white background */}
      <section className="py-16 px-4 bg-white relative z-20">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Form */}
            <div className="lg:col-span-5 w-full">
              <ROICalculatorForm onCalculate={handleCalculate} />
            </div>

            {/* Right Column: Results */}
            <div className="lg:col-span-7 w-full" ref={resultsRef}>
              {results ? (
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <ROICalculatorResults results={results} inputs={currentInputs} />
                  <ROICalculatorEmail results={results} inputs={currentInputs} />
                </motion.div>
              ) : (
                <div className="h-full min-h-[400px] bg-white rounded-2xl border border-dashed border-slate-300 flex flex-col items-center justify-center p-8 text-center shadow-sm">
                  <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6">
                    <img src="https://cdn-icons-png.flaticon.com/512/3204/3204368.png" alt="Calculate" className="w-10 h-10 opacity-50" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-800 mb-3">Your Results Will Appear Here</h3>
                  <p className="text-slate-500 max-w-sm">
                    Enter your business metrics in the form and click "See Your Savings" to generate your personalized ROI report.
                  </p>
                </div>
              )}
            </div>
            
          </div>
        </div>
      </section>
    </div>
  );
};

export default ROICalculator;