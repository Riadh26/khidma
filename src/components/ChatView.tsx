import React, { useState, useRef, useEffect } from 'react';
import { Chat, Message } from '../types';
import { ArrowLeft, Send, Paperclip, Phone, MapPin } from 'lucide-react';

interface ChatViewProps {
  chat: Chat;
  onClose: () => void;
  onSendMessage: (content: string) => void;
  onCallWorker: (worker: any) => void;
}

export const ChatView: React.FC<ChatViewProps> = ({
  chat,
  onClose,
  onSendMessage,
  onCallWorker
}) => {
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chat.messages]);

  const handleSendMessage = () => {
    if (message.trim()) {
      onSendMessage(message.trim());
      setMessage('');
      setIsTyping(true);
      
      // Hide typing indicator after 2 seconds
      setTimeout(() => {
        setIsTyping(false);
      }, 2000);
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

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const formatDate = (date: Date) => {
    if (isToday(date)) {
      return 'Today';
    }
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    }
    return date.toLocaleDateString();
  };

  const groupedMessages = chat.messages.reduce((groups: any[], message) => {
    const date = formatDate(message.timestamp);
    const lastGroup = groups[groups.length - 1];
    
    if (lastGroup && lastGroup.date === date) {
      lastGroup.messages.push(message);
    } else {
      groups.push({ date, messages: [message] });
    }
    
    return groups;
  }, []);

  return (
    <div className="fixed inset-0 bg-white z-[9999] flex flex-col animate-slideInRight">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 shadow-lg">
        <div className="flex items-center justify-between">
          <button
            onClick={onClose}
            className="p-2 hover:bg-white hover:bg-opacity-20 rounded-xl transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          
          <div className="flex items-center space-x-3">
            <div className="relative">
              <img
                src={chat.worker.avatar}
                alt={chat.worker.name}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
                chat.worker.isOnline ? 'bg-green-500' : 'bg-gray-400'
              }`}></div>
            </div>
            <div>
              <h3 className="font-semibold">{chat.worker.name}</h3>
              <p className="text-xs text-blue-100">{chat.worker.serviceType.name}</p>
            </div>
          </div>
          
          <button
            onClick={() => onCallWorker(chat.worker)}
            className="p-2 hover:bg-white hover:bg-opacity-20 rounded-xl transition-colors"
          >
            <Phone className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto bg-gray-50 p-4">
        {groupedMessages.map((group, groupIndex) => (
          <div key={groupIndex} className="mb-6">
            <div className="flex justify-center mb-4">
              <span className="bg-gray-200 text-gray-600 text-xs px-3 py-1 rounded-full">
                {group.date}
              </span>
            </div>
            
            {group.messages.map((msg: Message) => (
              <div
                key={msg.id}
                className={`flex mb-4 animate-bounceIn ${msg.senderId === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-xs lg:max-w-md ${msg.senderId === 'user' ? 'order-2' : 'order-1'}`}>
                  {msg.senderId !== 'user' && (
                    <img
                      src={msg.senderAvatar}
                      alt={msg.senderName}
                      className="w-8 h-8 rounded-full object-cover mb-1"
                    />
                  )}
                </div>
                
                <div className={`max-w-xs lg:max-w-md ${msg.senderId === 'user' ? 'order-1' : 'order-2'}`}>
                  <div
                    className={`rounded-2xl px-4 py-3 message-bubble ${
                      msg.senderId === 'user'
                        ? 'bg-blue-600 text-white sent'
                        : 'bg-white text-gray-900 border border-gray-200 received'
                    }`}
                  >
                    <p className="text-sm">{msg.content}</p>
                    <p className={`text-xs mt-1 ${
                      msg.senderId === 'user' ? 'text-blue-100' : 'text-gray-500'
                    }`}>
                      {formatTime(msg.timestamp)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))}
        
        {/* Typing indicator */}
        {isTyping && (
          <div className="flex justify-start mb-4">
            <div className="max-w-xs lg:max-w-md order-2">
              <img
                src={chat.worker.avatar}
                alt={chat.worker.name}
                className="w-8 h-8 rounded-full object-cover mb-1"
              />
            </div>
            <div className="max-w-xs lg:max-w-md order-1">
              <div className="typing-indicator">
                <div className="typing-dot"></div>
                <div className="typing-dot"></div>
                <div className="typing-dot"></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="bg-white border-t border-gray-200 p-4 message-input">
        <div className="flex items-center space-x-3">
          <button className="p-2 text-gray-500 hover:text-blue-600 transition-colors">
            <Paperclip className="w-5 h-5" />
          </button>
          
          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              className="w-full bg-gray-100 rounded-2xl px-4 py-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
            />
          </div>
          
          <button
            onClick={handleSendMessage}
            disabled={!message.trim()}
            className={`p-3 rounded-full transition-all ${
              message.trim()
                ? 'bg-blue-600 text-white hover:bg-blue-700 hover-lift'
                : 'bg-gray-200 text-gray-400'
            }`}
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}; 