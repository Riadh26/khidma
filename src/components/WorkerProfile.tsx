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
    <div className="fixed inset-0 bg-black bg-opacity-50 z-[9999] flex items-end justify-center">
      <div className="bg-white rounded-t-3xl w-full max-w-md max-h-[85vh] overflow-hidden animate-slideUp shadow-2xl">
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-4">
              <div className="relative">
                <img 
                  src={worker.avatar} 
                  alt={worker.name}
                  className="w-18 h-18 rounded-full object-cover border-3 border-white shadow-lg"
                />
                <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white ${
                  worker.isOnline ? 'bg-green-500' : 'bg-gray-400'
                }`}></div>
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-gray-900">{worker.name}</h3>
                <div className="flex items-center space-x-1 mt-1">
                  <span className="text-2xl">{worker.serviceType.icon}</span>
                  <span className="text-gray-600 font-medium">{worker.serviceType.name}</span>
                </div>
                <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-400 mr-1" />
                    <span className="font-medium">{worker.rating}</span>
                    <span className="ml-1 font-medium">({worker.reviewCount} reviews)</span>
                  </div>
                </div>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6 overflow-y-auto max-h-[60vh]">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 p-4 rounded-2xl">
              <div className="flex items-center text-gray-600 mb-1">
                <MapPin className="w-4 h-4 mr-1 text-blue-600" />
                <span className="text-sm">Distance</span>
              </div>
              <p className="font-bold text-lg text-blue-600">{worker.distance} km</p>
            </div>
            <div className="bg-green-50 p-4 rounded-2xl">
              <div className="flex items-center text-gray-600 mb-1">
                <Clock className="w-4 h-4 mr-1 text-green-600" />
                <span className="text-sm">Response</span>
              </div>
              <p className="font-bold text-lg text-green-600">{worker.responseTime}</p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-100">
            <h4 className="font-bold text-gray-900 mb-2">Pricing</h4>
            <p className="text-3xl font-bold text-blue-600">{worker.hourlyRate.toLocaleString()} DA</p>
            <p className="text-sm text-gray-600">per hour</p>
          </div>

          <div>
            <h4 className="font-bold text-gray-900 mb-3">Experience</h4>
            <div className="bg-gray-50 p-4 rounded-2xl">
              <p className="text-gray-900 font-medium text-lg">{worker.completedJobs} completed jobs</p>
              <p className="text-sm text-gray-600 mt-2 leading-relaxed">
              Experienced {worker.serviceType.name.toLowerCase()} with excellent customer reviews
              </p>
            </div>
          </div>

          <div className="flex space-x-4 pt-2">
            <button 
              onClick={() => onContact(worker)}
              className="flex-1 bg-blue-600 text-white py-4 px-4 rounded-2xl font-bold hover:bg-blue-700 transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl hover-lift"
            >
              <Phone className="w-5 h-5" />
              <span>Call Now</span>
            </button>
            <button 
              onClick={() => onMessage(worker)}
              className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white py-4 px-4 rounded-2xl font-bold hover:from-green-600 hover:to-green-700 transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl hover-lift"
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