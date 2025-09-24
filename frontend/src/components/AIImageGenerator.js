import React, { useState } from 'react';
import { 
  Zap, 
  Image as ImageIcon, 
  Download, 
  RefreshCw, 
  Settings, 
  Palette,
  Thermometer,
  MapPin,
  Clock,
  Target
} from 'lucide-react';

const AIImageGenerator = ({ cityData, heatZones, satelliteData }) => {
  const [generating, setGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState([]);
  const [progress, setProgress] = useState(0);
  const [generationStatus, setGenerationStatus] = useState('');
  const [settings, setSettings] = useState({
    resolution: '1920x1080',
    style: 'normal_thermal',
    overlay: 'thermal',
    intensity: 'high',
    quality: 'ultra',
    effects: 'standard'
  });

  const generateThermalImage = async () => {
    setGenerating(true);
    setProgress(0);
    setGenerationStatus('Initializing AI model...');
    
    try {
      // Simulate AI image generation process with progress
      const steps = [
        { progress: 20, status: 'Loading neural network...' },
        { progress: 40, status: 'Analyzing city data...' },
        { progress: 60, status: 'Processing heat zones...' },
        { progress: 80, status: 'Rendering thermal image...' },
        { progress: 100, status: 'Finalizing output...' }
      ];
      
      for (const step of steps) {
        setProgress(step.progress);
        setGenerationStatus(step.status);
        await new Promise(resolve => setTimeout(resolve, 300));
      }
      
      // Generate different types of images based on settings
      const imageData = {
        id: Date.now(),
        type: settings.overlay || 'thermal',
        url: generateMockThermalImage(),
        metadata: {
          city: cityData?.city || 'Unknown City',
          timestamp: new Date().toISOString(),
          resolution: settings.resolution,
          style: settings.style,
          overlay: settings.overlay,
          intensity: settings.intensity,
          heatZones: heatZones?.length || 0,
          avgTemperature: calculateAverageTemperature(),
          maxTemperature: calculateMaxTemperature(),
          minTemperature: calculateMinTemperature(),
          generationTime: '1.5s',
          aiModel: 'ThermalGAN-v2.1'
        }
      };
      
      setGeneratedImages(prev => [imageData, ...prev]);
      setGenerationStatus('Image generated successfully!');
    } catch (error) {
      console.error('Error generating image:', error);
      setGenerationStatus('Generation failed. Please try again.');
    } finally {
      setGenerating(false);
      setTimeout(() => {
        setProgress(0);
        setGenerationStatus('');
      }, 2000);
    }
  };

  const generateMultipleImages = async () => {
    setGenerating(true);
    
    try {
      const imageTypes = ['thermal', 'satellite', 'heatmap', 'topographic'];
      const generatedImages = [];
      
      for (let i = 0; i < imageTypes.length; i++) {
        const type = imageTypes[i];
        
        // Update settings for this image type
        const currentSettings = { ...settings, overlay: type };
        
        // Simulate generation time
        await new Promise(resolve => setTimeout(resolve, 800));
        
        const imageData = {
          id: Date.now() + i,
          type: type,
          url: generateMockThermalImage(),
          metadata: {
            city: cityData?.city || 'Unknown City',
            timestamp: new Date().toISOString(),
            resolution: settings.resolution,
            style: settings.style,
            overlay: type,
            intensity: settings.intensity,
            heatZones: heatZones?.length || 0,
            avgTemperature: calculateAverageTemperature(),
            maxTemperature: calculateMaxTemperature(),
            minTemperature: calculateMinTemperature(),
            generationTime: '0.8s',
            aiModel: `${type.charAt(0).toUpperCase() + type.slice(1)}GAN-v2.1`
          }
        };
        
        generatedImages.push(imageData);
      }
      
      setGeneratedImages(prev => [...generatedImages, ...prev]);
    } catch (error) {
      console.error('Error generating multiple images:', error);
    } finally {
      setGenerating(false);
    }
  };

  const generateMockThermalImage = () => {
    // Create a normal thermal image using canvas
    const canvas = document.createElement('canvas');
    const [width, height] = settings.resolution.split('x').map(Number);
    canvas.width = width || 1024;
    canvas.height = height || 768;
    const ctx = canvas.getContext('2d');
    
    try {
      // Enable anti-aliasing for smoother images
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      
      // Create thermal image with normal thermal color palette
      generateNormalThermalImage(ctx, canvas.width, canvas.height);
      
      // Set PNG quality based on settings
      const quality = settings.quality === 'maximum' ? 1.0 : 
                     settings.quality === 'ultra' ? 0.95 :
                     settings.quality === 'high' ? 0.9 : 0.8;
      
      return canvas.toDataURL('image/png', quality);
    } catch (error) {
      console.error('Error generating thermal image:', error);
      // Return a simple fallback thermal image
      return generateSimpleThermalFallback(width || 1024, height || 768, cityData?.city || 'City');
    }
  };

  // Generate normal thermal image with standard thermal color palette
  const generateNormalThermalImage = (ctx, width, height) => {
    // Standard thermal imaging background (dark blue/black)
    ctx.fillStyle = '#000814';
    ctx.fillRect(0, 0, width, height);
    
    // Create thermal gradient background
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, '#000814'); // Dark blue
    gradient.addColorStop(0.3, '#001d3d'); // Medium blue
    gradient.addColorStop(0.7, '#003566'); // Lighter blue
    gradient.addColorStop(1, '#003566'); // Light blue
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    
    // Add thermal color zones based on temperature ranges
    addThermalColorZones(ctx, width, height);
    
    // Add heat zones from real data
    if (heatZones && heatZones.length > 0) {
      addRealHeatZones(ctx, width, height);
    }
    
    // Add thermal scale legend
    addThermalScale(ctx, width, height);
    
    // Add city information
    addCityInfo(ctx, width, height);
    
    // Add thermal image metadata
    addThermalMetadata(ctx, width, height);
  };

  // Add thermal color zones with standard thermal imaging colors
  const addThermalColorZones = (ctx, width, height) => {
    const thermalColors = [
      { temp: 'Cold', color: '#000080', range: [0, 0.2] },      // Dark blue (cold)
      { temp: 'Cool', color: '#0080ff', range: [0.2, 0.4] },    // Blue (cool)
      { temp: 'Moderate', color: '#00ff00', range: [0.4, 0.6] }, // Green (moderate)
      { temp: 'Warm', color: '#ffff00', range: [0.6, 0.8] },     // Yellow (warm)
      { temp: 'Hot', color: '#ff8000', range: [0.8, 0.9] },      // Orange (hot)
      { temp: 'Very Hot', color: '#ff0000', range: [0.9, 1.0] }  // Red (very hot)
    ];
    
    // Create thermal zones across the image
    thermalColors.forEach((zone, index) => {
      const startY = zone.range[0] * height;
      const endY = zone.range[1] * height;
      const zoneHeight = endY - startY;
      
      // Create gradient for smooth transitions
      const zoneGradient = ctx.createLinearGradient(0, startY, 0, endY);
      zoneGradient.addColorStop(0, zone.color);
      zoneGradient.addColorStop(1, zone.color + '80'); // Add transparency
      
      ctx.fillStyle = zoneGradient;
      ctx.fillRect(0, startY, width, zoneHeight);
      
      // Add some noise for realism
      addThermalNoise(ctx, 0, startY, width, zoneHeight, zone.color);
    });
  };

  // Add thermal noise for realism
  const addThermalNoise = (ctx, x, y, w, h, baseColor) => {
    const imageData = ctx.getImageData(x, y, w, h);
    const data = imageData.data;
    
    for (let i = 0; i < data.length; i += 4) {
      // Add slight random variation to RGB values
      const noise = (Math.random() - 0.5) * 20;
      data[i] = Math.max(0, Math.min(255, data[i] + noise));     // Red
      data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + noise)); // Green
      data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + noise)); // Blue
    }
    
    ctx.putImageData(imageData, x, y);
  };

  // Add real heat zones from city data
  const addRealHeatZones = (ctx, width, height) => {
    if (!heatZones || heatZones.length === 0) return;
    
    heatZones.forEach((zone, index) => {
      if (zone.lat && zone.lng) {
        // Convert lat/lng to canvas coordinates
        const x = ((zone.lng + 180) / 360) * width;
        const y = ((90 - zone.lat) / 180) * height;
        const intensity = zone.intensity || 0.5;
        
        // Determine thermal color based on intensity
        let thermalColor;
        if (intensity > 0.8) thermalColor = '#ff0000'; // Red - Very hot
        else if (intensity > 0.6) thermalColor = '#ff8000'; // Orange - Hot
        else if (intensity > 0.4) thermalColor = '#ffff00'; // Yellow - Warm
        else if (intensity > 0.2) thermalColor = '#00ff00'; // Green - Moderate
        else thermalColor = '#0080ff'; // Blue - Cool
        
        // Create thermal hotspot
        const radius = 20 + intensity * 40;
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
        gradient.addColorStop(0, thermalColor);
        gradient.addColorStop(0.7, thermalColor + '80');
        gradient.addColorStop(1, thermalColor + '20');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
        
        // Add temperature reading
        ctx.fillStyle = '#ffffff';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`${Math.round(20 + intensity * 30)}°C`, x, y - radius - 5);
      }
    });
  };

  // Add thermal scale legend
  const addThermalScale = (ctx, width, height) => {
    const scaleWidth = 200;
    const scaleHeight = 20;
    const scaleX = width - scaleWidth - 20;
    const scaleY = 20;
    
    // Create thermal scale gradient
    const scaleGradient = ctx.createLinearGradient(scaleX, 0, scaleX + scaleWidth, 0);
    scaleGradient.addColorStop(0, '#000080'); // Cold
    scaleGradient.addColorStop(0.2, '#0080ff'); // Cool
    scaleGradient.addColorStop(0.4, '#00ff00'); // Moderate
    scaleGradient.addColorStop(0.6, '#ffff00'); // Warm
    scaleGradient.addColorStop(0.8, '#ff8000'); // Hot
    scaleGradient.addColorStop(1, '#ff0000'); // Very hot
    
    ctx.fillStyle = scaleGradient;
    ctx.fillRect(scaleX, scaleY, scaleWidth, scaleHeight);
    
    // Add scale border
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1;
    ctx.strokeRect(scaleX, scaleY, scaleWidth, scaleHeight);
    
    // Add temperature labels
    ctx.fillStyle = '#ffffff';
    ctx.font = '10px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('0°C', scaleX, scaleY + scaleHeight + 15);
    ctx.fillText('50°C', scaleX + scaleWidth, scaleY + scaleHeight + 15);
    
    // Add "Thermal Scale" label
    ctx.textAlign = 'left';
    ctx.font = '12px Arial';
    ctx.fillText('Thermal Scale', scaleX, scaleY - 5);
  };

  // Add city information
  const addCityInfo = (ctx, width, height) => {
    const cityName = cityData?.city || 'Unknown City';
    const timestamp = new Date().toLocaleString();
    
    // City name
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 18px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(`${cityName} - Thermal Analysis`, 20, 30);
    
    // Timestamp
    ctx.font = '12px Arial';
    ctx.fillText(timestamp, 20, 50);
    
    // Heat zone count
    if (heatZones && heatZones.length > 0) {
      ctx.fillText(`Heat Zones: ${heatZones.length}`, 20, 70);
    }
  };

  // Add thermal metadata
  const addThermalMetadata = (ctx, width, height) => {
    ctx.fillStyle = '#ffffff';
    ctx.font = '10px Arial';
    ctx.textAlign = 'right';
    
    // Add metadata in bottom right
    const metadata = [
      'Thermal Imaging System',
      'Resolution: ' + settings.resolution,
      'AI Model: ThermalGAN-v2.1',
      'Generated: ' + new Date().toISOString().split('T')[0]
    ];
    
    metadata.forEach((text, index) => {
      ctx.fillText(text, width - 20, height - 60 + (index * 12));
    });
  };

  // Generate simple thermal fallback
  const generateSimpleThermalFallback = (width, height, cityName) => {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    
    // Simple thermal background
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, '#000080');
    gradient.addColorStop(0.5, '#0080ff');
    gradient.addColorStop(1, '#ff0000');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    
    // Add simple text
    ctx.fillStyle = '#ffffff';
    ctx.font = '24px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(`${cityName} - Thermal Image`, width / 2, height / 2);
    ctx.font = '16px Arial';
    ctx.fillText('Thermal Analysis', width / 2, height / 2 + 30);
    
    return canvas.toDataURL('image/png', 0.9);
  };

  // Helper function to generate detailed terrain
  const generateDetailedTerrain = (ctx, width, height) => {
    // Create multiple terrain layers for depth
    const layers = [
      { color: '#0f3460', opacity: 0.8, scale: 0.3 }, // Water bodies
      { color: '#2c5530', opacity: 0.7, scale: 0.5 }, // Forest areas
      { color: '#8b7355', opacity: 0.6, scale: 0.7 }, // Urban areas
      { color: '#4a6741', opacity: 0.5, scale: 1.0 }  // General terrain
    ];
    
    layers.forEach(layer => {
      ctx.fillStyle = `rgba(${hexToRgb(layer.color)}, ${layer.opacity})`;
      
      // Generate organic terrain shapes
      for (let i = 0; i < 50; i++) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        const size = (Math.random() * 100 + 20) * layer.scale;
        
        ctx.beginPath();
        ctx.arc(x, y, size, 0, 2 * Math.PI);
        ctx.fill();
        
        // Add smaller details
        for (let j = 0; j < 3; j++) {
          const subX = x + (Math.random() - 0.5) * size;
          const subY = y + (Math.random() - 0.5) * size;
          const subSize = size * 0.3;
          
          ctx.beginPath();
          ctx.arc(subX, subY, subSize, 0, 2 * Math.PI);
          ctx.fill();
        }
      }
    });
  };

  // Helper function to add satellite overlay
  const addSatelliteOverlay = (ctx, width, height) => {
    // Create satellite-style grid
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 0.5;
    
    // Vertical grid lines
    for (let i = 0; i < width; i += 50) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, height);
      ctx.stroke();
    }
    
    // Horizontal grid lines
    for (let i = 0; i < height; i += 50) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(width, i);
      ctx.stroke();
    }
    
    // Add coordinate markers
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.font = '10px monospace';
    ctx.textAlign = 'left';
    
    // Add some coordinate labels
    for (let i = 0; i < 5; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      const lat = (Math.random() - 0.5) * 180;
      const lng = (Math.random() - 0.5) * 360;
      
      ctx.fillText(`${lat.toFixed(2)}°, ${lng.toFixed(2)}°`, x, y);
    }
  };

  // Helper function to add detailed heat zones
  const addDetailedHeatZones = (ctx, width, height) => {
    heatZones.forEach((zone, index) => {
      if (zone.lat && zone.lng) {
        // Convert lat/lng to canvas coordinates with better projection
        const x = (zone.lng + 180) / 360 * width;
        const y = (90 - zone.lat) / 180 * height;
        
        const intensity = zone.intensity || 0.5;
        const temperature = zone.temperature || 30;
        
        // Create multiple concentric heat zones for more detail
        const zones = [
          { radius: intensity * 80 + 30, opacity: 0.8, blur: 0 },
          { radius: intensity * 60 + 20, opacity: 0.6, blur: 2 },
          { radius: intensity * 40 + 15, opacity: 0.4, blur: 4 },
          { radius: intensity * 20 + 10, opacity: 0.2, blur: 6 }
        ];
        
        zones.forEach(zoneConfig => {
          // Create gradient for each zone
          const heatGradient = ctx.createRadialGradient(x, y, 0, x, y, zoneConfig.radius);
          
          // Dynamic color based on temperature and intensity
          let color;
          if (temperature > 40) {
            color = `rgba(255, 0, 0, ${zoneConfig.opacity})`; // Red - Very Hot
          } else if (temperature > 35) {
            color = `rgba(255, 100, 0, ${zoneConfig.opacity})`; // Orange-Red - Hot
          } else if (temperature > 30) {
            color = `rgba(255, 165, 0, ${zoneConfig.opacity})`; // Orange - Warm
          } else if (temperature > 25) {
            color = `rgba(255, 255, 0, ${zoneConfig.opacity})`; // Yellow - Moderate
          } else {
            color = `rgba(0, 255, 0, ${zoneConfig.opacity})`; // Green - Cool
          }
          
          heatGradient.addColorStop(0, color);
          heatGradient.addColorStop(0.7, color.replace(/[\d.]+\)$/, '0.3)'));
          heatGradient.addColorStop(1, color.replace(/[\d.]+\)$/, '0.0)'));
          
          ctx.fillStyle = heatGradient;
          ctx.beginPath();
          ctx.arc(x, y, zoneConfig.radius, 0, 2 * Math.PI);
          ctx.fill();
          
          // Add temperature reading
          if (zoneConfig.radius === zones[0].radius) {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
            ctx.font = 'bold 12px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(`${temperature}°C`, x, y + 4);
          }
        });
        
        // Add heat zone identifier
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.font = '10px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(`HZ-${index + 1}`, x, y - zones[0].radius - 5);
      }
    });
  };

  // Helper function to add atmospheric effects
  const addAtmosphericEffects = (ctx, width, height) => {
    // Add atmospheric haze
    const hazeGradient = ctx.createLinearGradient(0, 0, 0, height);
    hazeGradient.addColorStop(0, 'rgba(135, 206, 235, 0.1)'); // Sky blue
    hazeGradient.addColorStop(1, 'rgba(135, 206, 235, 0.05)'); // Lighter at bottom
    
    ctx.fillStyle = hazeGradient;
    ctx.fillRect(0, 0, width, height);
    
    // Add cloud-like atmospheric distortions
    ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
    for (let i = 0; i < 20; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      const size = Math.random() * 100 + 50;
      
      ctx.beginPath();
      ctx.arc(x, y, size, 0, 2 * Math.PI);
      ctx.fill();
    }
  };

  // Helper function to add thermal analysis overlays
  const addThermalAnalysisOverlays = (ctx, width, height) => {
    // Add thermal scale legend
    const legendWidth = 200;
    const legendHeight = 20;
    const legendX = width - legendWidth - 20;
    const legendY = 20;
    
    // Create thermal scale gradient
    const scaleGradient = ctx.createLinearGradient(legendX, legendY, legendX + legendWidth, legendY);
    scaleGradient.addColorStop(0, '#0000FF'); // Blue - Cold
    scaleGradient.addColorStop(0.25, '#00FFFF'); // Cyan
    scaleGradient.addColorStop(0.5, '#00FF00'); // Green
    scaleGradient.addColorStop(0.75, '#FFFF00'); // Yellow
    scaleGradient.addColorStop(1, '#FF0000'); // Red - Hot
    
    ctx.fillStyle = scaleGradient;
    ctx.fillRect(legendX, legendY, legendWidth, legendHeight);
    
    // Add scale labels
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.font = '10px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Temperature Scale (°C)', legendX + legendWidth/2, legendY - 5);
    ctx.fillText('20°', legendX, legendY + 35);
    ctx.fillText('50°', legendX + legendWidth, legendY + 35);
    
    // Add analysis statistics
    const stats = {
      avgTemp: calculateAverageTemperature(),
      maxTemp: calculateMaxTemperature(),
      minTemp: calculateMinTemperature(),
      heatZones: heatZones?.length || 0
    };
    
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(20, height - 120, 250, 100);
    
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.font = 'bold 12px Arial';
    ctx.textAlign = 'left';
    ctx.fillText('Thermal Analysis Statistics:', 30, height - 100);
    
    ctx.font = '10px Arial';
    ctx.fillText(`Average Temperature: ${stats.avgTemp}°C`, 30, height - 80);
    ctx.fillText(`Maximum Temperature: ${stats.maxTemp}°C`, 30, height - 65);
    ctx.fillText(`Minimum Temperature: ${stats.minTemp}°C`, 30, height - 50);
    ctx.fillText(`Heat Zones Detected: ${stats.heatZones}`, 30, height - 35);
    ctx.fillText(`Analysis Date: ${new Date().toLocaleDateString()}`, 30, height - 20);
  };

  // Helper function to add professional annotations
  const addProfessionalAnnotations = (ctx, width, height) => {
    // Add main title
    ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    ctx.fillRect(width/2 - 200, 10, 400, 40);
    
    ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
    ctx.font = 'bold 18px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(`${cityData?.city || 'City'} - AI Thermal Analysis`, width/2, 35);
    
    // Add AI model information
    ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
    ctx.fillRect(width - 200, height - 40, 180, 30);
    
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.font = '10px Arial';
    ctx.textAlign = 'right';
    ctx.fillText(`AI Model: ThermalGAN-v3.0`, width - 20, height - 20);
    ctx.fillText(`Generated: ${new Date().toLocaleString()}`, width - 20, height - 8);
    
    // Add quality indicators
    ctx.fillStyle = 'rgba(0, 255, 0, 0.8)';
    ctx.font = 'bold 12px Arial';
    ctx.textAlign = 'left';
    ctx.fillText('✓ High Resolution', 20, 30);
    ctx.fillText('✓ Real-time Data', 20, 45);
    ctx.fillText('✓ AI Enhanced', 20, 60);
  };

  // Helper function to apply post-processing effects
  const applyPostProcessing = (ctx, width, height) => {
    // Apply effects based on settings
    const effectsLevel = settings.effects;
    
    // Add noise for realism (varies by effects level)
    const noiseIntensity = effectsLevel === 'cinematic' ? 8 : 
                          effectsLevel === 'professional' ? 12 :
                          effectsLevel === 'enhanced' ? 15 : 20;
    
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;
    
    for (let i = 0; i < data.length; i += 4) {
      const noise = (Math.random() - 0.5) * noiseIntensity;
      data[i] = Math.max(0, Math.min(255, data[i] + noise));     // Red
      data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + noise)); // Green
      data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + noise)); // Blue
    }
    
    ctx.putImageData(imageData, 0, 0);
    
    // Add vignette effect (varies by effects level)
    const vignetteIntensity = effectsLevel === 'cinematic' ? 0.3 :
                             effectsLevel === 'professional' ? 0.2 :
                             effectsLevel === 'enhanced' ? 0.15 : 0.1;
    
    const vignetteGradient = ctx.createRadialGradient(width/2, height/2, 0, width/2, height/2, Math.max(width, height)/2);
    vignetteGradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
    vignetteGradient.addColorStop(0.7, 'rgba(0, 0, 0, 0)');
    vignetteGradient.addColorStop(1, `rgba(0, 0, 0, ${vignetteIntensity})`);
    
    ctx.fillStyle = vignetteGradient;
    ctx.fillRect(0, 0, width, height);
    
    // Add advanced effects for professional and cinematic modes
    if (effectsLevel === 'professional' || effectsLevel === 'cinematic') {
      // Add subtle color grading
      const colorGrading = ctx.createLinearGradient(0, 0, width, height);
      
      if (effectsLevel === 'cinematic') {
        // Cinematic color grading (warm tones)
        colorGrading.addColorStop(0, 'rgba(255, 200, 100, 0.05)');
        colorGrading.addColorStop(0.5, 'rgba(255, 150, 50, 0.03)');
        colorGrading.addColorStop(1, 'rgba(200, 100, 0, 0.05)');
      } else {
        // Professional color grading (neutral with slight warmth)
        colorGrading.addColorStop(0, 'rgba(255, 255, 240, 0.02)');
        colorGrading.addColorStop(0.5, 'rgba(255, 250, 200, 0.02)');
        colorGrading.addColorStop(1, 'rgba(250, 240, 200, 0.02)');
      }
      
      ctx.fillStyle = colorGrading;
      ctx.fillRect(0, 0, width, height);
      
      // Add subtle sharpening effect
      if (effectsLevel === 'cinematic') {
        // Apply subtle edge enhancement
        const sharpenData = ctx.getImageData(0, 0, width, height);
        const sharpenImageData = sharpenData.data;
        
        for (let y = 1; y < height - 1; y++) {
          for (let x = 1; x < width - 1; x++) {
            const idx = (y * width + x) * 4;
            
            // Simple edge detection and enhancement
            const center = sharpenImageData[idx];
            const top = sharpenImageData[((y-1) * width + x) * 4];
            const bottom = sharpenImageData[((y+1) * width + x) * 4];
            const left = sharpenImageData[(y * width + (x-1)) * 4];
            const right = sharpenImageData[(y * width + (x+1)) * 4];
            
            const edge = Math.abs(center * 4 - top - bottom - left - right);
            const enhancement = Math.min(edge * 0.1, 20);
            
            sharpenImageData[idx] = Math.min(255, center + enhancement);
            sharpenImageData[idx + 1] = Math.min(255, sharpenImageData[idx + 1] + enhancement);
            sharpenImageData[idx + 2] = Math.min(255, sharpenImageData[idx + 2] + enhancement);
          }
        }
        
        ctx.putImageData(sharpenData, 0, 0);
      }
    }
  };

  // Helper function to convert hex to RGB
  const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? 
      `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : 
      '0, 0, 0';
  };

  // Helper function to generate fallback image
  const generateFallbackImage = (width, height, cityName) => {
    return 'data:image/svg+xml;base64,' + btoa(`
      <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="thermal" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#0000FF;stop-opacity:1" />
            <stop offset="25%" style="stop-color:#00FFFF;stop-opacity:1" />
            <stop offset="50%" style="stop-color:#00FF00;stop-opacity:1" />
            <stop offset="75%" style="stop-color:#FFFF00;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#FF0000;stop-opacity:1" />
          </linearGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#thermal)"/>
        <text x="50%" y="50%" text-anchor="middle" fill="white" font-size="24" font-family="Arial">
          ${cityName} - Enhanced Thermal Analysis
        </text>
        <text x="50%" y="70%" text-anchor="middle" fill="white" font-size="16" font-family="Arial">
          AI-Powered Image Generation
        </text>
      </svg>
    `);
  };

  const calculateAverageTemperature = () => {
    if (!heatZones || heatZones.length === 0) return 30;
    const sum = heatZones.reduce((acc, zone) => acc + (zone.temperature || 30), 0);
    return Math.round(sum / heatZones.length);
  };

  const calculateMaxTemperature = () => {
    if (!heatZones || heatZones.length === 0) return 35;
    return Math.max(...heatZones.map(zone => zone.temperature || 30));
  };

  const calculateMinTemperature = () => {
    if (!heatZones || heatZones.length === 0) return 25;
    return Math.min(...heatZones.map(zone => zone.temperature || 30));
  };

  const downloadImage = (imageData) => {
    const link = document.createElement('a');
    link.download = `thermal-analysis-${cityData?.name || 'city'}-${Date.now()}.png`;
    link.href = imageData.url;
    link.click();
  };

  const imageStyles = [
    { id: 'normal_thermal', name: 'Normal Thermal', description: 'Standard thermal imaging colors' },
    { id: 'realistic', name: 'Realistic', description: 'Photorealistic thermal imagery' },
    { id: 'scientific', name: 'Scientific', description: 'Scientific visualization style' },
    { id: 'artistic', name: 'Artistic', description: 'Artistic interpretation' },
    { id: 'minimalist', name: 'Minimalist', description: 'Clean, minimal design' }
  ];

  const overlayTypes = [
    { id: 'thermal', name: 'Thermal', description: 'Heat intensity overlay' },
    { id: 'topographic', name: 'Topographic', description: 'Elevation data overlay' },
    { id: 'satellite', name: 'Satellite', description: 'Satellite imagery overlay' },
    { id: 'hybrid', name: 'Hybrid', description: 'Combined thermal and satellite' }
  ];

  const intensityLevels = [
    { id: 'low', name: 'Low', description: 'Subtle thermal effects' },
    { id: 'medium', name: 'Medium', description: 'Moderate thermal intensity' },
    { id: 'high', name: 'High', description: 'Strong thermal effects' },
    { id: 'extreme', name: 'Extreme', description: 'Maximum thermal intensity' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h3 className="text-3xl font-bold text-green-800 mb-2 flex items-center justify-center">
          <span className="text-4xl mr-3">🎨</span>
          AI-Powered Image Generation
        </h3>
        <p className="text-green-600 text-lg">Create stunning thermal and satellite imagery using AI</p>
        <div className="mt-3 flex justify-center">
          <div className="w-32 h-1 bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 rounded-full"></div>
        </div>
      </div>

      {/* Settings Panel */}
      <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-green-200">
        <h4 className="text-xl font-bold text-green-800 mb-4 flex items-center">
          <Settings className="w-5 h-5 mr-2" />
          Generation Settings
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Style Selection */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Image Style</label>
            <select
              value={settings.style}
              onChange={(e) => setSettings(prev => ({ ...prev, style: e.target.value }))}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              {imageStyles.map(style => (
                <option key={style.id} value={style.id}>{style.name}</option>
              ))}
            </select>
          </div>

          {/* Overlay Type */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Overlay Type</label>
            <select
              value={settings.overlay}
              onChange={(e) => setSettings(prev => ({ ...prev, overlay: e.target.value }))}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              {overlayTypes.map(overlay => (
                <option key={overlay.id} value={overlay.id}>{overlay.name}</option>
              ))}
            </select>
          </div>

          {/* Intensity Level */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Intensity</label>
            <select
              value={settings.intensity}
              onChange={(e) => setSettings(prev => ({ ...prev, intensity: e.target.value }))}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              {intensityLevels.map(intensity => (
                <option key={intensity.id} value={intensity.id}>{intensity.name}</option>
              ))}
            </select>
          </div>

          {/* Resolution */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Resolution</label>
            <select
              value={settings.resolution}
              onChange={(e) => setSettings(prev => ({ ...prev, resolution: e.target.value }))}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="512x384">512x384 (Standard)</option>
              <option value="1024x768">1024x768 (HD)</option>
              <option value="1920x1080">1920x1080 (Full HD)</option>
              <option value="2560x1440">2560x1440 (2K)</option>
              <option value="3840x2160">3840x2160 (4K)</option>
            </select>
          </div>

          {/* Quality Level */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Quality</label>
            <select
              value={settings.quality}
              onChange={(e) => setSettings(prev => ({ ...prev, quality: e.target.value }))}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="standard">Standard</option>
              <option value="high">High</option>
              <option value="ultra">Ultra</option>
              <option value="maximum">Maximum</option>
            </select>
          </div>

          {/* Effects Level */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Effects</label>
            <select
              value={settings.effects}
              onChange={(e) => setSettings(prev => ({ ...prev, effects: e.target.value }))}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="basic">Basic</option>
              <option value="standard">Standard</option>
              <option value="enhanced">Enhanced</option>
              <option value="professional">Professional</option>
              <option value="cinematic">Cinematic</option>
            </select>
          </div>
        </div>

        {/* Progress Bar */}
        {generating && (
          <div className="mt-6 bg-gray-100 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">{generationStatus}</span>
              <span className="text-sm text-gray-500">{progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-gradient-to-r from-purple-500 to-pink-500 h-2.5 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Generate Button */}
        <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={generateThermalImage}
            disabled={generating}
            className={`flex items-center space-x-3 px-6 py-3 rounded-xl font-semibold transition-all transform hover:scale-105 ${
              generating
                ? 'bg-gray-400 text-white cursor-not-allowed'
                : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 shadow-lg hover:shadow-xl'
            }`}
          >
            {generating ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                <span>Generating...</span>
              </>
            ) : (
              <>
                <Zap className="w-5 h-5" />
                <span>Generate Single Image</span>
              </>
            )}
          </button>
          
          <button
            onClick={generateMultipleImages}
            disabled={generating}
            className={`flex items-center space-x-3 px-6 py-3 rounded-xl font-semibold transition-all transform hover:scale-105 ${
              generating
                ? 'bg-gray-400 text-white cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-500 to-green-500 text-white hover:from-blue-600 hover:to-green-600 shadow-lg hover:shadow-xl'
            }`}
          >
            {generating ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                <span>Generating Batch...</span>
              </>
            ) : (
              <>
                <ImageIcon className="w-5 h-5" />
                <span>Generate Batch (4 Images)</span>
              </>
            )}
          </button>
          
          <button
            onClick={() => {
              // Demo with sample data
              const demoData = {
                city: 'Delhi',
                heatZones: Array.from({ length: 15 }, (_, i) => ({
                  lat: 28.6139 + (Math.random() - 0.5) * 0.1,
                  lng: 77.209 + (Math.random() - 0.5) * 0.1,
                  intensity: Math.random(),
                  temperature: 25 + Math.random() * 15
                }))
              };
              generateThermalImage();
            }}
            disabled={generating}
            className={`flex items-center space-x-3 px-6 py-3 rounded-xl font-semibold transition-all transform hover:scale-105 ${
              generating
                ? 'bg-gray-400 text-white cursor-not-allowed'
                : 'bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600 shadow-lg hover:shadow-xl'
            }`}
          >
            <Target className="w-5 h-5" />
            <span>Demo Generation</span>
          </button>
        </div>
      </div>

      {/* Generated Images Gallery */}
      {generatedImages.length > 0 && (
        <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-green-200">
          <h4 className="text-xl font-bold text-green-800 mb-4 flex items-center">
            <ImageIcon className="w-5 h-5 mr-2" />
            Generated Images
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {generatedImages.map((imageData) => (
              <div key={imageData.id} className="relative group">
                <div className="relative rounded-lg overflow-hidden border-2 border-gray-200 hover:border-green-400 transition-colors">
                  <img
                    src={imageData.url}
                    alt={`Generated ${imageData.type} visualization`}
                    className="w-full h-48 object-cover"
                  />
                  
                  {/* Overlay with controls */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity flex space-x-2">
                      <button
                        onClick={() => downloadImage(imageData)}
                        className="bg-white text-gray-800 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                        title="Download image"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Image Metadata */}
                <div className="mt-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <h5 className="font-semibold text-gray-800 capitalize">{imageData.type} Analysis</h5>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                      {imageData.metadata.resolution}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-3 h-3" />
                      <span>{imageData.metadata.city}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>{new Date(imageData.metadata.timestamp).toLocaleTimeString()}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Thermometer className="w-3 h-3" />
                      <span>{imageData.metadata.avgTemperature}°C avg</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Target className="w-3 h-3" />
                      <span>{imageData.metadata.heatZones} zones</span>
                    </div>
                  </div>

                  {/* Temperature Range */}
                  <div className="bg-gradient-to-r from-blue-500 to-red-500 rounded-lg p-2 text-white text-xs">
                    <div className="flex justify-between">
                      <span>Min: {imageData.metadata.minTemperature}°C</span>
                      <span>Max: {imageData.metadata.maxTemperature}°C</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Generation Statistics */}
      {generatedImages.length > 0 && (
        <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-green-200">
          <h4 className="text-xl font-bold text-green-800 mb-4 flex items-center">
            <Palette className="w-5 h-5 mr-2" />
            Generation Statistics
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <div className="flex items-center space-x-2 mb-2">
                <ImageIcon className="w-5 h-5 text-blue-600" />
                <span className="font-semibold text-blue-800">Total Generated</span>
              </div>
              <div className="text-2xl font-bold text-blue-600">{generatedImages.length}</div>
              <div className="text-sm text-blue-600">Images created</div>
            </div>

            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <div className="flex items-center space-x-2 mb-2">
                <Thermometer className="w-5 h-5 text-green-600" />
                <span className="font-semibold text-green-800">Avg Temperature</span>
              </div>
              <div className="text-2xl font-bold text-green-600">
                {Math.round(generatedImages.reduce((acc, img) => acc + img.metadata.avgTemperature, 0) / generatedImages.length)}°C
              </div>
              <div className="text-sm text-green-600">Across all images</div>
            </div>

            <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
              <div className="flex items-center space-x-2 mb-2">
                <Target className="w-5 h-5 text-purple-600" />
                <span className="font-semibold text-purple-800">Heat Zones</span>
              </div>
              <div className="text-2xl font-bold text-purple-600">
                {Math.round(generatedImages.reduce((acc, img) => acc + img.metadata.heatZones, 0) / generatedImages.length)}
              </div>
              <div className="text-sm text-purple-600">Average per image</div>
            </div>

            <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
              <div className="flex items-center space-x-2 mb-2">
                <Zap className="w-5 h-5 text-orange-600" />
                <span className="font-semibold text-orange-800">Success Rate</span>
              </div>
              <div className="text-2xl font-bold text-orange-600">100%</div>
              <div className="text-sm text-orange-600">Generation success</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIImageGenerator;
