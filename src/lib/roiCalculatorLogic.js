/**
 * ROI Calculator Logic Utility
 *
 * Models the two mechanisms OMIS actually affects for an appointment-based
 * business: deposits recovered on no-shows, and admin time saved by letting
 * clients self-book instead of the owner/staff booking manually.
 */

export const OMIS_MONTHLY_COST = 39;
export const OMIS_ANNUAL_COST = OMIS_MONTHLY_COST * 12; // 468, plus applicable taxes

export const calculateNoShowsPerWeek = (appointmentsPerWeek, noShowRatePercent) =>
  appointmentsPerWeek * (noShowRatePercent / 100);

export const calculateAnnualDepositsRecovered = (noShowsPerWeek, depositAmount) =>
  noShowsPerWeek * 52 * depositAmount;

export const calculateAnnualAdminHoursSaved = (adminHoursPerWeek) =>
  adminHoursPerWeek * 52;

export const calculateAnnualAdminCostSaved = (annualAdminHoursSaved, hourlyRate) =>
  annualAdminHoursSaved * hourlyRate;

export const calculateAllMetrics = (inputs) => {
  const { appointmentsPerWeek, depositAmount, noShowRate, adminHoursPerWeek, hourlyRate } = inputs;
  const omisCost = OMIS_ANNUAL_COST;

  const noShowsPerWeek = calculateNoShowsPerWeek(appointmentsPerWeek, noShowRate);
  const annualDepositsRecovered = calculateAnnualDepositsRecovered(noShowsPerWeek, depositAmount);

  const annualAdminHoursSaved = calculateAnnualAdminHoursSaved(adminHoursPerWeek);
  const annualAdminCostSaved = calculateAnnualAdminCostSaved(annualAdminHoursSaved, hourlyRate);

  const totalAnnualValue = annualDepositsRecovered + annualAdminCostSaved;
  const netAnnualValue = totalAnnualValue - omisCost;
  const roi = omisCost > 0 ? (netAnnualValue / omisCost) * 100 : 0;
  const paybackMonths = totalAnnualValue > 0 ? omisCost / (totalAnnualValue / 12) : 0;

  return {
    noShowsPerWeek,
    annualDepositsRecovered,
    annualAdminHoursSaved,
    annualAdminCostSaved,
    totalAnnualValue,
    omisCost,
    netAnnualValue,
    roi,
    paybackMonths,
  };
};
