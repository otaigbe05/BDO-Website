/**
 * ROI Calculator Logic Utility
 */

export const calculateAnnualManualReportingHours = (hoursPerWeek) => hoursPerWeek * 52;

export const calculateAnnualManualReportingCost = (annualHours, hourlyRate, numEmployees) => 
  annualHours * hourlyRate * numEmployees;

export const calculateTimeSaved = (annualHours) => 
  annualHours * 0.60; // 60% reduction

export const calculateCostSaved = (timeSaved, hourlyRate, numEmployees) => 
  timeSaved * hourlyRate * numEmployees;

export const calculateSoftwareCostReduction = (currentSoftwareCosts) => 
  currentSoftwareCosts * 0.30; // 30% reduction

export const calculateTotalAnnualSavings = (costSaved, softwareCostReduction) => 
  costSaved + softwareCostReduction;

export const calculateROI = (totalSavings, omisCost = 948) => 
  (totalSavings / omisCost) * 100;

export const calculatePaybackPeriod = (totalSavings, omisCost = 948) => 
  totalSavings > 0 ? (omisCost / (totalSavings / 12)) : 0; // months to break even

export const calculateAllMetrics = (inputs) => {
  const { employees, hourlyRate, hoursPerWeek, softwareCosts } = inputs;
  const omisCost = 948; // $79/mo * 12 for Professional tier
  
  const annualHours = calculateAnnualManualReportingHours(hoursPerWeek);
  const annualCost = calculateAnnualManualReportingCost(annualHours, hourlyRate, employees);
  
  const timeSavedHours = calculateTimeSaved(annualHours);
  const costSaved = calculateCostSaved(timeSavedHours, hourlyRate, employees);
  
  const softwareCostReduction = calculateSoftwareCostReduction(softwareCosts);
  const totalSavings = calculateTotalAnnualSavings(costSaved, softwareCostReduction);
  
  const roi = calculateROI(totalSavings, omisCost);
  const paybackPeriod = calculatePaybackPeriod(totalSavings, omisCost);
  
  return {
    annualHours,
    annualCost,
    timeSavedHours,
    costSaved,
    softwareCostReduction,
    totalSavings,
    roi,
    paybackPeriod,
    omisCost,
    afterOmisReportingCost: annualCost - costSaved,
    afterOmisSoftwareCost: softwareCosts - softwareCostReduction
  };
};