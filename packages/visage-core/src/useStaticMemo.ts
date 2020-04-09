import { useMemo } from 'react';
import { ExtractArgs, ExtractReturn } from './types';

/**
 * Uses statically declared function in useMemo
 */
export function useStaticMemo<TFunction extends (...args: any[]) => any>(
  fn: TFunction,
  deps: ExtractArgs<TFunction>,
): ExtractReturn<TFunction> {
  return useMemo(() => fn(...deps), deps);
}
