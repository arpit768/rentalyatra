import type { User, Vehicle, Booking, UserRole } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// API Error handling
class APIError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'APIError';
  }
}

// Generic fetch wrapper with error handling
async function fetchAPI<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = localStorage.getItem('authToken');

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Request failed' }));
      throw new APIError(response.status, error.message || 'Request failed');
    }

    return await response.json();
  } catch (error) {
    if (error instanceof APIError) {
      throw error;
    }
    throw new APIError(0, 'Network error occurred');
  }
}

// Authentication API
export const authAPI = {
  login: async (email: string, password: string): Promise<{ user: User; token: string }> => {
    return fetchAPI('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  signup: async (
    name: string,
    email: string,
    password: string,
    role: UserRole
  ): Promise<{ user: User; token: string }> => {
    return fetchAPI('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ name, email, password, role }),
    });
  },

  logout: async (): Promise<void> => {
    return fetchAPI('/auth/logout', { method: 'POST' });
  },

  refreshToken: async (): Promise<{ token: string }> => {
    return fetchAPI('/auth/refresh', { method: 'POST' });
  },

  getCurrentUser: async (): Promise<User> => {
    return fetchAPI('/auth/me');
  },
};

// Vehicles API
export const vehiclesAPI = {
  getAll: async (params?: {
    location?: string;
    type?: string;
    available?: boolean;
    verificationStatus?: string;
  }): Promise<Vehicle[]> => {
    const queryString = params ? '?' + new URLSearchParams(params as any).toString() : '';
    return fetchAPI(`/vehicles${queryString}`);
  },

  getById: async (id: string): Promise<Vehicle> => {
    return fetchAPI(`/vehicles/${id}`);
  },

  create: async (vehicle: Omit<Vehicle, 'id'>): Promise<Vehicle> => {
    return fetchAPI('/vehicles', {
      method: 'POST',
      body: JSON.stringify(vehicle),
    });
  },

  update: async (id: string, updates: Partial<Vehicle>): Promise<Vehicle> => {
    return fetchAPI(`/vehicles/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  },

  delete: async (id: string): Promise<void> => {
    return fetchAPI(`/vehicles/${id}`, { method: 'DELETE' });
  },

  toggleAvailability: async (id: string): Promise<Vehicle> => {
    return fetchAPI(`/vehicles/${id}/toggle-availability`, { method: 'PATCH' });
  },

  verify: async (id: string, status: 'VERIFIED' | 'REJECTED'): Promise<Vehicle> => {
    return fetchAPI(`/vehicles/${id}/verify`, {
      method: 'PATCH',
      body: JSON.stringify({ verificationStatus: status }),
    });
  },
};

// Bookings API
export const bookingsAPI = {
  getAll: async (params?: {
    customerId?: string;
    vehicleId?: string;
    status?: string;
  }): Promise<Booking[]> => {
    const queryString = params ? '?' + new URLSearchParams(params as any).toString() : '';
    return fetchAPI(`/bookings${queryString}`);
  },

  getById: async (id: string): Promise<Booking> => {
    return fetchAPI(`/bookings/${id}`);
  },

  create: async (booking: Omit<Booking, 'id'>): Promise<Booking> => {
    return fetchAPI('/bookings', {
      method: 'POST',
      body: JSON.stringify(booking),
    });
  },

  updateStatus: async (
    id: string,
    status: 'CONFIRMED' | 'CANCELLED' | 'COMPLETED'
  ): Promise<Booking> => {
    return fetchAPI(`/bookings/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },

  cancel: async (id: string): Promise<Booking> => {
    return fetchAPI(`/bookings/${id}/cancel`, { method: 'PATCH' });
  },
};

// File Upload API
export const uploadAPI = {
  uploadImage: async (file: File, type: 'vehicle' | 'document'): Promise<{ url: string }> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    const token = localStorage.getItem('authToken');

    const response = await fetch(`${API_BASE_URL}/upload`, {
      method: 'POST',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    });

    if (!response.ok) {
      throw new APIError(response.status, 'Upload failed');
    }

    return response.json();
  },

  uploadMultiple: async (
    files: File[],
    type: 'vehicle' | 'document'
  ): Promise<{ urls: string[] }> => {
    const formData = new FormData();
    files.forEach((file) => formData.append('files', file));
    formData.append('type', type);

    const token = localStorage.getItem('authToken');

    const response = await fetch(`${API_BASE_URL}/upload/multiple`, {
      method: 'POST',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    });

    if (!response.ok) {
      throw new APIError(response.status, 'Upload failed');
    }

    return response.json();
  },
};

// Reviews API (for future implementation)
export const reviewsAPI = {
  getByVehicleId: async (vehicleId: string): Promise<any[]> => {
    return fetchAPI(`/reviews/vehicle/${vehicleId}`);
  },

  create: async (review: any): Promise<any> => {
    return fetchAPI('/reviews', {
      method: 'POST',
      body: JSON.stringify(review),
    });
  },
};

// Analytics API (for admin)
export const analyticsAPI = {
  getStats: async (): Promise<{
    totalVehicles: number;
    totalBookings: number;
    totalRevenue: number;
    activeUsers: number;
  }> => {
    return fetchAPI('/analytics/stats');
  },

  getRevenue: async (startDate: string, endDate: string): Promise<any> => {
    return fetchAPI(`/analytics/revenue?start=${startDate}&end=${endDate}`);
  },
};

// Export all APIs as a single object
export const api = {
  auth: authAPI,
  vehicles: vehiclesAPI,
  bookings: bookingsAPI,
  upload: uploadAPI,
  reviews: reviewsAPI,
  analytics: analyticsAPI,
};

export default api;
