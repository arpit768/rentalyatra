import { Menu, X, Car, User, LogOut } from 'lucide-react';
import { useState } from 'react';
import type { User as UserType } from '../types';

interface NavbarProps {
  user: UserType | null;
  onLogout: () => void;
  onViewChange: (view: 'customer' | 'owner' | 'staff' | 'admin' | 'profile') => void;
  currentView: string;
}

export default function Navbar({ user, onLogout, onViewChange, currentView }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const getNavLinks = () => {
    if (!user) return [];

    const links: Array<{ label: string; view: 'customer' | 'owner' | 'staff' | 'admin' | 'profile' }> = [];

    switch (user.role) {
      case 'CUSTOMER':
        links.push({ label: 'Browse Vehicles', view: 'customer' });
        break;
      case 'OWNER':
        links.push({ label: 'My Vehicles', view: 'owner' });
        links.push({ label: 'Browse as Customer', view: 'customer' });
        break;
      case 'STAFF':
        links.push({ label: 'Verify Vehicles', view: 'staff' });
        links.push({ label: 'Browse Vehicles', view: 'customer' });
        break;
      case 'ADMIN':
        links.push({ label: 'Admin Panel', view: 'admin' });
        links.push({ label: 'Staff View', view: 'staff' });
        links.push({ label: 'Browse Vehicles', view: 'customer' });
        break;
    }

    return links;
  };

  const navLinks = getNavLinks();

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer">
            <Car className="w-8 h-8 text-blue-600" />
            <div>
              <h1 className="text-xl font-bold text-gray-900">Yatra Rentals</h1>
              <p className="text-xs text-gray-500">Nepal</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {user && navLinks.map((link) => (
              <button
                key={link.view}
                onClick={() => onViewChange(link.view)}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentView === link.view
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* User Menu */}
          {user ? (
            <div className="hidden md:flex items-center gap-4">
              <button
                onClick={() => onViewChange('profile')}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentView === 'profile'
                    ? 'bg-blue-100 text-blue-600'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <User className="w-4 h-4" />
                <span>{user.name}</span>
              </button>
              <button
                onClick={onLogout}
                className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <div className="hidden md:block">
              <span className="text-gray-600 text-sm">Welcome, Guest</span>
            </div>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col gap-2">
              {user && navLinks.map((link) => (
                <button
                  key={link.view}
                  onClick={() => {
                    onViewChange(link.view);
                    setMobileMenuOpen(false);
                  }}
                  className={`px-4 py-3 rounded-md text-left text-sm font-medium transition-colors ${
                    currentView === link.view
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {link.label}
                </button>
              ))}

              {user && (
                <>
                  <button
                    onClick={() => {
                      onViewChange('profile');
                      setMobileMenuOpen(false);
                    }}
                    className={`flex items-center gap-2 px-4 py-3 rounded-md text-left text-sm font-medium transition-colors ${
                      currentView === 'profile'
                        ? 'bg-blue-100 text-blue-600'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <User className="w-4 h-4" />
                    <span>Profile - {user.name}</span>
                  </button>
                  <button
                    onClick={() => {
                      onLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-2 px-4 py-3 rounded-md text-left text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </>
              )}

              {!user && (
                <div className="px-4 py-3 text-gray-600 text-sm">Welcome, Guest</div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
