import { useCallback, useRef } from 'react';

/**
 * Creates an immutable handler that delegates a call to callback
 */
export function useHandlerRef<T extends (...args: any[]) => any>(cb: T): T {
  const cbRef = useRef<T>(cb);

  cbRef.current = cb;

  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useCallback<T>(((...args: any[]) => cbRef.current(...args)) as T, []);
}
