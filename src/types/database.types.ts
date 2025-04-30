export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      cars: {
        Row: {
          id: string
          brand: string | null
          model: string | null
          year: number | null
          price: number | null
          images: string[] | null
          engine: string | null
          transmission: string | null
          fuel_type: string | null
          power: string | null
          mileage: number | null
          description: string | null
          condition: string | null
          category: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          brand?: string | null
          model?: string | null
          year?: number | null
          price?: number | null
          images?: string[] | null
          engine?: string | null
          transmission?: string | null
          fuel_type?: string | null
          power?: string | null
          mileage?: number | null
          description?: string | null
          condition?: string | null
          category?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          brand?: string | null
          model?: string | null
          year?: number | null
          price?: number | null
          images?: string[] | null
          engine?: string | null
          transmission?: string | null
          fuel_type?: string | null
          power?: string | null
          mileage?: number | null
          description?: string | null
          condition?: string | null
          category?: string | null
          created_at?: string | null
        }
        Relationships: []
      }
      clients: {
        Row: {
          id: string
          name: string
          dni: string | null
          phone: string
          email: string
          address: string | null
          work_info: string | null
          vehicle_type: string[] | null
          transmission: string[] | null
          fuel_type: string[] | null
          year_range: string[] | null
          brand: string[] | null
          budget: string | null
          accepts_trade: boolean | null
          car_condition: string | null
          savings_plan: string | null
          vehicle_use: string[] | null
          urgency: string | null
          location: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          name: string
          dni?: string | null
          phone: string
          email: string
          address?: string | null
          work_info?: string | null
          vehicle_type?: string[] | null
          transmission?: string[] | null
          fuel_type?: string[] | null
          year_range?: string[] | null
          brand?: string[] | null
          budget?: string | null
          accepts_trade?: boolean | null
          car_condition?: string | null
          savings_plan?: string | null
          vehicle_use?: string[] | null
          urgency?: string | null
          location?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          dni?: string | null
          phone?: string
          email?: string
          address?: string | null
          work_info?: string | null
          vehicle_type?: string[] | null
          transmission?: string[] | null
          fuel_type?: string[] | null
          year_range?: string[] | null
          brand?: string[] | null
          budget?: string | null
          accepts_trade?: boolean | null
          car_condition?: string | null
          savings_plan?: string | null
          vehicle_use?: string[] | null
          urgency?: string | null
          location?: string | null
          created_at?: string | null
        }
        Relationships: []
      }
      client_interactions: {
        Row: {
          id: string
          client_id: string
          seller_id: string
          interaction_date: string
          type: string[] | null
          reason: string | null
          vehicle: string | null
          stage: string | null
          notes: string | null
        }
        Insert: {
          id?: string
          client_id: string
          seller_id: string
          interaction_date: string
          type?: string[] | null
          reason?: string | null
          vehicle?: string | null
          stage?: string | null
          notes?: string | null
        }
        Update: {
          id?: string
          client_id?: string
          seller_id?: string
          interaction_date?: string
          type?: string[] | null
          reason?: string | null
          vehicle?: string | null
          stage?: string | null
          notes?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "client_interactions_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "client_interactions_seller_id_fkey"
            columns: ["seller_id"]
            isOneToOne: false
            referencedRelation: "sellers"
            referencedColumns: ["id"]
          }
        ]
      }
      contact_requests: {
        Row: {
          id: string
          first_name: string
          last_name: string
          phone: string
          email: string
          message: string
          created_at: string | null
          vehicle_id: string | null
          consultation_type: string | null
          sub_type: string | null
          client_id: string | null
        }
        Insert: {
          id?: string
          first_name: string
          last_name: string
          phone: string
          email: string
          message: string
          created_at?: string | null
          vehicle_id?: string | null
          consultation_type?: string | null
          sub_type?: string | null
          client_id?: string | null
        }
        Update: {
          id?: string
          first_name?: string
          last_name?: string
          phone?: string
          email?: string
          message?: string
          created_at?: string | null
          vehicle_id?: string | null
          consultation_type?: string | null
          sub_type?: string | null
          client_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contact_requests_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contact_requests_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "cars"
            referencedColumns: ["id"]
          }
        ]
      }
      sellers: {
        Row: {
          id: string
          name: string
          email: string
          phone: string | null
          password: string
          photo: string
          specialization: string
          created_at: string | null
        }
        Insert: {
          id?: string
          name: string
          email: string
          phone?: string | null
          password: string
          photo: string
          specialization: string
          created_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          email?: string
          phone?: string | null
          password?: string
          photo?: string
          specialization?: string
          created_at?: string | null
        }
        Relationships: []
      }
      lead_followups: {
        Row: {
          id: string;
          contact_request_id: string;
          seller_id: string | null;
          followup_date: string;
          contact_date: string;
          contact_time: string;
          reason: string;
          notes: string | null;
        };
        Insert: {
          id?: string;
          contact_request_id: string;
          seller_id?: string | null;
          followup_date?: string;
          contact_date?: string;
          contact_time?: string;
          reason: string;
          notes?: string | null;
        };
        Update: {
          id?: string;
          contact_request_id?: string;
          seller_id?: string | null;
          followup_date?: string;
          contact_date?: string;
          contact_time?: string;
          reason?: string;
          notes?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "lead_followups_contact_request_id_fkey";
            columns: ["contact_request_id"];
            referencedRelation: "contact_requests";
            referencedColumns: ["id"];
            isOneToOne: false;
          },
          {
            foreignKeyName: "lead_followups_seller_id_fkey";
            columns: ["seller_id"];
            referencedRelation: "sellers";
            referencedColumns: ["id"];
            isOneToOne: false;
          }
        ];
      };
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      insert_lead_followup: {
        Args: {
          p_request_id: string;
          p_seller_id?: string | null;
          p_reason: string;
          p_notes?: string | null;
        };
        Returns: null;
      };
      insert_client_interaction: {
        Args: {
          p_client_id: string;
          p_seller_id?: string | null;
          p_interaction_date: string;
          p_types: string[];
          p_reason: string;
          p_vehicle?: string | null;
          p_stage?: string | null;
          p_notes?: string | null;
        };
        Returns: null;
      };
      convert_lead_to_client: {
        Args: {
          p_request_id: string;
        };
        Returns: string | null; // devuelve el client_id o null si no lo convierte
      };
      /* ... otras funciones ... */
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
