import { Compass, Shield, MapPin, Clock, CheckCircle, Star, Award, Users, Zap, TrendingUp, Phone, Mail } from 'lucide-react';
import { VerificationStatus } from '../types';
import type { Tour } from '../types';

interface LandingPageProps {
  tours: Tour[];
  onGetStarted: () => void;
}

export default function LandingPage({ tours, onGetStarted }: LandingPageProps) {
  const featuredTours = tours.filter(t => t.available && t.verificationStatus === VerificationStatus.VERIFIED).slice(0, 6);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-500';
      case 'Moderate': return 'bg-yellow-500';
      case 'Challenging': return 'bg-orange-500';
      case 'Extreme': return 'bg-red-500';
      default: return 'bg-blue-500';
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Modern Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
        </div>

        <div className="container mx-auto px-4 py-24 md:py-32 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6 border border-white/20">
              <Award className="w-4 h-4 text-yellow-400" />
              <span className="text-sm font-medium">Nepal's #1 Trusted Tours & Travel Platform</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Your Journey,
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-cyan-200">
                Our Expertise
              </span>
            </h1>

            <p className="text-xl md:text-2xl mb-10 text-blue-100 max-w-2xl mx-auto leading-relaxed">
              Discover handcrafted tour packages led by expert guides. From Himalayan treks to cultural journeys — unforgettable adventures across Nepal.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={onGetStarted}
                className="group bg-white text-blue-900 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-blue-50 transition-all shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 flex items-center gap-2"
              >
                Start Your Journey
                <Zap className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={onGetStarted}
                className="group bg-transparent border-2 border-white/30 backdrop-blur-sm text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/10 transition-all flex items-center gap-2"
              >
                Browse Tours
                <Compass className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-8 mt-16 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold mb-1">200+</div>
                <div className="text-blue-200 text-sm">Tour Packages</div>
              </div>
              <div className="text-center border-x border-white/20">
                <div className="text-3xl md:text-4xl font-bold mb-1">10K+</div>
                <div className="text-blue-200 text-sm">Happy Travelers</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold mb-1">4.9★</div>
                <div className="text-blue-200 text-sm">Average Rating</div>
              </div>
            </div>
          </div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 80H1440V0C1440 0 1080 80 720 80C360 80 0 0 0 0V80Z" fill="white"/>
          </svg>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
              Why Thousands Choose Community Tours and Travels
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We're not just another travel platform. We're your trusted adventure partner.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all border border-gray-100 group hover:-translate-y-2">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl mb-6 group-hover:scale-110 transition-transform">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">100% Verified</h3>
              <p className="text-gray-600 leading-relaxed">
                Every tour package and operator undergoes rigorous verification for your safety and peace of mind.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all border border-gray-100 group hover:-translate-y-2">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl mb-6 group-hover:scale-110 transition-transform">
                <MapPin className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Nationwide</h3>
              <p className="text-gray-600 leading-relaxed">
                Tours covering 8+ major destinations across Nepal — from the Himalayas to the Terai.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all border border-gray-100 group hover:-translate-y-2">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl mb-6 group-hover:scale-110 transition-transform">
                <Clock className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Instant Booking</h3>
              <p className="text-gray-600 leading-relaxed">
                Book in minutes with instant confirmation. Flexible cancellation and 24/7 customer support.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all border border-gray-100 group hover:-translate-y-2">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl mb-6 group-hover:scale-110 transition-transform">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900">Best Prices</h3>
              <p className="text-gray-600 leading-relaxed">
                Transparent pricing with no hidden fees. Comprehensive travel insurance options at competitive rates.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Tours */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full mb-4 font-medium">
              <Star className="w-4 h-4" />
              Featured Packages
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
              Tours You'll Love
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              From gentle cultural walks to epic Himalayan expeditions, find your perfect journey
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {featuredTours.map((tour) => (
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
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      Available Now
                    </span>
                    <span className="bg-blue-600 text-white px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg">
                      {tour.type}
                    </span>
                  </div>
                  <div className="absolute bottom-4 left-4 flex items-center gap-2">
                    <span className="bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg flex items-center gap-1.5">
                      <Shield className="w-3 h-3 text-green-600" />
                      Verified
                    </span>
                    <span className={`${getDifficultyColor(tour.difficulty)} text-white px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg`}>
                      {tour.difficulty}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                        {tour.name}
                      </h3>
                      <div className="flex items-center gap-3 text-gray-500 text-sm">
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
                  </div>

                  <p className="text-gray-600 text-sm mb-6 line-clamp-2 leading-relaxed">
                    {tour.description}
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div>
                      <div className="text-sm text-gray-500 mb-1">Starting from</div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-bold text-gray-900">
                          {tour.pricePerPerson.toLocaleString()}
                        </span>
                        <span className="text-gray-500 text-sm font-medium">NPR/person</span>
                      </div>
                    </div>
                    <button
                      onClick={onGetStarted}
                      className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl flex items-center gap-2 group"
                    >
                      Book
                      <Compass className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {featuredTours.length === 0 && (
            <div className="text-center py-20">
              <Compass className="w-20 h-20 text-gray-300 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-400 mb-2">No tours available</h3>
              <p className="text-gray-500">Check back soon for new packages</p>
            </div>
          )}

          <div className="text-center mt-12">
            <button
              onClick={onGetStarted}
              className="bg-gray-900 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-800 transition-all shadow-lg inline-flex items-center gap-2"
            >
              View All Tours
              <TrendingUp className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Popular Destinations */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
              Explore Nepal's Beauty
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              From ancient temples to mountain peaks, adventure awaits
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {[
              { name: 'Kathmandu', desc: 'Cultural Capital' },
              { name: 'Pokhara', desc: 'Trek Gateway' },
              { name: 'Chitwan', desc: 'Wildlife Safari' },
              { name: 'Mustang', desc: 'Hidden Kingdom' },
              { name: 'Lumbini', desc: 'Birth of Buddha' },
              { name: 'Nagarkot', desc: 'Sunrise Views' },
              { name: 'Lukla (EBC)', desc: 'Everest Gateway' },
              { name: 'Biratnagar', desc: 'Eastern Hub' }
            ].map((location) => (
              <div
                key={location.name}
                className="relative bg-gradient-to-br from-blue-600 to-indigo-700 p-8 rounded-2xl text-white cursor-pointer overflow-hidden group hover:shadow-2xl transition-all hover:-translate-y-2"
              >
                <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity"></div>
                <MapPin className="w-10 h-10 mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="font-bold text-lg mb-1">{location.name}</h3>
                <p className="text-blue-200 text-sm">{location.desc}</p>
                <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-white opacity-5 rounded-full group-hover:scale-150 transition-transform"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
              Book in Three Simple Steps
            </h2>
            <p className="text-xl text-gray-600">
              Your next adventure is just minutes away
            </p>
          </div>

          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            {/* Connection Lines */}
            <div className="hidden md:block absolute top-16 left-1/6 right-1/6 h-0.5 bg-gradient-to-r from-blue-600 via-purple-600 to-orange-600"></div>

            <div className="text-center relative">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl text-2xl font-bold mb-6 shadow-xl relative z-10">
                1
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Choose Your Tour</h3>
              <p className="text-gray-600 text-lg leading-relaxed">
                Browse verified tour packages, compare prices, and read reviews from real travelers
              </p>
            </div>

            <div className="text-center relative">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-2xl text-2xl font-bold mb-6 shadow-xl relative z-10">
                2
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Book Instantly</h3>
              <p className="text-gray-600 text-lg leading-relaxed">
                Select your dates, number of travelers, add travel insurance and confirm in under 2 minutes
              </p>
            </div>

            <div className="text-center relative">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-2xl text-2xl font-bold mb-6 shadow-xl relative z-10">
                3
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Explore Nepal</h3>
              <p className="text-gray-600 text-lg leading-relaxed">
                Meet your expert guide and embark on an unforgettable journey through Nepal's wonders
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
              Loved by Travelers
            </h2>
            <p className="text-xl text-gray-600">
              See what our customers have to say
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                name: 'Sarah Johnson',
                role: 'Adventure Traveler',
                text: 'The best tour experience in Nepal! Professional guides, stunning scenery, and everything was perfectly organized. Highly recommend!',
                rating: 5
              },
              {
                name: 'Raj Sharma',
                role: 'Cultural Explorer',
                text: 'Smooth booking process and excellent customer support. The Kathmandu heritage tour was absolutely incredible. Will definitely book again!',
                rating: 5
              },
              {
                name: 'Emma Wilson',
                role: 'Solo Traveler',
                text: 'Felt completely safe throughout my Annapurna trek. The verified guides and transparent booking process gave me complete peace of mind.',
                rating: 5
              }
            ].map((testimonial, idx) => (
              <div key={idx} className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 leading-relaxed text-lg">"{testimonial.text}"</p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                    {testimonial.name[0]}
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-500">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative py-24 bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
        </div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready for Your Next Adventure?</h2>
          <p className="text-xl mb-10 text-blue-100 max-w-2xl mx-auto">
            Join over 10,000 happy travelers who've explored Nepal with Community Tours and Travels
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={onGetStarted}
              className="group bg-white text-blue-900 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-blue-50 transition-all shadow-2xl inline-flex items-center justify-center gap-2"
            >
              Start Your Journey Today
              <Zap className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="flex items-center justify-center gap-8 mt-12 text-blue-200">
            <div className="flex items-center gap-2">
              <Phone className="w-5 h-5" />
              <span>+977-1-4567890</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-5 h-5" />
              <span>hello@communitytours.com</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <section className="py-8 bg-gray-900 text-gray-400 text-center">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Compass className="w-5 h-5 text-blue-400" />
            <span className="font-bold text-white">Community Tours and Travels</span>
          </div>
          <p className="text-sm">
            Your trusted partner for tours & travel across Nepal © 2026
          </p>
        </div>
      </section>
    </div>
  );
}
