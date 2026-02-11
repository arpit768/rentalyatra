import type { User } from '../types';
import { UserRole } from '../types';

const TOKEN_KEY = 'yatra_auth_token';
const USER_KEY = 'yatra_user';
const REFRESH_TOKEN_KEY = 'yatra_refresh_token';

// Token Management
export const tokenService = {
  getToken: (): string | null => {
    return localStorage.getItem(TOKEN_KEY);
  },

  setToken: (token: string): void => {
    localStorage.setItem(TOKEN_KEY, token);
  },

  removeToken: (): void => {
    localStorage.removeItem(TOKEN_KEY);
  },

  getRefreshToken: (): string | null => {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  },

  setRefreshToken: (token: string): void => {
    localStorage.setItem(REFRESH_TOKEN_KEY, token);
  },

  removeRefreshToken: (): void => {
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  },
};

// User Management
export const userService = {
  getUser: (): User | null => {
    const userJson = localStorage.getItem(USER_KEY);
    if (!userJson) return null;
    try {
      return JSON.parse(userJson);
    } catch {
      return null;
    }
  },

  setUser: (user: User): void => {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },

  removeUser: (): void => {
    localStorage.removeItem(USER_KEY);
  },
};

// Authentication Service
export const authService = {
  login: async (email: string, password: string): Promise<{ user: User; token: string }> => {
    // In production, this would call your backend API
    // For now, using mock authentication

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Mock authentication logic
    const mockUsers: Record<string, User> = {
      'customer@example.com': {
        id: '1',
        name: 'Ram Kumar',
        email: 'customer@example.com',
        role: UserRole.CUSTOMER,
      },
      'owner@example.com': {
        id: '2',
        name: 'Sita Sharma',
        email: 'owner@example.com',
        role: UserRole.OWNER,
      },
      'staff@example.com': {
        id: '3',
        name: 'Hari Thapa',
        email: 'staff@example.com',
        role: UserRole.STAFF,
      },
      'admin@example.com': {
        id: '4',
        name: 'Krishna Admin',
        email: 'admin@example.com',
        role: UserRole.ADMIN,
      },
    };

    const user = mockUsers[email];
    if (!user || password !== 'password') {
      throw new Error('Invalid credentials');
    }

    // Generate mock JWT token
    const token = `mock_token_${user.id}_${Date.now()}`;

    // Store token and user
    tokenService.setToken(token);
    userService.setUser(user);

    return { user, token };
  },

  signup: async (
    name: string,
    email: string,
    password: string,
    role: User['role']
  ): Promise<{ user: User; token: string }> => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const user: User = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      email,
      role,
    };

    const token = `mock_token_${user.id}_${Date.now()}`;

    tokenService.setToken(token);
    userService.setUser(user);

    return { user, token };
  },

  logout: (): void => {
    tokenService.removeToken();
    tokenService.removeRefreshToken();
    userService.removeUser();
  },

  getCurrentUser: (): User | null => {
    const token = tokenService.getToken();
    if (!token) return null;
    return userService.getUser();
  },

  isAuthenticated: (): boolean => {
    return !!tokenService.getToken() && !!userService.getUser();
  },

  refreshAccessToken: async (): Promise<string> => {
    const refreshToken = tokenService.getRefreshToken();
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    // In production, call your backend to refresh the token
    await new Promise((resolve) => setTimeout(resolve, 500));

    const newToken = `refreshed_token_${Date.now()}`;
    tokenService.setToken(newToken);

    return newToken;
  },
};

// JWT Token Decoder (for mock purposes)
export const decodeToken = (token: string): { userId: string; exp: number } | null => {
  try {
    // In production, use a proper JWT library
    // For mock: extract from token format
    const parts = token.split('_');
    return {
      userId: parts[2] || '',
      exp: parseInt(parts[3]) || Date.now() + 3600000, // 1 hour from now
    };
  } catch {
    return null;
  }
};

// Check if token is expired
export const isTokenExpired = (token: string): boolean => {
  const decoded = decodeToken(token);
  if (!decoded) return true;
  return decoded.exp < Date.now();
};

// Protected Route Helper
export const requireAuth = (callback: () => void): void => {
  if (!authService.isAuthenticated()) {
    // Redirect to login or show auth modal
    console.warn('Authentication required');
    return;
  }
  callback();
};

// Role-based Access Control
export const hasRole = (user: User | null, allowedRoles: User['role'][]): boolean => {
  if (!user) return false;
  return allowedRoles.includes(user.role);
};

export const canAccessResource = (
  user: User | null,
  resourceOwnerId: string,
  allowedRoles: User['role'][] = [UserRole.ADMIN, UserRole.STAFF]
): boolean => {
  if (!user) return false;
  if (user.id === resourceOwnerId) return true;
  return hasRole(user, allowedRoles);
};

export default authService;
