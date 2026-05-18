import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle, Download, Mail, ArrowRight, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { businessTemplates } from '@/config/businessTemplates';
import { motion, AnimatePresence } from 'framer-motion';

const SuccessPage = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [email, setEmail] = useState('');
  const [isEmailSubmitted, setIsEmailSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    setError('');
    setIsEmailSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-slate-900 py-16 px-4 sm:px-6 lg:px-8 font-sans text-slate-50">
      <Helmet>
        <title>Order Successful | BDO Analytics Solutions</title>
      </Helmet>

      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <motion.div 
            initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', bounce: 0.5 }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-blue-500/20 text-blue-400 mb-6"
          >
            <CheckCircle className="w-10 h-10" />
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4">
            Payment Successful!
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Your transaction has been securely processed. Please verify your email to access your template downloads immediately.
          </p>
        </div>

        <AnimatePresence mode="wait">
          {!isEmailSubmitted ? (
            <motion.div 
              key="email-form"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
              className="bg-slate-800 border border-slate-700 rounded-3xl p-8 md:p-12 shadow-2xl max-w-xl mx-auto"
            >
              <div className="flex items-center gap-3 mb-6 text-slate-300">
                <ShieldCheck className="w-6 h-6 text-blue-400" />
                <h2 className="text-xl font-bold text-white">Secure Download Access</h2>
              </div>
              
              <form onSubmit={handleEmailSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-slate-300">Enter your email to download your templates</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                    <Input 
                      id="email"
                      type="email" 
                      placeholder="Enter the email used for purchase"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 bg-slate-900 border-slate-700 text-white placeholder:text-slate-500 focus-visible:ring-blue-500 h-12 rounded-xl"
                    />
                  </div>
                  {error && <p className="text-red-400 text-sm mt-1">{error}</p>}
                </div>
                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold h-12 rounded-xl shadow-lg shadow-blue-900/50">
                  Get Download Links <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </form>
            </motion.div>
          ) : (
            <motion.div 
              key="downloads"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              <div className="bg-slate-800/50 border border-slate-700 rounded-3xl p-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                  <div>
                    <h2 className="text-2xl font-bold text-white">Your Downloads</h2>
                    <p className="text-slate-400 mt-1">Sent securely to <span className="text-slate-200 font-medium">{email}</span></p>
                  </div>
                  {sessionId && (
                    <div className="text-sm text-slate-400 bg-slate-900/50 px-4 py-2 rounded-lg border border-slate-700">
                      Order ID: <span className="font-mono text-slate-300">{sessionId.slice(-8)}</span>
                    </div>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {businessTemplates.map((template) => (
                    <div key={template.id} className="bg-slate-900 border border-slate-700 rounded-xl p-5 flex items-center justify-between hover:border-blue-500/50 transition-colors group">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-slate-800 rounded-lg flex items-center justify-center text-2xl border border-slate-700">
                          {template.emoji}
                        </div>
                        <div>
                          <h3 className="font-bold text-white group-hover:text-blue-400 transition-colors">{template.name}</h3>
                          <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">{template.description}</p>
                        </div>
                      </div>
                      <Button asChild size="sm" className="ml-4 shrink-0 bg-blue-600 hover:bg-blue-500 text-white shadow-md">
                        {/* Updated to strictly point to the direct excelLink to trigger the download prompt */}
                        <a href={template.excelLink} target="_blank" rel="noopener noreferrer" aria-label={`Download Excel sheet for ${template.name}`}>
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </a>
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="text-center">
                <Button asChild variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white rounded-xl h-12 px-8">
                  <Link to="/">Return to Home</Link>
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default SuccessPage;