import { ServiceWorker, ServiceType, JobRequest, Bid, Chat, Message, BidNotification } from '../types';

export const mockUser = {
  id: '1',
  name: 'Yacine Benali',
  email: 'yacine.benali@gmail.com',
  phone: '+213 555 123 456',
  avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150',
  createdAt: new Date()
};

export const serviceTypes: ServiceType[] = [
  { id: 'plumber', name: 'Plumber', icon: '🪠', color: '#3B82F6', description: 'Plumbing repairs and installations' },
  { id: 'electrician', name: 'Electrician', icon: '⚡', color: '#EAB308', description: 'Electrical work and repairs' },
  { id: 'cleaner', name: 'Cleaning', icon: '🧹', color: '#10B981', description: 'Home and office cleaning' },
  { id: 'mechanic', name: 'Mechanic', icon: '🔧', color: '#F59E0B', description: 'Auto repair and maintenance' },
  { id: 'carpenter', name: 'Carpenter', icon: '🪚', color: '#8B5CF6', description: 'Woodwork and furniture' },
  { id: 'painter', name: 'Painter', icon: '🎨', color: '#EC4899', description: 'Interior and exterior painting' },
];

export const mockWorkers: ServiceWorker[] = [
  {
    id: '1',
    name: 'Ahmed Benali',
    avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150',
    phone: '+213 555 123 456',
    serviceType: serviceTypes[0],
    rating: 4.8,
    reviewCount: 127,
    hourlyRate: 2500,
    distance: 0.8,
    isOnline: true,
    location: { lat: 36.7392, lng: 3.0889 },
    completedJobs: 89,
    responseTime: '< 5 min'
  },
  {
    id: '2',
    name: 'Fatima Kadri',
    avatar: 'https://images.pexels.com/photos/3756681/pexels-photo-3756681.jpeg?auto=compress&cs=tinysrgb&w=150',
    phone: '+213 555 234 567',
    serviceType: serviceTypes[2],
    rating: 4.9,
    reviewCount: 89,
    hourlyRate: 2000,
    distance: 1.2,
    isOnline: true,
    location: { lat: 36.7352, lng: 3.0849 },
    completedJobs: 156,
    responseTime: '< 3 min'
  },
  {
    id: '3',
    name: 'Karim Messaoud',
    avatar: 'https://images.pexels.com/photos/1674752/pexels-photo-1674752.jpeg?auto=compress&cs=tinysrgb&w=150',
    phone: '+213 555 345 678',
    serviceType: serviceTypes[1],
    rating: 4.7,
    reviewCount: 203,
    hourlyRate: 3000,
    distance: 2.1,
    isOnline: true,
    location: { lat: 36.7412, lng: 3.0829 },
    completedJobs: 234,
    responseTime: '< 10 min'
  },
  {
    id: '4',
    name: 'Nadia Boumediene',
    avatar: 'https://images.pexels.com/photos/3785077/pexels-photo-3785077.jpeg?auto=compress&cs=tinysrgb&w=150',
    phone: '+213 555 456 789',
    serviceType: serviceTypes[5],
    rating: 4.6,
    reviewCount: 67,
    hourlyRate: 2200,
    distance: 1.8,
    isOnline: false,
    location: { lat: 36.7332, lng: 3.0909 },
    completedJobs: 45,
    responseTime: '< 15 min'
  },
  {
    id: '5',
    name: 'Omar Tarek',
    avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150',
    phone: '+213 555 567 890',
    serviceType: serviceTypes[3],
    rating: 4.5,
    reviewCount: 98,
    hourlyRate: 2800,
    distance: 0.5,
    isOnline: true,
    location: { lat: 36.7372, lng: 3.0869 },
    completedJobs: 123,
    responseTime: '< 8 min'
  },
  {
    id: '6',
    name: 'Leila Mansouri',
    avatar: 'https://images.pexels.com/photos/3756681/pexels-photo-3756681.jpeg?auto=compress&cs=tinysrgb&w=150',
    phone: '+213 555 678 901',
    serviceType: serviceTypes[4],
    rating: 4.9,
    reviewCount: 145,
    hourlyRate: 2400,
    distance: 1.5,
    isOnline: true,
    location: { lat: 36.7432, lng: 3.0849 },
    completedJobs: 178,
    responseTime: '< 6 min'
  }
];

export const mockBids: Bid[] = [
  {
    id: '1',
    workerId: '1',
    worker: mockWorkers[0],
    jobId: 'job-1',
    price: 8000,
    message: 'I can fix your plumbing issue today. I have 5+ years experience with similar problems.',
    estimatedArrival: '30 minutes',
    submittedAt: new Date(Date.now() - 5 * 60 * 1000),
    status: 'pending'
  },
  {
    id: '2',
    workerId: '3',
    worker: mockWorkers[2],
    jobId: 'job-1',
    price: 7500,
    message: 'Professional electrician available now. Free diagnosis included.',
    estimatedArrival: '45 minutes',
    submittedAt: new Date(Date.now() - 8 * 60 * 1000),
    status: 'pending'
  }
];

export const mockMessages: Message[] = [
  {
    id: '1',
    senderId: '1',
    senderName: 'Ahmed Benali',
    senderAvatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150',
    content: 'Hello! I can help you with your plumbing issue. When would you like me to come?',
    timestamp: new Date(Date.now() - 30 * 60 * 1000),
    isRead: true,
    type: 'text'
  },
  {
    id: '2',
    senderId: 'user',
    senderName: 'You',
    senderAvatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150',
    content: 'Hi Ahmed! I have a leaky faucet in my kitchen. Can you come today?',
    timestamp: new Date(Date.now() - 25 * 60 * 1000),
    isRead: true,
    type: 'text'
  },
  {
    id: '3',
    senderId: '1',
    senderName: 'Ahmed Benali',
    senderAvatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150',
    content: 'Of course! I can be there in 30 minutes. What\'s your address?',
    timestamp: new Date(Date.now() - 20 * 60 * 1000),
    isRead: true,
    type: 'text'
  },
  {
    id: '4',
    senderId: 'user',
    senderName: 'You',
    senderAvatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150',
    content: 'Great! I\'m at 123 Rue Didouche Mourad, Algiers. How much will it cost?',
    timestamp: new Date(Date.now() - 15 * 60 * 1000),
    isRead: true,
    type: 'text'
  },
  {
    id: '5',
    senderId: '1',
    senderName: 'Ahmed Benali',
    senderAvatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150',
    content: 'For a leaky faucet repair, it will be around 5000-8000 DA depending on the parts needed. I\'ll give you a precise quote when I see the issue.',
    timestamp: new Date(Date.now() - 10 * 60 * 1000),
    isRead: false,
    type: 'text'
  }
];

export const mockChats: Chat[] = [
  {
    id: 'chat-1',
    workerId: '1',
    worker: mockWorkers[0],
    messages: mockMessages,
    lastMessage: mockMessages[mockMessages.length - 1],
    unreadCount: 1,
    createdAt: new Date(Date.now() - 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 10 * 60 * 1000)
  },
  {
    id: 'chat-2',
    workerId: '2',
    worker: mockWorkers[1],
    messages: [
      {
        id: '6',
        senderId: '2',
        senderName: 'Fatima Kadri',
        senderAvatar: 'https://images.pexels.com/photos/3756681/pexels-photo-3756681.jpeg?auto=compress&cs=tinysrgb&w=150',
        content: 'Hello! I\'m available for cleaning services. What do you need?',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        isRead: true,
        type: 'text'
      }
    ],
    lastMessage: {
      id: '6',
      senderId: '2',
      senderName: 'Fatima Kadri',
      senderAvatar: 'https://images.pexels.com/photos/3756681/pexels-photo-3756681.jpeg?auto=compress&cs=tinysrgb&w=150',
      content: 'Hello! I\'m available for cleaning services. What do you need?',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      isRead: true,
      type: 'text'
    },
    unreadCount: 0,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000)
  }
];

export const mockBidNotifications: BidNotification[] = [
  {
    id: 'notification-1',
    bid: mockBids[0],
    timestamp: new Date(Date.now() - 5 * 60 * 1000),
    isRead: false
  },
  {
    id: 'notification-2',
    bid: mockBids[1],
    timestamp: new Date(Date.now() - 10 * 60 * 1000),
    isRead: true
  }
];