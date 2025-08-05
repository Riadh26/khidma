import React, { useState } from 'react';
import { X, User, MapPin, Phone, Wrench, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { ServiceType } from '../types';

interface WorkerSignupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onWorkerSignup: (workerData: {
    name: string;
    email: string;
    phone: string;
    password: string;
    region: string;
    service: ServiceType;
  }) => void;
  services: ServiceType[];
}

export const WorkerSignupModal: React.FC<WorkerSignupModalProps> = ({
  isOpen,
  onClose,
  onWorkerSignup,
  services
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    region: '',
    service: null as ServiceType | null
  });

  if (!isOpen) return null;

  const regions = [
    { code: '16', name: 'Alger' },
    { code: '31', name: 'Oran' },
    { code: '21', name: 'Skikda' },
    { code: '19', name: 'Sétif' },
    { code: '24', name: 'Guelma' },
    { code: '25', name: 'Constantine' },
    { code: '26', name: 'Médéa' },
    { code: '27', name: 'Mostaganem' },
    { code: '29', name: 'Mascara' },
    { code: '32', name: 'El Bayadh' },
    { code: '34', name: 'Bordj Bou Arréridj' },
    { code: '35', name: 'Boumerdès' },
    { code: '36', name: 'El Tarf' },
    { code: '37', name: 'Tindouf' },
    { code: '38', name: 'Tissemsilt' },
    { code: '39', name: 'El Oued' },
    { code: '40', name: 'Khenchela' },
    { code: '41', name: 'Souk Ahras' },
    { code: '42', name: 'Tipaza' },
    { code: '43', name: 'Mila' },
    { code: '44', name: 'Aïn Defla' },
    { code: '45', name: 'Naâma' },
    { code: '46', name: 'Aïn Témouchent' },
    { code: '47', name: 'Ghardaïa' },
    { code: '48', name: 'Relizane' }
  ];

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.service) {
      onWorkerSignup({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        region: formData.region,
        service: formData.service
      });
    }
  };

  const renderStep1 = () => (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">Personal Information</h3>
        <p className="text-gray-600">Tell us about yourself</p>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Full Name
        </label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Enter your full name"
            className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Email Address
        </label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="Enter your email"
            className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Phone Number
        </label>
        <div className="relative">
          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="+213 555 123 456"
            className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            required
          />
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">Your Region</h3>
        <p className="text-gray-600">Where do you provide services?</p>
      </div>
      
      <div className="grid grid-cols-2 gap-3 max-h-64 overflow-y-auto">
        {regions.map((region) => (
          <button
            key={region.code}
            onClick={() => setFormData({ ...formData, region: region.code })}
            className={`p-4 rounded-xl text-left transition-all ${
              formData.region === region.code
                ? 'bg-orange-50 border-2 border-orange-200 text-orange-700'
                : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
            }`}
          >
            <div className="flex items-center space-x-3">
              <MapPin className="w-5 h-5" />
              <div>
                <p className="font-semibold text-sm">Wilaya {region.code}</p>
                <p className="text-xs text-gray-500">{region.name}</p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">Your Service</h3>
        <p className="text-gray-600">What type of work do you do?</p>
      </div>
      
      <div className="space-y-3">
        {services.map((service) => (
          <button
            key={service.id}
            onClick={() => setFormData({ ...formData, service })}
            className={`w-full p-4 rounded-xl text-left transition-all ${
              formData.service?.id === service.id
                ? 'bg-orange-50 border-2 border-orange-200 text-orange-700'
                : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
            }`}
          >
            <div className="flex items-center space-x-3">
              <div 
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: service.color + '20' }}
              >
                <span className="text-xl">{service.icon}</span>
              </div>
              <div>
                <p className="font-semibold">{service.name}</p>
                <p className="text-sm text-gray-500">{service.description}</p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">Create Password</h3>
        <p className="text-gray-600">Secure your account</p>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Password
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            placeholder="Create a strong password"
            className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <div className="bg-blue-50 rounded-xl p-4">
        <h4 className="font-semibold text-blue-900 mb-2">Account Summary</h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-blue-700">Name:</span>
            <span className="font-medium">{formData.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-blue-700">Email:</span>
            <span className="font-medium">{formData.email}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-blue-700">Phone:</span>
            <span className="font-medium">{formData.phone}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-blue-700">Region:</span>
            <span className="font-medium">Wilaya {formData.region}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-blue-700">Service:</span>
            <span className="font-medium">{formData.service?.name}</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep = () => {
    switch (currentStep) {
      case 1: return renderStep1();
      case 2: return renderStep2();
      case 3: return renderStep3();
      case 4: return renderStep4();
      default: return renderStep1();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-[9999] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-hidden animate-fadeIn flex flex-col">
        <div className="p-6 border-b border-gray-100 flex-shrink-0 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-orange-600 to-orange-700 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">B</span>
            </div>
            <h2 className="text-xl font-bold text-gray-900">Join as Worker</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="px-6 py-4 bg-gray-50 flex-shrink-0">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Step {currentStep} of 4</span>
            <span className="text-sm text-gray-500">{Math.round((currentStep / 4) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-orange-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / 4) * 100}%` }}
            ></div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <form onSubmit={handleSubmit} className="p-6">
            {renderStep()}

            <div className="flex space-x-3 mt-6">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={handleBack}
                  className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                >
                  Back
                </button>
              )}
              {currentStep < 4 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="flex-1 bg-orange-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-orange-700 transition-colors"
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-orange-600 to-orange-700 text-white py-3 px-4 rounded-lg font-medium hover:from-orange-700 hover:to-orange-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  Create Account
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}; 