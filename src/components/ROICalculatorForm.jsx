import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calculator, Settings2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const PRESETS = {
  custom: { name: 'Custom Input', appointmentsPerWeek: 20, depositAmount: 30, noShowRate: 10, adminHoursPerWeek: 5, hourlyRate: 25 },
  tattoo: { name: 'Tattoo & Piercing Studio', appointmentsPerWeek: 20, depositAmount: 50, noShowRate: 15, adminHoursPerWeek: 8, hourlyRate: 30 },
  barber: { name: 'Barbershop', appointmentsPerWeek: 60, depositAmount: 15, noShowRate: 10, adminHoursPerWeek: 6, hourlyRate: 25 },
  auto: { name: 'Auto Repair Shop', appointmentsPerWeek: 25, depositAmount: 75, noShowRate: 12, adminHoursPerWeek: 10, hourlyRate: 30 },
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
          <p className="text-slate-800 font-medium text-sm">Starting points below — adjust to match your business</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="mb-6">
          <Label className="text-sm font-bold text-slate-900 mb-2 block">Business Type</Label>
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
          {/* Appointments per week */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label className="text-sm font-bold text-slate-900">Appointments per week</Label>
              <span className="font-bold text-blue-700 bg-blue-50 px-3 py-1 rounded-lg border border-blue-200">{inputs.appointmentsPerWeek}</span>
            </div>
            <Slider
              value={[inputs.appointmentsPerWeek]}
              min={1} max={150} step={1}
              onValueChange={(val) => handleInputChange('appointmentsPerWeek', val[0])}
            />
          </div>

          {/* Deposit Amount */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label className="text-sm font-bold text-slate-900">Typical deposit per booking ($)</Label>
            </div>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-900 font-bold">$</span>
              <Input
                type="number"
                min={0} max={1000}
                className="pl-8 h-11 rounded-xl text-slate-900 font-bold border-slate-300 focus:border-blue-600"
                value={inputs.depositAmount}
                onChange={(e) => handleInputChange('depositAmount', e.target.value)}
              />
            </div>
          </div>

          {/* No-Show Rate */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label className="text-sm font-bold text-slate-900">Current no-show rate</Label>
              <span className="font-bold text-blue-700 bg-blue-50 px-3 py-1 rounded-lg border border-blue-200">{inputs.noShowRate}%</span>
            </div>
            <Slider
              value={[inputs.noShowRate]}
              min={0} max={50} step={1}
              onValueChange={(val) => handleInputChange('noShowRate', val[0])}
            />
          </div>

          {/* Admin Hours per Week */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label className="text-sm font-bold text-slate-900">Hours/week on manual booking</Label>
              <span className="font-bold text-blue-700 bg-blue-50 px-3 py-1 rounded-lg border border-blue-200">{inputs.adminHoursPerWeek} hrs</span>
            </div>
            <Slider
              value={[inputs.adminHoursPerWeek]}
              min={0} max={40} step={1}
              onValueChange={(val) => handleInputChange('adminHoursPerWeek', val[0])}
            />
          </div>

          {/* Hourly Rate */}
          <div className="space-y-4 md:col-span-2">
            <div className="flex justify-between items-center">
              <Label className="text-sm font-bold text-slate-900">Value of your time ($/hr)</Label>
            </div>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-900 font-bold">$</span>
              <Input
                type="number"
                min={0} max={200}
                className="pl-8 h-11 rounded-xl text-slate-900 font-bold border-slate-300 focus:border-blue-600"
                value={inputs.hourlyRate}
                onChange={(e) => handleInputChange('hourlyRate', e.target.value)}
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
