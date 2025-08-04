import React, { useState } from 'react';
import { JobRequest, Bid, WorkerReview } from '../types';
import { Clock, MapPin, DollarSign, Star, CheckCircle, XCircle, MessageCircle, Phone, Calendar, Award } from 'lucide-react';
import { mockWorkers } from '../data/mockData';

interface MyJobsProps {
  jobs: JobRequest[];
  onAcceptBid: (jobId: string, bid: Bid) => void;
  onMarkCompleted: (jobId: string) => void;
  onReviewWorker: (jobId: string, review: WorkerReview) => void;
  onMessageWorker: (workerId: string) => void;
  onClose: () => void;
}

export const MyJobs: React.FC<MyJobsProps> = ({
  jobs,
  onAcceptBid,
  onMarkCompleted,
  onReviewWorker,
  onMessageWorker,
  onClose
}) => {
  const [selectedJob, setSelectedJob] = useState<JobRequest | null>(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showJobDetails, setShowJobDetails] = useState(false);
  const [reviewData, setReviewData] = useState({
    rating: 5,
    comment: ''
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-blue-100 text-blue-800';
      case 'in_progress': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open': return '📋';
      case 'in_progress': return '🔄';
      case 'completed': return '✅';
      case 'cancelled': return '❌';
      default: return '📋';
    }
  };

  const handleReviewSubmit = () => {
    if (selectedJob && reviewData.comment.trim()) {
      const review: WorkerReview = {
        id: `review-${Date.now()}`,
        jobId: selectedJob.id,
        workerId: selectedJob.acceptedBid!.workerId,
        rating: reviewData.rating,
        comment: reviewData.comment,
        submittedAt: new Date()
      };
      onReviewWorker(selectedJob.id, review);
      setShowReviewModal(false);
      setReviewData({ rating: 5, comment: '' });
    }
  };

  const renderJobCard = (job: JobRequest) => (
    <div 
      key={job.id} 
      className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all cursor-pointer"
      onClick={() => {
        setSelectedJob(job);
        setShowJobDetails(true);
      }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-2xl">{job.serviceType.icon}</span>
            <h3 className="text-xl font-bold text-gray-900">{job.title}</h3>
          </div>
          <p className="text-gray-600 mb-3">{job.description}</p>
          
          <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
            <div className="flex items-center">
              <MapPin className="w-4 h-4 mr-1" />
              <span>{job.location.address}</span>
            </div>
            <div className="flex items-center">
              <DollarSign className="w-4 h-4 mr-1" />
              <span>{job.budget.toLocaleString()} DA</span>
            </div>
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              <span>{job.postedAt.toLocaleDateString()}</span>
            </div>
          </div>
        </div>
        
        <div className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(job.status)} transition-all duration-300`}>
          <span className="mr-1">{getStatusIcon(job.status)}</span>
          {job.status.replace('_', ' ')}
        </div>
      </div>

      {/* Quick Actions Based on Status */}
      {job.status === 'open' && job.bids && job.bids.length > 0 && (
        <div className="bg-blue-50 p-4 rounded-xl mb-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold text-blue-900">📥 {job.bids.length} Bids Received</h4>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedJob(job);
                setShowJobDetails(true);
              }}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              View All →
            </button>
          </div>
          <div className="space-y-2">
            {job.bids.slice(0, 2).map((bid) => (
              <div key={bid.id} className="flex items-center justify-between bg-white p-3 rounded-lg">
                <div className="flex items-center space-x-3">
                  <img src={bid.worker.avatar} alt={bid.worker.name} className="w-8 h-8 rounded-full" />
                  <div>
                    <p className="font-medium text-sm">{bid.worker.name}</p>
                    <p className="text-xs text-gray-500">{bid.price.toLocaleString()} DA</p>
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onAcceptBid(job.id, bid);
                  }}
                  className="bg-green-600 text-white px-3 py-1 rounded-lg text-xs hover:bg-green-700 transition-colors"
                >
                  Accept
                </button>
              </div>
            ))}
            {job.bids.length > 2 && (
              <p className="text-xs text-blue-600 text-center">+{job.bids.length - 2} more bids</p>
            )}
          </div>
        </div>
      )}

      {job.status === 'in_progress' && job.acceptedBid && (
        <div className="bg-yellow-50 p-4 rounded-xl mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img src={job.acceptedBid.worker.avatar} alt={job.acceptedBid.worker.name} className="w-10 h-10 rounded-full" />
              <div>
                <p className="font-medium">{job.acceptedBid.worker.name}</p>
                <p className="text-sm text-gray-600">{job.acceptedBid.price.toLocaleString()} DA</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onMessageWorker(job.acceptedBid!.workerId);
                }}
                className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onMarkCompleted(job.id);
                  setSelectedJob(job);
                  setShowReviewModal(true);
                }}
                className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700 transition-colors"
              >
                ✅ Complete
              </button>
            </div>
          </div>
        </div>
      )}

      {job.status === 'completed' && job.acceptedBid && !job.review && (
        <div className="bg-green-50 p-4 rounded-xl mb-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-green-900">Job Completed!</h4>
              <p className="text-sm text-green-700">Review {job.acceptedBid.worker.name}</p>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedJob(job);
                setShowReviewModal(true);
              }}
              className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700 transition-colors flex items-center space-x-2"
            >
              <Star className="w-4 h-4" />
              <span>Review</span>
            </button>
          </div>
        </div>
      )}

      {job.review && (
        <div className="bg-gray-50 p-4 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-gray-900">Reviewed</h4>
              <div className="flex items-center space-x-2 mt-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-4 h-4 ${i < job.review!.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                ))}
                <span className="text-sm text-gray-600 ml-2">{job.review.rating}/5</span>
              </div>
            </div>
            <span className="text-xs text-gray-500">✓ Done</span>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 z-[9999] flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Award className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-900">My Jobs</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
            >
              <XCircle className="w-6 h-6 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Jobs List */}
        <div className="p-6 overflow-y-auto max-h-[70vh]">
          {jobs.length === 0 ? (
            <div className="text-center py-12">
              <Award className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs posted yet</h3>
              <p className="text-gray-500">Post your first job request to get started!</p>
            </div>
          ) : (
            <div className="space-y-6">
              {jobs.map(renderJobCard)}
            </div>
          )}
        </div>

        {/* Review Modal */}
        {showReviewModal && selectedJob && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-[10000] flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-md p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Rate Your Experience</h3>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">How was your experience?</label>
                <div className="flex space-x-2 justify-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setReviewData({ ...reviewData, rating: star })}
                      className={`p-2 ${reviewData.rating >= star ? 'text-yellow-400' : 'text-gray-300'} hover:text-yellow-400 transition-colors`}
                    >
                      <Star className="w-8 h-8 fill-current" />
                    </button>
                  ))}
                </div>
                <p className="text-center text-sm text-gray-600 mt-2">
                  {reviewData.rating === 5 && 'Excellent!'}
                  {reviewData.rating === 4 && 'Very Good!'}
                  {reviewData.rating === 3 && 'Good!'}
                  {reviewData.rating === 2 && 'Fair!'}
                  {reviewData.rating === 1 && 'Poor!'}
                </p>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => setShowReviewModal(false)}
                  className="flex-1 bg-gray-100 text-gray-700 px-4 py-3 rounded-xl font-medium hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    const review: WorkerReview = {
                      id: `review-${Date.now()}`,
                      jobId: selectedJob.id,
                      workerId: selectedJob.acceptedBid!.workerId,
                      rating: reviewData.rating,
                      comment: `Rated ${reviewData.rating}/5 stars`,
                      submittedAt: new Date()
                    };
                    onReviewWorker(selectedJob.id, review);
                    setShowReviewModal(false);
                    setReviewData({ rating: 5, comment: '' });
                  }}
                  className="flex-1 bg-green-600 text-white px-4 py-3 rounded-xl font-medium hover:bg-green-700 transition-colors"
                >
                  Submit Review
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Job Details Modal */}
        {showJobDetails && selectedJob && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-[10000] flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl">
              {/* Header */}
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-3xl">{selectedJob.serviceType.icon}</span>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">{selectedJob.title}</h2>
                      <p className="text-gray-600">{selectedJob.serviceType.name}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowJobDetails(false)}
                    className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                  >
                    <XCircle className="w-6 h-6 text-gray-500" />
                  </button>
                </div>
              </div>

              {/* Job Details */}
              <div className="p-6 overflow-y-auto max-h-[60vh]">
                {/* Job Info */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-blue-50 p-4 rounded-2xl">
                    <div className="flex items-center text-gray-600 mb-1">
                      <DollarSign className="w-4 h-4 mr-1 text-blue-600" />
                      <span className="text-sm">Budget</span>
                    </div>
                    <p className="font-bold text-lg text-blue-600">{selectedJob.budget.toLocaleString()} DA</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-2xl">
                    <div className="flex items-center text-gray-600 mb-1">
                      <Clock className="w-4 h-4 mr-1 text-green-600" />
                      <span className="text-sm">Posted</span>
                    </div>
                    <p className="font-bold text-lg text-green-600">{selectedJob.postedAt.toLocaleDateString()}</p>
                  </div>
                </div>

                {/* Description */}
                <div className="mb-6">
                  <h3 className="font-bold text-gray-900 mb-2">Description</h3>
                  <p className="text-gray-600 bg-gray-50 p-4 rounded-xl">{selectedJob.description}</p>
                </div>

                {/* Location */}
                <div className="mb-6">
                  <h3 className="font-bold text-gray-900 mb-2">Location</h3>
                  <div className="flex items-center bg-gray-50 p-4 rounded-xl">
                    <MapPin className="w-4 h-4 text-gray-600 mr-2" />
                    <span className="text-gray-600">{selectedJob.location.address}</span>
                  </div>
                </div>

                {/* Status */}
                <div className="mb-6">
                  <h3 className="font-bold text-gray-900 mb-2">Status</h3>
                  <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedJob.status)}`}>
                    <span className="mr-1">{getStatusIcon(selectedJob.status)}</span>
                    {selectedJob.status.replace('_', ' ')}
                  </div>
                </div>

                {/* Quick Actions Section */}
                <div className="mb-6">
                  <h3 className="font-bold text-gray-900 mb-3">Quick Actions</h3>
                  
                  {/* Debug info */}
                  <div className="mb-4 p-3 bg-gray-100 rounded-lg text-xs">
                    <p>Job Status: {selectedJob.status}</p>
                    <p>Has Bids: {selectedJob.bids ? 'Yes' : 'No'}</p>
                    <p>Bids Count: {selectedJob.bids?.length || 0}</p>
                    <p>Job ID: {selectedJob.id}</p>
                  </div>
                  
                  {/* For Open Jobs with Bids */}
                  {selectedJob.status === 'open' && selectedJob.bids && selectedJob.bids.length > 0 && (
                    <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
                      <h4 className="font-semibold text-blue-900 mb-3">📥 {selectedJob.bids.length} Bids Available</h4>
                      <div className="space-y-3">
                        {selectedJob.bids.slice(0, 3).map((bid) => (
                          <div key={bid.id} className="bg-white p-3 rounded-lg border border-blue-200 hover:border-green-300 transition-all">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <img src={bid.worker.avatar} alt={bid.worker.name} className="w-10 h-10 rounded-full" />
                                <div>
                                  <p className="font-medium">{bid.worker.name}</p>
                                  <p className="text-sm text-gray-600">{bid.price.toLocaleString()} DA</p>
                                  <div className="flex items-center space-x-2 text-xs text-gray-500">
                                    <Star className="w-3 h-3 text-yellow-400" />
                                    <span>{bid.worker.rating}</span>
                                    <span>•</span>
                                    <span>{bid.estimatedArrival}</span>
                                  </div>
                                </div>
                              </div>
                              <button
                                onClick={() => {
                                  onAcceptBid(selectedJob.id, bid);
                                  // Show immediate visual feedback
                                  const button = document.querySelector(`[data-bid-id="${bid.id}"]`) as HTMLButtonElement;
                                  if (button) {
                                    button.innerHTML = '✅ Accepted!';
                                    button.className = 'bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium';
                                    button.disabled = true;
                                  }
                                  // Close dialog after a short delay
                                  setTimeout(() => {
                                    setShowJobDetails(false);
                                  }, 1500);
                                }}
                                data-bid-id={bid.id}
                                className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700 transition-colors font-medium"
                              >
                                ✅ Accept
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* For Open Jobs with No Bids */}
                  {selectedJob.status === 'open' && (!selectedJob.bids || selectedJob.bids.length === 0) && (
                    <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-200">
                      <h4 className="font-semibold text-yellow-900 mb-3">⏳ Waiting for Bids</h4>
                      <p className="text-sm text-yellow-700 mb-3">
                        Your job is posted and workers are being notified. You should receive bids soon!
                      </p>
                      <div className="flex items-center space-x-2 text-xs text-yellow-600">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                        <span>Workers are reviewing your job...</span>
                      </div>
                    </div>
                  )}

                  {/* For In Progress Jobs */}
                  {selectedJob.status === 'in_progress' && selectedJob.acceptedBid && (
                    <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-200">
                      <h4 className="font-semibold text-yellow-900 mb-3">👷 Worker Assigned</h4>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <img src={selectedJob.acceptedBid.worker.avatar} alt={selectedJob.acceptedBid.worker.name} className="w-12 h-12 rounded-full" />
                          <div>
                            <p className="font-medium">{selectedJob.acceptedBid.worker.name}</p>
                            <p className="text-sm text-gray-600">{selectedJob.acceptedBid.price.toLocaleString()} DA</p>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => {
                              onMessageWorker(selectedJob.acceptedBid!.workerId);
                              setShowJobDetails(false);
                            }}
                            className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            <MessageCircle className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              onMarkCompleted(selectedJob.id);
                              setShowJobDetails(false);
                              setShowReviewModal(true);
                            }}
                            className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700 transition-colors"
                          >
                            ✅ Complete
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* For Completed Jobs */}
                  {selectedJob.status === 'completed' && selectedJob.acceptedBid && !selectedJob.review && (
                    <div className="bg-green-50 p-4 rounded-xl border border-green-200">
                      <h4 className="font-semibold text-green-900 mb-3">⭐ Ready to Review</h4>
                      <p className="text-sm text-green-700 mb-3">How was your experience with {selectedJob.acceptedBid.worker.name}?</p>
                      <button
                        onClick={() => {
                          setShowReviewModal(true);
                          setShowJobDetails(false);
                        }}
                        className="bg-green-600 text-white px-6 py-3 rounded-xl text-sm font-medium hover:bg-green-700 transition-colors flex items-center space-x-2"
                      >
                        <Star className="w-4 h-4" />
                        <span>Write Review</span>
                      </button>
                    </div>
                  )}

                  {/* For Reviewed Jobs */}
                  {selectedJob.review && (
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                      <h4 className="font-semibold text-gray-900 mb-3">⭐ Your Review</h4>
                      <div className="flex items-center space-x-2 mb-3">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`w-5 h-5 ${i < selectedJob.review!.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                        ))}
                        <span className="ml-2 font-medium text-gray-700">{selectedJob.review.rating}/5</span>
                      </div>
                      <p className="text-gray-700 bg-white p-3 rounded-lg">{selectedJob.review.comment}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}; 