import { Menu, X, Compass, User, LogOut, Bell, Home } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import type { User as UserType, AppNotification } from '../types';
import { UserRole } from '../types';

interface NavbarProps {
  user: UserType | null;
  onLogout: () => void;
  onViewChange: (view: 'customer' | 'owner' | 'staff' | 'admin' | 'profile' | 'dashboard') => void;
  currentView: string;
  notifications: AppNotification[];
  onMarkNotificationsRead: (role: UserRole) => void;
}

export default function Navbar({ user, onLogout, onViewChange, currentView, notifications, onMarkNotificationsRead }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  // Close notification dropdown on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    };
    if (notifOpen) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [notifOpen]);

  const getNavLinks = () => {
    if (!user) return [];
    const links: Array<{ label: string; view: 'customer' | 'owner' | 'staff' | 'admin' | 'profile' | 'dashboard' }> = [];
    switch (user.role) {
      case 'OWNER':
        links.push({ label: 'My Tour Packages', view: 'owner' });
        break;
    }
    return links;
  };

  const getDisplayName = () => {
    if (!user) return '';
    if (user.role === UserRole.ADMIN) return 'Admin';
    return user.name.split(' ')[0];
  };

  const getRoleBadge = () => {
    if (!user) return '';
    switch (user.role) {
      case UserRole.ADMIN: return 'Administrator';
      case UserRole.STAFF: return 'Staff';
      case UserRole.OWNER: return 'Tour Operator';
      case UserRole.CUSTOMER: return 'Traveler';
      default: return '';
    }
  };

  const userNotifs = notifications.filter(
    n => n.forRole === user?.role || n.forRole === 'ALL'
  );
  const unreadCount = userNotifs.filter(n => !n.read).length;

  const navLinks = getNavLinks();

  const handleNotifToggle = () => {
    setNotifOpen(prev => !prev);
    if (!notifOpen && user) onMarkNotificationsRead(user.role);
  };

  const formatTime = (iso: string) => {
    const d = new Date(iso);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  const getDashboardView = () => {
    if (!user) return 'dashboard' as const;
    switch (user.role) {
      case UserRole.CUSTOMER: return 'customer' as const;
      case UserRole.OWNER: return 'owner' as const;
      case UserRole.STAFF: return 'staff' as const;
      case UserRole.ADMIN: return 'admin' as const;
      default: return 'dashboard' as const;
    }
  };

  return (
    <nav className="bg-white/80 backdrop-blur-xl border-b border-gray-200/60 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button
            onClick={() => onViewChange(getDashboardView())}
            className="flex items-center gap-3 group"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20 group-hover:shadow-blue-600/40 transition-all group-hover:scale-105">
              <Compass className="w-5 h-5 text-white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-bold text-gray-900 leading-tight">Community Tours</h1>
              <p className="text-[10px] text-gray-400 font-medium tracking-wider uppercase -mt-0.5">Nepal</p>
            </div>
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {user && (
              <button
                onClick={() => onViewChange(getDashboardView())}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  currentView === 'dashboard' || currentView === getDashboardView()
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Home className="w-4 h-4" />
                Dashboard
              </button>
            )}
            {user && navLinks.map((link) => (
              <button
                key={link.view}
                onClick={() => onViewChange(link.view)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  currentView === link.view
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* Right Section */}
          {user ? (
            <div className="hidden md:flex items-center gap-2">
              {/* Notification Bell */}
              <div className="relative" ref={notifRef}>
                <button
                  onClick={handleNotifToggle}
                  className="relative p-2.5 rounded-xl text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-all"
                  aria-label="Notifications"
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center font-bold ring-2 ring-white animate-pulse">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </button>

                {/* Notification Dropdown */}
                {notifOpen && (
                  <div className="absolute right-0 mt-2 w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden">
                    <div className="px-5 py-4 bg-gradient-to-r from-gray-50 to-white border-b border-gray-100">
                      <div className="flex items-center justify-between">
                        <h3 className="font-bold text-gray-900">Notifications</h3>
                        {unreadCount > 0 && (
                          <span className="text-xs bg-blue-100 text-blue-700 px-2.5 py-1 rounded-full font-medium">
                            {unreadCount} new
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {userNotifs.length === 0 ? (
                        <div className="px-5 py-12 text-center">
                          <Bell className="w-10 h-10 text-gray-200 mx-auto mb-3" />
                          <p className="text-gray-400 text-sm font-medium">No notifications yet</p>
                        </div>
                      ) : (
                        userNotifs.slice(0, 10).map(n => (
                          <div key={n.id} className={`px-5 py-4 border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors ${!n.read ? 'bg-blue-50/50' : ''}`}>
                            <div className="flex gap-3">
                              <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${!n.read ? 'bg-blue-500' : 'bg-transparent'}`} />
                              <div className="flex-1 min-w-0">
                                <p className="text-sm text-gray-800 leading-relaxed">{n.message}</p>
                                <p className="text-xs text-gray-400 mt-1.5 font-medium">{formatTime(n.timestamp)}</p>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Divider */}
              <div className="w-px h-8 bg-gray-200 mx-1" />

              {/* User Menu */}
              <button
                onClick={() => onViewChange('profile')}
                className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition-all ${
                  currentView === 'profile'
                    ? 'bg-blue-50'
                    : 'hover:bg-gray-50'
                }`}
              >
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center text-white text-xs font-bold shadow-sm">
                  {getDisplayName()[0]?.toUpperCase()}
                </div>
                <div className="text-left">
                  <div className="font-semibold text-gray-900 leading-tight">{getDisplayName()}</div>
                  <div className="text-[10px] text-gray-400 font-medium">{getRoleBadge()}</div>
                </div>
              </button>

              <button
                onClick={onLogout}
                className="p-2.5 rounded-xl text-gray-400 hover:bg-red-50 hover:text-red-500 transition-all"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="hidden md:block">
              <span className="text-gray-500 text-sm">Welcome, Guest</span>
            </div>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-gray-700 hover:bg-gray-100"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100 animate-slideDown">
            <div className="flex flex-col gap-1">
              {user && (
                <button
                  onClick={() => { onViewChange(getDashboardView()); setMobileMenuOpen(false); }}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-left text-sm font-medium transition-all ${
                    currentView === 'dashboard' || currentView === getDashboardView()
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Home className="w-4 h-4" />
                  Dashboard
                </button>
              )}
              {user && navLinks.map((link) => (
                <button
                  key={link.view}
                  onClick={() => { onViewChange(link.view); setMobileMenuOpen(false); }}
                  className={`px-4 py-3 rounded-xl text-left text-sm font-medium transition-all ${
                    currentView === link.view
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {link.label}
                </button>
              ))}

              {user && (
                <>
                  {/* Mobile Notification Bell */}
                  <button
                    onClick={() => { handleNotifToggle(); }}
                    className="flex items-center justify-between px-4 py-3 rounded-xl text-left text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <Bell className="w-4 h-4" />
                      <span>Notifications</span>
                    </div>
                    {unreadCount > 0 && (
                      <span className="w-6 h-6 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </button>

                  {/* Mobile Notifications Expanded */}
                  {notifOpen && (
                    <div className="mx-4 mb-2 bg-gray-50 rounded-xl overflow-hidden border border-gray-200">
                      <div className="max-h-64 overflow-y-auto">
                        {userNotifs.length === 0 ? (
                          <div className="px-4 py-6 text-center text-gray-400 text-sm">No notifications</div>
                        ) : (
                          userNotifs.slice(0, 5).map(n => (
                            <div key={n.id} className={`px-4 py-3 border-b border-gray-100 last:border-0 ${!n.read ? 'bg-blue-50/50' : ''}`}>
                              <p className="text-sm text-gray-800">{n.message}</p>
                              <p className="text-xs text-gray-400 mt-1">{formatTime(n.timestamp)}</p>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}

                  <div className="h-px bg-gray-100 mx-4 my-1" />

                  <button
                    onClick={() => { onViewChange('profile'); setMobileMenuOpen(false); }}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-left text-sm font-medium transition-all ${
                      currentView === 'profile'
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <div className="w-7 h-7 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center text-white text-xs font-bold">
                      {getDisplayName()[0]?.toUpperCase()}
                    </div>
                    <div>
                      <span>{getDisplayName()}</span>
                      <span className="text-gray-400 text-xs ml-2">{getRoleBadge()}</span>
                    </div>
                  </button>
                  <button
                    onClick={() => { onLogout(); setMobileMenuOpen(false); }}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-left text-sm font-medium text-red-600 hover:bg-red-50 transition-all"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </>
              )}

              {!user && (
                <div className="px-4 py-3 text-gray-500 text-sm">Welcome, Guest</div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
