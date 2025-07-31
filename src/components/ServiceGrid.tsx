import React from 'react';
import { ServiceType } from '../types';

interface ServiceGridProps {
  services: ServiceType[];
  onServiceSelect: (service: ServiceType) => void;
}

export const ServiceGrid: React.FC<ServiceGridProps> = ({
  services,
  onServiceSelect
}) => {
  return (
    <div className="p-4 bg-white">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Choose a Service</h3>
      <div className="grid grid-cols-2 gap-4">
        {services.map((service) => (
          <button
            key={service.id}
            onClick={() => onServiceSelect(service)}
            className="group relative bg-white border-2 border-gray-200 rounded-2xl p-6 hover:border-blue-500 hover:shadow-lg transition-all duration-200 active:scale-95"
            style={{
              background: `linear-gradient(135deg, ${service.color}10, ${service.color}05)`
            }}
          >
            <div className="text-center">
              <div 
                className="w-16 h-16 mx-auto mb-3 rounded-2xl flex items-center justify-center text-2xl shadow-sm group-hover:shadow-md transition-shadow"
                style={{ backgroundColor: `${service.color}20` }}
              >
                <span>{service.icon}</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-1">{service.name}</h4>
              <p className="text-xs text-gray-600 leading-tight">{service.description}</p>
            </div>
            
            <div 
              className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity"
              style={{ backgroundColor: service.color }}
            ></div>
          </button>
        ))}
      </div>
    </div>
  );
};