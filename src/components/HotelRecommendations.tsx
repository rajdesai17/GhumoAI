import React from 'react';
import { Star, Wifi, Coffee, Dumbbell, Bath, Utensils, Car, Tv } from 'lucide-react';
import type { HotelOption } from '../types';

interface HotelRecommendationsProps {
  hotels: HotelOption[];
  selectedHotelId?: number;
  onSelectHotel: (hotelId: number) => void;
}

const getAmenityIcon = (amenity: string) => {
  switch (amenity.toLowerCase()) {
    case 'wifi':
      return <Wifi className="w-4 h-4" />;
    case 'gym':
    case 'fitness center':
      return <Dumbbell className="w-4 h-4" />;
    case 'pool':
    case 'swimming pool':
      return <Bath className="w-4 h-4" />;
    case 'restaurant':
      return <Utensils className="w-4 h-4" />;
    case 'parking':
      return <Car className="w-4 h-4" />;
    case 'tv':
    case 'cable tv':
      return <Tv className="w-4 h-4" />;
    case 'breakfast':
    case 'complimentary breakfast':
      return <Coffee className="w-4 h-4" />;
    default:
      return null;
  }
};

const HotelRecommendations: React.FC<HotelRecommendationsProps> = ({
  hotels,
  selectedHotelId,
  onSelectHotel
}) => {
  return (
    <div className="space-y-4">
      {hotels.map((hotel) => (
        <div
          key={hotel.id}
          className={`bg-white rounded-lg p-4 border transition-colors ${
            selectedHotelId === hotel.id
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-200 hover:border-blue-300'
          }`}
        >
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{hotel.name}</h3>
              <p className="text-sm text-gray-600">{hotel.type}</p>
            </div>
            <div className="flex items-center">
              <Star className="w-4 h-4 text-yellow-400" />
              <span className="ml-1 text-sm font-medium text-gray-700">{hotel.rating}</span>
            </div>
          </div>

          <p className="text-gray-700 text-sm mb-3">{hotel.description}</p>

          <div className="flex items-center justify-between mb-3">
            <div className="text-lg font-semibold text-blue-600">
              ₹{hotel.pricePerNight} <span className="text-sm text-gray-500">per night</span>
            </div>
            <button
              onClick={() => onSelectHotel(hotel.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedHotelId === hotel.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-blue-600 border border-blue-600 hover:bg-blue-50'
              }`}
            >
              {selectedHotelId === hotel.id ? 'Selected' : 'Select'}
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {hotel.amenities.map((amenity, index) => {
              const icon = getAmenityIcon(amenity);
              if (!icon) return null;
              return (
                <div
                  key={index}
                  className="flex items-center gap-1 text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded-full"
                >
                  {icon}
                  <span>{amenity}</span>
                </div>
              );
            })}
          </div>

          <div className="mt-3 text-sm text-gray-500">
            <p>{hotel.location}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default HotelRecommendations; 