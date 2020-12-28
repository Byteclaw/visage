import { useMemo } from 'react';
import { ExtractArgs, ExtractReturn } from './types';

/**
 * Uses statically declared function in useMemo
 *
 * Memo is invalidated only on deps change, fn is ignored
 */
export function useStaticMemo<TFunction extends (...args: any[]) => any>(
  fn: TFunction,
  deps: ExtractArgs<TFunction>,
): ExtractReturn<TFunction> {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo(() => fn(...deps), deps);
}
