import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Mail, Clock, Ban, UserX, RefreshCw, AlertTriangle, ArrowRight } from 'lucide-react';
import Breadcrumbs from '@/components/Breadcrumbs';

const AccountDeletionRequest = () => {
  const siteUrl = "https://www.bdoanalyticssolutions.com/account-deletion-request";

  const steps = [
    {
      icon: Clock,
      title: "30-Day Grace Period",
      description: "Once your request is received, your account will be placed into a mandatory 30-day grace period to prevent accidental data loss.",
      color: "text-blue-600",
      bg: "bg-blue-50",
      border: "border-blue-100"
    },
    {
      icon: Ban,
      title: "Subscription Cancellation",
      description: "During this period, your active subscription will be immediately canceled, and your account will become inaccessible to new logins.",
      color: "text-red-600",
      bg: "bg-red-50",
      border: "border-red-100"
    },
    {
      icon: UserX,
      title: "Permanent Anonymization",
      description: "After 30 days, your personal data will be permanently anonymized. Business data may be retained for legal compliance but will be disassociated from your identity.",
      color: "text-teal-600",
      bg: "bg-teal-50",
      border: "border-teal-100"
    },
    {
      icon: RefreshCw,
      title: "Account Restoration",
      description: "If you submitted the request by mistake, you may contact us within the 30-day grace period to restore your full account access and data.",
      color: "text-amber-600",
      bg: "bg-amber-50",
      border: "border-amber-100"
    }
  ];

  return (
    <div className="bg-white min-h-screen text-slate-900 font-sans">
      <Helmet>
        <title>Account Deletion Request | OMIS Platform</title>
        <meta name="description" content="Submit a request to delete your OMIS account and associated data. Learn about our data retention and deletion process." />
        <link rel="canonical" href={siteUrl} />
      </Helmet>

      <Breadcrumbs />

      {/* Hero Section with New Gradient Styling */}
      <section className="bg-[#F0F9FF] border-b border-blue-100 shadow-sm overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-br from-[#F0F9FF] to-[#E0F2FE]" />
          
          <main className="container mx-auto px-4 py-20 relative z-10 text-center">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-4xl mx-auto"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-100 border border-red-200 text-red-600 text-sm font-semibold mb-6">
                <AlertTriangle className="w-4 h-4" /> Data Privacy & Control
              </div>
              <h1 className="text-4xl md:text-6xl font-extrabold mb-6 text-slate-900 leading-tight tracking-tight">
                OMIS Account <span className="text-blue-600">Deletion Request</span>
              </h1>
              <p className="text-slate-700 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed font-semibold">
                We value your privacy and right to be forgotten. If you wish to delete your account, please review the process below.
              </p>
            </motion.div>
          </main>
      </section>

      {/* Main Content Area */}
      <main className="container mx-auto px-4 py-16 max-w-5xl">
        {/* Instructions Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="bg-white border border-slate-200 rounded-2xl p-8 md:p-10 mb-16 shadow-xl relative overflow-hidden group"
        >
          <div className="relative z-10 flex flex-col md:flex-row gap-8 items-start md:items-center justify-between">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-slate-900">How to Submit a Request</h2>
              <p className="text-slate-600 font-medium">
                To initiate the deletion process, please send an email from your registered email address.
              </p>
              <div className="flex items-center gap-2 text-blue-600 font-bold text-lg">
                <Mail className="w-6 h-6" />
                <span>info@bdoanalytics.com</span>
              </div>
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 font-mono text-sm text-slate-700">
                Subject: Account Deletion Request - [Your Username]
              </div>
            </div>
            
            <a 
              href="mailto:info@bdoanalytics.com?subject=Account Deletion Request"
              className="bg-blue-600 text-white font-bold py-4 px-8 rounded-full hover:bg-blue-700 transition-all transform hover:scale-105 shadow-lg shadow-blue-200 flex items-center gap-2 whitespace-nowrap"
            >
              Send Request <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </motion.div>

        {/* Detail Steps Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-20">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className={`p-8 rounded-2xl border ${step.border} ${step.bg} hover:shadow-md transition-all duration-300`}
              >
                <div className={`w-12 h-12 rounded-xl bg-white border ${step.border} flex items-center justify-center mb-6 shadow-sm`}>
                  <Icon className={`w-6 h-6 ${step.color}`} />
                </div>
                <h3 className={`text-xl font-bold mb-3 ${step.color}`}>{step.title}</h3>
                <p className="text-slate-700 leading-relaxed font-medium">
                  {step.description}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* Footer Text */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center border-t border-slate-100 pt-12"
        >
          <p className="text-slate-400 text-sm uppercase tracking-widest font-bold">
            BDO Analytics Solutions — OMIS Platform
          </p>
        </motion.div>
      </main>
    </div>
  );
};

export default AccountDeletionRequest;