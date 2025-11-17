import { useState, useEffect } from 'react';
import { incidentOperations, subscriptions } from './supabase';
import type { IncidentReport } from '../data/cities-expanded';

// Custom hook for managing incident reports
export function useIncidentReports() {
  const [reports, setReports] = useState<IncidentReport[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadReports();

    // Subscribe to real-time incident reports
    const subscription = subscriptions.subscribeToReports((newReport) => {
      setReports((prev) => [newReport, ...prev]);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const loadReports = async () => {
    setLoading(true);
    try {
      const data = await incidentOperations.getRecent(10);
      setReports(data);
      setError(null);
    } catch (err) {
      console.error('Error loading reports:', err);
      setError('Failed to load incident reports');
    } finally {
      setLoading(false);
    }
  };

  const submitReport = async (report: Omit<IncidentReport, 'id'>) => {
    setLoading(true);
    try {
      const newReport = await incidentOperations.create(report);
      setReports((prev) => [newReport, ...prev]);
      setError(null);
      return { success: true, report: newReport };
    } catch (err) {
      console.error('Error submitting report:', err);
      setError('Failed to submit incident report');
      return { success: false, error: 'Failed to submit report' };
    } finally {
      setLoading(false);
    }
  };

  const deleteReport = async (id: number) => {
    setLoading(true);
    try {
      const success = await incidentOperations.delete(id);
      if (success) {
        setReports((prev) => prev.filter((r) => r.id !== id));
        setError(null);
      }
      return success;
    } catch (err) {
      console.error('Error deleting report:', err);
      setError('Failed to delete incident report');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    reports,
    loading,
    error,
    submitReport,
    deleteReport,
    refreshReports: loadReports
  };
}

// Hook for getting reports by city
export function useCityReports(cityName: string) {
  const [reports, setReports] = useState<IncidentReport[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!cityName) return;

    const loadReports = async () => {
      setLoading(true);
      try {
        const data = await incidentOperations.getByCity(cityName);
        setReports(data);
        setError(null);
      } catch (err) {
        console.error('Error loading city reports:', err);
        setError('Failed to load city reports');
      } finally {
        setLoading(false);
      }
    };

    loadReports();
  }, [cityName]);

  return { reports, loading, error };
}
