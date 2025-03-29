import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Icon, divIcon } from 'leaflet';
import type { Itinerary, Place } from '../types';

// Fix for default marker icon
const icon = new Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [0, -41],
});

// Function to create floating card icon
const createFloatingCard = (place: Place, index: number) => {
  const cardContent = `
    <div class="bg-white p-2 rounded-lg shadow-lg border border-gray-200 min-w-[200px] pointer-events-auto">
      <div class="font-semibold text-blue-600">${index + 1}. ${place.name}</div>
      <div class="text-sm text-gray-500 truncate">${place.type}</div>
    </div>
  `;

  return divIcon({
    className: 'custom-floating-card',
    html: cardContent,
    iconSize: [200, 50],
    iconAnchor: [100, 60], // Position the card above the marker
  });
};

interface MapProps {
  center: [number, number];
  itinerary?: Itinerary;
}

// Component to handle map center updates
function MapUpdater({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
}

// Function to format coordinates
const formatCoordinates = (coords: [number, number]): string => {
  const [lat, lng] = coords;
  return `${lat.toFixed(6)}°N, ${lng.toFixed(6)}°E`;
};

export default function Map({ center, itinerary }: MapProps) {
  const places = itinerary?.places || [];
  const route = itinerary?.route || [];

  // Add custom CSS for the floating cards
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .custom-floating-card {
        background: none;
        border: none;
        transform: translateY(-20px);
      }
      .leaflet-popup-content {
        margin: 0;
        padding: 12px;
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <MapContainer
      center={center}
      zoom={13}
      style={{ height: '100%', width: '100%' }}
    >
      <MapUpdater center={center} />
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      {/* Show route if available */}
      {route.length > 0 && (
        <Polyline
          positions={route}
          color="blue"
          weight={3}
          opacity={0.6}
        />
      )}

      {/* Show all places with floating cards and enhanced popups */}
      {places.map((place, index) => (
        <React.Fragment key={place.id}>
          {/* Floating Card Marker */}
          <Marker
            position={place.location}
            icon={createFloatingCard(place, index)}
            interactive={false}
          />
          {/* Main Marker with Popup */}
          <Marker
            position={place.location}
            icon={icon}
          >
            <Popup className="custom-popup">
              <div className="p-3 space-y-2 min-w-[250px]">
                <div className="font-bold text-lg text-blue-600">
                  Stop {index + 1}: {place.name}
                </div>
                <div className="text-sm text-gray-600">
                  <div><strong>Type:</strong> {place.type}</div>
                  <div><strong>Duration:</strong> {place.duration} minutes</div>
                  <div><strong>Coordinates:</strong> {formatCoordinates(place.location)}</div>
                </div>
                {place.description && (
                  <div className="mt-2 text-sm border-t pt-2 text-gray-700">
                    {place.description}
                  </div>
                )}
              </div>
            </Popup>
          </Marker>
        </React.Fragment>
      ))}
    </MapContainer>
  );
}