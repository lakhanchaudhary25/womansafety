import { useState, useEffect } from 'react';
import { cityOperations, subscriptions } from './supabase';
import { cities as fallbackCities } from '../data/cities-expanded';
import type { City } from '../data/cities-expanded';

// Custom hook for fetching and managing city data
export function useCities() {
  const [cities, setCities] = useState<City[]>(fallbackCities);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUsingSupabase, setIsUsingSupabase] = useState(false);

  useEffect(() => {
    loadCities();

    // Subscribe to real-time city updates
    const subscription = subscriptions.subscribeToCityUpdates((updatedCity) => {
      setCities((prev) =>
        prev.map((city) => (city.id === updatedCity.id ? updatedCity : city))
      );
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const loadCities = async () => {
    try {
      setLoading(true);
      setError(null);

      // Try to fetch from Supabase
      const data = await cityOperations.getAll();

      if (data && data.length > 0) {
        setCities(data);
        setIsUsingSupabase(true);
      } else {
        // Fallback to local data
        setCities(fallbackCities);
        setIsUsingSupabase(false);
      }
    } catch (err) {
      console.error('Error loading cities:', err);
      setError('Failed to load cities from database. Using local data.');
      setCities(fallbackCities);
      setIsUsingSupabase(false);
    } finally {
      setLoading(false);
    }
  };

  const refreshCities = () => {
    loadCities();
  };

  return {
    cities,
    loading,
    error,
    isUsingSupabase,
    refreshCities
  };
}

// Custom hook for searching cities
export function useSearchCities(query: string) {
  const [results, setResults] = useState<City[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }

    const searchCities = async () => {
      setLoading(true);
      try {
        const data = await cityOperations.search(query);
        setResults(data);
      } catch (error) {
        console.error('Search error:', error);
        // Fallback to local search
        const filtered = fallbackCities.filter(
          (city) =>
            city.city.toLowerCase().includes(query.toLowerCase()) ||
            city.state.toLowerCase().includes(query.toLowerCase())
        );
        setResults(filtered);
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(searchCities, 300);
    return () => clearTimeout(debounce);
  }, [query]);

  return { results, loading };
}

// Custom hook for filtering cities
export function useFilterCities(filters: {
  states?: string[];
  minSafetyScore?: number;
  maxSafetyScore?: number;
  budgetLevels?: string[];
  activities?: string[];
}) {
  const [results, setResults] = useState<City[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const filterCities = async () => {
      setLoading(true);
      try {
        let data = await cityOperations.filter({
          states: filters.states,
          minSafetyScore: filters.minSafetyScore,
          maxSafetyScore: filters.maxSafetyScore,
          budgetLevels: filters.budgetLevels
        });

        // Client-side filtering for activities (as JSONB queries can be complex)
        if (filters.activities && filters.activities.length > 0) {
          data = data.filter((city) =>
            filters.activities!.some((activity) => city.activities.includes(activity))
          );
        }

        setResults(data);
      } catch (error) {
        console.error('Filter error:', error);
        // Fallback to local filtering
        let filtered = [...fallbackCities];

        if (filters.states && filters.states.length > 0) {
          filtered = filtered.filter((city) => filters.states!.includes(city.state));
        }

        if (filters.minSafetyScore !== undefined) {
          filtered = filtered.filter((city) => city.safetyScore >= filters.minSafetyScore!);
        }

        if (filters.maxSafetyScore !== undefined) {
          filtered = filtered.filter((city) => city.safetyScore <= filters.maxSafetyScore!);
        }

        if (filters.budgetLevels && filters.budgetLevels.length > 0) {
          filtered = filtered.filter((city) => filters.budgetLevels!.includes(city.budgetLevel));
        }

        if (filters.activities && filters.activities.length > 0) {
          filtered = filtered.filter((city) =>
            filters.activities!.some((activity) => city.activities.includes(activity))
          );
        }

        setResults(filtered);
      } finally {
        setLoading(false);
      }
    };

    filterCities();
  }, [
    filters.states?.join(','),
    filters.minSafetyScore,
    filters.maxSafetyScore,
    filters.budgetLevels?.join(','),
    filters.activities?.join(',')
  ]);

  return { results, loading };
}
