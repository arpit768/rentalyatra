
import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import Auth from './components/Auth';
import LandingPage from './components/LandingPage';
import CustomerView from './components/CustomerView';
import StaffView from './components/StaffView';
import AdminView from './components/AdminView';
import ProfileView from './components/ProfileView';
import TravelInsurancePage from './components/TravelInsurancePage';
import HelpCenterPage from './components/HelpCenterPage';
import EmergencySupportPage from './components/EmergencySupportPage';
import ContactUsPage from './components/ContactUsPage';
import { User, UserRole, Tour, Booking, AppNotification } from './types';
import * as api from './services/api';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState('home');
  const [showLogin, setShowLogin] = useState(false);
  const [tours, setTours] = useState<Tour[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [appLoading, setAppLoading] = useState(true);

  const fetchTours = useCallback(async () => {
    try {
      const data = await api.getTours();
      setTours(data);
    } catch (err) {
      console.error('Failed to fetch tours:', err);
    }
  }, []);

  const fetchBookings = useCallback(async () => {
    try {
      const data = await api.getBookings();
      setBookings(data);
    } catch (err) {
      console.error('Failed to fetch bookings:', err);
    }
  }, []);

  const fetchNotifications = useCallback(async () => {
    try {
      const data = await api.getNotifications();
      setNotifications(data);
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
    }
  }, []);

  // On mount: fetch public tours for landing page and restore session if token exists
  useEffect(() => {
    const init = async () => {
      await fetchTours();
      const token = api.getToken();
      if (token) {
        try {
          const currentUser = await api.getMe();
          setUser(currentUser);
          setCurrentView('dashboard');
        } catch {
          api.clearToken();
        }
      }
      setAppLoading(false);
    };
    init();
  }, []);

  // When user logs in, load their bookings and notifications
  useEffect(() => {
    if (!user) return;
    fetchBookings();
    fetchNotifications();
  }, [user]);

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
    setCurrentView('dashboard');
    setShowLogin(false);
  };

  const handleLogout = async () => {
    await api.logout();
    setUser(null);
    setBookings([]);
    setNotifications([]);
    setCurrentView('home');
    setShowLogin(false);
  };

  const handleMarkNotificationsRead = async (_role: UserRole) => {
    try {
      await api.markNotificationsRead();
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch (err) {
      console.error('Failed to mark notifications read:', err);
    }
  };

  const handleCreateBooking = async (bookingData: Omit<Booking, 'id'>) => {
    try {
      // customerId and status are set by the server
      const { customerId: _c, status: _s, ...rest } = bookingData;
      const newBooking = await api.createBooking(rest);
      setBookings(prev => [newBooking, ...prev]);
      await fetchNotifications();
      alert('Booking request sent successfully!');
    } catch (err: any) {
      alert(err.message || 'Failed to create booking');
    }
  };

  const handleAddTour = async (tourData: Omit<Tour, 'id'>) => {
    try {
      // createdBy is set by the server from the JWT token
      const { createdBy: _cb, ...rest } = tourData;
      const newTour = await api.createTour(rest);
      setTours(prev => [...prev, newTour]);
      await fetchNotifications();
      alert('Tour package listed successfully!');
    } catch (err: any) {
      alert(err.message || 'Failed to create tour');
    }
  };

  const handleUpdateBookingStatus = async (
    bookingId: string,
    status: 'CONFIRMED' | 'CANCELLED' | 'COMPLETED'
  ) => {
    try {
      const updated = await api.updateBookingStatus(bookingId, status);
      setBookings(prev => prev.map(b => b.id === bookingId ? updated : b));
      await fetchNotifications();
    } catch (err: any) {
      alert(err.message || 'Failed to update booking status');
    }
  };

  const handleUpdateTour = async (id: string, updates: Partial<Tour>) => {
    try {
      const updated = await api.updateTour(id, updates);
      setTours(prev => prev.map(t => t.id === id ? updated : t));
      await fetchNotifications();
    } catch (err: any) {
      alert(err.message || 'Failed to update tour');
    }
  };

  if (appLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    if (!user) {
      if (showLogin) {
        return <Auth onLogin={handleLogin} />;
      }
      return <LandingPage onGetStarted={() => setShowLogin(true)} tours={tours} />;
    }

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

          {(currentView === 'dashboard' || currentView === 'staff') && user.role === UserRole.STAFF && (
            <StaffView
              user={user}
              tours={tours}
              bookings={bookings}
              onUpdateBookingStatus={handleUpdateBookingStatus}
              onUpdateTour={handleUpdateTour}
              onAddTour={handleAddTour}
              onAddNotification={() => {}}
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

          {currentView === 'travel-insurance' && (
            <TravelInsurancePage onBack={() => setCurrentView('dashboard')} />
          )}
          {currentView === 'help-center' && (
            <HelpCenterPage onBack={() => setCurrentView('dashboard')} />
          )}
          {currentView === 'emergency-support' && (
            <EmergencySupportPage onBack={() => setCurrentView('dashboard')} />
          )}
          {currentView === 'contact-us' && (
            <ContactUsPage onBack={() => setCurrentView('dashboard')} />
          )}
        </main>

        {/* Footer */}
        <footer className="bg-blue-950 text-blue-200/60 py-8 sm:py-12 border-t border-blue-900">
          <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            <div className="col-span-2 md:col-span-2">
              <div className="flex items-center gap-3 mb-3 sm:mb-4">
                <img src="/logo.jpeg" alt="Logo" className="w-10 h-10 rounded-lg object-cover" />
                <h2 className="text-white font-bold text-lg sm:text-xl">Community Tours and Travels</h2>
              </div>
              <p className="text-xs sm:text-sm leading-relaxed max-w-xs">
                Empowering travelers to explore the Himalayas with unforgettable tour experiences.
              </p>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Platform</h3>
              <ul className="space-y-2 text-sm">
                <li><button onClick={() => { setCurrentView('dashboard'); window.scrollTo(0, 0); }} className="hover:text-white transition-colors">Browse Tours</button></li>
                <li><button onClick={() => { setCurrentView('travel-insurance'); window.scrollTo(0, 0); }} className="hover:text-white transition-colors">Travel Insurance</button></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-sm">
                <li><button onClick={() => { setCurrentView('help-center'); window.scrollTo(0, 0); }} className="hover:text-white transition-colors">Help Center</button></li>
                <li><button onClick={() => { setCurrentView('emergency-support'); window.scrollTo(0, 0); }} className="hover:text-white transition-colors">Emergency Support</button></li>
                <li><button onClick={() => { setCurrentView('contact-us'); window.scrollTo(0, 0); }} className="hover:text-white transition-colors">Contact Us</button></li>
              </ul>
            </div>
          </div>
          <div className="max-w-7xl mx-auto px-4 mt-12 pt-8 border-t border-blue-900 text-sm text-center">
            &copy; {new Date().getFullYear()} Community Tours and Travels Pvt. Ltd. Kathmandu.
          </div>
        </footer>
      </div>
    );
  };

  return renderContent();
};

export default App;
