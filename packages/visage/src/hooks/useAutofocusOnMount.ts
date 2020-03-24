import { RefObject } from 'react';
import { useStaticEffect } from './useStaticEffect';

function focusElementOnMount(
  elementToFocusRef:
    | null
    | undefined
    | React.RefObject<HTMLElement | null | undefined>,
) {
  if (elementToFocusRef && elementToFocusRef.current) {
    elementToFocusRef.current.focus();
  }
}

/**
 * Autofocuses element on mount
 */
export function useAutofocusOnMount(ref?: null | RefObject<HTMLElement>) {
  useStaticEffect(focusElementOnMount, ref);
}
