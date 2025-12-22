import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/types';

interface AuthContextType {
  user: User | null;
  login: (userId: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Simulated credentials (in production, these come from environment variables)
const VALID_USER_ID = '23022-CM-032';
const VALID_PASSWORD = '23438-CM-069';

// Simple JWT-like token generation (simulated)
const generateToken = (userId: string): string => {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = btoa(JSON.stringify({ 
    sub: userId, 
    iat: Date.now(), 
    exp: Date.now() + 24 * 60 * 60 * 1000 
  }));
  const signature = btoa(userId + Date.now().toString());
  return `${header}.${payload}.${signature}`;
};

const validateToken = (token: string): boolean => {
  try {
    const [, payload] = token.split('.');
    const decoded = JSON.parse(atob(payload));
    return decoded.exp > Date.now();
  } catch {
    return false;
  }
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const storedToken = localStorage.getItem('auth_token');
    const storedUserId = localStorage.getItem('user_id');
    
    if (storedToken && storedUserId && validateToken(storedToken)) {
      setUser({
        id: storedUserId,
        authenticated: true,
        token: storedToken
      });
    }
    setIsLoading(false);
  }, []);

  const login = async (userId: string, password: string): Promise<boolean> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    if (userId === VALID_USER_ID && password === VALID_PASSWORD) {
      const token = generateToken(userId);
      localStorage.setItem('auth_token', token);
      localStorage.setItem('user_id', userId);
      setUser({
        id: userId,
        authenticated: true,
        token
      });
      return true;
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_id');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
