import React, { useEffect, useState } from 'react';
import { ServiceWorker } from '../types';
import { Star, Phone, MessageCircle, MapPin, Clock, Navigation } from 'lucide-react';

interface MapViewProps {
  workers: ServiceWorker[];
  onWorkerClick: (worker: ServiceWorker) => void;
  userLocation: { lat: number; lng: number };
}

export const MapView: React.FC<MapViewProps> = ({ 
  workers, 
  onWorkerClick, 
  userLocation 
}) => {
  const [userPosition, setUserPosition] = useState<{ lat: number; lng: number }>({
    lat: userLocation.lat,
    lng: userLocation.lng
  });
  const [selectedWorker, setSelectedWorker] = useState<ServiceWorker | null>(null);
  const [mapCenter, setMapCenter] = useState({ x: 50, y: 50 });
  const [zoom, setZoom] = useState(1);

  // Get user's real location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserPosition({ lat: latitude, lng: longitude });
        },
        (error) => {
          console.log('Geolocation error:', error);
          // Fallback to Algiers coordinates
          setUserPosition({ lat: 36.7372, lng: 3.0869 });
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000
        }
      );
    }
  }, []);

  // Convert lat/lng to map coordinates (simplified projection)
  const latLngToMapCoords = (lat: number, lng: number) => {
    const centerLat = userPosition.lat;
    const centerLng = userPosition.lng;
    
    // Simple conversion for demo purposes
    const x = 50 + (lng - centerLng) * 1000 * zoom;
    const y = 50 + (centerLat - lat) * 1000 * zoom;
    
    return { x: Math.max(5, Math.min(95, x)), y: Math.max(5, Math.min(95, y)) };
  };

  const handleWorkerContact = (worker: ServiceWorker) => {
    const message = `Hello ${worker.name}, I found you on Khidma DZ and I'm interested in your ${worker.serviceType.name} services. Are you available?`;
    const whatsappUrl = `https://wa.me/${worker.phone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleWorkerCall = (worker: ServiceWorker) => {
    window.open(`tel:${worker.phone}`, '_self');
  };

  const userCoords = latLngToMapCoords(userPosition.lat, userPosition.lng);

  return (
    <div className="relative w-full h-full bg-gradient-to-br from-blue-50 to-green-50 overflow-hidden">
      {/* Map Background */}
      <div className="absolute inset-0">
        {/* Grid pattern to simulate map */}
        <div className="absolute inset-0 opacity-20">
          <svg width="100%" height="100%" className="absolute inset-0">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#94a3b8" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* Streets simulation */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-0 right-0 h-1 bg-gray-300 opacity-60"></div>
          <div className="absolute top-1/2 left-0 right-0 h-2 bg-gray-400 opacity-60"></div>
          <div className="absolute top-3/4 left-0 right-0 h-1 bg-gray-300 opacity-60"></div>
          <div className="absolute top-0 bottom-0 left-1/4 w-1 bg-gray-300 opacity-60"></div>
          <div className="absolute top-0 bottom-0 left-1/2 w-2 bg-gray-400 opacity-60"></div>
          <div className="absolute top-0 bottom-0 left-3/4 w-1 bg-gray-300 opacity-60"></div>
        </div>
      </div>

      {/* User Location */}
      <div 
        className="absolute z-20 transform -translate-x-1/2 -translate-y-1/2"
        style={{ left: `${userCoords.x}%`, top: `${userCoords.y}%` }}
      >
        <div className="relative">
          <div className="w-6 h-6 bg-blue-600 rounded-full border-3 border-white shadow-lg animate-pulse"></div>
          <div className="absolute inset-0 w-6 h-6 bg-blue-400 rounded-full animate-ping opacity-75"></div>
        </div>
      </div>

      {/* Worker Markers */}
      {workers.map((worker) => {
        const coords = latLngToMapCoords(worker.location.lat, worker.location.lng);
        return (
          <div
            key={worker.id}
            className="absolute z-30 transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
            style={{ left: `${coords.x}%`, top: `${coords.y}%` }}
            onClick={() => setSelectedWorker(worker)}
          >
            <div className="relative group">
              {/* Worker avatar */}
              <div className={`w-14 h-14 rounded-full border-3 shadow-lg overflow-hidden transition-transform group-hover:scale-110 ${
                worker.isOnline ? 'border-green-400' : 'border-gray-300'
              }`}>
                <img 
                  src={worker.avatar} 
                  alt={worker.name}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Online status */}
              {worker.isOnline && (
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
              )}
              
              {/* Service type badge */}
              <div 
                className="absolute -top-2 -right-2 w-7 h-7 rounded-full flex items-center justify-center text-sm shadow-md border-2 border-white"
                style={{ backgroundColor: worker.serviceType.color }}
              >
                <span className="text-white">{worker.serviceType.icon}</span>
              </div>

              {/* Hover tooltip */}
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-40">
                <div className="bg-gray-900 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap">
                  <p className="font-medium">{worker.name}</p>
                  <p className="text-xs text-gray-300">{worker.serviceType.name}</p>
                  <p className="text-xs text-yellow-400">⭐ {worker.rating} • {worker.distance}km</p>
                </div>
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
              </div>
            </div>
          </div>
        );
      })}

      {/* Worker Detail Popup */}
      {selectedWorker && (
        <div className="absolute inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md max-h-[80vh] overflow-hidden shadow-2xl">
            {/* Header */}
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className="relative">
                    <img 
                      src={selectedWorker.avatar} 
                      alt={selectedWorker.name}
                      className="w-16 h-16 rounded-full object-cover border-3 border-white shadow-lg"
                    />
                    <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white ${
                      selectedWorker.isOnline ? 'bg-green-500' : 'bg-gray-400'
                    }`}></div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900">{selectedWorker.name}</h3>
                    <div className="flex items-center space-x-1 mt-1">
                      <span className="text-lg">{selectedWorker.serviceType.icon}</span>
                      <span className="text-gray-600 font-medium">{selectedWorker.serviceType.name}</span>
                    </div>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-400 mr-1" />
                        <span className="font-medium">{selectedWorker.rating}</span>
                        <span className="ml-1">({selectedWorker.reviewCount} reviews)</span>
                      </div>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedWorker(null)}
                  className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  <span className="text-gray-500 text-xl">×</span>
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6 overflow-y-auto max-h-[50vh]">
              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-2xl">
                  <div className="flex items-center text-gray-600 mb-1">
                    <MapPin className="w-4 h-4 mr-1 text-blue-600" />
                    <span className="text-sm">Distance</span>
                  </div>
                  <p className="font-bold text-lg text-blue-600">{selectedWorker.distance} km</p>
                </div>
                <div className="bg-green-50 p-4 rounded-2xl">
                  <div className="flex items-center text-gray-600 mb-1">
                    <Clock className="w-4 h-4 mr-1 text-green-600" />
                    <span className="text-sm">Response</span>
                  </div>
                  <p className="font-bold text-lg text-green-600">{selectedWorker.responseTime}</p>
                </div>
              </div>

              {/* Pricing */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-100">
                <h4 className="font-bold text-gray-900 mb-2">Pricing</h4>
                <p className="text-3xl font-bold text-blue-600">{selectedWorker.hourlyRate.toLocaleString()} DA</p>
                <p className="text-sm text-gray-600">per hour</p>
              </div>

              {/* Contact Info */}
              <div className="bg-gray-50 p-4 rounded-2xl">
                <h4 className="font-bold text-gray-900 mb-3">Contact Information</h4>
                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <Phone className="w-4 h-4 text-blue-600 mr-2" />
                    <span className="font-medium text-gray-900">{selectedWorker.phone}</span>
                  </div>
                  <div className="text-xs text-gray-600">
                    Available {selectedWorker.isOnline ? 'now' : 'offline'}
                  </div>
                </div>
              </div>

              {/* Experience */}
              <div className="bg-gray-50 p-4 rounded-2xl">
                <h4 className="font-bold text-gray-900 mb-2">Experience</h4>
                <p className="text-gray-900 font-medium">{selectedWorker.completedJobs} completed jobs</p>
                <p className="text-sm text-gray-600 mt-1">
                  Experienced {selectedWorker.serviceType.name.toLowerCase()} with excellent customer reviews
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="p-6 border-t border-gray-100">
              <div className="flex space-x-3">
                <button 
                  onClick={() => handleWorkerCall(selectedWorker)}
                  className="flex-1 bg-green-600 text-white py-4 px-4 rounded-2xl font-bold hover:bg-green-700 transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl"
                >
                  <Phone className="w-5 h-5" />
                  <span>Call Now</span>
                </button>
                <button 
                  onClick={() => handleWorkerContact(selectedWorker)}
                  className="flex-1 bg-blue-600 text-white py-4 px-4 rounded-2xl font-bold hover:bg-blue-700 transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>Message</span>
                </button>
              </div>
              <button
                onClick={() => onWorkerClick(selectedWorker)}
                className="w-full mt-3 bg-gray-100 text-gray-700 py-3 px-4 rounded-2xl font-medium hover:bg-gray-200 transition-colors"
              >
                View Full Profile
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Map Info Overlay */}
      <div className="absolute top-4 left-4 bg-white px-4 py-3 rounded-2xl shadow-lg z-20 max-w-xs">
        <div className="flex items-center space-x-2 mb-1">
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
          <p className="text-sm font-semibold text-gray-900">Live Map</p>
        </div>
        <p className="text-xs text-gray-600">
          {workers.length} {workers.length === 1 ? 'worker' : 'workers'} nearby
        </p>
        <p className="text-xs text-gray-500 mt-1">
          Tap on workers to contact them
        </p>
      </div>

      {/* Map Controls */}
      <div className="absolute bottom-4 right-4 flex flex-col space-y-2 z-20">
        <button 
          onClick={() => {
            if (navigator.geolocation) {
              navigator.geolocation.getCurrentPosition(
                (position) => {
                  const { latitude, longitude } = position.coords;
                  setUserPosition({ lat: latitude, lng: longitude });
                }
              );
            }
          }}
          className="w-12 h-12 bg-white rounded-2xl shadow-lg flex items-center justify-center text-gray-600 hover:text-blue-600 transition-colors hover:shadow-xl"
        >
          <Navigation className="w-5 h-5" />
        </button>
        <button 
          onClick={() => setZoom(zoom === 1 ? 1.5 : 1)}
          className="w-12 h-12 bg-white rounded-2xl shadow-lg flex items-center justify-center text-gray-600 hover:text-blue-600 transition-colors hover:shadow-xl text-sm font-bold"
        >
          {zoom === 1 ? '+' : '−'}
        </button>
      </div>
    </div>
  );
};