import React from 'react';
import { X, User, Wrench, Users, Briefcase } from 'lucide-react';

interface SignupSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUserSignup: () => void;
  onWorkerSignup: () => void;
}

export const SignupSelectionModal: React.FC<SignupSelectionModalProps> = ({
  isOpen,
  onClose,
  onUserSignup,
  onWorkerSignup
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-[9999] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-hidden animate-fadeIn">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-orange-600 to-orange-700 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">B</span>
            </div>
            <h2 className="text-xl font-bold text-gray-900">Join Bricola</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Choose Your Account Type</h3>
            <p className="text-gray-600">Select how you want to use Bricola</p>
          </div>

          <div className="space-y-4">
            {/* User Signup Option */}
            <button
              onClick={onUserSignup}
              className="w-full p-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-2xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6" />
                </div>
                <div className="text-left">
                  <h4 className="text-xl font-bold mb-1">Sign Up as User</h4>
                  <p className="text-blue-100 text-sm">
                    Find and hire professionals for your projects
                  </p>
                </div>
              </div>
              <div className="mt-4 text-left">
                <div className="flex items-center space-x-2 text-sm text-blue-100">
                  <span>✓</span>
                  <span>Post job requests</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-blue-100">
                  <span>✓</span>
                  <span>Browse professionals</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-blue-100">
                  <span>✓</span>
                  <span>Manage your projects</span>
                </div>
              </div>
            </button>

            {/* Worker Signup Option */}
            <button
              onClick={onWorkerSignup}
              className="w-full p-6 bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-2xl hover:from-orange-700 hover:to-orange-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
                  <Wrench className="w-6 h-6" />
                </div>
                <div className="text-left">
                  <h4 className="text-xl font-bold mb-1">Sign Up as Worker</h4>
                  <p className="text-orange-100 text-sm">
                    Offer your services and get hired for projects
                  </p>
                </div>
              </div>
              <div className="mt-4 text-left">
                <div className="flex items-center space-x-2 text-sm text-orange-100">
                  <span>✓</span>
                  <span>Receive job requests</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-orange-100">
                  <span>✓</span>
                  <span>Set your rates</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-orange-100">
                  <span>✓</span>
                  <span>Build your reputation</span>
                </div>
              </div>
            </button>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Already have an account?{' '}
              <button
                onClick={onClose}
                className="text-orange-600 hover:text-orange-700 font-medium"
              >
                Sign In
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}; 