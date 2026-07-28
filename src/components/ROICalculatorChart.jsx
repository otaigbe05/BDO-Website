import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const ROICalculatorChart = ({ results, inputs }) => {
  if (!results || !inputs) return null;

  const data = [
    {
      name: 'Deposits Recovered',
      'Annual Value': results.annualDepositsRecovered,
    },
    {
      name: 'Admin Time Saved',
      'Annual Value': results.annualAdminCostSaved,
    },
    {
      name: 'Net of OMIS Cost',
      'Annual Value': results.netAnnualValue,
    }
  ];

  const formatCurrency = (value) =>
    new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD', maximumFractionDigits: 0 }).format(value);

  return (
    <div className="h-[400px] w-full mt-8">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
          <XAxis dataKey="name" stroke="#64748b" fontSize={14} fontWeight={500} />
          <YAxis 
            tickFormatter={(value) => `$${value / 1000}k`} 
            stroke="#64748b"
          />
          <Tooltip 
            formatter={(value) => formatCurrency(value)}
            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
          />
          <Legend wrapperStyle={{ paddingTop: '20px' }} />
          <Bar dataKey="Annual Value" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={60} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ROICalculatorChart;