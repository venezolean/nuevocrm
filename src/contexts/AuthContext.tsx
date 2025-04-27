import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import type { Database } from '../types/database.types';

type Seller = Database['public']['Tables']['sellers']['Row'];

interface AuthContextType {
  seller: Seller | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [seller, setSeller] = useState<Seller | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Check for existing session on load
  useEffect(() => {
    const checkSession = async () => {
      setLoading(true);
      try {
        // Retrieve seller from local storage (this will be set during login)
        const storedSeller = localStorage.getItem('seller');
        if (storedSeller) {
          setSeller(JSON.parse(storedSeller));
        }
      } catch (error) {
        console.error('Session check error:', error);
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('sellers')
        .select('*')
        .eq('email', email)
        .single();

      if (error) {
        toast.error('Error al iniciar sesión');
        return false;
      }

      // In a real app, we would NEVER check passwords client-side.
      // This is just for demo purposes since we're not handling the backend logic.
      if (data && data.password === password) {
        // Remove password from data before storing
        const { password: _, ...sellerData } = data;
        setSeller(data);
        localStorage.setItem('seller', JSON.stringify(data));
        toast.success('¡Inicio de sesión exitoso!');
        return true;
      } else {
        toast.error('Credenciales incorrectas');
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Error al iniciar sesión');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      localStorage.removeItem('seller');
      setSeller(null);
      navigate('/login');
      toast.success('Sesión cerrada');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Error al cerrar sesión');
    }
  };

  return (
    <AuthContext.Provider value={{ seller, loading, login, logout }}>
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