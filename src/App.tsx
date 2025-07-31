import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { ServiceGrid } from './components/ServiceGrid';
import { MapView } from './components/MapView';
import { WorkerProfile } from './components/WorkerProfile';
import { JobPostForm } from './components/JobPostForm';
import { BidsList } from './components/BidsList';
import { AuthModal } from './components/AuthModal';
import { BidNotificationPopup } from './components/BidNotificationPopup';
import { serviceTypes, mockWorkers, mockBids, mockUser } from './data/mockData';
import { ServiceWorker, ServiceType, ViewMode, Bid, JobRequest, User, AuthState, BidNotification } from './types';
import { ArrowLeft, Bell } from 'lucide-react';

function App() {
  const [viewMode, setViewMode] = useState<ViewMode>('map');
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null
  });
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [selectedService, setSelectedService] = useState<ServiceType | null>(null);
  const [selectedWorker, setSelectedWorker] = useState<ServiceWorker | null>(null);
  const [filteredWorkers, setFilteredWorkers] = useState<ServiceWorker[]>(mockWorkers);
  const [bids, setBids] = useState<Bid[]>(mockBids);
  const [currentJob, setCurrentJob] = useState<JobRequest | null>(null);
  const [notificationCount, setNotificationCount] = useState(2);
  const [bidNotifications, setBidNotifications] = useState<BidNotification[]>([]);
  const [currentBidNotification, setCurrentBidNotification] = useState<Bid | null>(null);

  useEffect(() => {
    if (selectedService) {
      setFilteredWorkers(mockWorkers.filter(worker => 
        worker.serviceType.id === selectedService.id
      ));
    } else {
      setFilteredWorkers(mockWorkers);
    }
  }, [selectedService]);

  const handleLogin = (email: string, password: string) => {
    // Mock login - in real app, this would call an API
    setAuthState({
      isAuthenticated: true,
      user: mockUser
    });
    setShowAuthModal(false);
  };

  const handleRegister = (name: string, email: string, phone: string, password: string) => {
    // Mock registration - in real app, this would call an API
    const newUser: User = {
      id: Date.now().toString(),
      name,
      email,
      phone,
      createdAt: new Date()
    };
    setAuthState({
      isAuthenticated: true,
      user: newUser
    });
    setShowAuthModal(false);
  };

  const handleLogout = () => {
    setAuthState({
      isAuthenticated: false,
      user: null
    });
    setViewMode('map');
  };

  const handleWorkerClick = (worker: ServiceWorker) => {
    if (!authState.isAuthenticated) {
      setShowAuthModal(true);
      return;
    }
    setSelectedWorker(worker);
  };

  const handleServiceSelect = (service: ServiceType) => {
    if (!authState.isAuthenticated) {
      setShowAuthModal(true);
      return;
    }
    setSelectedService(service);
    setViewMode('map');
  };

  const handleJobPost = (jobData: Partial<JobRequest>) => {
    if (!authState.isAuthenticated) {
      setShowAuthModal(true);
      return;
    }
    
    const newJob: JobRequest = {
      id: `job-${Date.now()}`,
      title: jobData.title!,
      description: jobData.description!,
      serviceType: jobData.serviceType!,
      budget: jobData.budget!,
      location: jobData.location!,
      urgency: jobData.urgency!,
      postedAt: new Date(),
      status: 'open'
    };
    setCurrentJob(newJob);
    setViewMode('bids');
    
    // Simulate new bids coming in with popup notifications
    setTimeout(() => {
      const newBid = mockBids[0];
      setCurrentBidNotification(newBid);
      setNotificationCount(prev => prev + 1);
      
      const notification: BidNotification = {
        id: Date.now().toString(),
        bid: newBid,
        timestamp: new Date(),
        isRead: false
      };
      setBidNotifications(prev => [notification, ...prev]);
    }, 3000);
  };

  const handlePostJobClick = () => {
    if (!authState.isAuthenticated) {
      setShowAuthModal(true);
      return;
    }
    setViewMode('post-job');
  };

  const handleAcceptBid = (bid: Bid) => {
    setBids(bids.map(b => 
      b.id === bid.id 
        ? { ...b, status: 'accepted' as const }
        : { ...b, status: 'rejected' as const }
    ));
    alert(`Bid accepted! ${bid.worker.name} will contact you shortly.`);
  };

  const handleContactWorker = (worker: ServiceWorker) => {
    alert(`Calling ${worker.name}...`);
  };

  const handleMessageWorker = (worker: ServiceWorker) => {
    alert(`Opening chat with ${worker.name}...`);
  };

  const handleMessageFromBid = (bid: Bid) => {
    alert(`Opening chat with ${bid.worker.name}...`);
  };

  const renderCurrentView = () => {
    if (!authState.isAuthenticated) {
      return (
        <div className="flex-1 overflow-y-auto">
          <ServiceGrid
            services={serviceTypes}
            onServiceSelect={handleServiceSelect}
          />
        </div>
      );
    }

    switch (viewMode) {
      case 'map':
        return (
          <div className="flex flex-col flex-1 min-h-0">
            <MapView
              workers={filteredWorkers}
              onWorkerClick={handleWorkerClick}
              userLocation={{ lat: 36.7372, lng: 3.0869 }}
            />
            <div className="p-4 bg-white border-t border-gray-100">
              <button
                onClick={handlePostJobClick}
                className="w-full bg-blue-600 text-white py-4 px-6 rounded-2xl font-semibold text-lg hover:bg-blue-700 transition-colors shadow-lg"
              >
                🔍 Post a Job Request
              </button>
            </div>
          </div>
        );
      
      case 'post-job':
        return (
          <JobPostForm
            services={serviceTypes}
            onClose={() => setViewMode('map')}
            onSubmit={handleJobPost}
          />
        );
      
      case 'bids':
        return (
          <div className="flex flex-col flex-1 bg-gray-50 min-h-0">
            <div className="mb-4">
              <button
                onClick={() => setViewMode('map')}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Map</span>
              </button>
            </div>
            
            {currentJob && (
              <div className="bg-white rounded-lg p-4 mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-2">{currentJob.title}</h2>
                <p className="text-gray-600 mb-2">{currentJob.description}</p>
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <span>Budget: {currentJob.budget.toLocaleString()} DA</span>
                  <span>•</span>
                  <span className="capitalize">{currentJob.urgency} priority</span>
                  <span>•</span>
                  <span>{currentJob.serviceType.name}</span>
                </div>
              </div>
            )}
            
            <BidsList
              bids={bids}
              onAcceptBid={handleAcceptBid}
              onMessageWorker={handleMessageFromBid}
            />
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50 overflow-hidden">
      <Header
        user={authState.user}
        isAuthenticated={authState.isAuthenticated}
        onNotificationClick={() => setViewMode('bids')}
        onAuthClick={() => setShowAuthModal(true)}
        onLogout={handleLogout}
        notificationCount={notificationCount}
      />
      
      {renderCurrentView()}
      
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onLogin={handleLogin}
        onRegister={handleRegister}
      />
      
      <BidNotificationPopup
        bid={currentBidNotification}
        onClose={() => setCurrentBidNotification(null)}
        onView={() => setViewMode('bids')}
      />
      
      {selectedWorker && (
        <WorkerProfile
          worker={selectedWorker}
          onClose={() => setSelectedWorker(null)}
          onContact={handleContactWorker}
          onMessage={handleMessageWorker}
        />
      )}
    </div>
  );
}

export default App;