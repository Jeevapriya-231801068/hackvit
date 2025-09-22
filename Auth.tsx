import React, { createContext, useState, useContext, useEffect, useMemo, useCallback } from 'react';
import type { User } from './types';
import App from './App';
import { LoginPage } from './components/LoginPage';

interface AuthContextType {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    // Check session storage on initial load
    try {
      const storedUser = sessionStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Failed to parse user from sessionStorage", error);
      sessionStorage.removeItem('user');
    }
    setIsInitializing(false);
  }, []);

  const login = useCallback((userData: User) => {
    sessionStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  }, []);

  const logout = useCallback(() => {
    sessionStorage.removeItem('user');
    setUser(null);
  }, []);

  const authContextValue = useMemo(() => ({ user, login, logout }), [user, login, logout]);

  if (isInitializing) {
    return null; // Or a loading spinner
  }

  return (
    <AuthContext.Provider value={authContextValue}>
      {user ? <App /> : <LoginPage onLoginSuccess={login} />}
    </AuthContext.Provider>
  );
};
