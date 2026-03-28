import type { User, Tour, Booking, AppNotification } from '../types';
import { UserRole, VerificationStatus } from '../types';
import { MOCK_TOURS, MOCK_BOOKINGS } from '../constants';

// ─── Storage keys ────────────────────────────────────────────────────────────

const KEYS = {
  TOKEN: 'auth_token',
  CURRENT_USER: 'current_user',
  USERS: 'users',
  TOURS: 'tours',
  BOOKINGS: 'bookings',
  NOTIFICATIONS: 'notifications',
  SEEDED: 'data_seeded',
} as const;

// ─── Helpers ─────────────────────────────────────────────────────────────────

function uid(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 9);
}

function load<T>(key: string, fallback: T[] = []): T[] {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function save<T>(key: string, data: T[]): void {
  localStorage.setItem(key, JSON.stringify(data));
}

// ─── Seed default data on first visit ────────────────────────────────────────

interface StoredUser extends User {
  password: string;
}

function seedIfNeeded(): void {
  if (localStorage.getItem(KEYS.SEEDED)) return;

  const defaultUsers: StoredUser[] = [
    { id: 'admin-1', name: 'Admin User', email: 'admin@communitytours.com', role: UserRole.ADMIN, password: 'admin123' },
    { id: 'staff-1', name: 'Staff User', email: 'staff@communitytours.com', role: UserRole.STAFF, password: 'staff123' },
    { id: 'customer-1', name: 'Ram Sharma', email: 'customer@communitytours.com', role: UserRole.CUSTOMER, password: 'customer123' },
  ];

  save(KEYS.USERS, defaultUsers);
  save(KEYS.TOURS, MOCK_TOURS);
  save(KEYS.BOOKINGS, MOCK_BOOKINGS);
  save(KEYS.NOTIFICATIONS, []);
  localStorage.setItem(KEYS.SEEDED, '1');
}

seedIfNeeded();

// ─── Notification helper ─────────────────────────────────────────────────────

function addNotification(message: string, actorName: string, actorRole: UserRole, forRole: UserRole | 'ALL'): void {
  const notifs = load<AppNotification>(KEYS.NOTIFICATIONS);
  notifs.unshift({
    id: uid(),
    message,
    actorName,
    actorRole,
    timestamp: new Date().toISOString(),
    read: false,
    forRole,
  });
  save(KEYS.NOTIFICATIONS, notifs);
}

// ─── Token helpers ───────────────────────────────────────────────────────────

export const getToken = () => localStorage.getItem(KEYS.TOKEN);
export const setToken = (t: string) => localStorage.setItem(KEYS.TOKEN, t);
export const clearToken = () => {
  localStorage.removeItem(KEYS.TOKEN);
  localStorage.removeItem(KEYS.CURRENT_USER);
};

function getCurrentUser(): User | null {
  try {
    const raw = localStorage.getItem(KEYS.CURRENT_USER);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

// ─── Auth ────────────────────────────────────────────────────────────────────

export async function login(email: string, password: string): Promise<User> {
  const users = load<StoredUser>(KEYS.USERS);
  const found = users.find(u => u.email === email && u.password === password);
  if (!found) throw new Error('Invalid email or password');

  const token = 'token_' + uid();
  setToken(token);
  const user: User = { id: found.id, name: found.name, email: found.email, role: found.role };
  localStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(user));
  return user;
}

export async function signup(name: string, email: string, password: string): Promise<User> {
  const users = load<StoredUser>(KEYS.USERS);
  if (users.find(u => u.email === email)) throw new Error('Email already registered');

  const newUser: StoredUser = {
    id: uid(),
    name,
    email,
    role: UserRole.CUSTOMER,
    password,
  };
  users.push(newUser);
  save(KEYS.USERS, users);

  const token = 'token_' + uid();
  setToken(token);
  const user: User = { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role };
  localStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(user));

  addNotification(`New traveler "${name}" joined the platform`, name, UserRole.CUSTOMER, UserRole.ADMIN);
  return user;
}

export async function getMe(): Promise<User> {
  const user = getCurrentUser();
  if (!user) throw new Error('Not authenticated');
  return user;
}

export async function logout(): Promise<void> {
  clearToken();
}

// ─── Tours ───────────────────────────────────────────────────────────────────

export async function getTours(_params?: Record<string, string>): Promise<Tour[]> {
  return load<Tour>(KEYS.TOURS);
}

export async function createTour(data: Omit<Tour, 'id' | 'createdBy'>): Promise<Tour> {
  const user = getCurrentUser();
  if (!user) throw new Error('Not authenticated');

  const tours = load<Tour>(KEYS.TOURS);
  const newTour: Tour = {
    ...data,
    id: uid(),
    createdBy: user.id,
    verificationStatus: user.role === UserRole.ADMIN ? VerificationStatus.VERIFIED : VerificationStatus.PENDING,
  };
  tours.push(newTour);
  save(KEYS.TOURS, tours);

  addNotification(
    `New tour "${newTour.name}" listed by ${user.name}`,
    user.name,
    user.role,
    UserRole.ADMIN,
  );
  return newTour;
}

export async function updateTour(id: string, data: Partial<Tour>): Promise<Tour> {
  const user = getCurrentUser();
  if (!user) throw new Error('Not authenticated');

  const tours = load<Tour>(KEYS.TOURS);
  const idx = tours.findIndex(t => t.id === id);
  if (idx === -1) throw new Error('Tour not found');

  tours[idx] = { ...tours[idx], ...data, id };
  save(KEYS.TOURS, tours);

  if (data.verificationStatus) {
    addNotification(
      `Tour "${tours[idx].name}" has been ${data.verificationStatus.toLowerCase()} by ${user.name}`,
      user.name,
      user.role,
      UserRole.STAFF,
    );
  }

  return tours[idx];
}

export async function deleteTour(id: string): Promise<void> {
  const tours = load<Tour>(KEYS.TOURS).filter(t => t.id !== id);
  save(KEYS.TOURS, tours);
}

// ─── Bookings ────────────────────────────────────────────────────────────────

export async function getBookings(): Promise<Booking[]> {
  const user = getCurrentUser();
  if (!user) throw new Error('Not authenticated');

  const bookings = load<Booking>(KEYS.BOOKINGS);
  if (user.role === UserRole.CUSTOMER) {
    return bookings.filter(b => b.customerId === user.id);
  }
  return bookings;
}

export async function createBooking(data: Omit<Booking, 'id' | 'customerId' | 'status'>): Promise<Booking> {
  const user = getCurrentUser();
  if (!user) throw new Error('Not authenticated');

  const bookings = load<Booking>(KEYS.BOOKINGS);
  const newBooking: Booking = {
    ...data,
    id: uid(),
    customerId: user.id,
    status: 'PENDING',
  };
  bookings.push(newBooking);
  save(KEYS.BOOKINGS, bookings);

  addNotification(
    `New booking request from ${user.name} for "${data.destination}"`,
    user.name,
    user.role,
    UserRole.STAFF,
  );
  addNotification(
    `New booking request from ${user.name} for "${data.destination}"`,
    user.name,
    user.role,
    UserRole.ADMIN,
  );
  return newBooking;
}

export async function updateBookingStatus(
  id: string,
  status: 'CONFIRMED' | 'CANCELLED' | 'COMPLETED'
): Promise<Booking> {
  const user = getCurrentUser();
  if (!user) throw new Error('Not authenticated');

  const bookings = load<Booking>(KEYS.BOOKINGS);
  const idx = bookings.findIndex(b => b.id === id);
  if (idx === -1) throw new Error('Booking not found');

  bookings[idx] = { ...bookings[idx], status };
  save(KEYS.BOOKINGS, bookings);

  addNotification(
    `Booking for "${bookings[idx].destination}" has been ${status.toLowerCase()} by ${user.name}`,
    user.name,
    user.role,
    UserRole.CUSTOMER,
  );
  return bookings[idx];
}

// ─── Notifications ───────────────────────────────────────────────────────────

export async function getNotifications(): Promise<AppNotification[]> {
  const user = getCurrentUser();
  if (!user) return [];

  return load<AppNotification>(KEYS.NOTIFICATIONS).filter(
    n => n.forRole === user.role || n.forRole === 'ALL'
  );
}

export async function markNotificationsRead(): Promise<void> {
  const user = getCurrentUser();
  if (!user) return;

  const notifs = load<AppNotification>(KEYS.NOTIFICATIONS);
  for (const n of notifs) {
    if (n.forRole === user.role || n.forRole === 'ALL') {
      n.read = true;
    }
  }
  save(KEYS.NOTIFICATIONS, notifs);
}

// ─── Users (Admin) ───────────────────────────────────────────────────────────

export async function getUsers(roles?: string): Promise<User[]> {
  const users = load<StoredUser>(KEYS.USERS);
  const filtered = roles ? users.filter(u => u.role === roles) : users;
  return filtered.map(({ password: _, ...u }) => u);
}

export async function createStaffUser(data: { name: string; email: string; password: string; phone?: string }): Promise<User> {
  const users = load<StoredUser>(KEYS.USERS);
  if (users.find(u => u.email === data.email)) throw new Error('Email already registered');

  const newUser: StoredUser = {
    id: uid(),
    name: data.name,
    email: data.email,
    role: UserRole.STAFF,
    password: data.password,
  };
  users.push(newUser);
  save(KEYS.USERS, users);

  return { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role };
}

export async function deleteUser(id: string): Promise<void> {
  const users = load<StoredUser>(KEYS.USERS).filter(u => u.id !== id);
  save(KEYS.USERS, users);
}

// ─── Analytics ───────────────────────────────────────────────────────────────

export async function getAnalytics() {
  const tours = load<Tour>(KEYS.TOURS);
  const bookings = load<Booking>(KEYS.BOOKINGS);
  const users = load<StoredUser>(KEYS.USERS);

  const locationStats: Record<string, number> = {};
  const typeStats: Record<string, number> = {};
  for (const t of tours) {
    locationStats[t.location] = (locationStats[t.location] || 0) + 1;
    typeStats[t.type] = (typeStats[t.type] || 0) + 1;
  }

  return {
    tours: {
      total: tours.length,
      verified: tours.filter(t => t.verificationStatus === VerificationStatus.VERIFIED).length,
      pending: tours.filter(t => t.verificationStatus === VerificationStatus.PENDING).length,
      rejected: tours.filter(t => t.verificationStatus === VerificationStatus.REJECTED).length,
    },
    bookings: {
      total: bookings.length,
      active: bookings.filter(b => b.status === 'CONFIRMED' || b.status === 'PENDING').length,
      completed: bookings.filter(b => b.status === 'COMPLETED').length,
    },
    revenue: bookings
      .filter(b => b.status === 'CONFIRMED' || b.status === 'COMPLETED')
      .reduce((sum, b) => sum + b.totalPrice, 0),
    users: {
      staff: users.filter(u => u.role === UserRole.STAFF).length,
      customers: users.filter(u => u.role === UserRole.CUSTOMER).length,
    },
    locationStats,
    typeStats,
  };
}
