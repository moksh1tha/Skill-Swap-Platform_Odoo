import React, { useState } from 'react';
import { Users, MessageSquare, Shield, Download, Ban, Send, Eye, AlertTriangle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function AdminDashboard() {
  const { users, swapRequests, banUser, sendPlatformMessage } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [messageText, setMessageText] = useState('');

  const stats = {
    totalUsers: users.filter(u => !u.isAdmin).length,
    totalRequests: swapRequests.length,
    pendingRequests: swapRequests.filter(r => r.status === 'pending').length,
    completedSwaps: swapRequests.filter(r => r.status === 'completed').length,
  };

  const handleBanUser = (userId: string, userName: string) => {
    if (window.confirm(`Are you sure you want to ban ${userName}? This action cannot be undone.`)) {
      banUser(userId);
    }
  };

  const handleSendMessage = () => {
    if (messageText.trim()) {
      sendPlatformMessage(messageText);
      setMessageText('');
      alert('Platform message sent to all users!');
    }
  };

  const downloadReport = (type: string) => {
    const data = type === 'users' ? users : swapRequests;
    const dataStr = JSON.stringify(data, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `${type}_report_${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const TabButton = ({ id, label, icon: Icon }: { id: string; label: string; icon: any }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex items-center space-x-2 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
        activeTab === id
          ? 'bg-purple-500 text-white shadow-lg'
          : 'text-gray-600 dark:text-gray-300 hover:bg-purple-100 dark:hover:bg-purple-900'
      }`}
    >
      <Icon className="w-5 h-5" />
      <span>{label}</span>
    </button>
  );

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
          Admin Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Platform management and oversight
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap justify-center gap-2 bg-white dark:bg-black rounded-xl p-2 shadow-lg border border-purple-100 dark:border-purple-900">
        <TabButton id="overview" label="Overview" icon={Eye} />
        <TabButton id="users" label="Users" icon={Users} />
        <TabButton id="requests" label="Requests" icon={MessageSquare} />
        <TabButton id="moderation" label="Moderation" icon={Shield} />
        <TabButton id="messages" label="Messages" icon={Send} />
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white dark:bg-black rounded-2xl p-6 shadow-lg border border-purple-100 dark:border-purple-900">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Users</p>
                  <p className="text-3xl font-bold text-gray-800 dark:text-white">{stats.totalUsers}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-black rounded-2xl p-6 shadow-lg border border-purple-100 dark:border-purple-900">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Requests</p>
                  <p className="text-3xl font-bold text-gray-800 dark:text-white">{stats.totalRequests}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                  <MessageSquare className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-black rounded-2xl p-6 shadow-lg border border-purple-100 dark:border-purple-900">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Pending</p>
                  <p className="text-3xl font-bold text-gray-800 dark:text-white">{stats.pendingRequests}</p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-black rounded-2xl p-6 shadow-lg border border-purple-100 dark:border-purple-900">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Completed</p>
                  <p className="text-3xl font-bold text-gray-800 dark:text-white">{stats.completedSwaps}</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                  <Shield className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white dark:bg-black rounded-2xl p-6 shadow-lg border border-purple-100 dark:border-purple-900">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Quick Actions</h3>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => downloadReport('users')}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
              >
                <Download className="w-4 h-4" />
                <span>Download User Report</span>
              </button>
              <button
                onClick={() => downloadReport('requests')}
                className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-200"
              >
                <Download className="w-4 h-4" />
                <span>Download Swap Report</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div className="bg-white dark:bg-black rounded-2xl shadow-lg border border-purple-100 dark:border-purple-900 overflow-hidden">
          <div className="p-6 border-b border-purple-100 dark:border-purple-900">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">User Management</h3>
          </div>
          <div className="divide-y divide-purple-100 dark:divide-purple-900">
            {users.filter(u => !u.isAdmin).map((user) => (
              <div key={user.id} className="p-6 hover:bg-purple-50 dark:hover:bg-purple-900 transition-colors duration-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white font-bold">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 dark:text-white">{user.name}</h4>
                      <p className="text-gray-600 dark:text-gray-300 text-sm">{user.email}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          user.isPublic
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        }`}>
                          {user.isPublic ? 'Public' : 'Private'}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {user.skillsOffered.length} skills offered
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleBanUser(user.id, user.name)}
                    className="flex items-center space-x-2 px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200 text-sm"
                  >
                    <Ban className="w-4 h-4" />
                    <span>Ban User</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Requests Tab */}
      {activeTab === 'requests' && (
        <div className="bg-white dark:bg-black rounded-2xl shadow-lg border border-purple-100 dark:border-purple-900 overflow-hidden">
          <div className="p-6 border-b border-purple-100 dark:border-purple-900">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Swap Request Monitoring</h3>
          </div>
          <div className="divide-y divide-purple-100 dark:divide-purple-900">
            {swapRequests.map((request) => (
              <div key={request.id} className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <span className="font-medium text-gray-800 dark:text-white">
                      {request.fromUser.name} → {request.toUser.name}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      request.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                      request.status === 'accepted' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                      request.status === 'rejected' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                      'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                    }`}>
                      {request.status}
                    </span>
                  </div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(request.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600 dark:text-gray-300">Offered: </span>
                    <span className="font-medium text-gray-800 dark:text-white">{request.skillOffered}</span>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-300">Wanted: </span>
                    <span className="font-medium text-gray-800 dark:text-white">{request.skillWanted}</span>
                  </div>
                </div>
                {request.message && (
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 p-2 rounded">
                    "{request.message}"
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Moderation Tab */}
      {activeTab === 'moderation' && (
        <div className="bg-white dark:bg-black rounded-2xl shadow-lg border border-purple-100 dark:border-purple-900 p-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Content Moderation</h3>
          <div className="space-y-4">
            <div className="p-4 bg-yellow-50 dark:bg-yellow-900 border border-yellow-200 dark:border-yellow-700 rounded-lg">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                <h4 className="font-medium text-yellow-800 dark:text-yellow-200">Content Review Queue</h4>
              </div>
              <p className="text-yellow-700 dark:text-yellow-300 text-sm mt-2">
                No flagged content awaiting review at this time.
              </p>
            </div>
            
            <div className="p-4 bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-700 rounded-lg">
              <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">Moderation Tools</h4>
              <div className="space-y-2 text-sm text-blue-700 dark:text-blue-300">
                <p>• Monitor user-generated skill descriptions for inappropriate content</p>
                <p>• Review swap request messages for spam or policy violations</p>
                <p>• Ban users who repeatedly violate platform policies</p>
                <p>• Download activity reports for compliance and safety reviews</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Messages Tab */}
      {activeTab === 'messages' && (
        <div className="bg-white dark:bg-black rounded-2xl shadow-lg border border-purple-100 dark:border-purple-900 p-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Platform Messages</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Send platform-wide message
              </label>
              <textarea
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 rounded-xl border border-purple-200 dark:border-purple-700 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 resize-none"
                placeholder="Enter your platform message (e.g., feature updates, maintenance notices, policy changes)..."
              />
            </div>
            <button
              onClick={handleSendMessage}
              disabled={!messageText.trim()}
              className="flex items-center space-x-2 px-6 py-3 bg-purple-500 text-white rounded-xl hover:bg-purple-600 disabled:bg-purple-300 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg"
            >
              <Send className="w-5 h-5" />
              <span>Send Message to All Users</span>
            </button>
            
            <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-900 rounded-xl">
              <h4 className="font-medium text-gray-800 dark:text-white mb-2">Message Examples</h4>
              <div className="space-y-1 text-sm text-gray-600 dark:text-gray-300">
                <p>• "New feature: Skill categories now available!"</p>
                <p>• "Scheduled maintenance: Platform will be down for 30 minutes"</p>
                <p>• "Policy update: Please review our updated community guidelines"</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}