import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import ConfirmationModal from './ConfirmationModal';
import logoFitU from '../images/logo-fitu.png';

export default function NavigationBar() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // Handle navigation scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showProfileMenu && !event.target.closest('.profile-menu')) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showProfileMenu]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out:', error);
    } finally {
      setShowLogoutConfirm(false);
    }
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const navigationItems = [
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/class-roster', label: 'Class Roster' },
    { path: '/my-roster', label: 'My Roster' },
    { path: '/assigned-exercises', label: 'Assigned Exercises' },
  ];

  return (
    <>
      <nav className={`fixed w-full top-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/80 backdrop-blur-md shadow-md' : 'bg-white'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link 
                to="/dashboard" 
                className="flex items-center flex-shrink-0 text-primary-600 hover:text-primary-700 transition-colors group"
              >
                <img 
                  src={logoFitU} 
                  alt="FitU Logo" 
                  className="h-8 w-auto rounded-lg mr-2 transform transition-transform duration-200 group-hover:scale-105"
                />
                <span className="font-bold text-xl tracking-tight">FitU</span>
              </Link>

              {/* Desktop Navigation */}
              <div className="hidden sm:ml-10 sm:flex sm:space-x-6">
                {navigationItems.map(({ path, label }) => (
                  <Link
                    key={path}
                    to={path}
                    className={`inline-flex items-center px-2 py-1 text-sm font-medium transition-all duration-200 ${
                      isActive(path)
                        ? 'text-primary-600 border-b-2 border-primary-500'
                        : 'text-gray-500 hover:text-primary-600 hover:border-b-2 hover:border-primary-300'
                    }`}
                  >
                    {label}
                  </Link>
                ))}
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Desktop Menu */}
              <div className="hidden sm:flex sm:items-center sm:space-x-4">
                {currentUser && (
                  <div className="relative profile-menu">
                    <button
                      onClick={() => setShowProfileMenu(!showProfileMenu)}
                      className="flex items-center space-x-2 text-sm text-gray-700 hover:text-gray-900 focus:outline-none"
                    >
                      <span className="font-medium">{currentUser.email}</span>
                      <svg 
                        className={`h-4 w-4 transition-transform duration-200 ${showProfileMenu ? 'transform rotate-180' : ''}`} 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {/* Profile Dropdown */}
                    {showProfileMenu && (
                      <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5">
                        <Link
                          to="/profile"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setShowProfileMenu(false)}
                        >
                          View Profile
                        </Link>
                        <button
                          onClick={() => {
                            setShowProfileMenu(false);
                            setShowLogoutConfirm(true);
                          }}
                          className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                        >
                          Logout
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Mobile menu button */}
              <div className="flex items-center sm:hidden">
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="inline-flex items-center justify-center p-2 rounded-full text-gray-400 hover:text-primary-600 hover:bg-primary-50 transition-all duration-200 focus:outline-none"
                >
                  <span className="sr-only">Open main menu</span>
                  {/* Hamburger icon */}
                  <svg
                    className={`${isMobileMenuOpen ? 'hidden' : 'block'} h-6 w-6`}
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                  {/* Close icon */}
                  <svg
                    className={`${isMobileMenuOpen ? 'block' : 'hidden'} h-6 w-6`}
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Mobile menu */}
          <div 
            className={`${
              isMobileMenuOpen ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'
            } sm:hidden absolute top-16 left-0 right-0 bg-white/95 backdrop-blur-md transition-all duration-200 ease-in-out shadow-lg`}
          >
            <div className="pt-2 pb-3 space-y-1 px-4">
              {navigationItems.map(({ path, label }) => (
                <Link
                  key={path}
                  to={path}
                  className={`block py-2 text-base font-medium rounded-lg transition-all duration-200 ${
                    isActive(path)
                      ? 'text-primary-600 bg-primary-50'
                      : 'text-gray-500 hover:text-primary-600 hover:bg-primary-50'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {label}
                </Link>
              ))}
              <Link
                to="/profile"
                className="block py-2 text-base font-medium text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Profile Settings
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Spacer for fixed navbar */}
      <div className="h-16"></div>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <ConfirmationModal
          title="Confirm Logout"
          message="Are you sure you want to logout?"
          onConfirm={handleLogout}
          onCancel={() => setShowLogoutConfirm(false)}
        />
      )}
    </>
  );
} 