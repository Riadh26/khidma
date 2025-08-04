import React from 'react';
import { Chat } from '../types';
import { MessageCircle, Clock, ArrowLeft } from 'lucide-react';

interface ChatListProps {
  chats: Chat[];
  onChatSelect: (chat: Chat) => void;
  onClose: () => void;
}

export const ChatList: React.FC<ChatListProps> = ({
  chats,
  onChatSelect,
  onClose
}) => {
  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="fixed inset-0 bg-white z-[9999] flex flex-col animate-slideInLeft">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 shadow-lg">
        <div className="flex items-center justify-between">
          <button
            onClick={onClose}
            className="p-2 hover:bg-white hover:bg-opacity-20 rounded-xl transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-bold">Messages</h1>
          <div className="w-10"></div>
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto bg-gray-50">
        {chats.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500 animate-fadeIn">
            <MessageCircle className="w-16 h-16 mb-4 text-gray-300" />
            <h3 className="text-lg font-medium mb-2">No messages yet</h3>
            <p className="text-sm text-center px-8">
              Start a conversation with a worker to discuss your service needs
            </p>
          </div>
        ) : (
          <div className="p-4 space-y-2">
            {chats.map((chat, index) => (
              <div
                key={chat.id}
                onClick={() => onChatSelect(chat)}
                className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer border border-gray-100 animate-bounceIn"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <img
                      src={chat.worker.avatar}
                      alt={chat.worker.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                      chat.worker.isOnline ? 'bg-green-500' : 'bg-gray-400'
                    }`}></div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-gray-900 truncate">
                        {chat.worker.name}
                      </h3>
                      <span className="text-xs text-gray-500 flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {formatTime(chat.updatedAt)}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-sm text-gray-600 truncate flex-1">
                        {chat.lastMessage?.content || 'No messages yet'}
                      </p>
                      {chat.unreadCount > 0 && (
                        <div className="ml-2 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium animate-pulse-slow">
                          {chat.unreadCount}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center mt-1">
                      <span className="text-xs text-gray-500">{chat.worker.serviceType.name}</span>
                      <span className="mx-2 text-gray-300">•</span>
                      <span className="text-xs text-gray-500">{chat.worker.distance}km away</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}; 