import { useEffect, useMemo } from 'react';

/**
 * Works similarly as useEffect except it runs effect before children are rendered
 * And then cleans them up in same order as useEffect works
 *
 * So basically mount works from parent to child and unmount in opposite order
 *
 * Effect is not invalidated on function change
 */
export function useOnRenderEffect(
  effect: () => void | (() => void),
  dependencies?: any[],
): void {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const unregister = useMemo(effect, dependencies);

  useEffect(() => unregister, [unregister]);
}

/**
 * Works similarly as useEffect except it runs effect before children are rendered
 * And then cleans them up in same order as useEffect works
 *
 * So basically mount works from parent to child and unmount in opposite order
 */
export function useStaticOnRenderEffect<
  T extends (...effectArgs: any[]) => void | (() => void)
>(effect: T, ...args: Parameters<T>): void {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const unregister = useMemo(() => effect(...args), [effect, ...args]);

  useEffect(() => unregister, [unregister]);
}
