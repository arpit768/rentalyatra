import type { User, Tour, Booking, AppNotification } from '../types';

const BASE = '/api';

// ─── Token helpers ────────────────────────────────────────────────────────────

export const getToken = () => localStorage.getItem('auth_token');
export const setToken = (t: string) => localStorage.setItem('auth_token', t);
export const clearToken = () => localStorage.removeItem('auth_token');

// ─── Core fetch wrapper ───────────────────────────────────────────────────────

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const res = await fetch(`${BASE}${path}`, { ...options, headers });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(err.message || 'Request failed');
  }

  return res.json() as Promise<T>;
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

export async function login(email: string, password: string): Promise<User> {
  const { token, user } = await request<{ token: string; user: User }>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  setToken(token);
  return user;
}

export async function signup(name: string, email: string, password: string): Promise<User> {
  const { token, user } = await request<{ token: string; user: User }>('/auth/signup', {
    method: 'POST',
    body: JSON.stringify({ name, email, password, role: 'CUSTOMER' }),
  });
  setToken(token);
  return user;
}

export async function getMe(): Promise<User> {
  const { user } = await request<{ user: User }>('/auth/me');
  return user;
}

export async function logout(): Promise<void> {
  await request('/auth/logout', { method: 'POST' }).catch(() => {});
  clearToken();
}

// ─── Tours ────────────────────────────────────────────────────────────────────

export async function getTours(params?: Record<string, string>): Promise<Tour[]> {
  const qs = params ? '?' + new URLSearchParams(params).toString() : '';
  const { tours } = await request<{ tours: Tour[] }>(`/tours${qs}`);
  return tours;
}

export async function createTour(data: Omit<Tour, 'id' | 'createdBy'>): Promise<Tour> {
  const { tour } = await request<{ tour: Tour }>('/tours', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  return tour;
}

export async function updateTour(id: string, data: Partial<Tour>): Promise<Tour> {
  const { tour } = await request<{ tour: Tour }>(`/tours/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
  return tour;
}

export async function deleteTour(id: string): Promise<void> {
  await request(`/tours/${id}`, { method: 'DELETE' });
}

// ─── Bookings ─────────────────────────────────────────────────────────────────

export async function getBookings(): Promise<Booking[]> {
  const { bookings } = await request<{ bookings: Booking[] }>('/bookings');
  return bookings;
}

export async function createBooking(data: Omit<Booking, 'id' | 'customerId' | 'status'>): Promise<Booking> {
  const { booking } = await request<{ booking: Booking }>('/bookings', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  return booking;
}

export async function updateBookingStatus(
  id: string,
  status: 'CONFIRMED' | 'CANCELLED' | 'COMPLETED'
): Promise<Booking> {
  const { booking } = await request<{ booking: Booking }>(`/bookings/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
  return booking;
}

// ─── Notifications ────────────────────────────────────────────────────────────

export async function getNotifications(): Promise<AppNotification[]> {
  const { notifications } = await request<{ notifications: AppNotification[] }>('/notifications');
  return notifications;
}

export async function markNotificationsRead(): Promise<void> {
  await request('/notifications/read', { method: 'POST' });
}

// ─── Users (Admin) ────────────────────────────────────────────────────────────

export async function getUsers(roles?: string): Promise<User[]> {
  const qs = roles ? `?role=${roles}` : '';
  const { users } = await request<{ users: User[] }>(`/users${qs}`);
  return users;
}

export async function createStaffUser(data: { name: string; email: string; password: string; phone?: string }): Promise<User> {
  const { token, user } = await request<{ token: string; user: User }>('/auth/signup', {
    method: 'POST',
    body: JSON.stringify({ ...data, role: 'STAFF' }),
  });
  // Don't overwrite the current admin's token
  void token;
  return user;
}

export async function deleteUser(id: string): Promise<void> {
  await request(`/users/${id}`, { method: 'DELETE' });
}

// ─── Analytics ────────────────────────────────────────────────────────────────

export async function getAnalytics() {
  return request<{
    tours: { total: number; verified: number; pending: number; rejected: number };
    bookings: { total: number; active: number; completed: number };
    revenue: number;
    users: { staff: number; customers: number };
    locationStats: Record<string, number>;
    typeStats: Record<string, number>;
  }>('/analytics/stats');
}
