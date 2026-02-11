import { Car, Shield, MapPin, Clock, CheckCircle, Star } from 'lucide-react';
import { VerificationStatus } from '../types';
import type { Vehicle } from '../types';

interface LandingPageProps {
  vehicles: Vehicle[];
  onGetStarted: () => void;
}

export default function LandingPage({ vehicles, onGetStarted }: LandingPageProps) {
  const featuredVehicles = vehicles.filter(v => v.available && v.verificationStatus === VerificationStatus.VERIFIED).slice(0, 3);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6 leading-tight">
              Explore Nepal Your Way
            </h1>
            <p className="text-xl mb-8 text-blue-100">
              Rent quality vehicles for your adventures across Nepal's stunning landscapes.
              From Kathmandu to the Himalayas, we've got you covered.
            </p>
            <button
              onClick={onGetStarted}
              className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-50 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Get Started
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
            Why Choose Yatra Rentals?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                <Shield className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">Verified Vehicles</h3>
              <p className="text-gray-600">
                All vehicles are inspected and verified by our staff for your safety
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                <MapPin className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">Nepal-Wide Coverage</h3>
              <p className="text-gray-600">
                Pick up vehicles from major cities and tourist destinations
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4">
                <Clock className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">Flexible Booking</h3>
              <p className="text-gray-600">
                Book by the day with easy cancellation policies
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-4">
                <CheckCircle className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">Quality Assured</h3>
              <p className="text-gray-600">
                Well-maintained vehicles with comprehensive insurance options
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Vehicles */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
            Featured Vehicles
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredVehicles.map((vehicle) => (
              <div
                key={vehicle.id}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow"
              >
                <div className="relative h-48 bg-gray-200">
                  <img
                    src={vehicle.image}
                    alt={vehicle.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    Available
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
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-2xl font-bold text-blue-600">
                        NPR {vehicle.pricePerDay.toLocaleString()}
                      </span>
                      <span className="text-gray-500 text-sm">/day</span>
                    </div>
                    <button
                      onClick={onGetStarted}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {featuredVehicles.length === 0 && (
            <div className="text-center py-12">
              <Car className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No vehicles available at the moment</p>
            </div>
          )}
        </div>
      </section>

      {/* Popular Destinations */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
            Popular Destinations
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {['Kathmandu', 'Pokhara', 'Chitwan', 'Mustang', 'Lumbini', 'Nagarkot', 'Lukla', 'Biratnagar'].map((location) => (
              <div
                key={location}
                className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-lg text-center hover:shadow-md transition-shadow cursor-pointer"
              >
                <MapPin className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <h3 className="font-semibold text-gray-900">{location}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
            How It Works
          </h2>
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-600 text-white rounded-full text-xl font-bold mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">Choose Your Vehicle</h3>
              <p className="text-gray-600">
                Browse our selection of verified vehicles and pick the perfect one for your journey
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-600 text-white rounded-full text-xl font-bold mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">Book & Confirm</h3>
              <p className="text-gray-600">
                Select your dates, add insurance if needed, and confirm your booking
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-600 text-white rounded-full text-xl font-bold mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">Hit the Road</h3>
              <p className="text-gray-600">
                Pick up your vehicle and start exploring Nepal's beautiful landscapes
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Start Your Adventure?</h2>
          <p className="text-xl mb-8 text-blue-100">
            Join thousands of travelers exploring Nepal with Yatra Rentals
          </p>
          <button
            onClick={onGetStarted}
            className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-50 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            Get Started Today
          </button>
        </div>
      </section>

      {/* Footer Note */}
      <section className="py-8 bg-gray-900 text-gray-400 text-center">
        <div className="container mx-auto px-4">
          <p className="text-sm">
            Yatra Rentals Nepal - Your trusted partner for vehicle rentals across Nepal
          </p>
        </div>
      </section>
    </div>
  );
}
