import { useCallback, useEffect, useRef } from 'react';

export function useDebouncedCallback<T extends (...args: any[]) => any>(
  callback: T,
  delay: number,
  deps: any[],
): [T, () => void] {
  const callbackRef = useRef<T | null>(null);
  const currentTimeout = useRef<any>();
  const cancel = useCallback(() => {
    clearTimeout(currentTimeout.current);
  }, []);

  callbackRef.current = callback;

  // cancel timeout if unmounted
  useEffect(() => {
    return () => {
      clearTimeout(currentTimeout.current);
    };
  }, []);

  const debouncedCallback = useCallback(
    (...args: any) => {
      clearTimeout(currentTimeout.current);

      currentTimeout.current = setTimeout(
        (...currentArgs: any[]) => {
          if (callbackRef.current) {
            callbackRef.current(...currentArgs);
          }
        },
        delay,
        ...args,
      );
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [delay, ...deps],
  );

  return [debouncedCallback as T, cancel];
}
