import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { ServiceWorker, ServiceType } from '../types';
import { Star, Phone, MessageCircle, MapPin, Clock, Navigation, X, Filter } from 'lucide-react';
import { ServiceFilter } from './ServiceFilter';

// Fix for default markers in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom worker marker icon
const createWorkerIcon = (worker: ServiceWorker) => {
  return L.divIcon({
    className: 'custom-worker-marker',
    html: `
      <div class="worker-marker ${worker.isOnline ? 'online' : 'offline'}">
        <div class="worker-avatar">
          <img src="${worker.avatar}" alt="${worker.name}" />
        </div>
        <div class="service-badge">${worker.serviceType.icon}</div>
        ${worker.isOnline ? '<div class="online-indicator"></div>' : ''}
      </div>
    `,
    iconSize: [50, 50],
    iconAnchor: [25, 50],
    popupAnchor: [0, -50]
  });
};

// User location marker icon
const userIcon = L.divIcon({
  className: 'custom-user-marker',
  html: `
    <div class="user-marker">
      <div class="user-pulse"></div>
      <div class="user-dot"></div>
    </div>
  `,
  iconSize: [30, 30],
  iconAnchor: [15, 15]
});

interface RealMapViewProps {
  workers: ServiceWorker[];
  services: ServiceType[];
  onWorkerClick: (worker: ServiceWorker) => void;
  onWorkerMessage: (worker: ServiceWorker) => void;
  userLocation: { lat: number; lng: number };
  selectedService: ServiceType | null;
  onServiceSelect: (service: ServiceType | null) => void;
  showFilter: boolean;
  onCloseFilter: () => void;
}

// Component to handle map center updates
const MapController: React.FC<{ center: [number, number] }> = ({ center }) => {
  const map = useMap();
  
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  
  return null;
};

export const RealMapView: React.FC<RealMapViewProps> = ({
  workers,
  services,
  onWorkerClick,
  onWorkerMessage,
  userLocation,
  selectedService,
  onServiceSelect,
  showFilter,
  onCloseFilter
}) => {
  const [userPosition, setUserPosition] = useState<[number, number]>([
    userLocation.lat,
    userLocation.lng
  ]);
  const [selectedWorker, setSelectedWorker] = useState<ServiceWorker | null>(null);
  const [mapCenter, setMapCenter] = useState<[number, number]>([
    userLocation.lat,
    userLocation.lng
  ]);
  const [closestWorker, setClosestWorker] = useState<ServiceWorker | null>(null);
  const [currentZone, setCurrentZone] = useState<string>("");
  const mapRef = useRef<L.Map | null>(null);

  // Filter workers based on selected service
  const filteredWorkers = selectedService 
    ? workers.filter(worker => worker.serviceType.id === selectedService.id)
    : workers;

  // Calculate distance between two points using Haversine formula
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  // Find closest active worker and set map center with smart zone expansion
  const focusOnClosestWorker = (userLat: number, userLng: number) => {
    const activeWorkers = filteredWorkers.filter(worker => worker.isOnline);
    
    if (activeWorkers.length === 0) {
      // No active workers, center on user with wide view
      setMapCenter([userLat, userLng]);
      setClosestWorker(null);
      setCurrentZone(""); // Clear current zone
      
      // Set wide zoom to show larger area
      setTimeout(() => {
        if (mapRef.current) {
          mapRef.current.setView([userLat, userLng], 10);
        }
      }, 100);
      return;
    }

    // Calculate distances to all active workers
    const workersWithDistance = activeWorkers.map(worker => ({
      ...worker,
      distance: calculateDistance(userLat, userLng, worker.location.lat, worker.location.lng)
    }));

    // Sort by distance
    workersWithDistance.sort((a, b) => a.distance - b.distance);
    
    // Define search zones
    const zones = [
      { maxDistance: 3, zoom: 15, name: "Very Close (0-3km)" },
      { maxDistance: 5, zoom: 14, name: "Close (3-5km)" },
      { maxDistance: 10, zoom: 13, name: "Medium (5-10km)" },
      { maxDistance: 20, zoom: 12, name: "Far (10-20km)" },
      { maxDistance: 50, zoom: 11, name: "Very Far (20-50km)" }
    ];

    // Find the best zone with workers
    let selectedZone = zones[0];
    let workersInZone = workersWithDistance.filter(w => w.distance <= selectedZone.maxDistance);
    
    // If no workers in first zone, expand to next zones
    for (let i = 1; i < zones.length && workersInZone.length === 0; i++) {
      selectedZone = zones[i];
      workersInZone = workersWithDistance.filter(w => w.distance <= selectedZone.maxDistance);
    }

    // If still no workers in any zone, use the closest worker regardless of distance
    if (workersInZone.length === 0) {
      const closest = workersWithDistance[0];
      setMapCenter([closest.location.lat, closest.location.lng]);
      setClosestWorker(closest);
      setCurrentZone(""); // Clear current zone
      
      // Set appropriate zoom based on distance
      let zoomLevel = 11;
      if (closest.distance <= 5) zoomLevel = 15;
      else if (closest.distance <= 10) zoomLevel = 14;
      else if (closest.distance <= 20) zoomLevel = 13;
      else if (closest.distance <= 50) zoomLevel = 12;
      
      setTimeout(() => {
        if (mapRef.current) {
          mapRef.current.setView([closest.location.lat, closest.location.lng], zoomLevel);
        }
      }, 100);
      return;
    }

    // Use the closest worker in the selected zone
    const closest = workersInZone[0];
    setMapCenter([closest.location.lat, closest.location.lng]);
    setClosestWorker(closest);
    setCurrentZone(selectedZone.name); // Set current zone name
    
    // Update map view with zone-appropriate zoom
    setTimeout(() => {
      if (mapRef.current) {
        mapRef.current.setView([closest.location.lat, closest.location.lng], selectedZone.zoom);
      }
    }, 100);
  };

  // Get user's real location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserPosition([latitude, longitude]);
          setMapCenter([latitude, longitude]);
          
          // Focus on closest worker after getting user location
          setTimeout(() => {
            focusOnClosestWorker(latitude, longitude);
          }, 500);
        },
        (error) => {
          console.log('Geolocation error:', error);
          // Fallback to Algiers coordinates
          setUserPosition([36.7372, 3.0869]);
          setMapCenter([36.7372, 3.0869]);
          
          // Focus on closest worker with fallback location
          setTimeout(() => {
            focusOnClosestWorker(36.7372, 3.0869);
          }, 500);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000
        }
      );
    }
  }, [filteredWorkers]);

  // Refocus when filter changes
  useEffect(() => {
    if (userPosition[0] && userPosition[1]) {
      focusOnClosestWorker(userPosition[0], userPosition[1]);
    }
  }, [selectedService]);

  const handleWorkerContact = (worker: ServiceWorker) => {
    onWorkerMessage(worker);
    setSelectedWorker(null); // Close popup
  };

  const handleWorkerCall = (worker: ServiceWorker) => {
    window.open(`tel:${worker.phone}`, '_self');
  };

  return (
    <div className="relative w-full h-full">
      {/* Real Map */}
      <MapContainer
        center={mapCenter}
        zoom={13}
        className="w-full h-full"
        style={{ height: '100%' }}
        ref={mapRef}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          maxZoom={19}
        />
        
        <MapController center={mapCenter} />
        
        {/* User Location Marker */}
        <Marker position={userPosition} icon={userIcon}>
          <Popup>
            <div className="text-center">
              <p className="font-semibold">Your Location</p>
              <p className="text-sm text-gray-600">You are here</p>
            </div>
          </Popup>
        </Marker>

        {/* Worker Markers */}
        {filteredWorkers.map((worker) => (
          <Marker
            key={worker.id}
            position={[worker.location.lat, worker.location.lng]}
            icon={createWorkerIcon(worker)}
            eventHandlers={{
              click: () => {
                setSelectedWorker(worker);
              }
            }}
          />
        ))}
      </MapContainer>

      {/* Service Filter */}
      <ServiceFilter
        services={services}
        selectedService={selectedService}
        onServiceSelect={onServiceSelect}
        isVisible={showFilter}
        onClose={onCloseFilter}
      />

      {/* Worker Popup Overlay */}
      {selectedWorker && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[9999] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md max-h-[90vh] overflow-hidden shadow-2xl animate-slideUp">
            {/* Header */}
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className="relative">
                    <img 
                      src={selectedWorker.avatar} 
                      alt={selectedWorker.name}
                      className="w-18 h-18 rounded-full object-cover border-3 border-white shadow-lg"
                    />
                    <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white ${
                      selectedWorker.isOnline ? 'bg-green-500' : 'bg-gray-400'
                    }`}></div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900">{selectedWorker.name}</h3>
                    <div className="flex items-center space-x-1 mt-1">
                      <span className="text-2xl">{selectedWorker.serviceType.icon}</span>
                      <span className="text-gray-600 font-medium">{selectedWorker.serviceType.name}</span>
                    </div>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-400 mr-1" />
                        <span className="font-medium">{selectedWorker.rating}</span>
                        <span className="ml-1 font-medium">({selectedWorker.reviewCount} reviews)</span>
                      </div>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedWorker(null)}
                  className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6 overflow-y-auto max-h-[60vh]">
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

              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-100">
                <h4 className="font-bold text-gray-900 mb-2">Pricing</h4>
                <p className="text-3xl font-bold text-blue-600">{selectedWorker.hourlyRate.toLocaleString()} DA</p>
                <p className="text-sm text-gray-600">per hour</p>
              </div>

              <div>
                <h4 className="font-bold text-gray-900 mb-3">Experience</h4>
                <div className="bg-gray-50 p-4 rounded-2xl">
                  <p className="text-gray-900 font-medium text-lg">{selectedWorker.completedJobs} completed jobs</p>
                  <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                  Experienced {selectedWorker.serviceType.name.toLowerCase()} with excellent customer reviews
                  </p>
                </div>
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
            </div>

            {/* Action Buttons */}
            <div className="p-6 border-t border-gray-100">
              <div className="flex space-x-3">
                <button 
                  onClick={() => handleWorkerCall(selectedWorker)}
                  className="flex-1 bg-green-600 text-white py-4 px-4 rounded-2xl font-bold hover:bg-green-700 transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl hover-lift"
                >
                  <Phone className="w-5 h-5" />
                  <span>Call Now</span>
                </button>
                <button 
                  onClick={() => handleWorkerContact(selectedWorker)}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-4 px-4 rounded-2xl font-bold hover:from-blue-600 hover:to-blue-700 transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl hover-lift"
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
          className="w-12 h-12 bg-white rounded-2xl shadow-lg flex items-center justify-center text-gray-600 hover:text-blue-600 transition-colors hover:shadow-xl"
        >
          <Navigation className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}; 