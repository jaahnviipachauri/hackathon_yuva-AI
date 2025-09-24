import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { 
  MapPin, 
  Thermometer, 
  Sun, 
  AlertTriangle, 
  TreePine, 
  Building,
  Eye,
  Layers,
  Satellite
} from 'lucide-react';

const EnhancedSatelliteImagery = ({ satelliteData, cityName, center, heatZones = [] }) => {
  const [activeLayer, setActiveLayer] = useState('satellite');
  const [selectedAnalysis, setSelectedAnalysis] = useState('thermal');
  const [useFallbackImages, setUseFallbackImages] = useState(true); // Start with fallback images
  const [imageQuality, setImageQuality] = useState('high'); // high, ultra, maximum

  // Test Google Maps API availability on component mount
  useEffect(() => {
    if (satelliteData?.base_satellite?.url) {
      // Test if the Google Maps API is working
      const testImage = new Image();
      testImage.onload = () => {
        // Google Maps API is working, switch to real images
        setUseFallbackImages(false);
      };
      testImage.onerror = () => {
        // Google Maps API failed, keep using fallback images
        setUseFallbackImages(true);
      };
      testImage.src = satelliteData.base_satellite.url;
    }
  }, [satelliteData]);

  // Generate high-quality fallback satellite-like image using canvas
  const generateFallbackImage = (baseWidth = 800, baseHeight = 600, cityName = 'City') => {
    // Get dimensions based on quality setting
    const qualityMultipliers = {
      'standard': 1,
      'high': 1.5,
      'ultra': 2,
      'maximum': 2.5
    };
    
    const multiplier = qualityMultipliers[imageQuality] || 1.5;
    const width = Math.round(baseWidth * multiplier);
    const height = Math.round(baseHeight * multiplier);
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    // Create a more realistic satellite-like background
    const gradient = ctx.createRadialGradient(
      width / 2, height / 2, 0,
      width / 2, height / 2, Math.max(width, height) / 2
    );
    gradient.addColorStop(0, '#1B5E20'); // Dark forest green (center)
    gradient.addColorStop(0.3, '#2E7D32'); // Medium green
    gradient.addColorStop(0.6, '#4CAF50'); // Light green
    gradient.addColorStop(0.8, '#8BC34A'); // Lighter green
    gradient.addColorStop(1, '#C8E6C9'); // Very light green (edges)

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Add realistic terrain features
    // Water bodies (blue areas)
    ctx.fillStyle = 'rgba(33, 150, 243, 0.3)';
    for (let i = 0; i < 8; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      const size = Math.random() * 80 + 40;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, 2 * Math.PI);
      ctx.fill();
    }

    // Urban areas (gray patterns)
    ctx.fillStyle = 'rgba(97, 97, 97, 0.4)';
    for (let i = 0; i < 30; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      const size = Math.random() * 25 + 8;
      ctx.fillRect(x, y, size, size);
    }

    // Roads (linear patterns)
    ctx.strokeStyle = 'rgba(158, 158, 158, 0.6)';
    ctx.lineWidth = 3;
    for (let i = 0; i < 10; i++) {
      ctx.beginPath();
      ctx.moveTo(Math.random() * width, Math.random() * height);
      ctx.lineTo(Math.random() * width, Math.random() * height);
      ctx.stroke();
    }

    // Add heat zones if available
    if (heatZones && heatZones.length > 0) {
      heatZones.slice(0, 10).forEach(zone => {
        if (zone.lat && zone.lng) {
          // Convert lat/lng to canvas coordinates (simplified)
          const x = (zone.lng + 180) / 360 * width;
          const y = (90 - zone.lat) / 180 * height;
          
          const intensity = zone.intensity || 0.5;
          const radius = intensity * 30 + 10;
          
          // Create heat zone gradient
          const heatGradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
          
          if (intensity > 0.7) {
            heatGradient.addColorStop(0, 'rgba(255, 0, 0, 0.8)');
            heatGradient.addColorStop(1, 'rgba(255, 0, 0, 0.1)');
          } else if (intensity > 0.5) {
            heatGradient.addColorStop(0, 'rgba(255, 165, 0, 0.7)');
            heatGradient.addColorStop(1, 'rgba(255, 165, 0, 0.1)');
          } else {
            heatGradient.addColorStop(0, 'rgba(255, 255, 0, 0.6)');
            heatGradient.addColorStop(1, 'rgba(255, 255, 0, 0.1)');
          }
          
          ctx.fillStyle = heatGradient;
          ctx.beginPath();
          ctx.arc(x, y, radius, 0, 2 * Math.PI);
          ctx.fill();
        }
      });
    }

    // Add satellite-style overlay
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    for (let i = 0; i < width; i += 20) {
      for (let j = 0; j < height; j += 20) {
        if ((i + j) % 40 === 0) {
          ctx.fillRect(i, j, 1, 1);
        }
      }
    }

    // Add city name with better styling
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(width / 2 - 120, height - 60, 240, 40);
    
    ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
    ctx.font = 'bold 18px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(`${cityName} - Satellite View`, width / 2, height - 35);
    
    // Add timestamp
    ctx.font = '12px Arial';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.fillText(`Generated: ${new Date().toLocaleString()}`, width / 2, height - 15);

    return canvas.toDataURL('image/png', 0.95); // High quality PNG
  };

  // Generate street map image using canvas
  const generateStreetMapImage = (baseWidth = 800, baseHeight = 600, cityName = 'City') => {
    const qualityMultipliers = {
      'standard': 1,
      'high': 1.5,
      'ultra': 2,
      'maximum': 2.5
    };
    
    const multiplier = qualityMultipliers[imageQuality] || 1.5;
    const width = Math.round(baseWidth * multiplier);
    const height = Math.round(baseHeight * multiplier);
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    // Enable high-quality rendering
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    // Street map background (light gray/white)
    ctx.fillStyle = '#F5F5F5';
    ctx.fillRect(0, 0, width, height);

    // Add street grid pattern
    ctx.strokeStyle = '#E0E0E0';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 20; i++) {
      // Vertical streets
      ctx.beginPath();
      ctx.moveTo((i / 20) * width, 0);
      ctx.lineTo((i / 20) * width, height);
      ctx.stroke();
      
      // Horizontal streets
      ctx.beginPath();
      ctx.moveTo(0, (i / 20) * height);
      ctx.lineTo(width, (i / 20) * height);
      ctx.stroke();
    }

    // Add major roads (thicker lines)
    ctx.strokeStyle = '#BDBDBD';
    ctx.lineWidth = 3;
    for (let i = 0; i <= 5; i++) {
      // Major vertical roads
      ctx.beginPath();
      ctx.moveTo((i / 5) * width, 0);
      ctx.lineTo((i / 5) * width, height);
      ctx.stroke();
      
      // Major horizontal roads
      ctx.beginPath();
      ctx.moveTo(0, (i / 5) * height);
      ctx.lineTo(width, (i / 5) * height);
      ctx.stroke();
    }

    // Add buildings (rectangular blocks)
    const buildingColors = ['#90CAF9', '#A5D6A7', '#FFCC80', '#CE93D8', '#F8BBD9'];
    for (let i = 0; i < 30; i++) {
      ctx.fillStyle = buildingColors[Math.floor(Math.random() * buildingColors.length)];
      const x = Math.random() * (width - 60);
      const y = Math.random() * (height - 40);
      const w = 40 + Math.random() * 60;
      const h = 30 + Math.random() * 50;
      ctx.fillRect(x, y, w, h);
      
      // Add building outline
      ctx.strokeStyle = '#757575';
      ctx.lineWidth = 1;
      ctx.strokeRect(x, y, w, h);
    }

    // Add parks and green spaces
    for (let i = 0; i < 8; i++) {
      ctx.fillStyle = '#4CAF50';
      const x = Math.random() * (width - 80);
      const y = Math.random() * (height - 60);
      const w = 60 + Math.random() * 80;
      const h = 40 + Math.random() * 60;
      ctx.fillRect(x, y, w, h);
      
      // Add trees in parks
      ctx.fillStyle = '#2E7D32';
      for (let t = 0; t < 6; t++) {
        const tx = x + Math.random() * w;
        const ty = y + Math.random() * h;
        ctx.beginPath();
        ctx.arc(tx, ty, 4, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Add water bodies
    for (let i = 0; i < 3; i++) {
      ctx.fillStyle = '#2196F3';
      const centerX = Math.random() * width;
      const centerY = Math.random() * height;
      const radius = 30 + Math.random() * 50;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.fill();
    }

    // Add heat zones if available
    if (heatZones && heatZones.length > 0) {
      heatZones.forEach((zone, index) => {
        if (zone.lat && zone.lng) {
          const x = ((zone.lng + 180) / 360) * width;
          const y = ((90 - zone.lat) / 180) * height;
          const intensity = zone.intensity || 0.5;
          const radius = 8 + intensity * 15;
          
          // Create heat zone with transparency
          const heatGradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
          if (intensity > 0.7) {
            heatGradient.addColorStop(0, 'rgba(255, 0, 0, 0.6)');
            heatGradient.addColorStop(1, 'rgba(255, 0, 0, 0.1)');
          } else if (intensity > 0.5) {
            heatGradient.addColorStop(0, 'rgba(255, 165, 0, 0.5)');
            heatGradient.addColorStop(1, 'rgba(255, 165, 0, 0.1)');
          } else {
            heatGradient.addColorStop(0, 'rgba(255, 255, 0, 0.4)');
            heatGradient.addColorStop(1, 'rgba(255, 255, 0, 0.1)');
          }
          
          ctx.fillStyle = heatGradient;
          ctx.beginPath();
          ctx.arc(x, y, radius, 0, Math.PI * 2);
          ctx.fill();
        }
      });
    }

    // Add street names and labels
    ctx.fillStyle = '#424242';
    ctx.font = 'bold 12px Arial';
    ctx.textAlign = 'center';
    const streetNames = ['Main St', 'First Ave', 'Second Ave', 'Central Blvd', 'Park Ave'];
    for (let i = 0; i < 5; i++) {
      const x = (i / 4) * width;
      const y = height - 20;
      ctx.fillText(streetNames[i] || `Street ${i + 1}`, x, y);
    }

    // Add city name and timestamp
    ctx.fillStyle = '#1976D2';
    ctx.font = 'bold 18px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(`${cityName} - Street Map`, 10, 30);
    
    ctx.font = '12px Arial';
    ctx.fillStyle = '#666666';
    ctx.fillText(new Date().toLocaleString(), 10, height - 15);

    return canvas.toDataURL('image/png', 0.95);
  };

  // Generate hybrid map (satellite + street overlay)
  const generateHybridMapImage = (baseWidth = 800, baseHeight = 600, cityName = 'City') => {
    const qualityMultipliers = {
      'standard': 1,
      'high': 1.5,
      'ultra': 2,
      'maximum': 2.5
    };
    
    const multiplier = qualityMultipliers[imageQuality] || 1.5;
    const width = Math.round(baseWidth * multiplier);
    const height = Math.round(baseHeight * multiplier);
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    // Enable high-quality rendering
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    // Start with satellite-like background
    const baseGradient = ctx.createRadialGradient(
      width / 2, height / 2, 0,
      width / 2, height / 2, Math.max(width, height) / 2
    );
    baseGradient.addColorStop(0, '#2E7D32');
    baseGradient.addColorStop(0.5, '#4CAF50');
    baseGradient.addColorStop(1, '#81C784');
    ctx.fillStyle = baseGradient;
    ctx.fillRect(0, 0, width, height);

    // Add buildings with satellite colors
    const buildingColors = ['#424242', '#616161', '#757575', '#9E9E9E'];
    for (let i = 0; i < 25; i++) {
      ctx.fillStyle = buildingColors[Math.floor(Math.random() * buildingColors.length)];
      const x = Math.random() * (width - 80);
      const y = Math.random() * (height - 60);
      const w = 50 + Math.random() * 80;
      const h = 40 + Math.random() * 60;
      ctx.fillRect(x, y, w, h);
    }

    // Add street overlay (semi-transparent)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.lineWidth = 2;
    for (let i = 0; i <= 10; i++) {
      ctx.beginPath();
      ctx.moveTo((i / 10) * width, 0);
      ctx.lineTo((i / 10) * width, height);
      ctx.stroke();
      
      ctx.beginPath();
      ctx.moveTo(0, (i / 10) * height);
      ctx.lineTo(width, (i / 10) * height);
      ctx.stroke();
    }

    // Add major roads with thicker white lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.lineWidth = 4;
    for (let i = 0; i <= 3; i++) {
      ctx.beginPath();
      ctx.moveTo((i / 3) * width, 0);
      ctx.lineTo((i / 3) * width, height);
      ctx.stroke();
      
      ctx.beginPath();
      ctx.moveTo(0, (i / 3) * height);
      ctx.lineTo(width, (i / 3) * height);
      ctx.stroke();
    }

    // Add heat zones
    if (heatZones && heatZones.length > 0) {
      heatZones.forEach((zone, index) => {
        if (zone.lat && zone.lng) {
          const x = ((zone.lng + 180) / 360) * width;
          const y = ((90 - zone.lat) / 180) * height;
          const intensity = zone.intensity || 0.5;
          const radius = 10 + intensity * 20;
          
          const heatGradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
          if (intensity > 0.7) {
            heatGradient.addColorStop(0, 'rgba(255, 0, 0, 0.8)');
            heatGradient.addColorStop(1, 'rgba(255, 0, 0, 0.2)');
          } else if (intensity > 0.5) {
            heatGradient.addColorStop(0, 'rgba(255, 165, 0, 0.7)');
            heatGradient.addColorStop(1, 'rgba(255, 165, 0, 0.2)');
          } else {
            heatGradient.addColorStop(0, 'rgba(255, 255, 0, 0.6)');
            heatGradient.addColorStop(1, 'rgba(255, 255, 0, 0.2)');
          }
          
          ctx.fillStyle = heatGradient;
          ctx.beginPath();
          ctx.arc(x, y, radius, 0, Math.PI * 2);
          ctx.fill();
        }
      });
    }

    // Add labels
    ctx.fillStyle = '#FFFFFF';
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    ctx.font = 'bold 18px Arial';
    ctx.textAlign = 'left';
    ctx.strokeText(`${cityName} - Hybrid Map`, 10, 30);
    ctx.fillText(`${cityName} - Hybrid Map`, 10, 30);
    
    ctx.font = '12px Arial';
    ctx.fillText(new Date().toLocaleString(), 10, height - 15);

    return canvas.toDataURL('image/png', 0.95);
  };

  if (!satelliteData) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-green-200">
        <div className="text-center text-gray-500">
          <Satellite className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <p>Satellite imagery data not available</p>
        </div>
      </div>
    );
  }

  const analysisTypes = [
    { id: 'thermal', name: 'Thermal Analysis', icon: Thermometer, color: 'bg-red-500' },
    { id: 'landuse', name: 'Land Use', icon: Building, color: 'bg-blue-500' },
    { id: 'green', name: 'Green Spaces', icon: TreePine, color: 'bg-green-500' },
    { id: 'gradient', name: 'Temperature Gradient', icon: Sun, color: 'bg-orange-500' }
  ];

  const layerTypes = [
    { id: 'satellite', name: 'Satellite View', icon: Eye },
    { id: 'hybrid', name: 'Hybrid View', icon: Layers },
    { id: 'street', name: 'Street Map', icon: MapPin }
  ];

  const getTemperatureColor = (temp) => {
    if (temp > 40) return '#FF0000'; // Red - Very hot
    if (temp > 35) return '#FF4500'; // Orange-red
    if (temp > 30) return '#FFA500'; // Orange
    if (temp > 25) return '#FFFF00'; // Yellow
    if (temp > 20) return '#90EE90'; // Light green
    return '#00FF00'; // Green - Cool
  };

  const getLandUseColor = (landType) => {
    const colors = {
      'Residential': '#87CEEB',
      'Commercial': '#FF6347',
      'Industrial': '#8B4513',
      'Green Space': '#228B22',
      'Water Body': '#4169E1',
      'Transport': '#696969',
      'Mixed Use': '#DDA0DD'
    };
    return colors[landType] || '#CCCCCC';
  };

  const getGreenSpaceColor = (spaceType) => {
    const colors = {
      'Urban Park': '#32CD32',
      'Botanical Garden': '#228B22',
      'Forest': '#006400',
      'Waterfront': '#00CED1',
      'Green Corridor': '#90EE90',
      'Community Garden': '#98FB98'
    };
    return colors[spaceType] || '#90EE90';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h3 className="text-3xl font-bold text-green-800 mb-2 flex items-center justify-center">
          <span className="text-4xl mr-3">🛰️</span>
          Enhanced Satellite Imagery Analysis
        </h3>
        <p className="text-green-600 text-lg">Comprehensive thermal and environmental mapping</p>
        <div className="mt-3 flex justify-center">
          <div className="w-32 h-1 bg-gradient-to-r from-green-400 via-blue-400 to-red-400 rounded-full"></div>
        </div>
      </div>

      {/* Layer Selection */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
        <div className="flex items-center justify-between text-blue-800 text-sm">
          <div className="flex items-center">
            <span className="mr-2">🌍</span>
            <span className="font-semibold">Powered by Google Maps API</span>
            <span className="ml-2 text-xs bg-blue-100 px-2 py-1 rounded">Live Data</span>
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-xs">Image Quality:</span>
            <select
              value={imageQuality}
              onChange={(e) => setImageQuality(e.target.value)}
              className="text-xs bg-white border border-blue-300 rounded px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="standard">Standard (800x600)</option>
              <option value="high">High (1200x800)</option>
              <option value="ultra">Ultra (1600x1200)</option>
              <option value="maximum">Maximum (2048x1536)</option>
            </select>
          </div>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-2 mb-6">
        {layerTypes.map((layer) => (
          <button
            key={layer.id}
            onClick={() => setActiveLayer(layer.id)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
              activeLayer === layer.id
                ? 'bg-green-100 text-green-700 border-2 border-green-300 shadow-md'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <layer.icon className="w-4 h-4" />
            <span className="text-sm font-medium">{layer.name}</span>
            {layer.id === 'satellite' && <span className="text-xs bg-green-200 px-2 py-0.5 rounded">Live</span>}
          </button>
        ))}
      </div>

      {/* Analysis Type Selection */}
      <div className="flex flex-wrap gap-2 mb-6">
        {analysisTypes.map((analysis) => (
          <button
            key={analysis.id}
            onClick={() => setSelectedAnalysis(analysis.id)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
              selectedAnalysis === analysis.id
                ? 'bg-blue-100 text-blue-700 border-2 border-blue-300 shadow-md'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <analysis.icon className="w-4 h-4" />
            <span className="text-sm font-medium">{analysis.name}</span>
          </button>
        ))}
      </div>

      {/* Main Visualization */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Satellite Images */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl p-4 shadow-lg border-2 border-green-200">
            <h4 className="text-xl font-bold text-green-800 mb-4 flex items-center">
              <Eye className="w-5 h-5 mr-2" />
              {activeLayer === 'street' ? 'Street Map View' : activeLayer === 'hybrid' ? 'Hybrid Map View' : 'Real Satellite Imagery'}
            </h4>
            
            {/* Google Maps API Info */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center text-green-800 text-sm">
                  <span className="mr-2">🛰️</span>
                  <span className="font-semibold">
                    {useFallbackImages ? 'Fallback Satellite Simulation' : 'Live Google Maps Satellite Data'}
                  </span>
                </div>
                <div className="flex space-x-2">
                  {!useFallbackImages && (
                    <>
                      <span className="text-xs bg-green-100 px-2 py-1 rounded">Real-time</span>
                      <span className="text-xs bg-blue-100 px-2 py-1 rounded">High-res</span>
                    </>
                  )}
                  {useFallbackImages && (
                    <span className="text-xs bg-orange-100 px-2 py-1 rounded">Simulated</span>
                  )}
                </div>
              </div>
              <div className="mt-2">
                <button
                  onClick={() => setUseFallbackImages(!useFallbackImages)}
                  className="text-xs bg-white border border-green-300 px-3 py-1 rounded hover:bg-green-50 transition-colors"
                >
                  {useFallbackImages ? 'Try Google Maps API' : 'Use Generated Images'}
                </button>
                {useFallbackImages && (
                  <p className="text-xs text-gray-600 mt-1">
                    Using simulated satellite imagery due to API limitations
                  </p>
                )}
              </div>
            </div>
            
            <div className="space-y-4">
              {/* Base Map Image */}
              <div className="relative">
                <img
                  src={
                    activeLayer === 'street' 
                      ? generateStreetMapImage(1200, 800, cityName)
                      : activeLayer === 'hybrid'
                      ? generateHybridMapImage(1200, 800, cityName)
                      : useFallbackImages 
                        ? generateFallbackImage(1200, 800, cityName) 
                        : satelliteData.base_satellite?.url
                  }
                  alt={activeLayer === 'street' ? 'Street Map View' : activeLayer === 'hybrid' ? 'Hybrid Map View' : 'Base Satellite View'}
                  className="w-full h-80 object-cover rounded-lg border-2 border-gray-200"
                  onError={(e) => {
                    if (!useFallbackImages && activeLayer === 'satellite') {
                      // Try fallback if Google Maps fails
                      setUseFallbackImages(true);
                      e.target.src = generateFallbackImage(1200, 800, cityName);
                    } else {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }
                  }}
                  onLoad={() => {
                    // Hide loading state when image loads successfully
                    const loadingDiv = document.querySelector('.satellite-loading');
                    if (loadingDiv) loadingDiv.style.display = 'none';
                  }}
                />
                <div className="satellite-loading w-full h-64 bg-gradient-to-br from-blue-100 to-green-100 rounded-lg border-2 border-gray-200 items-center justify-center flex">
                  <div className="text-center text-gray-600">
                    <Satellite className="w-16 h-16 mx-auto mb-3 text-blue-500 animate-pulse" />
                    <p className="font-semibold">
                      {activeLayer === 'street' ? 'Loading Street Map...' : 
                       activeLayer === 'hybrid' ? 'Loading Hybrid Map...' : 
                       'Loading Satellite Imagery...'}
                    </p>
                    <p className="text-sm mt-1">
                      {activeLayer === 'satellite' ? 'Powered by Google Maps API' : 'Generated Map View'}
                    </p>
                    <p className="text-xs mt-2 text-gray-500">
                      {activeLayer === 'satellite' ? 'If images don\'t load, API quota may be exceeded' : 'High-quality generated map'}
                    </p>
                    <div className="mt-3 w-32 h-2 bg-gray-200 rounded-full mx-auto overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full animate-pulse"></div>
                    </div>
                  </div>
                </div>
                <div className="absolute top-2 left-2 bg-black bg-opacity-70 text-white px-3 py-1 rounded-lg text-sm">
                  {activeLayer === 'street' ? 'Street Map View' : 
                   activeLayer === 'hybrid' ? 'Hybrid Satellite + Street View' : 
                   satelliteData.base_satellite?.description}
                </div>
                <div className="absolute top-2 right-2 bg-green-600 text-white px-3 py-1 rounded-lg text-sm">
                  {activeLayer === 'street' ? '🗺️ Street Map' : 
                   activeLayer === 'hybrid' ? '🌍 Hybrid View' : 
                   '🌍 Live Satellite'}
                </div>
              </div>

              {/* Time Series Images */}
              <div className="space-y-2">
                <h5 className="text-lg font-semibold text-green-800 flex items-center">
                  <span className="mr-2">⏰</span>
                  {activeLayer === 'street' ? 'Street Map Variations' : 
                   activeLayer === 'hybrid' ? 'Hybrid Map Views' : 
                   'Time Series Satellite Views'}
                </h5>
                <div className="grid grid-cols-3 gap-2">
                  <div className="relative group">
                    <img
                      src={
                        activeLayer === 'street' 
                          ? generateStreetMapImage(800, 600, `${cityName} - Morning`)
                          : activeLayer === 'hybrid'
                          ? generateHybridMapImage(800, 600, `${cityName} - Morning`)
                          : useFallbackImages 
                            ? generateFallbackImage(800, 600, `${cityName} - Morning`) 
                            : satelliteData.time_series?.morning
                      }
                      alt="Morning view"
                      className="w-full h-32 object-cover rounded-lg border-2 border-gray-200 hover:border-green-400 transition-colors"
                    />
                    <div className="absolute bottom-1 left-1 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                      {activeLayer === 'street' ? '🗺️ Downtown' : activeLayer === 'hybrid' ? '🌅 Morning' : '🌅 Morning'}
                    </div>
                    <div className="absolute top-1 right-1 bg-blue-600 text-white text-xs px-1 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                      {useFallbackImages ? 'Sim' : 'Live'}
                    </div>
                  </div>
                  <div className="relative group">
                    <img
                      src={
                        activeLayer === 'street' 
                          ? generateStreetMapImage(800, 600, `${cityName} - Afternoon`)
                          : activeLayer === 'hybrid'
                          ? generateHybridMapImage(800, 600, `${cityName} - Afternoon`)
                          : useFallbackImages 
                            ? generateFallbackImage(800, 600, `${cityName} - Afternoon`) 
                            : satelliteData.time_series?.afternoon
                      }
                      alt="Afternoon view"
                      className="w-full h-32 object-cover rounded-lg border-2 border-gray-200 hover:border-green-400 transition-colors"
                    />
                    <div className="absolute bottom-1 left-1 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                      {activeLayer === 'street' ? '🏢 Business' : activeLayer === 'hybrid' ? '☀️ Afternoon' : '☀️ Afternoon'}
                    </div>
                    <div className="absolute top-1 right-1 bg-blue-600 text-white text-xs px-1 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                      {useFallbackImages ? 'Sim' : 'Live'}
                    </div>
                  </div>
                  <div className="relative group">
                    <img
                      src={
                        activeLayer === 'street' 
                          ? generateStreetMapImage(800, 600, `${cityName} - Evening`)
                          : activeLayer === 'hybrid'
                          ? generateHybridMapImage(800, 600, `${cityName} - Evening`)
                          : useFallbackImages 
                            ? generateFallbackImage(800, 600, `${cityName} - Evening`) 
                            : satelliteData.time_series?.evening
                      }
                      alt="Evening view"
                      className="w-full h-32 object-cover rounded-lg border-2 border-gray-200 hover:border-green-400 transition-colors"
                    />
                    <div className="absolute bottom-1 left-1 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                      {activeLayer === 'street' ? '🏠 Residential' : activeLayer === 'hybrid' ? '🌆 Evening' : '🌆 Evening'}
                    </div>
                    <div className="absolute top-1 right-1 bg-blue-600 text-white text-xs px-1 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                      {useFallbackImages ? 'Sim' : 'Live'}
                    </div>
                  </div>
                </div>
              </div>

              {/* High-Resolution Satellite Views */}
              <div className="space-y-4">
                <h5 className="text-lg font-semibold text-green-800 flex items-center">
                  <span className="mr-2">🛰️</span>
                  High-Resolution Satellite Views
                </h5>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Detailed View */}
                  <div className="relative">
                    <img
                      src={useFallbackImages ? generateFallbackImage(1600, 1200, `${cityName} - Detailed`) : satelliteData.detailed_view?.url}
                      alt="Detailed satellite view"
                      className="w-full h-56 object-cover rounded-lg border-2 border-gray-200 hover:border-green-400 transition-colors"
                    />
                    <div className="absolute top-2 left-2 bg-black bg-opacity-70 text-white px-3 py-1 rounded-lg text-sm">
                      📡 Detailed View ({useFallbackImages ? '1600x1200' : satelliteData.detailed_view?.resolution})
                    </div>
                    <div className="absolute bottom-2 right-2 bg-green-600 text-white px-2 py-1 rounded text-xs">
                      Zoom: {useFallbackImages ? '14x' : satelliteData.detailed_view?.zoom_level}x
                    </div>
                  </div>

                  {/* Street View Reference */}
                  <div className="relative">
                    <img
                      src={useFallbackImages ? generateFallbackImage(1200, 900, `${cityName} - Street View`) : satelliteData.street_view?.url}
                      alt="Street view reference"
                      className="w-full h-56 object-cover rounded-lg border-2 border-gray-200 hover:border-green-400 transition-colors"
                    />
                    <div className="absolute top-2 left-2 bg-black bg-opacity-70 text-white px-3 py-1 rounded-lg text-sm">
                      🗺️ Street Reference ({useFallbackImages ? '1200x900' : satelliteData.street_view?.resolution})
                    </div>
                    <div className="absolute bottom-2 right-2 bg-blue-600 text-white px-2 py-1 rounded text-xs">
                      {useFallbackImages ? 'Simulated' : 'Reference Map'}
                    </div>
                  </div>
                </div>

                {/* Thermal Overlay */}
                <div className="relative">
                  <img
                    src={useFallbackImages ? generateFallbackImage(1200, 800, `${cityName} - Thermal`) : satelliteData.thermal_overlay?.url}
                    alt="Thermal overlay satellite view"
                    className="w-full h-72 object-cover rounded-lg border-2 border-orange-200 hover:border-orange-400 transition-colors"
                  />
                  <div className="absolute top-2 left-2 bg-orange-600 bg-opacity-90 text-white px-3 py-1 rounded-lg text-sm">
                    🌡️ Thermal Overlay ({useFallbackImages ? '1200x800' : satelliteData.thermal_overlay?.resolution})
                  </div>
                  <div className="absolute top-2 right-2 bg-red-600 text-white px-3 py-1 rounded-lg text-sm">
                    🔥 Heat Detection
                  </div>
                  <div className="absolute bottom-2 left-2 bg-black bg-opacity-70 text-white px-3 py-1 rounded-lg text-sm">
                    {useFallbackImages ? 'Simulated thermal analysis' : 'Enhanced with thermal analysis'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Map */}
        <div className="bg-white rounded-xl p-4 shadow-lg border-2 border-green-200">
          <h4 className="text-xl font-bold text-green-800 mb-4 flex items-center">
            <MapPin className="w-5 h-5 mr-2" />
            Interactive Analysis Map
          </h4>
          
          <div className="relative rounded-lg overflow-hidden border shadow-lg" style={{height: 400}}>
            <MapContainer 
              center={[center.lat, center.lng]} 
              zoom={13} 
              style={{height: '100%', width: '100%'}}
            >
              <TileLayer 
                url={
                  activeLayer === 'satellite' 
                    ? "https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}"
                    : activeLayer === 'hybrid'
                    ? "https://{s}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}"
                    : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                }
                attribution={
                  activeLayer === 'satellite' || activeLayer === 'hybrid'
                    ? "&copy; Google"
                    : "&copy; OpenStreetMap"
                }
                subdomains={activeLayer === 'satellite' || activeLayer === 'hybrid' ? ['mt0', 'mt1', 'mt2', 'mt3'] : undefined}
              />

              {/* Render based on selected analysis */}
              {selectedAnalysis === 'thermal' && satelliteData.heat_analysis?.thermal_zones?.map((zone, index) => (
                <CircleMarker
                  key={`thermal-${index}`}
                  center={[zone.lat, zone.lng]}
                  radius={Math.max(5, zone.intensity * 15)}
                  pathOptions={{
                    color: zone.color,
                    fillColor: zone.color,
                    fillOpacity: 0.7,
                    weight: 2
                  }}
                >
                  <Popup className="custom-popup" maxWidth={300}>
                    <div className="p-2">
                      <h3 className="font-bold text-lg text-gray-800 mb-2">{zone.zone_type}</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Temperature:</span>
                          <span className="font-semibold">{zone.temperature}°C</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Intensity:</span>
                          <span className="font-semibold">{zone.intensity}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Area:</span>
                          <span className="font-semibold">{zone.area_km2} km²</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Population Affected:</span>
                          <span className="font-semibold">{zone.population_affected.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Priority:</span>
                          <span className={`font-semibold ${
                            zone.priority === 'HIGH' ? 'text-red-600' :
                            zone.priority === 'MEDIUM' ? 'text-orange-600' :
                            zone.priority === 'LOW' ? 'text-yellow-600' :
                            'text-green-600'
                          }`}>
                            {zone.priority}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Popup>
                </CircleMarker>
              ))}

              {selectedAnalysis === 'landuse' && satelliteData.heat_analysis?.land_use_analysis?.map((land, index) => (
                <CircleMarker
                  key={`land-${index}`}
                  center={[land.lat, land.lng]}
                  radius={Math.max(3, land.area_km2 * 2)}
                  pathOptions={{
                    color: getLandUseColor(land.land_type),
                    fillColor: getLandUseColor(land.land_type),
                    fillOpacity: 0.6,
                    weight: 2
                  }}
                >
                  <Popup className="custom-popup" maxWidth={300}>
                    <div className="p-2">
                      <h3 className="font-bold text-lg text-gray-800 mb-2">{land.land_type}</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Heat Factor:</span>
                          <span className="font-semibold">{land.heat_factor}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Green Coverage:</span>
                          <span className="font-semibold">{(land.green_coverage * 100).toFixed(1)}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Density:</span>
                          <span className="font-semibold capitalize">{land.density}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Area:</span>
                          <span className="font-semibold">{land.area_km2} km²</span>
                        </div>
                        {land.estimated_population > 0 && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Population:</span>
                            <span className="font-semibold">{land.estimated_population.toLocaleString()}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </Popup>
                </CircleMarker>
              ))}

              {selectedAnalysis === 'green' && satelliteData.heat_analysis?.green_space_mapping?.map((space, index) => (
                <CircleMarker
                  key={`green-${index}`}
                  center={[space.lat, space.lng]}
                  radius={Math.max(4, space.area_km2 * 3)}
                  pathOptions={{
                    color: getGreenSpaceColor(space.space_type),
                    fillColor: getGreenSpaceColor(space.space_type),
                    fillOpacity: 0.7,
                    weight: 2
                  }}
                >
                  <Popup className="custom-popup" maxWidth={300}>
                    <div className="p-2">
                      <h3 className="font-bold text-lg text-gray-800 mb-2">{space.space_type}</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Cooling Effect:</span>
                          <span className="font-semibold">{space.cooling_effect}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Temp Reduction:</span>
                          <span className="font-semibold">-{space.temperature_reduction}°C</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Area:</span>
                          <span className="font-semibold">{space.area_km2} km²</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Trees:</span>
                          <span className="font-semibold">{space.tree_count.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Biodiversity:</span>
                          <span className="font-semibold">{(space.biodiversity_index * 100).toFixed(1)}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Accessibility:</span>
                          <span className="font-semibold">{space.accessibility}</span>
                        </div>
                      </div>
                    </div>
                  </Popup>
                </CircleMarker>
              ))}

              {selectedAnalysis === 'gradient' && satelliteData.heat_analysis?.temperature_gradient?.map((point, index) => (
                <CircleMarker
                  key={`gradient-${index}`}
                  center={[point.lat, point.lng]}
                  radius={3}
                  pathOptions={{
                    color: getTemperatureColor(point.temperature),
                    fillColor: getTemperatureColor(point.temperature),
                    fillOpacity: 0.8,
                    weight: 1
                  }}
                >
                  <Popup className="custom-popup" maxWidth={200}>
                    <div className="p-2">
                      <div className="text-center">
                        <div className="font-bold text-lg text-gray-800">{point.temperature}°C</div>
                        <div className="text-sm text-gray-600">Intensity: {point.intensity}</div>
                      </div>
                    </div>
                  </Popup>
                </CircleMarker>
              ))}

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
                <Popup className="custom-popup" maxWidth={300}>
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
                    </div>
                  </div>
                </Popup>
              </CircleMarker>
            </MapContainer>
          </div>
        </div>
      </div>

      {/* Analysis Summary */}
      <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-green-200">
        <h4 className="text-xl font-bold text-green-800 mb-4 flex items-center">
          <AlertTriangle className="w-5 h-5 mr-2" />
          Analysis Summary
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-red-50 p-4 rounded-lg border border-red-200">
            <div className="flex items-center space-x-2 mb-2">
              <Thermometer className="w-5 h-5 text-red-600" />
              <span className="font-semibold text-red-800">Critical Zones</span>
            </div>
            <div className="text-2xl font-bold text-red-600">
              {satelliteData.heat_analysis?.thermal_zones?.filter(z => z.priority === 'HIGH').length || 0}
            </div>
            <div className="text-sm text-red-600">High priority areas</div>
          </div>

          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <div className="flex items-center space-x-2 mb-2">
              <TreePine className="w-5 h-5 text-green-600" />
              <span className="font-semibold text-green-800">Green Spaces</span>
            </div>
            <div className="text-2xl font-bold text-green-600">
              {satelliteData.heat_analysis?.green_space_mapping?.length || 0}
            </div>
            <div className="text-sm text-green-600">Cooling zones</div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div className="flex items-center space-x-2 mb-2">
              <Building className="w-5 h-5 text-blue-600" />
              <span className="font-semibold text-blue-800">Land Use Types</span>
            </div>
            <div className="text-2xl font-bold text-blue-600">
              {new Set(satelliteData.heat_analysis?.land_use_analysis?.map(l => l.land_type)).size || 0}
            </div>
            <div className="text-sm text-blue-600">Different zones</div>
          </div>

          <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
            <div className="flex items-center space-x-2 mb-2">
              <Sun className="w-5 h-5 text-orange-600" />
              <span className="font-semibold text-orange-800">Temp Range</span>
            </div>
            <div className="text-2xl font-bold text-orange-600">
              {satelliteData.heat_analysis?.temperature_gradient ? 
                `${Math.min(...satelliteData.heat_analysis.temperature_gradient.map(t => t.temperature)).toFixed(1)}°C - ${Math.max(...satelliteData.heat_analysis.temperature_gradient.map(t => t.temperature)).toFixed(1)}°C` :
                'N/A'
              }
            </div>
            <div className="text-sm text-orange-600">Temperature spread</div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .custom-popup .leaflet-popup-content-wrapper {
          background: white;
          border-radius: 8px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }
        .custom-popup .leaflet-popup-content {
          margin: 0;
          padding: 0;
        }
      `}</style>
    </div>
  );
};

export default EnhancedSatelliteImagery;
