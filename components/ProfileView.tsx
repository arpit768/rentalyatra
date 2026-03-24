import { User as UserIcon, Mail, Shield, MapPin, Calendar, Award, Compass, Clock, Users } from 'lucide-react';
import { UserRole, VerificationStatus } from '../types';
import type { User, Booking, Tour } from '../types';

interface ProfileViewProps {
  user: User;
  bookings: Booking[];
  tours: Tour[];
}

export default function ProfileView({ user, bookings, tours }: ProfileViewProps) {
  const myBookings = bookings.filter(b => b.customerId === user.id);
  const myTours = tours.filter(t => t.ownerId === user.id);

  const getRoleBadgeStyle = (role: string) => {
    switch (role) {
      case 'CUSTOMER': return 'bg-emerald-500/10 text-emerald-700 ring-emerald-500/20';
      case 'OWNER': return 'bg-purple-500/10 text-purple-700 ring-purple-500/20';
      case 'STAFF': return 'bg-amber-500/10 text-amber-700 ring-amber-500/20';
      case 'ADMIN': return 'bg-red-500/10 text-red-700 ring-red-500/20';
      default: return 'bg-gray-500/10 text-gray-700 ring-gray-500/20';
    }
  };

  const getRoleDescription = (role: string) => {
    switch (role) {
      case 'CUSTOMER': return 'Browse and book tour packages for your journeys';
      case 'OWNER': return 'List and manage your tour packages as an operator';
      case 'STAFF': return 'Verify tour packages and manage platform operations';
      case 'ADMIN': return 'Full platform administration and analytics';
      default: return 'Guest user';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'OWNER': return 'Tour Operator';
      case 'CUSTOMER': return 'Traveler';
      default: return role;
    }
  };

  const getHeaderGradient = (role: string) => {
    switch (role) {
      case 'CUSTOMER': return 'from-blue-600 to-indigo-700';
      case 'OWNER': return 'from-purple-600 to-indigo-700';
      case 'STAFF': return 'from-amber-600 to-orange-700';
      case 'ADMIN': return 'from-gray-800 to-gray-900';
      default: return 'from-blue-600 to-indigo-700';
    }
  };

  const completedBookings = myBookings.filter(b => b.status === 'COMPLETED');
  const totalSpent = completedBookings.reduce((sum, b) => sum + b.totalPrice, 0);

  const verifiedTours = myTours.filter(t => t.verificationStatus === VerificationStatus.VERIFIED);
  const totalEarnings = bookings
    .filter(b => b.status === 'COMPLETED' && myTours.some(t => t.id === b.tourId))
    .reduce((sum, b) => sum + b.totalPrice, 0);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Profile Header */}
      <div className={`bg-gradient-to-br ${getHeaderGradient(user.role)} text-white relative overflow-hidden`}>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }} />
        </div>
        <div className="container mx-auto px-4 py-16 relative z-10">
          <div className="flex flex-col md:flex-row items-center md:items-end gap-6">
            <div className="w-28 h-28 bg-white/10 backdrop-blur-sm rounded-3xl flex items-center justify-center border-2 border-white/20 shadow-2xl">
              <UserIcon className="w-14 h-14 text-white" />
            </div>
            <div className="text-center md:text-left flex-1">
              <h1 className="text-4xl font-bold mb-2">{user.name}</h1>
              <div className="flex flex-col md:flex-row items-center gap-3">
                <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-semibold bg-white/15 text-white border border-white/30">
                  <Shield className="w-3.5 h-3.5" />
                  {getRoleLabel(user.role)}
                </span>
                <span className="text-white/70 text-sm flex items-center gap-1.5">
                  <Mail className="w-4 h-4" />
                  {user.email}
                </span>
                <span className="text-white/70 text-sm flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  Member since 2024
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="space-y-6">
            {/* About Card */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">About</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{getRoleDescription(user.role)}</p>

              <div className="mt-6 space-y-3">
                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <span className="text-sm text-gray-500">User ID</span>
                  <span className="font-mono text-xs bg-gray-100 px-3 py-1 rounded-lg text-gray-600">{user.id}</span>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <span className="text-sm text-gray-500">Account Type</span>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ring-1 ${getRoleBadgeStyle(user.role)}`}>
                    {getRoleLabel(user.role)}
                  </span>
                </div>
                <div className="flex items-center justify-between py-3">
                  <span className="text-sm text-gray-500">Status</span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-green-50 text-green-700 ring-1 ring-green-500/20">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                    Active
                  </span>
                </div>
              </div>
            </div>

            {/* Badges */}
            {user.role === UserRole.CUSTOMER && completedBookings.length >= 5 && (
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-5">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                    <Award className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">Frequent Traveler</p>
                    <p className="text-sm text-gray-600">{completedBookings.length} tours completed</p>
                  </div>
                </div>
              </div>
            )}

            {user.role === UserRole.OWNER && verifiedTours.length >= 3 && (
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-2xl p-5">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                    <Award className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">Top Tour Operator</p>
                    <p className="text-sm text-gray-600">{verifiedTours.length} verified packages</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Stats Grid */}
            {(user.role === UserRole.CUSTOMER || user.role === UserRole.OWNER) && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center mb-3">
                    <Compass className="w-5 h-5 text-blue-600" />
                  </div>
                  <p className="text-sm text-gray-500 font-medium">Total Bookings</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{myBookings.length}</p>
                </div>
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                  <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center mb-3">
                    <Award className="w-5 h-5 text-green-600" />
                  </div>
                  <p className="text-sm text-gray-500 font-medium">Completed Tours</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{completedBookings.length}</p>
                </div>
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                  <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center mb-3">
                    <MapPin className="w-5 h-5 text-purple-600" />
                  </div>
                  <p className="text-sm text-gray-500 font-medium">Total Spent</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">
                    {totalSpent > 0 ? `NPR ${(totalSpent / 1000).toFixed(0)}K` : 'NPR 0'}
                  </p>
                </div>
              </div>
            )}

            {user.role === UserRole.OWNER && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                  <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center mb-3">
                    <Compass className="w-5 h-5 text-orange-600" />
                  </div>
                  <p className="text-sm text-gray-500 font-medium">Listed Packages</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{myTours.length}</p>
                </div>
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                  <div className="w-10 h-10 bg-teal-100 rounded-xl flex items-center justify-center mb-3">
                    <Shield className="w-5 h-5 text-teal-600" />
                  </div>
                  <p className="text-sm text-gray-500 font-medium">Verified</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{verifiedTours.length}</p>
                </div>
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                  <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center mb-3">
                    <Award className="w-5 h-5 text-green-600" />
                  </div>
                  <p className="text-sm text-gray-500 font-medium">Total Earnings</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">
                    {totalEarnings > 0 ? `NPR ${(totalEarnings / 1000).toFixed(0)}K` : 'NPR 0'}
                  </p>
                </div>
              </div>
            )}

            {user.role === UserRole.STAFF && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                  <div className="w-10 h-10 bg-yellow-100 rounded-xl flex items-center justify-center mb-3">
                    <Clock className="w-5 h-5 text-yellow-600" />
                  </div>
                  <p className="text-sm text-gray-500 font-medium">Pending Reviews</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">
                    {tours.filter(t => t.verificationStatus === VerificationStatus.PENDING).length}
                  </p>
                </div>
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                  <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center mb-3">
                    <Shield className="w-5 h-5 text-green-600" />
                  </div>
                  <p className="text-sm text-gray-500 font-medium">Verified</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">
                    {tours.filter(t => t.verificationStatus === VerificationStatus.VERIFIED).length}
                  </p>
                </div>
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center mb-3">
                    <Users className="w-5 h-5 text-blue-600" />
                  </div>
                  <p className="text-sm text-gray-500 font-medium">Active Bookings</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">
                    {bookings.filter(b => b.status === 'CONFIRMED').length}
                  </p>
                </div>
              </div>
            )}

            {user.role === UserRole.ADMIN && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-2xl shadow-lg p-6">
                  <p className="text-blue-200 text-sm mb-1">Total Tour Packages</p>
                  <p className="text-4xl font-bold">{tours.length}</p>
                </div>
                <div className="bg-gradient-to-br from-green-600 to-green-700 text-white rounded-2xl shadow-lg p-6">
                  <p className="text-green-200 text-sm mb-1">Total Bookings</p>
                  <p className="text-4xl font-bold">{bookings.length}</p>
                </div>
                <div className="bg-gradient-to-br from-purple-600 to-purple-700 text-white rounded-2xl shadow-lg p-6">
                  <p className="text-purple-200 text-sm mb-1">Platform Revenue</p>
                  <p className="text-4xl font-bold">
                    NPR {(bookings.filter(b => b.status === 'COMPLETED').reduce((sum, b) => sum + b.totalPrice, 0) / 1000).toFixed(0)}K
                  </p>
                </div>
                <div className="bg-gradient-to-br from-orange-600 to-orange-700 text-white rounded-2xl shadow-lg p-6">
                  <p className="text-orange-200 text-sm mb-1">Active Bookings</p>
                  <p className="text-4xl font-bold">
                    {bookings.filter(b => b.status === 'CONFIRMED').length}
                  </p>
                </div>
              </div>
            )}

            {/* Recent Bookings */}
            {(user.role === UserRole.CUSTOMER || user.role === UserRole.OWNER) && myBookings.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-5">Recent Bookings</h3>
                <div className="space-y-3">
                  {myBookings.slice(0, 3).map((booking) => {
                    const tour = tours.find(t => t.id === booking.tourId);
                    if (!tour) return null;

                    return (
                      <div key={booking.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                        <img
                          src={tour.image}
                          alt={tour.name}
                          className="w-20 h-16 object-cover rounded-xl"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-900 truncate">{tour.name}</p>
                          <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {new Date(booking.startDate).toLocaleDateString()}
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {booking.destination}
                            </span>
                            <span>{booking.numPeople} traveler{booking.numPeople > 1 ? 's' : ''}</span>
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="font-bold text-gray-900">NPR {booking.totalPrice.toLocaleString()}</p>
                          <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold mt-1 ${
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
          </div>
        </div>
      </div>
    </div>
  );
}
