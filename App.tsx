
import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Auth from './components/Auth';
import LandingPage from './components/LandingPage';
import CustomerView from './components/CustomerView';
import OwnerView from './components/OwnerView';
import StaffView from './components/StaffView';
import AdminView from './components/AdminView';
import ProfileView from './components/ProfileView';
import { User, UserRole, Tour, Booking, AppNotification } from './types';
import { MOCK_TOURS, MOCK_BOOKINGS } from './constants';
import { ensureAdminStaffAccounts } from './services/initUsers';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState('home');
  const [showLogin, setShowLogin] = useState(false);

  // Initialize default admin/staff accounts on first load
  useEffect(() => {
    ensureAdminStaffAccounts();
  }, []);

  // Simulating Backend Database State
  const [tours, setTours] = useState<Tour[]>(MOCK_TOURS);
  const [bookings, setBookings] = useState<Booking[]>(MOCK_BOOKINGS);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);

  const handleAddNotification = (notification: Omit<AppNotification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: AppNotification = {
      ...notification,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString(),
      read: false,
    };
    setNotifications(prev => [newNotification, ...prev]);
  };

  const handleMarkNotificationsRead = (role: UserRole) => {
    setNotifications(prev =>
      prev.map(n => (n.forRole === role || n.forRole === 'ALL') ? { ...n, read: true } : n)
    );
  };

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
    setCurrentView('dashboard');
    setShowLogin(false);
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentView('home');
    setShowLogin(false);
  };

  // Simulate creating a booking
  const handleCreateBooking = (booking: Omit<Booking, 'id'>) => {
    const newBooking = {
      ...booking,
      id: Math.random().toString(36).substr(2, 9),
    };
    setBookings(prev => [newBooking, ...prev]);
    alert("Booking request sent successfully! The tour operator will review it.");
  };

  const handleAddTour = (tour: Omit<Tour, 'id'>) => {
    const newTour = {
      ...tour,
      id: Math.random().toString(36).substr(2, 9),
    };
    setTours(prev => [...prev, newTour]);
    alert("Tour package listed successfully!");
  };

  // Simulate operator approving/rejecting
  const handleUpdateBookingStatus = (bookingId: string, status: 'CONFIRMED' | 'CANCELLED' | 'COMPLETED') => {
    setBookings(prev => prev.map(b =>
      b.id === bookingId ? { ...b, status } : b
    ));
  };

  // Handle tour updates (Verification, Availability)
  const handleUpdateTour = (id: string, updates: Partial<Tour>) => {
    setTours(prev => prev.map(t =>
        t.id === id ? { ...t, ...updates } : t
    ));
  };

  // Simulate toggling availability
  const handleToggleAvailability = (tourId: string) => {
    setTours(prev => prev.map(t =>
      t.id === tourId ? { ...t, available: !t.available } : t
    ));
  };

  const renderContent = () => {
    if (!user) {
      if (showLogin) {
        return <Auth onLogin={handleLogin} />;
      }
      return <LandingPage onGetStarted={() => setShowLogin(true)} tours={tours} />;
    }

    // Authenticated Views
    return (
      <div className="min-h-screen bg-gray-50 font-sans">
        <Navbar
          user={user}
          onLogout={handleLogout}
          onViewChange={setCurrentView}
          currentView={currentView}
          notifications={notifications}
          onMarkNotificationsRead={handleMarkNotificationsRead}
        />

        <main className="fade-in pb-20">
          {currentView === 'profile' && (
            <ProfileView user={user} bookings={bookings} tours={tours} />
          )}

          {(currentView === 'dashboard' || currentView === 'customer') && user.role === UserRole.CUSTOMER && (
            <CustomerView
              user={user}
              tours={tours}
              bookings={bookings}
              onCreateBooking={handleCreateBooking}
            />
          )}

          {(currentView === 'dashboard' || currentView === 'owner') && user.role === UserRole.OWNER && (
            <OwnerView
              user={user}
              tours={tours}
              bookings={bookings}
              onUpdateBookingStatus={handleUpdateBookingStatus}
              onAddTour={handleAddTour}
              onToggleAvailability={handleToggleAvailability}
              onUpdateTour={handleUpdateTour}
            />
          )}

          {(currentView === 'dashboard' || currentView === 'staff') && user.role === UserRole.STAFF && (
            <StaffView
              user={user}
              tours={tours}
              bookings={bookings}
              onUpdateBookingStatus={handleUpdateBookingStatus}
              onUpdateTour={handleUpdateTour}
              onAddTour={handleAddTour}
              onAddNotification={handleAddNotification}
            />
          )}

          {(currentView === 'dashboard' || currentView === 'admin') && user.role === UserRole.ADMIN && (
            <AdminView
              user={user}
              tours={tours}
              bookings={bookings}
              onUpdateTour={handleUpdateTour}
              onAddTour={handleAddTour}
            />
          )}
        </main>

        {/* Footer */}
        <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
          <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <h2 className="text-white font-bold text-xl mb-4">Community Tours and Travels</h2>
              <p className="text-sm leading-relaxed max-w-xs">
                Empowering travelers to explore the Himalayas with unforgettable tour experiences.
                Connecting tour operators with global adventurers.
              </p>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Platform</h3>
              <ul className="space-y-2 text-sm">
                <li><button className="hover:text-white">Browse Tours</button></li>
                <li><button className="hover:text-white">List Your Tour</button></li>
                <li><button className="hover:text-white">Travel Insurance</button></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-sm">
                <li><button className="hover:text-white">Help Center</button></li>
                <li><button className="hover:text-white">Emergency Support</button></li>
                <li><button className="hover:text-white">Contact Us</button></li>
              </ul>
            </div>
          </div>
          <div className="max-w-7xl mx-auto px-4 mt-12 pt-8 border-t border-slate-800 text-sm text-center">
            &copy; {new Date().getFullYear()} Community Tours and Travels Pvt. Ltd. Kathmandu.
          </div>
        </footer>
      </div>
    );
  };

  return renderContent();
};

export default App;
