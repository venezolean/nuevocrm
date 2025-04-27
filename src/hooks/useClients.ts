import { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';
import toast from 'react-hot-toast';
import type { Database } from '../types/database.types';

type Client = Database['public']['Tables']['clients']['Row'];

interface UseClientsOptions {
  initialPageSize?: number;
}

export function useClients({ initialPageSize = 10 }: UseClientsOptions = {}) {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [count, setCount] = useState(0);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(initialPageSize);

  const fetchCount = async () => {
    try {
      const { count, error } = await supabase
        .from('clients')
        .select('*', { count: 'exact', head: true });

      if (error) {
        throw error;
      }

      if (count !== null) {
        setCount(count);
      }
    } catch (error) {
      console.error('Error fetching client count:', error);
      toast.error('Error al obtener conteo de clientes');
    }
  };

  const fetchClients = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .range(pageIndex * pageSize, (pageIndex + 1) * pageSize - 1)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setClients(data || []);
    } catch (error) {
      console.error('Error fetching clients:', error);
      toast.error('Error al cargar clientes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCount();
  }, []);

  useEffect(() => {
    fetchClients();
  }, [pageIndex, pageSize]);

  const updateClient = async (id: string, updates: Partial<Client>) => {
    try {
      const { error } = await supabase
        .from('clients')
        .update(updates)
        .eq('id', id);

      if (error) {
        throw error;
      }

      // Update local state
      setClients((prev) =>
        prev.map((client) => (client.id === id ? { ...client, ...updates } : client))
      );

      toast.success('Cliente actualizado con éxito');
      return true;
    } catch (error) {
      console.error('Error updating client:', error);
      toast.error('Error al actualizar cliente');
      return false;
    }
  };

  const getClientById = async (id: string): Promise<Client | null> => {
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error fetching client:', error);
      toast.error('Error al obtener información del cliente');
      return null;
    }
  };

  return {
    clients,
    loading,
    count,
    pageIndex,
    setPageIndex,
    pageSize,
    setPageSize,
    updateClient,
    getClientById,
    refresh: fetchClients,
  };
}