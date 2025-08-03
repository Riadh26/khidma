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
    <div className="p-6 bg-gradient-to-br from-gray-50 to-white min-h-full">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">What service do you need?</h2>
        <p className="text-gray-600">Choose from our available services</p>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {services.map((service) => (
          <button
            key={service.id}
            onClick={() => onServiceSelect(service)}
            className="group relative bg-white border-2 border-gray-200 rounded-3xl p-8 hover:border-blue-500 hover:shadow-xl transition-all duration-300 active:scale-95"
            style={{
              background: `linear-gradient(135deg, ${service.color}10, ${service.color}05)`
            }}
          >
            <div className="text-center">
              <div 
                className="w-20 h-20 mx-auto mb-4 rounded-3xl flex items-center justify-center text-3xl shadow-lg group-hover:shadow-xl transition-all group-hover:scale-110"
                style={{ backgroundColor: `${service.color}20` }}
              >
                <span>{service.icon}</span>
              </div>
              <h4 className="font-bold text-gray-900 mb-2 text-lg">{service.name}</h4>
              <p className="text-sm text-gray-600 leading-relaxed">{service.description}</p>
            </div>
            
            <div 
              className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-15 transition-opacity duration-300"
              style={{ backgroundColor: service.color }}
            ></div>
          </button>
        ))}
      </div>
    </div>
  );
};