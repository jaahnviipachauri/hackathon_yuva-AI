import React from 'react';
import { Thermometer, MapPin, Building, TreePine, Factory } from 'lucide-react';

const HeatZoneAnalysis = ({ heatZones, cityName }) => {
  if (!heatZones || heatZones.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-100 rounded-lg">
        <p className="text-gray-600">Heat zone data not available</p>
      </div>
    );
  }

  const getZoneIcon = (zoneType) => {
    switch (zoneType) {
      case 'Urban Core': return Building;
      case 'Industrial': return Factory;
      case 'Residential': return MapPin;
      case 'Commercial': return Building;
      case 'Green Space': return TreePine;
      default: return Thermometer;
    }
  };

  const getZoneColor = (intensity) => {
    if (intensity > 0.8) return 'bg-red-500';
    if (intensity > 0.6) return 'bg-orange-500';
    if (intensity > 0.4) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getIntensityLevel = (intensity) => {
    if (intensity > 0.8) return 'Extreme';
    if (intensity > 0.6) return 'High';
    if (intensity > 0.4) return 'Medium';
    return 'Low';
  };

  return (
    <div className="space-y-6 bg-white rounded-xl p-6 shadow-lg border border-green-200">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-green-800 mb-2 flex items-center justify-center">
          <span className="text-3xl mr-3">🌡️</span>
          Heat Zone Analysis
        </h3>
        <p className="text-green-600">Detailed thermal zone mapping and analysis</p>
        <div className="mt-3 flex justify-center">
          <div className="w-24 h-1 bg-gradient-to-r from-green-400 to-red-400 rounded-full"></div>
        </div>
        <div className="mt-4 text-sm text-gray-600 bg-green-50 px-4 py-2 rounded-lg inline-block">
          {heatZones.length} zones analyzed
        </div>
      </div>

      {/* Heat zones grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {heatZones.map((zone, index) => {
          const Icon = getZoneIcon(zone.zone_type);
          const intensityLevel = getIntensityLevel(zone.intensity);
          
          return (
            <div key={index} className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <Icon className="w-5 h-5 text-gray-600" />
                  <div>
                    <span className="font-medium text-gray-800 block">{zone.location_name || zone.zone_type}</span>
                    {zone.location_name && (
                      <span className="text-sm text-gray-500">{zone.zone_type}</span>
                    )}
                  </div>
                </div>
                <div className={`w-3 h-3 rounded-full ${getZoneColor(zone.intensity)}`}></div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Temperature:</span>
                  <span className="font-semibold">{zone.temperature}°C</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Intensity:</span>
                  <span className={`font-semibold ${
                    zone.intensity > 0.8 ? 'text-red-600' :
                    zone.intensity > 0.6 ? 'text-orange-600' :
                    zone.intensity > 0.4 ? 'text-yellow-600' : 'text-green-600'
                  }`}>
                    {intensityLevel}
                  </span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Score:</span>
                  <span className="font-semibold">{Math.round(zone.intensity * 100)}/100</span>
                </div>
              </div>
              
              {/* Intensity bar */}
              <div className="mt-3">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${getZoneColor(zone.intensity)}`}
                    style={{ width: `${zone.intensity * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary statistics */}
      <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-6">
        <h4 className="font-semibold text-gray-800 mb-4">📊 Zone Summary</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-red-600">
              {heatZones.filter(z => z.intensity > 0.8).length}
            </div>
            <div className="text-sm text-gray-600">Extreme</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-orange-600">
              {heatZones.filter(z => z.intensity > 0.6 && z.intensity <= 0.8).length}
            </div>
            <div className="text-sm text-gray-600">High</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-yellow-600">
              {heatZones.filter(z => z.intensity > 0.4 && z.intensity <= 0.6).length}
            </div>
            <div className="text-sm text-gray-600">Medium</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">
              {heatZones.filter(z => z.intensity <= 0.4).length}
            </div>
            <div className="text-sm text-gray-600">Low</div>
          </div>
        </div>
      </div>

      {/* Recommendations based on zones */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h4 className="font-semibold text-yellow-800 mb-2">🎯 Zone-Specific Recommendations</h4>
        <ul className="text-sm text-yellow-700 space-y-1">
          {heatZones.some(z => z.zone_type === 'Industrial' && z.intensity > 0.7) && (
            <li>• Industrial zones need immediate cooling interventions</li>
          )}
          {heatZones.some(z => z.zone_type === 'Urban Core' && z.intensity > 0.8) && (
            <li>• Urban core requires high-density green infrastructure</li>
          )}
          {heatZones.some(z => z.zone_type === 'Green Space' && z.intensity < 0.3) && (
            <li>• Green spaces are performing well - expand similar areas</li>
          )}
          {heatZones.filter(z => z.intensity > 0.6).length > 2 && (
            <li>• Multiple high-intensity zones detected - city-wide cooling strategy needed</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default HeatZoneAnalysis;
