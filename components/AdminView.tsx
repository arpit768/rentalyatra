import { useState } from 'react';
import { Shield, Car, Users, DollarSign, TrendingUp, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { VerificationStatus } from '../types';
import type { Vehicle, Booking, User } from '../types';

interface AdminViewProps {
  vehicles: Vehicle[];
  bookings: Booking[];
  user: User;
  onUpdateVehicle: (id: string, vehicle: Partial<Vehicle>) => void;
}

export default function AdminView({ vehicles, bookings, user, onUpdateVehicle }: AdminViewProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'vehicles' | 'analytics'>('overview');
  const [filterStatus, setFilterStatus] = useState<'all' | 'PENDING' | 'VERIFIED' | 'REJECTED'>('all');

  // Statistics
  const totalVehicles = vehicles.length;
  const verifiedVehicles = vehicles.filter(v => v.verificationStatus === VerificationStatus.VERIFIED).length;
  const pendingVehicles = vehicles.filter(v => v.verificationStatus === VerificationStatus.PENDING).length;
  const totalBookings = bookings.length;
  const activeBookings = bookings.filter(b => b.status === 'CONFIRMED').length;
  const completedBookings = bookings.filter(b => b.status === 'COMPLETED').length;
  const totalRevenue = bookings
    .filter(b => b.status === 'COMPLETED')
    .reduce((sum, b) => sum + b.totalPrice, 0);

  // Unique owners count
  const uniqueOwners = new Set(vehicles.map(v => v.ownerId)).size;

  // Filtered vehicles
  const filteredVehicles = filterStatus === 'all'
    ? vehicles
    : vehicles.filter(v => v.verificationStatus === filterStatus);

  // Location statistics
  const locationStats = vehicles.reduce((acc, v) => {
    acc[v.location] = (acc[v.location] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Type statistics
  const typeStats = vehicles.reduce((acc, v) => {
    acc[v.type] = (acc[v.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'VERIFIED': return 'bg-green-100 text-green-800';
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'REJECTED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleQuickVerify = (vehicleId: string, status: VerificationStatus.VERIFIED | VerificationStatus.REJECTED) => {
    onUpdateVehicle(vehicleId, { verificationStatus: status });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600">Platform-wide management and analytics - {user.name}</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <Car className="w-8 h-8 opacity-80" />
            <span className="text-sm font-medium bg-white bg-opacity-20 px-2 py-1 rounded">Vehicles</span>
          </div>
          <p className="text-3xl font-bold mb-1">{totalVehicles}</p>
          <p className="text-blue-100 text-sm">{verifiedVehicles} verified, {pendingVehicles} pending</p>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <DollarSign className="w-8 h-8 opacity-80" />
            <span className="text-sm font-medium bg-white bg-opacity-20 px-2 py-1 rounded">Revenue</span>
          </div>
          <p className="text-3xl font-bold mb-1">NPR {(totalRevenue / 1000).toFixed(0)}K</p>
          <p className="text-green-100 text-sm">{completedBookings} completed bookings</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="w-8 h-8 opacity-80" />
            <span className="text-sm font-medium bg-white bg-opacity-20 px-2 py-1 rounded">Bookings</span>
          </div>
          <p className="text-3xl font-bold mb-1">{totalBookings}</p>
          <p className="text-purple-100 text-sm">{activeBookings} active right now</p>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-6 rounded-xl shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <Users className="w-8 h-8 opacity-80" />
            <span className="text-sm font-medium bg-white bg-opacity-20 px-2 py-1 rounded">Owners</span>
          </div>
          <p className="text-3xl font-bold mb-1">{uniqueOwners}</p>
          <p className="text-orange-100 text-sm">Active vehicle owners</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-8 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-6 py-3 font-semibold border-b-2 transition-colors ${
            activeTab === 'overview'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab('vehicles')}
          className={`px-6 py-3 font-semibold border-b-2 transition-colors ${
            activeTab === 'vehicles'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          All Vehicles ({totalVehicles})
        </button>
        <button
          onClick={() => setActiveTab('analytics')}
          className={`px-6 py-3 font-semibold border-b-2 transition-colors ${
            activeTab === 'analytics'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          Analytics
        </button>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={() => setActiveTab('vehicles')}
                className="flex items-center gap-3 p-4 border-2 border-yellow-300 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-colors"
              >
                <AlertTriangle className="w-6 h-6 text-yellow-600" />
                <div className="text-left">
                  <p className="font-semibold text-gray-900">{pendingVehicles} Pending</p>
                  <p className="text-sm text-gray-600">Vehicles awaiting verification</p>
                </div>
              </button>

              <div className="flex items-center gap-3 p-4 border-2 border-green-300 bg-green-50 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
                <div className="text-left">
                  <p className="font-semibold text-gray-900">{verifiedVehicles} Verified</p>
                  <p className="text-sm text-gray-600">Active rental vehicles</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 border-2 border-blue-300 bg-blue-50 rounded-lg">
                <TrendingUp className="w-6 h-6 text-blue-600" />
                <div className="text-left">
                  <p className="font-semibold text-gray-900">{activeBookings} Active</p>
                  <p className="text-sm text-gray-600">Ongoing rentals</p>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Bookings</h2>
            <div className="space-y-3">
              {bookings.slice(0, 5).map((booking) => {
                const vehicle = vehicles.find(v => v.id === booking.vehicleId);
                if (!vehicle) return null;

                return (
                  <div key={booking.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-4">
                      <img
                        src={vehicle.image}
                        alt={vehicle.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div>
                        <p className="font-semibold text-gray-900">{vehicle.name}</p>
                        <p className="text-sm text-gray-600">{booking.startDate} to {booking.endDate}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">NPR {booking.totalPrice.toLocaleString()}</p>
                      <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                        booking.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' :
                        booking.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                        booking.status === 'COMPLETED' ? 'bg-blue-100 text-blue-800' :
                        'bg-red-100 text-red-800'
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

      {/* Vehicles Tab */}
      {activeTab === 'vehicles' && (
        <div>
          {/* Filter */}
          <div className="bg-white p-4 rounded-lg shadow-md mb-6">
            <div className="flex items-center gap-4">
              <label className="font-medium text-gray-700">Filter by Status:</label>
              <div className="flex gap-2">
                {(['all', 'PENDING', 'VERIFIED', 'REJECTED'] as const).map((status) => (
                  <button
                    key={status}
                    onClick={() => setFilterStatus(status)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      filterStatus === status
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {status === 'all' ? 'All' : status}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Vehicle List */}
          <div className="grid grid-cols-1 gap-4">
            {filteredVehicles.map((vehicle) => (
              <div key={vehicle.id} className="bg-white rounded-lg shadow-md p-6">
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
                        <p className="text-sm text-gray-600">{vehicle.type} - {vehicle.plateNumber}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(vehicle.verificationStatus)}`}>
                        {vehicle.verificationStatus}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm text-gray-600 mb-4">
                      <div>
                        <span className="font-medium">Location:</span> {vehicle.location}
                      </div>
                      <div>
                        <span className="font-medium">Price:</span> NPR {vehicle.pricePerDay.toLocaleString()}/day
                      </div>
                      <div>
                        <span className="font-medium">Available:</span> {vehicle.available ? 'Yes' : 'No'}
                      </div>
                      <div>
                        <span className="font-medium">Owner ID:</span> {vehicle.ownerId.slice(0, 8)}...
                      </div>
                    </div>
                    {vehicle.verificationStatus === VerificationStatus.PENDING && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleQuickVerify(vehicle.id, VerificationStatus.REJECTED)}
                          className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
                        >
                          Reject
                        </button>
                        <button
                          onClick={() => handleQuickVerify(vehicle.id, VerificationStatus.VERIFIED)}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
                        >
                          Verify
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {filteredVehicles.length === 0 && (
              <div className="text-center py-12 bg-white rounded-lg">
                <Car className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No vehicles found with current filter</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          {/* Location Distribution */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Vehicles by Location</h2>
            <div className="space-y-3">
              {Object.entries(locationStats)
                .sort(([, a], [, b]) => b - a)
                .map(([location, count]) => (
                  <div key={location} className="flex items-center gap-4">
                    <div className="w-32 font-medium text-gray-700">{location}</div>
                    <div className="flex-1 bg-gray-200 rounded-full h-8 relative">
                      <div
                        className="bg-blue-600 h-full rounded-full flex items-center justify-end pr-3"
                        style={{ width: `${(count / totalVehicles) * 100}%` }}
                      >
                        <span className="text-white text-sm font-semibold">{count}</span>
                      </div>
                    </div>
                    <div className="w-16 text-right text-gray-600 text-sm">
                      {((count / totalVehicles) * 100).toFixed(0)}%
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Vehicle Type Distribution */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Vehicles by Type</h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {Object.entries(typeStats).map(([type, count]) => (
                <div key={type} className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-lg text-center">
                  <p className="text-3xl font-bold text-blue-600 mb-1">{count}</p>
                  <p className="text-sm text-gray-700">{type}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Booking Status */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Booking Statistics</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                <p className="text-2xl font-bold text-yellow-700">
                  {bookings.filter(b => b.status === 'PENDING').length}
                </p>
                <p className="text-sm text-gray-700">Pending</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <p className="text-2xl font-bold text-green-700">
                  {bookings.filter(b => b.status === 'CONFIRMED').length}
                </p>
                <p className="text-sm text-gray-700">Confirmed</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <p className="text-2xl font-bold text-blue-700">
                  {bookings.filter(b => b.status === 'COMPLETED').length}
                </p>
                <p className="text-sm text-gray-700">Completed</p>
              </div>
              <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                <p className="text-2xl font-bold text-red-700">
                  {bookings.filter(b => b.status === 'CANCELLED').length}
                </p>
                <p className="text-sm text-gray-700">Cancelled</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
