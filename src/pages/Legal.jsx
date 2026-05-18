import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Shield, Lock, FileText } from 'lucide-react';
import Breadcrumbs from '@/components/Breadcrumbs';

const Legal = () => {
  const siteUrl = "https://www.bdoanalyticssolutions.com/legal";
  const ogImageUrl = `https://www.bdoanalyticssolutions.com/og-image.jpg`;
  
  return (
    <div className="bg-slate-50">
      <Helmet>
        <title>Legal & Privacy | BDO Analytics Solutions</title>
        <meta name="description" content="Review BDO Analytics Solutions' Privacy Policy, Terms of Service, and Data Protection standards. We ensure enterprise-grade security for your business data." />
        <meta name="robots" content="noindex, follow" />
        <link rel="canonical" href={siteUrl} />
        <meta property="og:title" content="Legal & Privacy | BDO Analytics Solutions" />
        <meta property="og:description" content="Review our Privacy Policy, Terms of Service, and our commitment to data security." />
        <meta property="og:url" content={siteUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content={ogImageUrl} />
      </Helmet>

      <Breadcrumbs />

      <div className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-extrabold text-slate-900 mb-12 text-center">Legal & Privacy Center</h1>

        <div className="space-y-8">
            <section className="bg-white p-8 rounded-2xl shadow-lg border border-slate-100" aria-labelledby="privacy-policy">
              <div className="flex items-center gap-4 mb-6">
                <Shield className="w-8 h-8 text-blue-600" aria-hidden="true" />
                <h2 id="privacy-policy" className="text-2xl font-bold text-slate-800">Privacy Policy</h2>
              </div>
              <div className="prose max-w-none">
                <p><strong>Last Updated: November 29, 2025</strong></p>
                <p>
                  At BDO Analytics Solutions, we value your privacy and are committed to protecting your personal and business data. This Privacy Policy explains how we collect, use, and safeguard your information.
                </p>
                <h3>Data Collection</h3>
                <p>
                  We collect information you voluntarily provide, including name, company name, email, and industry. We also collect aggregated, non-personal usage data to improve our platform.
                </p>
                <h3>Data Usage</h3>
                <p>
                  Your data is used solely for providing and improving our services, communicating with you, and complying with legal obligations. We do not sell your data to third parties.
                </p>
              </div>
            </section>

            <section className="bg-white p-8 rounded-2xl shadow-lg border border-slate-100" aria-labelledby="terms-of-service">
              <div className="flex items-center gap-4 mb-6">
                <FileText className="w-8 h-8 text-blue-600" aria-hidden="true" />
                <h2 id="terms-of-service" className="text-2xl font-bold text-slate-800">Terms of Service</h2>
              </div>
              <div className="prose max-w-none">
                <p>
                  By using BDO Analytics Solutions services, you agree to be bound by these Terms. If you disagree with any part, you may not access the service.
                </p>
                <h3>Service License</h3>
                <p>
                  We grant you a limited, non-exclusive license to use our software for your internal business purposes in accordance with this agreement. You may not reverse engineer, decompile, or misuse the software.
                </p>
              </div>
            </section>

            <section className="bg-white p-8 rounded-2xl shadow-lg border border-slate-100" aria-labelledby="security-faq">
              <div className="flex items-center gap-4 mb-6">
                <Lock className="w-8 h-8 text-blue-600" aria-hidden="true" />
                <h2 id="security-faq" className="text-2xl font-bold text-slate-800">Data Security</h2>
              </div>
              <div className="prose max-w-none">
                <p>
                    We employ enterprise-grade security measures including end-to-end encryption, secure cloud infrastructure (SOC2-certified data centers), and strict role-based access controls to protect your data. For industries with specific compliance needs like healthcare (HIPAA), we offer compliant-ready environments.
                </p>
              </div>
            </section>
        </div>
      </div>
    </div>
  );
};

export default Legal;