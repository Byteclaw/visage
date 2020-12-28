import { ExtractArgs } from '@byteclaw/visage-core';
import { useEffect } from 'react';

/**
 * Creates a static effect that is called with provided args
 */
export function useStaticEffect<T extends (...effectArgs: any[]) => void>(
  effectFn: T,
  ...args: ExtractArgs<T>
): void {
  useEffect(() => {
    return effectFn(...args);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [effectFn, ...args]);
}
