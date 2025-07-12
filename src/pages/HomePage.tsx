import React, { useState, useMemo } from 'react';
import { Search, Filter, Star, MapPin, Clock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import UserCard from '../components/UserCard';
import Pagination from '../components/Pagination';

export default function HomePage() {
  const { users } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [availabilityFilter, setAvailabilityFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 6;

  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      if (!user.isPublic) return false;
      
      const matchesSearch = searchTerm === '' || 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.skillsOffered.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase())) ||
        user.skillsWanted.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesAvailability = availabilityFilter === '' || 
        user.availability.includes(availabilityFilter);
      
      return matchesSearch && matchesAvailability;
    });
  }, [users, searchTerm, availabilityFilter]);

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const startIndex = (currentPage - 1) * usersPerPage;
  const currentUsers = filteredUsers.slice(startIndex, startIndex + usersPerPage);

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-white">
          Find Your Perfect Skill Swap Partner
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Connect with talented individuals, share your expertise, and learn new skills through meaningful exchanges.
        </p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white dark:bg-black rounded-2xl shadow-lg p-6 border border-purple-100 dark:border-purple-900">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by name or skills..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-purple-200 dark:border-purple-700 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
            />
          </div>
          
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              value={availabilityFilter}
              onChange={(e) => setAvailabilityFilter(e.target.value)}
              className="pl-10 pr-8 py-3 rounded-xl border border-purple-200 dark:border-purple-700 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 appearance-none"
            >
              <option value="">All Availability</option>
              <option value="weekends">Weekends</option>
              <option value="evenings">Evenings</option>
              <option value="mornings">Mornings</option>
              <option value="always">Always Available</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex justify-between items-center">
        <p className="text-gray-600 dark:text-gray-300">
          {filteredUsers.length} skill swappers found
        </p>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Page {currentPage} of {totalPages}
        </div>
      </div>

      {/* User Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentUsers.map((user) => (
          <UserCard key={user.id} user={user} />
        ))}
      </div>

      {/* Empty State */}
      {filteredUsers.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 dark:text-gray-500 text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-300 mb-2">
            No skill swappers found
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            Try adjusting your search criteria or check back later for new members.
          </p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
}