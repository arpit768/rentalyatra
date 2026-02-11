import { useState } from 'react';
import { CheckCircle, XCircle, AlertTriangle, Car, FileText, MapPin, DollarSign } from 'lucide-react';
import { VerificationStatus } from '../types';
import type { Vehicle, Booking, User } from '../types';

interface StaffViewProps {
  vehicles: Vehicle[];
  bookings: Booking[];
  user: User;
  onUpdateVehicle: (id: string, vehicle: Partial<Vehicle>) => void;
  onUpdateBookingStatus: (id: string, status: 'CONFIRMED' | 'CANCELLED' | 'COMPLETED') => void;
}

export default function StaffView({
  vehicles,
  bookings,
  user,
  onUpdateVehicle,
  onUpdateBookingStatus,
}: StaffViewProps) {
  const [activeTab, setActiveTab] = useState<'pending' | 'verified' | 'rejected' | 'bookings'>('pending');
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);

  const pendingVehicles = vehicles.filter(v => v.verificationStatus === VerificationStatus.PENDING);
  const verifiedVehicles = vehicles.filter(v => v.verificationStatus === VerificationStatus.VERIFIED);
  const rejectedVehicles = vehicles.filter(v => v.verificationStatus === VerificationStatus.REJECTED);
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

  const handleVerifyVehicle = (vehicleId: string, status: VerificationStatus.VERIFIED | VerificationStatus.REJECTED) => {
    onUpdateVehicle(vehicleId, { verificationStatus: status });
    setSelectedVehicle(null);
  };

  const renderVehicleList = (vehicleList: Vehicle[], emptyMessage: string) => {
    if (vehicleList.length === 0) {
      return (
        <div className="text-center py-12 bg-white rounded-lg">
          <Car className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">{emptyMessage}</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {vehicleList.map((vehicle) => (
          <div
            key={vehicle.id}
            className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => setSelectedVehicle(vehicle)}
          >
            <div className="relative h-48 bg-gray-200">
              <img
                src={vehicle.image}
                alt={vehicle.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">{vehicle.name}</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>{vehicle.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Car className="w-4 h-4" />
                  <span>{vehicle.type} - {vehicle.plateNumber}</span>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  <span className="font-semibold text-gray-900">NPR {vehicle.pricePerDay.toLocaleString()}/day</span>
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
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Staff Dashboard</h1>
        <p className="text-gray-600">Welcome, {user.name} - Vehicle Verification Officer</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <p className="text-gray-600 text-sm mb-1">Pending Verification</p>
          <p className="text-3xl font-bold text-yellow-600">{pendingVehicles.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <p className="text-gray-600 text-sm mb-1">Verified Vehicles</p>
          <p className="text-3xl font-bold text-green-600">{verifiedVehicles.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <p className="text-gray-600 text-sm mb-1">Rejected</p>
          <p className="text-3xl font-bold text-red-600">{rejectedVehicles.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <p className="text-gray-600 text-sm mb-1">Active Bookings</p>
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
          Pending ({pendingVehicles.length})
        </button>
        <button
          onClick={() => setActiveTab('verified')}
          className={`px-6 py-3 font-semibold border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'verified'
              ? 'border-green-600 text-green-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          Verified ({verifiedVehicles.length})
        </button>
        <button
          onClick={() => setActiveTab('rejected')}
          className={`px-6 py-3 font-semibold border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'rejected'
              ? 'border-red-600 text-red-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          Rejected ({rejectedVehicles.length})
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
      </div>

      {/* Tab Content */}
      {activeTab === 'pending' && renderVehicleList(pendingVehicles, 'No vehicles pending verification')}
      {activeTab === 'verified' && renderVehicleList(verifiedVehicles, 'No verified vehicles yet')}
      {activeTab === 'rejected' && renderVehicleList(rejectedVehicles, 'No rejected vehicles')}

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
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                        <div>
                          <span className="font-medium">Dates:</span> {booking.startDate} to {booking.endDate}
                        </div>
                        <div>
                          <span className="font-medium">Destination:</span> {booking.destination}
                        </div>
                        <div>
                          <span className="font-medium">Total:</span> NPR {booking.totalPrice.toLocaleString()}
                        </div>
                        <div>
                          <span className="font-medium">Insurance:</span> {booking.insurance ? 'Yes' : 'No'}
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

      {/* Vehicle Detail Modal */}
      {selectedVehicle && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Vehicle Verification</h2>
              <p className="text-gray-600">Review vehicle details and documentation</p>
            </div>

            <img
              src={selectedVehicle.image}
              alt={selectedVehicle.name}
              className="w-full h-64 object-cover rounded-lg mb-6"
            />

            <div className="space-y-6">
              {/* Basic Info */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Basic Information</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Vehicle Name:</span>
                    <p className="font-semibold text-gray-900">{selectedVehicle.name}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Type:</span>
                    <p className="font-semibold text-gray-900">{selectedVehicle.type}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Plate Number:</span>
                    <p className="font-semibold text-gray-900">{selectedVehicle.plateNumber}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Location:</span>
                    <p className="font-semibold text-gray-900">{selectedVehicle.location}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Price per Day:</span>
                    <p className="font-semibold text-gray-900">NPR {selectedVehicle.pricePerDay.toLocaleString()}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Status:</span>
                    <p className="font-semibold text-gray-900">{selectedVehicle.verificationStatus}</p>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
                <p className="text-gray-700">{selectedVehicle.description}</p>
              </div>

              {/* Features */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Features</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedVehicle.features.map((feature, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>

              {/* Documents */}
              {selectedVehicle.documents && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Documents</h3>
                  <div className="space-y-2 text-sm">
                    {selectedVehicle.documents.billbook && (
                      <div className="flex items-center gap-2 text-green-700">
                        <CheckCircle className="w-4 h-4" />
                        <span>Billbook/Bluebook uploaded</span>
                      </div>
                    )}
                    {selectedVehicle.documents.insurance && (
                      <div className="flex items-center gap-2 text-green-700">
                        <CheckCircle className="w-4 h-4" />
                        <span>Insurance papers uploaded</span>
                      </div>
                    )}
                    {!selectedVehicle.documents.billbook && !selectedVehicle.documents.insurance && (
                      <div className="flex items-center gap-2 text-yellow-700">
                        <AlertTriangle className="w-4 h-4" />
                        <span>No documents uploaded</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Condition Report */}
              {selectedVehicle.conditionReport && selectedVehicle.conditionReport.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Condition Report</h3>
                  <div className="space-y-2">
                    {selectedVehicle.conditionReport.map((damage) => (
                      <div
                        key={damage.id}
                        className={`p-3 rounded-lg border ${
                          damage.severity === 'critical'
                            ? 'border-red-300 bg-red-50'
                            : damage.severity === 'medium'
                            ? 'border-yellow-300 bg-yellow-50'
                            : 'border-blue-300 bg-blue-50'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-medium text-gray-900 capitalize">
                              {damage.part.replace('_', ' ')} - {damage.severity}
                            </p>
                            <p className="text-sm text-gray-600">{damage.description}</p>
                          </div>
                          <span className="text-xs text-gray-500 capitalize">{damage.view} view</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Verification Actions */}
              {selectedVehicle.verificationStatus === VerificationStatus.PENDING && (
                <div className="flex gap-4 pt-6 border-t border-gray-200">
                  <button
                    onClick={() => handleVerifyVehicle(selectedVehicle.id, VerificationStatus.REJECTED)}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors"
                  >
                    <XCircle className="w-5 h-5" />
                    Reject
                  </button>
                  <button
                    onClick={() => handleVerifyVehicle(selectedVehicle.id, VerificationStatus.VERIFIED)}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
                  >
                    <CheckCircle className="w-5 h-5" />
                    Verify & Approve
                  </button>
                </div>
              )}

              {selectedVehicle.verificationStatus !== 'PENDING' && (
                <div className="flex gap-4 pt-6 border-t border-gray-200">
                  <button
                    onClick={() => setSelectedVehicle(null)}
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
