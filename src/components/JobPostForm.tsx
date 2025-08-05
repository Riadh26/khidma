import React, { useState, useRef } from 'react';
import { ServiceType, JobRequest } from '../types';
import { X, MapPin, Camera, DollarSign, Clock, Calendar, Upload, Video, Image, Trash2 } from 'lucide-react';

interface JobPostFormProps {
  services: ServiceType[];
  onClose: () => void;
  onSubmit: (jobData: Partial<JobRequest>) => void;
}

interface UploadedFile {
  id: string;
  file: File;
  type: 'image' | 'video';
  preview: string;
  name: string;
}

export const JobPostForm: React.FC<JobPostFormProps> = ({
  services,
  onClose,
  onSubmit
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    serviceType: '',
    budget: '',
    urgency: 'medium' as const,
    address: 'Algiers, Algeria',
    visitorTime: 'all_day' as 'all_day' | 'specific',
    startTime: '00:00',
    endTime: '23:59',
    preferredDate: ''
  });

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        const fileId = `file-${Date.now()}-${Math.random()}`;
        const fileType = file.type.startsWith('image/') ? 'image' : 'video';
        
        // Create preview URL
        const preview = URL.createObjectURL(file);
        
        const uploadedFile: UploadedFile = {
          id: fileId,
          file,
          type: fileType,
          preview,
          name: file.name
        };
        
        setUploadedFiles(prev => [...prev, uploadedFile]);
      });
    }
  };

  const removeFile = (fileId: string) => {
    setUploadedFiles(prev => {
      const fileToRemove = prev.find(f => f.id === fileId);
      if (fileToRemove) {
        URL.revokeObjectURL(fileToRemove.preview);
      }
      return prev.filter(f => f.id !== fileId);
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedService = services.find(s => s.id === formData.serviceType);
    if (selectedService) {
      onSubmit({
        title: formData.title,
        description: formData.description,
        serviceType: selectedService,
        budget: parseInt(formData.budget),
        urgency: formData.urgency,
        location: {
          lat: 36.7372,
          lng: 3.0869,
          address: formData.address
        },
        visitorTime: {
          type: formData.visitorTime,
          startTime: formData.startTime,
          endTime: formData.endTime,
          preferredDate: formData.preferredDate
        },
        uploadedFiles: uploadedFiles
      });
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md h-[90vh] flex flex-col overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Post a Job</h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Service Type
            </label>
            <select
              value={formData.serviceType}
              onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">Select a service</option>
              {services.map((service) => (
                <option key={service.id} value={service.id}>
                  {service.icon} {service.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Job Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g., Fix kitchen sink leak"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe what needs to be done..."
              rows={4}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Budget (DA)
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="number"
                value={formData.budget}
                onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                placeholder="5000"
                className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Urgency
            </label>
            <div className="flex space-x-3">
              {[
                { value: 'low', label: 'Low', color: 'bg-green-100 text-green-800' },
                { value: 'medium', label: 'Medium', color: 'bg-yellow-100 text-yellow-800' },
                { value: 'high', label: 'High', color: 'bg-red-100 text-red-800' }
              ].map((urgency) => (
                <button
                  key={urgency.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, urgency: urgency.value as any })}
                  className={`flex-1 py-3 px-3 rounded-xl text-sm font-medium transition-colors ${
                    formData.urgency === urgency.value
                      ? urgency.color
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {urgency.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
                required
              />
            </div>
          </div>

          {/* Visitor Time Settings */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Clock className="inline w-4 h-4 mr-1" />
              Visitor Time
            </label>
            
            <p className="text-xs text-gray-600 mb-4">💡 Set your preferred time - workers will come when it suits you best</p>
            
            {/* Time Type Selection */}
            <div className="flex space-x-3 mb-4">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, visitorTime: 'all_day' })}
                className={`flex-1 py-3 px-3 rounded-xl text-sm font-medium transition-colors ${
                  formData.visitorTime === 'all_day'
                    ? 'bg-blue-100 text-blue-800 border-2 border-blue-300'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border-2 border-transparent'
                }`}
              >
                🌅 Any Time
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, visitorTime: 'specific' })}
                className={`flex-1 py-3 px-3 rounded-xl text-sm font-medium transition-colors ${
                  formData.visitorTime === 'specific'
                    ? 'bg-blue-100 text-blue-800 border-2 border-blue-300'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border-2 border-transparent'
                }`}
              >
                ⏰ Specific Time
              </button>
            </div>

            {/* Specific Time Settings */}
            {formData.visitorTime === 'specific' && (
              <div className="space-y-4 p-4 bg-blue-50 rounded-xl">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preferred Date
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="date"
                      value={formData.preferredDate}
                      onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                      className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Start Time
                    </label>
                    <input
                      type="time"
                      value={formData.startTime}
                      onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      min="00:00"
                      max="23:59"
                    />
                    <p className="text-xs text-gray-500 mt-1">Any time (24-hour format)</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      End Time
                    </label>
                    <input
                      type="time"
                      value={formData.endTime}
                      onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      min="00:00"
                      max="23:59"
                    />
                    <p className="text-xs text-gray-500 mt-1">Any time (24-hour format)</p>
                  </div>
                </div>

                <div className="text-sm text-blue-700 bg-blue-100 p-3 rounded-lg">
                  <p className="font-medium">📅 Time Window:</p>
                  <p>{formData.preferredDate ? new Date(formData.preferredDate).toLocaleDateString() : 'Select date'} • {formData.startTime} - {formData.endTime}</p>
                  <p className="text-xs mt-1">💡 Workers will come at the time that suits you best</p>
                </div>
              </div>
            )}

            {/* All Day Display */}
            {formData.visitorTime === 'all_day' && (
              <div className="text-sm text-green-700 bg-green-100 p-3 rounded-lg">
                <p className="font-medium">🌅 Any Time Availability:</p>
                <p>Workers can visit at any time during the day</p>
              </div>
            )}
          </div>

          {/* File Upload Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Upload className="inline w-4 h-4 mr-1" />
              Upload Photos & Videos (Optional)
            </label>
            
            {/* Upload Area */}
            <div 
              className="border-2 border-dashed border-gray-300 rounded-xl p-6 hover:border-blue-400 transition-colors cursor-pointer bg-gray-50"
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*,video/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              <div className="text-center">
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600 mb-1">Click to upload photos or videos</p>
                <p className="text-xs text-gray-500">Supports: JPG, PNG, GIF, MP4, MOV (Max 10MB each)</p>
              </div>
            </div>

            {/* Uploaded Files Preview */}
            {uploadedFiles.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-700 mb-3">
                  Uploaded Files ({uploadedFiles.length})
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  {uploadedFiles.map((file) => (
                    <div key={file.id} className="relative bg-white border border-gray-200 rounded-lg p-3">
                      <div className="flex items-center space-x-2">
                        {file.type === 'image' ? (
                          <Image className="w-4 h-4 text-blue-500" />
                        ) : (
                          <Video className="w-4 h-4 text-purple-500" />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                          <p className="text-xs text-gray-500">{formatFileSize(file.file.size)}</p>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeFile(file.id);
                          }}
                          className="p-1 hover:bg-red-100 rounded-full transition-colors"
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </button>
                      </div>
                      
                      {/* Preview */}
                      <div className="mt-2">
                        {file.type === 'image' ? (
                          <img 
                            src={file.preview} 
                            alt={file.name}
                            className="w-full h-20 object-cover rounded-lg"
                          />
                        ) : (
                          <video 
                            src={file.preview}
                            className="w-full h-20 object-cover rounded-lg"
                            muted
                          />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex space-x-3 pt-6 pb-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-4 px-4 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-4 px-4 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors shadow-lg"
            >
              Post Job
            </button>
          </div>
          </form>
        </div>
      </div>
    </div>
  );
};