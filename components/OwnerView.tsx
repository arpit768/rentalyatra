import { useState } from 'react';
import { Plus, Edit2, Eye, EyeOff, Calendar, DollarSign, MapPin, X } from 'lucide-react';
import { VerificationStatus } from '../types';
import { VehicleType } from '../types';
import type { Vehicle, Booking, User } from '../types';

interface OwnerViewProps {
  vehicles: Vehicle[];
  bookings: Booking[];
  user: User;
  onAddVehicle: (vehicle: Omit<Vehicle, 'id'>) => void;
  onUpdateVehicle: (id: string, vehicle: Partial<Vehicle>) => void;
  onToggleAvailability: (id: string) => void;
  onUpdateBookingStatus: (id: string, status: 'CONFIRMED' | 'CANCELLED' | 'COMPLETED') => void;
}

export default function OwnerView({
  vehicles,
  bookings,
  user,
  onAddVehicle,
  onUpdateVehicle,
  onToggleAvailability,
  onUpdateBookingStatus,
}: OwnerViewProps) {
  const [activeTab, setActiveTab] = useState<'vehicles' | 'bookings'>('vehicles');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newVehicle, setNewVehicle] = useState({
    name: '',
    type: VehicleType.SUV as Vehicle['type'],
    pricePerDay: 0,
    location: '',
    image: '',
    description: '',
    features: '',
    plateNumber: '',
  });

  const myVehicles = vehicles.filter(v => v.ownerId === user.id);
  const myVehicleIds = myVehicles.map(v => v.id);
  const myBookings = bookings.filter(b => myVehicleIds.includes(b.vehicleId));

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

  const handleAddVehicle = () => {
    if (!newVehicle.name || !newVehicle.location || !newVehicle.pricePerDay || !newVehicle.plateNumber) {
      alert('Please fill all required fields');
      return;
    }

    const vehicle: Omit<Vehicle, 'id'> = {
      ownerId: user.id,
      name: newVehicle.name,
      type: newVehicle.type,
      pricePerDay: Number(newVehicle.pricePerDay),
      location: newVehicle.location,
      image: newVehicle.image || 'https://via.placeholder.com/400x300?text=Vehicle',
      description: newVehicle.description,
      features: newVehicle.features.split(',').map(f => f.trim()).filter(Boolean),
      available: true,
      verificationStatus: VerificationStatus.PENDING,
      plateNumber: newVehicle.plateNumber,
    };

    onAddVehicle(vehicle);
    setShowAddModal(false);
    setNewVehicle({
      name: '',
      type: VehicleType.SUV,
      pricePerDay: 0,
      location: '',
      image: '',
      description: '',
      features: '',
      plateNumber: '',
    });
  };

  const calculateEarnings = () => {
    return myBookings
      .filter(b => b.status === 'COMPLETED')
      .reduce((sum, b) => sum + b.totalPrice, 0);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Owner Dashboard</h1>
          <p className="text-gray-600">Welcome back, {user.name}</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-md"
        >
          <Plus className="w-5 h-5" />
          Add Vehicle
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <p className="text-gray-600 text-sm mb-1">Total Vehicles</p>
          <p className="text-3xl font-bold text-gray-900">{myVehicles.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <p className="text-gray-600 text-sm mb-1">Active Bookings</p>
          <p className="text-3xl font-bold text-blue-600">
            {myBookings.filter(b => b.status === 'CONFIRMED').length}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <p className="text-gray-600 text-sm mb-1">Pending Requests</p>
          <p className="text-3xl font-bold text-yellow-600">
            {myBookings.filter(b => b.status === 'PENDING').length}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <p className="text-gray-600 text-sm mb-1">Total Earnings</p>
          <p className="text-3xl font-bold text-green-600">
            NPR {calculateEarnings().toLocaleString()}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-8 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('vehicles')}
          className={`px-6 py-3 font-semibold border-b-2 transition-colors ${
            activeTab === 'vehicles'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          My Vehicles ({myVehicles.length})
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

      {/* My Vehicles Tab */}
      {activeTab === 'vehicles' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {myVehicles.map((vehicle) => (
            <div key={vehicle.id} className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="relative h-48 bg-gray-200">
                <img
                  src={vehicle.image}
                  alt={vehicle.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4 flex gap-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getVerificationColor(vehicle.verificationStatus)}`}>
                    {vehicle.verificationStatus}
                  </span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{vehicle.name}</h3>
                <div className="flex items-center gap-2 text-gray-600 mb-3">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">{vehicle.location}</span>
                </div>
                <div className="mb-4">
                  <span className="text-2xl font-bold text-blue-600">
                    NPR {vehicle.pricePerDay.toLocaleString()}
                  </span>
                  <span className="text-gray-500 text-sm">/day</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => onToggleAvailability(vehicle.id)}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                      vehicle.available
                        ? 'bg-green-100 text-green-700 hover:bg-green-200'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {vehicle.available ? (
                      <>
                        <Eye className="w-4 h-4" />
                        Available
                      </>
                    ) : (
                      <>
                        <EyeOff className="w-4 h-4" />
                        Unavailable
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}

          {myVehicles.length === 0 && (
            <div className="col-span-full text-center py-12 bg-white rounded-lg">
              <p className="text-gray-500 mb-4">No vehicles listed yet</p>
              <button
                onClick={() => setShowAddModal(true)}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Add your first vehicle
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
              const vehicle = vehicles.find(v => v.id === booking.vehicleId);
              if (!vehicle) return null;

              return (
                <div key={booking.id} className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    <img
                      src={vehicle.image}
                      alt={vehicle.name}
                      className="w-full md:w-48 h-32 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">{vehicle.name}</h3>
                          <p className="text-sm text-gray-600">Booking ID: {booking.id}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(booking.status)}`}>
                          {booking.status}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-600 mb-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>{booking.startDate} to {booking.endDate}</span>
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

      {/* Add Vehicle Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8">
            <div className="flex items-start justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Add New Vehicle</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Vehicle Name *</label>
                <input
                  type="text"
                  value={newVehicle.name}
                  onChange={(e) => setNewVehicle({ ...newVehicle, name: e.target.value })}
                  placeholder="e.g., Mahindra Scorpio"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Type *</label>
                  <select
                    value={newVehicle.type}
                    onChange={(e) => setNewVehicle({ ...newVehicle, type: e.target.value as Vehicle['type'] })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="SUV">SUV</option>
                    <option value="Sedan">Sedan</option>
                    <option value="Hatchback">Hatchback</option>
                    <option value="Motorbike">Motorbike</option>
                    <option value="4x4 Offroad">4x4 Offroad</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price per Day (NPR) *</label>
                  <input
                    type="number"
                    value={newVehicle.pricePerDay || ''}
                    onChange={(e) => setNewVehicle({ ...newVehicle, pricePerDay: Number(e.target.value) })}
                    placeholder="5000"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location *</label>
                <input
                  type="text"
                  value={newVehicle.location}
                  onChange={(e) => setNewVehicle({ ...newVehicle, location: e.target.value })}
                  placeholder="Kathmandu"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Plate Number *</label>
                <input
                  type="text"
                  value={newVehicle.plateNumber}
                  onChange={(e) => setNewVehicle({ ...newVehicle, plateNumber: e.target.value })}
                  placeholder="BA 21 PA 1234"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
                <input
                  type="text"
                  value={newVehicle.image}
                  onChange={(e) => setNewVehicle({ ...newVehicle, image: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={newVehicle.description}
                  onChange={(e) => setNewVehicle({ ...newVehicle, description: e.target.value })}
                  placeholder="Describe your vehicle..."
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Features (comma-separated)</label>
                <input
                  type="text"
                  value={newVehicle.features}
                  onChange={(e) => setNewVehicle({ ...newVehicle, features: e.target.value })}
                  placeholder="AC, GPS, 4WD"
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
                  onClick={handleAddVehicle}
                  className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Add Vehicle
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
