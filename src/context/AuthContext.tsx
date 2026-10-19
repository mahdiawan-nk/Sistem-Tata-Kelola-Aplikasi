import React, { createContext, useContext, useEffect, useState } from 'react';
import { api } from '../services/api';
import { User, UserRole } from '../types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
  isLoggedIn: boolean;
  role: UserRole | null;
  canEdit: boolean;
  canDelete: boolean;
  isAdmin: boolean;
  isStaff: boolean;
  isViewer: boolean;
  isLoginModalOpen: boolean;
  setIsLoginModalOpen: (open: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);

  useEffect(() => {
    async function checkAuth() {
      const savedToken = localStorage.getItem('sim_auth_token');
      if (savedToken) {
        try {
          const me = await api.getMe();
          setUser(me);
        } catch (err) {
          console.warn('Session expired or invalid:', err);
          localStorage.removeItem('sim_auth_token');
          setUser(null);
        }
      }
      setLoading(false);
    }
    checkAuth();
  }, []);

  const login = async (email: string, pass: string) => {
    const res = await api.login(email, pass);
    localStorage.setItem('sim_auth_token', res.token);
    setUser(res.user);
    setIsLoginModalOpen(false);
  };

  const logout = async () => {
    await api.logout();
    setUser(null);
  };

  const role = user?.role || null;
  const isAdmin = role === 'admin';
  const isStaff = role === 'staff';
  const isViewer = role === 'viewer';
  const canEdit = isAdmin || isStaff;
  const canDelete = isAdmin;

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        isLoggedIn: !!user,
        role,
        canEdit,
        canDelete,
        isAdmin,
        isStaff,
        isViewer,
        isLoginModalOpen,
        setIsLoginModalOpen,
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
