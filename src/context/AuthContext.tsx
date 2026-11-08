import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthUser, AuthState, UserRole } from '../types/auth.ts';
import { ASSET_PATHS } from '../data/mockData.ts';

interface LoginCredentials {
  email: string;
  password: string;
  rememberMe: boolean;
  simulateNetworkError?: boolean;
}

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  switchRole: (role: UserRole) => void;
}

const STORAGE_KEY_TOKEN = 'apex_auth_jwt_token';
const STORAGE_KEY_USER = 'apex_auth_user_session';
const STORAGE_KEY_REMEMBER = 'apex_auth_remember_me';

// Seed authentic users for testing multi-role access
export const DEMO_USERS: Record<string, { user: AuthUser; passwordHash: string }> = {
  'superadmin@apexglobaledu.com': {
    passwordHash: 'SuperAdmin123!',
    user: {
      id: 'usr_super_01',
      name: 'Dr. Eleanor Vance',
      email: 'superadmin@apexglobaledu.com',
      role: 'Super Admin',
      avatarUrl: ASSET_PATHS.adminAvatar,
      title: 'Managing Director & Chief Admissions Officer',
      department: 'Executive Governance',
      lastLogin: new Date().toISOString(),
    },
  },
  'admin@apexglobaledu.com': {
    passwordHash: 'Admin123!',
    user: {
      id: 'usr_admin_02',
      name: 'Marcus Sterling',
      email: 'admin@apexglobaledu.com',
      role: 'Admin',
      avatarUrl: ASSET_PATHS.consultation,
      title: 'Senior Student Caseworker & Admissions Officer',
      department: 'Admissions & Visa Operations',
      lastLogin: new Date().toISOString(),
    },
  },
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true,
  });

  // Rehydrate session from localStorage or sessionStorage on app mount
  useEffect(() => {
    try {
      const isRemembered = localStorage.getItem(STORAGE_KEY_REMEMBER) === 'true';
      const storage = isRemembered ? localStorage : sessionStorage;

      const storedToken = storage.getItem(STORAGE_KEY_TOKEN) || localStorage.getItem(STORAGE_KEY_TOKEN);
      const storedUserJson = storage.getItem(STORAGE_KEY_USER) || localStorage.getItem(STORAGE_KEY_USER);

      if (storedToken && storedUserJson) {
        const user = JSON.parse(storedUserJson) as AuthUser;
        setAuthState({
          user,
          token: storedToken,
          isAuthenticated: true,
          isLoading: false,
        });
        return;
      }
    } catch {
      // Storage parsing error; clear corrupted state
      localStorage.removeItem(STORAGE_KEY_TOKEN);
      localStorage.removeItem(STORAGE_KEY_USER);
      sessionStorage.removeItem(STORAGE_KEY_TOKEN);
      sessionStorage.removeItem(STORAGE_KEY_USER);
    }

    setAuthState((prev) => ({ ...prev, isLoading: false }));
  }, []);

  const login = async ({
    email,
    password,
    rememberMe,
    simulateNetworkError,
  }: LoginCredentials): Promise<{ success: boolean; error?: string }> => {
    setAuthState((prev) => ({ ...prev, isLoading: true }));

    // Simulate realistic async network roundtrip
    await new Promise((resolve) => setTimeout(resolve, 600));

    // Simulated network error condition
    if (simulateNetworkError) {
      setAuthState((prev) => ({ ...prev, isLoading: false }));
      return {
        success: false,
        error: 'Network error: Unable to reach auth service. Please check your internet connection and try again.',
      };
    }

    const normalizedEmail = email.trim().toLowerCase();
    const matchedAccount = DEMO_USERS[normalizedEmail];

    // Check credentials against mock store
    if (!matchedAccount || matchedAccount.passwordHash !== password) {
      setAuthState((prev) => ({ ...prev, isLoading: false }));
      return {
        success: false,
        error: 'Invalid email address or password. Verify your credentials or use the demo accounts below.',
      };
    }

    // Generate mock JWT token
    const mockJwt = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${btoa(
      JSON.stringify({
        sub: matchedAccount.user.id,
        email: matchedAccount.user.email,
        role: matchedAccount.user.role,
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24, // 24 hours
      })
    )}.mock_signature_${Date.now()}`;

    const updatedUser: AuthUser = {
      ...matchedAccount.user,
      lastLogin: new Date().toISOString(),
    };

    // Store in storage based on rememberMe
    const storage = rememberMe ? localStorage : sessionStorage;
    storage.setItem(STORAGE_KEY_TOKEN, mockJwt);
    storage.setItem(STORAGE_KEY_USER, JSON.stringify(updatedUser));
    localStorage.setItem(STORAGE_KEY_REMEMBER, rememberMe ? 'true' : 'false');

    setAuthState({
      user: updatedUser,
      token: mockJwt,
      isAuthenticated: true,
      isLoading: false,
    });

    return { success: true };
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY_TOKEN);
    localStorage.removeItem(STORAGE_KEY_USER);
    localStorage.removeItem(STORAGE_KEY_REMEMBER);
    sessionStorage.removeItem(STORAGE_KEY_TOKEN);
    sessionStorage.removeItem(STORAGE_KEY_USER);

    setAuthState({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
    });
  };

  // Utility to switch active role on the fly for ease of evaluation and testing
  const switchRole = (newRole: UserRole) => {
    if (!authState.user) return;

    const updatedUser: AuthUser = {
      ...authState.user,
      role: newRole,
      title:
        newRole === 'Super Admin'
          ? 'Managing Director & Chief Admissions Officer'
          : 'Senior Student Caseworker & Admissions Officer',
    };

    const isRemembered = localStorage.getItem(STORAGE_KEY_REMEMBER) === 'true';
    const storage = isRemembered ? localStorage : sessionStorage;
    storage.setItem(STORAGE_KEY_USER, JSON.stringify(updatedUser));

    setAuthState((prev) => ({
      ...prev,
      user: updatedUser,
    }));
  };

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        login,
        logout,
        switchRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
