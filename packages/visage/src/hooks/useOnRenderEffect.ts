import { useEffect, useMemo } from 'react';
import { ExtractArgs } from '@byteclaw/visage-core';

/**
 * Works similarly as useEffect except it runs effect before children are rendered
 * And then cleans them up in same order as useEffect works
 *
 * So basically mount works from parent to child and unmount in opposite order
 */
export function useOnRenderEffect(
  effect: () => void | (() => void),
  dependencies?: any[],
) {
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
  T extends (...args: any[]) => void | (() => void)
>(effect: T, ...args: ExtractArgs<T>) {
  const unregister = useMemo(() => effect(...args), [effect, ...args]);

  useEffect(() => unregister, [unregister]);
}
