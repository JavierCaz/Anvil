import { useCallback, useEffect, useRef, useState } from 'react';
import type { DependencyList, Dispatch, SetStateAction } from 'react';
import { useFocusEffect } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import type { SQLiteDatabase } from 'expo-sqlite';

export interface UseFocusQueryResult<T> {
  data: T | null;
  /** True once the first run settles - success or failure - so spinners always clear. */
  loaded: boolean;
  error: unknown | null;
  reload: () => void;
  setData: Dispatch<SetStateAction<T | null>>;
}

export interface UseFocusQueryOptions {
  refetchOnFocus: boolean;
}

/**
 * Loads SQLite data into local state: refetch on focus or on `deps` change,
 * preserving `data` across refetches and surfacing `error` to the caller.
 */
export function useFocusQuery<T>(
  fn: (db: SQLiteDatabase) => Promise<T>,
  deps: DependencyList,
  options: UseFocusQueryOptions
): UseFocusQueryResult<T> {
  const db = useSQLiteContext();
  const [data, setData] = useState<T | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState<unknown | null>(null);

  const fnRef = useRef(fn);
  useEffect(() => {
    fnRef.current = fn;
  });

  const run = useCallback((): (() => void) => {
    let active = true;
    setError(null);
    void fnRef.current(db)
      .then((result) => {
        if (active) {
          setData(result);
          setLoaded(true);
        }
      })
      .catch((cause: unknown) => {
        if (active) {
          setError(cause);
          setLoaded(true);
        }
      });
    return () => {
      active = false;
    };
    // `deps` is caller-supplied, so exhaustive-deps cannot verify it; this
    // disable also covers the omitted `db` (stable provider singleton) and `fnRef`.
    // eslint-disable-next-line react-hooks/exhaustive-deps, react-hooks/use-memo
  }, deps);

  useFocusEffect(
    useCallback(() => {
      if (!options.refetchOnFocus) {
        return;
      }
      return run();
    }, [run, options.refetchOnFocus])
  );

  useEffect(() => {
    if (options.refetchOnFocus) {
      return;
    }
    return run();
  }, [run, options.refetchOnFocus]);

  return { data, loaded, error, reload: run, setData };
}
