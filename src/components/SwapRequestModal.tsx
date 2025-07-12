import React, { useState, useEffect } from 'react';
import { X, Send } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface SwapModalData {
  user: {
    id: string;
    name: string;
    skillsOffered: string[];
    skillsWanted: string[];
  };
}

export default function SwapRequestModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [modalData, setModalData] = useState<SwapModalData | null>(null);
  const [formData, setFormData] = useState({
    skillOffered: '',
    skillWanted: '',
    message: '',
  });
  const { user, createSwapRequest } = useAuth();

  useEffect(() => {
    const handleOpenModal = (event: CustomEvent<SwapModalData>) => {
      setModalData(event.detail);
      setIsOpen(true);
    };

    window.addEventListener('openSwapModal', handleOpenModal as EventListener);
    return () => {
      window.removeEventListener('openSwapModal', handleOpenModal as EventListener);
    };
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    setModalData(null);
    setFormData({ skillOffered: '', skillWanted: '', message: '' });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!modalData || !user || !formData.skillOffered || !formData.skillWanted) {
      return;
    }

    createSwapRequest({
      fromUserId: user.id,
      toUserId: modalData.user.id,
      skillOffered: formData.skillOffered,
      skillWanted: formData.skillWanted,
      message: formData.message,
    });

    handleClose();
  };

  if (!isOpen || !modalData) return null;

  const mySkills = user?.skillsOffered || [];
  const theirSkills = modalData.user.skillsOffered;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-black rounded-2xl shadow-2xl w-full max-w-md border border-purple-100 dark:border-purple-900">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-purple-100 dark:border-purple-900">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">
            Request Skill Swap
          </h2>
          <button
            onClick={handleClose}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors duration-200"
          >
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white font-bold text-xl mx-auto mb-3">
              {modalData.user.name.charAt(0).toUpperCase()}
            </div>
            <h3 className="font-semibold text-gray-800 dark:text-white">
              {modalData.user.name}
            </h3>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Choose one of your offered skills
            </label>
            <select
              value={formData.skillOffered}
              onChange={(e) => setFormData(prev => ({ ...prev, skillOffered: e.target.value }))}
              required
              className="w-full px-4 py-3 rounded-xl border border-purple-200 dark:border-purple-700 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
            >
              <option value="">Select a skill you offer</option>
              {mySkills.map((skill, index) => (
                <option key={index} value={skill}>
                  {skill}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Choose one of their offered skills
            </label>
            <select
              value={formData.skillWanted}
              onChange={(e) => setFormData(prev => ({ ...prev, skillWanted: e.target.value }))}
              required
              className="w-full px-4 py-3 rounded-xl border border-purple-200 dark:border-purple-700 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
            >
              <option value="">Select a skill you want</option>
              {theirSkills.map((skill, index) => (
                <option key={index} value={skill}>
                  {skill}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Message (optional)
            </label>
            <textarea
              value={formData.message}
              onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
              rows={4}
             className="w-full px-4 py-3 rounded-xl border border-purple-200 dark:border-purple-700 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 resize-none"
              placeholder="Add a personal message to make your request more appealing..."
            />
          </div>

          <div className="flex space-x-3">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors duration-200 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!formData.skillOffered || !formData.skillWanted}
              className="flex-1 bg-purple-500 hover:bg-purple-600 disabled:bg-purple-300 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center space-x-2 shadow-md hover:shadow-lg"
            >
              <Send className="w-4 h-4" />
              <span>Send Request</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}