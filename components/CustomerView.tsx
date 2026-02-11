import { useState } from 'react';
import { MapPin, Calendar, DollarSign, Car, Shield, X, Check } from 'lucide-react';
import { VerificationStatus } from '../types';
import type { Vehicle, Booking, User } from '../types';

interface CustomerViewProps {
  vehicles: Vehicle[];
  bookings: Booking[];
  user: User;
  onCreateBooking: (booking: Omit<Booking, 'id'>) => void;
}

export default function CustomerView({ vehicles, bookings, user, onCreateBooking }: CustomerViewProps) {
  const [activeTab, setActiveTab] = useState<'browse' | 'bookings'>('browse');
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [bookingForm, setBookingForm] = useState({
    startDate: '',
    endDate: '',
    destination: '',
    insurance: false,
  });
  const [filterLocation, setFilterLocation] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');

  const availableVehicles = vehicles.filter(
    v => v.available && v.verificationStatus === VerificationStatus.VERIFIED
  );

  const filteredVehicles = availableVehicles.filter(v => {
    const locationMatch = filterLocation === 'all' || v.location === filterLocation;
    const typeMatch = filterType === 'all' || v.type === filterType;
    return locationMatch && typeMatch;
  });

  const myBookings = bookings.filter(b => b.customerId === user.id);

  const locations = Array.from(new Set(vehicles.map(v => v.location)));
  const types = Array.from(new Set(vehicles.map(v => v.type)));

  const calculateTotalPrice = () => {
    if (!selectedVehicle || !bookingForm.startDate || !bookingForm.endDate) return 0;

    const start = new Date(bookingForm.startDate);
    const end = new Date(bookingForm.endDate);
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));

    let total = selectedVehicle.pricePerDay * days;
    if (bookingForm.insurance) {
      total += 500 * days; // NPR 500 per day insurance
    }

    return total;
  };

  const handleBooking = () => {
    if (!selectedVehicle || !bookingForm.startDate || !bookingForm.endDate || !bookingForm.destination) {
      alert('Please fill all required fields');
      return;
    }

    const totalPrice = calculateTotalPrice();

    const booking: Omit<Booking, 'id'> = {
      vehicleId: selectedVehicle.id,
      customerId: user.id,
      startDate: bookingForm.startDate,
      endDate: bookingForm.endDate,
      totalPrice,
      status: 'PENDING',
      destination: bookingForm.destination,
      insurance: bookingForm.insurance ? {
        type: 'COMPREHENSIVE',
        dailyRate: 500,
        totalCost: 500 * Math.ceil((new Date(bookingForm.endDate).getTime() - new Date(bookingForm.startDate).getTime()) / (1000 * 60 * 60 * 24))
      } : undefined,
    };

    onCreateBooking(booking);
    setSelectedVehicle(null);
    setBookingForm({ startDate: '', endDate: '', destination: '', insurance: false });
    setActiveTab('bookings');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CONFIRMED': return 'bg-green-100 text-green-800';
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'COMPLETED': return 'bg-blue-100 text-blue-800';
      case 'CANCELLED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">Welcome, {user.name}</h1>

      {/* Tabs */}
      <div className="flex gap-4 mb-8 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('browse')}
          className={`px-6 py-3 font-semibold border-b-2 transition-colors ${
            activeTab === 'browse'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          Browse Vehicles
        </button>
        <button
          onClick={() => setActiveTab('bookings')}
          className={`px-6 py-3 font-semibold border-b-2 transition-colors ${
            activeTab === 'bookings'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          My Bookings ({myBookings.length})
        </button>
      </div>

      {/* Browse Vehicles Tab */}
      {activeTab === 'browse' && (
        <div>
          {/* Filters */}
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h3 className="font-semibold text-gray-900 mb-4">Filters</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                <select
                  value={filterLocation}
                  onChange={(e) => setFilterLocation(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Locations</option>
                  {locations.map(loc => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Vehicle Type</label>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Types</option>
                  {types.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Vehicle Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVehicles.map((vehicle) => (
              <div
                key={vehicle.id}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all"
              >
                <div className="relative h-48 bg-gray-200">
                  <img
                    src={vehicle.image}
                    alt={vehicle.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                    <Check className="w-4 h-4" />
                    Verified
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-xl font-bold text-gray-900">{vehicle.name}</h3>
                    <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-semibold">
                      {vehicle.type}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 mb-3">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">{vehicle.location}</span>
                  </div>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {vehicle.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {vehicle.features.slice(0, 3).map((feature, idx) => (
                      <span key={idx} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                        {feature}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-2xl font-bold text-blue-600">
                        NPR {vehicle.pricePerDay.toLocaleString()}
                      </span>
                      <span className="text-gray-500 text-sm">/day</span>
                    </div>
                    <button
                      onClick={() => setSelectedVehicle(vehicle)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredVehicles.length === 0 && (
            <div className="text-center py-12 bg-white rounded-lg">
              <Car className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No vehicles available with current filters</p>
            </div>
          )}
        </div>
      )}

      {/* My Bookings Tab */}
      {activeTab === 'bookings' && (
        <div className="space-y-4">
          {myBookings.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg">
              <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No bookings yet</p>
              <button
                onClick={() => setActiveTab('browse')}
                className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
              >
                Browse Vehicles
              </button>
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
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-xl font-bold text-gray-900">{vehicle.name}</h3>
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(booking.status)}`}>
                          {booking.status}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-600">
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
                        {booking.insurance && (
                          <div className="flex items-center gap-2">
                            <Shield className="w-4 h-4" />
                            <span>Insurance Included</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Booking Modal */}
      {selectedVehicle && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8">
            <div className="flex items-start justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Book {selectedVehicle.name}</h2>
              <button
                onClick={() => setSelectedVehicle(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <img
              src={selectedVehicle.image}
              alt={selectedVehicle.name}
              className="w-full h-64 object-cover rounded-lg mb-6"
            />

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                <input
                  type="date"
                  value={bookingForm.startDate}
                  onChange={(e) => setBookingForm({ ...bookingForm, startDate: e.target.value })}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                <input
                  type="date"
                  value={bookingForm.endDate}
                  onChange={(e) => setBookingForm({ ...bookingForm, endDate: e.target.value })}
                  min={bookingForm.startDate || new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Destination</label>
                <input
                  type="text"
                  value={bookingForm.destination}
                  onChange={(e) => setBookingForm({ ...bookingForm, destination: e.target.value })}
                  placeholder="e.g., Annapurna Circuit, Chitwan National Park"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
                <input
                  type="checkbox"
                  id="insurance"
                  checked={bookingForm.insurance}
                  onChange={(e) => setBookingForm({ ...bookingForm, insurance: e.target.checked })}
                  className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                />
                <label htmlFor="insurance" className="flex-1 cursor-pointer">
                  <div className="flex items-center gap-2 font-medium text-gray-900">
                    <Shield className="w-4 h-4 text-blue-600" />
                    Add Comprehensive Insurance
                  </div>
                  <p className="text-sm text-gray-600 mt-1">NPR 500/day - Covers damage and theft</p>
                </label>
              </div>

              {bookingForm.startDate && bookingForm.endDate && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">Booking Summary</h3>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Vehicle Rate</span>
                      <span className="font-medium">NPR {selectedVehicle.pricePerDay.toLocaleString()}/day</span>
                    </div>
                    {bookingForm.insurance && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Insurance</span>
                        <span className="font-medium">NPR 500/day</span>
                      </div>
                    )}
                    <div className="border-t border-gray-300 pt-2 mt-2 flex justify-between text-lg">
                      <span className="font-bold text-gray-900">Total</span>
                      <span className="font-bold text-blue-600">
                        NPR {calculateTotalPrice().toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex gap-4">
                <button
                  onClick={() => setSelectedVehicle(null)}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleBooking}
                  className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Confirm Booking
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
