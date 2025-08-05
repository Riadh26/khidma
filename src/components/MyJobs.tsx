import React, { useState } from 'react';
import { 
  X, 
  Clock, 
  MapPin, 
  DollarSign, 
  Star, 
  MessageCircle, 
  Phone, 
  CheckCircle, 
  AlertCircle, 
  Calendar,
  Edit,
  Trash2,
  Plus,
  Minus
} from 'lucide-react';
import { JobRequest, Bid, WorkerReview, ServiceWorker } from '../types';
import { mockWorkers } from '../data/mockData';

interface MyJobsProps {
  jobs: JobRequest[];
  onAcceptBid: (jobId: string, bid: Bid) => void;
  onMarkCompleted: (jobId: string) => void;
  onReviewWorker: (jobId: string, review: WorkerReview) => void;
  onMessageWorker: (workerId: string) => void;
  onEditJob: (jobId: string, updatedJob: Partial<JobRequest>) => void;
  onDeleteJob: (jobId: string) => void;
  onClose: () => void;
}

export const MyJobs: React.FC<MyJobsProps> = ({
  jobs,
  onAcceptBid,
  onMarkCompleted,
  onReviewWorker,
  onMessageWorker,
  onEditJob,
  onDeleteJob,
  onClose
}) => {
  const [selectedJob, setSelectedJob] = useState<JobRequest | null>(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showJobDetails, setShowJobDetails] = useState(false);
  const [showFileViewer, setShowFileViewer] = useState(false);
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [editingJob, setEditingJob] = useState<JobRequest | null>(null);
  const [newPrice, setNewPrice] = useState<number>(0);
  const [showFullEditModal, setShowFullEditModal] = useState(false);
  const [editingFullJob, setEditingFullJob] = useState<JobRequest | null>(null);
  const [editFormData, setEditFormData] = useState({
    title: '',
    description: '',
    budget: 0,
    urgency: 'medium' as 'low' | 'medium' | 'high'
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-blue-100 text-blue-800';
      case 'in_progress': return 'bg-orange-100 text-orange-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open': return <AlertCircle className="w-4 h-4" />;
      case 'in_progress': return <Clock className="w-4 h-4" />;
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'cancelled': return <X className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  const handleReviewSubmit = (rating: number) => {
    if (selectedJob && selectedJob.acceptedBid) {
      const review: WorkerReview = {
        id: `review-${Date.now()}`,
        jobId: selectedJob.id,
        workerId: selectedJob.acceptedBid.workerId,
        rating,
        comment: `Great service! Worker was professional and completed the job on time.`,
        submittedAt: new Date()
      };
      onReviewWorker(selectedJob.id, review);
      setShowReviewModal(false);
      setSelectedJob(null);
    }
  };

  const handleEditJob = (job: JobRequest) => {
    setEditingJob(job);
    setNewPrice(job.budget);
    setShowEditModal(true);
  };

  const handleEditFullJob = (job: JobRequest) => {
    setEditingFullJob(job);
    setEditFormData({
      title: job.title,
      description: job.description,
      budget: job.budget,
      urgency: job.urgency
    });
    setShowFullEditModal(true);
  };

  const handleSaveFullEdit = () => {
    if (editingFullJob) {
      onEditJob(editingFullJob.id, {
        title: editFormData.title,
        description: editFormData.description,
        budget: editFormData.budget,
        urgency: editFormData.urgency
      });
      setShowFullEditModal(false);
      setEditingFullJob(null);
      setEditFormData({
        title: '',
        description: '',
        budget: 0,
        urgency: 'medium'
      });
    }
  };

  const handleSaveEdit = () => {
    if (editingJob && newPrice > 0) {
      onEditJob(editingJob.id, { budget: newPrice });
      setShowEditModal(false);
      setEditingJob(null);
      setNewPrice(0);
    }
  };

  const handleDeleteJob = (job: JobRequest) => {
    setSelectedJob(job);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    if (selectedJob) {
      onDeleteJob(selectedJob.id);
      setShowDeleteConfirm(false);
      setSelectedJob(null);
    }
  };

  const handleFileView = (file: any) => {
    setSelectedFile(file);
    setShowFileViewer(true);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const renderJobCard = (job: JobRequest) => (
    <div 
      key={job.id}
      className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 cursor-pointer"
      onClick={() => {
        setSelectedJob(job);
        setShowJobDetails(true);
      }}
    >
      {/* Header with Status and Actions */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${getStatusColor(job.status)}`}>
            {getStatusIcon(job.status)}
            <span className="capitalize">{job.status.replace('_', ' ')}</span>
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleEditFullJob(job);
            }}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
            title="Edit Job Details"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteJob(job);
            }}
            className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
            title="Delete Job"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Job Info */}
      <div className="space-y-3">
        <h3 className="text-lg font-bold text-gray-900">{job.title}</h3>
        <p className="text-gray-600 text-sm line-clamp-2">{job.description}</p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">Service:</span>
            <span className="text-sm font-medium text-blue-600">{job.serviceType.name}</span>
          </div>
          <div className="flex items-center space-x-2">
            <DollarSign className="w-4 h-4 text-green-600" />
            <div className="flex items-center space-x-2">
              <span className="font-bold text-green-600">
                {job.budget.toLocaleString()} DA
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleEditJob(job);
                }}
                className="p-1 text-orange-600 hover:bg-orange-50 rounded-full transition-colors"
                title="Edit Job Price"
              >
                <Edit className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-2">
            <MapPin className="w-4 h-4 text-gray-400" />
            <span className="text-gray-600">{job.location.address}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-gray-400" />
            <span className="text-gray-600">
              {job.postedAt.toLocaleDateString()}
            </span>
          </div>
        </div>

        {/* Visitor Time */}
        {job.visitorTime && (
          <div className="flex items-center space-x-2 text-sm">
            <Calendar className="w-4 h-4 text-blue-500" />
            <span className="text-blue-600 font-medium">
              {job.visitorTime.type === 'all_day' ? (
                '🌅 Any Time Availability'
              ) : (
                `⏰ ${job.visitorTime.preferredDate ? new Date(job.visitorTime.preferredDate).toLocaleDateString() : 'Select date'} • ${job.visitorTime.startTime} - ${job.visitorTime.endTime}`
              )}
            </span>
          </div>
        )}

        {/* Bids Count */}
        {job.bids && job.bids.length > 0 && (
          <div className="bg-blue-50 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-blue-900">
                📋 {job.bids.length} bid{job.bids.length > 1 ? 's' : ''} received
              </span>
              <span className="text-xs text-blue-600">
                Latest: {Math.max(...job.bids.map(bid => bid.submittedAt.getTime())) > Date.now() - 5 * 60 * 1000 ? 'Just now' : 'Recently'}
              </span>
            </div>
          </div>
        )}

        {/* Assigned Worker */}
        {job.acceptedBid && (
          <div className="bg-green-50 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-green-900">
                  Assigned to {job.acceptedBid.worker.name}
                </span>
              </div>
              <span className="text-xs text-green-600">
                {job.acceptedBid.price.toLocaleString()} DA
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-[9999] flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl w-full max-w-4xl h-[90vh] overflow-hidden shadow-2xl animate-fadeIn flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-gray-100 flex-shrink-0 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-orange-600 to-orange-700 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">B</span>
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">My Jobs</h2>
                <p className="text-sm text-gray-500">{jobs.length} job{jobs.length !== 1 ? 's' : ''} posted</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {jobs.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertCircle className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs posted yet</h3>
                <p className="text-gray-500">Post your first job request to get started!</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {jobs.map(renderJobCard)}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Job Details Modal */}
      {showJobDetails && selectedJob && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[10000] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl animate-fadeIn flex flex-col">
            {/* Header */}
            <div className="p-6 border-b border-gray-100 flex-shrink-0 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-orange-600 to-orange-700 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-lg">B</span>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Job Details</h2>
                  <p className="text-sm text-gray-500">{selectedJob.title}</p>
                </div>
              </div>
              <button 
                onClick={() => setShowJobDetails(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-6">
                {/* Job Info */}
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{selectedJob.title}</h3>
                  <p className="text-gray-600 mb-4">{selectedJob.description}</p>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-500">Service:</span>
                      <span className="font-medium text-blue-600">{selectedJob.serviceType.name}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <DollarSign className="w-4 h-4 text-green-600" />
                      <span className="font-bold text-green-600">{selectedJob.budget.toLocaleString()} DA</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">{selectedJob.location.address}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">
                        Posted {selectedJob.postedAt.toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Visitor Time */}
                {selectedJob.visitorTime && (
                  <div className="bg-blue-50 rounded-xl p-4">
                    <h4 className="font-semibold text-blue-900 mb-2">Visitor Time</h4>
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-blue-600" />
                      <span className="text-blue-700">
                        {selectedJob.visitorTime.type === 'all_day' ? (
                          '🌅 Any Time Availability'
                        ) : (
                          `⏰ ${selectedJob.visitorTime.preferredDate ? new Date(selectedJob.visitorTime.preferredDate).toLocaleDateString() : 'Select date'} • ${selectedJob.visitorTime.startTime} - ${selectedJob.visitorTime.endTime}`
                        )}
                      </span>
                    </div>
                  </div>
                )}

                {/* Uploaded Files */}
                {selectedJob.uploadedFiles && selectedJob.uploadedFiles.length > 0 && (
                  <div className="mb-6">
                    <h3 className="font-bold text-gray-900 mb-2">Uploaded Files</h3>
                    <div className="grid grid-cols-2 gap-3">
                      {selectedJob.uploadedFiles.map((file) => (
                        <div 
                          key={file.id} 
                          className="bg-gray-50 rounded-xl p-3 cursor-pointer hover:bg-gray-100 transition-colors"
                          onClick={() => handleFileView(file)}
                        >
                          <div className="flex items-center space-x-2 mb-2">
                            {file.type === 'image' ? (
                              <span className="text-blue-500">📷</span>
                            ) : (
                              <span className="text-purple-500">🎥</span>
                            )}
                            <span className="text-sm font-medium text-gray-900 truncate">{file.name}</span>
                          </div>
                          <div className="h-20 rounded-lg overflow-hidden">
                            {file.type === 'image' ? (
                              <img 
                                src={file.preview} 
                                alt={file.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <video 
                                src={file.preview}
                                className="w-full h-full object-cover"
                                muted
                              />
                            )}
                          </div>
                          <p className="text-xs text-gray-500 mt-1 text-center">Click to view</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Incoming Bids */}
                {selectedJob.bids && selectedJob.bids.length > 0 && (
                  <div>
                    <h3 className="font-bold text-gray-900 mb-4">Arriving Bids ({selectedJob.bids.length})</h3>
                    <div className="space-y-3">
                      {selectedJob.bids.map((bid) => (
                        <div key={bid.id} className="bg-gray-50 rounded-xl p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center space-x-3">
                              <img 
                                src={bid.worker.avatar} 
                                alt={bid.worker.name}
                                className="w-12 h-12 rounded-full"
                              />
                              <div>
                                <h4 className="font-semibold text-gray-900">{bid.worker.name}</h4>
                                <p className="text-sm text-gray-600">{bid.worker.serviceType.name}</p>
                                <div className="flex items-center space-x-4 text-xs text-gray-500 mt-1">
                                  <div className="flex items-center space-x-1">
                                    <Star className="w-3 h-3 text-yellow-500" />
                                    <span>{bid.worker.rating}</span>
                                    <span>({bid.worker.reviewCount})</span>
                                  </div>
                                  <div className="flex items-center space-x-1">
                                    <Clock className="w-3 h-3" />
                                    <span>{bid.estimatedArrival}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-bold text-green-600 text-lg">
                                {bid.price.toLocaleString()} DA
                              </div>
                              <button
                                onClick={() => onAcceptBid(selectedJob.id, bid)}
                                className="bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-orange-700 transition-colors mt-2"
                              >
                                Accept Bid
                              </button>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 mt-3">"{bid.message}"</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Waiting for Bids */}
                {(!selectedJob.bids || selectedJob.bids.length === 0) && selectedJob.status === 'open' && (
                  <div className="bg-yellow-50 rounded-xl p-4 text-center">
                    <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Clock className="w-6 h-6 text-yellow-600" />
                    </div>
                    <h4 className="font-semibold text-yellow-900 mb-1">Waiting for Bids</h4>
                    <p className="text-yellow-700 text-sm">Workers will start bidding on your job soon</p>
                  </div>
                )}

                {/* Assigned Worker */}
                {selectedJob.acceptedBid && (
                  <div className="bg-green-50 rounded-xl p-4">
                    <h3 className="font-bold text-green-900 mb-3">Assigned Worker</h3>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <img 
                          src={selectedJob.acceptedBid.worker.avatar} 
                          alt={selectedJob.acceptedBid.worker.name}
                          className="w-12 h-12 rounded-full"
                        />
                        <div>
                          <h4 className="font-semibold text-gray-900">{selectedJob.acceptedBid.worker.name}</h4>
                          <p className="text-sm text-gray-600">{selectedJob.acceptedBid.worker.serviceType.name}</p>
                          <div className="flex items-center space-x-1 mt-1">
                            <Star className="w-3 h-3 text-yellow-500" />
                            <span className="text-xs text-gray-600">{selectedJob.acceptedBid.worker.rating} ({selectedJob.acceptedBid.worker.reviewCount} reviews)</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-green-600 text-lg">
                          {selectedJob.acceptedBid.price.toLocaleString()} DA
                        </div>
                        <div className="flex space-x-2 mt-2">
                          <button
                            onClick={() => onMessageWorker(selectedJob.acceptedBid.worker.id)}
                            className="bg-blue-600 text-white px-3 py-1 rounded-lg text-xs font-medium hover:bg-blue-700 transition-colors"
                          >
                            Message
                          </button>
                          <button
                            onClick={() => {
                              onMarkCompleted(selectedJob.id);
                              setShowReviewModal(true);
                            }}
                            className="bg-green-600 text-white px-3 py-1 rounded-lg text-xs font-medium hover:bg-green-700 transition-colors"
                          >
                            Complete & Review
                          </button>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mt-3">"{selectedJob.acceptedBid.message}"</p>
                  </div>
                )}

                {/* Review */}
                {selectedJob.review && (
                  <div className="bg-blue-50 rounded-xl p-4">
                    <h3 className="font-bold text-blue-900 mb-2">Your Review</h3>
                    <div className="flex items-center space-x-2 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-4 h-4 ${i < selectedJob.review!.rating ? 'text-yellow-500 fill-current' : 'text-gray-300'}`} 
                        />
                      ))}
                      <span className="text-sm text-gray-600">({selectedJob.review.rating}/5)</span>
                    </div>
                    <p className="text-sm text-gray-600">{selectedJob.review.comment}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Job Modal */}
      {showEditModal && editingJob && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[10001] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl animate-fadeIn">
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-900">Edit Job Price</h3>
              <p className="text-sm text-gray-600 mt-1">Adjust the budget for your job</p>
            </div>
            
            <div className="p-6">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Current Budget</label>
                <div className="text-2xl font-bold text-green-600">{editingJob.budget.toLocaleString()} DA</div>
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">New Budget</label>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setNewPrice(Math.max(1000, newPrice - 500))}
                    className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <div className="flex-1 text-center">
                    <div className="text-2xl font-bold text-green-600">{newPrice.toLocaleString()} DA</div>
                  </div>
                  <button
                    onClick={() => setNewPrice(newPrice + 500)}
                    className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-2 text-center">Adjust in 500 DA increments</p>
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingJob(null);
                    setNewPrice(0);
                  }}
                  className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-xl font-medium hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEdit}
                  className="flex-1 bg-orange-600 text-white py-3 px-4 rounded-xl font-medium hover:bg-orange-700 transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && selectedJob && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[10001] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl animate-fadeIn">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <Trash2 className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Delete Job</h3>
                  <p className="text-sm text-gray-600">This action cannot be undone</p>
                </div>
              </div>
            </div>
            
            <div className="p-6">
              <p className="text-gray-700 mb-6">
                Are you sure you want to delete "<strong>{selectedJob.title}</strong>"? 
                This will remove the job and all associated bids.
              </p>
              
              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    setSelectedJob(null);
                  }}
                  className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-xl font-medium hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 bg-red-600 text-white py-3 px-4 rounded-xl font-medium hover:bg-red-700 transition-colors"
                >
                  Delete Job
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Review Modal */}
      {showReviewModal && selectedJob && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[10002] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl animate-fadeIn">
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-900">Rate Your Experience</h3>
              <p className="text-sm text-gray-600 mt-1">
                How was your experience with {selectedJob.acceptedBid ? selectedJob.acceptedBid.worker.name : 'the worker'}?
              </p>
            </div>
            
            <div className="p-6">
              <div className="flex justify-center space-x-2 mb-6">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => handleReviewSubmit(star)}
                    className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center hover:bg-yellow-100 transition-colors"
                  >
                    <Star className="w-6 h-6 text-yellow-500" />
                  </button>
                ))}
              </div>
              
              <div className="text-center">
                <p className="text-sm text-gray-600">Tap a star to rate</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* File Viewer Modal */}
      {showFileViewer && selectedFile && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-[10003] flex items-center justify-center p-4">
          <div className="relative w-full max-w-4xl max-h-[90vh]">
            {/* Close Button */}
            <button
              onClick={() => setShowFileViewer(false)}
              className="absolute top-4 right-4 z-10 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            {/* File Content */}
            <div className="bg-white rounded-2xl overflow-hidden">
              {/* Header */}
              <div className="p-4 border-b border-gray-200 bg-gray-50">
                <div className="flex items-center space-x-3">
                  {selectedFile.type === 'image' ? (
                    <span className="text-blue-500">📷</span>
                  ) : (
                    <span className="text-purple-500">🎥</span>
                  )}
                  <div>
                    <h3 className="font-semibold text-gray-900">{selectedFile.name}</h3>
                    <p className="text-sm text-gray-500">
                      {selectedFile.type === 'image' ? 'Image' : 'Video'} • {formatFileSize(selectedFile.file.size)}
                    </p>
                  </div>
                </div>
              </div>

              {/* File Display */}
              <div className="p-4">
                {selectedFile.type === 'image' ? (
                  <div className="flex justify-center">
                    <img 
                      src={selectedFile.preview} 
                      alt={selectedFile.name}
                      className="max-w-full max-h-[70vh] object-contain rounded-lg shadow-lg"
                    />
                  </div>
                ) : (
                  <div className="flex justify-center">
                    <video 
                      src={selectedFile.preview}
                      controls
                      className="max-w-full max-h-[70vh] rounded-lg shadow-lg"
                      autoPlay
                    >
                      Your browser does not support the video tag.
                    </video>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Full Edit Job Modal */}
      {showFullEditModal && editingFullJob && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[10001] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl animate-fadeIn">
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-900">Edit Job Details</h3>
              <p className="text-sm text-gray-600 mt-1">Update your job information</p>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Job Title</label>
                <input
                  type="text"
                  value={editFormData.title}
                  onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="Enter job title"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={editFormData.description}
                  onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="Describe your job requirements"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Budget (DA)</label>
                <input
                  type="number"
                  value={editFormData.budget}
                  onChange={(e) => setEditFormData({ ...editFormData, budget: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="Enter budget"
                  min="1000"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Urgency</label>
                <select
                  value={editFormData.urgency}
                  onChange={(e) => setEditFormData({ ...editFormData, urgency: e.target.value as 'low' | 'medium' | 'high' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              
              <div className="flex space-x-3 pt-4">
                <button
                  onClick={() => {
                    setShowFullEditModal(false);
                    setEditingFullJob(null);
                    setEditFormData({
                      title: '',
                      description: '',
                      budget: 0,
                      urgency: 'medium'
                    });
                  }}
                  className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-xl font-medium hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveFullEdit}
                  className="flex-1 bg-orange-600 text-white py-3 px-4 rounded-xl font-medium hover:bg-orange-700 transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}; 