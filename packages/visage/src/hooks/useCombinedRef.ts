/* eslint-disable no-param-reassign */
import { RefCallback, Ref, MutableRefObject } from 'react';

/**
 * Reflects local ref to outside one
 */
export function useCombinedRef<T>(
  ...refs: (Ref<T> | null | undefined)[]
): RefCallback<T> {
  return (element: T) => {
    for (const ref of refs) {
      if (typeof ref === 'function') {
        ref(element);
      } else if (ref && typeof ref === 'object') {
        (ref as MutableRefObject<T>).current = element;
      }
    }
  };
}
