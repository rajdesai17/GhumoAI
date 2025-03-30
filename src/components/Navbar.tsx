import React, { useState } from 'react';
import { Car, MapPin, ArrowLeft, User, LogOut, Droplet, Bot, Menu, X } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import AuthModal from './auth/AuthModal';
import logo from '../assets/logo.png';

const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const showBackButton = location.pathname !== '/';

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const navLinks = [
    { path: '/plan-tour', icon: MapPin, label: 'Plan Tour' },
    { path: '/vehicle-rental', icon: Car, label: 'Rent Vehicle' },
    { path: '/refill-stations', icon: Droplet, label: 'Refill Stations' },
    { path: '/ai-agent', icon: Bot, label: 'AI Agent' },
    { path: '/my-tours', icon: User, label: 'My Tours' },
  ];

  return (
    <>
      <header className="bg-white/95 backdrop-blur-md fixed w-full top-0 z-50 border-b border-slate-200 shadow-sm">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20">
          <div className="flex items-center justify-between h-full">
            <div className="flex items-center space-x-4">
              {showBackButton && (
                <button
                  onClick={() => navigate(-1)}
                  className="flex items-center text-slate-600 hover:text-slate-900 transition-all duration-200"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
              )}
              <Link to="/" className="flex items-center group">
                <img 
                  src={logo} 
                  alt="GhumoAI Logo" 
                  className="w-48 h-16 object-contain transform group-hover:scale-105 transition-transform duration-200"
                />
              </Link>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden flex items-center text-slate-600 hover:text-slate-900 transition-all duration-200"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-6">
              {navLinks.map(({ path, icon: Icon, label }) => (
                <Link
                  key={path}
                  to={path}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    isActive(path)
                      ? 'bg-blue-50 text-blue-600 shadow-sm'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{label}</span>
                </Link>
              ))}
              {user ? (
                <div className="flex items-center space-x-4 pl-4 border-l border-slate-200">
                  <span className="text-sm text-slate-600">{user.email}</span>
                  <button
                    onClick={handleSignOut}
                    className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all duration-200"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  <User className="w-4 h-4" />
                  <span>Sign In</span>
                </button>
              )}
            </div>
          </div>

          {/* Mobile Navigation */}
          <div
            className={`lg:hidden fixed inset-x-0 top-16 bg-white border-b border-slate-200 shadow-lg transition-all duration-300 transform ${
              isMobileMenuOpen ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
            }`}
          >
            <div className="px-4 py-6 space-y-4">
              {navLinks.map(({ path, icon: Icon, label }) => (
                <Link
                  key={path}
                  to={path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-all duration-200 ${
                    isActive(path)
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{label}</span>
                </Link>
              ))}
              {user ? (
                <div className="border-t border-slate-200 pt-4 mt-4">
                  <div className="px-4 py-2 text-sm text-slate-600">{user.email}</div>
                  <button
                    onClick={() => {
                      handleSignOut();
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-base font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all duration-200"
                  >
                    <LogOut className="w-5 h-5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setShowAuthModal(true);
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-base font-medium bg-blue-600 text-white hover:bg-blue-700 transition-all duration-200"
                >
                  <User className="w-5 h-5" />
                  <span>Sign In</span>
                </button>
              )}
            </div>
          </div>
        </nav>
      </header>
      {/* Spacer div to prevent content from going under navbar */}
      <div className="h-20" />
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </>
  );
};

export default Navbar; 