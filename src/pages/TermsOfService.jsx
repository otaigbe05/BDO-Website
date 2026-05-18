import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Scale, Users, CreditCard, Database, ShieldCheck, ServerCrash, Ban, UserX, Copyright, AlertOctagon, RefreshCw, Mail, FileCheck, Globe } from 'lucide-react';
import Breadcrumbs from '@/components/Breadcrumbs';

const TermsOfService = () => {
  const siteUrl = "https://www.bdoanalyticssolutions.com/terms-of-service";
  const lastUpdated = "May 11, 2026";
  const COMPANY = "BDO Analytics Solutions";
  const EMAIL = "info@bdoanalyticssolutions.com";
  const PHONE = "+1-416-848-5058";

  const sections = [
    {
      id: "intro",
      icon: FileCheck,
      title: "1. Agreement to Terms",
      content: (
        <div className="space-y-4 text-slate-600">
          <p>
            These Terms of Service ("Terms") constitute a legally binding agreement between you ("User," "you," or "your") and {COMPANY} ("we," "us," or "our") governing your access to and use of all services provided by {COMPANY}, including the OMIS platform (omis-crm.com), Power BI analytics consulting, business templates, and this website (bdoanalyticssolutions.com) (collectively, the "Services").
          </p>
          <p>
            By accessing or using any of our Services, you confirm that you are at least 18 years of age, have the legal authority to enter into these Terms on behalf of yourself or your organization, and agree to be bound by these Terms and our Privacy Policy.
          </p>
          <p>
            If you do not agree to these Terms, you must immediately cease all use of our Services.
          </p>
          <p>
            These Terms are governed by the laws of the Province of Ontario and the federal laws of Canada applicable therein. Any disputes arising under these Terms shall be subject to the exclusive jurisdiction of the courts of Ontario, Canada.
          </p>
        </div>
      )
    },
    {
      id: "use",
      icon: Scale,
      title: "2. Use of the Services",
      content: (
        <div className="space-y-4 text-slate-600">
          <p>
            {COMPANY} grants you a limited, non-exclusive, non-transferable, and revocable license to use our Services subject to these Terms.
          </p>
          <p>You agree to use the Services only for lawful business purposes and in accordance with these Terms. You are responsible for ensuring that your use of the Services complies with all applicable laws and regulations, including those governing data privacy, consumer protection, and professional conduct in your jurisdiction.</p>
          <p>
            The Services, including the OMIS platform, are designed for business use by companies and professionals. Use of the Services for personal, family, or household purposes is not permitted.
          </p>
        </div>
      )
    },
    {
      id: "account",
      icon: Users,
      title: "3. Account Responsibilities",
      content: (
        <div className="space-y-4 text-slate-600">
          <p>To access certain features of the Services, you may be required to register for an account. You agree to:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Provide accurate, current, and complete information during the registration process and keep it updated.</li>
            <li>Maintain the confidentiality of your account credentials and accept all responsibility for activities that occur under your account.</li>
            <li>Notify us immediately at <a href={`mailto:${EMAIL}`} className="text-blue-600 hover:underline">{EMAIL}</a> if you discover or suspect any unauthorized access to your account or any security breach.</li>
            <li>Not share your account credentials with any third party or permit others to access the Services through your account.</li>
            <li>Ensure that all users authorized to access the Services through your account comply with these Terms.</li>
          </ul>
          <p>
            {COMPANY} reserves the right to suspend or terminate accounts that violate these Terms or that show signs of unauthorized or fraudulent activity.
          </p>
        </div>
      )
    },
    {
      id: "subscription",
      icon: CreditCard,
      title: "4. Subscription & Payments",
      content: (
        <div className="space-y-4 text-slate-600">
          <p>
            Certain aspects of the Services are provided for a fee. By electing to use paid Services, you agree to the pricing and payment terms as published and updated from time to time.
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Billing Cycles:</strong> Subscriptions are billed in advance on a monthly or annual basis, as selected at the time of purchase.</li>
            <li><strong>Free Trials:</strong> Where a free trial is offered, you will not be charged until the trial period expires. You may cancel at any time during the trial to avoid charges.</li>
            <li><strong>Payment Processing:</strong> We use Stripe for secure payment processing. By providing a payment method, you represent that you are authorized to use it and authorize us to charge all fees incurred through your account to that payment method.</li>
            <li><strong>Price Changes:</strong> We reserve the right to modify pricing with at least 30 days' written notice. Continued use of the Services after a price change constitutes acceptance of the new pricing.</li>
            <li><strong>Taxes:</strong> All fees are exclusive of applicable taxes including HST/GST, which will be added where required by Canadian law.</li>
            <li><strong>Refunds:</strong> All fees are non-refundable unless otherwise expressly provided in these Terms or required by applicable law. Unused portions of subscription periods are not refundable upon cancellation.</li>
            <li><strong>Late Payments:</strong> Accounts with overdue balances may be suspended until payment is received. We reserve the right to charge interest on overdue amounts at the rate of 1.5% per month.</li>
          </ul>
        </div>
      )
    },
    {
      id: "content",
      icon: Database,
      title: "5. Business Data & Content",
      content: (
        <div className="space-y-4 text-slate-600">
          <p>
            You retain all rights and ownership in your business data, including client records, operational data, and any other materials you upload to the Services ("User Content").
          </p>
          <p>
            By uploading User Content, you grant {COMPANY} a limited, worldwide, royalty-free, non-exclusive license to access, store, and process such Content solely for the purpose of providing the Services to you, including generating dashboards, reports, and analytics.
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>We do not use your User Content to train AI models or for any purpose beyond delivering your contracted Services.</li>
            <li>We do not aggregate your proprietary data with that of other clients for commercial purposes.</li>
            <li>You are solely responsible for ensuring you have the legal right to upload and process any data through our Services, including obtaining necessary consents from your clients or customers.</li>
            <li>You must not upload any data that is unlawful, harmful, defamatory, or that violates the privacy rights of any individual.</li>
          </ul>
        </div>
      )
    },
    {
      id: "security",
      icon: ShieldCheck,
      title: "6. Data Security",
      content: (
        <div className="space-y-4 text-slate-600">
          <p>
            We implement commercially reasonable technical and organizational measures designed to secure your data from unauthorized access, use, alteration, or disclosure. Our infrastructure is hosted on Supabase powered by AWS, maintaining SOC 2 Type II and ISO 27001 certifications, with AES-256 encryption at rest and TLS 1.3 in transit.
          </p>
          <p>
            However, no method of electronic transmission or storage is 100% secure. We cannot guarantee absolute security and shall not be liable for unauthorized access resulting from circumstances beyond our reasonable control, including but not limited to your failure to maintain the security of your account credentials.
          </p>
          <p>
            In the event of a data breach that is likely to result in a risk to your rights and freedoms, we will notify you as required under applicable Canadian privacy law.
          </p>
        </div>
      )
    },
    {
      id: "availability",
      icon: ServerCrash,
      title: "7. Service Availability",
      content: (
        <div className="space-y-4 text-slate-600">
          <p>
            We strive to maintain high availability for the OMIS platform and our Services. However, the Services may be temporarily unavailable due to:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Scheduled maintenance, for which we will provide advance notice where practicable.</li>
            <li>Unscheduled emergency maintenance required to protect the integrity or security of the platform.</li>
            <li>Causes beyond our reasonable control, including third-party infrastructure outages, force majeure events, or internet disruptions.</li>
          </ul>
          <p>
            Planned maintenance windows will be communicated via email or in-platform notification with at least 24 hours' advance notice where possible. We do not guarantee any specific uptime percentage and shall not be liable for any loss or damages arising from service interruptions.
          </p>
        </div>
      )
    },
    {
      id: "acceptable",
      icon: Ban,
      title: "8. Acceptable Use",
      content: (
        <div className="space-y-4 text-slate-600">
          <p>You agree not to use the Services to:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Violate any applicable law, regulation, or third-party rights, including intellectual property rights and privacy rights.</li>
            <li>Upload, transmit, or distribute any content that is unlawful, harmful, harassing, defamatory, obscene, or otherwise objectionable.</li>
            <li>Attempt to gain unauthorized access to any portion of the Services, other accounts, or related systems or networks.</li>
            <li>Use the Services to send unsolicited communications (spam) or conduct any form of automated data collection without our express written consent.</li>
            <li>Reverse engineer, decompile, disassemble, or otherwise attempt to derive the source code of the Services.</li>
            <li>Use the Services in any manner that could damage, disable, overburden, or impair the platform or interfere with any other user's use of the Services.</li>
            <li>Resell, sublicense, or otherwise commercialize access to the Services without our prior written consent.</li>
          </ul>
          <p>
            Violation of this Acceptable Use policy may result in immediate suspension or termination of your account without notice or refund.
          </p>
        </div>
      )
    },
    {
      id: "termination",
      icon: UserX,
      title: "9. Termination",
      content: (
        <div className="space-y-4 text-slate-600">
          <p>
            <strong>Termination by You:</strong> You may cancel your account at any time by contacting us at <a href={`mailto:${EMAIL}`} className="text-blue-600 hover:underline">{EMAIL}</a>. Cancellation will take effect at the end of your current billing period. No refund will be issued for the remaining portion of the billing period unless required by applicable law.
          </p>
          <p>
            <strong>Termination by Us:</strong> We may suspend or terminate your access to the Services, at our sole discretion, with or without notice, if we reasonably believe you have violated these Terms, engaged in fraudulent activity, or if continued provision of Services creates legal or reputational risk for {COMPANY}.
          </p>
          <p>
            <strong>Effect of Termination:</strong> Upon termination, your right to use the Services will immediately cease. We will provide you with an opportunity to export your data within 30 days of termination, after which your data will be deleted in accordance with our Privacy Policy. The following provisions survive termination: Business Data & Content (ownership rights), Intellectual Property, Limitation of Liability, Indemnification, and Governing Law.
          </p>
        </div>
      )
    },
    {
      id: "ip",
      icon: Copyright,
      title: "10. Intellectual Property",
      content: (
        <div className="space-y-4 text-slate-600">
          <p>
            The Services and all original content, features, functionality, software, and technology (excluding User Content) are and will remain the exclusive property of {COMPANY} and its licensors. The Services are protected by copyright, trademark, and other applicable Canadian and international intellectual property laws.
          </p>
          <p>
            Our trademarks, logos, and trade dress may not be used in connection with any product or service without the prior written consent of {COMPANY}. Any feedback, suggestions, or ideas you provide regarding the Services may be used by us without any obligation of compensation or attribution.
          </p>
          <p>
            Nothing in these Terms transfers any intellectual property rights to you. The license granted under these Terms is limited to using the Services as intended and does not include any right to sublicense, modify, or create derivative works.
          </p>
        </div>
      )
    },
    {
      id: "liability",
      icon: AlertOctagon,
      title: "11. Limitation of Liability & Disclaimer",
      content: (
        <div className="space-y-4 text-slate-600">
          <p>
            THE SERVICES ARE PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT.
          </p>
          <p>
            TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT SHALL {COMPANY.toUpperCase()}, NOR ITS DIRECTORS, EMPLOYEES, PARTNERS, AGENTS, SUPPLIERS, OR AFFILIATES, BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING WITHOUT LIMITATION LOSS OF PROFITS, DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES, RESULTING FROM:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Your access to, use of, or inability to access or use the Services;</li>
            <li>Any conduct or content of any third party on or through the Services;</li>
            <li>Any content obtained from or generated by the Services, including analytics and reports;</li>
            <li>Unauthorized access, use, or alteration of your transmissions or data;</li>
          </ul>
          <p>
            WHETHER BASED ON WARRANTY, CONTRACT, TORT (INCLUDING NEGLIGENCE), OR ANY OTHER LEGAL THEORY, WHETHER OR NOT WE HAVE BEEN INFORMED OF THE POSSIBILITY OF SUCH DAMAGE. OUR TOTAL CUMULATIVE LIABILITY TO YOU FOR ANY CLAIMS ARISING UNDER THESE TERMS SHALL NOT EXCEED THE AMOUNT PAID BY YOU TO {COMPANY.toUpperCase()} IN THE THREE (3) MONTHS PRECEDING THE CLAIM.
          </p>
        </div>
      )
    },
    {
      id: "indemnification",
      icon: Globe,
      title: "12. Indemnification",
      content: (
        <div className="space-y-4 text-slate-600">
          <p>
            You agree to defend, indemnify, and hold harmless {COMPANY} and its officers, directors, employees, agents, licensors, and service providers from and against any claims, liabilities, damages, judgments, awards, losses, costs, expenses, or fees (including reasonable legal fees) arising out of or relating to:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Your violation of these Terms;</li>
            <li>Your User Content, including any claim that your User Content infringes, misappropriates, or violates the rights of any third party;</li>
            <li>Your use of the Services in violation of applicable law;</li>
            <li>Your failure to obtain necessary consents from your clients or customers for processing their data through our Services.</li>
          </ul>
        </div>
      )
    },
    {
      id: "changes",
      icon: RefreshCw,
      title: "13. Changes to the Terms",
      content: (
        <div className="space-y-4 text-slate-600">
          <p>
            We reserve the right to modify these Terms at any time. We will provide notice of material changes by:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Posting the updated Terms on this page with a revised "Last Updated" date.</li>
            <li>Sending an email notification to registered users for significant changes.</li>
          </ul>
          <p>
            Your continued use of the Services after the effective date of any changes constitutes your acceptance of the revised Terms. If you do not agree to the modified Terms, you must discontinue use of the Services immediately.
          </p>
        </div>
      )
    },
    {
      id: "contact",
      icon: Mail,
      title: "14. Contact Us",
      content: (
        <div className="space-y-4 text-slate-600">
          <p>If you have any questions about these Terms, please contact us:</p>
          <ul className="list-none space-y-2">
            <li><strong>Email:</strong> <a href={`mailto:${EMAIL}`} className="text-blue-600 hover:underline">{EMAIL}</a></li>
            <li><strong>Phone:</strong> <a href={`tel:${PHONE}`} className="text-blue-600 hover:underline">{PHONE}</a></li>
            <li><strong>Address:</strong> {COMPANY}, Toronto, ON, Canada</li>
          </ul>
        </div>
      )
    },
  ];

  return (
    <div className="bg-slate-50 min-h-screen">
      <Helmet>
        <title>Terms of Service - BDO Analytics Solutions</title>
        <meta name="description" content="Read our Terms of Service to understand the rules and regulations for using BDO Analytics Solutions services, including the OMIS platform." />
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
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6">Terms of Service</h1>
          <div className="inline-block bg-white px-6 py-2 rounded-full shadow-sm border border-slate-200">
            <span className="text-slate-500 font-medium">Last Updated: <span className="text-slate-900">{lastUpdated}</span></span>
          </div>
          <p className="mt-4 text-slate-600 max-w-2xl mx-auto">
            These Terms govern your use of all services provided by {COMPANY}, including the OMIS platform and our analytics consulting services.
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
                  <div className="p-3 bg-indigo-50 rounded-lg text-indigo-600">
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
            className="mt-16 p-8 bg-slate-900 rounded-2xl text-white text-center shadow-xl"
        >
            <h3 className="text-2xl font-bold mb-4">Need Clarification?</h3>
            <p className="text-slate-300 mb-8 max-w-2xl mx-auto">
                We believe in building trust through transparency. If you have questions about these Terms or how they apply to your use of our Services, please reach out.
            </p>
            <a href={`mailto:${EMAIL}`} className="bg-white text-slate-900 font-bold py-3 px-8 rounded-full hover:bg-slate-200 transition-colors inline-block">
                Contact Legal Support
            </a>
        </motion.div>
      </main>
    </div>
  );
};

export default TermsOfService;
