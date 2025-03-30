import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import '../styles/map.css';
import { Icon } from 'leaflet';
import { Droplet, Search, ChevronDown, ChevronUp, Clock } from 'lucide-react';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Fix for default marker icon
delete (Icon.Default.prototype as any)._getIconUrl;
Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// Custom icon for refill stations
const refillIcon = new Icon({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
  className: 'refill-marker-icon', // This will be styled with a blue tint
});

// Dummy data for refill stations in Jaipur
const refillStations = [
  {
    id: 1,
    name: "Jaipur Railway Station Refill Point",
    location: [26.9190, 75.7887],
    description: "24/7 water refill station at platform 1",
    operatingHours: "24/7",
    waterType: "RO Purified"
  },
  {
    id: 2,
    name: "Hawa Mahal Visitor Center",
    location: [26.9239, 75.8267],
    description: "Clean drinking water available during visiting hours",
    operatingHours: "9 AM - 6 PM",
    waterType: "UV Filtered"
  },
  {
    id: 3,
    name: "City Palace Water Point",
    location: [26.9258, 75.8237],
    description: "RO purified water available for tourists",
    operatingHours: "8 AM - 8 PM",
    waterType: "RO + UV Purified"
  },
  {
    id: 4,
    name: "Jantar Mantar Refill Station",
    location: [26.9247, 75.8242],
    description: "Eco-friendly water station for visitors",
    operatingHours: "9:30 AM - 4:30 PM",
    waterType: "RO Purified"
  },
  {
    id: 5,
    name: "Albert Hall Museum Station",
    location: [26.9117, 75.8183],
    description: "Free water refill point near entrance",
    operatingHours: "10 AM - 5 PM",
    waterType: "UV + Carbon Filtered"
  }
];

const RefillStations: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStation, setSelectedStation] = useState<typeof refillStations[0] | null>(null);

  const filteredStations = refillStations.filter(station => 
    station.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    station.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Water Refill Stations</h1>
          <p className="text-lg text-slate-600">
            Help reduce plastic waste by using these free water refill stations during your tour.
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Section - Map */}
          <div className="lg:col-span-5 space-y-6">
            {/* Search Bar */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search for refill stations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 pl-12 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              />
              <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
            </div>

            {/* Square Map */}
            <div className="aspect-square rounded-xl overflow-hidden shadow-lg bg-white">
              <MapContainer 
                center={[26.9124, 75.7873]} 
                zoom={13} 
                style={{ height: '100%', width: '100%' }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                {filteredStations.map((station) => (
                  <Marker 
                    key={station.id} 
                    position={station.location as [number, number]}
                    icon={refillIcon}
                    eventHandlers={{
                      click: () => setSelectedStation(station)
                    }}
                  >
                    <Popup>
                      <div className="p-2">
                        <h3 className="font-semibold text-slate-900">{station.name}</h3>
                        <p className="text-sm text-slate-600 mt-1">{station.description}</p>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>
          </div>

          {/* Right Section - Info */}
          <div className="lg:col-span-7 space-y-6">
            {/* Stations List */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <Droplet className="w-5 h-5 text-blue-500" />
                Available Refill Stations
              </h2>
              <div className="space-y-4">
                {filteredStations.map((station) => (
                  <div 
                    key={station.id} 
                    className={`p-4 rounded-lg transition-colors cursor-pointer ${
                      selectedStation?.id === station.id ? 'bg-blue-50 border-2 border-blue-200' : 'bg-slate-50 hover:bg-slate-100'
                    }`}
                    onClick={() => setSelectedStation(station)}
                  >
                    <h3 className="font-semibold text-slate-900">{station.name}</h3>
                    <p className="text-sm text-slate-600 mt-1">{station.description}</p>
                    <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center gap-2 text-slate-700">
                        <Clock className="w-4 h-4" />
                        {station.operatingHours}
                      </div>
                      <div className="flex items-center gap-2 text-slate-700">
                        <Droplet className="w-4 h-4" />
                        {station.waterType}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Why Refill Section */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">Why Refill?</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <h3 className="font-semibold text-slate-800">Environmental Impact</h3>
                  <p className="text-sm text-slate-600">
                    Every year, millions of plastic bottles end up in landfills and oceans. 
                    By using refill stations, you can help reduce plastic pollution and protect our environment.
                  </p>
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold text-slate-800">Cost Effective</h3>
                  <p className="text-sm text-slate-600">
                    Save money while traveling by refilling your water bottle instead of buying single-use plastic bottles. 
                    All our refill stations are free to use.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RefillStations; 