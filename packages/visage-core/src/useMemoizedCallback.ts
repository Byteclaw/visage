import compare from 'fast-deep-equal-ts/react';
import { useRef } from 'react';

/**
 * Creates memoized callback that returns the last known result if args did not change
 */
export function useMemoizedCallback<T extends (...args: any[]) => any>(
  cb: T,
): T {
  const previousCbRef = useRef<T | null>(null);
  const memoizedResult = useRef<any>();
  const memoizedArgs = useRef<any[] | null>();
  const cbRef = useRef<T | null>(null);

  if (previousCbRef.current !== cb) {
    previousCbRef.current = cb;
    memoizedArgs.current = null;

    cbRef.current = ((...args: any[]): any => {
      if (
        memoizedArgs.current == null ||
        !compare(memoizedArgs.current, args)
      ) {
        memoizedArgs.current = args;
        memoizedResult.current = cb(...args);
      }

      return memoizedResult.current;
    }) as T;
  }

  return cbRef.current!;
}
