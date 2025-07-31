import React from 'react';
import { Bid } from '../types';
import { Clock, Star, MessageCircle, CheckCircle } from 'lucide-react';

interface BidsListProps {
  bids: Bid[];
  onAcceptBid: (bid: Bid) => void;
  onMessageWorker: (bid: Bid) => void;
}

export const BidsList: React.FC<BidsListProps> = ({ 
  bids, 
  onAcceptBid, 
  onMessageWorker 
}) => {
  const formatTimeAgo = (date: Date) => {
    const minutes = Math.floor((Date.now() - date.getTime()) / (1000 * 60));
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    return `${Math.floor(minutes / 60)}h ago`;
  };

  return (
    <div className="space-y-4 overflow-y-auto flex-1">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">
          Received Bids ({bids.length})
        </h3>
        <div className="text-sm text-gray-600">
          Sort by: <span className="font-medium">Lowest Price</span>
        </div>
      </div>

      {bids.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <MessageCircle className="w-8 h-8 text-gray-400" />
          </div>
          <h4 className="text-lg font-medium text-gray-900 mb-2">No bids yet</h4>
          <p className="text-gray-600">Workers will start bidding on your job soon!</p>
        </div>
      ) : (
        <div className="space-y-3 pb-20">
          {bids.map((bid) => (
            <div key={bid.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start space-x-4">
                <img 
                  src={bid.worker.avatar} 
                  alt={bid.worker.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold text-gray-900">{bid.worker.name}</h4>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <div className="flex items-center">
                          <Star className="w-4 h-4 text-yellow-400 mr-1" />
                          <span>{bid.worker.rating}</span>
                        </div>
                        <span>•</span>
                        <span>{bid.worker.completedJobs} jobs</span>
                        <span>•</span>
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          <span>{formatTimeAgo(bid.submittedAt)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-green-600">
                        {bid.price.toLocaleString()} DA
                      </div>
                      <div className="text-sm text-gray-600">
                        ETA: {bid.estimatedArrival}
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-gray-700 mt-2 text-sm">{bid.message}</p>
                  
                  <div className="flex space-x-3 mt-4">
                    <button
                      onClick={() => onAcceptBid(bid)}
                      className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>Accept Bid</span>
                    </button>
                    <button
                      onClick={() => onMessageWorker(bid)}
                      className="flex items-center space-x-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Message</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};