import { useCallback, useEffect, useRef } from 'react';

export function useDebouncedCallback<T extends (...args: any[]) => any>(
  callback: T,
  delay: number,
  deps: any[],
): [T, Function] {
  const currentTimeout = useRef<any>();
  const cancel = useCallback(() => {
    clearTimeout(currentTimeout.current);
  }, []);

  // cancel timeout if unmounted
  useEffect(() => {
    return () => {
      clearTimeout(currentTimeout.current);
    };
  }, []);

  const debouncedCallback = useCallback(
    (...args: any) => {
      clearTimeout(currentTimeout.current);

      currentTimeout.current = setTimeout(callback, delay, ...args);
    },
    [delay, ...deps],
  );

  return [debouncedCallback as T, cancel];
}
