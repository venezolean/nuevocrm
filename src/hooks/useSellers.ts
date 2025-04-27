import { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';
import toast from 'react-hot-toast';
import type { Database } from '../types/database.types';

type Seller = Database['public']['Tables']['sellers']['Row'];

interface UseSellersOptions {
  initialPageSize?: number;
}

export function useSellers({ initialPageSize = 10 }: UseSellersOptions = {}) {
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [loading, setLoading] = useState(true);
  const [count, setCount] = useState(0);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(initialPageSize);

  const fetchCount = async () => {
    try {
      const { count, error } = await supabase
        .from('sellers')
        .select('*', { count: 'exact', head: true });

      if (error) {
        throw error;
      }

      if (count !== null) {
        setCount(count);
      }
    } catch (error) {
      console.error('Error fetching seller count:', error);
      toast.error('Error al obtener conteo de vendedores');
    }
  };

  const fetchSellers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('sellers')
        .select('*')
        .range(pageIndex * pageSize, (pageIndex + 1) * pageSize - 1)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setSellers(data || []);
    } catch (error) {
      console.error('Error fetching sellers:', error);
      toast.error('Error al cargar vendedores');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCount();
  }, []);

  useEffect(() => {
    fetchSellers();
  }, [pageIndex, pageSize]);

  const addSeller = async (
    seller: Omit<Seller, 'id' | 'created_at'>
  ): Promise<boolean> => {
    try {
      const { error } = await supabase.from('sellers').insert({
        ...seller,
        created_at: new Date().toISOString(),
      });

      if (error) {
        throw error;
      }

      toast.success('Vendedor añadido con éxito');
      fetchSellers(); // Refresh the list
      return true;
    } catch (error) {
      console.error('Error adding seller:', error);
      toast.error('Error al añadir vendedor');
      return false;
    }
  };

  const updateSeller = async (
    id: string,
    updates: Partial<Omit<Seller, 'id' | 'created_at'>>
  ): Promise<boolean> => {
    try {
      const { error } = await supabase.from('sellers').update(updates).eq('id', id);

      if (error) {
        throw error;
      }

      // Update local state
      setSellers((prev) =>
        prev.map((seller) => (seller.id === id ? { ...seller, ...updates } : seller))
      );

      toast.success('Vendedor actualizado con éxito');
      return true;
    } catch (error) {
      console.error('Error updating seller:', error);
      toast.error('Error al actualizar vendedor');
      return false;
    }
  };

  const deleteSeller = async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase.from('sellers').delete().eq('id', id);

      if (error) {
        throw error;
      }

      // Update local state
      setSellers((prev) => prev.filter((seller) => seller.id !== id));

      toast.success('Vendedor eliminado con éxito');
      return true;
    } catch (error) {
      console.error('Error deleting seller:', error);
      toast.error('Error al eliminar vendedor');
      return false;
    }
  };

  return {
    sellers,
    loading,
    count,
    pageIndex,
    setPageIndex,
    pageSize,
    setPageSize,
    addSeller,
    updateSeller,
    deleteSeller,
    refresh: fetchSellers,
  };
}