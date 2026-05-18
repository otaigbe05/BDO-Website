import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Scale, Users, CreditCard, Database, ShieldCheck, ServerCrash, Ban, UserX, Copyright, AlertOctagon, RefreshCw, Mail } from 'lucide-react';
import Breadcrumbs from '@/components/Breadcrumbs';

const TermsOfService = () => {
  const siteUrl = "https://www.bdoanalyticssolutions.com/terms-of-service";
  const lastUpdated = "February 16, 2026";

  const sections = [
    {
      id: "use",
      icon: Scale,
      title: "1. Use of the Service",
      content: (
        <div className="space-y-4 text-slate-600">
          <p>
            BDO Analytics Solutions ("we," "us," or "our") grants you a limited, non-exclusive, non-transferable, and revocable license to use our services (including the OMIS platform and analytics consulting) subject to these Terms.
          </p>
          <p>You agree to use the Service only for lawful business purposes and in accordance with these Terms. You are responsible for ensuring that your use of the Service complies with all applicable laws and regulations.</p>
        </div>
      )
    },
    {
      id: "account",
      icon: Users,
      title: "2. Account Responsibilities",
      content: (
        <div className="space-y-4 text-slate-600">
          <p>To access certain features of the Service, you may be required to register for an account. You agree to:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Provide accurate, current, and complete information during the registration process.</li>
            <li>Maintain the security of your password and accept all risks of unauthorized access to your account and the information you provide.</li>
            <li>Notify us immediately if you discover or suspect any security breaches related to the Service or your account.</li>
          </ul>
        </div>
      )
    },
    {
      id: "subscription",
      icon: CreditCard,
      title: "3. Subscription & Payments",
      content: (
        <div className="space-y-4 text-slate-600">
          <p>
            Certain aspects of the Service may be provided for a fee or other charge. If you elect to use paid aspects of the Service, you agree to the pricing and payment terms as we may update them from time to time.
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Billing:</strong> Subscriptions are billed in advance on a monthly or annual basis.</li>
            <li><strong>Payment Processing:</strong> We use Stripe for secure payment processing. By providing a credit card or other payment method, you represent and warrant that you are authorized to use the designated payment method.</li>
            <li><strong>Refunds:</strong> All fees are non-refundable unless otherwise expressly provided in these Terms or required by applicable law.</li>
          </ul>
        </div>
      )
    },
    {
      id: "content",
      icon: Database,
      title: "4. Business Data & Content",
      content: (
        <div className="space-y-4 text-slate-600">
          <p>
            You retain all rights and ownership in your data. We do not claim any ownership rights in your business data, text, files, or other materials that you upload to the Service ("User Content").
          </p>
          <p>
            By uploading User Content, you grant us a worldwide, royalty-free, and non-exclusive license to access, store, and process such Content solely for the purpose of providing the Service to you (e.g., generating dashboards and reports).
          </p>
        </div>
      )
    },
    {
      id: "security",
      icon: ShieldCheck,
      title: "5. Data Security",
      content: (
        <div className="space-y-4 text-slate-600">
          <p>
            We implement commercially reasonable technical and organizational measures to secure your data from unauthorized access, use, alteration, or disclosure. However, we cannot guarantee that unauthorized third parties will never be able to defeat those measures or use your data for improper purposes. You acknowledge that you provide your personal information at your own risk.
          </p>
        </div>
      )
    },
    {
      id: "availability",
      icon: ServerCrash,
      title: "6. Service Availability",
      content: (
        <div className="space-y-4 text-slate-600">
          <p>
            We strive to maintain 99.9% uptime for the OMIS platform. However, the Service may be temporarily unavailable for scheduled maintenance or for unscheduled emergency maintenance, either by us or by third-party providers, or because of other causes beyond our reasonable control.
          </p>
          <p>
            We will use reasonable efforts to provide advance notice of any scheduled service disruption.
          </p>
        </div>
      )
    },
    {
      id: "acceptable",
      icon: Ban,
      title: "7. Acceptable Use",
      content: (
        <div className="space-y-4 text-slate-600">
          <p>You agree not to do any of the following:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Post, upload, publish, submit, or transmit any Content that: (i) infringes, misappropriates, or violates a third party's patent, copyright, trademark, trade secret, moral rights, or other intellectual property rights, or rights of publicity or privacy; (ii) violates, or encourages any conduct that would violate, any applicable law or regulation.</li>
            <li>Use, display, mirror, or frame the Service or any individual element within the Service.</li>
            <li>Attempt to probe, scan, or test the vulnerability of any our system or network or breach any security or authentication measures.</li>
          </ul>
        </div>
      )
    },
    {
      id: "termination",
      icon: UserX,
      title: "8. Termination",
      content: (
        <div className="space-y-4 text-slate-600">
          <p>
            We may terminate your access to and use of the Service, at our sole discretion, at any time and without notice to you. You may cancel your account at any time by sending an email to us at info@bdoanalytics.com.
          </p>
          <p>
            Upon any termination, discontinuation, or cancellation of the Service or your account, the following provisions will survive: Business Data & Content, Intellectual Property, Limitation of Liability, and General Terms.
          </p>
        </div>
      )
    },
    {
      id: "ip",
      icon: Copyright,
      title: "9. Intellectual Property",
      content: (
        <div className="space-y-4 text-slate-600">
          <p>
            The Service and its original content (excluding User Content), features, and functionality are and will remain the exclusive property of BDO Analytics Solutions and its licensors. The Service is protected by copyright, trademark, and other laws of both the Canada and foreign countries. Our trademarks and trade dress may not be used in connection with any product or service without the prior written consent of BDO Analytics Solutions.
          </p>
        </div>
      )
    },
    {
      id: "liability",
      icon: AlertOctagon,
      title: "10. Limitation of Liability",
      content: (
        <div className="space-y-4 text-slate-600">
          <p>
            IN NO EVENT SHALL BDO ANALYTICS SOLUTIONS, NOR ITS DIRECTORS, EMPLOYEES, PARTNERS, AGENTS, SUPPLIERS, OR AFFILIATES, BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL OR PUNITIVE DAMAGES, INCLUDING WITHOUT LIMITATION, LOSS OF PROFITS, DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES, RESULTING FROM (I) YOUR ACCESS TO OR USE OF OR INABILITY TO ACCESS OR USE THE SERVICE; (II) ANY CONDUCT OR CONTENT OF ANY THIRD PARTY ON THE SERVICE; (III) ANY CONTENT OBTAINED FROM THE SERVICE; AND (IV) UNAUTHORIZED ACCESS, USE OR ALTERATION OF YOUR TRANSMISSIONS OR CONTENT, WHETHER BASED ON WARRANTY, CONTRACT, TORT (INCLUDING NEGLIGENCE) OR ANY OTHER LEGAL THEORY, WHETHER OR NOT WE HAVE BEEN INFORMED OF THE POSSIBILITY OF SUCH DAMAGE.
          </p>
        </div>
      )
    },
    {
      id: "changes",
      icon: RefreshCw,
      title: "11. Changes to the Terms",
      content: (
        <div className="space-y-4 text-slate-600">
          <p>
            We may modify the Terms at any time, in our sole discretion. If we do so, we will let you know either by posting the modified Terms on the Site or through other communications. It is important that you review the Terms whenever we modify them because if you continue to use the Service after we have posted modified Terms on the Site, you are indicating to us that you agree to be bound by the modified Terms.
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
          <p>If you have any questions about these Terms, please contact us:</p>
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
        <title>Terms of Service - BDO Analytics Solutions</title>
        <meta name="description" content="Read our Terms of Service to understand the rules and regulations for using BDO Analytics Solutions services." />
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
                Our legal team is available to explain these terms in plain English. We believe in building trust through understanding.
            </p>
            <a href="mailto:info@bdoanalytics.com" className="bg-white text-slate-900 font-bold py-3 px-8 rounded-full hover:bg-slate-200 transition-colors inline-block">
                Contact Legal Support
            </a>
        </motion.div>
      </main>
    </div>
  );
};

export default TermsOfService;