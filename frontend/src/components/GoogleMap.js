import React, { useEffect, useRef } from 'react';
import { Wrapper, Status } from '@googlemaps/react-wrapper';

const mapContainerStyle = {
  width: '100%',
  height: '400px'
};

const GoogleMapComponent = ({ cityData, heatZones, center }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const heatmapRef = useRef(null);

  const render = (status) => {
    switch (status) {
      case Status.LOADING:
        return (
          <div className="flex items-center justify-center h-96 bg-gray-100 rounded-lg">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading map...</p>
            </div>
          </div>
        );
      case Status.FAILURE:
        return (
          <div className="flex items-center justify-center h-96 bg-gray-100 rounded-lg">
            <div className="text-center">
              <p className="text-red-600">Failed to load map. Please check your API key.</p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY || "";

  // Initialize Google Map and Heatmap when API is available
  useEffect(() => {
    if (!apiKey) return; // skip if no API key
    if (!window.google || !window.google.maps || !mapRef.current) return;

    // Create map once
    if (!mapInstanceRef.current) {
      mapInstanceRef.current = new window.google.maps.Map(mapRef.current, {
        center,
        zoom: 11,
        mapTypeId: 'hybrid',
        streetViewControl: false,
        fullscreenControl: false
      });

      // City marker
      new window.google.maps.Marker({
        position: center,
        map: mapInstanceRef.current,
        title: cityData?.city
      });
    }

    // Heatmap layer
    const points = (heatZones || []).map((z) => ({
      location: new window.google.maps.LatLng(z.lat, z.lng),
      weight: z.intensity
    }));

    if (points.length) {
      if (heatmapRef.current) {
        heatmapRef.current.setData(points);
      } else if (window.google.maps.visualization) {
        heatmapRef.current = new window.google.maps.visualization.HeatmapLayer({
          data: points,
          dissipating: true,
          radius: 20,
          opacity: 0.6
        });
        heatmapRef.current.setMap(mapInstanceRef.current);
      }
    }

    return () => {
      // do not aggressively teardown; keep map cached
    };
  }, [apiKey, center, cityData, heatZones]);

  // Fallback OpenStreetMap embed if no Google API key
  if (!apiKey) {
    const osmSrc = `https://www.openstreetmap.org/export/embed.html?bbox=${center.lng-0.2}%2C${center.lat-0.2}%2C${center.lng+0.2}%2C${center.lat+0.2}&layer=mapnik&marker=${center.lat}%2C${center.lng}`;
    return (
      <div className="w-full">
        <div className="rounded-lg border overflow-hidden" style={mapContainerStyle}>
          <iframe title="OSM Map" width="100%" height="100%" frameBorder="0" scrolling="no" src={osmSrc}></iframe>
        </div>
        <div className="mt-2 text-xs text-gray-500">
          Map by OpenStreetMap. Add REACT_APP_GOOGLE_MAPS_API_KEY to enable Google Maps with heat layers.
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <Wrapper
        apiKey={apiKey}
        render={render}
        libraries={["visualization"]}
      >
        <div ref={mapRef} style={mapContainerStyle} className="rounded-lg border" />
        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-semibold text-blue-900 mb-2">📍 Map Information</h4>
          <p className="text-sm text-blue-800">
            City: {cityData?.city} | Coordinates: {center?.lat?.toFixed(4)}, {center?.lng?.toFixed(4)}
          </p>
          <p className="text-sm text-blue-800 mt-1">
            Heat Zones: {heatZones?.length || 0} zones detected
          </p>
        </div>
      </Wrapper>
    </div>
  );
};

export default GoogleMapComponent;
