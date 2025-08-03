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

  // Filter workers based on current job's service type
  useEffect(() => {
    if (currentJob) {
      setFilteredWorkers(mockWorkers.filter(worker => 
        worker.serviceType.id === currentJob.serviceType.id
      ));
    }
  }, [currentJob]);

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
    setCurrentJob(null);
    setSelectedService(null);
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
    setSelectedService(jobData.serviceType!);
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
        <div className="flex-1 overflow-y-auto min-h-0">
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
            {selectedService && (
              <div className="bg-blue-50 px-4 py-3 border-b border-blue-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">{selectedService.icon}</span>
                    <span className="font-medium text-blue-900">
                      Looking for {selectedService.name}
                    </span>
                  </div>
                  <button
                    onClick={() => setSelectedService(null)}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    Clear
                  </button>
                </div>
              </div>
            )}
            <MapView
              workers={filteredWorkers}
              onWorkerClick={handleWorkerClick}
              userLocation={{ lat: 36.7372, lng: 3.0869 }}
            />
            <div className="p-6 bg-white border-t border-gray-100">
              <button
                onClick={handlePostJobClick}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-5 px-6 rounded-2xl font-bold text-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105"
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
          <div className="flex flex-col flex-1 bg-gray-50 min-h-0 overflow-hidden">
            <div className="p-4 bg-white border-b border-gray-100">
              <button
                onClick={() => setViewMode('map')}
                className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors font-medium"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Map</span>
              </button>
            
              {currentJob && (
                <div className="mt-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
                  <h2 className="text-xl font-bold text-gray-900 mb-2">{currentJob.title}</h2>
                  <p className="text-gray-600 mb-3">{currentJob.description}</p>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span className="font-medium">Budget: {currentJob.budget.toLocaleString()} DA</span>
                    <span>•</span>
                    <span className="capitalize font-medium">{currentJob.urgency} priority</span>
                    <span>•</span>
                    <span className="font-medium">{currentJob.serviceType.name}</span>
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex-1 overflow-y-auto p-4">
              <BidsList
                bids={bids}
                onAcceptBid={handleAcceptBid}
                onMessageWorker={handleMessageFromBid}
              />
            </div>
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