import { useMemo } from 'react';

/**
 * Uses statically declared function in useMemo
 *
 * Memo is invalidated only on deps change, fn is ignored
 */
export function useStaticMemo<TFunction extends (...args: any[]) => any>(
  fn: TFunction,
  deps: Parameters<TFunction>,
): ReturnType<TFunction> {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo(() => fn(...deps), deps);
}
