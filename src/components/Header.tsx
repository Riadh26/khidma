import React from 'react';
import { MapPin, Bell, User, LogOut, MessageCircle, Filter } from 'lucide-react';
import { User as UserType } from '../types';

interface HeaderProps {
  user: UserType | null;
  isAuthenticated: boolean;
  onNotificationClick: () => void;
  onMessagesClick: () => void;
  onFilterClick: () => void;
  onAuthClick: () => void;
  onLogout: () => void;
  notificationCount: number;
  unreadMessagesCount: number;
  selectedService: any;
}

export const Header: React.FC<HeaderProps> = ({ 
  user,
  isAuthenticated,
  onNotificationClick,
  onMessagesClick,
  onFilterClick,
  onAuthClick,
  onLogout,
  notificationCount,
  unreadMessagesCount,
  selectedService
}) => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-100 px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-lg">K</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Khidma DZ</h1>
            <div className="flex items-center text-sm text-gray-600">
              <MapPin className="w-4 h-4 mr-1" />
              <span>Algiers, Algeria</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          {isAuthenticated ? (
            <>
              <button 
                onClick={onFilterClick}
                className={`relative p-2 rounded-xl transition-colors ${
                  selectedService 
                    ? 'bg-blue-100 text-blue-600' 
                    : 'text-gray-600 hover:text-blue-600'
                }`}
              >
                <Filter className="w-6 h-6" />
                {selectedService && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full"></div>
                )}
              </button>
              <button 
                onClick={onMessagesClick}
                className="relative p-2 text-gray-600 hover:text-blue-600 transition-colors"
              >
                <MessageCircle className="w-6 h-6" />
                {unreadMessagesCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                    {unreadMessagesCount}
                  </span>
                )}
              </button>
              <button 
                onClick={onNotificationClick}
                className="relative p-2 text-gray-600 hover:text-blue-600 transition-colors"
              >
                <Bell className="w-6 h-6" />
                {notificationCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {notificationCount}
                  </span>
                )}
              </button>
              <div className="flex items-center space-x-2">
                {user?.avatar ? (
                  <img 
                    src={user.avatar} 
                    alt={user.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-gray-600" />
                  </div>
                )}
                <button 
                  onClick={onLogout}
                  className="p-2 text-gray-600 hover:text-red-600 transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </>
          ) : (
            <button 
              onClick={onAuthClick}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Sign In
            </button>
          )}
        </div>
      </div>
    </header>
  );
};