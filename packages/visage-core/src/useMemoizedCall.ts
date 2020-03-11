import compare from 'fast-deep-equal-ts/react';
import { useRef } from 'react';
import { ExtractArgs, ExtractReturn } from './types';

/**
 * Uses memoizes call and returns the result
 * Refreshes if args or callback has changed
 */
export function useMemoizedCall<T extends (...args: any[]) => any>(
  cb: T,
  ...args: ExtractArgs<T>
): ExtractReturn<T> {
  const cbRef = useRef<T>(cb);
  const previousArgsRef = useRef<ExtractArgs<T> | undefined>(undefined);
  const resultRef = useRef<ExtractReturn<T> | undefined>(undefined);

  if (
    cbRef.current !== cb ||
    previousArgsRef.current == null ||
    !compare(previousArgsRef.current, args)
  ) {
    cbRef.current = cb;
    previousArgsRef.current = args;
    // first call
    resultRef.current = cb(...args);
  }

  // @ts-ignore
  return resultRef.current;
}
