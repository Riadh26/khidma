export interface ServiceWorker {
  id: string;
  name: string;
  avatar: string;
  phone: string;
  serviceType: ServiceType;
  rating: number;
  reviewCount: number;
  hourlyRate: number;
  distance: number;
  isOnline: boolean;
  location: {
    lat: number;
    lng: number;
  };
  completedJobs: number;
  responseTime: string;
}

export interface JobRequest {
  id: string;
  title: string;
  description: string;
  serviceType: ServiceType;
  budget: number;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  images?: string[];
  urgency: 'low' | 'medium' | 'high';
  postedAt: Date;
  status: 'open' | 'in_progress' | 'completed' | 'cancelled';
  acceptedBid?: Bid;
  completedAt?: Date;
  review?: WorkerReview;
  bids?: Bid[];
}

export interface Bid {
  id: string;
  workerId: string;
  worker: ServiceWorker;
  jobId: string;
  price: number;
  message: string;
  estimatedArrival: string;
  submittedAt: Date;
  status: 'pending' | 'accepted' | 'rejected';
}

export interface WorkerReview {
  id: string;
  jobId: string;
  workerId: string;
  rating: number;
  comment: string;
  submittedAt: Date;
}

export interface ServiceType {
  id: string;
  name: string;
  icon: string;
  color: string;
  description: string;
}

export type ViewMode = 'map' | 'post-job' | 'bids' | 'worker-profile' | 'my-jobs';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  createdAt: Date;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
}

export interface BidNotification {
  id: string;
  bid: Bid;
  timestamp: Date;
  isRead: boolean;
}

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  content: string;
  timestamp: Date;
  isRead: boolean;
  type: 'text' | 'image' | 'location';
}

export interface Chat {
  id: string;
  workerId: string;
  worker: ServiceWorker;
  messages: Message[];
  lastMessage?: Message;
  unreadCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ChatState {
  chats: Chat[];
  activeChatId: string | null;
  isLoading: boolean;
}