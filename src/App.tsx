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
import { WorkerDashboard } from './components/WorkerDashboard';
import { WorkerSignupModal } from './components/WorkerSignupModal';
import { UserSignupModal } from './components/UserSignupModal';
import { SignupSelectionModal } from './components/SignupSelectionModal';
import { ServiceWorker, ServiceType, JobRequest, Bid, BidNotification, User, AuthState, Message, Chat, WorkerReview } from './types';
import { serviceTypes, mockWorkers, mockBids, mockBidNotifications, mockMessages, mockChats, mockJobs } from './data/mockData';
import { ArrowLeft } from 'lucide-react';
import { Star, Clock } from 'lucide-react';
import { MessageCircle, X } from 'lucide-react';
import { Search, Filter } from 'lucide-react';
import { ServiceFilter } from './components/ServiceFilter';

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
  const [userJobs, setUserJobs] = useState<JobRequest[]>(mockJobs);
  const [showWorkerSignup, setShowWorkerSignup] = useState(false);
  const [showUserSignup, setShowUserSignup] = useState(false);
  const [showSignupSelection, setShowSignupSelection] = useState(false);
  const [showWorkerDashboard, setShowWorkerDashboard] = useState(false);
  const [currentWorker, setCurrentWorker] = useState<ServiceWorker | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<string>('');
  const [showOnlyActive, setShowOnlyActive] = useState(false);
  const [newBidNotification, setNewBidNotification] = useState<{
    bid: Bid;
    jobId: string;
    timeLeft: number;
    isVisible: boolean;
  } | null>(null);
  const [selectedBidDetails, setSelectedBidDetails] = useState<Bid | null>(null);

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

  // Filter workers based on selected service only
  const filteredWorkers = mockWorkers.filter(worker => {
    const serviceMatch = !selectedService || worker.serviceType.id === selectedService.id;
    const locationMatch = !selectedLocation || worker.region === selectedLocation;
    const activeMatch = !showOnlyActive || worker.isOnline;
    return serviceMatch && locationMatch && activeMatch;
  });

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

  const handleGoogleSignIn = () => {
    // Mock Google sign-in - in real app, this would integrate with Google OAuth
    const user: User = {
      id: 'google-user-1',
      name: 'Google User',
      email: 'user@gmail.com',
      phone: '+213 123 456 789',
      avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150',
      createdAt: new Date()
    };
    
    const newAuthState = { isAuthenticated: true, user };
    setAuthState(newAuthState);
    localStorage.setItem('authState', JSON.stringify(newAuthState));
    setShowAuthModal(false);
  };

  const handleWorkerSignup = (workerData: {
    name: string;
    email: string;
    phone: string;
    password: string;
    region: string;
    service: ServiceType;
  }) => {
    // Mock worker signup - in real app, this would create a worker account
    const user: User = {
      id: 'worker-user-1',
      name: workerData.name,
      email: workerData.email,
      phone: workerData.phone,
      avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150',
      createdAt: new Date()
    };
    
    const newAuthState = { isAuthenticated: true, user };
    setAuthState(newAuthState);
    localStorage.setItem('authState', JSON.stringify(newAuthState));
    setShowWorkerSignup(false);
    
    // Show success message
    alert(`🎉 Welcome to Bricola, ${workerData.name}!\n\nYou've successfully registered as a ${workerData.service.name} in Wilaya ${workerData.region}.\n\nYou can now start receiving job requests from customers in your area.`);
  };

  const handleUserSignup = (userData: {
    name: string;
    email: string;
    phone: string;
    password: string;
  }) => {
    // Mock user signup - in real app, this would create a user account
    const user: User = {
      id: 'user-account-1',
      name: userData.name,
      email: userData.email,
      phone: userData.phone,
      avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150',
      createdAt: new Date()
    };
    
    const newAuthState = { isAuthenticated: true, user };
    setAuthState(newAuthState);
    localStorage.setItem('authState', JSON.stringify(newAuthState));
    setShowUserSignup(false);
    
    // Show success message
    alert(`🎉 Welcome to Bricola, ${userData.name}!\n\nYou've successfully created your user account.\n\nYou can now post job requests and hire professionals for your projects.`);
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
      title: jobData.title!,
      description: jobData.description!,
      serviceType: jobData.serviceType!,
      budget: jobData.budget!,
      urgency: jobData.urgency!,
      location: jobData.location!,
      status: 'open',
      postedAt: new Date(),
      bids: [],
      visitorTime: jobData.visitorTime,
      uploadedFiles: jobData.uploadedFiles || [
        {
          id: `mock-file-1-${Date.now()}`,
          file: new File([''], 'kitchen-sink.jpg', { type: 'image/jpeg' }),
          type: 'image' as const,
          preview: 'https://images.pexels.com/photos/3945683/pexels-photo-3945683.jpeg?auto=compress&cs=tinysrgb&w=800',
          name: 'kitchen-sink.jpg'
        },
        {
          id: `mock-file-2-${Date.now()}`,
          file: new File([''], 'leak-video.mp4', { type: 'video/mp4' }),
          type: 'video' as const,
          preview: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
          name: 'leak-video.mp4'
        }
      ]
    };

    setUserJobs(prev => [newJob, ...prev]);

    // Add mock bids to the new job
    const mockBidsForJob: Bid[] = [
      {
        id: `bid-${Date.now()}-1`,
        workerId: mockWorkers[0].id,
        worker: mockWorkers[0],
        jobId: newJob.id,
        price: Math.floor(jobData.budget! * 0.8),
        estimatedArrival: '< 30 min',
        message: 'I can help you with this job. I have experience with similar work.',
        status: 'pending',
        submittedAt: new Date()
      },
      {
        id: `bid-${Date.now()}-2`,
        workerId: mockWorkers[1].id,
        worker: mockWorkers[1],
        jobId: newJob.id,
        price: Math.floor(jobData.budget! * 0.9),
        estimatedArrival: '< 1 hour',
        message: 'Available for this job. I can start immediately.',
        status: 'pending',
        submittedAt: new Date()
      }
    ];

    newJob.bids = mockBidsForJob;

    // Update notifications
    setNotificationCount(prev => prev + mockBidsForJob.length);
    setBidNotifications(prev => [...mockBidsForJob.map(bid => ({
      id: `notification-${Date.now()}-${bid.id}`,
      bid,
      timestamp: new Date(),
      isRead: false
    })), ...prev]);

    // Show temporary notifications for new bids
    mockBidsForJob.forEach((bid, index) => {
      setTimeout(() => {
        showTemporaryBidNotification(bid, newJob.id);
      }, index * 2000); // Show notifications 2 seconds apart
    });

    setViewMode('map');
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
  };

  const handleEditJob = (jobId: string, updatedJob: Partial<JobRequest>) => {
    setUserJobs(prev => prev.map(job => 
      job.id === jobId 
        ? { ...job, ...updatedJob }
        : job
    ));
  };

  const handleDeleteJob = (jobId: string) => {
    setUserJobs(prev => prev.filter(job => job.id !== jobId));
    setShowMyJobs(false);
  };

  const handleWorkerAcceptJob = (jobId: string, bid: Bid) => {
    // Mock: Update job status and add bid
    console.log('Worker accepted job:', jobId, bid);
    alert('Job accepted successfully! It has been added to your tasks.');
  };

  const handleWorkerCompleteJob = (jobId: string) => {
    // Mock: Mark job as completed
    console.log('Worker completed job:', jobId);
    alert('Job marked as completed!');
  };

  const handleWorkerMessageClient = (jobId: string) => {
    // Mock: Open messaging with client
    console.log('Worker messaging client for job:', jobId);
    alert('Opening chat with client...');
  };

  const handleWorkerLogin = (worker: ServiceWorker) => {
    setCurrentWorker(worker);
    setShowWorkerDashboard(true);
    setAuthState({ isAuthenticated: true, user: worker as any });
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

  const handleChatSelect = (chatId: string) => {
    setActiveChatId(chatId);
    setShowChatList(false);
    
    // Mark messages as read
    setChats(prev => prev.map(chat => 
      chat.id === chatId 
        ? { ...chat, messages: chat.messages.map(msg => ({ ...msg, isRead: true })) }
        : chat
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
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Welcome to Bricola</h2>
            <p className="text-gray-600">Please log in to access the service marketplace</p>
          </div>
        </div>
      );
    }

    return (
      <div className="flex flex-col flex-1 min-h-0">
        {/* Professionals Grid */}
        <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {selectedService ? `${selectedService.name} Professionals` : 'All Professionals'}
              </h2>
              <p className="text-gray-600">{filteredWorkers.length} professionals available</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredWorkers.map((worker) => (
                <div
                  key={worker.id}
                  className="bg-white rounded-3xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 cursor-pointer"
                  onClick={() => handleWorkerClick(worker)}
                >
                  <div className="flex items-start space-x-4 mb-4">
                    <img 
                      src={worker.avatar} 
                      alt={worker.name}
                      className="w-16 h-16 rounded-full object-cover border-3 border-white shadow-lg"
                    />
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900">{worker.name}</h3>
                      <p className="text-lg font-semibold text-orange-600">{worker.serviceType.name}</p>
                      <div className="flex items-center space-x-3 mt-2">
                        <div className="flex items-center">
                          <Star className="w-4 h-4 text-yellow-400 mr-1" />
                          <span className="font-medium">{worker.rating}</span>
                        </div>
                        <span className="text-gray-400">•</span>
                        <span className="text-gray-600">{worker.completedJobs} jobs</span>
                        <span className="text-gray-400">•</span>
                        <span className="text-green-600 font-medium">{worker.responseTime}</span>
                      </div>
                    </div>
                    <div className={`w-3 h-3 rounded-full ${worker.isOnline ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Hourly Rate:</span>
                      <span className="font-bold text-green-600">{worker.hourlyRate.toLocaleString()} DA</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Distance:</span>
                      <span className="font-medium">{worker.distance}km away</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Region:</span>
                      <span className="font-medium text-blue-600">{worker.region}</span>
                    </div>
                  </div>
                  
                  <div className="flex space-x-3 mt-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMessageWorker(worker);
                      }}
                      className="flex-1 bg-blue-800 text-white py-3 px-4 rounded-xl font-medium hover:bg-blue-900 transition-colors"
                    >
                      💬 Message
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleContactWorker(worker);
                      }}
                      className="flex-1 bg-orange-600 text-white py-3 px-4 rounded-xl font-medium hover:bg-orange-700 transition-colors"
                    >
                      📞 Call
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            {filteredWorkers.length === 0 && (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No professionals found</h3>
                <p className="text-gray-600">Try adjusting your search or filter criteria</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="p-6 bg-white border-t border-gray-100">
          <div className="flex space-x-3">
            <button
              onClick={handlePostJobClick}
              className="flex-1 bg-gradient-to-r from-orange-600 to-orange-700 text-white py-5 px-6 rounded-2xl font-bold text-xl hover:from-orange-700 hover:to-orange-800 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105"
            >
              🔍 Post a Job Request
            </button>
            <button
              onClick={handleMyJobsClick}
              className="bg-gradient-to-r from-blue-800 to-blue-900 text-white py-5 px-6 rounded-2xl font-bold text-lg hover:from-blue-900 hover:to-blue-950 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105"
            >
              📋 My Jobs
            </button>
          </div>
        </div>

        {/* Floating Filter Button */}
        <button
          onClick={handleFilterClick}
          className="fixed bottom-32 right-6 w-14 h-14 bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-full shadow-2xl hover:shadow-3xl transform hover:scale-110 transition-all duration-300 flex items-center justify-center z-50"
        >
          <Filter className="w-6 h-6" />
        </button>
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
        onSignUpClick={() => setShowSignupSelection(true)}
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
        onGoogleSignIn={handleGoogleSignIn}
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

      {/* Chat List */}
      {showChatList && (
        <ChatList
          chats={chats}
          activeChatId={activeChatId}
          onChatSelect={handleChatSelect}
          onClose={() => setShowChatList(false)}
        />
      )}

      {/* Chat View */}
      {activeChatId && (
        <ChatView
          chat={chats.find(c => c.id === activeChatId)!}
          onSendMessage={handleSendMessage}
          onClose={() => setActiveChatId(null)}
          onBack={() => setActiveChatId(null)}
        />
      )}

      {/* Notifications Overlay */}
      {showNotifications && (
        <NotificationsOverlay
          notifications={bidNotifications}
          onClose={() => setShowNotifications(false)}
          onViewBid={(bid) => {
            setSelectedBidDetails(bid);
            setShowNotifications(false);
          }}
        />
      )}

      {/* Worker Dashboard */}
      {showWorkerDashboard && currentWorker && (
        <WorkerDashboard
          worker={currentWorker}
          onClose={() => setShowWorkerDashboard(false)}
          onAcceptJob={handleWorkerAcceptJob}
          onCompleteJob={handleWorkerCompleteJob}
          onMessageClient={handleWorkerMessageClient}
        />
      )}

      {/* My Jobs Overlay */}
      {showMyJobs && (
        <MyJobs
          jobs={userJobs}
          onAcceptBid={handleAcceptBidFromMyJobs}
          onMarkCompleted={handleMarkCompleted}
          onReviewWorker={handleReviewWorker}
          onEditJob={handleEditJob}
          onDeleteJob={handleDeleteJob}
          onClose={() => setShowMyJobs(false)}
          onMessageWorker={(workerId) => {
            const worker = mockWorkers.find(w => w.id === workerId);
            if (worker) {
              handleMessageWorker(worker);
            }
          }}
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

      {/* Bid Details Modal */}
      {selectedBidDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[10000] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md max-h-[90vh] overflow-hidden shadow-2xl">
            {/* Header */}
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <MessageCircle className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Bid Details</h2>
                    <p className="text-sm text-gray-600">From {selectedBidDetails.worker.name}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedBidDetails(null)}
                  className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>

            {/* Bid Content */}
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              {/* Worker Info */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-4 mb-6">
                <div className="flex items-center space-x-4">
                  <img 
                    src={selectedBidDetails.worker.avatar} 
                    alt={selectedBidDetails.worker.name}
                    className="w-16 h-16 rounded-full object-cover border-3 border-white shadow-lg"
                  />
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900">{selectedBidDetails.worker.name}</h3>
                    <p className="text-lg font-semibold text-blue-600">{selectedBidDetails.worker.serviceType.name}</p>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-400 mr-1" />
                        <span>{selectedBidDetails.worker.rating}</span>
                      </div>
                      <span>•</span>
                      <span>{selectedBidDetails.worker.completedJobs} jobs</span>
                      <span>•</span>
                      <span>{selectedBidDetails.worker.responseTime}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Price */}
              <div className="bg-green-50 rounded-2xl p-4 mb-6">
                <div className="text-center">
                  <p className="text-sm text-green-700 mb-1">Bid Price</p>
                  <p className="text-3xl font-bold text-green-600">{selectedBidDetails.price.toLocaleString()} DA</p>
                  <p className="text-sm text-green-600 mt-1">Estimated arrival: {selectedBidDetails.estimatedArrival}</p>
                </div>
              </div>

              {/* Message */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-3">Worker's Message</h4>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-gray-700 leading-relaxed">{selectedBidDetails.message}</p>
                </div>
              </div>

              {/* Bid Info */}
              <div className="bg-gray-50 rounded-2xl p-4 mb-6">
                <h4 className="font-semibold text-gray-900 mb-3">Bid Information</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Submitted:</span>
                    <span className="font-medium">{selectedBidDetails.submittedAt.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span className={`font-medium ${
                      selectedBidDetails.status === 'pending' ? 'text-yellow-600' : 
                      selectedBidDetails.status === 'accepted' ? 'text-green-600' : 'text-gray-600'
                    }`}>
                      {selectedBidDetails.status.charAt(0).toUpperCase() + selectedBidDetails.status.slice(1)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Service:</span>
                    <span className="font-medium">{selectedBidDetails.worker.serviceType.name}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="p-6 border-t border-gray-100">
              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    handleMessageWorker(selectedBidDetails.worker);
                    setSelectedBidDetails(null);
                  }}
                  className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-xl font-medium hover:bg-blue-700 transition-colors"
                >
                  💬 Message Worker
                </button>
                <button
                  onClick={() => {
                    handleAcceptBidFromBidsList(selectedBidDetails);
                    setSelectedBidDetails(null);
                  }}
                  className="flex-1 bg-green-600 text-white py-3 px-4 rounded-xl font-medium hover:bg-green-700 transition-colors"
                >
                  ✅ Accept Bid
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Service Filter */}
      <ServiceFilter
        isOpen={showFilter}
        onClose={() => setShowFilter(false)}
        services={serviceTypes}
        selectedService={selectedService}
        selectedLocation={selectedLocation}
        onServiceSelect={setSelectedService}
        onLocationSelect={setSelectedLocation}
        showOnlyActive={showOnlyActive}
        onShowOnlyActiveChange={setShowOnlyActive}
      />

      {/* Worker Signup Modal */}
      <WorkerSignupModal
        isOpen={showWorkerSignup}
        onClose={() => setShowWorkerSignup(false)}
        onWorkerSignup={handleWorkerSignup}
        services={serviceTypes}
      />

      {/* User Signup Modal */}
      <UserSignupModal
        isOpen={showUserSignup}
        onClose={() => setShowUserSignup(false)}
        onUserSignup={handleUserSignup}
        onGoogleSignIn={handleGoogleSignIn}
      />

      {/* Signup Selection Modal */}
      <SignupSelectionModal
        isOpen={showSignupSelection}
        onClose={() => setShowSignupSelection(false)}
        onUserSignup={() => {
          setShowSignupSelection(false);
          setShowUserSignup(true);
        }}
        onWorkerSignup={() => {
          setShowSignupSelection(false);
          setShowWorkerSignup(true);
        }}
      />
    </div>
  );
}

export default App;