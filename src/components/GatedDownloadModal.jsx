import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2, Download, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { sendEmail } from '@/lib/email';

const GatedDownloadModal = ({ isOpen, onClose, templateName, templateUrl }) => {
  const [formData, setFormData] = useState({
    businessName: '',
    businessLocation: '',
    email: '',
    phone: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      await sendEmail({
        ...formData,
        templateRequested: templateName,
        _subject: 'New Template Download Request',
        message: `
          Template Requested: ${templateName}
          Business Name: ${formData.businessName}
          Business Location: ${formData.businessLocation}
          Email: ${formData.email}
          Phone: ${formData.phone}
        `
      });

      setIsSuccess(true);
    } catch (err) {
      setError('Something went wrong. Please try again or contact us directly at info@bdoanalyticssolutions.com');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({ businessName: '', businessLocation: '', email: '', phone: '' });
    setIsSuccess(false);
    setError('');
    onClose();
  };

  const handleDownload = () => {
    window.open(templateUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto z-10"
          >
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 p-2 rounded-lg hover:bg-slate-100 transition-colors z-10"
              aria-label="Close modal"
            >
              <X className="w-5 h-5 text-slate-600" />
            </button>

            <div className="p-8">
              {!isSuccess ? (
                <>
                  <div className="mb-8">
                    <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">
                      Download {templateName}
                    </h2>
                    <p className="text-slate-600">
                      Fill out your details below to get instant access to the template.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-2">
                      <label htmlFor="businessName" className="text-sm font-bold text-slate-900">
                        Business Name *
                      </label>
                      <input
                        type="text"
                        id="businessName"
                        name="businessName"
                        value={formData.businessName}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all text-slate-900 bg-slate-50"
                        placeholder="ABC Corporation"
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="businessLocation" className="text-sm font-bold text-slate-900">
                        Business Location *
                      </label>
                      <input
                        type="text"
                        id="businessLocation"
                        name="businessLocation"
                        value={formData.businessLocation}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all text-slate-900 bg-slate-50"
                        placeholder="Toronto, ON"
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-bold text-slate-900">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all text-slate-900 bg-slate-50"
                        placeholder="you@company.com"
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="phone" className="text-sm font-bold text-slate-900">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all text-slate-900 bg-slate-50"
                        placeholder="+1 (555) 000-0000"
                      />
                    </div>

                    {error && (
                      <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                        <p className="text-sm text-red-800 font-medium">{error}</p>
                      </div>
                    )}

                    <Button
                      type="submit"
                      size="lg"
                      className="w-full bg-blue-700 hover:bg-blue-800 text-white py-6 text-lg rounded-xl shadow-lg shadow-blue-600/20 font-bold transition-all hover:scale-[1.02]"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          Get Template Access
                        </>
                      )}
                    </Button>
                  </form>

                  <p className="text-xs text-slate-500 mt-6 text-center">
                    By submitting, you agree to receive emails from BDO Analytics Solutions.
                  </p>
                </>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-8"
                >
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-10 h-10 text-green-600" />
                  </div>

                  <h3 className="text-2xl font-bold text-slate-900 mb-3">
                    Thank You!
                  </h3>
                  <p className="text-slate-600 mb-8">
                    Your download is ready. Click the button below to access your {templateName}.
                  </p>

                  <Button
                    onClick={handleDownload}
                    size="lg"
                    className="bg-blue-700 hover:bg-blue-800 text-white font-bold px-8 py-6 rounded-xl shadow-lg shadow-blue-600/20 transition-all hover:scale-[1.02]"
                  >
                    <Download className="mr-2 w-5 h-5" />
                    Download Template
                  </Button>

                  <p className="text-sm text-slate-500 mt-6">
                    We've also sent a confirmation email with the download link.
                  </p>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default GatedDownloadModal;