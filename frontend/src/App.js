import React, { useState } from 'react';
import axios from 'axios';
import { Toaster, toast } from 'react-hot-toast';
import { MapPin, Thermometer, TrendingUp, Satellite, BarChart3, AlertTriangle, Factory } from 'lucide-react';
import GoogleMapComponent from './components/GoogleMap';
import TemperatureChart from './components/TemperatureChart';
import SatelliteImagery from './components/SatelliteImagery';
import EnhancedSatelliteImagery from './components/EnhancedSatelliteImagery';
import AIImageGenerator from './components/AIImageGenerator';
import HeatZoneAnalysis from './components/HeatZoneAnalysis';
import CO2Emissions from './components/CO2Emissions';
import './App.css';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

function App() {
  const [city, setCity] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!city.trim()) {
      setError('Please enter a city name');
      toast.error('Please enter a city name');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);
    setActiveTab('overview');

    try {
      toast.loading('Analyzing city data...', { id: 'analysis' });
      const response = await axios.post(`${API_BASE_URL}/api/uhi-analysis`, {
        city: city.trim()
      });
      
      setResult(response.data);
      toast.success('Analysis completed successfully!', { id: 'analysis' });
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Failed to analyze city. Please try again.';
      setError(errorMessage);
      toast.error(errorMessage, { id: 'analysis' });
    } finally {
      setLoading(false);
    }
  };

  const getUHILevelColor = (level) => {
    switch (level) {
      case 'High': return 'text-red-600 bg-red-100';
      case 'Medium': return 'text-orange-600 bg-orange-100';
      case 'Low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getAQIColor = (aqi) => {
    if (aqi <= 50) return 'text-green-600 bg-green-100';
    if (aqi <= 100) return 'text-yellow-600 bg-yellow-100';
    if (aqi <= 150) return 'text-orange-600 bg-orange-100';
    if (aqi <= 200) return 'text-red-600 bg-red-100';
    return 'text-purple-600 bg-purple-100';
  };

  const getTemperatureColor = (temp) => {
    if (temp >= 35) return 'text-red-600';
    if (temp >= 30) return 'text-orange-600';
    if (temp >= 25) return 'text-yellow-600';
    return 'text-green-600';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating Circles */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-green-200 rounded-full opacity-30 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-blue-200 rounded-full opacity-25 animate-bounce"></div>
        <div className="absolute bottom-40 left-20 w-24 h-24 bg-yellow-200 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-12 h-12 bg-purple-200 rounded-full opacity-30 animate-bounce"></div>
        
        {/* Decorative Lines */}
        <div className="absolute top-32 left-0 w-full h-1 bg-gradient-to-r from-transparent via-green-300 to-transparent opacity-40"></div>
        <div className="absolute bottom-32 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-300 to-transparent opacity-40"></div>
        
        {/* Floating Icons */}
        <div className="absolute top-60 left-1/4 text-4xl opacity-20 animate-float">🌿</div>
        <div className="absolute top-80 right-1/4 text-3xl opacity-25 animate-float-delayed">🌱</div>
        <div className="absolute bottom-60 left-1/3 text-5xl opacity-15 animate-float">🌳</div>
        <div className="absolute bottom-80 right-1/3 text-4xl opacity-20 animate-float-delayed">🌡️</div>
      </div>
      
      <Toaster position="top-right" />
      
      {/* Header */}
      <header className="bg-white shadow-lg border-b-2 border-green-200 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center relative">
            {/* Decorative Elements around Title */}
            <div className="absolute -top-2 -left-2 w-8 h-8 bg-green-100 rounded-full opacity-60"></div>
            <div className="absolute -top-1 -right-2 w-6 h-6 bg-blue-100 rounded-full opacity-60"></div>
            <div className="absolute -bottom-2 left-1/4 w-4 h-4 bg-yellow-100 rounded-full opacity-60"></div>
            <div className="absolute -bottom-1 right-1/4 w-5 h-5 bg-purple-100 rounded-full opacity-60"></div>
            
            <h1 className="text-5xl font-bold text-green-800 mb-4 relative">
              <span className="inline-block transform hover:scale-105 transition-transform duration-300">
                🌡️ Urban Heat Island Detector
              </span>
            </h1>
            <p className="text-xl text-green-700 font-medium">
              AI-powered climate analysis for Indian cities
            </p>
            
            {/* Decorative Underline */}
            <div className="mt-4 flex justify-center">
              <div className="w-32 h-1 bg-gradient-to-r from-green-400 to-blue-400 rounded-full"></div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Form */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 mb-8 border-2 border-green-200 relative overflow-hidden">
          {/* Decorative Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-4 left-4 w-16 h-16 border-2 border-green-300 rounded-full"></div>
            <div className="absolute top-8 right-8 w-12 h-12 border-2 border-blue-300 rounded-full"></div>
            <div className="absolute bottom-8 left-8 w-20 h-20 border-2 border-yellow-300 rounded-full"></div>
            <div className="absolute bottom-4 right-4 w-8 h-8 border-2 border-purple-300 rounded-full"></div>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-green-800 mb-2 flex items-center justify-center">
                <span className="text-3xl mr-3">🔍</span>
                Analyze Your City
              </h2>
              <p className="text-green-600">Enter any Indian city to get comprehensive heat island analysis</p>
            </div>
            
            <div>
              <label htmlFor="city" className="block text-lg font-semibold text-green-800 mb-3 flex items-center">
                <span className="text-xl mr-2">🏙️</span>
                Enter City Name
              </label>
              <div className="flex space-x-4">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    id="city"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g., Delhi, Mumbai, Bangalore..."
                    className="w-full px-6 py-4 border-2 border-green-300 rounded-xl focus:ring-4 focus:ring-green-200 focus:border-green-500 transition-all duration-300 text-lg font-medium"
                    disabled={loading}
                  />
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-green-400">
                    <span className="text-2xl">🏙️</span>
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-8 py-4 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl hover:from-green-700 hover:to-green-800 focus:ring-4 focus:ring-green-200 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 shadow-lg font-semibold text-lg flex items-center space-x-2"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Analyzing...</span>
                    </>
                  ) : (
                    <>
                      <span className="text-xl">🔍</span>
                      <span>Analyze</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>

          {error && (
            <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              {error}
            </div>
          )}
        </div>

        {/* Enhanced Results Dashboard */}
        {result && (
          <div className="space-y-6">
            {/* Navigation Tabs */}
            <div className="bg-white rounded-2xl shadow-2xl p-8 border-2 border-green-200 relative overflow-hidden">
              {/* Decorative Background */}
              <div className="absolute inset-0 opacity-5">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-green-400 via-blue-400 to-purple-400"></div>
                <div className="absolute bottom-0 right-0 w-full h-2 bg-gradient-to-l from-green-400 via-blue-400 to-purple-400"></div>
              </div>
              
              <div className="relative z-10">
                <h2 className="text-3xl font-bold text-green-800 mb-8 text-center">
                  <span className="inline-block transform hover:scale-105 transition-transform duration-300">
                    📍 {result.city} - Comprehensive Analysis
                  </span>
                </h2>
              
              <div className="flex flex-wrap gap-3 mb-8 justify-center">
                {[
                  { id: 'overview', label: 'Overview', icon: Thermometer, emoji: '📊' },
                  { id: 'map', label: 'Heat Map', icon: MapPin, emoji: '🗺️' },
                  { id: 'charts', label: 'Trends', icon: TrendingUp, emoji: '📈' },
                  { id: 'satellite', label: 'Satellite', icon: Satellite, emoji: '🛰️' },
                  { id: 'enhanced', label: 'Enhanced View', icon: Satellite, emoji: '🔍' },
                  { id: 'ai-generator', label: 'AI Generator', icon: Factory, emoji: '🎨' },
                  { id: 'zones', label: 'Heat Zones', icon: BarChart3, emoji: '🌡️' },
                  { id: 'co2', label: 'CO2 Emissions', icon: Factory, emoji: '🏭' },
                  { id: 'measures', label: 'Adaptation Measures', icon: AlertTriangle, emoji: '🌱' }
                ].map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center space-x-3 px-6 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg ${
                        activeTab === tab.id
                          ? 'bg-gradient-to-r from-green-100 to-green-200 text-green-800 border-2 border-green-400 shadow-xl'
                          : 'bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-200 hover:border-green-300'
                      }`}
                    >
                      <span className="text-2xl">{tab.emoji}</span>
                      <Icon className="w-5 h-5" />
                      <span className="font-semibold text-lg">{tab.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Tab Content */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  {/* Key Metrics */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <Thermometer className="w-5 h-5 text-red-600" />
                        <span className="text-sm font-medium text-red-800">Temperature</span>
                      </div>
                      <div className={`text-2xl font-bold ${getTemperatureColor(result.current_weather.temperature)}`}>
                        {result.current_weather.temperature}°C
                      </div>
                      <div className="text-sm text-red-600 capitalize">
                        {result.current_weather.description}
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-lg">🌫️</span>
                        <span className="text-sm font-medium text-orange-800">Air Quality</span>
                      </div>
                      <div className={`text-2xl font-bold ${getAQIColor(result.air_quality.aqi).split(' ')[0]}`}>
                        {result.air_quality.aqi}
                      </div>
                      <div className={`text-sm px-2 py-1 rounded-full inline-block ${getAQIColor(result.air_quality.aqi)}`}>
                        {result.air_quality.interpretation}
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-lg">💧</span>
                        <span className="text-sm font-medium text-blue-800">Humidity</span>
                      </div>
                      <div className="text-2xl font-bold text-blue-600">
                        {result.current_weather.humidity}%
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-lg">💨</span>
                        <span className="text-sm font-medium text-purple-800">Wind Speed</span>
                      </div>
                      <div className="text-2xl font-bold text-purple-600">
                        {result.current_weather.wind_speed} m/s
                      </div>
                    </div>
                  </div>

                  {/* UHI Risk Assessment */}
                  <div className="bg-white border border-gray-200 rounded-lg p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                      <AlertTriangle className="w-5 h-5 mr-2 text-red-500" />
                      Urban Heat Island Risk Assessment
                    </h3>
                    
                    <div className="flex items-center space-x-4 mb-6">
                      <span className="text-lg font-medium text-gray-700">Risk Level:</span>
                      <span className={`px-4 py-2 rounded-full font-bold text-lg ${getUHILevelColor(result.uhi_analysis.level)}`}>
                        {result.uhi_analysis.level}
                      </span>
                      <span className="text-sm text-gray-600">
                        Risk Score: {result.uhi_analysis.risk_score}/100
                      </span>
                    </div>

                    {/* City Information */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <div className="text-2xl font-bold text-gray-800">
                          {result.city_info.population.toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-600">Population</div>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <div className="text-2xl font-bold text-gray-800">
                          {result.city_info.area} km²
                        </div>
                        <div className="text-sm text-gray-600">Area</div>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded-lg">
                        <div className="text-2xl font-bold text-gray-800">
                          {result.city_info.population_density.toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-600">People/km²</div>
                      </div>
                    </div>

                    {/* Enhanced Adaptation Plan */}
                    <div className="bg-gradient-to-br from-green-50 via-white to-green-100 rounded-xl p-6 border-2 border-green-200 shadow-lg">
                      <div className="flex items-center justify-between mb-6">
                        <h4 className="text-2xl font-bold text-green-800 flex items-center">
                          <span className="text-3xl mr-3">🌱</span>
                          Climate Adaptation Plan
                        </h4>
                        <div className="bg-green-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
                          Priority Action Required
                        </div>
                      </div>
                      
                      {/* Key Metrics with Enhanced Styling */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-white rounded-xl p-6 shadow-md border-2 border-green-200 text-center hover:shadow-lg transition-shadow">
                          <div className="text-4xl font-bold text-green-600 mb-2">
                            {result.adaptation_plan.recommended_trees.toLocaleString()}
                          </div>
                          <div className="text-green-800 font-semibold">Trees to Plant</div>
                          <div className="text-xs text-green-600 mt-1">Native species recommended</div>
                        </div>
                        <div className="bg-white rounded-xl p-6 shadow-md border-2 border-blue-200 text-center hover:shadow-lg transition-shadow">
                        <div className="text-4xl font-bold text-blue-600 mb-2">
                          {result.adaptation_plan.budget_estimate}
                        </div>
                          <div className="text-blue-800 font-semibold">Budget Estimate</div>
                          <div className="text-xs text-blue-600 mt-1">Government funding available</div>
                        </div>
                        <div className="bg-white rounded-xl p-6 shadow-md border-2 border-purple-200 text-center hover:shadow-lg transition-shadow">
                          <div className="text-4xl font-bold text-purple-600 mb-2">
                            {result.adaptation_plan.timeline}
                          </div>
                          <div className="text-purple-800 font-semibold">Implementation</div>
                          <div className="text-xs text-purple-600 mt-1">Phased approach</div>
                        </div>
                      </div>
                      
                      {/* Enhanced Measures Section */}
                      <div className="bg-white rounded-xl p-6 border-2 border-green-200">
                        <div className="flex items-center justify-between mb-4">
                          <h5 className="text-xl font-bold text-green-800 flex items-center">
                            <span className="text-2xl mr-2">🎯</span>
                            Priority Adaptation Measures
                          </h5>
                          <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                            {result.adaptation_plan.measures.length} Total Measures
                          </div>
                        </div>
                        
                        {/* Categorized Measures */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* High Priority Measures */}
                          <div className="space-y-3">
                            <h6 className="font-bold text-red-700 text-lg flex items-center">
                              <span className="text-xl mr-2">🔥</span>
                              High Priority (Immediate Action)
                            </h6>
                            <div className="space-y-2">
                              {result.adaptation_plan.measures.slice(0, 3).map((measure, index) => (
                                <div key={index} className="bg-red-50 border-l-4 border-red-500 p-3 rounded-r-lg hover:bg-red-100 transition-colors">
                                  <div className="flex items-start space-x-3">
                                    <span className="text-red-500 font-bold text-lg">⚡</span>
                                    <span className="text-red-800 font-medium text-sm">{measure}</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                          
                          {/* Medium Priority Measures */}
                          <div className="space-y-3">
                            <h6 className="font-bold text-orange-700 text-lg flex items-center">
                              <span className="text-xl mr-2">🌡️</span>
                              Medium Priority (Short-term)
                            </h6>
                            <div className="space-y-2">
                              {result.adaptation_plan.measures.slice(3, 6).map((measure, index) => (
                                <div key={index} className="bg-orange-50 border-l-4 border-orange-500 p-3 rounded-r-lg hover:bg-orange-100 transition-colors">
                                  <div className="flex items-start space-x-3">
                                    <span className="text-orange-500 font-bold text-lg">🌱</span>
                                    <span className="text-orange-800 font-medium text-sm">{measure}</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                        
                        {/* Impact Summary */}
                        <div className="mt-6 bg-gradient-to-r from-green-100 to-blue-100 rounded-lg p-4 border border-green-300">
                          <h6 className="font-bold text-green-800 mb-2 flex items-center">
                            <span className="text-lg mr-2">📊</span>
                            Expected Impact
                          </h6>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                            <div>
                              <div className="text-2xl font-bold text-green-600">3-5°C</div>
                              <div className="text-xs text-green-700">Temperature Reduction</div>
                            </div>
                            <div>
                              <div className="text-2xl font-bold text-blue-600">25%</div>
                              <div className="text-xs text-blue-700">Energy Savings</div>
                            </div>
                            <div>
                              <div className="text-2xl font-bold text-purple-600">40%</div>
                              <div className="text-xs text-purple-700">Air Quality Improvement</div>
                            </div>
                            <div>
                              <div className="text-2xl font-bold text-orange-600">60%</div>
                              <div className="text-xs text-orange-700">Heat Island Mitigation</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'map' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800">Interactive Heat Map</h3>
                  <GoogleMapComponent 
                    cityData={result}
                    heatZones={result.heat_zones}
                    center={{ lat: result.coordinates.lat, lng: result.coordinates.lng }}
                  />
                </div>
              )}

              {activeTab === 'charts' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-800">Temperature Trends & Analysis</h3>
                  <TemperatureChart historicalData={result.historical_data} />
                </div>
              )}

              {activeTab === 'satellite' && (
                <div className="space-y-4">
                  <SatelliteImagery 
                    satelliteData={result.satellite_imagery} 
                    cityName={result.city}
                    center={{ lat: result.coordinates.lat, lng: result.coordinates.lng }}
                    heatZones={result.heat_zones}
                  />
                </div>
              )}

              {activeTab === 'enhanced' && (
                <div className="space-y-4">
                  <EnhancedSatelliteImagery 
                    satelliteData={result.satellite_imagery} 
                    cityName={result.city}
                    center={{ lat: result.coordinates.lat, lng: result.coordinates.lng }}
                    heatZones={result.heat_zones}
                  />
                </div>
              )}

              {activeTab === 'ai-generator' && (
                <div className="space-y-4">
                  <AIImageGenerator 
                    cityData={result}
                    heatZones={result.heat_zones}
                    satelliteData={result.satellite_imagery}
                  />
                </div>
              )}

              {activeTab === 'zones' && (
                <div className="space-y-4">
                  <HeatZoneAnalysis 
                    heatZones={result.heat_zones} 
                    cityName={result.city} 
                  />
                </div>
              )}

              {activeTab === 'co2' && (
                <div className="space-y-6">
                  <CO2Emissions co2Data={result.co2_emissions} />
                </div>
              )}

              {activeTab === 'measures' && (
                <div className="space-y-6">
                  {/* Enhanced Adaptation Measures Tab */}
                  <div className="bg-gradient-to-br from-green-50 via-white to-green-100 rounded-xl p-8 border-2 border-green-200 shadow-lg">
                    <div className="flex items-center justify-between mb-8">
                      <h3 className="text-3xl font-bold text-green-800 flex items-center">
                        <span className="text-4xl mr-4">🌱</span>
                        Climate Adaptation Measures
                      </h3>
                      <div className="bg-green-600 text-white px-6 py-3 rounded-full text-lg font-bold">
                        Priority Action Required
                      </div>
                    </div>
                    
                    {/* Key Metrics Dashboard */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
                      <div className="bg-white rounded-2xl p-8 shadow-xl border-2 border-green-200 text-center hover:shadow-2xl transition-all duration-300">
                        <div className="text-5xl font-bold text-green-600 mb-3">
                          {result.adaptation_plan.recommended_trees.toLocaleString()}
                        </div>
                        <div className="text-green-800 font-bold text-xl mb-2">Trees to Plant</div>
                        <div className="text-sm text-green-600">Native species (Neem, Peepal, Banyan)</div>
                      </div>
                      <div className="bg-white rounded-2xl p-8 shadow-xl border-2 border-blue-200 text-center hover:shadow-2xl transition-all duration-300">
                        <div className="text-5xl font-bold text-blue-600 mb-3">
                          {result.adaptation_plan.budget_estimate}
                        </div>
                        <div className="text-blue-800 font-bold text-xl mb-2">Budget Estimate</div>
                        <div className="text-sm text-blue-600">Government funding available</div>
                      </div>
                      <div className="bg-white rounded-2xl p-8 shadow-xl border-2 border-purple-200 text-center hover:shadow-2xl transition-all duration-300">
                        <div className="text-5xl font-bold text-purple-600 mb-3">
                          {result.adaptation_plan.timeline}
                        </div>
                        <div className="text-purple-800 font-bold text-xl mb-2">Implementation</div>
                        <div className="text-sm text-purple-600">Phased approach</div>
                      </div>
                    </div>
                    
                    {/* Categorized Measures */}
                    <div className="space-y-8">
                      {/* High Priority Measures */}
                      <div className="bg-white rounded-2xl p-8 border-2 border-red-200 shadow-lg">
                        <div className="flex items-center mb-6">
                          <span className="text-3xl mr-3">🔥</span>
                          <h4 className="text-2xl font-bold text-red-700">High Priority Measures</h4>
                          <div className="ml-auto bg-red-100 text-red-800 px-4 py-2 rounded-full text-sm font-semibold">
                            Immediate Action Required
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {result.adaptation_plan.measures.slice(0, 6).map((measure, index) => (
                            <div key={index} className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-xl hover:bg-red-100 transition-colors">
                              <div className="flex items-start space-x-3">
                                <span className="text-red-500 font-bold text-xl">⚡</span>
                                <span className="text-red-800 font-medium">{measure}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      {/* Medium Priority Measures */}
                      <div className="bg-white rounded-2xl p-8 border-2 border-orange-200 shadow-lg">
                        <div className="flex items-center mb-6">
                          <span className="text-3xl mr-3">🌡️</span>
                          <h4 className="text-2xl font-bold text-orange-700">Medium Priority Measures</h4>
                          <div className="ml-auto bg-orange-100 text-orange-800 px-4 py-2 rounded-full text-sm font-semibold">
                            Short-term Implementation
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {result.adaptation_plan.measures.slice(6, 12).map((measure, index) => (
                            <div key={index} className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded-r-xl hover:bg-orange-100 transition-colors">
                              <div className="flex items-start space-x-3">
                                <span className="text-orange-500 font-bold text-xl">🌱</span>
                                <span className="text-orange-800 font-medium">{measure}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    {/* Expected Impact Summary */}
                    <div className="mt-10 bg-gradient-to-r from-green-100 via-blue-100 to-purple-100 rounded-2xl p-8 border-2 border-green-300">
                      <h5 className="text-2xl font-bold text-green-800 mb-6 flex items-center">
                        <span className="text-3xl mr-3">📊</span>
                        Expected Impact & Benefits
                      </h5>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                        <div className="bg-white rounded-xl p-4 shadow-md">
                          <div className="text-3xl font-bold text-green-600 mb-2">3-5°C</div>
                          <div className="text-green-800 font-semibold">Temperature Reduction</div>
                          <div className="text-xs text-green-600 mt-1">Surface cooling effect</div>
                        </div>
                        <div className="bg-white rounded-xl p-4 shadow-md">
                          <div className="text-3xl font-bold text-blue-600 mb-2">25%</div>
                          <div className="text-blue-800 font-semibold">Energy Savings</div>
                          <div className="text-xs text-blue-600 mt-1">Reduced AC usage</div>
                        </div>
                        <div className="bg-white rounded-xl p-4 shadow-md">
                          <div className="text-3xl font-bold text-purple-600 mb-2">40%</div>
                          <div className="text-purple-800 font-semibold">Air Quality</div>
                          <div className="text-xs text-purple-600 mt-1">Pollution reduction</div>
                        </div>
                        <div className="bg-white rounded-xl p-4 shadow-md">
                          <div className="text-3xl font-bold text-orange-600 mb-2">60%</div>
                          <div className="text-orange-800 font-semibold">Heat Island</div>
                          <div className="text-xs text-orange-600 mt-1">Mitigation effect</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-gray-800 via-gray-900 to-gray-800 text-white py-12 mt-16 relative overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-4 left-1/4 w-32 h-32 border-2 border-green-400 rounded-full animate-rotate-slow"></div>
          <div className="absolute bottom-4 right-1/4 w-24 h-24 border-2 border-blue-400 rounded-full animate-rotate-slow" style={{animationDirection: 'reverse'}}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 border-2 border-purple-400 rounded-full animate-pulse-slow"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-white mb-2 flex items-center justify-center">
              <span className="text-3xl mr-3">🌡️</span>
              Urban Heat Island Detector
            </h3>
            <p className="text-gray-300 text-lg">
              AI-powered climate analysis for Indian cities
            </p>
          </div>
          
          <div className="flex justify-center space-x-8 mb-6">
            <div className="flex items-center space-x-2 text-green-400">
              <span className="text-2xl">🌱</span>
              <span className="text-sm">Sustainable Development</span>
            </div>
            <div className="flex items-center space-x-2 text-blue-400">
              <span className="text-2xl">🌍</span>
              <span className="text-sm">Climate Adaptation</span>
            </div>
            <div className="flex items-center space-x-2 text-purple-400">
              <span className="text-2xl">🔬</span>
              <span className="text-sm">AI-Powered Analysis</span>
            </div>
          </div>
          
          <div className="border-t border-gray-700 pt-6">
            <p className="text-gray-400 text-sm">
              Built for sustainable urban development and climate adaptation
            </p>
            <p className="text-gray-500 text-xs mt-2">
              © 2024 Urban Heat Island Detector. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
