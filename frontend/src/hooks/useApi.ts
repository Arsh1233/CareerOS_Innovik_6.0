import { useState, useCallback } from 'react';

type ApiFunction<T> = (...args: any[]) => Promise<T>;

export function useApi<T>(apiFunc: ApiFunction<T>) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const request = useCallback(
    async (...args: any[]) => {
      setLoading(true);
      setError(null);
      try {
        const result = await apiFunc(...args);
        setData(result);
        return result;
      } catch (err: any) {
        setError(err.message || 'An unexpected error occurred');
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [apiFunc]
  );

  return {
    data,
    error,
    loading,
    request,
    setData, // In case we need optimistic updates
  };
}
