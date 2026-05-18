import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Shield, Lock, Eye, Server, Globe, UserCheck, Clock, AlertTriangle, RefreshCw, Mail } from 'lucide-react';
import Breadcrumbs from '@/components/Breadcrumbs';

const PrivacyPolicy = () => {
  const siteUrl = "https://www.bdoanalyticssolutions.com/privacy-policy";
  const lastUpdated = "February 16, 2026";

  const sections = [
    {
      id: "collection",
      icon: Eye,
      title: "1. Information We Collect",
      content: (
        <div className="space-y-4 text-slate-600">
          <p>We collect information to provide better services to all our users. The types of information we collect include:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Personal Information:</strong> Name, email address, phone number, and company details provided during account creation or demo booking.</li>
            <li><strong>Usage Data:</strong> Information about how you use our services, such as access times, pages viewed, and IP addresses.</li>
            <li><strong>Device Information:</strong> Hardware model, operating system version, and unique device identifiers.</li>
            <li><strong>Business Data:</strong> Data uploaded to the OMIS platform for processing and analytics purposes.</li>
          </ul>
        </div>
      )
    },
    {
      id: "usage",
      icon: UserCheck,
      title: "2. How We Use Your Information",
      content: (
        <div className="space-y-4 text-slate-600">
          <p>We use the information we collect for the following purposes:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>To provide, maintain, and improve our services, including the OMIS platform and Power BI analytics.</li>
            <li>To process transactions and send related information, including confirmations and invoices.</li>
            <li>To send technical notices, updates, security alerts, and support messages.</li>
            <li>To respond to your comments, questions, and requests.</li>
            <li>To monitor and analyze trends, usage, and activities in connection with our services.</li>
          </ul>
        </div>
      )
    },
    {
      id: "security",
      icon: Lock,
      title: "3. Data Storage & Security",
      content: (
        <div className="space-y-4 text-slate-600">
          <p>We take data security seriously and implement industry-standard measures to protect your information:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Encryption:</strong> All data is encrypted in transit using TLS 1.3 and at rest using AES-256 encryption standards.</li>
            <li><strong>Infrastructure:</strong> Our services are hosted on secure AWS (Amazon Web Services) infrastructure, utilizing virtual private clouds (VPCs) and strict firewall rules.</li>
            <li><strong>Access Control:</strong> We employ strict role-based access controls (RBAC) to ensure that only authorized personnel have access to sensitive data.</li>
            <li><strong>Regular Audits:</strong> We conduct regular security audits and vulnerability assessments to identify and mitigate potential risks.</li>
          </ul>
        </div>
      )
    },
    {
      id: "analytics",
      icon: Server,
      title: "4. Analytics & Reporting",
      content: (
        <div className="space-y-4 text-slate-600">
          <p>
            Our core service involves processing business data to generate analytics and reports. When you use our Power BI consulting or OMIS dashboard services:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>We process your raw data solely for the purpose of creating the agreed-upon visualizations and insights.</li>
            <li>We do not aggregate your proprietary business data with that of other clients.</li>
            <li>Your data remains your property, and we claim no ownership rights over the business intelligence derived from your data.</li>
          </ul>
        </div>
      )
    },
    {
      id: "sharing",
      icon: Globe,
      title: "5. Data Sharing",
      content: (
        <div className="space-y-4 text-slate-600">
          <p>We do not share your personal information with companies, organizations, or individuals outside of BDO Analytics Solutions except in the following cases:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>With Consent:</strong> We will share personal information with companies, organizations, or individuals outside of BDO Analytics Solutions when we have your consent to do so.</li>
            <li><strong>For External Processing:</strong> We provide personal information to our affiliates or other trusted businesses or persons to process it for us, based on our instructions and in compliance with our Privacy Policy and any other appropriate confidentiality and security measures.</li>
            <li><strong>Payment Processing:</strong> We use Stripe for payment processing. Your payment information is securely transmitted directly to Stripe and is not stored on our servers.</li>
            <li><strong>Legal Reasons:</strong> We will share personal information with companies, organizations, or individuals outside of BDO Analytics Solutions if we have a good-faith belief that access, use, preservation, or disclosure of the information is reasonably necessary to meet any applicable law, regulation, legal process, or enforceable governmental request.</li>
          </ul>
        </div>
      )
    },
    {
      id: "rights",
      icon: Shield,
      title: "6. Your Rights & Controls",
      content: (
        <div className="space-y-4 text-slate-600">
          <p>You have certain rights regarding the personal information we hold about you:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Access:</strong> You have the right to request a copy of the information we hold about you.</li>
            <li><strong>Correction:</strong> You have the right to request that we correct any inaccurate or incomplete information.</li>
            <li><strong>Deletion:</strong> You have the right to request that we delete your personal information, subject to certain legal exceptions.</li>
            <li><strong>Opt-Out:</strong> You may opt out of receiving promotional communications from us by following the instructions in those messages.</li>
          </ul>
        </div>
      )
    },
    {
      id: "retention",
      icon: Clock,
      title: "7. Data Retention",
      content: (
        <div className="space-y-4 text-slate-600">
          <p>
            We retain your personal information for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required or permitted by law.
          </p>
          <p>
            Upon termination of your account or service agreement, we will delete or anonymize your data within 90 days, unless we are required to retain it for legal or accounting purposes.
          </p>
        </div>
      )
    },
    {
      id: "children",
      icon: AlertTriangle,
      title: "8. Children's Privacy",
      content: (
        <div className="space-y-4 text-slate-600">
          <p>
            Our services are not intended for individuals under the age of 18. We do not knowingly collect personal information from children under 13. If we become aware that a child under 13 has provided us with personal information, we will take steps to delete such information.
          </p>
          <p>
            We comply with the Children's Online Privacy Protection Act (COPPA).
          </p>
        </div>
      )
    },
    {
      id: "changes",
      icon: RefreshCw,
      title: "9. Changes to This Policy",
      content: (
        <div className="space-y-4 text-slate-600">
          <p>
            We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.
          </p>
          <p>
            You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.
          </p>
        </div>
      )
    },
    {
      id: "contact",
      icon: Mail,
      title: "10. Contact Us",
      content: (
        <div className="space-y-4 text-slate-600">
          <p>If you have any questions about this Privacy Policy, please contact us:</p>
          <ul className="list-none space-y-2">
            <li><strong>Email:</strong> <a href="mailto:info@bdoanalytics.com" className="text-blue-600 hover:underline">info@bdoanalytics.com</a></li>
            <li><strong>Phone:</strong> <a href="tel:+14168485058" className="text-blue-600 hover:underline">+1-416-848-5058</a></li>
            <li><strong>Address:</strong> BDO Analytics Solutions, Toronto, ON, Canada</li>
          </ul>
        </div>
      )
    },
  ];

  return (
    <div className="bg-slate-50 min-h-screen">
      <Helmet>
        <title>Privacy Policy - BDO Analytics Solutions</title>
        <meta name="description" content="Read our Privacy Policy to understand how BDO Analytics Solutions collects, uses, and protects your data." />
        <link rel="canonical" href={siteUrl} />
      </Helmet>

      <Breadcrumbs />

      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6">Privacy Policy</h1>
          <div className="inline-block bg-white px-6 py-2 rounded-full shadow-sm border border-slate-200">
            <span className="text-slate-500 font-medium">Last Updated: <span className="text-slate-900">{lastUpdated}</span></span>
          </div>
        </motion.div>

        <div className="space-y-8">
          {sections.map((section, index) => {
            const Icon = section.icon;
            return (
              <motion.section
                key={section.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow duration-300"
              >
                <div className="flex items-center gap-4 mb-6 border-b border-slate-100 pb-4">
                  <div className="p-3 bg-blue-50 rounded-lg text-blue-600">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-800">{section.title}</h2>
                </div>
                <div className="text-base leading-relaxed">
                  {section.content}
                </div>
              </motion.section>
            );
          })}
        </div>

        <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-16 p-8 bg-blue-900 rounded-2xl text-white text-center shadow-xl"
        >
            <h3 className="text-2xl font-bold mb-4">Questions about your data?</h3>
            <p className="text-blue-200 mb-8 max-w-2xl mx-auto">
                We are committed to transparency. If you have any concerns about how your data is handled, please reach out to our Data Protection Officer directly.
            </p>
            <a href="mailto:info@bdoanalytics.com" className="bg-white text-blue-900 font-bold py-3 px-8 rounded-full hover:bg-blue-50 transition-colors inline-block">
                Contact Privacy Team
            </a>
        </motion.div>
      </main>
    </div>
  );
};

export default PrivacyPolicy;