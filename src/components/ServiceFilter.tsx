import React from 'react';
import { ServiceType } from '../types';
import { Filter, X } from 'lucide-react';

interface ServiceFilterProps {
  services: ServiceType[];
  selectedService: ServiceType | null;
  onServiceSelect: (service: ServiceType | null) => void;
  isVisible: boolean;
  onClose: () => void;
}

export const ServiceFilter: React.FC<ServiceFilterProps> = ({
  services,
  selectedService,
  onServiceSelect,
  isVisible,
  onClose
}) => {
  if (!isVisible) return null;

  return (
    <div className="absolute top-16 left-1/2 transform -translate-x-1/2 z-[9999]">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 max-w-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-blue-600" />
            <h3 className="font-semibold text-gray-900">Filter by Service</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        <div className="space-y-2">
          <button
            onClick={() => onServiceSelect(null)}
            className={`w-full p-3 rounded-xl text-left transition-all ${
              selectedService === null
                ? 'bg-blue-50 border-2 border-blue-200 text-blue-700'
                : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
            }`}
          >
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center">
                <span className="text-lg">🏠</span>
              </div>
              <div>
                <p className="font-medium">All Services</p>
                <p className="text-xs text-gray-500">Show all available workers</p>
              </div>
            </div>
          </button>

          {services.map((service) => (
            <button
              key={service.id}
              onClick={() => onServiceSelect(service)}
              className={`w-full p-3 rounded-xl text-left transition-all ${
                selectedService?.id === service.id
                  ? 'bg-blue-50 border-2 border-blue-200 text-blue-700'
                  : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div 
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: service.color + '20' }}
                >
                  <span className="text-lg">{service.icon}</span>
                </div>
                <div>
                  <p className="font-medium">{service.name}</p>
                  <p className="text-xs text-gray-500">{service.description}</p>
                </div>
              </div>
            </button>
          ))}
        </div>

        {selectedService && (
          <div className="mt-3 p-3 bg-blue-50 rounded-xl border border-blue-200">
            <div className="flex items-center space-x-2">
              <span className="text-lg">{selectedService.icon}</span>
              <div>
                <p className="font-medium text-blue-700">Filtering by {selectedService.name}</p>
                <p className="text-xs text-blue-600">Only showing {selectedService.name.toLowerCase()} workers</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}; 