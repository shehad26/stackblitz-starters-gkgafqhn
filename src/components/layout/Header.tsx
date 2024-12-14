import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ClipboardList, Users, BarChart2, Settings, RefreshCw, LogOut, Menu, X } from 'lucide-react';
import { useAttendanceStore } from '../../store/useAttendanceStore';
import { useSettingsStore } from '../../store/useSettingsStore';
import { useAuthStore } from '../../store/useAuthStore';

export function Header() {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { settings } = useSettingsStore();
  const { isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleRefresh = () => {
    setIsRefreshing(true);
    window.location.reload();
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className="bg-white shadow sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-3">
            {settings.logoUrl ? (
              <img 
                src={settings.logoUrl} 
                alt="Company Logo" 
                className="h-8 w-auto"
              />
            ) : (
              <ClipboardList className="w-8 h-8 text-blue-600" />
            )}
            <span className="text-xl font-bold text-gray-900 hidden sm:block">
              Attendance System
            </span>
          </Link>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-500 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 p-2"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>

          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link
              to="/"
              className="flex items-center space-x-1 text-gray-600 hover:text-gray-900"
            >
              <ClipboardList className="w-5 h-5" />
              <span>Attendance</span>
            </Link>
            <Link
              to="/admin"
              className="flex items-center space-x-1 text-gray-600 hover:text-gray-900"
            >
              <Users className="w-5 h-5" />
              <span>Admin</span>
            </Link>
            <Link
              to="/reports"
              className="flex items-center space-x-1 text-gray-600 hover:text-gray-900"
            >
              <BarChart2 className="w-5 h-5" />
              <span>Reports</span>
            </Link>
            <Link
              to="/settings"
              className="flex items-center space-x-1 text-gray-600 hover:text-gray-900"
            >
              <Settings className="w-5 h-5" />
              <span>Settings</span>
            </Link>
            <button
              onClick={handleRefresh}
              className={`flex items-center space-x-1 text-gray-600 hover:text-gray-900 focus:outline-none ${
                isRefreshing ? 'animate-spin' : ''
              }`}
              disabled={isRefreshing}
            >
              <RefreshCw className="w-5 h-5" />
            </button>
            {isAuthenticated && (
              <button
                onClick={handleLogout}
                className="flex items-center space-x-1 text-red-600 hover:text-red-800"
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            )}
          </nav>
        </div>

        {/* Mobile navigation */}
        {isMenuOpen && (
          <nav className="md:hidden py-4 space-y-2">
            <Link
              to="/"
              onClick={closeMenu}
              className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg"
            >
              <ClipboardList className="w-5 h-5" />
              <span>Attendance</span>
            </Link>
            <Link
              to="/admin"
              onClick={closeMenu}
              className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg"
            >
              <Users className="w-5 h-5" />
              <span>Admin</span>
            </Link>
            <Link
              to="/reports"
              onClick={closeMenu}
              className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg"
            >
              <BarChart2 className="w-5 h-5" />
              <span>Reports</span>
            </Link>
            <Link
              to="/settings"
              onClick={closeMenu}
              className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg"
            >
              <Settings className="w-5 h-5" />
              <span>Settings</span>
            </Link>
            <button
              onClick={() => {
                handleRefresh();
                closeMenu();
              }}
              className="w-full flex items-center space-x-2 px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg"
            >
              <RefreshCw className="w-5 h-5" />
              <span>Refresh</span>
            </button>
            {isAuthenticated && (
              <button
                onClick={() => {
                  handleLogout();
                  closeMenu();
                }}
                className="w-full flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg"
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            )}
          </nav>
        )}
      </div>
    </header>
  );
}