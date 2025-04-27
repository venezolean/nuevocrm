import { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';
import toast from 'react-hot-toast';
import type { Database } from '../types/database.types';

type Lead = Database['public']['Tables']['contact_requests']['Row'];
type Client = Database['public']['Tables']['clients']['Row'];

interface UseLeadsOptions {
  initialPageSize?: number;
}

export function useLeads({ initialPageSize = 10 }: UseLeadsOptions = {}) {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [count, setCount] = useState(0);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [filters, setFilters] = useState<{
    consultationType?: string;
    dateFrom?: string;
    dateTo?: string;
  }>({});

  const fetchCount = async () => {
    try {
      let query = supabase.from('contact_requests').select('*', { count: 'exact', head: true });

      // Apply filters
      if (filters.consultationType) {
        query = query.eq('consultation_type', filters.consultationType);
      }
      if (filters.dateFrom) {
        query = query.gte('created_at', filters.dateFrom);
      }
      if (filters.dateTo) {
        query = query.lte('created_at', filters.dateTo);
      }

      const { count, error } = await query;

      if (error) {
        throw error;
      }

      if (count !== null) {
        setCount(count);
      }
    } catch (error) {
      console.error('Error fetching lead count:', error);
      toast.error('Error al obtener conteo de leads');
    }
  };

  const fetchLeads = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('contact_requests')
        .select('*, cars(*)')
        .range(pageIndex * pageSize, (pageIndex + 1) * pageSize - 1)
        .order('created_at', { ascending: false });

      // Apply filters
      if (filters.consultationType) {
        query = query.eq('consultation_type', filters.consultationType);
      }
      if (filters.dateFrom) {
        query = query.gte('created_at', filters.dateFrom);
      }
      if (filters.dateTo) {
        query = query.lte('created_at', filters.dateTo);
      }

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      setLeads(data || []);
    } catch (error) {
      console.error('Error fetching leads:', error);
      toast.error('Error al cargar leads');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCount();
  }, [filters]);

  useEffect(() => {
    fetchLeads();
  }, [pageIndex, pageSize, filters]);

  const convertToClient = async (lead: Lead): Promise<boolean> => {
    try {
      // Check if a client with this email already exists
      const { data: existingClient, error: checkError } = await supabase
        .from('clients')
        .select('id')
        .eq('email', lead.email)
        .maybeSingle();

      if (checkError) {
        throw checkError;
      }

      let clientId;

      if (existingClient) {
        // Client already exists
        clientId = existingClient.id;
        toast.info('Cliente ya existente en la base de datos');
      } else {
        // Create new client
        const newClient: Database['public']['Tables']['clients']['Insert'] = {
          name: `${lead.first_name} ${lead.last_name}`,
          email: lead.email,
          phone: lead.phone,
          // Add other default properties as needed
        };

        const { data: createdClient, error: insertError } = await supabase
          .from('clients')
          .insert(newClient)
          .select()
          .single();

        if (insertError || !createdClient) {
          throw insertError || new Error('No client data returned');
        }

        clientId = createdClient.id;
      }

      // Update the lead with the client ID
      const { error: updateError } = await supabase
        .from('contact_requests')
        .update({ client_id: clientId })
        .eq('id', lead.id);

      if (updateError) {
        throw updateError;
      }

      // Update local state
      setLeads((prev) =>
        prev.map((l) => (l.id === lead.id ? { ...l, client_id: clientId } : l))
      );

      toast.success('Lead convertido a cliente con éxito');
      return true;
    } catch (error) {
      console.error('Error converting lead to client:', error);
      toast.error('Error al convertir lead a cliente');
      return false;
    }
  };

  return {
    leads,
    loading,
    count,
    pageIndex,
    setPageIndex,
    pageSize,
    setPageSize,
    filters,
    setFilters,
    convertToClient,
    refresh: fetchLeads,
  };
}