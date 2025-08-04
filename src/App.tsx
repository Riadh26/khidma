import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { RealMapView } from './components/RealMapView';
import { JobPostForm } from './components/JobPostForm';
import { BidsList } from './components/BidsList';
import { AuthModal } from './components/AuthModal';
import { BidNotificationPopup } from './components/BidNotificationPopup';
import { WorkerProfile } from './components/WorkerProfile';
import { ChatList } from './components/ChatList';
import { ChatView } from './components/ChatView';
import { NotificationsOverlay } from './components/NotificationsOverlay';
import { MyJobs } from './components/MyJobs';
import { ServiceWorker, ServiceType, JobRequest, Bid, BidNotification, User, AuthState, Message, Chat, WorkerReview } from './types';
import { serviceTypes, mockWorkers, mockBids, mockBidNotifications, mockMessages, mockChats } from './data/mockData';
import { ArrowLeft } from 'lucide-react';
import { Star, Clock } from 'lucide-react';

function App() {
  const [authState, setAuthState] = useState<AuthState>(() => {
    const saved = localStorage.getItem('authState');
    return saved ? JSON.parse(saved) : { isAuthenticated: false, user: null };
  });

  const [viewMode, setViewMode] = useState<'map' | 'post-job' | 'bids' | 'worker-profile' | 'my-jobs'>('map');
  const [selectedService, setSelectedService] = useState<ServiceType | null>(null);
  const [selectedWorker, setSelectedWorker] = useState<ServiceWorker | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [currentBidNotification, setCurrentBidNotification] = useState<BidNotification | null>(null);
  const [currentJob, setCurrentJob] = useState<JobRequest | null>(null);
  const [bids, setBids] = useState<Bid[]>(mockBids);
  const [bidNotifications, setBidNotifications] = useState<BidNotification[]>(mockBidNotifications);
  const [notificationCount, setNotificationCount] = useState(3);
  const [chats, setChats] = useState<Chat[]>(mockChats);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [showChatList, setShowChatList] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMyJobs, setShowMyJobs] = useState(false);
  const [userJobs, setUserJobs] = useState<JobRequest[]>([]);
  const [newBidNotification, setNewBidNotification] = useState<{
    bid: Bid;
    jobId: string;
    timeLeft: number;
    isVisible: boolean;
  } | null>(null);

  // Ensure app starts with correct state
  useEffect(() => {
    // Clear any problematic localStorage data for fresh start
    localStorage.removeItem('showMyJobs');
    localStorage.removeItem('authState');
    setShowMyJobs(false);
    setViewMode('map');
    setAuthState({ isAuthenticated: false, user: null });
    console.log('App initialized - showMyJobs should be false');
  }, []);

  // Debug useEffect to track showMyJobs changes
  useEffect(() => {
    console.log('showMyJobs changed to:', showMyJobs);
  }, [showMyJobs]);

  // Filter workers based on selected service
  const filteredWorkers = selectedService 
    ? mockWorkers.filter(worker => worker.serviceType.id === selectedService.id)
    : mockWorkers;

  const handleLogin = (email: string, password: string) => {
    const user: User = {
      id: 'user-1',
      name: 'John Doe',
      email,
      phone: '+213 123 456 789',
      avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150',
      createdAt: new Date()
    };
    
    const newAuthState = { isAuthenticated: true, user };
    setAuthState(newAuthState);
    localStorage.setItem('authState', JSON.stringify(newAuthState));
    setShowAuthModal(false);
  };

  const handleRegister = (name: string, email: string, phone: string, password: string) => {
    const user: User = {
      id: 'user-1',
      name,
      email,
      phone,
      avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150',
      createdAt: new Date()
    };
    
    const newAuthState = { isAuthenticated: true, user };
    setAuthState(newAuthState);
    localStorage.setItem('authState', JSON.stringify(newAuthState));
    setShowAuthModal(false);
  };

  const handleLogout = () => {
    const newAuthState = { isAuthenticated: false, user: null };
    setAuthState(newAuthState);
    localStorage.setItem('authState', JSON.stringify(newAuthState));
  };

  const handleWorkerClick = (worker: ServiceWorker) => {
    setSelectedWorker(worker);
  };

  const handleServiceSelect = (service: ServiceType) => {
    setSelectedService(service);
  };

  const handleFilterClick = () => {
    setShowFilter(!showFilter);
  };

  const handleNotificationClick = () => {
    setShowNotifications(!showNotifications);
  };

  const handleJobPost = (jobData: Partial<JobRequest>) => {
    const newJob: JobRequest = {
      id: `job-${Date.now()}`,
      title: jobData.title || 'New Job',
      description: jobData.description || 'Job description',
      serviceType: jobData.serviceType || serviceTypes[0],
      budget: jobData.budget || 10000,
      location: jobData.location || { lat: 36.7372, lng: 3.0869, address: 'Algiers, Algeria' },
      images: jobData.images || [],
      urgency: jobData.urgency || 'medium',
      postedAt: new Date(),
      status: 'open',
      // Add mock bids to the job automatically
      bids: [
        {
          id: `bid-${Date.now()}-1`,
          workerId: '1',
          worker: mockWorkers[0],
          jobId: `job-${Date.now()}`,
          price: Math.floor(jobData.budget! * 0.8), // 80% of budget
          message: 'I can help you with this job. I have experience in this field and can start immediately.',
          estimatedArrival: '< 30 min',
          submittedAt: new Date(Date.now() - 2 * 60 * 1000),
          status: 'pending'
        },
        {
          id: `bid-${Date.now()}-2`,
          workerId: '3',
          worker: mockWorkers[2],
          jobId: `job-${Date.now()}`,
          price: Math.floor(jobData.budget! * 0.9), // 90% of budget
          message: 'Professional service available. I have the right tools and experience for this type of work.',
          estimatedArrival: '< 45 min',
          submittedAt: new Date(Date.now() - 5 * 60 * 1000),
          status: 'pending'
        }
      ]
    };
    
    setUserJobs(prev => [...prev, newJob]);
    setViewMode('map');
    
    // Show temporary bid notifications with countdown
    setTimeout(() => {
      showTemporaryBidNotification(newJob.bids![0], newJob.id);
    }, 2000);
    
    setTimeout(() => {
      showTemporaryBidNotification(newJob.bids![1], newJob.id);
    }, 5000);
    
    // Simulate bid notifications
    setTimeout(() => {
      setNotificationCount(prev => prev + 2);
      setBidNotifications(prev => [
        {
          id: `notification-${Date.now()}`,
          bid: newJob.bids![0],
          timestamp: new Date(),
          isRead: false
        },
        {
          id: `notification-${Date.now() + 1}`,
          bid: newJob.bids![1],
          timestamp: new Date(Date.now() - 3 * 60 * 1000),
          isRead: false
        },
        ...prev
      ]);
    }, 1000);
  };

  const showTemporaryBidNotification = (bid: Bid, jobId: string) => {
    setNewBidNotification({
      bid,
      jobId,
      timeLeft: 30, // 30 seconds countdown
      isVisible: true
    });

    // Start countdown timer
    const timer = setInterval(() => {
      setNewBidNotification(prev => {
        if (!prev) return null;
        
        if (prev.timeLeft <= 1) {
          clearInterval(timer);
          return { ...prev, isVisible: false };
        }
        
        return { ...prev, timeLeft: prev.timeLeft - 1 };
      });
    }, 1000);
  };

  const handlePostJobClick = () => {
    setViewMode('post-job');
  };

  const handleAcceptBid = (jobId: string, bid: Bid) => {
    // Update bid status
    setBids(prev => prev.map(b => 
      b.id === bid.id ? { ...b, status: 'accepted' } : b
    ));
    
    // Update job status to in_progress and set acceptedBid
    setUserJobs(prev => prev.map(job => 
      job.id === jobId 
        ? { 
            ...job, 
            status: 'in_progress', 
            acceptedBid: bid,
            // Remove the bid from bids array since it's now accepted
            bids: job.bids?.filter(b => b.id !== bid.id) || []
          }
        : job
    ));
    
    // Close any open dialogs
    setShowNotifications(false);
    setShowMyJobs(false);
    
    // Show success message with more details
    alert(`✅ Bid Accepted Successfully!

👷 Worker: ${bid.worker.name}
💰 Price: ${bid.price.toLocaleString()} DA
⏰ ETA: ${bid.estimatedArrival}

The worker will contact you shortly to arrange the job.`);
  };

  // Wrapper function for BidsList component
  const handleAcceptBidFromBidsList = (bid: Bid) => {
    // For BidsList, we need to find the job ID from the bid
    const jobId = bid.jobId;
    handleAcceptBid(jobId, bid);
  };

  const handleAcceptBidFromMyJobs = (jobId: string, bid: Bid) => {
    // Update bid status
    setBids(prev => prev.map(b => 
      b.id === bid.id ? { ...b, status: 'accepted' } : b
    ));
    
    // Update job status to in_progress and set acceptedBid
    setUserJobs(prev => prev.map(job => 
      job.id === jobId 
        ? { 
            ...job, 
            status: 'in_progress', 
            acceptedBid: bid,
            // Remove the bid from bids array since it's now accepted
            bids: job.bids?.filter(b => b.id !== bid.id) || []
          }
        : job
    ));
    
    // Close any open dialogs
    setShowNotifications(false);
    setShowMyJobs(false);
    
    // Show success message with more details
    alert(`✅ Bid Accepted Successfully!

👷 Worker: ${bid.worker.name}
💰 Price: ${bid.price.toLocaleString()} DA
⏰ ETA: ${bid.estimatedArrival}

The worker will contact you shortly to arrange the job.`);
  };

  const handleMarkCompleted = (jobId: string) => {
    setUserJobs(prev => prev.map(job => 
      job.id === jobId 
        ? { ...job, status: 'completed', completedAt: new Date() }
        : job
    ));
    
    alert('Job marked as completed! Please review the worker.');
  };

  const handleReviewWorker = (jobId: string, review: WorkerReview) => {
    setUserJobs(prev => prev.map(job => 
      job.id === jobId 
        ? { ...job, review }
        : job
    ));
    
    alert('Review submitted successfully!');
  };

  const handleContactWorker = (worker: ServiceWorker) => {
    alert(`Calling ${worker.name}...`);
  };

  const handleMessageWorker = (worker: ServiceWorker) => {
    // Find existing chat or create new one
    let chat = chats.find(c => c.workerId === worker.id);
    
    if (!chat) {
      // Create a welcome message for new chats
      const welcomeMessage: Message = {
        id: Date.now().toString(),
        senderId: worker.id,
        senderName: worker.name,
        senderAvatar: worker.avatar,
        content: `Hello! I'm ${worker.name}, your ${worker.serviceType.name}. How can I help you today?`,
        timestamp: new Date(),
        isRead: false,
        type: 'text'
      };
      
      chat = {
        id: `chat-${Date.now()}`,
        workerId: worker.id,
        worker: worker,
        messages: [welcomeMessage],
        lastMessage: welcomeMessage,
        unreadCount: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      setChats(prev => [...prev, chat!]);
    }
    
    setActiveChatId(chat.id);
    setShowChatList(false);
    setSelectedWorker(null); // Close the worker profile
  };

  const handleMessageFromBid = (bid: Bid) => {
    handleMessageWorker(bid.worker);
  };

  const handleSendMessage = (content: string) => {
    if (!activeChatId) return;
    
    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: 'user',
      senderName: 'You',
      senderAvatar: authState.user?.avatar || 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150',
      content,
      timestamp: new Date(),
      isRead: false,
      type: 'text'
    };
    
    setChats(prev => prev.map(chat => 
      chat.id === activeChatId 
        ? {
            ...chat,
            messages: [...chat.messages, newMessage],
            lastMessage: newMessage,
            updatedAt: new Date()
          }
        : chat
    ));
    
    // Simulate worker response after 2 seconds
    setTimeout(() => {
      const activeChat = chats.find(c => c.id === activeChatId);
      if (activeChat) {
        const workerResponse: Message = {
          id: (Date.now() + 1).toString(),
          senderId: activeChat.workerId,
          senderName: activeChat.worker.name,
          senderAvatar: activeChat.worker.avatar,
          content: `Thanks for your message! I'll get back to you soon about your ${activeChat.worker.serviceType.name} request.`,
          timestamp: new Date(),
          isRead: false,
          type: 'text'
        };
        
        setChats(prev => prev.map(chat => 
          chat.id === activeChatId 
            ? {
                ...chat,
                messages: [...chat.messages, workerResponse],
                lastMessage: workerResponse,
                unreadCount: chat.unreadCount + 1,
                updatedAt: new Date()
              }
            : chat
        ));
      }
    }, 2000);
  };

  const handleChatSelect = (chat: Chat) => {
    setActiveChatId(chat.id);
    setShowChatList(false);
    
    // Mark messages as read
    setChats(prev => prev.map(c => 
      c.id === chat.id 
        ? { ...c, unreadCount: 0, messages: c.messages.map(m => ({ ...m, isRead: true })) }
        : c
    ));
  };

  const handleMessagesClick = () => {
    setShowChatList(!showChatList);
  };

  const handleMyJobsClick = () => {
    setShowMyJobs(true);
  };

  const getUnreadMessagesCount = () => {
    return chats.reduce((total, chat) => total + chat.unreadCount, 0);
  };

  const renderCurrentView = () => {
    if (!authState.isAuthenticated) {
      return (
        <div className="flex-1 overflow-y-auto min-h-0">
          <div className="p-6 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Welcome to Khidma</h2>
            <p className="text-gray-600">Please log in to access the service marketplace</p>
          </div>
        </div>
      );
    }

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
        <RealMapView
          workers={filteredWorkers}
          services={serviceTypes}
          onWorkerClick={handleWorkerClick}
          onWorkerMessage={handleMessageWorker}
          userLocation={{ lat: 36.7372, lng: 3.0869 }}
          selectedService={selectedService}
          onServiceSelect={setSelectedService}
          showFilter={showFilter}
          onCloseFilter={() => setShowFilter(false)}
        />
        <div className="p-6 bg-white border-t border-gray-100">
          <div className="flex space-x-3">
            <button
              onClick={handlePostJobClick}
              className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-5 px-6 rounded-2xl font-bold text-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105"
            >
              🔍 Post a Job Request
            </button>
            <button
              onClick={handleMyJobsClick}
              className="bg-gradient-to-r from-green-600 to-green-700 text-white py-5 px-6 rounded-2xl font-bold text-lg hover:from-green-700 hover:to-green-800 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105"
            >
              📋 My Jobs
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50 overflow-hidden">
      <Header
        user={authState.user}
        isAuthenticated={authState.isAuthenticated}
        onNotificationClick={handleNotificationClick}
        onMessagesClick={handleMessagesClick}
        onFilterClick={handleFilterClick}
        onAuthClick={() => setShowAuthModal(true)}
        onLogout={handleLogout}
        notificationCount={notificationCount}
        unreadMessagesCount={getUnreadMessagesCount()}
        selectedService={selectedService}
      />
      
      {renderCurrentView()}
      
      {/* Overlay Dialogs */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onLogin={handleLogin}
        onRegister={handleRegister}
      />
      
      <BidNotificationPopup
        bid={currentBidNotification?.bid || null}
        onClose={() => setCurrentBidNotification(null)}
        onView={() => setShowNotifications(true)}
      />
      
      {selectedWorker && (
        <WorkerProfile
          worker={selectedWorker}
          onClose={() => setSelectedWorker(null)}
          onContact={handleContactWorker}
          onMessage={handleMessageWorker}
        />
      )}

      {showChatList && (
        <ChatList
          chats={chats}
          onChatSelect={handleChatSelect}
          onClose={() => setShowChatList(false)}
        />
      )}

      {activeChatId && (
        <ChatView
          chat={chats.find(c => c.id === activeChatId)!}
          onClose={() => setActiveChatId(null)}
          onSendMessage={handleSendMessage}
          onCallWorker={handleContactWorker}
        />
      )}

      {/* Notifications Overlay */}
      <NotificationsOverlay
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
        notifications={bidNotifications}
        onViewBid={(bid) => {
          setShowNotifications(false);
          setCurrentJob({
            id: 'job-1',
            title: 'Sample Job',
            description: 'This is a sample job for testing bids',
            serviceType: bid.worker.serviceType,
            budget: 10000,
            location: { lat: 36.7372, lng: 3.0869, address: 'Algiers, Algeria' },
            urgency: 'medium',
            postedAt: new Date(),
            status: 'open'
          });
          setViewMode('bids');
        }}
      />

      {/* My Jobs Overlay */}
      {showMyJobs && (
        <MyJobs
          jobs={userJobs}
          onAcceptBid={handleAcceptBidFromMyJobs}
          onMarkCompleted={handleMarkCompleted}
          onReviewWorker={handleReviewWorker}
          onMessageWorker={(workerId) => {
            const worker = mockWorkers.find(w => w.id === workerId);
            if (worker) {
              handleMessageWorker(worker);
            }
          }}
          onClose={() => setShowMyJobs(false)}
        />
      )}

      {/* Job Post Form Overlay */}
      {viewMode === 'post-job' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[9999] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md max-h-[90vh] overflow-hidden shadow-2xl">
            <JobPostForm
              services={serviceTypes}
              onClose={() => setViewMode('map')}
              onSubmit={handleJobPost}
            />
          </div>
        </div>
      )}

      {/* Bids View Overlay */}
      {viewMode === 'bids' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[9999] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl">
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
                onAcceptBid={handleAcceptBidFromBidsList}
                onMessageWorker={handleMessageFromBid}
              />
            </div>
          </div>
        </div>
      )}

      {/* Temporary Bid Notification */}
      {newBidNotification && newBidNotification.isVisible && (
        <div className="fixed top-4 right-4 bg-white rounded-2xl shadow-2xl border border-green-200 z-[10001] max-w-sm animate-slideInRight">
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-green-600">New Bid!</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-gray-500">{newBidNotification.timeLeft}s</span>
                <button
                  onClick={() => setNewBidNotification(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 mb-3">
              <img 
                src={newBidNotification.bid.worker.avatar} 
                alt={newBidNotification.bid.worker.name}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900">{newBidNotification.bid.worker.name}</h4>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Star className="w-3 h-3 text-yellow-400 mr-1" />
                    <span>{newBidNotification.bid.worker.rating}</span>
                  </div>
                  <span>•</span>
                  <div className="flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    <span>{newBidNotification.bid.estimatedArrival}</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-green-600">
                  {newBidNotification.bid.price.toLocaleString()} DA
                </div>
              </div>
            </div>
            
            <div className="flex space-x-2">
              <button
                onClick={() => {
                  handleAcceptBid(newBidNotification.jobId, newBidNotification.bid);
                  setNewBidNotification(null);
                }}
                className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
              >
                ✅ Accept Now
              </button>
              <button
                onClick={() => setNewBidNotification(null)}
                className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
              >
                Later
              </button>
            </div>
            
            {/* Progress bar */}
            <div className="mt-3 bg-gray-200 rounded-full h-1">
              <div 
                className="bg-green-500 h-1 rounded-full transition-all duration-1000"
                style={{ width: `${(newBidNotification.timeLeft / 30) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;