import React, { useState } from 'react';

const Header = ({ currentUserRole, onRoleSwitch, onPageChange, activePage }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '🏠' },
    { id: 'children', label: 'My Children', icon: '👶' },
    { id: 'growth-charts', label: 'Growth Charts', icon: '📈' },
    { id: 'quick-diagnosis', label: 'Quick Diagnosis', icon: '🩺' },
    { id: 'referrals', label: 'Referrals', icon: '📋' },
    { id: 'appointments', label: 'Appointments', icon: '📅' },
    { id: 'providers', label: 'Find Providers', icon: '📍' },
    { id: 'profile', label: 'Profile', icon: '⚙️' }
  ];

  const handleNavClick = (pageId) => {
    onPageChange(pageId);
    setMobileMenuOpen(false);
  };

  return (
    <header className="bg-white shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">🏥</span>
              </div>
              <div className="ml-3">
                <h1 className="text-xl font-bold text-gray-800">PediCare Pro</h1>
                <p className="text-xs text-gray-500">Pediatric Health Management</p>
              </div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-1">
            {navigationItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-1 ${
                  activePage === item.id
                    ? 'bg-blue-100 text-blue-700 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <span className="text-base">{item.icon}</span>
                <span className="hidden lg:inline">{item.label}</span>
              </button>
            ))}
          </nav>

          {/* User Role Switcher & Mobile Menu Button */}
          <div className="flex items-center space-x-4">
            {/* Role Switcher */}
            <div className="hidden sm:flex items-center space-x-2">
              <span className="text-sm text-gray-600">View as:</span>
              <select
                value={currentUserRole}
                onChange={(e) => onRoleSwitch(e.target.value)}
                className="text-sm border border-gray-300 rounded-lg px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="parent">Parent</option>
                <option value="doctor">Doctor</option>
                <option value="nurse">Nurse</option>
              </select>
            </div>

            {/* User Avatar */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-semibold">
                  {currentUserRole === 'parent' ? '👨‍👩‍👧‍👦' : currentUserRole === 'doctor' ? '👨‍⚕️' : '👩‍⚕️'}
                </span>
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-gray-800 capitalize">{currentUserRole}</p>
                <p className="text-xs text-gray-500">
                  {currentUserRole === 'parent' ? 'Family Account' : 'Healthcare Provider'}
                </p>
              </div>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <div className="space-y-2">
              {navigationItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-3 ${
                    activePage === item.id
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
            
            {/* Mobile Role Switcher */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="px-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">View as:</label>
                <select
                  value={currentUserRole}
                  onChange={(e) => onRoleSwitch(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="parent">Parent</option>
                  <option value="doctor">Doctor</option>
                  <option value="nurse">Nurse</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;