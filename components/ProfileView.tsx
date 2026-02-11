import { User as UserIcon, Mail, Shield, MapPin, Calendar, Award } from 'lucide-react';
import { UserRole, VerificationStatus } from '../types';
import type { User, Booking, Vehicle } from '../types';

interface ProfileViewProps {
  user: User;
  bookings: Booking[];
  vehicles: Vehicle[];
}

export default function ProfileView({ user, bookings, vehicles }: ProfileViewProps) {
  const myBookings = bookings.filter(b => b.customerId === user.id);
  const myVehicles = vehicles.filter(v => v.ownerId === user.id);

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'CUSTOMER': return 'bg-green-100 text-green-800';
      case 'OWNER': return 'bg-purple-100 text-purple-800';
      case 'STAFF': return 'bg-orange-100 text-orange-800';
      case 'ADMIN': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleDescription = (role: string) => {
    switch (role) {
      case 'CUSTOMER': return 'Browse and rent vehicles for your journeys';
      case 'OWNER': return 'List and manage your vehicles for rental';
      case 'STAFF': return 'Verify vehicles and manage platform operations';
      case 'ADMIN': return 'Full platform administration and analytics';
      default: return 'Guest user';
    }
  };

  const completedBookings = myBookings.filter(b => b.status === 'COMPLETED');
  const totalSpent = completedBookings.reduce((sum, b) => sum + b.totalPrice, 0);

  const verifiedVehicles = myVehicles.filter(v => v.verificationStatus === VerificationStatus.VERIFIED);
  const totalEarnings = bookings
    .filter(b => b.status === 'COMPLETED' && myVehicles.some(v => v.id === b.vehicleId))
    .reduce((sum, b) => sum + b.totalPrice, 0);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-900">My Profile</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-md p-8">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full mb-4">
                <UserIcon className="w-12 h-12 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{user.name}</h2>
              <span className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${getRoleBadgeColor(user.role)}`}>
                {user.role}
              </span>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex items-center gap-3 text-gray-700">
                <Mail className="w-5 h-5 text-gray-400" />
                <span className="text-sm">{user.email}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-700">
                <Shield className="w-5 h-5 text-gray-400" />
                <span className="text-sm">{getRoleDescription(user.role)}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-700">
                <Calendar className="w-5 h-5 text-gray-400" />
                <span className="text-sm">Member since 2024</span>
              </div>
            </div>

            {user.role === UserRole.CUSTOMER && completedBookings.length >= 5 && (
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <div className="flex items-center gap-3">
                  <Award className="w-6 h-6 text-yellow-600" />
                  <div>
                    <p className="font-semibold text-gray-900">Frequent Traveler</p>
                    <p className="text-sm text-gray-600">{completedBookings.length} completed trips</p>
                  </div>
                </div>
              </div>
            )}

            {user.role === UserRole.OWNER && verifiedVehicles.length >= 3 && (
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-4 mb-6">
                <div className="flex items-center gap-3">
                  <Award className="w-6 h-6 text-purple-600" />
                  <div>
                    <p className="font-semibold text-gray-900">Top Fleet Owner</p>
                    <p className="text-sm text-gray-600">{verifiedVehicles.length} verified vehicles</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Activity & Stats */}
        <div className="lg:col-span-2 space-y-6">
          {/* Customer Stats */}
          {(user.role === UserRole.CUSTOMER || user.role === UserRole.OWNER) && (
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Rental Activity</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-gray-600 text-sm mb-1">Total Bookings</p>
                  <p className="text-3xl font-bold text-blue-600">{myBookings.length}</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-gray-600 text-sm mb-1">Completed Trips</p>
                  <p className="text-3xl font-bold text-green-600">{completedBookings.length}</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <p className="text-gray-600 text-sm mb-1">Total Spent</p>
                  <p className="text-3xl font-bold text-purple-600">
                    NPR {(totalSpent / 1000).toFixed(0)}K
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Owner Stats */}
          {user.role === UserRole.OWNER && (
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Fleet Performance</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-orange-50 p-4 rounded-lg">
                  <p className="text-gray-600 text-sm mb-1">Listed Vehicles</p>
                  <p className="text-3xl font-bold text-orange-600">{myVehicles.length}</p>
                </div>
                <div className="bg-teal-50 p-4 rounded-lg">
                  <p className="text-gray-600 text-sm mb-1">Verified</p>
                  <p className="text-3xl font-bold text-teal-600">{verifiedVehicles.length}</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-gray-600 text-sm mb-1">Total Earnings</p>
                  <p className="text-3xl font-bold text-green-600">
                    NPR {(totalEarnings / 1000).toFixed(0)}K
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Staff Stats */}
          {user.role === UserRole.STAFF && (
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Staff Activity</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <p className="text-gray-600 text-sm mb-1">Pending Reviews</p>
                  <p className="text-3xl font-bold text-yellow-600">
                    {vehicles.filter(v => v.verificationStatus === VerificationStatus.PENDING).length}
                  </p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-gray-600 text-sm mb-1">Verified</p>
                  <p className="text-3xl font-bold text-green-600">
                    {vehicles.filter(v => v.verificationStatus === VerificationStatus.VERIFIED).length}
                  </p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-gray-600 text-sm mb-1">Active Bookings</p>
                  <p className="text-3xl font-bold text-blue-600">
                    {bookings.filter(b => b.status === 'CONFIRMED').length}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Admin Stats */}
          {user.role === UserRole.ADMIN && (
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Platform Overview</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-lg">
                  <p className="text-blue-100 text-sm mb-1">Total Vehicles</p>
                  <p className="text-4xl font-bold">{vehicles.length}</p>
                </div>
                <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-lg">
                  <p className="text-green-100 text-sm mb-1">Total Bookings</p>
                  <p className="text-4xl font-bold">{bookings.length}</p>
                </div>
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-lg">
                  <p className="text-purple-100 text-sm mb-1">Platform Revenue</p>
                  <p className="text-4xl font-bold">
                    NPR {(bookings.filter(b => b.status === 'COMPLETED').reduce((sum, b) => sum + b.totalPrice, 0) / 1000).toFixed(0)}K
                  </p>
                </div>
                <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-6 rounded-lg">
                  <p className="text-orange-100 text-sm mb-1">Active Rentals</p>
                  <p className="text-4xl font-bold">
                    {bookings.filter(b => b.status === 'CONFIRMED').length}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Recent Bookings (for customers) */}
          {(user.role === UserRole.CUSTOMER || user.role === UserRole.OWNER) && myBookings.length > 0 && (
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Recent Bookings</h3>
              <div className="space-y-3">
                {myBookings.slice(0, 3).map((booking) => {
                  const vehicle = vehicles.find(v => v.id === booking.vehicleId);
                  if (!vehicle) return null;

                  return (
                    <div key={booking.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                      <img
                        src={vehicle.image}
                        alt={vehicle.name}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">{vehicle.name}</p>
                        <p className="text-sm text-gray-600">{booking.startDate} to {booking.endDate}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <MapPin className="w-3 h-3 text-gray-500" />
                          <span className="text-xs text-gray-500">{booking.destination}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">NPR {booking.totalPrice.toLocaleString()}</p>
                        <span className={`inline-block px-2 py-1 rounded text-xs font-semibold mt-1 ${
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
          )}

          {/* Account Information */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Account Information</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-gray-200">
                <span className="text-gray-600">Full Name</span>
                <span className="font-semibold text-gray-900">{user.name}</span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-gray-200">
                <span className="text-gray-600">Email Address</span>
                <span className="font-semibold text-gray-900">{user.email}</span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-gray-200">
                <span className="text-gray-600">Account Type</span>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getRoleBadgeColor(user.role)}`}>
                  {user.role}
                </span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-gray-200">
                <span className="text-gray-600">User ID</span>
                <span className="font-mono text-sm text-gray-600">{user.id}</span>
              </div>
              <div className="flex items-center justify-between py-3">
                <span className="text-gray-600">Account Status</span>
                <span className="px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-800">
                  Active
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
