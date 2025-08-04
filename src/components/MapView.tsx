import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { ServiceWorker } from '../types';
import { Star, Phone, MessageCircle, MapPin, Clock } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface MapViewProps {
  workers: ServiceWorker[];
  onWorkerClick: (worker: ServiceWorker) => void;
  userLocation: { lat: number; lng: number };
}

// Custom worker icon component
const createWorkerIcon = (worker: ServiceWorker) => {
  const iconHtml = `
    <div style="
      width: 50px;
      height: 50px;
      border-radius: 50%;
      border: 3px solid ${worker.isOnline ? '#10B981' : '#6B7280'};
      background: white;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      position: relative;
      overflow: hidden;
    ">
      <img src="${worker.avatar}" style="
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: 50%;
      " />
      <div style="
        position: absolute;
        bottom: -2px;
        right: -2px;
        width: 16px;
        height: 16px;
        background: ${worker.isOnline ? '#10B981' : '#6B7280'};
        border: 2px solid white;
        border-radius: 50%;
      "></div>
      <div style="
        position: absolute;
        top: -8px;
        right: -8px;
        width: 24px;
        height: 24px;
        background: ${worker.serviceType.color};
        border: 2px solid white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
      ">${worker.serviceType.icon}</div>
    </div>
  `;

  return L.divIcon({
    html: iconHtml,
    className: 'custom-worker-marker',
    iconSize: [50, 50],
    iconAnchor: [25, 25],
  });
};

// User location icon
const createUserIcon = () => {
  const iconHtml = `
    <div style="
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: #3B82F6;
      border: 3px solid white;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3);
      animation: pulse 2s infinite;
    "></div>
  `;

  return L.divIcon({
    html: iconHtml,
    className: 'custom-user-marker',
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  });
};

// Component to handle map centering
const MapController: React.FC<{ center: [number, number] }> = ({ center }) => {
  const map = useMap();
  
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);

  return null;
};

export const MapView: React.FC<MapViewProps> = ({ 
  workers, 
  onWorkerClick, 
  userLocation 
}) => {
  const [userPosition, setUserPosition] = useState<[number, number]>([
    userLocation.lat, 
    userLocation.lng
  ]);

  // Get user's real location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserPosition([latitude, longitude]);
        },
        (error) => {
          console.log('Geolocation error:', error);
          // Fallback to Algiers coordinates
          setUserPosition([36.7372, 3.0869]);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000
        }
      );
    }
  }, []);

  const handleWorkerContact = (worker: ServiceWorker) => {
    const message = `Hello ${worker.name}, I found you on Khidma DZ and I'm interested in your ${worker.serviceType.name} services. Are you available?`;
    const whatsappUrl = `https://wa.me/${worker.phone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleWorkerCall = (worker: ServiceWorker) => {
    window.open(`tel:${worker.phone}`, '_self');
  };

  return (
    <div className="relative w-full h-full">
      <MapContainer
        center={userPosition}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
        className="z-10"
      >
        <MapController center={userPosition} />
        
        {/* OpenStreetMap tiles */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* User location marker */}
        <Marker position={userPosition} icon={createUserIcon()}>
          <Popup>
            <div className="text-center p-2">
              <div className="flex items-center justify-center mb-2">
                <MapPin className="w-5 h-5 text-blue-600 mr-1" />
                <span className="font-semibold text-gray-900">Your Location</span>
              </div>
              <p className="text-sm text-gray-600">You are here</p>
            </div>
          </Popup>
        </Marker>

        {/* Worker markers */}
        {workers.map((worker) => (
          <Marker
            key={worker.id}
            position={[worker.location.lat, worker.location.lng]}
            icon={createWorkerIcon(worker)}
          >
            <Popup maxWidth={300} className="worker-popup">
              <div className="p-4 min-w-[280px]">
                {/* Worker Header */}
                <div className="flex items-start space-x-3 mb-4">
                  <div className="relative">
                    <img 
                      src={worker.avatar} 
                      alt={worker.name}
                      className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
                    />
                    <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white ${
                      worker.isOnline ? 'bg-green-500' : 'bg-gray-400'
                    }`}></div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900">{worker.name}</h3>
                    <div className="flex items-center space-x-1 mb-1">
                      <span className="text-lg">{worker.serviceType.icon}</span>
                      <span className="text-sm font-medium text-gray-700">{worker.serviceType.name}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-400 mr-1" />
                        <span className="font-medium">{worker.rating}</span>
                        <span className="ml-1">({worker.reviewCount})</span>
                      </div>
                      <span>•</span>
                      <span>{worker.distance} km away</span>
                    </div>
                  </div>
                </div>

                {/* Worker Stats */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-blue-50 p-3 rounded-xl">
                    <div className="text-xs text-gray-600 mb-1">Hourly Rate</div>
                    <div className="text-lg font-bold text-blue-600">
                      {worker.hourlyRate.toLocaleString()} DA
                    </div>
                  </div>
                  <div className="bg-green-50 p-3 rounded-xl">
                    <div className="text-xs text-gray-600 mb-1">Response Time</div>
                    <div className="text-sm font-bold text-green-600 flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {worker.responseTime}
                    </div>
                  </div>
                </div>

                {/* Experience */}
                <div className="mb-4 p-3 bg-gray-50 rounded-xl">
                  <div className="text-xs text-gray-600 mb-1">Experience</div>
                  <div className="text-sm font-semibold text-gray-900">
                    {worker.completedJobs} completed jobs
                  </div>
                </div>

                {/* Contact Information */}
                <div className="mb-4 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                  <div className="text-xs text-gray-600 mb-2">Contact Information</div>
                  <div className="space-y-1">
                    <div className="flex items-center text-sm">
                      <Phone className="w-4 h-4 text-blue-600 mr-2" />
                      <span className="font-medium text-gray-900">{worker.phone}</span>
                    </div>
                    <div className="text-xs text-gray-600">
                      Available {worker.isOnline ? 'now' : 'offline'}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleWorkerCall(worker)}
                    className="flex-1 bg-green-600 text-white py-3 px-4 rounded-xl font-semibold hover:bg-green-700 transition-colors flex items-center justify-center space-x-2 shadow-lg"
                  >
                    <Phone className="w-4 h-4" />
                    <span>Call</span>
                  </button>
                  <button
                    onClick={() => handleWorkerContact(worker)}
                    className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-xl font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2 shadow-lg"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Message</span>
                  </button>
                </div>

                {/* View Full Profile */}
                <button
                  onClick={() => onWorkerClick(worker)}
                  className="w-full mt-3 bg-gray-100 text-gray-700 py-2 px-4 rounded-xl font-medium hover:bg-gray-200 transition-colors text-sm"
                >
                  View Full Profile
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Map Info Overlay */}
      <div className="absolute top-4 left-4 bg-white px-4 py-3 rounded-xl shadow-lg z-20 max-w-xs">
        <div className="flex items-center space-x-2 mb-1">
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
          <p className="text-sm font-semibold text-gray-900">Live Map</p>
        </div>
        <p className="text-xs text-gray-600">
          {workers.length} {workers.length === 1 ? 'worker' : 'workers'} nearby
        </p>
        <p className="text-xs text-gray-500 mt-1">
          Tap on markers to contact workers
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
                  setUserPosition([latitude, longitude]);
                }
              );
            }
          }}
          className="w-12 h-12 bg-white rounded-xl shadow-lg flex items-center justify-center text-gray-600 hover:text-blue-600 transition-colors hover:shadow-xl"
        >
          <MapPin className="w-5 h-5" />
        </button>
      </div>

      <style jsx>{`
        .custom-worker-marker {
          background: transparent !important;
          border: none !important;
        }
        .custom-user-marker {
          background: transparent !important;
          border: none !important;
        }
        @keyframes pulse {
          0%, 100% {
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3);
          }
          50% {
            box-shadow: 0 0 0 6px rgba(59, 130, 246, 0.1);
          }
        }
      `}</style>
    </div>
  );
};