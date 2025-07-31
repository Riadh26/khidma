import React from 'react';
import { ServiceWorker } from '../types';
import { WorkerPin } from './WorkerPin';

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
  return (
    <div className="relative flex-1 bg-gradient-to-br from-blue-50 to-green-50 overflow-hidden min-h-0">
      {/* Simulated map background */}
      <div className="absolute inset-0 opacity-20">
        <div className="w-full h-full bg-gradient-to-br from-blue-100 via-green-50 to-blue-50"></div>
        {/* Grid pattern to simulate map */}
        <div className="absolute inset-0 opacity-30"
             style={{
               backgroundImage: `
                 linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
                 linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
               `,
               backgroundSize: '40px 40px'
             }}>
        </div>
      </div>

      {/* User location pin */}
      <div 
        className="absolute z-10 transform -translate-x-1/2 -translate-y-1/2"
        style={{ 
          left: '50%', 
          top: '50%'
        }}
      >
        <div className="w-4 h-4 bg-blue-600 rounded-full border-2 border-white shadow-lg animate-pulse"></div>
        <div className="absolute -inset-3 bg-blue-600 rounded-full opacity-20 animate-ping"></div>
      </div>

      {/* Worker pins */}
      {workers.map((worker, index) => (
        <WorkerPin
          key={worker.id}
          worker={worker}
          onClick={() => onWorkerClick(worker)}
          style={{
            left: `${45 + (index % 3) * 15}%`,
            top: `${35 + Math.floor(index / 3) * 20}%`
          }}
        />
      ))}

      {/* Map controls */}
      <div className="absolute bottom-4 right-4 flex flex-col space-y-2">
        <button className="w-10 h-10 bg-white rounded-lg shadow-md flex items-center justify-center text-gray-600 hover:text-blue-600 transition-colors">
          <span className="text-lg font-bold">+</span>
        </button>
        <button className="w-10 h-10 bg-white rounded-lg shadow-md flex items-center justify-center text-gray-600 hover:text-blue-600 transition-colors">
          <span className="text-lg font-bold">−</span>
        </button>
      </div>

      {/* Location info */}
      <div className="absolute top-4 left-4 bg-white px-3 py-2 rounded-lg shadow-md">
        <p className="text-sm text-gray-600">Algiers, Algeria</p>
        <p className="text-xs text-gray-500">{workers.length} workers nearby</p>
      </div>
    </div>
  );
};