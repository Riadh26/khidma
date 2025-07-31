import React from 'react';
import { ServiceWorker } from '../types';
import { Star, MapPin, Clock, Phone, MessageCircle, X } from 'lucide-react';

interface WorkerProfileProps {
  worker: ServiceWorker;
  onClose: () => void;
  onContact: (worker: ServiceWorker) => void;
  onMessage: (worker: ServiceWorker) => void;
}

export const WorkerProfile: React.FC<WorkerProfileProps> = ({
  worker,
  onClose,
  onContact,
  onMessage
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end justify-center">
      <div className="bg-white rounded-t-2xl w-full max-w-md max-h-[80vh] overflow-hidden animate-slideUp">
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-4">
              <div className="relative">
                <img 
                  src={worker.avatar} 
                  alt={worker.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white ${
                  worker.isOnline ? 'bg-green-500' : 'bg-gray-400'
                }`}></div>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900">{worker.name}</h3>
                <div className="flex items-center space-x-1 mt-1">
                  <span className="text-2xl">{worker.serviceType.icon}</span>
                  <span className="text-gray-600">{worker.serviceType.name}</span>
                </div>
                <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-400 mr-1" />
                    <span>{worker.rating}</span>
                    <span className="ml-1">({worker.reviewCount} reviews)</span>
                  </div>
                </div>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        <div className="p-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="flex items-center text-gray-600 mb-1">
                <MapPin className="w-4 h-4 mr-1" />
                <span className="text-sm">Distance</span>
              </div>
              <p className="font-semibold">{worker.distance} km</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="flex items-center text-gray-600 mb-1">
                <Clock className="w-4 h-4 mr-1" />
                <span className="text-sm">Response</span>
              </div>
              <p className="font-semibold">{worker.responseTime}</p>
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold text-gray-900 mb-2">Pricing</h4>
            <p className="text-2xl font-bold text-blue-600">{worker.hourlyRate.toLocaleString()} DA</p>
            <p className="text-sm text-gray-600">per hour</p>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-2">Experience</h4>
            <p className="text-gray-600">{worker.completedJobs} completed jobs</p>
            <p className="text-sm text-gray-500 mt-1">
              Experienced {worker.serviceType.name.toLowerCase()} with excellent customer reviews
            </p>
          </div>

          <div className="flex space-x-3 pt-4">
            <button 
              onClick={() => onContact(worker)}
              className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
            >
              <Phone className="w-5 h-5" />
              <span>Call Now</span>
            </button>
            <button 
              onClick={() => onMessage(worker)}
              className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors flex items-center justify-center space-x-2"
            >
              <MessageCircle className="w-5 h-5" />
              <span>Message</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};