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

export interface ServiceType {
  id: string;
  name: string;
  icon: string;
  color: string;
  description: string;
}

export type ViewMode = 'map' | 'post-job' | 'bids' | 'worker-profile';

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