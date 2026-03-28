import { useState } from 'react';
import { Mail, Lock, User as UserIcon, Compass, ArrowRight, Mountain, Shield, Star, Zap } from 'lucide-react';
import { UserRole } from '../types';
import type { User } from '../types';
import * as api from '../services/api';

interface AuthProps {
  onLogin: (user: User) => void;
}

export default function Auth({ onLogin }: AuthProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    role: 'CUSTOMER' as UserRole,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!isLogin && !formData.name) {
      newErrors.name = 'Name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      if (isLogin) {
        const user = await api.login(formData.email, formData.password);
        onLogin(user);
      } else {
        const user = await api.signup(formData.name, formData.email, formData.password);
        onLogin(user);
      }
    } catch (err: any) {
      setErrors({ email: err.message || 'Authentication failed' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Hero */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-900 via-blue-700 to-blue-800 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }} />
        </div>

        <div className="relative z-10 flex flex-col justify-center px-8 xl:px-16 text-white">
          <div className="flex items-center gap-3 mb-8">
            <img src="/logo.jpeg" alt="Logo" className="w-12 h-12 rounded-2xl object-cover border border-white/20" />
            <div>
              <h2 className="text-xl font-bold">Community Tours</h2>
              <p className="text-blue-200 text-xs">and Travels</p>
            </div>
          </div>

          <h1 className="text-5xl font-bold leading-tight mb-6">
            Discover Nepal's
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-warm-300">
              Hidden Treasures
            </span>
          </h1>

          <p className="text-blue-200 text-lg mb-12 max-w-md leading-relaxed">
            Join thousands of travelers exploring the Himalayas with expert guides and handcrafted tour packages.
          </p>

          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                <Mountain className="w-5 h-5" />
              </div>
              <div>
                <p className="font-semibold">200+ Tour Packages</p>
                <p className="text-blue-200 text-sm">From easy walks to extreme expeditions</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <p className="font-semibold">100% Verified Guides</p>
                <p className="text-blue-200 text-sm">Every operator is background-checked</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                <Star className="w-5 h-5" />
              </div>
              <div>
                <p className="font-semibold">4.9 Average Rating</p>
                <p className="text-blue-200 text-sm">From 10,000+ happy travelers</p>
              </div>
            </div>
          </div>

          {/* Decorative elements */}
          <div className="absolute bottom-12 left-8 right-8 xl:left-16 xl:right-16">
            <div className="flex items-center gap-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4">
              <div className="flex -space-x-3">
                {['R', 'S', 'A', 'P'].map((letter, i) => (
                  <div key={i} className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 border-2 border-white/20 flex items-center justify-center text-xs font-bold">
                    {letter}
                  </div>
                ))}
              </div>
              <div className="text-sm">
                <p className="font-semibold">10,000+ travelers</p>
                <p className="text-blue-300 text-xs">exploring Nepal this season</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex items-center justify-center bg-gray-50 px-6 py-12">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <img src="/logo.jpeg" alt="Logo" className="w-14 h-14 rounded-2xl object-cover mx-auto mb-4 shadow-lg shadow-blue-600/20" />

            <h1 className="text-2xl font-bold text-gray-900">Community Tours and Travels</h1>
            <p className="text-gray-500 mt-1 text-sm">Nepal's Premier Tours & Travel Platform</p>
          </div>

          {/* Form Header */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900">
              {isLogin ? 'Welcome back' : 'Create account'}
            </h2>
            <p className="text-gray-500 mt-2">
              {isLogin ? 'Sign in to manage your tours and bookings' : 'Start your journey as a traveler'}
            </p>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mb-8 bg-gray-100 p-1 rounded-xl">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2.5 rounded-lg font-semibold text-sm transition-all ${
                isLogin
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2.5 rounded-lg font-semibold text-sm transition-all ${
                !isLogin
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                <div className="relative">
                  <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    className={`w-full pl-12 pr-4 py-3.5 border-2 rounded-xl focus:outline-none focus:ring-0 transition-colors ${
                      errors.name ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-blue-500'
                    }`}
                  />
                </div>
                {errors.name && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.name}</p>}
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className={`w-full pl-12 pr-4 py-3.5 border-2 rounded-xl focus:outline-none focus:ring-0 transition-colors ${
                    errors.email ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-blue-500'
                  }`}
                />
              </div>
              {errors.email && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className={`w-full pl-12 pr-4 py-3.5 border-2 rounded-xl focus:outline-none focus:ring-0 transition-colors ${
                    errors.password ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-blue-500'
                  }`}
                />
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1.5 font-medium">{errors.password}</p>}
            </div>

            {!isLogin && (
              <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl">
                <p className="text-sm text-blue-800">
                  <span className="font-semibold">Traveler account</span> — you can browse and book tour packages. Staff accounts are managed by the admin.
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3.5 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg shadow-blue-600/20 hover:shadow-blue-600/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  {isLogin ? 'Sign In' : 'Create Account'}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Switch link */}
          <div className="mt-6 text-center text-sm text-gray-500">
            {isLogin ? (
              <p>
                Don't have an account?{' '}
                <button onClick={() => setIsLogin(false)} className="text-blue-600 hover:text-blue-700 font-semibold">
                  Sign up
                </button>
              </p>
            ) : (
              <p>
                Already have an account?{' '}
                <button onClick={() => setIsLogin(true)} className="text-blue-600 hover:text-blue-700 font-semibold">
                  Sign in
                </button>
              </p>
            )}
          </div>

          {/* Quick Login Buttons */}
          {isLogin && (
            <div className="mt-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-px flex-1 bg-gray-200" />
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Zap className="w-3 h-3" />
                  Quick Login
                </span>
                <div className="h-px flex-1 bg-gray-200" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: 'Admin', email: 'admin@communitytours.com', password: 'admin123', color: 'from-accent-500 to-accent-600', icon: 'A' },
                  { label: 'Staff', email: 'staff@communitytours.com', password: 'staff123', color: 'from-warm-400 to-warm-600', icon: 'S' },
                  { label: 'Traveler', email: 'customer@communitytours.com', password: 'customer123', color: 'from-blue-500 to-blue-700', icon: 'T' },
                ].map((account) => (
                  <button
                    key={account.email}
                    type="button"
                    onClick={async () => {
                      setIsLoading(true);
                      try {
                        const user = await api.login(account.email, account.password);
                        onLogin(user);
                      } catch (err: any) {
                        setErrors({ email: err.message || `${account.label} login failed` });
                      } finally {
                        setIsLoading(false);
                      }
                    }}
                    className="flex items-center gap-3 p-3 bg-white border-2 border-gray-100 rounded-xl hover:border-gray-200 hover:shadow-md transition-all text-left group"
                  >
                    <div className={`w-9 h-9 bg-gradient-to-br ${account.color} rounded-lg flex items-center justify-center text-white text-sm font-bold shadow-sm group-hover:scale-110 transition-transform flex-shrink-0`}>
                      {account.icon}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-900 leading-tight">{account.label}</p>
                      <p className="text-[10px] text-gray-400 truncate">{account.email}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
