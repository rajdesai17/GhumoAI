import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import '../styles/map.css';
import { Icon } from 'leaflet';
import { Droplet, Search, ChevronDown, ChevronUp } from 'lucide-react';
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
  const [isDescriptionOpen, setIsDescriptionOpen] = useState(false);

  const filteredStations = refillStations.filter(station => 
    station.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    station.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-4">Water Refill Stations</h1>
          <p className="text-lg text-slate-600">
            Help reduce plastic waste by using these free water refill stations during your tour.
            Bring your own bottle and refill at any of these verified locations.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Section - Map */}
          <div className="lg:col-start-2 lg:col-span-10">
            {/* Search and Description Toggle */}
            <div className="flex items-center gap-4 mb-4">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Search for refill stations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-3 pl-12 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
              </div>
              <button
                onClick={() => setIsDescriptionOpen(!isDescriptionOpen)}
                className="flex items-center gap-2 px-4 py-3 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors"
              >
                <span className="text-slate-700 font-medium">Description</span>
                {isDescriptionOpen ? (
                  <ChevronUp className="w-5 h-5 text-slate-600" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-slate-600" />
                )}
              </button>
            </div>

            {/* Description Panel */}
            {isDescriptionOpen && (
              <div className="mb-4 bg-white rounded-xl shadow-lg p-6 animate-fadeIn">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Available Refill Stations</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredStations.map((station) => (
                    <div key={station.id} className="p-4 bg-slate-50 rounded-lg">
                      <h4 className="font-semibold text-slate-900">{station.name}</h4>
                      <p className="text-sm text-slate-600 mt-1">{station.description}</p>
                      <div className="mt-2 space-y-1 text-sm text-slate-600">
                        <p>Hours: {station.operatingHours}</p>
                        <p>Type: {station.waterType}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Map */}
            <div className="h-[400px] rounded-xl overflow-hidden shadow-lg">
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
                  >
                    <Popup>
                      <div className="p-3">
                        <h3 className="font-semibold text-slate-900 text-lg">{station.name}</h3>
                        <p className="text-sm text-slate-600 mt-2">{station.description}</p>
                        <div className="mt-3 space-y-1">
                          <p className="text-sm">
                            <span className="font-medium text-slate-700">Hours: </span>
                            <span className="text-slate-600">{station.operatingHours}</span>
                          </p>
                          <p className="text-sm">
                            <span className="font-medium text-slate-700">Water Type: </span>
                            <span className="text-slate-600">{station.waterType}</span>
                          </p>
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>
          </div>

          {/* Right Section - Info */}
          <div className="lg:col-span-12 grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Sustainability Information */}
            <div className="lg:col-start-2 lg:col-span-10 bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">Why Refill?</h2>
              <div className="space-y-6">
                <div className="space-y-2">
                  <h3 className="font-semibold text-slate-800">Environmental Impact</h3>
                  <p className="text-sm text-slate-600">
                    Every year, millions of plastic bottles end up in landfills and oceans. By using refill stations, 
                    you can help reduce plastic pollution and protect our environment for future generations.
                  </p>
                </div>

                <div className="space-y-2">
                  <h3 className="font-semibold text-slate-800">Cost Effective</h3>
                  <p className="text-sm text-slate-600">
                    Save money while traveling by refilling your water bottle instead of buying single-use plastic bottles. 
                    All our refill stations are free to use.
                  </p>
                </div>

                <div className="space-y-2">
                  <h3 className="font-semibold text-slate-800">Support Local Initiatives</h3>
                  <p className="text-sm text-slate-600">
                    Our refill stations are part of a city-wide initiative to reduce plastic waste. By using these stations, 
                    you're supporting local sustainability efforts.
                  </p>
                </div>

                <div className="mt-6 p-4 bg-emerald-50 rounded-lg">
                  <div className="flex items-center gap-2 text-emerald-700 font-medium mb-2">
                    <Droplet className="w-5 h-5" />
                    <span>Your Impact</span>
                  </div>
                  <p className="text-sm text-emerald-600">
                    A typical tourist uses 4-6 plastic water bottles per day. By using refill stations during your tour, 
                    you can prevent dozens of plastic bottles from entering the waste stream.
                  </p>
                </div>
              </div>
            </div>

            {/* Info Cards */}
            <div className="lg:col-start-2 lg:col-span-10 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-6 bg-blue-50 rounded-xl">
                <div className="flex items-center gap-3 mb-3">
                  <Droplet className="w-6 h-6 text-blue-600" />
                  <h3 className="font-semibold text-slate-900">Always Available</h3>
                </div>
                <p className="text-sm text-slate-600">
                  All stations are maintained regularly and provide clean drinking water during operating hours.
                </p>
              </div>

              <div className="p-6 bg-emerald-50 rounded-xl">
                <div className="flex items-center gap-3 mb-3">
                  <Droplet className="w-6 h-6 text-emerald-600" />
                  <h3 className="font-semibold text-slate-900">Clean & Safe</h3>
                </div>
                <p className="text-sm text-slate-600">
                  Water quality is tested daily to ensure it meets safety standards.
                  All stations use advanced filtration systems.
                </p>
              </div>

              <div className="p-6 bg-violet-50 rounded-xl">
                <div className="flex items-center gap-3 mb-3">
                  <Droplet className="w-6 h-6 text-violet-600" />
                  <h3 className="font-semibold text-slate-900">Eco-Friendly</h3>
                </div>
                <p className="text-sm text-slate-600">
                  By using these refill stations, you help reduce plastic waste.
                  Each refill saves one plastic bottle from landfills.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RefillStations; 