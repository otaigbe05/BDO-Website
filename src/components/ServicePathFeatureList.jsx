import React from 'react';
import { motion } from 'framer-motion';
import { Check, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const ServicePathFeatureList = ({ icon: Icon, pathName, title, description, features, price, pricePeriod, ctaLabel, ctaLink, themeColor }) => {
  const isBlue = themeColor === 'blue';
  const themeConfig = {
    badgeBg: isBlue ? 'bg-blue-100' : 'bg-teal-100',
    badgeText: isBlue ? 'text-blue-900' : 'text-teal-900',
    badgeBorder: isBlue ? 'border-blue-300' : 'border-teal-300',
    iconColor: isBlue ? 'text-blue-700' : 'text-teal-700',
    btnBg: isBlue ? 'bg-blue-700 hover:bg-blue-800' : 'bg-teal-700 hover:bg-teal-800',
  };

  return (
    <div className="flex flex-col h-full">
      <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${themeConfig.badgeBg} ${themeConfig.badgeText} ${themeConfig.badgeBorder} border text-sm font-extrabold w-fit mb-6 shadow-sm`}>
        <Icon className="w-5 h-5" strokeWidth={2.5} />
        {pathName}
      </div>
      <h3 className="text-3xl font-extrabold text-slate-900 mb-4 leading-tight tracking-tight">{title}</h3>
      <p className="text-slate-900 font-bold text-lg mb-8 leading-relaxed">{description}</p>
      
      <ul className="space-y-4 mb-10 flex-grow">
        {features.map((feature, i) => (
          <li key={i} className="flex items-start gap-3">
            <div className="mt-1 bg-white rounded-full p-0.5 border border-slate-400 shadow-sm">
                <Check className={`w-5 h-5 ${themeConfig.iconColor} stroke-[3]`} />
            </div>
            <span className="text-slate-900 font-bold text-base leading-snug">{feature}</span>
          </li>
        ))}
      </ul>

      <div className="bg-slate-100 p-6 rounded-2xl border border-slate-300 mb-8 shadow-sm">
        <p className="text-sm font-extrabold text-slate-900 uppercase tracking-wider mb-2">Starting At</p>
        <div className="flex items-baseline gap-1">
          <span className="text-4xl font-extrabold text-slate-900">{price}</span>
          <span className="text-slate-900 font-bold text-lg">{pricePeriod}</span>
        </div>
      </div>

      <Button asChild size="lg" className={`w-full ${themeConfig.btnBg} text-white font-bold text-lg h-14 rounded-xl shadow-md transition-all hover:scale-[1.02]`}>
        <Link to={ctaLink}>
          {ctaLabel} <ArrowRight className="ml-2 w-5 h-5 stroke-[2.5]" />
        </Link>
      </Button>
    </div>
  );
};

export default ServicePathFeatureList;