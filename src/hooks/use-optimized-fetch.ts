'use client';

import { useState, useEffect, useCallback } from 'react';

interface UseFetchOptions<T> {
  /** Initial data to use while fetching */
  initialData?: T;
  /** Function to fetch the data */
  fetchFn: () => Promise<T>;
  /** Whether to skip the initial fetch */
  skip?: boolean;
  /** Dependencies array to trigger refetch */
  deps?: any[];
  /** Callback to run on success */
  onSuccess?: (data: T) => void;
  /** Callback to run on error */
  onError?: (error: Error) => void;
}

interface UseFetchResult<T> {
  /** The fetched data */
  data: T | undefined;
  /** Whether the data is currently being fetched */
  isLoading: boolean;
  /** Any error that occurred during fetching */
  error: Error | null;
  /** Function to manually trigger a refetch */
  refetch: () => Promise<void>;
}

/**
 * Custom hook for optimized data fetching with caching
 */
export function useOptimizedFetch<T>({
  initialData,
  fetchFn,
  skip = false,
  deps = [],
  onSuccess,
  onError,
}: UseFetchOptions<T>): UseFetchResult<T> {
  const [data, setData] = useState<T | undefined>(initialData);
  const [isLoading, setIsLoading] = useState(!initialData && !skip);
  const [error, setError] = useState<Error | null>(null);

  // Memoize the fetch function to avoid unnecessary re-renders
  const fetchData = useCallback(async () => {
    if (skip) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await fetchFn();
      setData(result);
      onSuccess?.(result);
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      onError?.(error);
    } finally {
      setIsLoading(false);
    }
  }, [fetchFn, skip, onSuccess, onError]);

  // Fetch data on mount and when dependencies change
  useEffect(() => {
    fetchData();
  }, [fetchData, ...deps]);

  // Return the result
  return {
    data,
    isLoading,
    error,
    refetch: fetchData,
  };
}

/**
 * Custom hook for optimized data fetching with automatic polling
 */
export function usePollingFetch<T>({
  initialData,
  fetchFn,
  skip = false,
  deps = [],
  onSuccess,
  onError,
  pollingInterval = 30000, // Default to 30 seconds
  maxPolls = Infinity,
}: UseFetchOptions<T> & {
  /** Interval in milliseconds between polls */
  pollingInterval?: number;
  /** Maximum number of polls to perform (default: Infinity) */
  maxPolls?: number;
}): UseFetchResult<T> & {
  /** Stop polling */
  stopPolling: () => void;
  /** Start polling */
  startPolling: () => void;
} {
  const [data, setData] = useState<T | undefined>(initialData);
  const [isLoading, setIsLoading] = useState(!initialData && !skip);
  const [error, setError] = useState<Error | null>(null);
  const [isPolling, setIsPolling] = useState(!skip);
  const [pollCount, setPollCount] = useState(0);

  // Memoize the fetch function to avoid unnecessary re-renders
  const fetchData = useCallback(async () => {
    if (skip) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await fetchFn();
      setData(result);
      onSuccess?.(result);
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      onError?.(error);
    } finally {
      setIsLoading(false);
      setPollCount(count => count + 1);
    }
  }, [fetchFn, skip, onSuccess, onError]);

  // Start/stop polling
  const stopPolling = useCallback(() => {
    setIsPolling(false);
  }, []);

  const startPolling = useCallback(() => {
    setIsPolling(true);
  }, []);

  // Fetch data on mount and when dependencies change
  useEffect(() => {
    fetchData();
  }, [fetchData, ...deps]);

  // Set up polling
  useEffect(() => {
    if (!isPolling || skip || pollCount >= maxPolls) return;

    const intervalId = setInterval(() => {
      fetchData();
    }, pollingInterval);

    return () => clearInterval(intervalId);
  }, [fetchData, isPolling, skip, pollingInterval, pollCount, maxPolls]);

  // Return the result
  return {
    data,
    isLoading,
    error,
    refetch: fetchData,
    stopPolling,
    startPolling,
  };
}
