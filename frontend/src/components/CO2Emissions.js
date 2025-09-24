import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { TrendingUp, Factory, Car, TreePine, Wind, Zap } from 'lucide-react';


const CO2Emissions = ({ co2Data }) => {
  if (!co2Data) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-green-200">
        <div className="text-center text-gray-500">
          <Factory className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <p>CO2 emissions data not available</p>
        </div>
      </div>
    );
  }

  const { 
    total_annual_co2, 
    co2_per_capita, 
    co2_per_sqkm, 
    carbon_footprint_per_person,
    reduction_potential,
    historical_trend,
    emission_factors,
    insights
  } = co2Data;

  // Prepare data for charts
  const historicalChartData = historical_trend.map(item => ({
    year: item.year.toString(),
    total: item.total_co2,
    perCapita: item.per_capita,
    perSqkm: item.per_sqkm
  }));

  const reductionData = Object.entries(reduction_potential.by_measure).map(([key, value]) => ({
    name: key.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
    shortName: key === 'tree_planting' ? 'Trees' :
               key === 'green_roofs' ? 'Green Roofs' :
               key === 'cool_pavements' ? 'Cool Pavements' :
               key === 'renewable_energy' ? 'Renewable Energy' :
               key === 'public_transport' ? 'Public Transport' :
               key.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
    value: Math.round(value),
    percentage: ((value / total_annual_co2) * 100).toFixed(1)
  })).filter(item => item.value > 0);

  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <Factory className="w-8 h-8 text-green-600 mr-3" />
          <h2 className="text-3xl font-bold text-green-800">CO2 Emissions Analysis</h2>
        </div>
        <div className="w-24 h-1 bg-gradient-to-r from-green-400 to-blue-400 rounded-full mx-auto"></div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-4 shadow-lg border-2 border-red-200 text-center min-h-[120px] flex flex-col justify-center">
          <div className="text-lg sm:text-xl lg:text-2xl font-bold text-red-600 mb-2 truncate" title={total_annual_co2.toLocaleString()}>
            {total_annual_co2.toLocaleString()}
          </div>
          <div className="text-red-800 font-semibold text-sm">Total Annual CO2</div>
          <div className="text-xs text-red-600 mt-1">Tons per year</div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4 shadow-lg border-2 border-orange-200 text-center min-h-[120px] flex flex-col justify-center">
          <div className="text-lg sm:text-xl lg:text-2xl font-bold text-orange-600 mb-2 truncate" title={co2_per_capita.toFixed(2)}>
            {co2_per_capita.toFixed(1)}
          </div>
          <div className="text-orange-800 font-semibold text-sm">Per Capita</div>
          <div className="text-xs text-orange-600 mt-1">Tons per person</div>
        </div>

        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-4 shadow-lg border-2 border-yellow-200 text-center min-h-[120px] flex flex-col justify-center">
          <div className="text-lg sm:text-xl lg:text-2xl font-bold text-yellow-600 mb-2 truncate" title={co2_per_sqkm.toLocaleString()}>
            {co2_per_sqkm.toLocaleString()}
          </div>
          <div className="text-yellow-800 font-semibold text-sm">Per Square KM</div>
          <div className="text-xs text-yellow-600 mt-1">Tons per sq km</div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 shadow-lg border-2 border-purple-200 text-center min-h-[120px] flex flex-col justify-center">
          <div className="text-lg sm:text-xl lg:text-2xl font-bold text-purple-600 mb-2 truncate" title={carbon_footprint_per_person.toFixed(2)}>
            {carbon_footprint_per_person.toFixed(1)}
          </div>
          <div className="text-purple-800 font-semibold text-sm">Carbon Footprint</div>
          <div className="text-xs text-purple-600 mt-1">Tons per person</div>
        </div>
      </div>

      {/* Historical Trend Chart */}
      <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-green-200">
        <div className="flex items-center mb-6">
          <TrendingUp className="w-6 h-6 text-green-600 mr-3" />
          <h3 className="text-xl font-bold text-green-800">Historical CO2 Emissions Trend</h3>
        </div>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={historicalChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="year" 
                stroke="#6b7280"
                fontSize={12}
              />
              <YAxis 
                stroke="#6b7280"
                fontSize={12}
                tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`}
              />
              <Tooltip 
                formatter={(value, name) => [
                  `${value.toLocaleString()} tons`,
                  name === 'total' ? 'Total CO2' : 
                  name === 'perCapita' ? 'Per Capita' : 'Per Sq Km'
                ]}
                labelStyle={{ color: '#374151' }}
                contentStyle={{ 
                  backgroundColor: '#f9fafb', 
                  border: '1px solid #d1d5db',
                  borderRadius: '8px'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="total" 
                stroke="#ef4444" 
                strokeWidth={3}
                dot={{ fill: '#ef4444', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#ef4444', strokeWidth: 2 }}
              />
              <Line 
                type="monotone" 
                dataKey="perCapita" 
                stroke="#3b82f6" 
                strokeWidth={2}
                dot={{ fill: '#3b82f6', strokeWidth: 2, r: 3 }}
              />
              <Line 
                type="monotone" 
                dataKey="perSqkm" 
                stroke="#10b981" 
                strokeWidth={2}
                dot={{ fill: '#10b981', strokeWidth: 2, r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Reduction Potential */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Reduction Potential Chart */}
        <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-green-200">
          <div className="flex items-center mb-6">
            <TreePine className="w-6 h-6 text-green-600 mr-3" />
            <h3 className="text-xl font-bold text-green-800">Reduction Potential by Measure</h3>
          </div>
          <div className="h-96">
            {reductionData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={reductionData}
                    cx="50%"
                    cy="45%"
                    labelLine={false}
                    label={false}
                    outerRadius={80}
                    innerRadius={20}
                    fill="#8884d8"
                    dataKey="value"
                    paddingAngle={2}
                    stroke="#ffffff"
                    strokeWidth={2}
                  >
                    {reductionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value, name, props) => [
                      `${value.toLocaleString()} tons`, 
                      props.payload.name
                    ]}
                    labelFormatter={(label) => `Reduction Potential: ${label}`}
                    contentStyle={{ 
                      backgroundColor: '#f9fafb', 
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      padding: '8px'
                    }}
                  />
                  <Legend 
                    verticalAlign="bottom" 
                    height={80}
                    iconType="circle"
                    formatter={(value, entry) => (
                      <span style={{ 
                        color: entry.color, 
                        fontSize: '11px',
                        fontWeight: '500',
                        display: 'block',
                        marginBottom: '3px',
                        lineHeight: '1.2'
                      }}>
                        {entry.payload?.shortName || value}
                      </span>
                    )}
                    wrapperStyle={{
                      paddingTop: '10px',
                      fontSize: '11px',
                      textAlign: 'center'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                <div className="text-center">
                  <TreePine className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p>No reduction data available</p>
                </div>
              </div>
            )}
          </div>
          
          {/* Custom Legend with Details */}
          {reductionData.length > 0 && (
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {reductionData.map((entry, index) => (
                <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <div 
                    className="w-4 h-4 rounded-full mr-3 flex-shrink-0"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  ></div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm text-gray-800 truncate">
                      {entry.shortName}
                    </div>
                    <div className="text-xs text-gray-600">
                      {entry.percentage}% • {entry.value.toLocaleString()} tons
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {/* Summary Stats */}
          {reductionData.length > 0 && (
            <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-lg font-bold text-green-600 truncate" title={reduction_potential.total_potential.toLocaleString()}>
                    {reduction_potential.total_potential.toLocaleString()}
                  </div>
                  <div className="text-sm text-green-800">Total Reduction Potential</div>
                  <div className="text-xs text-green-600">Tons CO2 per year</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-600">
                    {reduction_potential.percentage_reduction}%
                  </div>
                  <div className="text-sm text-blue-800">Percentage Reduction</div>
                  <div className="text-xs text-blue-600">From current emissions</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Emission Factors */}
        <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-green-200">
          <div className="flex items-center mb-6">
            <Zap className="w-6 h-6 text-green-600 mr-3" />
            <h3 className="text-xl font-bold text-green-800">Emission Impact Factors</h3>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg border border-red-200 min-h-[60px]">
              <div className="flex items-center flex-1">
                <Car className="w-4 h-4 text-red-600 mr-2 flex-shrink-0" />
                <span className="font-semibold text-red-800 text-sm">Temperature Impact</span>
              </div>
              <span className="text-lg font-bold text-red-600 ml-2">
                {emission_factors.temperature_impact}x
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg border border-orange-200 min-h-[60px]">
              <div className="flex items-center flex-1">
                <Wind className="w-4 h-4 text-orange-600 mr-2 flex-shrink-0" />
                <span className="font-semibold text-orange-800 text-sm">UHI Impact</span>
              </div>
              <span className="text-lg font-bold text-orange-600 ml-2">
                {emission_factors.uhi_impact}x
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg border border-yellow-200 min-h-[60px]">
              <div className="flex items-center flex-1">
                <Factory className="w-4 h-4 text-yellow-600 mr-2 flex-shrink-0" />
                <span className="font-semibold text-yellow-800 text-sm">AQI Impact</span>
              </div>
              <span className="text-lg font-bold text-yellow-600 ml-2">
                {emission_factors.aqi_impact}x
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Reduction Potential Summary */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 shadow-lg border-2 border-green-200">
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold text-green-800 mb-2">Total Reduction Potential</h3>
          <div className="w-32 h-1 bg-gradient-to-r from-green-400 to-blue-400 rounded-full mx-auto"></div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="text-center min-h-[100px] flex flex-col justify-center">
            <div className="text-lg sm:text-xl font-bold text-green-600 mb-2 truncate" title={reduction_potential.total_potential.toLocaleString()}>
              {reduction_potential.total_potential.toLocaleString()}
            </div>
            <div className="text-green-800 font-semibold text-sm">Tons CO2 Reduction</div>
            <div className="text-xs text-green-600">Annual potential</div>
          </div>
          <div className="text-center min-h-[100px] flex flex-col justify-center">
            <div className="text-2xl sm:text-3xl font-bold text-blue-600 mb-2 break-words">
              {reduction_potential.percentage_reduction}%
            </div>
            <div className="text-blue-800 font-semibold text-sm">Percentage Reduction</div>
            <div className="text-xs text-blue-600">From current levels</div>
          </div>
          <div className="text-center min-h-[100px] flex flex-col justify-center">
            <div className="text-2xl sm:text-3xl font-bold text-purple-600 mb-2 break-words">
              {((reduction_potential.total_potential / total_annual_co2) * 100).toFixed(1)}%
            </div>
            <div className="text-purple-800 font-semibold text-sm">Emission Reduction</div>
            <div className="text-xs text-purple-600">With all measures</div>
          </div>
        </div>
      </div>

      {/* CO2 Insights and Projections */}
      {insights && (
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 shadow-lg border-2 border-blue-200">
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold text-blue-800 mb-2">CO2 Emissions Insights & Projections</h3>
            <div className="w-32 h-1 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full mx-auto"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center min-h-[100px] flex flex-col justify-center">
              <div className="text-2xl sm:text-3xl font-bold text-blue-600 mb-2 break-words">
                {insights.annual_growth_rate}%
              </div>
              <div className="text-blue-800 font-semibold text-sm">Annual Growth Rate</div>
              <div className="text-xs text-blue-600">Current trend</div>
            </div>
            <div className="text-center min-h-[100px] flex flex-col justify-center">
              <div className="text-lg sm:text-xl font-bold text-purple-600 mb-2 truncate" title={insights.projected_2030.toLocaleString()}>
                {insights.projected_2030.toLocaleString()}
              </div>
              <div className="text-purple-800 font-semibold text-sm">Projected 2030</div>
              <div className="text-xs text-purple-600">Tons CO2</div>
            </div>
            <div className="text-center min-h-[100px] flex flex-col justify-center">
              <div className="text-lg sm:text-xl font-bold text-green-600 mb-2 truncate" title={insights.carbon_budget_remaining.toLocaleString()}>
                {insights.carbon_budget_remaining.toLocaleString()}
              </div>
              <div className="text-green-800 font-semibold text-sm">Carbon Budget</div>
              <div className="text-xs text-green-600">Remaining capacity</div>
            </div>
            <div className="text-center min-h-[100px] flex flex-col justify-center">
              <div className="text-2xl sm:text-3xl font-bold text-orange-600 mb-2 break-words">
                {insights.net_zero_target}
              </div>
              <div className="text-orange-800 font-semibold text-sm">Net Zero Target</div>
              <div className="text-xs text-orange-600">Year</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CO2Emissions;
