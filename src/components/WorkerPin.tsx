import React from 'react';
import { ServiceWorker } from '../types';

interface WorkerPinProps {
  worker: ServiceWorker;
  onClick: () => void;
  style?: React.CSSProperties;
}

export const WorkerPin: React.FC<WorkerPinProps> = ({ worker, onClick, style }) => {
  return (
    <div 
      className="absolute z-20 transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
      style={style}
      onClick={onClick}
    >
      <div className="relative group">
        {/* Worker avatar */}
        <div className={`w-12 h-12 rounded-full border-3 shadow-lg overflow-hidden transition-transform group-hover:scale-110 ${
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
          className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-xs shadow-md"
          style={{ backgroundColor: worker.serviceType.color }}
        >
          <span className="text-white">{worker.serviceType.icon}</span>
        </div>

        {/* Hover tooltip */}
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
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
};