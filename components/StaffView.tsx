import { useState } from 'react';
import { CheckCircle, XCircle, AlertTriangle, Compass, FileText, MapPin, DollarSign, Clock, Users, PlusCircle } from 'lucide-react';
import { VerificationStatus, TourType, UserRole } from '../types';
import type { Tour, Booking, User, AppNotification } from '../types';

interface StaffViewProps {
  tours: Tour[];
  bookings: Booking[];
  user: User;
  onUpdateTour: (id: string, tour: Partial<Tour>) => void;
  onUpdateBookingStatus: (id: string, status: 'CONFIRMED' | 'CANCELLED' | 'COMPLETED') => void;
  onAddTour: (tour: Omit<Tour, 'id'>) => void;
  onAddNotification: (notification: Omit<AppNotification, 'id' | 'timestamp' | 'read'>) => void;
}

export default function StaffView({
  tours,
  bookings,
  user,
  onUpdateTour,
  onUpdateBookingStatus,
  onAddTour,
  onAddNotification,
}: StaffViewProps) {
  const [activeTab, setActiveTab] = useState<'pending' | 'verified' | 'rejected' | 'bookings' | 'add-tour'>('pending');
  const [selectedTour, setSelectedTour] = useState<Tour | null>(null);
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

  const pendingTours = tours.filter(t => t.verificationStatus === VerificationStatus.PENDING);
  const verifiedTours = tours.filter(t => t.verificationStatus === VerificationStatus.VERIFIED);
  const rejectedTours = tours.filter(t => t.verificationStatus === VerificationStatus.REJECTED);
  const allBookings = bookings;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CONFIRMED': return 'bg-green-100 text-green-800';
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'COMPLETED': return 'bg-blue-100 text-blue-800';
      case 'CANCELLED': return 'bg-red-100 text-red-800';
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
    const staffFirstName = user.name.split(' ')[0];
    onAddNotification({
      message: `${staffFirstName} (Staff) added a new tour package: "${newTour.name}"`,
      actorName: user.name,
      actorRole: UserRole.STAFF,
      forRole: UserRole.ADMIN,
    });
    alert('Tour package added and published successfully!');
    setActiveTab('verified');
  };

  const handleVerifyTour = (tourId: string, status: VerificationStatus.VERIFIED | VerificationStatus.REJECTED) => {
    const tour = tours.find(t => t.id === tourId);
    onUpdateTour(tourId, { verificationStatus: status });
    if (tour) {
      const staffFirstName = user.name.split(' ')[0];
      onAddNotification({
        message: `${staffFirstName} (Staff) ${status === VerificationStatus.VERIFIED ? 'verified' : 'rejected'} tour: "${tour.name}"`,
        actorName: user.name,
        actorRole: UserRole.STAFF,
        forRole: UserRole.ADMIN,
      });
    }
    setSelectedTour(null);
  };

  const renderTourList = (tourList: Tour[], emptyMessage: string) => {
    if (tourList.length === 0) {
      return (
        <div className="text-center py-12 bg-white rounded-lg">
          <Compass className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">{emptyMessage}</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tourList.map((tour) => (
          <div
            key={tour.id}
            className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => setSelectedTour(tour)}
          >
            <div className="relative h-48 bg-gray-200">
              <img
                src={tour.image}
                alt={tour.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">{tour.name}</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>{tour.location}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <Compass className="w-4 h-4" />
                    <span>{tour.type}</span>
                  </div>
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
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  <span className="font-semibold text-gray-900">NPR {tour.pricePerPerson.toLocaleString()}/person</span>
                </div>
                <div>
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${getDifficultyColor(tour.difficulty)}`}>
                    {tour.difficulty}
                  </span>
                </div>
              </div>
              <button className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Gradient Header */}
      <div className="bg-gradient-to-r from-orange-800 to-amber-900 text-white">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl">
            <h1 className="text-4xl font-bold mb-2">Staff Dashboard</h1>
            <p className="text-orange-200 text-lg">Welcome, {user.name} — Tour Package Verification Officer</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
          <p className="text-gray-500 text-sm mb-1 font-medium">Pending Verification</p>
          <p className="text-3xl font-bold text-yellow-600">{pendingTours.length}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
          <p className="text-gray-500 text-sm mb-1 font-medium">Verified Packages</p>
          <p className="text-3xl font-bold text-green-600">{verifiedTours.length}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
          <p className="text-gray-500 text-sm mb-1 font-medium">Rejected</p>
          <p className="text-3xl font-bold text-red-600">{rejectedTours.length}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
          <p className="text-gray-500 text-sm mb-1 font-medium">Active Bookings</p>
          <p className="text-3xl font-bold text-blue-600">
            {allBookings.filter(b => b.status === 'CONFIRMED').length}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-8 border-b border-gray-200 overflow-x-auto">
        <button
          onClick={() => setActiveTab('pending')}
          className={`px-6 py-3 font-semibold border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'pending'
              ? 'border-yellow-600 text-yellow-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          Pending ({pendingTours.length})
        </button>
        <button
          onClick={() => setActiveTab('verified')}
          className={`px-6 py-3 font-semibold border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'verified'
              ? 'border-green-600 text-green-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          Verified ({verifiedTours.length})
        </button>
        <button
          onClick={() => setActiveTab('rejected')}
          className={`px-6 py-3 font-semibold border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'rejected'
              ? 'border-red-600 text-red-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          Rejected ({rejectedTours.length})
        </button>
        <button
          onClick={() => setActiveTab('bookings')}
          className={`px-6 py-3 font-semibold border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'bookings'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          All Bookings ({allBookings.length})
        </button>
        <button
          onClick={() => setActiveTab('add-tour')}
          className={`px-6 py-3 font-semibold border-b-2 transition-colors whitespace-nowrap flex items-center gap-2 ${
            activeTab === 'add-tour'
              ? 'border-green-600 text-green-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          <PlusCircle className="w-4 h-4" />
          Add Tour Package
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'pending' && renderTourList(pendingTours, 'No tour packages pending verification')}
      {activeTab === 'verified' && renderTourList(verifiedTours, 'No verified tour packages yet')}
      {activeTab === 'rejected' && renderTourList(rejectedTours, 'No rejected tour packages')}

      {/* Bookings Tab */}
      {activeTab === 'bookings' && (
        <div className="space-y-4">
          {allBookings.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg">
              <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No bookings to display</p>
            </div>
          ) : (
            allBookings.map((booking) => {
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
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                        <div>
                          <span className="font-medium">Dates:</span> {booking.startDate} → {booking.endDate}
                        </div>
                        <div>
                          <span className="font-medium">Destination:</span> {booking.destination}
                        </div>
                        <div>
                          <span className="font-medium">Travelers:</span> {booking.numPeople} person{booking.numPeople > 1 ? 's' : ''}
                        </div>
                        <div>
                          <span className="font-medium">Total:</span> NPR {booking.totalPrice.toLocaleString()}
                        </div>
                        <div>
                          <span className="font-medium">Travel Insurance:</span> {booking.insurance ? 'Yes' : 'No'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Add Tour Package Tab */}
      {activeTab === 'add-tour' && (
        <div className="bg-white rounded-xl shadow-md p-8">
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

      </div>
      {/* Tour Detail Modal */}
      {selectedTour && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Tour Package Verification</h2>
              <p className="text-gray-600">Review tour details before approving or rejecting</p>
            </div>

            <img
              src={selectedTour.image}
              alt={selectedTour.name}
              className="w-full h-64 object-cover rounded-lg mb-6"
            />

            <div className="space-y-6">
              {/* Basic Info */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Tour Information</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Tour Name:</span>
                    <p className="font-semibold text-gray-900">{selectedTour.name}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Type:</span>
                    <p className="font-semibold text-gray-900">{selectedTour.type}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Starting Location:</span>
                    <p className="font-semibold text-gray-900">{selectedTour.location}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Duration:</span>
                    <p className="font-semibold text-gray-900">{selectedTour.duration} days</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Max Group Size:</span>
                    <p className="font-semibold text-gray-900">{selectedTour.maxGroupSize} persons</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Difficulty:</span>
                    <p className="font-semibold text-gray-900">{selectedTour.difficulty}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Price per Person:</span>
                    <p className="font-semibold text-gray-900">NPR {selectedTour.pricePerPerson.toLocaleString()}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Status:</span>
                    <p className="font-semibold text-gray-900">{selectedTour.verificationStatus}</p>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
                <p className="text-gray-700">{selectedTour.description}</p>
              </div>

              {/* Inclusions */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Inclusions</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedTour.features.map((feature, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>

              {/* Verification Actions */}
              {selectedTour.verificationStatus === VerificationStatus.PENDING && (
                <div className="flex gap-4 pt-6 border-t border-gray-200">
                  <button
                    onClick={() => handleVerifyTour(selectedTour.id, VerificationStatus.REJECTED)}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors"
                  >
                    <XCircle className="w-5 h-5" />
                    Reject
                  </button>
                  <button
                    onClick={() => handleVerifyTour(selectedTour.id, VerificationStatus.VERIFIED)}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
                  >
                    <CheckCircle className="w-5 h-5" />
                    Verify & Approve
                  </button>
                </div>
              )}

              {selectedTour.verificationStatus !== 'PENDING' && (
                <div className="flex gap-4 pt-6 border-t border-gray-200">
                  <button
                    onClick={() => setSelectedTour(null)}
                    className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                  >
                    Close
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
