import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Shield, Lock, Eye, Server, Globe, UserCheck, Clock, AlertTriangle, RefreshCw, Mail, Database, FileCheck } from 'lucide-react';
import Breadcrumbs from '@/components/Breadcrumbs';

const PrivacyPolicy = () => {
  const siteUrl = "https://www.bdoanalyticssolutions.com/privacy-policy";
  const lastUpdated = "May 11, 2026";
  const COMPANY = "BDO Analytics Solutions";
  const EMAIL = "info@bdoanalyticssolutions.com";
  const PHONE = "+1-416-848-5058";

  const sections = [
    {
      id: "intro",
      icon: FileCheck,
      title: "1. Introduction & Scope",
      content: (
        <div className="space-y-4 text-slate-600">
          <p>
            {COMPANY} ("we," "us," or "our") is committed to protecting the privacy and security of your personal and business information. This Privacy Policy applies to all services offered by {COMPANY}, including the OMIS platform (omis-crm.com), our analytics consulting services, Power BI dashboards, and this website (bdoanalyticssolutions.com).
          </p>
          <p>
            By accessing or using any of our services, you acknowledge that you have read, understood, and agree to be bound by this Privacy Policy. If you do not agree, please discontinue use of our services immediately.
          </p>
          <p>
            This policy is governed by the laws of the Province of Ontario and the federal laws of Canada applicable therein, including the <em>Personal Information Protection and Electronic Documents Act</em> (PIPEDA) and applicable provincial privacy legislation.
          </p>
        </div>
      )
    },
    {
      id: "collection",
      icon: Eye,
      title: "2. Information We Collect",
      content: (
        <div className="space-y-4 text-slate-600">
          <p>We collect information to provide better services to all our users. The types of information we collect include:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Account Information:</strong> Name, email address, phone number, business name, and role provided during account creation, demo booking, or contact form submission.</li>
            <li><strong>Business Data:</strong> Data uploaded to the OMIS platform for processing, analytics, scheduling, invoicing, and reporting purposes. This includes client records, appointment data, and operational metrics.</li>
            <li><strong>Usage Data:</strong> Information about how you interact with our services, such as pages viewed, features used, access times, and IP addresses.</li>
            <li><strong>Device Information:</strong> Browser type, operating system, and device identifiers used to access our services.</li>
            <li><strong>Payment Information:</strong> Billing details processed securely through Stripe. We do not store credit card numbers on our servers.</li>
            <li><strong>Communications:</strong> Records of your correspondence with us, including support requests and feedback.</li>
          </ul>
        </div>
      )
    },
    {
      id: "usage",
      icon: UserCheck,
      title: "3. How We Use Your Information",
      content: (
        <div className="space-y-4 text-slate-600">
          <p>We use the information we collect for the following purposes:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>To provide, maintain, operate, and improve our services, including the OMIS platform, Power BI analytics, and consulting services.</li>
            <li>To process transactions and send related information, including confirmations, invoices, and receipts.</li>
            <li>To send appointment reminders, booking confirmations, and operational notifications on behalf of businesses using OMIS.</li>
            <li>To send technical notices, updates, security alerts, and administrative messages.</li>
            <li>To respond to your comments, questions, support requests, and demo inquiries.</li>
            <li>To monitor and analyze trends, usage, and activities to improve our platform and user experience.</li>
            <li>To detect, investigate, and prevent fraudulent transactions and other illegal activities.</li>
            <li>To comply with legal obligations under Canadian and applicable international law.</li>
          </ul>
        </div>
      )
    },
    {
      id: "security",
      icon: Lock,
      title: "4. Data Storage & Security",
      content: (
        <div className="space-y-4 text-slate-600">
          <p>We take data security seriously and implement industry-standard measures to protect your information:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Encryption:</strong> All data is encrypted in transit using TLS 1.3 and at rest using AES-256 encryption standards.</li>
            <li><strong>Infrastructure:</strong> Our services are hosted on Supabase, powered by Amazon Web Services (AWS), utilizing virtual private clouds (VPCs), strict firewall rules, and multi-availability-zone redundancy.</li>
            <li><strong>Data Residency:</strong> We prioritize storing data in Canadian AWS regions (ca-central-1) where possible, in compliance with PIPEDA and applicable provincial privacy laws including PHIPA (Ontario).</li>
            <li><strong>Access Control:</strong> We employ strict role-based access controls (RBAC) to ensure that only authorized personnel have access to sensitive data.</li>
            <li><strong>Backups:</strong> Automated daily backups with 30-day retention are maintained to ensure data availability and recovery.</li>
            <li><strong>Certifications:</strong> Our infrastructure provider (Supabase/AWS) maintains SOC 2 Type II and ISO 27001 certifications.</li>
            <li><strong>Regular Audits:</strong> We conduct regular security reviews and vulnerability assessments to identify and mitigate potential risks.</li>
          </ul>
        </div>
      )
    },
    {
      id: "analytics",
      icon: Server,
      title: "5. Analytics & Reporting",
      content: (
        <div className="space-y-4 text-slate-600">
          <p>
            Our core services involve processing business data to generate analytics, dashboards, and reports. When you use our Power BI consulting or OMIS platform:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>We process your data solely for the purpose of delivering the agreed-upon analytics, visualizations, and insights.</li>
            <li>We do not aggregate your proprietary business data with that of other clients for any purpose other than anonymized, non-identifiable platform improvement.</li>
            <li>Your data remains your property at all times. We claim no ownership rights over any business intelligence derived from your data.</li>
            <li>Upon termination of services, your data will be deleted or returned to you within 90 days, as described in Section 8.</li>
          </ul>
        </div>
      )
    },
    {
      id: "sharing",
      icon: Globe,
      title: "6. Data Sharing & Third-Party Services",
      content: (
        <div className="space-y-4 text-slate-600">
          <p>We do not sell your personal information. We may share your information only in the following circumstances:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>With Your Consent:</strong> We will share personal information outside of {COMPANY} only when you have provided explicit consent.</li>
            <li><strong>Payment Processing:</strong> We use Stripe for secure payment processing. Your payment information is transmitted directly to Stripe and is not stored on our servers. Stripe's privacy policy applies to all payment transactions.</li>
            <li><strong>Infrastructure Providers:</strong> We use Supabase (database and authentication) and AWS (cloud hosting) to operate our platform. These providers process data on our behalf under strict confidentiality agreements.</li>
            <li><strong>Email Communications:</strong> We use third-party email service providers to deliver transactional emails, notifications, and communications. These providers process only the information necessary to deliver messages.</li>
            <li><strong>Legal Requirements:</strong> We may disclose your information if required by applicable law, regulation, legal process, or enforceable governmental request, or to protect the rights, property, or safety of {COMPANY}, our users, or the public.</li>
            <li><strong>Business Transfers:</strong> In the event of a merger, acquisition, or sale of assets, your information may be transferred. We will notify you before your personal information becomes subject to a different privacy policy.</li>
          </ul>
        </div>
      )
    },
    {
      id: "rights",
      icon: Shield,
      title: "7. Your Rights & Controls",
      content: (
        <div className="space-y-4 text-slate-600">
          <p>Under PIPEDA and applicable Canadian privacy law, you have the following rights regarding your personal information:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Access:</strong> You have the right to request a copy of the personal information we hold about you.</li>
            <li><strong>Correction:</strong> You have the right to request that we correct any inaccurate or incomplete information.</li>
            <li><strong>Withdrawal of Consent:</strong> You may withdraw consent to our collection and use of your personal information at any time, subject to legal or contractual restrictions.</li>
            <li><strong>Deletion:</strong> You have the right to request deletion of your personal information, subject to our legal retention obligations.</li>
            <li><strong>Opt-Out:</strong> You may opt out of receiving promotional or marketing communications at any time by following the unsubscribe instructions in those messages or contacting us directly.</li>
            <li><strong>Data Portability:</strong> You may request a copy of your data in a structured, commonly used, and machine-readable format.</li>
            <li><strong>Complaints:</strong> You have the right to lodge a complaint with the Office of the Privacy Commissioner of Canada if you believe your privacy rights have been violated.</li>
          </ul>
          <p>To exercise any of these rights, contact us at <a href={`mailto:${EMAIL}`} className="text-blue-600 hover:underline">{EMAIL}</a>. We will respond within 30 days.</p>
        </div>
      )
    },
    {
      id: "retention",
      icon: Clock,
      title: "8. Data Retention",
      content: (
        <div className="space-y-4 text-slate-600">
          <p>
            We retain your personal information for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required or permitted by law.
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Active Accounts:</strong> Data is retained for the duration of your active subscription or service agreement.</li>
            <li><strong>Account Deletion:</strong> Upon termination of your account or service agreement, we will delete or anonymize your personal data within 90 days, unless we are required to retain it for legal, tax, or accounting purposes.</li>
            <li><strong>Legal Holds:</strong> Certain data may be retained longer where required by applicable law, including financial records which may be retained for up to 7 years under Canadian tax law.</li>
            <li><strong>Backups:</strong> Deleted data may remain in encrypted backups for up to 30 days before being permanently purged.</li>
          </ul>
        </div>
      )
    },
    {
      id: "children",
      icon: AlertTriangle,
      title: "9. Children's Privacy",
      content: (
        <div className="space-y-4 text-slate-600">
          <p>
            Our services are intended for businesses and professionals and are not directed at individuals under the age of 18. We do not knowingly collect personal information from minors. If we become aware that we have collected personal information from a person under 18 without appropriate parental consent, we will take immediate steps to delete that information.
          </p>
          <p>
            If you believe a minor has provided us with personal information, please contact us immediately at <a href={`mailto:${EMAIL}`} className="text-blue-600 hover:underline">{EMAIL}</a>.
          </p>
        </div>
      )
    },
    {
      id: "cookies",
      icon: Database,
      title: "10. Cookies & Tracking",
      content: (
        <div className="space-y-4 text-slate-600">
          <p>We use cookies and similar tracking technologies to improve your experience on our platform:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Essential Cookies:</strong> Required for authentication, security, and core platform functionality. These cannot be disabled.</li>
            <li><strong>Analytics Cookies:</strong> Used to understand how users interact with our services so we can improve them. These are anonymized and do not identify you personally.</li>
            <li><strong>Preference Cookies:</strong> Used to remember your settings and preferences across sessions.</li>
          </ul>
          <p>You may control cookie settings through your browser. Disabling certain cookies may affect the functionality of our services.</p>
        </div>
      )
    },
    {
      id: "changes",
      icon: RefreshCw,
      title: "11. Changes to This Policy",
      content: (
        <div className="space-y-4 text-slate-600">
          <p>
            We may update this Privacy Policy from time to time to reflect changes in our practices, technology, legal requirements, or other factors. We will notify you of material changes by:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Posting the updated policy on this page with a revised "Last Updated" date.</li>
            <li>Sending an email notification to registered users where the changes are significant.</li>
          </ul>
          <p>
            Your continued use of our services after the effective date of any changes constitutes your acceptance of the revised policy. We encourage you to review this policy periodically.
          </p>
        </div>
      )
    },
    {
      id: "contact",
      icon: Mail,
      title: "12. Contact Us",
      content: (
        <div className="space-y-4 text-slate-600">
          <p>If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact our Privacy Officer:</p>
          <ul className="list-none space-y-2">
            <li><strong>Email:</strong> <a href={`mailto:${EMAIL}`} className="text-blue-600 hover:underline">{EMAIL}</a></li>
            <li><strong>Phone:</strong> <a href={`tel:${PHONE}`} className="text-blue-600 hover:underline">{PHONE}</a></li>
            <li><strong>Address:</strong> {COMPANY}, Toronto, ON, Canada</li>
          </ul>
          <p className="mt-4">
            You also have the right to contact the <strong>Office of the Privacy Commissioner of Canada</strong> at <a href="https://www.priv.gc.ca" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">www.priv.gc.ca</a> if you have unresolved privacy concerns.
          </p>
        </div>
      )
    },
  ];

  return (
    <div className="bg-slate-50 min-h-screen">
      <Helmet>
        <title>Privacy Policy - BDO Analytics Solutions</title>
        <meta name="description" content="Read our Privacy Policy to understand how BDO Analytics Solutions collects, uses, and protects your data in compliance with Canadian privacy law." />
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
          <p className="mt-4 text-slate-600 max-w-2xl mx-auto">
            This policy applies to all services provided by {COMPANY}, including the OMIS platform and our analytics consulting services.
          </p>
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
                We are committed to transparency and your privacy rights under Canadian law. If you have any concerns about how your data is handled, please reach out to us directly.
            </p>
            <a href={`mailto:${EMAIL}`} className="bg-white text-blue-900 font-bold py-3 px-8 rounded-full hover:bg-blue-50 transition-colors inline-block">
                Contact Privacy Team
            </a>
        </motion.div>
      </main>
    </div>
  );
};

export default PrivacyPolicy;
