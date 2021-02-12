import { useEffect } from 'react';

/**
 * Creates a static effect that is called with provided args
 */
export function useStaticEffect<T extends (...effectArgs: any[]) => void>(
  effectFn: T,
  ...args: Parameters<T>
): void {
  useEffect(() => {
    return effectFn(...args);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [effectFn, ...args]);
}
