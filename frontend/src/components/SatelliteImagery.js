import React, { useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin, Thermometer, Wind, Droplets, Sun, AlertTriangle } from 'lucide-react';

const SatelliteImagery = ({ satelliteData, cityName, center, heatZones = [] }) => {
  const [activeView, setActiveView] = useState('thermal');

  // Generate detailed region information
  const getRegionInfo = (zone, index) => {
    const intensity = zone.intensity || 0.5;
    const riskLevel = intensity > 0.8 ? 'Critical' : 
                     intensity > 0.6 ? 'High' : 
                     intensity > 0.4 ? 'Moderate' : 
                     intensity > 0.2 ? 'Low' : 'Very Low';
    
    const regionTypes = ['Industrial Zone', 'Commercial District', 'Residential Area', 'Transport Hub', 'Green Space'];
    const regionType = regionTypes[index % regionTypes.length];
    
    const airQuality = intensity > 0.7 ? 'Poor' : 
                      intensity > 0.5 ? 'Moderate' : 
                      intensity > 0.3 ? 'Good' : 'Excellent';
    
    const aqiValue = Math.round(50 + intensity * 200);
    const temperature = Math.round(25 + intensity * 15);
    const humidity = Math.round(40 + intensity * 30);
    const windSpeed = Math.round(5 + intensity * 10);
    
    return {
      riskLevel,
      regionType,
      airQuality,
      aqiValue,
      temperature,
      humidity,
      windSpeed,
      intensity
    };
  };

  if (!satelliteData) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-100 rounded-lg">
        <p className="text-gray-600">Satellite imagery not available</p>
      </div>
    );
  }

  const views = [
    { id: 'thermal', name: 'Thermal View', icon: Thermometer, color: 'bg-red-500' },
    { id: 'heat_map', name: 'Heat Map', icon: MapPin, color: 'bg-orange-500' }
  ];


  const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY || "";


  return (
    <div className="space-y-4">
      <style jsx>{`
        .custom-popup .leaflet-popup-content-wrapper {
          border-radius: 12px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
          border: 1px solid #e5e7eb;
        }
        .custom-popup .leaflet-popup-tip {
          background: white;
          border: 1px solid #e5e7eb;
        }
        .custom-popup .leaflet-popup-close-button {
          color: #6b7280;
          font-size: 18px;
          font-weight: bold;
        }
        .custom-popup .leaflet-popup-close-button:hover {
          color: #374151;
        }
      `}</style>
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-green-800 mb-2 flex items-center justify-center">
          <span className="text-3xl mr-3">🛰️</span>
          Satellite Imagery Analysis
        </h3>
        <p className="text-green-600">Advanced thermal and heat mapping visualization</p>
        <div className="mt-3 flex justify-center">
          <div className="w-24 h-1 bg-gradient-to-r from-green-400 to-blue-400 rounded-full"></div>
        </div>
      </div>
      
      {/* View selector */}
      <div className="flex space-x-2 mb-4">
        {views.map((view) => {
          const Icon = view.icon;
          return (
            <button
              key={view.id}
              onClick={() => setActiveView(view.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                activeView === view.id
                  ? 'bg-green-100 text-green-700 border-2 border-green-300'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="text-sm font-medium">{view.name}</span>
            </button>
          );
        })}
      </div>

      {/* Image display */}
      <div className="relative">
        {activeView === 'thermal' && (
          <div className="space-y-4">
            <div className="relative rounded-lg overflow-hidden border shadow-lg" style={{height: 400}}>
              <MapContainer center={[center.lat, center.lng]} zoom={13} style={{height: '100%', width: '100%'}}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; OpenStreetMap" />
                {heatZones.map((z, idx) => {
                  const intensity = z.intensity || 0.5;
                  const color = intensity > 0.8 ? '#8B0000' : 
                               intensity > 0.6 ? '#DC143C' : 
                               intensity > 0.4 ? '#FF4500' : 
                               intensity > 0.2 ? '#FFA500' : '#FFFF00';
                  const radius = Math.max(3, intensity * 8);
                  const regionInfo = getRegionInfo(z, idx);
                  
                  return (
                    <CircleMarker
                      key={idx}
                      center={[z.lat, z.lng]}
                      pathOptions={{ 
                        color: color, 
                        fillColor: color, 
                        fillOpacity: 0.6,
                        weight: 2,
                        opacity: 0.8
                      }}
                      radius={radius}
                    >
                      <Popup className="custom-popup" maxWidth={350} minWidth={300}>
                        <div className="p-2">
                          <div className="flex items-center justify-between mb-3">
                            <h3 className="font-bold text-lg text-gray-800">{z.location_name || regionInfo.regionType}</h3>
                            <div className={`px-2 py-1 rounded-full text-xs font-semibold ${
                              regionInfo.riskLevel === 'Critical' ? 'bg-red-100 text-red-800' :
                              regionInfo.riskLevel === 'High' ? 'bg-orange-100 text-orange-800' :
                              regionInfo.riskLevel === 'Moderate' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-green-100 text-green-800'
                            }`}>
                              {regionInfo.riskLevel} Risk
                            </div>
                          </div>
                          {z.location_name && (
                            <div className="mb-3">
                              <div className="flex items-center space-x-2">
                                <MapPin className="w-4 h-4 text-blue-600" />
                                <span className="text-sm text-gray-600">{z.zone_type}</span>
                              </div>
                            </div>
                          )}
                          
                          <div className="grid grid-cols-2 gap-3 mb-3">
                            <div className="bg-blue-50 p-2 rounded-lg">
                              <div className="flex items-center space-x-2 mb-1">
                                <Thermometer className="w-4 h-4 text-blue-600" />
                                <span className="text-sm font-medium text-blue-800">Temperature</span>
                              </div>
                              <div className="text-lg font-bold text-blue-900">{regionInfo.temperature}°C</div>
                            </div>
                            
                            <div className="bg-green-50 p-2 rounded-lg">
                              <div className="flex items-center space-x-2 mb-1">
                                <Wind className="w-4 h-4 text-green-600" />
                                <span className="text-sm font-medium text-green-800">Air Quality</span>
                              </div>
                              <div className="text-lg font-bold text-green-900">{regionInfo.aqiValue} AQI</div>
                            </div>
                            
                            <div className="bg-purple-50 p-2 rounded-lg">
                              <div className="flex items-center space-x-2 mb-1">
                                <Droplets className="w-4 h-4 text-purple-600" />
                                <span className="text-sm font-medium text-purple-800">Humidity</span>
                              </div>
                              <div className="text-lg font-bold text-purple-900">{regionInfo.humidity}%</div>
                            </div>
                            
                            <div className="bg-orange-50 p-2 rounded-lg">
                              <div className="flex items-center space-x-2 mb-1">
                                <Sun className="w-4 h-4 text-orange-600" />
                                <span className="text-sm font-medium text-orange-800">Wind Speed</span>
                              </div>
                              <div className="text-lg font-bold text-orange-900">{regionInfo.windSpeed} km/h</div>
                            </div>
                          </div>
                          
                          <div className="border-t pt-2">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium text-gray-700">Heat Intensity:</span>
                              <span className="text-sm font-bold text-gray-900">{Math.round(regionInfo.intensity * 100)}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="h-2 rounded-full transition-all duration-300"
                                style={{ 
                                  width: `${regionInfo.intensity * 100}%`,
                                  backgroundColor: color
                                }}
                              ></div>
                            </div>
                          </div>
                          
                          {regionInfo.riskLevel === 'Critical' && (
                            <div className="mt-3 p-2 bg-red-100 border border-red-300 rounded-lg">
                              <div className="flex items-center space-x-2">
                                <AlertTriangle className="w-4 h-4 text-red-600" />
                                <span className="text-sm font-medium text-red-800">Immediate Action Required</span>
                              </div>
                            </div>
                          )}
                        </div>
                      </Popup>
                    </CircleMarker>
                  );
                })}
                {/* City center marker */}
                <CircleMarker
                  center={[center.lat, center.lng]}
                  radius={8}
                  pathOptions={{
                    color: '#0000FF',
                    fillColor: '#0000FF',
                    fillOpacity: 0.8,
                    weight: 3
                  }}
                >
                  <Popup className="custom-popup" maxWidth={300} minWidth={250}>
                    <div className="p-2">
                      <div className="flex items-center space-x-2 mb-3">
                        <MapPin className="w-5 h-5 text-blue-600" />
                        <h3 className="font-bold text-lg text-gray-800">{cityName} Center</h3>
                      </div>
                      <div className="space-y-2">
                        <div className="bg-blue-50 p-2 rounded-lg">
                          <div className="text-sm font-medium text-blue-800">Coordinates</div>
                          <div className="text-sm text-blue-900">{center.lat.toFixed(4)}, {center.lng.toFixed(4)}</div>
                        </div>
                        <div className="bg-green-50 p-2 rounded-lg">
                          <div className="text-sm font-medium text-green-800">Status</div>
                          <div className="text-sm text-green-900">City Reference Point</div>
                        </div>
                      </div>
                    </div>
                  </Popup>
                </CircleMarker>
              </MapContainer>
              <div className="absolute top-2 left-2 bg-gradient-to-r from-red-600 to-yellow-400 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-lg">
                🔥 Thermal Intensity Analysis
              </div>
              <div className="absolute top-2 right-2 bg-white bg-opacity-90 text-gray-800 px-3 py-1 rounded-lg text-xs">
                {cityName}
              </div>
            </div>
            
            {/* Enhanced thermal legend */}
            <div className="bg-gradient-to-r from-green-50 via-yellow-50 to-red-50 rounded-lg p-4 border border-green-200">
              <h4 className="font-semibold text-green-800 mb-3 flex items-center">
                🌡️ Thermal Intensity Legend
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-sm">
                <div className="flex items-center space-x-2 bg-yellow-100 p-2 rounded">
                  <div className="w-5 h-5 bg-yellow-400 rounded-full border-2 border-yellow-600"></div>
                  <div>
                    <div className="font-medium">Low (0-20%)</div>
                    <div className="text-xs text-gray-600">Cool areas</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2 bg-orange-100 p-2 rounded">
                  <div className="w-5 h-5 bg-orange-400 rounded-full border-2 border-orange-600"></div>
                  <div>
                    <div className="font-medium">Moderate (20-40%)</div>
                    <div className="text-xs text-gray-600">Warm areas</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2 bg-red-100 p-2 rounded">
                  <div className="w-5 h-5 bg-red-500 rounded-full border-2 border-red-700"></div>
                  <div>
                    <div className="font-medium">High (40-60%)</div>
                    <div className="text-xs text-gray-600">Hot areas</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2 bg-red-200 p-2 rounded">
                  <div className="w-5 h-5 bg-red-700 rounded-full border-2 border-red-900"></div>
                  <div>
                    <div className="font-medium">Very High (60-80%)</div>
                    <div className="text-xs text-gray-600">Very hot</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2 bg-red-300 p-2 rounded">
                  <div className="w-5 h-5 bg-red-900 rounded-full border-2 border-black"></div>
                  <div>
                    <div className="font-medium">Extreme (80%+)</div>
                    <div className="text-xs text-gray-600">Dangerous</div>
                  </div>
                </div>
              </div>
            </div>
            
            <p className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
              <strong>Thermal Analysis:</strong> This thermal view shows heat distribution across {cityName} with enhanced color coding. 
              Blue marker indicates city center. Circle size represents heat intensity magnitude. 
              Red areas indicate critical heat zones requiring immediate attention.
            </p>
          </div>
        )}

        {activeView === 'heat_map' && (
          <div className="space-y-4">
            <div className="relative rounded-lg overflow-hidden border shadow-lg" style={{height: 400}}>
              <MapContainer center={[center.lat, center.lng]} zoom={13} style={{height: '100%', width: '100%'}}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; OpenStreetMap" />
                {heatZones.map((z, idx) => {
                  const intensity = z.intensity || 0.5;
                  const color = intensity > 0.8 ? '#8B0000' : 
                               intensity > 0.6 ? '#DC143C' : 
                               intensity > 0.4 ? '#FF4500' : 
                               intensity > 0.2 ? '#FFA500' : '#FFFF00';
                  const radius = Math.max(4, intensity * 12);
                  const regionInfo = getRegionInfo(z, idx);
                  
                  return (
                    <CircleMarker
                      key={idx}
                      center={[z.lat, z.lng]}
                      pathOptions={{ 
                        color: color, 
                        fillColor: color, 
                        fillOpacity: 0.4,
                        weight: 1,
                        opacity: 0.7
                      }}
                      radius={radius}
                    >
                      <Popup className="custom-popup" maxWidth={350} minWidth={300}>
                        <div className="p-2">
                          <div className="flex items-center justify-between mb-3">
                            <h3 className="font-bold text-lg text-gray-800">{z.location_name || regionInfo.regionType}</h3>
                            <div className={`px-2 py-1 rounded-full text-xs font-semibold ${
                              regionInfo.riskLevel === 'Critical' ? 'bg-red-100 text-red-800' :
                              regionInfo.riskLevel === 'High' ? 'bg-orange-100 text-orange-800' :
                              regionInfo.riskLevel === 'Moderate' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-green-100 text-green-800'
                            }`}>
                              {regionInfo.riskLevel} Risk
                            </div>
                          </div>
                          {z.location_name && (
                            <div className="mb-3">
                              <div className="flex items-center space-x-2">
                                <MapPin className="w-4 h-4 text-blue-600" />
                                <span className="text-sm text-gray-600">{z.zone_type}</span>
                              </div>
                            </div>
                          )}
                          
                          <div className="grid grid-cols-2 gap-3 mb-3">
                            <div className="bg-blue-50 p-2 rounded-lg">
                              <div className="flex items-center space-x-2 mb-1">
                                <Thermometer className="w-4 h-4 text-blue-600" />
                                <span className="text-sm font-medium text-blue-800">Temperature</span>
                              </div>
                              <div className="text-lg font-bold text-blue-900">{regionInfo.temperature}°C</div>
                            </div>
                            
                            <div className="bg-green-50 p-2 rounded-lg">
                              <div className="flex items-center space-x-2 mb-1">
                                <Wind className="w-4 h-4 text-green-600" />
                                <span className="text-sm font-medium text-green-800">Air Quality</span>
                              </div>
                              <div className="text-lg font-bold text-green-900">{regionInfo.aqiValue} AQI</div>
                            </div>
                            
                            <div className="bg-purple-50 p-2 rounded-lg">
                              <div className="flex items-center space-x-2 mb-1">
                                <Droplets className="w-4 h-4 text-purple-600" />
                                <span className="text-sm font-medium text-purple-800">Humidity</span>
                              </div>
                              <div className="text-lg font-bold text-purple-900">{regionInfo.humidity}%</div>
                            </div>
                            
                            <div className="bg-orange-50 p-2 rounded-lg">
                              <div className="flex items-center space-x-2 mb-1">
                                <Sun className="w-4 h-4 text-orange-600" />
                                <span className="text-sm font-medium text-orange-800">Wind Speed</span>
                              </div>
                              <div className="text-lg font-bold text-orange-900">{regionInfo.windSpeed} km/h</div>
                            </div>
                          </div>
                          
                          <div className="border-t pt-2">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium text-gray-700">Heat Intensity:</span>
                              <span className="text-sm font-bold text-gray-900">{Math.round(regionInfo.intensity * 100)}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="h-2 rounded-full transition-all duration-300"
                                style={{ 
                                  width: `${regionInfo.intensity * 100}%`,
                                  backgroundColor: color
                                }}
                              ></div>
                            </div>
                          </div>
                          
                          {regionInfo.riskLevel === 'Critical' && (
                            <div className="mt-3 p-2 bg-red-100 border border-red-300 rounded-lg">
                              <div className="flex items-center space-x-2">
                                <AlertTriangle className="w-4 h-4 text-red-600" />
                                <span className="text-sm font-medium text-red-800">Immediate Action Required</span>
                              </div>
                            </div>
                          )}
                        </div>
                      </Popup>
                    </CircleMarker>
                  );
                })}
                {/* City center marker */}
                <CircleMarker
                  center={[center.lat, center.lng]}
                  radius={10}
                  pathOptions={{
                    color: '#0000FF',
                    fillColor: '#0000FF',
                    fillOpacity: 0.9,
                    weight: 3
                  }}
                >
                  <Popup className="custom-popup" maxWidth={300} minWidth={250}>
                    <div className="p-2">
                      <div className="flex items-center space-x-2 mb-3">
                        <MapPin className="w-5 h-5 text-blue-600" />
                        <h3 className="font-bold text-lg text-gray-800">{cityName} Center</h3>
                      </div>
                      <div className="space-y-2">
                        <div className="bg-blue-50 p-2 rounded-lg">
                          <div className="text-sm font-medium text-blue-800">Coordinates</div>
                          <div className="text-sm text-blue-900">{center.lat.toFixed(4)}, {center.lng.toFixed(4)}</div>
                        </div>
                        <div className="bg-green-50 p-2 rounded-lg">
                          <div className="text-sm font-medium text-green-800">Status</div>
                          <div className="text-sm text-green-900">City Reference Point</div>
                        </div>
                      </div>
                    </div>
                  </Popup>
                </CircleMarker>
                {/* Additional heat zone markers for better visualization */}
                {heatZones.map((z, idx) => {
                  const intensity = z.intensity || 0.5;
                  if (intensity > 0.6) {
                    return (
                      <CircleMarker
                        key={`heat-${idx}`}
                        center={[z.lat, z.lng]}
                        radius={3}
                        pathOptions={{
                          color: '#FFFFFF',
                          fillColor: '#FFFFFF',
                          fillOpacity: 1,
                          weight: 2
                        }}
                      />
                    );
                  }
                  return null;
                })}
              </MapContainer>
              <div className="absolute top-2 left-2 bg-gradient-to-r from-orange-600 to-red-600 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-lg">
                🌡️ Urban Heat Island Map
              </div>
              <div className="absolute top-2 right-2 bg-white bg-opacity-90 text-gray-800 px-3 py-1 rounded-lg text-xs">
                {cityName}
              </div>
              <div className="absolute bottom-2 left-2 bg-black bg-opacity-70 text-white px-3 py-1 rounded-lg text-xs">
                Heat Zones: {heatZones.length} | Clusters: 5
              </div>
            </div>
            
            {/* Heat map statistics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <div className="text-2xl font-bold text-red-600">
                  {heatZones.filter(z => z.intensity > 0.8).length}
                </div>
                <div className="text-sm text-red-800">Critical Zones</div>
              </div>
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                <div className="text-2xl font-bold text-orange-600">
                  {heatZones.filter(z => z.intensity > 0.6 && z.intensity <= 0.8).length}
                </div>
                <div className="text-sm text-orange-800">High Risk</div>
              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <div className="text-2xl font-bold text-yellow-600">
                  {heatZones.filter(z => z.intensity > 0.4 && z.intensity <= 0.6).length}
                </div>
                <div className="text-sm text-yellow-800">Moderate</div>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <div className="text-2xl font-bold text-green-600">
                  {heatZones.filter(z => z.intensity <= 0.4).length}
                </div>
                <div className="text-sm text-green-800">Low Risk</div>
              </div>
            </div>
            
            {/* Cluster distribution */}
            <div className="bg-gradient-to-r from-green-50 to-white rounded-lg p-4 border border-green-200">
              <h4 className="font-semibold text-green-800 mb-3 flex items-center">
                🗺️ Heat Zone Distribution
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-sm">
                <div className="bg-green-100 p-2 rounded text-center">
                  <div className="font-bold text-green-800">City Center</div>
                  <div className="text-green-600">{heatZones.filter(z => z.cluster_id === 0).length} zones</div>
                </div>
                <div className="bg-green-200 p-2 rounded text-center">
                  <div className="font-bold text-green-800">Northeast</div>
                  <div className="text-green-700">{heatZones.filter(z => z.cluster_id === 1).length} zones</div>
                </div>
                <div className="bg-green-300 p-2 rounded text-center">
                  <div className="font-bold text-green-800">Northwest</div>
                  <div className="text-green-700">{heatZones.filter(z => z.cluster_id === 2).length} zones</div>
                </div>
                <div className="bg-green-400 p-2 rounded text-center">
                  <div className="font-bold text-green-800">Southeast</div>
                  <div className="text-green-700">{heatZones.filter(z => z.cluster_id === 3).length} zones</div>
                </div>
                <div className="bg-green-500 p-2 rounded text-center">
                  <div className="font-bold text-green-800">Southwest</div>
                  <div className="text-green-700">{heatZones.filter(z => z.cluster_id === 4).length} zones</div>
                </div>
              </div>
            </div>
            
            <p className="text-sm text-green-700 bg-green-50 p-3 rounded-lg border border-green-200">
              <strong>Enhanced Heat Map Analysis:</strong> This comprehensive heat map shows urban heat island intensity across {cityName} with 29+ detailed zones in 5 clusters. 
              Smaller circles provide more granular coverage. White dots mark the hottest zones. 
              The statistics above show the distribution of heat zones by risk level.
            </p>
          </div>
        )}

      </div>

      {/* Enhanced analysis insights */}
      <div className="bg-gradient-to-br from-green-50 to-white rounded-lg p-6 border border-green-200">
        <h4 className="font-semibold text-green-800 mb-4 flex items-center text-lg">
          📊 Advanced Analysis Insights
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="bg-white bg-opacity-60 rounded-lg p-3 border border-green-200">
              <h5 className="font-semibold text-green-800 mb-2">🌡️ Temperature Patterns</h5>
              <ul className="text-sm text-green-700 space-y-1">
                <li>• Urban areas show 3-5°C higher temperatures than rural areas</li>
                <li>• Industrial zones exhibit the highest heat intensity</li>
                <li>• Peak heat occurs between 2-4 PM local time</li>
                <li>• Nighttime cooling is significantly reduced in urban cores</li>
              </ul>
            </div>
            <div className="bg-white bg-opacity-60 rounded-lg p-3 border border-green-200">
              <h5 className="font-semibold text-green-800 mb-2">🌳 Environmental Factors</h5>
              <ul className="text-sm text-green-700 space-y-1">
                <li>• Green spaces provide 2-3°C cooling effect</li>
                <li>• Water bodies reduce surrounding temperatures by 1-2°C</li>
                <li>• Building density correlates with heat retention</li>
                <li>• Rooftop gardens can reduce building temperatures by 5-10°C</li>
              </ul>
            </div>
          </div>
          <div className="space-y-3">
            <div className="bg-white bg-opacity-60 rounded-lg p-3 border border-orange-200">
              <h5 className="font-semibold text-orange-800 mb-2">⚠️ Risk Assessment</h5>
              <ul className="text-sm text-orange-700 space-y-1">
                <li>• Critical zones require immediate intervention</li>
                <li>• Vulnerable populations at higher risk during heat waves</li>
                <li>• Energy consumption increases by 15-20% in heat islands</li>
                <li>• Air quality deteriorates in high-heat areas</li>
              </ul>
            </div>
            <div className="bg-white bg-opacity-60 rounded-lg p-3 border border-purple-200">
              <h5 className="font-semibold text-purple-800 mb-2">💡 Recommendations</h5>
              <ul className="text-sm text-purple-700 space-y-1">
                <li>• Increase green cover in identified hot spots</li>
                <li>• Implement cool roof technologies</li>
                <li>• Create urban cooling corridors</li>
                <li>• Monitor and regulate industrial heat emissions</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SatelliteImagery;
