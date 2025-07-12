import React, { useState, useMemo } from 'react';
import { Search, Filter, Check, X, Star, MessageSquare } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Pagination from '../components/Pagination';

export default function SwapRequestsPage() {
  const { user, swapRequests, updateSwapRequest, deleteSwapRequest } = useAuth();
  const [statusFilter, setStatusFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState('incoming');
  const requestsPerPage = 5;

  const filteredRequests = useMemo(() => {
    const userRequests = activeTab === 'incoming' 
      ? swapRequests.filter(req => req.toUserId === user?.id)
      : swapRequests.filter(req => req.fromUserId === user?.id);

    return userRequests.filter(request => {
      const matchesStatus = statusFilter === '' || request.status === statusFilter;
      const matchesSearch = searchTerm === '' ||
        request.fromUser.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.toUser.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.skillOffered.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.skillWanted.toLowerCase().includes(searchTerm.toLowerCase());
      
      return matchesStatus && matchesSearch;
    });
  }, [swapRequests, user?.id, statusFilter, searchTerm, activeTab]);

  const totalPages = Math.ceil(filteredRequests.length / requestsPerPage);
  const startIndex = (currentPage - 1) * requestsPerPage;
  const currentRequests = filteredRequests.slice(startIndex, startIndex + requestsPerPage);

  const handleAccept = (requestId: string) => {
    updateSwapRequest(requestId, { status: 'accepted' });
  };

  const handleReject = (requestId: string) => {
    updateSwapRequest(requestId, { status: 'rejected' });
  };

  const handleDelete = (requestId: string) => {
    deleteSwapRequest(requestId);
  };

  const handleComplete = (requestId: string, rating: number, feedback: string) => {
    updateSwapRequest(requestId, { 
      status: 'completed', 
      rating, 
      feedback 
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'accepted': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'rejected': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'completed': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
          Swap Requests
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Manage your skill exchange requests
        </p>
      </div>

      {/* Tabs */}
      <div className="flex justify-center">
        <div className="bg-white dark:bg-black rounded-xl p-1 shadow-lg border border-purple-100 dark:border-purple-900">
          <button
            onClick={() => setActiveTab('incoming')}
            className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
              activeTab === 'incoming'
                ? 'bg-purple-500 text-white shadow-md'
                : 'text-gray-600 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-purple-900'
            }`}
          >
            Incoming Requests
          </button>
          <button
            onClick={() => setActiveTab('outgoing')}
            className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
              activeTab === 'outgoing'
                ? 'bg-purple-500 text-white shadow-md'
                : 'text-gray-600 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-purple-900'
            }`}
          >
            Outgoing Requests
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-black rounded-2xl shadow-lg p-6 border border-purple-100 dark:border-purple-900">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search requests..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-purple-200 dark:border-purple-700 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
            />
          </div>
          
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="pl-10 pr-8 py-3 rounded-xl border border-purple-200 dark:border-purple-700 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 appearance-none"
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="accepted">Accepted</option>
              <option value="rejected">Rejected</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex justify-between items-center">
        <p className="text-gray-600 dark:text-gray-300">
          {filteredRequests.length} requests found
        </p>
        {totalPages > 1 && (
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Page {currentPage} of {totalPages}
          </div>
        )}
      </div>

      {/* Requests List */}
      <div className="space-y-4">
        {currentRequests.map((request) => (
          <div
            key={request.id}
            className="bg-white dark:bg-black rounded-2xl shadow-lg border border-purple-100 dark:border-purple-900 overflow-hidden hover:shadow-xl transition-all duration-300"
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white font-bold">
                    {(activeTab === 'incoming' ? request.fromUser : request.toUser).name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-800 dark:text-white">
                      {activeTab === 'incoming' ? request.fromUser.name : request.toUser.name}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      {new Date(request.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(request.status)}`}>
                  {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Skill {activeTab === 'incoming' ? 'Offered' : 'Wanted'}
                  </h4>
                  <span className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-full text-sm font-medium">
                    {activeTab === 'incoming' ? request.skillOffered : request.skillWanted}
                  </span>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Skill {activeTab === 'incoming' ? 'Wanted' : 'Offered'}
                  </h4>
                  <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium">
                    {activeTab === 'incoming' ? request.skillWanted : request.skillOffered}
                  </span>
                </div>
              </div>

              {request.message && (
                <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                  <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Message</h4>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">{request.message}</p>
                </div>
              )}

              {request.status === 'completed' && request.rating && (
                <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="font-medium text-blue-800 dark:text-blue-200">
                      Rating: {request.rating}/5
                    </span>
                  </div>
                  {request.feedback && (
                    <p className="text-blue-700 dark:text-blue-300 text-sm">{request.feedback}</p>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3">
                {activeTab === 'incoming' && request.status === 'pending' && (
                  <>
                    <button
                      onClick={() => handleAccept(request.id)}
                      className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-200"
                    >
                      <Check className="w-4 h-4" />
                      <span>Accept</span>
                    </button>
                    <button
                      onClick={() => handleReject(request.id)}
                      className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200"
                    >
                      <X className="w-4 h-4" />
                      <span>Reject</span>
                    </button>
                  </>
                )}

                {activeTab === 'outgoing' && (request.status === 'pending' || request.status === 'rejected') && (
                  <button
                    onClick={() => handleDelete(request.id)}
                    className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200"
                  >
                    <X className="w-4 h-4" />
                    <span>Delete</span>
                  </button>
                )}

                {request.status === 'accepted' && (
                  <button
                    onClick={() => {
                      const rating = prompt('Rate this swap (1-5):');
                      const feedback = prompt('Leave feedback (optional):');
                      if (rating && parseInt(rating) >= 1 && parseInt(rating) <= 5) {
                        handleComplete(request.id, parseInt(rating), feedback || '');
                      }
                    }}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
                  >
                    <Star className="w-4 h-4" />
                    <span>Complete & Rate</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredRequests.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 dark:text-gray-500 text-6xl mb-4">📝</div>
          <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-300 mb-2">
            No swap requests found
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            {activeTab === 'incoming' 
              ? "You haven't received any swap requests yet."
              : "You haven't sent any swap requests yet."
            }
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