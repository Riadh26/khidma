import React, { useEffect, useState } from 'react';
import { Bid } from '../types';
import { Star, Clock, X } from 'lucide-react';

interface BidNotificationPopupProps {
  bid: Bid | null;
  onClose: () => void;
  onView: () => void;
}

export const BidNotificationPopup: React.FC<BidNotificationPopupProps> = ({
  bid,
  onClose,
  onView
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (bid) {
      setIsVisible(true);
      // Auto-hide after 5 seconds
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(onClose, 300); // Wait for animation to complete
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [bid, onClose]);

  if (!bid) return null;

  return (
    <div className={`fixed top-4 left-4 right-4 z-[9999] transition-all duration-300 ${
      isVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
    }`}>
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-4 mx-auto max-w-sm">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-green-600">New Bid Received</span>
          </div>
          <button 
            onClick={() => {
              setIsVisible(false);
              setTimeout(onClose, 300);
            }}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-4 h-4 text-gray-400" />
          </button>
        </div>
        
        <div className="flex items-center space-x-3">
          <img 
            src={bid.worker.avatar} 
            alt={bid.worker.name}
            className="w-12 h-12 rounded-full object-cover"
          />
          <div className="flex-1">
            <h4 className="font-semibold text-gray-900">{bid.worker.name}</h4>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <div className="flex items-center">
                <Star className="w-3 h-3 text-yellow-400 mr-1" />
                <span>{bid.worker.rating}</span>
              </div>
              <span>•</span>
              <div className="flex items-center">
                <Clock className="w-3 h-3 mr-1" />
                <span>{bid.estimatedArrival}</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold text-green-600">
              {bid.price.toLocaleString()} DA
            </div>
          </div>
        </div>
        
        <button
          onClick={() => {
            setIsVisible(false);
            setTimeout(() => {
              onView();
              onClose();
            }, 300);
          }}
          className="w-full mt-3 bg-blue-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          View All Bids
        </button>
      </div>
    </div>
  );
};