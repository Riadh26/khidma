import React, { useState, useRef, useEffect } from 'react';
import { Send, ArrowLeft, Phone, MoreVertical } from 'lucide-react';
import { Chat, Message } from '../types';

interface ChatViewProps {
  chat: Chat;
  onSendMessage: (content: string) => void;
  onClose: () => void;
  onBack: () => void;
}

export const ChatView: React.FC<ChatViewProps> = ({
  chat,
  onSendMessage,
  onClose,
  onBack
}) => {
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chat.messages]);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      onSendMessage(newMessage.trim());
      setNewMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (date: Date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-[9999] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-md h-[90vh] overflow-hidden shadow-2xl animate-fadeIn flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-100 flex-shrink-0 flex items-center justify-between bg-gradient-to-r from-orange-600 to-orange-700 text-white">
          <div className="flex items-center space-x-3">
            <button
              onClick={onBack}
              className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <img 
              src={chat.worker.avatar} 
              alt={chat.worker.name}
              className="w-10 h-10 rounded-full flex-shrink-0"
            />
            <div className="min-w-0">
              <h3 className="font-semibold truncate">{chat.worker.name}</h3>
              <p className="text-sm opacity-90 truncate">{chat.worker.serviceType.name}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2 flex-shrink-0">
            <button className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors">
              <Phone className="w-4 h-4" />
            </button>
            <button className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors">
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
          {chat.messages.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">👋</span>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Start a conversation</h3>
              <p className="text-gray-500">Send a message to {chat.worker.name} to get started</p>
            </div>
          ) : (
            <div className="space-y-4">
              {chat.messages.map((message, index) => {
                const isUser = message.senderId === 'user';
                const showDate = index === 0 || 
                  formatDate(message.timestamp) !== formatDate(chat.messages[index - 1].timestamp);

                return (
                  <div key={message.id}>
                    {showDate && (
                      <div className="text-center mb-4">
                        <span className="bg-white px-3 py-1 rounded-full text-xs text-gray-500 shadow-sm">
                          {formatDate(message.timestamp)}
                        </span>
                      </div>
                    )}
                    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[75%] px-4 py-2 rounded-2xl ${
                        isUser 
                          ? 'bg-orange-600 text-white' 
                          : 'bg-white text-gray-900 border border-gray-200'
                      }`}>
                        <p className="text-sm break-words">{message.content}</p>
                        <p className={`text-xs mt-1 ${
                          isUser ? 'text-orange-100' : 'text-gray-500'
                        }`}>
                          {formatTime(message.timestamp)}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Message Input */}
        <div className="p-4 border-t border-gray-100 bg-white flex-shrink-0">
          <div className="flex items-end space-x-3">
            <div className="flex-1 relative">
              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type a message..."
                className="w-full p-3 pr-12 border border-gray-300 rounded-2xl resize-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                rows={1}
                style={{ 
                  minHeight: '44px', 
                  maxHeight: '120px',
                  overflowY: 'auto'
                }}
              />
            </div>
            <button
              onClick={handleSendMessage}
              disabled={!newMessage.trim()}
              className="p-3 bg-orange-600 text-white rounded-2xl hover:bg-orange-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex-shrink-0"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}; 