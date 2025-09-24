import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const TemperatureChart = ({ historicalData }) => {
  if (!historicalData || historicalData.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-100 rounded-lg">
        <p className="text-gray-600">No historical data available</p>
      </div>
    );
  }

  // Prepare data for the chart
  const chartData = historicalData.map(year => ({
    year: year.year,
    average: year.average_temp,
    max: year.max_temp,
    min: year.min_temp
  }));

  return (
    <div className="w-full h-80 bg-white rounded-xl p-6 shadow-lg border border-green-200">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold mb-2 text-green-800 flex items-center justify-center">
          <span className="text-3xl mr-3">📈</span>
          Temperature Trends (5 Years)
        </h3>
        <p className="text-green-600">Historical temperature analysis and patterns</p>
        <div className="mt-3 flex justify-center">
          <div className="w-20 h-1 bg-gradient-to-r from-green-400 to-blue-400 rounded-full"></div>
        </div>
      </div>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="year" />
          <YAxis label={{ value: 'Temperature (°C)', angle: -90, position: 'insideLeft' }} />
          <Tooltip 
            formatter={(value, name) => [`${value}°C`, name]}
            labelFormatter={(label) => `Year: ${label}`}
          />
          <Line 
            type="monotone" 
            dataKey="average" 
            stroke="#3b82f6" 
            strokeWidth={3}
            name="Average"
            dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
          />
          <Line 
            type="monotone" 
            dataKey="max" 
            stroke="#ef4444" 
            strokeWidth={2}
            name="Maximum"
            dot={{ fill: '#ef4444', strokeWidth: 2, r: 3 }}
          />
          <Line 
            type="monotone" 
            dataKey="min" 
            stroke="#22c55e" 
            strokeWidth={2}
            name="Minimum"
            dot={{ fill: '#22c55e', strokeWidth: 2, r: 3 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TemperatureChart;
