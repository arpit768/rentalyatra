
import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Auth from './components/Auth';
import LandingPage from './components/LandingPage';
import CustomerView from './components/CustomerView';
import OwnerView from './components/OwnerView';
import StaffView from './components/StaffView';
import AdminView from './components/AdminView';
import ProfileView from './components/ProfileView';
import { User, UserRole, Vehicle, Booking } from './types';
import { MOCK_VEHICLES, MOCK_BOOKINGS } from './constants';
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
  const [vehicles, setVehicles] = useState<Vehicle[]>(MOCK_VEHICLES);
  const [bookings, setBookings] = useState<Booking[]>(MOCK_BOOKINGS);

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

  // Simulate creating a booking (Frontend connected to Backend)
  const handleCreateBooking = (booking: Omit<Booking, 'id'>) => {
    const newBooking = {
      ...booking,
      id: Math.random().toString(36).substr(2, 9),
    };
    setBookings(prev => [newBooking, ...prev]);
    alert("Booking request sent successfully! The owner will review it.");
  };

  const handleAddVehicle = (vehicle: Omit<Vehicle, 'id'>) => {
    const newVehicle = {
      ...vehicle,
      id: Math.random().toString(36).substr(2, 9),
    };
    setVehicles(prev => [...prev, newVehicle]);
    alert("Vehicle listed successfully!");
  };

  // Simulate owner approving/rejecting (Backend logic)
  const handleUpdateBookingStatus = (bookingId: string, status: 'CONFIRMED' | 'CANCELLED' | 'COMPLETED') => {
    setBookings(prev => prev.map(b => 
      b.id === bookingId ? { ...b, status } : b
    ));
  };

  // Handle vehicle updates (Verification, Damage Reports, Availability)
  const handleUpdateVehicle = (id: string, updates: Partial<Vehicle>) => {
    setVehicles(prev => prev.map(v =>
        v.id === id ? { ...v, ...updates } : v
    ));
  };

  // Simulate toggling availability (Simulated API Endpoint)
  const handleToggleAvailability = (vehicleId: string) => {
    setVehicles(prev => prev.map(v => 
      v.id === vehicleId ? { ...v, available: !v.available } : v
    ));
  };

  const renderContent = () => {
    if (!user) {
      if (showLogin) {
        return <Auth onLogin={handleLogin} />;
      }
      return <LandingPage onGetStarted={() => setShowLogin(true)} vehicles={vehicles} />;
    }

    // Authenticated Views
    return (
      <div className="min-h-screen bg-gray-50 font-sans">
        <Navbar user={user} onLogout={handleLogout} onViewChange={setCurrentView} currentView={currentView} />

        <main className="fade-in pb-20">
          {currentView === 'profile' && (
            <ProfileView user={user} bookings={bookings} vehicles={vehicles} />
          )}

          {(currentView === 'dashboard' || currentView === 'customer') && user.role === UserRole.CUSTOMER && (
            <CustomerView
              user={user}
              vehicles={vehicles}
              bookings={bookings}
              onCreateBooking={handleCreateBooking}
            />
          )}

          {(currentView === 'dashboard' || currentView === 'owner') && user.role === UserRole.OWNER && (
            <OwnerView
              user={user}
              vehicles={vehicles}
              bookings={bookings}
              onUpdateBookingStatus={handleUpdateBookingStatus}
              onAddVehicle={handleAddVehicle}
              onToggleAvailability={handleToggleAvailability}
              onUpdateVehicle={handleUpdateVehicle}
            />
          )}

          {(currentView === 'dashboard' || currentView === 'staff') && user.role === UserRole.STAFF && (
            <StaffView
              user={user}
              vehicles={vehicles}
              bookings={bookings}
              onUpdateBookingStatus={handleUpdateBookingStatus}
              onUpdateVehicle={handleUpdateVehicle}
            />
          )}

          {(currentView === 'dashboard' || currentView === 'admin') && user.role === UserRole.ADMIN && (
            <AdminView
              user={user}
              vehicles={vehicles}
              bookings={bookings}
              onUpdateVehicle={handleUpdateVehicle}
            />
          )}
        </main>

        {/* Footer */}
        <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
          <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <h2 className="text-white font-bold text-xl mb-4">Yatra Rentals Nepal</h2>
              <p className="text-sm leading-relaxed max-w-xs">
                Empowering travelers to explore the Himalayas with reliable vehicles. 
                Connecting vehicle owners with global adventurers.
              </p>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Platform</h3>
              <ul className="space-y-2 text-sm">
                <li><button className="hover:text-white">Browse Vehicles</button></li>
                <li><button className="hover:text-white">List Your Car</button></li>
                <li><button className="hover:text-white">Safety & Insurance</button></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-sm">
                <li><button className="hover:text-white">Help Center</button></li>
                <li><button className="hover:text-white">Roadside Assistance</button></li>
                <li><button className="hover:text-white">Contact Us</button></li>
              </ul>
            </div>
          </div>
          <div className="max-w-7xl mx-auto px-4 mt-12 pt-8 border-t border-slate-800 text-sm text-center">
            &copy; {new Date().getFullYear()} Yatra Rentals Pvt. Ltd. Kathmandu.
          </div>
        </footer>
      </div>
    );
  };

  return renderContent();
};

export default App;
