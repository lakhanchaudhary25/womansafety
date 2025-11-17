import { createClient } from '@supabase/supabase-js';
import type { City, IncidentReport } from '../data/cities-expanded';

// Supabase client configuration
// Check if environment variables are defined
const supabaseUrl = typeof import.meta.env !== 'undefined' ? import.meta.env.VITE_SUPABASE_URL : undefined;
const supabaseAnonKey = typeof import.meta.env !== 'undefined' ? import.meta.env.VITE_SUPABASE_ANON_KEY : undefined;

// Helper to check if Supabase is configured
export const isSupabaseConfigured = !!supabaseUrl && !!supabaseAnonKey;

// Create a dummy client if env vars are not set (app will use local data)
export const supabase = isSupabaseConfigured 
  ? createClient(supabaseUrl!, supabaseAnonKey!)
  : createClient('https://placeholder.supabase.co', 'placeholder-key');

// Database types
export interface Database {
  public: {
    Tables: {
      cities: {
        Row: City;
        Insert: Omit<City, 'id'>;
        Update: Partial<Omit<City, 'id'>>;
      };
      incident_reports: {
        Row: IncidentReport & {
          user_id?: string;
          created_at: string;
        };
        Insert: Omit<IncidentReport, 'id'> & {
          user_id?: string;
        };
        Update: Partial<Omit<IncidentReport, 'id'>>;
      };
    };
  };
}

// City operations
export const cityOperations = {
  // Get all cities
  async getAll(): Promise<City[]> {
    if (!isSupabaseConfigured) {
      console.warn('Supabase not configured. Using local data.');
      return [];
    }

    const { data, error } = await supabase
      .from('cities')
      .select('*')
      .order('safetyScore', { ascending: false });

    if (error) {
      console.error('Error fetching cities:', error);
      throw error;
    }

    return data || [];
  },

  // Get city by ID
  async getById(id: number): Promise<City | null> {
    if (!isSupabaseConfigured) {
      console.warn('Supabase not configured. Using local data.');
      return null;
    }

    const { data, error } = await supabase
      .from('cities')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching city:', error);
      return null;
    }

    return data;
  },

  // Search cities
  async search(query: string): Promise<City[]> {
    if (!isSupabaseConfigured) {
      console.warn('Supabase not configured. Using local data.');
      return [];
    }

    const { data, error } = await supabase
      .from('cities')
      .select('*')
      .or(`city.ilike.%${query}%,state.ilike.%${query}%`);

    if (error) {
      console.error('Error searching cities:', error);
      throw error;
    }

    return data || [];
  },

  // Filter cities
  async filter(filters: {
    states?: string[];
    minSafetyScore?: number;
    maxSafetyScore?: number;
    budgetLevels?: string[];
  }): Promise<City[]> {
    if (!isSupabaseConfigured) {
      console.warn('Supabase not configured. Using local data.');
      return [];
    }

    let query = supabase.from('cities').select('*');

    if (filters.states && filters.states.length > 0) {
      query = query.in('state', filters.states);
    }

    if (filters.minSafetyScore !== undefined) {
      query = query.gte('safetyScore', filters.minSafetyScore);
    }

    if (filters.maxSafetyScore !== undefined) {
      query = query.lte('safetyScore', filters.maxSafetyScore);
    }

    if (filters.budgetLevels && filters.budgetLevels.length > 0) {
      query = query.in('budgetLevel', filters.budgetLevels);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error filtering cities:', error);
      throw error;
    }

    return data || [];
  },

  // Update city (admin only - secured by RLS)
  async update(id: number, updates: Partial<City>): Promise<City | null> {
    if (!isSupabaseConfigured) {
      console.warn('Supabase not configured. Cannot update cities.');
      throw new Error('Supabase not configured');
    }

    const { data, error } = await supabase
      .from('cities')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating city:', error);
      throw error;
    }

    return data;
  }
};

// Incident report operations
export const incidentOperations = {
  // Create incident report
  async create(report: Omit<IncidentReport, 'id'>): Promise<IncidentReport> {
    if (!isSupabaseConfigured) {
      console.warn('Supabase not configured. Cannot create incident reports.');
      throw new Error('Supabase not configured. Please set up Supabase to submit incident reports.');
    }

    const { data, error } = await supabase
      .from('incident_reports')
      .insert({
        ...report,
        user_id: (await supabase.auth.getUser()).data.user?.id
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating incident report:', error);
      throw error;
    }

    return data;
  },

  // Get all incident reports (with pagination)
  async getAll(limit: number = 10, offset: number = 0): Promise<IncidentReport[]> {
    if (!isSupabaseConfigured) {
      console.warn('Supabase not configured. Using local data.');
      return [];
    }

    const { data, error } = await supabase
      .from('incident_reports')
      .select('*')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('Error fetching incident reports:', error);
      throw error;
    }

    return data || [];
  },

  // Get reports by city
  async getByCity(cityName: string): Promise<IncidentReport[]> {
    if (!isSupabaseConfigured) {
      console.warn('Supabase not configured. Using local data.');
      return [];
    }

    const { data, error } = await supabase
      .from('incident_reports')
      .select('*')
      .eq('city', cityName)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching city reports:', error);
      throw error;
    }

    return data || [];
  },

  // Get recent reports
  async getRecent(limit: number = 5): Promise<IncidentReport[]> {
    if (!isSupabaseConfigured) {
      console.warn('Supabase not configured. Using local data.');
      return [];
    }

    const { data, error } = await supabase
      .from('incident_reports')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching recent reports:', error);
      return [];
    }

    return data || [];
  },

  // Delete report (user can only delete their own - secured by RLS)
  async delete(id: number): Promise<boolean> {
    if (!isSupabaseConfigured) {
      console.warn('Supabase not configured. Cannot delete incident reports.');
      return false;
    }

    const { error } = await supabase
      .from('incident_reports')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting incident report:', error);
      return false;
    }

    return true;
  }
};

// Analytics operations (read-only, no auth required)
export const analyticsOperations = {
  // Get safety statistics
  async getStats() {
    if (!isSupabaseConfigured) {
      console.warn('Supabase not configured. Using local data.');
      return null;
    }

    const { data: cities, error } = await supabase
      .from('cities')
      .select('safetyScore, budgetLevel, state');

    if (error) {
      console.error('Error fetching stats:', error);
      return null;
    }

    const totalCities = cities.length;
    const avgSafetyScore = cities.reduce((sum, c) => sum + c.safetyScore, 0) / totalCities;
    const highSafety = cities.filter((c) => c.safetyScore >= 80).length;
    const moderateSafety = cities.filter((c) => c.safetyScore >= 70 && c.safetyScore < 80).length;
    const lowSafety = cities.filter((c) => c.safetyScore < 70).length;
    const uniqueStates = new Set(cities.map((c) => c.state)).size;

    return {
      totalCities,
      avgSafetyScore: Math.round(avgSafetyScore),
      highSafety,
      moderateSafety,
      lowSafety,
      uniqueStates
    };
  },

  // Get top safe cities
  async getTopSafeCities(limit: number = 10): Promise<City[]> {
    if (!isSupabaseConfigured) {
      console.warn('Supabase not configured. Using local data.');
      return [];
    }

    const { data, error } = await supabase
      .from('cities')
      .select('*')
      .order('safetyScore', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching top cities:', error);
      return [];
    }

    return data || [];
  }
};

// Real-time subscriptions
export const subscriptions = {
  // Subscribe to incident reports
  subscribeToReports(callback: (report: IncidentReport) => void) {
    if (!isSupabaseConfigured) {
      console.warn('Supabase not configured. Real-time subscriptions disabled.');
      return { unsubscribe: () => {} };
    }

    return supabase
      .channel('incident_reports')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'incident_reports'
        },
        (payload) => {
          callback(payload.new as IncidentReport);
        }
      )
      .subscribe();
  },

  // Subscribe to city updates
  subscribeToCityUpdates(callback: (city: City) => void) {
    if (!isSupabaseConfigured) {
      console.warn('Supabase not configured. Real-time subscriptions disabled.');
      return { unsubscribe: () => {} };
    }

    return supabase
      .channel('cities')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'cities'
        },
        (payload) => {
          callback(payload.new as City);
        }
      )
      .subscribe();
  }
};
