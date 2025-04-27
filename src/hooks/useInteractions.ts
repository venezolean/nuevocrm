import { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';
import toast from 'react-hot-toast';
import type { Database } from '../types/database.types';

type Interaction = Database['public']['Tables']['client_interactions']['Row'];

interface UseInteractionsOptions {
  clientId?: string;
  sellerId?: string;
  initialPageSize?: number;
}

export function useInteractions({
  clientId,
  sellerId,
  initialPageSize = 10,
}: UseInteractionsOptions = {}) {
  const [interactions, setInteractions] = useState<Interaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [count, setCount] = useState(0);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [filters, setFilters] = useState<{
    type?: string;
    stage?: string;
    dateFrom?: string;
    dateTo?: string;
  }>({});

  const fetchCount = async () => {
    try {
      let query = supabase
        .from('client_interactions')
        .select('*', { count: 'exact', head: true });

      // Apply filters
      if (clientId) {
        query = query.eq('client_id', clientId);
      }
      if (sellerId) {
        query = query.eq('seller_id', sellerId);
      }
      if (filters.type) {
        query = query.contains('type', [filters.type]);
      }
      if (filters.stage) {
        query = query.eq('stage', filters.stage);
      }
      if (filters.dateFrom) {
        query = query.gte('interaction_date', filters.dateFrom);
      }
      if (filters.dateTo) {
        query = query.lte('interaction_date', filters.dateTo);
      }

      const { count, error } = await query;

      if (error) {
        throw error;
      }

      if (count !== null) {
        setCount(count);
      }
    } catch (error) {
      console.error('Error fetching interaction count:', error);
      toast.error('Error al obtener conteo de interacciones');
    }
  };

  const fetchInteractions = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('client_interactions')
        .select('*, clients(name, email, phone), sellers(name, email, photo)')
        .range(pageIndex * pageSize, (pageIndex + 1) * pageSize - 1)
        .order('interaction_date', { ascending: false });

      // Apply filters
      if (clientId) {
        query = query.eq('client_id', clientId);
      }
      if (sellerId) {
        query = query.eq('seller_id', sellerId);
      }
      if (filters.type) {
        query = query.contains('type', [filters.type]);
      }
      if (filters.stage) {
        query = query.eq('stage', filters.stage);
      }
      if (filters.dateFrom) {
        query = query.gte('interaction_date', filters.dateFrom);
      }
      if (filters.dateTo) {
        query = query.lte('interaction_date', filters.dateTo);
      }

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      setInteractions(data || []);
    } catch (error) {
      console.error('Error fetching interactions:', error);
      toast.error('Error al cargar interacciones');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCount();
  }, [clientId, sellerId, filters]);

  useEffect(() => {
    fetchInteractions();
  }, [pageIndex, pageSize, clientId, sellerId, filters]);

  const addInteraction = async (
    interaction: Omit<Interaction, 'id'>
  ): Promise<boolean> => {
    try {
      const { error } = await supabase.from('client_interactions').insert(interaction);

      if (error) {
        throw error;
      }

      toast.success('Interacción registrada con éxito');
      fetchInteractions(); // Refresh the list
      return true;
    } catch (error) {
      console.error('Error adding interaction:', error);
      toast.error('Error al registrar interacción');
      return false;
    }
  };

  return {
    interactions,
    loading,
    count,
    pageIndex,
    setPageIndex,
    pageSize,
    setPageSize,
    filters,
    setFilters,
    addInteraction,
    refresh: fetchInteractions,
  };
}