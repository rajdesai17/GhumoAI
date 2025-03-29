import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Icon, divIcon } from 'leaflet';
import type { Itinerary, Place, FoodSpot } from '../types';
import L from 'leaflet';
import { createRouteLayer, removeRouteLayer } from '../lib/maps';

// Fix for default marker icon
const icon = new Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [0, -41],
});

// Food spot marker icon
const foodIcon = new Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [0, -41],
});

// Function to create floating card icon for places
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
    iconAnchor: [100, 60],
  });
};

// Function to create floating card icon for food spots
const createFoodCard = (foodSpot: FoodSpot) => {
  const cardContent = `
    <div class="bg-white p-2 rounded-lg shadow-lg border border-gray-200 min-w-[200px] pointer-events-auto">
      <div class="font-semibold text-red-600">
        <span>🍽️ ${foodSpot.name}</span>
      </div>
      <div class="text-sm text-gray-500 truncate">
        ${foodSpot.cuisineTypes.slice(0, 2).join(', ')}${foodSpot.cuisineTypes.length > 2 ? '...' : ''}
      </div>
    </div>
  `;

  return divIcon({
    className: 'custom-floating-card',
    html: cardContent,
    iconSize: [200, 50],
    iconAnchor: [100, 60],
  });
};

// Function to format price range
const formatPriceRange = (range: string): string => {
  switch (range) {
    case 'budget': return '💰';
    case 'moderate': return '💰💰';
    case 'expensive': return '💰💰💰';
    default: return range;
  }
};

// Function to format rating
const formatRating = (rating: number): string => {
  const stars = '⭐'.repeat(Math.round(rating));
  return `${stars} (${rating.toFixed(1)})`;
};

interface MapProps {
  center: [number, number];
  itinerary?: Itinerary;
  onLocationSelect?: (location: [number, number]) => void;
  currentLocation?: [number, number];
  activePlaceIndex?: number;
}

// Component to handle map center updates
function MapUpdater({ places, currentLocation, activePlaceIndex }: { places: Place[], currentLocation?: [number, number], activePlaceIndex?: number }) {
  const map = useMap();

  useEffect(() => {
    if (currentLocation && activePlaceIndex !== undefined && places[activePlaceIndex]) {
      const start = L.latLng(currentLocation[0], currentLocation[1]);
      const end = L.latLng(
        places[activePlaceIndex].location[0],
        places[activePlaceIndex].location[1]
      );

      try {
        // Remove existing route if any
        const routingControl = L.Routing.control({
          waypoints: [start, end],
          routeWhileDragging: true,
          lineOptions: {
            styles: [{ color: '#6FA1EC', opacity: 0.6, weight: 3 }],
          },
          plan: {
            summary: false,
            instructions: false,
          },
          draggableWaypoints: true,
          addWaypoints: false,
          autoRoute: true,
        });

        // Fit bounds to show the entire route
        const bounds = L.latLngBounds([start, end]);
        map.fitBounds(bounds, { padding: [50, 50] });
      } catch (error) {
        console.error('Error setting up route:', error);
        // Show error to user
        const errorPopup = L.popup()
          .setLatLng(start)
          .setContent('Failed to calculate route. Please try again.')
          .openOn(map);
        setTimeout(() => errorPopup.close(), 3000);
      }
    }
  }, [map, currentLocation, activePlaceIndex, places]);

  return null;
}

// Function to format coordinates
const formatCoordinates = (coords: [number, number]): string => {
  const [lat, lng] = coords;
  return `${lat.toFixed(6)}°N, ${lng.toFixed(6)}°E`;
};

const MapContent: React.FC<{
  currentLocation?: [number, number];
  activePlaceIndex?: number;
  itinerary: Itinerary;
}> = ({ currentLocation, activePlaceIndex, itinerary }) => {
  const map = useMap();
  const routingControlRef = useRef<L.Routing.Routing | null>(null);

  useEffect(() => {
    if (currentLocation && activePlaceIndex !== undefined && itinerary.places[activePlaceIndex]) {
      const start = L.latLng(currentLocation[0], currentLocation[1]);
      const end = L.latLng(
        itinerary.places[activePlaceIndex].location[0],
        itinerary.places[activePlaceIndex].location[1]
      );

      try {
        // Remove existing route if any
        if (routingControlRef.current) {
          removeRouteLayer(map, routingControlRef.current);
        }

        // Create new route
        routingControlRef.current = createRouteLayer(
          map,
          start,
          end,
          (distance, duration) => {
            console.log(`Route found: ${distance}m, ${duration}s`);
          }
        );

        // Fit bounds to show the entire route
        const bounds = L.latLngBounds([start, end]);
        map.fitBounds(bounds, { padding: [50, 50] });
      } catch (error) {
        console.error('Error setting up route:', error);
        // Show error to user
        const errorPopup = L.popup()
          .setLatLng(start)
          .setContent('Failed to calculate route. Please try again.')
          .openOn(map);
        setTimeout(() => errorPopup.close(), 3000);
      }
    }

    return () => {
      if (routingControlRef.current) {
        removeRouteLayer(map, routingControlRef.current);
      }
    };
  }, [map, currentLocation, activePlaceIndex, itinerary]);

  return null;
};

export default function Map({ center, itinerary, onLocationSelect, currentLocation, activePlaceIndex }: MapProps) {
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.latitude, position.coords.longitude]);
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  }, []);

  const places = itinerary?.places || [];
  const route = itinerary?.route || [];
  const foodSpots = itinerary?.foodRecommendations || [];

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
      .food-recommendation {
        border-left: 4px solid #ef4444;
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const handleMarkerClick = (place: Place) => {
    if (onLocationSelect) {
      onLocationSelect(place.location);
    }
  };

  return (
    <div className="relative w-full h-full">
      {error && (
        <div className="absolute top-4 left-4 z-10 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}
      <MapContainer
        center={center}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
        className="z-0"
      >
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

        {/* Show all places */}
        {places.map((place, index) => (
          <Marker
            key={place.id}
            position={place.location}
            eventHandlers={{
              click: () => onLocationSelect?.(place.location)
            }}
          >
            <Popup>
              <div className="p-3 min-w-[200px]">
                <h3 className="font-semibold text-gray-900">
                  {index + 1}. {place.name}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  {place.description}
                </p>
                <div className="mt-2 text-xs text-gray-500">
                  Duration: {place.duration} mins
                </div>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Show current location */}
        {currentLocation && (
          <Marker
            position={currentLocation}
            icon={new L.Icon.Default()}
          >
            <Popup>
              <div className="p-2">
                <h3 className="font-semibold">Your Location</h3>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Auto-fit bounds when places change */}
        <MapUpdater
          places={places}
          currentLocation={currentLocation}
          activePlaceIndex={activePlaceIndex}
        />
      </MapContainer>
    </div>
  );
}