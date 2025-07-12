import React from 'react';
import { Star, MapPin, Clock, MessageCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface User {
  id: string;
  name: string;
  location?: string;
  profilePhoto?: string;
  skillsOffered: string[];
  skillsWanted: string[];
  availability: string[];
  rating: number;
}

interface UserCardProps {
  user: User;
}

export default function UserCard({ user }: UserCardProps) {
  const { isAuthenticated, user: currentUser } = useAuth();

  const openSwapModal = () => {
    if (isAuthenticated && currentUser?.id !== user.id) {
      // This will be handled by a modal component
      window.dispatchEvent(new CustomEvent('openSwapModal', { detail: { user } }));
    }
  };

  return (
    <div className="bg-white dark:bg-black rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-purple-100 dark:border-purple-900 overflow-hidden group">
      <div className="p-6">
        {/* User Info */}
        <div className="flex items-start space-x-4 mb-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white font-bold text-xl shadow-lg">
            {user.profilePhoto ? (
              <img src={user.profilePhoto} alt={user.name} className="w-full h-full rounded-full object-cover" />
            ) : (
              user.name.charAt(0).toUpperCase()
            )}
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-lg text-gray-800 dark:text-white mb-1">
              {user.name}
            </h3>
            {user.location && (
              <div className="flex items-center text-gray-600 dark:text-gray-300 text-sm mb-2">
                <MapPin className="w-4 h-4 mr-1" />
                {user.location}
              </div>
            )}
            <div className="flex items-center text-yellow-500">
              <Star className="w-4 h-4 mr-1 fill-current" />
              <span className="text-sm font-medium">{user.rating.toFixed(1)}</span>
            </div>
          </div>
        </div>

        {/* Skills Offered */}
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Skills Offered</h4>
          <div className="flex flex-wrap gap-2">
            {user.skillsOffered.map((skill, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-full text-sm font-medium"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Skills Wanted */}
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Skills Wanted</h4>
          <div className="flex flex-wrap gap-2">
            {user.skillsWanted.map((skill, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Availability */}
        <div className="mb-6">
          <div className="flex items-center text-gray-600 dark:text-gray-300 text-sm">
            <Clock className="w-4 h-4 mr-2" />
            <span>Available: {user.availability.join(', ')}</span>
          </div>
        </div>

        {/* Request Button */}
        {isAuthenticated && currentUser?.id !== user.id && (
          <button
            onClick={openSwapModal}
            className="w-full bg-purple-500 hover:bg-purple-600 text-white font-medium py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center space-x-2 shadow-md hover:shadow-lg group-hover:scale-[1.02]"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Request Swap</span>
          </button>
        )}
      </div>
    </div>
  );
}