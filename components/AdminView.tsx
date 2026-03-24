import { useState } from 'react';
import { Shield, Compass, Users, DollarSign, TrendingUp, CheckCircle, XCircle, AlertTriangle, UserPlus, Search, MapPin, Calendar, Clock, PlusCircle } from 'lucide-react';
import { VerificationStatus, UserRole, TourType } from '../types';
import type { Tour, Booking, User } from '../types';

interface AdminViewProps {
  tours: Tour[];
  bookings: Booking[];
  user: User;
  onUpdateTour: (id: string, tour: Partial<Tour>) => void;
  onAddTour: (tour: Omit<Tour, 'id'>) => void;
}

export default function AdminView({ tours, bookings, user, onUpdateTour, onAddTour }: AdminViewProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'tours' | 'add-tour' | 'staff' | 'analytics'>('overview');
  const [newTour, setNewTour] = useState({
    name: '',
    type: TourType.ADVENTURE_TREK as TourType,
    location: '',
    pricePerPerson: '',
    duration: '',
    maxGroupSize: '',
    difficulty: 'Moderate' as 'Easy' | 'Moderate' | 'Challenging' | 'Extreme',
    description: '',
    features: '',
    image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800',
  });
  const [addTourError, setAddTourError] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'PENDING' | 'VERIFIED' | 'REJECTED'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddStaffModal, setShowAddStaffModal] = useState(false);
  const [newStaff, setNewStaff] = useState({
    name: '',
    email: '',
    phone: '',
    password: ''
  });

  // Get all staff members from localStorage
  const getAllUsers = (): User[] => {
    const usersData = localStorage.getItem('users');
    return usersData ? JSON.parse(usersData) : [];
  };

  const staffMembers = getAllUsers().filter(u => u.role === UserRole.STAFF || u.role === UserRole.ADMIN);

  // Statistics
  const totalTours = tours.length;
  const verifiedTours = tours.filter(t => t.verificationStatus === VerificationStatus.VERIFIED).length;
  const pendingTours = tours.filter(t => t.verificationStatus === VerificationStatus.PENDING).length;
  const rejectedTours = tours.filter(t => t.verificationStatus === VerificationStatus.REJECTED).length;
  const totalBookings = bookings.length;
  const activeBookings = bookings.filter(b => b.status === 'CONFIRMED').length;
  const completedBookings = bookings.filter(b => b.status === 'COMPLETED').length;
  const totalRevenue = bookings
    .filter(b => b.status === 'COMPLETED')
    .reduce((sum, b) => sum + b.totalPrice, 0);

  // Unique operators count
  const uniqueOperators = new Set(tours.map(t => t.ownerId)).size;

  // Filtered tours
  const filteredTours = tours.filter(t => {
    const statusMatch = filterStatus === 'all' || t.verificationStatus === filterStatus;
    const searchMatch = searchQuery === '' ||
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.type.toLowerCase().includes(searchQuery.toLowerCase());
    return statusMatch && searchMatch;
  });

  // Location statistics
  const locationStats = tours.reduce((acc, t) => {
    acc[t.location] = (acc[t.location] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Type statistics
  const typeStats = tours.reduce((acc, t) => {
    acc[t.type] = (acc[t.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'VERIFIED': return 'bg-green-100 text-green-800 border-green-200';
      case 'PENDING': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'REJECTED': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleQuickVerify = (tourId: string, status: VerificationStatus.VERIFIED | VerificationStatus.REJECTED) => {
    onUpdateTour(tourId, { verificationStatus: status });
  };

  const handleAddTourSubmit = () => {
    if (!newTour.name || !newTour.location || !newTour.pricePerPerson || !newTour.duration || !newTour.maxGroupSize) {
      setAddTourError('Please fill in all required fields.');
      return;
    }
    setAddTourError('');
    onAddTour({
      name: newTour.name,
      type: newTour.type,
      location: newTour.location,
      pricePerPerson: Number(newTour.pricePerPerson),
      duration: Number(newTour.duration),
      maxGroupSize: Number(newTour.maxGroupSize),
      difficulty: newTour.difficulty,
      description: newTour.description,
      features: newTour.features.split(',').map(f => f.trim()).filter(Boolean),
      image: newTour.image || 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800',
      available: true,
      verificationStatus: VerificationStatus.VERIFIED,
      ownerId: user.id,
    });
    setNewTour({
      name: '', type: TourType.ADVENTURE_TREK, location: '', pricePerPerson: '',
      duration: '', maxGroupSize: '', difficulty: 'Moderate', description: '', features: '',
      image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800',
    });
    alert('Tour package added and published successfully!');
    setActiveTab('tours');
  };

  const handleAddStaff = () => {
    if (!newStaff.name || !newStaff.email || !newStaff.password) {
      alert('Please fill all required fields');
      return;
    }

    const users = getAllUsers();

    // Check if email already exists
    if (users.some(u => u.email === newStaff.email)) {
      alert('Email already exists');
      return;
    }

    const staffUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      name: newStaff.name,
      email: newStaff.email,
      role: UserRole.STAFF
    };

    users.push({ ...staffUser, phone: newStaff.phone, password: newStaff.password } as any);
    localStorage.setItem('users', JSON.stringify(users));

    setNewStaff({ name: '', email: '', phone: '', password: '' });
    setShowAddStaffModal(false);
    alert('Staff member added successfully!');
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Modern Header */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-4xl font-bold">Admin Dashboard</h1>
                <p className="text-gray-300">Platform-wide management and analytics</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-8">
        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Compass className="w-6 h-6 text-blue-600" />
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-gray-900">{totalTours}</p>
                <p className="text-sm text-gray-500">Tour Packages</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="bg-green-100 text-green-700 px-2 py-1 rounded font-medium">{verifiedTours} Verified</span>
              <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded font-medium">{pendingTours} Pending</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-gray-900">NPR {(totalRevenue / 1000).toFixed(0)}K</p>
                <p className="text-sm text-gray-500">Total Revenue</p>
              </div>
            </div>
            <p className="text-sm text-gray-600">{completedBookings} completed bookings</p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-gray-900">{totalBookings}</p>
                <p className="text-sm text-gray-500">Total Bookings</p>
              </div>
            </div>
            <p className="text-sm text-gray-600">{activeBookings} currently active</p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-orange-600" />
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-gray-900">{uniqueOperators}</p>
                <p className="text-sm text-gray-500">Tour Operators</p>
              </div>
            </div>
            <p className="text-sm text-gray-600">{staffMembers.length} staff members</p>
          </div>
        </div>

        {/* Enhanced Tabs */}
        <div className="bg-white rounded-2xl shadow-xl p-2 mb-8 inline-flex gap-2">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-6 py-3 rounded-xl font-semibold transition-all ${
              activeTab === 'overview'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('tours')}
            className={`px-6 py-3 rounded-xl font-semibold transition-all ${
              activeTab === 'tours'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            All Tours ({totalTours})
          </button>
          <button
            onClick={() => setActiveTab('add-tour')}
            className={`px-6 py-3 rounded-xl font-semibold transition-all flex items-center gap-2 ${
              activeTab === 'add-tour'
                ? 'bg-green-600 text-white shadow-lg'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <PlusCircle className="w-4 h-4" />
            Add Tour Package
          </button>
          <button
            onClick={() => setActiveTab('staff')}
            className={`px-6 py-3 rounded-xl font-semibold transition-all ${
              activeTab === 'staff'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Staff Management ({staffMembers.length})
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-6 py-3 rounded-xl font-semibold transition-all ${
              activeTab === 'analytics'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Analytics
          </button>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  onClick={() => setActiveTab('tours')}
                  className="flex items-center gap-3 p-6 border-2 border-yellow-300 bg-yellow-50 rounded-2xl hover:bg-yellow-100 transition-all hover:shadow-lg"
                >
                  <div className="w-12 h-12 bg-yellow-200 rounded-xl flex items-center justify-center">
                    <AlertTriangle className="w-6 h-6 text-yellow-700" />
                  </div>
                  <div className="text-left">
                    <p className="text-2xl font-bold text-gray-900">{pendingTours}</p>
                    <p className="text-sm text-gray-600">Tour packages awaiting verification</p>
                  </div>
                </button>

                <div className="flex items-center gap-3 p-6 border-2 border-green-300 bg-green-50 rounded-2xl">
                  <div className="w-12 h-12 bg-green-200 rounded-xl flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-green-700" />
                  </div>
                  <div className="text-left">
                    <p className="text-2xl font-bold text-gray-900">{verifiedTours}</p>
                    <p className="text-sm text-gray-600">Active tour packages</p>
                  </div>
                </div>

                <button
                  onClick={() => setActiveTab('staff')}
                  className="flex items-center gap-3 p-6 border-2 border-blue-300 bg-blue-50 rounded-2xl hover:bg-blue-100 transition-all hover:shadow-lg"
                >
                  <div className="w-12 h-12 bg-blue-200 rounded-xl flex items-center justify-center">
                    <Users className="w-6 h-6 text-blue-700" />
                  </div>
                  <div className="text-left">
                    <p className="text-2xl font-bold text-gray-900">{staffMembers.length}</p>
                    <p className="text-sm text-gray-600">Manage staff members</p>
                  </div>
                </button>
              </div>
            </div>

            {/* Recent Bookings */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Recent Bookings</h2>
                <span className="text-sm text-gray-500">Last 5 bookings</span>
              </div>
              <div className="space-y-3">
                {bookings.slice(0, 5).map((booking) => {
                  const tour = tours.find(t => t.id === booking.tourId);
                  if (!tour) return null;

                  return (
                    <div key={booking.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                      <div className="flex items-center gap-4">
                        <img
                          src={tour.image}
                          alt={tour.name}
                          className="w-20 h-16 object-cover rounded-lg"
                        />
                        <div>
                          <p className="font-bold text-gray-900">{tour.name}</p>
                          <div className="flex items-center gap-3 text-sm text-gray-600 mt-1">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {new Date(booking.startDate).toLocaleDateString()}
                            </span>
                            <span>→</span>
                            <span>{new Date(booking.endDate).toLocaleDateString()}</span>
                            <span className="flex items-center gap-1">
                              <Users className="w-3 h-3" />
                              {booking.numPeople} pax
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-900 text-lg">NPR {booking.totalPrice.toLocaleString()}</p>
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${
                          booking.status === 'CONFIRMED' ? 'bg-green-100 text-green-800 border-green-200' :
                          booking.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                          booking.status === 'COMPLETED' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                          'bg-red-100 text-red-800 border-red-200'
                        }`}>
                          {booking.status}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Tours Tab */}
        {activeTab === 'tours' && (
          <div>
            {/* Search and Filter */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-gray-100">
              <div className="flex flex-col md:flex-row gap-4 items-end">
                <div className="flex-1">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Search Tour Packages</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search by name, location, or type..."
                      className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Filter by Status</label>
                  <div className="flex gap-2">
                    {(['all', 'PENDING', 'VERIFIED', 'REJECTED'] as const).map((status) => (
                      <button
                        key={status}
                        onClick={() => setFilterStatus(status)}
                        className={`px-4 py-3 rounded-xl font-semibold transition-all ${
                          filterStatus === status
                            ? 'bg-blue-600 text-white shadow-lg'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {status === 'all' ? 'All' : status}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Results Count */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-gray-600">
                  Showing <span className="font-bold text-gray-900">{filteredTours.length}</span> of <span className="font-bold">{totalTours}</span> tour packages
                </p>
              </div>
            </div>

            {/* Tour List */}
            <div className="space-y-4">
              {filteredTours.map((tour) => (
                <div key={tour.id} className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-all">
                  <div className="flex flex-col md:flex-row">
                    {/* Tour Image */}
                    <div className="w-full md:w-64 h-48 md:h-auto bg-gray-200 flex-shrink-0">
                      <img
                        src={tour.image}
                        alt={tour.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Tour Details */}
                    <div className="flex-1 p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-2xl font-bold text-gray-900 mb-1">{tour.name}</h3>
                          <div className="flex items-center gap-3 text-sm text-gray-600">
                            <span className="font-medium">{tour.type}</span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              {tour.location}
                            </span>
                          </div>
                        </div>
                        <span className={`px-4 py-2 rounded-xl text-sm font-semibold border ${getStatusColor(tour.verificationStatus)}`}>
                          {tour.verificationStatus}
                        </span>
                      </div>

                      {/* Tour Info Grid */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 p-4 bg-gray-50 rounded-xl">
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Duration</p>
                          <p className="font-bold text-gray-900 flex items-center gap-1">
                            <Clock className="w-4 h-4 text-blue-600" />
                            {tour.duration} days
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Price per Person</p>
                          <p className="font-bold text-gray-900">NPR {tour.pricePerPerson.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Max Group</p>
                          <p className="font-bold text-gray-900 flex items-center gap-1">
                            <Users className="w-4 h-4 text-purple-600" />
                            {tour.maxGroupSize} pax
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Difficulty</p>
                          <p className={`font-bold ${
                            tour.difficulty === 'Easy' ? 'text-green-600' :
                            tour.difficulty === 'Moderate' ? 'text-yellow-600' :
                            tour.difficulty === 'Challenging' ? 'text-orange-600' :
                            'text-red-600'
                          }`}>
                            {tour.difficulty}
                          </p>
                        </div>
                      </div>

                      {/* Inclusions */}
                      {tour.features && tour.features.length > 0 && (
                        <div className="mb-4">
                          <p className="text-sm text-gray-600 mb-2">Inclusions:</p>
                          <div className="flex flex-wrap gap-2">
                            {tour.features.slice(0, 5).map((feature, idx) => (
                              <span key={idx} className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-medium">
                                {feature}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Action Buttons */}
                      {tour.verificationStatus === VerificationStatus.PENDING && (
                        <div className="flex gap-3 pt-4 border-t border-gray-200">
                          <button
                            onClick={() => handleQuickVerify(tour.id, VerificationStatus.REJECTED)}
                            className="flex-1 px-6 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-all shadow-lg flex items-center justify-center gap-2"
                          >
                            <XCircle className="w-5 h-5" />
                            Reject
                          </button>
                          <button
                            onClick={() => handleQuickVerify(tour.id, VerificationStatus.VERIFIED)}
                            className="flex-1 px-6 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-all shadow-lg flex items-center justify-center gap-2"
                          >
                            <CheckCircle className="w-5 h-5" />
                            Verify
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {filteredTours.length === 0 && (
                <div className="text-center py-20 bg-white rounded-2xl shadow-lg">
                  <Compass className="w-20 h-20 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-gray-400 mb-2">No tour packages found</h3>
                  <p className="text-gray-500">Try adjusting your search or filter criteria</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Add Tour Package Tab */}
        {activeTab === 'add-tour' && (
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <PlusCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Add New Tour Package</h2>
                <p className="text-sm text-gray-600">Packages added here are auto-verified and published immediately</p>
              </div>
            </div>

            {addTourError && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">{addTourError}</div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Tour Name *</label>
                <input type="text" value={newTour.name} onChange={e => setNewTour({ ...newTour, name: e.target.value })}
                  placeholder="e.g. Annapurna Base Camp Trek"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Tour Type *</label>
                <select value={newTour.type} onChange={e => setNewTour({ ...newTour, type: e.target.value as TourType })}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent">
                  {Object.values(TourType).map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Location / Starting Point *</label>
                <input type="text" value={newTour.location} onChange={e => setNewTour({ ...newTour, location: e.target.value })}
                  placeholder="e.g. Pokhara"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Price per Person (NPR) *</label>
                <input type="number" value={newTour.pricePerPerson} onChange={e => setNewTour({ ...newTour, pricePerPerson: e.target.value })}
                  placeholder="e.g. 25000"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Duration (days) *</label>
                <input type="number" value={newTour.duration} onChange={e => setNewTour({ ...newTour, duration: e.target.value })}
                  placeholder="e.g. 7"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Max Group Size *</label>
                <input type="number" value={newTour.maxGroupSize} onChange={e => setNewTour({ ...newTour, maxGroupSize: e.target.value })}
                  placeholder="e.g. 12"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Difficulty</label>
                <select value={newTour.difficulty} onChange={e => setNewTour({ ...newTour, difficulty: e.target.value as any })}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent">
                  {['Easy', 'Moderate', 'Challenging', 'Extreme'].map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Cover Image URL</label>
                <input type="text" value={newTour.image} onChange={e => setNewTour({ ...newTour, image: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent" />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Inclusions / Features <span className="text-gray-400 font-normal">(comma-separated)</span></label>
                <input type="text" value={newTour.features} onChange={e => setNewTour({ ...newTour, features: e.target.value })}
                  placeholder="e.g. Guided trek, Meals included, Accommodation, Porter service"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent" />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                <textarea value={newTour.description} onChange={e => setNewTour({ ...newTour, description: e.target.value })}
                  rows={4} placeholder="Describe the tour experience..."
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent" />
              </div>
            </div>

            <div className="flex gap-4 mt-8">
              <button onClick={() => { setNewTour({ name: '', type: TourType.ADVENTURE_TREK, location: '', pricePerPerson: '', duration: '', maxGroupSize: '', difficulty: 'Moderate', description: '', features: '', image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800' }); setAddTourError(''); }}
                className="px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all">
                Clear
              </button>
              <button onClick={handleAddTourSubmit}
                className="flex-1 px-8 py-4 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-all shadow-lg flex items-center justify-center gap-2">
                <PlusCircle className="w-5 h-5" />
                Publish Tour Package
              </button>
            </div>
          </div>
        )}

        {/* Staff Management Tab */}
        {activeTab === 'staff' && (
          <div>
            {/* Header with Add Button */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Staff Management</h2>
                  <p className="text-gray-600">Manage staff members who can verify tour packages and bookings</p>
                </div>
                <button
                  onClick={() => setShowAddStaffModal(true)}
                  className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-all shadow-lg flex items-center gap-2"
                >
                  <UserPlus className="w-5 h-5" />
                  Add Staff Member
                </button>
              </div>
            </div>

            {/* Staff List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {staffMembers.map((staff) => (
                <div key={staff.id} className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-xl">
                      {staff.name[0].toUpperCase()}
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      staff.role === UserRole.ADMIN
                        ? 'bg-purple-100 text-purple-700 border border-purple-200'
                        : 'bg-blue-100 text-blue-700 border border-blue-200'
                    }`}>
                      {staff.role}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-1">{staff.name}</h3>
                  <p className="text-sm text-gray-600 mb-4">{staff.email}</p>

                  <div className="pt-4 border-t border-gray-200">
                    <p className="text-xs text-gray-500">Member ID: {staff.id}</p>
                  </div>
                </div>
              ))}
            </div>

            {staffMembers.length === 0 && (
              <div className="text-center py-20 bg-white rounded-2xl shadow-lg">
                <Users className="w-20 h-20 text-gray-300 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-400 mb-2">No staff members yet</h3>
                <p className="text-gray-500 mb-6">Add your first staff member to help manage the platform</p>
                <button
                  onClick={() => setShowAddStaffModal(true)}
                  className="bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-all shadow-lg inline-flex items-center gap-2"
                >
                  <UserPlus className="w-5 h-5" />
                  Add Staff Member
                </button>
              </div>
            )}
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            {/* Tours by Location */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Tour Packages by Location</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(locationStats).map(([location, count]) => (
                  <div key={location} className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100">
                    <MapPin className="w-8 h-8 text-blue-600 mb-3" />
                    <p className="text-3xl font-bold text-gray-900">{count}</p>
                    <p className="text-sm text-gray-600 font-medium">{location}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Tours by Type */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Tour Packages by Type</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(typeStats).map(([type, count]) => (
                  <div key={type} className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-100">
                    <Compass className="w-8 h-8 text-purple-600 mb-3" />
                    <p className="text-3xl font-bold text-gray-900">{count}</p>
                    <p className="text-sm text-gray-600 font-medium">{type}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Platform Stats */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Platform Statistics</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-6 bg-green-50 rounded-xl border border-green-100">
                  <p className="text-4xl font-bold text-green-600 mb-2">{totalTours > 0 ? Math.round((verifiedTours / totalTours) * 100) : 0}%</p>
                  <p className="text-sm text-gray-600 font-medium">Verification Rate</p>
                </div>
                <div className="text-center p-6 bg-blue-50 rounded-xl border border-blue-100">
                  <p className="text-4xl font-bold text-blue-600 mb-2">{totalBookings > 0 ? Math.round((activeBookings / totalBookings) * 100) : 0}%</p>
                  <p className="text-sm text-gray-600 font-medium">Active Bookings</p>
                </div>
                <div className="text-center p-6 bg-purple-50 rounded-xl border border-purple-100">
                  <p className="text-4xl font-bold text-purple-600 mb-2">NPR {totalBookings > 0 ? (totalRevenue / totalBookings).toFixed(0) : 0}</p>
                  <p className="text-sm text-gray-600 font-medium">Avg. Booking Value</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add Staff Modal */}
      {showAddStaffModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full p-8 animate-scaleIn">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <UserPlus className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Add Staff Member</h2>
                  <p className="text-sm text-gray-600">Create a new staff account</p>
                </div>
              </div>
              <button
                onClick={() => setShowAddStaffModal(false)}
                className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center hover:bg-gray-200 transition-colors"
              >
                <XCircle className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name *</label>
                <input
                  type="text"
                  value={newStaff.name}
                  onChange={(e) => setNewStaff({ ...newStaff, name: e.target.value })}
                  placeholder="Enter staff member's full name"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email *</label>
                <input
                  type="email"
                  value={newStaff.email}
                  onChange={(e) => setNewStaff({ ...newStaff, email: e.target.value })}
                  placeholder="staff@communitytours.com"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Phone (Optional)</label>
                <input
                  type="tel"
                  value={newStaff.phone}
                  onChange={(e) => setNewStaff({ ...newStaff, phone: e.target.value })}
                  placeholder="+977-XXX-XXXX"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Password *</label>
                <input
                  type="password"
                  value={newStaff.password}
                  onChange={(e) => setNewStaff({ ...newStaff, password: e.target.value })}
                  placeholder="Create a secure password"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex gap-4 mt-8">
              <button
                onClick={() => setShowAddStaffModal(false)}
                className="flex-1 px-6 py-4 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleAddStaff}
                disabled={!newStaff.name || !newStaff.email || !newStaff.password}
                className="flex-1 px-6 py-4 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <UserPlus className="w-5 h-5" />
                Add Staff Member
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
