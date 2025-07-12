import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Moon, Sun, User, LogOut, Shield } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';

export default function Header() {
  const { isDark, toggleTheme } = useTheme();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="bg-white dark:bg-black shadow-lg border-b border-purple-100 dark:border-purple-900 transition-colors duration-300">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link 
            to="/" 
            className="text-2xl font-bold text-gray-800 dark:text-white hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-200"
          >
            Skill Swap Platform
          </Link>

          <div className="flex items-center space-x-4">
            {isAuthenticated && (
              <>
                <Link
                  to="/swap-requests"
                  className={`px-4 py-2 rounded-full font-medium transition-all duration-200 ${
                    location.pathname === '/swap-requests'
                      ? 'bg-purple-500 text-white shadow-lg'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-purple-100 dark:hover:bg-purple-900'
                  }`}
                >
                  Swap Requests
                </Link>

                {isAdmin && (
                  <Link
                    to="/admin"
                    className={`px-4 py-2 rounded-full font-medium transition-all duration-200 flex items-center space-x-2 ${
                      location.pathname === '/admin'
                        ? 'bg-purple-500 text-white shadow-lg'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-purple-100 dark:hover:bg-purple-900'
                    }`}
                  >
                    <Shield className="w-4 h-4" />
                    <span>Admin</span>
                  </Link>
                )}
              </>
            )}

            <button
              onClick={toggleTheme}
              className="p-2 rounded-full bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400 hover:bg-purple-200 dark:hover:bg-purple-800 transition-all duration-200"
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <Link
                  to="/profile"
                  className="flex items-center space-x-2 px-3 py-2 rounded-full bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400 hover:bg-purple-200 dark:hover:bg-purple-800 transition-all duration-200"
                >
                  <User className="w-4 h-4" />
                  <span className="font-medium">{user?.name}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-full bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-800 transition-all duration-200"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors duration-200"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-purple-500 text-white rounded-full hover:bg-purple-600 transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}