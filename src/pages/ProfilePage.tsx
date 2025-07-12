import React, { useState } from 'react';
import { Save, X, Plus, MapPin, Clock, Globe, Lock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function ProfilePage() {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    location: user?.location || '',
    skillsOffered: user?.skillsOffered || [],
    skillsWanted: user?.skillsWanted || [],
    availability: user?.availability || [],
    isPublic: user?.isPublic ?? true,
  });

  const [newSkillOffered, setNewSkillOffered] = useState('');
  const [newSkillWanted, setNewSkillWanted] = useState('');
  const [newAvailability, setNewAvailability] = useState('');

  const availabilityOptions = ['weekends', 'evenings', 'mornings', 'always'];

  const handleSave = () => {
    updateProfile(formData);
    setIsEditing(false);
  };

  const handleDiscard = () => {
    setFormData({
      name: user?.name || '',
      location: user?.location || '',
      skillsOffered: user?.skillsOffered || [],
      skillsWanted: user?.skillsWanted || [],
      availability: user?.availability || [],
      isPublic: user?.isPublic ?? true,
    });
    setIsEditing(false);
  };

  const addSkillOffered = () => {
    if (newSkillOffered.trim()) {
      setFormData(prev => ({
        ...prev,
        skillsOffered: [...prev.skillsOffered, newSkillOffered.trim()]
      }));
      setNewSkillOffered('');
    }
  };

  const addSkillWanted = () => {
    if (newSkillWanted.trim()) {
      setFormData(prev => ({
        ...prev,
        skillsWanted: [...prev.skillsWanted, newSkillWanted.trim()]
      }));
      setNewSkillWanted('');
    }
  };

  const removeSkillOffered = (index: number) => {
    setFormData(prev => ({
      ...prev,
      skillsOffered: prev.skillsOffered.filter((_, i) => i !== index)
    }));
  };

  const removeSkillWanted = (index: number) => {
    setFormData(prev => ({
      ...prev,
      skillsWanted: prev.skillsWanted.filter((_, i) => i !== index)
    }));
  };

  const toggleAvailability = (option: string) => {
    setFormData(prev => ({
      ...prev,
      availability: prev.availability.includes(option)
        ? prev.availability.filter(a => a !== option)
        : [...prev.availability, option]
    }));
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white dark:bg-black rounded-2xl shadow-xl border border-purple-100 dark:border-purple-900 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 px-8 py-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-white">Profile Settings</h1>
            <div className="flex items-center space-x-3">
              {isEditing ? (
                <>
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-white text-purple-600 rounded-lg hover:bg-gray-50 transition-colors duration-200 flex items-center space-x-2 font-medium"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save</span>
                  </button>
                  <button
                    onClick={handleDiscard}
                    className="px-4 py-2 bg-purple-700 text-white rounded-lg hover:bg-purple-800 transition-colors duration-200 flex items-center space-x-2 font-medium"
                  >
                    <X className="w-4 h-4" />
                    <span>Discard</span>
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-white text-purple-600 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-medium"
                >
                  Edit Profile
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="p-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Photo & Basic Info */}
            <div className="space-y-6">
              <div className="text-center">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white font-bold text-4xl mx-auto mb-4 shadow-lg">
                  {user?.profilePhoto ? (
                    <img src={user.profilePhoto} alt={user.name} className="w-full h-full rounded-full object-cover" />
                  ) : (
                    user?.name.charAt(0).toUpperCase()
                  )}
                </div>
                <h2 className="text-xl font-bold text-gray-800 dark:text-white">{user?.name}</h2>
                <p className="text-gray-600 dark:text-gray-300">Member since 2024</p>
              </div>

              {/* Privacy Setting */}
              <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4">
                <h3 className="font-semibold text-gray-800 dark:text-white mb-3 flex items-center">
                  <Globe className="w-5 h-5 mr-2" />
                  Profile Visibility
                </h3>
                <div className="space-y-2">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      name="visibility"
                      checked={formData.isPublic}
                      onChange={() => setFormData(prev => ({ ...prev, isPublic: true }))}
                      disabled={!isEditing}
                      className="text-purple-500 focus:ring-purple-500"
                    />
                    <div className="flex items-center space-x-2">
                      <Globe className="w-4 h-4 text-green-500" />
                      <span className="text-gray-700 dark:text-gray-300">Public</span>
                    </div>
                  </label>
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      name="visibility"
                      checked={!formData.isPublic}
                      onChange={() => setFormData(prev => ({ ...prev, isPublic: false }))}
                      disabled={!isEditing}
                      className="text-purple-500 focus:ring-purple-500"
                    />
                    <div className="flex items-center space-x-2">
                      <Lock className="w-4 h-4 text-red-500" />
                      <span className="text-gray-700 dark:text-gray-300">Private</span>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Main Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 rounded-xl border border-purple-200 dark:border-purple-700 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white disabled:opacity-60 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <MapPin className="w-4 h-4 inline mr-1" />
                    Location
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                    disabled={!isEditing}
                    placeholder="Optional"
                    className="w-full px-4 py-3 rounded-xl border border-purple-200 dark:border-purple-700 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white disabled:opacity-60 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
              </div>

              {/* Skills Offered */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Skills Offered
                </label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {formData.skillsOffered.map((skill, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-full text-sm font-medium"
                    >
                      {skill}
                      {isEditing && (
                        <button
                          onClick={() => removeSkillOffered(index)}
                          className="ml-2 text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-200"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      )}
                    </span>
                  ))}
                </div>
                {isEditing && (
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={newSkillOffered}
                      onChange={(e) => setNewSkillOffered(e.target.value)}
                      placeholder="Add a skill you can offer"
                      className="flex-1 px-4 py-2 rounded-lg border border-purple-200 dark:border-purple-700 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      onKeyPress={(e) => e.key === 'Enter' && addSkillOffered()}
                    />
                    <button
                      onClick={addSkillOffered}
                      className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-200"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              {/* Skills Wanted */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Skills Wanted
                </label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {formData.skillsWanted.map((skill, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium"
                    >
                      {skill}
                      {isEditing && (
                        <button
                          onClick={() => removeSkillWanted(index)}
                          className="ml-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      )}
                    </span>
                  ))}
                </div>
                {isEditing && (
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={newSkillWanted}
                      onChange={(e) => setNewSkillWanted(e.target.value)}
                      placeholder="Add a skill you want to learn"
                      className="flex-1 px-4 py-2 rounded-lg border border-purple-200 dark:border-purple-700 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      onKeyPress={(e) => e.key === 'Enter' && addSkillWanted()}
                    />
                    <button
                      onClick={addSkillWanted}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              {/* Availability */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  <Clock className="w-4 h-4 inline mr-1" />
                  Availability
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {availabilityOptions.map((option) => (
                    <label
                      key={option}
                      className={`flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition-all duration-200 ${
                        formData.availability.includes(option)
                          ? 'border-purple-500 bg-purple-50 dark:bg-purple-900'
                          : 'border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600'
                      } ${!isEditing ? 'cursor-default opacity-60' : ''}`}
                    >
                      <input
                        type="checkbox"
                        checked={formData.availability.includes(option)}
                        onChange={() => toggleAvailability(option)}
                        disabled={!isEditing}
                        className="text-purple-500 focus:ring-purple-500 rounded"
                      />
                      <span className="text-gray-700 dark:text-gray-300 capitalize">{option}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}