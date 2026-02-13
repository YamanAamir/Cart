'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { decodeJwt } from "jose";
import api from '@/lib/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [loginLoading, setLoginLoading] = useState(false);
  const router = useRouter();

  const loadUserFromToken = useCallback(() => {
    const token = sessionStorage.getItem('DEVICE');
    if (token) {
      try {
        const decoded = decodeJwt(token);
        setUser({
          adminId: decoded.adminId,
          fullName: decoded.fullName,
          email: decoded.email,
          profilePicture: decoded.profilePicture,
          isSuper: decoded.isSuper,
          isAdmin: decoded.isAdmin,
          isAccess: decoded.isAccess,
        });
      } catch (error) {
        console.error('Token decode error:', error);
        sessionStorage.removeItem('DEVICE');
        toast.error('Invalid token. Please log in again.');
        router.push('/login');
        setUser(null);
      }
    }
    setAuthLoading(false);
  }, [router]);

  useEffect(() => {
    loadUserFromToken();
  }, [loadUserFromToken]);

  const login = async (email, password) => {
    setLoginLoading(true);
    try {
      const response = await api.post('/login', { email, password });
      const { token } = response.data;
      sessionStorage.setItem('DEVICE', token);
      loadUserFromToken();
      toast.success('Logged in successfully');
      router.push('/admin/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Invalid credentials');
    } finally {
      setLoginLoading(false);
    }
  };

  const logout = () => {
    sessionStorage.removeItem('DEVICE');
    setUser(null);
    toast.success('Logged out successfully');
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, setUser, authLoading, loginLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);