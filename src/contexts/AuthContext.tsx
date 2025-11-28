import React, { createContext, useContext, useEffect, useState } from 'react';
import { api, setAuthToken } from '@/lib/api';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface AuthContextType {
  user: any | null;
  session: any | null;
  loading: boolean;
  isAdmin: boolean;
  signUp: (email: string, password: string, nombre: string, apellido: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null);
  const [session, setSession] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Initialize from stored token/user
    const token = localStorage.getItem('bb_token');
    const stored = localStorage.getItem('bb_user');
    if (token) {
      setAuthToken(token);
      setSession({ token });
      try {
        const parsed = stored ? JSON.parse(stored) : null;
        setUser(parsed);
        setIsAdmin(!!parsed?.admin);
      } catch (e) {
        setUser(null);
      }
    }
    setLoading(false);
  }, []);

  // checkUserRole no longer needed here because backend returns admin flag at login
  const checkUserRole = async (userId: string) => {
    // placeholder in case we want to fetch roles from backend
    return;
  };

  const signUp = async (email: string, password: string, nombre: string, apellido: string) => {
    try {
      const res = await api.post('/auth/register', { email, password, nombre, apellido });
      const { token, user } = res.data;
      localStorage.setItem('bb_token', token);
      localStorage.setItem('bb_user', JSON.stringify(user));
      setAuthToken(token);
      setSession({ token });
      setUser(user);
      setIsAdmin(!!user?.admin);

      toast.success('Account created successfully!');
      navigate('/');
    } catch (error: any) {
      toast.error(error.response?.data?.message || error.message || 'Error creating account');
      throw error;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      const { token, user } = res.data;
      localStorage.setItem('bb_token', token);
      localStorage.setItem('bb_user', JSON.stringify(user));
      setAuthToken(token);
      setSession({ token });
      setUser(user);
      setIsAdmin(!!user?.admin);

      toast.success('Signed in successfully!');
      navigate('/');
    } catch (error: any) {
      toast.error(error.response?.data?.message || error.message || 'Error signing in');
      throw error;
    }
  };

  const signOut = async () => {
    try {
      localStorage.removeItem('bb_token');
      localStorage.removeItem('bb_user');
      setAuthToken(null);
      setUser(null);
      setSession(null);
      setIsAdmin(false);
      toast.success('Signed out successfully!');
      navigate('/');
    } catch (error: any) {
      toast.error(error.message || 'Error signing out');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        isAdmin,
        signUp,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
