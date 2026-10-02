/**
 * ROI Calculator Logic Utility
 *
 * Models the two mechanisms OMIS actually affects for an appointment-based
 * business: deposits recovered on no-shows, and admin time saved by letting
 * clients self-book instead of the owner/staff booking manually.
 */

// Public OMIS plans in CAD (source of truth: omis-crm.com/pricing). Month-to-month.
export const OMIS_PLANS = {
  starter: { name: 'Starter', monthly: 29 },
  professional: { name: 'Professional', monthly: 79 },
  enterprise: { name: 'Enterprise', monthly: 199 },
};
export const DEFAULT_PLAN = 'starter';

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
  const plan = OMIS_PLANS[inputs.plan] || OMIS_PLANS[DEFAULT_PLAN];
  const omisCost = plan.monthly * 12;

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
    planName: plan.name,
    planMonthly: plan.monthly,
    omisCost,
    netAnnualValue,
    roi,
    paybackMonths,
  };
};
