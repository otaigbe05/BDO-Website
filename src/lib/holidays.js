import { isSameDay } from "date-fns";

/**
 * Returns a list of Canadian public holidays for the given year (2024-2026 supported).
 * Includes: New Year's, Family Day, Good Friday, Victoria Day, Canada Day, 
 * Civic Holiday, Labour Day, Truth & Reconciliation, Thanksgiving, Christmas, Boxing Day.
 */
export const getCanadianHolidays = (year) => {
  const holidays = [];
  
  // Fixed Dates
  holidays.push(new Date(year, 0, 1)); // New Year's Day - Jan 1
  holidays.push(new Date(year, 6, 1)); // Canada Day - Jul 1
  holidays.push(new Date(year, 8, 30)); // Truth & Reconciliation - Sep 30
  holidays.push(new Date(year, 11, 25)); // Christmas - Dec 25
  holidays.push(new Date(year, 11, 26)); // Boxing Day - Dec 26

  // Dynamic Dates (Hardcoded for 2024-2026 for simplicity & reliability)
  if (year === 2024) {
    holidays.push(new Date(2024, 1, 19)); // Family Day
    holidays.push(new Date(2024, 2, 29)); // Good Friday
    holidays.push(new Date(2024, 4, 20)); // Victoria Day
    holidays.push(new Date(2024, 7, 5));  // Civic Holiday
    holidays.push(new Date(2024, 8, 2));  // Labour Day
    holidays.push(new Date(2024, 9, 14)); // Thanksgiving
  } else if (year === 2025) {
    holidays.push(new Date(2025, 1, 17)); // Family Day
    holidays.push(new Date(2025, 3, 18)); // Good Friday
    holidays.push(new Date(2025, 4, 19)); // Victoria Day
    holidays.push(new Date(2025, 7, 4));  // Civic Holiday
    holidays.push(new Date(2025, 8, 1));  // Labour Day
    holidays.push(new Date(2025, 9, 13)); // Thanksgiving
  } else if (year === 2026) {
    holidays.push(new Date(2026, 1, 16)); // Family Day
    holidays.push(new Date(2026, 3, 3));  // Good Friday
    holidays.push(new Date(2026, 4, 18)); // Victoria Day
    holidays.push(new Date(2026, 7, 3));  // Civic Holiday
    holidays.push(new Date(2026, 8, 7));  // Labour Day
    holidays.push(new Date(2026, 9, 12)); // Thanksgiving
  }

  return holidays;
};

/**
 * Checks if a specific date is a holiday.
 */
export const isHoliday = (date) => {
  const year = date.getFullYear();
  const holidays = getCanadianHolidays(year);
  return holidays.some(holiday => isSameDay(date, holiday));
};

/**
 * Checks if a specific date is a weekend (Saturday or Sunday).
 */
export const isWeekend = (date) => {
  const day = date.getDay();
  return day === 0 || day === 6; // 0 is Sunday, 6 is Saturday
};

/**
 * Combined check for booking availability.
 */
export const isDateUnavailable = (date) => {
  return isWeekend(date) || isHoliday(date);
};