import React, { useEffect, useState } from 'react';
import { useSearchParams, Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { CheckCircle, Download, ArrowLeft, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';

const CheckoutSuccessPage = () => {
  const [searchParams] = useSearchParams();
  const [downloading, setDownloading] = useState(false);
  
  const templateName = searchParams.get('template');
  const email = searchParams.get('email');
  const downloadId = searchParams.get('downloadId');

  // If accessed without proper parameters, redirect back
  if (!templateName || !email) {
    return <Navigate to="/business-templates" replace />;
  }

  const handleDownload = () => {
    setDownloading(true);
    // Simulate download delay
    setTimeout(() => {
      setDownloading(false);
      // In a real app, trigger actual file download here
      alert(`Downloading ${templateName}...`);
    }, 1500);
  };

  return (
    <>
      <Helmet>
        <title>Payment Successful | BDO Analytics Solutions</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="min-h-[80vh] bg-slate-50 py-20 px-4 flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-xl w-full bg-white p-10 rounded-3xl shadow-xl border border-slate-200 text-center"
        >
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8"
          >
            <CheckCircle className="w-12 h-12" />
          </motion.div>

          <h1 className="text-3xl font-bold text-slate-900 mb-4">Payment Successful!</h1>
          
          <p className="text-slate-600 mb-8 text-lg">
            Thank you for purchasing the <strong className="text-slate-900">{templateName}</strong>.
          </p>

          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 mb-8 text-left flex items-start">
            <Mail className="w-6 h-6 text-blue-600 mr-4 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-slate-900 mb-1">Receipt & Link Sent</h3>
              <p className="text-slate-600 text-sm">
                We've sent a receipt and a backup download link to <span className="font-medium text-slate-900">{email}</span>.
              </p>
            </div>
          </div>

          <Button 
            onClick={handleDownload}
            disabled={downloading}
            size="lg"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white h-14 text-lg font-bold rounded-xl mb-6 shadow-md"
          >
            {downloading ? "Preparing Download..." : (
              <>
                <Download className="mr-2 h-5 w-5" /> Download Template Now
              </>
            )}
          </Button>

          <Link to="/business-templates" className="inline-flex items-center text-slate-500 hover:text-slate-800 font-medium transition-colors">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Templates
          </Link>
        </motion.div>
      </div>
    </>
  );
};

export default CheckoutSuccessPage;