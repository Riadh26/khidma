import React, { useState } from 'react';
import { X, Filter, Wifi, MapPin } from 'lucide-react';
import { ServiceType } from '../types';

interface ServiceFilterProps {
  isOpen: boolean;
  onClose: () => void;
  services: ServiceType[];
  selectedService: ServiceType | null;
  onServiceSelect: (service: ServiceType | null) => void;
  showOnlyActive: boolean;
  onShowOnlyActiveChange: (show: boolean) => void;
  selectedLocation: string;
  onLocationSelect: (location: string) => void;
}

export const ServiceFilter: React.FC<ServiceFilterProps> = ({
  isOpen,
  onClose,
  services,
  selectedService,
  onServiceSelect,
  showOnlyActive,
  onShowOnlyActiveChange,
  selectedLocation,
  onLocationSelect
}) => {
  const [activeTab, setActiveTab] = useState<'service' | 'location'>('service');
  const [tempSelectedService, setTempSelectedService] = useState<ServiceType | null>(selectedService);
  const [tempSelectedLocation, setTempSelectedLocation] = useState<string>(selectedLocation);
  const [tempShowOnlyActive, setTempShowOnlyActive] = useState(showOnlyActive);

  const algerianWilayas = [
    'Adrar', 'Chlef', 'Laghouat', 'Oum El Bouaghi', 'Batna', 'Béjaïa', 'Biskra', 'Béchar',
    'Blida', 'Bouira', 'Tamanrasset', 'Tébessa', 'Tlemcen', 'Tiaret', 'Tizi Ouzou', 'Alger',
    'Djelfa', 'Jijel', 'Sétif', 'Saïda', 'Skikda', 'Sidi Bel Abbès', 'Annaba', 'Guelma',
    'Constantine', 'Médéa', 'Mostaganem', "M'Sila", 'Mascara', 'Ouargla', 'Oran', 'El Bayadh',
    'Illizi', 'Bordj Bou Arréridj', 'Boumerdès', 'El Tarf', 'Tindouf', 'Tissemsilt', 'El Oued',
    'Khenchela', 'Souk Ahras', 'Tipaza', 'Mila', 'Aïn Defla', 'Naâma', 'Aïn Témouchent', 'Ghardaïa',
    'Relizane', 'Timimoun', 'Bordj Badji Mokhtar', 'Ouled Djellal', 'Béni Abbès', 'In Salah',
    'In Guezzam', 'Touggourt', 'Djanet', 'El M\'Ghair', 'El Meniaa'
  ];

  const handleApplyFilters = () => {
    onServiceSelect(tempSelectedService);
    onLocationSelect(tempSelectedLocation);
    onShowOnlyActiveChange(tempShowOnlyActive);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-[9999] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-md max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Filter className="w-6 h-6 text-orange-600" />
              <h2 className="text-xl font-bold text-gray-900">Filter Professionals</h2>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Navbar Tabs */}
        <div className="px-6 pt-4 flex-shrink-0">
          <div className="flex bg-gray-100 rounded-xl p-1">
            <button
              onClick={() => setActiveTab('service')}
              className={`flex-1 py-3 px-3 rounded-lg font-medium transition-all text-sm ${
                activeTab === 'service'
                  ? 'bg-white text-orange-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <span className="text-sm">🔧</span>
                <span>Services</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('location')}
              className={`flex-1 py-3 px-3 rounded-lg font-medium transition-all text-sm ${
                activeTab === 'location'
                  ? 'bg-white text-orange-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <MapPin className="w-4 h-4" />
                <span>Location</span>
              </div>
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Service Tab Content */}
          {activeTab === 'service' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Select Service</h3>
                <span className="text-sm text-gray-500">
                  {tempSelectedService ? `${tempSelectedService.icon} ${tempSelectedService.name}` : 'No service selected'}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setTempSelectedService(null)}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    tempSelectedService === null
                      ? 'border-orange-500 bg-orange-50 text-orange-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-center">
                    <div className="text-2xl mb-2">🔍</div>
                    <div className="font-medium">All Services</div>
                  </div>
                </button>
                {services.map((service) => (
                  <button
                    key={service.id}
                    onClick={() => setTempSelectedService(service)}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      tempSelectedService?.id === service.id
                        ? 'border-orange-500 bg-orange-50 text-orange-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-2xl mb-2">{service.icon}</div>
                      <div className="font-medium">{service.name}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Location Tab Content */}
          {activeTab === 'location' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Select Wilaya</h3>
                <span className="text-sm text-gray-500">
                  {tempSelectedLocation ? tempSelectedLocation : 'All locations'}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3 max-h-96 overflow-y-auto">
                <button
                  onClick={() => setTempSelectedLocation('')}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    tempSelectedLocation === ''
                      ? 'border-orange-500 bg-orange-50 text-orange-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-center">
                    <div className="text-2xl mb-2">🌍</div>
                    <div className="font-medium">All Locations</div>
                  </div>
                </button>
                {algerianWilayas.map((wilaya) => (
                  <button
                    key={wilaya}
                    onClick={() => setTempSelectedLocation(wilaya)}
                    className={`p-3 rounded-xl border-2 transition-all text-sm ${
                      tempSelectedLocation === wilaya
                        ? 'border-orange-500 bg-orange-50 text-orange-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-center">
                      <div className="font-medium">{wilaya}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Bottom Section */}
        <div className="p-6 border-t border-gray-100 flex-shrink-0">
          {/* Active Workers Toggle */}
          <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl mb-4">
            <div className="flex items-center space-x-3">
              <Wifi className="w-5 h-5 text-blue-600" />
              <span className="font-medium text-blue-900">Show Only Active Workers</span>
            </div>
            <button
              onClick={() => setTempShowOnlyActive(!tempShowOnlyActive)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                tempShowOnlyActive ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  tempShowOnlyActive ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <button
              onClick={() => {
                setTempSelectedService(null);
                setTempSelectedLocation('');
                setTempShowOnlyActive(false);
              }}
              className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-xl font-medium hover:bg-gray-200 transition-colors"
            >
              Clear All
            </button>
            <button
              onClick={handleApplyFilters}
              className="flex-1 bg-orange-600 text-white py-3 px-4 rounded-xl font-medium hover:bg-orange-700 transition-colors"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}; 