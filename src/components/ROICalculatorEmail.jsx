import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Mail, Download, ArrowRight, CheckCircle2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { sendEmail } from '@/lib/email';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

const ROICalculatorEmail = ({ results, inputs }) => {
  const [email, setEmail] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const { toast } = useToast();

  const handleSendEmail = async (e) => {
    e.preventDefault();
    if (!email) return;

    setIsSending(true);
    try {
      await sendEmail({
        name: 'ROI Calculator User',
        email: email,
        message: `Requested ROI Results. Total Savings: $${results.totalSavings}, ROI: ${results.roi}%`,
        calculator_results: JSON.stringify({ inputs, results }, null, 2)
      });
      
      setIsSent(true);
      toast({
        title: "Results Sent!",
        description: "Check your inbox for the detailed ROI breakdown.",
      });
      setEmail('');
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error sending email",
        description: "Please try again later.",
      });
    } finally {
      setIsSending(false);
    }
  };

  const handleDownloadPDF = async () => {
    setIsDownloading(true);
    try {
      const element = document.getElementById('roi-results-container');
      if (!element) throw new Error("Results container not found");
      
      const canvas = await html2canvas(element, { scale: 2, backgroundColor: '#ffffff' });
      const imgData = canvas.toDataURL('image/png');
      
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 10, pdfWidth, pdfHeight);
      pdf.save('OMIS_ROI_Report.pdf');
      
      toast({
        title: "Report Downloaded",
        description: "Your PDF has been saved successfully.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Download Failed",
        description: "Could not generate PDF. Please try again.",
      });
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7 }}
      className="bg-slate-900 rounded-2xl shadow-2xl border border-slate-800 p-8 text-white mt-8 overflow-hidden relative"
    >
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      
      <div className="relative z-10 grid lg:grid-cols-2 gap-10 items-center">
        <div>
          <h3 className="text-2xl md:text-3xl font-bold mb-4 tracking-tight">Ready to stop losing money on manual processes?</h3>
          <p className="text-slate-400 mb-8 leading-relaxed">
            Download your customized report to share with your team, or schedule a demo to see how OMIS can make these savings a reality.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              onClick={handleDownloadPDF} 
              variant="outline" 
              className="border-slate-600 text-slate-800 bg-white hover:bg-slate-100 hover:text-blue-600 h-12 px-6 rounded-xl font-bold"
              disabled={isDownloading}
            >
              {isDownloading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Download className="w-5 h-5 mr-2" />}
              Download PDF Report
            </Button>
            <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white h-12 px-6 rounded-xl font-bold border-none shadow-lg shadow-blue-900/50">
              <Link to="/book-demo">
                Schedule Demo <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
          </div>
        </div>

        <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700 backdrop-blur-sm">
          <h4 className="text-lg font-bold mb-4 text-white flex items-center gap-2">
            <Mail className="w-5 h-5 text-blue-400" />
            Email me this breakdown
          </h4>
          {isSent ? (
            <div className="bg-emerald-500/20 border border-emerald-500/30 p-4 rounded-xl flex items-center gap-3 text-emerald-400">
              <CheckCircle2 className="w-6 h-6 shrink-0" />
              <p className="font-medium text-sm">Report sent! Check your inbox shortly.</p>
            </div>
          ) : (
            <form onSubmit={handleSendEmail} className="flex flex-col sm:flex-row gap-3">
              <Input 
                type="email" 
                placeholder="work@email.com" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-slate-900 border-slate-600 text-white placeholder:text-slate-500 h-12 rounded-xl focus:border-blue-500"
              />
              <Button type="submit" disabled={isSending} className="bg-white text-slate-900 hover:bg-blue-50 h-12 px-6 rounded-xl font-bold shrink-0">
                {isSending ? <Loader2 className="w-5 h-5 animate-spin" /> : "Send"}
              </Button>
            </form>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ROICalculatorEmail;