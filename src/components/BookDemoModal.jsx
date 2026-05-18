import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Send, Loader2 } from 'lucide-react';
import { sendEmail } from '@/lib/email';

const BookDemoModal = ({ open, onOpenChange }) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    industry: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const industries = ["Dental", "Veterinary", "Physiotherapy", "Spa & Wellness", "Restaurant", "Auto Repair", "Fitness", "Retail", "Cleaning", "Property Management", "Tutoring", "Other"];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await sendEmail(formData);
      
      toast({
        title: "Demo Request Sent! 🚀",
        description: "Thanks for your interest! We'll review your submission and be in touch shortly.",
        duration: 6000,
      });
      setFormData({ name: '', email: '', phone: '', company: '', industry: '', message: '' });
      onOpenChange(false);

    } catch (error) {
      console.error('EmailJS Error:', error);
      toast({
        variant: "destructive",
        title: "Oh no! Something went wrong.",
        description: "There was a problem with your request. Please try again or contact us directly.",
        duration: 6000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px] bg-white p-8 rounded-2xl shadow-xl border border-slate-300">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-slate-900">Book Your Free Demo</DialogTitle>
          <DialogDescription className="text-slate-800 font-medium mt-2">
            Let's find out how we can help your business grow with data.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div>
            <label htmlFor="modal-name" className="block text-sm font-bold text-slate-900 mb-2">Full Name *</label>
            <input type="text" id="modal-name" name="name" value={formData.name} onChange={handleChange} required className="w-full px-4 py-3 rounded-lg border border-slate-300 text-slate-900 font-medium focus:ring-2 focus:ring-blue-600 outline-none" />
          </div>
          <div>
            <label htmlFor="modal-email" className="block text-sm font-bold text-slate-900 mb-2">Email *</label>
            <input type="email" id="modal-email" name="email" value={formData.email} onChange={handleChange} required className="w-full px-4 py-3 rounded-lg border border-slate-300 text-slate-900 font-medium focus:ring-2 focus:ring-blue-600 outline-none" />
          </div>
          <div>
            <label htmlFor="modal-phone" className="block text-sm font-bold text-slate-900 mb-2">Phone Number</label>
            <input type="tel" id="modal-phone" name="phone" value={formData.phone} onChange={handleChange} className="w-full px-4 py-3 rounded-lg border border-slate-300 text-slate-900 font-medium focus:ring-2 focus:ring-blue-600 outline-none" />
          </div>
          <div>
            <label htmlFor="modal-company" className="block text-sm font-bold text-slate-900 mb-2">Company Name</label>
            <input type="text" id="modal-company" name="company" value={formData.company} onChange={handleChange} className="w-full px-4 py-3 rounded-lg border border-slate-300 text-slate-900 font-medium focus:ring-2 focus:ring-blue-600 outline-none" />
          </div>
          <div>
            <label htmlFor="modal-industry" className="block text-sm font-bold text-slate-900 mb-2">Industry *</label>
            <select id="modal-industry" name="industry" value={formData.industry} onChange={handleChange} required className="w-full px-4 py-3 rounded-lg border border-slate-300 text-slate-900 font-medium focus:ring-2 focus:ring-blue-600 outline-none bg-white">
              <option value="" disabled>Select your industry</option>
              {industries.map(i => <option key={i} value={i}>{i}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="modal-message" className="block text-sm font-bold text-slate-900 mb-2">Message</label>
            <textarea id="modal-message" name="message" value={formData.message} onChange={handleChange} rows={3} className="w-full px-4 py-3 rounded-lg border border-slate-300 text-slate-900 font-medium focus:ring-2 focus:ring-blue-600 outline-none resize-none" placeholder="Tell us about your business goals..."></textarea>
          </div>
          <DialogFooter>
            <Button type="submit" size="lg" className="w-full bg-blue-700 hover:bg-blue-800 text-white font-bold py-3 text-lg rounded-lg shadow-md" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  Submit Request <Send className="ml-2 w-5 h-5" />
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default BookDemoModal;