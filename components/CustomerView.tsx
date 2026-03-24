import { useState } from 'react';
import { MapPin, Calendar, Compass, Shield, X, Check, Filter, Search, ChevronRight, Clock, Users } from 'lucide-react';
import { VerificationStatus } from '../types';
import type { Tour, Booking, User } from '../types';

interface CustomerViewProps {
  tours: Tour[];
  bookings: Booking[];
  user: User;
  onCreateBooking: (booking: Omit<Booking, 'id'>) => void;
}

export default function CustomerView({ tours, bookings, user, onCreateBooking }: CustomerViewProps) {
  const [activeTab, setActiveTab] = useState<'browse' | 'bookings'>('browse');
  const [selectedTour, setSelectedTour] = useState<Tour | null>(null);
  const [bookingForm, setBookingForm] = useState({
    startDate: '',
    endDate: '',
    destination: '',
    numPeople: 1,
    insurance: false,
  });
  const [filterLocation, setFilterLocation] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [priceRange, setPriceRange] = useState<'all' | 'budget' | 'mid' | 'premium'>('all');

  const availableTours = tours.filter(
    t => t.available && t.verificationStatus === VerificationStatus.VERIFIED
  );

  const filteredTours = availableTours.filter(t => {
    const locationMatch = filterLocation === 'all' || t.location === filterLocation;
    const typeMatch = filterType === 'all' || t.type === filterType;
    const searchMatch = searchQuery === '' ||
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase());

    let priceMatch = true;
    if (priceRange === 'budget') priceMatch = t.pricePerPerson < 10000;
    else if (priceRange === 'mid') priceMatch = t.pricePerPerson >= 10000 && t.pricePerPerson < 30000;
    else if (priceRange === 'premium') priceMatch = t.pricePerPerson >= 30000;

    return locationMatch && typeMatch && searchMatch && priceMatch;
  });

  const myBookings = bookings.filter(b => b.customerId === user.id);

  const locations = Array.from(new Set(tours.map(t => t.location)));
  const types = Array.from(new Set(tours.map(t => t.type)));

  const calculateTotalPrice = () => {
    if (!selectedTour) return 0;
    let total = selectedTour.pricePerPerson * bookingForm.numPeople;
    if (bookingForm.insurance) {
      total += 800 * bookingForm.numPeople;
    }
    return total;
  };

  const handleStartDateChange = (date: string) => {
    if (!selectedTour) return;
    const start = new Date(date);
    const end = new Date(start);
    end.setDate(end.getDate() + selectedTour.duration);
    setBookingForm({
      ...bookingForm,
      startDate: date,
      endDate: end.toISOString().split('T')[0],
    });
  };

  const handleBooking = () => {
    if (!selectedTour || !bookingForm.startDate || !bookingForm.destination) {
      alert('Please fill all required fields');
      return;
    }

    const totalPrice = calculateTotalPrice();

    const booking: Omit<Booking, 'id'> = {
      tourId: selectedTour.id,
      customerId: user.id,
      startDate: bookingForm.startDate,
      endDate: bookingForm.endDate,
      numPeople: bookingForm.numPeople,
      totalPrice,
      status: 'PENDING',
      destination: bookingForm.destination,
      insurance: bookingForm.insurance ? {
        type: 'TRAVEL_COMPREHENSIVE',
        ratePerPerson: 800,
        totalCost: 800 * bookingForm.numPeople,
      } : undefined,
    };

    onCreateBooking(booking);
    setSelectedTour(null);
    setBookingForm({ startDate: '', endDate: '', destination: '', numPeople: 1, insurance: false });
    setActiveTab('bookings');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CONFIRMED': return 'bg-green-100 text-green-800 border-green-200';
      case 'PENDING': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'COMPLETED': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'CANCELLED': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
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

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Modern Header */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl">
            <h1 className="text-4xl font-bold mb-2">Welcome back, {user.name}!</h1>
            <p className="text-blue-200 text-lg">Your next adventure awaits. Find the perfect tour for your journey.</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-6">
        {/* Enhanced Tabs */}
        <div className="bg-white rounded-2xl shadow-xl p-2 mb-8 inline-flex gap-2">
          <button
            onClick={() => setActiveTab('browse')}
            className={`px-8 py-3 rounded-xl font-semibold transition-all ${
              activeTab === 'browse'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <div className="flex items-center gap-2">
              <Compass className="w-5 h-5" />
              Browse Tours
            </div>
          </button>
          <button
            onClick={() => setActiveTab('bookings')}
            className={`px-8 py-3 rounded-xl font-semibold transition-all ${
              activeTab === 'bookings'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              My Bookings
              {myBookings.length > 0 && (
                <span className="bg-white text-blue-600 px-2 py-0.5 rounded-full text-xs font-bold">
                  {myBookings.length}
                </span>
              )}
            </div>
          </button>
        </div>

        {/* Browse Tours Tab */}
        {activeTab === 'browse' && (
          <div>
            {/* Advanced Filters Section */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Filter className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">Find Your Perfect Tour</h3>
                  <p className="text-sm text-gray-500">Filter by location, type, and price range</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Search */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search tours..."
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Starting Location</label>
                  <select
                    value={filterLocation}
                    onChange={(e) => setFilterLocation(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                  >
                    <option value="all">All Locations</option>
                    {locations.map(loc => (
                      <option key={loc} value={loc}>{loc}</option>
                    ))}
                  </select>
                </div>

                {/* Tour Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tour Type</label>
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                  >
                    <option value="all">All Types</option>
                    {types.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                {/* Price Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Budget (per person)</label>
                  <select
                    value={priceRange}
                    onChange={(e) => setPriceRange(e.target.value as any)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                  >
                    <option value="all">All Budgets</option>
                    <option value="budget">Budget (&lt; NPR 10,000)</option>
                    <option value="mid">Mid-Range (NPR 10,000–30,000)</option>
                    <option value="premium">Premium (&gt; NPR 30,000)</option>
                  </select>
                </div>
              </div>

              {/* Active Filters Display */}
              {(filterLocation !== 'all' || filterType !== 'all' || searchQuery !== '' || priceRange !== 'all') && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm text-gray-600 font-medium">Active filters:</span>
                    {filterLocation !== 'all' && (
                      <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                        {filterLocation}
                      </span>
                    )}
                    {filterType !== 'all' && (
                      <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium">
                        {filterType}
                      </span>
                    )}
                    {priceRange !== 'all' && (
                      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                        {priceRange === 'budget' ? 'Budget' : priceRange === 'mid' ? 'Mid-Range' : 'Premium'}
                      </span>
                    )}
                    <button
                      onClick={() => {
                        setFilterLocation('all');
                        setFilterType('all');
                        setSearchQuery('');
                        setPriceRange('all');
                      }}
                      className="text-sm text-red-600 hover:text-red-700 font-medium underline"
                    >
                      Clear all
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Results Count */}
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="text-gray-600">
                  <span className="font-bold text-gray-900 text-lg">{filteredTours.length}</span> tours available
                </p>
              </div>
            </div>

            {/* Tour Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredTours.map((tour) => (
                <div
                  key={tour.id}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all group hover:-translate-y-2 border border-gray-100"
                >
                  <div className="relative h-56 bg-gradient-to-br from-gray-200 to-gray-300 overflow-hidden">
                    <img
                      src={tour.image}
                      alt={tour.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                      <span className="bg-white/95 backdrop-blur-sm text-gray-900 px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg flex items-center gap-1.5">
                        <Shield className="w-3 h-3 text-green-600" />
                        Verified
                      </span>
                      <span className="bg-blue-600 text-white px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg">
                        {tour.type}
                      </span>
                    </div>
                    <div className="absolute bottom-4 left-4 flex items-center gap-2">
                      <span className="bg-green-500 text-white px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg flex items-center gap-1.5">
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                        Available
                      </span>
                      <span className={`px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg ${getDifficultyColor(tour.difficulty)}`}>
                        {tour.difficulty}
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="mb-3">
                      <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                        {tour.name}
                      </h3>
                      <div className="flex items-center gap-3 text-gray-500 text-sm flex-wrap">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          <span>{tour.location}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{tour.duration} days</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          <span>Max {tour.maxGroupSize}</span>
                        </div>
                      </div>
                    </div>

                    <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
                      {tour.description}
                    </p>

                    {/* Inclusions */}
                    {tour.features && tour.features.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {tour.features.slice(0, 3).map((feature, idx) => (
                          <span key={idx} className="text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-full font-medium">
                            {feature}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div>
                        <div className="text-xs text-gray-500 mb-1">From</div>
                        <div className="flex items-baseline gap-1">
                          <span className="text-2xl font-bold text-gray-900">
                            {tour.pricePerPerson.toLocaleString()}
                          </span>
                          <span className="text-gray-500 text-sm font-medium">NPR/person</span>
                        </div>
                      </div>
                      <button
                        onClick={() => setSelectedTour(tour)}
                        className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl flex items-center gap-2 group"
                      >
                        Book Now
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredTours.length === 0 && (
              <div className="text-center py-20 bg-white rounded-2xl shadow-lg">
                <Compass className="w-20 h-20 text-gray-300 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-400 mb-2">No tours found</h3>
                <p className="text-gray-500 mb-4">Try adjusting your filters or search criteria</p>
                <button
                  onClick={() => {
                    setFilterLocation('all');
                    setFilterType('all');
                    setSearchQuery('');
                    setPriceRange('all');
                  }}
                  className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-all"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        )}

        {/* My Bookings Tab */}
        {activeTab === 'bookings' && (
          <div className="space-y-6">
            {myBookings.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl shadow-lg">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-10 h-10 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">No bookings yet</h3>
                <p className="text-gray-500 mb-6">Start your adventure by booking a tour</p>
                <button
                  onClick={() => setActiveTab('browse')}
                  className="bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-all shadow-lg inline-flex items-center gap-2"
                >
                  <Compass className="w-5 h-5" />
                  Browse Tours
                </button>
              </div>
            ) : (
              <>
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Bookings</h2>
                  <p className="text-gray-600">Manage and track your tour bookings</p>
                </div>

                {myBookings.map((booking) => {
                  const tour = tours.find(t => t.id === booking.tourId);
                  if (!tour) return null;

                  return (
                    <div key={booking.id} className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-all">
                      <div className="flex flex-col md:flex-row">
                        {/* Tour Image */}
                        <div className="w-full md:w-64 h-48 md:h-auto bg-gray-200 flex-shrink-0">
                          <img
                            src={tour.image}
                            alt={tour.name}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        {/* Booking Details */}
                        <div className="flex-1 p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h3 className="text-2xl font-bold text-gray-900 mb-1">{tour.name}</h3>
                              <div className="flex items-center gap-3 text-gray-600 text-sm flex-wrap">
                                <div className="flex items-center gap-1">
                                  <MapPin className="w-4 h-4" />
                                  <span>{tour.location}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Clock className="w-4 h-4" />
                                  <span>{tour.duration} days</span>
                                </div>
                              </div>
                            </div>
                            <span className={`px-4 py-2 rounded-full text-sm font-semibold border ${getStatusColor(booking.status)}`}>
                              {booking.status}
                            </span>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4 p-4 bg-gray-50 rounded-xl">
                            <div>
                              <div className="text-xs text-gray-500 mb-1 font-medium">Start Date</div>
                              <div className="flex items-center gap-2 text-gray-900">
                                <Calendar className="w-4 h-4 text-blue-600" />
                                <span className="font-semibold">{new Date(booking.startDate).toLocaleDateString()}</span>
                              </div>
                            </div>
                            <div>
                              <div className="text-xs text-gray-500 mb-1 font-medium">End Date</div>
                              <div className="flex items-center gap-2 text-gray-900">
                                <Calendar className="w-4 h-4 text-blue-600" />
                                <span className="font-semibold">{new Date(booking.endDate).toLocaleDateString()}</span>
                              </div>
                            </div>
                            <div>
                              <div className="text-xs text-gray-500 mb-1 font-medium">Travelers</div>
                              <div className="flex items-center gap-2 text-gray-900">
                                <Users className="w-4 h-4 text-purple-600" />
                                <span className="font-semibold">{booking.numPeople} person{booking.numPeople > 1 ? 's' : ''}</span>
                              </div>
                            </div>
                            <div>
                              <div className="text-xs text-gray-500 mb-1 font-medium">Destination</div>
                              <div className="flex items-center gap-2 text-gray-900">
                                <MapPin className="w-4 h-4 text-green-600" />
                                <span className="font-semibold">{booking.destination}</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                            <div>
                              {booking.insurance && (
                                <div className="flex items-center gap-2 text-green-600 text-sm mb-2">
                                  <Shield className="w-4 h-4" />
                                  <span className="font-medium">Travel Insurance Included</span>
                                </div>
                              )}
                              <div className="flex items-baseline gap-2">
                                <span className="text-sm text-gray-500">Total:</span>
                                <span className="text-3xl font-bold text-gray-900">
                                  NPR {booking.totalPrice.toLocaleString()}
                                </span>
                              </div>
                            </div>
                            {booking.status === 'PENDING' && (
                              <div className="flex items-center gap-2 text-amber-600 bg-amber-50 px-4 py-2 rounded-xl">
                                <Clock className="w-5 h-5" />
                                <span className="font-medium">Awaiting Confirmation</span>
                              </div>
                            )}
                            {booking.status === 'CONFIRMED' && (
                              <div className="flex items-center gap-2 text-green-600 bg-green-50 px-4 py-2 rounded-xl">
                                <Check className="w-5 h-5" />
                                <span className="font-medium">Confirmed</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </>
            )}
          </div>
        )}
      </div>

      {/* Booking Modal */}
      {selectedTour && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto animate-scaleIn">
            {/* Modal Header with Image */}
            <div className="relative h-64 bg-gradient-to-br from-gray-200 to-gray-300">
              <img
                src={selectedTour.image}
                alt={selectedTour.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <button
                onClick={() => setSelectedTour(null)}
                className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-all shadow-lg"
              >
                <X className="w-5 h-5 text-gray-700" />
              </button>
              <div className="absolute bottom-6 left-6 right-6">
                <h2 className="text-3xl font-bold text-white mb-2">{selectedTour.name}</h2>
                <div className="flex items-center gap-4 text-white/90 text-sm">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>{selectedTour.location}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{selectedTour.duration} days</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>Max {selectedTour.maxGroupSize} people</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-8">
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Complete Your Booking</h3>

                <div className="space-y-6">
                  {/* Date Selection */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Tour Start Date *
                      </label>
                      <input
                        type="date"
                        value={bookingForm.startDate}
                        onChange={(e) => handleStartDateChange(e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Tour End Date (auto-filled)
                      </label>
                      <input
                        type="date"
                        value={bookingForm.endDate}
                        readOnly
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-50 text-gray-600 cursor-not-allowed"
                      />
                    </div>
                  </div>

                  {/* Number of People */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Number of Travelers *
                    </label>
                    <div className="flex items-center gap-4">
                      <button
                        type="button"
                        onClick={() => setBookingForm({ ...bookingForm, numPeople: Math.max(1, bookingForm.numPeople - 1) })}
                        className="w-10 h-10 bg-gray-100 rounded-xl font-bold text-gray-700 hover:bg-gray-200 transition-colors text-xl"
                      >
                        −
                      </button>
                      <span className="text-2xl font-bold text-gray-900 w-12 text-center">{bookingForm.numPeople}</span>
                      <button
                        type="button"
                        onClick={() => setBookingForm({ ...bookingForm, numPeople: Math.min(selectedTour.maxGroupSize, bookingForm.numPeople + 1) })}
                        className="w-10 h-10 bg-gray-100 rounded-xl font-bold text-gray-700 hover:bg-gray-200 transition-colors text-xl"
                      >
                        +
                      </button>
                      <span className="text-sm text-gray-500">Max group: {selectedTour.maxGroupSize}</span>
                    </div>
                  </div>

                  {/* Destination */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Final Destination *
                    </label>
                    <input
                      type="text"
                      value={bookingForm.destination}
                      onChange={(e) => setBookingForm({ ...bookingForm, destination: e.target.value })}
                      placeholder="e.g., Annapurna Base Camp, Chitwan National Park"
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  {/* Travel Insurance */}
                  <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6">
                    <label className="flex items-start gap-4 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={bookingForm.insurance}
                        onChange={(e) => setBookingForm({ ...bookingForm, insurance: e.target.checked })}
                        className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500 mt-1"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Shield className="w-5 h-5 text-blue-600" />
                          <span className="font-bold text-gray-900">Comprehensive Travel Insurance</span>
                          <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                            Recommended
                          </span>
                        </div>
                        <p className="text-sm text-gray-700 mb-2">
                          Full coverage including trip cancellation, medical evacuation, and baggage protection
                        </p>
                        <div className="text-lg font-bold text-blue-600">
                          NPR 800/person
                        </div>
                      </div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Price Summary */}
              {bookingForm.startDate && (
                <div className="bg-gray-50 rounded-2xl p-6 mb-6 border border-gray-200">
                  <h4 className="font-bold text-gray-900 mb-4 text-lg">Price Summary</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between text-gray-700">
                      <span>Tour booking ({bookingForm.numPeople} person{bookingForm.numPeople > 1 ? 's' : ''} × {selectedTour.duration} days)</span>
                      <span className="font-semibold">NPR {(selectedTour.pricePerPerson * bookingForm.numPeople).toLocaleString()}</span>
                    </div>
                    {bookingForm.insurance && (
                      <div className="flex justify-between text-gray-700">
                        <span>Travel Insurance ({bookingForm.numPeople} person{bookingForm.numPeople > 1 ? 's' : ''})</span>
                        <span className="font-semibold">NPR {(800 * bookingForm.numPeople).toLocaleString()}</span>
                      </div>
                    )}
                    <div className="border-t-2 border-gray-300 pt-3 flex justify-between items-center">
                      <span className="text-lg font-bold text-gray-900">Total</span>
                      <span className="text-3xl font-bold text-blue-600">
                        NPR {calculateTotalPrice().toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-4">
                <button
                  onClick={() => setSelectedTour(null)}
                  className="flex-1 px-6 py-4 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleBooking}
                  disabled={!bookingForm.startDate || !bookingForm.destination}
                  className="flex-1 px-6 py-4 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  Confirm Booking
                  <Check className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
