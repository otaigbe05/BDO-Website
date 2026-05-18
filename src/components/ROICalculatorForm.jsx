import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calculator, Settings2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const PRESETS = {
  custom: { name: 'Custom Input', employees: 5, hourlyRate: 75, hoursPerWeek: 20, dataSources: 5, softwareCosts: 50000 },
  financial: { name: 'Financial Services', employees: 8, hourlyRate: 95, hoursPerWeek: 35, dataSources: 12, softwareCosts: 80000 },
  retail: { name: 'Retail', employees: 3, hourlyRate: 50, hoursPerWeek: 15, dataSources: 5, softwareCosts: 20000 },
  healthcare: { name: 'Healthcare', employees: 6, hourlyRate: 85, hoursPerWeek: 30, dataSources: 8, softwareCosts: 60000 },
  manufacturing: { name: 'Manufacturing', employees: 4, hourlyRate: 65, hoursPerWeek: 25, dataSources: 7, softwareCosts: 40000 },
};

const ROICalculatorForm = ({ onCalculate }) => {
  const [preset, setPreset] = useState('custom');
  const [inputs, setInputs] = useState(PRESETS.custom);

  const handlePresetChange = (e) => {
    const selected = e.target.value;
    setPreset(selected);
    setInputs(PRESETS[selected]);
  };

  const handleInputChange = (field, value) => {
    setPreset('custom'); // Switch to custom if manually edited
    setInputs(prev => ({ ...prev, [field]: Number(value) || 0 }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onCalculate(inputs);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-xl border border-slate-300 p-6 md:p-8"
    >
      <div className="flex items-center gap-3 mb-8 pb-6 border-b border-slate-200">
        <div className="w-12 h-12 bg-blue-50 text-blue-700 rounded-xl flex items-center justify-center">
          <Settings2 className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Your Business Metrics</h2>
          <p className="text-slate-800 font-medium text-sm">Enter your current operational data</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="mb-6">
          <Label className="text-sm font-bold text-slate-900 mb-2 block">Industry Preset</Label>
          <select 
            className="w-full h-11 px-4 rounded-xl border border-slate-300 bg-white text-slate-900 font-medium focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all"
            value={preset}
            onChange={handlePresetChange}
          >
            {Object.entries(PRESETS).map(([key, data]) => (
              <option key={key} value={key}>{data.name}</option>
            ))}
          </select>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Employees */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label className="text-sm font-bold text-slate-900">Employees doing reporting</Label>
              <span className="font-bold text-blue-700 bg-blue-50 px-3 py-1 rounded-lg border border-blue-200">{inputs.employees}</span>
            </div>
            <Slider 
              value={[inputs.employees]} 
              min={1} max={50} step={1}
              onValueChange={(val) => handleInputChange('employees', val[0])}
            />
          </div>

          {/* Hourly Rate */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label className="text-sm font-bold text-slate-900">Avg Hourly Rate ($)</Label>
            </div>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-900 font-bold">$</span>
              <Input 
                type="number" 
                min={25} max={200}
                className="pl-8 h-11 rounded-xl text-slate-900 font-bold border-slate-300 focus:border-blue-600" 
                value={inputs.hourlyRate}
                onChange={(e) => handleInputChange('hourlyRate', e.target.value)}
              />
            </div>
          </div>

          {/* Hours per Week */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label className="text-sm font-bold text-slate-900">Hours spent per week</Label>
              <span className="font-bold text-blue-700 bg-blue-50 px-3 py-1 rounded-lg border border-blue-200">{inputs.hoursPerWeek} hrs</span>
            </div>
            <Slider 
              value={[inputs.hoursPerWeek]} 
              min={5} max={100} step={1}
              onValueChange={(val) => handleInputChange('hoursPerWeek', val[0])}
            />
          </div>

          {/* Data Sources */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label className="text-sm font-bold text-slate-900">Number of data sources</Label>
              <span className="font-bold text-blue-700 bg-blue-50 px-3 py-1 rounded-lg border border-blue-200">{inputs.dataSources}</span>
            </div>
            <Slider 
              value={[inputs.dataSources]} 
              min={1} max={20} step={1}
              onValueChange={(val) => handleInputChange('dataSources', val[0])}
            />
          </div>

          {/* Software Costs */}
          <div className="space-y-4 md:col-span-2">
            <div className="flex justify-between items-center">
              <Label className="text-sm font-bold text-slate-900">Current annual software costs ($)</Label>
            </div>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-900 font-bold">$</span>
              <Input 
                type="number" 
                min={0} max={500000} step={1000}
                className="pl-8 h-11 rounded-xl text-slate-900 font-bold border-slate-300 focus:border-blue-600" 
                value={inputs.softwareCosts}
                onChange={(e) => handleInputChange('softwareCosts', e.target.value)}
              />
            </div>
          </div>
        </div>

        <Button 
          type="submit" 
          size="lg" 
          className="w-full h-14 bg-blue-700 hover:bg-blue-800 text-white font-bold text-lg rounded-xl shadow-lg transition-all hover:scale-[1.02]"
        >
          <Calculator className="mr-2 w-5 h-5" />
          See Your Savings
        </Button>
      </form>
    </motion.div>
  );
};

export default ROICalculatorForm;