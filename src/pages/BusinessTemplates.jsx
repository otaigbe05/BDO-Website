import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Stethoscope,
  Briefcase,
  Activity,
  Smile,
  Sparkles,
  Heart,
  Scissors,
  ChevronRight,
  Download
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import GatedDownloadModal from '@/components/GatedDownloadModal';

const templates = [
  {
    id: 'vet-clinic',
    name: "Vet Clinic Analytics Template",
    industry: "Veterinary",
    description: "Track appointments, patient records, treatment costs, medication inventory, and revenue by service type.",
    icon: <Stethoscope className="w-7 h-7" />,
    downloadUrl: "https://docs.google.com/spreadsheets/d/1CBq958MKGI7gxiU1MxnNCrUr2VDwn1nJ/edit?usp=drive_link&ouid=116048839658826704863&rtpof=true&sd=true"
  },
  {
    id: 'general-business',
    name: "General Business Analytics Template",
    industry: "Multi-Purpose",
    description: "Versatile template for tracking sales, expenses, profit margins, customer data, and key performance indicators.",
    icon: <Briefcase className="w-7 h-7" />,
    downloadUrl: "https://docs.google.com/spreadsheets/d/1QeYkVh0THGIrK9A60UOtIIFrC90SbNiB/edit?usp=drive_link&ouid=116048839658826704863&rtpof=true&sd=true"
  },
  {
    id: 'physiotherapy',
    name: "Physiotherapy Clinic Template",
    industry: "Healthcare",
    description: "Monitor patient outcomes, treatment plans, session attendance, billing, and therapist utilization rates.",
    icon: <Activity className="w-7 h-7" />,
    downloadUrl: "https://docs.google.com/spreadsheets/d/1k8jnO_XcnH8HGjnuyrnlndO2HN38hC-5/edit?usp=drive_link&ouid=116048839658826704863&rtpof=true&sd=true"
  },
  {
    id: 'dental-clinic',
    name: "Dental Clinic Analytics Template",
    industry: "Healthcare",
    description: "Track patient appointments, treatment history, insurance claims, procedure revenue, and hygienist productivity.",
    icon: <Smile className="w-7 h-7" />,
    downloadUrl: "https://docs.google.com/spreadsheets/d/15Fg2N5suZHnbd9AwpnqRk7ZQeNQHyXxM/edit?usp=drive_link&ouid=116048839658826704863&rtpof=true&sd=true"
  },
  {
    id: 'spa-salon',
    name: "Spa / Salon Analytics Template",
    industry: "Personal Care",
    description: "Analyze service bookings, product sales, staff performance, customer retention, and peak business hours.",
    icon: <Sparkles className="w-7 h-7" />,
    downloadUrl: "https://docs.google.com/spreadsheets/d/1OeCmiaSQxlnC1QRGjrUBW-Jfn2qoGLuu/edit?usp=drive_link&ouid=116048839658826704863&rtpof=true&sd=true"
  },
  {
    id: 'medical-clinic',
    name: "Medical Clinic Analytics Template",
    industry: "Healthcare",
    description: "Monitor patient visits, diagnosis trends, treatment outcomes, insurance billing, and physician schedules.",
    icon: <Heart className="w-7 h-7" />,
    downloadUrl: "https://docs.google.com/spreadsheets/d/1BikzyebgpcHezLRjDUDlstI1kbUQ3jy3/edit?usp=drive_link&ouid=116048839658826704863&rtpof=true&sd=true"
  },
  {
    id: 'barber-shop',
    name: "Barber Shop Analytics Template",
    industry: "Personal Care",
    description: "Track walk-ins vs appointments, barber performance, popular services, product retail sales, and customer loyalty.",
    icon: <Scissors className="w-7 h-7" />,
    downloadUrl: "https://docs.google.com/spreadsheets/d/1nBcLY2ME98_O_NZVVBVSkHw00hXtGBwA/edit?usp=drive_link&ouid=116048839658826704863&rtpof=true&sd=true"
  }
];

const BusinessTemplatesPage = () => {
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [selectedTemplateUrl, setSelectedTemplateUrl] = useState('');

  const handleDownloadClick = (template) => {
    setSelectedTemplate(template.name);
    setSelectedTemplateUrl(template.downloadUrl);
    setIsDownloadModalOpen(true);
  };

  return (
    <>
      <Helmet>
        <title>Free Industry Business Templates | BDO Analytics Solutions</title>
        <meta name="description" content="Download free professional dashboard templates for healthcare, retail, services, and more. Industry-specific analytics templates ready to use." />
      </Helmet>

      <div className="bg-slate-50 min-h-screen pb-24">
        {/* Header Section */}
        <section className="bg-white border-b border-slate-200 pt-20 pb-16">
          <div className="container mx-auto px-4">
            <div className="flex items-center text-sm text-slate-500 mb-8">
              <Link to="/" className="hover:text-blue-600 transition-colors">Home</Link>
              <ChevronRight className="w-4 h-4 mx-2" />
              <span className="text-slate-900 font-medium">Business Templates</span>
            </div>

            <div className="max-w-3xl">
              <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
                Free Industry-Specific Templates
              </h1>
              <p className="text-xl text-slate-600 leading-relaxed">
                Download ready-to-use analytics templates designed for your industry. Connect your data and start gaining insights immediately — completely free.
              </p>
            </div>
          </div>
        </section>

        {/* Templates Grid */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {templates.map((template, index) => (
                <motion.div
                  key={template.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  className="bg-white border-2 border-slate-200 rounded-2xl p-8 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col group hover:border-blue-400"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center text-blue-700 group-hover:bg-blue-200 transition-colors">
                      {template.icon}
                    </div>
                    <span className="text-xs text-blue-800 font-extrabold bg-blue-100 px-3 py-1.5 rounded-md border border-blue-200 uppercase tracking-wider">
                      {template.industry}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 mb-3">
                    {template.name}
                  </h3>
                  
                  <p className="text-slate-600 text-sm mb-8 flex-grow leading-relaxed">
                    {template.description}
                  </p>

                  <Button
                    onClick={() => handleDownloadClick(template)}
                    className="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-xl transition-all hover:scale-105 shadow-md shadow-blue-600/20"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download Template
                  </Button>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Additional Info Section */}
        <section className="py-16 bg-white border-t border-slate-200">
          <div className="container mx-auto px-4 text-center max-w-3xl">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">
              Need Custom Analytics?
            </h2>
            <p className="text-lg text-slate-600 mb-8">
              These templates are a great starting point. If you need a fully customized analytics solution tailored to your specific business needs, our team can help.
            </p>
            <Button asChild size="lg" className="bg-slate-900 hover:bg-blue-700 text-white font-bold px-8 rounded-xl">
              <Link to="/book-demo">Book a Consultation</Link>
            </Button>
          </div>
        </section>
      </div>

      <GatedDownloadModal
        isOpen={isDownloadModalOpen}
        onClose={() => setIsDownloadModalOpen(false)}
        templateName={selectedTemplate}
        templateUrl={selectedTemplateUrl}
      />
    </>
  );
};

export default BusinessTemplatesPage;