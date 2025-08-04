import { ServiceWorker, ServiceType, JobRequest, Bid } from '../types';

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