import { ExtractArgs } from '@byteclaw/visage-core';
import { useEffect } from 'react';

/**
 * Creates a static effect that is called with provided args
 */
export function useStaticEffect<T extends (...args: any[]) => void>(
  effectFn: T,
  ...args: ExtractArgs<T>
) {
  return useEffect(() => {
    return effectFn(...args);
  }, [effectFn, ...args]);
}
