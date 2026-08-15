import React from 'react';
import { Link } from 'react-router-dom';
import { BarChart2, ExternalLink, Mail, Phone } from 'lucide-react';

const Footer = () => {
  const omisAppLink = "https://omis-crm.com/";

  // Audited links mapping perfectly to App.jsx routes
  const footerSections = [
    {
      title: "Product & Tools",
      links: [
        { text: "OMIS Product", to: "/omis-product" },
        { text: "Try OMIS Now", external: omisAppLink },
        { text: "Pricing", to: "/omis-product#pricing" },
        { text: "ROI Calculator", to: "/roi-calculator" },
      ]
    },
    {
      title: "Services",
      links: [
        { text: "Power BI Consulting", to: "/services" },
        { text: "Data Cleanup", to: "/services" },
        { text: "Custom Dashboards", to: "/services" },
        { text: "Strategy Calls", to: "/services" },
      ]
    },
    {
      title: "Company",
      links: [
        { text: "About Us", to: "/about" },
        { text: "Contact", to: "/contact" },
        { text: "Book a Demo", to: "/book-demo" },
        { text: "Privacy Policy", to: "/privacy-policy" },
        { text: "Terms of Service", to: "/terms-of-service" },
        { text: "Account Deletion", to: "/account-deletion-request" },
      ]
    },
  ];

  return (
    <footer className="bg-slate-100 text-slate-900 border-t-2 border-slate-200 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <BarChart2 className="w-8 h-8 text-blue-700"/>
              <span className="text-xl font-extrabold text-slate-900 tracking-tight">BDO Analytics Solutions</span>
            </Link>
            <p className="text-sm text-slate-800 font-medium leading-relaxed mb-6">
              Ontario, Canada data and analytics consulting — and the builders of OMIS.
            </p>
          </div>

          {footerSections.map(section => (
            <div key={section.title}>
              <p className="font-extrabold text-slate-900 mb-4 text-sm uppercase tracking-wider">{section.title}</p>
              <ul className="space-y-3 text-sm">
                {section.links.map(link => (
                  <li key={link.text}>
                    {link.external ? (
                         <a href={link.external} target="_blank" rel="noopener noreferrer" className="text-blue-800 font-bold hover:text-blue-900 hover:underline transition-colors flex items-center gap-2">
                            {link.text} <ExternalLink className="w-3 h-3" />
                         </a>
                    ) : (
                      <Link to={link.to} className="text-slate-800 font-medium hover:text-blue-800 hover:font-bold hover:underline transition-all hover:translate-x-1 inline-block transform duration-200">{link.text}</Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        <div className="border-t-2 border-slate-200 pt-8">
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <p className="text-sm text-slate-800 font-medium mb-2 flex items-center gap-2">
                <Mail className="w-4 h-4 text-slate-700" />
                <a href="mailto:info@bdoanalyticssolutions.com" className="font-bold hover:text-blue-800 hover:underline transition-colors">info@bdoanalyticssolutions.com</a>
              </p>
              <p className="text-sm text-slate-800 font-medium flex items-center gap-2">
                <Phone className="w-4 h-4 text-slate-700" />
                <a href="tel:+14164779893" className="font-bold hover:text-blue-800 hover:underline transition-colors">+1 (416) 477-9893</a>
              </p>
            </div>
            <div className="text-sm text-slate-800 font-medium md:text-right">
              <p className="mb-2">Keywords: Data and analytics consulting, Power BI consulting, business intelligence for SMBs, booking and client-management software, appointment deposits, tattoo studio booking, barbershop booking, auto repair shop booking</p>
            </div>
          </div>
          <p className="text-slate-800 font-bold text-sm text-center">© 2026 BDO Analytics Solutions. All rights reserved. | *Performance statistics based on third-party research including McKinsey & Company, BlackLine, PwC, and EasyInsights. Results vary. Not a guarantee of individual outcomes.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;