import { useState } from "react";

type UseFetchCallback<T, Args extends unknown[]> = (
  ...args: Args
) => Promise<T>;

const useFetch = <T, Args extends unknown[]>(cb: UseFetchCallback<T, Args>) => {
  const [data, setData] = useState<T | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<unknown | null>(null);

  const fn = async (...args: Args) => {
    setLoading(true);
    setError(null);

    try {
      const response = await cb(...args);
      setData(response);
      setError(null);
    } catch (error: unknown) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, fn };
};

export default useFetch;
