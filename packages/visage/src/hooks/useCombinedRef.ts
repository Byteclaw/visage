/* eslint-disable no-param-reassign */
import { useEffect, useRef, Ref, MutableRefObject } from 'react';

/**
 * Reflects local ref to outside one
 */
export function useCombinedRef<T>(
  outsideRef?: Ref<T>,
): MutableRefObject<T | null> {
  const ref = useRef<T | null>(null);

  // use ref.current in dependencies otherwise it won't propagate ref to outside ref
  useEffect(() => {
    if (outsideRef) {
      if (typeof outsideRef === 'function') {
        outsideRef(ref.current);
      } else {
        // @ts-ignore - wrong typings? current is readonly
        outsideRef.current = ref.current;
      }
    }
  }, [ref.current]);

  return ref;
}
