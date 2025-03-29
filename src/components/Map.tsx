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
        <div className="absolute top-4 left-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}
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
        
        <MapContent
          itinerary={itinerary}
          currentLocation={currentLocation || userLocation}
          activePlaceIndex={activePlaceIndex}
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
            <Marker
              position={place.location}
              icon={createFloatingCard(place, index)}
              interactive={false}
            />
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

        {/* Show food recommendations */}
        {foodSpots.map((foodSpot) => (
          <React.Fragment key={foodSpot.id}>
            <Marker
              position={foodSpot.location}
              icon={createFoodCard(foodSpot)}
              interactive={false}
            />
            <Marker
              position={foodSpot.location}
              icon={foodIcon}
            >
              <Popup className="custom-popup">
                <div className="p-3 space-y-2 min-w-[300px] food-recommendation">
                  <div className="font-bold text-lg text-red-600">
                    🍽️ {foodSpot.name}
                  </div>
                  <div className="text-sm text-gray-600 space-y-1">
                    <div><strong>Type:</strong> {foodSpot.type.replace('_', ' ').charAt(0).toUpperCase() + foodSpot.type.slice(1)}</div>
                    <div><strong>Cuisine:</strong> {foodSpot.cuisineTypes.join(', ')}</div>
                    <div><strong>Price Range:</strong> {formatPriceRange(foodSpot.priceRange)}</div>
                    <div><strong>Rating:</strong> {formatRating(foodSpot.rating)} ({foodSpot.reviews} reviews)</div>
                    <div><strong>Hours:</strong> {foodSpot.openingHours}</div>
                    {foodSpot.distance && (
                      <div><strong>Distance:</strong> {foodSpot.distance.toFixed(1)} km from nearest stop</div>
                    )}
                  </div>
                  <div className="mt-2 text-sm border-t pt-2 text-gray-700">
                    {foodSpot.description}
                  </div>
                  {foodSpot.recommendations.length > 0 && (
                    <div className="mt-2 text-sm border-t pt-2">
                      <strong>Top Picks:</strong>
                      <ul className="list-disc list-inside mt-1 text-gray-700">
                        {foodSpot.recommendations.map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </Popup>
            </Marker>
          </React.Fragment>
        ))}

        {currentLocation && (
          <Marker
            position={currentLocation}
            icon={new L.Icon.Default({ className: 'bg-blue-500' })}
          >
            <Popup>
              <div className="p-2">
                <h3 className="font-semibold">Your Location</h3>
              </div>
            </Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
}