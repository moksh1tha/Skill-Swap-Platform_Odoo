import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  location?: string;
  profilePhoto?: string;
  skillsOffered: string[];
  skillsWanted: string[];
  availability: string[];
  isPublic: boolean;
  rating: number;
  isAdmin: boolean;
}

interface SwapRequest {
  id: string;
  fromUserId: string;
  toUserId: string;
  fromUser: User;
  toUser: User;
  skillOffered: string;
  skillWanted: string;
  message: string;
  status: 'pending' | 'accepted' | 'rejected' | 'completed';
  createdAt: Date;
  rating?: number;
  feedback?: string;
}

interface AuthContextType {
  user: User | null;
  users: User[];
  swapRequests: SwapRequest[];
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
  createSwapRequest: (request: Omit<SwapRequest, 'id' | 'fromUser' | 'toUser' | 'createdAt' | 'status'>) => void;
  updateSwapRequest: (id: string, updates: Partial<SwapRequest>) => void;
  deleteSwapRequest: (id: string) => void;
  banUser: (userId: string) => void;
  sendPlatformMessage: (message: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

// Mock data
const mockUsers: User[] = [
  {
    id: '1',
    email: 'marc@example.com',
    name: 'Marc Dean',
    location: 'New York',
    skillsOffered: ['Photoshop', 'UI Design', 'Figma'],
    skillsWanted: ['React', 'Node.js'],
    availability: ['weekends', 'evenings'],
    isPublic: true,
    rating: 4.8,
    isAdmin: false,
  },
  {
    id: '2',
    email: 'michael@example.com',
    name: 'Michael',
    location: 'San Francisco',
    skillsOffered: ['React', 'JavaScript', 'CSS'],
    skillsWanted: ['Photoshop', 'Design'],
    availability: ['weekends'],
    isPublic: true,
    rating: 4.5,
    isAdmin: false,
  },
  {
    id: '3',
    email: 'joe@example.com',
    name: 'Joe wills',
    location: 'Los Angeles',
    skillsOffered: ['Node.js', 'Python', 'MongoDB'],
    skillsWanted: ['React', 'Frontend'],
    availability: ['evenings'],
    isPublic: true,
    rating: 4.7,
    isAdmin: false,
  },
  {
    id: '4',
    email: 'admin@example.com',
    name: 'Admin User',
    location: 'Platform',
    skillsOffered: ['Platform Management'],
    skillsWanted: [],
    availability: ['always'],
    isPublic: false,
    rating: 5.0,
    isAdmin: true,
  },
];

const mockSwapRequests: SwapRequest[] = [];

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [swapRequests, setSwapRequests] = useState<SwapRequest[]>(mockSwapRequests);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    const foundUser = users.find(u => u.email === email);
    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem('user', JSON.stringify(foundUser));
      return true;
    }
    return false;
  };

  const register = async (email: string, password: string, name: string): Promise<boolean> => {
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      return false;
    }

    const newUser: User = {
      id: Date.now().toString(),
      email,
      name,
      skillsOffered: [],
      skillsWanted: [],
      availability: [],
      isPublic: true,
      rating: 0,
      isAdmin: false,
    };

    setUsers(prev => [...prev, newUser]);
    setUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const updateProfile = (updates: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      setUsers(prev => prev.map(u => u.id === user.id ? updatedUser : u));
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  const createSwapRequest = (request: Omit<SwapRequest, 'id' | 'fromUser' | 'toUser' | 'createdAt' | 'status'>) => {
    if (!user) return;

    const fromUser = user;
    const toUser = users.find(u => u.id === request.toUserId);
    if (!toUser) return;

    const newRequest: SwapRequest = {
      ...request,
      id: Date.now().toString(),
      fromUser,
      toUser,
      status: 'pending',
      createdAt: new Date(),
    };

    setSwapRequests(prev => [...prev, newRequest]);
  };

  const updateSwapRequest = (id: string, updates: Partial<SwapRequest>) => {
    setSwapRequests(prev =>
      prev.map(request =>
        request.id === id ? { ...request, ...updates } : request
      )
    );
  };

  const deleteSwapRequest = (id: string) => {
    setSwapRequests(prev => prev.filter(request => request.id !== id));
  };

  const banUser = (userId: string) => {
    setUsers(prev => prev.filter(u => u.id !== userId));
  };

  const sendPlatformMessage = (message: string) => {
    // In a real app, this would send notifications to all users
    console.log('Platform message sent:', message);
  };

  const isAuthenticated = !!user;
  const isAdmin = user?.isAdmin || false;

  return (
    <AuthContext.Provider value={{
      user,
      users,
      swapRequests,
      isAuthenticated,
      isAdmin,
      login,
      register,
      logout,
      updateProfile,
      createSwapRequest,
      updateSwapRequest,
      deleteSwapRequest,
      banUser,
      sendPlatformMessage,
    }}>
      {children}
    </AuthContext.Provider>
  );
}