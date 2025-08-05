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
    serviceType: serviceTypes[0], // Plumber
    rating: 4.8,
    reviewCount: 127,
    hourlyRate: 2500,
    distance: 1.2,
    isOnline: true,
    region: 'Alger',
    location: {
      lat: 36.7372,
      lng: 3.0869
    },
    completedJobs: 89,
    responseTime: '< 5 min'
  },
  {
    id: '2',
    name: 'Mohammed Zerrouki',
    avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150',
    phone: '+213 555 234 567',
    serviceType: serviceTypes[1], // Electrician
    rating: 4.9,
    reviewCount: 203,
    hourlyRate: 3000,
    distance: 2.1,
    isOnline: true,
    region: 'Oran',
    location: {
      lat: 35.6971,
      lng: -0.6337
    },
    completedJobs: 156,
    responseTime: '< 10 min'
  },
  {
    id: '3',
    name: 'Karim Boudiaf',
    avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150',
    phone: '+213 555 345 678',
    serviceType: serviceTypes[2], // Carpenter
    rating: 4.7,
    reviewCount: 94,
    hourlyRate: 2200,
    distance: 3.5,
    isOnline: false,
    region: 'Constantine',
    location: {
      lat: 36.3650,
      lng: 6.6147
    },
    completedJobs: 67,
    responseTime: '< 15 min'
  },
  {
    id: '4',
    name: 'Ali Mansouri',
    avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150',
    phone: '+213 555 456 789',
    serviceType: serviceTypes[3], // Painter
    rating: 4.6,
    reviewCount: 78,
    hourlyRate: 1800,
    distance: 4.2,
    isOnline: true,
    region: 'Blida',
    location: {
      lat: 36.4701,
      lng: 2.8287
    },
    completedJobs: 45,
    responseTime: '< 20 min'
  },
  {
    id: '5',
    name: 'Said Hamidi',
    avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150',
    phone: '+213 555 567 890',
    serviceType: serviceTypes[4], // HVAC Technician
    rating: 4.9,
    reviewCount: 112,
    hourlyRate: 3500,
    distance: 1.8,
    isOnline: true,
    region: 'Annaba',
    location: {
      lat: 36.9000,
      lng: 7.7667
    },
    completedJobs: 98,
    responseTime: '< 8 min'
  },
  {
    id: '6',
    name: 'Youssef Khelifi',
    avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150',
    phone: '+213 555 678 901',
    serviceType: serviceTypes[5], // Gardener
    rating: 4.5,
    reviewCount: 56,
    hourlyRate: 1500,
    distance: 5.1,
    isOnline: false,
    region: 'Tizi Ouzou',
    location: {
      lat: 36.7167,
      lng: 4.0500
    },
    completedJobs: 34,
    responseTime: '< 25 min'
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
    id: 'msg-1',
    senderId: 'user',
    senderName: 'You',
    senderAvatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150',
    content: 'Hi Ahmed, I need help with a plumbing issue in my kitchen. The sink is leaking.',
    timestamp: new Date(Date.now() - 30 * 60 * 1000),
    isRead: true,
    type: 'text'
  },
  {
    id: 'msg-2',
    senderId: 'worker-1',
    senderName: 'Ahmed Benali',
    senderAvatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150',
    content: 'Hello! I can help you with that. What type of leak is it? Is it under the sink or around the faucet?',
    timestamp: new Date(Date.now() - 25 * 60 * 1000),
    isRead: true,
    type: 'text'
  },
  {
    id: 'msg-3',
    senderId: 'user',
    senderName: 'You',
    senderAvatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150',
    content: 'It\'s under the sink, water is dripping from the pipe connection.',
    timestamp: new Date(Date.now() - 20 * 60 * 1000),
    isRead: true,
    type: 'text'
  },
  {
    id: 'msg-4',
    senderId: 'worker-1',
    senderName: 'Ahmed Benali',
    senderAvatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150',
    content: 'I understand. This is usually a simple fix. I can come today at 2 PM. How does that work for you?',
    timestamp: new Date(Date.now() - 15 * 60 * 1000),
    isRead: true,
    type: 'text'
  },
  {
    id: 'msg-5',
    senderId: 'user',
    senderName: 'You',
    senderAvatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150',
    content: 'Perfect! 2 PM works great. What should I expect for the cost?',
    timestamp: new Date(Date.now() - 10 * 60 * 1000),
    isRead: false,
    type: 'text'
  },
  {
    id: 'msg-6',
    senderId: 'worker-1',
    senderName: 'Ahmed Benali',
    senderAvatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150',
    content: 'For a simple pipe connection fix, it should be around 2000-3000 DA. I\'ll give you the exact price after I see the issue.',
    timestamp: new Date(Date.now() - 5 * 60 * 1000),
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
    unreadCount: 2,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 5 * 60 * 1000)
  },
  {
    id: 'chat-2',
    workerId: '2',
    worker: mockWorkers[1],
    messages: [
      {
        id: 'msg-7',
        senderId: 'user',
        senderName: 'You',
        senderAvatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150',
        content: 'Hi Mohammed, I need electrical work done in my living room.',
        timestamp: new Date(Date.now() - 60 * 60 * 1000),
        isRead: true,
        type: 'text'
      },
      {
        id: 'msg-8',
        senderId: 'worker-2',
        senderName: 'Mohammed Zerrouki',
        senderAvatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150',
        content: 'Hello! I\'m available for electrical work. What specifically do you need?',
        timestamp: new Date(Date.now() - 55 * 60 * 1000),
        isRead: true,
        type: 'text'
      },
      {
        id: 'msg-9',
        senderId: 'user',
        senderName: 'You',
        senderAvatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150',
        content: 'I need a new outlet installed for my TV.',
        timestamp: new Date(Date.now() - 50 * 60 * 1000),
        isRead: true,
        type: 'text'
      }
    ],
    lastMessage: {
      id: 'msg-9',
      senderId: 'user',
      senderName: 'You',
      senderAvatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150',
      content: 'I need a new outlet installed for my TV.',
      timestamp: new Date(Date.now() - 50 * 60 * 1000),
      isRead: true,
      type: 'text'
    },
    unreadCount: 0,
    createdAt: new Date(Date.now() - 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 50 * 60 * 1000)
  },
  {
    id: 'chat-3',
    workerId: '4',
    worker: mockWorkers[3],
    messages: [
      {
        id: 'msg-10',
        senderId: 'worker-4',
        senderName: 'Ali Mansouri',
        senderAvatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150',
        content: 'Hi! I saw your job posting for painting. I\'m available this weekend.',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
        isRead: true,
        type: 'text'
      }
    ],
    lastMessage: {
      id: 'msg-10',
      senderId: 'worker-4',
      senderName: 'Ali Mansouri',
      senderAvatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150',
      content: 'Hi! I saw your job posting for painting. I\'m available this weekend.',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
      isRead: true,
      type: 'text'
    },
    unreadCount: 0,
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000)
  }
];

export const mockBidNotifications: BidNotification[] = [
  {
    id: 'notification-1',
    bid: {
      id: 'bid-1',
      workerId: '1',
      worker: mockWorkers[0],
      jobId: 'job-1',
      price: 4500,
      message: 'I can help you with this job. I have experience with similar work.',
      estimatedArrival: '< 30 min',
      submittedAt: new Date(Date.now() - 30 * 60 * 1000),
      status: 'pending'
    },
    timestamp: new Date(Date.now() - 30 * 60 * 1000),
    isRead: false
  },
  {
    id: 'notification-2',
    bid: {
      id: 'bid-2',
      workerId: '2',
      worker: mockWorkers[1],
      jobId: 'job-1',
      price: 5200,
      message: 'Professional service available. I have the right tools and experience.',
      estimatedArrival: '< 45 min',
      submittedAt: new Date(Date.now() - 25 * 60 * 1000),
      status: 'pending'
    },
    timestamp: new Date(Date.now() - 25 * 60 * 1000),
    isRead: false
  },
  {
    id: 'notification-3',
    bid: {
      id: 'bid-3',
      workerId: '5',
      worker: mockWorkers[4],
      jobId: 'job-2',
      price: 2800,
      message: 'I can install the electrical outlet for you. Available today.',
      estimatedArrival: '< 1 hour',
      submittedAt: new Date(Date.now() - 15 * 60 * 1000),
      status: 'pending'
    },
    timestamp: new Date(Date.now() - 15 * 60 * 1000),
    isRead: false
  },
  {
    id: 'notification-4',
    bid: {
      id: 'bid-4',
      workerId: '3',
      worker: mockWorkers[2],
      jobId: 'job-2',
      price: 3200,
      message: 'Professional electrical work. I can start immediately.',
      estimatedArrival: '< 2 hours',
      submittedAt: new Date(Date.now() - 10 * 60 * 1000),
      status: 'pending'
    },
    timestamp: new Date(Date.now() - 10 * 60 * 1000),
    isRead: false
  },
  {
    id: 'notification-5',
    bid: {
      id: 'bid-5',
      workerId: '4',
      worker: mockWorkers[3],
      jobId: 'job-3',
      price: 1800,
      message: 'I can help with your painting job. Available this weekend.',
      estimatedArrival: '< 1 day',
      submittedAt: new Date(Date.now() - 5 * 60 * 1000),
      status: 'pending'
    },
    timestamp: new Date(Date.now() - 5 * 60 * 1000),
    isRead: false
  }
];

export const mockJobs: JobRequest[] = [
  {
    id: 'job-1',
    title: 'Fix kitchen sink leak',
    description: 'The kitchen sink has a leak under the cabinet. Need someone to fix it as soon as possible.',
    serviceType: serviceTypes[0], // Plumber
    budget: 5000,
    urgency: 'high',
    location: {
      lat: 36.7372,
      lng: 3.0869,
      address: 'Algiers, Algeria'
    },
    status: 'open',
    postedAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    bids: [
      {
        id: 'bid-1',
        workerId: '1',
        worker: mockWorkers[0],
        jobId: 'job-1',
        price: 4500,
        message: 'I can help you with this job. I have experience with similar work.',
        estimatedArrival: '< 30 min',
        submittedAt: new Date(Date.now() - 30 * 60 * 1000),
        status: 'pending'
      }
    ],
    visitorTime: {
      type: 'specific',
      startTime: '09:00',
      endTime: '17:00',
      preferredDate: '2024-12-15'
    },
    uploadedFiles: [
      {
        id: 'mock-file-1',
        file: new File([''], 'kitchen-sink.jpg', { type: 'image/jpeg' }),
        type: 'image' as const,
        preview: 'https://images.pexels.com/photos/3945683/pexels-photo-3945683.jpeg?auto=compress&cs=tinysrgb&w=800',
        name: 'kitchen-sink.jpg'
      },
      {
        id: 'mock-file-2',
        file: new File([''], 'leak-video.mp4', { type: 'video/mp4' }),
        type: 'video' as const,
        preview: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
        name: 'leak-video.mp4'
      }
    ]
  },
  {
    id: 'job-2',
    title: 'Install new electrical outlet',
    description: 'Need to install a new electrical outlet in the living room for the TV.',
    serviceType: serviceTypes[1], // Electrician
    budget: 3000,
    urgency: 'medium',
    location: {
      lat: 36.7372,
      lng: 3.0869,
      address: 'Algiers, Algeria'
    },
    status: 'in_progress',
    postedAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    acceptedBid: {
      id: 'bid-2',
      workerId: '2',
      worker: mockWorkers[1],
      jobId: 'job-2',
      price: 2800,
      message: 'Professional electrical work. I can start immediately.',
      estimatedArrival: '< 1 hour',
      submittedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      status: 'accepted'
    },
    visitorTime: {
      type: 'all_day',
      startTime: '08:00',
      endTime: '20:00'
    },
    uploadedFiles: [
      {
        id: 'mock-file-3',
        file: new File([''], 'electrical-outlet.jpg', { type: 'image/jpeg' }),
        type: 'image' as const,
        preview: 'https://images.pexels.com/photos/162553/pexels-photo-162553.jpeg?auto=compress&cs=tinysrgb&w=800',
        name: 'electrical-outlet.jpg'
      }
    ]
  }
];