import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import type { Itinerary, Place } from '../types';

interface MapProps {
  itinerary?: Itinerary;
  center: [number, number];
  focusedPlaceId?: string;
}

// Helper component to handle map view updates
function MapController({ place }: { place?: Place }) {
  const map = useMap();
  
  useEffect(() => {
    if (place) {
      map.setView(place.location, 15, { animate: true });
    }
  }, [map, place]);

  return null;
}

export default function Map({ itinerary, center, focusedPlaceId }: MapProps) {
  const focusedPlace = itinerary?.places.find(place => place.id === focusedPlaceId);

  return (
    <MapContainer
      center={center}
      zoom={13}
      className="w-full h-full rounded-lg"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      {itinerary?.places.map((place: Place) => (
        <Marker 
          key={place.id} 
          position={place.location}
          opacity={focusedPlaceId ? (place.id === focusedPlaceId ? 1 : 0.5) : 1}
        >
          <Popup>
            <div className="p-2">
              <h3 className="font-bold">{place.name}</h3>
              <p className="text-sm">{place.description}</p>
              <p className="text-xs mt-1">Duration: {place.duration} min</p>
            </div>
          </Popup>
        </Marker>
      ))}

      {itinerary?.route && (
        <Polyline
          key="route"
          positions={itinerary.route}
          color="blue"
          weight={3}
          opacity={focusedPlaceId ? 0.3 : 0.7}
        />
      )}

      <MapController place={focusedPlace} />
    </MapContainer>
  );
}