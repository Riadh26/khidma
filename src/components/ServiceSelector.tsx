import React from 'react';
import { ServiceType } from '../types';

interface ServiceSelectorProps {
  services: ServiceType[];
  selectedService: ServiceType | null;
  onServiceSelect: (service: ServiceType | null) => void;
}

export const ServiceSelector: React.FC<ServiceSelectorProps> = ({
  services,
  selectedService,
  onServiceSelect
}) => {
  return (
    <div className="bg-white p-4 shadow-sm border-b border-gray-100 overflow-y-auto max-h-32">
      <h3 className="text-sm font-medium text-gray-700 mb-3">Select Service Type</h3>
      <div className="flex overflow-x-auto space-x-3 pb-2">
        <button
          onClick={() => onServiceSelect(null)}
          className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
            !selectedService
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          All Services
        </button>
        {services.map((service) => (
          <button
            key={service.id}
            onClick={() => onServiceSelect(service)}
            className={`flex-shrink-0 flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
              selectedService?.id === service.id
                ? 'text-white shadow-md'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            style={{
              backgroundColor: selectedService?.id === service.id ? service.color : undefined
            }}
          >
            <span className="text-lg">{service.icon}</span>
            <span>{service.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};