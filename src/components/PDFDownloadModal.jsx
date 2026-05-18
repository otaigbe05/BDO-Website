import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, Wrench, Scissors, Stethoscope, Building2, HeartPulse, Activity, Sparkles, Dog } from 'lucide-react';

const PDFDownloadModal = ({ isOpen, onClose }) => {
  const pdfOptions = [
    {
      title: "Auto Repair Shop",
      icon: Wrench,
      link: "https://drive.google.com/file/d/1IbBLcGV03w-9PNP3_JCzW8Et3qu72X46/view?usp=sharing",
      color: "text-blue-500",
      bg: "bg-blue-50"
    },
    {
      title: "Barber Shop",
      icon: Scissors,
      link: "https://drive.google.com/file/d/1P3m13ztORQWzUF0Ai8VScKqBCUA_Bvf4/view?usp=sharing",
      color: "text-purple-500",
      bg: "bg-purple-50"
    },
    {
      title: "Dental Clinic",
      icon: Stethoscope,
      link: "https://drive.google.com/file/d/1NCknVelxHnTlk-uVWk4lXOfYiu5Aunia/view?usp=sharing",
      color: "text-teal-500",
      bg: "bg-teal-50"
    },
    {
      title: "General Business",
      icon: Building2,
      link: "https://drive.google.com/file/d/1kosAcmckcb_ge-WxKODDu0ON9_3yGbgD/view?usp=sharing",
      color: "text-slate-500",
      bg: "bg-slate-50"
    },
    {
      title: "Medical Office / Clinic",
      icon: HeartPulse,
      link: "https://drive.google.com/file/d/1WXWQrdUbbCYsfBeCM50-yKrP2OlNjk3G/view?usp=sharing",
      color: "text-rose-500",
      bg: "bg-rose-50"
    },
    {
      title: "Physiotherapy Clinic",
      icon: Activity,
      link: "https://drive.google.com/file/d/1uEy6E3HSpW4skjiUlGAlfidDfH6k-sYG/view?usp=sharing",
      color: "text-orange-500",
      bg: "bg-orange-50"
    },
    {
      title: "Spa & Salon",
      icon: Sparkles,
      link: "https://drive.google.com/file/d/11vwXjDanyY8lokeD-TTZEWPy30g7-_sM/view?usp=sharing",
      color: "text-pink-500",
      bg: "bg-pink-50"
    },
    {
      title: "Veterinary Clinic",
      icon: Dog,
      link: "https://drive.google.com/file/d/1E3wU5eV1LeMocOwZ5SmBSchnDrWmzfgN/view?usp=sharing",
      color: "text-emerald-500",
      bg: "bg-emerald-50"
    }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-slate-900">Download Free PDF Samples</DialogTitle>
          <DialogDescription className="text-slate-600 font-medium">
            Select an industry below to preview the report layout and metrics in PDF format.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
          {pdfOptions.map((option, idx) => (
            <div key={idx} className="flex flex-col p-4 border border-slate-200 rounded-xl hover:shadow-md transition-shadow bg-white">
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${option.bg}`}>
                  <option.icon className={`w-5 h-5 ${option.color}`} />
                </div>
                <h3 className="font-semibold text-slate-800 text-sm leading-tight">{option.title}</h3>
              </div>
              <Button asChild className="w-full mt-auto bg-blue-600 hover:bg-blue-700 text-white" size="sm">
                <a href={option.link} target="_blank" rel="noopener noreferrer">
                  Download PDF <Download className="ml-2 w-4 h-4" />
                </a>
              </Button>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PDFDownloadModal;