import { useState } from 'react';
import { Plus, Eye, EyeOff, Calendar, DollarSign, MapPin, X, Clock, Users } from 'lucide-react';
import { VerificationStatus, TourType } from '../types';
import type { Tour, Booking, User } from '../types';

interface OwnerViewProps {
  tours: Tour[];
  bookings: Booking[];
  user: User;
  onAddTour: (tour: Omit<Tour, 'id'>) => void;
  onUpdateTour: (id: string, tour: Partial<Tour>) => void;
  onToggleAvailability: (id: string) => void;
  onUpdateBookingStatus: (id: string, status: 'CONFIRMED' | 'CANCELLED' | 'COMPLETED') => void;
}

export default function OwnerView({
  tours,
  bookings,
  user,
  onAddTour,
  onToggleAvailability,
  onUpdateBookingStatus,
}: OwnerViewProps) {
  const [activeTab, setActiveTab] = useState<'tours' | 'bookings'>('tours');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTour, setNewTour] = useState({
    name: '',
    type: TourType.ADVENTURE_TREK as Tour['type'],
    pricePerPerson: 0,
    location: '',
    image: '',
    description: '',
    features: '',
    duration: 1,
    maxGroupSize: 10,
    difficulty: 'Moderate' as Tour['difficulty'],
  });

  const myTours = tours.filter(t => t.ownerId === user.id);
  const myTourIds = myTours.map(t => t.id);
  const myBookings = bookings.filter(b => myTourIds.includes(b.tourId));

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CONFIRMED': return 'bg-green-100 text-green-800';
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'COMPLETED': return 'bg-blue-100 text-blue-800';
      case 'CANCELLED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getVerificationColor = (status: string) => {
    switch (status) {
      case 'VERIFIED': return 'bg-green-100 text-green-800';
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'REJECTED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-700';
      case 'Moderate': return 'bg-yellow-100 text-yellow-700';
      case 'Challenging': return 'bg-orange-100 text-orange-700';
      case 'Extreme': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const handleAddTour = () => {
    if (!newTour.name || !newTour.location || !newTour.pricePerPerson || !newTour.duration) {
      alert('Please fill all required fields');
      return;
    }

    const tour: Omit<Tour, 'id'> = {
      ownerId: user.id,
      name: newTour.name,
      type: newTour.type,
      pricePerPerson: Number(newTour.pricePerPerson),
      location: newTour.location,
      image: newTour.image || 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=400',
      description: newTour.description,
      features: newTour.features.split(',').map(f => f.trim()).filter(Boolean),
      available: true,
      verificationStatus: VerificationStatus.PENDING,
      duration: Number(newTour.duration),
      maxGroupSize: Number(newTour.maxGroupSize),
      difficulty: newTour.difficulty,
    };

    onAddTour(tour);
    setShowAddModal(false);
    setNewTour({
      name: '',
      type: TourType.ADVENTURE_TREK,
      pricePerPerson: 0,
      location: '',
      image: '',
      description: '',
      features: '',
      duration: 1,
      maxGroupSize: 10,
      difficulty: 'Moderate',
    });
  };

  const calculateEarnings = () => {
    return myBookings
      .filter(b => b.status === 'COMPLETED')
      .reduce((sum, b) => sum + b.totalPrice, 0);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Gradient Header */}
      <div className="bg-gradient-to-r from-purple-900 to-indigo-900 text-white">
        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold mb-2">Tour Operator Dashboard</h1>
              <p className="text-purple-200 text-lg">Welcome back, {user.name}. Manage your packages and bookings.</p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-6 py-3 bg-white text-purple-900 rounded-xl font-semibold hover:bg-purple-50 transition-all shadow-lg self-start"
            >
              <Plus className="w-5 h-5" />
              Add Tour Package
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
          <p className="text-gray-500 text-sm mb-1 font-medium">Tour Packages</p>
          <p className="text-3xl font-bold text-gray-900">{myTours.length}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
          <p className="text-gray-500 text-sm mb-1 font-medium">Active Bookings</p>
          <p className="text-3xl font-bold text-blue-600">
            {myBookings.filter(b => b.status === 'CONFIRMED').length}
          </p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
          <p className="text-gray-500 text-sm mb-1 font-medium">Pending Requests</p>
          <p className="text-3xl font-bold text-yellow-600">
            {myBookings.filter(b => b.status === 'PENDING').length}
          </p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
          <p className="text-gray-500 text-sm mb-1 font-medium">Total Earnings</p>
          <p className="text-3xl font-bold text-green-600">
            NPR {calculateEarnings().toLocaleString()}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-8 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('tours')}
          className={`px-6 py-3 font-semibold border-b-2 transition-colors ${
            activeTab === 'tours'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          My Tour Packages ({myTours.length})
        </button>
        <button
          onClick={() => setActiveTab('bookings')}
          className={`px-6 py-3 font-semibold border-b-2 transition-colors ${
            activeTab === 'bookings'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          Booking Requests ({myBookings.length})
        </button>
      </div>

      {/* My Tours Tab */}
      {activeTab === 'tours' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {myTours.map((tour) => (
            <div key={tour.id} className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="relative h-48 bg-gray-200">
                <img
                  src={tour.image}
                  alt={tour.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4 flex gap-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getVerificationColor(tour.verificationStatus)}`}>
                    {tour.verificationStatus}
                  </span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{tour.name}</h3>
                <div className="space-y-2 text-sm text-gray-600 mb-3">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>{tour.location}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{tour.duration} days</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>Max {tour.maxGroupSize}</span>
                    </div>
                  </div>
                  <div>
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${getDifficultyColor(tour.difficulty)}`}>
                      {tour.difficulty}
                    </span>
                  </div>
                </div>
                <div className="mb-4">
                  <span className="text-2xl font-bold text-blue-600">
                    NPR {tour.pricePerPerson.toLocaleString()}
                  </span>
                  <span className="text-gray-500 text-sm">/person</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => onToggleAvailability(tour.id)}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                      tour.available
                        ? 'bg-green-100 text-green-700 hover:bg-green-200'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {tour.available ? (
                      <>
                        <Eye className="w-4 h-4" />
                        Active
                      </>
                    ) : (
                      <>
                        <EyeOff className="w-4 h-4" />
                        Inactive
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}

          {myTours.length === 0 && (
            <div className="col-span-full text-center py-12 bg-white rounded-lg">
              <p className="text-gray-500 mb-4">No tour packages listed yet</p>
              <button
                onClick={() => setShowAddModal(true)}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Add your first tour package
              </button>
            </div>
          )}
        </div>
      )}

      {/* Booking Requests Tab */}
      {activeTab === 'bookings' && (
        <div className="space-y-4">
          {myBookings.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg">
              <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No booking requests yet</p>
            </div>
          ) : (
            myBookings.map((booking) => {
              const tour = tours.find(t => t.id === booking.tourId);
              if (!tour) return null;

              return (
                <div key={booking.id} className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    <img
                      src={tour.image}
                      alt={tour.name}
                      className="w-full md:w-48 h-32 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">{tour.name}</h3>
                          <p className="text-sm text-gray-600">Booking ID: {booking.id}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(booking.status)}`}>
                          {booking.status}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-600 mb-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>{booking.startDate} → {booking.endDate}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4" />
                          <span>{booking.numPeople} traveler{booking.numPeople > 1 ? 's' : ''}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          <span>{booking.destination}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4" />
                          <span className="font-semibold text-gray-900">NPR {booking.totalPrice.toLocaleString()}</span>
                        </div>
                      </div>
                      {booking.status === 'PENDING' && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => onUpdateBookingStatus(booking.id, 'CONFIRMED')}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => onUpdateBookingStatus(booking.id, 'CANCELLED')}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
                          >
                            Decline
                          </button>
                        </div>
                      )}
                      {booking.status === 'CONFIRMED' && (
                        <button
                          onClick={() => onUpdateBookingStatus(booking.id, 'COMPLETED')}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                        >
                          Mark as Completed
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      </div>
      {/* Add Tour Package Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8 shadow-2xl">
            <div className="flex items-start justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Add New Tour Package</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tour Name *</label>
                <input
                  type="text"
                  value={newTour.name}
                  onChange={(e) => setNewTour({ ...newTour, name: e.target.value })}
                  placeholder="e.g., Annapurna Base Camp Trek"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tour Type *</label>
                  <select
                    value={newTour.type}
                    onChange={(e) => setNewTour({ ...newTour, type: e.target.value as Tour['type'] })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Adventure Trek">Adventure Trek</option>
                    <option value="Cultural Tour">Cultural Tour</option>
                    <option value="Wildlife Safari">Wildlife Safari</option>
                    <option value="Mountain Expedition">Mountain Expedition</option>
                    <option value="Pilgrimage">Pilgrimage</option>
                    <option value="City Tour">City Tour</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price per Person (NPR) *</label>
                  <input
                    type="number"
                    value={newTour.pricePerPerson || ''}
                    onChange={(e) => setNewTour({ ...newTour, pricePerPerson: Number(e.target.value) })}
                    placeholder="25000"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Starting Location *</label>
                <input
                  type="text"
                  value={newTour.location}
                  onChange={(e) => setNewTour({ ...newTour, location: e.target.value })}
                  placeholder="Kathmandu"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Duration (Days) *</label>
                  <input
                    type="number"
                    value={newTour.duration || ''}
                    onChange={(e) => setNewTour({ ...newTour, duration: Number(e.target.value) })}
                    placeholder="5"
                    min="1"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Max Group Size</label>
                  <input
                    type="number"
                    value={newTour.maxGroupSize || ''}
                    onChange={(e) => setNewTour({ ...newTour, maxGroupSize: Number(e.target.value) })}
                    placeholder="12"
                    min="1"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
                  <select
                    value={newTour.difficulty}
                    onChange={(e) => setNewTour({ ...newTour, difficulty: e.target.value as Tour['difficulty'] })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Moderate">Moderate</option>
                    <option value="Challenging">Challenging</option>
                    <option value="Extreme">Extreme</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
                <input
                  type="text"
                  value={newTour.image}
                  onChange={(e) => setNewTour({ ...newTour, image: e.target.value })}
                  placeholder="https://example.com/tour-image.jpg"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={newTour.description}
                  onChange={(e) => setNewTour({ ...newTour, description: e.target.value })}
                  placeholder="Describe your tour package..."
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Inclusions (comma-separated)</label>
                <input
                  type="text"
                  value={newTour.features}
                  onChange={(e) => setNewTour({ ...newTour, features: e.target.value })}
                  placeholder="Expert Guide, Permits, Accommodation, Meals"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddTour}
                  className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Add Tour Package
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
