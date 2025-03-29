import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import type { Itinerary, Place } from '../types';

interface MapProps {
  itinerary?: Itinerary;
  center: [number, number];
}

export default function Map({ itinerary, center }: MapProps) {
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
        <Marker key={place.id} position={place.location}>
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
          opacity={0.7}
        />
      )}
    </MapContainer>
  );
}