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
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-gray-900">
          Received Bids ({bids.length})
        </h3>
        <div className="text-sm text-gray-500">
          Sort by: <span className="font-medium text-blue-600">Lowest Price</span>
        </div>
      </div>

      {bids.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <MessageCircle className="w-8 h-8 text-gray-400" />
          </div>
          <h4 className="text-xl font-bold text-gray-900 mb-2">No bids yet</h4>
          <p className="text-gray-600">Workers will start bidding on your job soon!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {bids.map((bid) => (
            <div key={bid.id} className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 hover:border-blue-200">
              <div className="flex items-start space-x-4">
                <img 
                  src={bid.worker.avatar} 
                  alt={bid.worker.name}
                  className="w-14 h-14 rounded-full object-cover border-2 border-gray-100"
                />
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-bold text-gray-900 text-lg">{bid.worker.name}</h4>
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
                      <div className="text-2xl font-bold text-green-600">
                        {bid.price.toLocaleString()} DA
                      </div>
                      <div className="text-sm text-gray-500 font-medium">
                        ETA: {bid.estimatedArrival}
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-gray-700 mt-3 text-sm leading-relaxed bg-gray-50 p-3 rounded-xl">{bid.message}</p>
                  
                  <div className="flex space-x-3 mt-4">
                    <button
                      onClick={() => onAcceptBid(bid)}
                      className="flex items-center space-x-2 bg-green-600 text-white px-6 py-3 rounded-xl text-sm font-bold hover:bg-green-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>Accept Bid</span>
                    </button>
                    <button
                      onClick={() => onMessageWorker(bid)}
                      className="flex items-center space-x-2 bg-gray-100 text-gray-700 px-6 py-3 rounded-xl text-sm font-bold hover:bg-gray-200 transition-all duration-300"
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