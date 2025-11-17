import { createClient } from '@supabase/supabase-js';
import type { City, IncidentReport } from '../data/cities-expanded';

// Supabase config
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = !!supabaseUrl && !!supabaseAnonKey;

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : createClient('https://placeholder.supabase.co', 'placeholder-key');

// ---------- CITY OPERATIONS ----------
export const cityOperations = {
  // Get all cities
  async getAll(): Promise<City[]> {
    if (!isSupabaseConfigured) return [];

    const { data, error } = await supabase
      .from('cities')
      .select('*')
      .order('safety_score', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  // Get by ID
  async getById(id: number): Promise<City | null> {
    if (!isSupabaseConfigured) return null;

    const { data, error } = await supabase
      .from('cities')
      .select('*')
      .eq('id', id)
      .single();

    return error ? null : data;
  },

  // Search
  async search(query: string): Promise<City[]> {
    if (!isSupabaseConfigured) return [];

    const { data, error } = await supabase
      .from('cities')
      .select('*')
      .or(`city.ilike.%${query}%,state.ilike.%${query}%`);

    if (error) throw error;
    return data || [];
  },

  // Filter
  async filter(filters: {
    states?: string[];
    minSafetyScore?: number;
    maxSafetyScore?: number;
    budgetLevels?: string[];
  }): Promise<City[]> {
    if (!isSupabaseConfigured) return [];

    let query = supabase.from('cities').select('*');

    if (filters.states?.length) {
      query = query.in('state', filters.states);
    }

    if (filters.minSafetyScore !== undefined) {
      query = query.gte('safety_score', filters.minSafetyScore);
    }

    if (filters.maxSafetyScore !== undefined) {
      query = query.lte('safety_score', filters.maxSafetyScore);
    }

    if (filters.budgetLevels?.length) {
      query = query.in('budget_level', filters.budgetLevels);
    }

    const { data, error } = await query;
    if (error) throw error;

    return data || [];
  },

  // Update city (admin)
  async update(id: number, updates: Partial<City>): Promise<City | null> {
    if (!isSupabaseConfigured) throw new Error('Supabase not configured');

    const { data, error } = await supabase
      .from('cities')
      .update({
        safety_score: updates.safetyScore,
        lighting_score: updates.lightingScore,
        public_transport_score: updates.publicTransportScore,
        women_review_score: updates.womenReviewScore,
        crowd_score: updates.crowdScore,
        budget_level: updates.budgetLevel,
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};

// ---------- INCIDENT REPORT OPERATIONS ----------
export const incidentOperations = {
  async create(report: Omit<IncidentReport, 'id'>): Promise<IncidentReport> {
    if (!isSupabaseConfigured) throw new Error('Supabase not configured');

    const { data, error } = await supabase
      .from('incident_reports')
      .insert({
        ...report,
        user_id: (await supabase.auth.getUser()).data.user?.id
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getAll(limit = 10, offset = 0): Promise<IncidentReport[]> {
    if (!isSupabaseConfigured) return [];

    const { data, error } = await supabase
      .from('incident_reports')
      .select('*')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;
    return data || [];
  },

  async getByCity(cityName: string): Promise<IncidentReport[]> {
    if (!isSupabaseConfigured) return [];

    const { data, error } = await supabase
      .from('incident_reports')
      .select('*')
      .eq('city', cityName)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async getRecent(limit = 5): Promise<IncidentReport[]> {
    if (!isSupabaseConfigured) return [];

    const { data, error } = await supabase
      .from('incident_reports')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) return [];
    return data || [];
  },

  async delete(id: number): Promise<boolean> {
    if (!isSupabaseConfigured) return false;

    const { error } = await supabase
      .from('incident_reports')
      .delete()
      .eq('id', id);

    return !error;
  }
};

// ---------- ANALYTICS ----------
export const analyticsOperations = {
  async getStats() {
    if (!isSupabaseConfigured) return null;

    const { data, error } = await supabase
      .from('cities')
      .select('safety_score, budget_level, state');

    if (error) return null;

    const totalCities = data.length;
    const avgSafetyScore =
      data.reduce((sum, c) => sum + c.safety_score, 0) / totalCities;

    return {
      totalCities,
      avgSafetyScore: Math.round(avgSafetyScore),
      highSafety: data.filter((c) => c.safety_score >= 80).length,
      moderateSafety: data.filter((c) => c.safety_score >= 70 && c.safety_score < 80).length,
      lowSafety: data.filter((c) => c.safety_score < 70).length,
      uniqueStates: new Set(data.map((c) => c.state)).size
    };
  },

  async getTopSafeCities(limit = 10): Promise<City[]> {
    if (!isSupabaseConfigured) return [];

    const { data, error } = await supabase
      .from('cities')
      .select('*')
      .order('safety_score', { ascending: false })
      .limit(limit);

    if (error) return [];
    return data || [];
  }
};

// ---------- REAL-TIME SUBSCRIPTIONS ----------
export const subscriptions = {
  subscribeToReports(callback: (report: IncidentReport) => void) {
    if (!isSupabaseConfigured) return { unsubscribe: () => {} };

    return supabase
      .channel('incident_reports')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'incident_reports' }, (payload) =>
        callback(payload.new as IncidentReport)
      )
      .subscribe();
  },

  subscribeToCityUpdates(callback: (city: City) => void) {
    if (!isSupabaseConfigured) return { unsubscribe: () => {} };

    return supabase
      .channel('cities')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'cities' }, (payload) =>
        callback(payload.new as City)
      )
      .subscribe();
  }
};
