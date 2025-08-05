import React from 'react';
import { MessageCircle, User, Clock, ArrowLeft } from 'lucide-react';
import { Chat as ChatType } from '../types';

interface ChatListProps {
  chats: ChatType[];
  activeChatId: string | null;
  onChatSelect: (chatId: string) => void;
  onClose: () => void;
}

export const ChatList: React.FC<ChatListProps> = ({
  chats,
  activeChatId,
  onChatSelect,
  onClose
}) => {
  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-[9999] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-md h-[90vh] overflow-hidden shadow-2xl animate-fadeIn flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex-shrink-0 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-orange-600 to-orange-700 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">B</span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Messages</h2>
              <p className="text-sm text-gray-500">{chats.length} conversations</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto">
          {chats.length === 0 ? (
            <div className="p-8 text-center">
              <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No messages yet</h3>
              <p className="text-gray-500">Start a conversation with a worker to see messages here</p>
            </div>
          ) : (
            <div className="p-4 space-y-2">
              {chats.map((chat) => (
                <div
                  key={chat.id}
                  onClick={() => onChatSelect(chat.id)}
                  className={`p-4 rounded-2xl cursor-pointer transition-all ${
                    activeChatId === chat.id
                      ? 'bg-orange-50 border-2 border-orange-200'
                      : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <img 
                      src={chat.worker.avatar} 
                      alt={chat.worker.name}
                      className="w-12 h-12 rounded-full flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-gray-900 truncate">{chat.worker.name}</h3>
                        <span className="text-xs text-gray-500 flex-shrink-0 ml-2">{formatTime(chat.updatedAt)}</span>
                      </div>
                      <p className="text-sm text-gray-600 truncate mt-1">
                        {chat.lastMessage?.content || 'No messages yet'}
                      </p>
                      <div className="flex items-center space-x-2 mt-2">
                        <span className="text-xs text-blue-600 font-medium">{chat.worker.serviceType.name}</span>
                        {chat.unreadCount > 0 && (
                          <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full flex-shrink-0">
                            {chat.unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}; 