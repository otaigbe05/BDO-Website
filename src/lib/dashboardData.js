import { subMonths, format } from 'date-fns';

export const getTimeRangeLabels = (range) => {
  const months = range === 'Last 3 months' ? 3 : range === 'Last 6 months' ? 6 : 12;
  const labels = [];
  for (let i = months - 1; i >= 0; i--) {
    labels.push(format(subMonths(new Date(), i), 'MMM'));
  }
  return labels;
};

export const getRevenueData = (timeRange, salesCategory, clientSegment) => {
  const months = timeRange === 'Last 3 months' ? 3 : timeRange === 'Last 6 months' ? 6 : 12;
  
  // Base values based on segment
  let baseValue = 10000;
  if (clientSegment === 'Returning Clients') baseValue = 15000;
  if (clientSegment === 'All Clients') baseValue = 25000;

  // Multiplier based on category
  let categoryMultiplier = 1;
  if (salesCategory === 'Products') categoryMultiplier = 0.8;
  if (salesCategory === 'Mixed') categoryMultiplier = 1.4;

  const data = [];
  for (let i = 0; i < months; i++) {
    // Generate a somewhat realistic upward or fluctuating trend
    const noise = Math.random() * 0.4 - 0.2; // +/- 20%
    const trend = 1 + (i * 0.05); // 5% growth per month
    
    // Calculate simulated revenue
    const value = Math.round(baseValue * categoryMultiplier * trend * (1 + noise));
    // Calculate height percentage (relative to a max cap for visualization)
    const height = Math.min(Math.round((value / (baseValue * categoryMultiplier * 1.8)) * 100), 100);

    data.push({
      value,
      height: Math.max(height, 20) // Minimum 20% height for visual aesthetics
    });
  }
  return data;
};

export const getSalesCategoryData = (salesCategory) => {
  if (salesCategory === 'Services') return { main: 75, label: 'Services' };
  if (salesCategory === 'Products') return { main: 65, label: 'Products' };
  return { main: 45, label: 'Mixed' }; // Mixed might show 45% one type, 55% other
};

export const getKPIData = (timeRange, salesCategory, clientSegment) => {
    // Deterministic generation based on string hash or similar logic isn't strictly needed, 
    // but random generation on each render needs to be handled by state in the component.
    // Here we return base values that the component can randomize slightly or use as is.

    let revBase = 120000;
    let growthBase = 12.5;
    let clientBase = 1200;
    let convBase = 3.2;

    if (timeRange === 'Last 3 months') { revBase /= 2; }
    if (timeRange === 'Last 12 months') { revBase *= 2; }

    if (salesCategory === 'Products') { revBase *= 0.8; convBase = 2.1; }
    if (salesCategory === 'Mixed') { revBase *= 1.5; clientBase *= 1.2; }

    if (clientSegment === 'New Clients') { revBase *= 0.4; growthBase = 25.0; clientBase *= 0.3; }
    if (clientSegment === 'Returning Clients') { revBase *= 0.6; growthBase = 5.0; convBase = 8.5; }

    // Add some "randomness" simulation fixed to the inputs
    const randomFactor = (str) => {
        let hash = 0;
        for (let i = 0; i < str.length; i++) hash += str.charCodeAt(i);
        return (hash % 100) / 100;
    };
    
    const seed = randomFactor(timeRange + salesCategory + clientSegment);

    return {
        revenue: Math.round(revBase * (0.9 + seed * 0.2)),
        growth: (growthBase * (0.8 + seed * 0.4)).toFixed(1),
        clients: Math.round(clientBase * (0.9 + seed * 0.2)),
        conversion: (convBase * (0.9 + seed * 0.2)).toFixed(1),
        revTrend: seed > 0.5 ? '+' : '-',
        growthTrend: seed > 0.3 ? '+' : '-',
        clientTrend: '+',
        convTrend: seed > 0.6 ? '+' : '-'
    };
};